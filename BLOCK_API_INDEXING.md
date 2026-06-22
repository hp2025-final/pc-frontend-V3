# 🛑 Block API Domain from Google Indexing

## Problem
Google Search Console is indexing/crawling `api.pcwalaonline.com` pages, which is your backend API and should NOT be indexed. Only frontend (`www.pcwalaonline.com`) should appear in search results.

---

## ✅ Solution: Add robots.txt to api.pcwalaonline.com

### Step 1: Create robots.txt on Backend

**Location:** `https://api.pcwalaonline.com/robots.txt`

**Content:**
```txt
User-agent: *
Disallow: /

# This is a backend API subdomain
# Not meant for public search engine indexing
# Frontend website: https://www.pcwalaonline.com
```

---

### Step 2: How to Add robots.txt (Choose One Method)

#### Method A: Via cPanel File Manager (Easiest)

1. Login to cPanel for api.pcwalaonline.com
2. Open **File Manager**
3. Navigate to `public_html/` (or root directory)
4. Click **+ File** to create new file
5. Name it: `robots.txt`
6. Right-click → **Edit**
7. Paste the content above
8. Save

#### Method B: Via WordPress (If API is WordPress/WooCommerce)

**Option 1: Use Plugin**
1. Install plugin: **Yoast SEO** or **All in One SEO**
2. Go to **SEO → Tools → File Editor**
3. Click **robots.txt**
4. Add `Disallow: /` under `User-agent: *`
5. Save

**Option 2: WordPress Settings**
1. Go to **Settings → Reading**
2. Check ☑️ **"Discourage search engines from indexing this site"**
3. Click **Save Changes**

This automatically adds noindex meta tags to all pages.

#### Method C: Via FTP

1. Open FTP client (FileZilla, etc.)
2. Connect to api.pcwalaonline.com
3. Navigate to root directory (usually `public_html/`)
4. Create new file: `robots.txt`
5. Upload the content above
6. Set permissions to 644

#### Method D: Via SSH/Terminal

```bash
ssh user@api.pcwalaonline.com
cd /path/to/public_html
nano robots.txt
# Paste the content, press Ctrl+X, Y, Enter
chmod 644 robots.txt
```

---

### Step 3: Add HTTP Header (Optional but Recommended)

If you have `.htaccess` access, add this for extra protection:

**File:** `api.pcwalaonline.com/.htaccess`

```apache
# Block search engine indexing via HTTP header
<IfModule mod_headers.c>
  Header set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"
</IfModule>
```

This sends `X-Robots-Tag` header with every response, telling search engines not to index ANY page on this domain.

---

## 🔍 Verification

### Test 1: Check robots.txt is Accessible

Visit in browser:
```
https://api.pcwalaonline.com/robots.txt
```

**Expected Result:**
```
User-agent: *
Disallow: /
```

### Test 2: Check HTTP Headers (if you added .htaccess)

**Using Browser:**
1. Open https://api.pcwalaonline.com
2. Press F12 (Developer Tools)
3. Go to **Network** tab
4. Refresh page
5. Click on first request
6. Look for `X-Robots-Tag: noindex, nofollow`

**Using Command Line:**
```bash
curl -I https://api.pcwalaonline.com
```

Look for: `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`

### Test 3: Google Robots Testing Tool

1. Go to: https://www.google.com/webmasters/tools/robots-testing-tool
2. Enter: `https://api.pcwalaonline.com/`
3. Click **Test**
4. Should show **"Blocked by robots.txt"**

---

## 🗑️ Remove Already Indexed Pages from Google

After blocking, you need to remove pages that are already indexed.

### Option 1: Google Search Console - Temporary Removal (Fast)

1. Go to: https://search.google.com/search-console
2. Add property: `api.pcwalaonline.com` (if not already added)
   - OR use existing property `www.pcwalaonline.com`
3. Click **Removals** in left sidebar
4. Click **New Request** button
5. Enter URL: `https://api.pcwalaonline.com/`
6. Select **"Remove all URLs with this prefix"**
7. Click **Next** → **Submit**

**Result:** Pages removed from search results within 24 hours (temporary for 6 months).

### Option 2: Wait for Natural De-Indexing (Slow)

- Once robots.txt blocks crawling, Google will naturally remove pages
- Timeline: 2-4 weeks
- No action needed, just wait

### Option 3: Use Google's URL Removal Tool (Individual URLs)

If you see specific indexed URLs, remove them one by one:

1. Copy the full URL (e.g., `https://api.pcwalaonline.com/wp-json/wc/v3/products`)
2. Go to Google Search Console → **Removals**
3. Click **New Request**
4. Paste URL
5. Select **"Temporarily remove URL from search results"**
6. Submit

---

## ✅ Checklist

- [ ] Created `robots.txt` on api.pcwalaonline.com with `Disallow: /`
- [ ] (Optional) Added `X-Robots-Tag` header via `.htaccess`
- [ ] Verified robots.txt is accessible: https://api.pcwalaonline.com/robots.txt
- [ ] (Optional) Tested with Google Robots Testing Tool
- [ ] Submitted removal request in Google Search Console
- [ ] Verified frontend robots.txt is correct: https://www.pcwalaonline.com/robots.txt

---

## 📊 Current Status

**Backend (API Domain):**
- Domain: `api.pcwalaonline.com`
- Purpose: WooCommerce REST API (data only)
- Should be indexed: ❌ **NO**
- Action: Block with robots.txt

**Frontend (Website):**
- Domain: `www.pcwalaonline.com`
- Purpose: Public website (Next.js)
- Should be indexed: ✅ **YES**
- Status: ✅ Already configured correctly

---

## 🎯 Expected Results

**Within 24 hours:**
- New crawl requests to api.pcwalaonline.com will be blocked
- Removal request processed (if submitted via Search Console)

**Within 1-2 weeks:**
- Google stops crawling api.pcwalaonline.com
- Already indexed pages start disappearing from search results

**Within 2-4 weeks:**
- All api.pcwalaonline.com pages removed from Google index
- Only www.pcwalaonline.com pages visible in search results

---

## 🔍 Monitoring

**Check if API pages are still indexed:**

Search in Google:
```
site:api.pcwalaonline.com
```

**Expected result after de-indexing:**
```
"Your search - site:api.pcwalaonline.com - did not match any documents."
```

**Check frontend indexing is working:**

Search in Google:
```
site:www.pcwalaonline.com
```

**Expected result:**
```
About 1,900 results (showing your indexed pages)
```

---

## 🆘 Troubleshooting

### Issue: robots.txt not accessible (404 error)

**Solution:**
- Check file location (must be in root directory, not subdirectory)
- Check file name (must be exactly `robots.txt`, lowercase)
- Check file permissions (should be 644)
- Clear CDN cache if using Cloudflare/CDN

### Issue: Pages still showing in Google after 2 weeks

**Solution:**
- Verify robots.txt is working: https://api.pcwalaonline.com/robots.txt
- Submit another removal request in Search Console
- Check if sitemap still includes API URLs (remove if found)
- Be patient - Google can take up to 4 weeks to fully de-index

### Issue: X-Robots-Tag header not showing

**Solution:**
- Verify .htaccess file is in the correct location
- Check if mod_headers is enabled on server (contact hosting support)
- Alternative: Use WordPress plugin to add header

---

## 📞 Need Help?

If you need assistance implementing this:
1. Contact your hosting provider (they can add robots.txt)
2. Contact your WordPress developer (if backend is WordPress)
3. Or do it yourself using cPanel File Manager (easiest method)

---

**🎯 Summary: Add `Disallow: /` to api.pcwalaonline.com/robots.txt and remove indexed pages via Google Search Console.**
