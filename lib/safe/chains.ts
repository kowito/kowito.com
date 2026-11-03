import type { Chain } from "viem";
import { arbitrum, base, bsc, mainnet, optimism, polygon, sepolia } from "viem/chains";

export type ChainConfig = {
  /** EIP-3770 prefix used in Safe links (?safe=eth:0x…), the same one the Safe{Wallet} app uses. */
  shortName: string;
  /** Other prefixes accepted when people paste a link. */
  aliases?: string[];
  /** Safe Transaction Service slug, when it differs from shortName. */
  serviceSlug?: string;
  chain: Chain;
  /** RPCs tried in order. Public ones must allow browser (CORS) requests and work without a key. */
  rpcUrls: string[];
};

/** NEXT_PUBLIC_RPC_<chainId> first, when set at build time, then the public fallbacks. */
function rpcs(custom: string | undefined, ...fallbacks: string[]): string[] {
  return custom ? [custom, ...fallbacks] : fallbacks;
}

// To add a chain: import it from viem/chains, add an entry here, and add its slug to
// SLUGS in functions/api/safe-tx. NEXT_PUBLIC_* vars must be referenced literally so Next can inline them.
// viem's own defaults for BNB and Sepolia are rate-limited public endpoints, so every chain lists a fallback.
export const CHAINS: ChainConfig[] = [
  {
    shortName: "eth",
    chain: mainnet,
    rpcUrls: rpcs(process.env.NEXT_PUBLIC_RPC_1, "https://ethereum-rpc.publicnode.com", "https://eth.drpc.org", "https://1rpc.io/eth"),
  },
  {
    shortName: "base",
    chain: base,
    rpcUrls: rpcs(process.env.NEXT_PUBLIC_RPC_8453, "https://mainnet.base.org", "https://base-rpc.publicnode.com"),
  },
  {
    shortName: "arb1",
    chain: arbitrum,
    rpcUrls: rpcs(process.env.NEXT_PUBLIC_RPC_42161, "https://arb1.arbitrum.io/rpc", "https://arbitrum-one-rpc.publicnode.com"),
  },
  {
    shortName: "oeth",
    chain: optimism,
    rpcUrls: rpcs(process.env.NEXT_PUBLIC_RPC_10, "https://mainnet.optimism.io", "https://optimism-rpc.publicnode.com"),
  },
  {
    // Safe{Wallet} still links Polygon Safes as matic:0x…, while the Transaction Service calls it pol.
    shortName: "matic",
    aliases: ["pol"],
    serviceSlug: "pol",
    chain: polygon,
    rpcUrls: rpcs(process.env.NEXT_PUBLIC_RPC_137, "https://polygon-bor-rpc.publicnode.com", "https://polygon.drpc.org"),
  },
  {
    shortName: "bnb",
    aliases: ["bsc"],
    chain: bsc,
    rpcUrls: rpcs(process.env.NEXT_PUBLIC_RPC_56, "https://bsc-dataseed.bnbchain.org", "https://bsc-rpc.publicnode.com"),
  },
  {
    shortName: "sep",
    chain: sepolia,
    rpcUrls: rpcs(process.env.NEXT_PUBLIC_RPC_11155111, "https://ethereum-sepolia-rpc.publicnode.com", "https://11155111.rpc.thirdweb.com"),
  },
];

export function getChainByShortName(shortName: string): ChainConfig | undefined {
  const name = shortName.toLowerCase();
  return CHAINS.find((c) => c.shortName === name || c.aliases?.includes(name));
}

export function getChainById(chainId: number): ChainConfig | undefined {
  return CHAINS.find((c) => c.chain.id === chainId);
}

export function serviceSlugOf(config: ChainConfig): string {
  return config.serviceSlug ?? config.shortName;
}

export function explorerUrl(config: ChainConfig, kind: "address" | "tx", value: string): string | undefined {
  const base = config.chain.blockExplorers?.default.url;
  return base ? `${base}/${kind}/${value}` : undefined;
}
