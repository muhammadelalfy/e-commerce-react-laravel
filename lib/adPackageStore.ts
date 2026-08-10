"use client";
import { useEffect, useState } from "react";

/**
 * Advertisement packages (admin-managed) + vendor subscriptions.
 * Admin defines packages (name, number of ads allowed, price). A vendor
 * subscribes to one from their dashboard; the ads count caps how many
 * sponsored offers that vendor may publish. Backend-ready.
 */
export type AdPeriod = "week" | "month" | "6months" | "year"; // مدة الاشتراك
export const PERIOD_DAYS: Record<AdPeriod, number> = { week: 7, month: 30, "6months": 180, year: 365 };
/** localized label for a period */
export function periodLabelOf(p: AdPeriod, ar: boolean): string {
  return ar
    ? { week: "أسبوعي", month: "شهري", "6months": "٦ أشهر", year: "سنوي" }[p]
    : { week: "Weekly", month: "Monthly", "6months": "6 months", year: "Yearly" }[p];
}
export interface AdPackage { id: string; ar: string; en: string; ads: number; price: number; period: AdPeriod; start?: string; autoRenew?: boolean; renewPrice?: number; active: boolean; }
/** a vendor's subscription: which package + the chosen date range */
export interface AdSub { pkg: string; start: string; end: string; autoRenew?: boolean; }

const LS_PKG = "mash_ad_packages";
const LS_SUB = "mash_ad_subs"; // { [vendorId]: AdSub }

const SEED: AdPackage[] = [
  { id: "adp-week", ar: "باقة أسبوعية", en: "Weekly", ads: 3, price: 99, period: "week", active: true },
  { id: "adp-month", ar: "باقة شهرية", en: "Monthly", ads: 10, price: 249, period: "month", active: true },
  { id: "adp-6m", ar: "باقة نصف سنوية", en: "6 Months", ads: 40, price: 1199, period: "6months", active: true },
  { id: "adp-year", ar: "باقة سنوية", en: "Yearly", ads: 100, price: 1999, period: "year", active: true },
];

// compute an end date = start + the package period length
export function addDays(iso: string, days: number): string {
  const d = new Date((iso || new Date().toISOString().slice(0, 10)) + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

let packages: AdPackage[] = SEED;
// demo subscriptions so the admin "subscribed stores" table isn't empty:
// techzone = active monthly, aloud = expired weekly (shows the Extend button)
const _today = new Date().toISOString().slice(0, 10);
let subs: Record<string, AdSub> = {
  techzone: { pkg: "adp-month", start: addDays(_today, -5), end: addDays(_today, 25) },
  aloud: { pkg: "adp-week", start: addDays(_today, -14), end: addDays(_today, -7) },
};
let hydrated = false;

const listeners = new Set<() => void>();
const persist = () => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LS_PKG, JSON.stringify(packages)); localStorage.setItem(LS_SUB, JSON.stringify(subs)); } catch { /* quota */ }
};
const emit = () => { persist(); listeners.forEach((l) => l()); };

function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const p = localStorage.getItem(LS_PKG); if (p) { const s = JSON.parse(p); if (Array.isArray(s) && s.length) packages = s; }
    const s = localStorage.getItem(LS_SUB); if (s) { const o = JSON.parse(s); if (o && typeof o === "object") subs = o; }
    listeners.forEach((l) => l());
  } catch { /* ignore */ }
}

export function addPackage(p: AdPackage) { packages = [...packages, p]; emit(); }
export function updatePackage(id: string, patch: Partial<AdPackage>) { packages = packages.map((p) => (p.id === id ? { ...p, ...patch } : p)); emit(); }
export function removePackage(id: string) { packages = packages.filter((p) => p.id !== id); emit(); }

/** subscribe from a chosen start date; the end date = start + package period */
export function subscribe(vendorId: string, packageId: string, start: string) {
  const p = packages.find((x) => x.id === packageId);
  const s = start || new Date().toISOString().slice(0, 10);
  const end = p ? addDays(s, PERIOD_DAYS[p.period]) : addDays(s, 30);
  subs = { ...subs, [vendorId]: { pkg: packageId, start: s, end } };
  emit();
}
export function unsubscribe(vendorId: string) { const n = { ...subs }; delete n[vendorId]; subs = n; emit(); }
/** extend a vendor's subscription by its package period from today (renewal) */
export function extend(vendorId: string) {
  const sub = subs[vendorId]; if (!sub) return;
  const p = packages.find((x) => x.id === sub.pkg);
  const start = new Date().toISOString().slice(0, 10);
  const end = addDays(start, p ? PERIOD_DAYS[p.period] : 30);
  subs = { ...subs, [vendorId]: { ...sub, start, end } };
  emit();
}
/** toggle auto-renewal on a specific subscription */
export function toggleSubAutoRenew(vendorId: string) {
  const sub = subs[vendorId]; if (!sub) return;
  subs = { ...subs, [vendorId]: { ...sub, autoRenew: !sub.autoRenew } };
  emit();
}
/** all vendor subscriptions with their package + expiry & auto-renew flags */
export function allSubs(): { vendor: string; pkg: AdPackage | null; start: string; end: string; expired: boolean; autoRenew: boolean }[] {
  const today = new Date().toISOString().slice(0, 10);
  return Object.entries(subs).map(([vendor, s]) => ({
    vendor, pkg: packages.find((p) => p.id === s.pkg) ?? null,
    start: s.start, end: s.end, expired: !!s.end && s.end < today, autoRenew: !!s.autoRenew,
  }));
}
/** current subscription = the package + the chosen date range (or null) */
export function subOf(vendorId: string): (AdPackage & { start: string; end: string }) | null {
  const sub = subs[vendorId];
  if (!sub) return null;
  const p = packages.find((x) => x.id === sub.pkg);
  return p ? { ...p, start: sub.start, end: sub.end } : null;
}

export function useAdPackageStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    hydrateOnce();
    return () => { listeners.delete(l); };
  }, []);
  return { packages, subs, addPackage, updatePackage, removePackage, subscribe, unsubscribe, extend, toggleSubAutoRenew, subOf, allSubs };
}
