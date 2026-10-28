"use client";

import { useState } from "react";
import { Laptop, Server, Smartphone, type LucideIcon } from "lucide-react";
import {
  abroad,
  countries,
  families,
  models,
  THAI_IMPORT_VAT,
  type Country,
  type Family,
  type Model,
} from "./data";

type Mode = "shelf" | "refund" | "landed";

const modes: { id: Mode; label: string; blurb: string }[] = [
  {
    id: "shelf",
    label: "Shelf price",
    blurb: "Apple's own list price in each store, tax included, converted to baht.",
  },
  {
    id: "refund",
    label: "After tourist refund",
    blurb:
      "Takes off the sales tax a tourist can actually claim back at Apple's own stores, after fees. Most of these stores don't refund it; the notes below explain each one.",
  },
  {
    id: "landed",
    label: "Declared at Thai customs",
    blurb: `After any tourist refund, plus the ${THAI_IMPORT_VAT * 100}% VAT Thai Customs charges on the receipt price when you declare it on the way home. Laptops, desktops and phones carry no import duty.`,
  },
];

const familyIcon: Record<Family, LucideIcon> = {
  "MacBook Pro": Laptop,
  "Mac mini": Server,
  iPhone: Smartphone,
};

const thai = countries.find((c) => c.code === "TH")!;

/** Price of a model in baht under the chosen mode, or null when that store doesn't sell it. */
function thbPrice(model: Model, country: Country, mode: Mode): number | null {
  const local = model.prices[country.code];
  if (local == null) return null;
  const shelf = local * country.thbPerUnit;
  if (country.code === "TH" || mode === "shelf") return shelf;
  const refunded = shelf * (1 - country.touristRefund);
  // Customs values the goods at the receipt price; the tourist refund only arrives after departure.
  return mode === "refund" ? refunded : refunded + shelf * THAI_IMPORT_VAT;
}

/** Difference from the Thai price as a fraction: -0.08 means 8% cheaper than Thailand. */
function diffFromThai(model: Model, country: Country, mode: Mode): number | null {
  const there = thbPrice(model, country, mode);
  const home = thbPrice(model, thai, mode);
  if (there == null || home == null) return null;
  return there / home - 1;
}

const baht = (n: number) => `฿${Math.round(n).toLocaleString("en-US")}`;

const local = (n: number, country: Country) =>
  `${country.symbol}${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const percent = (d: number) => {
  const p = Math.round(d * 100);
  if (p === 0) return "±0%";
  return `${p > 0 ? "+" : "−"}${Math.abs(p)}%`;
};

/**
 * Diverging scale: blue arm for cheaper than Thailand, red arm for pricier, grey midpoint for
 * "about the same". Equal steps per arm; the sign is printed in every cell too, so colour is
 * never the only cue.
 */
const steps = [
  { max: -0.15, cell: "bg-blue-500/50", label: "15%+ cheaper" },
  { max: -0.07, cell: "bg-blue-500/30", label: "7–15% cheaper" },
  { max: -0.02, cell: "bg-blue-500/15", label: "2–7% cheaper" },
  { max: 0.02, cell: "bg-gray-700/40", label: "Within 2%" },
  { max: 0.07, cell: "bg-red-500/15", label: "2–7% pricier" },
  { max: 0.15, cell: "bg-red-500/30", label: "7–15% pricier" },
  { max: Infinity, cell: "bg-red-500/50", label: "15%+ pricier" },
];

const stepFor = (d: number) => steps.find((s) => d < s.max) ?? steps[steps.length - 1];

function ModeToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Price to compare" className="inline-flex flex-wrap gap-1 rounded-2xl border border-gray-800 bg-gray-900/60 p-1">
        {modes.map((m) => (
          <button
            key={m.id}
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              mode === m.id ? "bg-white text-gray-950" : "text-gray-400 hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-gray-400">{modes.find((m) => m.id === mode)!.blurb}</p>
    </div>
  );
}

/** One-line takeaway for the current mode: how many models are cheaper abroad, and the biggest saving. */
function Takeaway({ mode }: { mode: Mode }) {
  const best = models.map((model) => {
    const home = thbPrice(model, thai, mode)!;
    const options = abroad
      .map((c) => ({ country: c, thb: thbPrice(model, c, mode) }))
      .filter((o): o is { country: Country; thb: number } => o.thb != null)
      .sort((a, b) => a.thb - b.thb);
    return { model, saving: options.length ? home - options[0].thb : 0, where: options[0]?.country };
  });
  const cheaper = best.filter((b) => b.saving > 0);
  const top = [...cheaper].sort((a, b) => b.saving - a.saving)[0];

  return (
    <p className="text-sm leading-relaxed text-gray-300">
      {cheaper.length === 0 ? (
        <>Nothing here is cheaper abroad than in Thailand.</>
      ) : (
        <>
          <span className="text-white">
            {cheaper.length} of {models.length}
          </span>{" "}
          models are cheaper somewhere abroad. The biggest saving is{" "}
          <span className="text-white">{baht(top.saving)}</span> on the {top.model.name} in {top.where!.name}.
        </>
      )}
    </p>
  );
}

function Overview({ mode }: { mode: Mode }) {
  return (
    <div className="space-y-4">
      <Takeaway mode={mode} />
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[640px] border-separate border-spacing-[2px] text-sm">
          <thead>
            <tr className="text-xs text-gray-400">
              <th scope="col" className="sticky left-0 z-10 bg-gray-950 px-3 py-2 text-left font-medium">
                Model
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                <span className="mr-1">{thai.flag}</span>
                Thai price
              </th>
              {abroad.map((c) => (
                <th key={c.code} scope="col" className="px-2 py-2 text-center font-medium">
                  <span className="mr-1">{c.flag}</span>
                  {c.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {families.map((family) => (
              <FamilyRows key={family} family={family} mode={mode} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
        <span>vs. Thailand</span>
        <div className="flex flex-wrap gap-[2px]">
          {steps.map((s) => (
            <span key={s.label} className={`rounded px-2 py-1 text-gray-200 ${s.cell}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FamilyRows({ family, mode }: { family: Family; mode: Mode }) {
  const Icon = familyIcon[family];
  return (
    <>
      <tr>
        <th
          scope="colgroup"
          colSpan={abroad.length + 2}
          className="sticky left-0 bg-gray-950 px-3 pb-1 pt-5 text-left text-xs font-medium uppercase tracking-widest text-gray-500"
        >
          <span className="inline-flex items-center gap-2">
            <Icon className="h-3.5 w-3.5" />
            {family}
          </span>
        </th>
      </tr>
      {models
        .filter((m) => m.family === family)
        .map((model) => {
          const home = thbPrice(model, thai, mode);
          return (
            <tr key={model.id}>
              <th scope="row" className="sticky left-0 z-10 bg-gray-950 px-3 py-2 text-left font-normal">
                <a href={`#${model.id}`} className="text-gray-100 hover:text-white hover:underline">
                  {model.name}
                </a>
              </th>
              <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-300">
                {home == null ? "—" : baht(home)}
              </td>
              {abroad.map((c) => {
                const d = diffFromThai(model, c, mode);
                const there = thbPrice(model, c, mode);
                if (d == null || there == null) {
                  return (
                    <td key={c.code} className="rounded bg-gray-900/40 px-2 py-2 text-center text-gray-600">
                      —
                    </td>
                  );
                }
                return (
                  <td
                    key={c.code}
                    title={`${model.name} in ${c.name}: ${local(model.prices[c.code]!, c)} ≈ ${baht(there)}`}
                    className={`rounded px-2 py-2 text-center tabular-nums text-gray-100 ${stepFor(d).cell}`}
                  >
                    {percent(d)}
                  </td>
                );
              })}
            </tr>
          );
        })}
    </>
  );
}

function ModelCard({ model, mode }: { model: Model; mode: Mode }) {
  const rows = countries
    .map((c) => ({ country: c, thb: thbPrice(model, c, mode), diff: diffFromThai(model, c, mode) }))
    .filter((r): r is { country: Country; thb: number; diff: number } => r.thb != null && r.diff != null);
  const cheapest = Math.min(...rows.map((r) => r.thb));
  const home = rows.find((r) => r.country.code === "TH");

  return (
    <article id={model.id} className="scroll-mt-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-4 sm:p-5">
      <h3 className="text-lg font-medium text-white">{model.name}</h3>
      <p className="mt-0.5 text-xs leading-relaxed text-gray-400">{model.config}</p>

      <ul className="mt-4 space-y-2.5">
        {rows.map(({ country, thb, diff }) => {
          const isHome = country.code === "TH";
          const width = `${Math.min(Math.abs(diff), 0.3) / 0.3 * 50}%`;
          return (
            <li key={country.code} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[11rem_1fr_7.5rem]">
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span aria-hidden>{country.flag}</span>
                <span className={isHome ? "text-sm text-white" : "text-sm text-gray-300"}>{country.short}</span>
                {thb === cheapest && (
                  <span className="rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-200">
                    Cheapest
                  </span>
                )}
              </div>

              {/* Diverging bar around the Thai price: left = cheaper, right = pricier. */}
              <div aria-hidden className="relative order-last col-span-2 h-1.5 sm:order-none sm:col-span-1">
                <div className="absolute inset-y-0 left-1/2 w-px bg-gray-600" />
                {!isHome && (
                  <div
                    className={`absolute inset-y-0 ${diff < 0 ? "right-1/2 rounded-l bg-blue-500" : "left-1/2 rounded-r bg-red-500"}`}
                    style={{ width }}
                  />
                )}
              </div>

              <div className="text-right">
                <p className="text-sm tabular-nums text-gray-100">{baht(thb)}</p>
                <p className="text-[11px] tabular-nums text-gray-500">
                  {isHome ? "baseline" : `${local(model.prices[country.code]!, country)} · ${percent(diff)}`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 space-y-1 border-t border-gray-800 pt-3 text-xs leading-relaxed">
        {home && (
          <p className="text-gray-300">
            {cheapest < home.thb
              ? `Best saving: ${baht(home.thb - cheapest)} in ${rows.find((r) => r.thb === cheapest)!.country.name}.`
              : "Nowhere on this list beats the Thai price."}
          </p>
        )}
        {model.note && <p className="text-gray-500">{model.note}</p>}
      </div>
    </article>
  );
}

export function Comparison() {
  const [mode, setMode] = useState<Mode>("shelf");

  return (
    <div className="space-y-14">
      <section className="space-y-6">
        <ModeToggle mode={mode} setMode={setMode} />
        <Overview mode={mode} />
      </section>

      {families.map((family) => {
        const Icon = familyIcon[family];
        return (
          <section key={family} className="space-y-5 border-t border-gray-800/60 pt-10">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-gray-400" />
              <h2 className="text-2xl font-light tracking-tight text-white md:text-3xl">{family}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {models
                .filter((m) => m.family === family)
                .map((model) => (
                  <ModelCard key={model.id} model={model} mode={mode} />
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
