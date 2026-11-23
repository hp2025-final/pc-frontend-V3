import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate as nextTurn } from 'node:timers/promises';
import loadTypeScript from './helpers/load-typescript.mjs';

const product = { id: 1, related_ids: [2, 3], categories: [{ id: 10, slug: 'keyboards' }] };
const response = products => ({ ok: true, json: async () => products });
const ids = products => [...products].map(item => item.id);
const pendingUntilAborted = signal => new Promise((_, reject) => {
  signal.addEventListener('abort', () => reject(signal.reason), { once: true });
});
function api(fetch) {
  return loadTypeScript('lib/woocommerce.ts', { globals: {
    fetch, console: { error() {}, warn() {} },
  } });
}

test('recommendations keep priority, exclude the current product, and remove duplicates', async () => {
  const requests = [];
  const { getRelatedProducts } = api(async (url, options) => {
    const query = new URL(url).searchParams;
    requests.push({ query, signal: options.signal });
    if (query.has('include')) return response([{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }]);
    if (query.has('category')) return response([{ id: 3 }, { id: 4 }, { id: 5 }]);
    return response([{ id: 1 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }]);
  });
  assert.deepEqual(ids(await getRelatedProducts(product)), [2, 3, 4, 5, 6, 7]);
  assert.equal(requests.length, 3);
  assert.ok(requests.every(request => request.signal === requests[0].signal));
});

test('six recommendations avoid unnecessary fallback requests', async () => {
  let calls = 0;
  const { getRelatedProducts } = api(async () => {
    calls++;
    return response([2, 3, 4, 5, 6, 7].map(id => ({ id })));
  });
  assert.equal((await getRelatedProducts(product)).length, 6);
  assert.equal(calls, 1);
});

test('a hung recommendation request is aborted and skips further fallbacks', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let calls = 0;
  let signal;
  const { getRelatedProducts } = api(async (_url, options) => {
    calls++;
    signal = options.signal;
    return pendingUntilAborted(signal);
  });
  const result = getRelatedProducts(product);
  t.mock.timers.tick(8000);
  assert.deepEqual(ids(await result), []);
  assert.equal(signal.aborted, true);
  assert.equal(calls, 1);
});

test('the eight-second limit covers the whole sequence and keeps partial results', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let calls = 0;
  const { getRelatedProducts } = api(async (_url, { signal }) => {
    calls++;
    if (calls === 1) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return response([{ id: 2 }]);
    }
    return pendingUntilAborted(signal);
  });
  const result = getRelatedProducts(product);
  t.mock.timers.tick(5000);
  await nextTurn();
  assert.equal(calls, 2);
  t.mock.timers.tick(3000);
  assert.deepEqual(ids(await result), [2]);
  assert.equal(calls, 2);
});

test('API failures degrade to no recommendations', async () => {
  const { getRelatedProducts } = api(async () => ({ ok: false, status: 503 }));
  assert.deepEqual(ids(await getRelatedProducts(product)), []);
});

test('pre-built recommendations preserve child category, parent, then related-ID priority', async () => {
  const queries = [];
  const { getRelatedProducts } = api(async url => {
    const query = new URL(url).searchParams;
    queries.push(query);
    return response([{ id: queries.length + 1 }]);
  });
  const prebuilt = { ...product, categories: [
    { id: 20, slug: 'pre-built-pcs' }, { id: 21, slug: 'lizard-series' },
  ] };
  assert.deepEqual(ids(await getRelatedProducts(prebuilt)), [2, 3, 4]);
  assert.equal(queries[0].get('category'), '21');
  assert.equal(queries[1].get('category'), '20');
  assert.equal(queries[2].get('include'), '2,3');
});
