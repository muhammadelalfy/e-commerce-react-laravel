"use client";
import { useEffect, useState } from "react";
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

// NOTE: start from SEED on BOTH server and client so the first client render
// matches the server HTML (no hydration mismatch). We hydrate from localStorage
// once, inside a client effect (hydrateOnce), after mount.
let countries: GeoCountry[] = SEED_COUNTRIES;
let cities: GeoCity[] = SEED_CITIES;
let hydrated = false;

const listeners = new Set<() => void>();
const persist = () => { if (typeof window !== "undefined") { try { localStorage.setItem(LS_KEY, JSON.stringify({ countries, cities })); } catch { /* quota */ } } };
const emit = () => { persist(); listeners.forEach((l) => l()); };

/** hydrate from localStorage exactly once, on the client, after mount */
function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved?.countries) && saved.countries.length) countries = saved.countries;
      if (Array.isArray(saved?.cities)) cities = saved.cities;
      listeners.forEach((l) => l());
    }
  } catch { /* ignore corrupt storage */ }
}

export function addCountry(c: GeoCountry) { countries = [c, ...countries]; emit(); }
/** add a country together with a list of city names (from the external API) */
export function addCountryWithCities(c: GeoCountry, cityNames: string[]) {
  countries = [c, ...countries];
  const newCities: GeoCity[] = cityNames.map((n, i) => ({ id: c.id + "-" + i, ar: n, en: n, stores: 0, country: c.id }));
  cities = [...newCities, ...cities];
  emit();
}
export function removeCountry(id: string) {
  countries = countries.filter((c) => c.id !== id);
  // orphaned cities go with their country
  cities = cities.filter((c) => c.country !== id);
  emit();
}
export function addCity(c: GeoCity) { cities = [c, ...cities]; emit(); }
export function removeCity(id: string) { cities = cities.filter((c) => c.id !== id); emit(); }
export function citiesOf(countryId: string) { return cities.filter((c) => c.country === countryId); }

/** subscribe to the shared geo store */
export function useGeoStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    hydrateOnce();
    return () => { listeners.delete(l); };
  }, []);
  return { countries, cities, addCountry, addCountryWithCities, removeCountry, addCity, removeCity, citiesOf };
}
