"use client";
import { createContext, useContext } from "react";
import type { Lang, Strings } from "./data";

export type Role = "guest" | "customer" | "vendor" | "reels";

export interface AppUser {
  name: string;
  role: Role;
}

export interface AppState {
  t: Strings;
  lang: Lang;
  theme: "light" | "dark";
  toggleLang: () => void;
  toggleTheme: () => void;
  go: (page: string, id?: string | null) => void;
  favs: string[];
  toggleFav: (id: string) => void;
  user: AppUser | null;
  signIn: (user: AppUser) => void;
  signOut: () => void;
}

export const AppCtx = createContext<AppState | null>(null);
export const useApp = (): AppState => {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used within AppCtx.Provider");
  return v;
};
