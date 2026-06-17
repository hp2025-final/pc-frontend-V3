# PC Wala V3 — AI Agent Guide
> Place this file at the project root. AWS Kiro and most AI coding tools auto-load it.

---

## 🚨 RULE ZERO — EXPLORE FIRST, CODE SECOND

Before writing a single line of code, you MUST:
1. Read the files in the area you are working on
2. Check if the utility / component / style already exists
3. Understand the existing CSS pattern in the relevant `.module.css`
4. Only then write or modify code

**Never assume. Never hallucinate structure. Always read first.**

If you are asked to build a new component, open:
- The closest existing component for pattern reference
- Its `.module.css` for style reference
- `lib/utils.ts` to avoid duplicating utilities
- `lib/types.ts` for existing interfaces

---

## 🏗️ Project Identity

**Name**: PC Wala Online V3  
**Type**: Headless e-commerce storefront — Pakistani PC / tech components retailer, Karachi  
**Stack**: Next.js 16.2.6 · React 19.2.4 · TypeScript 5 · Vanilla CSS Modules  
**Backend**: Headless WooCommerce — REST API at `https://api.pcwalaonline.com`  
**Deploy**: Vercel (standalone output)  
**Status**: Actively in production — existing design and components must be preserved

---

## ⚡ COMMERCE MODEL — WHATSAPP FIRST (CRITICAL)

This store has **NO cart, NO checkout, NO payment gateway. Full stop.**

Every product CTA must open WhatsApp with a pre-filled order message.

```ts
// Always use this utility — never write a custom WA link
import { generateWhatsAppLink } from "@/lib/utils";
const link = generateWhatsAppLink(product);
// → https://wa.me/+923423355119?text=Hello+PC+Wala...
```

- ❌ Never add `addToCart`, `checkout`, `payment`, `order form`, `Stripe`, `PayFast`
- ✅ Always wire CTAs to `generateWhatsAppLink(product)`
- WA number lives in `process.env.NEXT_PUBLIC_WA_NUMBER` — never hardcode it

---

## 🎨 DESIGN SYSTEM — "Technical Brutalist Futurism"

This is a **locked design system**. Do not introduce new colors, fonts, radii, or shadows outside these tokens.

### Color Palette (exactly 6 — no others)

```css
--color-white:      #ffffff;   /* cards, surfaces */
--color-off-white:  #f9f9f9;   /* page backgrounds */
--color-border:     #dadada;   /* all borders, outlines */
--color-dark:       #1a1c1c;   /* primary text, dark sections */
--color-orange:     #ff7a2f;   /* CTAs, prices, brand accent */
--color-lime:       #ceff2f;   /* stock badges, active indicators */
```

**Never use** `rgba(0,0,0,0.x)` for tints, Tailwind color names, or any hex not in the above list.

### Typography (exactly 3 fonts — no others)

| Role | Font | Weights | Use for |
|------|------|---------|---------|
| Display | `'Sora'` | 600, 700, 800 | Headlines, section titles, hero text |
| Body | `'IBM Plex Sans'` | 400, 500, 600 | All body copy, descriptions, UI text |
| Mono | `'Space Mono'` | 400, 700 | Labels, tags, prices, badges, specs |

### Spacing & Layout

- **Grid**: 12-column blueprint grid
- **Borders**: `1px solid var(--color-border)` or `1px solid var(--color-dark)` — always 1px
- **Gutters**: multiples of 8px (8, 16, 24, 32, 48, 64)
- **Density**: prefer dense over airy — this is a tech store, not a luxury brand

### Hard Design Rules (Non-Negotiable)

```css
/* ✅ CORRECT */
border-radius: 0;                          /* brutalist = sharp corners always */
border: 1px solid var(--color-border);     /* blueprint grid aesthetic */
font-family: 'Space Mono', monospace;      /* for prices & labels */
text-transform: uppercase;                 /* for category labels & badges */

/* ❌ WRONG — never write these */
border-radius: 4px;          /* or 8px, or 12px, or 50% */
box-shadow: 0 4px 20px ...;  /* heavy shadows are off-brand */
background: linear-gradient; /* no gradients */
font-family: system-ui;      /* use the defined font stack */
```

### Signature Visual Elements

1. **Orange/Lime Bracket Corners** — `::before`/`::after` pseudo-elements on badges and card headers
2. **Lime Dot Indicators** — 8px circles for in-stock / active states
3. **All-caps Labels** — every badge, tag, category name is `text-transform: uppercase`
4. **Dense 2-Col Mobile Grid** — product cards are 2 columns on mobile, never 1
5. **12-Col Blueprint Grid** — all major layouts use 12-column grid system

---

## 📁 Project Structure

```
app/
  layout.tsx                  ← Root layout (fonts, Meta Pixel, AnnouncementBar, Header, Footer)
  page.tsx                    ← Homepage
  globals.css                 ← CSS variables (the source of truth for tokens)
  api/search/route.ts         ← Live search endpoint
  category/[slug]/page.tsx    ← Category listing with filters
  brand/[slug]/page.tsx       ← Brand listing with filters
  product/[slug]/
    page.tsx                  ← Product detail (Server Component)
    ProductPageClient.tsx     ← Product detail (Client Component for interactivity)
    product.module.css        ← Scoped product page styles
  search/page.tsx             ← Search results
  about/page.tsx              ← About page
  contact/page.tsx            ← Contact page
  privacy/page.tsx            ← Privacy policy
  terms/page.tsx              ← Terms & conditions
  warranty/page.tsx           ← Warranty policy

components/
  AnnouncementBar.tsx         ← Top bar with announcement
  Header.tsx                  ← Main navigation header
  MobileBottomNav.tsx         ← Mobile bottom navigation
  NewFooter.tsx               ← Site footer
  BrutalistProgressBar.tsx    ← Page load progress indicator
  HeroSlider.tsx              ← Homepage hero with vertical product slider
  CategoriesGrid.tsx          ← Category grid section
  BrandMarquee.tsx            ← Infinite horizontal brand scroll
  GridSection.tsx             ← Reusable product grid wrapper
  BannerProductSection.tsx    ← Banner + horizontal product slider
  NotablesSection.tsx         ← 3-column notable products
  WhyChooseUs.tsx             ← Value proposition section
  SocialMediaSection.tsx      ← Social media reels grid
  CustomBuildBanners.tsx      ← Custom PC build CTAs
  PCD_2.tsx                   ← Main product card (tag-aware pricing)
  ProductCard.tsx             ← Legacy product card (deprecated)
  Breadcrumb.tsx              ← Breadcrumb navigation
  CategoryControls.tsx        ← Category filter controls
  SearchControls.tsx          ← Search page controls
  SearchBar.tsx               ← Live search dropdown
  WhatsAppButton.tsx          ← Floating WhatsApp button
  OrderArrowButton.tsx        ← WhatsApp CTA arrow button
  [Component].module.css      ← Always paired with component

lib/
  woocommerce.ts              ← ALL WooCommerce API calls live here
  types.ts                    ← ALL TypeScript interfaces live here
  utils.ts                    ← Shared utilities (formatPrice, generateWhatsAppLink, etc.)
  brands.ts                   ← Static brand mappings for category filters

public/                       ← SVG icons only

---

## 🎯 HOMEPAGE ARCHITECTURE

The homepage (`app/page.tsx`) follows this exact stacking order:

1. **HeroSlider** — Vertical auto-scrolling product carousel (Laptops/Macbooks)
   - 7/5 asymmetric split on desktop (content left, products right)
   - Mobile: stacked (content top, products bottom)
   - Auto-slides every 3 seconds, pauses on hover
   - Shows 3 cards visible (0.5 + 1 + 1 + 0.5), center cards active
   - Height: 348px mobile / 600px desktop

2. **CategoriesGrid** — "SHOP BY CATEGORY" section
   - Title: 64px desktop / 40px mobile (reduced for better mobile fit)
   - 2-col mobile / 6-col desktop
   - Icons (Lucide + Simple Icons for Apple)
   - Product count badge in top-right
   - Orange bracket corner bottom-right
   - Hover: gray → lime color shift

3. **BannerProductSection (On Sale)** — Banner + horizontal product slider
   - Desktop: 4-col banner left, 8-col products right
   - Mobile: banner top (375px height), products below
   - Products: 2 visible mobile, 4 visible desktop
   - Auto-slides every 3 seconds
   - Navigation arrows in footer with "VIEW ALL"
   - Uses PCD_2 component for product cards

4. **GridSection (Latest Arrivals)** — Featured products
   - 84px brutalist stacked title with lime corner bracket
   - 12-col blueprint grid (2-col mobile, 6-col desktop)
   - Black "VIEW ALL" button with orange hover sweep
   - Uses PCD_2 component for product cards

5. **BrandMarquee** — Infinite horizontal scroll of 100+ tech brands
   - Seamless loop using tripled array
   - Lime dots between brand names

6. **CustomBuildBanners** — Custom PC build CTAs

7. **NotablesSection** — 3 sub-sections side-by-side
   - Motherboards / Power Supplies / Gaming Keyboards
   - Each shows 2×2 product grid (4 products)
   - Mobile: stacked vertically
   - Desktop: 4-4-4 column split
   - Sub-section titles use smaller typography (32px/24px)

8. **BannerProductSection (Gaming Mouse)** — Same pattern as #3

9. **WhyChooseUs** — Value proposition section
   - 38/62 asymmetric split desktop
   - Left: Giant "WHAT YOU UNLOCK" title with system tag
   - Right: 2×2 feature cards with icons
   - Cards: numbered (01-04), hover effects
   - Orange bracket corner on section

10. **SocialMediaSection** — YouTube/Instagram reels grid
    - Embeds videos from both platforms
    - 2-col mobile / 3-col desktop

**Data Flow:**
- All category/product data fetched in parallel using Promise.all
- ISR: Revalidate every 3600s (1 hour)
- Fallbacks: Latest Arrivals → Featured → General products

---

## 📂 CATEGORY PAGE ARCHITECTURE

Structure (`app/category/[slug]/page.tsx`):

1. **Breadcrumb** — `HOME / CATALOG / Category Name`
   - Space Mono font, all uppercase
   - Slashes as separators
   - Current page not linked

2. **Category Header** — Large brutalist title section
   - 84px stacked title (48px mobile)
   - Lime corner bracket bottom-right
   - Count badge inline on mobile: "XXX ITEMS"
   - Optional description below title
   - Last word in title = orange color

3. **CategoryControls** — 4-column filter bar
   - **Search** (live search with 300ms debounce)
   - **Brand** dropdown (from CATEGORY_BRANDS static mapping)
   - **Sort** dropdown (latest/oldest/price high-low)
   - **Price** dropdown (10 ranges from Rs. 1K-500K)
   - Mobile: 2×2 grid (50% each box)
   - Desktop: 1×4 row (25% each box)
   - All changes reset to page 1

4. **Product Grid** — 12-col blueprint grid
   - 2-col mobile minimum, 6 products/row desktop
   - Each product spans 2 columns
   - 30 products per page default
   - Uses PCD_2 component
   - Empty state: "// NO PRODUCTS IN THIS SEGMENT."

5. **Pagination Bar** — Inline button navigation
   - Previous/Next buttons on edges
   - Page numbers in center
   - Smart ellipsis (...) for long lists
   - Active page: orange background
   - All buttons: 48px height, mono font

**Data Flow:**
- ISR: Revalidate every 300s (5 minutes)
- Supports brand filtering via numeric brand ID
- Price range mapping to min/max values
- Sort options: date (asc/desc), price (asc/desc)

---

## 🏷️ BRAND PAGE ARCHITECTURE

Structure (`app/brand/[slug]/page.tsx`):

Nearly identical to Category Page with these differences:
- Breadcrumb: `HOME / CATALOG / BRANDS / Brand Name`
- No brand dropdown in controls (already filtered by brand)
- Uses search API with brand name as search term (workaround for brand taxonomy)
- Empty state: "// NO PRODUCTS IN THIS BRAND."

**Known Limitation:**
- Brand pages currently use `search: brandName` instead of `brand: brandId`
- This searches ALL product fields (less efficient) vs. taxonomy filtering
- Future improvement: Migrate to proper brand taxonomy filtering

---

## 🔍 SEARCH PAGE ARCHITECTURE

Structure (`app/search/page.tsx`):

1. **Breadcrumb** — `HOME / CATALOG / SEARCH`

2. **Search Header** — Brutalist title with query
   - Title: `SEARCH: {query}`
   - Lime corner bracket bottom-right
   - Count badge: "XXX ITEMS"

3. **SearchControls** — 3-column filter bar (no brand filter)
   - **Sort** dropdown
   - **Price** dropdown
   - Search box (pre-filled with query)

4. **Product Grid** — Same as category page
   - 12-col blueprint grid, 2-col mobile, 6 products/row desktop
   - Uses PCD_2 component

5. **Pagination** — Same as category page

**Data Flow:**
- ISR: Revalidate every 300s (5 minutes)
- Requires `q` query parameter
- Shows empty state if no query provided

---

## 📄 PRODUCT PAGE ARCHITECTURE

Complete redesign with 12-column layout, image gallery, and strict CSS scoping.

**File Structure:**
- `app/product/[slug]/page.tsx` — Server Component (data fetching, metadata)
- `app/product/[slug]/ProductPageClient.tsx` — Client Component (interactivity)
- `app/product/[slug]/product.module.css` — Scoped styles with `.productPageWrapper` parent

**Layout (12 columns):**

**Top Row:**
- **Left (6 cols): Image Gallery**
  - **Vertical thumbnail column (left side)**
    - Always visible, scrolls on mobile (shows 4, transforms to keep active in view)
    - Active thumbnail: orange 2px border
    - Hover: Lime border
    - Click to switch main image
  
  - **Main image (center)**
    - Square aspect-ratio with lime corner bracket bottom-right
    - Stock badge overlay (top-right): dot + text + bracket
    - Image: object-fit contain, 10px padding
  
  - **Vertical navigation bar (right side)**
    - Always visible
    - Up arrow (rotated chevron)
    - Counter: "01 / 05" format
    - Down arrow (rotated chevron)
    - Arrows disabled at boundaries

- **Right (6 cols): Product Info**
  - **Category badge** (top-right, clickable, deepest category)
  - **Product title** (large, bold, IBM Plex Sans 600)
  
  - **Price Module** with 6 pricing scenarios:
    - **Meta badges row**: Condition + Warranty (right-aligned)
    - **Border line separator**
    - **Pricing display** (scenario-based, see below)
    - **Location note**: "In Stock at Saddar, Karachi — Order Now or Visit Us Today"
  
  - **Delivery info** with truck icon
  - **Short description** (HTML content)
  - **WhatsApp button** (lime green #ceff2f with icon and arrow)

**Product Page Price Module Logic:**
```ts
const priceInfo = getPriceTagInfo(product);
const regularPrice = product.regular_price;
const salePrice = product.sale_price;
const hasRegularPrice = regularPrice && parseFloat(regularPrice) > 0;
const hasSalePrice = salePrice && parseFloat(salePrice) > 0;
const onSale = product.on_sale && hasSalePrice;
const discountPercentage = onSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
```

**Price Display Scenarios (evaluated in order):**

1. **IF** `priceInfo.tagType === "shift"` (HIGH FLUCTUATION):
   ```jsx
   <div className={styles.shiftBadge}>
     <svg>wave icon</svg>
     HIGH FLUCTUATION
   </div>
   <span>Max {formatPrice(priceInfo.priceMax)}</span>
   <span>Min {formatPrice(priceInfo.priceMin)}</span>
   <span>Price varies due to market conditions</span>
   ```

2. **ELSE IF** `priceInfo.tagType === "price-down"` (PRICE DOWN):
   ```jsx
   <span className={styles.salePrice}>{formatPrice(priceInfo.displayPrice)}</span>
   <div className={styles.priceDownRow}>
     <div className={styles.priceDownBadge}>
       <svg>down arrow</svg>
       PRICE DOWN
     </div>
     <span>Was {formatPrice(wasPrice)}</span>
     <span>-{percentage}%</span>
   </div>
   ```

3. **ELSE IF** `priceInfo.tagType === "price-up"` (PRICE UP):
   ```jsx
   <span className={styles.mainPrice}>{formatPrice(priceInfo.displayPrice)}</span>
   <div className={styles.priceUpRow}>
     <div className={styles.priceUpBadge}>
       <svg>up arrow</svg>
       PRICE UP
     </div>
     <span>Was {formatPrice(wasPrice)}</span>
     <span>+{percentage}%</span>
   </div>
   ```

4. **ELSE IF** `onSale` (STANDARD WOOCOMMERCE SALE):
   ```jsx
   <span className={styles.salePrice}>{formatPrice(salePrice)}</span>
   <div className={styles.saleInfoRow}>
     <div className={styles.saleBadge}>
       <Tag icon />
       SALE {discountPercentage}% OFF
     </div>
     <span style={{ textDecoration: "line-through" }}>
       Was {formatPrice(regularPrice)}
     </span>
   </div>
   ```

5. **ELSE IF** `hasRegularPrice` (MARKET PRICE - STABLE):
   ```jsx
   <span className={styles.mainPrice}>{formatPrice(regularPrice)}</span>
   <div className={styles.marketPriceRow}>
     <div className={styles.marketPriceBadge}>
       <svg>up+down arrows</svg>
       MARKET PRICE
     </div>
     <span>Price stable</span>
   </div>
   ```

6. **ELSE** (FALLBACK):
   ```jsx
   <span className={styles.mainPrice}>Contact Us for Price</span>
   ```

**USP Marquee (full width below top row):**
- Infinite horizontal scroll with duplicated content
- Key selling points: "Get Human Support in 5 Min" · "Free Compatibility Check" · etc.
- Links to WhatsApp and policy pages
- Dot separators between items

**Bottom Row:**
- **Left (6 cols): Specifications Table**
  - Orange corner bracket top-right
  - Header: "SPECIFICATIONS" (black bg, white text, sticky on scroll)
  - Table: 40/60 split (label/value columns)
  - Alternating row backgrounds for readability
  - Max height: 600px, vertical scroll if needed
  - Attributes from `product.attributes` array

- **Right (6 cols): Detailed Description**
  - Lime corner bracket bottom-right on header
  - Header: "DETAILED DESCRIPTION" with border
  - HTML content from `product.description`
  - Styled elements: p, ul, ol, h2-h4
  - Full rich text support

**Related Products (full width):**
- GridSection component wrapper
- Shows 6 products maximum
- Fallback logic: 
  1. `product.related_ids` (first 6)
  2. Same category products (if < 6)
  3. General products (if still < 6)
- Uses PCD_2 component for cards

**Image Gallery Mobile Behavior:**
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

**CSS Scoping — CRITICAL:**
All product page styles MUST be prefixed with `.productPageWrapper` to prevent CSS bleed:
```css
.productPageWrapper .productTitle { ... }
.productPageWrapper .priceModule { ... }
.productPageWrapper .whatsappButton { ... }
```

**Data Flow:**
- ISR: Revalidate every 300s (5 minutes)
- Server Component fetches product + related products
- Client Component handles image gallery state
- WhatsApp link generated with tag-aware pricing context

---

## 💰 PRICING SYSTEM — TAG-AWARE (6 SCENARIOS)

**CRITICAL:** All pricing logic is centralized in `lib/utils.ts > getPriceTagInfo()`

The system uses WooCommerce product tags to dynamically display pricing based on market conditions.

### Scenario 0: HIGH FLUCTUATION (Shift Tag)
**Trigger:** Product has tag with `slug === "shift"` OR `name.toLowerCase() === "shift"`

**PCD_2 Card Display:**
- Row 1: "HIGH FLUCTUATION" badge with wave icon (`tagBadgeShift` style)
- Row 2: "Max [price]" (from `priceInfo.priceMax` = `regular_price`)
- Row 3: "Min [price]" (from `priceInfo.priceMin` = `sale_price` OR `regular_price * 0.9`)

**Product Page Display:**
- "HIGH FLUCTUATION" badge
- Max price with "Max" label
- Min price with "Min" label (if available)
- Message: "Price varies due to market conditions"

**WhatsApp Message:**
```
*Price Range:* Rs. [min] - Rs. [max] (High market fluctuation - contact us for current price)
```

**Logic Variables:**
```ts
isScenarioShift = tagType === "shift"
priceMax = regular_price (or "0" if none)
priceMin = sale_price || regular_price * 0.9
```

---

### Scenario 1: PRICE DOWN (Tag)
**Trigger:** Product has tag `slug === "price-down"` OR `name.toLowerCase() === "price down"` AND `regular_price > 0` AND `sale_price > 0`

**PCD_2 Card Display:**
- Row 1: "PRICE DOWN" badge with down arrow (`tagBadgeDown` style, green)
- Row 2: Current price LARGE (`priceValue`)
- Row 3: "Was [regular_price]" + "-XX%" percentage badge (green)

**Product Page Display:**
- Current sale price LARGE (`salePrice` style)
- "PRICE DOWN" badge with down arrow
- "Was [regular_price]" + "-XX%" discount percentage

**WhatsApp Message:**
```
*Current Price:* Rs. [sale_price] (Price Down from Rs. [regular_price] - Save XX%!)
```

**Logic Variables:**
```ts
hasFluctuation = tagType && percentage > 0 && !isScenarioShift
tagType === "price-down"
displayPrice = sale_price
wasPrice = regular_price
percentage = Math.round(((regular_price - sale_price) / regular_price) * 100)
```

---

### Scenario 2: PRICE UP (Tag)
**Trigger:** Product has tag `slug === "price-up"` OR `name.toLowerCase() === "price up"` AND `regular_price > 0` AND `sale_price > 0`

**PCD_2 Card Display:**
- Row 1: "PRICE UP" badge with up arrow (`tagBadgeUp` style, red)
- Row 2: Current price LARGE (`priceValue`)
- Row 3: "Was [sale_price]" + "+XX%" percentage badge (red)

**Product Page Display:**
- Current regular price LARGE (`mainPrice` style)
- "PRICE UP" badge with up arrow
- "Was [sale_price]" + "+XX%" increase percentage

**WhatsApp Message:**
```
*Current Price:* Rs. [regular_price] (Price increased +XX% from Rs. [sale_price] due to market conditions)
```

**Logic Variables:**
```ts
hasFluctuation = tagType && percentage > 0 && !isScenarioShift
tagType === "price-up"
displayPrice = regular_price (current higher price)
wasPrice = sale_price (old lower price)
percentage = Math.round(((regular_price - sale_price) / sale_price) * 100)
```

---

### Scenario 3: ON SALE (WooCommerce Sale, No Tag)
**Trigger:** `on_sale === true` AND `regular_price > 0` AND `sale_price > 0` AND NO price tags

**PCD_2 Card Display:**
- Row 1: "SALE XX% OFF" badge with tag icon (`tagBadgeSale` style, orange)
- Row 2: Sale price LARGE (`priceValue`)
- Row 3: "Was [regular_price]" with strikethrough

**Product Page Display:**
- Sale price LARGE (`salePrice` style)
- "SALE XX% OFF" badge
- "Was [regular_price]" with strikethrough

**WhatsApp Message:**
```
*Current Price:* Rs. [sale_price] (Regular: Rs. [regular_price])
```

**Logic Variables:**
```ts
isScenario3 = !tagType && onSale && hasRegularPrice && hasSalePrice
discountPercentage = Math.round(((regular_price - sale_price) / regular_price) * 100)
```

---

### Scenario 4: MARKET PRICE (Stable)
**Trigger:** `regular_price > 0` AND NO sale AND NO tags

**PCD_2 Card Display:**
- Row 1: "MARKET PRICE" badge with up+down arrows (`marketPriceBadge` style)
- Row 2: Regular price LARGE (`priceValue`)
- Row 3: "NOT CHANGED" text

**Product Page Display:**
- Regular price LARGE (`mainPrice` style)
- "MARKET PRICE" badge with up+down arrows
- "Price stable" text

**WhatsApp Message:**
```
*Price:* Rs. [regular_price]
```

**Logic Variables:**
```ts
isScenario4 = !tagType && !onSale && hasRegularPrice && !hasSalePrice
```

---

### Scenario 5: FALLBACK (Standard / No Price)
**Trigger:** None of the above conditions match OR no valid prices

**PCD_2 Card Display:**
- Two-column footer (`fallbackFooter`)
- Left: "PRICE" label + formatted price
- Right: Orange WhatsApp arrow button (`OrderArrowButton`)

**Product Page Display:**
- "Contact Us for Price" OR formatted display price

**WhatsApp Message:**
```
*Product:* [name]
*Price:* Rs. [displayPrice] OR Contact for Price
```

**Logic Variables:**
```ts
// All other scenarios failed, use fallback
displayPrice = priceInfo.displayPrice (from getPriceTagInfo)
```

---

### Implementation Flow

**1. `lib/utils.ts > getPriceTagInfo()`**
- Checks for tags: `shift`, `price-down`, `price-up` (in that order)
- Calculates prices and percentages
- Returns: `{ tagType, displayPrice, wasPrice, percentage, priceMax?, priceMin? }`

**2. PCD_2 / ProductPageClient**
- Calls `getPriceTagInfo(product)`
- Evaluates scenarios in order:
  1. `isScenarioShift` (shift tag)
  2. `hasFluctuation` (price-down or price-up tag with percentage > 0)
  3. `isScenario3` (on_sale with no tags)
  4. `isScenario4` (regular price only, no sale, no tags)
  5. Fallback (everything else)

**3. Conditional Rendering**
- Each scenario has its own JSX block
- Badge styles: `tagBadgeShift`, `tagBadgeDown`, `tagBadgeUp`, `tagBadgeSale`, `marketPriceBadge`
- Price styles: `priceValue`, `salePrice`, `mainPrice`, `shiftPrice`
- Supporting styles: `wasPriceText`, `percentageTextDown`, `percentageText`

**Key CSS Classes:**
- `.footerArea` — 3-row footer (badge, price, info)
- `.fallbackFooter` — 2-column footer (price left, button right)
- `.badgeRow` — Top row for badges (right-aligned)
- `.priceRow` — Middle row for main price (left-aligned, large)
- `.fluctuationRow` — Bottom row for was price + percentage

---

## 🧩 KEY COMPONENTS DEEP DIVE

### PCD_2 (Primary Product Card)
**File:** `components/PCD_2.tsx`

**Structure:**
1. **Invisible Link Overlay** — covers entire card, z-index: 1
2. **Image Area** — 236×236px, object-fit: contain
   - Stock badge: top-left with orange bracket corner
   - "IN STOCK" (lime dot) or "OUT OF STOCK" (red)
3. **Title Area** — 2-line clamp, 11px mobile / 13px desktop
4. **Footer Area** — Conditional rendering (6 scenarios)

**Pricing Logic Flow:**
```ts
const priceInfo = getPriceTagInfo(product);
const onSale = product.on_sale && product.sale_price;
const hasRegularPrice = regularPrice && parseFloat(regularPrice) > 0;
const hasSalePrice = salePrice && parseFloat(salePrice) > 0;

// Scenario detection (in evaluation order):
const isScenarioShift = tagType === "shift";
const hasFluctuation = tagType && percentage > 0 && !isScenarioShift;
const isScenario3 = !tagType && onSale && hasRegularPrice && hasSalePrice;
const isScenario4 = !tagType && !onSale && hasRegularPrice && !hasSalePrice;
// Fallback = everything else
```

**Footer Rendering Order:**
1. **IF** `isScenarioShift` → 3-row footer with HIGH FLUCTUATION badge, Max/Min prices
2. **ELSE IF** `hasFluctuation` → 3-row footer with PRICE DOWN/UP badge, current price, was price + %
3. **ELSE IF** `isScenario3` → 3-row footer with SALE badge, sale price, was regular price
4. **ELSE IF** `isScenario4` → 3-row footer with MARKET PRICE badge, regular price, "NOT CHANGED"
5. **ELSE** → 2-column fallback footer (price label left, WhatsApp arrow right)

**Footer Layouts:**

**3-Row Footer** (scenarios 0-4):
```css
.footerArea {
  display: flex;
  flex-direction: column;
}

/* Row 1: Badge (right-aligned) */
.badgeRow { justify-content: flex-end; }

/* Row 2: Price (left-aligned, large) */
.priceRow { justify-content: flex-start; }
.priceValue { font-size: 14px mobile / 16px desktop, Sora 700 }

/* Row 3: Info (left-aligned, small) */
.fluctuationRow { justify-content: flex-start; }
.wasPriceText { font-size: 10px mobile / 11px desktop, Space Mono }
```

**2-Column Fallback Footer** (scenario 5):
```css
.fallbackFooter {
  display: grid;
  grid-template-columns: 1fr auto;
}

/* Left: Price Label + Value */
.fallbackPriceCol { }
.fallbackPriceLabel { Space Mono, 9px mobile / 10px desktop }
.fallbackPriceValue { Sora 700, 12px mobile / 14px desktop }

/* Right: WhatsApp Arrow Button */
.fallbackWhatsappCol { }
```

**Badge Styles:**
- `.tagBadgeShift` — Gray badge with wave icon
- `.tagBadgeDown` — Green badge with down arrow
- `.tagBadgeUp` — Red badge with up arrow
- `.tagBadgeSale` — Orange badge with tag icon
- `.marketPriceBadge` — Gray badge with up+down arrows

**Card Styling:**
- Desktop: 1px border + hover clip-path corner cut
- Mobile: No border (blueprint-grid gap creates lines)
- Always uses `formatPrice()` and `getPriceTagInfo()`

### HeroSlider (Vertical Product Carousel)
**File:** `components/HeroSlider.tsx`

**Mechanics:**
- Triple array for infinite loop: `[...products, ...products, ...products]`
- State: `activeIndex` starts at `products.length` (middle set)
- Auto-slide: `setInterval` every 3 seconds, increments index
- Loop reset: When index hits boundaries, disable transition, jump to equivalent position
- Visible items: 3 cards (0.5 + 1 + 1 + 0.5), center 2 active
- Transform: `translateY(-index * (cardHeight + gap) + offset)`
- Hover: Pauses auto-scroll

### BannerProductSection (Horizontal Slider)
**File:** `components/BannerProductSection.tsx`

**Structure:**
- Desktop: 4-col banner left, 8-col products right
- Mobile: banner top, products below
- Products: 2 visible mobile, 4 visible desktop

**Mechanics:**
- Triple array for infinite loop
- Slider state: `currentIndex` starts at `products.length` (middle set)
- Auto-slide: every 3 seconds
- Loop reset: Disable transition, jump to equivalent position after slide
- Transform: `translateX(-${(currentIndex / totalItems) * 100}%)`
- CSS variable: `--visible-items: 2` (mobile) / `4` (desktop)

### CategoryControls (Filter Bar)
**File:** `components/CategoryControls.tsx`

**Layout:**
- Mobile: 2×2 grid (50% width per box)
- Desktop: 1×4 row (25% width per box)
- Search input with 300ms debounce
- Dropdowns: Brand, Sort, Price
- All changes update URL params and reset to page 1

**Dropdowns:**
- Custom styled `<select>` with arrow icon overlay
- Arrow positioned absolute right, pointer-events: none

---

## 🔌 WOOCOMMERCE API LAYER

**All data fetching goes through `lib/woocommerce.ts`. No raw fetch() calls elsewhere.**

### Key Functions:

**getCategories()** → `WooCommerceCategory[]`
- Fetches 100 categories
- Filters: `count > 0` only
- ISR: 300s revalidation

**getProducts(params)** → `WooCommerceProduct[]`
- Params: `category, page, per_page, orderby, order, search, featured, min_price, max_price, brand`
- Default: `per_page: 12`
- Filter: `status=publish` only
- ISR: 300s revalidation

**getProductsWithCount(params)** → `{ products, totalCount, totalPages }`
- Same params as `getProducts`
- Reads headers: `x-wp-total`, `x-wp-totalpages`
- Used for: Category/brand/search pages with pagination

**getProductBySlug(slug)** → `WooCommerceProduct | null`
- Single product lookup
- Used for: Product detail pages

**getProductsByIds(ids: number[])** → `WooCommerceProduct[]`
- Batch fetch by ID array
- Used for: Related products

**getCategoryBySlug(slug)** → `WooCommerceCategory | null`
- Single category lookup
- Used for: Category metadata (count, description)

**Live Search API:**
- Route: `app/api/search/route.ts`
- Limited to `per_page: 6` for dropdown preview UX
- Full results shown on `/search` page

---

## 🔧 UTILITY FUNCTIONS REFERENCE

### `lib/utils.ts`

**formatPrice(price: string | number): string**
- Returns: `Rs. X,XXX` format
- Handles strings and numbers
- Rounds to nearest integer
- Uses `toLocaleString("en-US")` for comma separators
- Returns "Contact for Price" if 0 or invalid

**getPriceTagInfo(product: WooCommerceProduct)**
- Returns: `{ tagType, displayPrice, wasPrice, percentage, hasValidPrices, priceMax?, priceMin? }`
- Checks for tags: `shift`, `price-down`, `price-up`
- Calculates percentage changes
- Handles all 6 pricing scenarios
- Used by: PCD_2, ProductPageClient, generateWhatsAppLink

**generateWhatsAppLink(product: WooCommerceProduct): string**
- Pre-fills message with product name, tag-aware pricing, and link
- Uses `process.env.NEXT_PUBLIC_WA_NUMBER`
- Format: `https://wa.me/+923423355119?text=...`
- Encodes URI components
- Context-aware messages based on tag type

**getStockLabel(status: string)**
- Returns: `{ text: string, active: boolean }`
- `instock` → `{ text: "IN STOCK", active: true }`
- `outofstock` → `{ text: "OUT OF STOCK", active: false }`

**getProductMeta(product: WooCommerceProduct)**
- Returns: `{ brandName, warranty, condition }`
- Brand: from attributes or first word of name
- Warranty: from attributes or "1 Year" default
- Condition: from attributes or "New" (checks for "used" in descriptions)

**stripHtml(html: string): string**
- Removes all HTML tags
- Collapses whitespace
- Used for meta descriptions

---

## 📋 TYPESCRIPT INTERFACES

### Key Interfaces in `lib/types.ts`:

**WooCommerceProduct**
- Complete product interface with all WooCommerce fields
- Includes: id, name, slug, price, regular_price, sale_price, images, categories, tags, attributes, etc.
- Stock fields: stock_status, stock_quantity, manage_stock
- Related: related_ids, upsell_ids, cross_sell_ids

**WooCommerceCategory**
- Category interface: id, name, slug, parent, description, count, image

**WooCommerceImage**
- Image interface: id, src, name, alt

**WooCommerceAttribute**
- Attribute interface: id, name, position, visible, variation, options[]

**WooCommerceBrand**
- Brand interface: id, name, slug, count

**SocialMediaReel**
- Social media reel interface: id, videoUrl, category, productLink, platform

---

## 📐 RESPONSIVE RULES

```css
/* Default = Mobile */
.grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }

/* Desktop override */
@media (min-width: 769px) {
  .grid { grid-template-columns: repeat(6, 1fr); gap: 16px; }
}
```

- Mobile breakpoint: `< 768px`
- Desktop breakpoint: `≥ 769px`
- Product grids: **always 2 columns on mobile**
- Never use a 1-column product layout unless it's a single featured item
- Typography scales: titles reduce 30-50% on mobile

---

## 🌍 ENVIRONMENT VARIABLES

| Variable | Scope | Use |
|----------|-------|-----|
| `WOOCOMMERCE_BASE_URL` | Server only | API base URL |
| `WOOCOMMERCE_CONSUMER_KEY` | Server only | WC auth |
| `WOOCOMMERCE_CONSUMER_SECRET` | Server only | WC auth |
| `NEXT_PUBLIC_SITE_URL` | Client-safe | Canonical URL |
| `NEXT_PUBLIC_WA_NUMBER` | Client-safe | WhatsApp number |
| `NEXT_PUBLIC_META_PIXEL_ID` | Client-safe | Meta Pixel |

**Never hardcode any of these. Always use `process.env.*`.**

---

## 🚫 ANTI-PATTERNS — Never Do These

| ❌ Don't | ✅ Do instead |
|---------|--------------|
| `border-radius: 4px` | `border-radius: 0` |
| Add Tailwind or inline styles | CSS Modules with variables |
| Raw `fetch()` for WooCommerce | Functions from `lib/woocommerce.ts` |
| Hardcode `#ff7a2f` in component CSS | `var(--color-orange)` |
| Implement cart / checkout | Wire to `generateWhatsAppLink()` |
| Add new npm packages unilaterally | Ask first — minimise bundle |
| Use `any` TypeScript | Define the interface in `lib/types.ts` |
| Create `.md` docs for routine components | Only for complex multi-file integrations |
| Duplicate utility functions | Check `lib/utils.ts` first |
| Use `font-family: sans-serif` | Use `'IBM Plex Sans'` or the defined stack |
| Use ProductCard.tsx | Use PCD_2.tsx (ProductCard is deprecated) |

---

## 📄 When to Create .md Files

**Create a `.md` file ONLY when:**
- The integration spans 4+ files and has non-obvious setup steps
- You are documenting a third-party service setup (new API, webhook config)
- You are leaving notes for a multi-session complex feature

**Do NOT create `.md` files for:**
- Individual components
- Simple utility functions
- Routine page additions
- Minor style changes

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
Browser
       ↓
User clicks WhatsApp CTA → wa.me link → WhatsApp opens with pre-filled order
```

**ISR Strategy:**
- Homepage: 3600s (1 hour)
- Category/Brand/Search/Product pages: 300s (5 minutes)
- All WooCommerce API calls: 300s default

---

## 🏁 SESSION START CHECKLIST

When you begin a new task, always answer these before writing code:

1. **Which files are relevant to this task?** → Read them.
2. **Does a component/utility already exist for this?** → Reuse it.
3. **What CSS class patterns does the nearest similar component use?** → Match them.
4. **Am I about to add anything that conflicts with the design system?** → Don't.
5. **Does this require a new dependency?** → Ask first.
6. **What's the mobile layout?** → Write mobile-first CSS.
7. **Does this need a corner bracket?** → Add lime (active) or orange (primary).
8. **Does this need a brutalist title?** → Use the stacked pattern with last word orange.
9. **Is this a product display?** → 2-col mobile minimum, use PCD_2, WhatsApp CTA.
10. **Is this fetching WooCommerce data?** → Use `lib/woocommerce.ts` + ISR cache.

---

## 🔧 KNOWN LIMITATIONS & FUTURE IMPROVEMENTS

### Current Workarounds

1. **Brand Page Filtering**
   - Brand pages (`/brand/[slug]`) currently use `search: brandName` instead of `brand: brandId`
   - This is a workaround because WooCommerce brand filtering requires numeric brand ID
   - Static brand mapping in `lib/brands.ts` provides slug → ID conversion for category pages
   - Brand pages search ALL product fields (less efficient) vs. taxonomy filtering
   - **Future improvement:** Migrate brand pages to use proper brand taxonomy filtering

2. **Live Search Limit**
   - API returns maximum 6 products for dropdown preview
   - Intentional UX decision for fast load times
   - Full results available on `/search` page
   - **Not a bug:** This is optimal for live dropdown performance

3. **CategoriesGrid Title Sizing**
   - Uses 64px/40px instead of standard 84px/48px brutalist pattern
   - Intentional reduction for better mobile category grid density
   - Maintains visual hierarchy while improving mobile UX

### Performance Optimizations Implemented
- ISR caching: 300s revalidation on all WooCommerce API calls
- Page-level ISR: 3600s (1 hour) for homepage
- Debounced search: 300ms delay before API trigger
- Image optimization: Next.js `<Image>` with lazy loading
- Parallel data fetching: `Promise.all` for category/product loads

### Accessibility Considerations
- Color contrast meets WCAG AA standards (tested on dark/light surfaces)
- Touch targets: minimum 44px height on all interactive elements
- Keyboard navigation: all dropdowns and forms keyboard-accessible
- Screen reader support: semantic HTML with proper ARIA labels
- **Manual testing required:** Full WCAG compliance needs assistive technology validation

### Security Measures
- Environment variables for all sensitive credentials
- WhatsApp links use proper URI encoding
- Product descriptions use `dangerouslySetInnerHTML` only from trusted WooCommerce source
- No client-side credential exposure
- API rate limiting handled by WooCommerce backend

---

## ✅ ALWAYS DO THIS

1. ✅ Read existing files before writing new code
2. ✅ Use CSS variables from `globals.css`
3. ✅ Match mobile-first patterns (write mobile, override desktop)
4. ✅ Add corner brackets to section headers (lime = active, orange = primary)
5. ✅ Use brutalist stacked titles for major sections (last word orange)
6. ✅ Wire all product CTAs to `generateWhatsAppLink(product)`
7. ✅ Add ISR caching to WooCommerce API calls (300s)
8. ✅ Use PCD_2 for all product cards (not ProductCard)
9. ✅ Add 1px borders to all cards and sections
10. ✅ Use Space Mono for labels, badges, and metadata
11. ✅ Use Sora for headings and display text
12. ✅ Use IBM Plex Sans for body copy
13. ✅ Uppercase all category labels and badges
14. ✅ Add hover effects (color shifts, sweeps, clip-paths)
15. ✅ Test on mobile viewport first (< 768px)
16. ✅ Use `getPriceTagInfo()` for all pricing logic
17. ✅ Keep all pricing logic in `lib/utils.ts`
18. ✅ Use 12-column blueprint grid for layouts
19. ✅ Always pair component with `.module.css`
20. ✅ Scope product page CSS with `.productPageWrapper`

---

## 🎨 DESIGN SYSTEM COMPONENTS

### Corner Brackets (Signature Element)

**Lime (bottom-right):** Active/in-stock indicators
```css
.cornerBracket {
  position: absolute;
  bottom: 0; right: 0;
  width: 12px; height: 12px;
  border-bottom: 2px solid var(--color-lime);
  border-right: 2px solid var(--color-lime);
}
```

**Orange (bottom-right):** Primary section accents
```css
/* Same structure, use var(--color-orange) */
```

**Mini brackets (top-right or corners):** Sub-elements
```css
/* 6-8px size, 1px borders */
```

### Status Dots
```css
.dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-lime); /* in stock */
  display: inline-block;
  border-radius: 50%; /* Only exception to no-border-radius rule */
}
```

### Hover Sweep Animation
```css
.button {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.button::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 0;
  height: 100%;
  background-color: var(--color-orange);
  transition: width 0.5s ease;
  z-index: 1;
}

.button:hover::before {
  width: 100%;
}

.buttonText {
  position: relative;
  z-index: 2; /* stays above sweep */
}
```

---

## 📐 GRID SYSTEM MASTERY

### Blueprint Grid (12-column)
```css
.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--grid-gutter); /* 1px */
  background-color: var(--color-outline-variant);
  border: 1px solid var(--color-outline-variant);
}
```

**Usage:**
- Products: `grid-column: span 2` (6 per row desktop, 2 per row mobile)
- Hero content: `grid-column: span 7`
- Hero products: `grid-column: span 5`
- Banner: `grid-column: span 4`
- Products area: `grid-column: span 8`

### Mobile 2-Column Override
```css
@media (max-width: 768px) {
  .grid-2-col-mobile {
    grid-template-columns: 1fr 1fr !important;
    gap: 1px !important;
    padding: 0 !important;
    border: none !important;
    background-color: var(--color-outline) !important;
  }
  
  .grid-2-col-mobile > div {
    grid-column: span 1 !important;
  }
}
```

**Apply to:** Product grids on homepage, category, brand, search pages

---

## 🎯 COMPONENT CHECKLIST

### Before Creating a Component:
- [ ] Does a similar component already exist in `/components`?
- [ ] Is there a utility in `lib/utils.ts` I should reuse?
- [ ] Do I have the interface in `lib/types.ts` or do I need to add it?

### When Creating:
1. `ComponentName.tsx` in `/components`
2. `ComponentName.module.css` alongside it
3. Props typed with an explicit interface (no inline `{ prop: string }`)
4. CSS uses variables from `globals.css` — no hardcoded hex
5. Mobile styles first, desktop overrides at `@media (min-width: 769px)`
6. Import statement at top of file
7. Export default at bottom

### CSS Module Scoping:
- Always use `.moduleName` prefix for all selectors
- For complex pages, wrap in parent: `.pageWrapper .childElement`
- Never use global selectors in module files

---

This is your complete reference. Always consult this file before starting work.

---

## 🔍 QUICK REFERENCE — PRICING SCENARIOS

**Evaluation Order (both PCD_2 and Product Page):**
```ts
1. isScenarioShift = priceInfo.tagType === "shift"
2. hasFluctuation = priceInfo.tagType && percentage > 0 && !isScenarioShift
   ↳ Includes: tagType === "price-down" OR tagType === "price-up"
3. isScenario3 = !tagType && onSale && hasRegularPrice && hasSalePrice
4. isScenario4 = !tagType && !onSale && hasRegularPrice && !hasSalePrice
5. Fallback = everything else
```

**Visual Summary:**

| Scenario | Tag Needed | Condition | Badge | Price Display | Footer Rows |
|----------|-----------|-----------|-------|---------------|-------------|
| 0: HIGH FLUCTUATION | `shift` | Any | Gray wave icon | Max + Min | 3 |
| 1: PRICE DOWN | `price-down` | reg>0, sale>0 | Green ↓ arrow | Current (sale) | 3 |
| 2: PRICE UP | `price-up` | reg>0, sale>0 | Red ↑ arrow | Current (reg) | 3 |
| 3: ON SALE | None | on_sale=true | Orange tag icon | Sale price | 3 |
| 4: MARKET PRICE | None | reg>0, no sale | Gray ↕ arrows | Regular price | 3 |
| 5: FALLBACK | None | Any | None | Display price | 2 cols |

**Badge CSS Classes:**
- `.tagBadgeShift` → Gray with wave
- `.tagBadgeDown` → Green with ↓
- `.tagBadgeUp` → Red with ↑
- `.tagBadgeSale` → Orange with tag
- `.marketPriceBadge` → Gray with ↕

**Price CSS Classes:**
- `.priceValue` → General large price (14-16px, Sora 700)
- `.salePrice` → Sale/discount price (orange color)
- `.mainPrice` → Regular/stable price
- `.shiftPrice` → Fluctuation price
- `.wasPriceText` → Old/was price (10-11px, Space Mono)

---

## 🚀 COMMON TASKS QUICK GUIDE

### Adding a New Product Display Component
1. ✅ Read `PCD_2.tsx` and its CSS first
2. ✅ Import `getPriceTagInfo()` from `lib/utils`
3. ✅ Call it: `const priceInfo = getPriceTagInfo(product)`
4. ✅ Implement 6 scenarios in evaluation order (see above)
5. ✅ Use CSS variables, not hardcoded colors
6. ✅ Test all 6 scenarios with different products

### Modifying Pricing Logic
1. ⚠️ **ONLY** edit `lib/utils.ts > getPriceTagInfo()`
2. ✅ Never duplicate pricing logic in components
3. ✅ Test changes in both PCD_2 and ProductPageClient
4. ✅ Verify WhatsApp messages reflect changes

### Creating a New Page
1. ✅ Check if similar page exists (category/brand/search patterns)
2. ✅ Use Server Component for data fetching (with ISR)
3. ✅ Client Component only if interactivity needed
4. ✅ Follow breadcrumb → header → controls → grid → pagination pattern
5. ✅ Mobile-first CSS with 769px desktop breakpoint

### Styling Guidelines
1. ✅ Always use CSS Modules (`.module.css`)
2. ✅ CSS variables from `globals.css` only
3. ✅ Border-radius: 0 (except status dots)
4. ✅ Borders: 1px solid
5. ✅ Typography: Sora (display), IBM Plex Sans (body), Space Mono (mono)
6. ✅ Mobile first, desktop at `@media (min-width: 769px)`

---
