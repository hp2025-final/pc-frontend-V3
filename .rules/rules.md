# PC Wala V3 — Core Rules

## R1 · Explore Before Coding

* Read existing files before making changes.
* Check for existing components, utilities, styles, and types.
* Reuse existing code whenever possible.

---

## R2 · Reuse Existing Logic

* Never duplicate utilities, API functions, components, or business logic.
* Extend existing implementations instead of copying code.

---

## R3 · WhatsApp-Only Commerce

* Cart, checkout, payment gateways, and order systems are prohibited.
* All purchase actions must use `generateWhatsAppLink()`.
* WhatsApp number must come from environment variables.

---

## R4 · Design System Lock

* Only approved colors may be used.
* Only approved fonts may be used.
* Border radius is always 0 except status indicators.
* Use CSS variables only.

---

## R5 · CSS Modules Only

* Every component must have its own CSS Module.
* No Tailwind, Bootstrap, or utility CSS frameworks.
* No global styles outside `globals.css`.
* No inline styles except for dynamic calculated values.
* Page-level CSS must be scoped with a unique wrapper.

---

## R6 · TypeScript Strict

* No `any`.
* Shared types belong in `lib/types.ts`.
* Respect TypeScript strict mode.

---

## R7 · Server Components First

* Use Server Components by default.
* Add `"use client"` only when browser APIs, state, effects, or event handlers are required.

---

## R8 · Centralized API Layer

* All WooCommerce API access must go through `lib/woocommerce.ts`.
* Raw fetch calls outside this file are prohibited.
* All API requests must use ISR caching.

---

## R9 · Environment Variables Only

* Never hardcode URLs, credentials, IDs, phone numbers, or secrets.
* Use environment variables exclusively.

---

## R10 · Mobile-First Development

* Mobile styles are the default.
* Desktop enhancements use media queries.
* Product grids must remain two columns on mobile.

---

## R11 · Minimal Documentation

* Create documentation only when necessary.
* Use comments and JSDoc for routine code explanations.

---

## R12 · Dependency Control

* Do not add new packages without approval.
* Prefer native APIs and existing project dependencies.

---

## R13 · Next.js Image Standard

* Use `next/image` for all images.
* Always provide proper sizing and alt text.

---

## R14 · Cart Functionality Prohibited

* Cart-related features are permanently banned.
* Only WhatsApp ordering is allowed.

---

## R15 · Component + CSS Pairing

* Every component must have a matching CSS Module file.
* Component and CSS filenames must match.

---

## R16 · Centralized Pricing Logic

* All pricing calculations must come from `getPriceTagInfo()`.
* Pricing logic must never be duplicated.

---

## R17 · Official Product Card

* Use `PCD_2` exclusively.
* Deprecated product card components must not be used.

---

## R18 · Layout System

* Use the approved 12-column grid architecture.
* Maintain required mobile and desktop layout behavior.

---

## R19 · ISR Required

* All WooCommerce data fetching must use ISR.
* Follow approved revalidation intervals.

---

## R20 · Git Workflow

* Never push directly to main.
* Always use feature branches.
* Use descriptive commit messages.

---

## R21 · Rule Conflict Check

* If a request conflicts with Rules or AGENTS.md, stop and notify before making changes.

---

## Priority Order

1. rules.md
2. AGENTS.md
3. Existing project patterns
4. User request

If a user request conflicts with Rules or AGENTS.md, explain the conflict before proceeding.
