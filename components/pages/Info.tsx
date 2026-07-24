"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Icon, Btn, money } from "../ui";

type Go = (page: string, id?: string | null) => void;

function PageHead({ title, sub, go, crumb }: { title: string; sub?: string; go: Go; crumb?: string }) {
  const { t } = useApp();
  return (
    <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
      <div className="container" style={{ padding: "34px 0 30px" }}>
        <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 12, display: "flex", gap: 8 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>{t.backHome}</a><span>/</span><span style={{ color: "var(--text-2)" }}>{crumb || title}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>{title}</h1>
        {sub && <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--text-2)", maxWidth: 620 }}>{sub}</p>}
      </div>
    </div>
  );
}

function About({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const sections: [string, string, string][] = ar
    ? [["خصومات أوفرز", "القسم الأقوى — جميع المتاجر التي لديها خصومات فعّالة في منطقتك، تظهر باللون الأخضر أثناء فعاليتها.", "tag"],
      ["مزادات أوفرز", "مزادات مباشرة على أفضل القطع من متاجر موثوقة في جميع مدن المملكة.", "gavel"],
      ["تسوّق مع أوفرز", "تصفّح وتسوّق من المتاجر حتى بدون عروض، مع توصيل سريع لكل المدن.", "bag"],
      ["خدمات أخرى", "معاهد، فصول، غرف زوم وخدمات إضافية يضيفها أصحاب الأنشطة.", "box"]]
    : [["Offers Discounts", "The strongest section — every store with a live discount in your area, shown in green while active.", "tag"],
      ["Offers Auctions", "Live auctions on the best pieces from trusted stores across the Kingdom.", "gavel"],
      ["Shop with Offers", "Browse and buy from stores even without offers, with fast delivery everywhere.", "bag"],
      ["Other Services", "Institutes, classes, Zoom rooms and extra services added by activity owners.", "box"]];
  const stats: [string, string][] = ar ? [["+٢٤٠", "متجر فعّال"], ["+١٣ مدينة", "في المملكة"], ["+٥٠ ألف", "زائر شهرياً"], ["٤ أقسام", "رئيسية"]]
    : [["240+", "active stores"], ["13+ cities", "in the Kingdom"], ["50k+", "monthly visitors"], ["4 sections", "core"]];
  return (
    <div>
      <PageHead go={go} title={ar ? "عن أوفرز" : "About Offers"} sub={ar ? "أوفرز هو سوق متعدد المتاجر يجمع المحلات والمراكز التي لديها خصومات في جميع مناطق المملكة من خلال تحديد الموقع والمنطقة." : "Offers is a multi-vendor marketplace gathering shops and centers with discounts across every region of the Kingdom by location and area."} />
      <div className="container" style={{ paddingTop: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          {stats.map(([v, l]) => (
            <div key={l} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--brand)" }}>{v}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>{ar ? "أقسام أوفرز الأربعة" : "The four Offers sections"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {sections.map(([h, p, ic]) => (
            <div key={h} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 22, display: "flex", gap: 16 }}>
              <span style={{ width: 46, height: 46, flex: "none", borderRadius: 12, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={ic} size={22} /></span>
              <div><h3 style={{ margin: "2px 0 6px", fontSize: 17, fontWeight: 800 }}>{h}</h3><p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{p}</p></div>
            </div>
          ))}
        </div>
        <div style={{ background: "linear-gradient(120deg, var(--brand-strong), var(--brand))", borderRadius: "var(--r-xl)", padding: "36px 40px", marginTop: 40, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div><h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{ar ? "هل لديك متجر أو نشاط؟" : "Own a store or activity?"}</h3><p style={{ margin: "8px 0 0", opacity: .9 }}>{ar ? "أضف متجرك وابدأ بنشر عروضك على أوفرز." : "List your store and start publishing offers on Offers."}</p></div>
          <Btn variant="outline" onClick={() => go("addstore")} style={{ background: "#fff", color: "var(--brand-strong)", borderColor: "#fff" }}>{ar ? "أضف متجرك" : "List your store"}</Btn>
        </div>
      </div>
    </div>
  );
}

function Pricing({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const plans: [string, number, string, string[], boolean][] = ar
    ? [["أساسي", 0, "للبداية المجانية", ["متجر واحد", "حتى ٥ منتجات", "خصم واحد فعّال", "دعم عبر البريد"], false],
      ["احترافي", 199, "الأكثر شيوعاً", ["منتجات غير محدودة", "خصومات ومزادات", "إحصائيات الزوار", "دعم ذو أولوية", "شارة متجر موثّق"], true],
      ["متاجر", 499, "للسلاسل الكبيرة", ["فروع متعددة", "حساب مدير", "API ولوحة متقدمة", "مدير حساب مخصص"], false]]
    : [["Basic", 0, "Free to start", ["1 store", "Up to 5 products", "1 active discount", "Email support"], false],
      ["Pro", 199, "Most popular", ["Unlimited products", "Discounts & auctions", "Visitor analytics", "Priority support", "Verified badge"], true],
      ["Enterprise", 499, "For large chains", ["Multiple branches", "Manager account", "API & advanced panel", "Dedicated manager"], false]];
  return (
    <div>
      <PageHead go={go} title={ar ? "أسعار البائعين" : "Vendor pricing"} sub={ar ? "اختر الباقة المناسبة لمتجرك. كل الباقات تشمل النشر على أقسام أوفرز الأربعة." : "Pick the plan that fits your store. All plans publish across the four Offers sections."} />
      <div className="container" style={{ paddingTop: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, alignItems: "start" }}>
          {plans.map(([name, price, tag, feats, hot]) => (
            <div key={name} style={{ background: "var(--surface)", border: "2px solid " + (hot ? "var(--brand)" : "var(--line)"), borderRadius: "var(--r-xl)", padding: 26, position: "relative", boxShadow: hot ? "var(--shadow-md)" : "var(--shadow-sm)" }}>
              {hot && <span style={{ position: "absolute", top: -12, insetInlineStart: 26, background: "var(--brand)", color: "#fff", fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>{tag}</span>}
              <div style={{ fontSize: 18, fontWeight: 800 }}>{name}</div>
              {!hot && <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{tag}</div>}
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "16px 0 18px" }}>
                <span className="num" style={{ fontSize: 34, fontWeight: 800 }}>{price === 0 ? (ar ? "مجاني" : "Free") : money(price, lang)}</span>
                {price !== 0 && <span style={{ color: "var(--text-3)", fontSize: 13 }}>/{ar ? "شهرياً" : "mo"}</span>}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11, marginBottom: 22 }}>
                {feats.map((f) => <li key={f} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 13.5 }}><Icon name="check" size={16} style={{ color: "var(--brand)", flex: "none" }} />{f}</li>)}
              </ul>
              <Btn full variant={hot ? "primary" : "outline"} onClick={() => go("addstore")}>{ar ? "ابدأ الآن" : "Get started"}</Btn>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQ({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const qa: [string, string][] = ar
    ? [["كيف أعرف أن الخصم فعّال؟", "تظهر العروض الفعّالة باللون الأخضر مع عدّاد للمدة المتبقية. عند انتهاء العرض يتحول للون خافت."],
      ["كيف أضيف متجري إلى أوفرز؟", "اضغط «أضف متجرك»، أنشئ حساباً، ثم أضف نشاطاً جديداً وحدّد نوعه وهل يحتوي على خصم. يخضع للموافقة من إدارة أوفرز."],
      ["هل التسجيل مجاني؟", "نعم، الباقة الأساسية مجانية. تتوفر باقات مدفوعة بمزايا إضافية مثل المزادات وإحصائيات الزوار."],
      ["كيف تعمل المزادات؟", "تضع مزايدتك على القطعة، وترتفع تلقائياً مع كل مزايدة. ينتهي المزاد عند انتهاء العدّاد."],
      ["ما المدن المتوفرة؟", "نغطّي أكثر من ١٣ مدينة في المملكة، ويمكنك تحديد مدينتك من أعلى الصفحة."]]
    : [["How do I know a discount is active?", "Active offers show in green with a countdown of the remaining time. When an offer ends it turns dim."],
      ["How do I add my store?", "Click 'List your store', create an account, then add a new activity, set its type and whether it has a discount. It's subject to Offers approval."],
      ["Is signing up free?", "Yes, the Basic plan is free. Paid plans add features like auctions and visitor analytics."],
      ["How do auctions work?", "Place your bid on a piece; it rises automatically with each bid and ends when the countdown finishes."],
      ["Which cities are available?", "We cover 13+ cities across the Kingdom — pick yours from the top of the page."]];
  const [open, setOpen] = useState(0);
  return (
    <div>
      <PageHead go={go} title={ar ? "الأسئلة الشائعة" : "Frequently asked questions"} />
      <div className="container" style={{ paddingTop: 30, maxWidth: 760 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {qa.map(([q, a], i) => (
            <div key={q} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "16px 18px", background: "transparent", border: "none", color: "var(--text)", textAlign: "start", fontSize: 15, fontWeight: 700 }}>
                {q}<Icon name="chevron" size={18} style={{ flex: "none", transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s", color: "var(--text-3)" }} />
              </button>
              {open === i && <div style={{ padding: "0 18px 18px", fontSize: 14, color: "var(--text-2)", lineHeight: 1.65 }}>{a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CField({ label }: { label: string }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{label}</span><input style={{ height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit" }} /></label>;
}

function Contact({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const [sent, setSent] = useState(false);
  const ch: [string, string, string][] = ar ? [["phone", "الهاتف", "‎+966 11 234 5678"], ["globe", "البريد", "support@mashhoor.sa"], ["location", "العنوان", "الرياض، المملكة العربية السعودية"]]
    : [["phone", "Phone", "+966 11 234 5678"], ["globe", "Email", "support@mashhoor.sa"], ["location", "Address", "Riyadh, Saudi Arabia"]];
  return (
    <div>
      <PageHead go={go} title={ar ? "تواصل معنا" : "Contact us"} sub={ar ? "فريق الدعم جاهز لمساعدتك. أرسل رسالتك وسنرد خلال ٢٤ ساعة." : "Our support team is here to help. Send a message and we'll reply within 24 hours."} />
      <div className="container" style={{ paddingTop: 36, display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ch.map(([ic, l, v]) => (
            <div key={l} style={{ display: "flex", gap: 14, alignItems: "center", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: 16 }}>
              <span style={{ width: 42, height: 42, borderRadius: 11, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={ic} size={20} /></span>
              <div><div style={{ fontSize: 12.5, color: "var(--text-3)" }}>{l}</div><div className="num" style={{ fontWeight: 700, fontSize: 14.5 }}>{v}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 24, boxShadow: "var(--shadow-sm)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Icon name="check" size={34} stroke={2.4} /></div>
              <h3 style={{ margin: 0, fontWeight: 800 }}>{ar ? "تم إرسال رسالتك" : "Message sent"}</h3>
              <p style={{ color: "var(--text-2)", marginTop: 6 }}>{ar ? "سنرد عليك قريباً." : "We'll get back to you soon."}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <CField label={ar ? "الاسم" : "Name"} />
                <CField label={ar ? "البريد" : "Email"} />
              </div>
              <CField label={ar ? "الموضوع" : "Subject"} />
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{ar ? "الرسالة" : "Message"}</span>
                <textarea rows={5} style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "var(--surface-2)", color: "var(--text)", fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />
              </label>
              <Btn onClick={() => setSent(true)}>{ar ? "إرسال الرسالة" : "Send message"}</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Careers({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const jobs: [string, string, string, string][] = ar
    ? [["مهندس واجهات أمامية", "التقنية", "الرياض", "دوام كامل"], ["مدير منتج", "المنتج", "عن بُعد", "دوام كامل"], ["أخصائي دعم البائعين", "العمليات", "جدة", "دوام كامل"], ["مصمم تجربة مستخدم", "التصميم", "الرياض", "عن بُعد"]]
    : [["Frontend Engineer", "Engineering", "Riyadh", "Full-time"], ["Product Manager", "Product", "Remote", "Full-time"], ["Vendor Support Specialist", "Operations", "Jeddah", "Full-time"], ["UX Designer", "Design", "Riyadh", "Remote"]];
  return (
    <div>
      <PageHead go={go} title={ar ? "الوظائف" : "Careers"} sub={ar ? "انضم إلى فريق أوفرز وساعدنا في بناء أكبر سوق للعروض في المملكة." : "Join the Offers team and help build the Kingdom's biggest deals marketplace."} />
      <div className="container" style={{ paddingTop: 30, maxWidth: 820 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {jobs.map(([title, dep, loc, type]) => (
            <div key={title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "18px 20px" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
                <div style={{ display: "flex", gap: 14, marginTop: 6, color: "var(--text-3)", fontSize: 12.5, flexWrap: "wrap" }}>
                  <span>{dep}</span><span style={{ display: "flex", gap: 5, alignItems: "center" }}><Icon name="location" size={13} />{loc}</span><span>{type}</span>
                </div>
              </div>
              <Btn size="sm" variant="outline">{ar ? "تقديم" : "Apply"}</Btn>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Blog({ go }: { go: Go }) {
  const { lang } = useApp();
  const ar = lang === "ar";
  const posts: [string, string, string][] = ar
    ? [["دليلك لأفضل عروض رمضان", "تسوّق", "#e7f0ff"], ["كيف تختار العطر المناسب", "العطور", "#f3e8ff"], ["نصائح للبائعين الجدد", "للبائعين", "#eef7ee"], ["أسرار الفوز في المزادات", "مزادات", "#fff4e6"], ["أحدث صيحات الموضة ٢٠٢٦", "الأزياء", "#ffeef0"], ["أفضل ٥ متاجر إلكترونيات", "إلكترونيات", "#e9f6f3"]]
    : [["Your guide to the best Ramadan deals", "Shopping", "#e7f0ff"], ["How to choose the right perfume", "Perfumes", "#f3e8ff"], ["Tips for new vendors", "Vendors", "#eef7ee"], ["Secrets to winning auctions", "Auctions", "#fff4e6"], ["2026 fashion trends", "Fashion", "#ffeef0"], ["Top 5 electronics stores", "Electronics", "#e9f6f3"]];
  return (
    <div>
      <PageHead go={go} title={ar ? "مدونة أوفرز" : "Offers Blog"} sub={ar ? "نصائح تسوّق، أدلة العروض، وقصص من متاجرنا." : "Shopping tips, deal guides, and stories from our stores."} />
      <div className="container" style={{ paddingTop: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {posts.map(([title, cat, color]) => (
            <div key={title} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)", cursor: "pointer" }}>
              <div style={{ height: 150, background: `radial-gradient(120% 120% at 30% 20%, ${color}, rgba(0,0,0,.05))`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="book" size={48} stroke={1.2} style={{ color: "rgba(20,40,30,.35)" }} /></div>
              <div style={{ padding: 18 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: ".4px" }}>{cat}</span>
                <h3 style={{ margin: "8px 0 8px", fontSize: 16.5, fontWeight: 800, lineHeight: 1.35 }}>{title}</h3>
                <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>{ar ? "٥ دقائق قراءة · يونيو ٢٠٢٦" : "5 min read · June 2026"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LEGAL: Record<string, Record<"ar" | "en", [string, [string, string][]]>> = {
  terms: {
    ar: ["الشروط والأحكام", [["قبول الشروط", "باستخدامك تطبيق أوفرز فإنك توافق على هذه الشروط والأحكام لكل من المتاجر والعملاء والمستخدمين."], ["حسابات المتاجر", "لكل متجر حساب مستخدم وكلمة مرور لإضافة الخصومات وتفعيل وقتها. يحق لإدارة أوفرز قبول أو رفض الطلب، ويلتزم المتجر بدفع المبلغ المستحق لفتح العرض."], ["المحتوى والعروض", "يتحمل صاحب المتجر مسؤولية دقة العروض والصور والروابط المضافة. تظهر العروض الفعّالة باللون الأخضر وتُخفت عند انتهائها."], ["المدفوعات", "الدفع الإلكتروني آمن ومشفّر، وتُفتح صفحة المتجر فور إتمام الدفع وإشعارنا بذلك."]]],
    en: ["Terms & Conditions", [["Acceptance of terms", "By using Offers you agree to these terms for stores, customers and users alike."], ["Store accounts", "Each store has a username and password to add discounts and activate their timing. Offers management may accept or reject a request, and the store pays the due amount to open an offer."], ["Content & offers", "The store owner is responsible for the accuracy of added offers, images and links. Active offers show in green and dim when they end."], ["Payments", "Electronic payment is secure and encrypted; the store page opens once payment completes and we're notified."]]],
  },
  privacy: {
    ar: ["سياسة الخصوصية", [["جمع المعلومات", "نجمع معلومات أساسية لتقديم الخدمة، مثل الموقع والمدينة لعرض المتاجر القريبة منك."], ["عدّاد الزوار", "نحسب عدد الزوار للموقع وللمتجر حتى يتأكد أصحاب المحلات من وصول عروضهم لعدد كبير من الزوار."], ["مشاركة البيانات", "لا نشارك بياناتك الشخصية مع أطراف ثالثة لأغراض تسويقية دون موافقتك."], ["حقوقك", "يمكنك طلب الوصول إلى بياناتك أو حذفها في أي وقت عبر التواصل مع الدعم."]]],
    en: ["Privacy Policy", [["Information we collect", "We collect basic info to deliver the service, such as location and city to show nearby stores."], ["Visitor counter", "We count visitors to the site and to each store so owners can confirm their offers reach a large audience."], ["Data sharing", "We do not share your personal data with third parties for marketing without your consent."], ["Your rights", "You can request access to or deletion of your data anytime by contacting support."]]],
  },
  shipping: {
    ar: ["الشحن والتوصيل", [["مناطق التغطية", "نوصّل لأكثر من ١٣ مدينة في المملكة. حدّد مدينتك من أعلى الصفحة لرؤية العروض القريبة."], ["مدة التوصيل", "تتراوح مدة التوصيل بين ١-٣ أيام عمل داخل المدن الرئيسية، وقد تطول للمناطق البعيدة."], ["رسوم الشحن", "الشحن مجاني للطلبات فوق ٢٠٠ ﷼، وإلا تُطبّق رسوم ثابتة قدرها ٢٥ ﷼."], ["التتبّع", "تصلك رسالة بتفاصيل التتبّع فور شحن طلبك."]]],
    en: ["Shipping & Delivery", [["Coverage", "We deliver to 13+ cities in the Kingdom. Set your city at the top of the page to see nearby offers."], ["Delivery time", "Delivery takes 1–3 business days within major cities, and may take longer for remote areas."], ["Shipping fees", "Free shipping on orders over SAR 200, otherwise a flat SAR 25 fee applies."], ["Tracking", "You receive a message with tracking details as soon as your order ships."]]],
  },
  returns: {
    ar: ["الإرجاع والاستبدال", [["مدة الإرجاع", "يمكنك إرجاع أو استبدال المنتج خلال ٧ أيام من الاستلام، بشرط أن يكون بحالته الأصلية."], ["كيفية الإرجاع", "ابدأ طلب الإرجاع من حسابك، وسيتم ترتيب الاستلام أو الإرجاع عبر المتجر."], ["استرداد المبلغ", "يُعاد المبلغ بنفس طريقة الدفع خلال ٥-٧ أيام عمل بعد استلام المنتج المرتجع."], ["استثناءات", "بعض المنتجات مثل العطور المفتوحة والمواد الغذائية غير قابلة للإرجاع لأسباب صحية."]]],
    en: ["Returns & Exchange", [["Return window", "You can return or exchange a product within 7 days of receipt, provided it's in original condition."], ["How to return", "Start a return from your account; pickup or return is arranged via the store."], ["Refunds", "Refunds are issued to the original payment method within 5–7 business days after the returned item is received."], ["Exceptions", "Some items such as opened perfumes and food are non-returnable for health reasons."]]],
  },
};

function Legal({ id, go }: { id: string; go: Go }) {
  const { lang } = useApp();
  const [title, secs] = LEGAL[id][lang === "ar" ? "ar" : "en"];
  return (
    <div>
      <PageHead go={go} title={title} />
      <div className="container" style={{ paddingTop: 30, maxWidth: 760 }}>
        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginBottom: 22 }}>{lang === "ar" ? "آخر تحديث: يونيو ٢٠٢٦" : "Last updated: June 2026"}</div>
        {secs.map(([h, p], i) => (
          <section key={h} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}><span className="num" style={{ color: "var(--brand)" }}>{i + 1}.</span> {h}</h2>
            <p style={{ margin: 0, fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.75 }}>{p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export function Info({ id, go }: { id: string | null; go: Go }) {
  if (id === "about") return <About go={go} />;
  if (id === "pricing") return <Pricing go={go} />;
  if (id === "faq") return <FAQ go={go} />;
  if (id === "contact") return <Contact go={go} />;
  if (id === "careers") return <Careers go={go} />;
  if (id === "blog") return <Blog go={go} />;
  if (id && LEGAL[id]) return <Legal id={id} go={go} />;
  return <About go={go} />;
}
