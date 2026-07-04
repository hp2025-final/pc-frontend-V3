# Pre-Built PC Series Pages Documentation

## Overview
Static series pages for Pre-Built PC catalog with tab-style navigation between series. Each series has its own dedicated page with SEO optimization.

---

## URLs Structure

### Series Pages:
- **LIZARD SERIES**: `/pre-built-pc/lizard-series` (20 builds)
- **FALCON SERIES**: `/pre-built-pc/falcon-series` (20 builds)
- **APEX SERIES**: `/pre-built-pc/apex-series` (20 builds)

### Redirects (301 Permanent):
- `/category/custom-builds` → `/pre-built-pc/lizard-series`
- `/category/pre-built-pcs` → `/pre-built-pc/lizard-series`

---

## Page Structure

### 1. Breadcrumb Navigation
```
HOME > PRE-BUILT PC > LIZARD SERIES
```
- Links back to homepage
- Links to homepage pre-built section (#pre-built-pc)
- Current series highlighted in orange

### 2. Series Navigation Tabs
- Horizontal tab layout (3 tabs: Lizard, Falcon, Apex)
- Active tab: Lime green background with bottom border
- Inactive tabs: White background, hover effect
- Desktop: Side by side (1/3 width each)
- Mobile: Stacked vertically

### 3. Series Banner
- Full-width responsive image
- Unique banner for each series
- Next.js Image optimization

### 4. Series Description Section
- Left: Description text (series info)
- Right: Build count badge (dark bg, lime number)
- Gradient background (white → #f9f9f9)
- Mobile: Stacked vertically

### 5. Build Cards Grid
- **Desktop**: 4 cards per row (4 columns)
- **Tablet**: 2 cards per row (2 columns)
- **Mobile**: 1 card per row (1 column)
- 1px gap between cards
- Same card design as homepage

---

## Card Design (Same as Homepage)

### Card Components:
1. **Badges** (top-right corner):
   - White background, black text
   - Side by side, no gaps
   - Max 2 badges shown

2. **Title + SKU Row**:
   - Title: Left-aligned, 20px, bold
   - SKU: Right-aligned, 9px, uppercase

3. **GPU + CPU Highlight**:
   - Orange text, light gray background
   - Centered text
   - Shortened names (e.g., "RTX 5070 Ti 16GB + Ryzen 7 9800X3D")

4. **Rating Bar**:
   - 10 rating boxes with partial fill
   - Example: 9.4 = 9 full boxes + 40% fill on 10th box
   - Text: "Expert Rating 9.4/10"

5. **Specs List** (8 components):
   - GPU, CPU, Motherboard, RAM, Storage, Cooler, PSU, Case
   - No labels, just component names
   - 11px font size
   - Border between items

6. **Why Description**:
   - Italic style
   - Fixed 2-line height (39px)
   - 13px font size

7. **Shop Now Button**:
   - Full width, lime green background
   - Opens WhatsApp with full PC configuration
   - Hover: Inverted colors

---

## SEO Features

### 1. Metadata (per series)
- Unique title: `{SERIES NAME} | Pre-Built Gaming PCs | PC Wala Online`
- Custom description per series
- Keywords targeting specific GPU/CPU models
- Canonical URLs

### 2. Open Graph Tags
- Series-specific banner image
- Custom title and description
- Proper locale (en_PK)

### 3. Structured Data (Future Enhancement)
```json
{
  "@type": "CollectionPage",
  "name": "Lizard Series Pre-Built Gaming PCs",
  "numberOfItems": 20,
  "itemListElement": [...]
}
```

### 4. Internal Linking
- Breadcrumb navigation
- Series tab navigation
- Homepage link (#pre-built-pc anchor)
- Mobile navigation menu

---

## Technical Implementation

### Files Created:
```
app/pre-built-pc/[series]/
├── page.tsx          # Main series page component
└── series.module.css # Styling for series pages
```

### Data Source:
- `lib/prebuiltData.ts` (LIZARD_BUILDS, FALCON_BUILDS, APEX_BUILDS)
- Static generation via `generateStaticParams()`
- ISR: Revalidates every 30 days (2592000 seconds)

### Static Site Generation (SSG):
```typescript
export async function generateStaticParams() {
  return [
    { series: 'lizard-series' },
    { series: 'falcon-series' },
    { series: 'apex-series' },
  ];
}
```

---

## Design System Adherence

### Colors (6-color palette):
- `#ffffff` - White (card backgrounds, tabs)
- `#f9f9f9` - Light gray (gradients, highlights)
- `#dadada` - Medium gray (borders, outlines)
- `#1a1c1c` - Dark (text, build count background)
- `#ff7a2f` - Orange (primary accent, highlights)
- `#ceff2f` - Lime (active tab, ratings, buttons)

### Typography:
- **Display**: Sora (headings, titles)
- **Body**: IBM Plex Sans (descriptions, specs)
- **Mono**: Space Mono (SKUs, badges, buttons)

### Layout:
- Brutalist grid system (1px gaps)
- Sharp corners (no border-radius)
- Strong borders and dividers
- Geometric composition

---

## Mobile Optimization

### Responsive Breakpoints:
- **Desktop**: > 1024px (4 columns)
- **Tablet**: 768px - 1024px (2 columns)
- **Mobile**: < 768px (1 column)

### Mobile-Specific Changes:
- Series tabs: Vertical stack
- Description: Full width, stacked
- Build count badge: Full width
- Cards: 1 per row
- Reduced padding throughout

---

## Performance

### Optimization Techniques:
1. **Static Generation**: All 3 series pre-rendered at build time
2. **ISR**: 30-day cache, on-demand revalidation possible
3. **Image Optimization**: Next.js Image component with priority loading
4. **CSS Modules**: Scoped styles, no runtime overhead
5. **No Client-Side JS**: Pure SSG, no hydration for static content

### Page Size Estimate:
- HTML: ~150KB per series (20 builds)
- Images: Lazy-loaded banners
- CSS: ~15KB (shared, cached)

---

## User Flow

### From Homepage:
1. User scrolls to "PRE-BUILT PC" section
2. Sees 3 series with auto-sliding carousels
3. Clicks series tab/name or "VIEW ALL" (future)
4. Lands on series page (`/pre-built-pc/{series}`)

### From Mobile Nav:
1. User clicks menu icon (bottom nav)
2. Clicks "PRE-BUILT PC"
3. Lands on default series (`/pre-built-pc/lizard-series`)

### On Series Page:
1. User sees breadcrumb, tabs, banner, description
2. Scrolls through all 20 builds in grid
3. Clicks "SHOP NOW" → Opens WhatsApp
4. Switches series via tabs → Client-side navigation

---

## Future Enhancements

### Potential Additions:
1. **Filtering**: By platform (Intel/AMD), price, GPU tier
2. **Sorting**: By rating, price, performance
3. **Comparison Tool**: Select 2-3 builds to compare
4. **Build Detail Pages**: Individual pages per build (`/pre-built-pc/{series}/{sku}`)
5. **Live Availability**: Show stock status via API
6. **Price Display**: Show calculated prices
7. **Search**: Filter by component (e.g., "RTX 5070")
8. **Pagination**: If series grows > 20 builds

---

## Maintenance

### Adding a New Series:
1. Add builds to `lib/prebuiltData.ts` (e.g., `DRAGON_BUILDS`)
2. Add banner to API server (`pcwo-pre-built-pc-dragon-series.webp`)
3. Update `SERIES_CONFIG` in `page.tsx`
4. Add to `ALL_SERIES` array
5. Rebuild site (Next.js will auto-generate new static page)

### Updating Existing Builds:
1. Edit `all_prebuilds.csv`
2. Run `node scripts/convertCSVToTS.js`
3. Update ratings in `scripts/ratingsData.js` if needed
4. Rebuild site or trigger ISR revalidation

### Changing Build Count:
- No code changes needed
- Grid automatically adjusts to build count
- SEO meta tags auto-update with build count

---

## Testing Checklist

### Desktop:
- [ ] All 3 series pages load correctly
- [ ] Tabs switch between series
- [ ] 4 cards per row display properly
- [ ] Breadcrumb links work
- [ ] Shop Now opens WhatsApp with correct config
- [ ] Ratings display with partial fill
- [ ] Badges appear in top-right corner

### Mobile:
- [ ] 1 card per row
- [ ] Tabs stack vertically
- [ ] Description section stacks
- [ ] Bottom nav links to series page
- [ ] Touch-friendly tap targets
- [ ] Images load properly

### SEO:
- [ ] Meta tags present on all pages
- [ ] Canonical URLs correct
- [ ] Open Graph images load
- [ ] Breadcrumb structured data (future)
- [ ] Redirects work (old category URLs)

---

## Analytics Tracking (Future)

### Events to Track:
- Series page views
- Series tab switches
- Build card clicks (Shop Now)
- WhatsApp conversions
- Series comparison usage

---

## Questions & Decisions

### ✅ Answered:
1. **Tab vs Separate Pages?** → Separate pages for SEO
2. **Grid Layout?** → 4 columns desktop, 1 mobile
3. **Card Design?** → Same as homepage
4. **Data Source?** → Static from prebuiltData.ts

### 🔮 Future Decisions:
1. Add individual build detail pages?
2. Implement filtering/sorting?
3. Show pricing information?
4. Add to cart functionality? (Not needed - WhatsApp only)
5. Build comparison tool?

---

## Related Files

### Components:
- `components/CustomBuildBanners.tsx` - Homepage section
- `components/MobileBottomNav.tsx` - Mobile navigation

### Data:
- `lib/prebuiltData.ts` - Build data (60 builds)
- `lib/utils.ts` - WhatsApp link generator
- `scripts/convertCSVToTS.js` - CSV converter
- `scripts/ratingsData.js` - Ratings & badges

### Configuration:
- `next.config.ts` - Redirects & image domains
- `app/robots.ts` - Sitemap generation

---

## Contact & Support
For questions or issues, refer to the main project documentation or contact the development team.
