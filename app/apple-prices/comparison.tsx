"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PlaneLanding, Receipt, SlidersHorizontal, Tag, Trophy, X, type LucideIcon } from "lucide-react";
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
 * Diverging scale: blue arm for cheaper than Thailand, red arm for pricier, grey midpoint for
 * "about the same". Equal steps per arm; the sign is printed alongside, so colour is never the only cue.
 */
const steps = [
  { max: -0.15, cell: "bg-blue-500/50", label: "15%+" },
  { max: -0.07, cell: "bg-blue-500/30", label: "7–15%" },
  { max: -0.02, cell: "bg-blue-500/15", label: "2–7%" },
  { max: 0.02, cell: "bg-gray-700/40", label: "±2%" },
  { max: 0.07, cell: "bg-red-500/15", label: "2–7%" },
  { max: 0.15, cell: "bg-red-500/30", label: "7–15%" },
  { max: Infinity, cell: "bg-red-500/50", label: "15%+" },
];

const stepFor = (d: number) => steps.find((s) => d < s.max) ?? steps[steps.length - 1];

/** Dot colour on the chart: the two arms of the scale, grey when it's within 2% of Thailand. */
const markFor = (d: number) =>
  d <= -0.02 ? { dot: "bg-blue-500", stem: "bg-blue-500/50" } : d >= 0.02 ? { dot: "bg-red-500", stem: "bg-red-500/50" } : { dot: "bg-gray-400", stem: "bg-gray-500/50" };

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

/* ───────────────────────── Result ───────────────────────── */

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div role="radiogroup" aria-label="Price to compare" className="grid grid-cols-3 gap-1 rounded-xl bg-black/40 p-1">
      {modes.map((m) => {
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
              mode === m.id ? "bg-white text-gray-950" : "text-gray-400 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="sm:hidden">{m.short}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function StatTile({ label, icon, value, sub, highlight }: { label: string; icon: ReactNode; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`min-w-0 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 ${highlight ? "bg-blue-500/15" : "bg-black/30"}`}>
      <p className="flex items-center gap-1.5 truncate text-[11px] uppercase tracking-widest text-gray-400">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-xl font-light tabular-nums text-white sm:text-2xl">{value}</p>
      <p className="truncate text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function StatTiles({ home, best }: { home: number | null; best: Row | undefined }) {
  const cheaperAbroad = home != null && best?.thb != null && best.thb < home;
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatTile label="Thailand" icon={<span>{thai.flag}</span>} value={home == null ? "Not sold" : baht(home)} sub="Apple Thailand" />
      {cheaperAbroad ? (
        <StatTile
          label={best!.country.short}
          icon={<span>{best!.country.flag}</span>}
          value={baht(best!.thb!)}
          sub={`Best deal: save ${baht(home! - best!.thb!)}`}
          highlight
        />
      ) : (
        <StatTile label="Best deal" icon={<Trophy className="h-3 w-3" />} value="Thailand" sub="Nowhere here beats it" />
      )}
    </div>
  );
}

/** Dot plot: Thailand is the centre line, each country sits left (cheaper) or right (pricier) of it. */
function PriceChart({ rows, home }: { rows: Row[]; home: number | null }) {
  const widest = Math.max(0.05, ...rows.map((r) => Math.abs(r.diff ?? 0)));
  const domain = Math.ceil((widest + 0.01) * 20) / 20;
  const pos = (d: number) => 50 + (Math.max(-domain, Math.min(domain, d)) / domain) * 50;
  const cols = "grid grid-cols-[6.25rem_1fr_5rem] items-center gap-x-3 sm:grid-cols-[8rem_1fr_7rem]";

  return (
    <figure aria-label="Price in each country compared with Thailand">
      <div className={`${cols} pb-1 text-[11px] text-gray-500`}>
        <span />
        <div className="flex justify-center">
          <span className="whitespace-nowrap text-gray-300">
            {thai.flag} {home == null ? "Thailand" : baht(home)}
          </span>
        </div>
        <span />
      </div>

      <ul>
        {rows.map(({ country, local: price, thb, diff }) => {
          const mark = diff == null ? null : markFor(diff);
          const p = diff == null ? 50 : pos(diff);
          return (
            <li
              key={country.code}
              className={`${cols} rounded-lg transition-colors hover:bg-white/[0.03]`}
              title={thb != null && price != null ? `${country.name}: ${local(price, country)} ≈ ${baht(thb)}` : undefined}
            >
              <span className="flex items-center gap-2 whitespace-nowrap pl-1 text-sm text-gray-200">
                <span aria-hidden>{country.flag}</span>
                {country.short}
              </span>
              <div className="relative h-10">
                <span className="absolute inset-y-0 left-1/4 w-px bg-white/[0.04]" />
                <span className="absolute inset-y-0 left-3/4 w-px bg-white/[0.04]" />
                <span className="absolute inset-y-0 left-1/2 w-px bg-gray-500/70" />
                {mark && diff != null ? (
                  <>
                    <span
                      className={`absolute top-1/2 h-0.5 -translate-y-1/2 ${mark.stem}`}
                      style={{ left: `${Math.min(p, 50)}%`, width: `${Math.abs(p - 50)}%` }}
                    />
                    <span
                      className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-gray-950 ${mark.dot}`}
                      style={{ left: `${p}%` }}
                    />
                  </>
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">Not sold</span>
                )}
              </div>
              <span className="pr-1 text-right">
                {thb != null && diff != null && (
                  <>
                    <span className="block text-sm tabular-nums text-gray-100">{baht(thb)}</span>
                    <span className={`inline-block rounded px-1 text-[11px] tabular-nums text-gray-100 ${stepFor(diff).cell}`}>
                      {percent(diff)}
                    </span>
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div className={`${cols} pt-1 text-[10px] tabular-nums text-gray-600`}>
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

      <figcaption className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-gray-400">
        {[
          { dot: "bg-blue-500", label: "Cheaper than Thailand" },
          { dot: "bg-gray-400", label: "Within 2%" },
          { dot: "bg-red-500", label: "Pricier" },
        ].map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${l.dot}`} />
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

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/50 shadow-2xl shadow-black/40">
      <div className="h-[2px] bg-gradient-to-r from-blue-500 via-gray-500 to-red-500" />

      {/* What you're pricing */}
      <div className="flex items-center gap-4 p-4 sm:p-5">
        <button
          onClick={onEdit}
          aria-label="Change device"
          className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl bg-black/30 text-gray-200 transition-colors hover:bg-black/50 sm:h-20 sm:w-28"
        >
          <DeviceArt device={variant.device} wide={isWide(variant)} className="w-14 sm:w-20" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-medium leading-snug text-white sm:text-xl">{variantName(variant)}</h2>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {[chip.cores, ...specChips(variant, picks)].filter(Boolean).map((c) => (
              <span key={c} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-gray-300">
                {c}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="hidden shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200 sm:inline-flex"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Customize
        </button>
      </div>
      <div className="px-4 pb-4 sm:hidden">
        <button
          onClick={onEdit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-gray-950"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Customize
        </button>
      </div>

      <div className="space-y-4 border-t border-gray-800/80 p-4 sm:p-5">
        <div className="space-y-2">
          <ModeSwitch mode={mode} setMode={setMode} />
          <p className="text-xs leading-relaxed text-gray-500">{modes.find((m) => m.id === mode)!.blurb}</p>
        </div>
        <StatTiles home={home} best={rows.find((r) => r.thb != null)} />
        <PriceChart rows={rows} home={home} />
        {note && <p className="text-xs leading-relaxed text-gray-500">{note}</p>}
      </div>
    </div>
  );
}

/* ───────────────────────── Overview ───────────────────────── */

function Overview({ mode, current, onPick }: { mode: Mode; current: string; onPick: (v: Variant) => void }) {
  return (
    <div className="space-y-3">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[620px] border-separate border-spacing-[2px] text-xs">
          <thead>
            <tr className="text-gray-500">
              <th scope="col" className="sticky left-0 z-10 bg-gray-950 px-2 py-1.5 text-left font-medium">
                Base model
              </th>
              <th scope="col" className="px-2 py-1.5 text-right font-medium">
                {thai.flag} Thai price
              </th>
              {abroad.map((c) => (
                <th key={c.code} scope="col" className="px-1 py-1.5 text-center font-medium">
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

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-gray-500">
        <span>vs. Thailand:</span>
        <div className="flex flex-wrap items-center gap-[2px]">
          <span className="mr-1">← cheaper</span>
          {steps.map((s) => (
            <span key={s.max} className={`rounded px-1.5 py-0.5 text-gray-200 ${s.cell}`}>
              {s.label}
            </span>
          ))}
          <span className="ml-1">pricier →</span>
        </div>
      </div>
    </div>
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
        <th
          scope="colgroup"
          colSpan={abroad.length + 2}
          className="sticky left-0 bg-gray-950 px-2 pb-1 pt-4 text-left text-[11px] font-medium uppercase tracking-widest text-gray-500"
        >
          <span className="inline-flex items-center gap-2">
            <DeviceArt device={device} className="h-4 w-6" />
            {name}
          </span>
        </th>
      </tr>
      {rows.map((v) => {
        const home = thbPrice(v, {}, thai, mode);
        const active = v.id === current;
        return (
          <tr key={v.id}>
            <th scope="row" className="sticky left-0 z-10 bg-gray-950 p-0 text-left font-normal">
              <button
                onClick={() => onPick(v)}
                className={`w-full rounded px-2 py-1.5 text-left transition-colors ${active ? "bg-white/10 text-white" : "text-gray-200 hover:bg-white/5"}`}
              >
                {variantName(v).replace(`${name} `, "")}
                <span className="ml-1.5 text-[10px] text-gray-500">{specChips(v, {}).slice(0, 2).join(" · ")}</span>
              </button>
            </th>
            <td className="whitespace-nowrap px-2 py-1.5 text-right tabular-nums text-gray-300">{home == null ? "—" : baht(home)}</td>
            {abroad.map((c) => {
              const d = diffFromThai(v, {}, c, mode);
              const there = thbPrice(v, {}, c, mode);
              if (d == null || there == null) {
                return (
                  <td key={c.code} className="rounded bg-gray-900/40 px-1 py-1.5 text-center text-gray-600">
                    —
                  </td>
                );
              }
              return (
                <td
                  key={c.code}
                  title={`${variantName(v)} in ${c.name}: ${local(configPrice(v, {}, c.code)!, c)} ≈ ${baht(there)}`}
                  className={`rounded px-1 py-1.5 text-center tabular-nums text-gray-100 ${stepFor(d).cell}`}
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
      <legend className="mb-2 text-[11px] font-medium uppercase tracking-widest text-gray-500">{label}</legend>
      <div role="radiogroup" aria-label={label} className={`grid gap-1.5 ${className}`}>
        {children}
      </div>
    </fieldset>
  );
}

function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-left transition-colors ${
        selected ? "border-white/80 bg-white/10" : "border-gray-800 bg-gray-900/60 hover:border-gray-600"
      }`}
    >
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
      <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-4">
        <h2 className="text-base font-medium text-white">Customize</h2>
        <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-5 pt-2">
        <Section label="Device" className="grid-cols-3">
          {devices.map((d) => {
            const selected = d.id === variant.device;
            return (
              <button
                key={d.id}
                role="radio"
                aria-checked={selected}
                onClick={() => pickDevice(d.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 pb-2.5 pt-3 text-xs transition-colors ${
                  selected ? "border-white/80 bg-white/10 text-white" : "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                }`}
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
                <span className="text-sm text-white">{sizeLabel(size)}</span>
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
                  <span className="text-sm text-white">{chip.name}</span>
                  {v.price.TH != null && <span className="text-[11px] tabular-nums text-gray-500">{baht(v.price.TH)}</span>}
                </span>
                {chip.cores && <span className="block text-[11px] text-gray-400">{chip.cores}</span>}
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
                    <span className="block text-sm text-white">{optionLabel(group, o.value).replace(" display", "")}</span>
                    <span className="block text-[11px] tabular-nums text-gray-500">{delta == null ? "—" : delta === 0 ? "Base" : `+${baht(delta)}`}</span>
                  </Pill>
                );
              })}
            </Section>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-800 bg-black/40 px-5 py-3.5">
        <div className="min-w-0">
          <p className="text-lg tabular-nums text-white">
            <span className="mr-1.5 text-base">{thai.flag}</span>
            {home == null ? "Not sold" : baht(home)}
          </p>
          {home != null && best?.thb != null && (
            <p className="truncate text-[11px] text-gray-400">
              {best.thb < home ? `${best.country.flag} ${percent(best.thb / home - 1)} in ${best.country.short}` : "Cheapest in Thailand"}
            </p>
          )}
        </div>
        <button
          onClick={() => onApply(draft)}
          className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
        >
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
      className="m-auto max-h-[88dvh] w-[calc(100%-1.5rem)] max-w-lg overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 p-0 text-gray-100 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
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
  const variant = variantById(selection.variantId);

  const openDialog = () => {
    setFormKey((k) => k + 1);
    setDialogOpen(true);
  };

  const apply = (next: Selection) => {
    setSelection(next);
    setDialogOpen(false);
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-12">
      <section ref={resultRef} aria-label="Price for your configuration" className="scroll-mt-6">
        <ResultPanel variant={variant} picks={selection.picks} mode={mode} setMode={setMode} onEdit={openDialog} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-light tracking-tight text-white">Every model at a glance</h2>
          <p className="text-xs text-gray-500">Base configurations. Tap a model to price it above.</p>
        </div>
        <Overview mode={mode} current={selection.variantId} onPick={(v) => apply({ variantId: v.id, picks: {} })} />
      </section>

      <ConfigDialog open={dialogOpen} formKey={formKey} initial={selection} onApply={apply} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
