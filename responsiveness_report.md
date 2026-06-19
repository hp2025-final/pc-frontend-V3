# PC Wala V3 — Responsiveness Audit Report
> Researched from CSS source code only. No changes made.
> Breakpoints observed: **Mobile** ≤ 768px · **Tablet** 769–1199px · **Desktop** ≥ 769px (1200px+ for large desktop)

---

## 🏗️ Breakpoint System Summary

| Breakpoint | Value | How It's Used |
|---|---|---|
| Mobile-first base | `< 769px` | Default styles |
| Desktop upgrade | `min-width: 769px` | Most components switch layout here |
| Large desktop | `min-width: 1200px` | Minor font/spacing tweaks only (Header nav, WhyChooseUs) |
| Mobile-down (max) | `max-width: 768px` | Used by some components (globals, CustomBuildBanners, SocialMediaSection, Breadcrumb) |

> [!NOTE]
> There is a **1px gap** at exactly `768–769px`. `max-width: 768px` and `min-width: 769px` together cover this edge correctly, but components that use only `min-width: 769px` miss the `769px` exact point by 1px. In practice this is harmless.

> [!IMPORTANT]
> **There is no dedicated tablet breakpoint.** Tablet (769–1199px) gets the exact same layout as desktop (769px+). Tablet views are essentially desktop layouts scaled down — usually acceptable but can feel tight on 768–900px devices.

---

## ✅ Global Styles (`globals.css`)

| Feature | Mobile | Tablet | Desktop | Notes |
|---|---|---|---|---|
| `body` padding-bottom | `60px` (for bottom nav) | inherited | `0` | ✅ Correct |
| `section` spacing | `48px` margin-bottom | — | `64px` | ✅ |
| `.display-lg` | `36px` | — | `80px` | ✅ |
| `.headline-lg` | `28px` | — | `48px` | ✅ |
| `.headline-md` | `22px` | — | `32px` | ✅ |
| `--grid-margin` | `1rem` | — | `2rem` | ✅ |
| `.blueprint-grid` | `1fr` (single column) | — | `12-col` | ✅ |
| `.section-header` special 2-col rule | `65%/35%` override | — | 12-col | ✅ |
| `.grid-2-col-mobile` | `1fr 1fr` | — | inherited | ✅ Used for product grids |
| `.brutalist-section-title` | `48px` | — | inherited | ✅ |
| `overflow-x: clip` on body | ✅ | ✅ | ✅ | Prevents horizontal scroll |

---

## 🧩 Component-by-Component Analysis

---

### 🟢 AnnouncementBar
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | `10px` font, `60px` separator gap, continuous marquee |
| Desktop (768px+) | `11px` font, `80px` separator gap |

- No layout changes needed — marquee is naturally fluid at all sizes.

---

### 🟢 Header
**Status: ✅ Fully Responsive — Mobile & Desktop**

| Viewport | Behavior |
|---|---|
| Mobile (`< 769px`) | Logo + mobile action buttons (search icon, WA button, hamburger). Dropdown drawers for search and menu. |
| Tablet (769px–1199px) | Full desktop layout: Logo left, nav center, search+WA right. May feel tight but functional. |
| Desktop (`≥ 769px`) | Full 3-column horizontal layout. Desktop nav visible. Mobile actions hidden. |
| Large Desktop (`≥ 1200px`) | Nav font stays at `11px`, no meaningful change. |

**Strengths:**
- Auto-hide on scroll (`translateY(-100%)`) works at all sizes
- Mega menu is desktop-only (correctly hidden on mobile)
- Mobile menu drawer has `max-height: 70vh` + `overflow-y: auto` — handles long menus

**Potential Issue:**
- The desktop search area is a **fixed `250px` width**. On tablets (769–900px), the nav + search + WA button can crowd each other.

---

### 🟢 MobileBottomNav
**Status: ✅ Correctly Mobile-Only**

| Viewport | Behavior |
|---|---|
| Mobile | Fixed bottom bar, 5 icons, hides on scroll-down |
| Desktop (`≥ 769px`) | `display: none` — completely hidden |

---

### 🟢 HeroSlider
**Status: ✅ Responsive with Separate Mobile/Desktop Images**

| Viewport | Behavior |
|---|---|
| Mobile | Single column, hero content stacked above products, `42px` title, `min-height: 400px`. Mobile image (`hero_left_1_mobile.png`) |
| Tablet/Desktop (`≥ 769px`) | 2-column side-by-side grid, fixed `550px` height, `72px` title. Desktop image (`hero_left_1.png`) |

**Strengths:**
- Separate `background-image` URLs for mobile vs. desktop (correct art direction)
- Vertical product slider resizes from `348px` mobile to `600px` desktop
- Product card grid changes from `80px/1fr` (mobile) to `130px/1fr` (desktop)

---

### 🟢 CategoriesGrid
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | `2-column` grid, `40px` section title, cards `min-height: 140px`, `32px` icons |
| Tablet/Desktop (`≥ 769px`) | `6-column` grid, `64px` section title, `24px` icons |

- Clean 2→6 column jump at 769px. Works well.

---

### 🟢 BannerProductSection
**Status: ✅ Fully Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | Stacked: full-width banner (375px height) on top, product slider below (2 products visible). Mobile banner image shown. |
| Tablet/Desktop (`≥ 769px`) | `12-column` grid: banner takes 4 cols, products take 8 cols. Desktop banner image shown. Product slider shows 4 items. |

**Strengths:**
- Separate mobile/desktop banner images via `display: none/block` toggling
- `--visible-items`: 2 mobile → 4 desktop

---

### 🟢 GridSection (Latest Arrivals, etc.)
**Status: ✅ Mostly Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | Uses `blueprint-grid` → collapses to `1fr`. Products use 2-col mobile grid. |
| Desktop (`≥ 769px`) | Background image switches from mobile to desktop variant |

**Potential Issue:**
- The `sectionTitle` is `84px` on desktop/tablet. **No font size reduction is defined for tablet (769–1024px).** Intentional brutalist design but may feel heavy on smaller tablets.

---

### 🟡 CustomBuildBanners
**Status: ⚠️ Partially Responsive — Tablet concern**

| Viewport | Behavior |
|---|---|
| Mobile (`≤ 768px`) | Single column, `48px` title, stacked columns |
| Tablet/Desktop (`≥ 769px`) | 12-column grid with 3 columns of 4. Title stays at `84px`. |

> [!WARNING]
> **The `84px` section title has no desktop size reduction.** It is by design (brutalist aesthetic) but may feel heavy on small tablets (769–900px).

**What works:**
- Mobile query correctly stacks columns and reduces font
- `modelButtonRow` stacks vertically on mobile, Shop Now button goes full-width

---

### 🟡 NotablesSection + ProductSubSection
**Status: ⚠️ Partially Responsive — Mobile concern**

| Viewport | Behavior |
|---|---|
| Mobile | Grid collapses to 1 col via global `.blueprint-grid` rule. Each sub-section stacks vertically. |
| Tablet/Desktop (`≥ 769px`) | Each sub-section spans 4 cols — 3 sections side by side |

> [!CAUTION]
> The product grid inside `ProductSubSection` is **always `1fr 1fr` (2 columns)** — there is **no mobile override to reduce this to 1 column**. On narrow mobile screens (320–375px), two PCD_2 cards side-by-side may be very cramped, with product names clipping to just 1 line instead of 2.

---

### 🟢 PCD_2 (Product Card)
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | `220px` image area, `10px` product title, badges `8px`/`24px` height, `14px` price |
| Tablet/Desktop (`≥ 769px`) | `260px` image area, `12px` title, border + hover clip-path, `16px` price, `28px` badges |

**Strengths:**
- `clip-path` hover effect is desktop-only (no tap issues on mobile)
- All badge cells scale up proportionally

---

### 🟡 SocialMediaSection (Reels)
**Status: ⚠️ Responsive with Layout Switch — Tablet concern**

| Viewport | Behavior |
|---|---|
| Mobile (`≤ 768px`) | Desktop grid hidden, **2-column mobile grid** shown, `48px` title |
| Tablet/Desktop (`≥ 769px`) | **6-column desktop grid** shown, mobile grid hidden, `84px` title |

> [!WARNING]
> Tablet (769–1024px): **6 vertical reels in a row** = each reel only ~128px wide on a 769px viewport. With `9:16` aspect ratio, cards become very tall and narrow. There is no intermediate 3–4 column layout for tablets.

---

### 🟢 BrandMarquee
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | `24px` padding, `16px` brand name |
| Desktop (`≥ 769px`) | `32px` padding, `18px` brand name |

- Marquee is fully fluid, works on all widths.

---

### 🟢 WhyChooseUs
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | Stacked vertically: header block, then 1-column features grid, `38px` title |
| Tablet/Desktop (`≥ 769px`) | Side-by-side: 38% header / 62% features (2×2 grid). `48px` title. |
| Large Desktop (`≥ 1200px`) | `56px` title, more internal padding |

---

### 🟢 SearchBar
**Status: ✅ Responsive (Fluid)**

- No explicit media queries — uses `width: 100%`, grows to container
- Dropdown popover is `position: absolute`, works on all sizes
- No mobile-specific issues

---

### 🟢 CategoryControls (Filter Bar)
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | 4 dropdowns at `50% width` = 2×2 grid, `44px` height, `8px` font |
| Desktop (`≥ 769px`) | 4 dropdowns at `25% width` = single row, `48px` height, `10px` font |

---

### 🟢 SearchControls (Search Page Filter Bar)
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | 2 dropdowns at `50% width`, `44px` height, `8px` font |
| Desktop (`≥ 769px`) | Same `50%` layout, `48px` height, `10px` font |

---

### 🟢 Breadcrumb
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile (`≤ 768px`) | `6px` padding, `8px` font, `nowrap`, last item truncates at `max-width: 150px` with ellipsis |
| Desktop | `12px` padding, `10px` font, wraps normally |

---

### 🟢 NewFooter
**Status: ✅ Responsive**

| Viewport | Behavior |
|---|---|
| Mobile | Footer grid collapses to `1fr` — all 5 sections stack vertically |
| Desktop (`≥ 769px`) | `5-column` asymmetric grid (`1.5fr 1fr 1fr 1fr 1.2fr`) |

- Top banner and bottom row both use `flex-wrap: wrap` — naturally wraps on mobile.

---

### 🟢 Product Page (`product.module.css`)
**Status: ✅ Fully Responsive — Most detailed implementation in the project**

| Section | Mobile | Desktop (`≥ 769px`) |
|---|---|---|
| Product grid | 1 column, stacked | 12-column: image 6, info 6, specs 6, desc 6 |
| Image gallery | Main image LEFT, `80px` thumbnail column RIGHT, nav bar BELOW | `100px` thumbs LEFT, image CENTER, `60px` vertical nav RIGHT |
| Product title | `20px`, 4-line clamp | `24px`, 3-line clamp |
| Main price | `27px` | `32px` |
| Shift/max-min price | `21px` | `25–26px` |
| WhatsApp button | `18px` padding | `20px` padding |
| Specs table | Full width, stacked below info | 6 columns, side by side |
| FAQ grid | 1 column | 2 columns |
| Stock badge | Left-aligned | Right-aligned |

**Strengths:**
- 1904 lines of scoped CSS with clean mobile-first architecture
- Separate `@media (max-width: 768px)` section for mobile-only overrides
- Separate `@media (min-width: 769px)` section for desktop upgrades
- Image gallery completely rearranges layout (not just resizes)

---

### 🟡 Static Pages (`static.module.css` — About, Contact, Warranty, Privacy, Terms)
**Status: ✅ Mostly Responsive**

| Feature | Mobile | Desktop (`≥ 769px`) |
|---|---|---|
| Page title | `48px` | `84px` |
| Contact grid | `1 column` | `2 columns` |
| Content box padding | `32px` | `48px` |
| CTA box padding | `32px` | `48px` |

**Potential Issue:**
- `specTable` (warranty table) has no responsive rule — the `30%/70%` two-column table may overflow or be hard to read on small screens. No `overflow-x: auto` wrapper is defined.

---

## 📊 Summary Table

| Component | Mobile | Tablet (769–1199px) | Desktop (≥769px) | Issues |
|---|---|---|---|---|
| `globals.css` | ✅ | ✅ | ✅ | None |
| `AnnouncementBar` | ✅ | ✅ | ✅ | None |
| `Header` | ✅ | ⚠️ Tight at 769–900px | ✅ | Fixed 250px search can crowd nav |
| `MobileBottomNav` | ✅ | ❌ Hidden | ❌ Hidden | By design |
| `HeroSlider` | ✅ | ✅ | ✅ | None |
| `CategoriesGrid` | ✅ | ✅ | ✅ | None |
| `BannerProductSection` | ✅ | ✅ | ✅ | None |
| `GridSection` | ✅ | ⚠️ 84px title | ✅ | No tablet font reduction |
| `CustomBuildBanners` | ✅ | ⚠️ 84px title | ✅ | No tablet font reduction |
| `NotablesSection` | ✅ | ✅ | ✅ | Relies on global grid collapse |
| `ProductSubSection` | ⚠️ | ✅ | ✅ | 2-col product grid always, cramped on small mobile |
| `PCD_2` | ✅ | ✅ | ✅ | None |
| `SocialMediaSection` | ✅ | ⚠️ 6 reels very narrow | ✅ | No intermediate tablet columns |
| `BrandMarquee` | ✅ | ✅ | ✅ | None |
| `WhyChooseUs` | ✅ | ✅ | ✅ | Extra large-desktop breakpoint |
| `SearchBar` | ✅ | ✅ | ✅ | Fluid, no issues |
| `CategoryControls` | ✅ | ✅ | ✅ | None |
| `SearchControls` | ✅ | ✅ | ✅ | None |
| `Breadcrumb` | ✅ | ✅ | ✅ | None |
| `NewFooter` | ✅ | ✅ | ✅ | None |
| `ProductPage` | ✅ | ✅ | ✅ | Most thorough implementation |
| `StaticPages` | ⚠️ | ✅ | ✅ | Warranty table may need overflow scroll |

---

## 🔴 Issues Found (Prioritized)

### Priority 1 — Potential Usability Problems

| # | Component | Issue | Viewport |
|---|---|---|---|
| 1 | `ProductSubSection` (Notables) | Product grid is always `1fr 1fr`. On 320–375px mobile, 2 PCD_2 cards side-by-side = very cramped. Product names may clip to 1 line. | Mobile |
| 2 | `SocialMediaSection` | 6 reels in one row at 769px = each reel ~128px wide. 9:16 aspect ratio cards become tall/narrow columns. | Tablet 769–1023px |
| 3 | `static.module.css` specTable | Warranty table has no `overflow-x: auto` wrapper — long content may cause horizontal overflow. | Mobile |

### Priority 2 — Visual / Design Concerns

| # | Component | Issue | Viewport |
|---|---|---|---|
| 4 | `Header` desktopSearch | Fixed `250px` search width. At 769–900px tablets, nav + search + WA may overflow or compress nav links. | Tablet 769–900px |
| 5 | `GridSection`, `CustomBuildBanners`, `SocialMediaSection` | `84px` brutalist section title has no tablet-specific size reduction. Intentional design but may feel heavy at 769–900px. | Tablet |

### Priority 3 — Minor / Cosmetic

| # | Component | Issue | Viewport |
|---|---|---|---|
| 6 | `AnnouncementBar` | Uses `min-width: 768px` while most components use `769px`. One pixel inconsistency — harmless. | n/a |
| 7 | `NewFooter` grid | 5-column footer at 769px may be tight, especially the contact/WA column with long phone numbers. | Tablet |

---

## ✅ What's Working Very Well

1. **Mobile-first architecture** — almost all components define mobile as default and add desktop overrides
2. **Product Page** — most comprehensive responsive implementation (1904 lines of scoped CSS)
3. **HeroSlider** — separate art-directed images per viewport (mobile vs. desktop)
4. **BannerProductSection** — proper banner swap + slider count change between mobile/desktop
5. **MobileBottomNav + Header** — clean handoff between mobile-only and desktop-only navigation
6. **`overflow-x: clip` on body** — prevents horizontal scroll at all sizes
7. **`body padding-bottom: 60px` on mobile** — correctly accounts for the fixed bottom nav
8. **Breadcrumb truncation** — smart `text-overflow: ellipsis` on mobile for long product names
