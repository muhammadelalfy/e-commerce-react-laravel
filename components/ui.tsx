"use client";
import React, { useRef, useEffect } from "react";
import { CATS, money } from "@/lib/data";

export { money };

/* ---- Icon set (inline stroke SVGs, 24 grid) ---- */
export const PATHS: Record<string, string> = {
  search: "M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM5 21a7 7 0 0114 0",
  cart: "M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 21a1 1 0 100-2 1 1 0 000 2M18 21a1 1 0 100-2 1 1 0 000 2",
  heart: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z",
  star: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z",
  chevron: "M6 9l6 6 6-6",
  sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6L4.5 4.5M19.5 19.5L18 18M18 6l1.5-1.5M4.5 19.5L6 18M12 17a5 5 0 100-10 5 5 0 000 10z",
  moon: "M21 13A9 9 0 1111 3a7 7 0 0010 10z",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.5 3.5 6 3.5 9S14.5 18.5 12 21M12 3C9.5 5.5 8.5 9 8.5 12s1 6.5 3.5 9",
  location: "M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10zM12 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  phone: "M5 4h3l2 5-2 1.5a11 11 0 005.5 5.5L20 19l-1 3a16 16 0 01-14-14z",
  check: "M5 13l4 4L19 7",
  truck: "M3 6h11v9H3zM14 9h4l3 3v3h-7zM7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3M18 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3",
  shield: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  arrow: "M5 12h14M13 6l6 6-6 6",
  headphones: "M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 012-2h1v6H6a2 2 0 01-2-2zM20 14a2 2 0 00-2-2h-1v6h1a2 2 0 002-2z",
  spray: "M9 8V4h3v4M9 8h3l2 3v9H7v-9zM15 5h1M17 7h1M15 9h1",
  shirt: "M7 4l-4 3 2 3 2-1v9h10v-9l2 1 2-3-4-3-3 2-2-2z",
  sofa: "M5 11V8a2 2 0 012-2h10a2 2 0 012 2v3M3 12a2 2 0 012 2v3h14v-3a2 2 0 014 0M5 17v2M19 17v2",
  watch: "M12 16a4 4 0 100-8 4 4 0 000 8zM9 4h6l-.5 4M9 20h6l-.5-4",
  utensils: "M5 3v8a2 2 0 002 2v8M5 7h4M9 3v18M16 3c-1.5 0-2 2-2 5s.5 4 2 4v9",
  gem: "M6 4h12l3 5-9 11L3 9z M3 9h18M9 4l-1 5 4 11 4-11-1-5",
  book: "M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2zM5 17h13",
  store: "M4 9l1-5h14l1 5M4 9v10h16V9M4 9h16M9 19v-5h6v5",
  building: "M3 21h18M5 21V5a1 1 0 011-1h8a1 1 0 011 1v16M15 21V9h3a1 1 0 011 1v11M8 7h2M8 11h2M8 15h2",
  gavel: "M13 10l-7 7-2-2 7-7M14 4l6 6-3 3-6-6zM3 21h9",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  box: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10",
  tag: "M3 12l8-8 9 1 1 9-8 8zM8 8h.01",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z",
  bag: "M6 8h12l1 12H5zM9 8a3 3 0 016 0",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1l2-1.6-2-3.4-2.3 1a7 7 0 00-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 00-1.7 1l-2.3-1-2 3.4 2 1.6a7 7 0 000 2l-2 1.6 2 3.4 2.3-1a7 7 0 001.7 1l.3 2.5h4l.3-2.5a7 7 0 001.7-1l2.3 1 2-3.4-2-1.6a7 7 0 00.1-1z",
  dollar: "M12 2v20M16 6.5C16 4.6 14.2 4 12 4S8 4.9 8 7s2 2.6 4 3 4 1 4 3-1.8 3-4 3-4-.8-4-2.5",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z",
  bell: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0",
  play: "M8 5v14l11-7z",
  calendar: "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
  ticket: "M3 8a2 2 0 012-2h14a2 2 0 012 2 2 2 0 000 4 2 2 0 010 4 2 2 0 01-2 2H5a2 2 0 01-2-2 2 2 0 000-4 2 2 0 010-4zM13 6v12",
  users: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M17 11a4 4 0 000-8M22 21a7 7 0 00-5-6.7",
  reel: "M3 6h18v12H3zM3 10h18M8 6l-2 4M13 6l-2 4M18 6l-2 4",
  pin: "M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10zM12 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  trend: "M3 17l6-6 4 4 8-8M21 7v5h-5",
  bars: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  edit: "M4 20h4l10-10-4-4L4 16zM14 6l4 4",
  filePdf: "M14 3v5h5M7 3h8l5 5v13H7zM9 13h2a1 1 0 010 2H9zM9 13v5",
  lock: "M6 10V8a6 6 0 1112 0v2M5 10h14v10H5zM12 14v3",
  back: "M19 12H5M11 6l-6 6 6 6",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  x: "M6 6l12 12M18 6L6 18",
  filter: "M3 5h18M6 12h12M10 19h4",
};

export function Icon({ name, size = 20, stroke = 1.7, fill = "none", style = {} }: { name: string; size?: number; stroke?: number; fill?: string; style?: React.CSSProperties; }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill === "none" ? "currentColor" : "none"}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", ...style }} aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

/* ---- Stars ---- */
export function Stars({ value = 5, count, size = 13 }: { value?: number; count?: number; size?: number; }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ display: "inline-flex", gap: 1 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon key={i} name="star" size={size} fill={i < Math.round(value) ? "var(--star)" : "var(--line)"} />
        ))}
      </span>
      {count != null && <span className="num" style={{ color: "var(--text-3)", fontSize: 12 }}>({count})</span>}
    </span>
  );
}

/* ---- Button ---- */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "soft" | "ghost";
  size?: "sm" | "md" | "lg";
  full?: boolean;
};
export function Btn({ variant = "primary", size = "md", full, children, style = {}, ...rest }: BtnProps) {
  const sizes = { sm: "8px 14px", md: "11px 20px", lg: "14px 26px" };
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: sizes[size], borderRadius: "var(--r-pill)", fontWeight: 700, fontSize: size === "sm" ? 13 : 14,
    border: "1.5px solid transparent", width: full ? "100%" : "auto", whiteSpace: "nowrap",
    transition: "filter .15s ease, background-color .15s, color .15s, border-color .15s", ...style,
  };
  const v = {
    primary: { background: "var(--brand)", color: "var(--on-brand)" },
    outline: { background: "transparent", color: "var(--text)", borderColor: "var(--line)" },
    soft: { background: "var(--brand-soft)", color: "var(--brand)" },
    ghost: { background: "transparent", color: "var(--text-2)" },
  }[variant];
  return (
    <button style={{ ...base, ...v }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(.94)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }} {...rest}>
      {children}
    </button>
  );
}

/* ---- Product thumbnail placeholder ---- */
export function Thumb({ p, ratio = "1 / 1", radius = "var(--r-md)" }: { p: { cat: string; color: string; img: string | null }; ratio?: string; radius?: string; }) {
  const cat = CATS.find((c) => c.id === p.cat);
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: ratio, borderRadius: radius, overflow: "hidden",
      background: p.img ? "#fff" : `radial-gradient(120% 120% at 30% 20%, ${p.color} 0%, ${p.color} 55%, rgba(0,0,0,.06) 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {p.img
        ? <img src={p.img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <Icon name={cat ? cat.icon : "store"} size={62} stroke={1.3} style={{ color: "rgba(20,40,30,.5)" }} />}
    </div>
  );
}

/* ---- Pill / chip ---- */
export function Chip({ children, active, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button {...rest} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
      borderRadius: "var(--r-pill)", border: "1.5px solid var(--line)", fontSize: 13, fontWeight: 600,
      background: active ? "var(--brand)" : "var(--surface)", color: active ? "#fff" : "var(--text-2)",
      borderColor: active ? "var(--brand)" : "var(--line)" }}>
      {children}
    </button>
  );
}

/* ---- Lightweight rich-text editor (CKEditor-style, no external deps) ----
   Uses a contentEditable surface + document.execCommand for formatting.
   Emits HTML via onChange. Self-contained so it works offline / under CSP. */
export function RichText({ value, onChange, dir = "rtl", minHeight = 140, placeholder }: { value: string; onChange: (html: string) => void; dir?: "rtl" | "ltr"; minHeight?: number; placeholder?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // set initial HTML once; afterwards the DOM is the source of truth (avoids caret jumps)
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };
  const tool = (label: React.ReactNode, cmd: string, title: string, arg?: string) => (
    <button type="button" title={title} onMouseDown={(e) => { e.preventDefault(); exec(cmd, arg); }}
      style={{ minWidth: 32, height: 30, padding: "0 8px", borderRadius: 7, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text-2)", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{label}</button>
  );
  return (
    <div style={{ border: "1.5px solid var(--line)", borderRadius: 10, overflow: "hidden", background: "var(--surface-2)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 8, borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        {tool(<b>B</b>, "bold", "Bold")}
        {tool(<i>I</i>, "italic", "Italic")}
        {tool(<u>U</u>, "underline", "Underline")}
        {tool("• قائمة", "insertUnorderedList", "Bulleted list")}
        {tool("1. قائمة", "insertOrderedList", "Numbered list")}
        <button type="button" title="Add link" onMouseDown={(e) => { e.preventDefault(); const url = window.prompt("URL:", "https://"); if (url) exec("createLink", url); }}
          style={{ minWidth: 32, height: 30, padding: "0 8px", borderRadius: 7, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text-2)", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>🔗</button>
        {tool("✕", "removeFormat", "Clear formatting")}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        dir={dir}
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        data-placeholder={placeholder || ""}
        className="mash-richtext"
        style={{ minHeight, padding: "12px 14px", fontSize: 14, lineHeight: 1.7, color: "var(--text)", outline: "none" }}
      />
    </div>
  );
}
