"use client";
import { useEffect, useState } from "react";
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

let coupons: Coupon[] = COUPONS.map((c) => ({ ...c }));
let notices: AdminNotice[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function addVendorCoupon(c: Coupon) {
  coupons = [c, ...coupons];
  notices = [
    { id: "cn" + Date.now(), vendor: c.vendor, code: c.code, pct: c.pct, time: Date.now(), read: false },
    ...notices,
  ];
  emit();
}
/** admin-created coupon (no vendor notification) */
export function addCoupon(c: Coupon) { coupons = [c, ...coupons]; emit(); }
export function updateCoupon(id: string, patch: Partial<Coupon>) {
  coupons = coupons.map((c) => (c.id === id ? { ...c, ...patch } : c));
  emit();
}
export function removeCoupon(id: string) { coupons = coupons.filter((c) => c.id !== id); emit(); }
export function toggleCoupon(id: string) {
  coupons = coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
  emit();
}
export function markNoticesRead() {
  notices = notices.map((n) => ({ ...n, read: true }));
  emit();
}
export function getCoupons() { return coupons; }
export function getNotices() { return notices; }

/** subscribe to the shared coupon store from any component */
export function useCouponStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return { coupons, notices, addVendorCoupon, addCoupon, updateCoupon, removeCoupon, toggleCoupon, markNoticesRead };
}
