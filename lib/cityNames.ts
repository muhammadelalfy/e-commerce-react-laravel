// English → Arabic city-name map for the Gulf countries.
// The CountriesNow API returns city names in English only; we translate the
// common ones so the picker can show Arabic. Unknown cities fall back to their
// English name (better than dropping them).

export const CITY_AR: Record<string, string> = {
  // ── Saudi Arabia ──
  "Riyadh": "الرياض", "Jeddah": "جدة", "Jiddah": "جدة", "Mecca": "مكة المكرمة", "Makkah": "مكة المكرمة",
  "Medina": "المدينة المنورة", "Al Madinah": "المدينة المنورة", "Dammam": "الدمام", "Khobar": "الخبر",
  "Al Khobar": "الخبر", "Dhahran": "الظهران", "Taif": "الطائف", "Ta'if": "الطائف", "Tabuk": "تبوك",
  "Buraydah": "بريدة", "Buraidah": "بريدة", "Khamis Mushait": "خميس مشيط", "Abha": "أبها", "Hail": "حائل",
  "Ha'il": "حائل", "Najran": "نجران", "Jizan": "جازان", "Jazan": "جازان", "Al Bahah": "الباحة",
  "Yanbu": "ينبع", "Al Jubail": "الجبيل", "Jubail": "الجبيل", "Al Hufuf": "الهفوف", "Hofuf": "الهفوف",
  "Al Qatif": "القطيف", "Qatif": "القطيف", "Arar": "عرعر", "Sakaka": "سكاكا", "Unaizah": "عنيزة",
  "Al Kharj": "الخرج", "Hafar Al Batin": "حفر الباطن", "Rabigh": "رابغ",
  "Abqaiq": "بقيق", "Buqayq": "بقيق", "Al Yamamah": "اليمامة", "At Tuwal": "الطوال",
  "Al Faruq": "الفاروق", "Ad Dilam": "الدلم", "Al Majma'ah": "المجمعة", "Al Mubarraz": "المبرز",
  "Zulfi": "الزلفي", "Az Zulfi": "الزلفي", "Ras Tanura": "رأس تنورة", "Al Duwadimi": "الدوادمي",
  "Dawadmi": "الدوادمي", "Bisha": "بيشة", "Al Qunfudhah": "القنفذة", "Sabya": "صبيا",
  "Al Wajh": "الوجه", "Duba": "ضباء", "Turaif": "طريف", "Rafha": "رفحاء", "Al Ula": "العلا",
  "Hayil": "حائل", "Jazirah": "الجزيرة", "Khulays": "خليص", "Linah": "لينة",
  "Madinat Yanbu` as Sina`iyah": "مدينة ينبع الصناعية", "Mina": "منى", "Rahimah": "رحيمة",
  "Rahman": "الرحمن", "Ramdah": "رمضة", "Safwa": "صفوى", "Sambah": "سمبة", "Sayhat": "سيهات",
  "Thuqbah": "الثقبة", "Al Awjam": "العوجام", "Umluj": "أملج", "Sharurah": "شرورة",
  "Wadi Ad Dawasir": "وادي الدواسر", "Afif": "عفيف", "Al Muzahimiyah": "المزاحمية",
  "Baljurashi": "بلجرشي", "Az Zaimah": "الزيمة", "Al Jumum": "الجموم", "Al Lith": "الليث",

  // ── United Arab Emirates ──
  "Abu Dhabi": "أبوظبي", "Dubai": "دبي", "Sharjah": "الشارقة", "Al Ain": "العين", "Ajman": "عجمان",
  "Ras Al Khaimah": "رأس الخيمة", "Ras al-Khaimah": "رأس الخيمة", "Fujairah": "الفجيرة",
  "Umm Al Quwain": "أم القيوين", "Umm al-Quwain": "أم القيوين", "Khor Fakkan": "خورفكان",
  "Kalba": "كلباء", "Dibba Al-Fujairah": "دبا الفجيرة", "Madinat Zayed": "مدينة زايد",

  // ── Kuwait ──
  "Kuwait City": "مدينة الكويت", "Al Kuwayt": "مدينة الكويت", "Kuwait": "الكويت", "Hawalli": "حولي",
  "Al Ahmadi": "الأحمدي", "Ahmadi": "الأحمدي", "Al Farwaniyah": "الفروانية", "Farwaniya": "الفروانية",
  "Al Jahra": "الجهراء", "Jahra": "الجهراء", "Salmiya": "السالمية", "As Salimiyah": "السالمية",
  "Sabah Al Salem": "صباح السالم", "Mangaf": "المنقف", "Fahaheel": "الفحيحيل",

  // ── Qatar ──
  "Doha": "الدوحة", "Al Rayyan": "الريان", "Ar Rayyan": "الريان", "Al Wakrah": "الوكرة",
  "Al Khor": "الخور", "Umm Salal": "أم صلال", "Al Wukair": "الوكير", "Dukhan": "دخان",
  "Mesaieed": "مسيعيد", "Lusail": "لوسيل", "Al Daayen": "الظعاين",

  // ── Bahrain ──
  "Manama": "المنامة", "Riffa": "الرفاع", "Ar Rifa'": "الرفاع", "Muharraq": "المحرق",
  "Al Muharraq": "المحرق", "Hamad Town": "مدينة حمد", "A'ali": "عالي", "Isa Town": "مدينة عيسى",
  "Sitra": "سترة", "Budaiya": "البديع", "Jidhafs": "جدحفص", "Sanabis": "السنابس",

  // ── Oman ──
  "Muscat": "مسقط", "Seeb": "السيب", "As Sib": "السيب", "Salalah": "صلالة", "Sohar": "صحار",
  "Suhar": "صحار", "Nizwa": "نزوى", "Sur": "صور", "Ibri": "عبري", "Barka": "بركاء",
  "Rustaq": "الرستاق", "Bahla": "بهلا", "Al Buraimi": "البريمي", "Buraimi": "البريمي",
  "Khasab": "خصب", "Ibra": "إبراء", "Sinaw": "سناو", "Bidbid": "بدبد",
};

/** Strip Latin diacritics (ā ī ū š ḥ …) AND Arabic harakat/tanween down to base letters. */
function deaccent(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")   // Latin combining marks
    .replace(/[ًٌٍَُِّْ]/g, ""); // Arabic tashkeel (fatha/kasra/tanween/shadda/sukun)
}

/**
 * Best-effort transliteration of a romanised Arabic place name into Arabic
 * script, used only when the curated CITY_AR map has no entry. It is not
 * perfect Arabic spelling, but yields a readable Arabic rendering instead of
 * leaving Latin text in an Arabic-first UI. Order matters: multi-letter
 * sequences and the definite-article prefixes are handled before single letters.
 */
export function translitToArabic(input: string): string {
  let s = deaccent(input).trim();
  if (!s) return input;

  // apostrophes / ayn-hamza marks → drop (ع/ء are hard to place reliably)
  s = s.replace(/['`’ʻʿ‘]/g, "");

  // transliterate word-by-word so the definite article and short-vowel rules
  // apply per token (Arabic drops most short vowels between consonants).
  const tokens = s.split(/\s+/).map((word) => {
    let w = word;
    // leading definite article (incl. sun-letter forms) → ال, glued to the word
    const art = /^(al|ad|as|ar|at|az|an|el)[-]?/i.test(w);
    if (art) w = w.replace(/^(al|ad|as|ar|at|az|an|el)[-]?/i, "");
    // a standalone article word ("al"/"el") with nothing after → prefix marker
    if (!w) return "ال";

    const digraphs: [RegExp, string][] = [
      [/sh/gi, "ش"], [/kh/gi, "خ"], [/th/gi, "ث"], [/dh/gi, "ذ"], [/gh/gi, "غ"],
      [/ch/gi, "تش"], [/ph/gi, "ف"], [/ck/gi, "ك"], [/aa/gi, "ا"], [/ee/gi, "ي"],
      [/ii/gi, "ي"], [/oo/gi, "و"], [/ou/gi, "و"], [/ay/gi, "اي"], [/aw/gi, "او"],
    ];
    for (const [re, ar] of digraphs) w = w.replace(re, ar);

    // consonants
    const cons: [RegExp, string][] = [
      [/b/gi, "ب"], [/c/gi, "ك"], [/d/gi, "د"], [/f/gi, "ف"], [/g/gi, "ج"],
      [/h/gi, "ه"], [/j/gi, "ج"], [/k/gi, "ك"], [/l/gi, "ل"], [/m/gi, "م"],
      [/n/gi, "ن"], [/p/gi, "ب"], [/q/gi, "ق"], [/r/gi, "ر"], [/s/gi, "س"],
      [/t/gi, "ت"], [/v/gi, "ف"], [/w/gi, "و"], [/x/gi, "كس"], [/y/gi, "ي"],
      [/z/gi, "ز"],
    ];
    for (const [re, ar] of cons) w = w.replace(re, ar);

    // vowels: keep an initial vowel (needs a carrier alef) but drop interior
    // short vowels, which Arabic normally omits. A trailing "a"/"ah" → final ه.
    w = w.replace(/^[aeiou]+/gi, "ا");           // word-initial vowel → alef
    w = w.replace(/[aeiou]+$/gi, "");            // strip trailing vowels
    w = w.replace(/[aeiou]+/gi, "");             // drop remaining interior vowels
    return (art ? "ال" : "") + w;
  });

  // glue a standalone article token ("ال") onto the following word
  const glued: string[] = [];
  for (const tok of tokens) {
    if (tok === "ال" && glued.length === 0) { glued.push(tok); continue; }
    if (glued.length && glued[glued.length - 1] === "ال") glued[glued.length - 1] = "ال" + tok;
    else if (tok === "ال") glued.push("ال");
    else glued.push(tok);
  }
  s = glued.join(" ").replace(/^الا/, "ال");
  // last-resort: map any residual Latin letters so nothing English slips through
  const fallback: Record<string, string> = {
    a: "ا", b: "ب", c: "ك", d: "د", e: "ي", f: "ف", g: "ج", h: "ه", i: "ي",
    j: "ج", k: "ك", l: "ل", m: "م", n: "ن", o: "و", p: "ب", q: "ق", r: "ر",
    s: "س", t: "ت", u: "و", v: "ف", w: "و", x: "كس", y: "ي", z: "ز",
  };
  s = s.replace(/[a-z]/gi, (ch) => fallback[ch.toLowerCase()] ?? "");
  return s.replace(/[^؀-ۿ\s]/g, "").replace(/\s+/g, " ").trim() || input;
}

/** Translate a city name to Arabic: curated map first, then transliteration. */
export function cityToArabic(en: string): string {
  if (!en) return en;
  const hit = CITY_AR[en] ?? CITY_AR[en.trim()] ?? CITY_AR[deaccent(en).trim()];
  if (hit) return hit;
  // already fully Arabic (has Arabic letters and no Latin letters)? leave it.
  const hasArabicLetter = /[ء-يٱ-ۿ]/.test(en);
  const hasLatin = /[A-Za-z]/.test(en);
  if (hasArabicLetter && !hasLatin) return en;
  return translitToArabic(en);
}
