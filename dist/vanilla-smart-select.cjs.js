/*!
 * VanillaSmartSelect v1.0.2
 * (c) 2026 Ailton Occhi <ailton.occhi@hotmail.com>
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * EventEmitter class - Foundation for the event system
 * Provides internal event bus and DOM event triggering capabilities
 */

class EventEmitter {
  constructor() {
    this._events = new Map();
  }

  /**
   * Register an event listener
   * @param {string} eventName - Name of the event
   * @param {Function} handler - Event handler function
   * @returns {EventEmitter} Returns this for chaining
   */
  on(eventName, handler) {
    if (typeof handler !== "function") {
      throw new TypeError("Event handler must be a function");
    }

    if (!this._events.has(eventName)) {
      this._events.set(eventName, []);
    }

    this._events.get(eventName).push(handler);
    return this;
  }

  /**
   * Register a one-time event listener
   * @param {string} eventName - Name of the event
   * @param {Function} handler - Event handler function
   * @returns {EventEmitter} Returns this for chaining
   */
  once(eventName, handler) {
    const onceWrapper = (...args) => {
      handler(...args);
      this.off(eventName, onceWrapper);
    };

    return this.on(eventName, onceWrapper);
  }

  /**
   * Remove an event listener
   * @param {string} eventName - Name of the event
   * @param {Function} handler - Event handler function to remove
   * @returns {EventEmitter} Returns this for chaining
   */
  off(eventName, handler) {
    if (!this._events.has(eventName)) {
      return this;
    }

    if (!handler) {
      // Remove all listeners for this event
      this._events.delete(eventName);
      return this;
    }

    const handlers = this._events.get(eventName);
    const index = handlers.indexOf(handler);

    if (index !== -1) {
      handlers.splice(index, 1);
    }

    // Clean up empty arrays
    if (handlers.length === 0) {
      this._events.delete(eventName);
    }

    return this;
  }

  /**
   * Emit an event (internal event system)
   * @param {string} eventName - Name of the event
   * @param {*} data - Data to pass to handlers
   * @returns {boolean} Returns true if event had listeners
   */
  emit(eventName, data) {
    if (!this._events.has(eventName)) {
      return false;
    }

    const handlers = this._events.get(eventName).slice(); // Clone to avoid issues if handler modifies listeners

    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for "${eventName}":`, error);
      }
    });

    return true;
  }

  /**
   * Trigger a DOM event on an element (for external listeners)
   * @param {HTMLElement} element - Element to trigger event on
   * @param {string} eventName - Name of the event
   * @param {*} detail - Event detail data
   * @param {Object} options - Additional event options
   * @returns {boolean} Returns true if event was not cancelled
   */
  trigger(element, eventName, detail = null, options = {}) {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Cannot trigger event on invalid element");
      return false;
    }

    const eventOptions = {
      bubbles: true,
      cancelable: true,
      detail,
      ...options,
    };

    const event = new CustomEvent(eventName, eventOptions);
    return element.dispatchEvent(event);
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    this._events.clear();
  }

  /**
   * Get count of listeners for an event
   * @param {string} eventName - Name of the event
   * @returns {number} Number of listeners
   */
  listenerCount(eventName) {
    if (!this._events.has(eventName)) {
      return 0;
    }
    return this._events.get(eventName).length;
  }

  /**
   * Get all event names that have listeners
   * @returns {Array<string>} Array of event names
   */
  eventNames() {
    return Array.from(this._events.keys());
  }
}

/**
 * English (en) language strings for Vanilla Smart Select
 */

const EN = {
  // Results display
  noResults: "No results found",

  // Search
  searching: "Searching...",
  searchPlaceholder: "Search...",
  inputTooShort: (args) => `Please enter ${args.minimum} or more characters`,
  inputTooLong: (args) => `Please delete ${args.excess} characters`,

  // Selection limits
  maximumSelected: (args) => `You can only select ${args.maximum} items`,

  // AJAX (Phase 2)
  loading: "Loading...",
  loadingMore: "Loading more results...",
  errorLoading: "The results could not be loaded",

  // Tagging (Phase 2)
  createNewTag: (args) => `Create tag: "${args.term}"`,
  tagAdded: (args) => `Tag "${args.text}" added`,

  // Pagination (Phase 2)
  loadMore: "Load more results",

  // Accessibility (ARIA labels)
  searchLabel: "Search options",
  clearSelection: "Clear selection",
  removeItem: (args) => `Remove ${args.text}`,
  selectOptions: "Select options",

  // Screen reader announcements
  noResultsAvailable: "No results found",
  resultsAvailable: {
    one: "1 result available",
    other: (args) => `${args.count} results available`,
  },
  selected: (args) => `Selected: ${args.text}`,
};

/**
 * Portuguese - Brazil (pt-BR) language strings for Vanilla Smart Select
 */

const PT_BR = {
  // Results display
  noResults: "Nenhum resultado encontrado",

  // Search
  searching: "Buscando...",
  searchPlaceholder: "Buscar...",
  inputTooShort: (args) =>
    `Por favor, digite ${args.minimum} ou mais caracteres`,
  inputTooLong: (args) => `Por favor, delete ${args.excess} caracteres`,

  // Selection limits
  maximumSelected: (args) =>
    `Você só pode selecionar ${args.maximum} ${args.maximum === 1 ? "item" : "itens"}`,

  // AJAX (Phase 2)
  loading: "Carregando...",
  loadingMore: "Carregando mais resultados...",
  errorLoading: "Os resultados não puderam ser carregados",

  // Tagging (Phase 2)
  createNewTag: (args) => `Criar tag: "${args.term}"`,
  tagAdded: (args) => `Tag "${args.text}" adicionada`,

  // Pagination (Phase 2)
  loadMore: "Carregar mais resultados",

  // Accessibility (ARIA labels)
  searchLabel: "Buscar opções",
  clearSelection: "Limpar seleção",
  removeItem: (args) => `Remover ${args.text}`,
  selectOptions: "Selecionar opções",

  // Screen reader announcements
  noResultsAvailable: "Nenhum resultado encontrado",
  resultsAvailable: {
    one: "1 resultado disponível",
    other: (args) => `${args.count} resultados disponíveis`,
  },
  selected: (args) => `Selecionado: ${args.text}`,
};

/**
 * Spanish (es) language strings for Vanilla Smart Select
 */

const ES = {
  // Results display
  noResults: "No se encontraron resultados",

  // Search
  searching: "Buscando...",
  searchPlaceholder: "Buscar...",
  inputTooShort: (args) =>
    `Por favor, ingrese ${args.minimum} o más caracteres`,
  inputTooLong: (args) => `Por favor, elimine ${args.excess} caracteres`,

  // Selection limits
  maximumSelected: (args) =>
    `Solo puede seleccionar ${args.maximum} ${args.maximum === 1 ? "elemento" : "elementos"}`,

  // AJAX (Phase 2)
  loading: "Cargando...",
  loadingMore: "Cargando más resultados...",
  errorLoading: "Los resultados no se pudieron cargar",

  // Tagging (Phase 2)
  createNewTag: (args) => `Crear etiqueta: "${args.term}"`,
  tagAdded: (args) => `Etiqueta "${args.text}" agregada`,

  // Pagination (Phase 2)
  loadMore: "Cargar más resultados",

  // Accessibility (ARIA labels)
  searchLabel: "Buscar opciones",
  clearSelection: "Limpiar selección",
  removeItem: (args) => `Eliminar ${args.text}`,
  selectOptions: "Seleccionar opciones",

  // Screen reader announcements
  noResultsAvailable: "No se encontraron resultados",
  resultsAvailable: {
    one: "1 resultado disponible",
    other: (args) => `${args.count} resultados disponibles`,
  },
  selected: (args) => `Seleccionado: ${args.text}`,
};

/**
 * i18n System - Language Registry for Vanilla Smart Select
 * Provides centralized language management and utilities
 */


/**
 * Language registry - maps language codes to language objects
 */
const LANGUAGES = {
  en: EN,
  "en-US": EN,
  "en-GB": EN,
  "pt-BR": PT_BR,
  pt: PT_BR,
  es: ES,
  "es-ES": ES,
  "es-MX": ES,
};

/**
 * Get language object by locale code
 * Falls back to English if locale not found
 *
 * @param {string} locale - Language code (e.g., 'en', 'pt-BR', 'es')
 * @returns {Object} Language object with all translated strings
 */
function getLanguage(locale) {
  if (!locale || typeof locale !== "string") {
    return EN;
  }

  // Try exact match first
  if (LANGUAGES[locale]) {
    return LANGUAGES[locale];
  }

  // Try base language (e.g., 'pt' from 'pt-BR')
  const baseLang = locale.split("-")[0];
  if (LANGUAGES[baseLang]) {
    return LANGUAGES[baseLang];
  }

  // Fallback to English
  return EN;
}

/**
 * Detect browser language
 * Returns the best matching language from available translations
 *
 * @returns {string} Language code
 */
function detectBrowserLanguage() {
  // Try navigator.language first (most specific)
  if (navigator.language && LANGUAGES[navigator.language]) {
    return navigator.language;
  }

  // Try base language
  if (navigator.language) {
    const baseLang = navigator.language.split("-")[0];
    if (LANGUAGES[baseLang]) {
      return baseLang;
    }
  }

  // Try navigator.languages array
  if (navigator.languages && navigator.languages.length > 0) {
    for (const lang of navigator.languages) {
      if (LANGUAGES[lang]) {
        return lang;
      }
      const baseLang = lang.split("-")[0];
      if (LANGUAGES[baseLang]) {
        return baseLang;
      }
    }
  }

  // Fallback to English
  return "en";
}

/**
 * Get list of available languages
 *
 * @returns {Array} Array of language codes
 */
function getAvailableLanguages() {
  return Object.keys(LANGUAGES);
}

/**
 * Check if a language is available
 *
 * @param {string} locale - Language code
 * @returns {boolean} True if language is available
 */
function isLanguageAvailable(locale) {
  return !!LANGUAGES[locale] || !!LANGUAGES[locale.split("-")[0]];
}

var index = {
  LANGUAGES,
  getLanguage,
  detectBrowserLanguage,
  getAvailableLanguages,
  isLanguageAvailable,
};

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  LANGUAGES: LANGUAGES,
  default: index,
  detectBrowserLanguage: detectBrowserLanguage,
  getAvailableLanguages: getAvailableLanguages,
  getLanguage: getLanguage,
  isLanguageAvailable: isLanguageAvailable
});

/**
 * Default configuration options for vanilla-smart-select
 */


const DEFAULTS = {
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

/**
 * Options class - Manages configuration options
 * Handles merging, validation, and access to configuration
 */


class Options {
  constructor(options = {}, defaults = DEFAULTS) {
    this._options = this._merge(defaults, options);
    this._validate();
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   * @private
   */
  _merge(target, source) {
    const result = { ...target };

    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        this._isPlainObject(sourceValue) &&
        this._isPlainObject(targetValue)
      ) {
        result[key] = this._merge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    });

    return result;
  }

  /**
   * Check if value is a plain object
   * @param {*} value - Value to check
   * @returns {boolean} Whether value is a plain object
   * @private
   */
  _isPlainObject(value) {
    return (
      value !== null &&
      typeof value === "object" &&
      value.constructor === Object
    );
  }

  /**
   * Validate options
   * @throws {Error} If options are invalid
   * @private
   */
  _validate() {
    // Validate searchDelay
    if (
      typeof this._options.searchDelay !== "number" ||
      this._options.searchDelay < 0
    ) {
      throw new Error("searchDelay must be a non-negative number");
    }

    // Validate searchMinimumLength
    if (
      typeof this._options.searchMinimumLength !== "number" ||
      this._options.searchMinimumLength < 0
    ) {
      throw new Error("searchMinimumLength must be a non-negative number");
    }

    // Validate matcher
    if (
      this._options.matcher !== null &&
      typeof this._options.matcher !== "function"
    ) {
      throw new Error("matcher must be a function or null");
    }

    // Validate matchStrategy
    const validStrategies = ["startsWith", "contains", "exact"];
    if (!validStrategies.includes(this._options.matchStrategy)) {
      throw new Error(
        `matchStrategy must be one of: ${validStrategies.join(", ")}`,
      );
    }

    // Validate template functions
    if (
      this._options.templateResult !== null &&
      typeof this._options.templateResult !== "function"
    ) {
      throw new Error("templateResult must be a function or null");
    }

    if (
      this._options.templateSelection !== null &&
      typeof this._options.templateSelection !== "function"
    ) {
      throw new Error("templateSelection must be a function or null");
    }

    // Validate maximumSelectionLength
    if (
      typeof this._options.maximumSelectionLength !== "number" ||
      this._options.maximumSelectionLength < 0
    ) {
      throw new Error("maximumSelectionLength must be a non-negative number");
    }

    // Validate theme
    if (typeof this._options.theme !== "string") {
      throw new Error("theme must be a string");
    }

    // Validate width
    if (typeof this._options.width !== "string") {
      throw new Error('width must be a string (e.g., "100%", "300px")');
    }
  }

  /**
   * Get an option value
   * @param {string} key - Option key (supports dot notation)
   * @returns {*} Option value
   */
  get(key) {
    const keys = key.split(".");
    let value = this._options;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Set an option value
   * @param {string} key - Option key (supports dot notation)
   * @param {*} value - New value
   */
  set(key, value) {
    const keys = key.split(".");
    const lastKey = keys.pop();
    let target = this._options;

    for (const k of keys) {
      if (!target[k] || typeof target[k] !== "object") {
        target[k] = {};
      }
      target = target[k];
    }

    target[lastKey] = value;
  }

  /**
   * Merge new options
   * @param {Object} options - New options to merge
   */
  merge(options) {
    this._options = this._merge(this._options, options);
    this._validate();
  }

  /**
   * Get all options
   * @returns {Object} All options
   */
  getAll() {
    return { ...this._options };
  }

  /**
   * Check if an option exists
   * @param {string} key - Option key
   * @returns {boolean} Whether option exists
   */
  has(key) {
    return this.get(key) !== undefined;
  }
}

/**
 * Event name constants for vanilla-smart-select
 * All events use 'vs:' prefix to avoid conflicts
 */

const EVENTS = {
  // Lifecycle events
  INIT: "vs:init",
  DESTROY: "vs:destroy",

  // Selection events
  SELECT: "vs:select",
  SELECTING: "vs:selecting",
  UNSELECT: "vs:unselect",
  UNSELECTING: "vs:unselecting",
  CHANGE: "vs:change",
  CLEAR: "vs:clear",
  CLEARING: "vs:clearing",
  SELECTION_LIMIT_REACHED: "vs:selectionLimitReached",

  // Dropdown events
  OPEN: "vs:open",
  OPENING: "vs:opening",
  CLOSE: "vs:close",
  CLOSING: "vs:closing",

  // Search/Query events
  QUERY: "vs:query",
  RESULTS: "vs:results",

  // Data events
  DATA_LOADED: "vs:dataLoaded",

  // AJAX events (Phase 2)
  AJAX_LOADING: "vs:ajaxLoading",
  AJAX_SUCCESS: "vs:ajaxSuccess",
  AJAX_ERROR: "vs:ajaxError",

  // Focus events
  FOCUS: "vs:focus",
  BLUR: "vs:blur",
};

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
function createElement(tag, attributes = {}, children = []) {
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
function closest(element, selector) {
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
function addClass(element, classes) {
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
function removeClass(element, classes) {
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
function toggleClass(element, className, force) {
  return element.classList.toggle(className, force);
}

/**
 * Check if element has a class
 * @param {HTMLElement} element - Element to check
 * @param {string} className - Class name to check
 * @returns {boolean} Whether element has the class
 */
function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * Remove an element from the DOM
 * @param {HTMLElement} element - Element to remove
 */
function removeElement(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Empty an element (remove all children)
 * @param {HTMLElement} element - Element to empty
 */
function emptyElement(element) {
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
function querySelector(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Get elements by selector (multiple)
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element (default: document)
 * @returns {Array<HTMLElement>} Array of found elements
 */
function querySelectorAll(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Get element's offset position relative to document
 * @param {HTMLElement} element - Element to get position of
 * @returns {Object} Object with top, left, width, height
 */
function getOffset(element) {
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
function getPosition(element) {
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
function isInViewport(element) {
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
function scrollIntoViewIfNeeded(element, container) {
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
function generateUniqueId(prefix = "vs") {
  return `${prefix}-${Date.now()}-${++uniqueIdCounter}`;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Parse HTML string into DOM elements
 * @param {string} html - HTML string
 * @returns {NodeList} Parsed elements
 */
function parseHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.childNodes;
}

var dom = {
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

var dom$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  addClass: addClass,
  closest: closest,
  createElement: createElement,
  default: dom,
  emptyElement: emptyElement,
  escapeHtml: escapeHtml,
  generateUniqueId: generateUniqueId,
  getOffset: getOffset,
  getPosition: getPosition,
  hasClass: hasClass,
  isInViewport: isInViewport,
  parseHtml: parseHtml,
  querySelector: querySelector,
  querySelectorAll: querySelectorAll,
  removeClass: removeClass,
  removeElement: removeElement,
  scrollIntoViewIfNeeded: scrollIntoViewIfNeeded,
  toggleClass: toggleClass
});

/**
 * BaseAdapter - Abstract base class for all adapters
 * Provides common interface and functionality
 */

class BaseAdapter {
  constructor(instance, options) {
    this.instance = instance;
    this.options = options;
    this.$element = instance.element;
  }

  /**
   * Bind the adapter to a container
   * @param {HTMLElement} container - Container element
   */
  bind(container) {
    this.container = container;
  }

  /**
   * Destroy the adapter and cleanup
   */
  destroy() {
    // Override in subclasses
  }

  /**
   * Emit an event through the instance
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   */
  emit(eventName, data) {
    if (this.instance && this.instance.emit) {
      this.instance.emit(eventName, data);
    }
  }

  /**
   * Trigger a DOM event
   * @param {HTMLElement} element - Element to trigger event on
   * @param {string} eventName - Event name
   * @param {*} detail - Event detail
   */
  trigger(element, eventName, detail) {
    if (this.instance && this.instance.trigger) {
      this.instance.trigger(element, eventName, detail);
    }
  }
}

/**
 * DataAdapter - Manages data source and selection state
 * Handles data normalization, querying, and selection tracking
 */


class DataAdapter extends BaseAdapter {
  constructor(instance, options) {
    super(instance, options);

    this.data = [];
    this.selection = [];
  }

  /**
   * Initialize data from element or options
   */
  init() {
    // Load data from options or element
    const optionsData = this.options.get("data");

    if (optionsData && Array.isArray(optionsData)) {
      this.setData(optionsData);
    } else {
      // Load from <option> elements
      this.loadFromElement();
    }

    // Load initial selection
    this.loadInitialSelection();
  }

  /**
   * Load data from <option> elements
   */
  loadFromElement() {
    const data = [];
    const options = this.$element.querySelectorAll("option");
    const optgroups = this.$element.querySelectorAll("optgroup");

    // Process optgroups
    optgroups.forEach((optgroup, index) => {
      const group = {
        id: `group-${index}-${optgroup.label}`,
        text: optgroup.label,
        children: [],
      };

      const groupOptions = optgroup.querySelectorAll("option");
      groupOptions.forEach((option) => {
        const normalized = this._normalizeOption(option);
        // Skip empty placeholder options
        if (!this._isPlaceholder(normalized)) {
          group.children.push(normalized);
        }
      });

      // Only add group if it has children
      if (group.children.length > 0) {
        data.push(group);
      }
    });

    // Process standalone options (not in optgroups)
    options.forEach((option) => {
      if (
        !option.parentElement ||
        option.parentElement.tagName !== "OPTGROUP"
      ) {
        const normalized = this._normalizeOption(option);
        // Skip empty placeholder options
        if (!this._isPlaceholder(normalized)) {
          data.push(normalized);
        }
      }
    });

    this.data = data;
  }

  /**
   * Normalize an option element to data format
   * @param {HTMLOptionElement} option - Option element
   * @returns {Object} Normalized data object
   */
  _normalizeOption(option) {
    // Use value if present, otherwise use text as fallback
    // But preserve empty string values (for placeholder detection)
    const value = option.value;
    const id =
      value !== "" && value != null ? value : value === "" ? "" : option.text;

    return {
      id: id,
      text: option.text,
      disabled: option.disabled,
      selected: option.selected,
      element: option,
      _isEmptyValue: value === "", // Mark for placeholder detection
    };
  }

  /**
   * Check if an item is a placeholder
   * @param {Object} item - Normalized item
   * @returns {boolean} True if placeholder
   * @private
   */
  _isPlaceholder(item) {
    // Consider it a placeholder if it has an empty value attribute
    // This catches <option value="">Placeholder</option> patterns
    // Note: Using explicit checks to allow id=0 (which is a valid ID)
    return (
      item._isEmptyValue === true ||
      item.id === undefined ||
      item.id === null ||
      item.id === ""
    );
  }

  /**
   * Load initial selection from element
   */
  loadInitialSelection() {
    const selectedOptions = this.$element.querySelectorAll("option:checked");
    this.selection = Array.from(selectedOptions).map((opt) =>
      this._normalizeOption(opt),
    );
  }

  /**
   * Set data programmatically
   * @param {Array} data - Data array
   */
  setData(data) {
    this.data = data.map((item) => this._normalizeItem(item));
    this.emit(EVENTS.DATA_LOADED, { data: this.data });
  }

  /**
   * Normalize a data item
   * @param {Object} item - Data item
   * @returns {Object} Normalized item
   */
  _normalizeItem(item) {
    // Preserve all custom properties by spreading the original item
    const normalized = {
      ...item, // Keep all custom properties (flag, code, emoji, avatar, etc.)
      id: item.id !== undefined ? item.id : item.text,
      text: item.text || "",
      disabled: item.disabled || false,
      selected: item.selected || false,
    };

    // Handle groups
    if (item.children && Array.isArray(item.children)) {
      normalized.children = item.children.map((child) =>
        this._normalizeItem(child),
      );
    }

    // Keep original data
    if (item.element) {
      normalized.element = item.element;
    }

    return normalized;
  }

  /**
   * Query data (search/filter)
   * @param {Object} _params - Query parameters (reserved for future use)
   * @returns {Array} Filtered data with groups preserved
   */
  query(_params = {}) {
    // Return data with groups intact - don't flatten!
    // Filtering/searching is handled by SearchManager and ResultsAdapter
    return this.data;
  }

  /**
   * Get current selection
   * @returns {Array} Selected items
   */
  current() {
    return this.selection;
  }

  /**
   * Select an item
   * @param {Object} data - Item to select
   * @returns {boolean} True if selection was successful, false if limit reached or already selected
   */
  select(data) {
    const isMultiple = this.options.get("multiple");

    if (!isMultiple) {
      // Single select - clear previous selection
      this.selection = [data];
    } else {
      // Multiple select - add to selection
      const exists = this.selection.some((item) => item.id === data.id);
      if (!exists) {
        // Check selection limit
        const maximumSelectionLength = this.options.get(
          "maximumSelectionLength",
        );
        if (
          maximumSelectionLength > 0 &&
          this.selection.length >= maximumSelectionLength
        ) {
          // Limit reached - emit event and return false
          const language = this.options.get("language");
          const message =
            typeof language.maximumSelected === "function"
              ? language.maximumSelected({ maximum: maximumSelectionLength })
              : `You can only select ${maximumSelectionLength} items`;

          this.emit(EVENTS.SELECTION_LIMIT_REACHED, {
            maximum: maximumSelectionLength,
            message: message,
          });
          this.trigger(this.$element, EVENTS.SELECTION_LIMIT_REACHED, {
            maximum: maximumSelectionLength,
            message: message,
          });

          return false; // Selection failed - limit reached
        }

        this.selection.push(data);
      } else {
        // Item already selected
        return false;
      }
    }

    // Update element
    this._updateElement();

    // Emit events
    this.emit(EVENTS.SELECT, { data });
    this.emit(EVENTS.CHANGE, { value: this.getValue() });
    this.trigger(this.$element, EVENTS.SELECT, { data });
    this.trigger(this.$element, EVENTS.CHANGE, { value: this.getValue() });

    return true; // Selection successful
  }

  /**
   * Unselect an item
   * @param {Object} data - Item to unselect
   */
  unselect(data) {
    this.selection = this.selection.filter((item) => item.id !== data.id);

    // Update element
    this._updateElement();

    // Emit events
    this.emit(EVENTS.UNSELECT, { data });
    this.emit(EVENTS.CHANGE, { value: this.getValue() });
    this.trigger(this.$element, EVENTS.UNSELECT, { data });
    this.trigger(this.$element, EVENTS.CHANGE, { value: this.getValue() });
  }

  /**
   * Clear all selections
   */
  clear() {
    this.selection = [];
    this._updateElement();

    // Don't emit events here - VanillaSmartSelect.clear() will emit them
    // This prevents double emission and timing issues
  }

  /**
   * Get current value(s)
   * @returns {string|Array} Current value
   */
  getValue() {
    const isMultiple = this.options.get("multiple");

    if (isMultiple) {
      return this.selection.map((item) => item.id);
    }

    return this.selection.length > 0 ? this.selection[0].id : null;
  }

  /**
   * Update the original select element
   * @private
   */
  _updateElement() {
    const options = this.$element.querySelectorAll("option");
    const selectedIds = this.selection.map((item) => item.id);

    options.forEach((option) => {
      const value = option.value || option.text;
      option.selected = selectedIds.includes(value);
    });

    // Trigger native change event
    const event = new Event("change", { bubbles: true });
    this.$element.dispatchEvent(event);
  }

  /**
   * Destroy the adapter
   */
  destroy() {
    this.data = [];
    this.selection = [];
  }
}

/**
 * AjaxAdapter - Handles remote data loading via AJAX
 * Supports search, pagination, and custom request configuration
 */


class AjaxAdapter extends BaseAdapter {
  constructor(instance, options, dataAdapter) {
    super(instance, options);

    this.dataAdapter = dataAdapter;
    this.currentRequest = null;
    this.cache = new Map();

    // Get AJAX configuration
    this.ajaxConfig = this.options.get("ajax");

    if (!this.ajaxConfig) {
      throw new Error("AjaxAdapter requires ajax configuration option");
    }

    // Normalize AJAX config with defaults
    this.ajaxConfig = {
      url: "",
      method: "GET",
      dataType: "json",
      delay: 250,
      headers: {},
      cache: false,
      data: (params) => params,
      processResults: (data) => ({ results: data }),
      transport: null,
      ...this.ajaxConfig,
    };
  }

  /**
   * Query remote data
   * @param {Object} params - Query parameters
   * @param {string} params.term - Search term
   * @param {number} params.page - Page number (for pagination)
   * @returns {Promise<Object>} Results with data and pagination info
   */
  query(params = {}) {
    const { term = "", page = 1 } = params;

    // Check cache if enabled
    const cacheKey = this._getCacheKey(params);
    if (this.ajaxConfig.cache && this.cache.has(cacheKey)) {
      return Promise.resolve(this.cache.get(cacheKey));
    }

    // Cancel previous request if exists
    if (this.currentRequest) {
      this.currentRequest.abort();
    }

    // Emit loading event
    this.emit(EVENTS.AJAX_LOADING, { params });
    this.trigger(this.$element, EVENTS.AJAX_LOADING, { params });

    // Prepare request parameters using custom data function
    const requestParams = this.ajaxConfig.data({ term, page });

    // Use custom transport if provided, otherwise use default fetch
    const request = this.ajaxConfig.transport
      ? this.ajaxConfig.transport.call(this, requestParams, this.ajaxConfig)
      : this._defaultTransport(requestParams);

    this.currentRequest = request;

    return request
      .then((response) => {
        this.currentRequest = null;

        // Process results using custom function
        const processedResults = this.ajaxConfig.processResults(
          response,
          params,
        );

        // Normalize the results
        const normalizedResults = {
          results: Array.isArray(processedResults.results)
            ? processedResults.results.map((item) => this._normalizeItem(item))
            : [],
          pagination: processedResults.pagination || { more: false },
        };

        // Update cache if enabled
        if (this.ajaxConfig.cache) {
          this.cache.set(cacheKey, normalizedResults);
        }

        // Emit success event
        this.emit(EVENTS.AJAX_SUCCESS, { results: normalizedResults, params });
        this.trigger(this.$element, EVENTS.AJAX_SUCCESS, {
          results: normalizedResults,
          params,
        });

        return normalizedResults;
      })
      .catch((error) => {
        this.currentRequest = null;

        // Only emit error if it's not an abort
        if (error.name !== "AbortError") {
          this.emit(EVENTS.AJAX_ERROR, { error, params });
          this.trigger(this.$element, EVENTS.AJAX_ERROR, { error, params });
        }

        // Return empty results on error
        return { results: [], pagination: { more: false } };
      });
  }

  /**
   * Default transport using Fetch API
   * @param {Object} params - Request parameters
   * @returns {Promise} Fetch promise with AbortController
   * @private
   */
  _defaultTransport(params) {
    const abortController = new AbortController();

    let url = this.ajaxConfig.url;
    const method = this.ajaxConfig.method.toUpperCase();

    // Prepare request options
    const fetchOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.ajaxConfig.headers,
      },
      signal: abortController.signal,
    };

    // Handle GET requests - add params to URL
    if (method === "GET") {
      const queryString = new URLSearchParams(params).toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    } else {
      // Handle POST/PUT requests - add params to body
      fetchOptions.body = JSON.stringify(params);
    }

    const fetchPromise = fetch(url, fetchOptions).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse response based on dataType
      if (this.ajaxConfig.dataType === "json") {
        return response.json();
      } else if (this.ajaxConfig.dataType === "text") {
        return response.text();
      } else {
        return response.blob();
      }
    });

    // Add abort method to the promise
    fetchPromise.abort = () => abortController.abort();

    return fetchPromise;
  }

  /**
   * Normalize a data item (same as DataAdapter)
   * @param {Object} item - Data item
   * @returns {Object} Normalized item
   * @private
   */
  _normalizeItem(item) {
    // Preserve all custom properties by spreading the original item
    const normalized = {
      ...item, // Keep all custom properties
      id: item.id !== undefined ? item.id : item.text,
      text: item.text || "",
      disabled: item.disabled || false,
      selected: item.selected || false,
    };

    // Handle groups
    if (item.children && Array.isArray(item.children)) {
      normalized.children = item.children.map((child) =>
        this._normalizeItem(child),
      );
    }

    return normalized;
  }

  /**
   * Generate cache key from parameters
   * @param {Object} params - Query parameters
   * @returns {string} Cache key
   * @private
   */
  _getCacheKey(params) {
    return JSON.stringify(params);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Destroy the adapter
   */
  destroy() {
    // Cancel any pending requests
    if (this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = null;
    }

    // Clear cache
    this.clearCache();
  }
}

/**
 * Template Utilities
 * Handles custom template rendering with safety checks
 */


/**
 * Apply a custom template function to render content
 * @param {Function} templateFn - Template function that receives item and returns HTMLElement or string
 * @param {Object} item - Data item to render
 * @param {HTMLElement} targetElement - Element to append rendered content to
 * @param {Object} options - Rendering options
 * @param {string} options.defaultText - Default text to use if template fails (defaults to item.text)
 * @param {boolean} options.useTextContent - Use textContent instead of createElement for fallback (defaults to false)
 * @returns {boolean} True if template was applied successfully, false if fallback was used
 */
function applyTemplate(templateFn, item, targetElement, options = {}) {
  const { defaultText = item.text, useTextContent = false } = options;

  // If no template function provided, use default rendering
  if (!templateFn || typeof templateFn !== "function") {
    _renderDefault(targetElement, defaultText, useTextContent);
    return false;
  }

  try {
    // Call template function
    const customContent = templateFn(item);

    // Handle HTMLElement return
    if (customContent instanceof HTMLElement) {
      targetElement.appendChild(customContent);
      return true;
    }

    // Handle string return (HTML)
    if (typeof customContent === "string") {
      // Note: Using innerHTML here - developers are responsible for sanitizing
      // user-generated content to prevent XSS attacks
      targetElement.innerHTML = customContent;
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

/**
 * Selection Component - Renders selected items display
 * Handles single and multiple selection display
 */


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

/**
 * SelectionAdapter - Manages selection UI rendering
 * Coordinates between Selection component and DataAdapter
 */


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

/**
 * Dropdown Component - Manages dropdown container
 * Handles positioning, visibility, and container structure
 */


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

/**
 * SearchBox Component - Search input inside dropdown
 * Handles search input rendering and events
 */


class SearchBox {
  constructor(options) {
    this.options = options;
    this.container = null;
    this.input = null;
  }

  /**
   * Get placeholder text based on options and language
   * @returns {string} Placeholder text
   * @private
   */
  _getPlaceholder() {
    const language = this.options.get("language");
    const customPlaceholder = this.options.get("searchPlaceholder");
    return customPlaceholder !== null && customPlaceholder !== undefined
      ? customPlaceholder
      : language.searchPlaceholder || "Search...";
  }

  /**
   * Get ARIA label based on language
   * @returns {string} ARIA label text
   * @private
   */
  _getAriaLabel() {
    const language = this.options.get("language");
    return language.searchLabel || "Search options";
  }

  /**
   * Render the search box
   * @returns {HTMLElement} Search box container
   */
  render() {
    this.container = createElement("div", {
      className: "vs-search-container",
    });

    this.input = createElement("input", {
      type: "text",
      className: "vs-search",
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "off",
      spellcheck: "false",
      role: "searchbox",
      "aria-autocomplete": "list",
      "aria-label": this._getAriaLabel(),
    });

    this.input.placeholder = this._getPlaceholder();

    this.container.appendChild(this.input);

    return this.container;
  }

  /**
   * Get the input element
   * @returns {HTMLInputElement} Input element
   */
  getInput() {
    return this.input;
  }

  /**
   * Get the container element
   * @returns {HTMLElement} Container element
   */
  getContainer() {
    return this.container;
  }

  /**
   * Focus the search input
   */
  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  /**
   * Clear the search input
   */
  clear() {
    if (this.input) {
      this.input.value = "";
    }
  }

  /**
   * Get current search value
   * @returns {string} Search value
   */
  getValue() {
    return this.input ? this.input.value : "";
  }

  /**
   * Set search value
   * @param {string} value - Value to set
   */
  setValue(value) {
    if (this.input) {
      this.input.value = value;
    }
  }

  /**
   * Update component with new language/options
   * Refreshes placeholder and aria-label
   */
  update() {
    if (!this.input) {
      return;
    }

    this.input.placeholder = this._getPlaceholder();
    this.input.setAttribute("aria-label", this._getAriaLabel());
  }

  /**
   * Destroy the component
   */
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.input = null;
  }
}

/**
 * Debounce Utility
 * Delays function execution until after a specified wait period
 */

/**
 * Creates a debounced function that delays invoking func until after
 * wait milliseconds have elapsed since the last time the debounced
 * function was invoked
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @param {boolean} immediate - If true, trigger function on leading edge instead of trailing
 * @returns {Function} Debounced function with cancel method
 */
function debounce$1(func, wait = 250, immediate = false) {
  let timeout;

  const debounced = function (...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };

  // Add cancel method to clear pending execution
  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

/**
 * DropdownAdapter - Manages dropdown display and positioning
 * Coordinates dropdown opening, closing, and positioning
 */


class DropdownAdapter extends BaseAdapter {
  constructor(instance, options) {
    super(instance, options);

    this.dropdown = new Dropdown(options);
    this.searchBox = null;
    this.anchorElement = null;
    this._justOpened = false; // Flag to prevent immediate close on programmatic open

    // Store event handler references for proper cleanup
    // Bind handlers once in constructor to maintain same reference
    this._boundHandleOutsideClick = this._handleOutsideClick.bind(this);
    this._boundHandleResize = this._handleResize.bind(this);
    this._boundHandleScroll = this._handleScroll.bind(this);
    this._inputHandler = null;
    this._searchClickHandler = null;
  }

  /**
   * Bind the adapter
   * @param {HTMLElement} container - Main container
   * @param {HTMLElement} anchor - Anchor element (selection container)
   */
  bind(container, anchor) {
    super.bind(container);
    this.anchorElement = anchor;

    // Render dropdown and append to body (for proper positioning)
    const dropdownElement = this.dropdown.render();

    // Add search box if searchable
    const searchable = this.options.get("searchable");
    if (searchable) {
      this.searchBox = new SearchBox(this.options);
      const searchBoxElement = this.searchBox.render();
      dropdownElement.insertBefore(
        searchBoxElement,
        dropdownElement.firstChild,
      );
    }

    // Determine where to append dropdown
    // If inside a modal, append to modal (like Select2's dropdownParent)
    // This keeps the dropdown within Bootstrap's focus trap
    const modalElement = this._findModalParent();
    if (modalElement) {
      modalElement.appendChild(dropdownElement);
      this.dropdown.setPositionContext("modal", modalElement);
    } else {
      document.body.appendChild(dropdownElement);
      this.dropdown.setPositionContext("body", null);
    }

    // Bind events
    this._bindEvents();
  }

  /**
   * Find the closest modal parent element
   * @returns {HTMLElement|null} Modal element or null
   * @private
   */
  _findModalParent() {
    if (!this.container) return null;

    let element = this.container;
    while (element && element !== document.body) {
      // Bootstrap modal
      if (element.classList && element.classList.contains("modal")) {
        return element;
      }
      // Generic dialog
      if (
        element.hasAttribute("role") &&
        element.getAttribute("role") === "dialog"
      ) {
        return element;
      }
      element = element.parentElement;
    }

    return null;
  }

  /**
   * Bind event listeners
   * @private
   */
  _bindEvents() {
    // Listen to open/close events
    this.instance.on(EVENTS.OPENING, () => {
      this.open();
    });

    this.instance.on(EVENTS.CLOSING, () => {
      this.close();
    });

    // SearchBox events
    if (this.searchBox) {
      const input = this.searchBox.getInput();

      // Check if AJAX is configured
      const ajaxConfig = this.options.get("ajax");
      const searchDelay = ajaxConfig
        ? ajaxConfig.delay || 250
        : this.options.get("searchDelay") || 0;

      // Create query handler (with debounce for AJAX)
      const handleQuery = (term) => {
        this.instance.emit(EVENTS.QUERY, { term });
      };

      // Use debounce for AJAX queries, immediate for local filtering
      const queryHandler =
        searchDelay > 0 ? debounce$1(handleQuery, searchDelay) : handleQuery;

      // Emit query event on input - store handler reference for cleanup
      this._inputHandler = (e) => {
        const term = e.target.value;
        queryHandler(term);
      };
      input.addEventListener("input", this._inputHandler);

      // Prevent dropdown close on search input click - store handler reference for cleanup
      this._searchClickHandler = (e) => {
        e.stopPropagation();
      };
      input.addEventListener("click", this._searchClickHandler);
    }

    // Close on outside click - use bound reference for proper cleanup
    document.addEventListener("click", this._boundHandleOutsideClick);

    // Reposition on scroll/resize - use bound references for proper cleanup
    window.addEventListener("resize", this._boundHandleResize);
    window.addEventListener("scroll", this._boundHandleScroll, true);
  }

  /**
   * Handle outside clicks
   * @param {Event} e - Click event
   * @private
   */
  _handleOutsideClick(e) {
    if (!this.dropdown.isOpen) return;

    // Ignore clicks that happened in the same event loop as opening
    // This prevents programmatic open() from being immediately closed
    if (this._justOpened) {
      return;
    }

    const dropdownEl = this.dropdown.getContainer();
    const isClickInside =
      this.container.contains(e.target) || dropdownEl.contains(e.target);

    if (!isClickInside) {
      this.instance.close();
    }
  }

  /**
   * Handle window resize
   * @private
   */
  _handleResize() {
    if (this.dropdown.isOpen) {
      this.dropdown.position(this.anchorElement);
    }
  }

  /**
   * Handle scroll
   * @private
   */
  _handleScroll() {
    if (this.dropdown.isOpen) {
      this.dropdown.position(this.anchorElement);
    }
  }

  /**
   * Open the dropdown
   */
  open() {
    this.dropdown.open();
    this.dropdown.position(this.anchorElement);

    // Set flag to prevent immediate close from the same click event
    this._justOpened = true;
    setTimeout(() => {
      this._justOpened = false;
    }, 50);

    // Focus search box if available
    if (this.searchBox) {
      setTimeout(() => {
        this.searchBox.focus();
      }, 10);
    }

    // Update ARIA
    if (this.anchorElement) {
      this.anchorElement.setAttribute("aria-expanded", "true");
    }
  }

  /**
   * Close the dropdown
   */
  close() {
    // Close dropdown
    this.dropdown.close();

    // Clear search box
    if (this.searchBox) {
      this.searchBox.clear();
      // Re-query to show all results next time
      this.instance.emit(EVENTS.QUERY, { term: "" });
    }

    // Update ARIA and restore focus
    if (this.anchorElement) {
      this.anchorElement.setAttribute("aria-expanded", "false");

      // Always return focus to selection element when dropdown closes
      // This ensures consistent behavior between mouse and keyboard interactions
      // and allows Tab key to navigate to the next form field correctly
      this.anchorElement.focus();
    }
  }

  /**
   * Check if dropdown is open
   * @returns {boolean} Is open
   */
  isOpen() {
    return this.dropdown.isOpen;
  }

  /**
   * Get dropdown container
   * @returns {HTMLElement} Dropdown container
   */
  getContainer() {
    return this.dropdown.getContainer();
  }

  /**
   * Update components with new options (e.g., language changes)
   */
  update() {
    if (this.searchBox) {
      this.searchBox.update();
    }
  }

  /**
   * Destroy the adapter
   */
  destroy() {
    // Properly remove event listeners to prevent memory leaks
    // Use the same bound references that were used in addEventListener
    document.removeEventListener("click", this._boundHandleOutsideClick);
    window.removeEventListener("resize", this._boundHandleResize);
    window.removeEventListener("scroll", this._boundHandleScroll, true);

    // Remove searchBox event listeners if they exist
    if (this.searchBox) {
      const input = this.searchBox.getInput();
      if (input) {
        if (this._inputHandler) {
          input.removeEventListener("input", this._inputHandler);
          this._inputHandler = null;
        }
        if (this._searchClickHandler) {
          input.removeEventListener("click", this._searchClickHandler);
          this._searchClickHandler = null;
        }
      }
    }

    // Clear bound references
    this._boundHandleOutsideClick = null;
    this._boundHandleResize = null;
    this._boundHandleScroll = null;

    this.dropdown.destroy();
  }
}

/**
 * ResultsList Component - Renders list of options
 * Handles option rendering, highlighting, and selection
 */


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

/**
 * Diacritics mapping for text normalization
 * Maps accented/special characters to their base forms for search functionality
 */

const diacritics = {
  "\u24B6": "A",
  "\uFF21": "A",
  "\u00C0": "A",
  "\u00C1": "A",
  "\u00C2": "A",
  "\u1EA6": "A",
  "\u1EA4": "A",
  "\u1EAA": "A",
  "\u1EA8": "A",
  "\u00C3": "A",
  "\u0100": "A",
  "\u0102": "A",
  "\u1EB0": "A",
  "\u1EAE": "A",
  "\u1EB4": "A",
  "\u1EB2": "A",
  "\u0226": "A",
  "\u01E0": "A",
  "\u00C4": "A",
  "\u01DE": "A",
  "\u1EA2": "A",
  "\u00C5": "A",
  "\u01FA": "A",
  "\u01CD": "A",
  "\u0200": "A",
  "\u0202": "A",
  "\u1EA0": "A",
  "\u1EAC": "A",
  "\u1EB6": "A",
  "\u1E00": "A",
  "\u0104": "A",
  "\u023A": "A",
  "\u2C6F": "A",
  "\uA732": "AA",
  "\u00C6": "AE",
  "\u01FC": "AE",
  "\u01E2": "AE",
  "\uA734": "AO",
  "\uA736": "AU",
  "\uA738": "AV",
  "\uA73A": "AV",
  "\uA73C": "AY",
  "\u24B7": "B",
  "\uFF22": "B",
  "\u1E02": "B",
  "\u1E04": "B",
  "\u1E06": "B",
  "\u0243": "B",
  "\u0182": "B",
  "\u0181": "B",
  "\u24B8": "C",
  "\uFF23": "C",
  "\u0106": "C",
  "\u0108": "C",
  "\u010A": "C",
  "\u010C": "C",
  "\u00C7": "C",
  "\u1E08": "C",
  "\u0187": "C",
  "\u023B": "C",
  "\uA73E": "C",
  "\u24B9": "D",
  "\uFF24": "D",
  "\u1E0A": "D",
  "\u010E": "D",
  "\u1E0C": "D",
  "\u1E10": "D",
  "\u1E12": "D",
  "\u1E0E": "D",
  "\u0110": "D",
  "\u018B": "D",
  "\u018A": "D",
  "\u0189": "D",
  "\uA779": "D",
  "\u01F1": "DZ",
  "\u01C4": "DZ",
  "\u01F2": "Dz",
  "\u01C5": "Dz",
  "\u24BA": "E",
  "\uFF25": "E",
  "\u00C8": "E",
  "\u00C9": "E",
  "\u00CA": "E",
  "\u1EC0": "E",
  "\u1EBE": "E",
  "\u1EC4": "E",
  "\u1EC2": "E",
  "\u1EBC": "E",
  "\u0112": "E",
  "\u1E14": "E",
  "\u1E16": "E",
  "\u0114": "E",
  "\u0116": "E",
  "\u00CB": "E",
  "\u1EBA": "E",
  "\u011A": "E",
  "\u0204": "E",
  "\u0206": "E",
  "\u1EB8": "E",
  "\u1EC6": "E",
  "\u0228": "E",
  "\u1E1C": "E",
  "\u0118": "E",
  "\u1E18": "E",
  "\u1E1A": "E",
  "\u0190": "E",
  "\u018E": "E",
  "\u24BB": "F",
  "\uFF26": "F",
  "\u1E1E": "F",
  "\u0191": "F",
  "\uA77B": "F",
  "\u24BC": "G",
  "\uFF27": "G",
  "\u01F4": "G",
  "\u011C": "G",
  "\u1E20": "G",
  "\u011E": "G",
  "\u0120": "G",
  "\u01E6": "G",
  "\u0122": "G",
  "\u01E4": "G",
  "\u0193": "G",
  "\uA7A0": "G",
  "\uA77D": "G",
  "\uA77E": "G",
  "\u24BD": "H",
  "\uFF28": "H",
  "\u0124": "H",
  "\u1E22": "H",
  "\u1E26": "H",
  "\u021E": "H",
  "\u1E24": "H",
  "\u1E28": "H",
  "\u1E2A": "H",
  "\u0126": "H",
  "\u2C67": "H",
  "\u2C75": "H",
  "\uA78D": "H",
  "\u24BE": "I",
  "\uFF29": "I",
  "\u00CC": "I",
  "\u00CD": "I",
  "\u00CE": "I",
  "\u0128": "I",
  "\u012A": "I",
  "\u012C": "I",
  "\u0130": "I",
  "\u00CF": "I",
  "\u1E2E": "I",
  "\u1EC8": "I",
  "\u01CF": "I",
  "\u0208": "I",
  "\u020A": "I",
  "\u1ECA": "I",
  "\u012E": "I",
  "\u1E2C": "I",
  "\u0197": "I",
  "\u24BF": "J",
  "\uFF2A": "J",
  "\u0134": "J",
  "\u0248": "J",
  "\u24C0": "K",
  "\uFF2B": "K",
  "\u1E30": "K",
  "\u01E8": "K",
  "\u1E32": "K",
  "\u0136": "K",
  "\u1E34": "K",
  "\u0198": "K",
  "\u2C69": "K",
  "\uA740": "K",
  "\uA742": "K",
  "\uA744": "K",
  "\uA7A2": "K",
  "\u24C1": "L",
  "\uFF2C": "L",
  "\u013F": "L",
  "\u0139": "L",
  "\u013D": "L",
  "\u1E36": "L",
  "\u1E38": "L",
  "\u013B": "L",
  "\u1E3C": "L",
  "\u1E3A": "L",
  "\u0141": "L",
  "\u023D": "L",
  "\u2C62": "L",
  "\u2C60": "L",
  "\uA748": "L",
  "\uA746": "L",
  "\uA780": "L",
  "\u01C7": "LJ",
  "\u01C8": "Lj",
  "\u24C2": "M",
  "\uFF2D": "M",
  "\u1E3E": "M",
  "\u1E40": "M",
  "\u1E42": "M",
  "\u2C6E": "M",
  "\u019C": "M",
  "\u24C3": "N",
  "\uFF2E": "N",
  "\u01F8": "N",
  "\u0143": "N",
  "\u00D1": "N",
  "\u1E44": "N",
  "\u0147": "N",
  "\u1E46": "N",
  "\u0145": "N",
  "\u1E4A": "N",
  "\u1E48": "N",
  "\u0220": "N",
  "\u019D": "N",
  "\uA790": "N",
  "\uA7A4": "N",
  "\u01CA": "NJ",
  "\u01CB": "Nj",
  "\u24C4": "O",
  "\uFF2F": "O",
  "\u00D2": "O",
  "\u00D3": "O",
  "\u00D4": "O",
  "\u1ED2": "O",
  "\u1ED0": "O",
  "\u1ED6": "O",
  "\u1ED4": "O",
  "\u00D5": "O",
  "\u1E4C": "O",
  "\u022C": "O",
  "\u1E4E": "O",
  "\u014C": "O",
  "\u1E50": "O",
  "\u1E52": "O",
  "\u014E": "O",
  "\u022E": "O",
  "\u0230": "O",
  "\u00D6": "O",
  "\u022A": "O",
  "\u1ECE": "O",
  "\u0150": "O",
  "\u01D1": "O",
  "\u020C": "O",
  "\u020E": "O",
  "\u01A0": "O",
  "\u1EDC": "O",
  "\u1EDA": "O",
  "\u1EE0": "O",
  "\u1EDE": "O",
  "\u1EE2": "O",
  "\u1ECC": "O",
  "\u1ED8": "O",
  "\u01EA": "O",
  "\u01EC": "O",
  "\u00D8": "O",
  "\u01FE": "O",
  "\u0186": "O",
  "\u019F": "O",
  "\uA74A": "O",
  "\uA74C": "O",
  "\u01A2": "OI",
  "\uA74E": "OO",
  "\u0222": "OU",
  "\u24C5": "P",
  "\uFF30": "P",
  "\u1E54": "P",
  "\u1E56": "P",
  "\u01A4": "P",
  "\u2C63": "P",
  "\uA750": "P",
  "\uA752": "P",
  "\uA754": "P",
  "\u24C6": "Q",
  "\uFF31": "Q",
  "\uA756": "Q",
  "\uA758": "Q",
  "\u024A": "Q",
  "\u24C7": "R",
  "\uFF32": "R",
  "\u0154": "R",
  "\u1E58": "R",
  "\u0158": "R",
  "\u0210": "R",
  "\u0212": "R",
  "\u1E5A": "R",
  "\u1E5C": "R",
  "\u0156": "R",
  "\u1E5E": "R",
  "\u024C": "R",
  "\u2C64": "R",
  "\uA75A": "R",
  "\uA7A6": "R",
  "\uA782": "R",
  "\u24C8": "S",
  "\uFF33": "S",
  "\u1E9E": "S",
  "\u015A": "S",
  "\u1E64": "S",
  "\u015C": "S",
  "\u1E60": "S",
  "\u0160": "S",
  "\u1E66": "S",
  "\u1E62": "S",
  "\u1E68": "S",
  "\u0218": "S",
  "\u015E": "S",
  "\u2C7E": "S",
  "\uA7A8": "S",
  "\uA784": "S",
  "\u24C9": "T",
  "\uFF34": "T",
  "\u1E6A": "T",
  "\u0164": "T",
  "\u1E6C": "T",
  "\u021A": "T",
  "\u0162": "T",
  "\u1E70": "T",
  "\u1E6E": "T",
  "\u0166": "T",
  "\u01AC": "T",
  "\u01AE": "T",
  "\u023E": "T",
  "\uA786": "T",
  "\uA728": "TZ",
  "\u24CA": "U",
  "\uFF35": "U",
  "\u00D9": "U",
  "\u00DA": "U",
  "\u00DB": "U",
  "\u0168": "U",
  "\u1E78": "U",
  "\u016A": "U",
  "\u1E7A": "U",
  "\u016C": "U",
  "\u00DC": "U",
  "\u01DB": "U",
  "\u01D7": "U",
  "\u01D5": "U",
  "\u01D9": "U",
  "\u1EE6": "U",
  "\u016E": "U",
  "\u0170": "U",
  "\u01D3": "U",
  "\u0214": "U",
  "\u0216": "U",
  "\u01AF": "U",
  "\u1EEA": "U",
  "\u1EE8": "U",
  "\u1EEE": "U",
  "\u1EEC": "U",
  "\u1EF0": "U",
  "\u1EE4": "U",
  "\u1E72": "U",
  "\u0172": "U",
  "\u1E76": "U",
  "\u1E74": "U",
  "\u0244": "U",
  "\u24CB": "V",
  "\uFF36": "V",
  "\u1E7C": "V",
  "\u1E7E": "V",
  "\u01B2": "V",
  "\uA75E": "V",
  "\u0245": "V",
  "\uA760": "VY",
  "\u24CC": "W",
  "\uFF37": "W",
  "\u1E80": "W",
  "\u1E82": "W",
  "\u0174": "W",
  "\u1E86": "W",
  "\u1E84": "W",
  "\u1E88": "W",
  "\u2C72": "W",
  "\u24CD": "X",
  "\uFF38": "X",
  "\u1E8A": "X",
  "\u1E8C": "X",
  "\u24CE": "Y",
  "\uFF39": "Y",
  "\u1EF2": "Y",
  "\u00DD": "Y",
  "\u0176": "Y",
  "\u1EF8": "Y",
  "\u0232": "Y",
  "\u1E8E": "Y",
  "\u0178": "Y",
  "\u1EF6": "Y",
  "\u1EF4": "Y",
  "\u01B3": "Y",
  "\u024E": "Y",
  "\u1EFE": "Y",
  "\u24CF": "Z",
  "\uFF3A": "Z",
  "\u0179": "Z",
  "\u1E90": "Z",
  "\u017B": "Z",
  "\u017D": "Z",
  "\u1E92": "Z",
  "\u1E94": "Z",
  "\u01B5": "Z",
  "\u0224": "Z",
  "\u2C7F": "Z",
  "\u2C6B": "Z",
  "\uA762": "Z",
  "\u24D0": "a",
  "\uFF41": "a",
  "\u1E9A": "a",
  "\u00E0": "a",
  "\u00E1": "a",
  "\u00E2": "a",
  "\u1EA7": "a",
  "\u1EA5": "a",
  "\u1EAB": "a",
  "\u1EA9": "a",
  "\u00E3": "a",
  "\u0101": "a",
  "\u0103": "a",
  "\u1EB1": "a",
  "\u1EAF": "a",
  "\u1EB5": "a",
  "\u1EB3": "a",
  "\u0227": "a",
  "\u01E1": "a",
  "\u00E4": "a",
  "\u01DF": "a",
  "\u1EA3": "a",
  "\u00E5": "a",
  "\u01FB": "a",
  "\u01CE": "a",
  "\u0201": "a",
  "\u0203": "a",
  "\u1EA1": "a",
  "\u1EAD": "a",
  "\u1EB7": "a",
  "\u1E01": "a",
  "\u0105": "a",
  "\u2C65": "a",
  "\u0250": "a",
  "\uA733": "aa",
  "\u00E6": "ae",
  "\u01FD": "ae",
  "\u01E3": "ae",
  "\uA735": "ao",
  "\uA737": "au",
  "\uA739": "av",
  "\uA73B": "av",
  "\uA73D": "ay",
  "\u24D1": "b",
  "\uFF42": "b",
  "\u1E03": "b",
  "\u1E05": "b",
  "\u1E07": "b",
  "\u0180": "b",
  "\u0183": "b",
  "\u0253": "b",
  "\u24D2": "c",
  "\uFF43": "c",
  "\u0107": "c",
  "\u0109": "c",
  "\u010B": "c",
  "\u010D": "c",
  "\u00E7": "c",
  "\u1E09": "c",
  "\u0188": "c",
  "\u023C": "c",
  "\uA73F": "c",
  "\u2184": "c",
  "\u24D3": "d",
  "\uFF44": "d",
  "\u1E0B": "d",
  "\u010F": "d",
  "\u1E0D": "d",
  "\u1E11": "d",
  "\u1E13": "d",
  "\u1E0F": "d",
  "\u0111": "d",
  "\u018C": "d",
  "\u0256": "d",
  "\u0257": "d",
  "\uA77A": "d",
  "\u01F3": "dz",
  "\u01C6": "dz",
  "\u24D4": "e",
  "\uFF45": "e",
  "\u00E8": "e",
  "\u00E9": "e",
  "\u00EA": "e",
  "\u1EC1": "e",
  "\u1EBF": "e",
  "\u1EC5": "e",
  "\u1EC3": "e",
  "\u1EBD": "e",
  "\u0113": "e",
  "\u1E15": "e",
  "\u1E17": "e",
  "\u0115": "e",
  "\u0117": "e",
  "\u00EB": "e",
  "\u1EBB": "e",
  "\u011B": "e",
  "\u0205": "e",
  "\u0207": "e",
  "\u1EB9": "e",
  "\u1EC7": "e",
  "\u0229": "e",
  "\u1E1D": "e",
  "\u0119": "e",
  "\u1E19": "e",
  "\u1E1B": "e",
  "\u0247": "e",
  "\u025B": "e",
  "\u01DD": "e",
  "\u24D5": "f",
  "\uFF46": "f",
  "\u1E1F": "f",
  "\u0192": "f",
  "\uA77C": "f",
  "\u24D6": "g",
  "\uFF47": "g",
  "\u01F5": "g",
  "\u011D": "g",
  "\u1E21": "g",
  "\u011F": "g",
  "\u0121": "g",
  "\u01E7": "g",
  "\u0123": "g",
  "\u01E5": "g",
  "\u0260": "g",
  "\uA7A1": "g",
  "\u1D79": "g",
  "\uA77F": "g",
  "\u24D7": "h",
  "\uFF48": "h",
  "\u0125": "h",
  "\u1E23": "h",
  "\u1E27": "h",
  "\u021F": "h",
  "\u1E25": "h",
  "\u1E29": "h",
  "\u1E2B": "h",
  "\u1E96": "h",
  "\u0127": "h",
  "\u2C68": "h",
  "\u2C76": "h",
  "\u0265": "h",
  "\u0195": "hv",
  "\u24D8": "i",
  "\uFF49": "i",
  "\u00EC": "i",
  "\u00ED": "i",
  "\u00EE": "i",
  "\u0129": "i",
  "\u012B": "i",
  "\u012D": "i",
  "\u00EF": "i",
  "\u1E2F": "i",
  "\u1EC9": "i",
  "\u01D0": "i",
  "\u0209": "i",
  "\u020B": "i",
  "\u1ECB": "i",
  "\u012F": "i",
  "\u1E2D": "i",
  "\u0268": "i",
  "\u0131": "i",
  "\u24D9": "j",
  "\uFF4A": "j",
  "\u0135": "j",
  "\u01F0": "j",
  "\u0249": "j",
  "\u24DA": "k",
  "\uFF4B": "k",
  "\u1E31": "k",
  "\u01E9": "k",
  "\u1E33": "k",
  "\u0137": "k",
  "\u1E35": "k",
  "\u0199": "k",
  "\u2C6A": "k",
  "\uA741": "k",
  "\uA743": "k",
  "\uA745": "k",
  "\uA7A3": "k",
  "\u24DB": "l",
  "\uFF4C": "l",
  "\u0140": "l",
  "\u013A": "l",
  "\u013E": "l",
  "\u1E37": "l",
  "\u1E39": "l",
  "\u013C": "l",
  "\u1E3D": "l",
  "\u1E3B": "l",
  "\u017F": "l",
  "\u0142": "l",
  "\u019A": "l",
  "\u026B": "l",
  "\u2C61": "l",
  "\uA749": "l",
  "\uA781": "l",
  "\uA747": "l",
  "\u01C9": "lj",
  "\u24DC": "m",
  "\uFF4D": "m",
  "\u1E3F": "m",
  "\u1E41": "m",
  "\u1E43": "m",
  "\u0271": "m",
  "\u026F": "m",
  "\u24DD": "n",
  "\uFF4E": "n",
  "\u01F9": "n",
  "\u0144": "n",
  "\u00F1": "n",
  "\u1E45": "n",
  "\u0148": "n",
  "\u1E47": "n",
  "\u0146": "n",
  "\u1E4B": "n",
  "\u1E49": "n",
  "\u019E": "n",
  "\u0272": "n",
  "\u0149": "n",
  "\uA791": "n",
  "\uA7A5": "n",
  "\u01CC": "nj",
  "\u24DE": "o",
  "\uFF4F": "o",
  "\u00F2": "o",
  "\u00F3": "o",
  "\u00F4": "o",
  "\u1ED3": "o",
  "\u1ED1": "o",
  "\u1ED7": "o",
  "\u1ED5": "o",
  "\u00F5": "o",
  "\u1E4D": "o",
  "\u022D": "o",
  "\u1E4F": "o",
  "\u014D": "o",
  "\u1E51": "o",
  "\u1E53": "o",
  "\u014F": "o",
  "\u022F": "o",
  "\u0231": "o",
  "\u00F6": "o",
  "\u022B": "o",
  "\u1ECF": "o",
  "\u0151": "o",
  "\u01D2": "o",
  "\u020D": "o",
  "\u020F": "o",
  "\u01A1": "o",
  "\u1EDD": "o",
  "\u1EDB": "o",
  "\u1EE1": "o",
  "\u1EDF": "o",
  "\u1EE3": "o",
  "\u1ECD": "o",
  "\u1ED9": "o",
  "\u01EB": "o",
  "\u01ED": "o",
  "\u00F8": "o",
  "\u01FF": "o",
  "\u0254": "o",
  "\uA74B": "o",
  "\uA74D": "o",
  "\u0275": "o",
  "\u01A3": "oi",
  "\u0223": "ou",
  "\uA74F": "oo",
  "\u24DF": "p",
  "\uFF50": "p",
  "\u1E55": "p",
  "\u1E57": "p",
  "\u01A5": "p",
  "\u1D7D": "p",
  "\uA751": "p",
  "\uA753": "p",
  "\uA755": "p",
  "\u24E0": "q",
  "\uFF51": "q",
  "\u024B": "q",
  "\uA757": "q",
  "\uA759": "q",
  "\u24E1": "r",
  "\uFF52": "r",
  "\u0155": "r",
  "\u1E59": "r",
  "\u0159": "r",
  "\u0211": "r",
  "\u0213": "r",
  "\u1E5B": "r",
  "\u1E5D": "r",
  "\u0157": "r",
  "\u1E5F": "r",
  "\u024D": "r",
  "\u027D": "r",
  "\uA75B": "r",
  "\uA7A7": "r",
  "\uA783": "r",
  "\u24E2": "s",
  "\uFF53": "s",
  "\u00DF": "s",
  "\u015B": "s",
  "\u1E65": "s",
  "\u015D": "s",
  "\u1E61": "s",
  "\u0161": "s",
  "\u1E67": "s",
  "\u1E63": "s",
  "\u1E69": "s",
  "\u0219": "s",
  "\u015F": "s",
  "\u023F": "s",
  "\uA7A9": "s",
  "\uA785": "s",
  "\u1E9B": "s",
  "\u24E3": "t",
  "\uFF54": "t",
  "\u1E6B": "t",
  "\u1E97": "t",
  "\u0165": "t",
  "\u1E6D": "t",
  "\u021B": "t",
  "\u0163": "t",
  "\u1E71": "t",
  "\u1E6F": "t",
  "\u0167": "t",
  "\u01AD": "t",
  "\u0288": "t",
  "\u2C66": "t",
  "\uA787": "t",
  "\uA729": "tz",
  "\u24E4": "u",
  "\uFF55": "u",
  "\u00F9": "u",
  "\u00FA": "u",
  "\u00FB": "u",
  "\u0169": "u",
  "\u1E79": "u",
  "\u016B": "u",
  "\u1E7B": "u",
  "\u016D": "u",
  "\u00FC": "u",
  "\u01DC": "u",
  "\u01D8": "u",
  "\u01D6": "u",
  "\u01DA": "u",
  "\u1EE7": "u",
  "\u016F": "u",
  "\u0171": "u",
  "\u01D4": "u",
  "\u0215": "u",
  "\u0217": "u",
  "\u01B0": "u",
  "\u1EEB": "u",
  "\u1EE9": "u",
  "\u1EEF": "u",
  "\u1EED": "u",
  "\u1EF1": "u",
  "\u1EE5": "u",
  "\u1E73": "u",
  "\u0173": "u",
  "\u1E77": "u",
  "\u1E75": "u",
  "\u0289": "u",
  "\u24E5": "v",
  "\uFF56": "v",
  "\u1E7D": "v",
  "\u1E7F": "v",
  "\u028B": "v",
  "\uA75F": "v",
  "\u028C": "v",
  "\uA761": "vy",
  "\u24E6": "w",
  "\uFF57": "w",
  "\u1E81": "w",
  "\u1E83": "w",
  "\u0175": "w",
  "\u1E87": "w",
  "\u1E85": "w",
  "\u1E98": "w",
  "\u1E89": "w",
  "\u2C73": "w",
  "\u24E7": "x",
  "\uFF58": "x",
  "\u1E8B": "x",
  "\u1E8D": "x",
  "\u24E8": "y",
  "\uFF59": "y",
  "\u1EF3": "y",
  "\u00FD": "y",
  "\u0177": "y",
  "\u1EF9": "y",
  "\u0233": "y",
  "\u1E8F": "y",
  "\u00FF": "y",
  "\u1EF7": "y",
  "\u1E99": "y",
  "\u1EF5": "y",
  "\u01B4": "y",
  "\u024F": "y",
  "\u1EFF": "y",
  "\u24E9": "z",
  "\uFF5A": "z",
  "\u017A": "z",
  "\u1E91": "z",
  "\u017C": "z",
  "\u017E": "z",
  "\u1E93": "z",
  "\u1E95": "z",
  "\u01B6": "z",
  "\u0225": "z",
  "\u0240": "z",
  "\u2C6C": "z",
  "\uA763": "z",
  "\u0386": "\u0391",
  "\u0388": "\u0395",
  "\u0389": "\u0397",
  "\u038A": "\u0399",
  "\u03AA": "\u0399",
  "\u038C": "\u039F",
  "\u038E": "\u03A5",
  "\u03AB": "\u03A5",
  "\u038F": "\u03A9",
  "\u03AC": "\u03B1",
  "\u03AD": "\u03B5",
  "\u03AE": "\u03B7",
  "\u03AF": "\u03B9",
  "\u03CA": "\u03B9",
  "\u0390": "\u03B9",
  "\u03CC": "\u03BF",
  "\u03CD": "\u03C5",
  "\u03CB": "\u03C5",
  "\u03B0": "\u03C5",
  "\u03C9": "\u03C9",
  "\u03C2": "\u03C3",
};

/**
 * Removes diacritics from a string for normalized searching
 * @param {string} str - String to normalize
 * @returns {string} Normalized string without diacritics
 */
function removeDiacritics(str) {
  return str.replace(/[^\u0000-\u007E]/g, (char) => diacritics[char] || char);
}

/**
 * SearchManager - Manages search/filter functionality
 * Handles search logic and filtering results
 */


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

/**
 * ResultsAdapter - Manages results display
 * Coordinates results rendering and selection
 */


class ResultsAdapter extends BaseAdapter {
  constructor(instance, options) {
    super(instance, options);

    this.results = new ResultsList(options);
    this.searchManager = new SearchManager(options);
    this.dataAdapter = null;
    this.dropdownAdapter = null;
    this.ajaxAdapter = null;
    this.currentSearchTerm = "";
    this.currentPage = 1;
    this.hasMore = false;
    this.isLoadingMore = false;
    this.accumulatedResults = [];
    this.currentSearchToken = null; // Token to prevent race conditions

    // Store timeout references for proper cleanup
    this._loadMoreTimeout = null;
    this._limitMessageTimeout = null;
    this._errorMessageTimeout = null;

    // Store event handler references for proper cleanup
    this._clickHandler = null;
    this._mouseoverHandler = null;
    this._scrollHandler = null;
    this.resultsContainer = null;
  }

  /**
   * Bind the adapter
   * @param {HTMLElement} dropdownContainer - Dropdown container
   * @param {DataAdapter} dataAdapter - Data adapter
   * @param {DropdownAdapter} dropdownAdapter - Dropdown adapter
   * @param {AjaxAdapter} ajaxAdapter - Optional AJAX adapter
   */
  bind(dropdownContainer, dataAdapter, dropdownAdapter, ajaxAdapter = null) {
    this.dataAdapter = dataAdapter;
    this.dropdownAdapter = dropdownAdapter;
    this.ajaxAdapter = ajaxAdapter;

    // Render results component
    const resultsElement = this.results.render();
    dropdownContainer.appendChild(resultsElement);

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
    const resultsContainer = this.results.getContainer();
    this.resultsContainer = resultsContainer;

    // Listen to AJAX events
    this.instance.on(EVENTS.AJAX_LOADING, () => {
      this.showLoading();
    });

    this.instance.on(EVENTS.AJAX_SUCCESS, () => {
      this.hideLoading();
    });

    this.instance.on(EVENTS.AJAX_ERROR, (data) => {
      this.hideLoading();
      this.showError(data.error);
    });

    // Click on result item - store handler reference for cleanup
    this._clickHandler = (e) => {
      const resultEl = e.target.closest(".vs-result");
      if (!resultEl) return;

      parseInt(resultEl.dataset.index, 10);
      const id = resultEl.dataset.id;

      // Don't select disabled items
      if (resultEl.classList.contains("vs-result--disabled")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Find the item (search recursively in groups)
      const allResults = this.dataAdapter.query({ term: "" });
      const item = this._findItemById(allResults, id);

      if (item) {
        // Prevent default to avoid any unwanted behavior
        e.preventDefault();
        e.stopPropagation();
        this.selectItem(item);
      }
    };
    resultsContainer.addEventListener("click", this._clickHandler);

    // Hover on result item - store handler reference for cleanup
    this._mouseoverHandler = (e) => {
      const resultEl = e.target.closest(".vs-result");
      if (!resultEl) return;

      const index = parseInt(resultEl.dataset.index, 10);
      this.results.highlight(index);
    };
    resultsContainer.addEventListener("mouseover", this._mouseoverHandler);

    // Listen to data changes
    this.instance.on(EVENTS.QUERY, (data) => {
      this.update(data.term);
    });

    this.instance.on(EVENTS.SELECT, () => {
      this.update();
    });

    this.instance.on(EVENTS.UNSELECT, () => {
      this.update();
    });

    // Listen to selection limit reached
    this.instance.on(EVENTS.SELECTION_LIMIT_REACHED, (data) => {
      this._showLimitMessage(data.message);
    });

    // Scroll detection for infinite scroll (AJAX only) - store handler reference for cleanup
    if (this.ajaxAdapter) {
      this._scrollHandler = () => {
        this._handleScroll();
      };
      resultsContainer.addEventListener("scroll", this._scrollHandler);
    }
  }

  /**
   * Update results display
   * @param {string} term - Search term
   */
  update(term = "") {
    if (!this.dataAdapter) return;

    // If AJAX adapter is configured, use it for remote data
    if (this.ajaxAdapter) {
      this._updateWithAjax(term);
    } else {
      this._updateWithLocalData(term);
    }
  }

  /**
   * Update results with local data (no AJAX)
   * @param {string} term - Search term
   * @private
   */
  _updateWithLocalData(term) {
    this.currentSearchTerm = term;

    // Get all data
    const allData = this.dataAdapter.query({ term: "" });

    // Filter using SearchManager
    let filteredResults = this.searchManager.search(allData, term);

    // Check if tagging is enabled
    const tagsEnabled = this.options.get("tags");

    // Add "create tag" option if enabled and term is not empty
    if (tagsEnabled && term && term.trim()) {
      const createTag = this.options.get("createTag");
      const tag = createTag({ term: term.trim() });

      if (tag) {
        // Check if tag already exists in results
        const tagExists = filteredResults.some(
          (item) =>
            String(item.id).toLowerCase() === String(tag.id).toLowerCase(),
        );

        if (!tagExists) {
          const insertTag = this.options.get("insertTag");
          // Create a copy to avoid mutating the original
          filteredResults = [...filteredResults];
          insertTag(filteredResults, tag);

          // Mark as tag for special rendering
          tag._isTag = true;
        }
      }
    }

    // Update results list
    this.results.update(filteredResults);

    // Auto-highlight first non-disabled item when there are results
    if (filteredResults && filteredResults.length > 0) {
      this._autoHighlightFirst(filteredResults);
    }

    // Emit results event for accessibility announcements
    this.instance.emit(EVENTS.RESULTS, { results: filteredResults });
  }

  /**
   * Update results with AJAX data
   * @param {string} term - Search term
   * @param {boolean} append - Whether to append results (pagination) or replace
   * @private
   */
  _updateWithAjax(term, append = false) {
    // Reset pagination if search term changed
    if (term !== this.currentSearchTerm) {
      this.currentPage = 1;
      this.accumulatedResults = [];
      append = false;
    }

    this.currentSearchTerm = term;

    // Generate unique token for this search to prevent race conditions
    // If a new search starts before this one completes, this token will be invalidated
    const searchToken = Symbol("search");
    this.currentSearchToken = searchToken;

    // Query AJAX adapter (returns a promise)
    this.ajaxAdapter
      .query({ term, page: this.currentPage })
      .then((response) => {
        // Check if this search is still valid (not superseded by a newer search)
        if (this.currentSearchToken !== searchToken) {
          // This search has been superseded - ignore results
          return;
        }

        const { results, pagination } = response;

        // Update pagination state
        this.hasMore = pagination && pagination.more ? true : false;

        // Accumulate or replace results
        if (append && this.currentPage > 1) {
          this.accumulatedResults = [...this.accumulatedResults, ...results];
        } else {
          this.accumulatedResults = results;
        }

        // Update DataAdapter with all accumulated results (for selection tracking)
        this.dataAdapter.setData(this.accumulatedResults);

        // Update results list
        this.results.update(this.accumulatedResults);

        // Auto-highlight first non-disabled item when there are results
        if (
          this.accumulatedResults &&
          this.accumulatedResults.length > 0 &&
          !append
        ) {
          this._autoHighlightFirst(this.accumulatedResults);
        }

        // Emit results event for accessibility announcements
        this.instance.emit(EVENTS.RESULTS, {
          results: this.accumulatedResults,
        });
      })
      .catch((error) => {
        // Check if this search is still valid before showing error
        if (this.currentSearchToken !== searchToken) {
          // This search has been superseded - ignore error
          return;
        }

        console.error("AJAX query error:", error);
        // On error, show empty results
        this.results.update([]);
        this.instance.emit(EVENTS.RESULTS, { results: [] });
      });
  }

  /**
   * Handle scroll event for infinite scroll
   * @private
   */
  _handleScroll() {
    if (!this.ajaxAdapter || !this.hasMore || this.isLoadingMore) {
      return;
    }

    const resultsContainer = this.results.getContainer();
    const scrollTop = resultsContainer.scrollTop;
    const scrollHeight = resultsContainer.scrollHeight;
    const clientHeight = resultsContainer.clientHeight;

    // Check if scrolled near bottom (within 50px)
    const threshold = 50;
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      this.loadMore();
    }
  }

  /**
   * Load more results (next page)
   */
  loadMore() {
    if (!this.ajaxAdapter || !this.hasMore || this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    this.currentPage++;

    // Show loading more indicator
    this.showLoadingMore();

    // Update with append=true to add to existing results
    this._updateWithAjax(this.currentSearchTerm, true);

    // Clear any existing timeout
    if (this._loadMoreTimeout) {
      clearTimeout(this._loadMoreTimeout);
    }

    // Hide loading more indicator when done
    this._loadMoreTimeout = setTimeout(() => {
      this.hideLoadingMore();
      this.isLoadingMore = false;
      this._loadMoreTimeout = null;
    }, 500);
  }

  /**
   * Show "loading more" indicator
   */
  showLoadingMore() {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    // Remove any existing indicator
    this.hideLoadingMore();

    const language = this.options.get("language");
    const loadingMoreMessage =
      language.loadingMore || "Loading more results...";

    const loadingMoreEl = document.createElement("div");
    loadingMoreEl.className = "vs-results__loading-more";
    loadingMoreEl.setAttribute("role", "status");
    loadingMoreEl.setAttribute("aria-live", "polite");
    loadingMoreEl.textContent = loadingMoreMessage;

    resultsContainer.appendChild(loadingMoreEl);
  }

  /**
   * Hide "loading more" indicator
   */
  hideLoadingMore() {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    const loadingMoreEl = resultsContainer.querySelector(
      ".vs-results__loading-more",
    );
    if (loadingMoreEl) {
      loadingMoreEl.remove();
    }
  }

  /**
   * Find item by ID, searching recursively in groups
   * @param {Array} items - Items to search
   * @param {string} id - Item ID to find
   * @returns {Object|null} Found item or null
   * @private
   */
  _findItemById(items, id) {
    for (const item of items) {
      // Check if this item matches (convert both to string for comparison)
      // This handles cases where item.id might be a number but dataset.id is always a string
      if (String(item.id) === String(id)) {
        return item;
      }

      // If it's a group, search in children
      if (item.children && Array.isArray(item.children)) {
        const found = this._findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  /**
   * Auto-highlight first non-disabled item
   * @param {Array} results - Filtered results
   * @private
   */
  _autoHighlightFirst(results) {
    // Find first non-disabled item
    for (let i = 0; i < results.length; i++) {
      const item = results[i];

      // Skip groups - look into children
      if (item.children && Array.isArray(item.children)) {
        // For groups, find first non-disabled child
        for (let j = 0; j < item.children.length; j++) {
          if (!item.children[j].disabled) {
            // Calculate the actual index in the flattened results
            const flatIndex = this._getFlatIndexForGroupChild(results, i, j);
            this.results.highlight(flatIndex);

            // Update ARIA activedescendant
            if (this.instance.accessibilityManager) {
              this.instance.accessibilityManager.updateActiveDescendant(
                flatIndex,
              );
            }
            return;
          }
        }
      } else {
        // Regular item - highlight if not disabled
        if (!item.disabled) {
          this.results.highlight(i);

          // Update ARIA activedescendant
          if (this.instance.accessibilityManager) {
            this.instance.accessibilityManager.updateActiveDescendant(i);
          }
          return;
        }
      }
    }
  }

  /**
   * Get flat index for a child within a group
   * @param {Array} results - All results
   * @param {number} groupIndex - Group index
   * @param {number} childIndex - Child index within group
   * @returns {number} Flat index
   * @private
   */
  _getFlatIndexForGroupChild(results, groupIndex, childIndex) {
    let flatIndex = 0;

    for (let i = 0; i < groupIndex; i++) {
      if (results[i].children) {
        flatIndex += results[i].children.length;
      } else {
        flatIndex++;
      }
    }

    flatIndex += childIndex;
    return flatIndex;
  }

  /**
   * Select an item
   * @param {Object} item - Item to select
   */
  selectItem(item) {
    if (!this.dataAdapter) return;

    // Try to select the item - returns false if limit reached or already selected
    const selectionSuccess = this.dataAdapter.select(item);

    const isMultiple = this.options.get("multiple");

    // For multi-select: always manage focus and UI, even if selection failed
    if (isMultiple) {
      // If selection failed (limit reached or already selected), still return focus
      if (!selectionSuccess) {
        // Re-focus search input so ESC and other keyboard controls work
        if (this.dropdownAdapter && this.dropdownAdapter.searchBox) {
          setTimeout(() => {
            this.dropdownAdapter.searchBox.focus();
          }, 10);
        }
        return;
      }

      // Selection was successful - proceed with normal flow
      // Clear search box
      if (this.dropdownAdapter && this.dropdownAdapter.searchBox) {
        this.dropdownAdapter.searchBox.clear();
      }

      // Refresh results to show all items again
      this.update("");

      // Re-focus search input for next selection
      if (this.dropdownAdapter && this.dropdownAdapter.searchBox) {
        setTimeout(() => {
          this.dropdownAdapter.searchBox.focus();
        }, 10);
      }
    } else {
      // Single select: only close if selection was successful
      if (selectionSuccess) {
        const closeOnSelect = this.options.get("closeOnSelect");
        if (closeOnSelect) {
          this.instance.close();
        }
      }
    }
  }

  /**
   * Clear results
   */
  clear() {
    this.results.clear();
  }

  /**
   * Show selection limit message
   * @param {string} message - Message to display
   * @private
   */
  _showLimitMessage(message) {
    const resultsContainer = this.results.getContainer();

    // Clear any existing timeout
    if (this._limitMessageTimeout) {
      clearTimeout(this._limitMessageTimeout);
      this._limitMessageTimeout = null;
    }

    // Remove any existing message
    const existingMessage = resultsContainer.querySelector(
      ".vs-results__limit-message",
    );
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement("div");
    messageEl.className = "vs-results__limit-message";
    messageEl.textContent = message;
    messageEl.setAttribute("role", "alert");

    // Insert at the top of results
    resultsContainer.insertBefore(messageEl, resultsContainer.firstChild);

    // Auto-remove after 3 seconds
    this._limitMessageTimeout = setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
      this._limitMessageTimeout = null;
    }, 3000);
  }

  /**
   * Show loading state
   */
  showLoading() {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    // Remove any existing loading message
    this.hideLoading();

    const language = this.options.get("language");
    const loadingMessage = language.loading || "Loading...";

    // Create loading element
    const loadingEl = document.createElement("div");
    loadingEl.className = "vs-results__loading";
    loadingEl.setAttribute("role", "status");
    loadingEl.setAttribute("aria-live", "polite");
    loadingEl.textContent = loadingMessage;

    resultsContainer.appendChild(loadingEl);
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    const loadingEl = resultsContainer.querySelector(".vs-results__loading");
    if (loadingEl) {
      loadingEl.remove();
    }
  }

  /**
   * Show error message
   * @param {Error} error - Error object
   */
  showError(error) {
    const resultsContainer = this.results.getContainer();
    if (!resultsContainer) return;

    // Clear any existing timeout
    if (this._errorMessageTimeout) {
      clearTimeout(this._errorMessageTimeout);
      this._errorMessageTimeout = null;
    }

    // Remove any existing error message
    const existingError = resultsContainer.querySelector(".vs-results__error");
    if (existingError) {
      existingError.remove();
    }

    const language = this.options.get("language");
    const errorMessage =
      language.errorLoading || "The results could not be loaded";

    // Create error element
    const errorEl = document.createElement("div");
    errorEl.className = "vs-results__error";
    errorEl.setAttribute("role", "alert");
    errorEl.textContent = errorMessage;

    resultsContainer.appendChild(errorEl);

    // Auto-remove after 5 seconds
    this._errorMessageTimeout = setTimeout(() => {
      if (errorEl.parentNode) {
        errorEl.remove();
      }
      this._errorMessageTimeout = null;
    }, 5000);
  }

  /**
   * Destroy the adapter
   */
  destroy() {
    // Clear all pending timeouts to prevent memory leaks and errors
    if (this._loadMoreTimeout) {
      clearTimeout(this._loadMoreTimeout);
      this._loadMoreTimeout = null;
    }

    if (this._limitMessageTimeout) {
      clearTimeout(this._limitMessageTimeout);
      this._limitMessageTimeout = null;
    }

    if (this._errorMessageTimeout) {
      clearTimeout(this._errorMessageTimeout);
      this._errorMessageTimeout = null;
    }

    // Properly remove event listeners to prevent memory leaks
    if (this.resultsContainer) {
      if (this._clickHandler) {
        this.resultsContainer.removeEventListener("click", this._clickHandler);
        this._clickHandler = null;
      }

      if (this._mouseoverHandler) {
        this.resultsContainer.removeEventListener(
          "mouseover",
          this._mouseoverHandler,
        );
        this._mouseoverHandler = null;
      }

      if (this._scrollHandler) {
        this.resultsContainer.removeEventListener(
          "scroll",
          this._scrollHandler,
        );
        this._scrollHandler = null;
      }

      this.resultsContainer = null;
    }

    this.results.destroy();
  }
}

/**
 * Keyboard key codes for vanilla-smart-select
 */

const KEYS = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
};

/**
 * KeyboardManager - Manages keyboard navigation
 * Handles keyboard events for accessibility and navigation
 */


class KeyboardManager {
  constructor(instance, options) {
    this.instance = instance;
    this.options = options;
    this.isEnabled = true;

    // Store event handler references for proper cleanup
    this._selectionKeydownHandler = null;
    this._searchKeydownHandler = null;
  }

  /**
   * Bind keyboard events
   * @param {HTMLElement} selectionElement - Selection container
   * @param {HTMLElement} searchInput - Search input (if searchable)
   * @param {Object} resultsAdapter - Results adapter
   */
  bind(selectionElement, searchInput, resultsAdapter) {
    this.selectionElement = selectionElement;
    this.searchInput = searchInput;
    this.resultsAdapter = resultsAdapter;

    // Bind events
    this._bindSelectionEvents();
    if (this.searchInput) {
      this._bindSearchEvents();
    }
  }

  /**
   * Bind keyboard events to selection element
   * @private
   */
  _bindSelectionEvents() {
    // Store handler reference for cleanup
    this._selectionKeydownHandler = (e) => {
      this._handleSelectionKeydown(e);
    };

    this.selectionElement.addEventListener(
      "keydown",
      this._selectionKeydownHandler,
    );
  }

  /**
   * Bind keyboard events to search input
   * @private
   */
  _bindSearchEvents() {
    // Store handler reference for cleanup
    this._searchKeydownHandler = (e) => {
      this._handleSearchKeydown(e);
    };

    this.searchInput.addEventListener("keydown", this._searchKeydownHandler);
  }

  /**
   * Handle keydown on selection element
   * @param {KeyboardEvent} e - Keyboard event
   * @private
   */
  _handleSelectionKeydown(e) {
    if (!this.isEnabled) return;

    const key = e.which || e.keyCode;

    switch (key) {
      case KEYS.ENTER:
      case KEYS.SPACE:
        // Open dropdown
        e.preventDefault();
        this.instance.toggle();
        break;

      case KEYS.ESC:
        // Close dropdown
        e.preventDefault();
        this.instance.close();
        break;

      case KEYS.UP:
      case KEYS.DOWN:
        // Open dropdown and navigate
        e.preventDefault();
        if (!this.instance.isOpen()) {
          this.instance.open();
        } else {
          this._navigate(key === KEYS.UP ? -1 : 1);
        }
        break;

      case KEYS.TAB:
        // Allow Tab to work normally on selection element
        // (It will only trigger when dropdown is closed)
        // When dropdown is open, focus is in search input, not here
        break;
    }
  }

  /**
   * Handle keydown on search input
   * @param {KeyboardEvent} e - Keyboard event
   * @private
   */
  _handleSearchKeydown(e) {
    if (!this.isEnabled) return;

    const key = e.which || e.keyCode;

    switch (key) {
      case KEYS.ENTER:
        // Select highlighted item
        e.preventDefault();
        this._selectHighlighted();
        break;

      case KEYS.ESC:
        // Close dropdown
        e.preventDefault();
        this.instance.close();
        break;

      case KEYS.UP:
        // Navigate up
        e.preventDefault();
        this._navigate(-1);
        break;

      case KEYS.DOWN:
        // Navigate down
        e.preventDefault();
        this._navigate(1);
        break;

      case KEYS.TAB:
        // Prevent Tab from leaving dropdown when open
        // User must explicitly close with Enter (select) or ESC (cancel)
        e.preventDefault();
        break;

      case KEYS.HOME:
        // First item
        e.preventDefault();
        this._navigateToFirst();
        break;

      case KEYS.END:
        // Last item
        e.preventDefault();
        this._navigateToLast();
        break;
    }
  }

  /**
   * Count total rendered items (including items in groups)
   * @param {Array} items - Results array (may contain groups)
   * @returns {number} Total count of rendered items
   * @private
   */
  _countTotalItems(items) {
    let count = 0;
    for (const item of items) {
      if (item.children && Array.isArray(item.children)) {
        count += item.children.length; // Count children, not the group itself
      } else {
        count++;
      }
    }
    return count;
  }

  /**
   * Navigate through results
   * @param {number} direction - Direction (-1 for up, 1 for down)
   * @private
   */
  _navigate(direction) {
    if (!this.resultsAdapter) return;

    const results = this.resultsAdapter.results;
    const currentIndex = results.highlightedIndex;
    const totalResults = this._countTotalItems(results.results);

    if (totalResults === 0) return;

    let newIndex = currentIndex + direction;

    // Wrap around
    if (newIndex < 0) {
      newIndex = totalResults - 1;
    } else if (newIndex >= totalResults) {
      newIndex = 0;
    }

    // Get flat list of rendered items for checking disabled state
    const renderedItems = this._getFlatRenderedItems(results.results);

    // Skip disabled items
    while (renderedItems[newIndex]?.disabled) {
      newIndex += direction;

      // Wrap around again if needed
      if (newIndex < 0) {
        newIndex = totalResults - 1;
      } else if (newIndex >= totalResults) {
        newIndex = 0;
      }

      // Prevent infinite loop if all items are disabled
      if (newIndex === currentIndex) {
        return;
      }
    }

    results.highlight(newIndex);

    // Update ARIA activedescendant for accessibility
    if (this.instance.accessibilityManager) {
      this.instance.accessibilityManager.updateActiveDescendant(newIndex);
    }
  }

  /**
   * Get flat list of rendered items (excluding group headers)
   * @param {Array} items - Results array (may contain groups)
   * @returns {Array} Flat array of items
   * @private
   */
  _getFlatRenderedItems(items) {
    const flat = [];
    for (const item of items) {
      if (item.children && Array.isArray(item.children)) {
        flat.push(...item.children); // Add children, not the group
      } else {
        flat.push(item);
      }
    }
    return flat;
  }

  /**
   * Navigate to first item
   * @private
   */
  _navigateToFirst() {
    if (!this.resultsAdapter) return;

    const results = this.resultsAdapter.results;
    const renderedItems = this._getFlatRenderedItems(results.results);
    const totalResults = renderedItems.length;

    if (totalResults === 0) return;

    // Find first non-disabled item
    for (let i = 0; i < totalResults; i++) {
      if (!renderedItems[i]?.disabled) {
        results.highlight(i);

        // Update ARIA activedescendant for accessibility
        if (this.instance.accessibilityManager) {
          this.instance.accessibilityManager.updateActiveDescendant(i);
        }
        break;
      }
    }
  }

  /**
   * Navigate to last item
   * @private
   */
  _navigateToLast() {
    if (!this.resultsAdapter) return;

    const results = this.resultsAdapter.results;
    const renderedItems = this._getFlatRenderedItems(results.results);
    const totalResults = renderedItems.length;

    if (totalResults === 0) return;

    // Find last non-disabled item
    for (let i = totalResults - 1; i >= 0; i--) {
      if (!renderedItems[i]?.disabled) {
        results.highlight(i);

        // Update ARIA activedescendant for accessibility
        if (this.instance.accessibilityManager) {
          this.instance.accessibilityManager.updateActiveDescendant(i);
        }
        break;
      }
    }
  }

  /**
   * Select currently highlighted item
   * @private
   */
  _selectHighlighted() {
    if (!this.resultsAdapter) return;

    const highlighted = this.resultsAdapter.results.getHighlighted();
    if (highlighted) {
      this.resultsAdapter.selectItem(highlighted);
    }
  }

  /**
   * Enable keyboard navigation
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disable keyboard navigation
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * Destroy the manager
   */
  destroy() {
    this.isEnabled = false;

    // Properly remove event listeners to prevent memory leaks
    if (this.selectionElement && this._selectionKeydownHandler) {
      this.selectionElement.removeEventListener(
        "keydown",
        this._selectionKeydownHandler,
      );
      this._selectionKeydownHandler = null;
    }

    if (this.searchInput && this._searchKeydownHandler) {
      this.searchInput.removeEventListener(
        "keydown",
        this._searchKeydownHandler,
      );
      this._searchKeydownHandler = null;
    }

    // Clear references
    this.selectionElement = null;
    this.searchInput = null;
    this.resultsAdapter = null;
  }
}

/**
 * AccessibilityManager - Manages ARIA attributes and screen reader support
 * Handles accessibility features for improved screen reader experience
 */

class AccessibilityManager {
  constructor(instance, options) {
    this.instance = instance;
    this.options = options;
    this.liveRegion = null;
  }

  /**
   * Initialize accessibility features
   * @param {HTMLElement} selectionElement - Selection container
   * @param {HTMLElement} dropdownElement - Dropdown container
   * @param {HTMLElement} resultsElement - Results container
   */
  bind(selectionElement, dropdownElement, resultsElement) {
    this.selectionElement = selectionElement;
    this.dropdownElement = dropdownElement;
    this.resultsElement = resultsElement;

    // Create live region for announcements
    this._createLiveRegion();

    // Setup ARIA attributes
    this._setupARIA();
  }

  /**
   * Create live region for screen reader announcements
   * @private
   */
  _createLiveRegion() {
    this.liveRegion = document.createElement("div");
    this.liveRegion.setAttribute("role", "status");
    this.liveRegion.setAttribute("aria-live", "polite");
    this.liveRegion.setAttribute("aria-atomic", "true");
    this.liveRegion.className = "vs-sr-only";
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Setup initial ARIA attributes
   * @private
   */
  _setupARIA() {
    if (!this.selectionElement || !this.dropdownElement || !this.resultsElement)
      return;

    // Generate unique IDs
    const baseId = `vs-${Math.random().toString(36).substr(2, 9)}`;
    const resultsId = `${baseId}-results`;

    // Set IDs
    this.resultsElement.setAttribute("id", resultsId);

    // Selection element ARIA
    this.selectionElement.setAttribute("role", "combobox");
    this.selectionElement.setAttribute("aria-haspopup", "listbox");
    this.selectionElement.setAttribute("aria-expanded", "false");
    this.selectionElement.setAttribute("aria-owns", resultsId);
    this.selectionElement.setAttribute("aria-controls", resultsId);

    // Dropdown ARIA
    this.dropdownElement.setAttribute("role", "region");
    const language = this.options.get("language");
    this.dropdownElement.setAttribute(
      "aria-label",
      language.selectOptions || "Select options",
    );

    // Results ARIA
    this.resultsElement.setAttribute("role", "listbox");
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   */
  announce(message) {
    if (!this.liveRegion) return;

    // Clear previous message
    this.liveRegion.textContent = "";

    // Set new message with a small delay to ensure screen reader picks it up
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Announce results count
   * @param {number} count - Number of results
   */
  announceResultsCount(count) {
    const language = this.options.get("language");

    if (count === 0) {
      this.announce(language.noResultsAvailable);
    } else if (count === 1) {
      this.announce(language.resultsAvailable?.one || "1 result available");
    } else {
      const message =
        typeof language.resultsAvailable?.other === "function"
          ? language.resultsAvailable.other({ count })
          : `${count} results available`;
      this.announce(message);
    }
  }

  /**
   * Announce selection
   * @param {Object} item - Selected item
   */
  announceSelection(item) {
    if (!item) return;

    const language = this.options.get("language");
    const message =
      typeof language.selected === "function"
        ? language.selected({ text: item.text })
        : `Selected: ${item.text}`;

    this.announce(message);
  }

  /**
   * Update aria-activedescendant when navigating
   * @param {number} index - Index of highlighted item
   */
  updateActiveDescendant(index) {
    if (!this.selectionElement || !this.resultsElement) return;

    const results = this.resultsElement.querySelectorAll(".vs-result");

    if (index >= 0 && index < results.length) {
      const activeItem = results[index];

      // Ensure item has an ID
      if (!activeItem.id) {
        activeItem.id = `vs-result-${index}`;
      }

      this.selectionElement.setAttribute(
        "aria-activedescendant",
        activeItem.id,
      );
    } else {
      this.selectionElement.removeAttribute("aria-activedescendant");
    }
  }

  /**
   * Update ARIA when dropdown opens
   */
  onOpen() {
    if (this.selectionElement) {
      this.selectionElement.setAttribute("aria-expanded", "true");
    }
  }

  /**
   * Update ARIA when dropdown closes
   */
  onClose() {
    if (this.selectionElement) {
      this.selectionElement.setAttribute("aria-expanded", "false");
      this.selectionElement.removeAttribute("aria-activedescendant");
    }
  }

  /**
   * Destroy the manager
   */
  destroy() {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
    this.liveRegion = null;
    this.selectionElement = null;
    this.dropdownElement = null;
    this.resultsElement = null;
  }
}

/**
 * VanillaSmartSelect - Main class and public API
 * Modern JavaScript dropdown enhancement without jQuery
 */


class VanillaSmartSelect extends EventEmitter {
  constructor(element, options = {}) {
    super();

    // Get the element
    this.element = this._getElement(element);
    if (!this.element) {
      throw new Error("Invalid element provided to VanillaSmartSelect");
    }

    // Hide original select to prevent FOUC (Flash of Unstyled Content)
    this.element.setAttribute("data-vs-initializing", "true");

    // Store reference to instance on element
    if (this.element._vanillaSmartSelect) {
      this.element._vanillaSmartSelect.destroy();
    }
    this.element._vanillaSmartSelect = this;

    // Initialize options
    this.options = new Options(options);

    // State
    this.isDisabled = false;
    this._isInitialized = false;

    // Containers (will be created during init)
    this.container = null;
    this.dropdown = null;

    // Adapters (will be initialized later)
    this.dataAdapter = null;
    this.ajaxAdapter = null;
    this.selectionAdapter = null;
    this.dropdownAdapter = null;
    this.resultsAdapter = null;

    // Managers (will be initialized later)
    this.keyboardManager = null;
    this.accessibilityManager = null;

    // Initialize
    this._init();
  }

  /**
   * Get HTML element from selector or element
   * @param {string|HTMLElement} element - Selector or element
   * @returns {HTMLElement|null} HTML element
   * @private
   */
  _getElement(element) {
    if (typeof element === "string") {
      return querySelector(element);
    }
    if (element instanceof HTMLElement) {
      return element;
    }
    return null;
  }

  /**
   * Initialize the select
   * @private
   */
  _init() {
    // Verify element is a select element
    if (this.element.tagName !== "SELECT") {
      throw new Error(
        "VanillaSmartSelect must be initialized on a <select> element",
      );
    }

    // Check if already initialized
    if (this._isInitialized) {
      return;
    }

    // Apply disabled state from element
    if (this.element.disabled) {
      this.options.set("disabled", true);
      this.isDisabled = true;
    }

    // Apply multiple state from element
    if (this.element.multiple) {
      this.options.set("multiple", true);
    }

    this._createContainers();
    this._initializeAdapters();
    this._initializeManagers();
    this._bindEvents();
    this._loadInitialData();

    // Mark as initialized
    this._isInitialized = true;

    // Remove initializing attribute - select is now fully transformed
    this.element.removeAttribute("data-vs-initializing");

    // Emit init event
    this.emit(EVENTS.INIT, { instance: this });
    this.trigger(this.element, EVENTS.INIT, { instance: this });

    // Call onInit callback if provided
    const onInit = this.options.get("onInit");
    if (typeof onInit === "function") {
      onInit.call(this);
    }
  }

  /**
   * Create container elements
   * @private
   */
  _createContainers() {
    // Create main container element
    this.container = document.createElement("div");
    this.container.className = `vs-container vs-container--${this.options.get("theme")}`;

    // Add custom CSS class if provided
    const customClass = this.options.get("containerCssClass");
    if (customClass) {
      this.container.className += ` ${customClass}`;
    }

    // Set width
    this.container.style.width = this.options.get("width");

    // Insert after original select
    this.element.parentNode.insertBefore(
      this.container,
      this.element.nextSibling,
    );

    // Hide original select
    this.element.style.display = "none";
    this.element.setAttribute("aria-hidden", "true");
  }

  /**
   * Initialize adapters
   * @private
   */
  _initializeAdapters() {
    // Initialize DataAdapter
    this.dataAdapter = new DataAdapter(this, this.options);
    this.dataAdapter.init();

    // Initialize AjaxAdapter if ajax option is configured
    const ajaxConfig = this.options.get("ajax");
    if (ajaxConfig) {
      this.ajaxAdapter = new AjaxAdapter(this, this.options, this.dataAdapter);
    }

    // Initialize SelectionAdapter
    this.selectionAdapter = new SelectionAdapter(this, this.options);
    this.selectionAdapter.bind(this.container, this.dataAdapter);

    // Get selection element AFTER binding (when it's rendered)
    const selectionElement = this.selectionAdapter.selection.getContainer();

    // Initialize DropdownAdapter
    this.dropdownAdapter = new DropdownAdapter(this, this.options);
    this.dropdownAdapter.bind(this.container, selectionElement);

    // Initialize ResultsAdapter
    this.resultsAdapter = new ResultsAdapter(this, this.options);
    const dropdownContainer = this.dropdownAdapter.getContainer();
    this.resultsAdapter.bind(
      dropdownContainer,
      this.dataAdapter,
      this.dropdownAdapter,
      this.ajaxAdapter,
    );
  }

  /**
   * Initialize managers
   * @private
   */
  _initializeManagers() {
    // Initialize KeyboardManager
    this.keyboardManager = new KeyboardManager(this, this.options);

    // Bind keyboard events
    const selectionElement = this.selectionAdapter.selection.getContainer();
    const searchInput = this.dropdownAdapter.searchBox?.getInput();
    this.keyboardManager.bind(
      selectionElement,
      searchInput,
      this.resultsAdapter,
    );

    // Initialize AccessibilityManager
    this.accessibilityManager = new AccessibilityManager(this, this.options);

    // Bind accessibility features
    const dropdownElement = this.dropdownAdapter.dropdown.getContainer();
    const resultsElement = this.resultsAdapter.results.getContainer();
    this.accessibilityManager.bind(
      selectionElement,
      dropdownElement,
      resultsElement,
    );
  }

  /**
   * Bind event listeners
   * @private
   */
  _bindEvents() {
    // Accessibility events
    this.on(EVENTS.OPENING, () => {
      if (this.accessibilityManager) {
        this.accessibilityManager.onOpen();
      }
    });

    this.on(EVENTS.CLOSING, () => {
      if (this.accessibilityManager) {
        this.accessibilityManager.onClose();
      }
    });

    this.on(EVENTS.SELECT, (data) => {
      if (this.accessibilityManager && data.data) {
        this.accessibilityManager.announceSelection(data.data);
      }
    });

    this.on(EVENTS.RESULTS, (data) => {
      if (this.accessibilityManager && data.results) {
        this.accessibilityManager.announceResultsCount(data.results.length);
      }
    });

    // HTML5 Validation events
    this.element.addEventListener("invalid", (e) => {
      this._onInvalid(e);
    });

    // Update validation state on change
    this.on(EVENTS.CHANGE, () => {
      this._updateValidationState();
    });
  }

  /**
   * Handle invalid event from native select
   * @param {Event} e - Invalid event
   * @private
   */
  _onInvalid(e) {
    // Prevent default browser behavior (trying to focus hidden element)
    e.preventDefault();

    if (this.container) {
      // Add invalid class for visual feedback
      this.container.classList.add("vs-container--invalid");

      // Focus on our custom selection element instead
      const selectionElement = this.container.querySelector(".vs-selection");
      if (selectionElement) {
        selectionElement.focus();
      }

      // Show validation message using custom container
      // (Browser can't show tooltip on hidden element)
      const validationMessage = this.element.validationMessage;
      if (validationMessage) {
        // Set custom title for tooltip on hover
        this.container.setAttribute("title", validationMessage);
      }
    }
  }

  /**
   * Update validation state (check and update visual state)
   * @private
   */
  _updateValidationState() {
    if (!this.container) return;

    const isValid = this.element.checkValidity();
    if (isValid) {
      this.container.classList.remove("vs-container--invalid");
      this.container.removeAttribute("title"); // Remove validation tooltip
    } else {
      this.container.classList.add("vs-container--invalid");
      // Set validation message as tooltip
      const validationMessage = this.element.validationMessage;
      if (validationMessage) {
        this.container.setAttribute("title", validationMessage);
      }
    }
  }

  /**
   * Load initial data from element or options
   * @private
   */
  _loadInitialData() {
    // Data is loaded in DataAdapter.init()
    // Just update the selection display
    if (this.selectionAdapter) {
      this.selectionAdapter.update();
    }
  }

  /**
   * PUBLIC API METHODS
   */

  /**
   * Get or set the current value
   * @param {string|string[]|null} value - Value to set (optional)
   * @returns {string|string[]|VanillaSmartSelect} Current value or this for chaining
   */
  val(value) {
    if (value === undefined) {
      // Get current value
      if (this.dataAdapter) {
        const current = this.dataAdapter.current();
        if (this.options.get("multiple")) {
          return current.map((item) => item.id);
        }
        return current.length > 0 ? current[0].id : null;
      }
      return this.element.value;
    }

    // Set value - use select() to properly update UI
    if (value === null || value === "") {
      // Clear selection
      return this.clear();
    }

    // For single select, use select() method
    if (!this.options.get("multiple")) {
      return this.select(value);
    }

    // For multiple select, handle array of values
    if (Array.isArray(value)) {
      this.clear(); // Clear first
      value.forEach((id) => this.select(id));
      return this;
    }

    // Single value for multiple select
    return this.select(value);
  }

  /**
   * Get or set data
   * @param {Array|null} data - Data array to set (optional)
   * @returns {Array|VanillaSmartSelect} Current data or this for chaining
   */
  data(data) {
    if (data === undefined) {
      // Get current data
      if (this.dataAdapter) {
        return this.dataAdapter.query({ term: "" });
      }
      return [];
    }

    // Set data
    if (this.dataAdapter) {
      this.dataAdapter.setData(data);
    }
    return this;
  }

  /**
   * Open the dropdown
   */
  open() {
    if (this.isDisabled || this.isOpen()) {
      return;
    }

    // Emit opening event (preventable)
    const openingAllowed = this.trigger(
      this.element,
      EVENTS.OPENING,
      {},
      { cancelable: true },
    );
    if (!openingAllowed) {
      return;
    }

    this.emit(EVENTS.OPENING);

    // Emit opened event
    this.emit(EVENTS.OPEN);
    this.trigger(this.element, EVENTS.OPEN);

    // Call onOpen callback
    const onOpen = this.options.get("onOpen");
    if (typeof onOpen === "function") {
      onOpen.call(this);
    }
  }

  /**
   * Close the dropdown
   */
  close() {
    if (!this.isOpen()) {
      return;
    }

    // Emit closing event (preventable)
    const closingAllowed = this.trigger(
      this.element,
      EVENTS.CLOSING,
      {},
      { cancelable: true },
    );
    if (!closingAllowed) {
      return;
    }

    this.emit(EVENTS.CLOSING);

    // Emit closed event
    this.emit(EVENTS.CLOSE);
    this.trigger(this.element, EVENTS.CLOSE);

    // Call onClose callback
    const onClose = this.options.get("onClose");
    if (typeof onClose === "function") {
      onClose.call(this);
    }
  }

  /**
   * Toggle dropdown open/closed
   */
  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Enable the select
   */
  enable() {
    if (!this.isDisabled) {
      return;
    }

    this.isDisabled = false;
    this.element.disabled = false;
    this.options.set("disabled", false);

    if (this.container) {
      this.container.classList.remove("vs-container--disabled");
    }
  }

  /**
   * Disable the select
   */
  disable() {
    if (this.isDisabled) {
      return;
    }

    this.isDisabled = true;
    this.element.disabled = true;
    this.options.set("disabled", true);

    if (this.container) {
      this.container.classList.add("vs-container--disabled");
    }

    // Close if open
    if (this.isOpen()) {
      this.close();
    }
  }

  /**
   * Check if dropdown is open
   * @returns {boolean} Whether dropdown is open
   */
  isOpen() {
    return this.dropdownAdapter ? this.dropdownAdapter.isOpen() : false;
  }

  /**
   * Clear the current selection
   * @returns {VanillaSmartSelect} this for chaining
   */
  clear() {
    if (!this.dataAdapter) {
      return this;
    }

    // Emit clearing event (preventable)
    const clearingAllowed = this.trigger(
      this.element,
      EVENTS.CLEARING,
      {},
      { cancelable: true },
    );

    if (!clearingAllowed) {
      return this;
    }

    this.emit(EVENTS.CLEARING);

    // Clear all selections using DataAdapter
    this.dataAdapter.clear();

    // Emit clear event (for adapters to update UI)
    this.emit(EVENTS.CLEAR);
    this.trigger(this.element, EVENTS.CLEAR);

    // Call onClear callback
    const onClear = this.options.get("onClear");
    if (typeof onClear === "function") {
      onClear.call(this);
    }

    return this;
  }

  /**
   * Focus the select
   */
  focus() {
    if (this.container) {
      const focusTarget = this.container.querySelector(".vs-selection");
      if (focusTarget) {
        focusTarget.focus();
      }
    }
  }

  /**
   * Select an item by ID (programmatically)
   * @param {string|number} id - Item ID to select
   * @returns {VanillaSmartSelect} this for chaining
   */
  select(id) {
    if (!this.dataAdapter) {
      return this;
    }

    // Find item by ID in data
    const allData = this.dataAdapter.query({ term: "" });
    const item = this._findItemById(allData, id);

    if (item && !item.disabled) {
      this.dataAdapter.select(item);
    }

    return this;
  }

  /**
   * Unselect an item by ID (multi-select only)
   * @param {string|number} id - Item ID to unselect
   * @returns {VanillaSmartSelect} this for chaining
   */
  unselect(id) {
    if (!this.dataAdapter) {
      return this;
    }

    const isMultiple = this.options.get("multiple");
    if (!isMultiple) {
      console.warn("unselect() only works with multiple select");
      return this;
    }

    // Find item in current selection
    const current = this.dataAdapter.current();
    const item = current.find((i) => i.id === id);

    if (item) {
      this.dataAdapter.unselect(item);
    }

    return this;
  }

  /**
   * Get selected item(s) with full data
   * @returns {Object|Object[]|null} Selected item(s) or null
   */
  getSelected() {
    if (!this.dataAdapter) {
      return null;
    }

    const current = this.dataAdapter.current();
    const isMultiple = this.options.get("multiple");

    if (isMultiple) {
      return current; // Array of selected items
    }

    return current.length > 0 ? current[0] : null; // Single item or null
  }

  /**
   * Add a new option dynamically
   * @param {Object} option - Option data {id, text, disabled?, selected?}
   * @returns {VanillaSmartSelect} this for chaining
   */
  addOption(option) {
    if (!this.dataAdapter || !option) {
      return this;
    }

    // Get current data
    const currentData = this.dataAdapter.query({ term: "" });

    // Add new option
    currentData.push(option);

    // Update data
    this.dataAdapter.setData(currentData);

    // Update results if dropdown is open
    if (this.resultsAdapter) {
      this.resultsAdapter.update();
    }

    return this;
  }

  /**
   * Remove an option by ID
   * @param {string|number} id - Option ID to remove
   * @returns {VanillaSmartSelect} this for chaining
   */
  removeOption(id) {
    if (!this.dataAdapter) {
      return this;
    }

    // Get current data
    let currentData = this.dataAdapter.query({ term: "" });

    // Remove item recursively (supports groups)
    currentData = this._removeItemById(currentData, id);

    // Update data
    this.dataAdapter.setData(currentData);

    // Update results if dropdown is open
    if (this.resultsAdapter) {
      this.resultsAdapter.update();
    }

    return this;
  }

  /**
   * Helper: Find item by ID recursively (supports groups)
   * @param {Array} items - Items to search
   * @param {string|number} id - Item ID
   * @returns {Object|null} Found item or null
   * @private
   */
  _findItemById(items, id) {
    for (const item of items) {
      // Convert both to string for comparison to handle string/number safely
      // This avoids issues with loose equality (e.g., "0" == 0 → true, but 0 == "" → false)
      if (String(item.id) === String(id)) {
        return item;
      }

      // Search in children (groups)
      if (item.children && Array.isArray(item.children)) {
        const found = this._findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  /**
   * Helper: Remove item by ID recursively (supports groups)
   * @param {Array} items - Items array
   * @param {string|number} id - Item ID to remove
   * @returns {Array} Filtered items
   * @private
   */
  _removeItemById(items, id) {
    return items.filter((item) => {
      // Remove if matches ID
      if (item.id == id) {
        return false;
      }

      // Filter children (groups)
      if (item.children && Array.isArray(item.children)) {
        item.children = this._removeItemById(item.children, id);
      }

      return true;
    });
  }

  /**
   * Check if the current selection is valid (HTML5 validation)
   * @returns {boolean} True if valid
   */
  checkValidity() {
    return this.element.checkValidity();
  }

  /**
   * Report validity (HTML5 validation) - shows browser validation message
   * @returns {boolean} True if valid
   */
  reportValidity() {
    return this.element.reportValidity();
  }

  /**
   * Set custom validity message (HTML5 validation)
   * @param {string} message - Validation message (empty string to clear)
   * @returns {VanillaSmartSelect} this for chaining
   */
  setCustomValidity(message) {
    this.element.setCustomValidity(message);
    return this;
  }

  /**
   * Get the validation message
   * @returns {string} Validation message
   */
  validationMessage() {
    return this.element.validationMessage;
  }

  /**
   * Check if the select will be validated
   * @returns {boolean} True if will validate
   */
  willValidate() {
    return this.element.willValidate;
  }

  /**
   * Update the language dynamically
   * @param {Object} language - Language object (use getLanguage('pt-BR') to get language object)
   * @returns {VanillaSmartSelect} this for chaining
   * @example
   * import { getLanguage } from './i18n/index.js';
   * select.updateLanguage(getLanguage('pt-BR'));
   */
  updateLanguage(language) {
    if (!language || typeof language !== "object") {
      console.warn(
        'updateLanguage expects a language object. Use getLanguage("code") to get one.',
      );
      return this;
    }

    // Update language option
    this.options.set("language", language);

    // Update all components that display language-dependent text
    if (
      this.dropdownAdapter &&
      typeof this.dropdownAdapter.update === "function"
    ) {
      this.dropdownAdapter.update();
    }

    if (
      this.selectionAdapter &&
      typeof this.selectionAdapter.update === "function"
    ) {
      this.selectionAdapter.update();
    }

    return this;
  }

  /**
   * Destroy the select instance
   */
  destroy() {
    if (!this._isInitialized) {
      return;
    }

    // Emit destroy event
    this.emit(EVENTS.DESTROY);
    this.trigger(this.element, EVENTS.DESTROY);

    // Close dropdown if open
    if (this.isOpen()) {
      this.close();
    }

    // Destroy adapters
    if (this.dataAdapter && this.dataAdapter.destroy) {
      this.dataAdapter.destroy();
    }
    if (this.ajaxAdapter && this.ajaxAdapter.destroy) {
      this.ajaxAdapter.destroy();
    }
    if (this.selectionAdapter && this.selectionAdapter.destroy) {
      this.selectionAdapter.destroy();
    }
    if (this.dropdownAdapter && this.dropdownAdapter.destroy) {
      this.dropdownAdapter.destroy();
    }
    if (this.resultsAdapter && this.resultsAdapter.destroy) {
      this.resultsAdapter.destroy();
    }

    // Destroy managers
    if (this.keyboardManager && this.keyboardManager.destroy) {
      this.keyboardManager.destroy();
    }
    if (this.accessibilityManager && this.accessibilityManager.destroy) {
      this.accessibilityManager.destroy();
    }

    // Remove container
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Show original select
    this.element.style.display = "";
    this.element.removeAttribute("aria-hidden");

    // Remove reference from element
    delete this.element._vanillaSmartSelect;

    // Remove all event listeners
    this.removeAllListeners();

    // Mark as not initialized
    this._isInitialized = false;
  }
}

// Factory function for easier initialization
function vanillaSmartSelect(element, options) {
  return new VanillaSmartSelect(element, options);
}

/**
 * ARIA (Accessible Rich Internet Applications) constants
 * Used for proper accessibility implementation
 */

const ARIA = {
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
 * Function decorators and utilities
 * Provides debounce, throttle, and other function modifiers
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute on leading edge instead of trailing
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 250, immediate = false) {
  let timeout;

  const debounced = function (...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

/**
 * Throttle function - limits execution to once per time period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, wait = 250) {
  let timeout;
  let previous = 0;

  const throttled = function (...args) {
    const context = this;
    const now = Date.now();

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
    previous = 0;
  };

  return throttled;
}

/**
 * Once function - ensures function is only called once
 * @param {Function} func - Function to wrap
 * @returns {Function} Wrapped function
 */
function once(func) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = func.apply(this, args);
    }
    return result;
  };
}

/**
 * Memoize function - caches function results
 * @param {Function} func - Function to memoize
 * @param {Function} resolver - Custom cache key resolver
 * @returns {Function} Memoized function
 */
function memoize(func, resolver) {
  const cache = new Map();

  const memoized = function (...args) {
    const key = resolver ? resolver.apply(this, args) : args[0];

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.cache = cache;

  return memoized;
}

/**
 * Delay function - delays execution by specified time
 * @param {Function} func - Function to delay
 * @param {number} wait - Delay time in milliseconds
 * @returns {Function} Delayed function
 */
function delay(func, wait = 0) {
  return function (...args) {
    setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Negate function - returns opposite boolean result
 * @param {Function} predicate - Predicate function
 * @returns {Function} Negated function
 */
function negate(predicate) {
  return function (...args) {
    return !predicate.apply(this, args);
  };
}

var decorators = {
  debounce,
  throttle,
  once,
  memoize,
  delay,
  negate,
};

var decorators$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  debounce: debounce,
  default: decorators,
  delay: delay,
  memoize: memoize,
  negate: negate,
  once: once,
  throttle: throttle
});

/**
 * Vanilla-Smart-Select
 * Modern JavaScript dropdown enhancement library without jQuery dependencies
 *
 * @version 1.0.2
 * @author Ailton Occhi <ailton.occhi@hotmail.com>
 * @license MIT
 */


// UMD build global assignment
if (typeof window !== "undefined") {
  window.VanillaSmartSelect = VanillaSmartSelect;
  window.vanillaSmartSelect = vanillaSmartSelect;
}

exports.ARIA = ARIA;
exports.DEFAULTS = DEFAULTS;
exports.EVENTS = EVENTS;
exports.EventEmitter = EventEmitter;
exports.KEYS = KEYS;
exports.Options = Options;
exports.VanillaSmartSelect = VanillaSmartSelect;
exports.decorators = decorators$1;
exports.default = VanillaSmartSelect;
exports.detectBrowserLanguage = detectBrowserLanguage;
exports.diacritics = diacritics;
exports.dom = dom$1;
exports.getAvailableLanguages = getAvailableLanguages;
exports.getLanguage = getLanguage;
exports.i18n = index$1;
exports.removeDiacritics = removeDiacritics;
exports.vanillaSmartSelect = vanillaSmartSelect;
//# sourceMappingURL=vanilla-smart-select.cjs.js.map
