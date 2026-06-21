/**
 * Local Sitemap Generator for PC Wala Online V3
 * 
 * This script generates static XML sitemap files in the /public folder.
 * Run this locally whenever you need to update sitemaps (e.g., weekly, after bulk product updates).
 * 
 * Usage: npm run generate-sitemaps
 * 
 * Features:
 * - Fetches all products and categories from WooCommerce API
 * - Generates sitemap files with 300 products per file
 * - Only includes categories with products (count > 0)
 * - Throttled API calls to avoid backend overload
 * - Progress logging with ETA
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.WOOCOMMERCE_BASE_URL || 'https://api.pcwalaonline.com';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcwalaonline.com';

const PRODUCTS_PER_SITEMAP = 300;
const PRODUCTS_PER_PAGE = 100; // Fetch 100 per page for speed
const REQUEST_DELAY = 300; // 300ms delay between requests
const MAX_PRODUCTS = 1800; // Maximum products to fetch (6 sitemaps × 300)

// Validate environment variables
if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  console.error('❌ Error: WooCommerce API credentials not found in .env.local');
  process.exit(1);
}

// Helper: Sleep function for throttling
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Fetch with auth
async function fetchWooCommerce(endpoint) {
  const url = `${BASE_URL}/wp-json/wc/v3/${endpoint}${endpoint.includes('?') ? '&' : '?'}consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}

// Fetch all categories with products
async function fetchCategories() {
  console.log('\n📂 [1/4] Fetching categories with products...');
  
  try {
    const categories = await fetchWooCommerce('products/categories?per_page=100&status=publish');
    const categoriesWithProducts = categories.filter(cat => cat.count > 0);
    
    console.log(`   ✅ Found ${categoriesWithProducts.length} categories with products (filtered from ${categories.length} total)`);
    return categoriesWithProducts;
  } catch (error) {
    console.error('   ❌ Failed to fetch categories');
    return [];
  }
}

// Fetch all brands with products
async function fetchBrands() {
  console.log('\n🏷️  [2/4] Fetching brands with products...');
  
  try {
    let allBrands = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const brands = await fetchWooCommerce(`products/brands?per_page=100&page=${page}`);
      
      if (brands.length === 0) {
        hasMore = false;
      } else {
        allBrands.push(...brands);
        if (brands.length < 100) {
          hasMore = false;
        } else {
          page++;
          await sleep(REQUEST_DELAY);
        }
      }
    }

    const brandsWithProducts = allBrands.filter(brand => brand.count > 0);
    console.log(`   ✅ Found ${brandsWithProducts.length} brands with products (filtered from ${allBrands.length} total)`);
    return brandsWithProducts;
  } catch (error) {
    console.error('   ❌ Failed to fetch brands');
    return [];
  }
}

// Fetch all products in batches
async function fetchAllProducts() {
  console.log('\n📦 [3/4] Fetching products in batches...');
  console.log(`   ⚙️  Configuration: ${PRODUCTS_PER_PAGE} products/page, ${REQUEST_DELAY}ms delay, max ${MAX_PRODUCTS} products`);
  
  const allProducts = [];
  const totalPages = Math.ceil(MAX_PRODUCTS / PRODUCTS_PER_PAGE);
  
  for (let page = 1; page <= totalPages; page++) {
    try {
      const products = await fetchWooCommerce(`products?per_page=${PRODUCTS_PER_PAGE}&page=${page}&status=publish`);
      
      if (products.length === 0) {
        console.log(`   ℹ️  No more products found at page ${page}`);
        break;
      }
      
      allProducts.push(...products);
      console.log(`   📥 Batch ${page}/${totalPages}: Fetched ${products.length} products (total: ${allProducts.length})`);
      
      // Stop if we got fewer products than requested (end of catalog)
      if (products.length < PRODUCTS_PER_PAGE) {
        console.log(`   ✅ Reached end of product catalog`);
        break;
      }
      
      // Throttle to avoid overwhelming the API
      if (page < totalPages) {
        await sleep(REQUEST_DELAY);
      }
    } catch (error) {
      console.error(`   ❌ Error fetching page ${page}:`, error.message);
      break;
    }
  }
  
  console.log(`   ✅ Total products fetched: ${allProducts.length}`);
  return allProducts;
}

// Generate XML sitemap content
function generateSitemapXML(urls) {
  const urlEntries = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Generate sitemap index (main sitemap.xml)
function generateSitemapIndex(sitemapFiles) {
  const sitemapEntries = sitemapFiles.map(filename => `  <sitemap>
    <loc>${SITE_URL}/${filename}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

// Main function
async function generateSitemaps() {
  console.log('🚀 PC Wala Online - Sitemap Generator');
  console.log('=====================================\n');
  console.log(`📍 Site URL: ${SITE_URL}`);
  console.log(`🔗 API Base: ${BASE_URL}`);
  
  const startTime = Date.now();
  const publicDir = path.join(process.cwd(), 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    // Fetch all data
    const [categories, brands, products] = await Promise.all([
      fetchCategories(),
      fetchBrands(),
      fetchAllProducts()
    ]);

    console.log('\n📝 [4/4] Generating sitemap files...');
    const generatedFiles = [];

    // 1. Generate static pages sitemap
    const staticUrls = [
      { loc: SITE_URL, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
      { loc: `${SITE_URL}/about`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.5' },
      { loc: `${SITE_URL}/contact`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.5' },
      { loc: `${SITE_URL}/privacy`, lastmod: new Date().toISOString(), changefreq: 'yearly', priority: '0.3' },
      { loc: `${SITE_URL}/terms`, lastmod: new Date().toISOString(), changefreq: 'yearly', priority: '0.3' },
      { loc: `${SITE_URL}/warranty`, lastmod: new Date().toISOString(), changefreq: 'yearly', priority: '0.3' },
      { loc: `${SITE_URL}/collection/price-drops`, lastmod: new Date().toISOString(), changefreq: 'hourly', priority: '0.9' },
      { loc: `${SITE_URL}/collection/price-increases`, lastmod: new Date().toISOString(), changefreq: 'hourly', priority: '0.9' },
      { loc: `${SITE_URL}/collection/on-sale`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.9' },
      { loc: `${SITE_URL}/collection/high-fluctuation`, lastmod: new Date().toISOString(), changefreq: 'hourly', priority: '0.8' },
      { loc: `${SITE_URL}/collection/market-price`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.8' },
    ];

    const staticXML = generateSitemapXML(staticUrls);
    fs.writeFileSync(path.join(publicDir, 'sitemap-static.xml'), staticXML);
    generatedFiles.push('sitemap-static.xml');
    console.log(`   ✅ Generated sitemap-static.xml (${staticUrls.length} pages)`);

    // 2. Generate categories + brands sitemap
    const categoryUrls = categories.map(cat => ({
      loc: `${SITE_URL}/category/${cat.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.8'
    }));

    const brandUrls = brands.map(brand => ({
      loc: `${SITE_URL}/brand/${brand.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.7'
    }));

    const categoriesXML = generateSitemapXML([...categoryUrls, ...brandUrls]);
    fs.writeFileSync(path.join(publicDir, 'sitemap-categories.xml'), categoriesXML);
    generatedFiles.push('sitemap-categories.xml');
    console.log(`   ✅ Generated sitemap-categories.xml (${categories.length} categories + ${brands.length} brands)`);

    // 3. Generate product sitemaps (300 products per file)
    const totalProductSitemaps = Math.ceil(products.length / PRODUCTS_PER_SITEMAP);
    
    for (let i = 0; i < totalProductSitemaps; i++) {
      const start = i * PRODUCTS_PER_SITEMAP;
      const end = Math.min(start + PRODUCTS_PER_SITEMAP, products.length);
      const chunkProducts = products.slice(start, end);
      
      const productUrls = chunkProducts.map(prod => {
        const hasVolatileTag = prod.tags?.some(
          t => t.slug === 'price-down' || t.slug === 'price-up' || t.slug === 'shift'
        );
        
        return {
          loc: `${SITE_URL}/product/${prod.slug}`,
          lastmod: prod.date_modified || new Date().toISOString(),
          changefreq: hasVolatileTag ? 'hourly' : 'daily',
          priority: hasVolatileTag ? '0.9' : '0.8'
        };
      });
      
      const productXML = generateSitemapXML(productUrls);
      const filename = `sitemap-products-${i + 1}.xml`;
      fs.writeFileSync(path.join(publicDir, filename), productXML);
      generatedFiles.push(filename);
      console.log(`   ✅ Generated ${filename} (${chunkProducts.length} products)`);
    }

    // 4. Generate main sitemap index
    const sitemapIndexXML = generateSitemapIndex(generatedFiles);
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndexXML);
    console.log(`   ✅ Generated sitemap.xml (main index with ${generatedFiles.length} sub-sitemaps)`);

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n✅ SITEMAP GENERATION COMPLETE!');
    console.log('=====================================');
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📁 Location: /public`);
    console.log(`📄 Files generated: ${generatedFiles.length + 1}`);
    console.log(`   • sitemap.xml (main index)`);
    generatedFiles.forEach(file => console.log(`   • ${file}`));
    console.log('\n🚀 Next steps:');
    console.log('   1. Review the generated files in /public');
    console.log('   2. git add public/sitemap*.xml');
    console.log('   3. git commit -m "Update sitemaps"');
    console.log('   4. git push');
    console.log('\n✨ Sitemaps will be live after Vercel deployment!\n');

  } catch (error) {
    console.error('\n❌ SITEMAP GENERATION FAILED');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
generateSitemaps();
