#!/usr/bin/env node
// Pulls every MacBook Pro, Mac mini and iPhone configuration price from Apple's own online stores
// and writes app/apple-prices/prices.json for the /apple-prices page.
//
//   node scripts/fetch-apple-prices.mjs
//
// Macs: the buy page embeds the base price of every chip variant; memory, storage and Ethernet
// upgrade prices come from the store's own update-config endpoint. iPhones: the buy page embeds
// the price of every storage tier. Prices are tax-inclusive list prices in local currency.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../app/apple-prices/prices.json");

const STORES = {
  TH: "https://www.apple.com/th",
  JP: "https://www.apple.com/jp",
  SG: "https://www.apple.com/sg",
  HK: "https://www.apple.com/hk",
  TW: "https://www.apple.com/tw",
  CN: "https://www.apple.com.cn",
};

const MAC_PAGES = {
  "macbook-pro": { path: "/shop/buy-mac/macbook-pro", groups: ["memory-dimensionMemory", "storage-dimensionCapacity"] },
  "mac-mini": {
    path: "/shop/buy-mac/mac-mini",
    groups: ["memory-dimensionMemory", "storage-dimensionCapacity", "ethernet_adapter-ethernetBandwidth"],
  },
};

const IPHONE_PAGES = ["iphone-17e", "iphone-17", "iphone-air", "iphone-18-pro", "iphone-duo"];

const GROUP_NAMES = {
  "memory-dimensionMemory": "memory",
  "storage-dimensionCapacity": "storage",
  "ethernet_adapter-ethernetBandwidth": "ethernet",
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, json = false) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: json ? "application/json" : "text/html" } });
    if (res.ok) return json ? res.json() : res.text();
    if (attempt === 3) throw new Error(`${res.status} ${url}`);
    await sleep(2000 * attempt);
  }
}

/** Parses the JSON value that starts at `from`, honouring strings so braces inside them don't count. */
function readJson(text, from) {
  let depth = 0;
  let inString = false;
  for (let i = from; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") {
      if (--depth === 0) return JSON.parse(text.slice(from, i + 1));
    }
  }
  throw new Error("Unterminated JSON");
}

function productSelection(html, url) {
  const boot = html.indexOf("window.PRODUCT_SELECTION_BOOTSTRAP");
  const key = html.indexOf("productSelectionData:", boot);
  if (boot < 0 || key < 0) throw new Error(`No product data on ${url}`);
  return readJson(html, html.indexOf("{", key));
}

/** "4500_00" style keys point into the response's price table. */
const deltaAmount = (prices, key) => (key === "0_0" ? 0 : prices[key]?.amount);

async function fetchMacs(country, base, device) {
  const { path, groups } = MAC_PAGES[device];
  const url = base + path;
  const html = await get(url);
  const data = productSelection(html, url);
  const updateUrl = html.match(/updateConfigUrl:\s*'([^']+)'/)?.[1];
  if (!updateUrl) throw new Error(`No update-config URL on ${url}`);
  const prices = data.mainDisplayValues.prices;

  // One entry per screen size + chip; colour never changes the price, so keep the first seen.
  const variants = new Map();
  for (const product of data.products) {
    const dims = product.dimensions;
    if (dims["display-dimensionFinish"] === "nano_texture") continue;
    const id = [dims["chassis-dimensionScreensize"], dims["processor-dimensionChip-cpuCoreCount-gpuCoreCount"]]
      .filter(Boolean)
      .join("/");
    if (!variants.has(id)) variants.set(id, product);
  }

  const out = [];
  for (const [id, product] of variants) {
    const dims = product.dimensions;
    const price = prices[product.priceKey]?.amount;
    if (price == null) throw new Error(`No price for ${product.priceKey} in ${country}`);

    const query = new URLSearchParams(Object.entries(dims).map(([k, v]) => [`sv.${k}`, v]));
    query.set("sections", groups.join(","));
    const body = (await get(`${new URL(updateUrl, base)}&${query}`, true)).body;
    await sleep(300);

    const options = {};
    for (const group of groups) {
      const compatible = body.options?.[group]?.compatibleOptions;
      if (!compatible) continue;
      options[GROUP_NAMES[group]] = Object.entries(compatible).map(([value, o]) => ({
        value,
        isDefault: Boolean(o.isDefault),
        delta: deltaAmount(body.prices, o.priceDelta),
      }));
    }
    if (device === "macbook-pro") {
      const nano = prices[product.priceKey.replace("-standard-", "-nano_texture-")]?.amount;
      options.display = [
        { value: "standard", isDefault: true, delta: 0 },
        ...(nano != null ? [{ value: "nano_texture", isDefault: false, delta: nano - price }] : []),
      ];
    }
    const selected = body.selectedKits?.dimensions ?? {};
    out.push({
      id: `${device}/${id}`,
      device,
      size: dims["chassis-dimensionScreensize"],
      chip: dims["processor-dimensionChip-cpuCoreCount-gpuCoreCount"],
      price,
      defaults: Object.fromEntries(groups.map((g) => [GROUP_NAMES[g], selected[g]?.dimensionValue])),
      options,
    });
  }
  return out;
}

async function fetchIphones(country, base) {
  const out = [];
  for (const page of IPHONE_PAGES) {
    const url = `${base}/shop/buy-iphone/${page}`;
    const data = productSelection(await get(url), url);
    await sleep(300);
    const byModel = new Map();
    for (const product of data.products) {
      const amount = data.displayValues.prices[product.fullPrice]?.amountBeforeTradeIn;
      if (amount == null) continue;
      const tiers = byModel.get(product.familyType) ?? new Map();
      tiers.set(product.dimensionCapacity, amount);
      byModel.set(product.familyType, tiers);
    }
    for (const [model, tiers] of byModel) {
      const sorted = [...tiers].sort((a, b) => a[1] - b[1]);
      const price = sorted[0][1];
      out.push({
        id: `iphone/${model}`,
        device: "iphone",
        chip: model,
        price,
        defaults: { storage: sorted[0][0] },
        options: { storage: sorted.map(([value, amount]) => ({ value, isDefault: amount === price, delta: amount - price })) },
      });
    }
  }
  return out;
}

/** Folds one store's variants into the shared list, keyed by variant id, with per-country prices. */
function merge(all, country, variants) {
  for (const v of variants) {
    const into = all.get(v.id) ?? { ...v, price: {}, options: {} };
    into.price[country] = v.price;
    if (!into.defaults || Object.values(into.defaults).some((d) => d == null)) into.defaults = v.defaults;
    for (const [group, opts] of Object.entries(v.options)) {
      const list = (into.options[group] ??= []);
      for (const o of opts) {
        let entry = list.find((e) => e.value === o.value);
        if (!entry) list.push((entry = { value: o.value, delta: {} }));
        if (o.delta != null) entry.delta[country] = o.delta;
      }
    }
    all.set(v.id, into);
  }
}

const all = new Map();
for (const [country, base] of Object.entries(STORES)) {
  process.stdout.write(`${country} `);
  merge(all, country, await fetchMacs(country, base, "macbook-pro"));
  merge(all, country, await fetchMacs(country, base, "mac-mini"));
  merge(all, country, await fetchIphones(country, base));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(OUT, `${JSON.stringify({ fetched: today, variants: [...all.values()] }, null, 2)}\n`);
console.log(`\nWrote ${all.size} variants to ${OUT}`);
