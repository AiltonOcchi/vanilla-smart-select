/**
 * Selection Component - Renders selected items display
 * Handles single and multiple selection display
 */

import { createElement } from "../utils/dom.js";
import { applyTemplate } from "../utils/template.js";

class Selection {
  constructor(options) {
    this.options = options;
    this.container = null;

    // Cache template function for performance (avoids repeated options.get calls)
    this._cachedTemplateSelection = options.get("templateSelection");
  }

  /**
   * Render the selection container
   * @returns {HTMLElement} Selection container
   */
  render() {
    this.container = createElement("div", {
      className: "vs-selection",
      tabindex: "0",
      role: "combobox",
      "aria-expanded": "false",
      "aria-haspopup": "listbox",
    });

    // Render placeholder initially
    this.renderPlaceholder();

    return this.container;
  }

  /**
   * Render placeholder
   */
  renderPlaceholder() {
    if (!this.container) return;

    // Always clear the container first
    this.container.innerHTML = "";

    // Then add placeholder if defined
    const placeholder = this.options.get("placeholder");
    if (placeholder) {
      const placeholderEl = createElement(
        "span",
        {
          className: "vs-selection__placeholder",
        },
        placeholder,
      );
      this.container.appendChild(placeholderEl);
    }
  }

  /**
   * Update selection display
   * @param {Array} selection - Selected items
   */
  update(selection) {
    if (!this.container) return;

    const isMultiple = this.options.get("multiple");

    if (!selection || selection.length === 0) {
      this.renderPlaceholder();
      return;
    }

    if (isMultiple) {
      this._renderMultiple(selection);
    } else {
      this._renderSingle(selection[0]);
    }
  }

  /**
   * Render single selection
   * @param {Object} item - Selected item
   * @private
   */
  _renderSingle(item) {
    this.container.innerHTML = "";

    const rendered = createElement("span", {
      className: "vs-selection__rendered",
    });

    // Use custom template if provided, otherwise use default
    // Uses cached template function for better performance
    applyTemplate(this._cachedTemplateSelection, item, rendered, {
      defaultText: item.text,
      useTextContent: true, // Use textContent directly for better performance
    });

    this.container.appendChild(rendered);

    // Add clear button if allowClear is enabled
    const allowClear = this.options.get("allowClear");
    if (allowClear) {
      const language = this.options.get("language");
      const clearLabel = language.clearSelection || "Clear selection";

      const clearBtn = createElement(
        "span",
        {
          className: "vs-selection__clear",
          role: "button",
          "aria-label": clearLabel,
          title: clearLabel,
        },
        "×",
      );

      this.container.appendChild(clearBtn);
    }
  }

  /**
   * Render multiple selection
   * @param {Array} items - Selected items
   * @private
   */
  _renderMultiple(items) {
    this.container.innerHTML = "";

    const choicesContainer = createElement("ul", {
      className: "vs-selection__choices",
    });

    items.forEach((item) => {
      const choice = this._renderChoice(item);
      choicesContainer.appendChild(choice);
    });

    this.container.appendChild(choicesContainer);
  }

  /**
   * Render a single choice (tag) in multiple select
   * @param {Object} item - Item to render
   * @returns {HTMLElement} Choice element
   * @private
   */
  _renderChoice(item) {
    const choice = createElement("li", {
      className: "vs-selection__choice",
      "data-id": item.id,
    });

    const text = createElement("span", {
      className: "vs-selection__choice__text",
    });

    // Use custom template if provided, otherwise use default
    // Uses cached template function for better performance
    applyTemplate(this._cachedTemplateSelection, item, text, {
      defaultText: item.text,
      useTextContent: true, // Use textContent directly for better performance
    });

    const language = this.options.get("language");
    const removeLabel =
      typeof language.removeItem === "function"
        ? language.removeItem({ text: item.text })
        : `Remove ${item.text}`;

    const remove = createElement(
      "span",
      {
        className: "vs-selection__choice__remove",
        role: "button",
        "aria-label": removeLabel,
        "data-id": item.id,
      },
      "×",
    );

    choice.appendChild(text);
    choice.appendChild(remove);

    return choice;
  }

  /**
   * Clear the selection display
   */
  clear() {
    this.renderPlaceholder();
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
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }
}

export default Selection;
