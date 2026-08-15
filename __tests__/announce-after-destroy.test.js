/**
 * AccessibilityManager.announce() schedules a 100ms timeout to fill the
 * live region. If the instance is destroyed before it fires, the callback
 * must not blow up on the nulled liveRegion (TypeError in production
 * whenever an instance is destroyed right after an interaction).
 */

import VanillaSmartSelect from '../src/index.js';

afterEach(() => {
  jest.useRealTimers();
  document.body.innerHTML = '';
});

test('destroy() cancels the pending screen reader announcement', () => {
  jest.useFakeTimers();
  document.body.innerHTML =
    '<select id="s"><option value="a">A</option></select>';
  const instance = new VanillaSmartSelect(document.querySelector('#s'), {
    searchable: false
  });

  instance.accessibilityManager.announce('hello');
  instance.destroy();

  expect(() => jest.runAllTimers()).not.toThrow();
});
