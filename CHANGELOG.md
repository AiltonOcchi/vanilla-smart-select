# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.6] - 2026-08-15

### Fixed

- With `searchable: false`, pressing <kbd>Enter</kbd> or <kbd>Space</kbd> on the open dropdown now selects the highlighted item (closing the dropdown and firing `change`), instead of just closing without selecting. Keyboard-only selection on non-searchable selects was previously impossible. (#9)
- With `searchable: false`, pressing <kbd>Tab</kbd> while the dropdown is open now closes it before focus moves to the next field. Previously the dropdown stayed open, so tabbing through a form left multiple dropdown panels floating over the page. (#8)
- Destroying an instance right after an interaction no longer throws a `TypeError` from a pending screen reader announcement — the announcement timer is now cancelled on `destroy()`.

### Added

- `close()` accepts an optional `{ focus: false }` to close the dropdown without returning focus to the selection element (used internally by the Tab fix; useful for integrators moving focus programmatically).

## [1.0.5] - 2026-04-26

### Fixed

- Selecting an item via the API when data uses numeric IDs (e.g. `data: [{ id: 1, ... }]`) now correctly marks the underlying `<option selected>`. Previously the type mismatch between numeric IDs and the always-string `option.value` left the native `<select>` out of sync, causing form submissions to drop the value silently and `checkValidity()` to fail on `required` fields even when an item was selected.
- The "✕" remove button on multi-select choices now works when items have numeric IDs. Before the fix, clicking it did nothing (the click was caught but the lookup failed silently).
- `unselect(id)` and `removeOption(id)` are type-safe across the public API: passing a string id to remove a numeric-id item (or vice versa) now works as expected.
- Infinite scroll (`loadMore`) no longer fires duplicate page requests on slow APIs. The gate that prevents concurrent page fetches is released when the request actually finishes (on success, on error, or when superseded by a newer search) instead of after a fixed 500 ms timer that was racing the response.
- AJAX errors during `loadMore` no longer leave the "Loading more…" spinner visible until a timer expires — it now disappears as soon as the request settles.
- AJAX errors during `loadMore` no longer wipe previously loaded pages from the dropdown. The error handler is now scoped: only first-page failures clear the list; subsequent-page failures keep the accumulated results in place so a transient error doesn't blow away what the user already saw.
- Re-initializing on the same `<select>` element (the init → destroy → init pattern common in SPAs) no longer leaks a native `invalid` event listener per cycle. Previously every cycle stacked another handler on the underlying element, which mostly operated on stale state.
- `clear()` on the internal results list now resets state correctly. A duplicate method definition was overriding the proper implementation and leaving `flatResults` stale, breaking the "input too short" hint flow.
- AJAX errors are now logged via `console.error` instead of being swallowed silently, making server failures and misconfigurations easier to debug.

### Changed

- The `escapeMarkup` option is now actually consumed when a `templateResult` or `templateSelection` returns a string. The default remains identity (`(markup) => markup`) for v1.x compatibility, so existing code is unaffected; integrators that need real HTML escaping can now supply their own function and have it applied before `innerHTML`. Templates that return an `HTMLElement` continue to bypass `escapeMarkup` (the `appendChild` path is untouched). Note: **v2.0 will switch the default to a real HTML-escape function** — a planned breaking change.
- Internal cleanup: removed dead code paths surfaced by the new lint setup and by the recent fixes (notably an `option.value || option.text` fallback in the underlying-select sync that became unreachable per HTML spec, and an internal pagination timer obsoleted by the `loadMore` rewrite). No behavior change for consumers.

[Unreleased]: https://github.com/AiltonOcchi/vanilla-smart-select/compare/v1.0.6...HEAD
[1.0.6]: https://github.com/AiltonOcchi/vanilla-smart-select/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/AiltonOcchi/vanilla-smart-select/compare/v1.0.4...v1.0.5
