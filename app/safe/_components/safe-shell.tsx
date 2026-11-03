"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { useConnection } from "wagmi";
import { Caption, INK, buttonClass, display, lettering } from "@/components/comic";
import { explorerUrl, getChainById } from "@/lib/safe/chains";
import { shortAddress } from "@/lib/safe/format";
import { cn } from "@/lib/utils";
import { setSafeName, useSafeName } from "../_hooks/use-recent-safes";
import { countNeedingApproval, usePendingTransactions } from "../_hooks/use-safe-queries";
import { useWallet } from "../_hooks/use-wallet";
import { Avatar, CopyButton, ExplorerLink } from "./address";
import { type Tab, safeHref, safeWalletHref } from "./links";
import { useSafe } from "./safe-context";
import { Button, Notice, inputClass } from "./ui";

function SafeName() {
  const { chain, safeAddress } = useSafe();
  const name = useSafeName(chain.shortName, safeAddress);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (editing) {
    return (
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setSafeName(chain.shortName, safeAddress, draft);
          setEditing(false);
        }}
      >
        <input
          className={cn(inputClass, "max-w-xs text-2xl")}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. Company treasury"
          maxLength={40}
          autoFocus
        />
        <Button type="submit">Save</Button>
        <Button type="button" variant="link" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </form>
    );
  }
  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
      <h1
        className={`${display} -rotate-1 break-words pb-1 text-5xl leading-[0.9] md:text-6xl`}
        style={{ ...lettering(2.5, 5), color: INK.yellow }}
      >
        {name ?? "My Safe"}
      </h1>
      <Button
        variant="link"
        className="mb-1 text-base"
        onClick={() => {
          setDraft(name ?? "");
          setEditing(true);
        }}
      >
        {name ? "Rename" : "Give it a name"}
      </Button>
    </div>
  );
}

/** Tells people, in one sentence, what they can do with the wallet they connected. */
function WalletStatus() {
  const { chain } = useSafe();
  const { isConnected, isOwner, wrongChain } = useWallet();
  const { chainId } = useConnection();
  if (!isConnected) {
    return <Notice>Connect your wallet (top right) to approve or send. You can look around without it.</Notice>;
  }
  if (!isOwner) {
    return <Notice tone="warning">The connected wallet is not one of this Safe&apos;s owners. You can look, but you can&apos;t approve.</Notice>;
  }
  return (
    <Notice tone="success">
      <span className="flex items-start gap-2 font-bold">
        <Check className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={3} />
        <span>
          You&apos;re an owner of this Safe.
          {wrongChain &&
            ` Your wallet is on ${getChainById(chainId ?? 0)?.chain.name ?? "another network"} — it will be switched to ${chain.chain.name} when needed.`}
        </span>
      </span>
    </Notice>
  );
}

const TAB_LABELS: Record<Tab, string> = {
  overview: "Overview",
  send: "Send",
  activity: "Activity",
  owners: "Owners",
  advanced: "Advanced",
};

export function SafeShell({ tab, children }: { tab: Tab; children: React.ReactNode }) {
  const { chain, safeAddress, info } = useSafe();
  const pending = usePendingTransactions();
  const { address } = useWallet();
  const needsMe = countNeedingApproval(pending.data, info.owners, info.threshold, address);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <Avatar address={safeAddress} size="xl" />
          <div className="min-w-0 flex-1 space-y-3">
            <Caption className="-rotate-2">{chain.chain.name} · Safe</Caption>
            <SafeName />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-1 text-base">
          <span className="font-mono font-bold" title={safeAddress}>
            {shortAddress(safeAddress, 6)}
          </span>
          <CopyButton value={safeAddress} />
          <ExplorerLink href={explorerUrl(chain, "address", safeAddress)} />
          <a
            href={safeWalletHref(chain, safeAddress)}
            target="_blank"
            rel="noreferrer"
            className="ml-3 inline-flex items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4 hover:text-[#A855F7]"
          >
            Open in Safe{"{Wallet}"} <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
          </a>
        </div>
        <p className="text-xl">
          <strong className="bg-[#FFD400] px-1">
            {info.threshold} of {info.owners.length}
          </strong>{" "}
          owners must approve every transaction.
        </p>
        <WalletStatus />
        {(info.modules.length > 0 || info.guard) && (
          <Notice tone="warning">
            {info.modules.length > 0 && "This Safe has an add-on that can move funds without owner approvals. "}
            {info.guard && "A guard is set that can block transactions. "}
            <Link href={safeHref(chain, safeAddress, "owners")} className="font-bold underline underline-offset-4">
              Learn more
            </Link>
          </Notice>
        )}
      </section>

      <nav className="-mx-4 overflow-x-auto px-4 pb-2 pt-1">
        <div className="flex w-max gap-3">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => {
            const count = t === "activity" ? pending.data?.length : undefined;
            return (
              <Link
                key={t}
                href={safeHref(chain, safeAddress, t)}
                aria-current={t === tab ? "page" : undefined}
                className={buttonClass("md", cn(t === tab ? "-rotate-1 bg-[#FFD400]" : "bg-white"))}
              >
                {TAB_LABELS[t]}
                {count ? (
                  <span
                    className={cn(
                      "grid h-7 min-w-[1.75rem] place-items-center rounded-full border-2 border-black px-1 font-sans text-sm font-bold",
                      needsMe ? "bg-[#FF3B30] text-white" : "bg-black text-white",
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      {children}
    </div>
  );
}
