"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn } from "../ui";
import { Logo } from "../Shell";

type Go = (page: string, id?: string | null) => void;

function AField({ label, icon, cn, ...rest }: { label: string; icon: string; cn?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
      <span style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{ position: "absolute", insetInlineStart: 12, color: "var(--text-3)", display: "flex" }}><Icon name={icon} size={17} /></span>
        <input className={cn} {...rest} style={{ height: 46, width: "100%", paddingInlineStart: 40, paddingInlineEnd: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" }} />
      </span>
    </label>
  );
}

export function Auth({ param, go }: { param: string | null; go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const initAud = /vendor/.test(param || "") ? "vendor" : "customer";
  const initMode = /register/.test(param || "") ? "register" : "login";
  const [aud, setAud] = useState<"vendor" | "customer">(initAud);
  const [mode, setMode] = useState(initMode);

  const submit = () => {
    if (aud === "vendor") go(mode === "register" ? "addstore" : "dashboard");
    else go("home");
  };

  const bullets = aud === "vendor"
    ? (ar ? ["عدّاد زوار لكل متجر", "أضف خصوماتك ومزاداتك", "+٥٠ ألف زائر شهرياً"] : ["Per-store visitor counter", "Add discounts & auctions", "50k+ monthly visitors"])
    : (ar ? ["تتبّع طلباتك بسهولة", "احفظ مفضّلاتك وعروضك", "عروض حصرية للأعضاء"] : ["Track your orders easily", "Save favourites & deals", "Members-only offers"]);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 56, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "min(940px, 100%)", display: "grid", gridTemplateColumns: "1fr 1.05fr", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
        <div style={{ background: "linear-gradient(150deg, var(--brand-strong), var(--brand))", color: "#fff", padding: "40px 34px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ filter: "brightness(0) invert(1)" }}><Logo /></div>
          <h2 style={{ margin: "8px 0 0", fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
            {aud === "vendor" ? (ar ? "بوابة التجّار" : "Vendor portal") : (ar ? "أهلاً بك في أوفرز" : "Welcome to Offers")}
          </h2>
          <p style={{ margin: 0, opacity: .9, fontSize: 14.5, lineHeight: 1.6 }}>
            {aud === "vendor" ? (ar ? "أدِر متجرك وخصوماتك ومزاداتك من مكان واحد." : "Manage your store, discounts and auctions in one place.") : (ar ? "وجهتك للعروض والخصومات في جميع مدن المملكة." : "Your destination for deals across the Kingdom.")}
          </p>
          <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 13 }}>
            {bullets.map((b) => <li key={b} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}><span style={{ width: 22, height: 22, borderRadius: 999, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name="check" size={13} stroke={2.6} /></span>{b}</li>)}
          </ul>
          <div style={{ marginTop: "auto", paddingTop: 24, fontSize: 13, opacity: .85 }}>
            {aud === "vendor"
              ? <span>{ar ? "عميل؟ " : "A shopper? "}<a href="#" onClick={(e) => { e.preventDefault(); setAud("customer"); setMode("login"); }} style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}>{ar ? "دخول العملاء" : "Customer login"}</a></span>
              : <span>{ar ? "صاحب متجر؟ " : "A store owner? "}<a href="#" onClick={(e) => { e.preventDefault(); setAud("vendor"); setMode("login"); }} style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}>{ar ? "دخول التجّار" : "Vendor login"}</a></span>}
          </div>
        </div>

        <div style={{ padding: "34px 34px 30px" }}>
          <div style={{ display: "flex", gap: 6, background: "var(--surface-2)", padding: 4, borderRadius: "var(--r-pill)", marginBottom: 22 }}>
            {([["customer", ar ? "عميل" : "Customer", "user"], ["vendor", ar ? "تاجر" : "Vendor", "store"]] as const).map(([k, l, ic]) => (
              <button key={k} onClick={() => setAud(k)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 9, borderRadius: 999, border: "none", fontSize: 13.5, fontWeight: 700, background: aud === k ? "var(--surface)" : "transparent", color: aud === k ? "var(--brand)" : "var(--text-2)", boxShadow: aud === k ? "var(--shadow-sm)" : "none" }}>
                <Icon name={ic} size={16} />{l}
              </button>
            ))}
          </div>

          {!/forgot/.test(mode) && (
            <div style={{ display: "flex", gap: 22, borderBottom: "1px solid var(--line)", marginBottom: 22 }}>
              {([["login", ar ? "تسجيل الدخول" : "Sign in"], ["register", ar ? "إنشاء حساب" : "Register"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setMode(k)} style={{ padding: "0 0 12px", background: "transparent", border: "none", borderBottom: "2px solid " + (mode === k ? "var(--brand)" : "transparent"), marginBottom: -1, color: mode === k ? "var(--text)" : "var(--text-3)", fontSize: 15, fontWeight: 700 }}>{l}</button>
              ))}
            </div>
          )}

          {mode === "forgot" || mode === "forgot-sent" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <button onClick={() => setMode("login")} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "var(--text-2)", fontWeight: 600, fontSize: 13 }}><Icon name="back" size={16} />{ar ? "رجوع لتسجيل الدخول" : "Back to sign in"}</button>
              {mode === "forgot-sent" ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Icon name="globe" size={30} /></div>
                  <h3 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 18 }}>{ar ? "تحقّق من بريدك" : "Check your email"}</h3>
                  <p style={{ color: "var(--text-2)", fontSize: 13.5, lineHeight: 1.6 }}>{ar ? "أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني." : "We've sent a password reset link to your email."}</p>
                  <div style={{ marginTop: 18 }}><Btn size="lg" full onClick={() => setMode("login")}>{ar ? "العودة لتسجيل الدخول" : "Back to sign in"}</Btn></div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 18 }}>{ar ? "استعادة كلمة المرور" : "Reset password"}</h3>
                    <p style={{ margin: 0, color: "var(--text-2)", fontSize: 13.5 }}>{ar ? "أدخل بريدك وسنرسل لك رابط إعادة التعيين." : "Enter your email and we'll send a reset link."}</p>
                  </div>
                  <AField label={ar ? "البريد الإلكتروني" : "Email"} icon="globe" type="email" placeholder="you@email.com" cn="num" />
                  <Btn size="lg" full onClick={() => setMode("forgot-sent")}>{ar ? "إرسال رابط الاستعادة" : "Send reset link"}</Btn>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "register" && aud === "vendor" && <AField label={ar ? "اسم المتجر" : "Store name"} icon="store" placeholder={ar ? "مثال: تك زون" : "e.g. Tech Zone"} />}
              {mode === "register" && aud === "customer" && <AField label={ar ? "الاسم الكامل" : "Full name"} icon="user" placeholder={ar ? "محمد العتيبي" : "Mohammed Al-Otaibi"} />}
              <AField label={ar ? "البريد الإلكتروني" : "Email"} icon="globe" type="email" placeholder={aud === "vendor" ? "you@store.sa" : "you@email.com"} cn="num" />
              {mode === "register" && <AField label={ar ? "رقم الجوال" : "Mobile"} icon="phone" placeholder="05x xxx xxxx" cn="num" />}
              <AField label={ar ? "كلمة المرور" : "Password"} icon="shield" type="password" placeholder="••••••••" cn="num" />

              {mode === "login" ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
                  <label style={{ display: "flex", gap: 7, alignItems: "center", color: "var(--text-2)", cursor: "pointer" }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--brand)" }} />{ar ? "تذكّرني" : "Remember me"}</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); setMode("forgot"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "نسيت كلمة المرور؟" : "Forgot password?"}</a>
                </div>
              ) : (
                <label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12.5, color: "var(--text-2)", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: "var(--brand)" }} />
                  <span>{ar ? "أوافق على " : "I agree to the "}<a href="#" onClick={(e) => { e.preventDefault(); go("info", "terms"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "الشروط والأحكام" : "Terms"}</a></span>
                </label>
              )}

              <Btn size="lg" full onClick={submit}>
                {mode === "login" ? (ar ? "تسجيل الدخول" : "Sign in") : aud === "vendor" ? (ar ? "متابعة إعداد المتجر" : "Continue store setup") : (ar ? "إنشاء الحساب" : "Create account")}
              </Btn>

              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-3)", fontSize: 12, margin: "2px 0" }}>
                <span style={{ flex: 1, height: 1, background: "var(--line)" }} />{ar ? "أو" : "or"}<span style={{ flex: 1, height: 1, background: "var(--line)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Btn variant="outline"><span style={{ fontWeight: 800 }}>G</span> Google</Btn>
                <Btn variant="outline"><Icon name="phone" size={15} />{ar ? "نفاذ" : "Nafath"}</Btn>
              </div>

              <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-2)", margin: "6px 0 0" }}>
                {mode === "login"
                  ? <>{ar ? "ليس لديك حساب؟ " : "No account? "}<a href="#" onClick={(e) => { e.preventDefault(); setMode("register"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "أنشئ حساباً" : "Register"}</a></>
                  : <>{ar ? "لديك حساب؟ " : "Have an account? "}<a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); }} style={{ color: "var(--brand)", fontWeight: 700 }}>{ar ? "تسجيل الدخول" : "Sign in"}</a></>}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
