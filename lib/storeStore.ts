"use client";
import { createStore } from "./createStore";

/**
 * Shared, persisted store for NEW vendor/store registrations awaiting admin
 * approval. A trader registering a store (Auth / AddStore) creates a PENDING
 * entry; the admin Stores tab approves or rejects it. Backend-ready.
 */
export type StoreStatus = "PENDING" | "APPROVED" | "REJECTED";
export interface StoreApplication {
  id: string;
  ar: string;
  en: string;
  cat: string;          // category id
  city: string;         // display city name
  owner: string;
  cr?: string;          // commercial-registration number
  status: StoreStatus;
  time: number;
}

const LS_KEY = "mash_store_apps";

// a couple of seed pending applications so the admin tab isn't empty
const SEED: StoreApplication[] = [
  { id: "app1", ar: "متجر التقنية الحديثة", en: "Modern Tech Store", cat: "electronics", city: "الرياض", owner: "خالد العتيبي", cr: "1010234567", status: "PENDING", time: Date.now() - 3600e3 },
  { id: "app2", ar: "بيت العطور", en: "House of Perfumes", cat: "perfumes", city: "جدة", owner: "سارة القحطاني", cr: "4030112233", status: "PENDING", time: Date.now() - 7200e3 },
];

const store = createStore<StoreApplication[]>({ key: LS_KEY, initial: SEED });

/** a trader submits a new store registration (lands as PENDING) */
export function submitStore(a: Omit<StoreApplication, "id" | "status" | "time">) {
  store.set([{ ...a, id: "app" + Date.now(), status: "PENDING", time: Date.now() }, ...store.get()]);
}
export function setStoreStatus(id: string, status: StoreStatus) {
  store.set(store.get().map((a) => (a.id === id ? { ...a, status } : a)));
}

export function useStoreStore() {
  const apps = store.useStore();
  return { apps, submitStore, setStoreStatus };
}
