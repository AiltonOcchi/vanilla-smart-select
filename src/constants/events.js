/**
 * Event name constants for vanilla-smart-select
 * All events use 'vs:' prefix to avoid conflicts
 */

export const EVENTS = {
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

export default EVENTS;
