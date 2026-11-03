"use client";

import type { SafeMultisigTransactionResponse } from "@safe-global/types-kit";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { type Address, type Hex, isAddressEqual, zeroAddress } from "viem";
import { Panel } from "@/components/comic";
import { explorerUrl } from "@/lib/safe/chains";
import { decodeAny } from "@/lib/safe/decode";
import { errorMessage, formatDate } from "@/lib/safe/format";
import { checkConfirmation, computeSafeTxHashes } from "@/lib/safe/safe";
import { cn } from "@/lib/utils";
import { type ActionState, useActionState, useTxActions } from "../_hooks/use-tx-actions";
import { useWallet } from "../_hooks/use-wallet";
import { useSafe } from "./safe-context";
import { HashesView, TxDetails, TxWarnings, isRejection } from "./tx-details";
import { ActionStatus, TxReview } from "./tx-review";
import { TxSummary, TxTitle, Who } from "./tx-summary";
import { Badge, Button, Details, Notice, type Tone } from "./ui";

function useTxFields(tx: SafeMultisigTransactionResponse) {
  const { chainId, safeAddress, info } = useSafe();
  const nonce = Number(tx.nonce);
  const fields = useMemo(
    () => ({
      to: tx.to,
      value: tx.value,
      data: (tx.data ?? "0x") as Hex,
      operation: tx.operation,
      safeTxGas: tx.safeTxGas,
      baseGas: tx.baseGas,
      gasPrice: tx.gasPrice,
      gasToken: tx.gasToken,
      refundReceiver: tx.refundReceiver ?? zeroAddress,
      nonce,
      decoded: decodeAny(tx.data as Hex | null, tx.dataDecoded),
    }),
    [tx, nonce],
  );
  // Recompute the hash from the transaction fields instead of trusting the service.
  const hashes = useMemo(
    () => computeSafeTxHashes({ chainId, safeAddress, version: info.version, tx: fields }),
    [chainId, safeAddress, info.version, fields],
  );
  return { nonce, fields, hashes, hashOk: hashes.safeTxHash.toLowerCase() === tx.safeTxHash.toLowerCase() };
}

function TechnicalDetails({ tx }: { tx: SafeMultisigTransactionResponse }) {
  const { fields, hashes, hashOk } = useTxFields(tx);
  return (
    <Details summary="Technical details">
      <TxDetails tx={fields} />
      <HashesView hashes={hashes} verified={hashOk ? <Badge tone="success">Checked</Badge> : <Badge tone="danger">Mismatch</Badge>} />
    </Details>
  );
}

function ApprovalBar({ count, threshold }: { count: number; threshold: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1.5">
        {Array.from({ length: threshold }, (_, i) => (
          <span key={i} className={cn("h-4 flex-1 border-2 border-black", i < count ? "bg-[#2DD881]" : "bg-white")} />
        ))}
      </div>
      <span className="text-lg font-bold tabular-nums">
        {Math.min(count, threshold)} of {threshold}
      </span>
    </div>
  );
}

/**
 * A transaction waiting for approvals, with the one next step that makes sense for the viewer.
 * `cancelled`: a cancellation with the same number is already waiting, so another isn't offered.
 * `onSent`: the outcome once it went to the network. The card leaves the queue as soon as the
 * Safe refreshes, so the list above it has to be the one to show how it went.
 */
export function PendingTxCard({
  tx,
  conflicting,
  cancelled,
  onSent,
}: {
  tx: SafeMultisigTransactionResponse;
  conflicting?: boolean;
  cancelled?: boolean;
  onSent?: (outcome: ActionState) => void;
}) {
  const { chain, chainId, safeAddress, info } = useSafe();
  const { nonce, fields, hashes, hashOk } = useTxFields(tx);
  const [cancelling, setCancelling] = useState(false);

  const confirmations = tx.confirmations ?? [];
  const checks = useQuery({
    queryKey: ["confirmation-checks", chainId, safeAddress, tx.safeTxHash, confirmations.length, info.owners.join()],
    queryFn: () => Promise.all(confirmations.map((c) => checkConfirmation(c, hashes.safeTxHash, info.owners))),
    enabled: hashOk,
    staleTime: Infinity,
  });
  // Approvals that count: a valid signature from someone who is still an owner. Only these are
  // sent when completing, since one bad signature makes the Safe reject the whole transaction.
  const valid = confirmations.filter((_, i) => checks.data?.[i]?.isCurrentOwner && checks.data[i].validSignature !== false);
  const invalidCount = checks.data ? confirmations.length - valid.length : 0;

  const { address, isConnected, isOwner } = useWallet();
  const { confirm, execute } = useTxActions();
  const { state, run } = useActionState();
  const busy = state.status === "pending";

  const iApproved = Boolean(address && confirmations.some((c) => isAddressEqual(c.owner as Address, address)));
  const isNext = nonce === info.nonce;
  const enough = valid.length >= info.threshold;
  const lastApprovalIsMine = isOwner && !iApproved && valid.length === info.threshold - 1;
  const needsMe = isOwner && !iApproved;
  const missing = Math.max(info.threshold - valid.length, 0);
  const ready = hashOk && checks.isSuccess;

  const status: { tone: Tone; text: string } = !hashOk
    ? { tone: "danger", text: "Don't approve" }
    : enough
      ? isNext
        ? { tone: "success", text: "Ready to complete" }
        : { tone: "accent", text: "Approved" }
      : needsMe
        ? { tone: "warning", text: "Needs your approval" }
        : { tone: "neutral", text: "Waiting for others" };

  const doApprove = () =>
    run("Check your wallet and approve the request…", async () => {
      await confirm(tx);
      return { status: "success", message: "Approved!" };
    });
  const doComplete = () =>
    run("Check your wallet and confirm…", async (update) => {
      let sent = false;
      try {
        const hash = await execute({ ...tx, confirmations: valid }, () => {
          sent = true;
          update("Sending to the network… this can take a minute.");
        });
        const outcome = { status: "success", message: `Done! Transaction #${nonce} went through.`, txHash: hash } as const;
        onSent?.(outcome);
        return outcome;
      } catch (error) {
        if (sent) onSent?.({ status: "error", message: errorMessage(error) });
        throw error;
      }
    });

  return (
    <Panel className="flex flex-col gap-6 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone={status.tone}>{status.text}</Badge>
        <span className="text-sm font-bold text-neutral-700">
          #{nonce} · {formatDate(tx.submissionDate)}
        </span>
      </div>

      <TxSummary call={fields} nonce={nonce} size="md" />

      {!hashOk && (
        <Notice tone="danger" title="Stop — don't approve or complete this">
          The details we received don&apos;t match the transaction itself. It may have been tampered with.
        </Notice>
      )}
      <TxWarnings tx={fields} />
      {conflicting && (
        <Notice tone="warning">
          Another waiting transaction also has #{nonce}. Only one of them can go through — the other will be dropped.
        </Notice>
      )}

      {hashOk && (
        <div className="flex flex-col gap-3 border-2 border-black bg-[#FFF4DC] p-4">
          <p className="text-lg font-bold">Approvals</p>
          <ApprovalBar count={valid.length} threshold={info.threshold} />
          <ul className="mt-1 flex flex-col gap-2">
            {info.owners.map((owner) => {
              const approved = confirmations.some((c) => isAddressEqual(c.owner as Address, owner));
              return (
                <li key={owner} className={cn("flex flex-wrap items-center justify-between gap-x-3 gap-y-1", !approved && "opacity-60")}>
                  <Who address={owner} plain inOwnerList />
                  <span className={cn("flex items-center gap-1 text-base font-bold", approved ? "text-[#139A55]" : "text-neutral-600")}>
                    {approved ? (
                      <>
                        <Check className="h-4 w-4" strokeWidth={3} /> Approved
                      </>
                    ) : (
                      "Not yet"
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          {invalidCount > 0 && (
            <p className="text-sm font-bold text-[#E5221A]">
              {invalidCount} approval{invalidCount > 1 ? "s are" : " is"} not valid (wrong signature or no longer an owner) and
              won&apos;t count.
            </p>
          )}
        </div>
      )}

      {hashOk && (
        <div className="flex flex-col gap-3">
          {isNext && enough && (
            <>
              <Button variant="go" size="lg" className="w-full" disabled={!isConnected || !ready || busy} loading={busy} onClick={doComplete}>
                Complete transaction
              </Button>
              <p className="text-center text-base text-neutral-700">
                {isConnected
                  ? `Sends it to ${chain.chain.name}. Costs a small network fee in ${chain.chain.nativeCurrency.symbol}.`
                  : "Connect your wallet (top right) to complete it. Anyone can — you don't need to be an owner."}
              </p>
            </>
          )}
          {!enough && needsMe && (
            <div className="flex flex-col gap-4 sm:flex-row">
              {isNext && lastApprovalIsMine ? (
                <>
                  <Button variant="go" size="lg" className="sm:flex-1" disabled={!ready || busy} loading={busy} onClick={doComplete}>
                    Approve and complete
                  </Button>
                  <Button variant="secondary" size="lg" disabled={!ready || busy} onClick={doApprove}>
                    Approve only
                  </Button>
                </>
              ) : (
                <Button variant="go" size="lg" className="w-full" disabled={!ready || busy} loading={busy} onClick={doApprove}>
                  <Check className="h-6 w-6" strokeWidth={3} /> Approve
                </Button>
              )}
            </div>
          )}
          {!enough && !needsMe && (
            <p className="text-lg">
              {!isConnected
                ? "Connect your wallet (top right) to approve."
                : !isOwner
                  ? "Only owners of this Safe can approve."
                  : `You approved. Waiting for ${missing} more owner${missing > 1 ? "s" : ""}.`}
            </p>
          )}
          {enough && !isNext && (
            <p className="text-lg">Fully approved. It can be completed after transaction #{info.nonce} goes through.</p>
          )}
          <ActionStatus state={state} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <TechnicalDetails tx={tx} />
        {isOwner && !isRejection(fields, safeAddress) && !cancelled && !cancelling && (
          <Button variant="link" className="self-start text-[#E5221A]" onClick={() => setCancelling(true)}>
            <X className="h-4 w-4" strokeWidth={3} /> Cancel this transaction
          </Button>
        )}
      </div>

      {cancelling && (
        <div className="flex flex-col gap-4">
          <Notice>
            To cancel, owners approve an empty transaction with the same number (#{nonce}). Once it goes through, this one can never
            happen.
          </Notice>
          <TxReview
            fixedNonce={nonce}
            buildKey={`reject-${nonce}`}
            build={(kit, n) => kit.createRejectionTransaction(n)}
            onCancel={() => setCancelling(false)}
          />
        </div>
      )}
    </Panel>
  );
}

/** A finished transaction: one compact row that expands. */
export function HistoryRow({ tx }: { tx: SafeMultisigTransactionResponse }) {
  const { chain } = useSafe();
  const { nonce, fields } = useTxFields(tx);
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("border-2 border-black bg-white transition", open && "shadow-[4px_4px_0_0_#000]")}>
      <button className="flex w-full items-center gap-4 px-3 py-3 text-left hover:bg-[#FFF4DC] sm:px-4" onClick={() => setOpen((v) => !v)}>
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center border-2 border-black",
            tx.isSuccessful ? "bg-[#2DD881]" : "bg-[#FF3B30] text-white",
          )}
        >
          {tx.isSuccessful ? <Check className="h-5 w-5" strokeWidth={3} /> : <X className="h-5 w-5" strokeWidth={3} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-lg font-bold">
            <TxTitle call={fields} nonce={nonce} />
          </span>
          <span className="block truncate text-sm text-neutral-700">
            {tx.isSuccessful ? "Completed" : "Failed"} · {formatDate(tx.executionDate)}
          </span>
        </span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 transition", open && "rotate-180")} strokeWidth={3} />
      </button>
      {open && (
        <div className="flex flex-col gap-5 border-t-2 border-black p-4 sm:p-6">
          <TxSummary call={fields} nonce={nonce} size="md" />
          {tx.transactionHash && (
            <a
              className="inline-flex items-center gap-2 self-start text-base font-bold underline underline-offset-4"
              href={explorerUrl(chain, "tx", tx.transactionHash)}
              target="_blank"
              rel="noreferrer"
            >
              View on block explorer <ArrowRight className="h-4 w-4" strokeWidth={3} />
            </a>
          )}
          <TechnicalDetails tx={tx} />
        </div>
      )}
    </div>
  );
}
