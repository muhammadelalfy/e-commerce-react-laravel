"use client";
import { useEffect, useState } from "react";

/**
 * Generic factory for the shared, client-side pub/sub stores used across this
 * app (categories, coupons, offers, reps, geo, ad packages, …).
 *
 * DRY: every store used to hand-roll the same listener Set + persist/emit +
 * hydrate-once-from-localStorage + `useXStore` subscription hook. That
 * boilerplate now lives here, once (Observer pattern for the pub/sub, single
 * responsibility for this module: "keep a piece of client state in sync with
 * its subscribers and with localStorage").
 *
 * A store module still owns its own state shape and mutator functions — this
 * factory only gives it `get`, `set`, `subscribe`, and a ready-made
 * `useStore()` hook. Swapping localStorage for real API calls later only
 * touches the mutator functions in each store module, not this file.
 */
export function createStore<T>(opts: { key?: string; initial: T }) {
  const { key, initial } = opts;
  let state: T = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const persist = () => {
    if (!key || typeof window === "undefined") return;
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* quota */ }
  };

  const notify = () => listeners.forEach((l) => l());

  /** read from localStorage once, on the client, then notify subscribers */
  const hydrateOnce = (merge?: (saved: unknown, current: T) => T | undefined) => {
    if (hydrated || !key || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return;
      const saved = JSON.parse(raw);
      const next = merge ? merge(saved, state) : (saved as T);
      if (next !== undefined) { state = next; notify(); }
    } catch { /* ignore corrupt storage */ }
  };

  return {
    get: () => state,
    /** replace the state, persist it, and notify subscribers */
    set: (next: T) => { state = next; persist(); notify(); },
    hydrateOnce,
    /** React hook: subscribes a component to this store's changes */
    useStore(): T {
      const [, force] = useState(0);
      useEffect(() => {
        const l = () => force((n) => n + 1);
        listeners.add(l);
        hydrateOnce();
        return () => { listeners.delete(l); };
      }, []);
      return state;
    },
  };
}
