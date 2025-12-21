/**
 * KeyboardManager - Manages keyboard navigation
 * Handles keyboard events for accessibility and navigation
 */

import { KEYS } from "../constants/keys.js";

class KeyboardManager {
  constructor(instance, options) {
    this.instance = instance;
    this.options = options;
    this.isEnabled = true;

    // Store event handler references for proper cleanup
    this._selectionKeydownHandler = null;
    this._searchKeydownHandler = null;
  }

  /**
   * Bind keyboard events
   * @param {HTMLElement} selectionElement - Selection container
   * @param {HTMLElement} searchInput - Search input (if searchable)
   * @param {Object} resultsAdapter - Results adapter
   */
  bind(selectionElement, searchInput, resultsAdapter) {
    this.selectionElement = selectionElement;
    this.searchInput = searchInput;
    this.resultsAdapter = resultsAdapter;

    // Bind events
    this._bindSelectionEvents();
    if (this.searchInput) {
      this._bindSearchEvents();
    }
  }

  /**
   * Bind keyboard events to selection element
   * @private
   */
  _bindSelectionEvents() {
    // Store handler reference for cleanup
    this._selectionKeydownHandler = (e) => {
      this._handleSelectionKeydown(e);
    };

    this.selectionElement.addEventListener(
      "keydown",
      this._selectionKeydownHandler,
    );
  }

  /**
   * Bind keyboard events to search input
   * @private
   */
  _bindSearchEvents() {
    // Store handler reference for cleanup
    this._searchKeydownHandler = (e) => {
      this._handleSearchKeydown(e);
    };

    this.searchInput.addEventListener("keydown", this._searchKeydownHandler);
  }

  /**
   * Handle keydown on selection element
   * @param {KeyboardEvent} e - Keyboard event
   * @private
   */
  _handleSelectionKeydown(e) {
    if (!this.isEnabled) return;

    const key = e.which || e.keyCode;

    switch (key) {
      case KEYS.ENTER:
      case KEYS.SPACE:
        // Open dropdown
        e.preventDefault();
        this.instance.toggle();
        break;

      case KEYS.ESC:
        // Close dropdown
        e.preventDefault();
        this.instance.close();
        break;

      case KEYS.UP:
      case KEYS.DOWN:
        // Open dropdown and navigate
        e.preventDefault();
        if (!this.instance.isOpen()) {
          this.instance.open();
        } else {
          this._navigate(key === KEYS.UP ? -1 : 1);
        }
        break;

      case KEYS.TAB:
        // Allow Tab to work normally on selection element
        // (It will only trigger when dropdown is closed)
        // When dropdown is open, focus is in search input, not here
        break;
    }
  }

  /**
   * Handle keydown on search input
   * @param {KeyboardEvent} e - Keyboard event
   * @private
   */
  _handleSearchKeydown(e) {
    if (!this.isEnabled) return;

    const key = e.which || e.keyCode;

    switch (key) {
      case KEYS.ENTER:
        // Select highlighted item
        e.preventDefault();
        this._selectHighlighted();
        break;

      case KEYS.ESC:
        // Close dropdown
        e.preventDefault();
        this.instance.close();
        break;

      case KEYS.UP:
        // Navigate up
        e.preventDefault();
        this._navigate(-1);
        break;

      case KEYS.DOWN:
        // Navigate down
        e.preventDefault();
        this._navigate(1);
        break;

      case KEYS.TAB:
        // Prevent Tab from leaving dropdown when open
        // User must explicitly close with Enter (select) or ESC (cancel)
        e.preventDefault();
        break;

      case KEYS.HOME:
        // First item
        e.preventDefault();
        this._navigateToFirst();
        break;

      case KEYS.END:
        // Last item
        e.preventDefault();
        this._navigateToLast();
        break;
    }
  }

  /**
   * Count total rendered items (including items in groups)
   * @param {Array} items - Results array (may contain groups)
   * @returns {number} Total count of rendered items
   * @private
   */
  _countTotalItems(items) {
    let count = 0;
    for (const item of items) {
      if (item.children && Array.isArray(item.children)) {
        count += item.children.length; // Count children, not the group itself
      } else {
        count++;
      }
    }
    return count;
  }

  /**
   * Navigate through results
   * @param {number} direction - Direction (-1 for up, 1 for down)
   * @private
   */
  _navigate(direction) {
    if (!this.resultsAdapter) return;

    const results = this.resultsAdapter.results;
    const currentIndex = results.highlightedIndex;
    const totalResults = this._countTotalItems(results.results);

    if (totalResults === 0) return;

    let newIndex = currentIndex + direction;

    // Wrap around
    if (newIndex < 0) {
      newIndex = totalResults - 1;
    } else if (newIndex >= totalResults) {
      newIndex = 0;
    }

    // Get flat list of rendered items for checking disabled state
    const renderedItems = this._getFlatRenderedItems(results.results);

    // Skip disabled items
    while (renderedItems[newIndex]?.disabled) {
      newIndex += direction;

      // Wrap around again if needed
      if (newIndex < 0) {
        newIndex = totalResults - 1;
      } else if (newIndex >= totalResults) {
        newIndex = 0;
      }

      // Prevent infinite loop if all items are disabled
      if (newIndex === currentIndex) {
        return;
      }
    }

    results.highlight(newIndex);

    // Update ARIA activedescendant for accessibility
    if (this.instance.accessibilityManager) {
      this.instance.accessibilityManager.updateActiveDescendant(newIndex);
    }
  }

  /**
   * Get flat list of rendered items (excluding group headers)
   * @param {Array} items - Results array (may contain groups)
   * @returns {Array} Flat array of items
   * @private
   */
  _getFlatRenderedItems(items) {
    const flat = [];
    for (const item of items) {
      if (item.children && Array.isArray(item.children)) {
        flat.push(...item.children); // Add children, not the group
      } else {
        flat.push(item);
      }
    }
    return flat;
  }

  /**
   * Navigate to first item
   * @private
   */
  _navigateToFirst() {
    if (!this.resultsAdapter) return;

    const results = this.resultsAdapter.results;
    const renderedItems = this._getFlatRenderedItems(results.results);
    const totalResults = renderedItems.length;

    if (totalResults === 0) return;

    // Find first non-disabled item
    for (let i = 0; i < totalResults; i++) {
      if (!renderedItems[i]?.disabled) {
        results.highlight(i);

        // Update ARIA activedescendant for accessibility
        if (this.instance.accessibilityManager) {
          this.instance.accessibilityManager.updateActiveDescendant(i);
        }
        break;
      }
    }
  }

  /**
   * Navigate to last item
   * @private
   */
  _navigateToLast() {
    if (!this.resultsAdapter) return;

    const results = this.resultsAdapter.results;
    const renderedItems = this._getFlatRenderedItems(results.results);
    const totalResults = renderedItems.length;

    if (totalResults === 0) return;

    // Find last non-disabled item
    for (let i = totalResults - 1; i >= 0; i--) {
      if (!renderedItems[i]?.disabled) {
        results.highlight(i);

        // Update ARIA activedescendant for accessibility
        if (this.instance.accessibilityManager) {
          this.instance.accessibilityManager.updateActiveDescendant(i);
        }
        break;
      }
    }
  }

  /**
   * Select currently highlighted item
   * @private
   */
  _selectHighlighted() {
    if (!this.resultsAdapter) return;

    const highlighted = this.resultsAdapter.results.getHighlighted();
    if (highlighted) {
      this.resultsAdapter.selectItem(highlighted);
    }
  }

  /**
   * Enable keyboard navigation
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disable keyboard navigation
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * Destroy the manager
   */
  destroy() {
    this.isEnabled = false;

    // Properly remove event listeners to prevent memory leaks
    if (this.selectionElement && this._selectionKeydownHandler) {
      this.selectionElement.removeEventListener(
        "keydown",
        this._selectionKeydownHandler,
      );
      this._selectionKeydownHandler = null;
    }

    if (this.searchInput && this._searchKeydownHandler) {
      this.searchInput.removeEventListener(
        "keydown",
        this._searchKeydownHandler,
      );
      this._searchKeydownHandler = null;
    }

    // Clear references
    this.selectionElement = null;
    this.searchInput = null;
    this.resultsAdapter = null;
  }
}

export default KeyboardManager;
