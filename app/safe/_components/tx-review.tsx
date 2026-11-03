"use client";

import type Safe from "@safe-global/protocol-kit";
import type { SafeTransaction } from "@safe-global/types-kit";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { Hex } from "viem";
import { Caption, display } from "@/components/comic";
import { explorerUrl } from "@/lib/safe/chains";
import { decodeAny } from "@/lib/safe/decode";
import { errorMessage } from "@/lib/safe/format";
import { computeSafeTxHashes, getOnchainSafeTxHash, getReadKit } from "@/lib/safe/safe";
import { cn } from "@/lib/utils";
import { useNextNonce } from "../_hooks/use-safe-queries";
import { type ActionState, useActionState, useTxActions } from "../_hooks/use-tx-actions";
import { useWallet } from "../_hooks/use-wallet";
import { safeHref } from "./links";
import { useSafe } from "./safe-context";
import { HashesView, TxDetails, TxWarnings } from "./tx-details";
import { TxSummary } from "./tx-summary";
import { Badge, Button, Card, Details, Field, Loading, Notice, inputClass } from "./ui";

type Props = {
  /** Builds the Safe transaction with a read-only kit for the given nonce. */
  build: (kit: Safe, nonce: number) => Promise<SafeTransaction>;
  /** Changes whenever the inputs behind `build` change. */
  buildKey: string;
  fixedNonce?: number;
  onCancel?: () => void;
  onDone?: () => void;
};

export function TxReview({ build, buildKey, fixedNonce, onCancel, onDone }: Props) {
  const { chain, chainId, safeAddress, info } = useSafe();
  const nextNonce = useNextNonce();
  const [nonceInput, setNonceInput] = useState<string>();
  const { state, run } = useActionState();
  const busy = state.status === "pending";
  const done = state.status === "success";
  // Approving refreshes the queue, which moves the next free number on. Pin the number so
  // the screen keeps showing the transaction that was actually approved (or sent).
  const [actedNonce, setActedNonce] = useState<number>();
  const pinned = busy || done ? actedNonce : undefined;
  const nonce = fixedNonce ?? pinned ?? Number(nonceInput ?? nextNonce.data ?? info.nonce);
  const nonceValid = pinned !== undefined || (Number.isInteger(nonce) && nonce >= info.nonce);

  const built = useQuery({
    queryKey: ["build", chainId, safeAddress, buildKey, nonce],
    enabled: nonceValid && (fixedNonce !== undefined || nextNonce.isSuccess),
    staleTime: Infinity,
    gcTime: 0,
    queryFn: async () => {
      const kit = await getReadKit(chain, safeAddress);
      const tx = await build(kit, nonce);
      const hashes = computeSafeTxHashes({ chainId, safeAddress, version: info.version, tx: tx.data });
      // Independent check: the Safe contract's own getTransactionHash must agree with ours.
      const onchainHash = await getOnchainSafeTxHash(chain, safeAddress, tx.data);
      return {
        tx,
        hashes,
        hashMatches: onchainHash.toLowerCase() === hashes.safeTxHash.toLowerCase(),
        decoded: decodeAny(tx.data.data as Hex),
      };
    },
  });

  const { isConnected, isOwner } = useWallet();
  const { propose, execute } = useTxActions();
  const canAct = built.data?.hashMatches && isOwner && !busy && !done;
  const canSendNow = info.threshold === 1 && nonce === info.nonce;
  const others = info.threshold - 1;

  const approve = () => {
    setActedNonce(nonce);
    return run("Check your wallet and approve the request…", async () => {
      await propose(built.data!.tx, built.data!.hashes.safeTxHash);
      onDone?.();
      return {
        status: "success",
        message:
          others > 0
            ? `Approved! Now ${others} more owner${others > 1 ? "s" : ""} need${others > 1 ? "" : "s"} to approve.`
            : "Approved! It's ready to be completed from Activity.",
      };
    });
  };

  const approveAndSend = () => {
    setActedNonce(nonce);
    return run("Check your wallet and confirm…", async (update) => {
      const hash = await execute(built.data!.tx, () => update("Sending to the network… this can take a minute."));
      onDone?.();
      return { status: "success", message: "Done! The transaction went through.", txHash: hash };
    });
  };

  return (
    <Card
      title="Check before you approve"
      actions={
        onCancel && (
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={busy}>
            {done ? "Close" : "Back"}
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-6">
        {!nonceValid && <Notice tone="danger">Transaction number must be {info.nonce} or higher.</Notice>}
        {built.isPending && nonceValid && <Loading label="Preparing transaction…" />}
        {built.error && <Notice tone="danger" title="Something went wrong">{errorMessage(built.error)}</Notice>}

        {built.data && (
          <>
            <div className="border-[3px] border-black bg-[#FFF4DC] p-5 sm:p-7">
              <Caption className="mb-4 -rotate-1">You&apos;re about to</Caption>
              <TxSummary call={{ ...built.data.tx.data, decoded: built.data.decoded }} nonce={nonce} />
            </div>

            <TxWarnings tx={{ ...built.data.tx.data, decoded: built.data.decoded }} />

            {!built.data.hashMatches && (
              <Notice tone="danger" title="Stop — don't approve this">
                This transaction&apos;s data doesn&apos;t match what the Safe contract expects. It may have been tampered with.
              </Notice>
            )}

            {built.data.hashMatches && !done && (
              <div className="flex flex-col gap-3">
                <p className={`${display} text-2xl`}>What happens next</p>
                <ol className="flex flex-col gap-3 text-lg">
                  <NextStep n={1}>You approve in your wallet. It&apos;s free — just a signature.</NextStep>
                  {others > 0 && (
                    <NextStep n={2}>
                      {others} more owner{others > 1 ? "s approve" : " approves"} from their own wallet.
                    </NextStep>
                  )}
                  <NextStep n={others > 0 ? 3 : 2}>
                    Someone completes it. That sends it to {chain.chain.name} and costs a small network fee in{" "}
                    {chain.chain.nativeCurrency.symbol}.
                  </NextStep>
                </ol>
              </div>
            )}

            {!isConnected && <Notice>Connect your wallet (top right) to approve.</Notice>}
            {isConnected && !isOwner && (
              <Notice tone="warning">The connected wallet is not an owner of this Safe, so it can&apos;t approve.</Notice>
            )}

            {!done && (
              <div className="flex flex-col gap-4 sm:flex-row">
                {canSendNow ? (
                  <>
                    <Button variant="go" size="lg" className="sm:flex-1" disabled={!canAct} loading={busy} onClick={approveAndSend}>
                      Approve and send now
                    </Button>
                    <Button variant="secondary" size="lg" disabled={!canAct} onClick={approve}>
                      Approve only
                    </Button>
                  </>
                ) : (
                  <Button variant="go" size="lg" className="w-full" disabled={!canAct} loading={busy} onClick={approve}>
                    <Check className="h-6 w-6" strokeWidth={3} /> Approve
                  </Button>
                )}
              </div>
            )}
            <ActionStatus state={state} />

            <Details summary="Technical details">
              {fixedNonce === undefined && (
                <Field
                  label="Transaction number"
                  hint={nonceHint(nonce, info.nonce, nextNonce.data)}
                  error={!nonceValid ? `Must be ${info.nonce} or higher.` : undefined}
                >
                  <input
                    className={cn(inputClass, "max-w-[12rem] font-mono")}
                    inputMode="numeric"
                    value={pinned ?? nonceInput ?? String(nextNonce.data ?? info.nonce)}
                    onChange={(e) => setNonceInput(e.target.value.replace(/\D/g, ""))}
                    disabled={busy || done}
                  />
                </Field>
              )}
              <TxDetails tx={{ ...built.data.tx.data, decoded: built.data.decoded }} />
              <HashesView
                hashes={built.data.hashes}
                verified={
                  built.data.hashMatches ? (
                    <Badge tone="success">Matches the Safe contract</Badge>
                  ) : (
                    <Badge tone="danger">Does NOT match</Badge>
                  )
                }
              />
            </Details>
          </>
        )}
      </div>
    </Card>
  );
}

function NextStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className={`${display} grid h-8 w-8 shrink-0 place-items-center border-2 border-black bg-[#FFD400] text-lg`}>{n}</span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}

function nonceHint(nonce: number, current: number, next: number | undefined): string | undefined {
  if (next === undefined || !Number.isInteger(nonce)) return undefined;
  if (nonce < next) return `#${nonce} is already used by a waiting transaction. Only one of them can go through.`;
  if (nonce > next) return `Skips ahead: #${next}–${nonce - 1} must go through first.`;
  return nonce === current ? "This will be the next transaction." : `It will go after ${nonce - current} waiting transaction(s).`;
}

export function ActionStatus({ state }: { state: ActionState }) {
  const { chain, safeAddress } = useSafe();
  if (state.status === "idle") return null;
  if (state.status === "pending") return <Notice>{state.message}</Notice>;
  if (state.status === "error") return <Notice tone="danger">{state.message}</Notice>;
  const href = state.txHash && explorerUrl(chain, "tx", state.txHash);
  return (
    <Notice tone="success" title={state.message}>
      <span className="mt-1 flex flex-wrap gap-5 font-bold">
        <Link className="inline-flex items-center gap-1.5 underline underline-offset-4" href={safeHref(chain, safeAddress, "activity")}>
          See activity <ArrowRight className="h-4 w-4" strokeWidth={3} />
        </Link>
        {href && (
          <a className="inline-flex items-center gap-1.5 underline underline-offset-4" href={href} target="_blank" rel="noreferrer">
            View on block explorer <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </a>
        )}
      </span>
    </Notice>
  );
}
