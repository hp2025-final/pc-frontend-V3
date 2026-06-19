# Homepage API Request Mapping — Line-by-Line Analysis
**File:** `app/page.tsx`  
**Total Requests:** 23-26 API calls to WooCommerce

---

## 📍 REQUEST #1: GET ALL CATEGORIES (Used by CategoriesGrid)

### Location in Code:
```typescript
// Line 19-36 in app/page.tsx
const [
  categories,  // ← REQUEST #1
  latestArrivalCategory,
  motherboardsCategory,
  // ...
] = await Promise.all([
  getCategories(),  // ← HERE: Fetches ALL 100 categories
  getCategoryBySlug("latest-arrival"),
  // ...
]);
```

### API Call:
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?per_page=100&consumer_key=xxx&consumer_secret=xxx
```

### Used By:
**CategoriesGrid Component** (Line 145-161)
```typescript
<CategoriesGrid 
  categoryCounts={{
    laptops: laptopsCategory?.count || 0,
    "pc-cases": pcCasesCategory?.count || 0,
    gpus: gpusCategory?.count || 0,
    motherboards: motherboardsCategory?.count || 0,
    cpus: cpusCategory?.count || 0,
    "pc-cooling-systems": pcCoolingSystemsCategory?.count || 0,
    "power-supplies": powerSuppliesCategory?.count || 0,
    storage: storageCategory?.count || 0,
    ram: ramCategory?.count || 0,
    "gaming-keyboards": gamingKeyboardsCategory?.count || 0,
    "gaming-mouse": gamingMouseCategory?.count || 0,
    "apple-products": appleProductsCategory?.count || 0,
  }}
/>
```

### What It Returns:
```json
[
  { "id": 123, "name": "Laptops", "slug": "laptops", "count": 45 },
  { "id": 456, "name": "GPUs", "slug": "gpus", "count": 78 },
  { "id": 789, "name": "Motherboards", "slug": "motherboards", "count": 34 },
  // ... all 100 categories
]
```

**⚠️ IMPORTANT:** This request already contains ALL the category data you need. The next 16 requests are redundant!

---

## 🔴 REQUESTS #2-17: REDUNDANT CATEGORY LOOKUPS (16 requests)

### The Problem:
You already have ALL categories from Request #1, but then you make 16 MORE individual requests to fetch the same categories again by slug.

---

### REQUEST #2: Latest Arrival Category

**Location:** Line 21
```typescript
latestArrivalCategory = await getCategoryBySlug("latest-arrival")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=latest-arrival
```

**Used By:** 
1. **Featured Products Section** (Line 91-92)
   ```typescript
   getProducts({
     category: latestArrivalCategory ? String(latestArrivalCategory.id) : undefined,
     per_page: 6,
   })
   ```

2. **Featured Products Total Count** (Line 116)
   ```typescript
   const featuredTotalCount = latestArrivalCategory?.count || featuredProducts.length;
   ```

3. **GridSection** (Line 169-178)
   ```typescript
   <GridSection 
     title="Latest Arrivals" 
     count={featuredProducts.length} 
     totalCount={featuredTotalCount}
     viewAllLink="/category/latest-arrival"
   >
   ```

---

### REQUEST #3: Motherboards Category

**Location:** Line 22
```typescript
motherboardsCategory = await getCategoryBySlug("motherboards")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=motherboards
```

**Used By:**
1. **Fetch Motherboard Products** (Line 71)
   ```typescript
   motherboards = motherboardsCategory 
     ? await getProducts({ category: String(motherboardsCategory.id), per_page: 4 })
     : []
   ```

2. **CategoriesGrid Count** (Line 150)
   ```typescript
   <CategoriesGrid categoryCounts={{ motherboards: motherboardsCategory?.count || 0 }} />
   ```

3. **NotablesSection** (Line 195)
   ```typescript
   <NotablesSection motherboards={motherboards} ... />
   ```

---

### REQUEST #4: Power Supplies Category

**Location:** Line 23
```typescript
powerSuppliesCategory = await getCategoryBySlug("power-supplies")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=power-supplies
```

**Used By:**
1. **Fetch Power Supply Products** (Line 72-73)
   ```typescript
   powerSupplies = powerSuppliesCategory 
     ? await getProducts({ category: String(powerSuppliesCategory.id), per_page: 4 })
     : []
   ```

2. **CategoriesGrid Count** (Line 153)
   ```typescript
   "power-supplies": powerSuppliesCategory?.count || 0
   ```

3. **NotablesSection** (Line 195)
   ```typescript
   <NotablesSection powerSupplies={powerSupplies} ... />
   ```

---

### REQUEST #5: Gaming Keyboards Category

**Location:** Line 24
```typescript
gamingKeyboardsCategory = await getCategoryBySlug("gaming-keyboards")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=gaming-keyboards
```

**Used By:**
1. **Fetch Gaming Keyboard Products** (Line 74-75)
   ```typescript
   gamingKeyboards = gamingKeyboardsCategory 
     ? await getProducts({ category: String(gamingKeyboardsCategory.id), per_page: 4 })
     : []
   ```

2. **CategoriesGrid Count** (Line 156)
   ```typescript
   "gaming-keyboards": gamingKeyboardsCategory?.count || 0
   ```

3. **NotablesSection** (Line 195)
   ```typescript
   <NotablesSection gamingKeyboards={gamingKeyboards} ... />
   ```

---

### REQUEST #6: RAM Category

**Location:** Line 25
```typescript
ramCategory = await getCategoryBySlug("ram")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=ram
```

**Used By:**
1. **CategoriesGrid Count ONLY** (Line 155)
   ```typescript
   ram: ramCategory?.count || 0
   ```

**⚠️ NOTE:** This category is ONLY used for displaying a count. No products are fetched. **Especially wasteful!**

---

### REQUEST #7: Storage Category

**Location:** Line 40
```typescript
storageCategory = await getCategoryBySlug("storage")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=storage
```

**Used By:**
1. **CategoriesGrid Count ONLY** (Line 154)
   ```typescript
   storage: storageCategory?.count || 0
   ```

**⚠️ NOTE:** Another count-only request. No products fetched.

---

### REQUEST #8: Laptops Category

**Location:** Line 41
```typescript
laptopsCategory = await getCategoryBySlug("laptops")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=laptops
```

**Used By:**
1. **CategoriesGrid Count** (Line 147)
   ```typescript
   laptops: laptopsCategory?.count || 0
   ```

2. **Hero Laptops Fallback** (Line 78-79 - conditional)
   ```typescript
   heroLaptops = laptopsCategory 
     ? await getProducts({ category: String(laptopsCategory.id), per_page: 5 })
     : await getProducts({ per_page: 5 })
   ```

**⚠️ NOTE:** Hero Laptops is no longer used because HeroSlider is commented out!

---

### REQUEST #9: PC Cases Category

**Location:** Line 42
```typescript
pcCasesCategory = await getCategoryBySlug("pc-cases")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=pc-cases
```

**Used By:**
1. **CategoriesGrid Count ONLY** (Line 148)
   ```typescript
   "pc-cases": pcCasesCategory?.count || 0
   ```

**⚠️ NOTE:** Count-only. No products fetched.

---

### REQUEST #10: GPUs Category

**Location:** Line 43
```typescript
gpusCategory = await getCategoryBySlug("gpus")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=gpus
```

**Used By:**
1. **CategoriesGrid Count ONLY** (Line 149)
   ```typescript
   gpus: gpusCategory?.count || 0
   ```

**⚠️ NOTE:** Count-only. No products fetched.

---

### REQUEST #11: CPUs Category

**Location:** Line 44
```typescript
cpusCategory = await getCategoryBySlug("cpus")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=cpus
```

**Used By:**
1. **CategoriesGrid Count ONLY** (Line 151)
   ```typescript
   cpus: cpusCategory?.count || 0
   ```

**⚠️ NOTE:** Count-only. No products fetched.

---

### REQUEST #12: PC Cooling Systems Category

**Location:** Line 45
```typescript
pcCoolingSystemsCategory = await getCategoryBySlug("pc-cooling-systems")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=pc-cooling-systems
```

**Used By:**
1. **CategoriesGrid Count ONLY** (Line 152)
   ```typescript
   "pc-cooling-systems": pcCoolingSystemsCategory?.count || 0
   ```

**⚠️ NOTE:** Count-only. No products fetched.

---

### REQUEST #13: Apple Products Category

**Location:** Line 50
```typescript
appleProductsCategory = await getCategoryBySlug("apple-products")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=apple-products
```

**Used By:**
1. **CategoriesGrid Count ONLY** (Line 157)
   ```typescript
   "apple-products": appleProductsCategory?.count || 0
   ```

**⚠️ NOTE:** Count-only. No products fetched.

---

### REQUEST #14: Printers & Scanners Category

**Location:** Line 51
```typescript
printersScannerCategory = await getCategoryBySlug("printers-scanners")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=printers-scanners
```

**Used By:**
1. **NOTHING!** This category is fetched but never used anywhere.

**⚠️ NOTE:** This is a completely dead request. Total waste!

---

### REQUEST #15: Gaming Mouse Category

**Location:** Line 52
```typescript
gamingMouseCategory = await getCategoryBySlug("gaming-mouse")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=gaming-mouse
```

**Used By:**
1. **Fetch Gaming Mouse Products** (Line 94)
   ```typescript
   gamingMouseProducts = gamingMouseCategory 
     ? await getProducts({ category: String(gamingMouseCategory.id), per_page: 8 })
     : []
   ```

2. **CategoriesGrid Count** (Line 156)
   ```typescript
   "gaming-mouse": gamingMouseCategory?.count || 0
   ```

3. **BannerProductSection** (Line 202-210)
   ```typescript
   <BannerProductSection
     title="Gaming Mouse"
     products={gamingMouseProducts}
     viewAllLink="/category/gaming-mouse"
   />
   ```

---

### REQUEST #16: MacBook Category

**Location:** Line 53
```typescript
macbookCategory = await getCategoryBySlug("macbook")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=macbook
```

**Used By:**
1. **Hero Laptops (Primary)** (Line 76-77 - but HeroSlider is commented out!)
   ```typescript
   heroLaptops = macbookCategory 
     ? await getProducts({ category: String(macbookCategory.id), per_page: 5 })
     : ...fallback
   ```

**⚠️ CRITICAL:** HeroSlider component is **COMMENTED OUT** on homepage (Line 140), so this entire fetch is wasted!

---

### REQUEST #17: On Sale Category

**Location:** Line 54
```typescript
onSaleCategory = await getCategoryBySlug("on-sale")
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products/categories?slug=on-sale
```

**Used By:**
1. **Fetch On-Sale Products** (Line 95)
   ```typescript
   onSaleProducts = onSaleCategory 
     ? await getProducts({ category: String(onSaleCategory.id), per_page: 100 })
     : []
   ```

2. **BannerProductSection** (Line 164-172)
   ```typescript
   <BannerProductSection
     title="On Sale"
     products={onSaleProducts}
     viewAllLink="/category/on-sale"
   />
   ```

---

## 📦 REQUESTS #18-24: PRODUCT FETCHES (7 requests)

These actually fetch product data to display on the homepage.

---

### REQUEST #18: Motherboard Products (4 items)

**Location:** Line 71
```typescript
motherboards = await getProducts({ 
  category: String(motherboardsCategory.id), 
  per_page: 4 
})
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?category={id}&per_page=4&status=publish
```

**Used By:**
```typescript
<NotablesSection motherboards={motherboards} ... />
```

**Returns:** 4 motherboard products for the Notables section

---

### REQUEST #19: Power Supply Products (4 items)

**Location:** Line 72
```typescript
powerSupplies = await getProducts({ 
  category: String(powerSuppliesCategory.id), 
  per_page: 4 
})
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?category={id}&per_page=4&status=publish
```

**Used By:**
```typescript
<NotablesSection powerSupplies={powerSupplies} ... />
```

**Returns:** 4 power supply products for the Notables section

---

### REQUEST #20: Gaming Keyboard Products (4 items)

**Location:** Line 74
```typescript
gamingKeyboards = await getProducts({ 
  category: String(gamingKeyboardsCategory.id), 
  per_page: 4 
})
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?category={id}&per_page=4&status=publish
```

**Used By:**
```typescript
<NotablesSection gamingKeyboards={gamingKeyboards} ... />
```

**Returns:** 4 gaming keyboard products for the Notables section

---

### REQUEST #21: Hero Laptops (5 items) — **WASTED!**

**Location:** Line 76-80
```typescript
heroLaptops = macbookCategory 
  ? await getProducts({ category: String(macbookCategory.id), per_page: 5 }) 
  : laptopsCategory 
    ? await getProducts({ category: String(laptopsCategory.id), per_page: 5 }) 
    : await getProducts({ per_page: 5 })
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?category={macbook_id}&per_page=5&status=publish
```

**Used By:**
```typescript
// Line 139-140 — COMMENTED OUT!
{/* <HeroSlider laptopProducts={heroLaptops} /> */}
```

**⚠️ CRITICAL:** This entire fetch is **COMPLETELY WASTED** because HeroSlider is commented out!

---

### REQUEST #22: Latest Arrival Products (6 items)

**Location:** Line 85-88
```typescript
latestArrivalProducts = await getProducts({
  category: latestArrivalCategory ? String(latestArrivalCategory.id) : undefined,
  per_page: 6,
})
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?category={id}&per_page=6&status=publish
```

**Used By:**
```typescript
<GridSection title="Latest Arrivals" ...>
  {featuredProducts.map((product) => (
    <PCD_2 product={product} />
  ))}
</GridSection>
```

**Returns:** 6 latest arrival products for the Featured Hardware section

---

### REQUEST #23: Gaming Mouse Products (8 items)

**Location:** Line 94
```typescript
gamingMouseProducts = await getProducts({ 
  category: String(gamingMouseCategory.id), 
  per_page: 8 
})
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?category={id}&per_page=8&status=publish
```

**Used By:**
```typescript
<BannerProductSection
  title="Gaming Mouse"
  products={gamingMouseProducts}
  viewAllLink="/category/gaming-mouse"
/>
```

**Returns:** 8 gaming mouse products for the Gaming Mouse banner section

---

### REQUEST #24: On-Sale Products (100 items!!!)

**Location:** Line 95
```typescript
onSaleProducts = await getProducts({ 
  category: String(onSaleCategory.id), 
  per_page: 100 
})
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?category={id}&per_page=100&status=publish
```

**Used By:**
```typescript
<BannerProductSection
  title="On Sale"
  products={onSaleProducts}
  viewAllLink="/category/on-sale"
/>
```

**Returns:** 100 on-sale products (way too many!)

**⚠️ ISSUE:** You're fetching 100 products but likely only displaying 8-12 in the carousel. This is wasteful.

---

## 🔴 REQUESTS #25-26: CONDITIONAL FALLBACKS (0-2 requests)

These only fire if the "Latest Arrival" category has no products.

### REQUEST #25: Featured Products Fallback (Conditional)

**Location:** Line 101-103
```typescript
if (!featuredProducts || featuredProducts.length === 0) {
  featuredProducts = await getProducts({ featured: true, per_page: 6 });
}
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?featured=true&per_page=6&status=publish
```

**Triggered When:** Latest Arrival category returns 0 products

---

### REQUEST #26: Generic Products Fallback (Conditional)

**Location:** Line 104-106
```typescript
if (!featuredProducts || featuredProducts.length === 0) {
  featuredProducts = await getProducts({ per_page: 6 });
}
```

**API Call:**
```
GET https://api.pcwalaonline.com/wp-json/wc/v3/products?per_page=6&status=publish
```

**Triggered When:** Latest Arrival AND Featured products both return 0 products

---

## 📊 SUMMARY BREAKDOWN

### **Category Lookups (17 requests)**
| # | Category | Used For | Wasteful? |
|---|----------|----------|-----------|
| 1 | All Categories | CategoriesGrid counts | ✅ NEEDED |
| 2 | Latest Arrival | Products + Count | 🔴 REDUNDANT |
| 3 | Motherboards | Products + Count | 🔴 REDUNDANT |
| 4 | Power Supplies | Products + Count | 🔴 REDUNDANT |
| 5 | Gaming Keyboards | Products + Count | 🔴 REDUNDANT |
| 6 | RAM | Count only | 🔴 REDUNDANT |
| 7 | Storage | Count only | 🔴 REDUNDANT |
| 8 | Laptops | Count + Fallback | 🔴 REDUNDANT |
| 9 | PC Cases | Count only | 🔴 REDUNDANT |
| 10 | GPUs | Count only | 🔴 REDUNDANT |
| 11 | CPUs | Count only | 🔴 REDUNDANT |
| 12 | PC Cooling | Count only | 🔴 REDUNDANT |
| 13 | Apple Products | Count only | 🔴 REDUNDANT |
| 14 | Printers | **NOTHING!** | 🔴 DEAD CODE |
| 15 | Gaming Mouse | Products + Count | 🔴 REDUNDANT |
| 16 | MacBook | **Commented out!** | 🔴 WASTED |
| 17 | On Sale | Products | 🔴 REDUNDANT |

### **Product Fetches (7 requests)**
| # | Products | Count | Used By | Status |
|---|----------|-------|---------|--------|
| 18 | Motherboards | 4 | NotablesSection | ✅ NEEDED |
| 19 | Power Supplies | 4 | NotablesSection | ✅ NEEDED |
| 20 | Gaming Keyboards | 4 | NotablesSection | ✅ NEEDED |
| 21 | Hero Laptops | 5 | **COMMENTED OUT** | 🔴 WASTED |
| 22 | Latest Arrivals | 6 | GridSection | ✅ NEEDED |
| 23 | Gaming Mouse | 8 | BannerProductSection | ✅ NEEDED |
| 24 | On Sale | **100!!!** | BannerProductSection | 🟡 TOO MANY |

### **Conditional Fallbacks (0-2 requests)**
| # | Fallback | Triggered When |
|---|----------|----------------|
| 25 | Featured Products | Latest Arrivals empty |
| 26 | Generic Products | Both above empty |

---

## 🎯 WASTED REQUESTS

### **Completely Wasted (3 requests):**
1. ❌ **REQUEST #14:** Printers & Scanners (never used)
2. ❌ **REQUEST #16:** MacBook category (HeroSlider commented out)
3. ❌ **REQUEST #21:** Hero Laptops products (HeroSlider commented out)

### **Redundant (16 requests):**
All category lookups (#2-17) are redundant because you already have that data from Request #1.

### **Over-Fetching (1 request):**
- **REQUEST #24:** Fetching 100 on-sale products when you likely only display 8-12

---

## ✅ OPTIMIZED VERSION WOULD BE:

1. **All Categories** (1 request) — Extract specific categories from this
2. **Motherboard Products** (1 request)
3. **Power Supply Products** (1 request)
4. **Gaming Keyboard Products** (1 request)
5. **Latest Arrival Products** (1 request)
6. **Gaming Mouse Products** (1 request)
7. **On Sale Products** (1 request, reduce to per_page=12)

**Total: 7 requests** (down from 23-26)

---

## 🚀 IMMEDIATE ACTIONS

### **Priority 1: Remove Dead Code**
- Delete macbookCategory fetch (line 53)
- Delete heroLaptops fetch (line 76-80)
- Delete printersScannerCategory fetch (line 51)

**Saves: 3 requests immediately**

### **Priority 2: Extract from getCategories()**
- Use the categories array from Request #1
- Map to extract needed categories by slug
- Remove all 16 individual getCategoryBySlug() calls

**Saves: 16 requests**

### **Priority 3: Reduce On-Sale Batch**
- Change `per_page: 100` to `per_page: 12`

**Saves: ~88 unnecessary products loaded**

---

**Want me to implement these fixes now?**
