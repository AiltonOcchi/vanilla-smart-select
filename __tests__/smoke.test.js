import VanillaSmartSelect from '../src/index.js';

describe('smoke', () => {
  it('exports the main class', () => {
    expect(typeof VanillaSmartSelect).toBe('function');
  });

  it('throws on invalid selector', () => {
    expect(() => new VanillaSmartSelect('#nonexistent')).toThrow(
      'Invalid element provided to VanillaSmartSelect'
    );
  });

  it('initializes and destroys cleanly on a valid select', () => {
    const select = document.createElement('select');
    select.innerHTML = '<option value="a">A</option><option value="b">B</option>';
    document.body.appendChild(select);

    const instance = new VanillaSmartSelect(select);
    expect(instance._isInitialized).toBe(true);
    expect(select._vanillaSmartSelect).toBe(instance);

    instance.destroy();
    expect(instance._isInitialized).toBe(false);
    expect(select._vanillaSmartSelect).toBeUndefined();

    select.remove();
  });
});
