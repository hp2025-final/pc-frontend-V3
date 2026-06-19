# Product Pricing Scenarios - PC Wala Online

This document explains how products are categorized into different pricing collections based on their WooCommerce tags and price fields.

## Key Fields Used

- **`regular_price`**: Original/base price
- **`sale_price`**: Discounted/promotional price (if applicable)
- **`on_sale`**: Boolean indicating if product is on sale
- **`tags`**: Array of product tags (price-down, price-up, shift)

---

## Pricing Scenarios

### **SCENARIO SHIFT: High Fluctuation** 🔄
**Badge**: HIGH FLUCTUATION (yellow)  
**Tag**: `shift`

**Condition:**
```javascript
product has tag: "shift" OR tag name: "shift"
```

**Display:**
- Shows price range (Max and Min)
- Max = `regular_price` (or "Contact Us" if 0)
- Min = `sale_price` (or 10% discount from regular if no sale_price)

**Collection**: `/collection/high-fluctuation`

---

### **SCENARIO 1: Price Down** ⬇️
**Badge**: PRICE DOWN (green)  
**Tag**: `price-down`

**Condition:**
```javascript
product has tag: "price-down" 
AND regular_price > 0 
AND sale_price > 0
```

**Display:**
- Shows `sale_price` as current price (large)
- Shows `regular_price` as "Was" price
- Shows discount percentage: `-X%`

**Calculation:**
```javascript
percentage = Math.round(((regular_price - sale_price) / regular_price) * 100)
```

**Collection**: `/collection/price-drops`

---

### **SCENARIO 2: Price Up** ⬆️
**Badge**: PRICE UP (red)  
**Tag**: `price-up`

**Condition:**
```javascript
product has tag: "price-up" 
AND regular_price > 0 
AND sale_price > 0
```

**Display:**
- Shows `regular_price` as current price (large)
- Shows `sale_price` as "Was" price (old lower price)
- Shows increase percentage: `+X%`

**Calculation:**
```javascript
percentage = Math.round(((regular_price - sale_price) / sale_price) * 100)
```

**Collection**: `/collection/price-increases`

---

### **SCENARIO 3: On Sale (No Tag)** 🏷️
**Badge**: SALE X% OFF (orange)  
**Tag**: None

**Condition:**
```javascript
NO special tag (price-down, price-up, shift)
AND on_sale = true
AND regular_price > 0
AND sale_price > 0
```

**Display:**
- Shows `sale_price` as current price (large)
- Shows `regular_price` as "Was" price (strikethrough)
- Shows discount percentage in badge

**Collection**: `/collection/on-sale`

---

### **SCENARIO 4: Market Price (Stable)** 📊
**Badge**: MARKET PRICE (with up/down arrows)  
**Tag**: None

**Condition:**
```javascript
NO special tag (price-down, price-up, shift)
AND on_sale = false
AND regular_price > 0
AND sale_price = 0 (or not set)
```

**Display:**
- Shows `regular_price` only
- Text: "NOT CHANGED"
- Indicates stable market price

**Collection**: `/collection/market-price`

---

### **FALLBACK: Standard Display** 📦
**No Badge**

**Condition:**
```javascript
None of the above conditions match
```

**Display:**
- Simple price display
- WhatsApp order button
- No special badge

---

## Filtering Logic for Collections

### Price Drops Count:
```javascript
products.filter(p => getPriceTagInfo(p).tagType === "price-down")
```

### Price Increases Count:
```javascript
products.filter(p => getPriceTagInfo(p).tagType === "price-up")
```

### High Fluctuation Count:
```javascript
products.filter(p => getPriceTagInfo(p).tagType === "shift")
```

### Market Price Count:
```javascript
products.filter(p => {
  const priceInfo = getPriceTagInfo(p);
  const hasSpecialTag = priceInfo.tagType !== null;
  const hasRegularPrice = p.regular_price && parseFloat(p.regular_price) > 0;
  const hasSalePrice = p.sale_price && parseFloat(p.sale_price) > 0;
  
  return !hasSpecialTag && hasRegularPrice && !hasSalePrice;
})
```

### On Sale Count:
```javascript
products.filter(p => {
  const priceInfo = getPriceTagInfo(p);
  const hasSpecialTag = priceInfo.tagType !== null;
  const hasRegularPrice = p.regular_price && parseFloat(p.regular_price) > 0;
  const hasSalePrice = p.sale_price && parseFloat(p.sale_price) > 0;
  
  return !hasSpecialTag && hasRegularPrice && hasSalePrice && p.on_sale;
})
```

---

## Priority Order

If a product matches multiple conditions, tags take priority:

1. **Shift tag** → High Fluctuation (highest priority)
2. **Price-down tag** → Price Drop
3. **Price-up tag** → Price Increase
4. **On sale (no tag)** → On Sale collection
5. **Regular price only** → Market Price
6. **None match** → Fallback display

---

## Summary Table

| Scenario | Tag | Regular Price | Sale Price | on_sale | Collection |
|----------|-----|---------------|------------|---------|------------|
| High Fluctuation | `shift` | Any | Any | Any | `/collection/high-fluctuation` |
| Price Down | `price-down` | > 0 | > 0 | Any | `/collection/price-drops` |
| Price Up | `price-up` | > 0 | > 0 | Any | `/collection/price-increases` |
| On Sale | None | > 0 | > 0 | true | `/collection/on-sale` |
| Market Price | None | > 0 | 0 or empty | false | `/collection/market-price` |
| Fallback | None | Any | Any | Any | N/A |

---

**Created for**: PC Wala V3 Hero Section Market Tracker  
**Last Updated**: June 19, 2026
