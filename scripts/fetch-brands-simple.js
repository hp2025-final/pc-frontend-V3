/**
 * SIMPLE ONE-TIME SCRIPT: Fetch all brands from WooCommerce
 * 
 * Run: node scripts/fetch-brands-simple.js
 */

const BASE_URL = "https://api.pcwalaonline.com";
const CONSUMER_KEY = "ck_7f6d6fd81539e05b6feec56954ed88309642d695";
const CONSUMER_SECRET = "cs_c27dd09f9906b12d36e99c1caba693bf721805cb";

async function fetchBrands() {
  try {
    console.log('\n🔍 Fetching brand taxonomy from WooCommerce...\n');
    
    // Step 1: Get all product attributes to find the brand attribute ID
    const attributesUrl = `${BASE_URL}/wp-json/wc/v3/products/attributes?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
    
    console.log('📡 Fetching product attributes...');
    const attributesRes = await fetch(attributesUrl);
    
    if (!attributesRes.ok) {
      throw new Error(`HTTP ${attributesRes.status}: ${attributesRes.statusText}`);
    }
    
    const attributes = await attributesRes.json();
    console.log('✅ Found attributes:', attributes.map(a => `${a.name} (${a.slug})`).join(', '));
    
    // Step 2: Find the brand attribute (usually pa_brand or Brand)
    const brandAttribute = attributes.find(attr => 
      attr.slug === 'pa_brand' || 
      attr.name.toLowerCase() === 'brand' ||
      attr.name.toLowerCase().includes('brand')
    );
    
    if (!brandAttribute) {
      console.error('❌ Brand attribute not found. Available attributes:', attributes.map(a => a.name).join(', '));
      return;
    }
    
    console.log(`\n✅ Found brand attribute: "${brandAttribute.name}" (ID: ${brandAttribute.id}, Slug: ${brandAttribute.slug})\n`);
    
    // Step 3: Fetch all brand terms (all brands)
    // Try direct terms endpoint with attribute slug
    const brandsUrl = `${BASE_URL}/wp-json/wc/v3/products/attributes/${brandAttribute.id}/terms?per_page=200&hide_empty=false&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
    
    console.log('📡 Fetching all brands from attribute terms...');
    console.log('URL:', brandsUrl.replace(CONSUMER_KEY, 'KEY').replace(CONSUMER_SECRET, 'SECRET'));
    
    const brandsRes = await fetch(brandsUrl);
    
    if (!brandsRes.ok) {
      console.log('❌ Terms endpoint failed, trying alternative approach...\n');
      
      // Alternative: Try using the taxonomy directly
      const altBrandsUrl = `${BASE_URL}/wp-json/wp/v2/pa_brand?per_page=200&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
      const altBrandsRes = await fetch(altBrandsUrl);
      
      if (!altBrandsRes.ok) {
        throw new Error(`Both endpoints failed. Status: ${brandsRes.status}`);
      }
      
      const brandTerms = await altBrandsRes.json();
      console.log(`✅ Fetched ${brandTerms.length} brands via WordPress taxonomy\n`);
      
      processBrands(brandTerms);
      return;
    }
    
    const brandTerms = await brandsRes.json();
    
    console.log(`✅ Fetched ${brandTerms.length} brands\n`);
    
    processBrands(brandTerms);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nDetails:', error);
  }
}

function processBrands(brandTerms) {
  // Step 4: Filter brands with products and create the array
  const brands = brandTerms
    .filter(term => term.count > 0) // Only brands that have products
    .map(term => ({
      name: term.name.toUpperCase(),
      slug: `/brand/${term.slug}/page`
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  console.log(`📦 Found ${brands.length} brands with products:\n`);
  brands.forEach((b, idx) => {
    if (idx < 20) { // Show first 20
      console.log(`   ✓ ${b.name} → ${b.slug}`);
    }
  });
  
  if (brands.length > 20) {
    console.log(`   ... and ${brands.length - 20} more\n`);
  }
  
  console.log('\n─────────────────────────────────────────────────────────');
  console.log('📋 COPY THIS ARRAY TO BrandMarquee.tsx:');
  console.log('─────────────────────────────────────────────────────────\n');
  
  console.log('const brands: Brand[] = [');
  brands.forEach((brand, index) => {
    const comma = index < brands.length - 1 ? ',' : '';
    console.log(`  { name: "${brand.name}", slug: "${brand.slug}" }${comma}`);
  });
  console.log('];\n');
  
  console.log('─────────────────────────────────────────────────────────\n');
  console.log(`✅ Done! Found ${brands.length} brands from your WooCommerce store.\n`);
}

fetchBrands();
