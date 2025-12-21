/**
 * AjaxAdapter - Handles remote data loading via AJAX
 * Supports search, pagination, and custom request configuration
 */

import BaseAdapter from "./BaseAdapter.js";
import { EVENTS } from "../constants/events.js";

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

export default AjaxAdapter;
