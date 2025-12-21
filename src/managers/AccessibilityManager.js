/**
 * AccessibilityManager - Manages ARIA attributes and screen reader support
 * Handles accessibility features for improved screen reader experience
 */

class AccessibilityManager {
  constructor(instance, options) {
    this.instance = instance;
    this.options = options;
    this.liveRegion = null;
  }

  /**
   * Initialize accessibility features
   * @param {HTMLElement} selectionElement - Selection container
   * @param {HTMLElement} dropdownElement - Dropdown container
   * @param {HTMLElement} resultsElement - Results container
   */
  bind(selectionElement, dropdownElement, resultsElement) {
    this.selectionElement = selectionElement;
    this.dropdownElement = dropdownElement;
    this.resultsElement = resultsElement;

    // Create live region for announcements
    this._createLiveRegion();

    // Setup ARIA attributes
    this._setupARIA();
  }

  /**
   * Create live region for screen reader announcements
   * @private
   */
  _createLiveRegion() {
    this.liveRegion = document.createElement("div");
    this.liveRegion.setAttribute("role", "status");
    this.liveRegion.setAttribute("aria-live", "polite");
    this.liveRegion.setAttribute("aria-atomic", "true");
    this.liveRegion.className = "vs-sr-only";
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Setup initial ARIA attributes
   * @private
   */
  _setupARIA() {
    if (!this.selectionElement || !this.dropdownElement || !this.resultsElement)
      return;

    // Generate unique IDs
    const baseId = `vs-${Math.random().toString(36).substr(2, 9)}`;
    const resultsId = `${baseId}-results`;

    // Set IDs
    this.resultsElement.setAttribute("id", resultsId);

    // Selection element ARIA
    this.selectionElement.setAttribute("role", "combobox");
    this.selectionElement.setAttribute("aria-haspopup", "listbox");
    this.selectionElement.setAttribute("aria-expanded", "false");
    this.selectionElement.setAttribute("aria-owns", resultsId);
    this.selectionElement.setAttribute("aria-controls", resultsId);

    // Dropdown ARIA
    this.dropdownElement.setAttribute("role", "region");
    const language = this.options.get("language");
    this.dropdownElement.setAttribute(
      "aria-label",
      language.selectOptions || "Select options",
    );

    // Results ARIA
    this.resultsElement.setAttribute("role", "listbox");
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   */
  announce(message) {
    if (!this.liveRegion) return;

    // Clear previous message
    this.liveRegion.textContent = "";

    // Set new message with a small delay to ensure screen reader picks it up
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Announce results count
   * @param {number} count - Number of results
   */
  announceResultsCount(count) {
    const language = this.options.get("language");

    if (count === 0) {
      this.announce(language.noResultsAvailable);
    } else if (count === 1) {
      this.announce(language.resultsAvailable?.one || "1 result available");
    } else {
      const message =
        typeof language.resultsAvailable?.other === "function"
          ? language.resultsAvailable.other({ count })
          : `${count} results available`;
      this.announce(message);
    }
  }

  /**
   * Announce selection
   * @param {Object} item - Selected item
   */
  announceSelection(item) {
    if (!item) return;

    const language = this.options.get("language");
    const message =
      typeof language.selected === "function"
        ? language.selected({ text: item.text })
        : `Selected: ${item.text}`;

    this.announce(message);
  }

  /**
   * Update aria-activedescendant when navigating
   * @param {number} index - Index of highlighted item
   */
  updateActiveDescendant(index) {
    if (!this.selectionElement || !this.resultsElement) return;

    const results = this.resultsElement.querySelectorAll(".vs-result");

    if (index >= 0 && index < results.length) {
      const activeItem = results[index];

      // Ensure item has an ID
      if (!activeItem.id) {
        activeItem.id = `vs-result-${index}`;
      }

      this.selectionElement.setAttribute(
        "aria-activedescendant",
        activeItem.id,
      );
    } else {
      this.selectionElement.removeAttribute("aria-activedescendant");
    }
  }

  /**
   * Update ARIA when dropdown opens
   */
  onOpen() {
    if (this.selectionElement) {
      this.selectionElement.setAttribute("aria-expanded", "true");
    }
  }

  /**
   * Update ARIA when dropdown closes
   */
  onClose() {
    if (this.selectionElement) {
      this.selectionElement.setAttribute("aria-expanded", "false");
      this.selectionElement.removeAttribute("aria-activedescendant");
    }
  }

  /**
   * Destroy the manager
   */
  destroy() {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
    this.liveRegion = null;
    this.selectionElement = null;
    this.dropdownElement = null;
    this.resultsElement = null;
  }
}

export default AccessibilityManager;
