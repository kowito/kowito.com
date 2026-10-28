import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { INK, PageTitle, Panel, SectionTitle, SiteHeader, Sticker, buttonClass, display, hardShadow, ink, lift, tilts } from "@/components/comic";
import { Reveal } from "@/components/comic-motion";
import {
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

/** Refund status as an inked icon: the fill is a comic ink, the label beside it says the same thing. */
const refundIcon: Record<RefundStatus, { icon: LucideIcon; fill: string }> = {
  yes: { icon: CheckCircle2, fill: INK.green },
  no: { icon: XCircle, fill: INK.red },
  unconfirmed: { icon: HelpCircle, fill: INK.yellow },
  none: { icon: MinusCircle, fill: "#fff" },
};

function Fact({ icon: Icon, label, value, fill = "none" }: { icon: LucideIcon; label: string; value: string; fill?: string }) {
  return (
    <div className="min-w-0 border-2 border-black bg-[#FFF4DC] px-1.5 py-1.5 sm:px-2">
      <p className="flex items-start gap-1 text-[10px] font-bold uppercase leading-tight tracking-wider text-black/70">
        <Icon className="h-3.5 w-3.5 shrink-0 text-black" fill={fill} strokeWidth={2.5} />
        {label}
      </p>
      {/* Hyphenates long words like "consumption" where the boxes get narrow. */}
      <p className="mt-0.5 hyphens-auto break-words text-xs font-bold leading-snug text-black">{value}</p>
    </div>
  );
}

function CountryCard({ c, index }: { c: Country; index: number }) {
  const refund = refundIcon[c.refund.status];
  return (
    <article className={`group flex h-full flex-col bg-white p-4 text-black ${ink} ${hardShadow} ${tilts[index % tilts.length]} ${lift}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className={`flex min-w-0 items-center gap-2 ${display} text-2xl leading-none`}>
          <span className="text-2xl leading-none drop-shadow-[2px_2px_0_#000] group-hover:animate-wiggle motion-reduce:animate-none">{c.flag}</span>
          {c.name}
        </h3>
        <a href={c.store} target="_blank" rel="noopener noreferrer" className={buttonClass("sm", "shrink-0 px-2 text-base")}>
          Store
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={3} />
        </a>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <Fact icon={Percent} label="Tax" value={c.tax} />
        <Fact icon={refund.icon} label="Refund" value={c.refund.label} fill={refund.fill} />
        <Fact icon={Keyboard} label="Mac keys" value={c.keyboard} />
      </div>
      <p className="mt-3 text-sm leading-relaxed">{c.headline}</p>
      {c.notes.length > 0 && (
        <details className="group/notes mt-2">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-bold text-black/70 transition-colors hover:text-black [&::-webkit-details-marker]:hidden">
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-open/notes:rotate-90" strokeWidth={3} />
            {c.notes.length} more {c.notes.length === 1 ? "note" : "notes"}
          </summary>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-black/80">
            {c.notes.map((note) => (
              <li key={note} className="flex gap-2">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-black" />
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
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader className="max-w-5xl" />

      <main className="container mx-auto max-w-5xl flex-1 px-4 pb-20">
        {/* Page header */}
        <PageTitle
          className="mb-10"
          kicker={
            <span className="inline-flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
              Price check
            </span>
          }
          title="Apple Prices in Asia"
        >
          <p className="max-w-2xl text-base leading-relaxed">
            Worth buying that MacBook or iPhone on your next trip? Pick a configuration and see Apple&apos;s own price in{" "}
            {abroad.map((c) => c.short).join(", ").replace(/, ([^,]*)$/, " and $1")} against Thailand, in baht.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <Sticker color={INK.cyan} className="-rotate-1 px-2.5 py-1 text-xs">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.5} />
              Prices as of {formatDate(priceDate)}
            </Sticker>
            <Sticker className="rotate-1 px-2.5 py-1 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2.5} />
              {configCount.toLocaleString("en-US")} configurations
            </Sticker>
          </div>
        </PageTitle>

        <Comparison />

        {/* Country notes */}
        <section className="mt-20 space-y-7">
          <Reveal>
            <SectionTitle title="Before you buy abroad" sub="Tax, refunds and keyboards in each store." color={INK.pink} />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((c, i) => (
              <Reveal key={c.code} delay={(i % 3) * 70} className="h-full">
                <CountryCard c={c} index={i} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Method */}
        <section className="mt-20 space-y-6">
          <Reveal>
            <SectionTitle title="How the numbers work" color={INK.purple} />
          </Reveal>
          <Panel className="space-y-5 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {formula.map(({ icon: Icon, label, op }) => (
                <span key={label} className="inline-flex items-center gap-2.5">
                  {op && <span className={`${display} text-2xl leading-none text-black`}>{op}</span>}
                  <Sticker className="gap-1.5 px-2.5 py-1.5 text-xs">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    {label}
                  </Sticker>
                </span>
              ))}
              <span className={`${display} text-2xl leading-none text-black`}>=</span>
              <Sticker color={INK.yellow} className={`-rotate-2 px-2.5 py-1 ${display} text-lg font-normal leading-tight`}>
                What you pay in ฿
              </Sticker>
            </div>

            <p className="max-w-3xl text-sm leading-relaxed text-black/80">
              Prices come straight from Apple&apos;s online store in each country on {formatDate(priceDate)}: each
              chip&apos;s base price plus Apple&apos;s own price for every upgrade. Colour and keyboard don&apos;t change
              the price; resellers, carrier deals and student pricing are left out. A tourist refund only counts where
              Apple&apos;s own stores are confirmed to give one, and Thai VAT is worked out on the receipt price. Apple
              changes prices without notice, so check before you fly.
            </p>

            <div className="space-y-2">
              <p className="text-xs font-bold text-black/70">
                Exchange rates on {formatDate(fxDate)} ({fxSource})
              </p>
              <div className="flex flex-wrap gap-2">
                {abroad.map((c) => (
                  <Sticker key={c.code} className="px-2.5 py-1 text-xs tabular-nums">
                    {c.flag} {c.symbol}
                    {c.fxUnit.toLocaleString("en-US")} = ฿{(c.fxUnit * c.thbPerUnit).toFixed(2)}
                  </Sticker>
                ))}
              </div>
            </div>

            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 border-t-2 border-black pt-4 text-xs">
              {sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-black/70 underline decoration-2 underline-offset-2 transition-colors hover:text-black"
                  >
                    {s.label}
                    <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      </main>

      <SiteFooter className="max-w-5xl px-4" />
    </div>
  );
}
