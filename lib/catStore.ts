"use client";
import { useEffect, useState } from "react";
import { CATS, SUBCATS, type Cat, type SubCat } from "./data";

/**
 * Shared, persisted store for categories (departments) + their sub-categories.
 * Admin manages both via CRUD; the vendor "add product" form reads from it so a
 * newly-added category/subcategory is immediately selectable. Backend-ready.
 */
const LS_KEY = "mash_cats";

const SEED_CATS: Cat[] = CATS.map((c) => ({ ...c }));
const SEED_SUBS: SubCat[] = SUBCATS.map((s) => ({ ...s }));

let cats: Cat[] = SEED_CATS;
let subs: SubCat[] = SEED_SUBS;
let hydrated = false;

const listeners = new Set<() => void>();
const persist = () => { if (typeof window !== "undefined") { try { localStorage.setItem(LS_KEY, JSON.stringify({ cats, subs })); } catch { /* quota */ } } };
const emit = () => { persist(); listeners.forEach((l) => l()); };

function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved?.cats) && saved.cats.length) cats = saved.cats;
      if (Array.isArray(saved?.subs)) subs = saved.subs;
      listeners.forEach((l) => l());
    }
  } catch { /* ignore corrupt storage */ }
}

export function addCategory(c: Cat) { cats = [...cats, c]; emit(); }
export function removeCategory(id: string) {
  cats = cats.filter((c) => c.id !== id);
  subs = subs.filter((s) => s.cat !== id); // remove orphaned sub-categories
  emit();
}
export function addSubCategory(s: SubCat) { subs = [...subs, s]; emit(); }
export function removeSubCategory(id: string) { subs = subs.filter((s) => s.id !== id); emit(); }
export function subsOf(catId: string) { return subs.filter((s) => s.cat === catId); }

/** subscribe to the shared category store */
export function useCatStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    hydrateOnce();
    return () => { listeners.delete(l); };
  }, []);
  return { cats, subs, addCategory, removeCategory, addSubCategory, removeSubCategory, subsOf };
}
