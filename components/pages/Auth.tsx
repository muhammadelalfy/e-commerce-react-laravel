"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn } from "../ui";
import { Logo } from "../Shell";
import { fetchCities } from "../CountryModal";
import { PLANS } from "@/lib/data";
import { useCatStore } from "@/lib/catStore";
import { useGeoStore } from "@/lib/geoStore";
import { submitStore } from "@/lib/storeStore";
import { useRepStore } from "@/lib/repStore";

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

/** labelled select with a leading icon, matching AField's look */
function ASelect({ label, icon, children, ...rest }: { label: string; icon: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
      <span style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{ position: "absolute", insetInlineStart: 12, color: "var(--text-3)", display: "flex", pointerEvents: "none" }}><Icon name={icon} size={17} /></span>
        <select {...rest} style={{ height: 46, width: "100%", paddingInlineStart: 40, paddingInlineEnd: 32, borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", appearance: "none" }}>
          {children}
        </select>
        <span style={{ position: "absolute", insetInlineEnd: 12, color: "var(--text-3)", pointerEvents: "none" }}><Icon name="chevron" size={16} /></span>
      </span>
    </label>
  );
}

export function Auth({ param, go }: { param: string | null; go: Go }) {
  const { lang, signIn } = useApp();
  const ar = lang === "ar";
  type Aud = "vendor" | "customer" | "reels";
  const initAud: Aud = /reel/.test(param || "") ? "reels" : /vendor/.test(param || "") ? "vendor" : "customer";
  const initMode = /register/.test(param || "") ? "register" : "login";
  const [aud, setAud] = useState<Aud>(initAud);
  const [mode, setMode] = useState(initMode);
  const [ident, setIdent] = useState(initAud === "reels" ? "مشهور" : "");
  const [crFile, setCrFile] = useState("");
  const [logoFile, setLogoFile] = useState("");

  // shared stores for the vendor-registration form
  const catStore = useCatStore();
  const geo = useGeoStore();
  const repStore = useRepStore();

  // full store-registration form state (matches the mobile design)
  const [f, setF] = useState({
    fname: "", lname: "", plan: PLANS[0]?.id ?? "basic", store: "", slogan: "",
    phone: "", whatsapp: "", address: "", rep: "", country: geo.countries[0]?.id ?? "sa",
    city: "", website: "", cat: catStore.cats[0]?.id ?? "", subcat: "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const subs = catStore.subsOf(f.cat);

  // cities depend on the selected country — fetched live from the CountriesNow
  // API (same source as the country-picker modal). Falls back to stored cities.
  const [cityList, setCityList] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  useEffect(() => {
    if (!(mode === "register" && aud === "vendor")) return;
    const c = geo.countries.find((x) => x.id === f.country);
    if (!c) { setCityList([]); return; }
    const ctrl = new AbortController();
    setLoadingCities(true);
    fetchCities(c.en, ctrl.signal)
      .then((list) => setCityList(list))
      .catch((e) => { if (e?.name !== "AbortError") {
        // fall back to any cities stored for this country
        setCityList(geo.cities.filter((x) => x.country === f.country).map((x) => (ar ? x.ar : x.en)));
      } })
      .finally(() => setLoadingCities(false));
    return () => ctrl.abort();
  }, [f.country, mode, aud]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    const id = ident.trim();
    if (aud === "reels") { signIn({ name: id || "مشهور", role: "reels" }); go("reels-studio"); return; }
    if (aud === "vendor") {
      if (mode === "register") {
        // submit a pending store application for admin approval (city is the API name)
        submitStore({ ar: f.store || (ar ? "متجر جديد" : "New store"), en: f.store || "New store", cat: f.cat, city: f.city, owner: (f.fname + " " + f.lname).trim() || (ar ? "غير محدّد" : "Unknown"), cr: undefined });
      }
      signIn({ name: id || f.store || "vendor", role: "vendor" });
      go(mode === "register" ? "addstore" : "dashboard");
      return;
    }
    signIn({ name: id || "guest", role: "customer" }); go("home");
  };

  const bullets = aud === "reels"
    ? (ar ? ["أضف مقاطع ريلز جديدة", "تابع مشاهدات وإعجابات مقاطعك", "محتوى ترويجي للمتاجر"] : ["Add new reels clips", "Track views & likes", "Promote stores with content"])
    : aud === "vendor"
    ? (ar ? ["عدّاد زوار لكل متجر", "أضف خصوماتك ومزاداتك", "+٥٠ ألف زائر شهرياً"] : ["Per-store visitor counter", "Add discounts & auctions", "50k+ monthly visitors"])
    : (ar ? ["تتبّع طلباتك بسهولة", "احفظ مفضّلاتك وعروضك", "عروض حصرية للأعضاء"] : ["Track your orders easily", "Save favourites & deals", "Members-only offers"]);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 56, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "min(940px, 100%)", display: "grid", gridTemplateColumns: "1fr 1.05fr", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
        <div style={{ background: "linear-gradient(150deg, var(--brand-strong), var(--brand))", color: "#fff", padding: "40px 34px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ alignSelf: "flex-start" }}><Logo /></div>
          <h2 style={{ margin: "8px 0 0", fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
            {aud === "reels" ? (ar ? "استوديو الريلز" : "Reels Studio") : aud === "vendor" ? (ar ? "بوابة التجّار" : "Vendor portal") : (ar ? "أهلاً بك في أوفرز" : "Welcome to Offers")}
          </h2>
          <p style={{ margin: 0, opacity: .9, fontSize: 14.5, lineHeight: 1.6 }}>
            {aud === "reels" ? (ar ? "حساب مخصّص لإضافة مقاطع الريلز فقط." : "A dedicated account to add reels only.") : aud === "vendor" ? (ar ? "أدِر متجرك وخصوماتك ومزاداتك من مكان واحد." : "Manage your store, discounts and auctions in one place.") : (ar ? "وجهتك للعروض والخصومات في جميع مدن المملكة." : "Your destination for deals across the Kingdom.")}
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
            {([["customer", ar ? "عميل" : "Customer", "user"], ["vendor", ar ? "تاجر" : "Vendor", "store"], ["reels", ar ? "مشهور" : "Mashhoor", "reel"]] as const).map(([k, l, ic]) => (
              <button key={k} onClick={() => { setAud(k); if (k === "reels") setIdent("مشهور"); else if (ident === "مشهور") setIdent(""); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 9, borderRadius: 999, border: "none", fontSize: 13, fontWeight: 700, background: aud === k ? "var(--surface)" : "transparent", color: aud === k ? "var(--brand)" : "var(--text-2)", boxShadow: aud === k ? "var(--shadow-sm)" : "none" }}>
                <Icon name={ic} size={15} />{l}
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
              {/* ===== FULL STORE-REGISTRATION FORM (vendor + register) ===== */}
              {mode === "register" && aud === "vendor" ? (
                <div key="vendor-register" style={{ display: "contents" }}>
                  <AField label={ar ? "البريد الإلكتروني" : "Email"} icon="globe" type="email" placeholder="you@store.sa" value={ident} onChange={(e) => setIdent(e.target.value)} cn="num" />
                  <AField label={ar ? "كلمة السر" : "Password"} icon="shield" type="password" placeholder="••••••••" cn="num" />
                  <AField label={ar ? "إعادة كلمة السر" : "Confirm password"} icon="shield" type="password" placeholder="••••••••" cn="num" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <AField label={ar ? "الإسم" : "First name"} icon="user" value={f.fname} onChange={set("fname")} />
                    <AField label={ar ? "اللقب" : "Last name"} icon="user" value={f.lname} onChange={set("lname")} />
                  </div>
                  <ASelect label={ar ? "نوع الإشتراك" : "Subscription type"} icon="ticket" value={f.plan} onChange={set("plan")}>
                    {PLANS.map((p) => <option key={p.id} value={p.id}>{ar ? p.ar : p.en}</option>)}
                  </ASelect>
                  <AField label={ar ? "إسم المتجر" : "Store name"} icon="store" placeholder={ar ? "مثال: تك زون" : "e.g. Tech Zone"} value={f.store} onChange={set("store")} />

                  {/* Store logo upload */}
                  <label style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{ar ? "الشعار" : "Logo"}</span>
                    <label style={{ width: 56, height: 56, borderRadius: 999, background: logoFile ? "var(--brand-soft)" : "var(--brand)", color: logoFile ? "var(--brand)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>
                      <Icon name={logoFile ? "check" : "plus"} size={24} />
                      <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0]?.name || "")} style={{ display: "none" }} />
                    </label>
                    {logoFile && <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{logoFile}</span>}
                  </label>

                  <AField label={ar ? "شعار المتجر / العلامة" : "Store slogan / brand"} icon="tag" placeholder={ar ? "شعار مميّز لمتجرك" : "A catchy slogan"} value={f.slogan} onChange={set("slogan")} />
                  <AField label={ar ? "رقم الهاتف" : "Phone"} icon="phone" placeholder="05x xxx xxxx" value={f.phone} onChange={set("phone")} cn="num" />
                  <AField label={ar ? "رقم الواتساب" : "WhatsApp"} icon="phone" placeholder="05x xxx xxxx" value={f.whatsapp} onChange={set("whatsapp")} cn="num" />
                  <AField label={ar ? "العنوان" : "Address"} icon="pin" placeholder={ar ? "الحي، الشارع" : "District, street"} value={f.address} onChange={set("address")} />

                  {/* Commercial-registration file */}
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none", borderRadius: 999, padding: "11px 18px", cursor: "pointer", background: crFile ? "var(--brand-soft)" : "var(--brand)", color: crFile ? "var(--brand)" : "#fff", fontSize: 13.5, fontWeight: 700 }}>
                    <Icon name={crFile ? "check" : "filePdf"} size={17} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{crFile || (ar ? "حمّل سجل المتجر" : "Upload commercial registration")}</span>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => setCrFile(e.target.files?.[0]?.name || "")} style={{ display: "none" }} />
                  </label>

                  <ASelect label={ar ? "المندوب" : "Representative"} icon="user" value={f.rep} onChange={set("rep")}>
                    <option value="">{ar ? "اختر المندوب" : "Select representative"}</option>
                    {repStore.reps.map((r) => <option key={r.id} value={r.id}>{ar ? r.ar : r.en}</option>)}
                  </ASelect>
                  <ASelect label={ar ? "البلد" : "Country"} icon="globe" value={f.country} onChange={(e) => { set("country")(e); setF((s) => ({ ...s, city: "" })); }}>
                    {geo.countries.map((c) => <option key={c.id} value={c.id}>{ar ? c.ar : c.en}</option>)}
                  </ASelect>
                  <ASelect label={ar ? "المدينة" : "City"} icon="pin" value={f.city} onChange={set("city")} disabled={loadingCities || cityList.length === 0}>
                    <option value="">{loadingCities ? (ar ? "جارٍ جلب المدن…" : "Fetching cities…") : cityList.length === 0 ? (ar ? "لا توجد مدن" : "No cities") : (ar ? "اختيار المدينة (المدن)" : "Select city")}</option>
                    {cityList.map((c) => <option key={c} value={c}>{c}</option>)}
                  </ASelect>
                  <AField label={ar ? "موقع الواب" : "Website"} icon="globe" placeholder="https://" value={f.website} onChange={set("website")} cn="num" />

                  {/* Categories (المجالات) — pick a category, its sub-categories appear */}
                  <ASelect label={ar ? "المجالات" : "Categories"} icon="grid" value={f.cat} onChange={(e) => { set("cat")(e); setF((s) => ({ ...s, subcat: "" })); }}>
                    {catStore.cats.map((c) => <option key={c.id} value={c.id}>{ar ? c.ar : c.en}</option>)}
                  </ASelect>
                  <ASelect label={ar ? "التصنيف الفرعي" : "Sub-category"} icon="grid" value={f.subcat} onChange={set("subcat")} disabled={subs.length === 0}>
                    <option value="">{subs.length === 0 ? (ar ? "لا توجد تصنيفات فرعية" : "No sub-categories") : (ar ? "اختر التصنيف الفرعي" : "Select sub-category")}</option>
                    {subs.map((s) => <option key={s.id} value={s.id}>{ar ? s.ar : s.en}</option>)}
                  </ASelect>
                  <p style={{ margin: "-4px 0 4px", fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>{ar ? "عند إختيار تصنيف ستظهر التصنيفات التابعة له." : "When you pick a category, its sub-categories appear."}</p>
                </div>
              ) : (
                <div key="simple-auth" style={{ display: "contents" }}>
                  {mode === "register" && aud === "customer" && <AField label={ar ? "الاسم الكامل" : "Full name"} icon="user" placeholder={ar ? "محمد العتيبي" : "Mohammed Al-Otaibi"} />}
                  <AField label={ar ? "البريد الإلكتروني أو اسم المستخدم" : "Email or username"} icon="globe" placeholder={aud === "vendor" ? "you@store.sa" : "you@email.com"} value={ident} onChange={(e) => setIdent(e.target.value)} />
                  {mode === "register" && <AField label={ar ? "رقم الجوال" : "Mobile"} icon="phone" placeholder="05x xxx xxxx" cn="num" />}
                  <AField label={ar ? "كلمة المرور" : "Password"} icon="shield" type="password" placeholder="••••••••" cn="num" />
                </div>
              )}

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
                {mode === "login" ? (ar ? "تسجيل الدخول" : "Sign in") : aud === "vendor" ? (ar ? "تأكيد" : "Confirm") : (ar ? "إنشاء الحساب" : "Create account")}
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
