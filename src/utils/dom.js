/**
 * DOM manipulation utilities
 * Helper functions for common DOM operations
 */

/**
 * Create an element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Object with attributes to set
 * @param {Array|string|HTMLElement} children - Child elements or text
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  });

  // Add children
  const childArray = Array.isArray(children) ? children : [children];
  childArray.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Find closest parent matching selector
 * @param {HTMLElement} element - Starting element
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null} Matching element or null
 */
export function closest(element, selector) {
  if (element.closest) {
    return element.closest(selector);
  }

  // Fallback for older browsers
  let el = element;
  while (el) {
    if (el.matches(selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

/**
 * Add one or more classes to an element
 * @param {HTMLElement} element - Element to modify
 * @param {string|Array<string>} classes - Class name(s) to add
 */
export function addClass(element, classes) {
  const classList = Array.isArray(classes) ? classes : [classes];
  classList.forEach((cls) => {
    if (cls) element.classList.add(cls);
  });
}

/**
 * Remove one or more classes from an element
 * @param {HTMLElement} element - Element to modify
 * @param {string|Array<string>} classes - Class name(s) to remove
 */
export function removeClass(element, classes) {
  const classList = Array.isArray(classes) ? classes : [classes];
  classList.forEach((cls) => {
    if (cls) element.classList.remove(cls);
  });
}

/**
 * Toggle a class on an element
 * @param {HTMLElement} element - Element to modify
 * @param {string} className - Class name to toggle
 * @param {boolean} force - Force add (true) or remove (false)
 * @returns {boolean} Whether class is present after toggle
 */
export function toggleClass(element, className, force) {
  return element.classList.toggle(className, force);
}

/**
 * Check if element has a class
 * @param {HTMLElement} element - Element to check
 * @param {string} className - Class name to check
 * @returns {boolean} Whether element has the class
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * Remove an element from the DOM
 * @param {HTMLElement} element - Element to remove
 */
export function removeElement(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Empty an element (remove all children)
 * @param {HTMLElement} element - Element to empty
 */
export function emptyElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Get element by selector (single)
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element (default: document)
 * @returns {HTMLElement|null} Found element or null
 */
export function querySelector(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Get elements by selector (multiple)
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element (default: document)
 * @returns {Array<HTMLElement>} Array of found elements
 */
export function querySelectorAll(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Get element's offset position relative to document
 * @param {HTMLElement} element - Element to get position of
 * @returns {Object} Object with top, left, width, height
 */
export function getOffset(element) {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Get element's position relative to offset parent
 * @param {HTMLElement} element - Element to get position of
 * @returns {Object} Object with top and left
 */
export function getPosition(element) {
  return {
    top: element.offsetTop,
    left: element.offsetLeft,
  };
}

/**
 * Check if element is visible in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Whether element is visible
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Scroll element into view if needed
 * @param {HTMLElement} element - Element to scroll to
 * @param {HTMLElement} container - Container to scroll within
 */
export function scrollIntoViewIfNeeded(element, container) {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  if (elementRect.top < containerRect.top) {
    container.scrollTop -= containerRect.top - elementRect.top;
  } else if (elementRect.bottom > containerRect.bottom) {
    container.scrollTop += elementRect.bottom - containerRect.bottom;
  }
}

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
let uniqueIdCounter = 0;
export function generateUniqueId(prefix = "vs") {
  return `${prefix}-${Date.now()}-${++uniqueIdCounter}`;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Parse HTML string into DOM elements
 * @param {string} html - HTML string
 * @returns {NodeList} Parsed elements
 */
export function parseHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.childNodes;
}

export default {
  createElement,
  closest,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  removeElement,
  emptyElement,
  querySelector,
  querySelectorAll,
  getOffset,
  getPosition,
  isInViewport,
  scrollIntoViewIfNeeded,
  generateUniqueId,
  escapeHtml,
  parseHtml,
};
