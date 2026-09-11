"use client";
import { createStore } from "./createStore";
import { CATS, SUBCATS, type Cat, type SubCat } from "./data";

/**
 * Shared, persisted store for categories (departments) + their sub-categories.
 * Admin manages both via CRUD; the vendor "add product" form reads from it so a
 * newly-added category/subcategory is immediately selectable. Backend-ready.
 */
const LS_KEY = "mash_cats";

const SEED_CATS: Cat[] = CATS.map((c) => ({ ...c }));
const SEED_SUBS: SubCat[] = SUBCATS.map((s) => ({ ...s }));

interface CatState { cats: Cat[]; subs: SubCat[]; }
const store = createStore<CatState>({ key: LS_KEY, initial: { cats: SEED_CATS, subs: SEED_SUBS } });
store.hydrateOnce((saved, current) => {
  const s = saved as Partial<CatState> | null;
  if (!s) return undefined;
  return {
    cats: Array.isArray(s.cats) && s.cats.length ? s.cats : current.cats,
    subs: Array.isArray(s.subs) ? s.subs : current.subs,
  };
});

export function addCategory(c: Cat) { const s = store.get(); store.set({ ...s, cats: [...s.cats, c] }); }
export function removeCategory(id: string) {
  const s = store.get();
  store.set({
    cats: s.cats.filter((c) => c.id !== id),
    subs: s.subs.filter((sc) => sc.cat !== id), // remove orphaned sub-categories
  });
}
export function addSubCategory(sc: SubCat) { const s = store.get(); store.set({ ...s, subs: [...s.subs, sc] }); }
export function removeSubCategory(id: string) { const s = store.get(); store.set({ ...s, subs: s.subs.filter((sc) => sc.id !== id) }); }
export function subsOf(catId: string) { return store.get().subs.filter((s) => s.cat === catId); }

/** subscribe to the shared category store */
export function useCatStore() {
  const { cats, subs } = store.useStore();
  return { cats, subs, addCategory, removeCategory, addSubCategory, removeSubCategory, subsOf };
}
