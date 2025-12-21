/**
 * SearchManager - Manages search/filter functionality
 * Handles search logic and filtering results
 */

import { removeDiacritics } from "../utils/diacritics.js";

class SearchManager {
  constructor(options) {
    this.options = options;
    this.matcher = null;
    this._setupMatcher();
  }

  /**
   * Setup the matcher function
   * @private
   */
  _setupMatcher() {
    // Check if custom matcher is provided
    const customMatcher = this.options.get("matcher");
    if (customMatcher && typeof customMatcher === "function") {
      this.matcher = customMatcher;
    } else {
      this.matcher = this._defaultMatcher.bind(this);
    }
  }

  /**
   * Default matcher function
   * Searches in text with diacritics support
   * @param {string} term - Search term
   * @param {Object} item - Item to match against
   * @returns {boolean} Whether item matches
   * @private
   */
  _defaultMatcher(term, item) {
    // Empty search matches everything
    if (!term || term.trim() === "") {
      return true;
    }

    // Don't search in disabled items
    if (item.disabled) {
      return false;
    }

    // Normalize search term and item text
    const normalizedTerm = removeDiacritics(term.toLowerCase());
    const normalizedText = removeDiacritics(item.text.toLowerCase());

    // Check matching strategy
    const matchStrategy = this.options.get("matchStrategy") || "contains";

    switch (matchStrategy) {
      case "startsWith":
        return normalizedText.startsWith(normalizedTerm);

      case "exact":
        return normalizedText === normalizedTerm;

      case "contains":
      default:
        return normalizedText.includes(normalizedTerm);
    }
  }

  /**
   * Search items based on term
   * @param {Array} items - Items to search
   * @param {string} term - Search term
   * @returns {Array} Filtered items
   */
  search(items, term) {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    // If no search term, return all items
    if (!term || term.trim() === "") {
      return items;
    }

    const results = [];

    items.forEach((item) => {
      // Handle groups (optgroups)
      if (item.children && Array.isArray(item.children)) {
        const filteredChildren = item.children.filter((child) =>
          this.matcher(term, child),
        );

        // Include group if it has matching children
        if (filteredChildren.length > 0) {
          results.push({
            ...item,
            children: filteredChildren,
          });
        }
      } else {
        // Regular item
        if (this.matcher(term, item)) {
          results.push(item);
        }
      }
    });

    return results;
  }

  /**
   * Highlight matching text in results
   * @param {string} text - Original text
   * @param {string} term - Search term
   * @returns {string} HTML with highlighted text
   */
  highlight(text, term) {
    if (!term || term.trim() === "") {
      return text;
    }

    const normalizedTerm = removeDiacritics(term.toLowerCase());
    const normalizedText = removeDiacritics(text.toLowerCase());

    const index = normalizedText.indexOf(normalizedTerm);
    if (index === -1) {
      return text;
    }

    // Extract the actual matching substring from original text
    const before = text.substring(0, index);
    const match = text.substring(index, index + term.length);
    const after = text.substring(index + term.length);

    return `${before}<mark>${match}</mark>${after}`;
  }
}

export default SearchManager;
