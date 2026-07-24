"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn } from "./ui";

// Gulf Cooperation Council countries (دول الخليج) — Arabic + English + flag + dial code
export interface Country { id: string; ar: string; en: string; flag: string; dial: string; }
export const GULF_COUNTRIES: Country[] = [
  { id: "sa", ar: "المملكة العربية السعودية", en: "Saudi Arabia", flag: "🇸🇦", dial: "+966" },
  { id: "ae", ar: "الإمارات العربية المتحدة", en: "United Arab Emirates", flag: "🇦🇪", dial: "+971" },
  { id: "kw", ar: "الكويت", en: "Kuwait", flag: "🇰🇼", dial: "+965" },
  { id: "qa", ar: "قطر", en: "Qatar", flag: "🇶🇦", dial: "+974" },
  { id: "bh", ar: "البحرين", en: "Bahrain", flag: "🇧🇭", dial: "+973" },
  { id: "om", ar: "سلطنة عُمان", en: "Oman", flag: "🇴🇲", dial: "+968" },
];

const STORAGE_KEY = "mash_country";

export function CountryModal() {
  const { lang } = useApp();
  const ar = lang === "ar";
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<string>("sa");
  const [mounted, setMounted] = useState(false);

  // show only if the visitor hasn't chosen a country before (client-only)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCountry(saved);
    else setOpen(true);
  }, []);

  // lock body scroll while the modal is open
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, mounted]);

  const confirm = () => {
    localStorage.setItem(STORAGE_KEY, country);
    setOpen(false);
  };

  if (!mounted || !open) return null;

  const sel = GULF_COUNTRIES.find((c) => c.id === country) || GULF_COUNTRIES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(8,14,20,.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        animation: "mash-fade .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(440px, 100%)", background: "var(--surface)",
          borderRadius: "var(--r-xl)", border: "1px solid var(--line)",
          boxShadow: "var(--shadow-lg)", overflow: "hidden",
          animation: "mash-pop-in .28s cubic-bezier(.2,.9,.3,1.2)",
        }}
      >
        {/* brand banner */}
        <div style={{ background: "linear-gradient(135deg, var(--brand-strong), var(--brand))", color: "#fff", padding: "26px 26px 22px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Icon name="globe" size={30} />
          </div>
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, fontFamily: "var(--font-display)" }}>
            {ar ? "اختر دولتك" : "Choose your country"}
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 13.5, opacity: .9 }}>
            {ar ? "لنعرض لك العروض والمتاجر القريبة منك" : "So we can show offers and stores near you"}
          </p>
        </div>

        {/* body */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>
              {ar ? "الدولة" : "Country"}
            </span>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", insetInlineStart: 12, top: "50%", transform: "translateY(-50%)", fontSize: 20, pointerEvents: "none" }}>{sel.flag}</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{
                  width: "100%", height: 50, paddingInlineStart: 44, paddingInlineEnd: 40,
                  borderRadius: 12, border: "1.5px solid var(--line)",
                  background: "var(--surface-2)", color: "var(--text)",
                  fontSize: 15, fontWeight: 600, fontFamily: "inherit",
                  appearance: "none", cursor: "pointer",
                }}
              >
                {GULF_COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {ar ? c.ar : c.en} ({c.dial})
                  </option>
                ))}
              </select>
              <span style={{ position: "absolute", insetInlineEnd: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }}>
                <Icon name="chevron" size={18} />
              </span>
            </div>
          </label>

          {/* quick-pick flag chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GULF_COUNTRIES.map((c) => {
              const on = c.id === country;
              return (
                <button
                  key={c.id}
                  onClick={() => setCountry(c.id)}
                  title={ar ? c.ar : c.en}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 12px", borderRadius: 999,
                    border: "1.5px solid " + (on ? "var(--brand)" : "var(--line)"),
                    background: on ? "var(--brand-soft)" : "var(--surface)",
                    color: on ? "var(--brand)" : "var(--text-2)",
                    fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{c.flag}</span>
                  {ar ? c.ar.replace("المملكة العربية ", "").replace("العربية المتحدة", "").replace("سلطنة ", "") : c.en}
                </button>
              );
            })}
          </div>

          <Btn size="lg" full onClick={confirm}>
            <Icon name="check" size={18} />
            {ar ? "تأكيد ومتابعة" : "Confirm & continue"}
          </Btn>
        </div>
      </div>

      <style>{`
        @keyframes mash-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes mash-pop-in { from { transform: scale(.9) translateY(10px); opacity: 0 } to { transform: scale(1) translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
