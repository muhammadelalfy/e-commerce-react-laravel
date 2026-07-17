# Software Requirements Specification (SRS)
## مشهور · Mashhoor — Multi-Vendor Offers & Discounts Marketplace

**Version:** 1.0
**Date:** 2026-07-14
**Prepared for:** Mashhoor (مشهور / عروض)
**Platform:** Web application (Next.js 14, React 18, TypeScript, GSAP)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for **Mashhoor**, an Arabic-first (RTL), bilingual multi-vendor e-commerce marketplace focused on **live discounts, auctions, and store discovery** across cities of the Kingdom of Saudi Arabia. It defines the functional and non-functional requirements of the current web implementation.

### 1.2 Scope
Mashhoor is a marketplace that aggregates shops and centers offering active discounts, presented by location and category. It has four core pillars:
1. **Mashhoor Discounts (خصومات مشهور)** — stores with live, time-limited offers.
2. **Mashhoor Auctions (مزادات مشهور)** — live bidding on curated items.
3. **Shop with Mashhoor (تسوّق مع مشهور)** — browse/buy from stores.
4. **Other Services (خدمات أخرى)** — reels, events, store map, and vendor tooling.

The system serves three roles: **Customers**, **Vendors (store owners)**, and **Administrators**.

### 1.3 Definitions & Abbreviations
| Term | Meaning |
|---|---|
| RTL / LTR | Right-to-left (Arabic) / left-to-right (English) text direction |
| Vendor / Tenant | A store owner operating within the multi-vendor marketplace |
| Active offer | A discount currently within its validity window (shown in the brand accent) |
| SPA | Single-page application |
| i18n | Internationalization (AR/EN) |

### 1.4 Overview
Sections 2–5 describe the product perspective, functional requirements per module, external interfaces, and non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective
A client-rendered SPA built on the Next.js App Router. State (language, theme, navigation, favourites) is held in a React context; navigation is an in-app page router mirroring the source design, preserving exact behavior and instant transitions. All content is bilingual and fully mirrored for RTL/LTR.

### 2.2 User Roles
- **Customer** — browses discounts, categories, vendors; bids in auctions; saves favourites; views reels/events/map; checks out.
- **Vendor** — manages a store dashboard: products, discounts, coupons, orders, subscription, settings; submits activities for approval.
- **Administrator** — oversees users, vendors, product approvals, cities, ads/events, reels moderation, subscriptions, and app content.

### 2.3 Operating Environment
- Any modern evergreen browser (Chrome, Edge, Safari, Firefox).
- Responsive down to mobile widths; primary design target is desktop and tablet.
- No backend is required for the current build (data is served from a typed in-app data module); the architecture is API-ready.

### 2.4 Design & Implementation Constraints
- **Arabic-first**: default language is Arabic, default direction RTL.
- **Bilingual parity**: every string exists in both AR and EN.
- **Theming**: light and dark themes via CSS custom properties; persisted in `localStorage`.
- **Animation**: GSAP (GreenSock) drives all motion (hero, ticker, scroll reveals, offers graphic).
- **Numerals**: Latin numerals are isolated (`.num`) so they render LTR inside RTL text.

### 2.5 Assumptions & Dependencies
- Product/category imagery is provided as brand assets (imported from the Figma "Store mobile app" file).
- Payments, real auth, and persistence are represented in the UI and are integration points for a future backend.

---

## 3. Functional Requirements

### FR-1 Global Shell
- **FR-1.1** Top bar with phone, promo message, city, and a language toggle.
- **FR-1.2** Sticky header with logo, primary nav, product/store search, theme toggle, notifications dropdown, favourites, and account.
- **FR-1.3** Footer with grouped links (Mashhoor, For vendors, Help, Company) and payment badges.
- **FR-1.4** Language toggle switches all content AR⇄EN and flips direction RTL⇄LTR.
- **FR-1.5** Theme toggle switches light⇄dark; both preferences persist across sessions.

### FR-2 Home / Discounts
- **FR-2.1** Auto-rotating hero slider (4 category slides) with manual prev/next and dot navigation; pauses on hover.
- **FR-2.2** Horizontal "hot offers" ticker, seamless infinite scroll, pauses on hover.
- **FR-2.3** Quick filters (last chance, offers, 50%+, new) that filter the deals grid.
- **FR-2.4** Popular categories (circular) and "shop by category" photo tiles.
- **FR-2.5** Deals grid with category chips + sort (featured/price/rating/discount) and live search.
- **FR-2.6** Featured vendors grid.

### FR-3 Category Catalog
- **FR-3.1** Category hero (breadcrumb, title, item count, product photo).
- **FR-3.2** Filter sidebar: category (in "all" mode), price range, rating, vendor, active-only.
- **FR-3.3** Sortable, filterable product grid; empty state; "browse other categories".

### FR-4 Vendor Storefront
- **FR-4.1** Vendor banner, logo, verified badge, rating, followers, city, join year, about.
- **FR-4.2** Grid of the vendor's products.

### FR-5 Auctions
- **FR-5.1** Featured live auction with current bid and live countdown.
- **FR-5.2** Auction grid; each card shows current bid, bid count, and per-item countdown.
- **FR-5.3** "Place bid" increments the current bid and marks the user's bid; ended auctions are disabled.

### FR-6 Product Card (shared)
- Shows image, discount banner (active/expired), name, price + strikethrough original, vendor, rating, and a favourite toggle.

### FR-7 Reels
- **FR-7.1** Vertical (9:16) reel tiles with play affordance, view count, vendor, caption, like toggle, and pending-approval badge.

### FR-8 Events & Ads
- **FR-8.1** Alternating event cards with image, date, city, description, live badge, and CTA.

### FR-9 Stores Map
- **FR-9.1** City selector, city store list with distance, and an interactive pin map with per-city store counts.

### FR-10 Favourites
- **FR-10.1** Grid of favourited products; empty state with CTA; badge count in header.

### FR-11 Notifications
- **FR-11.1** Header dropdown (recent + unread count) and a full page with tabs (all/unread/vendors/customers) and "mark all read".

### FR-12 Authentication (UI)
- **FR-12.1** Combined customer/vendor sign-in & register with segmented audience switch, mode tabs, forgot-password flow, social/Nafath options, and role-based routing on submit.

### FR-13 Add Store (Vendor Onboarding)
- **FR-13.1** Marketing hero + registration form (store, type, city, owner, contact, password, terms) leading to a success/approval-pending state.

### FR-14 Vendor Dashboard
- **FR-14.1** Sidebar navigation across Overview, Products, Discounts, Coupons, Orders, Subscription, Settings.
- **FR-14.2** Overview stats (live visitor counter, sales, active discounts, orders).
- **FR-14.3** Products/discounts table with activate/pause toggles and pending state.
- **FR-14.4** Coupons panel (usage progress, active toggle), Orders table, Subscription plans, Settings form.
- **FR-14.5** "Add new activity" modal (name, type, discount %, duration, links, media) — submitted items enter pending approval.

### FR-15 Admin Backoffice
- **FR-15.1** Overview (KPIs, monthly sales chart, top categories).
- **FR-15.2** Users & vendors table; Vendors grid; Product approvals (approve/reject).
- **FR-15.3** Cities, Ads/Events, Reels moderation, Subscriptions, App content management.

### FR-16 Informational Pages
- About, Pricing, FAQ (accordion), Contact (form with sent state), Careers, Blog, and Legal (Terms, Privacy, Shipping, Returns).

---

## 4. External Interface Requirements

### 4.1 User Interface
- Design system with defined tokens: brand coral/red, gold highlights, navy ink; radius, shadow, and typography scales.
- Fonts: Cairo / Tajawal / Noto Sans Arabic (Arabic), Inter (Latin).
- Fully responsive layouts; RTL/LTR mirrored via logical CSS properties.

### 4.2 Software Interfaces
- **Framework:** Next.js 14 (App Router), React 18, TypeScript 5.
- **Animation:** GSAP 3 + ScrollTrigger.
- **Data:** typed module (`lib/data.ts`) — replaceable by a REST/GraphQL backend without UI changes.

### 4.3 Hardware Interfaces
- None specific; standard web client.

---

## 5. Non-Functional Requirements

| # | Requirement |
|---|---|
| NFR-1 **Localization** | Full AR/EN parity; RTL-correct layout; digit isolation. |
| NFR-2 **Theming** | Light/dark, persisted, no flash of wrong theme (pre-paint script). |
| NFR-3 **Performance** | Client-rendered SPA navigation; lazy-loaded images; ~500-module dev build compiles in seconds. |
| NFR-4 **Accessibility** | Semantic landmarks, `aria-hidden` on decorative motion, `prefers-reduced-motion` disables animation, keyboard-focusable controls. |
| NFR-5 **Maintainability** | Strict TypeScript, component-per-page structure, `@/` path aliases, design tokens centralized. |
| NFR-6 **Reliability** | Type-checked build (0 errors); no runtime/console errors; no hydration mismatches. |
| NFR-7 **Portability** | Runs on any Node 18+ host; static assets under `public/`. |
| NFR-8 **Security (future)** | Auth/payments are UI stubs; real credential handling must occur server-side. |

---

## 6. Future Enhancements (Out of Current Scope)
- Real backend (auth, catalog, orders, payments, real-time auctions via WebSocket).
- Push notifications (FCM) — UI already models the notification types.
- Persistent cart & checkout flow with a payment provider (mada/Apple Pay/Visa).
- Server-side rendering of catalog pages for SEO.
