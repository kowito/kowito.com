import { type Address, getAddress } from "viem";
import { type ChainConfig, getChainByShortName } from "@/lib/safe/chains";

/*
 * The whole app is one static page, so where you are lives in the query string:
 * /safe?safe=eth:0x…&tab=send — the same "eth:0x…" form the official Safe app uses.
 */

export const TABS = ["overview", "send", "activity", "owners", "advanced"] as const;
export type Tab = (typeof TABS)[number];

export function safeHref(chain: ChainConfig | string, address: string, tab: Tab = "overview", extra?: Record<string, string>) {
  const shortName = typeof chain === "string" ? chain : chain.shortName;
  const params = new URLSearchParams({ safe: `${shortName}:${address}` });
  if (tab !== "overview") params.set("tab", tab);
  for (const [key, value] of Object.entries(extra ?? {})) params.set(key, value);
  // Keep the colon readable in the address bar.
  return `/safe?${params.toString().replace("%3A", ":")}`;
}

/** The same Safe in the official Safe{Wallet} app, for a second opinion. */
export function safeWalletHref(chain: ChainConfig, address: string) {
  return `https://app.safe.global/home?safe=${chain.shortName}:${address}`;
}

export type ParsedSafeParam =
  | { ok: true; chain: ChainConfig; address: Address }
  /** A bare address: the Safe could be on any network. */
  | { ok: false; reason: "no-network"; address: Address }
  | { ok: false; reason: "unknown-network"; prefix: string }
  | { ok: false; reason: "bad-address" };

/**
 * Finds the Safe in whatever people paste or link to: "eth:0x…", a bare "0x…", or a whole
 * link from this page or the Safe{Wallet} app, like https://app.safe.global/home?safe=eth:0x….
 */
export function parseSafeParam(raw: string): ParsedSafeParam {
  let text = raw.trim();
  try {
    text = decodeURIComponent(text);
  } catch {
    // Not URI-encoded; use as is.
  }
  const prefixed = text.match(/([a-z][a-z0-9-]*):(0x[0-9a-f]{40})(?![0-9a-f])/i);
  if (prefixed) {
    const chain = getChainByShortName(prefixed[1]);
    return chain ? { ok: true, chain, address: getAddress(prefixed[2]) } : { ok: false, reason: "unknown-network", prefix: prefixed[1] };
  }
  // A 64-character transaction hash also starts with 0x, so the address must stand on its own.
  const bare = text.match(/(?<![0-9a-z])0x[0-9a-f]{40}(?![0-9a-f])/i);
  return bare ? { ok: false, reason: "no-network", address: getAddress(bare[0]) } : { ok: false, reason: "bad-address" };
}
