"use client";

import { useQuery } from "@tanstack/react-query";
import type { SafeMultisigTransactionResponse } from "@safe-global/types-kit";
import { type Address, getAddress } from "viem";
import { getBalances, getHistory, getPendingTransactions } from "@/lib/safe/service";
import { useSafe } from "../_components/safe-context";

export type TokenBalance = {
  /** null for the chain's native currency. */
  address: Address | null;
  symbol: string;
  name: string;
  decimals: number;
  logoUri?: string;
  balance: bigint;
};

/** Native balance is read on-chain; ERC-20 balances come from the Transaction Service index. */
export function useBalances() {
  const { chain, chainId, safeAddress, info } = useSafe();
  return useQuery({
    queryKey: ["balances", chainId, safeAddress, info.nativeBalance.toString()],
    queryFn: async () => {
      const native: TokenBalance = {
        address: null,
        symbol: chain.chain.nativeCurrency.symbol,
        name: chain.chain.nativeCurrency.name,
        decimals: chain.chain.nativeCurrency.decimals,
        balance: info.nativeBalance,
      };
      try {
        const { results } = await getBalances(chain, safeAddress);
        const tokens = results
          .filter((r) => r.tokenAddress && r.token)
          .map<TokenBalance>((r) => ({
            address: getAddress(r.tokenAddress!),
            symbol: r.token!.symbol,
            name: r.token!.name,
            decimals: r.token!.decimals,
            logoUri: r.token!.logoUri,
            balance: BigInt(r.balance),
          }))
          .filter((t) => t.balance > 0n);
        return { tokens: [native, ...tokens], error: undefined };
      } catch (error) {
        return { tokens: [native], error };
      }
    },
    // The key moves with the native balance; keep showing the old list while the new one loads.
    placeholderData: (prev) => prev,
  });
}

export function usePendingTransactions() {
  const { chain, chainId, safeAddress, info } = useSafe();
  return useQuery({
    queryKey: ["pending", chainId, safeAddress, info.nonce],
    queryFn: async () => {
      const res = await getPendingTransactions(chain, safeAddress, info.nonce);
      return [...res.results].sort(
        (a, b) => Number(a.nonce) - Number(b.nonce) || a.submissionDate.localeCompare(b.submissionDate),
      );
    },
    refetchInterval: 20_000,
  });
}

/** Pending transactions grouped by nonce; more than one per nonce means they conflict. */
export function groupByNonce(txs: SafeMultisigTransactionResponse[]) {
  const groups = new Map<number, SafeMultisigTransactionResponse[]>();
  for (const tx of txs) {
    const nonce = Number(tx.nonce);
    groups.set(nonce, [...(groups.get(nonce) ?? []), tx]);
  }
  return [...groups.entries()].sort(([a], [b]) => a - b);
}

export function useHistory(limit: number) {
  const { chain, chainId, safeAddress } = useSafe();
  return useQuery({
    queryKey: ["history", chainId, safeAddress, limit],
    queryFn: () => getHistory(chain, safeAddress, limit),
    placeholderData: (prev) => prev,
  });
}

/** Next free nonce: one past the highest queued transaction, or the on-chain nonce if nothing is queued. */
export function useNextNonce() {
  const { info } = useSafe();
  const pending = usePendingTransactions();
  const highest = pending.data?.reduce((max, tx) => Math.max(max, Number(tx.nonce)), -1) ?? -1;
  return {
    data: pending.isPending ? undefined : Math.max(highest + 1, info.nonce),
    // If the service is unreachable, fall back to the on-chain nonce rather than blocking.
    isSuccess: !pending.isPending,
  };
}

/** How many waiting transactions still need approvals and `me` (an owner) hasn't approved yet. */
export function countNeedingApproval(
  txs: SafeMultisigTransactionResponse[] | undefined,
  owners: Address[],
  threshold: number,
  me: Address | undefined,
): number {
  if (!txs || !me || !owners.some((o) => o.toLowerCase() === me.toLowerCase())) return 0;
  return txs.filter((tx) => {
    const confirmations = tx.confirmations ?? [];
    return confirmations.length < threshold && !confirmations.some((c) => c.owner.toLowerCase() === me.toLowerCase());
  }).length;
}
