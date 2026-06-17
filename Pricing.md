# PC Wala V3 — Pricing System
> Load this file when working on any pricing display, product tags, PCD_2 footer, or WhatsApp messages.

---

## 💰 PRICING SYSTEM — TAG-AWARE (6 SCENARIOS)

**CRITICAL:** All pricing logic is centralized in `lib/utils.ts > getPriceTagInfo()`

The system uses WooCommerce product tags to dynamically display pricing based on market conditions.

### Evaluation Order (both PCD_2 and Product Page)
```ts
1. isScenarioShift  = priceInfo.tagType === "shift"
2. hasFluctuation   = priceInfo.tagType && percentage > 0 && !isScenarioShift
                      ↳ includes: tagType === "price-down" OR tagType === "price-up"
3. isScenario3      = !tagType && onSale && hasRegularPrice && hasSalePrice
4. isScenario4      = !tagType && !onSale && hasRegularPrice && !hasSalePrice
5. Fallback         = everything else
```

### Visual Summary

| Scenario | Tag Needed | Condition | Badge | Price Display | Footer |
|----------|-----------|-----------|-------|---------------|--------|
| 0: HIGH FLUCTUATION | `shift` | Any | Gray wave icon | Max + Min | 3 rows |
| 1: PRICE DOWN | `price-down` | reg>0, sale>0 | Green ↓ | Current (sale) | 3 rows |
| 2: PRICE UP | `price-up` | reg>0, sale>0 | Red ↑ | Current (reg) | 3 rows |
| 3: ON SALE | None | on_sale=true | Orange tag | Sale price | 3 rows |
| 4: MARKET PRICE | None | reg>0, no sale | Gray ↕ | Regular price | 3 rows |
| 5: FALLBACK | None | Any | None | Display price | 2 cols |

---

## Scenario 0: HIGH FLUCTUATION (Shift Tag)
**Trigger:** Product has tag with `slug === "shift"` OR `name.toLowerCase() === "shift"`

**PCD_2 Display:**
- Row 1: "HIGH FLUCTUATION" badge with wave icon (`tagBadgeShift`)
- Row 2: "Max [price]" (from `priceInfo.priceMax` = `regular_price`)
- Row 3: "Min [price]" (from `priceInfo.priceMin` = `sale_price` OR `regular_price * 0.9`)

**Product Page Display:**
- "HIGH FLUCTUATION" badge + Max/Min prices + "Price varies due to market conditions"

**WhatsApp Message:**
```
*Price Range:* Rs. [min] - Rs. [max] (High market fluctuation - contact us for current price)
```

**Logic:**
```ts
priceMax = regular_price
priceMin = sale_price || regular_price * 0.9
```

---

## Scenario 1: PRICE DOWN
**Trigger:** Tag `slug === "price-down"` AND `regular_price > 0` AND `sale_price > 0`

**PCD_2 Display:**
- Row 1: "PRICE DOWN" badge with ↓ arrow (`tagBadgeDown`, green)
- Row 2: Current price LARGE (`priceValue`)
- Row 3: "Was [regular_price]" + "-XX%" (green)

**WhatsApp Message:**
```
*Current Price:* Rs. [sale_price] (Price Down from Rs. [regular_price] - Save XX%!)
```

**Logic:**
```ts
displayPrice = sale_price
wasPrice = regular_price
percentage = Math.round(((regular_price - sale_price) / regular_price) * 100)
```

---

## Scenario 2: PRICE UP
**Trigger:** Tag `slug === "price-up"` AND `regular_price > 0` AND `sale_price > 0`

**PCD_2 Display:**
- Row 1: "PRICE UP" badge with ↑ arrow (`tagBadgeUp`, red)
- Row 2: Current price LARGE (`priceValue`)
- Row 3: "Was [sale_price]" + "+XX%" (red)

**WhatsApp Message:**
```
*Current Price:* Rs. [regular_price] (Price increased +XX% from Rs. [sale_price] due to market conditions)
```

**Logic:**
```ts
displayPrice = regular_price  (current higher price)
wasPrice = sale_price         (old lower price)
percentage = Math.round(((regular_price - sale_price) / sale_price) * 100)
```

---

## Scenario 3: ON SALE (WooCommerce Sale, No Tag)
**Trigger:** `on_sale === true` AND `regular_price > 0` AND `sale_price > 0` AND NO price tags

**PCD_2 Display:**
- Row 1: "SALE XX% OFF" badge with tag icon (`tagBadgeSale`, orange)
- Row 2: Sale price LARGE
- Row 3: "Was [regular_price]" with strikethrough

**WhatsApp Message:**
```
*Current Price:* Rs. [sale_price] (Regular: Rs. [regular_price])
```

**Logic:**
```ts
discountPercentage = Math.round(((regular_price - sale_price) / regular_price) * 100)
```

---

## Scenario 4: MARKET PRICE (Stable)
**Trigger:** `regular_price > 0` AND NO sale AND NO tags

**PCD_2 Display:**
- Row 1: "MARKET PRICE" badge with ↕ arrows (`marketPriceBadge`)
- Row 2: Regular price LARGE
- Row 3: "NOT CHANGED"

**WhatsApp Message:**
```
*Price:* Rs. [regular_price]
```

---

## Scenario 5: FALLBACK
**Trigger:** None of the above OR no valid prices

**PCD_2 Display:** 2-col footer — price label left, WhatsApp arrow button right

**WhatsApp Message:**
```
*Product:* [name]
*Price:* Rs. [displayPrice] OR Contact for Price
```

---

## Implementation Flow

**1. `lib/utils.ts > getPriceTagInfo()`**
- Checks tags in order: `shift`, `price-down`, `price-up`
- Returns: `{ tagType, displayPrice, wasPrice, percentage, hasValidPrices, priceMax?, priceMin? }`

**2. PCD_2 / ProductPageClient**
- Calls `getPriceTagInfo(product)`, evaluates scenarios in order, renders conditional JSX

**3. Badge CSS Classes:**
- `.tagBadgeShift` → Gray with wave
- `.tagBadgeDown` → Green with ↓
- `.tagBadgeUp` → Red with ↑
- `.tagBadgeSale` → Orange with tag
- `.marketPriceBadge` → Gray with ↕

**4. Price CSS Classes:**
- `.priceValue` → General large price (14-16px, Sora 700)
- `.salePrice` → Sale/discount price (orange color)
- `.mainPrice` → Regular/stable price
- `.shiftPrice` → Fluctuation price
- `.wasPriceText` → Old/was price (10-11px, Space Mono)

---

## ⚠️ Rules for Modifying Pricing

1. **ONLY** edit `lib/utils.ts > getPriceTagInfo()`
2. Never duplicate pricing logic in components
3. Test changes in both PCD_2 and ProductPageClient
4. Verify WhatsApp messages reflect changes