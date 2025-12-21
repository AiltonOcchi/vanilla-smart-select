/**
 * Options class - Manages configuration options
 * Handles merging, validation, and access to configuration
 */

import { DEFAULTS } from "../constants/defaults.js";

class Options {
  constructor(options = {}, defaults = DEFAULTS) {
    this._options = this._merge(defaults, options);
    this._validate();
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   * @private
   */
  _merge(target, source) {
    const result = { ...target };

    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        this._isPlainObject(sourceValue) &&
        this._isPlainObject(targetValue)
      ) {
        result[key] = this._merge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    });

    return result;
  }

  /**
   * Check if value is a plain object
   * @param {*} value - Value to check
   * @returns {boolean} Whether value is a plain object
   * @private
   */
  _isPlainObject(value) {
    return (
      value !== null &&
      typeof value === "object" &&
      value.constructor === Object
    );
  }

  /**
   * Validate options
   * @throws {Error} If options are invalid
   * @private
   */
  _validate() {
    // Validate searchDelay
    if (
      typeof this._options.searchDelay !== "number" ||
      this._options.searchDelay < 0
    ) {
      throw new Error("searchDelay must be a non-negative number");
    }

    // Validate searchMinimumLength
    if (
      typeof this._options.searchMinimumLength !== "number" ||
      this._options.searchMinimumLength < 0
    ) {
      throw new Error("searchMinimumLength must be a non-negative number");
    }

    // Validate matcher
    if (
      this._options.matcher !== null &&
      typeof this._options.matcher !== "function"
    ) {
      throw new Error("matcher must be a function or null");
    }

    // Validate matchStrategy
    const validStrategies = ["startsWith", "contains", "exact"];
    if (!validStrategies.includes(this._options.matchStrategy)) {
      throw new Error(
        `matchStrategy must be one of: ${validStrategies.join(", ")}`,
      );
    }

    // Validate template functions
    if (
      this._options.templateResult !== null &&
      typeof this._options.templateResult !== "function"
    ) {
      throw new Error("templateResult must be a function or null");
    }

    if (
      this._options.templateSelection !== null &&
      typeof this._options.templateSelection !== "function"
    ) {
      throw new Error("templateSelection must be a function or null");
    }

    // Validate maximumSelectionLength
    if (
      typeof this._options.maximumSelectionLength !== "number" ||
      this._options.maximumSelectionLength < 0
    ) {
      throw new Error("maximumSelectionLength must be a non-negative number");
    }

    // Validate theme
    if (typeof this._options.theme !== "string") {
      throw new Error("theme must be a string");
    }

    // Validate width
    if (typeof this._options.width !== "string") {
      throw new Error('width must be a string (e.g., "100%", "300px")');
    }
  }

  /**
   * Get an option value
   * @param {string} key - Option key (supports dot notation)
   * @returns {*} Option value
   */
  get(key) {
    const keys = key.split(".");
    let value = this._options;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Set an option value
   * @param {string} key - Option key (supports dot notation)
   * @param {*} value - New value
   */
  set(key, value) {
    const keys = key.split(".");
    const lastKey = keys.pop();
    let target = this._options;

    for (const k of keys) {
      if (!target[k] || typeof target[k] !== "object") {
        target[k] = {};
      }
      target = target[k];
    }

    target[lastKey] = value;
  }

  /**
   * Merge new options
   * @param {Object} options - New options to merge
   */
  merge(options) {
    this._options = this._merge(this._options, options);
    this._validate();
  }

  /**
   * Get all options
   * @returns {Object} All options
   */
  getAll() {
    return { ...this._options };
  }

  /**
   * Check if an option exists
   * @param {string} key - Option key
   * @returns {boolean} Whether option exists
   */
  has(key) {
    return this.get(key) !== undefined;
  }
}

export default Options;
