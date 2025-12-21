/**
 * SelectionAdapter - Manages selection UI rendering
 * Coordinates between Selection component and DataAdapter
 */

import BaseAdapter from "./BaseAdapter.js";
import Selection from "../components/Selection.js";
import { EVENTS } from "../constants/events.js";

class SelectionAdapter extends BaseAdapter {
  constructor(instance, options) {
    super(instance, options);

    this.selection = new Selection(options);
    this.dataAdapter = null;

    // Store event handler references for proper cleanup
    this._toggleClickHandler = null;
    this._clearClickHandler = null;
    this._removeClickHandler = null;
    this.selectionContainer = null;
  }

  /**
   * Bind the adapter
   * @param {HTMLElement} container - Container element
   * @param {DataAdapter} dataAdapter - Data adapter instance
   */
  bind(container, dataAdapter) {
    super.bind(container);
    this.dataAdapter = dataAdapter;

    // Render selection component
    const selectionElement = this.selection.render();
    container.appendChild(selectionElement);

    // Bind events
    this._bindEvents();

    // Initial render
    this.update();
  }

  /**
   * Bind event listeners
   * @private
   */
  _bindEvents() {
    const selectionContainer = this.selection.getContainer();
    this.selectionContainer = selectionContainer;

    // Click to open dropdown - store handler reference for cleanup
    this._toggleClickHandler = (e) => {
      // Don't open if clicking on remove button or clear button
      if (
        e.target.classList.contains("vs-selection__choice__remove") ||
        e.target.classList.contains("vs-selection__clear")
      ) {
        return;
      }

      if (this.instance) {
        this.instance.toggle();
      }
    };
    selectionContainer.addEventListener("click", this._toggleClickHandler);

    // Handle clear button click - store handler reference for cleanup
    this._clearClickHandler = (e) => {
      if (e.target.classList.contains("vs-selection__clear")) {
        e.stopPropagation();
        e.preventDefault();

        // Use the clear() method from the main API
        if (this.instance) {
          this.instance.clear();
        }
      }
    };
    selectionContainer.addEventListener("click", this._clearClickHandler);

    // Handle remove button clicks (for multiple select) - store handler reference for cleanup
    this._removeClickHandler = (e) => {
      if (e.target.classList.contains("vs-selection__choice__remove")) {
        const id = e.target.dataset.id;
        const item = this.dataAdapter.current().find((item) => item.id === id);

        if (item) {
          this.dataAdapter.unselect(item);
          this.update();
        }

        e.stopPropagation();
      }
    };
    selectionContainer.addEventListener("click", this._removeClickHandler);

    // Listen to selection changes
    this.instance.on(EVENTS.SELECT, () => {
      this.update();
    });

    this.instance.on(EVENTS.UNSELECT, () => {
      this.update();
    });

    this.instance.on(EVENTS.CLEAR, () => {
      this.update();
    });
  }

  /**
   * Update the selection display
   */
  update() {
    if (!this.dataAdapter) return;

    const current = this.dataAdapter.current();
    this.selection.update(current);
  }

  /**
   * Clear the selection
   */
  clear() {
    this.selection.clear();
  }

  /**
   * Destroy the adapter
   */
  destroy() {
    // Properly remove event listeners to prevent memory leaks
    if (this.selectionContainer) {
      if (this._toggleClickHandler) {
        this.selectionContainer.removeEventListener(
          "click",
          this._toggleClickHandler,
        );
        this._toggleClickHandler = null;
      }

      if (this._clearClickHandler) {
        this.selectionContainer.removeEventListener(
          "click",
          this._clearClickHandler,
        );
        this._clearClickHandler = null;
      }

      if (this._removeClickHandler) {
        this.selectionContainer.removeEventListener(
          "click",
          this._removeClickHandler,
        );
        this._removeClickHandler = null;
      }

      this.selectionContainer = null;
    }

    this.selection.destroy();
  }
}

export default SelectionAdapter;
