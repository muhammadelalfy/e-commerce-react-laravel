"use client";
import { createStore } from "./createStore";
import { COUPONS, type Coupon } from "./data";

/**
 * Tiny in-memory shared store for vendor coupons + admin notifications.
 * When a vendor adds a coupon from their dashboard, it lands here and the
 * admin's Coupons tab (and notification badge) reflect it immediately.
 * (Backend-ready: swap this module for API calls without touching the UI.)
 */
export interface AdminNotice {
  id: string;
  vendor: string;   // vendor id
  code: string;
  pct: number;
  time: number;     // Date.now()
  read: boolean;
}

interface CouponState { coupons: Coupon[]; notices: AdminNotice[]; }
// no `key` → in-memory only, same as the original (not persisted to localStorage)
const store = createStore<CouponState>({ initial: { coupons: COUPONS.map((c) => ({ ...c })), notices: [] } });

export function addVendorCoupon(c: Coupon) {
  const s = store.get();
  const notice: AdminNotice = { id: "cn" + Date.now(), vendor: c.vendor, code: c.code, pct: c.pct, time: Date.now(), read: false };
  store.set({ coupons: [c, ...s.coupons], notices: [notice, ...s.notices] });
}
/** admin-created coupon (no vendor notification) */
export function addCoupon(c: Coupon) { const s = store.get(); store.set({ ...s, coupons: [c, ...s.coupons] }); }
export function updateCoupon(id: string, patch: Partial<Coupon>) {
  const s = store.get();
  store.set({ ...s, coupons: s.coupons.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
}
export function removeCoupon(id: string) { const s = store.get(); store.set({ ...s, coupons: s.coupons.filter((c) => c.id !== id) }); }
export function toggleCoupon(id: string) {
  const s = store.get();
  store.set({ ...s, coupons: s.coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c)) });
}
export function markNoticesRead() {
  const s = store.get();
  store.set({ ...s, notices: s.notices.map((n) => ({ ...n, read: true })) });
}
export function getCoupons() { return store.get().coupons; }
export function getNotices() { return store.get().notices; }

/** subscribe to the shared coupon store from any component */
export function useCouponStore() {
  const { coupons, notices } = store.useStore();
  return { coupons, notices, addVendorCoupon, addCoupon, updateCoupon, removeCoupon, toggleCoupon, markNoticesRead };
}
