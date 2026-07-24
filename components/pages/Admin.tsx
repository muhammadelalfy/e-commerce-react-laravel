"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn, Thumb, money } from "../ui";
import { VENDORS, PRODUCTS, CITIES, REELS, EVENTS, CATS } from "@/lib/data";
import { GULF_COUNTRIES } from "../CountryModal";

type Go = (page: string, id?: string | null) => void;

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)" };
const aBtn = (c: string, bg: string): React.CSSProperties => ({ width: 34, height: 34, borderRadius: 9, border: "none", background: bg, color: c, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 });

function Head({ title, action }: { title: string; action?: React.ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}><h1 style={{ margin: 0, fontSize: 23, fontWeight: 800 }}>{title}</h1>{action}</div>;
}

/** Renders children into document.body so fixed-position modals escape any
 *  transformed / sticky ancestor (fixes the modal being covered by the sidebar). */
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export function Admin({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const [tab, setTab] = useState("overview");
  const nav: [string, string, string][] = [
    ["overview", ar ? "نظرة عامة" : "Overview", "grid"],
    ["users", ar ? "المستخدمون" : "Users", "users"],
    ["vendors", ar ? "المتاجر" : "Vendors", "store"],
    ["approval", ar ? "موافقة المنتجات" : "Approvals", "check"],
    ["countries", ar ? "الدول" : "Countries", "globe"],
    ["cities", ar ? "المدن" : "Cities", "pin"],
    ["ads", ar ? "الإعلانات" : "Ads", "calendar"],
    ["reels", ar ? "الريلز" : "Reels", "reel"],
    ["roles", ar ? "الأدوار والصلاحيات" : "Roles & permissions", "lock"],
    ["subs", ar ? "الاشتراكات" : "Subscriptions", "ticket"],
    ["content", ar ? "محتوى التطبيق" : "Content", "filePdf"],
  ];
  return (
    <div className="container" style={{ paddingTop: 24, display: "grid", gridTemplateColumns: "230px 1fr", gap: 24, alignItems: "start" }}>
      <aside style={{ ...card, padding: 16, position: "sticky", top: 90 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 6px 16px", borderBottom: "1px solid var(--line)", marginBottom: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 11, background: "var(--topbar)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="shield" size={20} /></span>
          <div><div style={{ fontWeight: 800, fontSize: 14 }}>{ar ? "إدارة أوفرز" : "Offers Admin"}</div><div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{ar ? "مدير" : "Administrator"}</div></div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(([k, l, ic]) => (
            <button key={k} onClick={() => setTab(k)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, border: "none", textAlign: "start", fontSize: 13.5, fontWeight: 600, background: tab === k ? "var(--brand-soft)" : "transparent", color: tab === k ? "var(--brand)" : "var(--text-2)" }}>
              <Icon name={ic} size={17} />{l}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 14 }}><Btn full size="sm" variant="outline" onClick={() => go("home")}><Icon name="logout" size={15} />{ar ? "خروج" : "Exit"}</Btn></div>
      </aside>
      <div>
        {tab === "overview" && <AdminOverview ar={ar} lang={lang} />}
        {tab === "approval" && <AdminApproval ar={ar} lang={lang} />}
        {tab === "users" && <AdminUsers ar={ar} />}
        {tab === "vendors" && <AdminVendors ar={ar} go={go} />}
        {tab === "countries" && <AdminCountries ar={ar} />}
        {tab === "cities" && <AdminCities ar={ar} />}
        {tab === "ads" && <AdminAds ar={ar} />}
        {tab === "reels" && <AdminReels ar={ar} />}
        {tab === "roles" && <AdminRoles ar={ar} />}
        {tab === "subs" && <AdminSubs ar={ar} />}
        {tab === "content" && <AdminContent ar={ar} />}
      </div>
    </div>
  );
}

function AdminOverview({ ar, lang }: { ar: boolean; lang: string }) {
  const stats: [string, string, string, string, string][] = [
    [ar ? "إجمالي المستخدمين" : "Total users", "12,480", "+8%", "users", "var(--brand-soft)"],
    [ar ? "المتاجر النشطة" : "Active vendors", "242", "+12", "store", "#d5e5fe"],
    [ar ? "المنتجات" : "Products", "3,860", "+124", "tag", "#fef3c7"],
    [ar ? "إيراد الاشتراكات" : "Subs revenue", money(86400, lang as any), "+15%", "ticket", "var(--active-bg)"],
  ];
  const bars: [string, number][] = ar ? [["يناير", 40], ["فبراير", 55], ["مارس", 48], ["أبريل", 70], ["مايو", 62], ["يونيو", 88]]
    : [["Jan", 40], ["Feb", 55], ["Mar", 48], ["Apr", 70], ["May", 62], ["Jun", 88]];
  const cats = CATS.slice(0, 5);
  return (
    <div>
      <Head title={ar ? "نظرة عامة" : "Overview"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {stats.map(([l, v, dd, ic, tint]) => (
          <div key={l} style={{ ...card, padding: 18 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: tint, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}><Icon name={ic} size={20} /></span>
            <div className="num" style={{ fontSize: 24, fontWeight: 800, marginTop: 12 }}>{v}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 2 }}>{l} <span style={{ color: "var(--active)", fontWeight: 700 }} className="num">{dd}</span></div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
        <div style={{ ...card, padding: 22 }}>
          <div style={{ fontWeight: 800, marginBottom: 18 }}>{ar ? "المبيعات الشهرية" : "Monthly sales"}</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 180 }}>
            {bars.map(([m, h]) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: "100%", maxWidth: 38, height: h * 1.7, borderRadius: "6px 6px 0 0", background: "linear-gradient(var(--brand), var(--brand-strong))" }} />
                <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...card, padding: 22 }}>
          <div style={{ fontWeight: 800, marginBottom: 18 }}>{ar ? "التصنيفات الأعلى" : "Top categories"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cats.map((c, i) => {
              const pct = [82, 68, 54, 40, 30][i];
              return (
                <div key={c.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}><span style={{ fontWeight: 600 }}>{ar ? c.ar : c.en}</span><span className="num" style={{ color: "var(--text-3)" }}>{pct}%</span></div>
                  <div style={{ height: 8, borderRadius: 999, background: "var(--surface-2)" }}><div style={{ width: pct + "%", height: "100%", borderRadius: 999, background: "var(--brand)" }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminApproval({ ar, lang }: { ar: boolean; lang: string }) {
  const seed = PRODUCTS.slice(0, 6).map((p, i) => ({ ...p, st: i < 2 ? "WAITING" : i < 5 ? "APPROVED" : "REJECTED" }));
  const [rows, setRows] = useState(seed);
  const setSt = (id: string, st: string) => setRows((r) => r.map((x) => x.id === id ? { ...x, st } : x));
  const stMeta: Record<string, [string, string, string]> = { WAITING: [ar ? "بانتظار" : "Waiting", "var(--star)", "#fef3c7"], APPROVED: [ar ? "مقبول" : "Approved", "var(--active)", "var(--active-bg)"], REJECTED: [ar ? "مرفوض" : "Rejected", "var(--sale)", "var(--brand-soft)"] };
  return (
    <div>
      <Head title={ar ? "موافقة المنتجات" : "Product approvals"} />
      <div style={{ ...card, overflow: "hidden" }}>
        {rows.map((p) => {
          const [lbl, col, bg] = stMeta[p.st];
          return (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1.2fr 1.5fr", gap: 12, alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--line-soft)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, flex: "none" }}><Thumb p={p} radius="10px" /></div>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>{ar ? p.ar : p.en}</div><div style={{ fontSize: 12, color: "var(--text-3)" }}>{ar ? VENDORS[p.vendor].ar : VENDORS[p.vendor].en}</div></div>
              </div>
              <div className="num" style={{ fontWeight: 700 }}>{money(p.price, lang as any)}</div>
              <span style={{ justifySelf: "start", background: bg, color: col, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{lbl}</span>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setSt(p.id, "APPROVED")} title="approve" style={aBtn("var(--active)", "var(--active-bg)")}><Icon name="check" size={16} /></button>
                <button onClick={() => setSt(p.id, "REJECTED")} title="reject" style={aBtn("var(--sale)", "var(--brand-soft)")}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface UserRow { name: string; role: string; city: string; status: string; }
function AdminUsers({ ar }: { ar: boolean }) {
  const seed: UserRow[] = ar
    ? [{ name: "محمد العتيبي", role: "USER", city: "الرياض", status: "نشط" }, { name: "متجر تك زون", role: "VENDOR", city: "الرياض", status: "نشط" }, { name: "سارة القحطاني", role: "USER", city: "جدة", status: "نشط" }, { name: "العربية للعود", role: "VENDOR", city: "جدة", status: "نشط" }, { name: "خالد الشهري", role: "USER", city: "أبها", status: "موقوف" }, { name: "النخبة", role: "VENDOR", city: "الدمام", status: "نشط" }]
    : [{ name: "Mohammed Al-Otaibi", role: "USER", city: "Riyadh", status: "Active" }, { name: "Tech Zone", role: "VENDOR", city: "Riyadh", status: "Active" }, { name: "Sara Al-Qahtani", role: "USER", city: "Jeddah", status: "Active" }, { name: "Al-Arabia Oud", role: "VENDOR", city: "Jeddah", status: "Active" }, { name: "Khaled Al-Shehri", role: "USER", city: "Abha", status: "Suspended" }, { name: "Al-Nakhba", role: "VENDOR", city: "Dammam", status: "Active" }];
  const [rows, setRows] = useState<UserRow[]>(seed);
  const [modal, setModal] = useState(false);
  const roleC: Record<string, string> = { USER: "var(--blue)", VENDOR: "var(--brand)", ADMIN: "var(--topbar)", REELS: "var(--star)" };
  return (
    <div>
      <Head title={ar ? "المستخدمون والبائعون" : "Users & vendors"} action={<Btn size="sm" onClick={() => setModal(true)}><Icon name="plus" size={15} />{ar ? "إضافة" : "Add"}</Btn>} />
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.6fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line)", fontSize: 12, fontWeight: 700, color: "var(--text-3)" }}>
          <span>{ar ? "الاسم" : "Name"}</span><span>{ar ? "الدور" : "Role"}</span><span>{ar ? "المدينة" : "City"}</span><span>{ar ? "الحالة" : "Status"}</span><span></span>
        </div>
        {rows.map((u, i) => (
          <div key={u.name + i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.6fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 32, height: 32, borderRadius: 999, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}><Icon name="user" size={16} /></span><span style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</span></div>
            <span><span style={{ background: (roleC[u.role] || "var(--text-3)") + "1a", color: roleC[u.role] || "var(--text-3)", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}>{u.role}</span></span>
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>{u.city}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: /موقوف|Suspend/.test(u.status) ? "var(--sale)" : "var(--active)" }}>{u.status}</span>
            <button onClick={() => setRows((r) => r.filter((x) => x !== u))} title="delete" style={{ background: "transparent", border: "none", color: "var(--sale)", justifySelf: "end" }}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
      {modal && (
        <AdminModal ar={ar} title={ar ? "مستخدم جديد" : "New user"} onClose={() => setModal(false)}
          onSave={(v) => { setRows((r) => [{ name: v.name || (ar ? "مستخدم" : "User"), role: v.role || "USER", city: v.city || (ar ? "الرياض" : "Riyadh"), status: ar ? "نشط" : "Active" }, ...r]); setModal(false); }}
          fields={[
            { key: "name", label: ar ? "الاسم" : "Name", placeholder: ar ? "الاسم الكامل" : "Full name" },
            { key: "role", label: ar ? "الدور" : "Role", type: "select", options: ["USER", "VENDOR", "REELS", "ADMIN"] },
            { key: "city", label: ar ? "المدينة" : "City", type: "select", options: CITIES.map((c) => (ar ? c.ar : c.en)) },
          ]} />
      )}
    </div>
  );
}

function AdminVendors({ ar, go }: { ar: boolean; go: Go }) {
  return (
    <div>
      <Head title={ar ? "المتاجر" : "Vendors"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {Object.values(VENDORS).map((v) => (
          <div key={v.id} style={{ ...card, padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ width: 52, height: 52, borderRadius: 13, background: v.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" }}><Icon name="store" size={24} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15.5 }}>{ar ? v.ar : v.en}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 3 }}>{ar ? v.city.ar : v.city.en} · <span className="num">{v.reviews}</span> {ar ? "تقييم" : "reviews"} · <span className="num">{(v.followers / 1000).toFixed(1)}k</span> {ar ? "متابع" : "followers"}</div>
            </div>
            <Btn size="sm" variant="outline" onClick={() => go("vendor", v.id)}>{ar ? "عرض" : "View"}</Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

interface CountryRow { id: string; ar: string; en: string; flag: string; dial: string; }
function AdminCountries({ ar }: { ar: boolean }) {
  const [rows, setRows] = useState<CountryRow[]>(GULF_COUNTRIES.map((c) => ({ id: c.id, ar: c.ar, en: c.en, flag: c.flag, dial: c.dial })));
  const [modal, setModal] = useState(false);
  return (
    <div>
      <Head title={ar ? "الدول" : "Countries"} action={<Btn size="sm" onClick={() => setModal(true)}><Icon name="plus" size={15} />{ar ? "دولة جديدة" : "New country"}</Btn>} />
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.6fr 2fr 1fr 0.8fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line)", fontSize: 12, fontWeight: 700, color: "var(--text-3)" }}>
          <span>{ar ? "العلم" : "Flag"}</span><span>{ar ? "الدولة" : "Country"}</span><span>{ar ? "رمز الاتصال" : "Dial code"}</span><span></span>
        </div>
        {rows.map((c) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "0.6fr 2fr 1fr 0.8fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
            <span style={{ fontSize: 24 }}>{c.flag}</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{ar ? c.ar : c.en}</span>
            <span className="num" style={{ fontSize: 13, color: "var(--text-2)" }}>{c.dial}</span>
            <button onClick={() => setRows((r) => r.filter((x) => x.id !== c.id))} title="delete" style={{ background: "transparent", border: "none", color: "var(--sale)", justifySelf: "end" }}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
      {modal && (
        <AdminModal ar={ar} title={ar ? "دولة جديدة" : "New country"} onClose={() => setModal(false)}
          onSave={(v) => { const name = v.name || (ar ? "دولة" : "Country"); setRows((r) => [...r, { id: "c" + Date.now(), ar: name, en: v.en || name, flag: v.flag || "🏳️", dial: v.dial || "+" }]); setModal(false); }}
          fields={[
            { key: "name", label: ar ? "اسم الدولة (عربي)" : "Country name (AR)", placeholder: ar ? "مثال: مصر" : "e.g. Egypt" },
            { key: "en", label: ar ? "الاسم بالإنجليزية" : "Country name (EN)", placeholder: "e.g. Egypt" },
            { key: "flag", label: ar ? "العلم (إيموجي)" : "Flag (emoji)", placeholder: "🇪🇬" },
            { key: "dial", label: ar ? "رمز الاتصال" : "Dial code", placeholder: "+20" },
          ]} />
      )}
    </div>
  );
}

interface CityRow { ar: string; en: string; stores: number; }
function AdminCities({ ar }: { ar: boolean }) {
  const [rows, setRows] = useState<CityRow[]>(CITIES.map((c) => ({ ar: c.ar, en: c.en, stores: c.stores })));
  const [modal, setModal] = useState(false);
  return (
    <div>
      <Head title={ar ? "المدن والدول" : "Cities & countries"} action={<Btn size="sm" onClick={() => setModal(true)}><Icon name="plus" size={15} />{ar ? "مدينة جديدة" : "New city"}</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {rows.map((c, i) => (
          <div key={(ar ? c.ar : c.en) + i} style={{ ...card, padding: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="pin" size={20} /></span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{ar ? c.ar : c.en}</div><div className="num" style={{ fontSize: 12, color: "var(--text-3)" }}>{c.stores} {ar ? "متجر" : "stores"}</div></div>
            <button onClick={() => setRows((r) => r.filter((x) => x !== c))} title="delete" style={{ background: "transparent", border: "none", color: "var(--sale)" }}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
      {modal && (
        <AdminModal ar={ar} title={ar ? "مدينة جديدة" : "New city"} onClose={() => setModal(false)}
          onSave={(v) => { const name = v.name || (ar ? "مدينة" : "City"); setRows((r) => [{ ar: name, en: v.en || name, stores: Number(v.stores) || 0 }, ...r]); setModal(false); }}
          fields={[
            { key: "name", label: ar ? "اسم المدينة (عربي)" : "City name (AR)", placeholder: ar ? "مثال: تبوك" : "e.g. Tabuk" },
            { key: "en", label: ar ? "الاسم بالإنجليزية" : "City name (EN)", placeholder: "e.g. Tabuk" },
            { key: "stores", label: ar ? "عدد المتاجر" : "Stores count", type: "number" },
          ]} />
      )}
    </div>
  );
}

interface AdRow { id: string; ar: string; en: string; city: string; date: string; img: string; tint: string; live: boolean; }
function AdminAds({ ar }: { ar: boolean }) {
  const [rows, setRows] = useState<AdRow[]>(EVENTS.map((e) => ({ id: e.id, ar: e.ar, en: e.en, city: ar ? e.city.ar : e.city.en, date: ar ? e.date.ar : e.date.en, img: e.img, tint: e.tint, live: e.live })));
  const [modal, setModal] = useState(false);
  return (
    <div>
      <Head title={ar ? "الإعلانات والفعاليات" : "Ads & events"} action={<Btn size="sm" onClick={() => setModal(true)}><Icon name="plus" size={15} />{ar ? "إعلان جديد" : "New ad"}</Btn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((e, i) => (
          <div key={e.id} style={{ ...card, padding: 14, display: "flex", gap: 14, alignItems: "center" }}>
            <span className="num" style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--text-3)", flex: "none" }}>{i + 1}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div style={{ width: 64, height: 44, borderRadius: 8, overflow: "hidden", flex: "none", background: e.tint }}><img src={e.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{ar ? e.ar : e.en}</div><div style={{ fontSize: 12, color: "var(--text-3)" }}>{e.city} · {e.date}</div></div>
            {e.live && <span style={{ background: "var(--active-bg)", color: "var(--active)", fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{ar ? "مباشر" : "Live"}</span>}
            <button onClick={() => setRows((r) => r.filter((x) => x.id !== e.id))} title="delete" style={{ background: "transparent", border: "none", color: "var(--sale)" }}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
      {modal && (
        <AdminModal ar={ar} title={ar ? "إعلان / فعالية جديدة" : "New ad / event"} onClose={() => setModal(false)}
          onSave={(v) => { const t = v.title || (ar ? "إعلان جديد" : "New ad"); setRows((r) => [{ id: "ad" + Date.now(), ar: t, en: v.en || t, city: v.city || (ar ? "الرياض" : "Riyadh"), date: v.date || "—", img: (CATS.find((c) => c.id === v.cat)?.img) || "/img/cat-electronics.png", tint: "#e6eef7", live: v.live === "نعم" || v.live === "Yes" }, ...r]); setModal(false); }}
          fields={[
            { key: "title", label: ar ? "عنوان الإعلان" : "Ad title", placeholder: ar ? "مثال: مهرجان الصيف" : "e.g. Summer Festival" },
            { key: "city", label: ar ? "المدينة" : "City", type: "select", options: CITIES.map((c) => (ar ? c.ar : c.en)) },
            { key: "date", label: ar ? "التاريخ" : "Date", placeholder: ar ? "١–٧ سبتمبر" : "Sep 1–7" },
            { key: "cat", label: ar ? "القسم" : "Category", type: "select", options: CATS.map((c) => c.id) },
            { key: "live", label: ar ? "مباشر؟" : "Live?", type: "select", options: ar ? ["لا", "نعم"] : ["No", "Yes"] },
          ]} />
      )}
    </div>
  );
}

function AdminReels({ ar }: { ar: boolean }) {
  const [rows, setRows] = useState(REELS.map((r) => ({ ...r })));
  return (
    <div>
      <Head title={ar ? "إدارة الريلز" : "Reels moderation"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {rows.map((r) => (
          <div key={r.id} style={{ ...card, overflow: "hidden" }}>
            <div style={{ position: "relative", aspectRatio: "16 / 10", background: "#0c1016" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .85 }} />
              <span style={{ position: "absolute", top: 8, insetInlineStart: 8, background: r.status === "APPROVED" ? "var(--active)" : "var(--star)", color: r.status === "APPROVED" ? "#fff" : "#3a2c00", fontSize: 10.5, fontWeight: 800, padding: "3px 8px", borderRadius: 999 }}>{r.status === "APPROVED" ? (ar ? "مقبول" : "Approved") : (ar ? "بانتظار" : "Pending")}</span>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>{ar ? r.ar : r.en}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 12 }}>{ar ? VENDORS[r.vendor].ar : VENDORS[r.vendor].en} · <span className="num">{(r.views / 1000).toFixed(1)}k</span> {ar ? "مشاهدة" : "views"}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn size="sm" full onClick={() => setRows((s) => s.map((x) => x.id === r.id ? { ...x, status: "APPROVED" } : x))}>{ar ? "قبول" : "Approve"}</Btn>
                <Btn size="sm" variant="outline" onClick={() => setRows((s) => s.map((x) => x.id === r.id ? { ...x, status: "PENDING" } : x))}>{ar ? "رفض" : "Reject"}</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSubs({ ar }: { ar: boolean }) {
  const rows: [string, string, string, string][] = ar
    ? [["تك زون", "احترافي", "نشط", "٣٠ يوليو"], ["العربية للعود", "احترافي", "نشط", "١٥ أغسطس"], ["أناقة", "متاجر", "نشط", "١ سبتمبر"], ["النخبة", "أساسي", "منتهٍ", "—"]]
    : [["Tech Zone", "Pro", "Active", "Jul 30"], ["Al-Arabia Oud", "Pro", "Active", "Aug 15"], ["Anaqa", "Enterprise", "Active", "Sep 1"], ["Al-Nakhba", "Basic", "Expired", "—"]];
  return (
    <div>
      <Head title={ar ? "الاشتراكات" : "Subscriptions"} />
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line)", fontSize: 12, fontWeight: 700, color: "var(--text-3)" }}>
          <span>{ar ? "المتجر" : "Store"}</span><span>{ar ? "الباقة" : "Plan"}</span><span>{ar ? "الحالة" : "Status"}</span><span>{ar ? "ينتهي" : "Expires"}</span>
        </div>
        {rows.map(([s, plan, st, exp]) => (
          <div key={s} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>{s}</span>
            <span><span style={{ background: "var(--brand-soft)", color: "var(--brand)", fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{plan}</span></span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: /منتهٍ|Expired/.test(st) ? "var(--sale)" : "var(--active)" }}>{st}</span>
            <span className="num" style={{ fontSize: 13, color: "var(--text-2)" }}>{exp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminContent({ ar }: { ar: boolean }) {
  const pages: [string, string][] = ar ? [["من نحن", "about"], ["شروط الاستخدام", "terms"], ["سياسة الخصوصية", "privacy"], ["الشحن والتوصيل", "shipping"], ["الإرجاع", "returns"], ["الأسئلة الشائعة", "faq"]]
    : [["About us", "about"], ["Terms of use", "terms"], ["Privacy policy", "privacy"], ["Shipping", "shipping"], ["Returns", "returns"], ["FAQ", "faq"]];
  return (
    <div>
      <Head title={ar ? "محتوى التطبيق" : "App content"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {pages.map(([l, k]) => (
          <div key={k} style={{ ...card, padding: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, background: "var(--surface-2)", color: "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="filePdf" size={19} /></span>
            <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{l}</span>
            <button style={{ background: "transparent", border: "none", color: "var(--brand)", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Icon name="edit" size={15} />{ar ? "تحرير" : "Edit"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ROLES & PERMISSIONS — Spatie-style CRUD
   Models: Permission (flat list, "action.subject" convention),
   Role (name + guard + set of permission ids). Full create/read/
   update/delete for both roles and permissions, plus assigning
   permissions to roles.
   ============================================================ */

interface Permission { id: string; name: string; group: string; ar: string; }
interface RoleRec { id: string; name: string; ar: string; guard: string; permissions: string[]; users: number; system?: boolean; }

// Arabic labels for permission groups
const GROUP_AR: Record<string, string> = {
  reels: "الريلز", products: "المنتجات", discounts: "الخصومات", auctions: "المزادات",
  orders: "الطلبات", users: "المستخدمون", system: "النظام", general: "عام",
};
const groupAr = (g: string) => GROUP_AR[g] || g;

const SEED_PERMISSIONS: Permission[] = [
  { id: "reels.create", name: "reels.create", group: "reels", ar: "إضافة ريلز" },
  { id: "reels.edit", name: "reels.edit", group: "reels", ar: "تعديل الريلز" },
  { id: "reels.delete", name: "reels.delete", group: "reels", ar: "حذف الريلز" },
  { id: "reels.approve", name: "reels.approve", group: "reels", ar: "الموافقة على الريلز" },
  { id: "products.create", name: "products.create", group: "products", ar: "إضافة منتجات" },
  { id: "products.edit", name: "products.edit", group: "products", ar: "تعديل المنتجات" },
  { id: "products.approve", name: "products.approve", group: "products", ar: "الموافقة على المنتجات" },
  { id: "discounts.manage", name: "discounts.manage", group: "discounts", ar: "إدارة الخصومات" },
  { id: "auctions.manage", name: "auctions.manage", group: "auctions", ar: "إدارة المزادات" },
  { id: "orders.view", name: "orders.view", group: "orders", ar: "عرض الطلبات" },
  { id: "users.manage", name: "users.manage", group: "users", ar: "إدارة المستخدمين" },
  { id: "roles.manage", name: "roles.manage", group: "system", ar: "إدارة الأدوار" },
  { id: "cities.manage", name: "cities.manage", group: "system", ar: "إدارة المدن" },
  { id: "content.edit", name: "content.edit", group: "system", ar: "تحرير المحتوى" },
];
const SEED_ROLES: RoleRec[] = [
  { id: "admin", name: "admin", ar: "مدير", guard: "web", permissions: SEED_PERMISSIONS.map((p) => p.id), users: 3, system: true },
  { id: "vendor", name: "vendor", ar: "تاجر", guard: "web", permissions: ["products.create", "products.edit", "discounts.manage", "auctions.manage", "orders.view"], users: 242 },
  { id: "reels", name: "reels", ar: "ناشر ريلز", guard: "web", permissions: ["reels.create"], users: 1 },
  { id: "customer", name: "customer", ar: "عميل", guard: "web", permissions: ["orders.view"], users: 12480 },
];

function AdminRoles({ ar }: { ar: boolean }) {
  const [perms, setPerms] = useState<Permission[]>(SEED_PERMISSIONS);
  const [roles, setRoles] = useState<RoleRec[]>(SEED_ROLES);
  const [view, setView] = useState<"roles" | "permissions">("roles");
  const [editRole, setEditRole] = useState<RoleRec | null>(null);
  const [newPerm, setNewPerm] = useState("");

  const groups = Array.from(new Set(perms.map((p) => p.group)));

  // ---- Role CRUD ----
  const saveRole = (r: RoleRec) => setRoles((s) => s.some((x) => x.id === r.id) ? s.map((x) => x.id === r.id ? r : x) : [...s, r]);
  const deleteRole = (id: string) => setRoles((s) => s.filter((x) => x.id !== id));
  // ---- Permission CRUD ----
  const addPerm = () => {
    const name = newPerm.trim().toLowerCase().replace(/\s+/g, ".");
    if (!name || perms.some((p) => p.id === name)) return;
    setPerms((s) => [...s, { id: name, name, group: name.split(".")[0] || "general", ar: name }]);
    setNewPerm("");
  };
  const deletePerm = (id: string) => {
    setPerms((s) => s.filter((p) => p.id !== id));
    setRoles((s) => s.map((r) => ({ ...r, permissions: r.permissions.filter((p) => p !== id) })));
  };

  return (
    <div>
      <Head title={ar ? "الأدوار والصلاحيات" : "Roles & Permissions"} action={
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setView("roles")} style={pill(view === "roles")}>{ar ? "الأدوار" : "Roles"}</button>
          <button onClick={() => setView("permissions")} style={pill(view === "permissions")}>{ar ? "الصلاحيات" : "Permissions"}</button>
        </div>
      } />

      {view === "roles" ? (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <Btn size="sm" onClick={() => setEditRole({ id: "", name: "", ar: "", guard: "web", permissions: [], users: 0 })}><Icon name="plus" size={15} />{ar ? "دور جديد" : "New role"}</Btn>
          </div>
          <div style={{ ...card, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 2fr 0.8fr 1fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line)", fontSize: 12, fontWeight: 700, color: "var(--text-3)" }}>
              <span>{ar ? "الدور" : "Role"}</span><span>{ar ? "الحارس" : "Guard"}</span><span>{ar ? "الصلاحيات" : "Permissions"}</span><span>{ar ? "المستخدمون" : "Users"}</span><span></span>
            </div>
            {roles.map((r) => (
              <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 2fr 0.8fr 1fr", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13.5 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name="shield" size={16} /></span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span>{ar ? (r.ar || r.name) : r.name}</span>
                    {ar && <span className="num" style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 500 }}>{r.name}</span>}
                  </span>
                  {r.system && <span style={{ fontSize: 10, background: "var(--surface-2)", color: "var(--text-3)", padding: "1px 6px", borderRadius: 6 }}>{ar ? "نظامي" : "system"}</span>}
                </span>
                <span className="num" style={{ fontSize: 12.5, color: "var(--text-2)" }}>{r.guard}</span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {r.permissions.slice(0, 3).map((p) => { const pm = perms.find((x) => x.id === p); return <span key={p} style={{ fontSize: 11, background: "var(--surface-2)", color: "var(--text-2)", padding: "2px 7px", borderRadius: 6 }}>{ar ? (pm?.ar || p) : p}</span>; })}
                  {r.permissions.length > 3 && <span className="num" style={{ fontSize: 11, color: "var(--text-3)" }}>+{r.permissions.length - 3}</span>}
                  {r.permissions.length === 0 && <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{ar ? "لا صلاحيات" : "none"}</span>}
                </span>
                <span className="num" style={{ fontWeight: 700, fontSize: 13 }}>{r.users.toLocaleString("en-US")}</span>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setEditRole(r)} title="edit" style={aBtn("var(--brand)", "var(--brand-soft)")}><Icon name="edit" size={15} /></button>
                  {!r.system && <button onClick={() => deleteRole(r.id)} title="delete" style={aBtn("var(--sale)", "var(--brand-soft)")}><Icon name="trash" size={15} /></button>}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input value={newPerm} onChange={(e) => setNewPerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPerm()} placeholder={ar ? "مثال: reels.publish" : "e.g. reels.publish"} style={{ flex: 1, maxWidth: 320, height: 40, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 13.5, fontFamily: "inherit" }} className="num" />
            <Btn size="sm" onClick={addPerm}><Icon name="plus" size={15} />{ar ? "إضافة صلاحية" : "Add permission"}</Btn>
          </div>
          {groups.map((g) => (
            <div key={g} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-2)", marginBottom: 8 }}>{ar ? groupAr(g) : g}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {perms.filter((p) => p.group === g).map((p) => (
                  <span key={p.id} style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: "6px 12px", fontSize: 12.5, fontWeight: 600 }}>
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                      <span>{ar ? p.ar : p.name}</span>
                      {ar && <span className="num" style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 500 }}>{p.name}</span>}
                    </span>
                    <button onClick={() => deletePerm(p.id)} style={{ background: "transparent", border: "none", color: "var(--sale)", display: "flex", padding: 0 }}><Icon name="trash" size={13} /></button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {editRole && <RoleModal ar={ar} role={editRole} perms={perms} groups={groups} onClose={() => setEditRole(null)} onSave={(r) => { saveRole(r); setEditRole(null); }} />}
    </div>
  );
}
const pill = (on: boolean): React.CSSProperties => ({ padding: "7px 14px", borderRadius: 999, border: "1.5px solid " + (on ? "var(--brand)" : "var(--line)"), background: on ? "var(--brand)" : "var(--surface)", color: on ? "#fff" : "var(--text-2)", fontWeight: 700, fontSize: 12.5 });

function RoleModal({ ar, role, perms, groups, onClose, onSave }: { ar: boolean; role: RoleRec; perms: Permission[]; groups: string[]; onClose: () => void; onSave: (r: RoleRec) => void }) {
  const [name, setName] = useState(role.name);
  const [arName, setArName] = useState(role.ar);
  const [guard, setGuard] = useState(role.guard);
  const [sel, setSel] = useState<string[]>(role.permissions);
  const isNew = !role.id;
  const toggle = (id: string) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleGroup = (g: string) => {
    const ids = perms.filter((p) => p.group === g).map((p) => p.id);
    const allOn = ids.every((id) => sel.includes(id));
    setSel((s) => allOn ? s.filter((x) => !ids.includes(x)) : Array.from(new Set([...s, ...ids])));
  };
  const save = () => {
    const id = role.id || name.trim().toLowerCase().replace(/\s+/g, "_");
    if (!name.trim()) return;
    onSave({ id, name: name.trim(), ar: arName.trim() || name.trim(), guard, permissions: sel, users: role.users, system: role.system });
  };
  return (
    <Portal>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,16,20,.6)", backdropFilter: "blur(3px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", width: "min(600px, 100%)", maxHeight: "90vh", overflow: "auto", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{isNew ? (ar ? "دور جديد" : "New role") : (ar ? "تعديل الدور" : "Edit role")}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 24, color: "var(--text-3)", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 0.8fr", gap: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{ar ? "اسم الدور (مفتاح)" : "Role name (key)"}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} disabled={role.system} placeholder="editor" style={{ height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" }} className="num" />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{ar ? "الاسم بالعربية" : "Arabic name"}</span>
              <input value={arName} onChange={(e) => setArName(e.target.value)} placeholder={ar ? "محرّر" : "محرّر"} style={{ height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{ar ? "الحارس" : "Guard"}</span>
              <select value={guard} onChange={(e) => setGuard(e.target.value)} style={{ height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" }}>
                <option value="web">web</option><option value="api">api</option>
              </select>
            </label>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{ar ? "الصلاحيات" : "Permissions"}</span>
              <span className="num" style={{ fontSize: 12, color: "var(--text-3)" }}>{sel.length}/{perms.length}</span>
            </div>
            {groups.map((g) => {
              const ids = perms.filter((p) => p.group === g).map((p) => p.id);
              const allOn = ids.every((id) => sel.includes(id));
              return (
                <div key={g} style={{ marginBottom: 12, border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
                  <button onClick={() => toggleGroup(g)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "var(--surface-2)", border: "none", fontSize: 12.5, fontWeight: 800, color: "var(--text-2)" }}>
                    {ar ? groupAr(g) : g}<span style={{ fontSize: 11, color: allOn ? "var(--brand)" : "var(--text-3)" }}>{allOn ? (ar ? "الكل ✓" : "all ✓") : (ar ? "تحديد الكل" : "select all")}</span>
                  </button>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 12 }}>
                    {perms.filter((p) => p.group === g).map((p) => {
                      const on = sel.includes(p.id);
                      return (
                        <button key={p.id} onClick={() => toggle(p.id)} title={p.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 999, border: "1.5px solid " + (on ? "var(--brand)" : "var(--line)"), background: on ? "var(--brand-soft)" : "var(--surface)", color: on ? "var(--brand)" : "var(--text-2)", fontWeight: 600, fontSize: 12 }}>
                          <Icon name={on ? "check" : "plus"} size={13} />{ar ? p.ar : p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid var(--line)" }}>
          <Btn variant="outline" onClick={onClose} style={{ flex: 1 }}>{ar ? "إلغاء" : "Cancel"}</Btn>
          <Btn onClick={save} style={{ flex: 2 }}><Icon name="check" size={16} />{ar ? "حفظ الدور" : "Save role"}</Btn>
        </div>
      </div>
    </div>
    </Portal>
  );
}

/* ---- Shared admin form modal (used by Users / Cities / Ads add buttons) ---- */
interface ModalField { key: string; label: string; placeholder?: string; type?: "text" | "number" | "select"; options?: string[]; }
function AdminModal({ ar, title, fields, onClose, onSave }: { ar: boolean; title: string; fields: ModalField[]; onClose: () => void; onSave: (values: Record<string, string>) => void }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.type === "select" ? (f.options?.[0] ?? "") : ""])));
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const fld: React.CSSProperties = { height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", width: "100%" };
  return (
    <Portal>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,16,20,.6)", backdropFilter: "blur(3px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", width: "min(520px, 100%)", maxHeight: "90vh", overflow: "auto", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 24, color: "var(--text-3)", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map((f) => (
            <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{f.label}</span>
              {f.type === "select" ? (
                <select value={values[f.key]} onChange={set(f.key)} style={fld}>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type === "number" ? "number" : "text"} value={values[f.key]} onChange={set(f.key)} placeholder={f.placeholder} style={fld} />
              )}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid var(--line)" }}>
          <Btn variant="outline" onClick={onClose} style={{ flex: 1 }}>{ar ? "إلغاء" : "Cancel"}</Btn>
          <Btn onClick={() => onSave(values)} style={{ flex: 2 }}><Icon name="check" size={16} />{ar ? "حفظ" : "Save"}</Btn>
        </div>
      </div>
    </div>
    </Portal>
  );
}
