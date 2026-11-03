"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import type { ChainConfig } from "@/lib/safe/chains";
import { getPublicClient } from "@/lib/safe/chain-client";
import { ERC20_ABI } from "@/lib/safe/decode";

export type TokenMeta = { symbol: string; decimals: number };

/** Symbol and decimals read on-chain, so token amounts can be shown as "100 USDC". */
export function useTokenMeta(chain: ChainConfig, token: Address | undefined) {
  return useQuery({
    queryKey: ["token-meta", chain.chain.id, token],
    enabled: Boolean(token),
    staleTime: Infinity,
    queryFn: async (): Promise<TokenMeta | null> => {
      const client = getPublicClient(chain);
      try {
        const [symbol, decimals] = await Promise.all([
          client.readContract({ address: token!, abi: ERC20_ABI, functionName: "symbol" }),
          client.readContract({ address: token!, abi: ERC20_ABI, functionName: "decimals" }),
        ]);
        return { symbol, decimals };
      } catch {
        // Not an ERC-20, or a non-standard one (e.g. bytes32 symbol).
        return null;
      }
    },
  });
}
