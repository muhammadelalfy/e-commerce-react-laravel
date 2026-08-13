"use client";
import React, { useState } from "react";
import { Icon, Btn } from "./ui";
import { VENDORS } from "@/lib/data";
import { useCatStore } from "@/lib/catStore";
import type { Offer } from "@/lib/offerStore";

type Go = (page: string, id?: string | null) => void;

/** localized date like "٣٠ أغسطس ٢٠٢٦" / "Aug 30, 2026" */
export function fmtDate(iso: string, ar: boolean): string {
  if (!iso) return ar ? "غير محدّد" : "Open";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(ar ? "ar-EG" : "en-US", { day: "numeric", month: ar ? "long" : "short", year: "numeric" });
}

/** Distinct "promoted / sponsored" offer card for the عروض مختارة لك section. */
export function OfferCard({ o, ar, go }: { o: Offer; ar: boolean; go: Go }) {
  const v = VENDORS[o.vendor];
  return (
    <button onClick={() => v && go("vendor", v.id)}
      style={{ textAlign: "start", position: "relative", background: "var(--surface)", border: "1.5px solid var(--gold)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)", color: "var(--text)", cursor: "pointer", display: "flex", flexDirection: "column" }}>
      {/* sponsored ribbon */}
      <span style={{ position: "absolute", top: 10, insetInlineStart: 10, zIndex: 2, background: "var(--gold)", color: "#3a2c00", fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}><Icon name="tag" size={11} />{ar ? "عرض مموّل" : "Sponsored"}</span>
      {o.discount > 0 && <span style={{ position: "absolute", top: 10, insetInlineEnd: 10, zIndex: 2, background: "var(--brand)", color: "#fff", fontSize: 12, fontWeight: 800, padding: "3px 9px", borderRadius: 999 }}>-{o.discount}%</span>}
      <div className="mash-offer-thumb" style={{ position: "relative", height: 150, background: "var(--surface-2)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={o.img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, lineHeight: 1.35 }}>{ar ? o.ar : o.en}</div>
        {v && <div style={{ fontSize: 12, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 20, height: 20, borderRadius: 999, background: v.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "none" }}><Icon name="store" size={11} /></span>{ar ? v.ar : v.en}</div>}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-2)", background: "var(--gold-soft)", borderRadius: 8, padding: "6px 10px" }}>
          <Icon name="calendar" size={13} style={{ color: "var(--gold-deep)" }} />{ar ? "ينتهي" : "Ends"} <span className="num">{fmtDate(o.end, ar)}</span>
        </div>
      </div>
    </button>
  );
}

/** Add / edit an offer: image, title, category → sub-category, discount, dates. */
export function OfferModal({ ar, vendorId, offer, onClose, onSave }: { ar: boolean; vendorId: string; offer: Offer | null; onClose: () => void; onSave: (o: Omit<Offer, "id"> & { id?: string }) => void }) {
  const cat = useCatStore();
  const [title, setTitle] = useState(offer?.ar ?? "");
  const [en, setEn] = useState(offer?.en ?? "");
  const [catId, setCatId] = useState(offer?.cat ?? cat.cats[0]?.id ?? "");
  const [subId, setSubId] = useState(offer?.subcat ?? "");
  const [discount, setDiscount] = useState(String(offer?.discount ?? 20));
  const [start, setStart] = useState(offer?.start ?? "");
  const [end, setEnd] = useState(offer?.end ?? "");
  const [img, setImg] = useState(offer?.img ?? "");
  const [showErr, setShowErr] = useState(false);
  const subs = cat.subsOf(catId);

  const onImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImg(String(r.result));
    r.readAsDataURL(f);
  };
  const save = () => {
    if (!title.trim() || !img) { setShowErr(true); return; }
    onSave({ id: offer?.id, vendor: vendorId, ar: title.trim(), en: (en || title).trim(), cat: catId, subcat: subId || undefined, img, discount: Number(discount) || 0, start, end, active: true });
  };

  const fld = (bad: boolean): React.CSSProperties => ({ height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid " + (bad ? "var(--sale)" : "var(--line)"), background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", width: "100%" });
  const lab: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,16,20,.6)", backdropFilter: "blur(3px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} dir={ar ? "rtl" : "ltr"} style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", width: "min(560px, 100%)", maxHeight: "90vh", overflow: "auto", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{offer ? (ar ? "تعديل العرض" : "Edit offer") : (ar ? "عرض جديد" : "New offer")}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 24, color: "var(--text-3)", lineHeight: 1, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 15 }}>
          {/* image */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={lab}>{ar ? "صورة العرض" : "Offer image"}<span style={{ color: "var(--sale)", marginInlineStart: 4 }}>*</span></span>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, height: img ? 140 : 90, border: "1.5px dashed " + (showErr && !img ? "var(--sale)" : "var(--line)"), borderRadius: 12, cursor: "pointer", background: "var(--surface-2)", color: "var(--text-3)", overflow: "hidden", position: "relative" }}>
              {img
                ? <img src={img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                : <><Icon name="plus" size={20} />{ar ? "ارفع صورة العرض" : "Upload offer image"}</>}
              <input type="file" accept="image/*" onChange={onImg} style={{ display: "none" }} />
            </label>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={lab}>{ar ? "عنوان العرض" : "Offer title"}<span style={{ color: "var(--sale)", marginInlineStart: 4 }}>*</span></span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={ar ? "مثال: خصم الجمعة" : "e.g. Friday deal"} style={fld(showErr && !title.trim())} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={lab}>{ar ? "القسم" : "Category"}</span>
              <select value={catId} onChange={(e) => { setCatId(e.target.value); setSubId(""); }} style={{ ...fld(false), appearance: "none" }}>
                {cat.cats.map((c) => <option key={c.id} value={c.id}>{ar ? c.ar : c.en}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={lab}>{ar ? "القسم الفرعي" : "Sub-category"}</span>
              <select value={subId} onChange={(e) => setSubId(e.target.value)} disabled={subs.length === 0} style={{ ...fld(false), appearance: "none" }}>
                <option value="">{subs.length === 0 ? (ar ? "لا يوجد" : "None") : (ar ? "اختر القسم الفرعي" : "Select")}</option>
                {subs.map((s) => <option key={s.id} value={s.id}>{ar ? s.ar : s.en}</option>)}
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={lab}>{ar ? "الخصم %" : "Discount %"}</span>
              <input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(e.target.value)} style={fld(false)} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={lab}>{ar ? "تاريخ البداية" : "Start date"}</span>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={fld(false)} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={lab}>{ar ? "تاريخ الانتهاء" : "End date"}</span>
              <input type="date" min={start || undefined} value={end} onChange={(e) => setEnd(e.target.value)} style={fld(false)} />
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid var(--line)" }}>
          <Btn variant="outline" onClick={onClose} style={{ flex: 1 }}>{ar ? "إلغاء" : "Cancel"}</Btn>
          <Btn onClick={save} style={{ flex: 2 }}><Icon name="check" size={16} />{ar ? "حفظ العرض" : "Save offer"}</Btn>
        </div>
      </div>
    </div>
  );
}
