/**
 * Dropdown Component - Manages dropdown container
 * Handles positioning, visibility, and container structure
 */

import { createElement } from "../utils/dom.js";

class Dropdown {
  constructor(options) {
    this.options = options;
    this.container = null;
    this.isOpen = false;
    this.positionContext = "body"; // 'body' or 'modal'
    this.modalParent = null;
  }

  /**
   * Set the positioning context
   * @param {string} context - 'body' or 'modal'
   * @param {HTMLElement|null} modalParent - Modal parent element
   */
  setPositionContext(context, modalParent) {
    this.positionContext = context;
    this.modalParent = modalParent;
  }

  /**
   * Render the dropdown container
   * @returns {HTMLElement} Dropdown container
   */
  render() {
    const theme = this.options.get("theme") || "default";

    this.container = createElement("div", {
      className: `vs-dropdown vs-container--${theme}`,
      role: "listbox",
    });

    return this.container;
  }

  /**
   * Position the dropdown
   * @param {HTMLElement} anchor - Anchor element (selection container)
   */
  position(anchor) {
    if (!this.container || !anchor) return;

    const anchorRect = anchor.getBoundingClientRect();
    const dropdownHeight = this.container.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (this.positionContext === "modal" && this.modalParent) {
      // Position relative to modal
      const modalRect = this.modalParent.getBoundingClientRect();

      // Calculate position relative to modal
      const relativeTop = anchorRect.bottom - modalRect.top;
      const relativeLeft = anchorRect.left - modalRect.left;

      // Check available space within modal
      const spaceBelow = modalRect.bottom - anchorRect.bottom;
      const spaceAbove = anchorRect.top - modalRect.top;

      // Determine position (above or below)
      let position = "below";
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        position = "above";
      }

      // Use absolute positioning within modal
      this.container.style.position = "absolute";

      if (position === "above") {
        this.container.style.bottom = `${modalRect.bottom - anchorRect.top}px`;
        this.container.style.top = "auto";
      } else {
        this.container.style.top = `${relativeTop}px`;
        this.container.style.bottom = "auto";
      }

      this.container.style.left = `${relativeLeft}px`;
      this.container.style.width = `${anchorRect.width}px`;
    } else {
      // Position fixed to viewport (original behavior)
      const spaceBelow = viewportHeight - anchorRect.bottom;
      const spaceAbove = anchorRect.top;

      // Determine position (above or below)
      let position = "below";
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        position = "above";
      }

      // Use fixed positioning
      this.container.style.position = "fixed";

      // Apply positioning
      if (position === "above") {
        this.container.style.bottom = `${viewportHeight - anchorRect.top}px`;
        this.container.style.top = "auto";
      } else {
        this.container.style.top = `${anchorRect.bottom}px`;
        this.container.style.bottom = "auto";
      }

      this.container.style.left = `${anchorRect.left}px`;
      this.container.style.width = `${anchorRect.width}px`;
    }
  }

  /**
   * Open the dropdown
   */
  open() {
    if (this.isOpen || !this.container) return;

    this.container.classList.add("vs-dropdown--open");
    this.container.style.display = "block";
    this.isOpen = true;
  }

  /**
   * Close the dropdown
   */
  close() {
    if (!this.isOpen || !this.container) return;

    this.container.classList.remove("vs-dropdown--open");
    this.container.style.display = "none";
    this.isOpen = false;
  }

  /**
   * Toggle dropdown open/closed
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
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
    this.isOpen = false;
  }
}

export default Dropdown;
