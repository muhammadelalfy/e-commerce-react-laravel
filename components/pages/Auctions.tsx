"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn, Thumb, money } from "../ui";
import { AUCTIONS, VENDORS, type Auction } from "@/lib/data";

type Go = (page: string, id?: string | null) => void;

function useNow(active: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

function Countdown({ end, now, t }: { end: number; now: number; t: any }) {
  let s = Math.max(0, Math.floor((end - now) / 1000));
  const h = Math.floor(s / 3600); s -= h * 3600;
  const mm = Math.floor(s / 60); const ss = s - mm * 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const cell = (v: number, l: string) => (
    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <span className="num" style={{ fontWeight: 800, fontSize: 18, lineHeight: 1, color: "var(--text)" }}>{pad(v)}</span>
      <span style={{ fontSize: 9.5, color: "var(--text-3)", fontWeight: 600 }}>{l}</span>
    </span>
  );
  const sep = <span style={{ color: "var(--text-3)", fontWeight: 700, alignSelf: "flex-start", marginTop: 1 }}>:</span>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      {cell(h, t.auc.h)}{sep}{cell(mm, t.auc.m)}{sep}{cell(ss, t.auc.s)}
    </div>
  );
}

function CountdownLight({ end, now, t }: { end: number; now: number; t: any }) {
  let s = Math.max(0, Math.floor((end - now) / 1000));
  const h = Math.floor(s / 3600); s -= h * 3600;
  const mm = Math.floor(s / 60); const ss = s - mm * 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const cell = (v: number, l: string) => (
    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <span className="num" style={{ fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{pad(v)}</span>
      <span style={{ fontSize: 9, opacity: .8, fontWeight: 600 }}>{l}</span>
    </span>
  );
  return <div style={{ display: "flex", alignItems: "center", gap: 7 }}>{cell(h, t.auc.h)}<b style={{ marginTop: -6 }}>:</b>{cell(mm, t.auc.m)}<b style={{ marginTop: -6 }}>:</b>{cell(ss, t.auc.s)}</div>;
}

export function Auctions({ active }: { go: Go; active: boolean }) {
  const { t, lang } = useApp();
  const now = useNow(active);
  const ends = useMemo(() => {
    const base = Date.now();
    const o: Record<string, number> = {}; AUCTIONS.forEach((a) => { o[a.id] = base + a.endH * 3600 * 1000; });
    return o;
  }, []);
  const [bids, setBids] = useState<Record<string, { amount: number; count: number; mine: boolean }>>(() => Object.fromEntries(AUCTIONS.map((a) => [a.id, { amount: a.current, count: a.bids, mine: false }])));
  const placeBid = (a: Auction) => setBids((b) => ({ ...b, [a.id]: { amount: b[a.id].amount + 50, count: b[a.id].count + 1, mine: true } }));

  const featured = AUCTIONS[0];
  const fEnd = ends[featured.id];

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <section style={{ background: "linear-gradient(120deg, var(--brand-strong), var(--brand))", borderRadius: "var(--r-xl)", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", color: "#fff" }}>
        <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.18)", padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 700, width: "fit-content" }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "#ff5a4d" }} />{t.auc.live}
          </span>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, lineHeight: 1.15 }}>{t.auc.title}</h1>
          <p style={{ margin: 0, fontSize: 15, opacity: .9, maxWidth: 360 }}>{t.auc.sub}</p>
          <div style={{ display: "flex", gap: 28, marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 12, opacity: .85 }}>{t.auc.current}</div>
              <div className="num" style={{ fontSize: 26, fontWeight: 800 }}>{money(bids[featured.id].amount, lang)}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,.14)", borderRadius: 14, padding: "10px 16px" }}>
              <div style={{ fontSize: 11, opacity: .85, marginBottom: 4 }}>{t.auc.endsIn}</div>
              <div style={{ color: "#fff" }}>
                <CountdownLight end={fEnd} now={now} t={t} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 6 }}>
            <Btn variant="outline" onClick={() => placeBid(featured)} style={{ background: "#fff", color: "var(--brand-strong)", borderColor: "#fff" }}>
              <Icon name="gavel" size={17} />{t.auc.placeBid}
            </Btn>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 30 }}>
          <div style={{ width: "100%", maxWidth: 320 }}><Thumb p={featured as any} ratio="4 / 3" /></div>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>{lang === "ar" ? "مزادات مباشرة" : "Live auctions"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {AUCTIONS.map((a) => {
            const b = bids[a.id]; const ended = ends[a.id] - now <= 0;
            return (
              <div key={a.id} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ position: "relative" }}>
                  <Thumb p={a as any} ratio="3 / 2" radius="0" />
                  <span style={{ position: "absolute", top: 10, insetInlineStart: 10, display: "inline-flex", alignItems: "center", gap: 6, background: ended ? "var(--expired)" : "rgba(16,32,27,.78)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 999 }}>
                    <Icon name="gavel" size={13} /><span className="num">{b.count}</span> {t.auc.bids}
                  </span>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>{lang === "ar" ? VENDORS[a.vendor].ar : VENDORS[a.vendor].en}</div>
                  <h3 style={{ margin: "4px 0 12px", fontSize: 16, fontWeight: 700 }}>{lang === "ar" ? a.ar : a.en}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{t.auc.current}</div>
                      <div className="num" style={{ fontSize: 20, fontWeight: 800, color: "var(--brand)" }}>{money(b.amount, lang)}</div>
                    </div>
                    <div style={{ textAlign: "end" }}>
                      <div style={{ fontSize: 11.5, color: "var(--text-3)", marginBottom: 3 }}>{ended ? t.auc.ended : t.auc.endsIn}</div>
                      {!ended && <Countdown end={ends[a.id]} now={now} t={t} />}
                    </div>
                  </div>
                  <Btn full size="sm" variant={b.mine ? "soft" : "primary"} disabled={ended} onClick={() => placeBid(a)}>
                    {ended ? t.auc.ended : b.mine ? <><Icon name="check" size={15} />{t.auc.won} · <span className="num">{money(b.amount + 50, lang)}</span></> : <><Icon name="gavel" size={15} />{t.auc.placeBid} · <span className="num">{money(b.amount + 50, lang)}</span></>}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
