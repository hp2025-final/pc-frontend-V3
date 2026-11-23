import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { setImmediate as nextTurn } from 'node:timers/promises';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import loadTypeScript from './helpers/load-typescript.mjs';

const utils = loadTypeScript('lib/utils.ts');
const fixture = {
  id: 1, name: 'Main keyboard', slug: 'main-keyboard', sku: 'TEST-1',
  stock_status: 'instock', price: '100', regular_price: '100', sale_price: '',
  on_sale: false, tags: [], attributes: [], description: 'Keyboard description',
  short_description: 'Keyboard summary', categories: [{ id: 10, name: 'Keyboards', slug: 'keyboards' }],
  images: [], meta_data: [],
};

for (const route of ['product', 'pre-built-pc']) {
  for (const hasRecommendations of [true, false]) {
    test(`${route}: product and WhatsApp render before ${hasRecommendations ? 'slow' : 'unavailable'} recommendations`, { timeout: 5000 }, async (t) => {
      let releaseRecommendations;
      const pending = new Promise(resolve => { releaseRecommendations = resolve; });
      const RelatedProducts = loadTypeScript('components/RelatedProducts.tsx', { imports: {
        '@/lib/woocommerce': { getRelatedProducts: () => pending },
        '@/components/GridSection': ({ title, children }) => React.createElement('section', null,
          React.createElement('h2', null, title), children),
        '@/components/PCD_2': ({ product }) => React.createElement('span', null, product.name),
        './RelatedProducts.module.css': { productCard: 'product-card' },
      } }).default;
      const MainContent = ({ product, children, relatedContent }) => React.createElement('main', null,
        React.createElement('h1', null, product.name),
        React.createElement('a', { href: utils.generateWhatsAppLink(product) }, 'MESSAGE US NOW'),
        children, relatedContent);
      const filename = `app/${route}/[slug]/page.tsx`;
      const Page = loadTypeScript(filename, { imports: {
        '@/lib/woocommerce': { getProductBySlug: async () => fixture },
        '@/lib/utils': utils,
        '@/components/RelatedProducts': RelatedProducts,
        '@/components/RelatedProducts.module.css': { loading: 'related-loading' },
        './ProductPageClient': MainContent,
        './PreBuiltPCPageClient': MainContent,
        './ExpertAndWhySections': () => null,
      } }).default;

      const element = await Page({ params: Promise.resolve({ slug: fixture.slug }) });
      const output = new PassThrough();
      let html = '';
      const errors = [];
      output.on('data', chunk => { html += chunk.toString(); });
      const ended = new Promise(resolve => output.on('end', resolve));
      let shellReady;
      const shell = new Promise(resolve => { shellReady = resolve; });
      const stream = renderToPipeableStream(element, {
        onShellReady() { stream.pipe(output); shellReady(); },
        onError(error) { errors.push(error); },
      });
      t.after(() => { releaseRecommendations([]); stream.abort(); });

      await shell;
      await nextTurn();
      assert.match(html, /MESSAGE US NOW/);
      assert.match(html, /https:\/\/wa\.me\//);
      assert.match(html, /Loading related gear/);
      assert.doesNotMatch(html, /Recommended keyboard/);

      releaseRecommendations(hasRecommendations ? [{ ...fixture, id: 2, name: 'Recommended keyboard' }] : []);
      await ended;
      assert.equal(errors.length, 0);
      if (hasRecommendations) {
        assert.match(html, /Recommended keyboard/);
        assert.match(html, /Related Gear/);
      } else {
        assert.doesNotMatch(html, /<h2>Related Gear/);
      }
    });
  }
}
