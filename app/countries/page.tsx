"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SiteFooter } from "@/components/site-footer";
import { Burst, Caption, INK, RED_TEXT, SiteHeader, display, halftone, hardShadow, ink, lettering, press, tilts } from "@/components/comic";
import { Reveal, useCountUp, useReducedMotion } from "@/components/comic-motion";
import { ChevronLeft, ChevronRight, MapPin, Pause, Plane, Play, X } from "lucide-react";
import { countries, distanceKm, flagOf, home, type Country } from "./data";
import { matches, type Filter } from "./globe";
import { Landmark } from "./landmarks";

const Globe = dynamic(() => import("./globe").then((mod) => ({ default: mod.Globe })), {
  ssr: false,
  loading: () => <div className="absolute inset-[12px] animate-pulse rounded-full border-[3px] border-black bg-sky-400" />,
});

const visited = countries.filter((c) => c.visited);
const wishlist = countries.filter((c) => !c.visited);
const citiesVisited = visited.reduce((n, c) => n + c.cities.length, 0);
const distanceFromHome = (c: Country) => Math.round(distanceKm(home, c.cities[0]));
const furthest = visited.reduce((best, c) => (distanceFromHome(c) > distanceFromHome(best) ? c : best), visited[0]);

const filters: { id: Filter; label: string; count: number }[] = [
  { id: "all", label: "All", count: countries.length },
  { id: "visited", label: "Been", count: visited.length },
  { id: "wishlist", label: "Someday", count: wishlist.length },
];

const TOUR_STEP_MS = 5000;

/* ───────────────────────── Comic pieces ───────────────────────── */

const SOUNDS = ["WHOOSH!", "ZOOM!", "SWOOSH!", "VROOM!", "KA-POW!", "ZIP!", "WHAM!"];
const soundFor = (code: string) => SOUNDS[(code.charCodeAt(0) * 7 + code.charCodeAt(1)) % SOUNDS.length];

function Stamp({ country, className = "" }: { country: Country; className?: string }) {
  const color = country.visited ? INK.red : "#000";
  return (
    <span
      className={`inline-block shrink-0 rotate-[-8deg] border-[2.5px] bg-white px-1.5 py-0.5 ${display} text-sm leading-none ${className}`}
      style={{ color, borderColor: color, outline: `1.5px solid ${color}`, outlineOffset: "2px" }}
    >
      {country.visited ? "Visited!" : "Someday…"}
    </span>
  );
}

function Stat({ value, label, suffix = "", delay, bg, light }: { value: number; label: string; suffix?: string; delay: number; bg: string; light?: boolean }) {
  const n = useCountUp(value, 1600, delay);
  return (
    <div className={`min-w-0 px-2.5 py-2 ${ink} ${hardShadow}`} style={{ backgroundColor: bg, ...halftone("rgba(0,0,0,0.14)", 6) }}>
      <p className={`${display} text-3xl leading-none sm:text-4xl ${light ? "text-white" : "text-black"}`} style={light ? lettering(1.5, 2) : undefined}>
        {Math.round(n).toLocaleString("en-US")}
        {suffix && <span className="ml-0.5 text-base">{suffix}</span>}
      </p>
      <p className={`mt-1 truncate text-[10px] font-bold uppercase tracking-wider ${light ? "text-white" : "text-black"}`}>{label}</p>
    </div>
  );
}

function ProgressBar() {
  const n = useCountUp(visited.length, 1800, 300);
  const share = n / countries.length;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className={`${display} text-2xl leading-none text-black`}>{Math.round(share * 100)}% stamped!</p>
        <p className="text-xs font-bold text-black/60">
          {visited.length} of {countries.length} countries
        </p>
      </div>
      <div className={`h-6 overflow-hidden bg-white ${ink} ${hardShadow}`}>
        <div
          className="h-full animate-stripes border-r-[3px] border-black motion-reduce:animate-none"
          style={{ width: `${share * 100}%`, background: `repeating-linear-gradient(45deg, ${INK.red} 0 10px, #FF7A70 10px 20px)`, backgroundSize: "28px 100%" }}
        />
      </div>
    </div>
  );
}

function FilterSwitch({ filter, onChange }: { filter: Filter; onChange: (f: Filter) => void }) {
  return (
    <div role="radiogroup" aria-label="Show countries" className="grid grid-cols-3 gap-2.5">
      {filters.map((f) => {
        const on = filter === f.id;
        return (
          <button
            key={f.id}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(f.id)}
            className={`${ink} px-2 py-1.5 ${display} text-lg leading-tight text-black transition-[transform,box-shadow,background-color] duration-150 ${
              on ? "translate-x-[3px] translate-y-[3px] bg-[#FFD400] shadow-[2px_2px_0_0_#000]" : `bg-white ${hardShadow} hover:-translate-y-0.5`
            }`}
          >
            {f.label} <span className="text-sm opacity-60">{f.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function SpeechBubble({
  country,
  position,
  total,
  onPrev,
  onNext,
  onClose,
}: {
  country: Country;
  position: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const km = useCountUp(distanceFromHome(country), 1200);
  const navButton = `inline-flex items-center gap-0.5 bg-white px-2.5 py-1 ${display} text-base ${ink} shadow-[3px_3px_0_0_#000] ${press}`;
  return (
    <div
      className={`relative rounded-[26px] bg-white p-4 text-black sm:p-5 ${ink} shadow-[6px_6px_0_0_#000] animate-in fade-in zoom-in-75 duration-300 [animation-timing-function:cubic-bezier(.2,.9,.3,1.4)] motion-reduce:animate-none`}
    >
      {/* The bubble's tail, pointing up at the globe. */}
      <span aria-hidden className="absolute -top-[15px] left-16 h-7 w-7 rotate-45 border-l-[3px] border-t-[3px] border-black bg-white" />

      <div className="relative flex items-start gap-3">
        <span className="text-5xl leading-none drop-shadow-[2px_2px_0_#000]">{flagOf(country.code)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className={`${display} text-3xl leading-none sm:text-4xl`}>{country.name}</h2>
            <Stamp country={country} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-bold text-black/70">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {country.cities.map((c) => c.name).join(" · ")}
            </span>
            {country.code !== "TH" && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Plane className="h-3.5 w-3.5" />
                {Math.round(km).toLocaleString("en-US")} km from {home.name}!
              </span>
            )}
          </p>
        </div>
        <button onClick={onClose} aria-label="Close" className={`-mr-1 -mt-1 bg-white p-1 ${ink} shadow-[2px_2px_0_0_#000] transition-transform hover:rotate-90`}>
          <X className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>

      <p className="relative mt-3 line-clamp-3 text-sm leading-relaxed">{country.description}</p>

      <div className="relative mt-3 flex flex-wrap gap-2">
        {country.highlights.map((h, i) => (
          <span
            key={h}
            style={{ animationDelay: `${120 + i * 80}ms`, rotate: `${i % 2 ? 2 : -2}deg` }}
            className="animate-in fade-in zoom-in-50 fill-mode-both border-2 border-black bg-[#FFD400] px-2 py-0.5 text-[11px] font-bold duration-300 motion-reduce:animate-none"
          >
            {h}
          </span>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        <button onClick={onPrev} className={navButton}>
          <ChevronLeft className="h-4 w-4" strokeWidth={3} />
          Prev
        </button>
        <span className={`${display} text-lg tabular-nums`}>
          {position} / {total}
        </span>
        <button onClick={onNext} className={navButton}>
          Next
          <ChevronRight className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

/** A manga panel of the country's landmark, captioned, with the details underneath. */
function CountryPanel({ country, index, active, onSelect }: { country: Country; index: number; active: boolean; onSelect: () => void }) {
  const tilt = tilts[index % tilts.length];
  return (
    <button
      onClick={onSelect}
      className={`group relative block w-full bg-white text-left text-black ${ink} ${hardShadow} ${tilt} transition-[transform,box-shadow] duration-200 hover:z-10 hover:rotate-0 hover:scale-[1.04] hover:shadow-[9px_9px_0_0_#000] active:scale-100 ${
        active ? "outline outline-4 outline-offset-4 outline-[#A855F7]" : ""
      }`}
    >
      <div className="relative overflow-hidden border-b-[3px] border-black">
        <Landmark code={country.code} className="block aspect-[16/10] w-full" />
        <span
          className={`absolute bottom-1.5 left-1.5 max-w-[calc(100%-0.75rem)] truncate border-2 border-black px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_0_#000] ${
            country.visited ? "bg-[#FF3B30] text-white" : "bg-[#FFD400] text-black"
          }`}
        >
          {country.landmark}
        </span>
        <Stamp country={country} className="absolute right-1.5 top-2" />
      </div>
      <div className="flex items-start gap-2.5 p-3">
        <span className="text-3xl leading-none drop-shadow-[2px_2px_0_#000] group-hover:animate-wiggle motion-reduce:animate-none">
          {flagOf(country.code)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`${display} text-2xl leading-none`}>{country.name}</h3>
          <p className="mt-1 truncate text-xs font-bold text-black/60">{country.cities.map((c) => c.name).join(" · ")}</p>
        </div>
      </div>
      <p className="-mt-1 flex items-center justify-between gap-2 px-3 pb-3 text-[11px]">
        <span className="truncate italic">“{country.highlights[0]}”</span>
        {country.code !== "TH" && <span className="shrink-0 font-bold tabular-nums">✈ {distanceFromHome(country).toLocaleString("en-US")} km</span>}
      </p>
    </button>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function CountriesPage() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [touring, setTouring] = useState(false);
  const globeRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => countries.filter((c) => matches(c, filter)), [filter]);
  const country = selected ? countries.find((c) => c.code === selected) ?? null : null;
  // The bubble steps through the current filter; a country outside it still gets a position in the full list.
  const ring = country && list.some((c) => c.code === country.code) ? list : countries;
  const position = country ? ring.findIndex((c) => c.code === country.code) : -1;

  const step = useCallback(
    (by: number) => {
      setSelected((prev) => {
        const i = prev ? ring.findIndex((c) => c.code === prev) : -1;
        return ring[(i + by + ring.length) % ring.length].code;
      });
    },
    [ring],
  );

  useEffect(() => {
    if (!touring) return;
    const id = setInterval(() => step(1), TOUR_STEP_MS);
    return () => clearInterval(id);
  }, [touring, step]);

  const stopTour = useCallback(() => setTouring(false), []);
  const select = useCallback((code: string) => setSelected(code), []);

  const toggleTour = () => {
    if (touring) return setTouring(false);
    setTouring(true);
    if (selected && list.some((c) => c.code === selected)) step(1);
    else setSelected(list[0].code);
  };

  const pickFromGrid = (code: string) => {
    setTouring(false);
    setSelected(code);
    globeRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setTouring(false);
    if (country && !matches(country, f)) setSelected(null);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader className="max-w-6xl" />

      <main className="container mx-auto max-w-6xl flex-1 px-4 pb-20">
        {/* Hero: intro and controls on the left, globe on the right. Phones get intro, globe, then controls. */}
        <section className="grid gap-7 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-7">
          <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700 motion-reduce:animate-none lg:col-start-1 lg:row-start-1 lg:self-end">
            <Caption className="-rotate-2">Meanwhile, in {home.name}…</Caption>
            <h1 className={`${display} -rotate-2 text-7xl leading-[0.9] text-[#FFD400] md:text-8xl`} style={lettering(3, 6)}>
              Countries!
            </h1>
            <p className="max-w-md text-base leading-relaxed">
              Our hero collects passport stamps and airport lounges. Every route starts in {home.name}:{" "}
              <b style={{ color: RED_TEXT }}>red lines</b> are trips taken, <b>dashed ones</b> are adventures still to
              come.
            </p>
          </div>

          <div className="order-last space-y-6 animate-in fade-in slide-in-from-left-8 duration-700 motion-reduce:animate-none lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="grid grid-cols-4 gap-2.5 lg:grid-cols-2 xl:grid-cols-4">
              <Stat value={visited.length} label="Visited" delay={0} bg={INK.red} light />
              <Stat value={wishlist.length} label="To go" delay={120} bg={INK.yellow} />
              <Stat value={citiesVisited} label="Cities" delay={240} bg={INK.cyan} />
              <Stat value={distanceFromHome(furthest) / 1000} suffix="k km" label="Furthest" delay={360} bg="#FFFFFF" />
            </div>

            <ProgressBar />

            <div className="space-y-4">
              <FilterSwitch filter={filter} onChange={changeFilter} />
              <button
                onClick={toggleTour}
                className={`inline-flex w-full items-center justify-center gap-2 bg-[#FF3B30] px-4 py-2.5 ${display} text-2xl text-white ${ink} ${hardShadow} ${press}`}
                style={lettering(1.5, 2)}
              >
                {touring ? <Pause className="h-5 w-5" strokeWidth={3} /> : <Play className="h-5 w-5" strokeWidth={3} />}
                {touring ? "Pause the tour!" : `Take the tour! · ${list.length} stops`}
              </button>
            </div>
          </div>

          {/* Globe panel */}
          <div ref={globeRef} className="relative scroll-mt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div
              className={`relative rotate-[0.6deg] overflow-hidden bg-[#FFD400] ${ink} shadow-[8px_8px_0_0_#000] animate-in fade-in zoom-in-90 duration-700 motion-reduce:animate-none`}
            >
              {/* Action lines radiating from the globe, slowly turning. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-[spin_90s_linear_infinite] motion-reduce:animate-none"
                style={{
                  background: "repeating-conic-gradient(rgba(0,0,0,0.85) 0deg 1.2deg, transparent 1.2deg 9deg)",
                  maskImage: "radial-gradient(circle, transparent 30%, black 62%)",
                  WebkitMaskImage: "radial-gradient(circle, transparent 30%, black 62%)",
                }}
              />
              <div aria-hidden className="pointer-events-none absolute inset-0" style={halftone("rgba(0,0,0,0.12)", 6)} />

              <div className="relative mx-auto aspect-square w-full max-w-[600px]">
                <Globe selected={selected} filter={filter} reducedMotion={reduced} onSelect={select} onInteract={stopTour} />
                {/* Printed-dot shading and an ink outline over the sphere. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[12px] rounded-full border-[3px] border-black mix-blend-multiply"
                  style={halftone("rgba(0,0,0,0.2)", 5)}
                />
              </div>

              {country && !reduced && (
                <Burst
                  key={`${country.code}-${position}`}
                  text={soundFor(country.code)}
                  className="pointer-events-none absolute right-2 top-2 w-24 animate-comic-pop sm:w-32"
                />
              )}

              <div className="relative flex flex-wrap items-center justify-between gap-2 border-t-[3px] border-black bg-white px-3 py-2 text-[11px] font-bold">
                <span className="uppercase tracking-wider">Drag to spin! Tap a country!</span>
                <span className="flex flex-wrap gap-x-3 gap-y-1">
                  {[
                    { color: INK.red, label: "Been" },
                    { color: INK.yellow, label: "Someday" },
                    { color: INK.purple, label: "Picked" },
                  ].map((l) => (
                    <span key={l.label} className="inline-flex items-center gap-1">
                      <span className="h-3 w-3 border-2 border-black" style={{ backgroundColor: l.color }} />
                      {l.label}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {country && (
              <div className="relative z-10 mt-6 lg:absolute lg:inset-x-6 lg:bottom-14 lg:mt-0">
                <SpeechBubble
                  key={country.code}
                  country={country}
                  position={position + 1}
                  total={ring.length}
                  onPrev={() => {
                    setTouring(false);
                    step(-1);
                  }}
                  onNext={() => {
                    setTouring(false);
                    step(1);
                  }}
                  onClose={() => {
                    setTouring(false);
                    setSelected(null);
                  }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Country panels */}
        {[
          { title: "Been there!", sub: "Stamped and remembered.", items: visited, show: filter !== "wishlist", color: INK.red },
          { title: "Next up…", sub: "Waiting for a long weekend.", items: wishlist, show: filter !== "visited", color: INK.cyan },
        ]
          .filter((group) => group.show)
          .map((group) => (
            <section key={group.title} className="mt-20 space-y-7">
              <Reveal className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                <h2 className={`${display} -rotate-1 text-5xl leading-none md:text-6xl`} style={{ ...lettering(2.5, 4), color: group.color }}>
                  {group.title}
                </h2>
                <Caption className="rotate-1">
                  {group.items.length} countries · {group.sub}
                </Caption>
              </Reveal>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {group.items.map((c, i) => (
                  <Reveal key={c.code} delay={(i % 4) * 70}>
                    <CountryPanel country={c} index={i} active={c.code === selected} onSelect={() => pickFromGrid(c.code)} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
      </main>

      <SiteFooter className="max-w-6xl px-4" />
    </div>
  );
}
