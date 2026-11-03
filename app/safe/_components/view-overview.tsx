"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClass, display, hardShadow, ink, press } from "@/components/comic";
import { errorMessage, formatAmount } from "@/lib/safe/format";
import { cn } from "@/lib/utils";
import { countNeedingApproval, useBalances, usePendingTransactions } from "../_hooks/use-safe-queries";
import { useWallet } from "../_hooks/use-wallet";
import { safeHref } from "./links";
import { useSafe } from "./safe-context";
import { Card, Loading, Notice } from "./ui";

export function OverviewView() {
  const { chain, safeAddress, info } = useSafe();
  const balances = useBalances();
  const pending = usePendingTransactions();
  const { address } = useWallet();
  const waiting = pending.data?.length ?? 0;
  const needsMe = countNeedingApproval(pending.data, info.owners, info.threshold, address);
  const tokens = balances.data?.tokens ?? [];

  return (
    <div className="flex flex-col gap-8">
      {waiting > 0 && (
        <Link
          href={safeHref(chain, safeAddress, "activity")}
          className={cn("group flex items-center gap-5 p-5 text-black", ink, hardShadow, press, needsMe ? "bg-[#FFD400]" : "bg-white")}
        >
          <span className={`${display} text-6xl leading-none`}>{needsMe || waiting}</span>
          <span className="flex-1 text-xl">
            <strong>
              {needsMe
                ? `transaction${needsMe > 1 ? "s" : ""} need${needsMe > 1 ? "" : "s"} your approval`
                : `transaction${waiting > 1 ? "s" : ""} waiting`}
            </strong>
            <span className="block text-base">
              {needsMe ? "Tap to review and approve." : "Waiting for approvals or to be completed."}
            </span>
          </span>
          <ArrowRight className="h-8 w-8 transition group-hover:translate-x-1" strokeWidth={3} />
        </Link>
      )}

      <Card
        title="Money in this Safe"
        actions={
          <Link href={safeHref(chain, safeAddress, "send")} className={buttonClass("md", "bg-[#2DD881]")}>
            Send <ArrowRight className="h-5 w-5" strokeWidth={3} />
          </Link>
        }
      >
        {balances.isPending && <Loading />}
        {balances.data?.error !== undefined && (
          <div className="mb-5">
            <Notice tone="warning" title="Some balances couldn't be loaded">
              {errorMessage(balances.data.error)} Showing {chain.chain.nativeCurrency.symbol} only.
            </Notice>
          </div>
        )}
        <ul className="divide-y-2 divide-dashed divide-black/25">
          {tokens.map((t) => (
            <li key={t.address ?? "native"}>
              <Link
                href={safeHref(chain, safeAddress, "send", { token: t.address ?? "native" })}
                className="-mx-2 flex items-center gap-4 px-2 py-4 transition hover:bg-[#FFF4DC]"
              >
                {t.logoUri ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.logoUri} alt="" className="h-12 w-12 shrink-0 rounded-full border-2 border-black bg-white" />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-black bg-[#4CC9F0] text-sm font-bold">
                    {t.symbol.slice(0, 4)}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xl font-bold">{t.name}</span>
                  <span className="block truncate text-sm text-neutral-700">{t.symbol}</span>
                </span>
                <span className="text-right">
                  <span className={`${display} text-3xl`}>{formatAmount(t.balance, t.decimals, 4)}</span>
                  <span className="ml-2 text-base font-bold">{t.symbol}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
