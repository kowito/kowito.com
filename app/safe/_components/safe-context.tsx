"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect } from "react";
import { type Address, getAddress } from "viem";
import type { ChainConfig } from "@/lib/safe/chains";
import { errorMessage } from "@/lib/safe/format";
import { getReadKit } from "@/lib/safe/safe";
import { rememberSafe } from "../_hooks/use-recent-safes";
import { Button, Card, Loading } from "./ui";

export type SafeInfo = {
  owners: Address[];
  threshold: number;
  /** On-chain nonce: the next transaction to execute must use it. */
  nonce: number;
  version: string;
  modules: Address[];
  guard?: Address;
  fallbackHandler?: Address;
  nativeBalance: bigint;
};

type SafeContextValue = {
  chain: ChainConfig;
  chainId: number;
  safeAddress: Address;
  info: SafeInfo;
  /** Refetch everything cached for this Safe (info, balances, queue, history). */
  refresh: () => Promise<void>;
};

const SafeContext = createContext<SafeContextValue | null>(null);

export function useSafe(): SafeContextValue {
  const ctx = useContext(SafeContext);
  if (!ctx) throw new Error("useSafe must be used inside <SafeProvider>");
  return ctx;
}

const ZERO = "0x0000000000000000000000000000000000000000";

async function optional<T>(promise: Promise<T>): Promise<T | undefined> {
  // Older Safe versions don't expose guards/fallback handlers; treat as unset.
  return promise.catch(() => undefined);
}

/** Reads the Safe from chain (not from Safe's servers) and shares it with everything below. */
export function SafeProvider({ chain, safeAddress, children }: { chain: ChainConfig; safeAddress: Address; children: React.ReactNode }) {
  const chainId = chain.chain.id;
  const queryClient = useQueryClient();

  const info = useQuery({
    queryKey: ["safe-info", chainId, safeAddress],
    queryFn: async (): Promise<SafeInfo> => {
      const kit = await getReadKit(chain, safeAddress);
      const [owners, threshold, nonce, modules, guard, fallbackHandler, nativeBalance] = await Promise.all([
        kit.getOwners(),
        kit.getThreshold(),
        kit.getNonce(),
        optional(kit.getModules()),
        optional(kit.getGuard()),
        optional(kit.getFallbackHandler()),
        kit.getBalance(),
      ]);
      return {
        owners: owners.map((o) => getAddress(o)),
        threshold,
        nonce,
        version: kit.getContractVersion(),
        modules: (modules ?? []).map((m) => getAddress(m)),
        guard: guard && guard !== ZERO ? getAddress(guard) : undefined,
        fallbackHandler: fallbackHandler && fallbackHandler !== ZERO ? getAddress(fallbackHandler) : undefined,
        nativeBalance,
      };
    },
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      // Not "build": a transaction under review stays exactly as it was approved.
      predicate: (q) => q.queryKey[0] !== "build" && q.queryKey[1] === chainId && q.queryKey[2] === safeAddress,
    });
  }, [queryClient, chainId, safeAddress]);

  const loaded = Boolean(info.data);
  useEffect(() => {
    if (loaded) rememberSafe(chain.shortName, safeAddress);
  }, [loaded, chain.shortName, safeAddress]);

  if (info.isPending) return <Loading label="Reading your Safe from the blockchain…" />;
  if (info.error) {
    return (
      <Card title="Couldn't open this Safe" color="#FFF4DC">
        <p className="text-lg">
          There&apos;s no Safe at <span className="break-all font-mono font-bold">{safeAddress}</span> on {chain.chain.name}, or
          the network didn&apos;t answer.
        </p>
        <p className="mt-2 text-base text-neutral-700">{errorMessage(info.error)}</p>
        <Button variant="secondary" className="mt-5" loading={info.isFetching} onClick={() => info.refetch()}>
          Try again
        </Button>
      </Card>
    );
  }

  return (
    <SafeContext.Provider value={{ chain, chainId, safeAddress, info: info.data, refresh }}>{children}</SafeContext.Provider>
  );
}
