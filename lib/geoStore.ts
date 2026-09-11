"use client";
import { createStore } from "./createStore";
import { CITIES } from "./data";
import { GULF_COUNTRIES } from "./countries";

/**
 * Shared in-memory store for countries + their cities.
 * Cities belong to a country (city.country = country id), so:
 *  - Admin › Countries can expand a country to show its cities.
 *  - Admin › Cities has a country dropdown when adding a city.
 * Both tabs read/write this single source (backend-ready).
 */
export interface GeoCountry { id: string; ar: string; en: string; flag: string; dial: string; }
export interface GeoCity { id: string; ar: string; en: string; stores: number; country: string; }

const SEED_COUNTRIES: GeoCountry[] = GULF_COUNTRIES.map((c) => ({ id: c.id, ar: c.ar, en: c.en, flag: c.flag, dial: c.dial }));
// existing seed cities are all in Saudi Arabia ("sa")
const SEED_CITIES: GeoCity[] = CITIES.map((c) => ({ id: c.id, ar: c.ar, en: c.en, stores: c.stores, country: "sa" }));

const LS_KEY = "mash_geo";

interface GeoState { countries: GeoCountry[]; cities: GeoCity[]; }

// NOTE: start from SEED on BOTH server and client so the first client render
// matches the server HTML (no hydration mismatch). We hydrate from localStorage
// once, inside a client effect (hydrateOnce), after mount.
const store = createStore<GeoState>({ key: LS_KEY, initial: { countries: SEED_COUNTRIES, cities: SEED_CITIES } });
store.hydrateOnce((saved, current) => {
  const s = saved as Partial<GeoState> | null;
  if (!s) return undefined;
  return {
    countries: Array.isArray(s.countries) && s.countries.length ? s.countries : current.countries,
    cities: Array.isArray(s.cities) ? s.cities : current.cities,
  };
});

export function addCountry(c: GeoCountry) { const s = store.get(); store.set({ ...s, countries: [c, ...s.countries] }); }
/** add a country together with a list of city names (from the external API) */
export function addCountryWithCities(c: GeoCountry, cityNames: string[]) {
  const s = store.get();
  const newCities: GeoCity[] = cityNames.map((n, i) => ({ id: c.id + "-" + i, ar: n, en: n, stores: 0, country: c.id }));
  store.set({ countries: [c, ...s.countries], cities: [...newCities, ...s.cities] });
}
export function removeCountry(id: string) {
  const s = store.get();
  store.set({
    countries: s.countries.filter((c) => c.id !== id),
    cities: s.cities.filter((c) => c.country !== id), // orphaned cities go with their country
  });
}
export function addCity(c: GeoCity) { const s = store.get(); store.set({ ...s, cities: [c, ...s.cities] }); }
export function removeCity(id: string) { const s = store.get(); store.set({ ...s, cities: s.cities.filter((c) => c.id !== id) }); }
export function citiesOf(countryId: string) { return store.get().cities.filter((c) => c.country === countryId); }

/** subscribe to the shared geo store */
export function useGeoStore() {
  const { countries, cities } = store.useStore();
  return { countries, cities, addCountry, addCountryWithCities, removeCountry, addCity, removeCity, citiesOf };
}
