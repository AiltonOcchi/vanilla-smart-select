/**
 * SearchBox Component - Search input inside dropdown
 * Handles search input rendering and events
 */

import { createElement, emptyElement } from "../utils/dom.js";

class SearchBox {
  constructor(options) {
    this.options = options;
    this.container = null;
    this.input = null;
  }

  /**
   * Get placeholder text based on options and language
   * @returns {string} Placeholder text
   * @private
   */
  _getPlaceholder() {
    const language = this.options.get("language");
    const customPlaceholder = this.options.get("searchPlaceholder");
    return customPlaceholder !== null && customPlaceholder !== undefined
      ? customPlaceholder
      : language.searchPlaceholder || "Search...";
  }

  /**
   * Get ARIA label based on language
   * @returns {string} ARIA label text
   * @private
   */
  _getAriaLabel() {
    const language = this.options.get("language");
    return language.searchLabel || "Search options";
  }

  /**
   * Render the search box
   * @returns {HTMLElement} Search box container
   */
  render() {
    this.container = createElement("div", {
      className: "vs-search-container",
    });

    this.input = createElement("input", {
      type: "text",
      className: "vs-search",
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "off",
      spellcheck: "false",
      role: "searchbox",
      "aria-autocomplete": "list",
      "aria-label": this._getAriaLabel(),
    });

    this.input.placeholder = this._getPlaceholder();

    this.container.appendChild(this.input);

    return this.container;
  }

  /**
   * Get the input element
   * @returns {HTMLInputElement} Input element
   */
  getInput() {
    return this.input;
  }

  /**
   * Get the container element
   * @returns {HTMLElement} Container element
   */
  getContainer() {
    return this.container;
  }

  /**
   * Focus the search input
   */
  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  /**
   * Clear the search input
   */
  clear() {
    if (this.input) {
      this.input.value = "";
    }
  }

  /**
   * Get current search value
   * @returns {string} Search value
   */
  getValue() {
    return this.input ? this.input.value : "";
  }

  /**
   * Set search value
   * @param {string} value - Value to set
   */
  setValue(value) {
    if (this.input) {
      this.input.value = value;
    }
  }

  /**
   * Update component with new language/options
   * Refreshes placeholder and aria-label
   */
  update() {
    if (!this.input) {
      return;
    }

    this.input.placeholder = this._getPlaceholder();
    this.input.setAttribute("aria-label", this._getAriaLabel());
  }

  /**
   * Destroy the component
   */
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.input = null;
  }
}

export default SearchBox;
