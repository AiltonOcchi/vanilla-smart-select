/**
 * Default configuration options for vanilla-smart-select
 */

import { detectBrowserLanguage, getLanguage } from "../i18n/index.js";

export const DEFAULTS = {
  // Display options
  placeholder: "",
  theme: "default",
  width: "100%",
  containerCssClass: "",
  dropdownCssClass: "",

  // Behavior options
  multiple: false,
  searchable: true,
  allowClear: false,
  disabled: false,
  closeOnSelect: true,

  // Data options
  data: null,

  // Search options
  searchMinimumLength: 0,
  searchDelay: 250,
  searchPlaceholder: null, // Use null to allow i18n translation, or set a custom string to override
  matcher: null, // Custom matcher function
  matchStrategy: "contains", // 'startsWith', 'contains', 'exact'

  // Template options
  templateResult: null, // Function: (item) => HTMLElement
  templateSelection: null, // Function: (item) => HTMLElement
  escapeMarkup: (markup) => markup, // Function to escape/sanitize HTML

  // Dropdown options
  dropdownParent: null,
  dropdownAutoWidth: false,
  dropdownCssClass: "",

  // AJAX options (Phase 2)
  ajax: null,
  /*
  ajax: {
    url: '',
    method: 'GET',
    dataType: 'json',
    delay: 250,
    headers: {},
    data: (params) => params,
    processResults: (data) => data,
    transport: null // Custom transport function
  }
  */

  // Tagging options (Phase 2)
  tags: false,
  createTag: (params) => {
    const term = params.term?.trim();
    if (!term) return null;
    return { id: term, text: term };
  },
  insertTag: (data, tag) => {
    data.unshift(tag);
  },

  // Language/i18n options
  // Auto-detect browser language and load appropriate translations
  language: getLanguage(detectBrowserLanguage()),

  // Accessibility options
  ariaLabel: null,
  ariaDescribedBy: null,

  // Selection limit (for multiple select)
  maximumSelectionLength: 0, // 0 = unlimited

  // Event callbacks
  onOpen: null,
  onClose: null,
  onChange: null,
  onSelect: null,
  onUnselect: null,
  onClear: null,

  // Debug mode
  debug: false,
};

export default DEFAULTS;
