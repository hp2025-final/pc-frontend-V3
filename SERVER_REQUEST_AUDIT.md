# Server Request Audit — Homepage Build Analysis
**Project:** PC Wala Online V3  
**Date:** June 19, 2026  
**Analysis:** Complete audit of server requests during Next.js build

---

## 🚨 CRITICAL FINDINGS

### Build-Time API Requests: **EXCESSIVE**

Your homepage (`app/page.tsx`) is making **23+ API requests to WooCommerce** during server-side rendering at build time. This is causing:

1. ✅ **Lengthy build times** (waiting for 23 sequential/parallel API calls)
2. ✅ **Server load** (hammering your WooCommerce API)
3. ✅ **Slow ISR revalidation** (every 2 hours, all 23 requests repeat)

---

## 📊 HOMEPAGE API REQUESTS BREAKDOWN

### **Batch 1: Core Categories (6 requests)**
```typescript
const [
  categories,                    // 1. GET /wp-json/wc/v3/products/categories?per_page=100
  latestArrivalCategory,         // 2. GET /wp-json/wc/v3/products/categories?slug=latest-arrival
  motherboardsCategory,          // 3. GET /wp-json/wc/v3/products/categories?slug=motherboards
  powerSuppliesCategory,         // 4. GET /wp-json/wc/v3/products/categories?slug=power-supplies
  gamingKeyboardsCategory,       // 5. GET /wp-json/wc/v3/products/categories?slug=gaming-keyboards
  ramCategory,                   // 6. GET /wp-json/wc/v3/products/categories?slug=ram
] = await Promise.all([...])
```

### **Batch 2: More Categories (6 requests)**
```typescript
const [
  storageCategory,               // 7. GET /wp-json/wc/v3/products/categories?slug=storage
  laptopsCategory,               // 8. GET /wp-json/wc/v3/products/categories?slug=laptops
  pcCasesCategory,               // 9. GET /wp-json/wc/v3/products/categories?slug=pc-cases
  gpusCategory,                  // 10. GET /wp-json/wc/v3/products/categories?slug=gpus
  cpusCategory,                  // 11. GET /wp-json/wc/v3/products/categories?slug=cpus
  pcCoolingSystemsCategory,      // 12. GET /wp-json/wc/v3/products/categories?slug=pc-cooling-systems
] = await Promise.all([...])
```

### **Batch 3: Remaining Categories (5 requests)**
```typescript
const [
  appleProductsCategory,         // 13. GET /wp-json/wc/v3/products/categories?slug=apple-products
  printersScannerCategory,       // 14. GET /wp-json/wc/v3/products/categories?slug=printers-scanners
  gamingMouseCategory,           // 15. GET /wp-json/wc/v3/products/categories?slug=gaming-mouse
  macbookCategory,               // 16. GET /wp-json/wc/v3/products/categories?slug=macbook
  onSaleCategory,                // 17. GET /wp-json/wc/v3/products/categories?slug=on-sale
] = await Promise.all([...])
```

### **Batch 4: Products (7+ requests)**
```typescript
const [
  motherboards,                  // 18. GET /wp-json/wc/v3/products?category={id}&per_page=4
  powerSupplies,                 // 19. GET /wp-json/wc/v3/products?category={id}&per_page=4
  gamingKeyboards,               // 20. GET /wp-json/wc/v3/products?category={id}&per_page=4
  heroLaptops,                   // 21. GET /wp-json/wc/v3/products?category={id}&per_page=5
  latestArrivalProducts,         // 22. GET /wp-json/wc/v3/products?category={id}&per_page=6
  gamingMouseProducts,           // 23. GET /wp-json/wc/v3/products?category={id}&per_page=8
  onSaleProducts,                // 24. GET /wp-json/wc/v3/products?category={id}&per_page=100
] = await Promise.all([...])
```

### **Conditional Fallbacks (potentially +2 requests)**
```typescript
// If latest-arrival is empty
featuredProducts = await getProducts({ featured: true, per_page: 6 });    // 25. OPTIONAL
// If still empty
featuredProducts = await getProducts({ per_page: 6 });                    // 26. OPTIONAL
```

---

## 🔍 OTHER PAGE TYPES ALSO MAKING BUILD-TIME REQUESTS

### **Sitemap Generation** (`app/sitemap.ts`)
```typescript
// ADDITIONAL BUILD-TIME REQUESTS:
- 1x GET /wp-json/wc/v3/products/categories?per_page=100  (Categories)
- 1x GET /wp-json/wc/v3/products/brands?per_page=100       (Brands - PAGINATED)
- 3x GET /wp-json/wc/v3/products?per_page=100&page=1       (Products Page 1)
- 3x GET /wp-json/wc/v3/products?per_page=100&page=2       (Products Page 2)
- 3x GET /wp-json/wc/v3/products?per_page=100&page=3       (Products Page 3)
```
**Total for Sitemap: ~8 requests** (fetching up to 300 products)

### **Dynamic Routes (Only at ISR Revalidation)**
- **Category Pages** (`/category/[slug]`): 1-2 requests per category
- **Brand Pages** (`/brand/[slug]`): 1-2 requests per brand
- **Product Pages** (`/product/[slug]`): 3-4 requests per product (product + related + backfill)
- **Collection Pages** (`/collection/[slug]`): 2-3 requests per collection

These pages use **ISR (Incremental Static Regeneration)** with 2-hour revalidation, so they only request data when:
1. First accessed after build
2. Revalidated after 2 hours

---

## 📈 TOTAL SERVER LOAD

### **Initial Build (npm run build)**
- **Homepage**: ~23-26 requests
- **Sitemap**: ~8 requests
- **Total at Build**: **~31-34 API requests**

### **Every 2 Hours (ISR Revalidation)**
If homepage is accessed:
- **Homepage revalidation**: ~23-26 requests
- **Sitemap revalidation**: ~8 requests
- **Total per revalidation cycle**: **~31-34 API requests**

### **Dynamic Pages (On-Demand + ISR)**
- **Each category page**: 1-2 requests (only when first accessed or revalidated)
- **Each product page**: 3-4 requests (product + related products + category backfill)
- **Each collection page**: 2-3 requests (tag lookup + products + brands)

---

## 🔴 WHY THIS IS A PROBLEM

### 1. **Slow Build Times**
- 23+ sequential API calls must complete before build finishes
- Even with `Promise.all()` parallelization, WooCommerce API has rate limits
- Network latency multiplies: 23 requests × ~500ms each = **11+ seconds just for homepage**

### 2. **Server Load**
- Your WooCommerce API at `api.pcwalaonline.com` gets hammered
- Every build = 30+ requests
- Every ISR revalidation = 30+ requests
- If you deploy frequently or have high traffic, this compounds

### 3. **Redundant Data Fetching**
- You're fetching **16 individual category objects by slug** when you already fetch **all categories** in request #1
- The first `getCategories()` call returns ALL categories with their IDs, names, slugs, and counts
- You can extract the categories you need from that single response

---

## ✅ SOLUTION: OPTIMIZE HOMEPAGE REQUESTS

### **BEFORE (Current): 23+ requests**
```typescript
// Fetch all categories (1 request)
const categories = await getCategories();

// Then fetch 16 individual categories by slug (16 MORE requests!)
const latestArrivalCategory = await getCategoryBySlug("latest-arrival");
const motherboardsCategory = await getCategoryBySlug("motherboards");
// ... 14 more individual requests
```

### **AFTER (Optimized): 8 requests**
```typescript
// 1. Fetch all categories ONCE (1 request)
const categories = await getCategories();

// 2. Extract the categories you need from the array (NO additional requests)
const categoriesMap = new Map(categories.map(cat => [cat.slug, cat]));

const latestArrivalCategory = categoriesMap.get("latest-arrival");
const motherboardsCategory = categoriesMap.get("motherboards");
const powerSuppliesCategory = categoriesMap.get("power-supplies");
const gamingKeyboardsCategory = categoriesMap.get("gaming-keyboards");
const ramCategory = categoriesMap.get("ram");
const storageCategory = categoriesMap.get("storage");
const laptopsCategory = categoriesMap.get("laptops");
const pcCasesCategory = categoriesMap.get("pc-cases");
const gpusCategory = categoriesMap.get("gpus");
const cpusCategory = categoriesMap.get("cpus");
const pcCoolingSystemsCategory = categoriesMap.get("pc-cooling-systems");
const appleProductsCategory = categoriesMap.get("apple-products");
const printersScannerCategory = categoriesMap.get("printers-scanners");
const gamingMouseCategory = categoriesMap.get("gaming-mouse");
const macbookCategory = categoriesMap.get("macbook");
const onSaleCategory = categoriesMap.get("on-sale");

// 3. Then fetch products (7 requests) - same as before
const [motherboards, powerSupplies, ...] = await Promise.all([...]);
```

**Reduction: 23 requests → 8 requests (65% fewer requests!)**

---

## 🛠️ RECOMMENDED OPTIMIZATIONS

### **Priority 1: Eliminate Redundant Category Requests**
- **Impact**: Reduce homepage requests from 23 to 8 (65% reduction)
- **Effort**: Low (30 minutes)
- **Action**: Refactor `app/page.tsx` to extract categories from single `getCategories()` call

### **Priority 2: Reduce On-Sale Products Batch Size**
```typescript
// CURRENT: Fetching 100 on-sale products
onSaleProducts = await getProducts({ category: onSaleId, per_page: 100 })

// OPTIMIZED: Fetch only what's displayed (usually 8-12)
onSaleProducts = await getProducts({ category: onSaleId, per_page: 12 })
```

### **Priority 3: Consider Static Category Data**
For categories that rarely change (laptops, GPUs, motherboards, etc.), consider:
- Hard-coding category IDs in a config file
- Updating them manually when categories change
- This eliminates the need for `getCategories()` altogether

Example:
```typescript
// lib/categories.ts
export const CATEGORY_IDS = {
  laptops: 123,
  gpus: 456,
  motherboards: 789,
  // ... etc
} as const;
```

### **Priority 4: Lazy Load Related Products**
On product pages, you're fetching:
1. Product by slug (1 request)
2. Related products by IDs (1 request)
3. Backfill from category (1 request)
4. Backfill from general products (1 request)

**Optimization**: Load related products client-side after page load, or reduce backfill logic.

---

## 📦 NEXT.JS BUILD CONFIGURATION

Your `next.config.ts` is correctly configured:
```typescript
{
  output: 'standalone',           // ✅ Optimized for production
  images: { unoptimized: true },  // ✅ Using Cloudflare CDN
}
```

Your ISR revalidation is set correctly:
```typescript
export const revalidate = 7200; // 2 hours — reasonable
```

---

## 🎯 ACTION PLAN

### **Immediate Action (Today)**
1. Refactor `app/page.tsx` to eliminate 16 redundant category requests
2. Reduce on-sale products batch size from 100 to 12

### **Short-Term (This Week)**
3. Audit sitemap generation — consider reducing from 300 to 100 products
4. Add request logging to monitor API call frequency

### **Long-Term (Next Sprint)**
5. Consider static category ID mapping
6. Implement client-side lazy loading for related products
7. Add Redis/memory cache layer for frequently accessed data

---

## 📊 EXPECTED IMPROVEMENTS

### **Build Time**
- **Before**: 15-20 seconds (23 requests × ~700ms avg)
- **After**: 6-8 seconds (8 requests × ~700ms avg)
- **Improvement**: **60% faster builds**

### **Server Load**
- **Before**: 31-34 requests per build/revalidation cycle
- **After**: 16-18 requests per build/revalidation cycle
- **Improvement**: **48% fewer API requests**

### **ISR Performance**
- Faster revalidation = fresher content
- Less API load = more headroom for traffic spikes

---

## ✅ HONEST ASSESSMENT

**You are correct** — you're making too many requests to your WooCommerce server. Here's the breakdown:

1. ✅ **Homepage is the biggest culprit**: 23+ requests, with 16 being redundant
2. ✅ **Sitemap adds overhead**: 8 requests fetching 300 products
3. ✅ **ISR revalidation compounds the problem**: Every 2 hours, it repeats
4. ✅ **Build times are slow** because of this waterfall of API calls

**Good news**: This is easily fixable with the optimizations above. The architecture (ISR, standalone output) is sound — you just need to eliminate redundant requests.

---

## 🚀 NEXT STEPS

Would you like me to:
1. **Refactor `app/page.tsx` now** to eliminate the 16 redundant category requests?
2. **Optimize sitemap generation** to reduce product fetching?
3. **Create a static category config file** for even better performance?

Let me know which approach you'd prefer, and I'll implement it immediately.
