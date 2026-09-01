"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Stars, Btn, Chip, money } from "../ui";
import { ProductCard } from "../Shell";
import { CATS, VENDORS, PRODUCTS, type Vendor, type Product, type Coupon } from "@/lib/data";
import { useOfferStore, type Offer } from "@/lib/offerStore";
import { useCouponStore } from "@/lib/couponStore";
import { OfferCard } from "../OfferParts";
import { useMarquee, useReveal, useOffersMotion, useHeroImage, useZoomIn, useFlipIn } from "@/lib/gsap";

type Go = (page: string, id?: string | null) => void;

export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, fontFamily: "var(--font-display)" }}><span className="hl">{title}</span></h2>
      {action && <a href="#" onClick={(e) => { e.preventDefault(); onAction && onAction(); }} style={{ color: "var(--brand)", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>{action}<Icon name="arrow" size={16} /></a>}
    </div>
  );
}

/** Coupon card for the "أكواد الخصم" tab — click the code to copy it. */
function CouponCard({ c, ar, go }: { c: Coupon; ar: boolean; go: Go }) {
  const [copied, setCopied] = useState(false);
  const vendor = VENDORS[c.vendor];
  const copy = () => {
    // synchronous fallback first (works during the click gesture even when the
    // async Clipboard API is blocked in an iframe/sandbox), then the modern API.
    try {
      const ta = document.createElement("textarea");
      ta.value = c.code; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    } catch { /* ignore */ }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(c.code).catch(() => {});
    // always reflect the action in the UI
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  const gift = c.type === "item";
  const value = c.type === "percent" ? `${c.pct}%` : c.type === "fixed" ? (ar ? `${c.pct} ﷼` : `${c.pct} SAR`) : (ar ? `${c.buyQty}+${c.giftQty} هدية` : `${c.buyQty}+${c.giftQty} gift`);
  return (
    <div style={{ border: "1.5px dashed var(--brand)", borderRadius: "var(--r-lg)", background: "var(--brand-soft)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 16px 12px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", flex: "none" }}><Icon name={gift ? "gift" : "ticket"} size={18} /></span>
          <div style={{ minWidth: 0 }}>
            <button onClick={() => vendor && go("vendor", c.vendor)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: 700, fontSize: 13.5, color: "var(--text)", textAlign: "start", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{vendor ? (ar ? vendor.ar : vendor.en) : ""}</button>
            <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{ar ? `ينتهي ${c.until.ar}` : `Ends ${c.until.en}`}</div>
          </div>
          <span style={{ marginInlineStart: "auto", fontWeight: 800, fontSize: 18, color: "var(--brand)", fontFamily: "var(--font-display)", flex: "none" }} className="num">{value}</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.45 }}>{ar ? c.ar : c.en}</div>
      </div>
      {/* copyable code strip */}
      <button onClick={copy} title={ar ? "انسخ الكود" : "Copy code"}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "11px 16px", border: "none", borderTop: "1.5px dashed var(--brand)", background: copied ? "var(--brand)" : "var(--surface)", color: copied ? "#fff" : "var(--text)", cursor: "pointer", fontFamily: "inherit" }}>
        <span className="num" style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>{c.code}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: copied ? "#fff" : "var(--brand)" }}>
          <Icon name={copied ? "check" : "copy"} size={15} />{copied ? (ar ? "تم النسخ" : "Copied") : (ar ? "نسخ" : "Copy")}
        </span>
      </button>
    </div>
  );
}

// Home quick-navigation tabs — shortcuts that scroll to a section (or route).
// One row; scrolls sideways on mobile when they overflow.
type HomeTab = { ar: string; en: string; icon: string; to: { anchor: string } | { page: string } };
const HOME_TABS: HomeTab[] = [
  { ar: "الأقسام", en: "Categories", icon: "grid", to: { anchor: "cats-anchor" } },
  { ar: "المنتجات", en: "Products", icon: "box", to: { anchor: "products-anchor" } },
  { ar: "العروض", en: "Offers", icon: "tag", to: { anchor: "offers-anchor" } },
  { ar: "٥٠٪ وأكثر", en: "50% & up", icon: "dollar", to: { anchor: "big-anchor" } },
  { ar: "أكواد الخصم", en: "Coupons", icon: "ticket", to: { anchor: "coupons-anchor" } },
  { ar: "متاجر مميزة", en: "Featured stores", icon: "store", to: { anchor: "vendors-anchor" } },
  { ar: "ريلز", en: "Reels", icon: "reel", to: { page: "reels" } },
];
// each "deals" tab has its OWN title + product filter, so it shows distinct content.
// (أكواد الخصم is rendered as its own coupons panel below, not via DEAL_TABS.)
const DEAL_TABS: Record<string, { ar: string; en: string; filter: (p: Product) => boolean }> = {
  // العروض → every active offer; a "الأحدث" sort inside the tab surfaces the newest
  "offers-anchor": { ar: "العروض", en: "Offers", filter: (p) => p.active && p.discount > 0 },
  // ٥٠٪ وأكثر → only the biggest discounts
  "big-anchor":    { ar: "خصم ٥٠٪ وأكثر", en: "50% & up", filter: (p) => p.active && p.discount >= 50 },
};
// Wizard tabs: clicking a tab shows ONLY that tab's content panel (see Home).
// `active` is the currently-selected anchor (or "" when a page-tab was last used).
function HomeTabs({ go, active, onSelect }: { go: Go; active: string; onSelect: (anchor: string) => void }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const handle = (t: HomeTab) => {
    if ("page" in t.to) { go(t.to.page); return; }
    onSelect(t.to.anchor);
    // scroll the clicked tab into view within the row (horizontal only)
    const row = document.getElementById("home-tabs");
    const btn = row?.querySelector<HTMLElement>(`[data-anchor="${t.to.anchor}"]`);
    if (row && btn) row.scrollTo({ left: btn.offsetLeft - (row.clientWidth - btn.clientWidth) / 2, behavior: "smooth" });
  };
  return (
    <div id="home-tabs" className="mash-scroll-x mash-noscroll" style={{ display: "flex", flexWrap: "nowrap", gap: 8, marginBottom: 16, overflowX: "auto" }}>
      {HOME_TABS.map((t) => {
        const isAnchor = "anchor" in t.to;
        const isActive = isAnchor && (t.to as { anchor: string }).anchor === active;
        return (
        <button key={t.en} onClick={() => handle(t)} data-anchor={isAnchor ? (t.to as { anchor: string }).anchor : undefined} aria-current={isActive ? "true" : undefined}
          style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1.5px solid " + (isActive ? "var(--brand)" : "var(--line)"), background: isActive ? "var(--brand)" : "var(--surface)", color: isActive ? "#fff" : "var(--text)", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", cursor: "pointer", transition: "background-color .2s, color .2s, border-color .2s" }}
          onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.color = "var(--brand)"; } }}
          onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--text)"; } }}>
          <Icon name={t.icon} size={15} />{ar ? t.ar : t.en}
        </button>
      );})}
    </div>
  );
}

// Hero slider now features STORES (vendors), not products. Each slide showcases
// a featured store, its logo/banner, rating & city, and links to its storefront.
const STORE_BANNERS: Record<string, string> = {
  electronics: "/img/cat-electronics.png", perfumes: "/img/cat-beauty.png",
  fashion: "/img/cat-clothes.png", restaurants: "/img/cat-food.png",
};
interface HeroStore { vendor: string; img: string; color: string; kicker: string; title: string; sub: string; cta: string; promoted?: boolean; discount?: number; }
function buildHeroStores(lang: "ar" | "en"): HeroStore[] {
  const ar = lang === "ar";
  return Object.values(VENDORS).map((v) => ({
    vendor: v.id,
    img: STORE_BANNERS[v.cat] || "/img/cat-electronics.png",
    color: v.color,
    kicker: ar ? "متجر مميّز" : "Featured store",
    title: ar ? v.ar : v.en,
    sub: ar ? v.ar_about : v.en_about,
    cta: ar ? "زيارة المتجر" : "Visit store",
  }));
}
function OffersTicker({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const items = PRODUCTS.filter((p) => p.active).sort((a, b) => b.discount - a.discount);
  let half: typeof items = [];
  while (half.length < 24) half = half.concat(items);
  const trackRef = useMarquee<HTMLDivElement>(60, [lang]);

  const Group = ({ k }: { k: number }) => (
    <div aria-hidden={k > 0} style={{ display: "flex", flex: "none" }}>
      {half.map((p, idx) => (
        <button key={k + "-" + idx} onClick={() => go("vendor", p.vendor)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", padding: "11px 18px", color: "var(--text)", whiteSpace: "nowrap", cursor: "pointer" }}>
          <span className="num" style={{ background: "var(--sale)", color: "#fff", fontWeight: 800, fontSize: 12, padding: "2px 7px", borderRadius: 6 }}>-{p.discount}%</span>
          <span style={{ fontWeight: 700, fontSize: 13.5 }}>{ar ? p.ar : p.en}</span>
          <span style={{ color: "var(--text-3)", fontSize: 12.5 }}>· {ar ? VENDORS[p.vendor].ar : VENDORS[p.vendor].en}</span>
          <span style={{ color: "var(--line)", marginInlineStart: 6 }}>•</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="mash-ticker" style={{ marginTop: 16, display: "flex", alignItems: "stretch", borderRadius: "var(--r-pill)", overflow: "hidden", border: "1px solid var(--line)", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, background: "var(--brand)", color: "#fff", padding: "0 18px", fontWeight: 800, fontSize: 13.5, zIndex: 1 }}>
        <Icon name="tag" size={16} />{ar ? "عروض ساخنة" : "Hot offers"}
      </div>
      <div dir="ltr" style={{ position: "relative", flex: 1, overflow: "hidden", direction: "ltr", maskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)" }}>
        <div ref={trackRef} style={{ display: "flex", width: "max-content", direction: "ltr", willChange: "transform" }}>
          <Group k={0} />
          <Group k={1} />
        </div>
      </div>
    </div>
  );
}

const heroArrow: React.CSSProperties = { position: "absolute", top: "50%", transform: "translateY(-50%)", width: 42, height: 42, borderRadius: 999, border: "none", background: "rgba(255,255,255,.16)", backdropFilter: "blur(4px)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };

function HeroSlider({ go, offers = [] }: { go: Go; onCat?: (id: string) => void; offers?: Offer[] }) {
  const { lang } = useApp();
  const l = lang === "ar" ? "ar" : "en";
  // one slide per featured store; every slide shows a big offer %. Prefer the
  // store's best active sponsored-offer discount; otherwise fall back to the
  // biggest discount among the store's own products so no slide is left blank.
  const bestDiscount = (vendorId: string) => {
    const fromOffers = offers.filter((o) => o.active && o.vendor === vendorId && o.discount > 0)
      .reduce((m, o) => Math.max(m, o.discount), 0);
    if (fromOffers > 0) return fromOffers;
    const fromProducts = PRODUCTS.filter((p) => p.vendor === vendorId && p.active)
      .reduce((m, p) => Math.max(m, p.discount), 0);
    return fromProducts;
  };
  const slides = buildHeroStores(l).map((s) => ({ ...s, discount: bestDiscount(s.vendor) }));
  const rtl = lang === "ar";
  const n = slides.length;
  // INFINITE loop: pad with a clone of the last slide at the start and the first
  // slide at the end, so there is ALWAYS a slide peeking on both sides.
  const loop = n > 1 ? [slides[n - 1], ...slides, slides[0]] : slides;
  const [pos, setPos] = useState(1);        // position in the padded `loop` array
  const [anim, setAnim] = useState(true);   // disable transition for the snap
  const [paused, setPaused] = useState(false);
  const i = n > 1 ? ((pos - 1) % n + n) % n : 0; // real active slide index (for dots)
  const go2 = (real: number) => setPos(real + 1);
  useEffect(() => {
    if (paused || n <= 1) return;
    const id = setInterval(() => setPos((p) => p + 1), 2600);
    return () => clearInterval(id);
  }, [paused, n]);
  // when landing on a clone edge, snap (no animation) to the matching real slide
  const onRest = () => {
    if (n <= 1) return;
    if (pos === loop.length - 1) { setAnim(false); setPos(1); }        // past-end clone → first
    else if (pos === 0) { setAnim(false); setPos(loop.length - 2); }   // before-start clone → last
  };
  useEffect(() => { if (!anim) { const id = requestAnimationFrame(() => setAnim(true)); return () => cancelAnimationFrame(id); } }, [anim]);
  const act = (s: HeroStore) => go("vendor", s.vendor);
  const heroRef = useHeroImage<HTMLElement>(i);

  // PEEK carousel: each slide is ~76% wide and centred; the previous & next
  // slides peek at the edges. The (padded) track slides so `pos` sits in the middle.
  const SLIDE = 76;              // slide width as % of the viewport
  const GAP = 2.5;               // gap between slides in %
  const step = SLIDE + GAP;      // how far the track moves per slide (%)
  const sidePad = (100 - SLIDE) / 2; // left/right padding to centre a slide
  const shift = sidePad - step * pos; // centre the slide at `pos`; RTL flips the sign
  return (
    <section ref={heroRef} className="mash-hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{ position: "relative", height: 340, overflow: "hidden" }}>
      {/* sliding (padded) track */}
      <div onTransitionEnd={onRest} style={{ display: "flex", gap: GAP + "%", height: "100%", transform: `translateX(${rtl ? -shift : shift}%)`, transition: anim ? "transform .5s cubic-bezier(.22,.61,.36,1)" : "none" }}>
        {loop.map((s, idx) => {
          const active = idx === pos;
          return (
          <div key={idx} className="mash-hero-slide" aria-hidden={!active} onClick={() => active ? act(s) : setPos(idx)}
            style={{ flex: `0 0 ${SLIDE}%`, position: "relative", height: "100%", borderRadius: "var(--r-xl)", overflow: "hidden", background: "var(--hero)", cursor: "pointer",
              transform: active ? "scale(1)" : "scale(.96)", opacity: active ? 1 : .82, transition: "transform .5s cubic-bezier(.22,.61,.36,1), opacity .5s ease" }}>
            {/* store banner photo behind, dimmed */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt="" style={{ position: "absolute", inset: 0, height: "100%", width: "100%", objectFit: "cover" }} />
            {/* dark + brand-tinted wash so the centered content stays readable */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 120% at 50% 42%, ${s.color}44 0%, rgba(16,22,29,.82) 55%, #10161d 100%)` }} />
            {/* everything centered in the middle: store logo + name + big offer % */}
            <div className="mash-hero-copy" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16, padding: "0 40px" }}>
              <div className="mash-hero-card" data-active={active} style={{ width: 96, height: 96, borderRadius: 24, background: `linear-gradient(150deg, ${s.color}, ${s.color}cc)`, boxShadow: "0 22px 55px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" }}>
                <span className="mash-hero-img"><Icon name="store" size={48} stroke={1.4} /></span>
              </div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, lineHeight: 1.15, color: "#fff", fontFamily: "var(--font-display)" }}>{s.title}</h1>
              {!!s.discount && s.discount > 0 && (
                <div className="mash-hero-off" style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, color: "var(--gold)", lineHeight: 1, fontFamily: "var(--font-display)", textShadow: "0 4px 24px rgba(0,0,0,.45)" }}>
                  <span style={{ fontSize: 24, fontWeight: 800 }}>{rtl ? "خصم" : "SAVE"}</span>
                  <span className="num" style={{ fontSize: 84, fontWeight: 800 }}>{s.discount}%</span>
                </div>
              )}
            </div>
          </div>
        );})}
      </div>
      <button className="mash-hero-arrow" onClick={() => setPos((p) => p - 1)} aria-label="prev" style={{ ...heroArrow, insetInlineStart: 16 }}><Icon name="chevron" size={20} style={{ transform: rtl ? "rotate(-90deg)" : "rotate(90deg)" }} /></button>
      <button className="mash-hero-arrow" onClick={() => setPos((p) => p + 1)} aria-label="next" style={{ ...heroArrow, insetInlineEnd: 16 }}><Icon name="chevron" size={20} style={{ transform: rtl ? "rotate(90deg)" : "rotate(-90deg)" }} /></button>
      <div className="mash-hero-dots" style={{ position: "absolute", insetInline: 0, bottom: 18, display: "flex", justifyContent: "center", gap: 8, zIndex: 3 }}>
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => go2(idx)} aria-label={"slide " + (idx + 1)} style={{ width: idx === i ? 26 : 9, height: 9, borderRadius: 999, border: "none", background: idx === i ? "var(--brand)" : "rgba(255,255,255,.45)", transition: "width .25s, background .25s", cursor: "pointer" }} />
        ))}
      </div>
    </section>
  );
}

/* Offers motion graphic — GSAP-driven (rings, tags, twinkles) */
export function OffersMotion({ ar }: { ar: boolean }) {
  const ref = useOffersMotion<HTMLDivElement>();
  const tags = [
    { txt: "-50%", top: "6%", side: "2%", bg: "var(--brand)" },
    { txt: ar ? "خصم" : "SALE", top: "62%", side: "-4%", bg: "var(--gold-deep)" },
    { txt: "-30%", top: "30%", side: "40%", bg: "var(--brand-strong)" },
  ];
  return (
    <div ref={ref} aria-hidden="true" style={{ position: "absolute", top: "50%", insetInlineEnd: "14%", width: 230, height: 230, marginTop: -115, pointerEvents: "none", zIndex: 2 }}>
      {[0, 1].map((k) => (
        <span key={k} className="mash-pulse" style={{ position: "absolute", inset: 30, borderRadius: "50%", border: "2px solid var(--gold)" }} />
      ))}
      <span className="mash-ring-dash" style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px dashed rgba(251,199,1,.55)" }} />
      <span className="mash-ring-inner" style={{ position: "absolute", inset: 34, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.18)", borderTopColor: "var(--gold)" }} />
      <span className="mash-badge" style={{ position: "absolute", inset: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold), var(--gold-deep))", boxShadow: "0 12px 30px rgba(234,170,8,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#3a2c00" }}>
        <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-display)" }}>٪</span>
        <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".5px" }}>{ar ? "عروض" : "OFFERS"}</span>
      </span>
      {tags.map((tg, k) => (
        <span key={k} className="mash-tag" style={{ position: "absolute", top: tg.top, insetInlineEnd: tg.side, background: tg.bg, color: "#fff", fontWeight: 800, fontSize: 13, padding: "6px 11px", borderRadius: 10, boxShadow: "0 8px 20px rgba(0,0,0,.3)", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-flex" }}><Icon name="tag" size={13} stroke={2} /></span>
          <span className="num">{tg.txt}</span>
        </span>
      ))}
      {[["4%", "44%"], ["78%", "70%"], ["50%", "4%"]].map(([tp, sd], k) => (
        <span key={k} className="mash-spark" style={{ position: "absolute", top: tp, insetInlineStart: sd, width: 8, height: 8, borderRadius: "50%", background: "#fff", boxShadow: "0 0 8px #fff" }} />
      ))}
    </div>
  );
}

// Real product photos sit on soft branded panels (object-fit: contain) so the
// white-background catalog shots read as clean tiles rather than dark banners.
const CAT_BANNERS = [
  { id: "electronics", img: "/img/cat-electronics.png", ar: "إلكترونيات", en: "Electronics", bg: "linear-gradient(135deg,#eef2f8,#dbe4f0)" },
  { id: "perfumes", img: "/img/cat-beauty.png", ar: "العطور والجمال", en: "Beauty & Perfume", bg: "linear-gradient(135deg,#f7edf5,#f0dced)" },
  { id: "fashion", img: "/img/cat-clothes.png", ar: "الأزياء", en: "Fashion", bg: "linear-gradient(135deg,#f4eef0,#e7dade)" },
  { id: "restaurants", img: "/img/cat-food.png", ar: "المطاعم", en: "Restaurants", bg: "linear-gradient(135deg,#fbf1e8,#f3ddc9)" },
  { id: "books", img: "/img/cat-books.png", ar: "الكتب", en: "Books", bg: "linear-gradient(135deg,#f3efe8,#e6ddcf)" },
  { id: "furniture", img: "/img/cat-kitchen.png", ar: "الأثاث والأجهزة", en: "Home & Appliances", bg: "linear-gradient(135deg,#eef2f6,#dde5ee)" },
];
function CategoryBanners({ go }: { go: Go }) {
  const { t, lang } = useApp();
  const ar = lang === "ar";
  const offerStore = useOfferStore();
  // "all" selected by default; picking a category shows ALL its stores directly
  // (sub-category level ignored per requirement).
  const [openCat, setOpenCat] = useState<string>("all");
  // every store that has products in a category (or all vendors for "all")
  const storesInCat = (catId: string) =>
    catId === "all"
      ? Object.values(VENDORS)
      : Array.from(new Set(PRODUCTS.filter((p) => p.cat === catId).map((p) => p.vendor))).map((vid) => VENDORS[vid]).filter(Boolean);
  // big background for a store card = the offer image the vendor added (else a cat banner)
  const bgOf = (vid: string, catId: string) => {
    const off = offerStore.offers.find((o) => o.vendor === vid && o.img);
    return off?.img || VENDOR_BANNERS[catId] || VENDOR_BANNERS[VENDORS[vid]?.cat] || CAT_BANNERS[0].img;
  };
  const stores = storesInCat(openCat);
  return (
    <section id="cats-anchor" style={{ marginTop: 44 }}>
      <SectionHead title={ar ? "تسوّق حسب القسم" : "Shop by category"} />

      {/* filter row: "All" + each category — "All" is selected by default */}
      <div className="mash-scroll-x mash-noscroll" data-no-reveal style={{ display: "flex", flexWrap: "nowrap", justifyContent: "safe center", gap: 8, overflowX: "auto" }}>
        <Chip active={openCat === "all"} onClick={() => setOpenCat("all")}>{ar ? "الكل" : "All"}</Chip>
        {CAT_BANNERS.map((c) => (
          <Chip key={c.id} active={openCat === c.id} onClick={() => setOpenCat(openCat === c.id ? "all" : c.id)}>{ar ? c.ar : c.en}</Chip>
        ))}
      </div>

      {/* store count */}
      <div style={{ margin: "16px 2px 12px", fontWeight: 800, fontSize: 16 }}><span className="num">{stores.length}</span> {ar ? "متجر" : "stores"}</div>

      {/* store list — clean rows: logo + name + description (one per row) */}
      <div data-no-reveal style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }} className="mash-store-cards">
        {stores.length === 0 && <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "36px 0", color: "var(--text-3)" }}>{ar ? "لا توجد متاجر في هذا القسم" : "No stores in this category"}</div>}
        {stores.map((v) => (
          <button key={v.id} onClick={() => { go("vendor", v.id); window.scrollTo({ top: 0 }); }}
            style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", padding: 16, cursor: "pointer", textAlign: "start", color: "var(--text)" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--brand)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = "var(--line)"; }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "var(--font-display)" }}>{ar ? v.ar : v.en}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>{ar ? v.ar_about : v.en_about}</div>
            </div>
            {/* store logo tile: offer image if any, else brand-colour glyph */}
            <span style={{ width: 62, height: 62, borderRadius: 14, overflow: "hidden", flex: "none", background: v.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: "1px solid var(--line)" }}>
              {bgOf(v.id, openCat)
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={bgOf(v.id, openCat)} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <Icon name="store" size={26} />}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

const VENDOR_BANNERS: Record<string, string> = {
  electronics: "/img/cat-electronics.png",
  perfumes: "/img/cat-beauty.png",
  fashion: "/img/cat-clothes.png",
  restaurants: "/img/cat-food.png",
  books: "/img/cat-books.png",
  furniture: "/img/cat-kitchen.png",
  realestate: "/img/cat-kitchen.png",
};
export function VendorCard({ v, go }: { v: Vendor; go: Go }) {
  const { t, lang } = useApp();
  const banner = VENDOR_BANNERS[v.cat];
  return (
    <button onClick={() => go("vendor", v.id)} style={{ textAlign: "start", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)", color: "var(--text)", cursor: "pointer", transition: "box-shadow .18s, transform .18s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ position: "relative", height: 96, background: v.color, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {banner && <img src={banner} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        <span style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, ${v.color}cc, ${v.color}55 60%, transparent)` }} />
      </div>
      <div style={{ padding: "0 16px 16px", marginTop: -26 }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: "var(--surface)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", color: v.color, boxShadow: "var(--shadow-sm)" }}><Icon name="store" size={26} /></div>
        <div style={{ fontWeight: 800, fontSize: 16, marginTop: 10 }}>{lang === "ar" ? v.ar : v.en}</div>
        <div style={{ marginTop: 6 }}><Stars value={v.rating} count={v.reviews} /></div>
        <div className="num" style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>{(v.followers / 1000).toFixed(1)}k {t.followers}</div>
      </div>
    </button>
  );
}

/* ---------------- HOME ---------------- */
export function Home({ go, query }: { go: Go; query: string }) {
  const { t, lang } = useApp();
  const ar = lang === "ar";
  const offerStore = useOfferStore();
  const couponStore = useCouponStore();
  const [activeCat, setActiveCat] = useState("all");
  const [sort, setSort] = useState("featured");
  // wizard: which tab's content panel is shown (default = categories)
  const [tab, setTab] = useState("cats-anchor");
  // active sponsored offers matching the selected category filter
  const promoted = offerStore.offers.filter((o) => o.active && (activeCat === "all" || o.cat === activeCat));
  const dealsGrid = useZoomIn<HTMLDivElement>([activeCat, tab, sort, query, lang]);
  const vendorsGrid = useFlipIn<HTMLDivElement>([lang]);
  const list = useMemo(() => {
    let l = PRODUCTS;
    if (activeCat !== "all") l = l.filter((p) => p.cat === activeCat);
    // each deals tab applies its own filter → distinct content per tab
    const dealFilter = DEAL_TABS[tab]?.filter;
    if (dealFilter) l = l.filter(dealFilter);
    if (query) { const q = query.toLowerCase(); l = l.filter((p) => (p.ar + p.en).toLowerCase().includes(q)); }
    if (sort === "latest") l = [...l].sort((a, b) => b.days - a.days);
    else if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    else if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    else if (sort === "discount") l = [...l].sort((a, b) => b.discount - a.discount);
    return l;
  }, [activeCat, tab, query, sort]);

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      {/* quick-nav tabs sit above the slider */}
      <HomeTabs go={go} active={tab} onSelect={setTab} />
      {/* slider + ticker show only on the default (categories) tab; hidden when switched */}
      {tab === "cats-anchor" && (<>
        <HeroSlider go={go} onCat={(id) => setActiveCat(id)} offers={offerStore.offers} />
        <OffersTicker go={go} />
      </>)}

      {/* wizard: only the selected tab's content panel is shown */}
      {tab === "cats-anchor" && <CategoryBanners go={go} />}

      {/* أكواد الخصم — a dedicated coupons panel (active coupons only, click to copy) */}
      {tab === "coupons-anchor" && (
      <section id="coupons-anchor" style={{ marginTop: 44 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, fontFamily: "var(--font-display)" }}><span className="hl">{ar ? "أكواد الخصم" : "Coupons"}</span></h2>
          <p style={{ margin: "6px 0 0", color: "var(--text-3)", fontSize: 13.5 }}>{ar ? "اضغط على الكود لنسخه واستخدمه عند الدفع" : "Tap a code to copy it and use at checkout"}</p>
        </div>
        {(() => {
          // read from the shared coupon store so vendor CRUD reflects on the site
          const active = couponStore.coupons.filter((c) => c.active);
          return active.length ? (
            <div className="mash-store-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
              {active.map((c) => <CouponCard key={c.id} c={c} ar={ar} go={go} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px 0", color: "var(--text-3)" }}>{ar ? "لا توجد أكواد خصم متاحة حالياً" : "No coupons available right now"}</div>
          );
        })()}
      </section>
      )}

      {DEAL_TABS[tab] && tab !== "coupons-anchor" && (
      <section id={tab} style={{ marginTop: 44 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, fontFamily: "var(--font-display)" }}><span className="hl">{ar ? DEAL_TABS[tab].ar : DEAL_TABS[tab].en}</span></h2>
        </div>
        {/* filter chips: one row, no scrollbar, rest scroll sideways */}
        <div className="mash-scroll-x mash-noscroll" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap", overflowX: "auto", marginBottom: 20 }}>
          <Chip small active={activeCat === "all"} onClick={() => setActiveCat("all")}>{lang === "ar" ? "الكل" : "All"}</Chip>
          {CATS.filter((c) => PRODUCTS.some((p) => p.cat === c.id)).map((c) => (
            <Chip small key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(activeCat === c.id ? "all" : c.id)}>{lang === "ar" ? c.ar : c.en}</Chip>
          ))}
          <div style={{ marginInlineStart: "auto", flex: "none" }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ height: 40, padding: "0 14px", borderRadius: "var(--r-pill)", border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--text)", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
              <option value="featured">{lang === "ar" ? "مختار لك" : "Featured"}</option>
              <option value="latest">{lang === "ar" ? "الأحدث" : "Latest"}</option>
              <option value="low">{lang === "ar" ? "الأقل سعراً" : "Price: low"}</option>
              <option value="high">{lang === "ar" ? "الأعلى سعراً" : "Price: high"}</option>
              <option value="rating">{lang === "ar" ? "الأعلى تقييماً" : "Top rated"}</option>
              <option value="discount">{lang === "ar" ? "أكبر خصم" : "Biggest discount"}</option>
            </select>
          </div>
        </div>
        {/* sponsored vendor offers appear first — show at most 6 */}
        {promoted.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 22 }}>
            {promoted.slice(0, 6).map((o) => <OfferCard key={o.id} o={o} ar={lang === "ar"} go={go} />)}
          </div>
        )}
        <div ref={dealsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {list.length ? list.slice(0, 6).map((p) => <ProductCard key={p.id} p={p} go={go} />)
            : <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px 0", color: "var(--text-3)" }}>{lang === "ar" ? "لا توجد منتجات مطابقة" : "No matching products"}</div>}
        </div>
      </section>
      )}

      {tab === "vendors-anchor" && (
      <section id="vendors-anchor" style={{ marginTop: 44 }}>
        <SectionHead title={t.featuredVendors} action={t.viewAll} onAction={() => go("map")} />
        <div ref={vendorsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {Object.values(VENDORS).map((v) => <VendorCard key={v.id} v={v} go={go} />)}
        </div>
      </section>
      )}

      {/* products group on the home page; "view all" opens the full products page */}
      {tab === "products-anchor" && (
      <section id="products-anchor" style={{ marginTop: 44 }}>
        <SectionHead title={ar ? "المنتجات" : "Products"} action={ar ? "عرض الكل" : "View all"} onAction={() => go("shop")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }} className="mash-store-grid">
          {PRODUCTS.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} go={go} />)}
        </div>
      </section>
      )}
    </div>
  );
}
