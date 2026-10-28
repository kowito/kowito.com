"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Laptop, Server, SlidersHorizontal, Smartphone, X, type LucideIcon } from "lucide-react";
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

const deviceIcon: Record<Device, LucideIcon> = {
  "macbook-pro": Laptop,
  "mac-mini": Server,
  iphone: Smartphone,
};

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

/** Spec line for a configuration, e.g. "24GB · 1TB · Nano-texture". */
const specLine = (v: Variant, picks: Picks) =>
  groupsOf(v)
    .map((g) => optionLabel(g, picks[g] ?? defaultPick(v, g)))
    .join(" · ");

/** Moves to another variant, keeping each pick the new variant also offers. */
function switchVariant(v: Variant, picks: Picks): Selection {
  const kept: Picks = {};
  for (const g of groupsOf(v)) {
    if (picks[g] && v.options[g]!.some((o) => o.value === picks[g])) kept[g] = picks[g];
  }
  return { variantId: v.id, picks: kept };
}

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

function OptionButton({
  selected,
  onClick,
  title,
  detail,
  price,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  detail?: string;
  price?: string;
}) {
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        selected ? "border-white bg-white/10" : "border-gray-800 bg-gray-900/60 hover:border-gray-600"
      }`}
    >
      <span>
        <span className="block text-sm text-white">{title}</span>
        {detail && <span className="block text-xs text-gray-400">{detail}</span>}
      </span>
      {price && <span className="shrink-0 text-xs tabular-nums text-gray-400">{price}</span>}
    </button>
  );
}

function OptionSection({ label, children, cols = 2 }: { label: string; children: ReactNode; cols?: 1 | 2 | 3 }) {
  const grid = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-3" }[cols];
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">{label}</legend>
      <div role="radiogroup" aria-label={label} className={`grid gap-2 ${grid}`}>
        {children}
      </div>
    </fieldset>
  );
}

/** The configurator. Mounted fresh each time the dialog opens, so its draft starts from the current pick. */
function ConfigForm({ initial, onApply, onClose }: { initial: Selection; onApply: (s: Selection) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(initial);
  const variant = variantById(draft.variantId);
  const sameDevice = variants.filter((v) => v.device === variant.device);
  const sizes = [...new Set(sameDevice.map((v) => v.size).filter((s): s is string => Boolean(s)))];
  const chips = sameDevice.filter((v) => v.size === variant.size);
  const thaiPrice = configPrice(variant, draft.picks, "TH");

  const pickDevice = (device: Device) => {
    if (device !== variant.device) setDraft(switchVariant(variants.find((v) => v.device === device)!, draft.picks));
  };
  const pickSize = (size: string) => {
    const next = sameDevice.find((v) => v.size === size && v.chip === variant.chip) ?? sameDevice.find((v) => v.size === size)!;
    setDraft(switchVariant(next, draft.picks));
  };

  return (
    <div className="flex max-h-[inherit] flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-gray-800 px-5 py-4">
        <h2 className="text-lg font-medium text-white">Choose a configuration</h2>
        <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <OptionSection label="Device" cols={3}>
          {devices.map((d) => {
            const Icon = deviceIcon[d.id];
            const selected = d.id === variant.device;
            return (
              <button
                key={d.id}
                role="radio"
                aria-checked={selected}
                onClick={() => pickDevice(d.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-xs transition-colors sm:text-sm ${
                  selected ? "border-white bg-white/10 text-white" : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600"
                }`}
              >
                <Icon className="h-5 w-5" />
                {d.name}
              </button>
            );
          })}
        </OptionSection>

        {sizes.length > 1 && (
          <OptionSection label="Size">
            {sizes.map((size) => (
              <OptionButton key={size} selected={size === variant.size} onClick={() => pickSize(size)} title={sizeLabel(size)} />
            ))}
          </OptionSection>
        )}

        <OptionSection label={variant.device === "iphone" ? "Model" : "Chip"} cols={variant.device === "iphone" ? 2 : 1}>
          {chips.map((v) => {
            const chip = chipLabel(v.chip);
            return (
              <OptionButton
                key={v.id}
                selected={v.id === variant.id}
                onClick={() => setDraft(switchVariant(v, draft.picks))}
                title={chip.name}
                detail={chip.cores}
                price={v.price.TH != null ? `from ${baht(v.price.TH)}` : undefined}
              />
            );
          })}
        </OptionSection>

        {groupsOf(variant).map((group) => {
          const current = draft.picks[group] ?? defaultPick(variant, group);
          const base = variant.options[group]!.find((o) => o.value === current)?.delta.TH ?? 0;
          return (
            <OptionSection key={group} label={groupLabels[group]}>
              {variant.options[group]!.map((o) => {
                const step = o.delta.TH != null ? o.delta.TH - base : null;
                return (
                  <OptionButton
                    key={o.value}
                    selected={o.value === current}
                    onClick={() => setDraft({ ...draft, picks: { ...draft.picks, [group]: o.value } })}
                    title={optionLabel(group, o.value)}
                    price={step == null ? undefined : step === 0 ? undefined : `${step > 0 ? "+" : "−"}${baht(Math.abs(step))}`}
                  />
                );
              })}
            </OptionSection>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-gray-800 bg-gray-950/80 px-5 py-4">
        <div>
          <p className="text-xs text-gray-400">{thai.flag} In Thailand</p>
          <p className="text-lg tabular-nums text-white">{thaiPrice == null ? "Not sold" : baht(thaiPrice)}</p>
        </div>
        <button
          onClick={() => onApply(draft)}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
        >
          <Check className="h-4 w-4" />
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
      aria-label="Choose a configuration"
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 p-0 text-gray-100 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {open && <ConfigForm key={formKey} initial={initial} onApply={onApply} onClose={onClose} />}
    </dialog>
  );
}

function Summary({ variant, picks, onEdit }: { variant: Variant; picks: Picks; onEdit: () => void }) {
  const Icon = deviceIcon[variant.device];
  const chip = chipLabel(variant.chip);
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-gray-300">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-medium text-white">{variantName(variant)}</h2>
          <p className="mt-0.5 text-sm text-gray-400">{[chip.cores, specLine(variant, picks)].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Change configuration
      </button>
    </div>
  );
}

function PriceList({ variant, picks, mode }: { variant: Variant; picks: Picks; mode: Mode }) {
  const rows = countries.map((c) => ({
    country: c,
    local: configPrice(variant, picks, c.code),
    thb: thbPrice(variant, picks, c, mode),
    diff: diffFromThai(variant, picks, c, mode),
  }));
  const priced = rows.filter((r) => r.thb != null);
  const cheapest = priced.reduce((best, r) => (r.thb! < best.thb! ? r : best), priced[0]);
  const home = rows.find((r) => r.country.code === "TH")!;
  const note = variantNotes[variant.id];

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4 sm:p-5">
      <p className="text-sm leading-relaxed text-gray-300">
        {home.thb == null || cheapest == null ? (
          "Apple Thailand doesn't sell this configuration."
        ) : cheapest.country.code === "TH" ? (
          <>
            <span className="text-white">Thailand is the cheapest place</span> to buy this configuration.
          </>
        ) : (
          <>
            Cheapest in <span className="text-white">{cheapest.country.name}</span>:{" "}
            <span className="text-white">{baht(home.thb - cheapest.thb!)}</span> less than in Thailand.
          </>
        )}
      </p>

      <ul className="mt-5 space-y-3">
        {rows.map(({ country, local: price, thb, diff }) => {
          const isHome = country.code === "TH";
          return (
            <li key={country.code} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[12rem_1fr_9rem]">
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span aria-hidden>{country.flag}</span>
                <span className={isHome ? "text-white" : "text-gray-300"}>{country.name}</span>
                {thb != null && cheapest && thb === cheapest.thb && (
                  <span className="rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-200">
                    Cheapest
                  </span>
                )}
              </div>

              {/* Diverging bar around the Thai price: left = cheaper, right = pricier. */}
              <div aria-hidden className="relative order-last col-span-2 h-2 sm:order-none sm:col-span-1">
                <div className="absolute inset-y-0 left-1/2 w-px bg-gray-600" />
                {!isHome && diff != null && (
                  <div
                    className={`absolute inset-y-0 ${diff < 0 ? "right-1/2 rounded-l bg-blue-500" : "left-1/2 rounded-r bg-red-500"}`}
                    style={{ width: `${(Math.min(Math.abs(diff), 0.25) / 0.25) * 50}%` }}
                  />
                )}
              </div>

              <div className="text-right">
                {thb == null || price == null ? (
                  <p className="text-sm text-gray-500">Not sold</p>
                ) : (
                  <>
                    <p className="tabular-nums text-gray-100">{baht(thb)}</p>
                    <p className="text-xs tabular-nums text-gray-500">
                      {isHome ? "baseline" : `${local(price, country)}${diff != null ? ` · ${percent(diff)}` : ""}`}
                    </p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {note && <p className="mt-5 border-t border-gray-800 pt-3 text-xs leading-relaxed text-gray-500">{note}</p>}
    </div>
  );
}

function Overview({ mode, onPick }: { mode: Mode; onPick: (v: Variant) => void }) {
  return (
    <div className="space-y-4">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[680px] border-separate border-spacing-[2px] text-sm">
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
            {devices.map((device) => {
              const Icon = deviceIcon[device.id];
              return (
                <DeviceRows key={device.id} icon={Icon} name={device.name} rows={variants.filter((v) => v.device === device.id)} mode={mode} onPick={onPick} />
              );
            })}
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

function DeviceRows({
  icon: Icon,
  name,
  rows,
  mode,
  onPick,
}: {
  icon: LucideIcon;
  name: string;
  rows: Variant[];
  mode: Mode;
  onPick: (v: Variant) => void;
}) {
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
            {name}
          </span>
        </th>
      </tr>
      {rows.map((v) => {
        const home = thbPrice(v, {}, thai, mode);
        return (
          <tr key={v.id}>
            <th scope="row" className="sticky left-0 z-10 bg-gray-950 px-3 py-2 text-left font-normal">
              <button onClick={() => onPick(v)} className="text-left text-gray-100 hover:text-white hover:underline">
                {variantName(v).replace(`${name} `, "")}
                <span className="block text-[11px] text-gray-500">{specLine(v, {})}</span>
              </button>
            </th>
            <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-300">{home == null ? "—" : baht(home)}</td>
            {abroad.map((c) => {
              const d = diffFromThai(v, {}, c, mode);
              const there = thbPrice(v, {}, c, mode);
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
                  title={`${variantName(v)} in ${c.name}: ${local(configPrice(v, {}, c.code)!, c)} ≈ ${baht(there)}`}
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
    <div className="space-y-14">
      <section ref={resultRef} aria-label="Price for your configuration" className="scroll-mt-6 space-y-6">
        <Summary variant={variant} picks={selection.picks} onEdit={openDialog} />
        <ModeToggle mode={mode} setMode={setMode} />
        <PriceList variant={variant} picks={selection.picks} mode={mode} />
      </section>

      <section className="space-y-5 border-t border-gray-800/60 pt-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-light tracking-tight text-white md:text-3xl">Starting prices at a glance</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
            Every model in its base configuration, against the Thai price. Pick one to load it above, then change the
            configuration from there.
          </p>
        </div>
        <Overview mode={mode} onPick={(v) => apply({ variantId: v.id, picks: {} })} />
      </section>

      <ConfigDialog open={dialogOpen} formKey={formKey} initial={selection} onApply={apply} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
