# PC Wala V3 — Coding Rules
> File location: `.rules/rules.md`
> Read by AI agents and developers alike. Keep it updated.

---

## R1 · Explore First

**Always read before you write.**
Open every relevant file before creating or modifying anything.
Check the component, its CSS module, and the lib/ layer.
No assumptions. No hallucinated structure.

---

## R2 · No Duplicate Code

Before creating any utility, hook, or helper:
1. Check `lib/utils.ts`
2. Check `lib/woocommerce.ts`
3. Check existing components in `/components`

If something similar exists, extend it — don't clone it.

---

## R3 · WhatsApp-Only Commerce

This project has no cart and no checkout. This is intentional and permanent.

Every order CTA must use `generateWhatsAppLink(product)` from `lib/utils.ts`.
Never implement: `addToCart`, `checkout`, `order form`, payment gateways, quantity selectors for cart purposes.

---

## R4 · Design System is Locked

6 colors. 3 fonts. Zero border-radius. No exceptions.

```
Colors:   #ffffff · #f9f9f9 · #dadada · #1a1c1c · #ff7a2f · #ceff2f
Fonts:    Sora (display) · IBM Plex Sans (body) · Space Mono (mono)
Radius:   0 — always
```

If you are unsure about a visual treatment, look at the nearest existing component and match it exactly.

---

## R5 · CSS Modules Only

- One `.module.css` file per component, named identically
- Classes in `camelCase`
- No inline styles (`style={{ }}`) unless absolutely unavoidable (dynamic values only)
- No global CSS outside `globals.css`
- No Tailwind, Bootstrap, or any utility CSS framework
- Always use CSS variables from `globals.css` — never hardcode hex values

```css
/* ✅ */
.card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: 0; }

/* ❌ */
.card { background: #ffffff; border-radius: 8px; }
```

---

## R6 · TypeScript Strict

- No `any` — ever
- All shared interfaces in `lib/types.ts`
- All new interfaces either go in `lib/types.ts` (if shared) or at the top of the component file (if local-only)
- Strict mode is enabled in `tsconfig.json` — respect it

---

## R7 · Server Components by Default

Components are Server Components unless they require:
- `useState` / `useReducer`
- `useEffect`
- Browser APIs (`window`, `document`, `localStorage`)
- Event listeners

Only add `"use client"` when one of the above is genuinely needed.

---

## R8 · API Calls Stay in `lib/`

All WooCommerce data fetching goes through `lib/woocommerce.ts`.
No raw `fetch()` calls to the WooCommerce API outside that file.

If a new endpoint is needed, add a function to `lib/woocommerce.ts`.
ISR revalidation must be set: `next: { revalidate: 300 }` on all WooCommerce fetches.

---

## R9 · Environment Variables Only

```
WOOCOMMERCE_BASE_URL          ← server-only
WOOCOMMERCE_CONSUMER_KEY      ← server-only
WOOCOMMERCE_CONSUMER_SECRET   ← server-only
NEXT_PUBLIC_SITE_URL          ← client-safe
NEXT_PUBLIC_WA_NUMBER         ← client-safe
NEXT_PUBLIC_META_PIXEL_ID     ← client-safe
```

Never hardcode URLs, keys, phone numbers, or pixel IDs in source code.

---

## R10 · Mobile First

Default CSS = mobile layout.
Desktop styles are overrides inside `@media (min-width: 769px)`.
Product grids must be 2 columns on mobile minimum — never 1 column.

```css
/* Mobile default */
.grid { grid-template-columns: repeat(2, 1fr); }

/* Desktop override */
@media (min-width: 769px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
```

---

## R11 · Minimal Documentation

Create a `.md` file only when:
- A complex multi-file integration needs setup steps documented
- A third-party service requires non-obvious configuration

Do NOT create `.md` files for:
- Individual components
- Simple pages
- Utility functions
- CSS changes

---

## R12 · No New Dependencies Without Discussion

The bundle is lean intentionally.
If a task seems to require a new `npm` package, stop and discuss it first.
Prefer native browser APIs and Next.js built-ins over new packages.

---

## R13 · Images via Next.js `<Image>`

Use `next/image` for all product and content images.
Image optimization is disabled in `next.config.ts` (Cloudflare CDN handles it).
Always provide `width`, `height`, and `alt` props.

---

## R14 · No Cart-Flavored Patterns

These patterns are permanently off the table:
- Quantity selectors wired to a cart state
- "Add to Cart" buttons
- Cart drawer / sidebar
- Checkout pages
- Order confirmation flows
- Any `localStorage`-based cart persistence

---

## Quick Reference

| Area | Where it lives |
|------|---------------|
| All WooCommerce API functions | `lib/woocommerce.ts` |
| All TypeScript interfaces | `lib/types.ts` |
| Price formatting, WhatsApp link | `lib/utils.ts` |
| CSS variables / design tokens | `app/globals.css` |
| Component styles | `components/ComponentName.module.css` |
| Environment config | `.env.local` (never commit) |



---

If i ask something which counter the rules.md or agents.md than let me know first befor editing.



---

## R15 · Component Pairing is Mandatory

Every component must have a matching CSS Module file:
- `ComponentName.tsx` + `ComponentName.module.css`
- Never skip the CSS file, even if styles are minimal
- Never use inline styles except for dynamic computed values
- Import styles: `import styles from "./ComponentName.module.css"`

---

## R16 · Corner Brackets are Visual Signatures

Corner brackets are a core design element. Use them consistently:

**Lime brackets (bottom-right)** for active/positive indicators:
```css
.cornerBracket {
  position: absolute;
  bottom: 0; right: 0;
  width: 12px; height: 12px;
  border-bottom: 2px solid var(--color-accent-lime);
  border-right: 2px solid var(--color-accent-lime);
  z-index: 3;
}
```

**Orange brackets (bottom-right)** for primary sections:
```css
/* Same structure, use var(--color-primary) */
```

**Mini brackets** (6-8px, 1px borders) for sub-elements

Apply to:
- Section headers (GridSection, CategoryHeader, etc.)
- Product cards (stock badges)
- Feature cards
- Sub-section headers

---

## R17 · Brutalist Title Pattern

Major section titles use this exact pattern:

```tsx
// Split long titles on spaces, short titles in half
const renderTitle = (text: string) => {
  const upper = text.toUpperCase();
  const words = upper.split(" ");
  if (words.length > 1) {
    return words.map((word, idx) => (
      <span key={idx} style={{ display: "block" }}>{word}</span>
    ));
  }
  if (upper.length >= 6) {
    const mid = Math.ceil(upper.length / 2);
    return (
      <>
        <span style={{ display: "block" }}>{upper.substring(0, mid)}</span>
        <span style={{ display: "block" }}>{upper.substring(mid)}</span>
      </>
    );
  }
  return <span>{upper}</span>;
};
```

```css
.sectionTitle {
  font-family: var(--font-display);
  font-size: 84px; /* 48px mobile */
  font-weight: 800;
  line-height: 0.85;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin: 0;
}
```

Apply to: Homepage sections, category headers, large headings

---

## R18 · Product Grid Rules

**12-column blueprint grid** is the foundation:
```css
.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1px;
  background-color: var(--color-outline);
}
```

**Products always span 2 columns:**
```tsx
<div style={{ gridColumn: "span 2" }}>
  <ProductCard product={product} />
</div>
```

**Mobile 2-column override (MANDATORY):**
```css
@media (max-width: 768px) {
  .grid-2-col-mobile {
    grid-template-columns: 1fr 1fr !important;
    gap: 1px !important;
  }
  
  .grid-2-col-mobile > div {
    grid-column: span 1 !important;
  }
}
```

**Apply class:** `className="blueprint-grid grid-2-col-mobile"`

Result:
- Mobile: 2 products per row
- Desktop: 6 products per row (12 ÷ 2)

---

## R19 · Hover Effect Patterns

### Sweep Animation (View All Buttons)
```css
.viewAllLink {
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 0.3s ease;
}

.viewAllLink::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 0;
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.5s ease;
  z-index: 1;
}

.viewAllLink:hover::before {
  width: 100%;
}

.viewAllLinkText {
  position: relative;
  z-index: 2;
}
```

### Clip-Path Corner Cut (Product Cards Desktop)
```css
.card:hover {
  clip-path: polygon(
    0 0,
    calc(100% - 20px) 0,
    100% 20px,
    100% 100%,
    20px 100%,
    0 calc(100% - 20px)
  );
}
```

### Color Shift (Category Cards)
```css
.categoryIcon {
  color: var(--color-outline);
  transition: color 0.3s ease;
}

.categoryCard:hover .categoryIcon {
  color: var(--color-accent-lime);
}

.categoryCard:hover .categoryBracket {
  border-color: var(--color-accent-lime);
}
```

---

## R20 · Status Indicators

### Stock Status Dots
```css
.tech-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-primary);
  display: inline-block;
}

.tech-dot.active {
  background-color: var(--color-accent-lime); /* in stock */
}

.tech-dot.error {
  background-color: var(--color-error); /* out of stock */
}
```

Usage:
```tsx
<div className="tech-label-container">
  <span className={`tech-dot ${stock.active ? "active" : "error"}`} />
  <span className="label-mono">{stock.text}</span>
</div>
```

---

## R21 · Asymmetric Grid Layouts

Several components use asymmetric splits:

**7/5 Split (Product Detail Page):**
```tsx
<div className="blueprint-grid">
  <div style={{ gridColumn: "span 7" }}>
    {/* Image gallery */}
  </div>
  <div style={{ gridColumn: "span 5" }}>
    {/* Product details */}
  </div>
</div>
```

**4/8 Split (BannerProductSection Desktop):**
```css
@media (min-width: 769px) {
  .bannerArea {
    grid-column: span 4;
  }
  .productsArea {
    grid-column: span 8;
  }
}
```

**38/62 Split (WhyChooseUs):**
```css
.headerBlock {
  flex: 0 0 38%;
}
.featuresGrid {
  flex: 0 0 62%;
}
```

Mobile: Always stack vertically (full width)

---

## R22 · Carousel/Slider Mechanics

### Infinite Loop Pattern
```tsx
// Triple the array for seamless loop
const extendedProducts = [...products, ...products, ...products];

// Start at middle set
const [currentIndex, setCurrentIndex] = useState(products.length);

// Auto-slide
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex(prev => prev + 1);
  }, 3000);
  return () => clearInterval(interval);
}, []);

// Reset position when hitting boundaries
useEffect(() => {
  if (currentIndex >= products.length * 2) {
    setTransitionEnabled(false);
    setCurrentIndex(currentIndex - products.length);
    setTimeout(() => setTransitionEnabled(true), 50);
  }
}, [currentIndex]);
```

### Transform Calculation
**Horizontal:** `translateX(-${(currentIndex / totalItems) * 100}%)`
**Vertical:** `translateY(-${currentIndex * (cardHeight + gap) + offset}px)`

### Transition Control
```css
.slider.transitionEnabled {
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
```

Toggle class to disable transition during position reset.

---

## R23 · Typography Hierarchy

**Display (Sora):** Section titles, headings
```css
font-family: var(--font-display);
font-size: 84px; /* or 72px, 48px, 32px */
font-weight: 700-800;
letter-spacing: -0.02em to -0.05em;
text-transform: uppercase;
```

**Body (IBM Plex Sans):** Descriptions, product titles
```css
font-family: var(--font-body);
font-size: 13-16px;
font-weight: 400-600;
line-height: 1.4-1.6;
```

**Mono (Space Mono):** Labels, badges, prices, metadata
```css
font-family: var(--font-mono);
font-size: 9-12px;
font-weight: 400-700;
letter-spacing: 0.05-0.1em;
text-transform: uppercase;
```

**Utility Class:**
```css
.label-mono {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

---

## R24 · Link Overlays for Clickable Cards

Product cards and other clickable cards use invisible overlays:

```tsx
<div className={styles.card}>
  {/* Invisible link covering entire card */}
  <Link href={`/product/${product.slug}`} className={styles.linkOverlay} />
  
  {/* Visible content */}
  <div className={styles.content}>...</div>
</div>
```

```css
.linkOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  cursor: pointer;
}
```

**Important:** Interactive elements inside card need `position: relative; z-index: 2` to stay clickable.

---

## R25 · Embossed Divider Pattern

Column dividers in header use embossed effect:

```css
.divider {
  width: 1px;
  height: 28px;
  background-color: var(--color-outline);
  box-shadow: 1px 0 0 rgba(255, 255, 255, 0.7);
}
```

Creates subtle inset appearance with light-side highlight.

---

## R26 · Product Card Footer Grid

Price and CTA button use this exact pattern:

```css
.footerGrid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1px;
  background-color: var(--color-outline);
  margin-top: auto;
}

.priceCol {
  padding: 10px 12px;
  background-color: var(--color-surface-container-lowest);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.buttonCol {
  padding: 0;
  background-color: var(--color-surface-container-lowest);
}
```

**Result:** Price takes remaining space, button auto-sized on right.

---

## R27 · Sale Price Display Pattern

```tsx
{product.on_sale && product.sale_price ? (
  <div className={styles.priceRow}>
    <span className={styles.salePriceValue}>
      {formatPrice(product.sale_price)}
    </span>
    {discountPercentage > 0 && (
      <span className={styles.discountBadge}>
        -{discountPercentage}%
      </span>
    )}
    <span className={styles.regularPriceCross}>
      {formatPrice(product.regular_price)}
    </span>
  </div>
) : (
  <span className={styles.priceValue}>
    {formatPrice(product.price)}
  </span>
)}
```

**Discount calculation:**
```tsx
const discountPercentage = onSale && regularPrice && salePrice
  ? Math.round(((parseFloat(regularPrice) - parseFloat(salePrice)) / parseFloat(regularPrice)) * 100)
  : 0;
```

---

## R28 · Breadcrumb Pattern

```tsx
<nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
  <div className={`${styles.breadcrumbContainer} label-mono`}>
    <Link href="/" className={styles.link}>HOME</Link>
    {items.map((item, idx) => (
      <span key={idx} className={styles.item}>
        <span>/</span>
        {item.url ? (
          <Link href={item.url} className={styles.link}>
            {item.label.toUpperCase()}
          </Link>
        ) : (
          <span className={styles.current}>
            {item.label.toUpperCase()}
          </span>
        )}
      </span>
    ))}
  </div>
</nav>
```

**Rules:**
- All uppercase
- Space Mono font
- Slashes as separators
- Current page not linked
- Gray color for links, darker for current

---

## R29 · Pagination Pattern

```tsx
// Smart ellipsis generation
function generatePageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  if (total > 1) pages.push(total);
  return pages;
}
```

**Styling:**
```css
.pagination {
  display: flex;
  align-items: stretch;
  gap: 0;
  border: 1px solid var(--color-outline);
}

.paginationItem {
  min-width: 48px;
  height: 48px;
  border-right: 1px solid var(--color-outline);
  font-family: var(--font-mono);
  font-size: 11px;
}

.paginationActive {
  background-color: var(--color-primary);
  color: var(--color-on-surface);
}
```

---

## R30 · Filter Controls Pattern

**Debounced Search:**
```tsx
const [searchTerm, setSearchTerm] = useState(currentSearch);

useEffect(() => {
  if (searchTerm !== currentSearch) {
    const delayDebounceFn = setTimeout(() => {
      router.push(buildUrl(currentSort, currentPrice, currentBrand, searchTerm));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }
}, [searchTerm, currentSearch]);
```

**URL Building:**
```tsx
const buildUrl = (sort: string, price: string, brand: string, search: string) => {
  const params = new URLSearchParams();
  if (sort !== "latest") params.set("sort", sort);
  if (price !== "all") params.set("price", price);
  if (brand !== "all") params.set("brand", brand);
  if (search.trim()) params.set("search", search.trim());
  params.set("page", "1"); // Always reset to page 1
  return `/category/${slug}?${params.toString()}`;
};
```

---

## R31 · CSS Scoping is Mandatory

**CRITICAL:** Every page-level CSS module MUST use a parent wrapper class to prevent CSS bleed to other pages.

### Pattern:
1. Wrap entire page content in a unique parent div:
```tsx
<div className={styles.uniquePageWrapper}>
  {/* All page content */}
</div>
```

2. Scope ALL CSS selectors with the parent class:
```css
/* ✅ CORRECT - Scoped to product page only */
.productPageWrapper .productTitle { ... }
.productPageWrapper .priceSection { ... }
.productPageWrapper .whatsappButton { ... }

/* ❌ WRONG - Global selector, will leak to other pages */
.productTitle { ... }
.priceSection { ... }
.whatsappButton { ... }
```

### Examples of Page Wrappers:
- Category page: `.pageWrapper` (category.module.css)
- Search page: `.searchPageWrapper` (search.module.css)
- Brand page: `.brandPageWrapper` (brand.module.css)
- Product page: `.productPageWrapper` (product.module.css)

### Testing CSS Isolation:
After creating page-level CSS, verify:
1. All selectors start with the parent wrapper class
2. No shared class names with other pages
3. No global selectors (like `.button`, `.title`, `.grid`)
4. Navigate to other pages and check for style corruption

### Component CSS vs Page CSS:
- **Component CSS** (`components/*.module.css`): Can use simpler class names (`.card`, `.header`) because they're only used in that component
- **Page CSS** (`app/**/*.module.css`): MUST use scoped selectors with parent wrapper to prevent conflicts between pages

---

## Quick Reference Card

| Element | Font | Size (Mobile/Desktop) | Color |
|---------|------|-----------------------|-------|
| Section Title | Sora | 48px / 84px | `--color-on-surface` |
| Product Title | IBM Plex Sans | 11px / 13px | `--color-on-surface` |
| Price | Sora | 12px / 14px | `--color-on-surface` or `--color-primary` (sale) |
| Labels/Badges | Space Mono | 9-11px | `--color-primary` or `--color-on-surface` |
| Body Text | IBM Plex Sans | 13-16px | `--color-on-surface-variant` |
| Corner Bracket | — | 12px × 12px | `--color-accent-lime` or `--color-primary` |
| Status Dot | — | 8px × 8px | `--color-accent-lime` or `--color-error` |
| Border Width | — | 1px | `--color-outline` |
| Border Radius | — | 0 | N/A |
| Grid Gap | — | 1px | N/A |
| Section Padding | — | 24-48px | N/A |

---

**Remember:** When in doubt, find the nearest similar component and copy its exact pattern. Consistency is more important than innovation in this design system.
