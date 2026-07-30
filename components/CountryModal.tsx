"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn } from "./ui";
import { useGeoStore } from "@/lib/geoStore";
import { GULF_COUNTRIES, type Country } from "@/lib/countries";

// re-export so existing imports of GULF_COUNTRIES/Country from this module keep working
export { GULF_COUNTRIES };
export type { Country };

const STORAGE_KEY = "mash_country";
const CITY_KEY = "mash_city";

// simple in-memory cache so we don't refetch the same country's cities
const cityCache: Record<string, string[]> = {};

export interface ApiCountry { name: string; iso2: string; flag: string; }
let countryCache: ApiCountry[] | null = null;

/** turn an ISO2 code (e.g. "EG") into its flag emoji 🇪🇬 */
function iso2ToFlag(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return "🏳️";
  const A = 0x1f1e6;
  return String.fromCodePoint(A + (iso2.charCodeAt(0) - 65), A + (iso2.charCodeAt(1) - 65));
}

/** Fetch the full world country list (name + iso2 + flag) from CountriesNow. */
export async function fetchCountries(signal?: AbortSignal): Promise<ApiCountry[]> {
  if (countryCache) return countryCache;
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/iso", { signal });
  if (!res.ok) throw new Error("countries request failed");
  const json = await res.json();
  const rows: { name: string; Iso2: string }[] = Array.isArray(json?.data) ? json.data : [];
  const list = rows
    .filter((r) => r?.name)
    .map((r) => ({ name: r.name, iso2: r.Iso2, flag: iso2ToFlag(r.Iso2) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  countryCache = list;
  return list;
}

/** Fetch a country's cities from the free CountriesNow API (no key required). */
export async function fetchCities(englishName: string, signal?: AbortSignal): Promise<string[]> {
  if (cityCache[englishName]) return cityCache[englishName];
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: englishName }),
    signal,
  });
  if (!res.ok) throw new Error("cities request failed");
  const json = await res.json();
  const list: string[] = Array.isArray(json?.data) ? json.data : [];
  cityCache[englishName] = list;
  return list;
}

export function CountryModal() {
  const { lang } = useApp();
  const ar = lang === "ar";
  const geo = useGeoStore();
  // countries shown = Gulf seed + any admin-added countries (shared geo store)
  const COUNTRIES = geo.countries.length ? geo.countries : GULF_COUNTRIES;
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<string>("sa");
  const [city, setCity] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // show on load until the visitor has chosen BOTH a country and a city (client-only)
  useEffect(() => {
    setMounted(true);
    const savedCountry = localStorage.getItem(STORAGE_KEY);
    const savedCity = localStorage.getItem(CITY_KEY);
    if (savedCountry) setCountry(savedCountry);
    if (savedCity) setCity(savedCity);
    if (!savedCountry || !savedCity) setOpen(true);
  }, []);

  // allow reopening from anywhere (e.g. the header chip) via a window event
  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener("mash:open-country", reopen);
    return () => window.removeEventListener("mash:open-country", reopen);
  }, []);

  // fetch the selected country's cities whenever it changes (while the modal is open)
  useEffect(() => {
    if (!open) return;
    const c = COUNTRIES.find((x) => x.id === country);
    if (!c) return;
    const ctrl = new AbortController();
    setLoadingCities(true);
    setCityError(false);
    setCity("");
    fetchCities(c.en, ctrl.signal)
      .then((list) => { setCities(list); })
      .catch((e) => { if (e?.name !== "AbortError") { setCities([]); setCityError(true); } })
      .finally(() => { setLoadingCities(false); });
    return () => ctrl.abort();
  }, [country, open]);

  // lock body scroll while the modal is open
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, mounted]);

  const confirm = () => {
    if (!city) return;
    localStorage.setItem(STORAGE_KEY, country);
    localStorage.setItem(CITY_KEY, city);
    window.dispatchEvent(new CustomEvent("mash:country-changed"));
    setOpen(false);
  };

  if (!mounted || !open) return null;

  const sel = COUNTRIES.find((c) => c.id === country) || COUNTRIES[0];

  // a returning visitor (already has a saved city) may dismiss without re-choosing
  const canDismiss = !!localStorage.getItem(CITY_KEY);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => { if (canDismiss) setOpen(false); }}
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
                {COUNTRIES.map((c) => (
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

          {/* city dropdown — fetched live from CountriesNow API for the selected country */}
          <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="pin" size={15} style={{ color: "var(--brand)" }} />
              {ar ? "المدينة" : "City"}
              {loadingCities && <span style={{ fontSize: 11.5, color: "var(--text-3)", fontWeight: 600 }}>{ar ? "…جارٍ التحميل" : "loading…"}</span>}
            </span>
            <div style={{ position: "relative" }}>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loadingCities || cities.length === 0}
                style={{
                  width: "100%", height: 50, paddingInlineStart: 16, paddingInlineEnd: 40,
                  borderRadius: 12, border: "1.5px solid var(--line)",
                  background: "var(--surface-2)", color: cities.length ? "var(--text)" : "var(--text-3)",
                  fontSize: 15, fontWeight: 600, fontFamily: "inherit",
                  appearance: "none", cursor: cities.length ? "pointer" : "default",
                  opacity: loadingCities ? .6 : 1,
                }}
              >
                <option value="">
                  {loadingCities ? (ar ? "جارٍ جلب المدن…" : "Fetching cities…")
                    : cityError ? (ar ? "تعذّر جلب المدن" : "Couldn't load cities")
                    : cities.length === 0 ? (ar ? "لا توجد مدن" : "No cities")
                    : (ar ? "اختر مدينتك" : "Select your city")}
                </option>
                {cities.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
              <span style={{ position: "absolute", insetInlineEnd: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }}>
                <Icon name="chevron" size={18} />
              </span>
            </div>
            {cityError && (
              <span style={{ fontSize: 11.5, color: "var(--sale)" }}>
                {ar ? "تعذّر الاتصال بخدمة المدن — يمكنك المتابعة بدون مدينة." : "City service unavailable — you can continue without a city."}
              </span>
            )}
          </label>

          {/* quick-pick flag chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {COUNTRIES.slice(0, 6).map((c) => {
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

          <Btn size="lg" full onClick={confirm} disabled={!city} style={{ opacity: city ? 1 : .55, cursor: city ? "pointer" : "not-allowed" }}>
            <Icon name="check" size={18} />
            {city ? (ar ? "تأكيد ومتابعة" : "Confirm & continue") : (ar ? "اختر مدينتك أولاً" : "Select your city first")}
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
