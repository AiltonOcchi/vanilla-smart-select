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
    this._cachedEscapeMarkup = options.get("escapeMarkup");
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

    // Render placeholder initially (which also appends the arrow)
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
      // Always add dropdown indicator
      this._appendDropdownArrow();
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
      escapeMarkup: this._cachedEscapeMarkup,
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
      // Always add dropdown indicator
      this._appendDropdownArrow();
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
      // Always add dropdown indicator
      this._appendDropdownArrow();
  }

    /**
     * Append dropdown indicator arrow to the selection container
     */
    _appendDropdownArrow() {
      // Remove any existing arrow (avoid duplicates)
      const prev = this.container.querySelector('.vs-selection__arrow');
      if (prev) prev.remove();
      // SVG arrow (chevron-down)
      const arrow = createElement('span', {
        className: 'vs-selection__arrow',
        'aria-hidden': 'true',
        tabindex: '-1',
      });
      // Inline SVG for crisp rendering
      arrow.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 7.5L9 12L13.5 7.5" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      this.container.appendChild(arrow);
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
      escapeMarkup: this._cachedEscapeMarkup,
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
