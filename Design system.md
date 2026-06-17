# PC Wala V3 — Design System
> Load this file when working on any UI, CSS, layout, or component styling.

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
border: 1px solid var(--color-border);
font-family: 'Space Mono', monospace;      /* for prices & labels */
text-transform: uppercase;                 /* for category labels & badges */

/* ❌ WRONG */
border-radius: 4px;          /* or 8px, 12px, 50% */
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

**Orange (bottom-right):** Primary section accents — same structure, use `var(--color-orange)`

**Mini brackets (top-right or corners):** Sub-elements — 6-8px size, 1px borders

### Status Dots
```css
.dot {
  width: 8px; height: 8px;
  background-color: var(--color-lime); /* in stock */
  display: inline-block;
  border-radius: 50%; /* Only exception to no-border-radius rule */
}
```

### Hover Sweep Animation
```css
.button { position: relative; overflow: hidden; z-index: 1; }

.button::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 0; height: 100%;
  background-color: var(--color-orange);
  transition: width 0.5s ease;
  z-index: 1;
}

.button:hover::before { width: 100%; }
.buttonText { position: relative; z-index: 2; }
```

---

## 📐 GRID SYSTEM

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

**Column spans:**
- Products: `span 2` (6 per row desktop, 2 per row mobile)
- Hero content: `span 7` / Hero products: `span 5`
- Banner: `span 4` / Products area: `span 8`

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
  .grid-2-col-mobile > div { grid-column: span 1 !important; }
}
```

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

## 🎯 STYLING GUIDELINES

1. Always use CSS Modules (`.module.css`)
2. CSS variables from `globals.css` only
3. `border-radius: 0` (except status dots)
4. Borders: `1px solid`
5. Typography: Sora (display), IBM Plex Sans (body), Space Mono (mono)
6. Mobile first, desktop at `@media (min-width: 769px)`
7. Always pair component with `.module.css`
8. Scope product page CSS with `.productPageWrapper`

### CSS Module Scoping
- Always use `.moduleName` prefix for all selectors
- For complex pages, wrap in parent: `.pageWrapper .childElement`
- Never use global selectors in module files