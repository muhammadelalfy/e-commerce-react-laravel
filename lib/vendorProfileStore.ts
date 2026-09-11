"use client";
import { createStore } from "./createStore";

/**
 * Per-vendor profile extras that the store owner sets from their dashboard
 * (currently the "بروشور" / brochure document). Kept in a tiny shared store so
 * the dashboard upload and the public store-profile page stay in sync.
 * Persisted to localStorage. (Backend-ready: swap for API calls later.)
 */
export interface Brochure { name: string; type: string; data: string; } // data = data: URL

const KEY = "mash_vendor_profiles";
const store = createStore<Record<string, Brochure>>({ key: KEY, initial: {} });

export function setBrochure(vendorId: string, b: Brochure) { store.set({ ...store.get(), [vendorId]: b }); }
export function removeBrochure(vendorId: string) {
  const n = { ...store.get() };
  delete n[vendorId];
  store.set(n);
}
export function brochureOf(vendorId: string): Brochure | undefined { return store.get()[vendorId]; }

/** subscribe to the shared vendor-profile store from any component */
export function useVendorProfileStore() {
  const brochures = store.useStore();
  return { brochures, setBrochure, removeBrochure, brochureOf };
}
