/**
 * Template Utilities
 * Handles custom template rendering with safety checks
 */

import { createElement } from "./dom.js";

/**
 * Apply a custom template function to render content
 * @param {Function} templateFn - Template function that receives item and returns HTMLElement or string
 * @param {Object} item - Data item to render
 * @param {HTMLElement} targetElement - Element to append rendered content to
 * @param {Object} options - Rendering options
 * @param {string} options.defaultText - Default text to use if template fails (defaults to item.text)
 * @param {boolean} options.useTextContent - Use textContent instead of createElement for fallback (defaults to false)
 * @param {Function} options.escapeMarkup - Function applied to the string result of templateFn before
 *   innerHTML assignment. The default in DEFAULTS is identity (v1.x compat: templates that return HTML
 *   are injected as-is). v2.0 will switch the default to a real HTML-escape function. Ignored when the
 *   template returns an HTMLElement (appendChild path).
 * @returns {boolean} True if template was applied successfully, false if fallback was used
 */
export function applyTemplate(templateFn, item, targetElement, options = {}) {
  const {
    defaultText = item.text,
    useTextContent = false,
    escapeMarkup
  } = options;

  // If no template function provided, use default rendering
  if (!templateFn || typeof templateFn !== "function") {
    _renderDefault(targetElement, defaultText, useTextContent);
    return false;
  }

  try {
    // Call template function
    const customContent = templateFn(item);

    // Handle HTMLElement return — escapeMarkup intentionally bypassed here.
    if (customContent instanceof HTMLElement) {
      targetElement.appendChild(customContent);
      return true;
    }

    // Handle string return (HTML)
    if (typeof customContent === "string") {
      // Pass through escapeMarkup when provided. With the v1.x default
      // (identity), this is a no-op and the string is injected as HTML
      // — preserving legacy behavior. Integrators can opt-in to real
      // escaping by supplying a sanitizing function via the option.
      const safeContent =
        typeof escapeMarkup === "function"
          ? escapeMarkup(customContent)
          : customContent;
      targetElement.innerHTML = safeContent;
      return true;
    }

    // Invalid return type - use fallback
    console.warn(
      "Template function returned invalid content type:",
      typeof customContent,
    );
    _renderDefault(targetElement, defaultText, useTextContent);
    return false;
  } catch (error) {
    // Template function threw an error - log and use fallback
    console.error("Template rendering error:", error);
    _renderDefault(targetElement, defaultText, useTextContent);
    return false;
  }
}

/**
 * Render default content (fallback)
 * @param {HTMLElement} targetElement - Target element
 * @param {string} text - Text to render
 * @param {boolean} useTextContent - Use textContent directly or create span wrapper
 * @private
 */
function _renderDefault(targetElement, text, useTextContent) {
  if (useTextContent) {
    targetElement.textContent = text;
  } else {
    const textElement = createElement("span", {}, text);
    targetElement.appendChild(textElement);
  }
}
