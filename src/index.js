/**
 * Vanilla-Smart-Select
 * Modern JavaScript dropdown enhancement library without jQuery dependencies
 *
 * @version 1.0.3
 * @author Ailton Occhi <ailton.occhi@hotmail.com>
 * @license MIT
 */

import VanillaSmartSelect, {
  vanillaSmartSelect,
} from "./core/VanillaSmartSelect.js";
import EventEmitter from "./core/EventEmitter.js";
import Options from "./core/Options.js";

// Constants
import { EVENTS } from "./constants/events.js";
import { ARIA } from "./constants/aria.js";
import { KEYS } from "./constants/keys.js";
import { DEFAULTS } from "./constants/defaults.js";

// Utils
import * as dom from "./utils/dom.js";
import * as decorators from "./utils/decorators.js";
import { removeDiacritics, diacritics } from "./utils/diacritics.js";

// i18n
import * as i18n from "./i18n/index.js";
import {
  getLanguage,
  detectBrowserLanguage,
  getAvailableLanguages,
} from "./i18n/index.js";

// Export main class as default
export default VanillaSmartSelect;

// Named exports
export {
  VanillaSmartSelect,
  vanillaSmartSelect,
  EventEmitter,
  Options,

  // Constants
  EVENTS,
  ARIA,
  KEYS,
  DEFAULTS,

  // Utils
  dom,
  decorators,
  removeDiacritics,
  diacritics,

  // i18n
  i18n,
  getLanguage,
  detectBrowserLanguage,
  getAvailableLanguages,
};

// UMD build global assignment
if (typeof window !== "undefined") {
  window.VanillaSmartSelect = VanillaSmartSelect;
  window.vanillaSmartSelect = vanillaSmartSelect;
}
