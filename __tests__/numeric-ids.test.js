import VanillaSmartSelect from '../src/index.js';

function createSelect({ multiple = false, html = '' } = {}) {
  const select = document.createElement('select');
  if (multiple) select.setAttribute('multiple', '');
  if (html) select.innerHTML = html;
  document.body.appendChild(select);
  return select;
}

describe('numeric id comparisons', () => {
  let select;
  let instance;

  afterEach(() => {
    if (instance && instance._isInitialized) instance.destroy();
    if (select && select.parentNode) select.remove();
    instance = null;
    select = null;
  });

  it('(a) clicking the X on a multi-select choice removes a numeric-id item', () => {
    select = createSelect({ multiple: true });
    instance = new VanillaSmartSelect(select, {
      multiple: true,
      data: [
        { id: 1, text: 'A' },
        { id: 2, text: 'B' }
      ]
    });

    instance.select(1);
    expect(instance.getSelected()).toHaveLength(1);

    const removeBtn = select.parentNode.querySelector(
      '.vs-selection__choice__remove'
    );
    expect(removeBtn).not.toBeNull();
    removeBtn.click();

    expect(instance.getSelected()).toEqual([]);
  });

  it('(b) instance.unselect(stringId) removes a numeric-id item from a multi-select', () => {
    select = createSelect({ multiple: true });
    instance = new VanillaSmartSelect(select, {
      multiple: true,
      data: [
        { id: 1, text: 'A' },
        { id: 2, text: 'B' }
      ]
    });

    instance.select(1);
    instance.select(2);
    expect(instance.getSelected()).toHaveLength(2);

    // Type mismatch on purpose: caller passes string, items are numeric.
    instance.unselect('1');

    const remaining = instance.getSelected();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(2);
  });

  it('(c) instance.removeOption(numericId) removes a numeric-id item (consistency coverage)', () => {
    select = createSelect();
    instance = new VanillaSmartSelect(select, {
      data: [
        { id: 1, text: 'A' },
        { id: 2, text: 'B' }
      ]
    });

    instance.removeOption(1);
    const remaining = instance.data();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(2);
  });

  it('(d) instance.select(numericId) syncs the underlying <option selected> attribute', () => {
    // Note: we select id=2 on purpose. In single-select, jsdom (matching the
    // browser) already marks the FIRST option as selected by default, so an
    // assertion on value="1" would pass trivially even when the sync is broken.
    // Picking the non-default option forces the test to fail when the
    // numeric-vs-string mismatch keeps the underlying <select> out of sync.
    select = createSelect({
      html: '<option value="1">A</option><option value="2">B</option>'
    });
    instance = new VanillaSmartSelect(select, {
      data: [
        { id: 1, text: 'A' },
        { id: 2, text: 'B' }
      ]
    });

    instance.select(2);

    expect(select.selectedOptions).toHaveLength(1);
    expect(select.selectedOptions[0].value).toBe('2');
  });

  it('(e) instance.select(stringId) keeps working when ids come from HTML options (regression baseline)', () => {
    // Same rationale as (d): pick the non-default option.
    select = createSelect({
      html: '<option value="1">A</option><option value="2">B</option>'
    });
    instance = new VanillaSmartSelect(select);

    instance.select('2');

    expect(select.selectedOptions).toHaveLength(1);
    expect(select.selectedOptions[0].value).toBe('2');
  });
});
