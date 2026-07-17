import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "أوفرز · Offers",
  description: "وجهتك للعروض والخصومات — سوق متعدد المتاجر في جميع مدن المملكة.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Apply saved theme/lang before paint to avoid a flash of the wrong theme.
const themeScript = `
(function(){try{
  var t = localStorage.getItem('mash_theme') || 'light';
  var l = localStorage.getItem('mash_lang') || 'ar';
  var r = document.documentElement;
  r.dataset.theme = t;
  r.lang = l;
  r.dir = (l === 'ar') ? 'rtl' : 'ltr';
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
