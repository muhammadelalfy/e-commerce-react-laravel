"use client";
import { createStore } from "./createStore";

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

const store = createStore<Rep[]>({ key: LS_KEY, initial: SEED });
// original behaviour: an empty saved list does NOT clear the seed reps
store.hydrateOnce((saved) => (Array.isArray(saved) && saved.length ? (saved as Rep[]) : undefined));

export function addRep(r: Rep) { store.set([...store.get(), r]); }
export function removeRep(id: string) { store.set(store.get().filter((r) => r.id !== id)); }

export function useRepStore() {
  const reps = store.useStore();
  return { reps, addRep, removeRep };
}
