"use client";
import React, { useState, useEffect } from "react";
import { AppCtx, type AppState, type AppUser } from "@/lib/AppContext";
import { STR, NOTIFS, type Lang } from "@/lib/data";
import { TopBar, Header, Footer } from "./Shell";
import { Home } from "./pages/Home";
import { CategoryPage, Vendor } from "./pages/Catalog";
import { Auctions } from "./pages/Auctions";
import { Dashboard } from "./pages/Dashboard";
import { Info } from "./pages/Info";
import { AddStore } from "./pages/AddStore";
import { Auth } from "./pages/Auth";
import { Notifications, Reels, Events, StoresMap, Favorites } from "./pages/Features";
import { Admin } from "./pages/Admin";
import { ReelsStudio } from "./pages/ReelsStudio";
import { CountryModal } from "./CountryModal";
import { useAutoReveal } from "@/lib/gsap";

export default function App() {
  const [lang, setLang] = useState<Lang>("ar"); // Arabic-first by default
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [page, setPage] = useState("home");
  const [param, setParam] = useState<string | null>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<AppUser | null>(null);
  const t = STR[lang];

  // hydrate persisted prefs on mount (client only)
  useEffect(() => {
    const savedTheme = localStorage.getItem("mash_theme") as "light" | "dark" | null;
    const savedLang = localStorage.getItem("mash_lang") as Lang | null;
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLang(savedLang);
    const savedUser = localStorage.getItem("mash_user");
    if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch {} }
  }, []);

  useEffect(() => {
    const r = document.documentElement;
    r.lang = lang;
    r.dir = STR[lang].dir;
    r.dataset.theme = theme;
    localStorage.setItem("mash_lang", lang);
    localStorage.setItem("mash_theme", theme);
  }, [lang, theme]);

  const go = (p: string, id: string | null = null) => { setPage(p); setParam(id); setQuery(""); window.scrollTo({ top: 0 }); };
  const toggleLang = () => setLang((l) => (l === "ar" ? "en" : "ar"));
  const toggleTheme = () => setTheme((th) => (th === "light" ? "dark" : "light"));
  const toggleFav = (id: string) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const signIn = (u: AppUser) => { setUser(u); localStorage.setItem("mash_user", JSON.stringify(u)); };
  const signOut = () => { setUser(null); localStorage.removeItem("mash_user"); go("home"); };

  const ctx: AppState = { t, lang, theme, toggleLang, toggleTheme, go, favs, toggleFav, user, signIn, signOut };
  const unread = NOTIFS.filter((n) => !n.read).length;
  // whole-site scroll reveal — re-scans on every page/param/lang change
  const mainRef = useAutoReveal<HTMLElement>(page + ":" + param + ":" + lang);

  let body: React.ReactNode;
  if (page === "vendor") body = <Vendor id={param!} go={go} />;
  else if (page === "category") body = <CategoryPage id={param!} go={go} />;
  else if (page === "shop") body = <CategoryPage id="all" go={go} />;
  else if (page === "auctions") body = <Auctions go={go} active={page === "auctions"} />;
  else if (page === "dashboard") body = <Dashboard go={go} />;
  else if (page === "info") body = <Info id={param} go={go} />;
  else if (page === "addstore") body = <AddStore go={go} />;
  else if (page === "auth") body = <Auth param={param} go={go} />;
  else if (page === "notifications") body = <Notifications />;
  else if (page === "reels-studio") body = <ReelsStudio go={go} />;
  else if (page === "reels") body = <Reels />;
  else if (page === "events") body = <Events go={go} />;
  else if (page === "map") body = <StoresMap go={go} />;
  else if (page === "favorites") body = <Favorites go={go} favs={favs} toggleFav={toggleFav} />;
  else if (page === "admin") body = <Admin go={go} />;
  else body = <Home go={go} query={query} />;

  return (
    <AppCtx.Provider value={ctx}>
      <CountryModal />
      <TopBar />
      <Header go={go} onSearch={setQuery} cur={page} favCount={favs.length} unread={unread} />
      <main ref={mainRef} style={{ minHeight: "60vh", paddingBottom: 20 }}>{body}</main>
      <Footer />
    </AppCtx.Provider>
  );
}
