"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PlaneLanding, Receipt, SlidersHorizontal, Tag, Trophy, X, type LucideIcon } from "lucide-react";
import { Burst, INK, Panel, SectionTitle, Sticker, buttonClass, display, halftone, ink, lettering, smallShadow } from "@/components/comic";
import { Reveal, useReducedMotion } from "@/components/comic-motion";
import { DeviceArt } from "./device-art";
import {
  abroad,
  chipLabel,
  configPrice,
  countries,
  defaultPick,
  devices,
  groupLabels,
  optionLabel,
  sizeLabel,
  THAI_IMPORT_VAT,
  THAI_VAT_PERCENT,
  variantName,
  variantNotes,
  variants,
  type Country,
  type Device,
  type OptionGroup,
  type Picks,
  type Variant,
} from "./data";

type Mode = "shelf" | "refund" | "landed";

type Selection = { variantId: string; picks: Picks };

const refunders = abroad.filter((c) => c.touristRefund > 0).map((c) => c.name);

const modes: { id: Mode; label: string; short: string; icon: LucideIcon; blurb: string }[] = [
  { id: "shelf", label: "Shelf price", short: "Shelf", icon: Tag, blurb: "Apple's list price in each store, tax included, in baht." },
  {
    id: "refund",
    label: "Tourist refund",
    short: "Refund",
    icon: Receipt,
    blurb: `Minus the sales tax a tourist can claim back at Apple's own stores. Today only ${refunders.join(" and ")} qualifies.`,
  },
  {
    id: "landed",
    label: "Thai customs",
    short: "Customs",
    icon: PlaneLanding,
    blurb: `After any refund, plus the ${THAI_VAT_PERCENT}% VAT you owe declaring it at Thai customs. No import duty.`,
  },
];

const thai = countries.find((c) => c.code === "TH")!;

const variantById = (id: string) => variants.find((v) => v.id === id)!;

const groupsOf = (v: Variant) => Object.keys(v.options) as OptionGroup[];

/** Price in baht under the chosen mode, or null when that store doesn't sell the configuration. */
function thbPrice(v: Variant, picks: Picks, country: Country, mode: Mode): number | null {
  const local = configPrice(v, picks, country.code);
  if (local == null) return null;
  const shelf = local * country.thbPerUnit;
  if (country.code === "TH" || mode === "shelf") return shelf;
  const refunded = shelf * (1 - country.touristRefund);
  // Customs values the goods at the receipt price; the tourist refund only arrives after departure.
  return mode === "refund" ? refunded : refunded + shelf * THAI_IMPORT_VAT;
}

/** Difference from the Thai price as a fraction: -0.08 means 8% cheaper than Thailand. */
function diffFromThai(v: Variant, picks: Picks, country: Country, mode: Mode): number | null {
  const there = thbPrice(v, picks, country, mode);
  const home = thbPrice(v, picks, thai, mode);
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
 * Diverging scale: a cyan arm for cheaper than Thailand, a red arm for pricier, and a pale grey
 * midpoint for "about the same" (the lightest cell). Each arm steps 0.07 in OKLCH lightness and
 * mirrored steps match, so neither side looks louder; the darkest cells still hold black text above
 * 8:1. The sign is printed in every cell, so colour is never the only cue.
 */
const steps = [
  { max: -0.15, cell: "bg-[#00BDE8]", label: "15%+" },
  { max: -0.07, cell: "bg-[#48D3FD]", label: "7–15%" },
  { max: -0.02, cell: "bg-[#98E5FF]", label: "2–7%" },
  { max: 0.02, cell: "bg-[#F2F2F2]", label: "±2%" },
  { max: 0.07, cell: "bg-[#FFC8C0]", label: "2–7%" },
  { max: 0.15, cell: "bg-[#FFA699]", label: "7–15%" },
  { max: Infinity, cell: "bg-[#FF7F6F]", label: "15%+" },
];

const stepFor = (d: number) => steps.find((s) => d < s.max) ?? steps[steps.length - 1];

/**
 * Dot colour on the chart: the two poles of the scale, light grey within 2% of Thailand. The poles
 * match in lightness and pass the colour-blind checks; every dot is inked in black and labelled.
 */
const poles = { cheaper: "#009FD6", same: "#C8C8C8", pricier: INK.red };
const markFor = (d: number) => (d <= -0.02 ? poles.cheaper : d >= 0.02 ? poles.pricier : poles.same);

const isWide = (v: Variant) => v.size === "16inch" || v.chip === "iphoneduo";

/** Chips describing a configuration, e.g. ["24GB memory", "1TB SSD", "Standard display"]. */
function specChips(v: Variant, picks: Picks) {
  return groupsOf(v).map((g) => {
    const label = optionLabel(g, picks[g] ?? defaultPick(v, g));
    if (g === "memory") return `${label} memory`;
    if (g === "storage" && v.device !== "iphone") return `${label} SSD`;
    return label;
  });
}

/** Moves to another variant, keeping each pick the new variant also offers. */
function switchVariant(v: Variant, picks: Picks): Selection {
  const kept: Picks = {};
  for (const g of groupsOf(v)) {
    if (picks[g] && v.options[g]!.some((o) => o.value === picks[g])) kept[g] = picks[g];
  }
  return { variantId: v.id, picks: kept };
}

type Row = { country: Country; local: number | null; thb: number | null; diff: number | null };

function rowsFor(v: Variant, picks: Picks, mode: Mode): Row[] {
  return abroad
    .map((c) => ({ country: c, local: configPrice(v, picks, c.code), thb: thbPrice(v, picks, c, mode), diff: diffFromThai(v, picks, c, mode) }))
    .sort((a, b) => (a.thb ?? Infinity) - (b.thb ?? Infinity));
}

/** A toggle that presses into the page when it's on, like the countries filter. */
const choice = (on: boolean) =>
  `${ink} text-black transition-[transform,box-shadow,background-color] duration-150 motion-reduce:transition-none ${
    on ? "translate-x-[2px] translate-y-[2px] bg-[#FFD400] shadow-[1px_1px_0_0_#000]" : `bg-white ${smallShadow} hover:-translate-y-0.5 hover:bg-[#FFF4DC]`
  }`;

/* ───────────────────────── Result ───────────────────────── */

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div role="radiogroup" aria-label="Price to compare" className="grid grid-cols-3 gap-2.5">
      {modes.map((m) => {
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`inline-flex min-w-0 items-center justify-center gap-1.5 px-2 py-1.5 ${display} text-base leading-tight sm:text-lg ${choice(mode === m.id)}`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            <span className="sm:hidden">{m.short}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function StatTile({
  label,
  icon,
  value,
  sub,
  color,
  className = "",
  children,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  sub: string;
  color: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative min-w-0 px-3 py-2.5 sm:px-4 sm:py-3 ${ink} shadow-[4px_4px_0_0_#000] ${className}`} style={{ backgroundColor: color, ...halftone("rgba(0,0,0,0.12)", 6) }}>
      <p className="flex items-center gap-1.5 truncate text-[11px] font-bold uppercase tracking-widest text-black">
        {icon}
        {label}
      </p>
      {/* Keyed on the value, so a new price pops in. */}
      <p
        key={value}
        className={`mt-1 ${display} text-3xl leading-none text-black animate-in fade-in zoom-in-75 duration-300 [animation-timing-function:cubic-bezier(.2,.9,.3,1.5)] motion-reduce:animate-none sm:text-4xl`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs font-bold leading-snug text-black/70">{sub}</p>
      {children}
    </div>
  );
}

function StatTiles({ home, best, revealKey }: { home: number | null; best: Row | undefined; revealKey: string }) {
  const reduced = useReducedMotion();
  const cheaperAbroad = home != null && best?.thb != null && best.thb < home;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <StatTile label="Thailand" icon={<span>{thai.flag}</span>} value={home == null ? "Not sold" : baht(home)} sub="Apple Thailand" color="#fff" className="-rotate-1" />
      {cheaperAbroad ? (
        <StatTile
          label={best!.country.short}
          icon={<span>{best!.country.flag}</span>}
          value={baht(best!.thb!)}
          sub={`Best deal: save ${baht(home! - best!.thb!)}`}
          color={INK.cyan}
          className="rotate-1"
        >
          {/* The cheapest country gets a sound effect each time it's revealed. */}
          {!reduced && (
            <Burst
              key={`${revealKey}|${best!.country.code}`}
              text="SAVE!"
              className="pointer-events-none absolute -right-3 -top-7 w-16 animate-comic-pop sm:-right-4 sm:w-20"
            />
          )}
        </StatTile>
      ) : (
        <StatTile label="Best deal" icon={<Trophy className="h-3 w-3" strokeWidth={3} />} value="Thailand" sub="Nowhere here beats it" color={INK.yellow} className="rotate-1" />
      )}
    </div>
  );
}

/** Dot plot: Thailand is the centre line, each country sits left (cheaper) or right (pricier) of it. */
function PriceChart({ rows, home, revealKey }: { rows: Row[]; home: number | null; revealKey: string }) {
  const widest = Math.max(0.05, ...rows.map((r) => Math.abs(r.diff ?? 0)));
  const domain = Math.ceil((widest + 0.01) * 20) / 20;
  const pos = (d: number) => 50 + (Math.max(-domain, Math.min(domain, d)) / domain) * 50;
  const cols = "grid grid-cols-[6.25rem_1fr_5rem] items-center gap-x-2 sm:grid-cols-[8rem_1fr_7rem] sm:gap-x-3";

  return (
    <figure aria-label="Price in each country compared with Thailand">
      <div className={`${cols} pb-1.5`}>
        <span />
        <div className="flex justify-center">
          <Sticker color={INK.yellow} className="whitespace-nowrap tabular-nums">
            {thai.flag} {home == null ? "Thailand" : baht(home)}
          </Sticker>
        </div>
        <span />
      </div>

      <ul>
        {rows.map(({ country, local: price, thb, diff }, i) => {
          const mark = diff == null ? null : markFor(diff);
          const p = diff == null ? 50 : pos(diff);
          return (
            <li
              key={country.code}
              className={`${cols} group transition-colors hover:bg-[#FFD400]/30`}
              title={thb != null && price != null ? `${country.name}: ${local(price, country)} ≈ ${baht(thb)}` : undefined}
            >
              <span className="flex items-center gap-2 whitespace-nowrap pl-1 text-sm font-bold text-black">
                <span aria-hidden className="group-hover:animate-wiggle motion-reduce:animate-none">
                  {country.flag}
                </span>
                {country.short}
              </span>
              <div className="relative h-11">
                <span className="absolute inset-y-0 left-1/4 w-px bg-black/10" />
                <span className="absolute inset-y-0 left-3/4 w-px bg-black/10" />
                <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-black" />
                {mark && diff != null ? (
                  <>
                    <span
                      className="absolute top-1/2 h-[3px] -translate-y-1/2"
                      style={{ left: `${Math.min(p, 50)}%`, width: `${Math.abs(p - 50)}%`, backgroundColor: mark }}
                    />
                    <span
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 group-hover:scale-125 motion-reduce:transition-none"
                      style={{ left: `${p}%` }}
                    >
                      {/* Keyed on the selection, so the dots pop in again whenever the prices change. */}
                      <span
                        key={revealKey}
                        className="block h-4 w-4 rounded-full border-2 border-black animate-in fade-in zoom-in-50 fill-mode-backwards duration-300 [animation-timing-function:cubic-bezier(.2,.9,.3,1.5)] motion-reduce:animate-none"
                        style={{ backgroundColor: mark, animationDelay: `${i * 60}ms` }}
                      />
                    </span>
                  </>
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-1 text-xs font-bold text-black/60">Not sold</span>
                  </span>
                )}
              </div>
              <span className="pr-1 text-right">
                {thb != null && diff != null && (
                  <>
                    <span className="block text-sm font-bold tabular-nums text-black">{baht(thb)}</span>
                    <span className={`inline-block border-2 border-black px-1 text-[11px] font-bold leading-snug tabular-nums text-black ${stepFor(diff).cell}`}>
                      {percent(diff)}
                    </span>
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div className={`${cols} pt-1 text-[10px] font-bold tabular-nums text-black/60`}>
        <span />
        <div className="flex justify-between">
          <span>{percent(-domain)}</span>
          <span className="hidden sm:inline">{percent(-domain / 2)}</span>
          <span />
          <span className="hidden sm:inline">{percent(domain / 2)}</span>
          <span>{percent(domain)}</span>
        </div>
        <span />
      </div>

      <figcaption className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-black">
        {[
          { color: poles.cheaper, label: "Cheaper than Thailand" },
          { color: poles.same, label: "Within 2%" },
          { color: poles.pricier, label: "Pricier" },
        ].map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-black" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

function ResultPanel({
  variant,
  picks,
  mode,
  setMode,
  onEdit,
}: {
  variant: Variant;
  picks: Picks;
  mode: Mode;
  setMode: (m: Mode) => void;
  onEdit: () => void;
}) {
  const chip = chipLabel(variant.chip);
  const rows = rowsFor(variant, picks, mode);
  const home = thbPrice(variant, picks, thai, mode);
  const note = variantNotes[variant.id];
  const revealKey = `${variant.id}|${JSON.stringify(picks)}|${mode}`;

  return (
    <Panel>
      {/* What you're pricing */}
      <div className="flex items-center gap-4 p-4 sm:p-5">
        <button
          onClick={onEdit}
          aria-label="Change device"
          className={`flex h-16 w-20 shrink-0 items-center justify-center text-black sm:h-20 sm:w-28 ${ink} ${smallShadow} transition-[transform,box-shadow] duration-150 hover:-rotate-2 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_#000] motion-reduce:transition-none`}
          style={{ backgroundColor: INK.yellow, ...halftone("rgba(0,0,0,0.14)", 6) }}
        >
          <DeviceArt device={variant.device} wide={isWide(variant)} className="w-14 sm:w-20" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className={`${display} text-2xl leading-none text-black sm:text-3xl`}>{variantName(variant)}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[chip.cores, ...specChips(variant, picks)].filter(Boolean).map((c) => (
              <Sticker key={c}>{c}</Sticker>
            ))}
          </div>
        </div>
        <button onClick={onEdit} className={buttonClass("md", "hidden shrink-0 bg-[#FFD400] sm:inline-flex")}>
          <SlidersHorizontal className="h-4 w-4" strokeWidth={3} />
          Customize
        </button>
      </div>
      <div className="px-4 pb-5 sm:hidden">
        <button onClick={onEdit} className={buttonClass("md", "w-full bg-[#FFD400]")}>
          <SlidersHorizontal className="h-4 w-4" strokeWidth={3} />
          Customize
        </button>
      </div>

      <div className="space-y-5 border-t-[3px] border-black p-4 sm:p-5">
        <div className="space-y-2.5">
          <ModeSwitch mode={mode} setMode={setMode} />
          <p className="text-sm leading-relaxed text-black/70">{modes.find((m) => m.id === mode)!.blurb}</p>
        </div>
        <StatTiles home={home} best={rows.find((r) => r.thb != null)} revealKey={revealKey} />
        <PriceChart rows={rows} home={home} revealKey={revealKey} />
        {note && <p className="text-xs leading-relaxed text-black/70">{note}</p>}
      </div>
    </Panel>
  );
}

/* ───────────────────────── Overview ───────────────────────── */

function Overview({ mode, current, onPick }: { mode: Mode; current: string; onPick: (v: Variant) => void }) {
  return (
    <Panel className="overflow-hidden">
      {/* No side padding while the table scrolls, or the sticky column leaves a strip for cells to show through. */}
      <div className="overflow-x-auto py-2 md:p-3">
        <table className="w-full min-w-[620px] border-separate border-spacing-[2px] text-xs">
          <thead>
            <tr className="text-black/70">
              <th scope="col" className="sticky left-0 z-10 bg-white px-2 py-1.5 text-left font-bold">
                Base model
              </th>
              <th scope="col" className="px-2 py-1.5 text-right font-bold">
                {thai.flag} Thai price
              </th>
              {abroad.map((c) => (
                <th key={c.code} scope="col" className="px-1 py-1.5 text-center font-bold">
                  <span className="block text-base leading-none">{c.flag}</span>
                  {c.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <DeviceRows
                key={device.id}
                device={device.id}
                name={device.name}
                rows={variants.filter((v) => v.device === device.id)}
                mode={mode}
                current={current}
                onPick={onPick}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t-[3px] border-black px-3 py-2.5 text-[11px] font-bold text-black">
        <span>vs. Thailand:</span>
        <div className="flex flex-wrap items-center gap-[2px]">
          <span className="mr-1">← cheaper</span>
          {steps.map((s) => (
            <span key={s.max} className={`px-1.5 py-0.5 tabular-nums ${s.cell}`}>
              {s.label}
            </span>
          ))}
          <span className="ml-1">pricier →</span>
        </div>
      </div>
    </Panel>
  );
}

function DeviceRows({
  device,
  name,
  rows,
  mode,
  current,
  onPick,
}: {
  device: Device;
  name: string;
  rows: Variant[];
  mode: Mode;
  current: string;
  onPick: (v: Variant) => void;
}) {
  return (
    <>
      <tr>
        <th scope="colgroup" colSpan={abroad.length + 2} className="px-2 pb-1 pt-4 text-left">
          {/* The label sticks, not the cell: the cell spans the whole table, so it would scroll away. */}
          <span className={`sticky left-2 inline-flex items-center gap-2 ${display} text-xl leading-none text-black`}>
            <DeviceArt device={device} className="h-5 w-8 text-black" />
            {name}
          </span>
        </th>
      </tr>
      {rows.map((v) => {
        const home = thbPrice(v, {}, thai, mode);
        const active = v.id === current;
        return (
          <tr key={v.id}>
            <th scope="row" className="sticky left-0 z-10 bg-white p-0 text-left font-normal">
              <button
                onClick={() => onPick(v)}
                className={`w-full px-2 py-1.5 text-left text-black transition-colors ${active ? "bg-[#FFD400] font-bold shadow-[inset_0_0_0_2px_#000]" : "hover:bg-[#FFD400]/40"}`}
              >
                {variantName(v).replace(`${name} `, "")}
                {/* Stacks under the name on phones, so the sticky column leaves room to scroll the countries. */}
                <span className="block whitespace-nowrap text-[10px] font-normal text-black/60 sm:ml-1.5 sm:inline">{specChips(v, {}).slice(0, 2).join(" · ")}</span>
              </button>
            </th>
            <td className="whitespace-nowrap px-2 py-1.5 text-right font-bold tabular-nums text-black">{home == null ? "—" : baht(home)}</td>
            {abroad.map((c) => {
              const d = diffFromThai(v, {}, c, mode);
              const there = thbPrice(v, {}, c, mode);
              if (d == null || there == null) {
                return (
                  <td key={c.code} className="px-1 py-1.5 text-center font-bold text-black/60" style={halftone("rgba(0,0,0,0.18)", 5)}>
                    —
                  </td>
                );
              }
              return (
                <td
                  key={c.code}
                  title={`${variantName(v)} in ${c.name}: ${local(configPrice(v, {}, c.code)!, c)} ≈ ${baht(there)}`}
                  className={`px-1 py-1.5 text-center font-bold tabular-nums text-black transition-shadow hover:shadow-[inset_0_0_0_2px_#000] ${stepFor(d).cell}`}
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

/* ───────────────────────── Dialog ───────────────────────── */

function Section({ label, children, className }: { label: string; children: ReactNode; className: string }) {
  return (
    <fieldset>
      <legend className={`mb-2.5 ${display} text-xl leading-none text-black`}>{label}</legend>
      <div role="radiogroup" aria-label={label} className={`grid gap-2.5 ${className}`}>
        {children}
      </div>
    </fieldset>
  );
}

function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button role="radio" aria-checked={selected} onClick={onClick} className={`min-w-0 px-3 py-2 text-left ${choice(selected)}`}>
      {children}
    </button>
  );
}

/** Mounted fresh each time the dialog opens, so the draft starts from the current configuration. */
function ConfigForm({ initial, onApply, onClose }: { initial: Selection; onApply: (s: Selection) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(initial);
  const variant = variantById(draft.variantId);
  const sameDevice = variants.filter((v) => v.device === variant.device);
  const sizes = [...new Set(sameDevice.map((v) => v.size).filter((s): s is string => Boolean(s)))];
  const chips = sameDevice.filter((v) => v.size === variant.size);
  const home = configPrice(variant, draft.picks, "TH");
  const best = rowsFor(variant, draft.picks, "shelf")[0];

  const pickDevice = (device: Device) => {
    if (device !== variant.device) setDraft(switchVariant(variants.find((v) => v.device === device)!, draft.picks));
  };
  const pickSize = (size: string) => {
    const next = sameDevice.find((v) => v.size === size && v.chip === variant.chip) ?? sameDevice.find((v) => v.size === size)!;
    setDraft(switchVariant(next, draft.picks));
  };

  return (
    <div className="flex max-h-[inherit] flex-col">
      <div
        className="flex items-center justify-between gap-4 border-b-[3px] border-black px-5 py-3"
        style={{ backgroundColor: INK.yellow, ...halftone("rgba(0,0,0,0.12)", 6) }}
      >
        <h2 className={`${display} -rotate-1 text-3xl leading-none text-black`}>Customize</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className={`bg-white p-1 text-black ${ink} shadow-[2px_2px_0_0_#000] transition-transform hover:rotate-90 motion-reduce:transition-none`}
        >
          <X className="h-5 w-5" strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-6 pt-4">
        <Section label="Device" className="grid-cols-3">
          {devices.map((d) => {
            const selected = d.id === variant.device;
            return (
              <button
                key={d.id}
                role="radio"
                aria-checked={selected}
                onClick={() => pickDevice(d.id)}
                className={`flex min-w-0 flex-col items-center gap-1 px-2 pb-2.5 pt-3 text-center text-xs font-bold leading-tight ${choice(selected)}`}
              >
                <DeviceArt device={d.id} className="h-9 w-14" />
                {d.name}
              </button>
            );
          })}
        </Section>

        {sizes.length > 1 && (
          <Section label="Size" className="grid-cols-2">
            {sizes.map((size) => (
              <Pill key={size} selected={size === variant.size} onClick={() => pickSize(size)}>
                <span className="text-sm font-bold">{sizeLabel(size)}</span>
              </Pill>
            ))}
          </Section>
        )}

        <Section label={variant.device === "iphone" ? "Model" : "Chip"} className={variant.device === "iphone" ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}>
          {chips.map((v) => {
            const chip = chipLabel(v.chip);
            return (
              <Pill key={v.id} selected={v.id === variant.id} onClick={() => setDraft(switchVariant(v, draft.picks))}>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-bold">{chip.name}</span>
                  {v.price.TH != null && <span className="text-[11px] font-bold tabular-nums text-black/70">{baht(v.price.TH)}</span>}
                </span>
                {chip.cores && <span className="block text-[11px] text-black/70">{chip.cores}</span>}
              </Pill>
            );
          })}
        </Section>

        {groupsOf(variant).map((group) => {
          const current = draft.picks[group] ?? defaultPick(variant, group);
          const opts = variant.options[group]!;
          return (
            <Section key={group} label={groupLabels[group]} className={opts.length > 3 ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-3"}>
              {opts.map((o) => {
                const delta = o.delta.TH;
                return (
                  <Pill key={o.value} selected={o.value === current} onClick={() => setDraft({ ...draft, picks: { ...draft.picks, [group]: o.value } })}>
                    <span className="block text-sm font-bold">{optionLabel(group, o.value).replace(" display", "")}</span>
                    <span className="block text-[11px] tabular-nums text-black/70">{delta == null ? "—" : delta === 0 ? "Base" : `+${baht(delta)}`}</span>
                  </Pill>
                );
              })}
            </Section>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t-[3px] border-black bg-[#FFF4DC] px-5 py-3.5">
        <div className="min-w-0">
          <p className={`${display} text-2xl leading-none text-black`}>
            <span className="mr-1.5 text-lg">{thai.flag}</span>
            {home == null ? "Not sold" : baht(home)}
          </p>
          {home != null && best?.thb != null && (
            <p className="mt-1 truncate text-[11px] font-bold text-black/70">
              {best.thb < home ? `${best.country.flag} ${percent(best.thb / home - 1)} in ${best.country.short}` : "Cheapest in Thailand"}
            </p>
          )}
        </div>
        <button onClick={() => onApply(draft)} className={buttonClass("md", "shrink-0 bg-[#FF3B30] text-white")} style={lettering(1.5, 2)}>
          Compare prices
        </button>
      </div>
    </div>
  );
}

function ConfigDialog({
  open,
  formKey,
  initial,
  onApply,
  onClose,
}: {
  open: boolean;
  formKey: number;
  initial: Selection;
  onApply: (s: Selection) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click that lands on the dialog element itself is a click on the backdrop.
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label="Customize"
      className={`m-auto max-h-[88dvh] w-[calc(100%-1.5rem)] max-w-lg overflow-hidden bg-white p-0 text-black ${ink} shadow-[6px_6px_0_0_#000] backdrop:bg-black/40 backdrop:[background-image:radial-gradient(rgba(0,0,0,0.5)_1.3px,transparent_1.7px)] backdrop:[background-size:6px_6px] open:animate-in open:fade-in open:zoom-in-90 open:duration-300 open:[animation-timing-function:cubic-bezier(.2,.9,.3,1.4)] motion-reduce:open:animate-none`}
    >
      {open && <ConfigForm key={formKey} initial={initial} onApply={onApply} onClose={onClose} />}
    </dialog>
  );
}

/* ───────────────────────── Page section ───────────────────────── */

export function Comparison() {
  const [selection, setSelection] = useState<Selection>({ variantId: "macbook-pro/14inch/m6-12-12", picks: {} });
  const [mode, setMode] = useState<Mode>("shelf");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const resultRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const variant = variantById(selection.variantId);

  const openDialog = () => {
    setFormKey((k) => k + 1);
    setDialogOpen(true);
  };

  const apply = (next: Selection) => {
    setSelection(next);
    setDialogOpen(false);
    resultRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="space-y-16">
      <section ref={resultRef} aria-label="Price for your configuration" className="scroll-mt-6">
        <ResultPanel variant={variant} picks={selection.picks} mode={mode} setMode={setMode} onEdit={openDialog} />
      </section>

      <section className="space-y-6">
        <Reveal>
          <SectionTitle title="Every model at a glance" sub="Base configurations. Tap a model to price it above." />
        </Reveal>
        <Overview mode={mode} current={selection.variantId} onPick={(v) => apply({ variantId: v.id, picks: {} })} />
      </section>

      <ConfigDialog open={dialogOpen} formKey={formKey} initial={selection} onApply={apply} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
