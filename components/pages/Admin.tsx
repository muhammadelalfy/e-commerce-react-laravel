"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn, Thumb, money } from "../ui";
import { VENDORS, PRODUCTS, CITIES, REELS, EVENTS, CATS } from "@/lib/data";

type Go = (page: string, id?: string | null) => void;

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)" };
const aBtn = (c: string, bg: string): React.CSSProperties => ({ width: 34, height: 34, borderRadius: 9, border: "none", background: bg, color: c, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 });

function Head({ title, action }: { title: string; action?: React.ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}><h1 style={{ margin: 0, fontSize: 23, fontWeight: 800 }}>{title}</h1>{action}</div>;
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
    ["cities", ar ? "المدن" : "Cities", "pin"],
    ["ads", ar ? "الإعلانات" : "Ads", "calendar"],
    ["reels", ar ? "الريلز" : "Reels", "reel"],
    ["subs", ar ? "الاشتراكات" : "Subscriptions", "ticket"],
    ["content", ar ? "محتوى التطبيق" : "Content", "filePdf"],
  ];
  return (
    <div className="container" style={{ paddingTop: 24, display: "grid", gridTemplateColumns: "230px 1fr", gap: 24, alignItems: "start" }}>
      <aside style={{ ...card, padding: 16, position: "sticky", top: 90 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 6px 16px", borderBottom: "1px solid var(--line)", marginBottom: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 11, background: "var(--topbar)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="shield" size={20} /></span>
          <div><div style={{ fontWeight: 800, fontSize: 14 }}>{ar ? "إدارة مشهور" : "Mashhoor Admin"}</div><div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{ar ? "مدير" : "Administrator"}</div></div>
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
        {tab === "cities" && <AdminCities ar={ar} />}
        {tab === "ads" && <AdminAds ar={ar} />}
        {tab === "reels" && <AdminReels ar={ar} />}
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

function AdminUsers({ ar }: { ar: boolean }) {
  const users: [string, string, string, string][] = ar
    ? [["محمد العتيبي", "USER", "الرياض", "نشط"], ["متجر تك زون", "VENDOR", "الرياض", "نشط"], ["سارة القحطاني", "USER", "جدة", "نشط"], ["العربية للعود", "VENDOR", "جدة", "نشط"], ["خالد الشهري", "USER", "أبها", "موقوف"], ["النخبة", "VENDOR", "الدمام", "نشط"]]
    : [["Mohammed Al-Otaibi", "USER", "Riyadh", "Active"], ["Tech Zone", "VENDOR", "Riyadh", "Active"], ["Sara Al-Qahtani", "USER", "Jeddah", "Active"], ["Al-Arabia Oud", "VENDOR", "Jeddah", "Active"], ["Khaled Al-Shehri", "USER", "Abha", "Suspended"], ["Al-Nakhba", "VENDOR", "Dammam", "Active"]];
  const roleC: Record<string, string> = { USER: "var(--blue)", VENDOR: "var(--brand)", ADMIN: "var(--topbar)" };
  return (
    <div>
      <Head title={ar ? "المستخدمون والبائعون" : "Users & vendors"} action={<Btn size="sm"><Icon name="plus" size={15} />{ar ? "إضافة" : "Add"}</Btn>} />
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.6fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line)", fontSize: 12, fontWeight: 700, color: "var(--text-3)" }}>
          <span>{ar ? "الاسم" : "Name"}</span><span>{ar ? "الدور" : "Role"}</span><span>{ar ? "المدينة" : "City"}</span><span>{ar ? "الحالة" : "Status"}</span><span></span>
        </div>
        {users.map(([n, role, city, st]) => (
          <div key={n} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.6fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 32, height: 32, borderRadius: 999, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}><Icon name="user" size={16} /></span><span style={{ fontWeight: 600, fontSize: 13.5 }}>{n}</span></div>
            <span><span style={{ background: roleC[role] + "1a", color: roleC[role], fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}>{role}</span></span>
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>{city}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: /موقوف|Suspend/.test(st) ? "var(--sale)" : "var(--active)" }}>{st}</span>
            <button style={{ background: "transparent", border: "none", color: "var(--text-3)", justifySelf: "end" }}><Icon name="edit" size={16} /></button>
          </div>
        ))}
      </div>
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

function AdminCities({ ar }: { ar: boolean }) {
  return (
    <div>
      <Head title={ar ? "المدن والدول" : "Cities & countries"} action={<Btn size="sm"><Icon name="plus" size={15} />{ar ? "مدينة جديدة" : "New city"}</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {CITIES.map((c) => (
          <div key={c.id} style={{ ...card, padding: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="pin" size={20} /></span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{ar ? c.ar : c.en}</div><div className="num" style={{ fontSize: 12, color: "var(--text-3)" }}>{c.stores} {ar ? "متجر" : "stores"}</div></div>
            <button style={{ background: "transparent", border: "none", color: "var(--text-3)" }}><Icon name="edit" size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAds({ ar }: { ar: boolean }) {
  return (
    <div>
      <Head title={ar ? "الإعلانات والفعاليات" : "Ads & events"} action={<Btn size="sm"><Icon name="plus" size={15} />{ar ? "إعلان جديد" : "New ad"}</Btn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {EVENTS.map((e, i) => (
          <div key={e.id} style={{ ...card, padding: 14, display: "flex", gap: 14, alignItems: "center" }}>
            <span className="num" style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--text-3)", flex: "none" }}>{i + 1}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div style={{ width: 64, height: 44, borderRadius: 8, overflow: "hidden", flex: "none", background: e.tint }}><img src={e.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{ar ? e.ar : e.en}</div><div style={{ fontSize: 12, color: "var(--text-3)" }}>{ar ? e.city.ar : e.city.en} · {ar ? e.date.ar : e.date.en}</div></div>
            {e.live && <span style={{ background: "var(--active-bg)", color: "var(--active)", fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{ar ? "مباشر" : "Live"}</span>}
            <button style={{ background: "transparent", border: "none", color: "var(--text-3)" }}><Icon name="edit" size={16} /></button>
            <button style={{ background: "transparent", border: "none", color: "var(--sale)" }}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
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
