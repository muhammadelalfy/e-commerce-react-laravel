"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn } from "../ui";
import { REELS, CATS, type Reel } from "@/lib/data";

type Go = (page: string, id?: string | null) => void;

const inp: React.CSSProperties = {
  height: 46, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)",
  background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", width: "100%",
};

/**
 * ReelsStudio — the ONLY area available to the reels-contributor user ("مشهور").
 * They can add reels and see the ones they've added. No other capability.
 */
export function ReelsStudio({ go }: { go: Go }) {
  const { lang, user, signOut } = useApp();
  const ar = lang === "ar";

  // gate: only the reels contributor may open this page
  if (!user || user.role !== "reels") {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center", maxWidth: 520 }}>
        <div style={{ width: 76, height: 76, borderRadius: 999, background: "var(--surface-2)", color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><Icon name="lock" size={36} /></div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>{ar ? "دخول خاص بناشري الريلز" : "Reels contributors only"}</h1>
        <p style={{ color: "var(--text-2)" }}>{ar ? "سجّل الدخول بحساب ناشر الريلز للوصول إلى هذه الصفحة." : "Sign in with a reels-contributor account to access this page."}</p>
        <div style={{ marginTop: 20 }}><Btn size="lg" onClick={() => go("auth", "reels")}>{ar ? "تسجيل الدخول" : "Sign in"}</Btn></div>
      </div>
    );
  }

  // reels the contributor has added this session (seeded with a couple of theirs)
  const [myReels, setMyReels] = useState<Reel[]>(() => REELS.slice(0, 2).map((r) => ({ ...r, status: "APPROVED" })));
  const [modal, setModal] = useState(false);

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 24, maxWidth: 1000 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 46, height: 46, borderRadius: 12, background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="reel" size={24} /></span>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{ar ? "استوديو الريلز" : "Reels Studio"}</h1>
            <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>{ar ? `مرحباً ${user.name} · ناشر ريلز` : `Welcome ${user.name} · Reels contributor`}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => setModal(true)}><Icon name="plus" size={17} />{ar ? "إضافة ريل" : "Add reel"}</Btn>
          <Btn variant="outline" onClick={signOut}><Icon name="logout" size={15} />{ar ? "خروج" : "Sign out"}</Btn>
        </div>
      </div>

      {/* role notice — this account can add reels ONLY */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--brand-soft)", color: "var(--brand)", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 600, marginBottom: 22 }}>
        <Icon name="shield" size={18} />
        {ar ? "هذا الحساب مخصّص لإضافة الريلز فقط — لا يمكنه الوصول لبقية أقسام الإدارة." : "This account can add reels only — no access to other admin areas."}
      </div>

      {/* my reels grid */}
      <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>{ar ? "ريلزاتي" : "My reels"} <span className="num" style={{ color: "var(--text-3)", fontWeight: 600 }}>({myReels.length})</span></h2>
      <div className="mash-reels-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {myReels.map((r) => (
          <div key={r.id} style={{ position: "relative", borderRadius: "var(--r-lg)", overflow: "hidden", background: "#0c1016", aspectRatio: "9 / 16", boxShadow: "var(--shadow-sm)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.img} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .82 }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,10,14,.92) 8%, transparent 55%)" }} />
            <span style={{ position: "absolute", top: 10, insetInlineStart: 10, background: r.status === "APPROVED" ? "var(--active)" : "var(--star)", color: r.status === "APPROVED" ? "#fff" : "#3a2c00", fontSize: 10.5, fontWeight: 800, padding: "3px 8px", borderRadius: 999 }}>{r.status === "APPROVED" ? (ar ? "منشور" : "Live") : (ar ? "قيد المراجعة" : "Pending")}</span>
            <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: 12, color: "#fff" }}>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.4 }}>{ar ? r.ar : r.en}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: 11, color: "rgba(255,255,255,.75)" }}>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}><Icon name="eye" size={12} /><span className="num">{(r.views / 1000).toFixed(1)}k</span></span>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}><Icon name="heart" size={12} /><span className="num">{(r.likes / 1000).toFixed(1)}k</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && <AddReelModal ar={ar} onClose={() => setModal(false)} onSave={(r) => { setMyReels((s) => [r, ...s]); setModal(false); }} />}
    </div>
  );
}

function AddReelModal({ ar, onClose, onSave }: { ar: boolean; onClose: () => void; onSave: (r: Reel) => void }) {
  const [caption, setCaption] = useState("");
  const [cat, setCat] = useState("electronics");
  const cats = CATS;
  const save = () => onSave({
    id: "reel" + Date.now(),
    vendor: "techzone",
    cat,
    ar: caption || "ريل جديد",
    en: caption || "New reel",
    views: 0, likes: 0,
    status: "PENDING",
    img: (CATS.find((c) => c.id === cat)?.img) || "/img/cat-electronics.png",
  });
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,16,20,.6)", backdropFilter: "blur(3px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", width: "min(520px, 100%)", maxHeight: "90vh", overflow: "auto", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{ar ? "إضافة ريل جديد" : "Add new reel"}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 24, color: "var(--text-3)", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{ar ? "وصف الريل" : "Caption"}</span>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={ar ? "اكتب وصفاً للمقطع…" : "Write a caption…"} style={inp} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{ar ? "القسم" : "Category"}</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} style={inp}>
              {cats.map((c) => <option key={c.id} value={c.id}>{ar ? c.ar : c.en}</option>)}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{ar ? "مقطع الفيديو" : "Video clip"}</span>
            <div style={{ border: "1.5px dashed var(--line)", borderRadius: 12, padding: "26px 16px", textAlign: "center", color: "var(--text-3)", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Icon name="reel" size={28} />{ar ? "اسحب مقطع الفيديو هنا أو اضغط للرفع" : "Drag a video here or click to upload"}
            </div>
          </label>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid var(--line)" }}>
          <Btn variant="outline" onClick={onClose} style={{ flex: 1 }}>{ar ? "إلغاء" : "Cancel"}</Btn>
          <Btn onClick={save} style={{ flex: 2 }}><Icon name="check" size={16} />{ar ? "نشر الريل" : "Publish reel"}</Btn>
        </div>
      </div>
    </div>
  );
}
