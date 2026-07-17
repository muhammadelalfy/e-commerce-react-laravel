"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Stars, Btn, Chip, money } from "../ui";
import { ProductCard } from "../Shell";
import { CATS, VENDORS, PRODUCTS, type Vendor } from "@/lib/data";
import { useMarquee, useReveal, useOffersMotion } from "@/lib/gsap";

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
    <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
      {QUICK[lang === "ar" ? "ar" : "en"].map(([label, ic], i) => {
        const on = i === value;
        return (
          <button key={label} onClick={() => onChange(on ? -1 : i)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 18px", borderRadius: "var(--r-pill)", border: "1.5px solid " + (on ? "var(--brand)" : "var(--line)"), background: on ? "var(--brand)" : "var(--surface)", color: on ? "#fff" : "var(--text)", fontWeight: 700, fontSize: 14 }}>
            <Icon name={ic} size={17} />{label}
          </button>
        );
      })}
    </div>
  );
}

const HERO_SLIDES: Record<"ar" | "en", { cat: string; img: string; kicker: string; title: string; sub: string; cta: string; to: [string, string] }[]> = {
  ar: [
    { cat: "all", img: "/img/cat-electronics.png", kicker: "عروض فعّالة الآن", title: "احصل على خصم حتى ٥٠٪", sub: "على المتاجر المختارة في جميع مناطق المملكة", cta: "تسوّق العروض", to: ["cat", "electronics"] },
    { cat: "fashion", img: "/img/cat-clothes.png", kicker: "وصل حديثاً", title: "أحدث صيحات الأزياء", sub: "تشكيلة رجالية ونسائية بخصومات تصل إلى ٤٠٪", cta: "تسوّق الأزياء", to: ["cat", "fashion"] },
    { cat: "perfumes", img: "/img/cat-beauty.png", kicker: "العطور والجمال", title: "عطور تدوم وجمال يبهر", sub: "عود ومسك ومستحضرات فاخرة من متاجر موثوقة", cta: "تسوّق العطور", to: ["cat", "perfumes"] },
    { cat: "restaurants", img: "/img/cat-food.png", kicker: "ألذ العروض", title: "مطاعم وحلويات بخصومات", sub: "وجبات وبوكسات حلا بأسعار لا تُقاوم", cta: "اطلب الآن", to: ["cat", "restaurants"] },
  ],
  en: [
    { cat: "all", img: "/img/cat-electronics.png", kicker: "Live offers now", title: "Get up to 50% Off", sub: "On selected stores across every region of the Kingdom", cta: "Shop deals", to: ["cat", "electronics"] },
    { cat: "fashion", img: "/img/cat-clothes.png", kicker: "New arrivals", title: "The latest in fashion", sub: "Men's & women's collections up to 40% off", cta: "Shop fashion", to: ["cat", "fashion"] },
    { cat: "perfumes", img: "/img/cat-beauty.png", kicker: "Beauty & perfume", title: "Scents that last", sub: "Oud, musk and luxury cosmetics from trusted stores", cta: "Shop perfume", to: ["cat", "perfumes"] },
    { cat: "restaurants", img: "/img/cat-food.png", kicker: "Tastiest deals", title: "Restaurants & sweets", sub: "Meals and dessert boxes at unbeatable prices", cta: "Order now", to: ["cat", "restaurants"] },
  ],
};

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

function HeroSlider({ go }: { go: Go; onCat?: (id: string) => void }) {
  const { lang } = useApp();
  const slides = HERO_SLIDES[lang === "ar" ? "ar" : "en"];
  const rtl = lang === "ar";
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const go2 = (idx: number) => setI((idx + n) % n);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % n), 4500);
    return () => clearInterval(id);
  }, [paused, n]);
  const act = (s: (typeof slides)[number]) => { if (s.to[0] === "cat") go("category", s.to[1]); else go(s.to[0], s.to[1]); };

  return (
    <section onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{ position: "relative", height: 340, borderRadius: "var(--r-xl)", overflow: "hidden", background: "var(--hero)" }}>
      {slides.map((s, idx) => (
        <div key={idx} aria-hidden={idx !== i} style={{ position: "absolute", inset: 0, opacity: idx === i ? 1 : 0, transition: "opacity .7s ease", pointerEvents: idx === i ? "auto" : "none" }}>
          {/* dark ambient wash first (fills the whole hero) */}
          <div style={{ position: "absolute", inset: 0, background: rtl
            ? "linear-gradient(270deg, #1a222d 0%, #141b24 45%, #10161d 100%)"
            : "linear-gradient(90deg, #1a222d 0%, #141b24 45%, #10161d 100%)" }} />
          {/* product photo inside a fixed white card — 256px source is DOWNSCALED
              into a ≤200px box, so it renders crisp (no upscaling = no blur).
              Card stays white in both light and dark themes. */}
          <div style={{ position: "absolute", insetInlineEnd: "6%", top: "50%", transform: "translateY(-50%)", width: 224, height: 224, borderRadius: "var(--r-xl)", background: "linear-gradient(150deg, #ffffff 0%, #eef2f7 100%)", boxShadow: "0 24px 60px rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt="" width={256} height={256} style={{ width: 200, height: 200, objectFit: "contain", transform: idx === i ? "scale(1)" : "scale(1.05)", transition: "transform 5s ease" }} />
          </div>
          <div style={{ position: "relative", height: "100%", maxWidth: 560, padding: "0 56px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(251,199,1,.16)", color: "var(--gold)", padding: "5px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, width: "fit-content" }}><Icon name="tag" size={14} />{s.kicker}</span>
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 800, lineHeight: 1.15, color: "#fff", fontFamily: "var(--font-display)" }}>{s.title}</h1>
            <p style={{ margin: 0, fontSize: 15.5, color: "rgba(255,255,255,.8)", maxWidth: 400 }}>{s.sub}</p>
            <div style={{ marginTop: 4 }}><Btn size="lg" onClick={() => act(s)}>{s.cta}</Btn></div>
          </div>
        </div>
      ))}
      <button onClick={() => go2(i - 1)} aria-label="prev" style={{ ...heroArrow, insetInlineStart: 16 }}><Icon name="chevron" size={20} style={{ transform: rtl ? "rotate(-90deg)" : "rotate(90deg)" }} /></button>
      <button onClick={() => go2(i + 1)} aria-label="next" style={{ ...heroArrow, insetInlineEnd: 16 }}><Icon name="chevron" size={20} style={{ transform: rtl ? "rotate(90deg)" : "rotate(-90deg)" }} /></button>
      <div style={{ position: "absolute", insetInlineStart: 56, bottom: 18, display: "flex", gap: 8 }}>
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
function CategoryBanners({ onPick }: { go: Go; onPick: (id: string) => void }) {
  const { t, lang } = useApp();
  const grid = useReveal<HTMLDivElement>([lang]);
  return (
    <section style={{ marginTop: 44 }}>
      <SectionHead title={lang === "ar" ? "تسوّق حسب القسم" : "Shop by category"} action={t.viewAll} onAction={() => { const el = document.getElementById("deals-anchor"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }} />
      <div ref={grid} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {CAT_BANNERS.map((c) => (
          <button key={c.id} onClick={() => onPick(c.id)} style={{ position: "relative", height: 180, borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--line)", background: c.bg, padding: 0, cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
            onMouseEnter={(e) => { const im = e.currentTarget.querySelector("img"); if (im) (im as HTMLElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { const im = e.currentTarget.querySelector("img"); if (im) (im as HTMLElement).style.transform = "scale(1)"; }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt="" loading="lazy" style={{ position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, top: 0, height: "72%", width: "100%", objectFit: "contain", padding: "18px 18px 4px", transition: "transform .35s ease" }} />
            <span style={{ position: "absolute", insetInline: 0, bottom: 0, height: "42%", background: "linear-gradient(to top, rgba(255,255,255,.96) 40%, rgba(255,255,255,0) 100%)" }} />
            <span style={{ position: "absolute", insetInlineStart: 16, bottom: 14, insetInlineEnd: 16, display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text)" }}>
              <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "var(--font-display)" }}>{lang === "ar" ? c.ar : c.en}</span>
              <span style={{ width: 34, height: 34, borderRadius: 999, background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="arrow" size={17} /></span>
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
  const [activeCat, setActiveCat] = useState("all");
  const [quick, setQuick] = useState(-1);
  const [sort, setSort] = useState("featured");
  const dealsGrid = useReveal<HTMLDivElement>([activeCat, quick, sort, query, lang]);
  const vendorsGrid = useReveal<HTMLDivElement>([lang]);
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
  const scrollDeals = () => { const el = document.getElementById("deals-anchor"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <HeroSlider go={go} onCat={(id) => setActiveCat(id)} />
      <OffersTicker go={go} />
      <QuickFilters value={quick} onChange={(v) => { setQuick(v); if (v !== -1) requestAnimationFrame(scrollDeals); }} />

      <section style={{ marginTop: 40 }}>
        <SectionHead title={t.popularCats} action={t.viewAll} onAction={() => { setActiveCat("all"); const el = document.getElementById("deals-anchor"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 12 }}>
          {CATS.map((c) => {
            const on = activeCat === c.id;
            return (
              <button key={c.id} onClick={() => go("category", c.id)} style={{ background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "var(--text)" }}>
                <span style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", background: c.img ? "#fff" : (on ? "var(--brand)" : c.tint), display: "flex", alignItems: "center", justifyContent: "center", color: on ? "#fff" : "#3a4a40", boxShadow: "var(--shadow-sm)", border: "3px solid " + (on ? "var(--brand)" : "var(--surface)"), transition: "border-color .15s" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.img
                    ? <img src={c.img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <Icon name={c.icon} size={30} stroke={1.6} />}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: on ? "var(--brand)" : "var(--text)" }}>{lang === "ar" ? c.ar : c.en}</span>
              </button>
            );
          })}
        </div>
      </section>

      <CategoryBanners go={go} onPick={(id) => go("category", id)} />

      <section id="deals-anchor" style={{ marginTop: 44 }}>
        <SectionHead title={t.dealsTitle} />
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
        <div ref={dealsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {list.length ? list.map((p) => <ProductCard key={p.id} p={p} go={go} />)
            : <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px 0", color: "var(--text-3)" }}>{lang === "ar" ? "لا توجد منتجات مطابقة" : "No matching products"}</div>}
        </div>
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
