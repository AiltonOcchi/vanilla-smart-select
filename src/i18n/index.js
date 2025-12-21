/**
 * i18n System - Language Registry for Vanilla Smart Select
 * Provides centralized language management and utilities
 */

import { EN } from "./en.js";
import { PT_BR } from "./pt-BR.js";
import { ES } from "./es.js";

/**
 * Language registry - maps language codes to language objects
 */
export const LANGUAGES = {
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
export function getLanguage(locale) {
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
export function detectBrowserLanguage() {
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
export function getAvailableLanguages() {
  return Object.keys(LANGUAGES);
}

/**
 * Check if a language is available
 *
 * @param {string} locale - Language code
 * @returns {boolean} True if language is available
 */
export function isLanguageAvailable(locale) {
  return !!LANGUAGES[locale] || !!LANGUAGES[locale.split("-")[0]];
}

export default {
  LANGUAGES,
  getLanguage,
  detectBrowserLanguage,
  getAvailableLanguages,
  isLanguageAvailable,
};
