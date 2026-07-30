"use client";
import { useEffect, useState } from "react";

/**
 * Shared, persisted store for delegators / representatives (المندوبون).
 * Admin manages them via CRUD; the store-registration form's "المندوب"
 * dropdown reads from here so a newly-added rep is immediately selectable.
 */
export interface Rep { id: string; ar: string; en: string; phone: string; city: string; }

const LS_KEY = "mash_reps";

const SEED: Rep[] = [
  { id: "rep-khaled", ar: "خالد العتيبي", en: "Khaled Al-Otaibi", phone: "0501234567", city: "الرياض" },
  { id: "rep-sara", ar: "سارة القحطاني", en: "Sara Al-Qahtani", phone: "0559876543", city: "جدة" },
  { id: "rep-fahd", ar: "فهد الدوسري", en: "Fahd Al-Dosari", phone: "0533456789", city: "الدمام" },
];

let reps: Rep[] = SEED;
let hydrated = false;

const listeners = new Set<() => void>();
const persist = () => { if (typeof window !== "undefined") { try { localStorage.setItem(LS_KEY, JSON.stringify(reps)); } catch { /* quota */ } } };
const emit = () => { persist(); listeners.forEach((l) => l()); };

function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) { const saved = JSON.parse(raw); if (Array.isArray(saved) && saved.length) reps = saved; listeners.forEach((l) => l()); }
  } catch { /* ignore */ }
}

export function addRep(r: Rep) { reps = [...reps, r]; emit(); }
export function removeRep(id: string) { reps = reps.filter((r) => r.id !== id); emit(); }

export function useRepStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    hydrateOnce();
    return () => { listeners.delete(l); };
  }, []);
  return { reps, addRep, removeRep };
}
