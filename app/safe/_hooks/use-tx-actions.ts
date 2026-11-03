"use client";

import type { SafeMultisigTransactionResponse, SafeTransaction } from "@safe-global/types-kit";
import { useCallback, useState } from "react";
import { type Hex, isAddressEqual, toEventSelector } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import { errorMessage } from "@/lib/safe/format";
import { toExecutableTransaction } from "@/lib/safe/safe";
import { confirmTransaction, proposeTransaction } from "@/lib/safe/service";
import { wagmiConfig } from "@/lib/safe/wagmi";
import { useSafe } from "../_components/safe-context";
import { useWallet } from "./use-wallet";

// Matched by topic rather than decoded: Safe 1.5.0 made txHash indexed, which changes the
// event's layout (so a decoder for older Safes silently skips it) but not its topic.
const EXECUTION_FAILURE = toEventSelector("event ExecutionFailure(bytes32 txHash, uint256 payment)");

export type ActionState =
  | { status: "idle" }
  | { status: "pending"; message: string }
  | { status: "success"; message: string; txHash?: Hex }
  | { status: "error"; message: string };

/** Runs one async wallet action at a time and tracks its progress for display. */
export function useActionState() {
  const [state, setState] = useState<ActionState>({ status: "idle" });
  const run = useCallback(
    async (pendingMessage: string, fn: (update: (message: string) => void) => Promise<ActionState | void>) => {
      setState({ status: "pending", message: pendingMessage });
      try {
        const result = await fn((message) => setState({ status: "pending", message }));
        setState(result ?? { status: "idle" });
      } catch (error) {
        setState({ status: "error", message: errorMessage(error) });
      }
    },
    [],
  );
  return { state, run, reset: () => setState({ status: "idle" }) };
}

export function useTxActions() {
  const { chain, chainId, safeAddress, refresh } = useSafe();
  const { address, getKit } = useWallet();

  /** Signs with the connected owner and submits the transaction to the service queue. */
  const propose = useCallback(
    async (tx: SafeTransaction, safeTxHash: Hex) => {
      const kit = await getKit();
      const signed = await kit.signTransaction(tx);
      const signature = signed.getSignature(address!);
      if (!signature) throw new Error("Wallet did not return a signature.");
      await proposeTransaction(chain, {
        safe: safeAddress,
        data: signed.data,
        safeTxHash,
        sender: address!,
        signature: signature.data,
      });
      await refresh();
    },
    [getKit, address, chain, safeAddress, refresh],
  );

  /** Adds the connected owner's signature to a queued transaction. */
  const confirm = useCallback(
    async (tx: SafeMultisigTransactionResponse) => {
      const kit = await getKit();
      const signed = await kit.signTransaction(tx);
      const signature = signed.getSignature(address!);
      if (!signature) throw new Error("Wallet did not return a signature.");
      await confirmTransaction(chain, tx.safeTxHash, signature.data);
      await refresh();
    },
    [getKit, address, chain, refresh],
  );

  /**
   * Executes on-chain. A queued transaction is signed with exactly its `confirmations`, so pass
   * only the ones that still count. If the connected owner hasn't signed, protocol-kit counts
   * them as an approver because they are msg.sender.
   */
  const execute = useCallback(
    async (tx: SafeTransaction | SafeMultisigTransactionResponse, onSubmitted?: (hash: Hex) => void) => {
      const kit = await getKit();
      const result = await kit.executeTransaction("safeTxHash" in tx ? await toExecutableTransaction(kit, tx) : tx);
      const hash = result.hash as Hex;
      onSubmitted?.(hash);
      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash, chainId });
      await refresh();
      if (receipt.status !== "success") throw new Error(`Transaction ${hash} reverted.`);
      if (receipt.logs.some((log) => isAddressEqual(log.address, safeAddress) && log.topics[0] === EXECUTION_FAILURE)) {
        throw new Error(`Transaction ${hash} was mined, but the Safe reported ExecutionFailure (the inner call failed).`);
      }
      return hash;
    },
    [getKit, chainId, safeAddress, refresh],
  );

  return { propose, confirm, execute };
}
