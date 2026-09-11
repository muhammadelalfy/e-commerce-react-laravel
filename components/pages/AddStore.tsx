"use client";
import React from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn } from "../ui";

type Go = (page: string, id?: string | null) => void;

/**
 * "أضف متجرك" — a marketing landing page for prospective vendors.
 *
 * The actual sign-up form lives in a single place now: the "بوابة التجّار"
 * register form (Auth.tsx, aud="vendor", mode="register"). That form already
 * collects every field this page used to duplicate (store name, category,
 * city, owner, phone, email, password, commercial registration), so this
 * page no longer embeds its own form — it just explains the offer and links
 * into that one form. When Auth finishes a registration it navigates here
 * with id="pending" to show the confirmation screen below.
 */
export function AddStore({ go, id }: { go: Go; id?: string | null }) {
  const { lang } = useApp();
  const ar = lang === "ar";

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

  // reached right after a completed registration (Auth → go("addstore", "pending"))
  if (id === "pending") {
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
            <div style={{ marginTop: 26 }}>
              <Btn size="lg" onClick={() => go("auth", "vendor-register")} style={{ background: "#fff", color: "var(--brand-strong)" }}>
                <Icon name="store" size={17} />{ar ? "سجّل متجرك الآن" : "Register your store now"}
              </Btn>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 180, height: 180, borderRadius: 28, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="store" size={96} stroke={1.2} /></div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 48, display: "grid", gridTemplateColumns: "1fr", gap: 40, maxWidth: 720, margin: "0 auto" }}>
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
          <div style={{ marginTop: 18, fontSize: 13.5, color: "var(--text-2)", textAlign: "center" }}>
            {ar ? "تريد مقارنة الباقات؟ " : "Want to compare plans? "}
            <a href="#" onClick={(e) => { e.preventDefault(); go("info", "pricing"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "عرض الأسعار" : "View pricing"}</a>
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Btn size="lg" onClick={() => go("auth", "vendor-register")}><Icon name="store" size={17} />{ar ? "سجّل متجرك" : "Register your store"}</Btn>
            <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-3)" }}>{ar ? "لديك متجر؟ " : "Have a store? "}<a href="#" onClick={(e) => { e.preventDefault(); go("auth", "vendor"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "تسجيل الدخول" : "Sign in"}</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
