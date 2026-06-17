# PC Wala V3 — Pages Architecture
> Load this file when working on Homepage, Category, Brand, Search, or Product pages.

---

## 📁 App Structure

```
app/
  layout.tsx                  ← Root layout (fonts, Meta Pixel, AnnouncementBar, Header, Footer)
  page.tsx                    ← Homepage
  globals.css                 ← CSS variables (source of truth for tokens)
  api/search/route.ts         ← Live search endpoint
  category/[slug]/page.tsx    ← Category listing with filters
  brand/[slug]/page.tsx       ← Brand listing with filters
  product/[slug]/
    page.tsx                  ← Product detail (Server Component)
    ProductPageClient.tsx     ← Product detail (Client Component)
    product.module.css        ← Scoped product page styles
  search/page.tsx             ← Search results
  about/page.tsx
  contact/page.tsx
  privacy/page.tsx
  terms/page.tsx
  warranty/page.tsx
```

---

## 🎯 HOMEPAGE ARCHITECTURE (`app/page.tsx`)

Stacking order (do not reorder):

1. **HeroSlider** — Vertical auto-scrolling product carousel (Laptops/Macbooks)
   - 7/5 asymmetric split desktop · stacked mobile
   - Auto-slides every 3s, pauses on hover · Height: 348px mobile / 600px desktop

2. **CategoriesGrid** — "SHOP BY CATEGORY"
   - Title: 64px desktop / 40px mobile (intentionally smaller than 84px standard)
   - 2-col mobile / 6-col desktop · Icons with product count badge

3. **BannerProductSection (On Sale)** — Banner + horizontal slider
   - 4-col banner left, 8-col products right (desktop) · 2 visible mobile, 4 desktop

4. **GridSection (Latest Arrivals)** — Featured products
   - 84px brutalist stacked title · 2-col mobile, 6-col desktop

5. **BrandMarquee** — Infinite horizontal brand scroll with lime dots

6. **CustomBuildBanners** — Custom PC build CTAs

7. **NotablesSection** — 3 sub-sections side-by-side (Motherboards / PSUs / Gaming Keyboards)
   - Each: 2×2 product grid · Mobile: stacked · Desktop: 4-4-4 split

8. **BannerProductSection (Gaming Mouse)** — Same as #3

9. **WhyChooseUs** — 38/62 asymmetric split
   - Left: "WHAT YOU UNLOCK" giant title · Right: 2×2 feature cards (numbered 01-04)

10. **SocialMediaSection** — YouTube/Instagram reels grid
    - 2-col mobile / 3-col desktop

**Data Flow:** All category/product data fetched in parallel with `Promise.all` · ISR: 3600s

---

## 📂 CATEGORY PAGE (`app/category/[slug]/page.tsx`)

1. **Breadcrumb** — `HOME / CATALOG / Category Name` (Space Mono, uppercase)
2. **Category Header** — 84px/48px brutalist title · lime corner bracket · count badge · last word orange
3. **CategoryControls** — 4-col filter bar (Search · Brand · Sort · Price)
4. **Product Grid** — 12-col blueprint, 2-col mobile, 30 products/page, PCD_2
5. **Pagination Bar** — Previous/Next + page numbers · smart ellipsis · orange active page

**Data Flow:** ISR 300s · supports brand/price filtering · sort options: date, price

---

## 🏷️ BRAND PAGE (`app/brand/[slug]/page.tsx`)

Nearly identical to Category Page with:
- Breadcrumb: `HOME / CATALOG / BRANDS / Brand Name`
- No brand dropdown in controls
- Uses `search: brandName` as workaround (less efficient than taxonomy)
- Empty state: `"// NO PRODUCTS IN THIS BRAND."`

**Known Limitation:** Brand pages use `search: brandName` instead of `brand: brandId`.
Future improvement: migrate to proper brand taxonomy filtering via `lib/brands.ts`.

---

## 🔍 SEARCH PAGE (`app/search/page.tsx`)

1. **Breadcrumb** — `HOME / CATALOG / SEARCH`
2. **Search Header** — `SEARCH: {query}` · count badge
3. **SearchControls** — 3-col (Sort · Price · Search box pre-filled)
4. **Product Grid** — Same as category page
5. **Pagination** — Same as category page

**Data Flow:** ISR 300s · requires `q` query param · empty state if no query

---

## 📄 PRODUCT PAGE (`app/product/[slug]/`)

**File Structure:**
- `page.tsx` — Server Component (data fetching, metadata)
- `ProductPageClient.tsx` — Client Component (image gallery state)
- `product.module.css` — Scoped styles with `.productPageWrapper` parent

### Layout (12-column grid)

**Top Row:**

**Left (6 cols) — Image Gallery:**
- Vertical thumbnail column (left) — 4 visible, active = orange 2px border
- Main image (center) — square aspect-ratio, lime corner bracket, stock badge overlay
- Navigation bar (right) — up/down arrows, "01 / 05" counter

**Right (6 cols) — Product Info:**
- Category badge (top-right, clickable)
- Product title (IBM Plex Sans 600)
- Price Module (6 scenarios — see `docs/pricing.md`)
- Location note: "In Stock at Saddar, Karachi — Order Now or Visit Us Today"
- Delivery info with truck icon
- Short description (HTML)
- WhatsApp button (lime `#ceff2f`)

**USP Marquee (full width):** Infinite scroll of selling points, links to WA and policy pages

**Bottom Row:**

**Left (6 cols) — Specifications Table:**
- Orange corner bracket top-right
- Sticky "SPECIFICATIONS" header (black bg, white text)
- 40/60 label/value columns · alternating rows · max-height 600px, scrollable
- Data from `product.attributes`

**Right (6 cols) — Detailed Description:**
- Lime corner bracket · HTML from `product.description`
- Styled: p, ul, ol, h2-h4

**Related Products (full width):**
- GridSection with 6 products max
- Fallback: `related_ids` → same category → general products

### Image Gallery Mobile Behavior
```ts
const getMobileThumbnailTransform = () => {
  if (totalImages <= 4) return 0;
  let offset = activeImageIndex;
  const maxOffset = totalImages - 4;
  if (offset > maxOffset) offset = maxOffset;
  if (offset < 0) offset = 0;
  return -(offset * 25); // 25% = 1 thumbnail height
};
```

### CSS Scoping — CRITICAL
All product page styles MUST be prefixed with `.productPageWrapper`:
```css
.productPageWrapper .productTitle { ... }
.productPageWrapper .priceModule { ... }
.productPageWrapper .whatsappButton { ... }
```

**Data Flow:** ISR 300s · Server Component fetches product + related · Client handles gallery state

---

## 🔄 DATA FLOW REFERENCE

```
WooCommerce REST API
       ↓
lib/woocommerce.ts  (fetch + ISR cache 300s)
       ↓
Next.js Server Component  (SSR / ISR)
       ↓
Component Tree  (PCD_2, GridSection, BannerProductSection, etc.)
       ↓
Browser → User clicks WhatsApp CTA → wa.me link → WhatsApp pre-filled order
```

**ISR Strategy:**
- Homepage: 3600s (1 hour)
- Category / Brand / Search / Product pages: 300s (5 minutes)
- All WooCommerce API calls: 300s default

---

## 🚀 Creating a New Page

1. Check if similar page exists (category/brand/search patterns)
2. Use Server Component for data fetching (with ISR)
3. Client Component only if interactivity needed
4. Follow: breadcrumb → header → controls → grid → pagination pattern
5. Mobile-first CSS with 769px desktop breakpoint