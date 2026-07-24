"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn } from "../ui";
import { CATS } from "@/lib/data";

type Go = (page: string, id?: string | null) => void;

function SField({ label, as, children, cn, ...rest }: { label: string; as?: "select"; children?: React.ReactNode; cn?: string } & React.InputHTMLAttributes<HTMLInputElement> & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const base: React.CSSProperties = { height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", width: "100%" };
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
      {as === "select"
        ? <select style={base} {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}>{children}</select>
        : <input className={cn} style={base} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />}
    </label>
  );
}

export function AddStore({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const [step, setStep] = useState(0);
  const cats = CATS;
  const [form, setForm] = useState({ store: "", type: "electronics", city: ar ? "الرياض" : "Riyadh", owner: "", mobile: "", email: "", pass: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const steps = ar
    ? [["أنشئ حسابك", "سجّل متجرك واحصل على اسم مستخدم وكلمة مرور خاصة بك.", "user"],
      ["أضف نشاطك وعروضك", "أضف منتجاتك، حدّد نسبة الخصم ومدته، وأرفق الصور والروابط.", "tag"],
      ["موافقة ونشر", "تراجع إدارة أوفرز طلبك، وبعد التفعيل يظهر متجرك للزوار.", "check"]]
    : [["Create your account", "Register your store and get your own username and password.", "user"],
      ["Add activity & offers", "Add products, set the discount % and duration, attach images and links.", "tag"],
      ["Approval & publish", "Offers reviews your request; once activated your store goes live to visitors.", "check"]];

  const benefits = ar
    ? [["+٥٠ ألف زائر شهرياً", "eye"], ["عدّاد زوار لكل متجر", "grid"], ["خصومات ومزادات", "gavel"], ["لوحة تحكم كاملة", "box"]]
    : [["50k+ monthly visitors", "eye"], ["Per-store visitor counter", "grid"], ["Discounts & auctions", "gavel"], ["Full dashboard", "box"]];

  if (step === 1) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center", maxWidth: 560 }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><Icon name="check" size={44} stroke={2.4} /></div>
        <h1 style={{ fontSize: 27, fontWeight: 800, margin: "0 0 10px" }}>{ar ? "تم استلام طلب متجرك" : "Your store request is in"}</h1>
        <p style={{ color: "var(--text-2)", fontSize: 15 }}>{ar ? "طلبك قيد المراجعة من إدارة أوفرز. ستصلك رسالة عند تفعيل المتجر، ويمكنك الآن تجهيز منتجاتك من لوحة التحكم." : "Your request is being reviewed by Offers. You'll be notified when it's activated — meanwhile you can prepare your products in the dashboard."}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <Btn size="lg" onClick={() => go("dashboard")}>{ar ? "الذهاب للوحة التحكم" : "Go to dashboard"}</Btn>
          <Btn size="lg" variant="outline" onClick={() => go("home")}>{ar ? "الرئيسية" : "Home"}</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "linear-gradient(120deg, var(--brand-strong), var(--brand))", color: "#fff" }}>
        <div className="container" style={{ padding: "44px 0 40px", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 30, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.18)", padding: "5px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}><Icon name="store" size={15} />{ar ? "للبائعين" : "For vendors"}</span>
            <h1 style={{ margin: "16px 0 12px", fontSize: 38, fontWeight: 800, lineHeight: 1.15 }}>{ar ? "أضف متجرك إلى أوفرز" : "List your store on Offers"}</h1>
            <p style={{ margin: 0, fontSize: 16, opacity: .92, maxWidth: 440 }}>{ar ? "انشر خصوماتك ومزاداتك لآلاف الزوار في جميع مدن المملكة. التسجيل مجاني والتفعيل سريع." : "Publish your discounts and auctions to thousands of visitors across the Kingdom. Free to register, fast to activate."}</p>
            <div style={{ display: "flex", gap: 22, marginTop: 22, flexWrap: "wrap" }}>
              {benefits.map(([b, ic]) => (
                <span key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}><Icon name={ic} size={17} />{b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 180, height: 180, borderRadius: 28, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="store" size={96} stroke={1.2} /></div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 22 }}>{ar ? "كيف تبدأ؟" : "How it works"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {steps.map(([h, p, ic], i) => (
              <div key={h} style={{ display: "flex", gap: 16, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 20 }}>
                <div style={{ position: "relative", flex: "none" }}>
                  <span style={{ width: 46, height: 46, borderRadius: 12, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={ic} size={22} /></span>
                  <span className="num" style={{ position: "absolute", top: -6, insetInlineEnd: -6, width: 20, height: 20, borderRadius: 999, background: "var(--brand)", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                </div>
                <div><h3 style={{ margin: "2px 0 5px", fontSize: 16.5, fontWeight: 800 }}>{h}</h3><p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{p}</p></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, padding: "14px 16px", background: "var(--surface-2)", borderRadius: "var(--r-md)", color: "var(--text-2)", fontSize: 13 }}>
            <Icon name="shield" size={18} style={{ color: "var(--brand)", flex: "none" }} />
            {ar ? "كل متجر يخضع للموافقة من إدارة أوفرز قبل النشر." : "Every store is subject to Offers approval before publishing."}
          </div>
          <div style={{ marginTop: 18, fontSize: 13.5, color: "var(--text-2)" }}>
            {ar ? "تريد مقارنة الباقات؟ " : "Want to compare plans? "}
            <a href="#" onClick={(e) => { e.preventDefault(); go("info", "pricing"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "عرض الأسعار" : "View pricing"}</a>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-xl)", padding: 26, boxShadow: "var(--shadow-md)", position: "sticky", top: 90 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{ar ? "سجّل متجرك" : "Register your store"}</h2>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--text-3)" }}>{ar ? "املأ البيانات لإنشاء حساب المتجر." : "Fill in the details to create your store account."} {ar ? "لديك متجر؟ " : "Have a store? "}<a href="#" onClick={(e) => { e.preventDefault(); go("auth", "vendor"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "تسجيل الدخول" : "Sign in"}</a></p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SField label={ar ? "اسم المتجر" : "Store name"} value={form.store} onChange={set("store")} placeholder={ar ? "مثال: تك زون" : "e.g. Tech Zone"} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <SField label={ar ? "نوع النشاط" : "Activity type"} as="select" value={form.type} onChange={set("type")}>
                {cats.map((c) => <option key={c.id} value={c.id}>{ar ? c.ar : c.en}</option>)}
              </SField>
              <SField label={ar ? "المدينة" : "City"} value={form.city} onChange={set("city")} />
            </div>
            <SField label={ar ? "اسم المالك" : "Owner name"} value={form.owner} onChange={set("owner")} placeholder={ar ? "الاسم الكامل" : "Full name"} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <SField label={ar ? "الجوال" : "Mobile"} value={form.mobile} onChange={set("mobile")} placeholder="05x xxx xxxx" cn="num" />
              <SField label={ar ? "البريد" : "Email"} value={form.email} onChange={set("email")} placeholder="you@store.sa" cn="num" />
            </div>
            <SField label={ar ? "كلمة المرور" : "Password"} type="password" value={form.pass} onChange={set("pass")} placeholder="••••••••" cn="num" />
            <label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12.5, color: "var(--text-2)", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: "var(--brand)" }} />
              <span>{ar ? "أوافق على " : "I agree to the "}<a href="#" onClick={(e) => { e.preventDefault(); go("info", "terms"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "الشروط والأحكام" : "Terms & Conditions"}</a></span>
            </label>
            <Btn size="lg" full onClick={() => setStep(1)}><Icon name="store" size={17} />{ar ? "إنشاء المتجر" : "Create store"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
