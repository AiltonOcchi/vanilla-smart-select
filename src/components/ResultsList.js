/**
 * ResultsList Component - Renders list of options
 * Handles option rendering, highlighting, and selection
 */

import { createElement, emptyElement } from "../utils/dom.js";
import { applyTemplate } from "../utils/template.js";

class ResultsList {
  constructor(options) {
    this.options = options;
    this.container = null;
    this.highlightedIndex = -1;
    this.results = [];

    // Cache template function for performance (avoids repeated options.get calls)
    this._cachedTemplateResult = options.get("templateResult");
  }

  /**
   * Render the results container
   * @returns {HTMLElement} Results container
   */
  render() {
    this.container = createElement("div", {
      className: "vs-results",
    });

    return this.container;
  }

  /**
   * Update results list
   * @param {Array} results - Array of result items
   */
  update(results) {
    this.results = results;
    this.flatResults = []; // Flat list of rendered items
    this.highlightedIndex = -1;

    if (!this.container) return;

    emptyElement(this.container);

    if (!results || results.length === 0) {
      this._renderNoResults();
      return;
    }

    let flatIndex = 0;
    results.forEach((item) => {
      // Check if item is a group
      if (item.children && Array.isArray(item.children)) {
        // Render group header
        const groupHeader = this._renderGroupHeader(item);
        this.container.appendChild(groupHeader);

        // Render group children
        item.children.forEach((child) => {
          const childElement = this._renderItem(child, flatIndex, true);
          this.container.appendChild(childElement);
          this.flatResults.push(child); // Add to flat list
          flatIndex++;
        });
      } else {
        // Render regular item
        const resultElement = this._renderItem(item, flatIndex, false);
        this.container.appendChild(resultElement);
        this.flatResults.push(item); // Add to flat list
        flatIndex++;
      }
    });
  }

  /**
   * Render group header
   * @param {Object} group - Group data
   * @returns {HTMLElement} Group header element
   * @private
   */
  _renderGroupHeader(group) {
    const header = createElement("div", {
      className: "vs-result--group",
      role: "presentation",
    });

    const text = createElement("span", {}, group.text);
    header.appendChild(text);

    return header;
  }

  /**
   * Render a single result item
   * @param {Object} item - Item data
   * @param {number} index - Item index
   * @param {boolean} isGroupChild - Whether item is a child of a group
   * @returns {HTMLElement} Result element
   * @private
   */
  _renderItem(item, index, isGroupChild = false) {
    const className = isGroupChild
      ? "vs-result vs-result--group-child"
      : "vs-result";

    const result = createElement("div", {
      className: className,
      role: "option",
      "data-index": index,
      "data-id": item.id,
      "aria-selected": item.selected ? "true" : "false",
    });

    if (item.disabled) {
      result.classList.add("vs-result--disabled");
      result.setAttribute("aria-disabled", "true");
    }

    // Mark as tag if it's a tag creation option
    if (item._isTag) {
      result.classList.add("vs-result--tag");
      result.setAttribute("data-is-tag", "true");
    }

    // Use custom template if provided, otherwise use default
    // Uses cached template function for better performance
    applyTemplate(this._cachedTemplateResult, item, result, {
      defaultText: item._isTag ? item.text : item.text,
      useTextContent: false, // Use createElement wrapper for consistency
    });

    return result;
  }

  /**
   * Render "no results" message
   * @private
   */
  _renderNoResults() {
    const message =
      this.options.get("language.noResults") || "No results found";
    const noResults = createElement(
      "div",
      {
        className: "vs-results--no-results",
      },
      message,
    );

    this.container.appendChild(noResults);
  }

  /**
   * Highlight item at index (flat index)
   * @param {number} index - Flat index to highlight
   */
  highlight(index) {
    // Use flat results length for validation
    const totalItems = this.flatResults ? this.flatResults.length : 0;
    if (index < 0 || index >= totalItems) return;

    // Remove previous highlight
    const previousHighlight = this.container.querySelector(
      ".vs-result--highlighted",
    );
    if (previousHighlight) {
      previousHighlight.classList.remove("vs-result--highlighted");
    }

    // Add new highlight
    const items = this.container.querySelectorAll(".vs-result");
    if (items[index]) {
      items[index].classList.add("vs-result--highlighted");
      this.highlightedIndex = index;

      // Scroll into view if needed
      items[index].scrollIntoView({ block: "nearest" });
    }
  }

  /**
   * Get highlighted item
   * @returns {Object|null} Highlighted item data
   */
  getHighlighted() {
    // Use flat results array
    if (
      this.flatResults &&
      this.highlightedIndex >= 0 &&
      this.highlightedIndex < this.flatResults.length
    ) {
      return this.flatResults[this.highlightedIndex];
    }
    return null;
  }

  /**
   * Clear the results
   */
  clear() {
    if (this.container) {
      emptyElement(this.container);
    }
    this.results = [];
    this.highlightedIndex = -1;
  }

  /**
   * Get the container element
   * @returns {HTMLElement} Container
   */
  getContainer() {
    return this.container;
  }

  /**
   * Destroy the component
   */
  destroy() {
    this.clear();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }
}

export default ResultsList;
