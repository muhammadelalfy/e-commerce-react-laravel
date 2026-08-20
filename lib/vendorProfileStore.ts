"use client";
import { useEffect, useState } from "react";

/**
 * Per-vendor profile extras that the store owner sets from their dashboard
 * (currently the "بروشور" / brochure document). Kept in a tiny shared store so
 * the dashboard upload and the public store-profile page stay in sync.
 * Persisted to localStorage. (Backend-ready: swap for API calls later.)
 */
export interface Brochure { name: string; type: string; data: string; } // data = data: URL

const KEY = "mash_vendor_profiles";
let brochures: Record<string, Brochure> = {};
let hydrated = false;
const listeners = new Set<() => void>();
const emit = () => { persist(); listeners.forEach((l) => l()); };

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(brochures)); } catch {}
}
function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try { const s = localStorage.getItem(KEY); if (s) brochures = JSON.parse(s); } catch {}
}

export function setBrochure(vendorId: string, b: Brochure) { brochures = { ...brochures, [vendorId]: b }; emit(); }
export function removeBrochure(vendorId: string) { const n = { ...brochures }; delete n[vendorId]; brochures = n; emit(); }
export function brochureOf(vendorId: string): Brochure | undefined { return brochures[vendorId]; }

/** subscribe to the shared vendor-profile store from any component */
export function useVendorProfileStore() {
  const [, force] = useState(0);
  useEffect(() => {
    hydrateOnce();
    force((n) => n + 1); // re-render with hydrated data on mount
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return { brochures, setBrochure, removeBrochure, brochureOf };
}
