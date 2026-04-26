import VanillaSmartSelect from '../src/index.js';

function createSelect({ multiple = false, html = '' } = {}) {
  const select = document.createElement('select');
  if (multiple) select.setAttribute('multiple', '');
  if (html) select.innerHTML = html;
  document.body.appendChild(select);
  return select;
}

const htmlEscape = (s) =>
  s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);

describe('escapeMarkup', () => {
  let select;
  let instance;

  afterEach(() => {
    if (instance && instance._isInitialized) instance.destroy();
    if (select && select.parentNode) select.remove();
    instance = null;
    select = null;
  });

  it('(a) default escapeMarkup is identity: string templates land literally in innerHTML (v1.x compat)', () => {
    select = createSelect();
    instance = new VanillaSmartSelect(select, {
      data: [{ id: 1, text: 'A' }],
      templateSelection: () => '<script>alert(1)</script>'
    });
    instance.select(1);

    const rendered = select.parentNode.querySelector('.vs-selection__rendered');
    expect(rendered).not.toBeNull();
    // Compat: with the default identity escapeMarkup, the raw string is
    // injected as HTML — exactly the v1.x behavior.
    expect(rendered.innerHTML).toContain('<script>');
  });

  it('(b) custom escapeMarkup is applied to string templates before innerHTML', () => {
    select = createSelect();
    instance = new VanillaSmartSelect(select, {
      data: [{ id: 1, text: 'A' }],
      templateSelection: () => '<script>alert(1)</script>',
      escapeMarkup: htmlEscape
    });
    instance.select(1);

    const rendered = select.parentNode.querySelector('.vs-selection__rendered');
    expect(rendered).not.toBeNull();
    expect(rendered.innerHTML).not.toContain('<script>');
    expect(rendered.innerHTML).toContain('&lt;script&gt;');
  });

  it('(c) template returning HTMLElement bypasses escapeMarkup (appendChild path)', () => {
    select = createSelect();
    const escape = jest.fn((s) => s);
    instance = new VanillaSmartSelect(select, {
      data: [{ id: 1, text: 'A' }],
      templateSelection: (item) => {
        const span = document.createElement('span');
        span.textContent = item.text;
        return span;
      },
      escapeMarkup: escape
    });
    instance.select(1);

    expect(escape).not.toHaveBeenCalled();
  });
});
