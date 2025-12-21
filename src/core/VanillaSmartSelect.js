/**
 * VanillaSmartSelect - Main class and public API
 * Modern JavaScript dropdown enhancement without jQuery
 */

import EventEmitter from "./EventEmitter.js";
import Options from "./Options.js";
import { EVENTS } from "../constants/events.js";
import { querySelector } from "../utils/dom.js";
import DataAdapter from "../adapters/DataAdapter.js";
import AjaxAdapter from "../adapters/AjaxAdapter.js";
import SelectionAdapter from "../adapters/SelectionAdapter.js";
import DropdownAdapter from "../adapters/DropdownAdapter.js";
import ResultsAdapter from "../adapters/ResultsAdapter.js";
import KeyboardManager from "../managers/KeyboardManager.js";
import AccessibilityManager from "../managers/AccessibilityManager.js";

class VanillaSmartSelect extends EventEmitter {
  constructor(element, options = {}) {
    super();

    // Get the element
    this.element = this._getElement(element);
    if (!this.element) {
      throw new Error("Invalid element provided to VanillaSmartSelect");
    }

    // Hide original select to prevent FOUC (Flash of Unstyled Content)
    this.element.setAttribute("data-vs-initializing", "true");

    // Store reference to instance on element
    if (this.element._vanillaSmartSelect) {
      this.element._vanillaSmartSelect.destroy();
    }
    this.element._vanillaSmartSelect = this;

    // Initialize options
    this.options = new Options(options);

    // State
    this.isDisabled = false;
    this._isInitialized = false;

    // Containers (will be created during init)
    this.container = null;
    this.dropdown = null;

    // Adapters (will be initialized later)
    this.dataAdapter = null;
    this.ajaxAdapter = null;
    this.selectionAdapter = null;
    this.dropdownAdapter = null;
    this.resultsAdapter = null;

    // Managers (will be initialized later)
    this.keyboardManager = null;
    this.accessibilityManager = null;

    // Initialize
    this._init();
  }

  /**
   * Get HTML element from selector or element
   * @param {string|HTMLElement} element - Selector or element
   * @returns {HTMLElement|null} HTML element
   * @private
   */
  _getElement(element) {
    if (typeof element === "string") {
      return querySelector(element);
    }
    if (element instanceof HTMLElement) {
      return element;
    }
    return null;
  }

  /**
   * Initialize the select
   * @private
   */
  _init() {
    // Verify element is a select element
    if (this.element.tagName !== "SELECT") {
      throw new Error(
        "VanillaSmartSelect must be initialized on a <select> element",
      );
    }

    // Check if already initialized
    if (this._isInitialized) {
      return;
    }

    // Apply disabled state from element
    if (this.element.disabled) {
      this.options.set("disabled", true);
      this.isDisabled = true;
    }

    // Apply multiple state from element
    if (this.element.multiple) {
      this.options.set("multiple", true);
    }

    this._createContainers();
    this._initializeAdapters();
    this._initializeManagers();
    this._bindEvents();
    this._loadInitialData();

    // Mark as initialized
    this._isInitialized = true;

    // Remove initializing attribute - select is now fully transformed
    this.element.removeAttribute("data-vs-initializing");

    // Emit init event
    this.emit(EVENTS.INIT, { instance: this });
    this.trigger(this.element, EVENTS.INIT, { instance: this });

    // Call onInit callback if provided
    const onInit = this.options.get("onInit");
    if (typeof onInit === "function") {
      onInit.call(this);
    }
  }

  /**
   * Create container elements
   * @private
   */
  _createContainers() {
    // Create main container element
    this.container = document.createElement("div");
    this.container.className = `vs-container vs-container--${this.options.get("theme")}`;

    // Add custom CSS class if provided
    const customClass = this.options.get("containerCssClass");
    if (customClass) {
      this.container.className += ` ${customClass}`;
    }

    // Set width
    this.container.style.width = this.options.get("width");

    // Insert after original select
    this.element.parentNode.insertBefore(
      this.container,
      this.element.nextSibling,
    );

    // Hide original select
    this.element.style.display = "none";
    this.element.setAttribute("aria-hidden", "true");
  }

  /**
   * Initialize adapters
   * @private
   */
  _initializeAdapters() {
    // Initialize DataAdapter
    this.dataAdapter = new DataAdapter(this, this.options);
    this.dataAdapter.init();

    // Initialize AjaxAdapter if ajax option is configured
    const ajaxConfig = this.options.get("ajax");
    if (ajaxConfig) {
      this.ajaxAdapter = new AjaxAdapter(this, this.options, this.dataAdapter);
    }

    // Initialize SelectionAdapter
    this.selectionAdapter = new SelectionAdapter(this, this.options);
    this.selectionAdapter.bind(this.container, this.dataAdapter);

    // Get selection element AFTER binding (when it's rendered)
    const selectionElement = this.selectionAdapter.selection.getContainer();

    // Initialize DropdownAdapter
    this.dropdownAdapter = new DropdownAdapter(this, this.options);
    this.dropdownAdapter.bind(this.container, selectionElement);

    // Initialize ResultsAdapter
    this.resultsAdapter = new ResultsAdapter(this, this.options);
    const dropdownContainer = this.dropdownAdapter.getContainer();
    this.resultsAdapter.bind(
      dropdownContainer,
      this.dataAdapter,
      this.dropdownAdapter,
      this.ajaxAdapter,
    );
  }

  /**
   * Initialize managers
   * @private
   */
  _initializeManagers() {
    // Initialize KeyboardManager
    this.keyboardManager = new KeyboardManager(this, this.options);

    // Bind keyboard events
    const selectionElement = this.selectionAdapter.selection.getContainer();
    const searchInput = this.dropdownAdapter.searchBox?.getInput();
    this.keyboardManager.bind(
      selectionElement,
      searchInput,
      this.resultsAdapter,
    );

    // Initialize AccessibilityManager
    this.accessibilityManager = new AccessibilityManager(this, this.options);

    // Bind accessibility features
    const dropdownElement = this.dropdownAdapter.dropdown.getContainer();
    const resultsElement = this.resultsAdapter.results.getContainer();
    this.accessibilityManager.bind(
      selectionElement,
      dropdownElement,
      resultsElement,
    );
  }

  /**
   * Bind event listeners
   * @private
   */
  _bindEvents() {
    // Accessibility events
    this.on(EVENTS.OPENING, () => {
      if (this.accessibilityManager) {
        this.accessibilityManager.onOpen();
      }
    });

    this.on(EVENTS.CLOSING, () => {
      if (this.accessibilityManager) {
        this.accessibilityManager.onClose();
      }
    });

    this.on(EVENTS.SELECT, (data) => {
      if (this.accessibilityManager && data.data) {
        this.accessibilityManager.announceSelection(data.data);
      }
    });

    this.on(EVENTS.RESULTS, (data) => {
      if (this.accessibilityManager && data.results) {
        this.accessibilityManager.announceResultsCount(data.results.length);
      }
    });

    // HTML5 Validation events
    this.element.addEventListener("invalid", (e) => {
      this._onInvalid(e);
    });

    // Update validation state on change
    this.on(EVENTS.CHANGE, () => {
      this._updateValidationState();
    });
  }

  /**
   * Handle invalid event from native select
   * @param {Event} e - Invalid event
   * @private
   */
  _onInvalid(e) {
    // Prevent default browser behavior (trying to focus hidden element)
    e.preventDefault();

    if (this.container) {
      // Add invalid class for visual feedback
      this.container.classList.add("vs-container--invalid");

      // Focus on our custom selection element instead
      const selectionElement = this.container.querySelector(".vs-selection");
      if (selectionElement) {
        selectionElement.focus();
      }

      // Show validation message using custom container
      // (Browser can't show tooltip on hidden element)
      const validationMessage = this.element.validationMessage;
      if (validationMessage) {
        // Set custom title for tooltip on hover
        this.container.setAttribute("title", validationMessage);
      }
    }
  }

  /**
   * Update validation state (check and update visual state)
   * @private
   */
  _updateValidationState() {
    if (!this.container) return;

    const isValid = this.element.checkValidity();
    if (isValid) {
      this.container.classList.remove("vs-container--invalid");
      this.container.removeAttribute("title"); // Remove validation tooltip
    } else {
      this.container.classList.add("vs-container--invalid");
      // Set validation message as tooltip
      const validationMessage = this.element.validationMessage;
      if (validationMessage) {
        this.container.setAttribute("title", validationMessage);
      }
    }
  }

  /**
   * Load initial data from element or options
   * @private
   */
  _loadInitialData() {
    // Data is loaded in DataAdapter.init()
    // Just update the selection display
    if (this.selectionAdapter) {
      this.selectionAdapter.update();
    }
  }

  /**
   * PUBLIC API METHODS
   */

  /**
   * Get or set the current value
   * @param {string|string[]|null} value - Value to set (optional)
   * @returns {string|string[]|VanillaSmartSelect} Current value or this for chaining
   */
  val(value) {
    if (value === undefined) {
      // Get current value
      if (this.dataAdapter) {
        const current = this.dataAdapter.current();
        if (this.options.get("multiple")) {
          return current.map((item) => item.id);
        }
        return current.length > 0 ? current[0].id : null;
      }
      return this.element.value;
    }

    // Set value - use select() to properly update UI
    if (value === null || value === "") {
      // Clear selection
      return this.clear();
    }

    // For single select, use select() method
    if (!this.options.get("multiple")) {
      return this.select(value);
    }

    // For multiple select, handle array of values
    if (Array.isArray(value)) {
      this.clear(); // Clear first
      value.forEach((id) => this.select(id));
      return this;
    }

    // Single value for multiple select
    return this.select(value);
  }

  /**
   * Get or set data
   * @param {Array|null} data - Data array to set (optional)
   * @returns {Array|VanillaSmartSelect} Current data or this for chaining
   */
  data(data) {
    if (data === undefined) {
      // Get current data
      if (this.dataAdapter) {
        return this.dataAdapter.query({ term: "" });
      }
      return [];
    }

    // Set data
    if (this.dataAdapter) {
      this.dataAdapter.setData(data);
    }
    return this;
  }

  /**
   * Open the dropdown
   */
  open() {
    if (this.isDisabled || this.isOpen()) {
      return;
    }

    // Emit opening event (preventable)
    const openingAllowed = this.trigger(
      this.element,
      EVENTS.OPENING,
      {},
      { cancelable: true },
    );
    if (!openingAllowed) {
      return;
    }

    this.emit(EVENTS.OPENING);

    // Emit opened event
    this.emit(EVENTS.OPEN);
    this.trigger(this.element, EVENTS.OPEN);

    // Call onOpen callback
    const onOpen = this.options.get("onOpen");
    if (typeof onOpen === "function") {
      onOpen.call(this);
    }
  }

  /**
   * Close the dropdown
   */
  close() {
    if (!this.isOpen()) {
      return;
    }

    // Emit closing event (preventable)
    const closingAllowed = this.trigger(
      this.element,
      EVENTS.CLOSING,
      {},
      { cancelable: true },
    );
    if (!closingAllowed) {
      return;
    }

    this.emit(EVENTS.CLOSING);

    // Emit closed event
    this.emit(EVENTS.CLOSE);
    this.trigger(this.element, EVENTS.CLOSE);

    // Call onClose callback
    const onClose = this.options.get("onClose");
    if (typeof onClose === "function") {
      onClose.call(this);
    }
  }

  /**
   * Toggle dropdown open/closed
   */
  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Enable the select
   */
  enable() {
    if (!this.isDisabled) {
      return;
    }

    this.isDisabled = false;
    this.element.disabled = false;
    this.options.set("disabled", false);

    if (this.container) {
      this.container.classList.remove("vs-container--disabled");
    }
  }

  /**
   * Disable the select
   */
  disable() {
    if (this.isDisabled) {
      return;
    }

    this.isDisabled = true;
    this.element.disabled = true;
    this.options.set("disabled", true);

    if (this.container) {
      this.container.classList.add("vs-container--disabled");
    }

    // Close if open
    if (this.isOpen()) {
      this.close();
    }
  }

  /**
   * Check if dropdown is open
   * @returns {boolean} Whether dropdown is open
   */
  isOpen() {
    return this.dropdownAdapter ? this.dropdownAdapter.isOpen() : false;
  }

  /**
   * Clear the current selection
   * @returns {VanillaSmartSelect} this for chaining
   */
  clear() {
    if (!this.dataAdapter) {
      return this;
    }

    // Emit clearing event (preventable)
    const clearingAllowed = this.trigger(
      this.element,
      EVENTS.CLEARING,
      {},
      { cancelable: true },
    );

    if (!clearingAllowed) {
      return this;
    }

    this.emit(EVENTS.CLEARING);

    // Clear all selections using DataAdapter
    this.dataAdapter.clear();

    // Emit clear event (for adapters to update UI)
    this.emit(EVENTS.CLEAR);
    this.trigger(this.element, EVENTS.CLEAR);

    // Call onClear callback
    const onClear = this.options.get("onClear");
    if (typeof onClear === "function") {
      onClear.call(this);
    }

    return this;
  }

  /**
   * Focus the select
   */
  focus() {
    if (this.container) {
      const focusTarget = this.container.querySelector(".vs-selection");
      if (focusTarget) {
        focusTarget.focus();
      }
    }
  }

  /**
   * Select an item by ID (programmatically)
   * @param {string|number} id - Item ID to select
   * @returns {VanillaSmartSelect} this for chaining
   */
  select(id) {
    if (!this.dataAdapter) {
      return this;
    }

    // Find item by ID in data
    const allData = this.dataAdapter.query({ term: "" });
    const item = this._findItemById(allData, id);

    if (item && !item.disabled) {
      this.dataAdapter.select(item);
    }

    return this;
  }

  /**
   * Unselect an item by ID (multi-select only)
   * @param {string|number} id - Item ID to unselect
   * @returns {VanillaSmartSelect} this for chaining
   */
  unselect(id) {
    if (!this.dataAdapter) {
      return this;
    }

    const isMultiple = this.options.get("multiple");
    if (!isMultiple) {
      console.warn("unselect() only works with multiple select");
      return this;
    }

    // Find item in current selection
    const current = this.dataAdapter.current();
    const item = current.find((i) => i.id === id);

    if (item) {
      this.dataAdapter.unselect(item);
    }

    return this;
  }

  /**
   * Get selected item(s) with full data
   * @returns {Object|Object[]|null} Selected item(s) or null
   */
  getSelected() {
    if (!this.dataAdapter) {
      return null;
    }

    const current = this.dataAdapter.current();
    const isMultiple = this.options.get("multiple");

    if (isMultiple) {
      return current; // Array of selected items
    }

    return current.length > 0 ? current[0] : null; // Single item or null
  }

  /**
   * Add a new option dynamically
   * @param {Object} option - Option data {id, text, disabled?, selected?}
   * @returns {VanillaSmartSelect} this for chaining
   */
  addOption(option) {
    if (!this.dataAdapter || !option) {
      return this;
    }

    // Get current data
    const currentData = this.dataAdapter.query({ term: "" });

    // Add new option
    currentData.push(option);

    // Update data
    this.dataAdapter.setData(currentData);

    // Update results if dropdown is open
    if (this.resultsAdapter) {
      this.resultsAdapter.update();
    }

    return this;
  }

  /**
   * Remove an option by ID
   * @param {string|number} id - Option ID to remove
   * @returns {VanillaSmartSelect} this for chaining
   */
  removeOption(id) {
    if (!this.dataAdapter) {
      return this;
    }

    // Get current data
    let currentData = this.dataAdapter.query({ term: "" });

    // Remove item recursively (supports groups)
    currentData = this._removeItemById(currentData, id);

    // Update data
    this.dataAdapter.setData(currentData);

    // Update results if dropdown is open
    if (this.resultsAdapter) {
      this.resultsAdapter.update();
    }

    return this;
  }

  /**
   * Helper: Find item by ID recursively (supports groups)
   * @param {Array} items - Items to search
   * @param {string|number} id - Item ID
   * @returns {Object|null} Found item or null
   * @private
   */
  _findItemById(items, id) {
    for (const item of items) {
      // Convert both to string for comparison to handle string/number safely
      // This avoids issues with loose equality (e.g., "0" == 0 → true, but 0 == "" → false)
      if (String(item.id) === String(id)) {
        return item;
      }

      // Search in children (groups)
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
   * Helper: Remove item by ID recursively (supports groups)
   * @param {Array} items - Items array
   * @param {string|number} id - Item ID to remove
   * @returns {Array} Filtered items
   * @private
   */
  _removeItemById(items, id) {
    return items.filter((item) => {
      // Remove if matches ID
      if (item.id == id) {
        return false;
      }

      // Filter children (groups)
      if (item.children && Array.isArray(item.children)) {
        item.children = this._removeItemById(item.children, id);
      }

      return true;
    });
  }

  /**
   * Check if the current selection is valid (HTML5 validation)
   * @returns {boolean} True if valid
   */
  checkValidity() {
    return this.element.checkValidity();
  }

  /**
   * Report validity (HTML5 validation) - shows browser validation message
   * @returns {boolean} True if valid
   */
  reportValidity() {
    return this.element.reportValidity();
  }

  /**
   * Set custom validity message (HTML5 validation)
   * @param {string} message - Validation message (empty string to clear)
   * @returns {VanillaSmartSelect} this for chaining
   */
  setCustomValidity(message) {
    this.element.setCustomValidity(message);
    return this;
  }

  /**
   * Get the validation message
   * @returns {string} Validation message
   */
  validationMessage() {
    return this.element.validationMessage;
  }

  /**
   * Check if the select will be validated
   * @returns {boolean} True if will validate
   */
  willValidate() {
    return this.element.willValidate;
  }

  /**
   * Update the language dynamically
   * @param {Object} language - Language object (use getLanguage('pt-BR') to get language object)
   * @returns {VanillaSmartSelect} this for chaining
   * @example
   * import { getLanguage } from './i18n/index.js';
   * select.updateLanguage(getLanguage('pt-BR'));
   */
  updateLanguage(language) {
    if (!language || typeof language !== "object") {
      console.warn(
        'updateLanguage expects a language object. Use getLanguage("code") to get one.',
      );
      return this;
    }

    // Update language option
    this.options.set("language", language);

    // Update all components that display language-dependent text
    if (
      this.dropdownAdapter &&
      typeof this.dropdownAdapter.update === "function"
    ) {
      this.dropdownAdapter.update();
    }

    if (
      this.selectionAdapter &&
      typeof this.selectionAdapter.update === "function"
    ) {
      this.selectionAdapter.update();
    }

    return this;
  }

  /**
   * Destroy the select instance
   */
  destroy() {
    if (!this._isInitialized) {
      return;
    }

    // Emit destroy event
    this.emit(EVENTS.DESTROY);
    this.trigger(this.element, EVENTS.DESTROY);

    // Close dropdown if open
    if (this.isOpen()) {
      this.close();
    }

    // Destroy adapters
    if (this.dataAdapter && this.dataAdapter.destroy) {
      this.dataAdapter.destroy();
    }
    if (this.ajaxAdapter && this.ajaxAdapter.destroy) {
      this.ajaxAdapter.destroy();
    }
    if (this.selectionAdapter && this.selectionAdapter.destroy) {
      this.selectionAdapter.destroy();
    }
    if (this.dropdownAdapter && this.dropdownAdapter.destroy) {
      this.dropdownAdapter.destroy();
    }
    if (this.resultsAdapter && this.resultsAdapter.destroy) {
      this.resultsAdapter.destroy();
    }

    // Destroy managers
    if (this.keyboardManager && this.keyboardManager.destroy) {
      this.keyboardManager.destroy();
    }
    if (this.accessibilityManager && this.accessibilityManager.destroy) {
      this.accessibilityManager.destroy();
    }

    // Remove container
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Show original select
    this.element.style.display = "";
    this.element.removeAttribute("aria-hidden");

    // Remove reference from element
    delete this.element._vanillaSmartSelect;

    // Remove all event listeners
    this.removeAllListeners();

    // Mark as not initialized
    this._isInitialized = false;
  }
}

// Factory function for easier initialization
export function vanillaSmartSelect(element, options) {
  return new VanillaSmartSelect(element, options);
}

export default VanillaSmartSelect;
