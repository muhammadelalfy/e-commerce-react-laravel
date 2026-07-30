"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Stars, Btn } from "../ui";
import { ProductCard } from "../Shell";
import { CATS, VENDORS, PRODUCTS } from "@/lib/data";
import { useCatStore } from "@/lib/catStore";

type Go = (page: string, id?: string | null) => void;

const CAT_HERO: Record<string, string> = {
  electronics: "/img/cat-electronics.png", perfumes: "/img/cat-beauty.png",
  fashion: "/img/cat-clothes.png", restaurants: "/img/cat-food.png",
  books: "/img/cat-books.png", furniture: "/img/cat-kitchen.png", realestate: "/img/cat-kitchen.png",
};
const VENDOR_BANNERS: Record<string, string> = {
  electronics: "/img/cat-electronics.png", perfumes: "/img/cat-beauty.png",
  fashion: "/img/cat-clothes.png", restaurants: "/img/cat-food.png",
  books: "/img/cat-books.png", furniture: "/img/cat-kitchen.png", realestate: "/img/cat-kitchen.png",
};

const fHead: React.CSSProperties = { fontWeight: 800, fontSize: 13.5, marginBottom: 10, color: "var(--text)" };
function VOpt({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", padding: "4px 0", color: on ? "var(--brand)" : "var(--text-2)", fontWeight: on ? 700 : 500, fontSize: 13, textAlign: "start" }}>
      <span style={{ width: 16, height: 16, borderRadius: 999, border: "2px solid " + (on ? "var(--brand)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{on && <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--brand)" }} />}</span>
      {label}
    </button>
  );
}

export function CategoryPage({ id, go }: { id: string; go: Go }) {
  const { t, lang } = useApp();
  const ar = lang === "ar";
  const catStore = useCatStore();
  // id can be "electronics" (show sub-categories) or "electronics~phones" (show stores in that sub-category)
  const [catId, subId] = id.split("~");
  const isAll = catId === "all" || catId === "shop";
  const cat = isAll ? null : (CATS.find((c) => c.id === catId) || CATS[0]);
  const subCats = cat ? catStore.subsOf(cat.id) : [];
  const activeSub = subId ? subCats.find((s) => s.id === subId) : undefined;
  // browse state: which step of Category → Sub-cats → Stores → Products we're on
  const showSubcats = !isAll && !subId;        // step 1: sub-category tiles
  const showStores = !isAll && !!subId;        // step 2: stores in the sub-category

  const all = isAll ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat!.id);
  // stores in this sub-category = stores that have ≥1 product tagged with it
  const storeIdsInSub = subId ? Array.from(new Set(PRODUCTS.filter((p) => p.cat === cat!.id && p.subcat === subId).map((p) => p.vendor))) : [];
  const storesIn = subId
    ? storeIdsInSub.map((vid) => VENDORS[vid]).filter(Boolean)
    : (cat ? Object.values(VENDORS).filter((v) => v.cat === cat.id) : []);
  const title = isAll ? (ar ? "تسوّق مع أوفرز" : "Shop with Offers")
    : activeSub ? (ar ? activeSub.ar : activeSub.en)
    : (ar ? cat!.ar : cat!.en);
  const heroImg = isAll ? "/img/cat-clothes.png" : CAT_HERO[cat!.id];
  const vendorsIn = Array.from(new Set(all.map((p) => p.vendor)));
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [vendorF, setVendorF] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [catF, setCatF] = useState("all");

  let list = all.filter((p) => p.price <= maxPrice && p.rating >= minRating && (vendorF === "all" || p.vendor === vendorF) && (!activeOnly || p.active) && (catF === "all" || p.cat === catF));
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
  else if (sort === "discount") list = [...list].sort((a, b) => b.discount - a.discount);

  const banner = heroImg;
  const sorts: [string, string][] = [["featured", ar ? "مختار" : "Featured"], ["low", ar ? "الأقل سعراً" : "Price: low"], ["high", ar ? "الأعلى سعراً" : "Price: high"], ["rating", ar ? "الأعلى تقييماً" : "Top rated"], ["discount", ar ? "أكبر خصم" : "Biggest discount"]];

  return (
    <div>
      <div style={{ position: "relative", height: 180, background: "var(--hero)", overflow: "hidden" }}>
        {/* product photo floats on the trailing side, contained on a soft glow */}
        {banner && <span style={{ position: "absolute", insetInlineEnd: "6%", top: "50%", transform: "translateY(-50%)", width: 150, height: 132, borderRadius: "var(--r-lg)", background: "radial-gradient(120% 120% at 50% 30%, rgba(255,255,255,.95), rgba(255,255,255,.7))", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,.3)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt="" style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} />
        </span>}
        {/* dark scrim guarantees the white title is readable in both themes,
            even if the banner image (light product photo) bleeds through */}
        <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(16,22,29,.9) 0%, rgba(16,22,29,.72) 55%, rgba(16,22,29,.4) 100%)" }} />
        <div className="container" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", display: "flex", gap: 8, textShadow: "0 1px 3px rgba(0,0,0,.5)", flexWrap: "wrap" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go("home"); }} style={{ color: "rgba(255,255,255,.8)" }}>{t.backHome}</a>
            {activeSub && cat && <><span>/</span><a href="#" onClick={(e) => { e.preventDefault(); go("category", cat.id); window.scrollTo({ top: 0 }); }} style={{ color: "rgba(255,255,255,.8)" }}>{ar ? cat.ar : cat.en}</a></>}
            <span>/</span><span style={{ color: "#fff" }}>{title}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: "#fff", fontFamily: "var(--font-display)", textShadow: "0 2px 8px rgba(0,0,0,.55)" }}>{title}</h1>
          <p className="num" style={{ margin: 0, color: "rgba(255,255,255,.85)", fontSize: 14, textShadow: "0 1px 3px rgba(0,0,0,.5)" }}>{all.length} {t.itemsAvailable}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }}>
        <aside style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 20, position: "sticky", top: 90, display: "flex", flexDirection: "column", gap: 22 }}>
          {isAll && (
            <div>
              <div style={fHead}>{ar ? "القسم" : "Category"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <VOpt on={catF === "all"} onClick={() => setCatF("all")} label={ar ? "كل الأقسام" : "All categories"} />
                {CATS.filter((c) => PRODUCTS.some((p) => p.cat === c.id)).map((c) => <VOpt key={c.id} on={catF === c.id} onClick={() => setCatF(c.id)} label={ar ? c.ar : c.en} />)}
              </div>
            </div>
          )}
          <div>
            <div style={fHead}>{t.filters.price}</div>
            <input type="range" min={0} max={1000} step={10} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} style={{ width: "100%", accentColor: "var(--brand)" }} />
            <div className="num" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-3)", marginTop: 4 }}><span>0</span><span>{maxPrice}+ ﷼</span></div>
          </div>
          <div>
            <div style={fHead}>{t.filters.review}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[0, 3, 4, 4.5].map((r) => (
                <button key={r} onClick={() => setMinRating(r)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", padding: "4px 0", color: minRating === r ? "var(--brand)" : "var(--text-2)", fontWeight: minRating === r ? 700 : 500, fontSize: 13 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 999, border: "2px solid " + (minRating === r ? "var(--brand)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center" }}>{minRating === r && <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--brand)" }} />}</span>
                  {r === 0 ? (ar ? "الكل" : "All") : <><Stars value={r} size={12} /><span className="num">{r}+</span></>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={fHead}>{t.vendor}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <VOpt on={vendorF === "all"} onClick={() => setVendorF("all")} label={ar ? "كل المتاجر" : "All stores"} />
              {vendorsIn.map((vid) => <VOpt key={vid} on={vendorF === vid} onClick={() => setVendorF(vid)} label={ar ? VENDORS[vid].ar : VENDORS[vid].en} />)}
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, color: "var(--text-2)", cursor: "pointer" }}>
            <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} style={{ accentColor: "var(--brand)" }} />
            {ar ? "العروض الفعّالة فقط" : "Active offers only"}
          </label>
        </aside>

        <div>
          {/* STEP 1 — CATEGORY → show its SUB-CATEGORIES */}
          {showSubcats ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <span className="num" style={{ color: "var(--text-2)", fontSize: 14 }}>{subCats.length} {ar ? "قسم فرعي" : "sub-categories"}</span>
                <span style={{ fontSize: 13, color: "var(--text-3)" }}>{ar ? "اختر قسماً فرعياً لعرض متاجره" : "Pick a sub-category to see its stores"}</span>
              </div>
              {subCats.length ? (
                <div className="mash-store-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                  {subCats.map((s) => {
                    const storeCount = Array.from(new Set(PRODUCTS.filter((p) => p.cat === cat!.id && p.subcat === s.id).map((p) => p.vendor))).length;
                    return (
                      <button key={s.id} onClick={() => { go("category", cat!.id + "~" + s.id); window.scrollTo({ top: 0 }); }}
                        style={{ textAlign: "start", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", padding: "16px 18px", display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}>
                        <span style={{ width: 42, height: 42, borderRadius: 12, flex: "none", background: cat!.tint, color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={cat!.icon} size={20} /></span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ar ? s.ar : s.en}</div>
                          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}><span className="num">{storeCount}</span> {ar ? "متجر" : "stores"}</div>
                        </div>
                        <Icon name="arrow" size={18} style={{ color: "var(--brand)", transform: ar ? "scaleX(-1)" : "none" }} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)" }}>
                  <Icon name="grid" size={40} /><p style={{ marginTop: 12 }}>{ar ? "لا توجد أقسام فرعية لهذا القسم" : "No sub-categories for this category"}</p>
                </div>
              )}
            </>
          ) : showStores ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <span className="num" style={{ color: "var(--text-2)", fontSize: 14 }}>{storesIn.length} {ar ? "متجر" : "stores"}</span>
                <span style={{ fontSize: 13, color: "var(--text-3)" }}>{ar ? "اختر متجراً لعرض منتجاته" : "Pick a store to see its products"}</span>
              </div>
              {storesIn.length ? (
                <div className="mash-store-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
                  {storesIn.map((v) => {
                    const count = PRODUCTS.filter((p) => p.vendor === v.id && p.subcat === subId).length;
                    return (
                      <button key={v.id} onClick={() => { go("vendor", v.id); window.scrollTo({ top: 0 }); }}
                        style={{ textAlign: "start", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", padding: 18, display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }}>
                        <span style={{ width: 56, height: 56, borderRadius: 14, flex: "none", background: v.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="store" size={26} /></span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 15.5 }}>{ar ? v.ar : v.en}</div>
                          <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Stars value={v.rating} size={12} /> <b className="num" style={{ color: "var(--text-2)" }}>{v.rating}</b></span>
                            <span>· {ar ? v.city.ar : v.city.en}</span>
                            <span>· <span className="num">{count}</span> {ar ? "منتج" : "products"}</span>
                          </div>
                        </div>
                        <Icon name="arrow" size={18} style={{ color: "var(--brand)", transform: ar ? "scaleX(-1)" : "none" }} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)" }}>
                  <Icon name="store" size={40} /><p style={{ marginTop: 12 }}>{ar ? "لا توجد متاجر في هذا القسم الفرعي" : "No stores in this sub-category"}</p>
                </div>
              )}
            </>
          ) : (
          <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <span className="num" style={{ color: "var(--text-2)", fontSize: 14 }}>{list.length} {ar ? "نتيجة" : "results"}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>{t.sortBy}:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ height: 40, padding: "0 14px", borderRadius: "var(--r-pill)", border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--text)", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit" }}>
                {sorts.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
          </div>
          {list.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {list.map((p) => <ProductCard key={p.id} p={p} go={go} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)" }}>
              <Icon name="search" size={40} /><p style={{ marginTop: 12 }}>{ar ? "لا توجد منتجات مطابقة للفلاتر" : "No products match your filters"}</p>
            </div>
          )}
          </>
          )}

          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{ar ? "تصفّح أقساماً أخرى" : "Browse other categories"}</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {CATS.filter((c) => !cat || c.id !== cat.id).map((c) => (
                <button key={c.id} onClick={() => { go("category", c.id); window.scrollTo({ top: 0 }); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--text-2)", fontWeight: 600, fontSize: 13 }}>
                  <Icon name={c.icon} size={16} />{ar ? c.ar : c.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Vendor({ id, go }: { id: string; go: Go }) {
  const { t, lang } = useApp();
  const v = VENDORS[id] || Object.values(VENDORS)[0];
  const items = PRODUCTS.filter((p) => p.vendor === v.id);
  return (
    <div>
      <div style={{ position: "relative", height: 200, background: v.color, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {VENDOR_BANNERS[v.cat] && <img src={VENDOR_BANNERS[v.cat]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        <span style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, ${v.color}e6, ${v.color}80 55%, ${v.color}33)` }} />
      </div>
      <div className="container" style={{ marginTop: -54 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
          <div style={{ width: 96, height: 96, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", color: v.color, boxShadow: "var(--shadow-md)" }}><Icon name="store" size={48} /></div>
          <div style={{ paddingBottom: 8, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff" }}>{lang === "ar" ? v.ar : v.en}</h1>
              <span style={{ background: "rgba(255,255,255,.2)", color: "#fff", fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, display: "flex", alignItems: "center", gap: 5 }}><Icon name="check" size={13} />{t.multiTenant}</span>
            </div>
          </div>
          <Btn variant="primary" style={{ marginBottom: 8 }}>{t.visit}</Btn>
        </div>
        <div style={{ display: "flex", gap: 28, margin: "20px 2px 0", color: "var(--text-2)", fontSize: 13.5, flexWrap: "wrap" }}>
          <span style={{ display: "flex", gap: 7, alignItems: "center" }}><Stars value={v.rating} /> <b className="num" style={{ color: "var(--text)" }}>{v.rating}</b> ({v.reviews})</span>
          <span><span className="num">{(v.followers / 1000).toFixed(1)}k</span> {t.followers}</span>
          <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Icon name="location" size={15} />{lang === "ar" ? v.city.ar : v.city.en}</span>
          <span className="num">{t.since} {v.since}</span>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14.5, marginTop: 16, maxWidth: 640 }}><b style={{ color: "var(--text)" }}>{t.aboutVendor}: </b>{lang === "ar" ? v.ar_about : v.en_about}</p>
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>{lang === "ar" ? "منتجات المتجر" : "Store products"} <span className="num" style={{ color: "var(--text-3)", fontWeight: 600 }}>({items.length})</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {items.map((p) => <ProductCard key={p.id} p={p} go={go} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
