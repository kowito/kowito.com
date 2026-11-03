"use client";

import type Safe from "@safe-global/protocol-kit";
import type { Eip1193Provider } from "@safe-global/protocol-kit";
import { useCallback } from "react";
import { isAddressEqual } from "viem";
import { useConnection, useSwitchChain } from "wagmi";
import { useSafe } from "../_components/safe-context";
import { getSignerKit } from "@/lib/safe/safe";

/** The connected wallet, as seen from the Safe currently open. */
export function useWallet() {
  const { chainId: safeChainId, safeAddress, info } = useSafe();
  const { address, chainId, connector, isConnected } = useConnection();
  const { switchChainAsync } = useSwitchChain();

  const isOwner = Boolean(address && info.owners.some((o) => isAddressEqual(o, address)));

  /** protocol-kit bound to the wallet, switching the wallet to the Safe's chain first if needed. */
  const getKit = useCallback(async (): Promise<Safe> => {
    if (!address || !connector) throw new Error("Connect a wallet first.");
    if (chainId !== safeChainId) await switchChainAsync({ chainId: safeChainId });
    const provider = (await connector.getProvider()) as Eip1193Provider;
    return getSignerKit(provider, address, safeAddress);
  }, [address, connector, chainId, safeChainId, switchChainAsync, safeAddress]);

  return { address, isConnected, isOwner, wrongChain: isConnected && chainId !== safeChainId, getKit };
}
