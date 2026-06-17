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
import { generateWhatsAppLink } from "@/lib/utils";
const link = generateWhatsAppLink(product);
// → https://wa.me/+923423355119?text=Hello+PC+Wala...
```

- ❌ Never add `addToCart`, `checkout`, `payment`, `order form`, `Stripe`, `PayFast`
- ✅ Always wire CTAs to `generateWhatsAppLink(product)`
- WA number lives in `process.env.NEXT_PUBLIC_WA_NUMBER` — never hardcode it

---

## 📚 DETAILED DOCS (load only what's relevant to your task)

| File | Load when working on... |
|------|------------------------|
| `docs/design-system.md` | Any UI, CSS, layout, or component styling |
| `docs/components.md` | PCD_2, HeroSlider, BannerProductSection, CategoryControls |
| `docs/pricing.md` | Any pricing display, tags, PCD_2 footer, WhatsApp messages |
| `docs/pages.md` | Homepage, Category, Brand, Search, Product pages |
| `docs/api-data.md` | WooCommerce API, `lib/woocommerce.ts`, data fetching, ISR |
| `docs/utils-types.md` | `lib/utils.ts`, `lib/types.ts`, TypeScript interfaces |

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
| Duplicate utility functions | Check `lib/utils.ts` first |
| Use `font-family: sans-serif` | Use `'IBM Plex Sans'` or the defined stack |
| Use ProductCard.tsx | Use PCD_2.tsx (ProductCard is deprecated) |

---

## 🏁 SESSION START CHECKLIST

1. **Which files are relevant to this task?** → Read them.
2. **Does a component/utility already exist for this?** → Reuse it.
3. **What CSS class patterns does the nearest similar component use?** → Match them.
4. **Am I about to add anything that conflicts with the design system?** → Don't.
5. **Does this require a new dependency?** → Ask first.
6. **What's the mobile layout?** → Write mobile-first CSS.
7. **Is this a product display?** → 2-col mobile minimum, use PCD_2, WhatsApp CTA.
8. **Is this fetching WooCommerce data?** → Use `lib/woocommerce.ts` + ISR cache.

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

## 📄 When to Create .md Files

**Create a `.md` file ONLY when:**
- The integration spans 4+ files and has non-obvious setup steps
- You are documenting a third-party service setup (new API, webhook config)
- You are leaving notes for a multi-session complex feature

**Do NOT create `.md` files for:** Individual components, simple utilities, routine pages, minor style changes.