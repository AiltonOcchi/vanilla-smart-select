/**
 * ResultsAdapter - Manages results display
 * Coordinates results rendering and selection
 */

import BaseAdapter from "./BaseAdapter.js";
import ResultsList from "../components/ResultsList.js";
import SearchManager from "../managers/SearchManager.js";
import { EVENTS } from "../constants/events.js";

class ResultsAdapter extends BaseAdapter {
  constructor(instance, options) {
    super(instance, options);

    this.results = new ResultsList(options);
    this.searchManager = new SearchManager(options);
    this.dataAdapter = null;
    this.dropdownAdapter = null;
    this.ajaxAdapter = null;
    this.currentSearchTerm = "";
    this.currentPage = 1;
    this.hasMore = false;
    this.isLoadingMore = false;
    this.accumulatedResults = [];
    this.currentSearchToken = null; // Token to prevent race conditions

    // Store timeout references for proper cleanup
    this._loadMoreTimeout = null;
    this._limitMessageTimeout = null;
    this._errorMessageTimeout = null;

    // Store event handler references for proper cleanup
    this._clickHandler = null;
    this._mouseoverHandler = null;
    this._scrollHandler = null;
    this.resultsContainer = null;
  }

  /**
   * Bind the adapter
   * @param {HTMLElement} dropdownContainer - Dropdown container
   * @param {DataAdapter} dataAdapter - Data adapter
   * @param {DropdownAdapter} dropdownAdapter - Dropdown adapter
   * @param {AjaxAdapter} ajaxAdapter - Optional AJAX adapter
   */
  bind(dropdownContainer, dataAdapter, dropdownAdapter, ajaxAdapter = null) {
    this.dataAdapter = dataAdapter;
    this.dropdownAdapter = dropdownAdapter;
    this.ajaxAdapter = ajaxAdapter;

    // Render results component
    const resultsElement = this.results.render();
    dropdownContainer.appendChild(resultsElement);

    // Bind events
    this._bindEvents();

    // Initial render
    this.update();
  }

  /**
   * Bind event listeners
   * @private
   */
  _bindEvents() {
    const resultsContainer = this.results.getContainer();
    this.resultsContainer = resultsContainer;

    // Listen to AJAX events
    this.instance.on(EVENTS.AJAX_LOADING, () => {
      this.showLoading();
    });

    this.instance.on(EVENTS.AJAX_SUCCESS, () => {
      this.hideLoading();
    });

    this.instance.on(EVENTS.AJAX_ERROR, (data) => {
      this.hideLoading();
      this.showError(data.error);
    });

    // Click on result item - store handler reference for cleanup
    this._clickHandler = (e) => {
      const resultEl = e.target.closest(".vs-result");
      if (!resultEl) return;

      const index = parseInt(resultEl.dataset.index, 10);
      const id = resultEl.dataset.id;

      // Don't select disabled items
      if (resultEl.classList.contains("vs-result--disabled")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Find the item (search recursively in groups)
      const allResults = this.dataAdapter.query({ term: "" });
      const item = this._findItemById(allResults, id);

      if (item) {
        // Prevent default to avoid any unwanted behavior
        e.preventDefault();
        e.stopPropagation();
        this.selectItem(item);
      }
    };
    resultsContainer.addEventListener("click", this._clickHandler);

    // Hover on result item - store handler reference for cleanup
    this._mouseoverHandler = (e) => {
      const resultEl = e.target.closest(".vs-result");
      if (!resultEl) return;

      const index = parseInt(resultEl.dataset.index, 10);
      this.results.highlight(index);
    };
    resultsContainer.addEventListener("mouseover", this._mouseoverHandler);

    // Listen to data changes
    this.instance.on(EVENTS.QUERY, (data) => {
      this.update(data.term);
    });

    this.instance.on(EVENTS.SELECT, () => {
      this.update();
    });

    this.instance.on(EVENTS.UNSELECT, () => {
      this.update();
    });

    // Listen to selection limit reached
    this.instance.on(EVENTS.SELECTION_LIMIT_REACHED, (data) => {
      this._showLimitMessage(data.message);
    });

    // Scroll detection for infinite scroll (AJAX only) - store handler reference for cleanup
    if (this.ajaxAdapter) {
      this._scrollHandler = () => {
        this._handleScroll();
      };
      resultsContainer.addEventListener("scroll", this._scrollHandler);
    }
  }

  /**
   * Update results display
   * @param {string} term - Search term
   */
  update(term = "") {
    if (!this.dataAdapter) return;

    // If AJAX adapter is configured, use it for remote data
    if (this.ajaxAdapter) {
      this._updateWithAjax(term);
    } else {
      this._updateWithLocalData(term);
    }
  }

  /**
   * Update results with local data (no AJAX)
   * @param {string} term - Search term
   * @private
   */
  _updateWithLocalData(term) {
    this.currentSearchTerm = term;

    // Get all data
    const allData = this.dataAdapter.query({ term: "" });

    // Filter using SearchManager
    let filteredResults = this.searchManager.search(allData, term);

    // Check if tagging is enabled
    const tagsEnabled = this.options.get("tags");

    // Add "create tag" option if enabled and term is not empty
    if (tagsEnabled && term && term.trim()) {
      const createTag = this.options.get("createTag");
      const tag = createTag({ term: term.trim() });

      if (tag) {
        // Check if tag already exists in results
        const tagExists = filteredResults.some(
          (item) =>
            String(item.id).toLowerCase() === String(tag.id).toLowerCase(),
        );

        if (!tagExists) {
          const insertTag = this.options.get("insertTag");
          // Create a copy to avoid mutating the original
          filteredResults = [...filteredResults];
          insertTag(filteredResults, tag);

          // Mark as tag for special rendering
          tag._isTag = true;
        }
      }
    }

    // Update results list
    this.results.update(filteredResults);

    // Auto-highlight first non-disabled item when there are results
    if (filteredResults && filteredResults.length > 0) {
      this._autoHighlightFirst(filteredResults);
    }

    // Emit results event for accessibility announcements
    this.instance.emit(EVENTS.RESULTS, { results: filteredResults });
  }

  /**
   * Update results with AJAX data
   * @param {string} term - Search term
   * @param {boolean} append - Whether to append results (pagination) or replace
   * @private
   */
  _updateWithAjax(term, append = false) {
    // Reset pagination if search term changed
    if (term !== this.currentSearchTerm) {
      this.currentPage = 1;
      this.accumulatedResults = [];
      append = false;
    }

    this.currentSearchTerm = term;

    // Generate unique token for this search to prevent race conditions
    // If a new search starts before this one completes, this token will be invalidated
    const searchToken = Symbol("search");
    this.currentSearchToken = searchToken;

    // Query AJAX adapter (returns a promise)
    this.ajaxAdapter
      .query({ term, page: this.currentPage })
      .then((response) => {
        // Check if this search is still valid (not superseded by a newer search)
        if (this.currentSearchToken !== searchToken) {
          // This search has been superseded - ignore results
          return;
        }

        const { results, pagination } = response;

        // Update pagination state
        this.hasMore = pagination && pagination.more ? true : false;

        // Accumulate or replace results
        if (append && this.currentPage > 1) {
          this.accumulatedResults = [...this.accumulatedResults, ...results];
        } else {
          this.accumulatedResults = results;
        }

        // Update DataAdapter with all accumulated results (for selection tracking)
        this.dataAdapter.setData(this.accumulatedResults);

        // Update results list
        this.results.update(this.accumulatedResults);

        // Auto-highlight first non-disabled item when there are results
        if (
          this.accumulatedResults &&
          this.accumulatedResults.length > 0 &&
          !append
        ) {
          this._autoHighlightFirst(this.accumulatedResults);
        }

        // Emit results event for accessibility announcements
        this.instance.emit(EVENTS.RESULTS, {
          results: this.accumulatedResults,
        });
      })
      .catch((error) => {
        // Check if this search is still valid before showing error
        if (this.currentSearchToken !== searchToken) {
          // This search has been superseded - ignore error
          return;
        }

        console.error("AJAX query error:", error);
        // On error, show empty results
        this.results.update([]);
        this.instance.emit(EVENTS.RESULTS, { results: [] });
      });
  }

  /**
   * Handle scroll event for infinite scroll
   * @private
   */
  _handleScroll() {
    if (!this.ajaxAdapter || !this.hasMore || this.isLoadingMore) {
      return;
    }

    const resultsContainer = this.results.getContainer();
    const scrollTop = resultsContainer.scrollTop;
    const scrollHeight = resultsContainer.scrollHeight;
    const clientHeight = resultsContainer.clientHeight;

    // Check if scrolled near bottom (within 50px)
    const threshold = 50;
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      this.loadMore();
    }
  }

  /**
   * Load more results (next page)
   */
  loadMore() {
    if (!this.ajaxAdapter || !this.hasMore || this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    this.currentPage++;

    // Show loading more indicator
    this.showLoadingMore();

    // Update with append=true to add to existing results
    this._updateWithAjax(this.currentSearchTerm, true);

    // Clear any existing timeout
    if (this._loadMoreTimeout) {
      clearTimeout(this._loadMoreTimeout);
    }

    // Hide loading more indicator when done
    this._loadMoreTimeout = setTimeout(() => {
      this.hideLoadingMore();
      this.isLoadingMore = false;
      this._loadMoreTimeout = null;
    }, 500);
  }

  /**
   * Show "loading more" indicator
   */
  showLoadingMore() {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    // Remove any existing indicator
    this.hideLoadingMore();

    const language = this.options.get("language");
    const loadingMoreMessage =
      language.loadingMore || "Loading more results...";

    const loadingMoreEl = document.createElement("div");
    loadingMoreEl.className = "vs-results__loading-more";
    loadingMoreEl.setAttribute("role", "status");
    loadingMoreEl.setAttribute("aria-live", "polite");
    loadingMoreEl.textContent = loadingMoreMessage;

    resultsContainer.appendChild(loadingMoreEl);
  }

  /**
   * Hide "loading more" indicator
   */
  hideLoadingMore() {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    const loadingMoreEl = resultsContainer.querySelector(
      ".vs-results__loading-more",
    );
    if (loadingMoreEl) {
      loadingMoreEl.remove();
    }
  }

  /**
   * Find item by ID, searching recursively in groups
   * @param {Array} items - Items to search
   * @param {string} id - Item ID to find
   * @returns {Object|null} Found item or null
   * @private
   */
  _findItemById(items, id) {
    for (const item of items) {
      // Check if this item matches (convert both to string for comparison)
      // This handles cases where item.id might be a number but dataset.id is always a string
      if (String(item.id) === String(id)) {
        return item;
      }

      // If it's a group, search in children
      if (item.children && Array.isArray(item.children)) {
        const found = this._findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  /**
   * Auto-highlight first non-disabled item
   * @param {Array} results - Filtered results
   * @private
   */
  _autoHighlightFirst(results) {
    // Find first non-disabled item
    for (let i = 0; i < results.length; i++) {
      const item = results[i];

      // Skip groups - look into children
      if (item.children && Array.isArray(item.children)) {
        // For groups, find first non-disabled child
        for (let j = 0; j < item.children.length; j++) {
          if (!item.children[j].disabled) {
            // Calculate the actual index in the flattened results
            const flatIndex = this._getFlatIndexForGroupChild(results, i, j);
            this.results.highlight(flatIndex);

            // Update ARIA activedescendant
            if (this.instance.accessibilityManager) {
              this.instance.accessibilityManager.updateActiveDescendant(
                flatIndex,
              );
            }
            return;
          }
        }
      } else {
        // Regular item - highlight if not disabled
        if (!item.disabled) {
          this.results.highlight(i);

          // Update ARIA activedescendant
          if (this.instance.accessibilityManager) {
            this.instance.accessibilityManager.updateActiveDescendant(i);
          }
          return;
        }
      }
    }
  }

  /**
   * Get flat index for a child within a group
   * @param {Array} results - All results
   * @param {number} groupIndex - Group index
   * @param {number} childIndex - Child index within group
   * @returns {number} Flat index
   * @private
   */
  _getFlatIndexForGroupChild(results, groupIndex, childIndex) {
    let flatIndex = 0;

    for (let i = 0; i < groupIndex; i++) {
      if (results[i].children) {
        flatIndex += results[i].children.length;
      } else {
        flatIndex++;
      }
    }

    flatIndex += childIndex;
    return flatIndex;
  }

  /**
   * Select an item
   * @param {Object} item - Item to select
   */
  selectItem(item) {
    if (!this.dataAdapter) return;

    // Try to select the item - returns false if limit reached or already selected
    const selectionSuccess = this.dataAdapter.select(item);

    const isMultiple = this.options.get("multiple");

    // For multi-select: always manage focus and UI, even if selection failed
    if (isMultiple) {
      // If selection failed (limit reached or already selected), still return focus
      if (!selectionSuccess) {
        // Re-focus search input so ESC and other keyboard controls work
        if (this.dropdownAdapter && this.dropdownAdapter.searchBox) {
          setTimeout(() => {
            this.dropdownAdapter.searchBox.focus();
          }, 10);
        }
        return;
      }

      // Selection was successful - proceed with normal flow
      // Clear search box
      if (this.dropdownAdapter && this.dropdownAdapter.searchBox) {
        this.dropdownAdapter.searchBox.clear();
      }

      // Refresh results to show all items again
      this.update("");

      // Re-focus search input for next selection
      if (this.dropdownAdapter && this.dropdownAdapter.searchBox) {
        setTimeout(() => {
          this.dropdownAdapter.searchBox.focus();
        }, 10);
      }
    } else {
      // Single select: only close if selection was successful
      if (selectionSuccess) {
        const closeOnSelect = this.options.get("closeOnSelect");
        if (closeOnSelect) {
          this.instance.close();
        }
      }
    }
  }

  /**
   * Clear results
   */
  clear() {
    this.results.clear();
  }

  /**
   * Show selection limit message
   * @param {string} message - Message to display
   * @private
   */
  _showLimitMessage(message) {
    const resultsContainer = this.results.getContainer();

    // Clear any existing timeout
    if (this._limitMessageTimeout) {
      clearTimeout(this._limitMessageTimeout);
      this._limitMessageTimeout = null;
    }

    // Remove any existing message
    const existingMessage = resultsContainer.querySelector(
      ".vs-results__limit-message",
    );
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement("div");
    messageEl.className = "vs-results__limit-message";
    messageEl.textContent = message;
    messageEl.setAttribute("role", "alert");

    // Insert at the top of results
    resultsContainer.insertBefore(messageEl, resultsContainer.firstChild);

    // Auto-remove after 3 seconds
    this._limitMessageTimeout = setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
      this._limitMessageTimeout = null;
    }, 3000);
  }

  /**
   * Show loading state
   */
  showLoading() {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    // Remove any existing loading message
    this.hideLoading();

    const language = this.options.get("language");
    const loadingMessage = language.loading || "Loading...";

    // Create loading element
    const loadingEl = document.createElement("div");
    loadingEl.className = "vs-results__loading";
    loadingEl.setAttribute("role", "status");
    loadingEl.setAttribute("aria-live", "polite");
    loadingEl.textContent = loadingMessage;

    resultsContainer.appendChild(loadingEl);
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    const loadingEl = resultsContainer.querySelector(".vs-results__loading");
    if (loadingEl) {
      loadingEl.remove();
    }
  }

  /**
   * Show error message
   * @param {Error} error - Error object
   */
  showError(error) {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    // Clear any existing timeout
    if (this._errorMessageTimeout) {
      clearTimeout(this._errorMessageTimeout);
      this._errorMessageTimeout = null;
    }

    // Remove any existing error message
    const existingError = resultsContainer.querySelector(".vs-results__error");
    if (existingError) {
      existingError.remove();
    }

    const language = this.options.get("language");
    const errorMessage =
      language.errorLoading || "The results could not be loaded";

    // Create error element
    const errorEl = document.createElement("div");
    errorEl.className = "vs-results__error";
    errorEl.setAttribute("role", "alert");
    errorEl.textContent = errorMessage;

    resultsContainer.appendChild(errorEl);

    // Auto-remove after 5 seconds
    this._errorMessageTimeout = setTimeout(() => {
      if (errorEl.parentNode) {
        errorEl.remove();
      }
      this._errorMessageTimeout = null;
    }, 5000);
  }

  /**
   * Destroy the adapter
   */
  destroy() {
    // Clear all pending timeouts to prevent memory leaks and errors
    if (this._loadMoreTimeout) {
      clearTimeout(this._loadMoreTimeout);
      this._loadMoreTimeout = null;
    }

    if (this._limitMessageTimeout) {
      clearTimeout(this._limitMessageTimeout);
      this._limitMessageTimeout = null;
    }

    if (this._errorMessageTimeout) {
      clearTimeout(this._errorMessageTimeout);
      this._errorMessageTimeout = null;
    }

    // Properly remove event listeners to prevent memory leaks
    if (this.resultsContainer) {
      if (this._clickHandler) {
        this.resultsContainer.removeEventListener("click", this._clickHandler);
        this._clickHandler = null;
      }

      if (this._mouseoverHandler) {
        this.resultsContainer.removeEventListener(
          "mouseover",
          this._mouseoverHandler,
        );
        this._mouseoverHandler = null;
      }

      if (this._scrollHandler) {
        this.resultsContainer.removeEventListener(
          "scroll",
          this._scrollHandler,
        );
        this._scrollHandler = null;
      }

      this.resultsContainer = null;
    }

    this.results.destroy();
  }
}

export default ResultsAdapter;
