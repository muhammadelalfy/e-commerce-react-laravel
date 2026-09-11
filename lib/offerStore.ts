"use client";
import { createStore } from "./createStore";

/**
 * Shared, persisted store for VENDOR-sponsored offers (advertisements).
 * A vendor subscribed to an ad package adds offers (image + start/end date +
 * category/sub-category); they appear in "عروض مختارة لك" on the home page and
 * in the admin ads CRUD. Backend-ready.
 */
export interface Offer {
  id: string;
  vendor: string;        // vendor id
  ar: string;            // title (AR)
  en: string;            // title (EN)
  cat: string;           // category id
  subcat?: string;       // sub-category id
  img: string;           // offer image (data URL or path)
  discount: number;      // % off
  start: string;         // ISO date
  end: string;           // ISO date
  active: boolean;
}

const LS_KEY = "mash_offers";
const IMG = "/img/";

// seed a couple of promoted offers so the section isn't empty
const SEED: Offer[] = [
  { id: "of1", vendor: "techzone", ar: "خصم الجمعة على السماعات", en: "Friday headphones deal", cat: "electronics", subcat: "audio", img: IMG + "cat-electronics.png", discount: 40, start: "2026-07-25", end: "2026-08-30", active: true },
  { id: "of2", vendor: "aloud", ar: "عرض العود الفاخر", en: "Premium oud offer", cat: "perfumes", subcat: "oud", img: IMG + "cat-beauty.png", discount: 30, start: "2026-07-20", end: "2026-08-20", active: true },
];

const store = createStore<Offer[]>({ key: LS_KEY, initial: SEED });

export function addOffer(o: Omit<Offer, "id">) {
  store.set([{ ...o, id: "of" + Date.now() }, ...store.get()]);
}
export function updateOffer(id: string, patch: Partial<Offer>) {
  store.set(store.get().map((o) => (o.id === id ? { ...o, ...patch } : o)));
}
export function removeOffer(id: string) { store.set(store.get().filter((o) => o.id !== id)); }
export function offersOf(vendorId: string) { return store.get().filter((o) => o.vendor === vendorId); }

export function useOfferStore() {
  const offers = store.useStore();
  return { offers, addOffer, updateOffer, removeOffer, offersOf };
}
