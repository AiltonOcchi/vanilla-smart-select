import VanillaSmartSelect from '../src/index.js';

function makeDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  promise.abort = jest.fn();
  return { promise, resolve, reject };
}

function makeTransport() {
  const calls = [];
  const transport = function (params /*, ajaxConfig */) {
    const d = makeDeferred();
    calls.push({
      params,
      resolve: d.resolve,
      reject: d.reject,
      promise: d.promise
    });
    return d.promise;
  };
  return { transport, calls };
}

// Flush enough microtasks for the chain
//   AjaxAdapter.query -> ResultsAdapter.then -> .finally
// to settle.
async function flushPromises() {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
}

describe('loadMore race conditions', () => {
  let select;
  let instance;
  let calls;
  let consoleErrorSpy;

  beforeEach(() => {
    // The error path logs via console.error in two places (ResultsAdapter
    // catch + showError). Silence them to keep the test output clean.
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const t = makeTransport();
    calls = t.calls;

    select = document.createElement('select');
    document.body.appendChild(select);

    instance = new VanillaSmartSelect(select, {
      ajax: { transport: t.transport }
    });

    // Put the adapter in a state where loadMore is willing to fire.
    const ra = instance.resultsAdapter;
    ra.hasMore = true;
    ra.currentSearchTerm = '';
  });

  afterEach(() => {
    if (instance && instance._isInitialized) instance.destroy();
    if (select && select.parentNode) select.remove();
    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
    instance = null;
    select = null;
    calls = null;
  });

  it('(a) blocks subsequent loadMore while a request is in flight, even after the legacy 500ms window', () => {
    jest.useFakeTimers();
    const ra = instance.resultsAdapter;

    ra.loadMore();
    expect(calls).toHaveLength(1);
    expect(ra.isLoadingMore).toBe(true);

    // Walk past the legacy 500ms timer threshold without resolving the
    // first request. With the old setTimeout(500) cleanup, the gate was
    // released here and a duplicate request would slip through. With the
    // .finally() approach, the gate is event-driven and stays held.
    jest.advanceTimersByTime(600);

    ra.loadMore();
    expect(calls).toHaveLength(1);
  });

  it('(b) AJAX error releases the loadMore gate without waiting for any timer', async () => {
    jest.useFakeTimers();
    const ra = instance.resultsAdapter;

    ra.loadMore();
    expect(calls).toHaveLength(1);
    expect(ra.isLoadingMore).toBe(true);

    calls[0].reject(new Error('500'));
    await flushPromises();

    // No timer advance — gate must be released by the .finally(), not by
    // the legacy 500ms timer.
    expect(ra.isLoadingMore).toBe(false);

    // Sanity check: a fresh loadMore can fire. The AjaxAdapter empty
    // fallback flipped hasMore to false; restore it the way a real
    // pagination response would.
    ra.hasMore = true;
    ra.loadMore();
    expect(calls).toHaveLength(2);
  });

  it('(c) discarded loadMore page (token superseded) still releases the gate', async () => {
    jest.useFakeTimers();
    const ra = instance.resultsAdapter;
    ra.currentSearchTerm = 'foo';

    ra.loadMore();
    expect(calls).toHaveLength(1);
    expect(ra.isLoadingMore).toBe(true);

    // User types: a new search starts, generating a new token and
    // invalidating the in-flight loadMore page.
    ra._updateWithAjax('bar');
    expect(calls).toHaveLength(2);

    // The old page now resolves. The .then handler will drop the result
    // due to the token mismatch, but the .finally() must still run and
    // release the gate. No timer advance — the old code released the
    // gate by setTimeout, which would let this assert pass spuriously
    // if we advanced. We don't.
    calls[0].resolve({ results: [], pagination: { more: false } });
    await flushPromises();

    expect(ra.isLoadingMore).toBe(false);
  });
});
