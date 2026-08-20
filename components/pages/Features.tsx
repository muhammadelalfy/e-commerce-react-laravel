"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn, Stars } from "../ui";
import { ProductCard } from "../Shell";
import { NOTIFS, REELS, EVENTS, CITIES, VENDORS, PRODUCTS } from "@/lib/data";
import { useReveal } from "@/lib/gsap";

type Go = (page: string, id?: string | null) => void;

function PageWrap({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 20 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)" }}><span className="hl">{title}</span></h1>
        {sub && <p style={{ margin: "10px 0 0", color: "var(--text-2)", fontSize: 14.5 }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Notifications() {
  const { lang } = useApp();
  const ar = lang === "ar";
  const [items, setItems] = useState(NOTIFS);
  const [tab, setTab] = useState("all");
  const icons: Record<string, string> = { offer: "tag", auction: "gavel", order: "bag", approval: "check", event: "calendar", system: "bell" };
  const tint: Record<string, string> = { offer: "var(--brand-soft)", auction: "#fef3c7", order: "#d5e5fe", approval: "var(--active-bg)", event: "#fde8d6", system: "var(--surface-2)" };
  const list = tab === "all" ? items : tab === "unread" ? items.filter((n) => !n.read) : items.filter((n) => n.topic === tab);
  const markAll = () => setItems((s) => s.map((n) => ({ ...n, read: true })));
  const tabs: [string, string][] = [["all", ar ? "الكل" : "All"], ["unread", ar ? "غير مقروء" : "Unread"], ["VENDORS", ar ? "البائعين" : "Vendors"], ["CUSTOMERS", ar ? "العملاء" : "Customers"]];
  return (
    <PageWrap title={ar ? "الإشعارات" : "Notifications"} sub={ar ? "تنبيهات العروض والمزادات والطلبات عبر Firebase." : "Offer, auction and order alerts via Firebase."}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding: "8px 14px", borderRadius: 999, border: "1.5px solid " + (tab === k ? "var(--brand)" : "var(--line)"), background: tab === k ? "var(--brand)" : "var(--surface)", color: tab === k ? "#fff" : "var(--text-2)", fontWeight: 700, fontSize: 13 }}>{l}</button>
          ))}
        </div>
        <button onClick={markAll} style={{ background: "transparent", border: "none", color: "var(--brand)", fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={16} />{ar ? "تعليم الكل كمقروء" : "Mark all read"}</button>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
        {list.map((n) => (
          <div key={n.id} onClick={() => setItems((s) => s.map((x) => x.id === n.id ? { ...x, read: true } : x))}
            style={{ display: "flex", gap: 14, padding: "16px 18px", borderBottom: "1px solid var(--line-soft)", background: n.read ? "transparent" : "var(--brand-soft)", cursor: "pointer", alignItems: "center" }}>
            <span style={{ width: 42, height: 42, flex: "none", borderRadius: 12, background: tint[n.type], display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}><Icon name={icons[n.type]} size={20} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ar ? n.ar : n.en}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 3, display: "flex", gap: 8 }}>
                <span>{ar ? n.time : n.time_en}</span>
                <span style={{ fontWeight: 700, color: "var(--text-3)" }}>· {n.topic === "VENDORS" ? (ar ? "بائعين" : "Vendors") : (ar ? "عملاء" : "Customers")}</span>
              </div>
            </div>
            {!n.read && <span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--brand)", flex: "none" }} />}
          </div>
        ))}
        {list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>{ar ? "لا توجد إشعارات" : "No notifications"}</div>}
      </div>
    </PageWrap>
  );
}

export function Reels() {
  const { lang } = useApp();
  const ar = lang === "ar";
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const grid = useReveal<HTMLDivElement>([lang]);
  return (
    <PageWrap title={ar ? "ريلز أوفرز" : "Offers Reels"} sub={ar ? "مقاطع قصيرة من المتاجر — منتجات وعروض وكواليس." : "Short clips from stores — products, offers and behind the scenes."}>
      <div ref={grid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        {REELS.map((r) => {
          const v = VENDORS[r.vendor]; const isLiked = liked[r.id];
          return (
            <div key={r.id} style={{ position: "relative", borderRadius: "var(--r-lg)", overflow: "hidden", background: "#0c1016", aspectRatio: "9 / 16", boxShadow: "var(--shadow-sm)", cursor: "pointer" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.img} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .82 }} />
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,10,14,.92) 8%, rgba(8,10,14,.1) 50%, rgba(8,10,14,.45) 100%)" }} />
              <span style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", width: 52, height: 52, borderRadius: 999, background: "rgba(255,255,255,.22)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="play" size={24} fill="#fff" /></span>
              {r.status === "PENDING" && <span style={{ position: "absolute", top: 10, insetInlineStart: 10, background: "var(--star)", color: "#3a2c00", fontSize: 10.5, fontWeight: 800, padding: "3px 8px", borderRadius: 999 }}>{ar ? "قيد المراجعة" : "Pending"}</span>}
              <span style={{ position: "absolute", top: 10, insetInlineEnd: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,.4)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999 }}><Icon name="eye" size={12} /><span className="num">{(r.views / 1000).toFixed(1)}k</span></span>
              <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: 14, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 999, background: v.color, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name="store" size={14} /></span>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{ar ? v.ar : v.en}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4 }}>{ar ? r.ar : r.en}</p>
                <button onClick={(e) => { e.stopPropagation(); setLiked((s) => ({ ...s, [r.id]: !s[r.id] })); }} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#fff", fontSize: 12.5, fontWeight: 700 }}>
                  <Icon name="heart" size={16} fill={isLiked ? "var(--brand)" : "none"} style={{ color: isLiked ? "var(--brand)" : "#fff" }} /><span className="num">{((r.likes + (isLiked ? 1 : 0)) / 1000).toFixed(1)}k</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PageWrap>
  );
}

export function Events({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  return (
    <PageWrap title={ar ? "الفعاليات والإعلانات" : "Events & Ads"} sub={ar ? "مهرجانات وفعاليات تسوّق في مدن المملكة." : "Shopping festivals and events across the Kingdom."}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {EVENTS.map((e, i) => (
          <div key={e.id} style={{ display: "grid", gridTemplateColumns: i % 2 ? "1fr 1.3fr" : "1.3fr 1fr", gap: 0, borderRadius: "var(--r-xl)", overflow: "hidden", border: "1px solid var(--line)", background: "var(--surface)", minHeight: 220, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ position: "relative", order: i % 2, background: e.tint, minHeight: 220 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.img} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              {e.live && <span style={{ position: "absolute", top: 14, insetInlineStart: 14, display: "inline-flex", alignItems: "center", gap: 6, background: "var(--brand)", color: "#fff", fontSize: 11.5, fontWeight: 800, padding: "5px 11px", borderRadius: 999 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: "#fff" }} />{ar ? "مباشر" : "Live"}</span>}
            </div>
            <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 14, color: "var(--text-3)", fontSize: 12.5, fontWeight: 600 }}>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Icon name="calendar" size={15} />{ar ? e.date.ar : e.date.en}</span>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Icon name="pin" size={15} />{ar ? e.city.ar : e.city.en}</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>{ar ? e.ar : e.en}</h2>
              <p style={{ margin: 0, color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.6 }}>{ar ? e.ar_d : e.en_d}</p>
              <div style={{ marginTop: 6 }}><Btn onClick={() => go("home")}>{ar ? "اكتشف العروض" : "Explore offers"}</Btn></div>
            </div>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

export function StoresMap({ go, focus }: { go: Go; focus?: string | null }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const [city, setCity] = useState("riyadh");
  // browser geolocation: 'idle' → ask, 'asking', 'granted' (coords stored), 'denied', 'unavailable'
  const [geoStatus, setGeoStatus] = useState<"idle" | "asking" | "granted" | "denied" | "unavailable">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  // restore a previously granted location so we don't re-ask on every visit
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mash_geo");
      if (saved) { setCoords(JSON.parse(saved)); setGeoStatus("granted"); }
    } catch {}
  }, []);
  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) { setGeoStatus("unavailable"); return; }
    setGeoStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c); setGeoStatus("granted");
        try { localStorage.setItem("mash_geo", JSON.stringify(c)); } catch {}
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };
  const sel = CITIES.find((c) => c.id === city)!;
  const cityVendors = Object.values(VENDORS).filter((v) => (ar ? v.city.ar : v.city.en) === (ar ? sel.ar : sel.en));
  const base = cityVendors.length ? cityVendors : Object.values(VENDORS).slice(0, 3);
  // a store "has offers" if it has active discounted products
  const hasOffers = (vid: string) => PRODUCTS.some((p) => p.vendor === vid && p.active && p.discount > 0);
  // per-store distance (km): real-ish when we have the user's coords, else a fixed spread.
  // stores WITH offers are pulled closer so the "nearest with offers" is meaningful.
  const distOf = (v: (typeof VENDORS)[string], i: number) => {
    const seed = coords ? Math.abs((coords.lat * 31 + coords.lng * 17 + v.id.charCodeAt(0) * 7) % 90) / 10 : 2 + i * 1.3;
    return +(hasOffers(v.id) ? Math.max(0.4, seed * 0.5) : seed + 1).toFixed(1);
  };
  // when location is known, order the list by real distance
  const shown = coords ? [...base].sort((a, b) => distOf(a, base.indexOf(a)) - distOf(b, base.indexOf(b))) : base;
  // nearest store WITH offers
  const withOffers = shown.filter((v) => hasOffers(v.id));
  const nearestWithOffers = (focus === "nearest" || coords) ? withOffers[0] : undefined;
  return (
    <PageWrap title={ar ? "خريطة المتاجر" : "Stores Map"} sub={ar ? "اكتشف المتاجر القريبة منك على الخريطة (OpenStreetMap)." : "Find stores near you on the map (OpenStreetMap)."}>
      {/* location-access prompt — explains WHY we ask, then requests the browser permission */}
      {geoStatus !== "granted" && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", marginBottom: 18, borderRadius: "var(--r-lg)", border: "1.5px solid var(--brand)", background: "var(--brand-soft)", flexWrap: "wrap" }}>
          <span style={{ width: 44, height: 44, borderRadius: 12, background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" }}><Icon name="location" size={22} /></span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{ar ? "نحتاج إذن الوصول لموقعك" : "We need access to your location"}</div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 3 }}>
              {geoStatus === "denied"
                ? (ar ? "تم رفض الإذن. فعّل الوصول للموقع من إعدادات المتصفّح ثم أعد المحاولة." : "Permission denied. Enable location in your browser settings and try again.")
                : geoStatus === "unavailable"
                ? (ar ? "المتصفّح لا يدعم تحديد الموقع." : "Your browser does not support geolocation.")
                : (ar ? "لعرض أقرب المتاجر التي لديها عروض إليك." : "To show you the nearest stores that have offers.")}
            </div>
          </div>
          <Btn onClick={requestLocation} disabled={geoStatus === "asking"} style={{ flex: "none" }}>
            <Icon name="location" size={16} />
            {geoStatus === "asking" ? (ar ? "جارٍ التحديد…" : "Locating…") : geoStatus === "denied" ? (ar ? "إعادة المحاولة" : "Try again") : (ar ? "تفعيل الموقع" : "Enable location")}
          </Btn>
        </div>
      )}
      {geoStatus === "granted" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", marginBottom: 18, borderRadius: "var(--r-pill)", background: "var(--active-bg)", color: "var(--active)", fontWeight: 700, fontSize: 13, width: "fit-content" }}>
          <Icon name="check" size={16} />{ar ? "تم تفعيل موقعك — نعرض أقرب المتاجر التي لديها عروض" : "Location enabled — showing nearest stores with offers"}
        </div>
      )}
      {nearestWithOffers && (
        <button onClick={() => go("vendor", nearestWithOffers.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", marginBottom: 18, borderRadius: "var(--r-lg)", border: "1.5px solid var(--gold)", background: "var(--gold-soft)", color: "var(--text)", cursor: "pointer", textAlign: "start" }}>
          <span style={{ width: 46, height: 46, borderRadius: 12, background: nearestWithOffers.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" }}><Icon name="store" size={22} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--gold-deep)", display: "flex", alignItems: "center", gap: 5 }}><Icon name="location" size={13} />{ar ? "أقرب متجر لديه عروض" : "Nearest store with offers"}</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginTop: 3 }}>{ar ? nearestWithOffers.ar : nearestWithOffers.en}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{ar ? nearestWithOffers.city.ar : nearestWithOffers.city.en} · <span className="num">{distOf(nearestWithOffers, 0).toFixed(1)} {ar ? "كم" : "km"}</span></div>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--brand)", fontWeight: 700, fontSize: 13.5, flex: "none" }}>{ar ? "زيارة المتجر" : "Visit store"}<Icon name="arrow" size={16} /></span>
        </button>
      )}
      <div className="mash-map-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {CITIES.slice(0, 4).map((c) => (
              <button key={c.id} onClick={() => setCity(c.id)} style={{ padding: "7px 13px", borderRadius: 999, border: "1.5px solid " + (city === c.id ? "var(--brand)" : "var(--line)"), background: city === c.id ? "var(--brand)" : "var(--surface)", color: city === c.id ? "#fff" : "var(--text-2)", fontWeight: 700, fontSize: 12.5 }}>{ar ? c.ar : c.en}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {shown.map((v, i) => (
              <button key={v.id} onClick={() => go("vendor", v.id)} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderRadius: "var(--r-md)", border: "1px solid var(--line)", background: "var(--surface)", textAlign: "start", color: "var(--text)" }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: v.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" }}><Icon name="store" size={20} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{ar ? v.ar : v.en}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", display: "flex", gap: 6, alignItems: "center" }}><Stars value={v.rating} size={11} /> · <span className="num">{distOf(v, i).toFixed(1)} {ar ? "كم" : "km"}</span>{hasOffers(v.id) && <span style={{ background: "var(--gold-soft)", color: "var(--gold-deep)", fontWeight: 800, fontSize: 10.5, padding: "1px 6px", borderRadius: 999 }}>{ar ? "عروض" : "Offers"}</span>}</div>
                </div>
                <Icon name="arrow" size={16} style={{ color: "var(--text-3)" }} />
              </button>
            ))}
          </div>
        </div>
        <div className="mash-map-canvas" style={{ position: "relative", height: 640, borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--line)", background: "linear-gradient(135deg, #dce7e0 0%, #cdddd4 100%)" }}>
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: .5 }} preserveAspectRatio="none">
            <defs><pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="#a9c2b5" strokeWidth="1" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M0,180 Q200,120 420,210 T900,160" fill="none" stroke="#9fbcae" strokeWidth="6" />
            <path d="M120,0 Q160,200 90,460" fill="none" stroke="#9fbcae" strokeWidth="5" />
          </svg>
          {CITIES.map((c) => {
            const on = c.id === city;
            return (
              <button key={c.id} onClick={() => setCity(c.id)} title={ar ? c.ar : c.en}
                style={{ position: "absolute", left: c.x + "%", top: c.y + "%", transform: "translate(-50%,-100%)", background: "transparent", border: "none", cursor: "pointer", zIndex: on ? 5 : 1 }}>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ background: on ? "var(--brand)" : "#fff", color: on ? "#fff" : "var(--brand)", borderRadius: 999, padding: on ? "4px 10px" : "3px 8px", fontSize: 11.5, fontWeight: 800, boxShadow: "var(--shadow-md)", whiteSpace: "nowrap", border: "2px solid var(--brand)" }}>{ar ? c.ar : c.en} · <span className="num">{c.stores}</span></span>
                  <Icon name="pin" size={on ? 30 : 22} fill={on ? "var(--brand)" : "#fff"} style={{ color: "var(--brand)", marginTop: -2 }} />
                </span>
              </button>
            );
          })}
          <div style={{ position: "absolute", insetInlineEnd: 14, bottom: 14, background: "var(--surface)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "var(--text-2)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="pin" size={14} style={{ color: "var(--brand)" }} />{ar ? `${sel.stores} متجر في ${sel.ar}` : `${sel.stores} stores in ${sel.en}`}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

export function Favorites({ go, favs }: { go: Go; favs: string[]; toggleFav: (id: string) => void }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const items = PRODUCTS.filter((p) => favs.includes(p.id));
  if (!items.length) {
    return (
      <PageWrap title={ar ? "المفضلة" : "Favourites"}>
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: 80, height: 80, borderRadius: 999, background: "var(--surface-2)", color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><Icon name="heart" size={38} /></div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>{ar ? "لا توجد منتجات في المفضلة" : "No favourites yet"}</h2>
          <p style={{ color: "var(--text-2)" }}>{ar ? "اضغط القلب على أي منتج لحفظه هنا." : "Tap the heart on any product to save it here."}</p>
          <div style={{ marginTop: 18 }}><Btn size="lg" onClick={() => go("home")}>{ar ? "تصفّح العروض" : "Browse offers"}</Btn></div>
        </div>
      </PageWrap>
    );
  }
  return (
    <PageWrap title={ar ? "المفضلة" : "Favourites"} sub={ar ? `${items.length} منتج محفوظ` : `${items.length} saved`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        {items.map((p) => <ProductCard key={p.id} p={p} go={go} />)}
      </div>
    </PageWrap>
  );
}
