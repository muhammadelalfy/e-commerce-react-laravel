"use client";
import { createContext, useContext } from "react";
import type { Lang, Strings } from "./data";

export interface AppState {
  t: Strings;
  lang: Lang;
  theme: "light" | "dark";
  toggleLang: () => void;
  toggleTheme: () => void;
  go: (page: string, id?: string | null) => void;
  favs: string[];
  toggleFav: (id: string) => void;
}

export const AppCtx = createContext<AppState | null>(null);
export const useApp = (): AppState => {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used within AppCtx.Provider");
  return v;
};
