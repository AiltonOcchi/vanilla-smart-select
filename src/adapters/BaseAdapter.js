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

export default BaseAdapter;
