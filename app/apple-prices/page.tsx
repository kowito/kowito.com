import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Keyboard,
  MinusCircle,
  Percent,
  PlaneLanding,
  Receipt,
  Repeat,
  SlidersHorizontal,
  Tag,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Comparison } from "./comparison";
import {
  abroad,
  configCount,
  countries,
  fxDate,
  fxSource,
  priceDate,
  sources,
  THAI_VAT_PERCENT,
  type Country,
  type RefundStatus,
} from "./data";

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

const refundIcon: Record<RefundStatus, { icon: LucideIcon; tone: string }> = {
  yes: { icon: CheckCircle2, tone: "text-emerald-400" },
  no: { icon: XCircle, tone: "text-rose-400" },
  unconfirmed: { icon: HelpCircle, tone: "text-amber-400" },
  none: { icon: MinusCircle, tone: "text-gray-400" },
};

function Fact({ icon: Icon, label, value, tone = "text-gray-400" }: { icon: LucideIcon; label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg bg-black/30 px-2 py-1.5">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500">
        <Icon className={`h-3 w-3 shrink-0 ${tone}`} />
        {label}
      </p>
      <p className="mt-0.5 text-xs leading-snug text-gray-200">{value}</p>
    </div>
  );
}

function CountryCard({ c }: { c: Country }) {
  const refund = refundIcon[c.refund.status];
  return (
    <article className="flex flex-col rounded-2xl border border-gray-800 bg-gray-900/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-medium text-white">
          <span className="text-xl leading-none">{c.flag}</span>
          {c.name}
        </h3>
        <a
          href={c.store}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-[11px] text-gray-500 transition-colors hover:text-white"
        >
          Store
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <Fact icon={Percent} label="Tax" value={c.tax} />
        <Fact icon={refund.icon} label="Refund" value={c.refund.label} tone={refund.tone} />
        <Fact icon={Keyboard} label="Mac keys" value={c.keyboard} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-gray-300">{c.headline}</p>
      {c.notes.length > 0 && (
        <details className="group mt-2">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[11px] text-gray-500 transition-colors hover:text-gray-300 [&::-webkit-details-marker]:hidden">
            <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90" />
            {c.notes.length} more {c.notes.length === 1 ? "note" : "notes"}
          </summary>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-gray-400">
            {c.notes.map((note) => (
              <li key={note} className="flex gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-600" />
                {note}
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

/** The sum behind every number on the page, drawn as a little equation. */
const formula: { icon: LucideIcon; label: string; op?: string }[] = [
  { icon: Tag, label: "Apple list price, tax included" },
  { icon: Repeat, label: "Bank of Thailand rate", op: "×" },
  { icon: Receipt, label: "Tourist refund, if any", op: "−" },
  { icon: PlaneLanding, label: `${THAI_VAT_PERCENT}% Thai VAT, if declared`, op: "+" },
];

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
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-gray-400 shrink-0" />
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Price check</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white">Apple Prices in Asia</h1>
          <p className="max-w-2xl text-gray-400 leading-relaxed">
            Worth buying that MacBook or iPhone on your next trip? Pick a configuration and see Apple&apos;s own price in{" "}
            {abroad.map((c) => c.short).join(", ").replace(/, ([^,]*)$/, " and $1")} against Thailand, in baht.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
              <CalendarDays className="h-3 w-3" />
              Prices as of {formatDate(priceDate)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
              <SlidersHorizontal className="h-3 w-3" />
              {configCount.toLocaleString("en-US")} configurations
            </span>
          </div>
        </div>

        <Comparison />

        {/* Country notes */}
        <section className="mt-14 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-xl font-light tracking-tight text-white">Before you buy abroad</h2>
            <p className="text-xs text-gray-500">Tax, refunds and keyboards in each store.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((c) => (
              <CountryCard key={c.code} c={c} />
            ))}
          </div>
        </section>

        {/* Method */}
        <section className="mt-14 space-y-5 rounded-3xl border border-gray-800 bg-black/30 p-4 sm:p-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 font-medium">How the numbers work</h2>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {formula.map(({ icon: Icon, label, op }) => (
              <span key={label} className="inline-flex items-center gap-2">
                {op && <span className="text-base text-gray-500">{op}</span>}
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-gray-200">
                  <Icon className="h-3.5 w-3.5 text-gray-400" />
                  {label}
                </span>
              </span>
            ))}
            <span className="text-base text-gray-500">=</span>
            <span className="rounded-lg bg-white px-2.5 py-1.5 font-medium text-gray-950">What you pay in ฿</span>
          </div>

          <p className="max-w-3xl text-xs leading-relaxed text-gray-400">
            Prices come straight from Apple&apos;s online store in each country on {formatDate(priceDate)}: each
            chip&apos;s base price plus Apple&apos;s own price for every upgrade. Colour and keyboard don&apos;t change
            the price; resellers, carrier deals and student pricing are left out. A tourist refund only counts where
            Apple&apos;s own stores are confirmed to give one, and Thai VAT is worked out on the receipt price. Apple
            changes prices without notice, so check before you fly.
          </p>

          <div className="space-y-2">
            <p className="text-[11px] text-gray-500">
              Exchange rates on {formatDate(fxDate)} ({fxSource})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {abroad.map((c) => (
                <span key={c.code} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs tabular-nums text-gray-300">
                  {c.flag} {c.symbol}
                  {c.fxUnit.toLocaleString("en-US")} = ฿{(c.fxUnit * c.thbPerUnit).toFixed(2)}
                </span>
              ))}
            </div>
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-gray-800 pt-4 text-[11px]">
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
