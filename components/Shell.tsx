"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Stars, Thumb, money } from "./ui";
import { NOTIFS, VENDORS, type Product } from "@/lib/data";
import { useGeoStore } from "@/lib/geoStore";

/** Header chip showing the chosen country flag + city; click reopens the picker. */
export function LocationChip() {
  const { lang } = useApp();
  const ar = lang === "ar";
  const geo = useGeoStore();
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState<{ country: string; city: string } | null>(null);
  // read the saved selection only on the client (avoids SSR hydration mismatch)
  useEffect(() => {
    setMounted(true);
    const read = () => {
      const country = localStorage.getItem("mash_country");
      const city = localStorage.getItem("mash_city");
      setSel(country && city ? { country, city } : null);
    };
    read();
    window.addEventListener("mash:country-changed", read);
    return () => window.removeEventListener("mash:country-changed", read);
  }, []);
  const open = () => window.dispatchEvent(new CustomEvent("mash:open-country"));
  const btnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, height: 38, padding: "0 12px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text-2)", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" };
  // Render an identical (empty) button on the server and first client paint to
  // avoid a hydration mismatch; fill in flag+city once mounted & a selection exists.
  if (!mounted || !sel) {
    return <button suppressHydrationWarning aria-hidden style={{ ...btnStyle, visibility: "hidden" }} />;
  }
  const c = geo.countries.find((x) => x.id === sel.country);
  const flag = c?.flag ?? "🏳️";
  return (
    <button onClick={open} suppressHydrationWarning title={ar ? "تغيير الدولة والمدينة" : "Change country & city"} style={btnStyle}>
      <span style={{ fontSize: 16 }}>{flag}</span>
      <span className="mash-topbar-city">{sel.city}</span>
      <Icon name="chevron" size={14} style={{ color: "var(--text-3)" }} />
    </button>
  );
}

export function Logo() {
  // أوفرز brand mark — logo2 (gold + rose + navy geometric mark).
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo2.png"
        alt="أوفرز · Offers"
        height={52}
        style={{ height: 52, width: "auto", display: "block" }}
        className="mash-logo-img"
      />
    </div>
  );
}

export function TopBar() {
  const { t, toggleLang } = useApp();
  return (
    <div style={{ background: "var(--topbar)", color: "rgba(255,255,255,.85)", fontSize: 12.5 }}>
      <div className="container mash-topbar-row" style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Icon name="phone" size={14} /><span className="num">{t.phone}</span>
        </div>
        <div className="mash-topbar-promo" style={{ flex: 1, textAlign: "center", fontWeight: 600, color: "#fff" }}>{t.promo}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={toggleLang} style={{ background: "transparent", border: "none", color: "#fff", display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12.5 }}>
            <Icon name="globe" size={14} />{t.other}
          </button>
          <span className="mash-topbar-city" style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="location" size={14} />{t.city}</span>
        </div>
      </div>
    </div>
  );
}

function NotifDropdown({ go, onClose, lang }: { go: (p: string, id?: string | null) => void; onClose: () => void; lang: string }) {
  const ar = lang === "ar";
  const items = NOTIFS.slice(0, 5);
  const icons: Record<string, string> = { offer: "tag", auction: "gavel", order: "bag", approval: "check", event: "calendar", system: "bell" };
  const tint: Record<string, string> = { offer: "var(--brand-soft)", auction: "#fef3c7", order: "#d5e5fe", approval: "var(--active-bg)", event: "#fde8d6", system: "var(--surface-2)" };
  const unread = items.filter((n) => !n.read).length;
  return (
    <div style={{ position: "absolute", insetInlineEnd: 0, top: "calc(100% + 10px)", width: 360, maxWidth: "90vw", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-lg)", zIndex: 60, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>{ar ? "الإشعارات" : "Notifications"}</div>
        {unread > 0 && <span style={{ background: "var(--brand-soft)", color: "var(--brand)", fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }} className="num">{unread} {ar ? "جديد" : "new"}</span>}
      </div>
      <div style={{ maxHeight: 340, overflowY: "auto" }}>
        {items.map((n) => (
          <button key={n.id} onClick={() => { onClose(); go("notifications"); }} style={{ width: "100%", display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--line-soft)", background: n.read ? "transparent" : "var(--brand-soft)", textAlign: "start", border: "none", borderBottomWidth: 1, cursor: "pointer", alignItems: "center" }}>
            <span style={{ width: 38, height: 38, flex: "none", borderRadius: 10, background: tint[n.type], display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}><Icon name={icons[n.type]} size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text)", lineHeight: 1.4 }}>{ar ? n.ar : n.en}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{ar ? n.time : n.time_en}</div>
            </div>
            {!n.read && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--brand)", flex: "none" }} />}
          </button>
        ))}
      </div>
      <button onClick={() => { onClose(); go("notifications"); }} style={{ width: "100%", padding: 12, background: "transparent", border: "none", borderTop: "1px solid var(--line)", color: "var(--brand)", fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {ar ? "عرض كل الإشعارات" : "View all notifications"}<Icon name="arrow" size={16} />
      </button>
    </div>
  );
}

const iconBtn: React.CSSProperties = { width: 40, height: 40, borderRadius: 10, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center" };
const iconBtnText: React.CSSProperties = { height: 40, padding: "0 12px", borderRadius: 10, border: "none", background: "transparent", color: "var(--text)", display: "flex", alignItems: "center", gap: 7 };
const badge: React.CSSProperties = { position: "absolute", top: -7, insetInlineEnd: -8, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 999, background: "var(--sale)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };

export function Header({ go, onSearch, cur, favCount = 0, unread = 0 }: { go: (p: string, id?: string | null) => void; onSearch?: (v: string) => void; cur: string; favCount?: number; unread?: number; }) {
  const { t, theme, toggleTheme, lang } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!notifOpen) return;
    const close = () => setNotifOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [notifOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuOpen]);
  const navs = [
    { k: "discounts", page: "home" }, { k: "auctions", page: "auctions" },
    { k: "shop", page: "shop" },
    { k: "reels", page: "reels", lbl: { ar: "ريلز", en: "Reels" } },
    { k: "events", page: "events", lbl: { ar: "الفعاليات", en: "Events" } },
    { k: "map", page: "map", lbl: { ar: "خريطة المتاجر", en: "Stores map" } },
  ] as const;
  const navBg = theme === "dark" ? "rgba(22,28,38,0.82)" : "rgba(255,255,255,0.85)";
  return (
    <header style={{ background: scrolled ? navBg : "var(--header)", backdropFilter: scrolled ? "saturate(180%) blur(12px)" : "none", WebkitBackdropFilter: scrolled ? "saturate(180%) blur(12px)" : "none", borderBottom: "1px solid var(--line)", boxShadow: scrolled ? "0 6px 20px rgba(16,24,40,0.10)" : "none", position: "sticky", top: 0, zIndex: 30, transition: "box-shadow .25s ease, background-color .25s ease, border-color .25s ease" }}>
      <div className="container" style={{ height: scrolled ? 72 : 84, display: "flex", alignItems: "center", gap: 22, transition: "height .25s ease" }}>
        {/* burger (mobile only, via CSS) */}
        <button className="mash-burger" onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }} title="menu" style={{ ...iconBtn, display: "none" }}>
          <Icon name={menuOpen ? "arrow" : "menu"} size={20} />
        </button>
        <a href="#" onClick={(e) => { e.preventDefault(); go("home"); }}><Logo /></a>
        <nav className="mash-nav-desktop" style={{ display: "flex", gap: 2 }}>
          {navs.map((n, i) => (
            <a key={n.k} href="#" onClick={(e) => { e.preventDefault(); go(n.page); }}
              style={{ padding: "8px 10px", fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", color: (cur === n.page && i !== 0) || (i === 0 && cur === "home") ? "var(--brand)" : "var(--text-2)", borderRadius: 8 }}>
              {"lbl" in n && n.lbl ? n.lbl[t.dir === "rtl" ? "ar" : "en"] : t.nav[n.k as keyof typeof t.nav]}
            </a>
          ))}
        </nav>
        <div className="mash-search-desktop" style={{ flex: 1, position: "relative", maxWidth: 320 }}>
          <span style={{ position: "absolute", insetInlineStart: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}><Icon name="search" size={18} /></span>
          <input placeholder={t.search} onChange={(e) => onSearch && onSearch(e.target.value)}
            style={{ width: "100%", height: 42, paddingInlineStart: 42, paddingInlineEnd: 16, borderRadius: "var(--r-pill)", border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginInlineStart: "auto" }}>
          <LocationChip />
          <button onClick={toggleTheme} title="theme" style={iconBtn}><Icon name={theme === "dark" ? "sun" : "moon"} size={19} /></button>
          <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setNotifOpen((o) => !o)} title="notifications" style={{ ...iconBtn, position: "relative" }}>
              <Icon name="bell" size={19} />
              {unread > 0 && <span className="num" style={badge}>{unread}</span>}
            </button>
            {notifOpen && <NotifDropdown go={go} onClose={() => setNotifOpen(false)} lang={lang} />}
          </div>
          <button onClick={() => go("favorites")} title="favourites" style={{ ...iconBtn, position: "relative" }}>
            <Icon name="heart" size={19} />
            {favCount > 0 && <span className="num" style={badge}>{favCount}</span>}
          </button>
          <button onClick={() => go("auth")} style={iconBtnText}>
            <Icon name="user" size={19} /><span className="mash-topbar-city" style={{ fontSize: 13, fontWeight: 600 }}>{t.account}</span>
          </button>
        </div>
      </div>

      {/* mobile slide-down menu */}
      {menuOpen && (
        <div className="mash-mobile-menu" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMenuOpen(false)} style={{ ...iconBtn }}><Icon name="arrow" size={20} /></button>
          </div>
          <div style={{ position: "relative", marginBottom: 6 }}>
            <span style={{ position: "absolute", insetInlineStart: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}><Icon name="search" size={18} /></span>
            <input placeholder={t.search} onChange={(e) => onSearch && onSearch(e.target.value)}
              style={{ width: "100%", height: 44, paddingInlineStart: 42, paddingInlineEnd: 16, borderRadius: "var(--r-pill)", border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" }} />
          </div>
          {navs.map((n) => (
            <a key={n.k} href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); go(n.page); }}
              style={{ padding: "12px 10px", fontSize: 15.5, fontWeight: 700, color: "var(--text)", borderRadius: 10, borderBottom: "1px solid var(--line-soft)" }}>
              {"lbl" in n && n.lbl ? n.lbl[t.dir === "rtl" ? "ar" : "en"] : t.nav[n.k as keyof typeof t.nav]}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t, go } = useApp();
  type Target = string | [string, string];
  const data: Record<"ar" | "en", [string, [string, Target][]][]> = {
    ar: [["أوفرز", [["عن أوفرز", ["info", "about"]], ["خصومات أوفرز", "home"], ["مزادات أوفرز", "auctions"], ["ريلز", "reels"], ["الفعاليات", "events"], ["خريطة المتاجر", "map"]]],
      ["للبائعين", [["أضف متجرك", "addstore"], ["لوحة التحكم", "dashboard"], ["الأسعار", ["info", "pricing"]], ["الدعم", ["info", "contact"]]]],
      ["المساعدة", [["الشحن والتوصيل", ["info", "shipping"]], ["الإرجاع والاستبدال", ["info", "returns"]], ["الأسئلة الشائعة", ["info", "faq"]], ["تواصل معنا", ["info", "contact"]]]],
      ["الشركة", [["الشروط والأحكام", ["info", "terms"]], ["سياسة الخصوصية", ["info", "privacy"]], ["المدونة", ["info", "blog"]], ["لوحة الإدارة", "admin"]]]],
    en: [["Offers", [["About", ["info", "about"]], ["Discounts", "home"], ["Auctions", "auctions"], ["Reels", "reels"], ["Events", "events"], ["Stores map", "map"]]],
      ["For vendors", [["List your store", "addstore"], ["Dashboard", "dashboard"], ["Pricing", ["info", "pricing"]], ["Support", ["info", "contact"]]]],
      ["Help", [["Shipping & delivery", ["info", "shipping"]], ["Returns & exchange", ["info", "returns"]], ["FAQ", ["info", "faq"]], ["Contact us", ["info", "contact"]]]],
      ["Company", [["Terms", ["info", "terms"]], ["Privacy policy", ["info", "privacy"]], ["Blog", ["info", "blog"]], ["Admin panel", "admin"]]]],
  };
  const cols = data[t.dir === "rtl" ? "ar" : "en"];
  const nav = (target: Target) => Array.isArray(target) ? go(target[0], target[1]) : go(target);
  return (
    <footer style={{ background: "var(--header)", borderTop: "1px solid var(--line)", marginTop: 64 }}>
      <div className="container mash-footer-grid" style={{ padding: "48px 0 28px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 28 }}>
        <div className="mash-footer-brand">
          <Logo />
          <p style={{ color: "var(--text-2)", fontSize: 13.5, marginTop: 14, maxWidth: 260 }}>{t.tagline}. {t.multiTenant}.</p>
        </div>
        {cols.map(([h, links]) => (
          <div key={h}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{h}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {links.map(([l, target]) => <li key={l}><a href="#" onClick={(e) => { e.preventDefault(); nav(target); }} style={{ color: "var(--text-2)", fontSize: 13.5 }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}>{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="container mash-footer-bottom" style={{ padding: "18px 0", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, color: "var(--text-3)", fontSize: 12.5, flexWrap: "wrap" }}>
        <span>© 2026 {t.brand}. {t.dir === "rtl" ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
        <span style={{ display: "flex", gap: 16, flexWrap: "wrap" }}><span>Visa</span><span>Mastercard</span><span>mada</span><span>Apple Pay</span></span>
      </div>
    </footer>
  );
}

/* ---- Shared ProductCard ---- */
export function ProductCard({ p, go }: { p: Product; go: (page: string, id?: string | null) => void }) {
  const { t, lang, favs = [], toggleFav } = useApp();
  const name = lang === "ar" ? p.ar : p.en;
  const v = VENDORS[p.vendor];
  const vname = v ? (lang === "ar" ? v.ar : v.en) : "";
  const isFav = favs.includes(p.id);
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-sm)", border: "1px solid var(--line-soft)", transition: "box-shadow .18s, transform .18s", cursor: "pointer" }}
      onClick={() => go("vendor", p.vendor)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ position: "relative" }}>
        <Thumb p={p} ratio="16 / 10" radius="0" />
        <button onClick={(e) => { e.stopPropagation(); toggleFav && toggleFav(p.id); }} style={{ position: "absolute", top: 10, insetInlineEnd: 10, width: 34, height: 34, borderRadius: 999, border: "none", background: "rgba(255,255,255,.92)", color: "var(--brand)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="heart" size={17} fill={isFav ? "var(--brand)" : "none"} />
        </button>
      </div>
      <div style={{ height: 40, background: p.active ? "var(--sale)" : "var(--expired)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", color: "#fff" }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, fontFamily: "var(--font-body)" }}>
          {p.active ? <>{lang === "ar" ? "تخفيض" : "Save"} <span className="num">{p.discount}%</span> · {lang === "ar" ? "متبقٍّ" : "left"} <span className="num">{p.days} {t.days}</span></> : (lang === "ar" ? "انتهى العرض" : "Offer ended")}
        </span>
        <Icon name="tag" size={16} />
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "var(--font-body)", color: "var(--text)", lineHeight: 1.4 }}>{name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-sm)", padding: "7px 10px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span className="num" style={{ fontWeight: 800, fontSize: 15, color: "var(--brand)" }}>{money(p.price, lang)}</span>
            <span className="num" style={{ fontSize: 12.5, color: "var(--text-3)", textDecoration: "line-through" }}>{money(p.old, lang)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginInlineStart: "auto", minWidth: 0 }}>
            <span style={{ fontSize: 12.5, color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vname}</span>
            <span style={{ width: 26, height: 26, borderRadius: 6, background: v ? v.color : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><Icon name="store" size={14} /></span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
          <Stars value={p.rating} count={p.reviews} />
          <span style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 5, color: "var(--brand)", fontSize: 12.5, fontWeight: 700 }}>
            {t.visit}<Icon name="arrow" size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
