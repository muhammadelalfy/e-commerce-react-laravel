# أوفرز · Offers

A bilingual (Arabic-first, RTL/LTR), multi-vendor **offers & discounts marketplace** built with **Next.js 14**, **React 18**, **TypeScript**, and **GSAP** for animation.

## Features
- 🛍️ 15 full views: Home/Discounts, Category catalog, Vendor storefront, Auctions, Dashboard, Admin, Auth, Add-Store, Reels, Events, Stores Map, Favourites, Notifications, and info pages.
- 🌐 Fully bilingual (AR/EN) with complete RTL/LTR mirroring.
- 🌗 Light & dark themes, persisted to `localStorage`.
- ✨ GSAP-driven animation (hero motion, infinite offers ticker, scroll reveals).
- ⚡ Client-side SPA routing, backend-ready typed data layer.

## Getting started
```bash
npm install
npm run dev
# open http://localhost:3200
```

## Build
```bash
npm run build
npm start
```

## Project structure
```
app/          Next.js App Router (layout, page, globals.css design tokens)
components/   App shell, page views, shared UI primitives
lib/          data.ts (bilingual data), AppContext, gsap.ts (animation hooks)
public/img/   product & category imagery
docs/         SRS, project report, components report (Arabic RTL + English)
```

## Tech
Next.js 14 · React 18 · TypeScript 5 · GSAP 3 (+ ScrollTrigger)

## Documentation
See the `docs/` folder for the SRS, the phase-one project report, and the full components report (available in Arabic RTL and English).
