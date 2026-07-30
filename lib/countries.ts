// Gulf Cooperation Council countries (دول الخليج) — Arabic + English + flag + dial code.
// Standalone module (no React) so both the geo store and the CountryModal can import
// it without creating a circular dependency.
export interface Country { id: string; ar: string; en: string; flag: string; dial: string; }

export const GULF_COUNTRIES: Country[] = [
  { id: "sa", ar: "المملكة العربية السعودية", en: "Saudi Arabia", flag: "🇸🇦", dial: "+966" },
  { id: "ae", ar: "الإمارات العربية المتحدة", en: "United Arab Emirates", flag: "🇦🇪", dial: "+971" },
  { id: "kw", ar: "الكويت", en: "Kuwait", flag: "🇰🇼", dial: "+965" },
  { id: "qa", ar: "قطر", en: "Qatar", flag: "🇶🇦", dial: "+974" },
  { id: "bh", ar: "البحرين", en: "Bahrain", flag: "🇧🇭", dial: "+973" },
  { id: "om", ar: "سلطنة عُمان", en: "Oman", flag: "🇴🇲", dial: "+968" },
];
