import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { ArrowLeft, CalendarDays, ExternalLink, Info, Repeat, Tag } from "lucide-react";
import { Comparison } from "./comparison";
import { abroad, countries, fxDate, fxSource, models, priceDate, sources, THAI_IMPORT_VAT } from "./data";

export const metadata: Metadata = {
  title: "Apple Prices in Asia",
  description:
    "MacBook Pro, Mac mini and iPhone prices at Apple's own stores in Japan, Singapore, Hong Kong, Taiwan and China, converted to baht and compared with Thailand.",
  alternates: {
    canonical: "/apple-prices",
  },
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function ApplePricesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[700px] w-[700px] rounded-full bg-gradient-to-b from-blue-900/20 to-slate-900/20 blur-3xl translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-t from-red-900/10 to-blue-900/20 blur-3xl -translate-x-1/3 translate-y-1/3 opacity-40" />
      </div>

      {/* Header */}
      <header className="container mx-auto max-w-5xl px-4 py-8 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-medium tracking-[0.22em] text-white">
          Kowit C.
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      <main className="container mx-auto flex-1 max-w-5xl px-4 pb-20">

        {/* Page header */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-gray-400 shrink-0" />
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Price check</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white">Apple Prices in Asia</h1>
          <p className="max-w-2xl text-gray-400 leading-relaxed">
            Is it worth buying that MacBook or iPhone on your next trip? Apple&apos;s own prices in{" "}
            {abroad.map((c) => c.name).join(", ").replace(/, ([^,]*)$/, " and $1")}, converted to baht and set
            against the Thai Apple Store.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
              <CalendarDays className="h-3 w-3" />
              Prices as of {formatDate(priceDate)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
              <Tag className="h-3 w-3" />
              {models.length} models
            </span>
          </div>
        </div>

        {/* Exchange rates */}
        <div className="mb-12 rounded-3xl border border-gray-800 bg-black/30 overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-blue-500 via-gray-500 to-red-500" />
          <div className="px-4 py-5 sm:px-6 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 font-medium">
              <Repeat className="h-3.5 w-3.5" />
              Exchange rates
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {abroad.map((c) => (
                <div key={c.code} className="rounded-xl border border-gray-800 bg-gray-900/50 px-3 py-2">
                  <p className="text-xs text-gray-400">
                    <span className="mr-1">{c.flag}</span>
                    {c.currency}
                  </p>
                  <p className="text-sm tabular-nums text-gray-100">
                    {c.symbol}
                    {c.fxUnit.toLocaleString("en-US")} = ฿{(c.fxUnit * c.thbPerUnit).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Mid-market rates on {formatDate(fxDate)} ({fxSource}). Your card or money changer will be a little worse.
            </p>
          </div>
        </div>

        <Comparison />

        {/* Country notes */}
        <section className="mt-14 space-y-5 border-t border-gray-800/60 pt-10">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 shrink-0 text-gray-400" />
            <h2 className="text-2xl font-light tracking-tight text-white md:text-3xl">Before you buy abroad</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {countries.map((c) => (
              <article key={c.code} className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4 sm:p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-medium text-white">
                    <span className="mr-2">{c.flag}</span>
                    {c.name}
                  </h3>
                  <a
                    href={c.store}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    Apple Store
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{c.taxNote}</p>
                {c.notes.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-gray-400">
                    {c.notes.map((note) => (
                      <li key={note} className="flex gap-2">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-500" />
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Method */}
        <section className="mt-14 space-y-3 border-t border-gray-800/60 pt-10 text-sm leading-relaxed text-gray-400">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 font-medium">How these numbers work</h2>
          <p>
            Every price is the cheapest standard configuration on Apple&apos;s own online store in that country, with
            local tax included, as listed on {formatDate(priceDate)}. Resellers, carrier deals and student pricing are
            left out, and Apple changes prices without notice, so check the store before you fly.
          </p>
          <p>
            &ldquo;After tourist refund&rdquo; takes off only the sales tax a foreign visitor can confirmably claim
            back at Apple&apos;s own stores, after the refund agent&apos;s fee; where that couldn&apos;t be confirmed
            it counts as zero. &ldquo;Declared at Thai customs&rdquo; then adds the {THAI_IMPORT_VAT * 100}% VAT
            Thailand charges on goods brought home above the 20,000-baht allowance, worked out on the receipt price.
            Laptops, desktops and phones carry no import duty on top.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 pt-2 text-xs">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-500 transition-colors hover:text-white"
                >
                  {s.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>

      </main>

      <SiteFooter className="max-w-5xl px-4" />
    </div>
  );
}
