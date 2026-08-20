"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Stars, Btn, Chip, money } from "../ui";
import { ProductCard } from "../Shell";
import { CATS, VENDORS, PRODUCTS, type Vendor } from "@/lib/data";
import { useCatStore } from "@/lib/catStore";
import { useOfferStore, type Offer } from "@/lib/offerStore";
import { OfferCard } from "../OfferParts";
import { useMarquee, useReveal, useOffersMotion, useHeroImage, useZoomIn, useFlipIn, useSlideIn } from "@/lib/gsap";

type Go = (page: string, id?: string | null) => void;

export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, fontFamily: "var(--font-display)" }}><span className="hl">{title}</span></h2>
      {action && <a href="#" onClick={(e) => { e.preventDefault(); onAction && onAction(); }} style={{ color: "var(--brand)", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>{action}<Icon name="arrow" size={16} /></a>}
    </div>
  );
}

const QUICK: Record<"ar" | "en", [string, string][]> = {
  ar: [["آخر فرص", "gavel"], ["عروض", "tag"], ["٥٠٪ وأكثر", "dollar"], ["الجديد", "eye"]],
  en: [["Last chance", "gavel"], ["Offers", "tag"], ["50% & up", "dollar"], ["New", "eye"]],
};
function QuickFilters({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { lang } = useApp();
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
      {QUICK[lang === "ar" ? "ar" : "en"].map(([label, ic], i) => {
        const on = i === value;
        return (
          <button key={label} onClick={() => onChange(on ? -1 : i)} style={{ flex: "none", display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1.5px solid " + (on ? "var(--brand)" : "var(--line)"), background: on ? "var(--brand)" : "var(--surface)", color: on ? "#fff" : "var(--text)", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>
            <Icon name={ic} size={15} />{label}
          </button>
        );
      })}
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
      <div style={{ position: "relative", flex: 1, overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)" }}>
        <div ref={trackRef} style={{ display: "flex", width: "max-content", direction: "ltr" }}>
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
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const go2 = (idx: number) => setI((idx + n) % n);
  // clamp index if slide count changes (offers added/removed)
  useEffect(() => { if (i >= n) setI(0); }, [n, i]);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % n), 2600); // faster autoplay
    return () => clearInterval(id);
  }, [paused, n]);
  const act = (s: HeroStore) => go("vendor", s.vendor);
  const heroRef = useHeroImage<HTMLElement>(i);

  return (
    <section ref={heroRef} className="mash-hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{ position: "relative", height: 340, borderRadius: "var(--r-xl)", overflow: "hidden", background: "var(--hero)" }}>
      {slides.map((s, idx) => {
        return (
        <div key={idx} className="mash-hero-slide" aria-hidden={idx !== i} onClick={() => act(s)} style={{ position: "absolute", inset: 0, opacity: idx === i ? 1 : 0, transition: "opacity .45s ease", pointerEvents: idx === i ? "auto" : "none", cursor: "pointer" }}>
          {/* store banner photo behind, dimmed */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.img} alt="" style={{ position: "absolute", inset: 0, height: "100%", width: "100%", objectFit: "cover" }} />
          {/* dark + brand-tinted wash so the centered content stays readable */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 120% at 50% 42%, ${s.color}44 0%, rgba(16,22,29,.82) 55%, #10161d 100%)` }} />
          {/* everything centered in the middle: store logo + name + big offer % */}
          <div className="mash-hero-copy" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16, padding: "0 56px" }}>
            {/* store logo glyph in a glowing badge */}
            <div className="mash-hero-card" data-active={idx === i} style={{ width: 96, height: 96, borderRadius: 24, background: `linear-gradient(150deg, ${s.color}, ${s.color}cc)`, boxShadow: "0 22px 55px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" }}>
              <span className="mash-hero-img"><Icon name="store" size={48} stroke={1.4} /></span>
            </div>
            {/* store name */}
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, lineHeight: 1.15, color: "#fff", fontFamily: "var(--font-display)" }}>{s.title}</h1>
            {/* big offer % — centered in the middle */}
            {!!s.discount && s.discount > 0 && (
              <div className="mash-hero-off" style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, color: "var(--gold)", lineHeight: 1, fontFamily: "var(--font-display)", textShadow: "0 4px 24px rgba(0,0,0,.45)" }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{rtl ? "خصم" : "SAVE"}</span>
                <span className="num" style={{ fontSize: 84, fontWeight: 800 }}>{s.discount}%</span>
              </div>
            )}
          </div>
        </div>
      );})}
      <button className="mash-hero-arrow" onClick={() => go2(i - 1)} aria-label="prev" style={{ ...heroArrow, insetInlineStart: 16 }}><Icon name="chevron" size={20} style={{ transform: rtl ? "rotate(-90deg)" : "rotate(90deg)" }} /></button>
      <button className="mash-hero-arrow" onClick={() => go2(i + 1)} aria-label="next" style={{ ...heroArrow, insetInlineEnd: 16 }}><Icon name="chevron" size={20} style={{ transform: rtl ? "rotate(90deg)" : "rotate(-90deg)" }} /></button>
      <div className="mash-hero-dots" style={{ position: "absolute", insetInlineStart: 56, bottom: 18, display: "flex", gap: 8, zIndex: 3 }}>
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
  const grid = useSlideIn<HTMLDivElement>("right", [lang]);
  return (
    <section style={{ marginTop: 44 }}>
      <SectionHead title={ar ? "تسوّق حسب القسم" : "Shop by category"} action={t.viewAll} onAction={() => { const el = document.getElementById("deals-anchor"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }} />
      <div ref={grid} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {CAT_BANNERS.map((c) => (
          <CatBannerTile key={c.id} c={c} ar={ar} go={go} />
        ))}
      </div>
    </section>
  );
}

// one "Shop by category" tile. Clicking it expands an in-place accordion:
// sub-categories → (nested) the stores under each sub-category → store profile.
function CatBannerTile({ c, ar, go }: { c: { id: string; img: string; ar: string; en: string; bg: string }; ar: boolean; go: Go }) {
  const catStore = useCatStore();
  const subs = catStore.subsOf(c.id);
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  // stores that actually sell products in a given sub-category of this category
  const storesInSub = (subId: string) =>
    Array.from(new Set(PRODUCTS.filter((p) => p.cat === c.id && p.subcat === subId).map((p) => p.vendor)))
      .map((vid) => VENDORS[vid]).filter(Boolean);
  const toggle = () => { setOpen((o) => !o); setOpenSub(null); };
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
      <button className="mash-cat-banner" onClick={toggle} aria-expanded={open} style={{ width: "100%", position: "relative", height: 180, border: "none", borderBottom: open ? "1px solid var(--line)" : "none", background: c.bg, padding: 0, cursor: "pointer", display: "block" }}
        onMouseEnter={(e) => { const im = e.currentTarget.querySelector("img"); if (im) (im as HTMLElement).style.transform = "scale(1.06)"; }}
        onMouseLeave={(e) => { const im = e.currentTarget.querySelector("img"); if (im) (im as HTMLElement).style.transform = "scale(1)"; }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.img} alt="" loading="lazy" style={{ position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, top: 0, height: "72%", width: "100%", objectFit: "contain", padding: "18px 18px 4px", transition: "transform .35s ease" }} />
        <span className="mash-cat-scrim" style={{ position: "absolute", insetInline: 0, bottom: 0, height: "42%", background: "linear-gradient(to top, rgba(255,255,255,.96) 40%, rgba(255,255,255,0) 100%)" }} />
        <span className="mash-cat-title" style={{ position: "absolute", insetInlineStart: 16, bottom: 14, insetInlineEnd: 16, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#1e3d47" }}>
          <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "var(--font-display)" }}>{ar ? c.ar : c.en}</span>
          <span style={{ width: 34, height: 34, borderRadius: 999, background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="chevron" size={17} style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} /></span>
        </span>
      </button>

      {/* level 1: sub-categories collapse */}
      {open && (
        <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {subs.length === 0 && <div style={{ padding: "10px 12px", color: "var(--text-3)", fontSize: 13 }}>{ar ? "لا توجد أقسام فرعية" : "No sub-categories"}</div>}
          {subs.map((s) => {
            const stores = storesInSub(s.id);
            const expanded = openSub === s.id;
            return (
              <div key={s.id}>
                <button onClick={() => setOpenSub((v) => (v === s.id ? null : s.id))} aria-expanded={expanded}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--line)", background: expanded ? "var(--brand-soft)" : "var(--surface-2)", color: "var(--text)", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Icon name="grid" size={15} />{ar ? s.ar : s.en}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-3)", fontSize: 12 }}>
                    <span className="num">{stores.length}</span>
                    <Icon name="chevron" size={15} style={{ transition: "transform .2s", transform: expanded ? "rotate(180deg)" : "none" }} />
                  </span>
                </button>
                {/* level 2: stores under this sub-category */}
                {expanded && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "6px 6px 2px" }}>
                    {stores.length === 0 && <div style={{ padding: "8px 12px", color: "var(--text-3)", fontSize: 12.5 }}>{ar ? "لا توجد متاجر" : "No stores"}</div>}
                    {stores.map((v) => (
                      <button key={v.id} onClick={() => { go("vendor", v.id); window.scrollTo({ top: 0 }); }}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--line-soft)", background: "var(--surface)", color: "var(--text)", fontWeight: 600, fontSize: 13, cursor: "pointer", textAlign: "start" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line-soft)")}>
                        <span style={{ width: 26, height: 26, borderRadius: 7, background: v.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" }}><Icon name="store" size={14} /></span>
                        <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ar ? v.ar : v.en}</span>
                        <Icon name="arrow" size={15} style={{ color: "var(--brand)", flex: "none" }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
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
  const offerStore = useOfferStore();
  const [activeCat, setActiveCat] = useState("all");
  const [quick, setQuick] = useState(-1);
  const [sort, setSort] = useState("featured");
  const [dealsOpen, setDealsOpen] = useState(false); // "عروض مختارة لك" starts collapsed
  // active sponsored offers matching the selected category filter
  const promoted = offerStore.offers.filter((o) => o.active && (activeCat === "all" || o.cat === activeCat));
  const dealsGrid = useZoomIn<HTMLDivElement>([activeCat, quick, sort, query, lang]);
  const vendorsGrid = useFlipIn<HTMLDivElement>([lang]);
  const list = useMemo(() => {
    let l = PRODUCTS;
    if (activeCat !== "all") l = l.filter((p) => p.cat === activeCat);
    if (quick === 0) l = l.filter((p) => p.active && p.days <= 3);
    else if (quick === 1) l = l.filter((p) => p.active);
    else if (quick === 2) l = l.filter((p) => p.discount >= 40);
    else if (quick === 3) l = l.filter((p) => p.active && p.days >= 5);
    if (query) { const q = query.toLowerCase(); l = l.filter((p) => (p.ar + p.en).toLowerCase().includes(q)); }
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    else if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    else if (sort === "discount") l = [...l].sort((a, b) => b.discount - a.discount);
    return l;
  }, [activeCat, quick, query, sort]);

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <HeroSlider go={go} onCat={(id) => setActiveCat(id)} offers={offerStore.offers} />
      <OffersTicker go={go} />
      <QuickFilters value={quick} onChange={(v) => { setQuick(v); if (v !== -1) setDealsOpen(true); }} />

      <CategoryBanners go={go} />

      <section id="deals-anchor" style={{ marginTop: 44 }}>
        {/* collapsible header — the whole section starts collapsed */}
        <button onClick={() => setDealsOpen((o) => !o)} aria-expanded={dealsOpen} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", padding: 0, marginBottom: dealsOpen ? 20 : 0, cursor: "pointer" }}>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, fontFamily: "var(--font-display)" }}><span className="hl">{t.dealsTitle}</span></h2>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--brand)", fontWeight: 700, fontSize: 14 }}>
            {dealsOpen ? (lang === "ar" ? "طيّ" : "Collapse") : (lang === "ar" ? "عرض" : "Show")}
            <Icon name="chevron" size={18} style={{ transition: "transform .2s", transform: dealsOpen ? "rotate(180deg)" : "none" }} />
          </span>
        </button>
        {dealsOpen && (<>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          <Chip active={activeCat === "all"} onClick={() => setActiveCat("all")}>{lang === "ar" ? "الكل" : "All"}</Chip>
          {CATS.filter((c) => PRODUCTS.some((p) => p.cat === c.id)).map((c) => (
            <Chip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(activeCat === c.id ? "all" : c.id)}>{lang === "ar" ? c.ar : c.en}</Chip>
          ))}
          <div style={{ marginInlineStart: "auto" }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ height: 40, padding: "0 14px", borderRadius: "var(--r-pill)", border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--text)", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
              <option value="featured">{lang === "ar" ? "مختار لك" : "Featured"}</option>
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
        </>)}
      </section>

      <section style={{ marginTop: 48 }}>
        <SectionHead title={t.featuredVendors} action={t.viewAll} onAction={() => go("map")} />
        <div ref={vendorsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {Object.values(VENDORS).map((v) => <VendorCard key={v.id} v={v} go={go} />)}
        </div>
      </section>
    </div>
  );
}
