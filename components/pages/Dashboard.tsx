"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn, Thumb, money } from "../ui";
import { PRODUCTS, VENDORS, COUPONS, PLANS, CATS } from "@/lib/data";

type Go = (page: string, id?: string | null) => void;

const inp: React.CSSProperties = { height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", width: "100%" };

function StatCard({ icon, label, value, sub, tint }: { icon: string; label: string; value: React.ReactNode; sub?: string; tint: string }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 18, boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ width: 40, height: 40, borderRadius: 12, background: tint, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}><Icon name={icon} size={20} /></span>
      </div>
      <div className="num" style={{ fontSize: 26, fontWeight: 800, marginTop: 14 }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--brand)", marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ width: 42, height: 24, borderRadius: 999, border: "none", padding: 3, background: on ? "var(--brand)" : "var(--line)", display: "flex", justifyContent: on ? "flex-end" : "flex-start", transition: "background .2s" }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.3)" }} />
    </button>
  );
}

function DField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>{children}</label>;
}

interface Row { id: string; ar: string; en: string; price: number; color: string; cat: string; pct: number; days: number; active: boolean; pending: boolean; img: string | null; }

export function Dashboard({ go }: { go: Go }) {
  const { t, lang } = useApp();
  const d = t.dash;
  const vendor = VENDORS.techzone;
  const seed: Row[] = PRODUCTS.filter((p) => p.vendor === "techzone").map((p) => ({ id: p.id, ar: p.ar, en: p.en, price: p.price, color: p.color, cat: p.cat, pct: p.discount, days: p.days, active: p.active, pending: false, img: p.img }));
  const [rows, setRows] = useState<Row[]>(seed);
  const [modal, setModal] = useState(false);
  const [dtab, setDtab] = useState("overview");
  const [visitors, setVisitors] = useState(12480);

  useEffect(() => {
    const id = setInterval(() => setVisitors((v) => v + Math.floor(Math.random() * 3)), 1500);
    return () => clearInterval(id);
  }, []);

  const toggle = (id: string) => setRows((r) => r.map((x) => x.id === id ? { ...x, active: !x.active } : x));
  const activeCount = rows.filter((x) => x.active).length;

  const nav: [string, string][] = [["overview", "grid"], ["products", "box"], ["discounts", "tag"], ["coupons", "ticket"], ["orders", "bag"], ["subscription", "ticket"], ["settings", "settings"]];
  const navLabel: Record<string, string> = { ...(d as any), coupons: lang === "ar" ? "الكوبونات" : "Coupons", subscription: lang === "ar" ? "الاشتراك" : "Subscription" };

  return (
    <div className="container" style={{ paddingTop: 24, display: "grid", gridTemplateColumns: "230px 1fr", gap: 24, alignItems: "start" }}>
      <aside style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 16, position: "sticky", top: 90 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 6px 16px", borderBottom: "1px solid var(--line)", marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: vendor.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="store" size={20} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>{lang === "ar" ? vendor.ar : vendor.en}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{d.role}</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(([k, ic]) => (
            <button key={k} onClick={() => setDtab(k)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, border: "none", textAlign: "start", fontSize: 14, fontWeight: 600, background: dtab === k ? "var(--brand-soft)" : "transparent", color: dtab === k ? "var(--brand)" : "var(--text-2)" }}>
              <Icon name={ic} size={18} />{navLabel[k]}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 14 }}><Btn full size="sm" onClick={() => go("home")}><Icon name="eye" size={15} />{lang === "ar" ? "عرض المتجر" : "View store"}</Btn></div>
      </aside>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{d.title}</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-3)" }}>{d.manager}</p>
          </div>
          <Btn onClick={() => setModal(true)}><Icon name="plus" size={17} />{d.addProduct}</Btn>
        </div>

        {dtab === "coupons" ? <CouponsPanel lang={lang} /> : dtab === "subscription" ? <SubscriptionPanel lang={lang} go={go} /> : dtab === "orders" ? <OrdersPanel lang={lang} /> : dtab === "settings" ? <SettingsPanel lang={lang} vendor={vendor} /> : (<>

          {dtab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              <StatCard icon="eye" label={d.visitors} value={<span>{visitors.toLocaleString("en-US")}</span>} sub={"+12% " + d.thisMonth} tint="var(--brand-soft)" />
              <StatCard icon="dollar" label={d.sales} value={money(48250, lang)} sub={"+8% " + d.thisMonth} tint="#e7f0ff" />
              <StatCard icon="tag" label={d.activeDiscounts} value={activeCount} tint="#fff4e6" />
              <StatCard icon="bag" label={d.ordersCount} value={342} sub={"+24 " + d.thisMonth} tint="#f3e8ff" />
            </div>
          )}

          <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 800 }}>{dtab === "discounts" ? (lang === "ar" ? "الخصومات الفعّالة" : "Active discounts") : (lang === "ar" ? "منتجات المتجر" : "Store products")}</h2>

          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1.3fr 1.4fr 0.8fr", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--line)", fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".4px" }}>
              <span>{d.product}</span><span>{d.price}</span><span>{d.action}</span><span>{d.status}</span><span></span>
            </div>
            {(dtab === "discounts" ? rows.filter((p) => p.active) : rows).map((p) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1.3fr 1.4fr 0.8fr", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, flex: "none" }}><Thumb p={p} radius="10px" /></div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{lang === "ar" ? p.ar : p.en}</div>
                    {p.pending && <div style={{ fontSize: 11, color: "var(--star)", fontWeight: 600 }}>{d.pending}</div>}
                  </div>
                </div>
                <div className="num" style={{ fontWeight: 700 }}>{money(p.price, lang)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="num" style={{ background: "var(--sale)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>-{p.pct}%</span>
                  <span className="num" style={{ fontSize: 12, color: "var(--text-3)" }}>{p.days} {t.days}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: p.pending ? "var(--star)" : p.active ? "var(--active)" : "var(--expired)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: "currentColor" }} />
                  {p.pending ? d.awaiting : p.active ? d.activeOn : d.off}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}><Toggle on={p.active} onClick={() => toggle(p.id)} /></div>
              </div>
            ))}
          </div>
        </>)}
      </div>

      {modal && <AddActivityModal d={d} lang={lang} onClose={() => setModal(false)} onSave={(row: Row) => { setRows((r) => [row, ...r]); setModal(false); }} />}
    </div>
  );
}

function OrdersPanel({ lang }: { lang: string }) {
  const ar = lang === "ar";
  const orders: [string, string, string, number, string][] = ar
    ? [["#10248", "محمد العتيبي", "آيربودز ماكس", 559, "قيد التجهيز"], ["#10247", "سارة القحطاني", "سماعات لاسلكية", 178, "تم الشحن"], ["#10246", "خالد الشهري", "بوز BT", 289, "مكتمل"], ["#10245", "نورة العنزي", "جي بي إل تيون", 59, "ملغي"], ["#10244", "فهد الدوسري", "فيفوكس", 78, "مكتمل"]]
    : [["#10248", "M. Al-Otaibi", "AirPods Max", 559, "Processing"], ["#10247", "S. Al-Qahtani", "Wireless Earbuds", 178, "Shipped"], ["#10246", "K. Al-Shehri", "Bose BT", 289, "Completed"], ["#10245", "N. Al-Anzi", "JBL Tune", 59, "Cancelled"], ["#10244", "F. Al-Dosari", "VIVEFOX", 78, "Completed"]];
  const stCol = (s: string) => /ملغي|Cancel/.test(s) ? "var(--sale)" : /مكتمل|Complete/.test(s) ? "var(--active)" : /شحن|Ship/.test(s) ? "var(--blue)" : "var(--star)";
  return (
    <div>
      <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800 }}>{ar ? "طلبات المتجر" : "Store orders"}</h2>
      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1.8fr 1fr 1.2fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--line)", fontSize: 12, fontWeight: 700, color: "var(--text-3)" }}>
          <span>{ar ? "رقم" : "Order"}</span><span>{ar ? "العميل" : "Customer"}</span><span>{ar ? "المنتج" : "Product"}</span><span>{ar ? "المبلغ" : "Total"}</span><span>{ar ? "الحالة" : "Status"}</span>
        </div>
        {orders.map(([id, cust, prod, total, st]) => (
          <div key={id} style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1.8fr 1fr 1.2fr", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
            <span className="num" style={{ fontWeight: 700, color: "var(--text-2)" }}>{id}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{cust}</span>
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>{prod}</span>
            <span className="num" style={{ fontWeight: 700 }}>{money(total, lang as any)}</span>
            <span><span style={{ background: stCol(st) + "1a", color: stCol(st), fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{st}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel({ lang, vendor }: { lang: string; vendor: (typeof VENDORS)[string] }) {
  const ar = lang === "ar";
  const fld = (label: string, val: string) => (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
      <input defaultValue={val} style={{ height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" }} />
    </label>
  );
  return (
    <div>
      <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800 }}>{ar ? "إعدادات المتجر" : "Store settings"}</h2>
      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", padding: 22, maxWidth: 620 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <span style={{ width: 56, height: 56, borderRadius: 14, background: vendor.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="store" size={26} /></span>
          <div><div style={{ fontWeight: 800, fontSize: 16 }}>{ar ? vendor.ar : vendor.en}</div><div style={{ fontSize: 12.5, color: "var(--text-3)" }}>{ar ? "متجر موثّق" : "Verified store"}</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {fld(ar ? "اسم المتجر" : "Store name", ar ? vendor.ar : vendor.en)}
          {fld(ar ? "المدينة" : "City", ar ? vendor.city.ar : vendor.city.en)}
          {fld(ar ? "الجوال" : "Mobile", "05x xxx xxxx")}
          {fld(ar ? "البريد" : "Email", "store@mashhoor.sa")}
          {fld(ar ? "رابط الموقع" : "Website", "https://")}
          {fld(ar ? "رابط الخريطة" : "Map link", "https://maps")}
        </div>
        <div style={{ marginTop: 20 }}><Btn><Icon name="check" size={16} />{ar ? "حفظ التغييرات" : "Save changes"}</Btn></div>
      </div>
    </div>
  );
}

function CouponsPanel({ lang }: { lang: string }) {
  const ar = lang === "ar";
  const [rows, setRows] = useState(COUPONS.map((c) => ({ ...c })));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{ar ? "كوبونات الخصم" : "Discount coupons"}</h2>
        <Btn size="sm"><Icon name="plus" size={15} />{ar ? "كوبون جديد" : "New coupon"}</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((c) => (
          <div key={c.id} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", padding: 18, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <span className="num" style={{ fontWeight: 800, fontSize: 18 }}>{c.pct}%</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="num" style={{ fontWeight: 800, fontSize: 15, letterSpacing: ".5px", border: "1.5px dashed var(--line)", borderRadius: 6, padding: "3px 10px" }}>{c.code}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: c.active ? "var(--active)" : "var(--expired)" }}>{c.active ? (ar ? "فعّال" : "Active") : (ar ? "منتهٍ" : "Expired")}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 6 }}>{ar ? c.ar : c.en} · {ar ? "حتى" : "until"} <span className="num">{ar ? c.until.ar : c.until.en}</span></div>
            </div>
            <div style={{ textAlign: "center", minWidth: 90 }}>
              <div className="num" style={{ fontWeight: 800 }}>{c.used}/{c.limit}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{ar ? "استُخدم" : "redeemed"}</div>
              <div style={{ height: 6, borderRadius: 999, background: "var(--surface-2)", marginTop: 6 }}><div style={{ width: Math.round(c.used / c.limit * 100) + "%", height: "100%", borderRadius: 999, background: "var(--brand)" }} /></div>
            </div>
            <Toggle on={c.active} onClick={() => setRows((r) => r.map((x) => x.id === c.id ? { ...x, active: !x.active } : x))} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscriptionPanel({ lang, go }: { lang: string; go: Go }) {
  const ar = lang === "ar";
  const plans = PLANS;
  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}>{ar ? "اشتراك المتجر" : "Store subscription"}</h2>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: "var(--text-3)" }}>{ar ? "باقتك الحالية: احترافي — تتجدّد في ٣٠ يوليو ٢٠٢٦." : "Current plan: Pro — renews Jul 30, 2026."}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {plans.map((p) => (
          <div key={p.id} style={{ background: "var(--surface)", border: "2px solid " + (p.active ? "var(--brand)" : "var(--line)"), borderRadius: "var(--r-xl)", padding: 22, boxShadow: p.active ? "var(--shadow-md)" : "var(--shadow-sm)", position: "relative" }}>
            {p.active && <span style={{ position: "absolute", top: -11, insetInlineStart: 22, background: "var(--brand)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 999 }}>{ar ? "باقتك" : "Your plan"}</span>}
            <div style={{ fontWeight: 800, fontSize: 17 }}>{ar ? p.ar : p.en}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5, margin: "12px 0 16px" }}>
              <span className="num" style={{ fontSize: 28, fontWeight: 800 }}>{p.price === 0 ? (ar ? "مجاني" : "Free") : money(p.price, lang as any)}</span>
              {p.price !== 0 && <span style={{ color: "var(--text-3)", fontSize: 12.5 }}>/{ar ? "شهر" : "mo"}</span>}
            </div>
            <Btn full size="sm" variant={p.active ? "soft" : "primary"} onClick={() => go("info", "pricing")}>{p.active ? (ar ? "الباقة الحالية" : "Current") : (ar ? "ترقية" : "Upgrade")}</Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddActivityModal({ d, lang, onClose, onSave }: { d: any; lang: string; onClose: () => void; onSave: (row: Row) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("electronics");
  const [has, setHas] = useState(true);
  const [pct, setPct] = useState(30);
  const [days, setDays] = useState(7);
  const [price, setPrice] = useState(199);
  const cats = CATS;
  const save = () => onSave({ id: "new" + Date.now(), ar: name || (lang === "ar" ? "نشاط جديد" : "New activity"), en: name || "New activity", price: Number(price), color: "#dfe7ef", cat: type, pct: has ? Number(pct) : 0, days: has ? Number(days) : 0, active: false, pending: true, img: null });
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,16,12,.55)", backdropFilter: "blur(3px)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", width: "min(560px, 100%)", maxHeight: "90vh", overflow: "auto", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{d.newActivity}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 24, color: "var(--text-3)", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <DField label={d.productName}><input value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === "ar" ? "اسم المنتج أو النشاط" : "Product / activity name"} style={inp} /></DField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <DField label={d.activityType}>
              <select value={type} onChange={(e) => setType(e.target.value)} style={inp}>
                {cats.map((c) => <option key={c.id} value={c.id}>{lang === "ar" ? c.ar : c.en}</option>)}
              </select>
            </DField>
            <DField label={d.price}><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} style={inp} className="num" /></DField>
          </div>
          <DField label={d.hasDiscount}>
            <div style={{ display: "flex", gap: 10 }}>
              {([[true, d.yes], [false, d.no]] as [boolean, string][]).map(([v, l]) => (
                <button key={String(v)} onClick={() => setHas(v)} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1.5px solid " + (has === v ? "var(--brand)" : "var(--line)"), background: has === v ? "var(--brand-soft)" : "var(--surface)", color: has === v ? "var(--brand)" : "var(--text-2)", fontWeight: 700, fontSize: 13.5 }}>{l}</button>
              ))}
            </div>
          </DField>
          {has && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <DField label={d.discountPct}><input type="number" value={pct} onChange={(e) => setPct(Number(e.target.value))} style={inp} className="num" /></DField>
              <DField label={d.durationDays}><input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} style={inp} className="num" /></DField>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <DField label={d.siteLink}><input placeholder="https://" style={inp} className="num" /></DField>
            <DField label={d.mapLink}><input placeholder="https://maps…" style={inp} className="num" /></DField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[d.image, d.video].map((l: string) => (
              <DField key={l} label={l}>
                <div style={{ border: "1.5px dashed var(--line)", borderRadius: 10, padding: 16, textAlign: "center", color: "var(--text-3)", fontSize: 12.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Icon name="plus" size={20} />{l}
                </div>
              </DField>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid var(--line)" }}>
          <Btn variant="outline" onClick={onClose} style={{ flex: 1 }}>{d.cancel}</Btn>
          <Btn onClick={save} style={{ flex: 2 }}><Icon name="check" size={16} />{d.save}</Btn>
        </div>
      </div>
    </div>
  );
}
