/**
 * DropdownAdapter - Manages dropdown display and positioning
 * Coordinates dropdown opening, closing, and positioning
 */

import BaseAdapter from "./BaseAdapter.js";
import Dropdown from "../components/Dropdown.js";
import SearchBox from "../components/SearchBox.js";
import { EVENTS } from "../constants/events.js";
import { debounce } from "../utils/debounce.js";

class DropdownAdapter extends BaseAdapter {
  constructor(instance, options) {
    super(instance, options);

    this.dropdown = new Dropdown(options);
    this.searchBox = null;
    this.anchorElement = null;
    this._justOpened = false; // Flag to prevent immediate close on programmatic open

    // Store event handler references for proper cleanup
    // Bind handlers once in constructor to maintain same reference
    this._boundHandleOutsideClick = this._handleOutsideClick.bind(this);
    this._boundHandleResize = this._handleResize.bind(this);
    this._boundHandleScroll = this._handleScroll.bind(this);
    this._inputHandler = null;
    this._searchClickHandler = null;
  }

  /**
   * Bind the adapter
   * @param {HTMLElement} container - Main container
   * @param {HTMLElement} anchor - Anchor element (selection container)
   */
  bind(container, anchor) {
    super.bind(container);
    this.anchorElement = anchor;

    // Render dropdown and append to body (for proper positioning)
    const dropdownElement = this.dropdown.render();

    // Add search box if searchable
    const searchable = this.options.get("searchable");
    if (searchable) {
      this.searchBox = new SearchBox(this.options);
      const searchBoxElement = this.searchBox.render();
      dropdownElement.insertBefore(
        searchBoxElement,
        dropdownElement.firstChild,
      );
    }

    // Determine where to append dropdown
    // If inside a modal, append to modal (like Select2's dropdownParent)
    // This keeps the dropdown within Bootstrap's focus trap
    const modalElement = this._findModalParent();
    if (modalElement) {
      modalElement.appendChild(dropdownElement);
      this.dropdown.setPositionContext("modal", modalElement);
    } else {
      document.body.appendChild(dropdownElement);
      this.dropdown.setPositionContext("body", null);
    }

    // Bind events
    this._bindEvents();
  }

  /**
   * Find the closest modal parent element
   * @returns {HTMLElement|null} Modal element or null
   * @private
   */
  _findModalParent() {
    if (!this.container) return null;

    let element = this.container;
    while (element && element !== document.body) {
      // Bootstrap modal
      if (element.classList && element.classList.contains("modal")) {
        return element;
      }
      // Generic dialog
      if (
        element.hasAttribute("role") &&
        element.getAttribute("role") === "dialog"
      ) {
        return element;
      }
      element = element.parentElement;
    }

    return null;
  }

  /**
   * Bind event listeners
   * @private
   */
  _bindEvents() {
    // Listen to open/close events
    this.instance.on(EVENTS.OPENING, () => {
      this.open();
    });

    this.instance.on(EVENTS.CLOSING, () => {
      this.close();
    });

    // SearchBox events
    if (this.searchBox) {
      const input = this.searchBox.getInput();

      // Check if AJAX is configured
      const ajaxConfig = this.options.get("ajax");
      const searchDelay = ajaxConfig
        ? ajaxConfig.delay || 250
        : this.options.get("searchDelay") || 0;

      // Create query handler (with debounce for AJAX)
      const handleQuery = (term) => {
        this.instance.emit(EVENTS.QUERY, { term });
      };

      // Use debounce for AJAX queries, immediate for local filtering
      const queryHandler =
        searchDelay > 0 ? debounce(handleQuery, searchDelay) : handleQuery;

      // Emit query event on input - store handler reference for cleanup
      this._inputHandler = (e) => {
        const term = e.target.value;
        queryHandler(term);
      };
      input.addEventListener("input", this._inputHandler);

      // Prevent dropdown close on search input click - store handler reference for cleanup
      this._searchClickHandler = (e) => {
        e.stopPropagation();
      };
      input.addEventListener("click", this._searchClickHandler);
    }

    // Close on outside click - use bound reference for proper cleanup
    document.addEventListener("click", this._boundHandleOutsideClick);

    // Reposition on scroll/resize - use bound references for proper cleanup
    window.addEventListener("resize", this._boundHandleResize);
    window.addEventListener("scroll", this._boundHandleScroll, true);
  }

  /**
   * Handle outside clicks
   * @param {Event} e - Click event
   * @private
   */
  _handleOutsideClick(e) {
    if (!this.dropdown.isOpen) return;

    // Ignore clicks that happened in the same event loop as opening
    // This prevents programmatic open() from being immediately closed
    if (this._justOpened) {
      return;
    }

    const dropdownEl = this.dropdown.getContainer();
    const isClickInside =
      this.container.contains(e.target) || dropdownEl.contains(e.target);

    if (!isClickInside) {
      this.instance.close();
    }
  }

  /**
   * Handle window resize
   * @private
   */
  _handleResize() {
    if (this.dropdown.isOpen) {
      this.dropdown.position(this.anchorElement);
    }
  }

  /**
   * Handle scroll
   * @private
   */
  _handleScroll() {
    if (this.dropdown.isOpen) {
      this.dropdown.position(this.anchorElement);
    }
  }

  /**
   * Open the dropdown
   */
  open() {
    this.dropdown.open();
    this.dropdown.position(this.anchorElement);

    // Set flag to prevent immediate close from the same click event
    this._justOpened = true;
    setTimeout(() => {
      this._justOpened = false;
    }, 50);

    // Focus search box if available
    if (this.searchBox) {
      setTimeout(() => {
        this.searchBox.focus();
      }, 10);
    }

    // Update ARIA
    if (this.anchorElement) {
      this.anchorElement.setAttribute("aria-expanded", "true");
    }
  }

  /**
   * Close the dropdown
   */
  close() {
    // Close dropdown
    this.dropdown.close();

    // Clear search box
    if (this.searchBox) {
      this.searchBox.clear();
      // Re-query to show all results next time
      this.instance.emit(EVENTS.QUERY, { term: "" });
    }

    // Update ARIA and restore focus
    if (this.anchorElement) {
      this.anchorElement.setAttribute("aria-expanded", "false");

      // Always return focus to selection element when dropdown closes
      // This ensures consistent behavior between mouse and keyboard interactions
      // and allows Tab key to navigate to the next form field correctly
      this.anchorElement.focus();
    }
  }

  /**
   * Check if dropdown is open
   * @returns {boolean} Is open
   */
  isOpen() {
    return this.dropdown.isOpen;
  }

  /**
   * Get dropdown container
   * @returns {HTMLElement} Dropdown container
   */
  getContainer() {
    return this.dropdown.getContainer();
  }

  /**
   * Update components with new options (e.g., language changes)
   */
  update() {
    if (this.searchBox) {
      this.searchBox.update();
    }
  }

  /**
   * Destroy the adapter
   */
  destroy() {
    // Properly remove event listeners to prevent memory leaks
    // Use the same bound references that were used in addEventListener
    document.removeEventListener("click", this._boundHandleOutsideClick);
    window.removeEventListener("resize", this._boundHandleResize);
    window.removeEventListener("scroll", this._boundHandleScroll, true);

    // Remove searchBox event listeners if they exist
    if (this.searchBox) {
      const input = this.searchBox.getInput();
      if (input) {
        if (this._inputHandler) {
          input.removeEventListener("input", this._inputHandler);
          this._inputHandler = null;
        }
        if (this._searchClickHandler) {
          input.removeEventListener("click", this._searchClickHandler);
          this._searchClickHandler = null;
        }
      }
    }

    // Clear bound references
    this._boundHandleOutsideClick = null;
    this._boundHandleResize = null;
    this._boundHandleScroll = null;

    this.dropdown.destroy();
  }
}

export default DropdownAdapter;
