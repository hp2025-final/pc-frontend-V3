# 🗺️ Sitemap Generation Guide - PC Wala Online V3

## 📋 Overview

This project uses **static sitemap files** generated locally and committed to Git. This approach:
- ✅ Avoids API calls during Vercel build (faster deployments)
- ✅ Gives you full control over when sitemaps update
- ✅ Generates SEO-friendly sitemaps with proper priority and change frequency

---

## 🚀 How to Run the Script

### Method 1: Using NPM Script (Recommended)

```bash
npm run generate-sitemaps
```

### Method 2: Direct Node Execution

```bash
node scripts/generate-sitemaps.js
```

---

## ⏱️ Expected Runtime

The script will take approximately **2-5 minutes** to complete depending on:
- Number of products (currently fetching 1800 products max)
- Your internet connection speed
- WooCommerce API response time

**Progress will be shown in real-time:**
```
🚀 PC Wala Online - Sitemap Generator
=====================================
📍 Site URL: https://www.pcwalaonline.com
🔗 API Base: https://api.pcwalaonline.com

📂 [1/4] Fetching categories with products...
   ✅ Found 24 categories with products

🏷️  [2/4] Fetching brands with products...
   ✅ Found 98 brands with products

📦 [3/4] Fetching products in batches...
   📥 Batch 1/18: Fetched 100 products (total: 100)
   📥 Batch 2/18: Fetched 100 products (total: 200)
   ... (continues until all products fetched)

📝 [4/4] Generating sitemap files...
   ✅ Generated sitemap-static.xml
   ✅ Generated sitemap-categories.xml
   ✅ Generated sitemap-products-1.xml
   ... (one file per 300 products)
```

---

## 📁 Where to Find the Results

All generated sitemaps are saved in the **`/public`** folder:

```
/public
  ├── sitemap.xml                  ← Main index (lists all sub-sitemaps)
  ├── sitemap-static.xml           ← Static pages (home, about, contact, etc.)
  ├── sitemap-categories.xml       ← Categories & brands (only with products)
  ├── sitemap-products-1.xml       ← Products 1-300
  ├── sitemap-products-2.xml       ← Products 301-600
  ├── sitemap-products-3.xml       ← Products 601-900
  ├── sitemap-products-4.xml       ← Products 901-1200
  ├── sitemap-products-5.xml       ← Products 1201-1500
  └── sitemap-products-6.xml       ← Products 1501-1800
```

---

## 🌐 How to Access Sitemaps in Browser

After generating and deploying, your sitemaps will be available at these URLs:

### Production (Live Site)
- **Main Index:** https://www.pcwalaonline.com/sitemap.xml
- **Static Pages:** https://www.pcwalaonline.com/sitemap-static.xml
- **Categories:** https://www.pcwalaonline.com/sitemap-categories.xml
- **Products 1:** https://www.pcwalaonline.com/sitemap-products-1.xml
- **Products 2:** https://www.pcwalaonline.com/sitemap-products-2.xml
- ... and so on

### Local Development
After running the script locally:
- **Main Index:** http://localhost:3000/sitemap.xml
- **Static Pages:** http://localhost:3000/sitemap-static.xml
- **Categories:** http://localhost:3000/sitemap-categories.xml
- **Products 1:** http://localhost:3000/sitemap-products-1.xml
- ... and so on

---

## 🔄 Complete Workflow (Step by Step)

### 1. Generate Sitemaps Locally

```bash
npm run generate-sitemaps
```

Wait for completion (2-5 minutes).

### 2. Review Generated Files

Open the `/public` folder and check:
- All sitemap-products-X.xml files are created
- sitemap.xml lists all sub-sitemaps
- File sizes look reasonable (each product sitemap should be ~50-150 KB)

### 3. Test Locally (Optional)

```bash
npm run dev
```

Visit http://localhost:3000/sitemap.xml in your browser to verify the sitemap structure.

### 4. Commit to Git

```bash
git add public/sitemap*.xml
git commit -m "Update sitemaps - $(Get-Date -Format 'yyyy-MM-dd')"
```

### 5. Push to GitHub

```bash
git push
```

### 6. Vercel Auto-Deploys

Vercel will automatically:
- Detect the push
- Build the project (fast, no sitemap generation during build)
- Deploy static sitemaps to CDN
- Sitemaps are live instantly!

---

## 🔧 Configuration Options

Edit **`scripts/generate-sitemaps.js`** to customize:

```javascript
const PRODUCTS_PER_SITEMAP = 300;    // Products per sitemap file
const PRODUCTS_PER_PAGE = 100;       // Products per API request
const REQUEST_DELAY = 300;           // Delay between requests (ms)
const MAX_PRODUCTS = 1800;           // Maximum products to fetch
```

**To fetch MORE products:**
Change `MAX_PRODUCTS` to a higher number (e.g., 3000)

**To make script FASTER:**
- Increase `PRODUCTS_PER_PAGE` to 100
- Decrease `REQUEST_DELAY` to 200ms
- (May put more load on API)

**To make script SLOWER (gentler on API):**
- Decrease `PRODUCTS_PER_PAGE` to 50
- Increase `REQUEST_DELAY` to 500ms

---

## 📅 When to Regenerate Sitemaps

Run the script when:
- ✅ You add/remove products in bulk
- ✅ You add/remove categories
- ✅ Weekly or monthly for freshness
- ✅ Before major SEO campaigns
- ✅ After migrating product data

**You DON'T need to regenerate for:**
- ❌ Individual product updates (1-5 products)
- ❌ Price changes
- ❌ Stock changes
- ❌ Minor content edits

---

## ✅ Verification Checklist

After deploying updated sitemaps:

1. **Check main sitemap:** https://www.pcwalaonline.com/sitemap.xml
   - Should list all sub-sitemaps

2. **Check a product sitemap:** https://www.pcwalaonline.com/sitemap-products-1.xml
   - Should have ~300 product URLs
   - Each URL should have loc, lastmod, changefreq, priority

3. **Check categories sitemap:** https://www.pcwalaonline.com/sitemap-categories.xml
   - Should only include categories with products (count > 0)

4. **Submit to Google Search Console:**
   - Go to: https://search.google.com/search-console
   - Sitemaps → Add new sitemap
   - Enter: `sitemap.xml`
   - Click Submit

---

## 🐛 Troubleshooting

### Script Fails with "API credentials not found"
**Solution:** Check that `.env.local` exists and has valid credentials:
```env
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...
```

### Script Takes Too Long / Times Out
**Solution:** Reduce `MAX_PRODUCTS` in the script (e.g., from 1800 to 900)

### Sitemap Not Visible After Deploy
**Solution:** 
1. Check `/public` folder has the sitemap files committed
2. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check Vercel deployment logs

### Empty Sitemap Files
**Solution:** Verify API credentials are correct and products exist in WooCommerce

---

## 📊 Sitemap Statistics (Current Setup)

Based on your latest generation:
- **Categories with products:** 24
- **Brands with products:** 98
- **Total products in sitemaps:** 1800 (max limit)
- **Product sitemaps generated:** 6 files (300 products each)
- **Total sitemap files:** 9 files
  - 1 main index (sitemap.xml)
  - 1 static pages (sitemap-static.xml)
  - 1 categories (sitemap-categories.xml)
  - 6 product sitemaps (sitemap-products-1 through 6)

---

## 🎯 Summary

**Quick Reference:**

| Action | Command |
|--------|---------|
| Generate sitemaps | `npm run generate-sitemaps` |
| View locally | `npm run dev` then visit `http://localhost:3000/sitemap.xml` |
| Commit sitemaps | `git add public/sitemap*.xml && git commit -m "Update sitemaps"` |
| Deploy | `git push` |
| View live | `https://www.pcwalaonline.com/sitemap.xml` |

---

**🎉 That's it! You now have a fully automated, locally-generated sitemap system!**
