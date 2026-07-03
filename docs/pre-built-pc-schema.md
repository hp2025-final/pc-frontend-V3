# Pre-Built PC JSON-LD Schema Logic Explained

> **What is JSON-LD Schema?**  
> JSON-LD is a way to tell search engines (like Google) exactly what your webpage contains. Think of it like product labels in a supermarket — it helps Google understand and display your products correctly in search results.

---

## Overview

The pre-built PC page generates **4 different schemas** to maximize search visibility:

1. **Product Schema** — Main product information
2. **Breadcrumb Schema** — Navigation path
3. **FAQ Schema** — Questions & answers from expert assessments
4. **Review Schema** — Expert rating and detailed review

---

## 1. Product Schema (Main Schema)

### Purpose
Tells Google this is a computer product with specific components, pricing, and availability.

### What Gets Included

#### Basic Information
- **Product Name**: The WooCommerce product title (e.g., "Lizard Z1 Gaming PC")
- **SKU**: Unique product identifier from WooCommerce
- **Category**: "Pre-Built Gaming PC" or specific category name
- **Images**: All product images from WooCommerce

#### Brand & Manufacturer
```javascript
"brand": {
  "@type": "Brand",
  "name": "Lizard"  // Extracted from product heading (first word)
}
```
- **How it works**: Takes the first word from `acf_heading` field
- **Example**: "Lizard Z1" → Brand = "Lizard"
- **Why**: Tells Google this is a branded product, not generic

#### Description (400-600 characters)
Built from multiple ACF fields:
```
Complete [Heading] pre-built gaming PC featuring [GPU], [CPU], [RAM], [Storage], 
[Motherboard], [PSU], [Case]. [Badges]. Optimized for high-performance gaming 
at 1080p and 1440p, AI workloads, machine learning, and content creation. 
1-year warranty. Price: Rs. [Price] in Pakistan.
```

**Why this matters**: Google shows this in search results. It's optimized to include:
- All major components
- Performance capabilities
- Warranty information
- Price and location

---

## 2. Pricing Logic (Offer Schema)

### Two Types of Offers

#### Type A: Regular Price (Single Offer)
Used when product has **one fixed price**:

```javascript
"offers": {
  "@type": "Offer",
  "price": "125000",           // Actual price in PKR
  "priceCurrency": "PKR",
  "priceValidUntil": "2027-12-31",
  "availability": "https://schema.org/InStock",
  "itemCondition": "https://schema.org/NewCondition"
}
```

**When used**: 
- Regular products
- Sale products with one discounted price
- Products with `tagType !== "shift"`

#### Type B: Price Range (Aggregate Offer)
Used when product has **flexible/configurable pricing**:

```javascript
"offers": {
  "@type": "AggregateOffer",
  "lowPrice": "120000",        // Minimum price
  "highPrice": "150000",       // Maximum price
  "priceCurrency": "PKR",
  "offerCount": "1"
}
```

**When used**:
- Products with `tagType === "shift"`
- Configurable builds with multiple price points
- "Starting from" pricing

### Additional Offer Details

#### Shipping Information
```javascript
"shippingDetails": {
  "shippingRate": {
    "value": "0",              // Free shipping
    "currency": "PKR"
  },
  "deliveryTime": {
    "handlingTime": {
      "minValue": 0,
      "maxValue": 1           // Same or next day handling
    },
    "transitTime": {
      "minValue": 1,
      "maxValue": 4           // 1-4 days delivery
    }
  }
}
```

#### Warranty Promise
```javascript
"warranty": {
  "@type": "WarrantyPromise",
  "durationOfWarranty": {
    "value": 1,                // 1 year
    "unitCode": "ANN"          // Annual unit
  }
}
```

---

## 3. Component Specifications (additionalProperty)

### Purpose
Lists every PC component as structured data so Google can show detailed specs in search.

### What Gets Extracted

From **ACF Custom Fields**:
```javascript
additionalProperties.push({ 
  "@type": "PropertyValue", 
  "name": "Processor", 
  "value": "Intel Core i5-12400F" 
});
```

**Components included**:
1. **Processor** — `acf_processor`
2. **Graphics Card** — `acf_graphics_card`
3. **RAM** — `acf_ram`
4. **Storage** — `acf_storage`
5. **Motherboard** — `acf_motherboard`
6. **Power Supply** — `acf_power_supply`
7. **Case** — `acf_pc_case`
8. **Cooler** — `acf_pc_coolers_fans`

From **WooCommerce Attributes**:
- Any additional visible attributes (e.g., WiFi, RGB, Series)
- Automatically avoids duplicates

**Hardcoded Properties**:
```javascript
{ "name": "Warranty", "value": "1 Year Limited Manufacturer Warranty" }
{ "name": "Condition", "value": "Brand New" }
```

### Why This Matters
Google can show these specs directly in search results:
- "RTX 4060 gaming PC Pakistan"
- "Intel i5 pre-built PC Karachi"
- Filters in Google Shopping

---

## 4. Component Relations (isRelatedTo)

### Purpose
Links the PC to its major components without triggering Google errors.

**Note**: Previously used `hasPart`, but Google flagged it as invalid for computer products.

### What Gets Included
```javascript
"isRelatedTo": [
  { "@type": "Thing", "name": "Intel Core i5-12400F" },
  { "@type": "Thing", "name": "NVIDIA RTX 4060" },
  { "@type": "Thing", "name": "ASUS B660M Motherboard" },
  // ... more components
]
```

**Only includes if present**:
- Processor
- GPU
- Motherboard
- Storage
- RAM
- Cooler

**Why this is useful**:
- Helps Google understand component relationships
- Doesn't trigger validation errors
- Makes PC searchable by individual components

---

## 5. Breadcrumb Schema

### Purpose
Shows Google the page hierarchy for better navigation in search results.

### Structure
```javascript
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "position": 1,
      "name": "Home",
      "item": "https://www.pcwalaonline.com"
    },
    {
      "position": 2,
      "name": "LIZARD SERIES",          // Category name
      "item": "https://www.pcwalaonline.com/category/lizard-series"
    },
    {
      "position": 3,
      "name": "Lizard Z1 Gaming PC",    // Product name
      "item": "https://www.pcwalaonline.com/pre-built-pc/lizard-z1"
    }
  ]
}
```

### How It Works
1. Starts with "Home"
2. Uses **deepest category** from product (last category in array)
3. Ends with product name and URL
4. Shows as clickable breadcrumbs in Google search results

---

## 6. FAQ Schema (Expert Assessment)

### Purpose
Converts expert assessments into FAQ format for Google's rich snippets.

### What Gets Extracted

#### From "Why We Chose" Sections
Extracts 8 possible component explanations:
```javascript
{
  "name": "Why did PC Wala choose [Component] for this build?",
  "acceptedAnswer": {
    "text": "[Cleaned explanation from ACF field]"
  }
}
```

**ACF Fields Used**:
- `why_section_why_we_selected_the_gpu`
- `why_section_why_we_selected_the_cpu`
- `why_section_why_we_selected_the_motherboard`
- `why_section_why_we_selected_the_ram`
- `why_section_why_we_selected_the_storage`
- `why_section_why_we_selected_the_cooler`
- `why_section_why_we_selected_the_psu`
- `why_section_why_we_selected_the_pc_case`

#### From Expert Performance Assessment
Extracts 7 possible gaming/performance FAQs:
```javascript
{
  "name": "What is the expert assessment of this pre-built PC?",
  "acceptedAnswer": {
    "text": "[Content from assessment_summary]"
  }
}
```

**ACF Fields Used**:
- `assessment_summary` → "What is the expert assessment?"
- `competitive_games` → "Can this PC run competitive games?"
- `modern_aaa_games` → "How does this PC perform in modern AAA games?"
- `ray_tracing_reality` → "Can this PC handle ray tracing?"
- `ai_reality` → "Is this PC suitable for AI and machine learning?"
- `can_this_play_every_game_on_ultra` → "Can this PC play every game on ultra?"
- `where_you_should_avoid_ultra_settings` → "Where should you avoid ultra settings?"

### Processing Logic
1. **Strip HTML**: Removes all HTML tags from ACF content
2. **Validate Length**: Only includes answers with 20+ characters
3. **Clean Text**: Trims whitespace and ensures readability
4. **Natural Questions**: Formats as conversational questions

### Example Output
```json
{
  "@type": "Question",
  "name": "Why did PC Wala choose NVIDIA RTX 4060 for this build?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "The RTX 4060 offers excellent 1080p performance with DLSS 3 support. It provides 8GB GDDR6 memory and 121W TDP, making it efficient yet powerful for modern gaming. Perfect balance of price and performance for competitive and AAA gaming at high settings."
  }
}
```

---

## 7. Review Schema (Expert Rating)

### Purpose
Provides an official expert review with a numerical rating for Google to display.

### What Gets Included

#### Rating Value
```javascript
"reviewRating": {
  "@type": "Rating",
  "ratingValue": "8.5",           // From acf_value_rating
  "bestRating": "10"
}
```

**How it's extracted**:
- Takes `acf_value_rating` field
- Removes "/10" suffix if present
- Example: "8.5/10" → "8.5"

#### Review Body (800-1200 characters)
Built from **5 different sections** in this order:

##### Part 1: Assessment Summary
```javascript
const assessmentSummary = getMetaValue("assessment_summary");
```
- Main expert opinion
- Overall assessment of the build

##### Part 2: Value Rating Statement
```javascript
"This build is expert-rated 8.5/10 for overall value and performance."
```
- Automatically generated from rating
- Emphasizes value proposition

##### Part 3: Performance Analysis
Combines multiple performance metrics:
```javascript
// From competitive_games field:
"Competitive gaming: Excellent for Valorant (250-400 FPS) and CS2 (180-300 FPS) at 1080p."

// From modern_aaa_games field:
"AAA gaming: Capable of 65-85 FPS in Cyberpunk 2077 at 1080p with high settings."

// From ray_tracing_reality field:
"Ray tracing: Limited performance; recommended to disable for consistent 60+ FPS."
```

**Smart extraction logic**:
- Detects FPS data in tables
- Extracts key game names and performance
- Summarizes complex data into readable text
- Limits each section to 200 characters

##### Part 4: AI Capabilities
```javascript
const aiReality = getMetaValue("ai_reality");
// "AI Capabilities: Capable of running Stable Diffusion and LLama models for local AI workloads."
```
- Extracted from `ai_reality` field
- Capped at 200 characters

##### Part 5: Component Selection Reasoning
Takes the **top 3 most important** component explanations:
```javascript
"Component selection: RTX 4060 chosen for DLSS 3 support and efficiency. 
i5-12400F provides 6-core performance for modern gaming. 
16GB DDR4 RAM ensures smooth multitasking."
```

**Logic**:
- Extracts from "Why We Chose" fields
- Prioritizes: GPU → CPU → RAM → Others
- Each component limited to 120 characters
- Only includes top 3 to avoid bloat

##### Part 6: Value Badges
```javascript
"Best Value. 1080p Gaming Champion. AI Ready build."
```
- From `acf_badges` field
- Split by commas and joined with periods

### Final Assembly
All parts are combined with spaces:
```javascript
reviewBody = reviewParts.join(' ');

// Ensure length limit
if (reviewBody.length > 1200) {
  reviewBody = reviewBody.slice(0, 1197) + "...";
}
```

### Complete Review Example
```json
{
  "@type": "Review",
  "author": {
    "@type": "Organization",
    "name": "PC Wala Online"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "8.5",
    "bestRating": "10"
  },
  "reviewBody": "This build offers exceptional 1080p gaming performance with future-proof components. This build is expert-rated 8.5/10 for overall value and performance. Competitive gaming performance: Excellent for titles like Valorant (250-400 FPS) and CS2 (180-300 FPS) at 1080p. AAA gaming: Capable of 65-85 FPS in Cyberpunk 2077 and 50-65 FPS in Black Myth Wukong at 1080p with high settings. Ray tracing: Limited performance; disable for consistent 60+ FPS. AI Capabilities: Capable of running Stable Diffusion models and local LLMs for AI workloads. Component selection: RTX 4060 chosen for DLSS 3 support. i5-12400F provides excellent 6-core performance. 16GB DDR4 ensures smooth gaming. Best Value. 1080p Gaming Champion. AI Ready build.",
  "datePublished": "2026-07-02"
}
```

---

## 8. Metadata (SEO Title & Description)

### Meta Title Logic (55-64 characters)

#### Option 1: With Heading (Preferred)
```
[Heading]: [GPU Short] [CPU Short] PC Price Pakistan | PC Wala
```
**Example**: `Lizard Z1: RTX 4060 i5-12400F PC Price Pakistan | PC Wala`

#### Option 2: Without Heading (If too long)
```
[GPU Short] [CPU Short] Pre-Built PC Price Pakistan | PC Wala
```

#### Fallback
```
[Product Name] Price in Pakistan | PC Wala
```

**GPU/CPU Shortening Logic**:
```javascript
// GPU: Remove brand details in parentheses
"NVIDIA RTX 4060 (Gigabyte Gaming)" → "NVIDIA RTX 4060"

// CPU: Remove brand prefix and parentheses
"Intel Core i5-12400F (6 Core)" → "i5-12400F"
"AMD Ryzen 5 5600X" → "R5 5600X"
```

**Length Control**:
- Target: 55-64 characters
- Hard limit: 64 characters (truncated with "...")
- Keeps within Google's display limit

### Meta Description Logic (155-160 characters)

#### With Heading
```
Buy the [Heading] [GPU] and [CPU] gaming and AI PC in Pakistan. 
Expert-rated for 1080p gaming, AI workloads, and content creation.
```

#### Without Heading
```
Buy [GPU] and [CPU] gaming and AI PC in Pakistan. 
Expert-rated for 1080p gaming, AI workloads, and content creation.
```

#### Fallback
```
Buy [Product Name] gaming PC in Pakistan. 
Expert-rated for performance and value. 
Price: Rs. [Price]. PC Wala Online.
```

**Length Control**:
- Target: 155-160 characters
- Hard limit: 160 characters (truncated with "...")
- Includes key terms: gaming, AI, Pakistan, expert-rated

---

## 9. Data Extraction Functions

### getMetaValue() Function
```javascript
const getMetaValue = (key: string) => {
  const found = product.meta_data?.find((m) => m.key === key);
  return found ? String(found.value).trim() : "";
};
```

**What it does**:
1. Searches WooCommerce `meta_data` array
2. Finds entry with matching ACF key
3. Returns value as trimmed string
4. Returns empty string if not found

**Usage**:
```javascript
const processor = getMetaValue("acf_processor");
// Returns: "Intel Core i5-12400F"
```

### stripHtml() Function
```javascript
import { stripHtml } from "@/lib/utils";
```

**What it does**:
1. Removes all HTML tags from ACF content
2. Decodes HTML entities (&amp; → &)
3. Cleans whitespace
4. Returns plain text

**Usage**:
```javascript
const rawContent = "<p>This PC is <strong>excellent</strong> for gaming.</p>";
const cleanText = stripHtml(rawContent);
// Returns: "This PC is excellent for gaming."
```

### getPriceTagInfo() Function
```javascript
import { getPriceTagInfo } from "@/lib/utils";
```

**What it does**:
1. Analyzes product pricing structure
2. Determines tag type (regular/sale/shift)
3. Returns display price and range

**Returns**:
```javascript
{
  tagType: "regular" | "sale" | "shift",
  displayPrice: "125000",
  priceMin: "120000",      // For shift pricing
  priceMax: "150000",      // For shift pricing
  tagText: "BEST VALUE"    // Optional badge
}
```

---

## 10. Schema Validation & Best Practices

### What Google Checks

#### Required Fields (Must Have)
- ✅ Product name
- ✅ Image URL
- ✅ Offer with price
- ✅ Availability status

#### Recommended Fields (Should Have)
- ✅ Brand
- ✅ SKU
- ✅ Description
- ✅ Review/Rating
- ✅ AggregateRating (if available)

#### Optional but Beneficial
- ✅ additionalProperty (specifications)
- ✅ isRelatedTo (component links)
- ✅ FAQ
- ✅ Breadcrumb

### Common Issues Avoided

#### ❌ Using hasPart for Components
**Wrong**:
```javascript
"hasPart": [
  { "@type": "Product", "name": "RTX 4060" }  // Error: Invalid for computers
]
```

**✅ Correct**:
```javascript
"isRelatedTo": [
  { "@type": "Thing", "name": "RTX 4060" }    // Valid relationship
]
```

#### ❌ Missing Price Currency
**Wrong**:
```javascript
"price": "125000"  // What currency?
```

**✅ Correct**:
```javascript
"price": "125000",
"priceCurrency": "PKR"
```

#### ❌ HTML in Schema Text
**Wrong**:
```javascript
"description": "<p>Great gaming PC</p>"  // Invalid HTML
```

**✅ Correct**:
```javascript
"description": stripHtml("<p>Great gaming PC</p>")  // Plain text
```

---

## 11. Schema Injection (How It's Added to Page)

### Implementation
```javascript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
/>
```

**What happens**:
1. Schema objects are converted to JSON strings
2. Injected as `<script type="application/ld+json">` tags in page `<head>`
3. Google's crawler reads and parses the structured data
4. Used for rich snippets in search results

### Multiple Schemas on One Page
```javascript
<>
  {/* Product Schema */}
  <script type="application/ld+json">...</script>
  
  {/* Breadcrumb Schema */}
  <script type="application/ld+json">...</script>
  
  {/* FAQ Schema (if exists) */}
  {faqSchema && <script type="application/ld+json">...</script>}
  
  {/* Review Schema (if exists) */}
  {reviewSchema && <script type="application/ld+json">...</script>}
</>
```

**Why multiple schemas**:
- Each schema serves a different search feature
- Google combines them for maximum rich snippet coverage
- Breadcrumbs + Product + FAQ = Enhanced search listing

---

## 12. Testing & Validation

### Google Rich Results Test
URL: https://search.google.com/test/rich-results

**What to check**:
- ✅ All schemas detected
- ✅ No errors or warnings
- ✅ Preview shows product details correctly
- ✅ Price displays in PKR
- ✅ Breadcrumbs render properly

### Schema Markup Validator
URL: https://validator.schema.org/

**What to check**:
- ✅ Valid JSON-LD syntax
- ✅ All @type values are correct
- ✅ Required properties present
- ✅ No deprecated fields

---

## 13. Impact on SEO

### Search Features Enabled

#### Product Rich Snippets
Shows in Google search:
- ✅ Product image
- ✅ Price in PKR
- ✅ Star rating
- ✅ Availability status
- ✅ Brand name

#### FAQ Rich Snippets
Shows expandable Q&A:
- ✅ "Why did PC Wala choose..."
- ✅ "Can this PC run..."
- ✅ Click to expand answers

#### Breadcrumb Navigation
Shows in search URL:
```
Home > Pre-Built PCs > Lizard Series > Lizard Z1
```

#### Google Shopping
Enables product listing with:
- ✅ Component specifications
- ✅ Shipping details
- ✅ Warranty information
- ✅ Price comparison

---

## 14. Summary Checklist

### For Each Pre-Built PC Page, We Generate:

- [x] **Product Schema** with 8+ component specifications
- [x] **Price Schema** (single or range based on product type)
- [x] **Shipping & Warranty** details
- [x] **Breadcrumb Schema** for navigation
- [x] **FAQ Schema** from expert assessments (up to 15 questions)
- [x] **Review Schema** with 0-10 rating
- [x] **SEO Metadata** optimized for 55-64 char titles
- [x] **Component Relations** using isRelatedTo
- [x] **Brand Extraction** from product heading
- [x] **Comprehensive Description** (400-600 chars)

### Total Schema Count Per Page: **4 Schemas**
1. Product (with offers, specs, components)
2. Breadcrumb
3. FAQ (if ACF data exists)
4. Review (if rating exists)

---

## 15. Future Improvements

### Potential Enhancements

#### AggregateRating
```javascript
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "127"
}
```
**Benefit**: Shows star rating in Google search results

**Requirement**: Need to collect customer reviews

#### Video Schema
```javascript
"video": {
  "@type": "VideoObject",
  "name": "Lizard Z1 Unboxing & Review",
  "thumbnailUrl": "...",
  "uploadDate": "2026-06-01"
}
```
**Benefit**: Video thumbnails in search results

**Requirement**: Create product review videos

#### How-To Schema
```javascript
"@type": "HowTo",
"name": "How to Set Up Your Lizard Z1 Gaming PC",
"step": [...]
```
**Benefit**: Step-by-step setup guide in search

**Requirement**: Write setup guides for each series

---

## Questions or Need Changes?

This schema system is fully automated and pulls from WooCommerce ACF fields. If you need to:

- Add new component types → Update `additionalProperties` section
- Change FAQ questions → Modify `whyFields` or `expertFields` arrays
- Adjust review length → Change `reviewBody` character limits
- Add new schema types → Create new schema object and inject with `<script>`

**Contact**: Your development team for implementation changes.
