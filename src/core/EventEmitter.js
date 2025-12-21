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

export default EventEmitter;
