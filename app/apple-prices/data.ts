export type CountryCode = "TH" | "JP" | "SG" | "HK" | "TW" | "CN";

export interface Country {
  code: CountryCode;
  name: string;
  /** Column-width name for tables. */
  short: string;
  flag: string;
  currency: string;
  /** Prefix for local prices, as the local Apple Store writes it. */
  symbol: string;
  /** How many units to quote the exchange rate for (yen reads better per 100). */
  fxUnit: number;
  /** Baht per one unit of local currency. */
  thbPerUnit: number;
  /**
   * Share of the tax-inclusive price a tourist actually gets back at Apple's own stores, after the
   * refund operator's fee. Zero where there's no tax, no scheme, or Apple's participation is unconfirmed.
   */
  touristRefund: number;
  taxNote: string;
  notes: string[];
  store: string;
}

export type Family = "MacBook Pro" | "Mac mini" | "iPhone";

export interface Model {
  id: string;
  family: Family;
  name: string;
  config: string;
  /**
   * Cheapest standard configuration on each country's Apple Online Store, local currency, tax included.
   * Left out where that store doesn't sell the model.
   */
  prices: Partial<Record<CountryCode, number>>;
  note?: string;
}

export const priceDate = "2026-10-28";
export const fxDate = "2026-10-27";
export const fxSource = "Bank of Thailand, mid of buying and selling";

/** Thai VAT on goods brought home above the 20,000-baht personal allowance. Import duty on these is 0%. */
export const THAI_IMPORT_VAT = 0.07;

export const countries: Country[] = [
  {
    code: "TH",
    name: "Thailand",
    short: "Thailand",
    flag: "🇹🇭",
    currency: "THB",
    symbol: "฿",
    fxUnit: 1,
    thbPerUnit: 1,
    touristRefund: 0,
    taxNote: "Prices include 7% VAT. Every other country on this page is measured against these.",
    notes: [
      "Coming home with a new laptop or phone? Anything over the 20,000-baht allowance goes through the red channel: no import duty, but 7% VAT.",
      "The 14″ MacBook Pro with M6 has a Thai price, but Apple Thailand hasn't given a release date yet.",
    ],
    store: "https://www.apple.com/th/",
  },
  {
    code: "JP",
    name: "Japan",
    short: "Japan",
    flag: "🇯🇵",
    currency: "JPY",
    symbol: "¥",
    fxUnit: 100,
    thbPerUnit: 0.21447,
    touristRefund: 0,
    taxNote:
      "Prices include 10% consumption tax. Apple's own stores in Japan stopped tax-free sales for tourists in 2022, so at Apple you pay the full price.",
    notes: [
      "Resellers like Bic Camera and Yodobashi still refund the tax to tourists. From 1 Nov 2026 Japan switches to refunds at departure: you pay full price and claim the 10% back at customs.",
      "Macs come with a Japanese (JIS) keyboard. A US layout is a free option, but only as a custom order.",
      "Japanese iPhones always play the camera shutter sound while in Japan, even on silent.",
      "apple.com/jp only delivers inside Japan.",
    ],
    store: "https://www.apple.com/jp/",
  },
  {
    code: "SG",
    name: "Singapore",
    short: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    symbol: "S$",
    fxUnit: 1,
    thbPerUnit: 26.369,
    touristRefund: 0.063,
    taxNote:
      "Prices include 9% GST. Buy in a physical Apple Store (not online) and claim it back at Changi through the Tourist Refund Scheme: roughly 6% of the price after the refund agent's fee.",
    notes: [
      "Spend at least S$100, and leave by air with the goods within two months.",
      "iPhone Air and iPhone Duo are eSIM-only. When checked, a new iPhone Duo order was quoting late-January 2027 delivery.",
    ],
    store: "https://www.apple.com/sg/",
  },
  {
    code: "HK",
    name: "Hong Kong",
    short: "Hong Kong",
    flag: "🇭🇰",
    currency: "HKD",
    symbol: "HK$",
    fxUnit: 1,
    thbPerUnit: 4.3047,
    touristRefund: 0,
    taxNote: "No sales tax at all, so the shelf price is the final price and there's nothing to claim back.",
    notes: [
      "MacBooks come with a US English keyboard as standard, the easiest layout to pick up off the shelf.",
      "The dual-physical-SIM iPhones are gone: current models take one nano-SIM plus eSIM, and Air and Duo are eSIM-only.",
      "Chargers have UK-style three-pin plugs, so bring a travel adapter for Thai sockets.",
    ],
    store: "https://www.apple.com/hk/",
  },
  {
    code: "TW",
    name: "Taiwan",
    short: "Taiwan",
    flag: "🇹🇼",
    currency: "TWD",
    symbol: "NT$",
    fxUnit: 1,
    thbPerUnit: 1.0359,
    touristRefund: 0,
    taxNote:
      "Prices include 5% VAT. Taiwan refunds it to tourists at participating stores (about 3.8% of the price after the 20% handling charge), but I couldn't confirm Apple's own stores take part, so it isn't counted here.",
    notes: [
      "Macs come with a Zhuyin (Traditional Chinese) keyboard. A US layout is a free option, but only as a custom order.",
      "apple.com/tw only delivers inside Taiwan.",
    ],
    store: "https://www.apple.com/tw/",
  },
  {
    code: "CN",
    name: "Mainland China",
    short: "China",
    flag: "🇨🇳",
    currency: "CNY",
    symbol: "RMB ",
    fxUnit: 1,
    thbPerUnit: 5.0637,
    touristRefund: 0,
    taxNote:
      "Prices include 13% VAT. China's departure tax refund returns about 9% of the price at participating stores, but I found no sign Apple Stores take part, so it isn't counted here.",
    notes: [
      "Apple says Apple Intelligence doesn't currently work on devices bought in mainland China. It follows where the device was bought, not where you use it.",
      "iPhone 17 and 18 Pro take two physical nano-SIMs. Air and Duo are eSIM-only, so check that your Thai carrier's eSIM works on a China model first.",
      "JD and Tmall often undercut Apple's list price, but the best deals lean on China's national subsidy, which needs local eligibility.",
      "Apple China says the M6 MacBook Pro goes on sale only “after approval.”",
    ],
    store: "https://www.apple.com.cn/",
  },
];

export const abroad = countries.filter((c) => c.code !== "TH");

export const families: Family[] = ["MacBook Pro", "Mac mini", "iPhone"];

export const models: Model[] = [
  {
    id: "macbook-pro-14-m6",
    family: "MacBook Pro",
    name: "MacBook Pro 14″ M6",
    config: "12-core CPU, 12-core GPU, 16GB memory, 1TB SSD",
    prices: { TH: 69900, JP: 339800, SG: 2699, HK: 15999, TW: 64900, CN: 15999 },
    note: "Announced 27 Oct 2026. Pre-orders open 29 Oct across Asia and ship from 6 Nov, except Thailand, which has no date yet.",
  },
  {
    id: "macbook-pro-14-m5-pro",
    family: "MacBook Pro",
    name: "MacBook Pro 14″ M5 Pro",
    config: "15-core CPU, 16-core GPU, 24GB memory, 1TB SSD",
    prices: { TH: 87900, JP: 429800, SG: 3499, HK: 19999, TW: 84900, CN: 19999 },
  },
  {
    id: "macbook-pro-16-m5-pro",
    family: "MacBook Pro",
    name: "MacBook Pro 16″ M5 Pro",
    config: "18-core CPU, 20-core GPU, 24GB memory, 1TB SSD",
    prices: { TH: 104900, JP: 519800, SG: 3999, HK: 23999, TW: 99900, CN: 24999 },
  },
  {
    id: "macbook-pro-14-m5-max",
    family: "MacBook Pro",
    name: "MacBook Pro 14″ M5 Max",
    config: "18-core CPU, 32-core GPU, 36GB memory, 2TB SSD",
    prices: { TH: 144900, JP: 699800, SG: 5799, HK: 32499, TW: 139900, CN: 33999 },
  },
  {
    id: "mac-mini-m6",
    family: "Mac mini",
    name: "Mac mini M6",
    config: "12-core CPU, 12-core GPU, 16GB memory, 256GB SSD",
    prices: { TH: 32900, JP: 149800, SG: 1299, HK: 7299, TW: 29900, CN: 6999 },
  },
  {
    id: "mac-mini-m5-pro",
    family: "Mac mini",
    name: "Mac mini M5 Pro",
    config: "15-core CPU, 16-core GPU, 24GB memory, 512GB SSD",
    prices: { TH: 61900, JP: 299800, SG: 2499, HK: 13999, TW: 59900, CN: 12999 },
  },
  {
    id: "iphone-17e",
    family: "iPhone",
    name: "iPhone 17e",
    config: "256GB",
    prices: { TH: 26900, JP: 124800, SG: 1099, HK: 5999, TW: 25900, CN: 5299 },
  },
  {
    id: "iphone-17",
    family: "iPhone",
    name: "iPhone 17",
    config: "256GB",
    prices: { TH: 34900, JP: 159800, SG: 1449, HK: 7799, TW: 32900, CN: 6799 },
  },
  {
    id: "iphone-air",
    family: "iPhone",
    name: "iPhone Air",
    config: "256GB, eSIM only",
    prices: { TH: 43900, JP: 189800, SG: 1749, HK: 9499, TW: 39900, CN: 8799 },
  },
  {
    id: "iphone-18-pro",
    family: "iPhone",
    name: "iPhone 18 Pro",
    config: "6.3″, 256GB",
    prices: { TH: 48900, JP: 219800, SG: 1899, HK: 10499, TW: 44900, CN: 9999 },
  },
  {
    id: "iphone-18-pro-max",
    family: "iPhone",
    name: "iPhone 18 Pro Max",
    config: "6.9″, 256GB",
    prices: { TH: 52900, JP: 239800, SG: 2099, HK: 11499, TW: 49900, CN: 10999 },
  },
  {
    id: "iphone-duo",
    family: "iPhone",
    name: "iPhone Duo",
    config: "7.6″ foldable, 256GB, eSIM only",
    prices: { TH: 79900, JP: 364800, SG: 3099, HK: 17499, TW: 74900, CN: 15999 },
  },
];

export const sources: { label: string; url: string }[] = [
  { label: "Bank of Thailand exchange rates", url: "https://www.bot.or.th/en/statistics/exchange-rate.html" },
  {
    label: "Thai Customs: personal belongings allowance",
    url: "https://www.customs.go.th/list_strc_simple_neted.php?ini_content=individual_160503_03_160905_01&lang=en&left_menu=menu_individual_submenu_01_160421_01",
  },
  { label: "Japan Tourism Agency: new tax-free system", url: "https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00028.html" },
  { label: "Apple Singapore: GST refunds", url: "https://www.apple.com/sg/shop/help/payments" },
  { label: "IRAS: Tourist Refund Scheme", url: "https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/consumers/tourist-refund-scheme" },
  { label: "Taiwan e-Tax Refund", url: "https://www.taxrefund.net.tw/ttr/info/8a8c512c53c2138e0153c216df0f000a?lang=en_US" },
  {
    label: "Shanghai: departure tax refund",
    url: "https://english.shanghai.gov.cn/en-Individuals-ShoppingandTaxRefund-Departuretaxrefund/20260813/469b30ac4ff348b8ac3a1259f0e12d23.html",
  },
  { label: "Apple: Apple Intelligence availability", url: "https://support.apple.com/en-us/121115" },
];
