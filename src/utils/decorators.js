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
export function debounce(func, wait = 250, immediate = false) {
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
export function throttle(func, wait = 250) {
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
export function once(func) {
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
export function memoize(func, resolver) {
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
export function delay(func, wait = 0) {
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
export function negate(predicate) {
  return function (...args) {
    return !predicate.apply(this, args);
  };
}

export default {
  debounce,
  throttle,
  once,
  memoize,
  delay,
  negate,
};
