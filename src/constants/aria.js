/**
 * ARIA (Accessible Rich Internet Applications) constants
 * Used for proper accessibility implementation
 */

export const ARIA = {
  // Roles
  COMBOBOX: "combobox",
  LISTBOX: "listbox",
  OPTION: "option",
  GROUP: "group",
  PRESENTATION: "presentation",

  // States and Properties
  EXPANDED: "aria-expanded",
  SELECTED: "aria-selected",
  DISABLED: "aria-disabled",
  ACTIVEDESCENDANT: "aria-activedescendant",
  HIDDEN: "aria-hidden",

  // Labels and Descriptions
  LABEL: "aria-label",
  LABELLEDBY: "aria-labelledby",
  DESCRIBEDBY: "aria-describedby",

  // Relationships
  CONTROLS: "aria-controls",
  OWNS: "aria-owns",

  // Widget Attributes
  HASPOPUP: "aria-haspopup",
  AUTOCOMPLETE: "aria-autocomplete",
  MULTISELECTABLE: "aria-multiselectable",

  // Live Region Attributes
  LIVE: "aria-live",
  ATOMIC: "aria-atomic",
  RELEVANT: "aria-relevant",
  BUSY: "aria-busy",

  // Values
  TRUE: "true",
  FALSE: "false",
  POLITE: "polite",
  ASSERTIVE: "assertive",
  LIST: "list",
  BOTH: "both",
};

/**
 * Helper function to set ARIA attributes
 * @param {HTMLElement} element - Element to set attributes on
 * @param {Object} attributes - Object with ARIA attribute key-value pairs
 */
export function setAriaAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, value);
    }
  });
}

/**
 * Helper function to get unique ID for ARIA relationships
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
let idCounter = 0;
export function generateAriaId(prefix = "vs") {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

export default ARIA;
