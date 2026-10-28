import prices from "./prices.json";

export type CountryCode = "TH" | "JP" | "SG" | "HK" | "TW" | "CN";

export type RefundStatus = "yes" | "no" | "unconfirmed" | "none";

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
  /** Sales tax baked into shelf prices, as a short label. */
  tax: string;
  refund: { status: RefundStatus; label: string };
  /** MacBook keyboard layout Apple ships as standard there. */
  keyboard: string;
  /** The one thing to know, shown first. */
  headline: string;
  notes: string[];
  store: string;
}

export const fxDate = "2026-10-27";
export const fxSource = "Bank of Thailand, mid of buying and selling";

/** Thai VAT on goods brought home above the 20,000-baht personal allowance. Import duty on these is 0%. */
export const THAI_VAT_PERCENT = 7;
export const THAI_IMPORT_VAT = THAI_VAT_PERCENT / 100;

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
    tax: "7% VAT",
    refund: { status: "none", label: "Home store" },
    keyboard: "Thai",
    headline: "The baseline. Everything else on this page is measured against Apple Thailand.",
    notes: [
      "Coming home with a new laptop or phone? Anything over the 20,000-baht allowance goes through the red channel: no import duty, but 7% VAT.",
      "The 14″ MacBook Pro with M6 has a Thai price, but no Thai release date yet.",
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
    tax: "10% consumption",
    refund: { status: "no", label: "No refund at Apple" },
    keyboard: "Japanese (JIS)",
    headline: "Apple's own stores in Japan stopped tax-free sales for tourists in 2022.",
    notes: [
      "Resellers like Bic Camera and Yodobashi still refund the tax. From 1 Nov 2026 you pay full price and claim the 10% back at departure.",
      "A US keyboard is a free option, but only as a custom order.",
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
    tax: "9% GST",
    refund: { status: "yes", label: "~6% back in store" },
    keyboard: "US English",
    headline: "Buy in a physical Apple Store and claim the GST back at Changi: roughly 6% after the agent's fee.",
    notes: [
      "Online orders don't qualify. Spend at least S$100 and fly out with the goods within two months.",
      "A Thai keyboard is a free build-to-order option on the online store.",
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
    tax: "None",
    refund: { status: "none", label: "Nothing to claim" },
    keyboard: "US English",
    headline: "No sales tax at all, so the shelf price is the final price.",
    notes: [
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
    tax: "5% VAT",
    refund: { status: "unconfirmed", label: "Refund unconfirmed" },
    keyboard: "Zhuyin",
    headline:
      "Taiwan refunds VAT to tourists at participating stores (about 3.8% after fees), but I couldn't confirm Apple takes part, so it isn't counted.",
    notes: ["A US keyboard is a free option, but only as a custom order.", "apple.com/tw only delivers inside Taiwan."],
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
    tax: "13% VAT",
    refund: { status: "unconfirmed", label: "Refund unconfirmed" },
    keyboard: "Pinyin",
    headline: "Apple says Apple Intelligence doesn't currently work on devices bought in mainland China.",
    notes: [
      "China's departure tax refund returns about 9% at participating stores, but I found no sign Apple Stores take part, so it isn't counted.",
      "iPhone 17 and 18 Pro take two physical nano-SIMs. Air and Duo are eSIM-only, so check your Thai carrier's eSIM works on a China model.",
      "JD and Tmall often undercut Apple, but the best deals lean on a national subsidy that needs local eligibility.",
      "Apple China says the M6 MacBook Pro goes on sale only “after approval.”",
    ],
    store: "https://www.apple.com.cn/",
  },
];

export const abroad = countries.filter((c) => c.code !== "TH");

export type Device = "macbook-pro" | "mac-mini" | "iphone";
export type OptionGroup = "memory" | "storage" | "ethernet" | "display";
export type CountryPrices = Partial<Record<CountryCode, number>>;

export interface Variant {
  /** e.g. "macbook-pro/14inch/m5pro-15-16" or "iphone/iphone18pro". */
  id: string;
  device: Device;
  /** Screen size, MacBook Pro only. */
  size?: string;
  /** Chip with CPU and GPU core counts for Macs, model family for iPhones. */
  chip: string;
  /** Price of the default configuration, local currency, tax included. */
  price: CountryPrices;
  defaults: Partial<Record<OptionGroup, string>>;
  /** Upgrade options with Apple's price difference from the default, per country. Missing = not sold there. */
  options: Partial<Record<OptionGroup, { value: string; delta: CountryPrices }[]>>;
}

export type Picks = Partial<Record<OptionGroup, string>>;

export const devices: { id: Device; name: string }[] = [
  { id: "macbook-pro", name: "MacBook Pro" },
  { id: "mac-mini", name: "Mac mini" },
  { id: "iphone", name: "iPhone" },
];

/** Generated by scripts/fetch-apple-prices.mjs, which reads every configuration off Apple's own stores. */
export const priceDate = prices.fetched;

const sizeOf = (v: Variant) => parseInt(v.size ?? "0");

export const variants = (prices.variants as Variant[]).sort(
  (a, b) =>
    devices.findIndex((d) => d.id === a.device) - devices.findIndex((d) => d.id === b.device) ||
    sizeOf(a) - sizeOf(b) ||
    (a.price.TH ?? 0) - (b.price.TH ?? 0),
);

const iphoneNames: Record<string, string> = {
  iphone17e: "iPhone 17e",
  iphone17: "iPhone 17",
  iphoneair: "iPhone Air",
  iphone18pro: "iPhone 18 Pro",
  iphone18promax: "iPhone 18 Pro Max",
  iphoneduo: "iPhone Duo",
};

/** "m5pro-15-16" -> { name: "M5 Pro", cores: "15-core CPU, 16-core GPU" }. */
export function chipLabel(chip: string): { name: string; cores?: string } {
  const m = chip.match(/^m(\d+)(pro|max|ultra)?-(\d+)-(\d+)$/);
  if (!m) return { name: iphoneNames[chip] ?? chip };
  const tier = m[2] ? ` ${m[2][0].toUpperCase()}${m[2].slice(1)}` : "";
  return { name: `M${m[1]}${tier}`, cores: `${m[3]}-core CPU, ${m[4]}-core GPU` };
}

export const sizeLabel = (size: string) => size.replace("inch", "-inch");

export function variantName(v: Variant) {
  const device = devices.find((d) => d.id === v.device)!.name;
  if (v.device === "iphone") return chipLabel(v.chip).name;
  return [device, v.size && sizeLabel(v.size), chipLabel(v.chip).name].filter(Boolean).join(" ");
}

export const groupLabels: Record<OptionGroup, string> = {
  memory: "Memory",
  storage: "Storage",
  ethernet: "Ethernet",
  display: "Display",
};

export function optionLabel(group: OptionGroup, value: string) {
  if (group === "display") return value === "nano_texture" ? "Nano-texture display" : "Standard display";
  if (group === "ethernet") return `${value.replace("_per_second", "").replace("_", ".").replace("gb", "")} Gb Ethernet`;
  return value.toUpperCase();
}

export const defaultPick = (v: Variant, group: OptionGroup) => v.defaults[group] ?? v.options[group]![0].value;

/** Price of a configuration in local currency, or null when that country doesn't sell it. */
export function configPrice(v: Variant, picks: Picks, country: CountryCode): number | null {
  let total = v.price[country];
  if (total == null) return null;
  for (const group of Object.keys(v.options) as OptionGroup[]) {
    const value = picks[group] ?? defaultPick(v, group);
    const delta = v.options[group]!.find((o) => o.value === value)?.delta[country];
    if (delta == null) return null;
    total += delta;
  }
  return total;
}

/** How many configurations the picker covers, for the stats row. */
export const configCount = variants.reduce(
  (sum, v) => sum + Object.values(v.options).reduce((n, opts) => n * opts.length, 1),
  0,
);

export const variantNotes: Record<string, string> = {
  "macbook-pro/14inch/m6-12-12":
    "Announced 27 Oct 2026. Pre-orders open 29 Oct across Asia and ship from 6 Nov, except Thailand, which has no date yet.",
  "iphone/iphoneair": "eSIM only, with no SIM tray.",
  "iphone/iphoneduo": "eSIM only, with no SIM tray.",
};

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
