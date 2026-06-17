# PC Wala V3 — Components Reference
> Load this file when working on PCD_2, HeroSlider, BannerProductSection, CategoryControls, or any component in `/components`.

---

## 📁 Component Map

```
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
  PCD_2.tsx                   ← Main product card (tag-aware pricing) ← USE THIS
  ProductCard.tsx             ← Legacy product card (DEPRECATED — do not use)
  Breadcrumb.tsx              ← Breadcrumb navigation
  CategoryControls.tsx        ← Category filter controls
  SearchControls.tsx          ← Search page controls
  SearchBar.tsx               ← Live search dropdown
  WhatsAppButton.tsx          ← Floating WhatsApp button
  OrderArrowButton.tsx        ← WhatsApp CTA arrow button
  [Component].module.css      ← Always paired with component
```

---

## 🧩 PCD_2 (Primary Product Card)
**File:** `components/PCD_2.tsx`

**Structure:**
1. **Invisible Link Overlay** — covers entire card, z-index: 1
2. **Image Area** — 236×236px, object-fit: contain
   - Stock badge: top-left with orange bracket corner
   - "IN STOCK" (lime dot) or "OUT OF STOCK" (red)
3. **Title Area** — 2-line clamp, 11px mobile / 13px desktop
4. **Footer Area** — Conditional rendering (6 scenarios — see `docs/pricing.md`)

**Pricing Logic Flow:**
```ts
const priceInfo = getPriceTagInfo(product);
const onSale = product.on_sale && product.sale_price;
const hasRegularPrice = regularPrice && parseFloat(regularPrice) > 0;
const hasSalePrice = salePrice && parseFloat(salePrice) > 0;

const isScenarioShift = tagType === "shift";
const hasFluctuation = tagType && percentage > 0 && !isScenarioShift;
const isScenario3 = !tagType && onSale && hasRegularPrice && hasSalePrice;
const isScenario4 = !tagType && !onSale && hasRegularPrice && !hasSalePrice;
// Fallback = everything else
```

**Footer Rendering Order:**
1. `isScenarioShift` → 3-row: HIGH FLUCTUATION badge, Max/Min prices
2. `hasFluctuation` → 3-row: PRICE DOWN/UP badge, current price, was price + %
3. `isScenario3` → 3-row: SALE badge, sale price, was regular price
4. `isScenario4` → 3-row: MARKET PRICE badge, regular price, "NOT CHANGED"
5. Fallback → 2-col: price label left, WhatsApp arrow right

**3-Row Footer Layout:**
```css
.footerArea { display: flex; flex-direction: column; }
.badgeRow { justify-content: flex-end; }       /* Row 1: Badge */
.priceRow { justify-content: flex-start; }     /* Row 2: Price (large) */
.fluctuationRow { justify-content: flex-start; } /* Row 3: Was price + % */
.priceValue { font-size: 14px mobile / 16px desktop, Sora 700 }
.wasPriceText { font-size: 10px mobile / 11px desktop, Space Mono }
```

**2-Col Fallback Footer:**
```css
.fallbackFooter { display: grid; grid-template-columns: 1fr auto; }
.fallbackPriceLabel { Space Mono, 9px mobile / 10px desktop }
.fallbackPriceValue { Sora 700, 12px mobile / 14px desktop }
```

**Badge CSS Classes:**
- `.tagBadgeShift` — Gray with wave icon
- `.tagBadgeDown` — Green with ↓ arrow
- `.tagBadgeUp` — Red with ↑ arrow
- `.tagBadgeSale` — Orange with tag icon
- `.marketPriceBadge` — Gray with ↕ arrows

**Card Styling:**
- Desktop: 1px border + hover clip-path corner cut
- Mobile: No border (blueprint-grid gap creates visual separation)
- Always uses `formatPrice()` and `getPriceTagInfo()`

---

## 🎠 HeroSlider (Vertical Product Carousel)
**File:** `components/HeroSlider.tsx`

**Mechanics:**
- Triple array for infinite loop: `[...products, ...products, ...products]`
- State: `activeIndex` starts at `products.length` (middle set)
- Auto-slide: `setInterval` every 3 seconds, increments index
- Loop reset: When index hits boundaries, disable transition, jump to equivalent position
- Visible items: 3 cards (0.5 + 1 + 1 + 0.5), center 2 active
- Transform: `translateY(-index * (cardHeight + gap) + offset)`
- Hover: Pauses auto-scroll
- Height: 348px mobile / 600px desktop

---

## 🎞️ BannerProductSection (Horizontal Slider)
**File:** `components/BannerProductSection.tsx`

**Structure:**
- Desktop: 4-col banner left, 8-col products right
- Mobile: banner top (375px height), products below
- Products: 2 visible mobile, 4 visible desktop

**Mechanics:**
- Triple array for infinite loop
- Slider state: `currentIndex` starts at `products.length` (middle set)
- Auto-slide: every 3 seconds
- Loop reset: Disable transition, jump to equivalent position after slide
- Transform: `translateX(-${(currentIndex / totalItems) * 100}%)`
- CSS variable: `--visible-items: 2` (mobile) / `4` (desktop)

---

## 🔍 CategoryControls (Filter Bar)
**File:** `components/CategoryControls.tsx`

**Layout:**
- Mobile: 2×2 grid (50% width per box)
- Desktop: 1×4 row (25% width per box)

**Controls:**
- Search input with 300ms debounce
- Brand dropdown (from CATEGORY_BRANDS static mapping)
- Sort dropdown (latest/oldest/price high-low)
- Price dropdown (10 ranges from Rs. 1K-500K)
- All changes update URL params and reset to page 1

**Dropdowns:** Custom styled `<select>` with arrow icon overlay (positioned absolute right, pointer-events: none)

---

## 🧩 COMPONENT CHECKLIST

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
6. Export default at bottom

### Adding a New Product Display Component:
1. Read `PCD_2.tsx` and its CSS first
2. Import `getPriceTagInfo()` from `lib/utils`
3. Call it: `const priceInfo = getPriceTagInfo(product)`
4. Implement 6 scenarios in evaluation order
5. Use CSS variables, not hardcoded colors
6. Test all 6 scenarios with different products