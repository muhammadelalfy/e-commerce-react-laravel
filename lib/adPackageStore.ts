"use client";
import { createStore } from "./createStore";

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

// scale a package price (set for `basePeriod`) to the equivalent price for
// `target` period, using a per-day rate. Lets the UI show all periods' prices.
export function priceForPeriod(price: number, basePeriod: AdPeriod, target: AdPeriod): number {
  const perDay = price / PERIOD_DAYS[basePeriod];
  return Math.round(perDay * PERIOD_DAYS[target]);
}
export interface AdPackage { id: string; ar: string; en: string; ads: number; price: number; period: AdPeriod; start?: string; autoRenew?: boolean; renewPrice?: number; active: boolean; }
/** a vendor's subscription: which package + the chosen date range */
export interface AdSub { pkg: string; start: string; end: string; autoRenew?: boolean; }

// packages + subscriptions are always read/written together, so they share one
// persisted key (was two separate keys — an internal detail, not a public API).
const LS_KEY = "mash_ad_packages_and_subs";

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

interface AdState { packages: AdPackage[]; subs: Record<string, AdSub>; }

// demo subscriptions so the admin "subscribed stores" table isn't empty:
// techzone = active monthly, aloud = expired weekly (shows the Extend button)
const _today = new Date().toISOString().slice(0, 10);
const SEED_SUBS: Record<string, AdSub> = {
  techzone: { pkg: "adp-month", start: addDays(_today, -5), end: addDays(_today, 25) },
  aloud: { pkg: "adp-week", start: addDays(_today, -14), end: addDays(_today, -7) },
};

const store = createStore<AdState>({ key: LS_KEY, initial: { packages: SEED, subs: SEED_SUBS } });
store.hydrateOnce((saved, current) => {
  const s = saved as Partial<AdState> | null;
  if (!s) return undefined;
  return {
    packages: Array.isArray(s.packages) && s.packages.length ? s.packages : current.packages,
    subs: s.subs && typeof s.subs === "object" ? s.subs : current.subs,
  };
});

export function addPackage(p: AdPackage) { const s = store.get(); store.set({ ...s, packages: [...s.packages, p] }); }
export function updatePackage(id: string, patch: Partial<AdPackage>) {
  const s = store.get();
  store.set({ ...s, packages: s.packages.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
}
export function removePackage(id: string) { const s = store.get(); store.set({ ...s, packages: s.packages.filter((p) => p.id !== id) }); }

/** subscribe from a chosen start date; the end date = start + package period */
export function subscribe(vendorId: string, packageId: string, start: string) {
  const s = store.get();
  const p = s.packages.find((x) => x.id === packageId);
  const st = start || new Date().toISOString().slice(0, 10);
  const end = p ? addDays(st, PERIOD_DAYS[p.period]) : addDays(st, 30);
  store.set({ ...s, subs: { ...s.subs, [vendorId]: { pkg: packageId, start: st, end } } });
}
export function unsubscribe(vendorId: string) {
  const s = store.get();
  const n = { ...s.subs };
  delete n[vendorId];
  store.set({ ...s, subs: n });
}
/** extend a vendor's subscription by its package period from today (renewal) */
export function extend(vendorId: string) {
  const s = store.get();
  const sub = s.subs[vendorId]; if (!sub) return;
  const p = s.packages.find((x) => x.id === sub.pkg);
  const start = new Date().toISOString().slice(0, 10);
  const end = addDays(start, p ? PERIOD_DAYS[p.period] : 30);
  store.set({ ...s, subs: { ...s.subs, [vendorId]: { ...sub, start, end } } });
}
/** toggle auto-renewal on a specific subscription */
export function toggleSubAutoRenew(vendorId: string) {
  const s = store.get();
  const sub = s.subs[vendorId]; if (!sub) return;
  store.set({ ...s, subs: { ...s.subs, [vendorId]: { ...sub, autoRenew: !sub.autoRenew } } });
}
/** all vendor subscriptions with their package + expiry & auto-renew flags */
export function allSubs(): { vendor: string; pkg: AdPackage | null; start: string; end: string; expired: boolean; autoRenew: boolean }[] {
  const s = store.get();
  const today = new Date().toISOString().slice(0, 10);
  return Object.entries(s.subs).map(([vendor, sub]) => ({
    vendor, pkg: s.packages.find((p) => p.id === sub.pkg) ?? null,
    start: sub.start, end: sub.end, expired: !!sub.end && sub.end < today, autoRenew: !!sub.autoRenew,
  }));
}
/** current subscription = the package + the chosen date range (or null) */
export function subOf(vendorId: string): (AdPackage & { start: string; end: string }) | null {
  const s = store.get();
  const sub = s.subs[vendorId];
  if (!sub) return null;
  const p = s.packages.find((x) => x.id === sub.pkg);
  return p ? { ...p, start: sub.start, end: sub.end } : null;
}

export function useAdPackageStore() {
  const { packages, subs } = store.useStore();
  return { packages, subs, addPackage, updatePackage, removePackage, subscribe, unsubscribe, extend, toggleSubAutoRenew, subOf, allSubs };
}
