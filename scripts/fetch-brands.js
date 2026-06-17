/**
 * ONE-TIME SCRIPT: Fetch all brands from WooCommerce
 * 
 * Run this script once to fetch brands from your backend:
 * node scripts/fetch-brands.js
 * 
 * This will output the brands array that you can copy-paste into BrandMarquee.tsx
 */

// Read from .env.local file manually
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const env = {};
    
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        env[key] = value;
      }
    });
    
    return env;
  } catch (error) {
    console.error('⚠️  Could not read .env.local file');
    return {};
  }
}

const env = loadEnv();
const BASE_URL = env.WOOCOMMERCE_BASE_URL || "https://api.pcwalaonline.com";
const CONSUMER_KEY = env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = env.WOOCOMMERCE_CONSUMER_SECRET;

async function fetchBrands() {
  try {
    console.log('\n🔍 Fetching brands from WooCommerce products...\n');

    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
      console.error('❌ Missing WooCommerce credentials in .env.local');
      return;
    }

    // Fetch products and extract unique brand names
    const productsUrl = `${BASE_URL}/wp-json/wc/v3/products?per_page=100&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
    
    console.log('📡 Fetching from:', BASE_URL);
    
    const productsRes = await fetch(productsUrl);
    
    if (!productsRes.ok) {
      throw new Error(`HTTP ${productsRes.status}: ${productsRes.statusText}`);
    }
    
    const products = await productsRes.json();
    
    console.log(`✅ Fetched ${products.length} products\n`);
    
    // Extract unique brands from product names (first word) and attributes
    const brandSet = new Set();
    
    products.forEach(product => {
      // Method 1: First word of product name
      const firstWord = product.name.split(' ')[0].toUpperCase();
      
      // Common PC hardware brands
      const knownBrands = [
        'ASUS', 'MSI', 'GIGABYTE', 'CORSAIR', 'INTEL', 'AMD', 'NVIDIA', 
        'KINGSTON', 'SAMSUNG', 'WESTERN', 'SEAGATE', 'CRUCIAL', 'RAZER', 
        'LOGITECH', 'NZXT', 'COOLER', 'THERMALTAKE', 'EVGA', 'G.SKILL', 
        'ASROCK', 'DEEPCOOL', 'LIAN', 'PHANTEKS', 'FRACTAL', 'SEASONIC',
        'ANTEC', 'DELL', 'HP', 'LENOVO', 'ACER', 'APPLE', 'MICROSOFT',
        'SANDISK', 'TOSHIBA', 'PATRIOT', 'TEAMGROUP', 'ADATA', 'PNY'
      ];
      
      if (knownBrands.includes(firstWord)) {
        brandSet.add(firstWord);
      }
      
      // Method 2: Check product attributes for brand
      if (product.attributes && Array.isArray(product.attributes)) {
        product.attributes.forEach(attr => {
          if (attr.name.toLowerCase().includes('brand') || attr.name.toLowerCase().includes('manufacturer')) {
            if (attr.options && Array.isArray(attr.options)) {
              attr.options.forEach(option => {
                brandSet.add(option.toUpperCase());
              });
            }
          }
        });
      }
    });
    
    const brands = Array.from(brandSet)
      .map(brand => ({
        name: brand,
        slug: `/search?q=${encodeURIComponent(brand.toLowerCase())}`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`📦 Found ${brands.length} unique brands:\n`);
    brands.forEach(b => console.log(`   - ${b.name}`));
    
    // Output the TypeScript array
    console.log('\n─────────────────────────────────────────────────────────');
    console.log('Copy this array into your BrandMarquee.tsx file:');
    console.log('─────────────────────────────────────────────────────────\n');
    
    console.log('const brands: Brand[] = [');
    brands.forEach((brand, index) => {
      const comma = index < brands.length - 1 ? ',' : '';
      console.log(`  { name: "${brand.name}", slug: "${brand.slug}" }${comma}`);
    });
    console.log('];\n');
    
    console.log('─────────────────────────────────────────────────────────');
    console.log(`\n✅ Total: ${brands.length} brands\n`);
    console.log('💡 Now copy the array above and paste it into:');
    console.log('   components/BrandMarquee.tsx (replace the existing brands array)\n');

  } catch (error) {
    console.error('❌ Error fetching brands:', error.message);
    console.error('\nMake sure your .env.local file has:');
    console.error('- WOOCOMMERCE_BASE_URL');
    console.error('- WOOCOMMERCE_CONSUMER_KEY');
    console.error('- WOOCOMMERCE_CONSUMER_SECRET');
  }
}

fetchBrands();
