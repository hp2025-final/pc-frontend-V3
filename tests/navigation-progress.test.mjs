import test from 'node:test';
import assert from 'node:assert/strict';
import loadTypeScript from './helpers/load-typescript.mjs';
const { isInternalPageNavigation, createNavigationProgress } = loadTypeScript('lib/navigation-progress.ts');

test('current-page, anchor, external, and non-page links do not start progress', () => {
  const current = 'https://example.test/product/keyboard?sort=latest';
  for (const href of [
    current, '#specifications', '/product/keyboard?sort=latest#specifications',
    'https://other.test/product/keyboard', '//other.test/', 'mailto:shop@example.test',
    'tel:123456789', 'javascript:void(0)', '', 'http://[invalid',
  ]) {
    assert.equal(isInternalPageNavigation(href, current), false, href);
  }
  assert.equal(isInternalPageNavigation('/product/mouse', current), true);
  assert.equal(isInternalPageNavigation('?sort=price_low', current), true);
  assert.equal(isInternalPageNavigation('https://example.test/category/ram', current), true);
});

test('fast completed navigation never flashes a loading indicator', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const changes = [];
  const progress = createNavigationProgress(value => changes.push(value));
  progress.start();
  t.mock.timers.tick(50);
  progress.stop();
  t.mock.timers.tick(20000);
  assert.deepEqual(changes, [false]);
});

test('failed or cancelled navigation recovers without a route-change event', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const changes = [];
  const progress = createNavigationProgress(value => changes.push(value));
  progress.start();
  t.mock.timers.tick(150);
  assert.deepEqual(changes, [true]);
  t.mock.timers.tick(14850);
  assert.deepEqual(changes, [true, false]);
});

test('a second navigation replaces the previous recovery deadline', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const changes = [];
  const progress = createNavigationProgress(value => changes.push(value));
  progress.start();
  t.mock.timers.tick(1000);
  progress.start();
  t.mock.timers.tick(14000);
  assert.equal(changes.includes(false), false);
  t.mock.timers.tick(1000);
  assert.equal(changes.at(-1), false);
});

test('completion, back navigation, and disposal cancel pending timers', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const changes = [];
  const progress = createNavigationProgress(value => changes.push(value));
  progress.start();
  t.mock.timers.tick(150);
  progress.stop();
  progress.start();
  progress.dispose();
  t.mock.timers.tick(20000);
  assert.deepEqual(changes, [true, false]);
});
