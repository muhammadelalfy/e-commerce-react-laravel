/* Offers — i18n strings + marketplace data (typed port of data.js) */

export type Lang = "ar" | "en";

const IMG = "/img/";

export const STR = {
  ar: {
    dir: "rtl", langName: "العربية", other: "English", code: "EN",
    promo: "خصم حتى ٥٠٪ على متاجر مختارة — تسوّق الآن",
    phone: "‎+966 11 234 5678",
    city: "المدينة: الرياض",
    brand: "أوفرز",
    tagline: "وجهتك للعروض والخصومات",
    nav: { discounts: "خصومات أوفرز", auctions: "مزادات أوفرز", shop: "تسوّق مع أوفرز", services: "خدمات أخرى" },
    search: "ابحث عن متجر أو منتج…",
    account: "حسابي", cart: "السلة", login: "تسجيل الدخول",
    heroTitle: "احصل على خصم حتى ٥٠٪", heroTitle2: "على المتاجر المختارة",
    heroSub: "أكثر من ٢٤٠ متجراً ومركزاً بعروض فعّالة في جميع مناطق المملكة.",
    buyNow: "تسوّق العروض", becomeVendor: "أضف متجرك",
    popularCats: "الأقسام الشائعة", viewAll: "عرض الكل",
    dealsTitle: "عروض مختارة لك", featuredVendors: "متاجر مميزة",
    itemsAvailable: "منتج متاح", offer: "عرض", active: "فعّال", expired: "منتهٍ",
    remaining: "متبقٍ", days: "أيام", discount: "خصم",
    addToCart: "أضف للسلة", added: "تمت الإضافة", inCart: "في السلة",
    sortBy: "ترتيب حسب", allFilters: "كل الفلاتر",
    filters: { type: "النوع", price: "السعر", review: "التقييم", brand: "العلامة", offer: "العرض" },
    reviews: "تقييم", visit: "زيارة المتجر", vendor: "البائع",
    chooseColor: "اختر اللون", quantity: "الكمية", returns: "إرجاع مجاني خلال ٧ أيام",
    delivery: "توصيل سريع لجميع المدن", checkout: "إتمام الطلب",
    orderSummary: "ملخص الطلب", subtotal: "المجموع", shipping: "الشحن", free: "مجاني",
    total: "الإجمالي", placeOrder: "تأكيد الطلب", deliveryInfo: "معلومات التوصيل",
    payment: "تفاصيل الدفع", reviewItems: "مراجعة المنتجات والشحن",
    name: "الاسم", address: "العنوان", cityf: "المدينة", mobile: "الجوال", email: "البريد",
    cod: "الدفع عند الاستلام", card: "بطاقة ائتمانية", cardNumber: "رقم البطاقة",
    empty: "سلتك فارغة", continueShopping: "متابعة التسوق", backHome: "الرئيسية",
    since: "عضو منذ", stores: "متجر", rating: "التقييم", followers: "متابع",
    multiTenant: "سوق متعدد المتاجر", aboutVendor: "نبذة عن المتجر",
    orderConfirmed: "تم تأكيد طلبك بنجاح", thankYou: "شكراً لتسوقك من أوفرز",
    auc: { title: "مزادات أوفرز", sub: "زايد على أفضل القطع من متاجر موثوقة في جميع مدن المملكة.",
      live: "مباشر الآن", current: "المزايدة الحالية", start: "سعر الافتتاح", bids: "مزايدة",
      endsIn: "ينتهي خلال", placeBid: "زايد الآن", yourBid: "مزايدتك", minBid: "أقل مزايدة",
      won: "تمت مزايدتك", ended: "انتهى المزاد", h: "س", m: "د", s: "ث" },
    dash: { title: "لوحة تحكم المتجر", role: "بائع", overview: "نظرة عامة", products: "المنتجات",
      discounts: "الخصومات", orders: "الطلبات", settings: "الإعدادات", visitors: "زوار المتجر",
      sales: "المبيعات", activeDiscounts: "خصومات فعّالة", ordersCount: "الطلبات", thisMonth: "هذا الشهر",
      addProduct: "إضافة نشاط جديد", product: "المنتج", price: "السعر", status: "الحالة", action: "الخصم",
      activate: "تفعيل الخصم", deactivate: "إيقاف", activeOn: "فعّال", off: "متوقف", duration: "مدة الخصم",
      newActivity: "نشاط جديد", activityType: "نوع النشاط", hasDiscount: "يحتوي على خصم؟",
      discountPct: "نسبة الخصم %", durationDays: "المدة (أيام)", productName: "اسم المنتج",
      siteLink: "رابط الموقع الإلكتروني", mapLink: "رابط موقع المحل", image: "صورة", video: "فيديو",
      save: "حفظ ونشر", cancel: "إلغاء", yes: "نعم", no: "لا", pending: "بانتظار الموافقة",
      manager: "يخضع للموافقة من إدارة أوفرز", awaiting: "بانتظار التفعيل" },
  },
  en: {
    dir: "ltr", langName: "English", other: "العربية", code: "ع",
    promo: "Get up to 50% Off on selected stores — Shop Now",
    phone: "+966 11 234 5678",
    city: "City: Riyadh",
    brand: "Offers",
    tagline: "Your destination for deals & discounts",
    nav: { discounts: "Discounts", auctions: "Auctions", shop: "Shop", services: "Services" },
    search: "Search a store or product…",
    account: "Account", cart: "Cart", login: "Sign in",
    heroTitle: "Grab up to 50% Off", heroTitle2: "on selected stores",
    heroSub: "240+ stores and centers with live offers across every region of the Kingdom.",
    buyNow: "Shop deals", becomeVendor: "List your store",
    popularCats: "Popular Categories", viewAll: "View all",
    dealsTitle: "Deals picked for you", featuredVendors: "Featured stores",
    itemsAvailable: "items available", offer: "offer", active: "Active", expired: "Expired",
    remaining: "Left", days: "days", discount: "off",
    addToCart: "Add to cart", added: "Added", inCart: "In cart",
    sortBy: "Sort by", allFilters: "All filters",
    filters: { type: "Type", price: "Price", review: "Review", brand: "Brand", offer: "Offer" },
    reviews: "reviews", visit: "Visit store", vendor: "Sold by",
    chooseColor: "Choose color", quantity: "Quantity", returns: "Free returns within 7 days",
    delivery: "Fast delivery to all cities", checkout: "Checkout",
    orderSummary: "Order Summary", subtotal: "Subtotal", shipping: "Shipping", free: "Free",
    total: "Total", placeOrder: "Place order", deliveryInfo: "Delivery Information",
    payment: "Payment Details", reviewItems: "Review items and shipping",
    name: "Name", address: "Address", cityf: "City", mobile: "Mobile", email: "Email",
    cod: "Cash on delivery", card: "Credit card", cardNumber: "Card number",
    empty: "Your cart is empty", continueShopping: "Continue shopping", backHome: "Home",
    since: "Member since", stores: "store", rating: "Rating", followers: "followers",
    multiTenant: "Multi-vendor marketplace", aboutVendor: "About the store",
    orderConfirmed: "Your order is confirmed", thankYou: "Thank you for shopping with Offers",
    auc: { title: "Offers Auctions", sub: "Bid on the best pieces from trusted stores across the Kingdom.",
      live: "Live now", current: "Current bid", start: "Opening price", bids: "bids",
      endsIn: "Ends in", placeBid: "Place bid", yourBid: "Your bid", minBid: "Min bid",
      won: "Bid placed", ended: "Auction ended", h: "h", m: "m", s: "s" },
    dash: { title: "Store Dashboard", role: "Vendor", overview: "Overview", products: "Products",
      discounts: "Discounts", orders: "Orders", settings: "Settings", visitors: "Store visitors",
      sales: "Sales", activeDiscounts: "Active discounts", ordersCount: "Orders", thisMonth: "this month",
      addProduct: "Add new activity", product: "Product", price: "Price", status: "Status", action: "Discount",
      activate: "Activate", deactivate: "Pause", activeOn: "Active", off: "Off", duration: "Duration",
      newActivity: "New activity", activityType: "Activity type", hasDiscount: "Has a discount?",
      discountPct: "Discount %", durationDays: "Duration (days)", productName: "Product name",
      siteLink: "Website link", mapLink: "Store location link", image: "Image", video: "Video",
      save: "Save & publish", cancel: "Cancel", yes: "Yes", no: "No", pending: "Pending approval",
      manager: "Subject to approval by Offers management", awaiting: "Awaiting activation" },
  },
} as const;

export type Strings = (typeof STR)["ar"] | (typeof STR)["en"];

export interface Cat { id: string; icon: string; img: string | null; ar: string; en: string; count: number; tint: string; }
export const CATS: Cat[] = [
  { id: "electronics", icon: "headphones", img: IMG + "cat-electronics.png", ar: "إلكترونيات", en: "Electronics", count: 240, tint: "#e7f0ff" },
  { id: "perfumes",    icon: "spray",      img: IMG + "cat-beauty.png",      ar: "العطور",     en: "Perfumes",    count: 180, tint: "#f3e8ff" },
  { id: "fashion",     icon: "shirt",      img: IMG + "cat-clothes.png",     ar: "الأزياء",    en: "Fashion",     count: 320, tint: "#ffeef0" },
  { id: "furniture",   icon: "sofa",       img: IMG + "cat-kitchen.png",     ar: "الأثاث",     en: "Furniture",   count: 140, tint: "#eef7ee" },
  { id: "watches",     icon: "watch",      img: null,                        ar: "الساعات",    en: "Watches",     count: 96,  tint: "#fff4e6" },
  { id: "restaurants", icon: "utensils",   img: IMG + "cat-food.png",        ar: "المطاعم",    en: "Restaurants", count: 210, tint: "#fdeede" },
  { id: "gold",        icon: "gem",        img: null,                        ar: "الذهب",      en: "Gold",        count: 64,  tint: "#fff7da" },
  { id: "books",       icon: "book",       img: IMG + "cat-books.png",       ar: "الكتب",      en: "Books",       count: 150, tint: "#e9f6f3" },
  { id: "realestate",  icon: "building",   img: null,                        ar: "العقارات",   en: "Real Estate", count: 128, tint: "#e6eef7" },
];

// Each department (category) has sub-categories. Keyed by parent category id.
export interface SubCat { id: string; cat: string; ar: string; en: string; }
export const SUBCATS: SubCat[] = [
  { id: "phones",     cat: "electronics", ar: "الجوّالات",        en: "Phones" },
  { id: "audio",      cat: "electronics", ar: "الصوتيات",         en: "Audio" },
  { id: "laptops",    cat: "electronics", ar: "الحواسيب المحمولة", en: "Laptops" },
  { id: "oud",        cat: "perfumes",    ar: "العود",            en: "Oud" },
  { id: "mens-perf",  cat: "perfumes",    ar: "عطور رجالية",       en: "Men's Perfume" },
  { id: "womens-perf",cat: "perfumes",    ar: "عطور نسائية",       en: "Women's Perfume" },
  { id: "mens-wear",  cat: "fashion",     ar: "ملابس رجالية",      en: "Men's Wear" },
  { id: "womens-wear",cat: "fashion",     ar: "ملابس نسائية",      en: "Women's Wear" },
  { id: "kids-wear",  cat: "fashion",     ar: "ملابس أطفال",       en: "Kids' Wear" },
  { id: "living",     cat: "furniture",   ar: "غرف المعيشة",       en: "Living Room" },
  { id: "bedroom",    cat: "furniture",   ar: "غرف النوم",         en: "Bedroom" },
  { id: "smart-watch",cat: "watches",     ar: "ساعات ذكية",        en: "Smart Watches" },
  { id: "luxury-watch",cat: "watches",    ar: "ساعات فاخرة",       en: "Luxury Watches" },
  { id: "fast-food",  cat: "restaurants", ar: "وجبات سريعة",       en: "Fast Food" },
  { id: "fine-dining",cat: "restaurants", ar: "مطاعم فاخرة",       en: "Fine Dining" },
  { id: "rings",      cat: "gold",        ar: "خواتم",            en: "Rings" },
  { id: "necklaces",  cat: "gold",        ar: "قلائد",            en: "Necklaces" },
  { id: "novels",     cat: "books",       ar: "روايات",           en: "Novels" },
  { id: "academic",   cat: "books",       ar: "كتب أكاديمية",      en: "Academic" },
  { id: "apartments", cat: "realestate",  ar: "شقق",              en: "Apartments" },
  { id: "villas",     cat: "realestate",  ar: "فلل",              en: "Villas" },
  { id: "land",       cat: "realestate",  ar: "أراضٍ",            en: "Land" },
];

export interface Vendor {
  id: string; ar: string; en: string; cat: string; color: string; rating: number; reviews: number;
  since: number; followers: number; city: { ar: string; en: string }; ar_about: string; en_about: string;
}
export const VENDORS: Record<string, Vendor> = {
  techzone: { id: "techzone", ar: "تك زون", en: "Tech Zone", cat: "electronics", color: "#2f69fe", rating: 4.8, reviews: 1240, since: 2019, followers: 18200, city: { ar: "الرياض", en: "Riyadh" },
    ar_about: "متجر متخصص في الصوتيات والإلكترونيات الحديثة بأفضل الأسعار.", en_about: "Specialist in audio and modern electronics at the best prices." },
  aloud:    { id: "aloud", ar: "العربية للعود", en: "Al-Arabia Oud", cat: "perfumes", color: "#7c3aed", rating: 4.9, reviews: 980, since: 2016, followers: 24500, city: { ar: "جدة", en: "Jeddah" },
    ar_about: "عطور وعود فاخر من أجود المصادر العالمية.", en_about: "Luxury oud and perfumes from the finest global sources." },
  anaqa:    { id: "anaqa", ar: "أناقة", en: "Anaqa", cat: "fashion", color: "#d6336c", rating: 4.7, reviews: 1530, since: 2018, followers: 31000, city: { ar: "الرياض", en: "Riyadh" },
    ar_about: "أحدث صيحات الموضة الرجالية والنسائية.", en_about: "The latest in men's and women's fashion." },
  nakhba:   { id: "nakhba", ar: "النخبة", en: "Al-Nakhba", cat: "restaurants", color: "#ce4847", rating: 4.6, reviews: 2100, since: 2015, followers: 42000, city: { ar: "الدمام", en: "Dammam" },
    ar_about: "أشهى المأكولات والحلويات بخصومات يومية.", en_about: "Delicious food and sweets with daily discounts." },
  diyar:    { id: "diyar", ar: "ديار العقارية", en: "Diyar Realty", cat: "realestate", color: "#2f6f7e", rating: 4.7, reviews: 640, since: 2014, followers: 15600, city: { ar: "الرياض", en: "Riyadh" },
    ar_about: "شقق وفلل وأراضٍ سكنية وتجارية بعروض تمويل مرنة.", en_about: "Residential and commercial apartments, villas and land with flexible financing." },
  // extra vendors so each category/sub-category has several competing stores
  smarthub: { id: "smarthub", ar: "سمارت هَب", en: "Smart Hub", cat: "electronics", color: "#0ea5a4", rating: 4.6, reviews: 860, since: 2020, followers: 12300, city: { ar: "الرياض", en: "Riyadh" },
    ar_about: "أحدث الجوّالات والحواسيب والإكسسوارات بضمان رسمي.", en_about: "Latest phones, laptops and accessories with official warranty." },
  volt:     { id: "volt", ar: "فولت للإلكترونيات", en: "Volt Electronics", cat: "electronics", color: "#f59e0b", rating: 4.5, reviews: 540, since: 2021, followers: 7800, city: { ar: "الدمام", en: "Dammam" },
    ar_about: "سماعات وأجهزة صوت احترافية بأسعار منافسة.", en_about: "Pro audio gear and headphones at competitive prices." },
  roaya:    { id: "roaya", ar: "رؤية العطور", en: "Roaya Perfumes", cat: "perfumes", color: "#a855f7", rating: 4.7, reviews: 690, since: 2019, followers: 14100, city: { ar: "مكة", en: "Makkah" },
    ar_about: "عطور شرقية وغربية وتشكيلات هدايا فاخرة.", en_about: "Oriental & western perfumes and luxury gift sets." },
  tarateel: { id: "tarateel", ar: "تراتيل", en: "Tarateel", cat: "fashion", color: "#ec4899", rating: 4.6, reviews: 1120, since: 2017, followers: 22700, city: { ar: "جدة", en: "Jeddah" },
    ar_about: "أزياء وعبايات عصرية بلمسة راقية.", en_about: "Modern abayas and fashion with an elegant touch." },
  mazaq:    { id: "mazaq", ar: "مذاق", en: "Mazaq", cat: "restaurants", color: "#ef4444", rating: 4.5, reviews: 1780, since: 2016, followers: 33400, city: { ar: "الرياض", en: "Riyadh" },
    ar_about: "مأكولات ووجبات وحلويات بعروض يومية.", en_about: "Meals, food and sweets with daily deals." },
};

export interface Product {
  id: string; vendor: string; cat: string; subcat?: string; ar: string; en: string; ar_d: string; en_d: string;
  price: number; old: number; rating: number; reviews: number; days: number; active: boolean;
  color: string; img: string | null; discount: number;
}
// deterministically pick a sub-category for a product from its category's subs,
// so every product maps to one (spreads products across the category's subs).
let _pIdx = 0;
const pickSub = (cat: string): string | undefined => {
  const subs = SUBCATS.filter((s) => s.cat === cat);
  if (subs.length === 0) return undefined;
  return subs[_pIdx++ % subs.length].id;
};
const P = (id: string, vendor: string, cat: string, ar: string, en: string, ar_d: string, en_d: string, price: number, old: number, rating: number, reviews: number, days: number, active: boolean, color: string, img: string | null): Product =>
  ({ id, vendor, cat, subcat: pickSub(cat), ar, en, ar_d, en_d, price, old, rating, reviews, days, active, color, img, discount: Math.round((1 - price / old) * 100) });

export const PRODUCTS: Product[] = [
  P("airpods",  "techzone", "electronics", "آيربودز ماكس", "AirPods Max", "توازن مثالي وصوت عالي الدقة", "A perfect balance of high-fidelity audio", 559, 749, 5.0, 121, 3, true,  "#f3d9d2", IMG + "cat-electronics.png"),
  P("earbuds",  "techzone", "electronics", "سماعات لاسلكية IPX8", "Wireless Earbuds IPX8", "قطن عضوي، مقاومة للماء", "Organic cotton, water resistant", 89, 129, 4.6, 121, 5, true, "#dfe7ef", IMG + "cat-electronics.png"),
  P("bose",     "techzone", "electronics", "بوز BT", "Bose BT Earphones", "عازل ضوضاء، أسود مطفي", "Air purifier, stained matte black", 289, 359, 4.4, 121, 2, true, "#dcdedd", IMG + "cat-electronics.png"),
  P("vivefox",  "techzone", "electronics", "فيفوكس", "VIVEFOX Headphones", "سماعات سلكية مع مايك", "Wired stereo headsets with mic", 39, 59, 4.2, 121, 6, true, "#f6d6cf", IMG + "product-main.png"),
  P("jbl",      "techzone", "electronics", "جي بي إل تيون", "JBL Tune 600BT", "توصيل عظمي، بريميوم", "Premium bone conduction open ear", 59, 99, 4.5, 121, 4, true, "#d7dbe0", IMG + "product-main.png"),
  P("oud",      "aloud", "perfumes", "عود كمبودي فاخر", "Cambodi Oud Lux", "عود طبيعي معتّق ١٠ سنوات", "Aged natural oud, 10 years", 199, 399, 4.9, 320, 3, true, "#ead7fb", IMG + "product-5.png"),
  P("musk",     "aloud", "perfumes", "مسك الطهارة", "White Musk", "مسك أبيض نقي خالٍ من الكحول", "Pure alcohol-free white musk", 75, 120, 4.8, 210, 7, true, "#f0e6fb", IMG + "product-3.png"),
  P("abaya",    "anaqa", "fashion", "عباية كلوش", "Cloche Abaya", "قماش كريب فاخر، أسود", "Premium crepe fabric, black", 240, 420, 4.7, 153, 5, true, "#f7dde6", IMG + "cat-clothes.png"),
  P("jacket",   "anaqa", "fashion", "جاكيت جلد", "Leather Jacket", "جلد طبيعي بقَصّة عصرية", "Genuine leather, modern cut", 320, 480, 4.6, 98, 2, true, "#e7d7d2", IMG + "cat-clothes.png"),
  P("watch",    "anaqa", "watches", "ساعة كلاسيك", "Classic Watch", "ستانلس ستيل مقاوم للماء", "Stainless steel, water resistant", 145, 260, 4.5, 76, 6, false, "#e9e2d2", null),
  P("dessert",  "nakhba", "restaurants", "بوكس حلا فاخر", "Luxury Sweets Box", "تشكيلة حلويات شرقية", "Assorted oriental sweets", 49, 89, 4.8, 410, 1, true, "#fbe6cf", IMG + "cat-food.png"),
  P("meal",     "nakhba", "restaurants", "وجبة مشاوي", "Grill Combo", "وجبة عائلية كاملة", "Full family grill meal", 99, 149, 4.6, 320, 2, true, "#f6dcc6", IMG + "cat-food.png"),
  P("villa",    "diyar", "realestate", "فيلا مودرن ٤ غرف", "Modern 4-BR Villa", "حي راقٍ، تشطيب فاخر، مع مسبح", "Upscale district, luxury finish, private pool", 1250000, 1400000, 4.8, 42, 9, true, "#dce6ef", IMG + "cat-kitchen.png"),
  P("apartment","diyar", "realestate", "شقة تمليك ٣ غرف", "3-BR Apartment", "موقع مركزي قريب من الخدمات", "Central location near amenities", 640000, 720000, 4.6, 68, 12, true, "#e6eef7", IMG + "cat-kitchen.png"),
  P("land",     "diyar", "realestate", "أرض سكنية ٥٠٠م²", "Residential Land 500m²", "مخطط معتمد، على شارعين", "Approved plan, corner plot", 480000, 540000, 4.5, 30, 6, true, "#e9eef4", null),
  // extra products so each sub-category is served by several stores
  P("phone1",   "smarthub", "electronics", "جوال جالاكسي S", "Galaxy S Phone", "شاشة أموليد وكاميرا احترافية", "AMOLED screen, pro camera", 2499, 2999, 4.7, 210, 4, true, "#dbe7ef", IMG + "cat-electronics.png"),
  P("laptop1",  "smarthub", "electronics", "لابتوب نحيف", "Slim Laptop", "معالج حديث وبطارية تدوم يوماً", "Modern CPU, all-day battery", 3199, 3799, 4.6, 140, 5, true, "#e3e9f0", IMG + "cat-electronics.png"),
  P("hp1",      "smarthub", "electronics", "سماعة رأس لاسلكية", "Wireless Headset", "عزل ضوضاء نشط", "Active noise cancelling", 349, 499, 4.5, 96, 3, true, "#dde3ea", IMG + "cat-electronics.png"),
  P("speaker1", "volt", "electronics", "مكبّر صوت محمول", "Portable Speaker", "صوت جهير قوي ومقاوم للماء", "Deep bass, water resistant", 199, 279, 4.4, 130, 6, true, "#dfe6ee", IMG + "cat-electronics.png"),
  P("earbud2",  "volt", "electronics", "سماعات أذن رياضية", "Sport Earbuds", "ثبات أثناء الحركة", "Secure sport fit", 129, 189, 4.3, 88, 4, true, "#e0e7ef", IMG + "cat-electronics.png"),
  P("phone2",   "volt", "electronics", "شاحن سريع ٦٥w", "65W Fast Charger", "شحن كامل خلال دقائق", "Full charge in minutes", 79, 129, 4.5, 60, 5, true, "#e2e8f0", IMG + "cat-electronics.png"),
  P("perf1",    "roaya", "perfumes", "عطر ورد الطائف", "Taif Rose", "ورد طبيعي فاخر", "Premium natural rose", 260, 360, 4.8, 180, 4, true, "#f0e6fb", IMG + "cat-beauty.png"),
  P("perf2",    "roaya", "perfumes", "بخور معمول", "Bakhoor Maamoul", "بخور فاخر معتّق", "Aged luxury bakhoor", 140, 220, 4.7, 150, 6, true, "#efe4fa", IMG + "cat-beauty.png"),
  P("dress1",   "tarateel", "fashion", "فستان سهرة", "Evening Dress", "تصميم أنيق للمناسبات", "Elegant occasion design", 380, 520, 4.7, 120, 3, true, "#f7dde6", IMG + "cat-clothes.png"),
  P("abaya2",   "tarateel", "fashion", "عباية مطرّزة", "Embroidered Abaya", "تطريز يدوي فاخر", "Fine hand embroidery", 290, 430, 4.6, 140, 5, true, "#f6dce5", IMG + "cat-clothes.png"),
  P("shake1",   "mazaq", "restaurants", "برجر لحم أنغوس", "Angus Beef Burger", "لحم أنغوس مشوي طازج", "Fresh grilled Angus beef", 45, 69, 4.5, 260, 2, true, "#f6dcc6", IMG + "cat-food.png"),
  P("sweet2",   "mazaq", "restaurants", "كنافة نابلسية", "Nabulsi Kunafa", "كنافة بالجبن والقطر", "Cheese kunafa with syrup", 35, 55, 4.7, 300, 1, true, "#fbe6cf", IMG + "cat-food.png"),
];

export interface Auction { id: string; vendor: string; cat: string; ar: string; en: string; current: number; start: number; bids: number; endH: number; color: string; }
const A = (id: string, vendor: string, cat: string, ar: string, en: string, current: number, start: number, bids: number, endH: number, color: string): Auction =>
  ({ id, vendor, cat, ar, en, current, start, bids, endH, color });
export const AUCTIONS: Auction[] = [
  A("rolex",   "anaqa",    "watches",     "ساعة فاخرة كلاسيك", "Classic Lux Watch", 4200, 2500, 38, 5,  "#e9e2d2"),
  A("oud-rare","aloud",    "perfumes",    "عود كمبودي نادر",   "Rare Cambodi Oud",  1850, 900,  52, 2,  "#ead7fb"),
  A("art",     "anaqa",    "furniture",   "لوحة فنية أصلية",   "Original Artwork",  3100, 1500, 21, 9,  "#eef7ee"),
  A("camera",  "techzone", "electronics", "كاميرا احترافية",   "Pro Camera Kit",    2750, 1800, 44, 3,  "#dfe7ef"),
  A("gold-set","anaqa",    "gold",        "طقم ذهب عيار ٢١",   "21K Gold Set",      6800, 4000, 67, 7,  "#fff7da"),
  A("vinyl",   "techzone", "electronics", "مشغل أسطوانات",     "Vintage Turntable", 920,  500,  19, 12, "#d7dbe0"),
];

export interface Notif { id: string; type: string; topic: string; ar: string; en: string; vendor: string | null; time: string; time_en: string; read: boolean; }
export const NOTIFS: Notif[] = [
  { id: "n1", type: "offer",   topic: "CUSTOMERS", ar: "خصم ٥٠٪ بدأ الآن في تك زون!", en: "50% off just started at Tech Zone!", vendor: "techzone", time: "قبل ٥ دقائق", time_en: "5 min ago", read: false },
  { id: "n2", type: "auction", topic: "CUSTOMERS", ar: "تمت المزايدة على ساعتك المفضلة", en: "Someone outbid you on your favourite watch", vendor: "anaqa", time: "قبل ٢٠ دقيقة", time_en: "20 min ago", read: false },
  { id: "n3", type: "order",   topic: "VENDORS", ar: "طلب جديد بانتظار التأكيد", en: "New order awaiting confirmation", vendor: "nakhba", time: "قبل ساعة", time_en: "1 hr ago", read: false },
  { id: "n4", type: "approval", topic: "VENDORS", ar: "تمت الموافقة على منتجك «عود كمبودي»", en: "Your product 'Cambodi Oud' was approved", vendor: "aloud", time: "قبل ٣ ساعات", time_en: "3 hrs ago", read: true },
  { id: "n5", type: "event",   topic: "CUSTOMERS", ar: "فعالية مهرجان التسوق تبدأ غداً", en: "Shopping Festival event starts tomorrow", vendor: null, time: "أمس", time_en: "Yesterday", read: true },
  { id: "n6", type: "system",  topic: "CUSTOMERS", ar: "اشتراكك في باقة احترافي ينتهي خلال ٣ أيام", en: "Your Pro plan expires in 3 days", vendor: null, time: "أمس", time_en: "Yesterday", read: true },
];

export interface Reel { id: string; vendor: string; cat: string; ar: string; en: string; views: number; likes: number; status: string; img: string; }
export const REELS: Reel[] = [
  { id: "r1", vendor: "techzone", cat: "electronics", ar: "وصلت سماعات آيربودز ماكس الجديدة 🎧", en: "New AirPods Max just arrived", views: 12400, likes: 980,  status: "APPROVED", img: IMG + "cat-electronics.png" },
  { id: "r2", vendor: "aloud",    cat: "perfumes",    ar: "طريقة تبخير العود الكمبودي الفاخر", en: "How to burn premium Cambodi oud", views: 28900, likes: 2100, status: "APPROVED", img: IMG + "cat-beauty.png" },
  { id: "r3", vendor: "anaqa",    cat: "fashion",     ar: "تشكيلة الشتاء الجديدة وصلت", en: "New winter collection is here", views: 9800,  likes: 760,  status: "APPROVED", img: IMG + "cat-clothes.png" },
  { id: "r4", vendor: "nakhba",   cat: "restaurants", ar: "تحضير بوكس الحلا الفاخر", en: "Preparing the luxury sweets box", views: 41200, likes: 3400, status: "PENDING",  img: IMG + "cat-food.png" },
  { id: "r5", vendor: "techzone", cat: "electronics", ar: "مراجعة سماعات بوز الجديدة", en: "Reviewing the new Bose earphones", views: 7600,  likes: 540,  status: "APPROVED", img: IMG + "product-main.png" },
  { id: "r6", vendor: "aloud",    cat: "perfumes",    ar: "أساسيات العطور للمبتدئين", en: "Perfume basics for beginners", views: 15300, likes: 1240, status: "APPROVED", img: IMG + "product-3.png" },
];

export interface EventItem { id: string; ar: string; en: string; ar_d: string; en_d: string; city: { ar: string; en: string }; date: { ar: string; en: string }; tint: string; img: string; live: boolean; }
export const EVENTS: EventItem[] = [
  { id: "e1", ar: "مهرجان التسوق السنوي", en: "Annual Shopping Festival", ar_d: "خصومات حتى ٧٠٪ على مئات المتاجر لمدة أسبوع كامل.", en_d: "Up to 70% off across hundreds of stores for a full week.", city: { ar: "الرياض", en: "Riyadh" }, date: { ar: "١٥–٢٢ يوليو", en: "Jul 15–22" }, tint: "#11161d", img: IMG + "cat-electronics.png", live: true },
  { id: "e2", ar: "أسبوع العطور والجمال", en: "Beauty & Perfume Week", ar_d: "عروض حصرية من أفخر متاجر العطور والعناية.", en_d: "Exclusive deals from top perfume and beauty stores.", city: { ar: "جدة", en: "Jeddah" }, date: { ar: "١–٧ أغسطس", en: "Aug 1–7" }, tint: "#1a1216", img: IMG + "cat-beauty.png", live: false },
  { id: "e3", ar: "معرض الأزياء الشتوي", en: "Winter Fashion Expo", ar_d: "أحدث صيحات الموضة بأسعار المعرض.", en_d: "The latest fashion trends at expo prices.", city: { ar: "الرياض", en: "Riyadh" }, date: { ar: "١٠–١٤ أغسطس", en: "Aug 10–14" }, tint: "#e7eaed", img: IMG + "cat-clothes.png", live: false },
  { id: "e4", ar: "ليالي المطاعم", en: "Restaurant Nights", ar_d: "تجارب طعام وخصومات في أفضل المطاعم.", en_d: "Dining experiences and discounts at the best restaurants.", city: { ar: "الدمام", en: "Dammam" }, date: { ar: "٢٠–٢٥ أغسطس", en: "Aug 20–25" }, tint: "#f1ece6", img: IMG + "cat-food.png", live: false },
  { id: "e5", ar: "معرض العقارات", en: "Real Estate Expo", ar_d: "شقق وفلل وأراضٍ بعروض تمويل حصرية من أفضل المطوّرين.", en_d: "Apartments, villas and land with exclusive financing offers from top developers.", city: { ar: "الرياض", en: "Riyadh" }, date: { ar: "٥–١٠ سبتمبر", en: "Sep 5–10" }, tint: "#e6eef7", img: IMG + "cat-kitchen.png", live: true },
];

export type CouponType = "percent" | "fixed" | "item"; // نسبة · مبلغ ثابت · اشترِ X واحصل على Y هدية
export interface Coupon { id: string; code: string; vendor: string; ar: string; en: string; type: CouponType; pct: number; desc?: string; used: number; limit: number; active: boolean; until: { ar: string; en: string }; buyQty?: number; giftQty?: number; }
export const COUPONS: Coupon[] = [
  { id: "c1", code: "MASH50", vendor: "techzone", ar: "خصم ٥٠٪ — متجر تك زون", en: "50% off — Tech Zone", type: "percent", pct: 50, desc: "خصم ٥٠٪ على السماعات المختارة", used: 128, limit: 200, active: true,  until: { ar: "٣٠ يوليو", en: "Jul 30" } },
  { id: "c2", code: "OUD20",  vendor: "aloud", ar: "خصم ٢٠٪ — العربية للعود", en: "20% off — Al-Arabia Oud", type: "percent", pct: 20, desc: "خصم على العود الكمبودي", used: 64,  limit: 150, active: true,  until: { ar: "١٥ أغسطس", en: "Aug 15" } },
  { id: "c3", code: "SAVE50", vendor: "nakhba", ar: "خصم ٥٠ ﷼ على الطلب", en: "50 SAR off", type: "fixed", pct: 50, desc: "خصم ٥٠ ريال على الطلبات فوق ٢٠٠ ريال", used: 540, limit: 1000, active: false, until: { ar: "منتهٍ", en: "Expired" } },
];

export interface City { id: string; ar: string; en: string; stores: number; x: number; y: number; }
export const CITIES: City[] = [
  { id: "riyadh", ar: "الرياض", en: "Riyadh", stores: 142, x: 56, y: 46 },
  { id: "jeddah", ar: "جدة", en: "Jeddah", stores: 88, x: 28, y: 58 },
  { id: "dammam", ar: "الدمام", en: "Dammam", stores: 54, x: 74, y: 44 },
  { id: "makkah", ar: "مكة", en: "Makkah", stores: 47, x: 30, y: 64 },
  { id: "madinah", ar: "المدينة", en: "Madinah", stores: 33, x: 34, y: 44 },
  { id: "abha", ar: "أبها", en: "Abha", stores: 21, x: 40, y: 80 },
];

// Branches/locations per vendor across cities — used on the store profile to
// show the store's locations in the visitor's city. cityAr matches CITIES.ar.
export interface StoreBranch { id: string; ar: string; en: string; cityAr: string; cityEn: string; addressAr: string; addressEn: string; phone: string; }
export const STORE_LOCATIONS: Record<string, StoreBranch[]> = {
  techzone: [
    { id: "tz-r1", ar: "تك زون — الفرع الرئيسي", en: "Tech Zone — Main branch", cityAr: "الرياض", cityEn: "Riyadh", addressAr: "شارع الملك فهد، العليا", addressEn: "King Fahd Rd, Olaya", phone: "011 234 5678" },
    { id: "tz-r2", ar: "تك زون — النخيل مول", en: "Tech Zone — Nakheel Mall", cityAr: "الرياض", cityEn: "Riyadh", addressAr: "طريق الملك عبدالله", addressEn: "King Abdullah Rd", phone: "011 765 4321" },
    { id: "tz-j1", ar: "تك زون — جدة", en: "Tech Zone — Jeddah", cityAr: "جدة", cityEn: "Jeddah", addressAr: "شارع التحلية", addressEn: "Tahlia St", phone: "012 345 6789" },
    { id: "tz-d1", ar: "تك زون — الدمام", en: "Tech Zone — Dammam", cityAr: "الدمام", cityEn: "Dammam", addressAr: "الكورنيش", addressEn: "Corniche", phone: "013 456 7890" },
  ],
  aloud: [
    { id: "al-j1", ar: "العربية للعود — الفرع الرئيسي", en: "Al-Arabia Oud — Main", cityAr: "جدة", cityEn: "Jeddah", addressAr: "شارع الأندلس", addressEn: "Andalus St", phone: "012 111 2233" },
    { id: "al-m1", ar: "العربية للعود — مكة", en: "Al-Arabia Oud — Makkah", cityAr: "مكة", cityEn: "Makkah", addressAr: "العزيزية", addressEn: "Aziziyah", phone: "012 222 3344" },
    { id: "al-r1", ar: "العربية للعود — الرياض", en: "Al-Arabia Oud — Riyadh", cityAr: "الرياض", cityEn: "Riyadh", addressAr: "الرياض بارك", addressEn: "Riyadh Park", phone: "011 333 4455" },
  ],
  anaqa: [
    { id: "an-r1", ar: "أناقة — الرياض", en: "Anaqa — Riyadh", cityAr: "الرياض", cityEn: "Riyadh", addressAr: "بوليفارد", addressEn: "Boulevard", phone: "011 444 5566" },
    { id: "an-j1", ar: "أناقة — جدة", en: "Anaqa — Jeddah", cityAr: "جدة", cityEn: "Jeddah", addressAr: "الرد سي مول", addressEn: "Red Sea Mall", phone: "012 555 6677" },
  ],
  nakhba: [
    { id: "nk-d1", ar: "النخبة — الدمام", en: "Al-Nakhba — Dammam", cityAr: "الدمام", cityEn: "Dammam", addressAr: "شارع الأمير محمد", addressEn: "Prince Mohammed St", phone: "013 666 7788" },
    { id: "nk-r1", ar: "النخبة — الرياض", en: "Al-Nakhba — Riyadh", cityAr: "الرياض", cityEn: "Riyadh", addressAr: "حي الملقا", addressEn: "Al-Malqa", phone: "011 777 8899" },
  ],
  diyar: [
    { id: "dy-r1", ar: "ديار العقارية — الرياض", en: "Diyar Realty — Riyadh", cityAr: "الرياض", cityEn: "Riyadh", addressAr: "طريق الملك سلمان", addressEn: "King Salman Rd", phone: "011 888 9900" },
  ],
  smarthub: [
    { id: "sh-r1", ar: "سمارت هَب — الرياض", en: "Smart Hub — Riyadh", cityAr: "الرياض", cityEn: "Riyadh", addressAr: "غرناطة مول", addressEn: "Granada Mall", phone: "011 999 0011" },
  ],
  volt: [
    { id: "vo-d1", ar: "فولت — الدمام", en: "Volt — Dammam", cityAr: "الدمام", cityEn: "Dammam", addressAr: "الظهران مول", addressEn: "Dhahran Mall", phone: "013 121 2323" },
  ],
  roaya: [
    { id: "ro-m1", ar: "رؤية العطور — مكة", en: "Roaya — Makkah", cityAr: "مكة", cityEn: "Makkah", addressAr: "أجياد", addressEn: "Ajyad", phone: "012 343 4545" },
  ],
  tarateel: [
    { id: "ta-j1", ar: "تراتيل — جدة", en: "Tarateel — Jeddah", cityAr: "جدة", cityEn: "Jeddah", addressAr: "المالكي", addressEn: "Al-Malki", phone: "012 565 6767" },
  ],
  mazaq: [
    { id: "mz-r1", ar: "مذاق — الرياض", en: "Mazaq — Riyadh", cityAr: "الرياض", cityEn: "Riyadh", addressAr: "حي الياسمين", addressEn: "Al-Yasmin", phone: "011 787 8989" },
  ],
};
export function branchesOf(vendorId: string): StoreBranch[] { return STORE_LOCATIONS[vendorId] || []; }

export interface Plan { id: string; ar: string; en: string; price: number; active: boolean; desc?: string; start?: string; }
export const PLANS: Plan[] = [
  { id: "basic", ar: "أساسي", en: "Basic", price: 0, active: false, desc: "<ul><li>متجر واحد</li><li>حتى ٥ منتجات</li><li>دعم عبر البريد</li></ul>" },
  { id: "pro", ar: "احترافي", en: "Pro", price: 199, active: true, desc: "<p><b>الأكثر شيوعاً</b></p><ul><li>منتجات غير محدودة</li><li>خصومات ومزادات</li><li>إحصائيات الزوار</li></ul>" },
  { id: "enterprise", ar: "متاجر", en: "Enterprise", price: 499, active: false, desc: "<ul><li>فروع متعددة</li><li>حساب مدير</li><li>مدير حساب مخصص</li></ul>" },
];

export function money(n: number, lang: Lang): string {
  const s = new Intl.NumberFormat("en-US").format(n);
  return lang === "ar" ? `${s} ﷼` : `SAR ${s}`;
}
