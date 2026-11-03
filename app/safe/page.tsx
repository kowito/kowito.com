import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle, SiteHeader } from "@/components/comic";
import { SiteFooter } from "@/components/site-footer";
import { SafeApp } from "./_components/safe-app";

export const metadata: Metadata = {
  title: "Safe",
  description:
    "A simple way to use a Safe multisig wallet: see balances, send money and approve transactions, with every transaction double-checked in your browser.",
  alternates: {
    canonical: "/safe",
  },
};

export default function SafePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader className="max-w-5xl" />

      <main className="container mx-auto max-w-5xl flex-1 px-4 pb-20">
        {/* The app reads ?safe=… from the URL, which only exists in the browser. */}
        <Suspense fallback={<PageTitle kicker="Multisig wallet" title="Safe" compact />}>
          <SafeApp />
        </Suspense>
      </main>

      <SiteFooter className="max-w-5xl px-4" />
    </div>
  );
}
