import VanillaSmartSelect from '../src/index.js';

describe('invalid listener cleanup across init/destroy cycles', () => {
  let select;
  let instance;
  let spy;

  beforeEach(() => {
    select = document.createElement('select');
    document.body.appendChild(select);
    spy = jest.spyOn(VanillaSmartSelect.prototype, '_onInvalid');
  });

  afterEach(() => {
    if (instance && instance._isInitialized) instance.destroy();
    if (select && select.parentNode) select.remove();
    spy.mockRestore();
    instance = null;
    select = null;
  });

  it('only the live instance handles a single invalid event after 3 init/destroy/init cycles', () => {
    // Three cycles, leaving the third instance alive. Each init currently
    // attaches a new "invalid" listener on the underlying <select>; if
    // destroy doesn't remove the handler, all three will fire when the
    // event is dispatched.
    instance = new VanillaSmartSelect(select);
    instance.destroy();

    instance = new VanillaSmartSelect(select);
    instance.destroy();

    instance = new VanillaSmartSelect(select);

    select.dispatchEvent(new Event('invalid', { cancelable: true }));

    // With the leak: 3 (one per surviving listener closure).
    // Without the leak: 1 (only the live instance).
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
