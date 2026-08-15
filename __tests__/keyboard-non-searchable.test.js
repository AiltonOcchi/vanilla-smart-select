/**
 * Keyboard behavior with searchable: false (GitHub issues #8 and #9).
 *
 * With no search box, focus stays on the selection element while the
 * dropdown is open, so every key lands in _handleSelectionKeydown.
 * These tests cover selection via Enter/Space (#9), closing on Tab
 * without stealing focus (#8), and the searchable: true regressions.
 */

import VanillaSmartSelect from '../src/index.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pressKey = (element, keyCode) => {
  const event = new KeyboardEvent('keydown', {
    keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
  return event;
};

const KEY = { TAB: 9, ENTER: 13, SPACE: 32, DOWN: 40 };

let instance;

function setup({ options = {}, optionCount = 4, multiple = false } = {}) {
  document.body.innerHTML = '';

  const select = document.createElement('select');
  if (multiple) select.multiple = true;
  for (let i = 0; i < optionCount; i++) {
    const option = document.createElement('option');
    option.value = `v${i}`;
    option.textContent = `Option ${i}`;
    select.appendChild(option);
  }
  document.body.appendChild(select);

  const next = document.createElement('input');
  next.id = 'next';
  document.body.appendChild(next);

  instance = new VanillaSmartSelect(select, options);
  const selection = document.querySelector('.vs-container .vs-selection');

  let changeCount = 0;
  select.addEventListener('change', () => changeCount++);

  return { select, next, selection, getChangeCount: () => changeCount };
}

afterEach(() => {
  if (instance) {
    instance.destroy();
    instance = null;
  }
  document.body.innerHTML = '';
});

describe('issue #9 — Enter/Space must select the highlighted item (searchable: false)', () => {
  test('Enter selects the highlighted item, closes the dropdown and fires change', async () => {
    const { select, selection, getChangeCount } = setup({
      options: { searchable: false }
    });

    selection.focus();
    pressKey(selection, KEY.ENTER); // open
    await wait(30);
    pressKey(selection, KEY.DOWN); // highlight moves from v0 to v1
    pressKey(selection, KEY.ENTER); // confirm
    await wait(30);

    expect(select.value).toBe('v1');
    expect(getChangeCount()).toBe(1);
    expect(instance.isOpen()).toBe(false);
  });

  test('Space also selects the highlighted item when the dropdown is open', async () => {
    const { select, selection } = setup({ options: { searchable: false } });

    selection.focus();
    pressKey(selection, KEY.ENTER); // open
    await wait(30);
    pressKey(selection, KEY.DOWN);
    pressKey(selection, KEY.SPACE); // confirm
    await wait(30);

    expect(select.value).toBe('v1');
    expect(instance.isOpen()).toBe(false);
  });

  test('Enter with nothing highlighted just closes the dropdown', async () => {
    const { selection, getChangeCount } = setup({
      options: { searchable: false },
      optionCount: 0
    });

    selection.focus();
    pressKey(selection, KEY.ENTER); // open (empty results, no highlight)
    await wait(30);
    pressKey(selection, KEY.ENTER);
    await wait(30);

    expect(instance.isOpen()).toBe(false);
    expect(getChangeCount()).toBe(0);
  });

  test('Enter still opens the dropdown when it is closed', () => {
    const { selection } = setup({ options: { searchable: false } });

    selection.focus();
    pressKey(selection, KEY.ENTER);

    expect(instance.isOpen()).toBe(true);
  });

  test('multiple: Enter selects the highlighted item and keeps the dropdown open', async () => {
    const { select, selection } = setup({
      options: { searchable: false },
      multiple: true
    });

    selection.focus();
    pressKey(selection, KEY.ENTER); // open, first item auto-highlighted
    await wait(30);
    pressKey(selection, KEY.ENTER); // confirm
    await wait(30);

    const selected = Array.from(select.selectedOptions).map((o) => o.value);
    expect(selected).toEqual(['v0']);
    expect(instance.isOpen()).toBe(true);
  });

  test('regression: Enter in the search input still selects (searchable: true)', async () => {
    const { select, selection } = setup({ options: { searchable: true } });

    selection.focus();
    pressKey(selection, KEY.ENTER); // open, focus moves to search input
    await wait(30);
    const search = document.activeElement;
    pressKey(search, KEY.DOWN);
    pressKey(search, KEY.ENTER);
    await wait(30);

    expect(select.value).toBe('v1');
    expect(instance.isOpen()).toBe(false);
  });
});

describe('issue #8 — Tab must close the dropdown without stealing focus (searchable: false)', () => {
  test('Tab closes the open dropdown and is not swallowed', async () => {
    const { selection } = setup({ options: { searchable: false } });

    selection.focus();
    pressKey(selection, KEY.ENTER); // open
    await wait(30);
    const tabEvent = pressKey(selection, KEY.TAB);

    expect(instance.isOpen()).toBe(false);
    // The browser default must run so focus moves to the next field.
    expect(tabEvent.defaultPrevented).toBe(false);
  });

  test('close({ focus: false }) does not pull focus back to the selection', async () => {
    const { next } = setup({ options: { searchable: false } });

    instance.open();
    await wait(30);
    next.focus(); // simulates the browser moving focus on Tab
    instance.close({ focus: false });

    expect(instance.isOpen()).toBe(false);
    expect(document.activeElement).toBe(next);
  });

  test('regression: plain close() still refocuses the selection element', async () => {
    const { next, selection } = setup({ options: { searchable: false } });

    instance.open();
    await wait(30);
    next.focus();
    instance.close();

    expect(instance.isOpen()).toBe(false);
    expect(document.activeElement).toBe(selection);
  });

  test('Tab in the search input closes the dropdown without selecting (searchable: true)', async () => {
    const { select, selection, getChangeCount } = setup({
      options: { searchable: true }
    });

    selection.focus();
    pressKey(selection, KEY.ENTER); // open, focus moves to search input
    await wait(30);
    const search = document.activeElement;
    pressKey(search, KEY.DOWN); // highlight moves to v1
    const tabEvent = pressKey(search, KEY.TAB);

    expect(instance.isOpen()).toBe(false);
    // Tab must not commit the highlighted item — Enter is the commit key.
    expect(select.value).toBe('v0');
    expect(getChangeCount()).toBe(0);
    // Focus returns to the selection element so the browser's default Tab
    // action continues from there to the next form field (not swallowed).
    expect(tabEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(selection);
  });
});

