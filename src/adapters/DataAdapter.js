/**
 * DataAdapter - Manages data source and selection state
 * Handles data normalization, querying, and selection tracking
 */

import BaseAdapter from "./BaseAdapter.js";
import { EVENTS } from "../constants/events.js";

class DataAdapter extends BaseAdapter {
  constructor(instance, options) {
    super(instance, options);

    this.data = [];
    this.selection = [];
  }

  /**
   * Initialize data from element or options
   */
  init() {
    // Load data from options or element
    const optionsData = this.options.get("data");

    if (optionsData && Array.isArray(optionsData)) {
      this.setData(optionsData);
    } else {
      // Load from <option> elements
      this.loadFromElement();
    }

    // Load initial selection
    this.loadInitialSelection();
  }

  /**
   * Load data from <option> elements
   */
  loadFromElement() {
    const data = [];
    const options = this.$element.querySelectorAll("option");
    const optgroups = this.$element.querySelectorAll("optgroup");

    // Process optgroups
    optgroups.forEach((optgroup, index) => {
      const group = {
        id: `group-${index}-${optgroup.label}`,
        text: optgroup.label,
        children: [],
      };

      const groupOptions = optgroup.querySelectorAll("option");
      groupOptions.forEach((option) => {
        const normalized = this._normalizeOption(option);
        // Skip empty placeholder options
        if (!this._isPlaceholder(normalized)) {
          group.children.push(normalized);
        }
      });

      // Only add group if it has children
      if (group.children.length > 0) {
        data.push(group);
      }
    });

    // Process standalone options (not in optgroups)
    options.forEach((option) => {
      if (
        !option.parentElement ||
        option.parentElement.tagName !== "OPTGROUP"
      ) {
        const normalized = this._normalizeOption(option);
        // Skip empty placeholder options
        if (!this._isPlaceholder(normalized)) {
          data.push(normalized);
        }
      }
    });

    this.data = data;
  }

  /**
   * Normalize an option element to data format
   * @param {HTMLOptionElement} option - Option element
   * @returns {Object} Normalized data object
   */
  _normalizeOption(option) {
    // Use value if present, otherwise use text as fallback
    // But preserve empty string values (for placeholder detection)
    const value = option.value;
    const id =
      value !== "" && value != null ? value : value === "" ? "" : option.text;

    return {
      id: id,
      text: option.text,
      disabled: option.disabled,
      selected: option.selected,
      element: option,
      _isEmptyValue: value === "", // Mark for placeholder detection
    };
  }

  /**
   * Check if an item is a placeholder
   * @param {Object} item - Normalized item
   * @returns {boolean} True if placeholder
   * @private
   */
  _isPlaceholder(item) {
    // Consider it a placeholder if it has an empty value attribute
    // This catches <option value="">Placeholder</option> patterns
    // Note: Using explicit checks to allow id=0 (which is a valid ID)
    return (
      item._isEmptyValue === true ||
      item.id === undefined ||
      item.id === null ||
      item.id === ""
    );
  }

  /**
   * Load initial selection from element
   */
  loadInitialSelection() {
    const selectedOptions = this.$element.querySelectorAll("option:checked");
    this.selection = Array.from(selectedOptions).map((opt) =>
      this._normalizeOption(opt),
    );
  }

  /**
   * Set data programmatically
   * @param {Array} data - Data array
   */
  setData(data) {
    this.data = data.map((item) => this._normalizeItem(item));
    this.emit(EVENTS.DATA_LOADED, { data: this.data });
  }

  /**
   * Normalize a data item
   * @param {Object} item - Data item
   * @returns {Object} Normalized item
   */
  _normalizeItem(item) {
    // Preserve all custom properties by spreading the original item
    const normalized = {
      ...item, // Keep all custom properties (flag, code, emoji, avatar, etc.)
      id: item.id !== undefined ? item.id : item.text,
      text: item.text || "",
      disabled: item.disabled || false,
      selected: item.selected || false,
    };

    // Handle groups
    if (item.children && Array.isArray(item.children)) {
      normalized.children = item.children.map((child) =>
        this._normalizeItem(child),
      );
    }

    // Keep original data
    if (item.element) {
      normalized.element = item.element;
    }

    return normalized;
  }

  /**
   * Query data (search/filter)
   * @param {Object} _params - Query parameters (reserved for future use)
   * @returns {Array} Filtered data with groups preserved
   */
  query(_params = {}) {
    // Return data with groups intact - don't flatten!
    // Filtering/searching is handled by SearchManager and ResultsAdapter
    return this.data;
  }

  /**
   * Get current selection
   * @returns {Array} Selected items
   */
  current() {
    return this.selection;
  }

  /**
   * Select an item
   * @param {Object} data - Item to select
   * @returns {boolean} True if selection was successful, false if limit reached or already selected
   */
  select(data) {
    const isMultiple = this.options.get("multiple");

    if (!isMultiple) {
      // Single select - clear previous selection
      this.selection = [data];
    } else {
      // Multiple select - add to selection
      const exists = this.selection.some((item) => item.id === data.id);
      if (!exists) {
        // Check selection limit
        const maximumSelectionLength = this.options.get(
          "maximumSelectionLength",
        );
        if (
          maximumSelectionLength > 0 &&
          this.selection.length >= maximumSelectionLength
        ) {
          // Limit reached - emit event and return false
          const language = this.options.get("language");
          const message =
            typeof language.maximumSelected === "function"
              ? language.maximumSelected({ maximum: maximumSelectionLength })
              : `You can only select ${maximumSelectionLength} items`;

          this.emit(EVENTS.SELECTION_LIMIT_REACHED, {
            maximum: maximumSelectionLength,
            message: message,
          });
          this.trigger(this.$element, EVENTS.SELECTION_LIMIT_REACHED, {
            maximum: maximumSelectionLength,
            message: message,
          });

          return false; // Selection failed - limit reached
        }

        this.selection.push(data);
      } else {
        // Item already selected
        return false;
      }
    }

    // Update element
    this._updateElement();

    // Emit events
    this.emit(EVENTS.SELECT, { data });
    this.emit(EVENTS.CHANGE, { value: this.getValue() });
    this.trigger(this.$element, EVENTS.SELECT, { data });
    this.trigger(this.$element, EVENTS.CHANGE, { value: this.getValue() });

    return true; // Selection successful
  }

  /**
   * Unselect an item
   * @param {Object} data - Item to unselect
   */
  unselect(data) {
    this.selection = this.selection.filter((item) => item.id !== data.id);

    // Update element
    this._updateElement();

    // Emit events
    this.emit(EVENTS.UNSELECT, { data });
    this.emit(EVENTS.CHANGE, { value: this.getValue() });
    this.trigger(this.$element, EVENTS.UNSELECT, { data });
    this.trigger(this.$element, EVENTS.CHANGE, { value: this.getValue() });
  }

  /**
   * Clear all selections
   */
  clear() {
    this.selection = [];
    this._updateElement();

    // Don't emit events here - VanillaSmartSelect.clear() will emit them
    // This prevents double emission and timing issues
  }

  /**
   * Get current value(s)
   * @returns {string|Array} Current value
   */
  getValue() {
    const isMultiple = this.options.get("multiple");

    if (isMultiple) {
      return this.selection.map((item) => item.id);
    }

    return this.selection.length > 0 ? this.selection[0].id : null;
  }

  /**
   * Update the original select element
   * @private
   */
  _updateElement() {
    const options = this.$element.querySelectorAll("option");
    const selectedIds = this.selection.map((item) => item.id);

    options.forEach((option) => {
      const value = option.value || option.text;
      option.selected = selectedIds.includes(value);
    });

    // Trigger native change event
    const event = new Event("change", { bubbles: true });
    this.$element.dispatchEvent(event);
  }

  /**
   * Destroy the adapter
   */
  destroy() {
    this.data = [];
    this.selection = [];
  }
}

export default DataAdapter;
