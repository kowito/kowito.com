"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageTitle, buttonClass } from "@/components/comic";
import { ConnectButton } from "./connect-button";
import { type Tab, TABS, parseSafeParam } from "./links";
import { Providers } from "./providers";
import { SafeProvider } from "./safe-context";
import { SafeShell } from "./safe-shell";
import { Card } from "./ui";
import { ActivityView } from "./view-activity";
import { AdvancedView } from "./view-advanced";
import { HomeView } from "./view-home";
import { OverviewView } from "./view-overview";
import { OwnersView } from "./view-owners";
import { SendView } from "./view-send";

/** The whole Safe app on one static page; ?safe=…&tab=… picks what to show. */
export function SafeApp() {
  const params = useSearchParams();
  const raw = params.get("safe");
  const tabParam = params.get("tab");
  const tab: Tab = (TABS as readonly string[]).includes(tabParam ?? "") ? (tabParam as Tab) : "overview";
  const parsed = raw ? parseSafeParam(raw) : undefined;

  return (
    <Providers>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        {raw ? (
          <Link href="/safe" className={buttonClass("sm")}>
            <ArrowLeft className="h-4 w-4" strokeWidth={3} /> All Safes
          </Link>
        ) : (
          <PageTitle kicker="Multisig wallet" title="Open your Safe" compact>
            <p className="max-w-xl text-lg leading-relaxed">
              A simple way to use a Safe multisig: see what&apos;s inside, send money, and approve what other owners propose. Every
              transaction is double-checked right here in your browser.
            </p>
          </PageTitle>
        )}
        <ConnectButton />
      </div>

      {!parsed && <HomeView />}
      {parsed?.ok === false && parsed.reason === "no-network" && <HomeView key={parsed.address} find={parsed.address} />}
      {parsed?.ok === false && parsed.reason !== "no-network" && (
        <Card title="That link doesn't look right" color="#FFF4DC">
          <p className="text-lg">
            {parsed.reason === "unknown-network"
              ? `“${parsed.prefix}” isn't a network we support.`
              : `“${raw}” doesn't contain a valid Safe address.`}
          </p>
          <Link href="/safe" className={buttonClass("md", "mt-5 bg-[#FFD400]")}>
            Open a Safe
          </Link>
        </Card>
      )}
      {parsed?.ok && (
        <SafeProvider key={`${parsed.chain.shortName}:${parsed.address}`} chain={parsed.chain} safeAddress={parsed.address}>
          <SafeShell tab={tab}>
            {tab === "overview" && <OverviewView />}
            {tab === "send" && <SendView key={params.get("token") ?? "native"} initialToken={params.get("token") ?? undefined} />}
            {tab === "activity" && <ActivityView />}
            {tab === "owners" && <OwnersView />}
            {tab === "advanced" && <AdvancedView />}
          </SafeShell>
        </SafeProvider>
      )}
    </Providers>
  );
}
