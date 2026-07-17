# Components Report — أوفرز · Offers
### Detailed documentation of every component built in the website

**Project:** أوفرز · Offers marketplace (Next.js 14 · React 18 · TypeScript · GSAP)
**Scope:** every UI component — navigation bar, sidebars, footer, shared primitives, and all page views — with a description of what each does.

---

## 0. Application shell & routing

### `App` — `components/App.tsx`
The root client component and the heart of the app. It holds all global state and acts as the single-page-application (SPA) router.
- **State it owns:** `lang` (ar/en, Arabic default), `theme` (light/dark), `page` + `param` (current view), `favs` (favourite product IDs), `query` (search text).
- **Persistence:** writes `lang` and `theme` to `localStorage`; on mount it re-reads them, and applies `dir`/`lang`/`data-theme` to the `<html>` element.
- **Router:** a `go(page, id)` function switches the active view and scrolls to top. A large `if/else` chain maps a page key → the matching page component (e.g. `"vendor"` → `<Vendor>`, `"auctions"` → `<Auctions>`).
- **Provides context:** wraps everything in `AppCtx.Provider` so any component can read `t` (strings), `lang`, `theme`, `go`, `favs`, `toggleFav`, `toggleLang`, `toggleTheme`.
- **Renders:** `<TopBar>` → `<Header>` → `<main>{active page}` → `<Footer>`.

### App context — `lib/AppContext.tsx`
`AppCtx` React context + `useApp()` hook. Every component pulls language, theme, navigation, and favourites through `useApp()` instead of prop-drilling.

### Data layer — `lib/data.ts`
Typed, bilingual data module: interface strings (`STR.ar` / `STR.en`), categories, vendors, products, auctions, notifications, reels, events, coupons, cities, plans, and the `money()` formatter. It is backend-ready — swapping it for an API leaves the UI untouched.

### GSAP animation hooks — `lib/gsap.ts`
Reusable animation hooks (replace the original CSS keyframes):
- **`useReveal`** — staggered fade/rise of a container's children on scroll (ScrollTrigger).
- **`useFadeUp`** — single-element fade-up on scroll entry.
- **`useMarquee`** — seamless infinite horizontal scroll; pauses on hover.
- **`useOffersMotion`** — the hero offers graphic: rotating rings, pulsing badge, drifting tags, twinkling sparkles.
- All respect `prefers-reduced-motion`.

---

## 1. Navigation bar (top)

The top of every page is built from two stacked bars.

### `TopBar` — `components/Shell.tsx`
The thin promo strip above the main header (navy background).
- **Left:** phone number with a phone icon.
- **Center:** the rotating promo message (e.g. "خصم حتى ٥٠٪…").
- **Right:** a **language toggle** button (globe icon → switches AR⇄EN) and the current city.

### `Header` — `components/Shell.tsx`
The main sticky navigation bar. Shrinks and gains a blurred translucent background on scroll.
- **`Logo`** — the أوفرز brand mark (icon SVG) + the "أوفرز" wordmark; clicking it returns home.
- **Primary nav links:** خصومات أوفرز (home) · مزادات أوفرز (auctions) · تسوّق مع أوفرز (shop) · ريلز (reels) · الفعاليات (events) · خريطة المتاجر (map). The active link is highlighted in the brand color.
- **Search box:** live product/store search that filters the home deals grid.
- **Theme toggle:** sun/moon icon → switches light⇄dark.
- **Notifications button:** bell icon with an unread-count badge; opens the `NotifDropdown`.
- **Favourites button:** heart icon with a saved-count badge → opens the Favourites page.
- **Account button:** user icon → opens Auth.

### `NotifDropdown` — `components/Shell.tsx`
The panel that drops from the bell icon. Lists the 5 most recent notifications (type icon, text, time, unread dot), shows an unread count, and a "view all notifications" link to the full Notifications page.

### `Logo` — `components/Shell.tsx`
Horizontal brand lockup: the أوفرز bag-and-percent icon (`/logo-icon.svg`) next to the styled "أوفرز" wordmark. Reused in the header, footer, and the auth brand panel.

---

## 2. Sidebars

The site uses three distinct sidebars, each a filter/navigation column sticky to the top on scroll.

### Category filter sidebar — inside `CategoryPage` (`components/pages/Catalog.tsx`)
The left column on any category/shop page. Contains:
- **Category radio list** (only in "all"/shop mode) — via the `VOpt` sub-component (a custom radio row).
- **Price range slider** (0–1000 ﷼).
- **Rating filter** — options for All / 3+ / 4+ / 4.5+ with star previews.
- **Vendor radio list** — filter by store.
- **"Active offers only" checkbox.**
All filters update the product grid instantly.

### Vendor Dashboard sidebar — inside `Dashboard` (`components/pages/Dashboard.tsx`)
The store owner's navigation column:
- **Store identity block** (store logo tile + name + "بائع" role).
- **Nav buttons:** نظرة عامة · المنتجات · الخصومات · الكوبونات · الطلبات · الاشتراك · الإعدادات — the active tab is highlighted.
- **"View store" button** at the bottom → jumps to the public home.

### Admin sidebar — inside `Admin` (`components/pages/Admin.tsx`)
The administrator's navigation column:
- **Admin identity block** (shield icon + "إدارة أوفرز").
- **Nav buttons:** نظرة عامة · المستخدمون · المتاجر · موافقة المنتجات · المدن · الإعلانات · الريلز · الاشتراكات · محتوى التطبيق.
- **"Exit" button** at the bottom.

---

## 3. Footer

### `Footer` — `components/Shell.tsx`
The site-wide footer, present on every page.
- **Brand column:** the `Logo` + tagline ("وجهتك للعروض والخصومات. سوق متعدد المتاجر.").
- **Four link groups** (bilingual, RTL-aware):
  - **أوفرز:** عن أوفرز · خصومات أوفرز · مزادات أوفرز · ريلز · الفعاليات · خريطة المتاجر
  - **للبائعين:** أضف متجرك · لوحة التحكم · الأسعار · الدعم
  - **المساعدة:** الشحن والتوصيل · الإرجاع والاستبدال · الأسئلة الشائعة · تواصل معنا
  - **الشركة:** الشروط والأحكام · سياسة الخصوصية · المدونة · لوحة الإدارة
  - Every link routes through `go()` to the correct page (links hover to the brand color).
- **Bottom bar:** copyright line + payment badges (Visa · Mastercard · mada · Apple Pay).

---

## 4. Shared UI primitives — `components/ui.tsx`

Small building blocks reused across the entire app.

| Component | Description |
|---|---|
| **`Icon`** | Inline SVG icon set (~60 icons on a 24-grid: search, cart, heart, star, store, gavel, tag, bell, etc.). Stroke width, size, and fill are props. |
| **`Stars`** | Star rating display (0–5 filled) with an optional review count. |
| **`Btn`** | Button with 4 variants (primary / outline / soft / ghost) and 3 sizes (sm / md / lg); brightness-dims on hover. |
| **`Thumb`** | Product thumbnail — shows the real photo, or a tinted gradient + category glyph as a fallback when no image. |
| **`Chip`** | Pill toggle used for category filters (active/inactive states). |
| **`money()`** | Formats a number into localized currency (`﷼` for AR, `SAR` for EN). |

---

## 5. Page views (main content area)

### 5.1 Home / Discounts — `components/pages/Home.tsx`
The landing page (`Home`), composed of many sub-components:
- **`HeroSlider`** — auto-rotating hero (4 category slides) with prev/next arrows and dot indicators; each slide shows a product photo in a crisp white card + headline + CTA. Pauses on hover.
- **`OffersTicker`** — the "عروض ساخنة" (hot offers) horizontal marquee; scrolls seamlessly and pauses on hover (GSAP `useMarquee`).
- **`QuickFilters`** — quick filter chips (آخر فرص / عروض / ٥٠٪ وأكثر / الجديد) that scroll to and filter the deals grid.
- **Popular categories** — 8 circular category buttons.
- **`CategoryBanners`** — "تسوّق حسب القسم" grid of 6 photo tiles (GSAP scroll reveal).
- **Deals grid** — category chips + sort dropdown + the filtered product grid (uses `ProductCard`).
- **Featured vendors** — grid of `VendorCard`s.
- **`SectionHead`** — reusable section title with a gold underline + optional "view all" link.
- **`OffersMotion`** — the animated offers badge graphic (GSAP `useOffersMotion`).

### 5.2 `ProductCard` — `components/Shell.tsx`
The core product tile used everywhere (home, category, vendor, favourites). Shows the photo, a **discount banner** (active = red "save X% · Y days left", expired = grey), the name, the price with a struck-through original, the vendor chip, a star rating, and a **favourite heart toggle**. Clicking the card opens the vendor.

### 5.3 `VendorCard` — `components/pages/Home.tsx`
A store card: banner image + store logo tile + name + rating + follower count. Lifts on hover; opens the vendor storefront.

### 5.4 Category Catalog — `components/pages/Catalog.tsx`
- **`CategoryPage`** — category hero (breadcrumb, title, item count, floating product photo) + the **filter sidebar** (section 2) + a sortable/filterable product grid + a "browse other categories" strip. Also serves the "Shop" view (`id="all"`).
- **`VOpt`** — a custom radio-button row used by the sidebar filters.
- **`Vendor`** — the storefront: colored banner, store logo, verified badge, rating/followers/city/join-year, an "about" blurb, and the vendor's product grid.

### 5.5 Auctions — `components/pages/Auctions.tsx`
- **`Auctions`** — featured live auction (current bid + live countdown + "place bid") and a grid of auction cards, each with a per-item **live countdown**, bid count, current bid, and a bid button (disabled when ended).
- **`Countdown` / `CountdownLight`** — the ticking H:M:S timers (dark-text and white variants).

### 5.6 Vendor Dashboard — `components/pages/Dashboard.tsx`
The store owner's control panel: **sidebar** (section 2) + a tabbed main area.
- **`StatCard`** — a KPI tile (icon, big value, label, delta) — used for the overview stats (live visitor counter, sales, active discounts, orders).
- **Products/discounts table** — each row has a thumbnail, price, discount %, status, and a **`Toggle`** (activate/pause) switch.
- **`OrdersPanel`** — the store's orders table with colored status pills.
- **`CouponsPanel`** — coupon cards with a usage progress bar and active toggle.
- **`SubscriptionPanel`** — the 3 plan cards (current plan highlighted).
- **`SettingsPanel`** — the store settings form.
- **`AddActivityModal`** — the "add new activity" popup (name, type, discount %, duration, links, media) using `DField` field rows; submitted items enter "pending approval".
- **`Toggle`** — the on/off switch used for discounts and coupons.

### 5.7 Admin Backoffice — `components/pages/Admin.tsx`
The administrator area: **sidebar** (section 2) + 9 panels.
- **`AdminOverview`** — KPI cards + a monthly sales bar chart + top-categories bars.
- **`AdminApproval`** — product approval queue (approve ✓ / reject ✕ per row).
- **`AdminUsers`** — users & vendors table with role and status.
- **`AdminVendors`** — vendor cards grid.
- **`AdminCities`** — cities grid with store counts.
- **`AdminAds`** — ads/events list with live badges.
- **`AdminReels`** — reels moderation grid (approve/reject).
- **`AdminSubs`** — subscriptions table.
- **`AdminContent`** — app content pages (edit links).
- **`Head`** — the shared panel title bar with an optional action button.

### 5.8 Discovery pages — `components/pages/Features.tsx`
- **`Notifications`** — full notifications page with filter tabs (all / unread / vendors / customers) and "mark all read".
- **`Reels`** — 9:16 vertical reel tiles (play icon, view count, vendor, caption, like toggle, pending badge) — GSAP scroll reveal.
- **`Events`** — alternating event cards (image, date, city, description, live badge, CTA).
- **`StoresMap`** — city selector + city store list (with distance) + an interactive pin map showing per-city store counts.
- **`Favorites`** — grid of favourited products (or an empty state with a CTA).
- **`PageWrap`** — shared page title/subtitle wrapper for these pages.

### 5.9 Authentication — `components/pages/Auth.tsx`
- **`Auth`** — combined sign-in/register for customers and vendors: a brand panel + a form panel with an audience switch (customer/vendor), mode tabs (sign-in/register), a forgot-password flow, social/Nafath buttons, and role-based routing on submit.
- **`AField`** — a labeled input with a leading icon (used for all auth fields).

### 5.10 Add Store (vendor onboarding) — `components/pages/AddStore.tsx`
- **`AddStore`** — marketing hero (benefits) + a 3-step "how it works" list + a registration form; on submit it shows a success/approval-pending screen.
- **`SField`** — a labeled input/select field used in the registration form.

### 5.11 Informational pages — `components/pages/Info.tsx`
Routed by `Info` based on the page id:
- **`About`** — the four أوفرز pillars, stats, and a "list your store" CTA.
- **`Pricing`** — 3 vendor plan cards (Basic / Pro / Enterprise), Pro highlighted.
- **`FAQ`** — accordion of common questions.
- **`Contact`** — contact channels + a message form with a "sent" success state (`CField` fields).
- **`Careers`** — open job listings.
- **`Blog`** — blog post cards.
- **`Legal`** — Terms / Privacy / Shipping / Returns articles (numbered sections).
- **`PageHead`** — shared breadcrumb + title + subtitle header for these pages.

---

## 6. Component count summary

| Group | Components |
|---|---|
| Shell & routing | App, AppContext, data layer, 4 GSAP hooks |
| Navbar | TopBar, Header, Logo, NotifDropdown |
| Sidebars | Category filter (VOpt), Dashboard nav, Admin nav |
| Footer | Footer |
| Shared UI | Icon, Stars, Btn, Thumb, Chip, money |
| Home | Home, HeroSlider, OffersTicker, QuickFilters, CategoryBanners, VendorCard, SectionHead, OffersMotion, ProductCard |
| Catalog | CategoryPage, VOpt, Vendor |
| Auctions | Auctions, Countdown, CountdownLight |
| Dashboard | Dashboard, StatCard, Toggle, DField, OrdersPanel, CouponsPanel, SubscriptionPanel, SettingsPanel, AddActivityModal |
| Admin | Admin + 9 panels + Head |
| Discovery | Notifications, Reels, Events, StoresMap, Favorites, PageWrap |
| Auth / Onboarding | Auth, AField, AddStore, SField |
| Info | Info, About, Pricing, FAQ, Contact, Careers, Blog, Legal, PageHead, CField |

**Total: 15 page views + ~55 components**, all bilingual (AR/EN), RTL-aware, and theme-aware (light/dark).
