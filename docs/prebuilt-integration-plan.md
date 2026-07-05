# Pre-Built PC Integration Plan
**Project**: PC Wala Online V3  
**Feature**: CSV-based Pre-Built PC System  
**Date**: January 2026  
**Status**: Planning Phase

---

## 📋 OVERVIEW

Integrate the 60 pre-built PC configurations from `all_prebuilds.csv` into:
1. **Homepage** — Display 5 random builds per series in carousel
2. **Series Pages** — Dedicated pages showing all builds for each series

---

## 🎯 REQUIREMENTS

### Data Source
- **File**: `/all_prebuilds.csv`
- **Total Builds**: 60 (3 series × 20 models each)
- **Series**:
  - LIZARD SERIES (20 builds: 10 Intel + 10 AMD)
  - FALCON SERIES (20 builds: 10 Intel + 10 AMD) — **replaces TRANSFORMER**
  - APEX SERIES (20 builds: 10 Intel + 10 AMD)

### CSV Structure
```csv
#,SERIES,MODEL,SKU,CPU Platform,GPU,CPU,RAM,Storage,Motherboard,Case,Cooler,PSU
```

**12 columns total:**
1. `#` — Row number (for sorting)
2. `SERIES` — Series name (LIZARD/FALCON/APEX)
3. `MODEL` — Build name (e.g., "APEX A1")
4. `SKU` — Unique identifier (e.g., "APIN-126")
5. `CPU Platform` — INTEL or AMD
6. `GPU` — Graphics card full spec
7. `CPU` — Processor model
8. `RAM` — Memory configuration
9. `Storage` — SSD/HDD specs
10. `Motherboard` — Mainboard model
11. `Case` — PC chassis
12. `Cooler` — CPU cooling solution
13. `PSU` — Power supply

---

## 🏠 HOMEPAGE CHANGES

### Component: `CustomBuildBanners.tsx`

#### Current Behavior
- Shows 3 columns: LIZARD, **TRANSFORMER**, APEX
- 4 demo builds per column (hardcoded fake data)
- "SHOP NOW" → category page link
- Carousel with 1.5 items visible

#### New Behavior
- Shows 3 columns: LIZARD, **FALCON**, APEX
- **5 RANDOM builds** per column from CSV data
- **"SHOP NOW"** → WhatsApp link with full configuration
- **"VIEW ALL"** → Series detail page (e.g., `/series/falcon`)
- Carousel remains same (1.5 items visible, auto-rotate)

#### Display Logic (Homepage Cards)
**Show LIMITED specs (4-6 key components):**
- GPU
- CPU
- RAM
- Storage
- (Optional: Motherboard, PSU)

**Hide on homepage:**
- Cooler
- Case (already shown in image context)
- Full detailed specs

#### WhatsApp Message Format
```
Hello PC Wala!

I'm interested in: [MODEL] ([SKU])
Platform: [CPU Platform]

Configuration:
- GPU: [GPU]
- CPU: [CPU]
- RAM: [RAM]
- Storage: [Storage]
- Motherboard: [Motherboard]
- Case: [Case]
- Cooler: [Cooler]
- PSU: [PSU]

Please send me pricing and availability!
```

---

## 📄 NEW SERIES PAGES

### Pages to Create

#### 1. `/series/lizard` (or `/pre-built-pc/lizard`)
- Display all 20 LIZARD builds
- Full specifications (all 12 CSV columns)
- Filter options: Intel/AMD, Price range (if available)

#### 2. `/series/falcon` (or `/pre-built-pc/falcon`)
- Display all 20 FALCON builds
- Full specifications
- Filter options: Intel/AMD

#### 3. `/series/apex` (or `/pre-built-pc/apex`)
- Display all 20 APEX builds
- Full specifications
- Filter options: Intel/AMD

### Page Structure

```
┌─────────────────────────────────────────────┐
│  Hero Banner (Series-specific image)       │
│  - Series Logo                              │
│  - Series Tagline                           │
│  - Description                              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Filter Bar                                 │
│  [All] [Intel] [AMD] [Sort by: Model ▼]   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Grid of Build Cards (2-3 columns)         │
│  ┌───────┐ ┌───────┐ ┌───────┐            │
│  │ Card  │ │ Card  │ │ Card  │            │
│  │ Full  │ │ Full  │ │ Full  │            │
│  │ Specs │ │ Specs │ │ Specs │            │
│  └───────┘ └───────┘ └───────┘            │
│  [Showing 20 builds]                       │
└─────────────────────────────────────────────┘
```

### Card Design (Series Pages)
**Same visual style as homepage carousel cards, but:**
- Show **ALL 12 specifications**
- Larger card height
- Full component list:
  - CPU Platform badge (Intel/AMD)
  - GPU
  - CPU
  - RAM
  - Storage
  - Motherboard
  - Case
  - Cooler
  - PSU
- **SHOP NOW** → WhatsApp link

---

## 🛠️ IMPLEMENTATION APPROACH

### Recommended: **STATIC PAGES (SSG)**

#### Why Static?
✅ Only 60 builds total — small dataset  
✅ Data doesn't change frequently  
✅ Fast load times (pre-rendered HTML)  
✅ Better SEO (all pages indexed)  
✅ No API overhead  
✅ Can use ISR for updates (revalidate every 30 days)

#### How It Works
1. **Build time**: Read `all_prebuilds.csv`
2. **Parse CSV** → TypeScript objects
3. **Generate pages**:
   - `/series/lizard` (static)
   - `/series/falcon` (static)
   - `/series/apex` (static)
4. **ISR**: `export const revalidate = 2592000` (30 days)

#### Alternative: Dynamic Pages
- Only if builds are added/removed weekly
- Requires API endpoint or CSV reading on each request
- Not recommended for current use case

---

## 📦 TECHNICAL TASKS

### Phase 1: Data Layer
- [ ] Create `/lib/prebuilts.ts` utility
- [ ] Add CSV parsing function (`parsePreBuildsCSV()`)
- [ ] Create TypeScript interface for PreBuiltPC
- [ ] Add functions:
  - `getAllPreBuilds()` — Returns all 60 builds
  - `getPreBuildsBySeries(series)` — Filter by series
  - `getRandomBuilds(series, count)` — Get N random builds
  - `getPreBuildBySKU(sku)` — Get single build

### Phase 2: Homepage Updates
- [ ] Update `CustomBuildBanners.tsx`:
  - Replace TRANSFORMER → FALCON
  - Remove hardcoded demo data
  - Load 5 random builds per series from CSV
  - Show limited specs (GPU, CPU, RAM, Storage)
  - Update "SHOP NOW" to use `generateWhatsAppLink()`
  - Update "VIEW ALL" links to `/series/[slug]`
- [ ] Update `generateWhatsAppLink()` in `lib/utils.ts`:
  - Add support for pre-built PC configuration
  - Format full component list in message

### Phase 3: Series Pages
- [ ] Create `/app/series/[slug]/page.tsx`
- [ ] Add route params: `lizard`, `falcon`, `apex`
- [ ] Create `SeriesPageClient.tsx` component
- [ ] Add filtering UI (Intel/AMD toggle)
- [ ] Display all 20 builds for selected series
- [ ] Show full specifications (all 12 columns)
- [ ] Add series-specific hero banners
- [ ] Wire "SHOP NOW" to WhatsApp

### Phase 4: Styling
- [ ] Create `/app/series/[slug]/series.module.css`
- [ ] Ensure cards match homepage design
- [ ] Add responsive grid (2-3 columns desktop, 1 mobile)
- [ ] Style filter bar
- [ ] Add series-specific color themes (optional)

### Phase 5: SEO & Metadata
- [ ] Add `generateMetadata()` for each series page
- [ ] Set canonical URLs
- [ ] Add structured data (Product schema)
- [ ] Update sitemap to include series pages

---

## 🎨 UI/UX SPECIFICATIONS

### Homepage Card (Limited View)
```
┌─────────────────────────┐
│ [Badge]          [Image]│
│                         │
│ APEX A1                 │
│ APIN-126                │
│                         │
│ • GPU: RTX 5070 Ti 16GB │
│ • CPU: i7-14700K        │
│ • RAM: 32GB DDR5-6400   │
│ • Storage: 2TB NVMe     │
│                         │
│ [SHOP NOW →]            │
└─────────────────────────┘
```

### Series Page Card (Full View)
```
┌─────────────────────────┐
│ [Badge]          [Image]│
│ [INTEL/AMD]             │
│                         │
│ APEX A1                 │
│ APIN-126                │
│                         │
│ • GPU: RTX 5070 Ti...   │
│ • CPU: Intel Core...    │
│ • RAM: 32GB DDR5-6400   │
│ • Storage: 2TB PCIe 4.0 │
│ • Motherboard: MSI MAG  │
│ • Case: Corsair FRAME   │
│ • Cooler: Thermalright  │
│ • PSU: Thermalright 1kW │
│                         │
│ [SHOP NOW →]            │
└─────────────────────────┘
```

---

## 🔗 URL STRUCTURE

### Homepage
- Section: "PCWO CUSTOM BUILD"
- Path: `/` (homepage section)

### Series Pages
- LIZARD: `/series/lizard` or `/pre-built-pc/lizard`
- FALCON: `/series/falcon` or `/pre-built-pc/falcon`
- APEX: `/series/apex` or `/pre-built-pc/apex`

**Recommended**: `/series/[slug]` (cleaner, easier to extend)

---

## 📊 DATA MAPPING

### CSV → TypeScript Interface

```typescript
interface PreBuiltPC {
  id: number;                    // From '#' column
  series: string;                // "LIZARD" | "FALCON" | "APEX"
  model: string;                 // "APEX A1"
  sku: string;                   // "APIN-126"
  cpuPlatform: "INTEL" | "AMD";
  gpu: string;
  cpu: string;
  ram: string;
  storage: string;
  motherboard: string;
  case: string;
  cooler: string;
  psu: string;
  // Computed fields
  slug?: string;                 // "apex-a1"
  badge?: string;                // "FLAGSHIP BUILD"
  image?: string;                // Default series image
}
```

### Badge Generation Logic
```typescript
function generateBadge(series: string, gpu: string): string {
  // Based on GPU tier
  if (gpu.includes("5090") || gpu.includes("7900 XTX")) return "FLAGSHIP BUILD";
  if (gpu.includes("5080") || gpu.includes("5070 Ti")) return "PERFORMANCE BUILD";
  if (gpu.includes("5070") || gpu.includes("9070")) return "GAMING BUILD";
  if (gpu.includes("5060") || gpu.includes("9060")) return "ESSENTIAL BUILD";
  if (gpu.includes("4060") || gpu.includes("3060")) return "STARTER BUILD";
  return "CUSTOM BUILD";
}
```

---

## ✅ ACCEPTANCE CRITERIA

### Homepage
- [x] TRANSFORMER series renamed to FALCON
- [ ] 5 random builds displayed per series
- [ ] Cards show 4-6 key specs (not all 12)
- [ ] "SHOP NOW" opens WhatsApp with full config
- [ ] "VIEW ALL" links to series page
- [ ] Carousel auto-rotates with staggered timing

### Series Pages
- [ ] 3 static pages created (`/series/lizard`, `/falcon`, `/apex`)
- [ ] Each page shows all 20 builds for that series
- [ ] Cards display all 12 component specifications
- [ ] Filter by Intel/AMD works
- [ ] "SHOP NOW" opens WhatsApp with config
- [ ] Responsive grid (2-3 cols desktop, 1 mobile)
- [ ] SEO metadata added
- [ ] ISR revalidation configured

### Code Quality
- [ ] TypeScript interfaces defined
- [ ] CSV parsing utility created
- [ ] WhatsApp link generation updated
- [ ] CSS modules follow design system
- [ ] No hardcoded data (all from CSV)
- [ ] Follows existing code patterns

---

## 🚀 DEPLOYMENT NOTES

### Before Deployment
1. Verify CSV file is in project root
2. Test random selection (refresh homepage multiple times)
3. Test WhatsApp links on mobile
4. Verify all 60 builds display correctly on series pages
5. Check filter functionality
6. Test responsive layouts (mobile/tablet/desktop)

### After Deployment
1. Monitor page load times
2. Check SEO indexing of series pages
3. Track WhatsApp conversion clicks
4. Gather user feedback on build selection

---

## 📝 NOTES

### Image Strategy
- **Current**: Using placeholder images from demo
- **Future**: Add actual build photos per SKU
- **Fallback**: Series-specific default images

### Pricing
- CSV doesn't include pricing
- WhatsApp message asks for "pricing and availability"
- Pricing provided by sales team via WhatsApp

### Future Enhancements
- Add price ranges (PKR)
- Add "Popular" / "Best Value" badges
- Build comparison tool
- Spec customization options
- Stock availability indicators

---

## 🔄 CHANGELOG

| Date | Version | Changes |
|------|---------|---------|
| Jan 2026 | 1.0 | Initial planning document created |

---

**Next Step**: Review plan with team, then proceed with Phase 1 (Data Layer) implementation.
