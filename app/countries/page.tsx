"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SiteFooter } from "@/components/site-footer";
import { ArrowLeft, ChevronLeft, ChevronRight, Globe as GlobeIcon, MapPin, Pause, Plane, Play, X } from "lucide-react";
import { countries, distanceKm, flagOf, home, type Country } from "./data";
import { matches, type Filter } from "./globe";

const Globe = dynamic(() => import("./globe").then((mod) => ({ default: mod.Globe })), {
  ssr: false,
  loading: () => <div className="absolute inset-[6%] animate-pulse rounded-full bg-gradient-to-br from-slate-800/60 to-slate-950/60" />,
});

const visited = countries.filter((c) => c.visited);
const wishlist = countries.filter((c) => !c.visited);
const citiesVisited = visited.reduce((n, c) => n + c.cities.length, 0);
const distanceFromHome = (c: Country) => Math.round(distanceKm(home, c.cities[0]));
const furthest = visited.reduce((best, c) => (distanceFromHome(c) > distanceFromHome(best) ? c : best), visited[0]);

const filters: { id: Filter; label: string; count: number }[] = [
  { id: "all", label: "All", count: countries.length },
  { id: "visited", label: "Visited", count: visited.length },
  { id: "wishlist", label: "Wishlist", count: wishlist.length },
];

const TOUR_STEP_MS = 5000;

/* ───────────────────────── Motion helpers ───────────────────────── */

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false);
}

/** Eases a number from 0 up to `target` once, after `delay` ms. */
function useCountUp(target: number, duration = 1600, delay = 0) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const start = performance.now() + (reduced ? 0 : delay);
    const length = reduced ? 0 : duration;
    let frame = 0;
    const tick = (now: number) => {
      const t = length === 0 ? 1 : Math.min(1, Math.max(0, (now - start) / length));
      setValue(target * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, delay, reduced]);
  return value;
}

/** Fades and lifts its children in the first time they scroll into view. */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Tilts toward the pointer with a soft glare that follows it. Written straight to CSS variables, no re-render. */
function tilt(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse" || window.matchMedia(motionQuery).matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
  el.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
}

function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

/** Twinkling stars around the globe; positions are seeded so server and client agree. */
const stars = Array.from({ length: 48 }, (_, i) => {
  const rand = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return { left: rand(1) * 100, top: rand(2) * 100, size: rand(3) > 0.85 ? 2 : 1, delay: rand(4) * 4, duration: 2 + rand(5) * 3 };
});

/* ───────────────────────── Pieces ───────────────────────── */

function Stat({ value, label, suffix = "", delay }: { value: number; label: string; suffix?: string; delay: number }) {
  const n = useCountUp(value, 1600, delay);
  return (
    <div className="min-w-0 rounded-2xl border border-white/5 bg-white/[0.03] px-2.5 py-2 sm:px-3 sm:py-2.5">
      <p className="font-display text-xl font-light tabular-nums text-white sm:text-3xl">
        {Math.round(n).toLocaleString("en-US")}
        {suffix && <span className="ml-0.5 text-xs text-gray-400 sm:text-base">{suffix}</span>}
      </p>
      <p className="mt-0.5 truncate text-[10px] uppercase tracking-wider text-gray-500 sm:text-[11px] sm:tracking-widest">{label}</p>
    </div>
  );
}

function ProgressRing() {
  const n = useCountUp(visited.length, 1800, 200);
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const share = n / countries.length;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-white/[0.06]" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - share)}
        />
        <defs>
          <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <p className="font-display text-3xl font-light tabular-nums text-white">{Math.round(share * 100)}%</p>
        <p className="text-xs text-gray-400">of the list ticked off</p>
      </div>
    </div>
  );
}

function FilterSwitch({ filter, onChange }: { filter: Filter; onChange: (f: Filter) => void }) {
  const index = filters.findIndex((f) => f.id === filter);
  return (
    <div role="radiogroup" aria-label="Show countries" className="relative grid grid-cols-3 rounded-2xl border border-white/5 bg-white/[0.03] p-1">
      {/* The pill slides under whichever option is active. */}
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-xl bg-white shadow-lg shadow-black/30 transition-transform duration-500 ease-[cubic-bezier(.2,.9,.3,1.2)] motion-reduce:transition-none"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {filters.map((f) => (
        <button
          key={f.id}
          role="radio"
          aria-checked={filter === f.id}
          onClick={() => onChange(f.id)}
          className={`relative z-10 rounded-xl px-2 py-2 text-xs font-medium transition-colors duration-300 sm:text-sm ${
            filter === f.id ? "text-gray-950" : "text-gray-400 hover:text-white"
          }`}
        >
          {f.label} <span className={filter === f.id ? "text-gray-500" : "text-gray-600"}>{f.count}</span>
        </button>
      ))}
    </div>
  );
}

function StatusPill({ country }: { country: Country }) {
  return country.visited ? (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Visited
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-300">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
      Wishlist
    </span>
  );
}

function DetailCard({
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
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-white/10 bg-gray-950/80 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl duration-500 motion-reduce:animate-none sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl leading-none">{flagOf(country.code)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-light tracking-tight text-white">{country.name}</h2>
            <StatusPill country={country} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {country.cities.map((c) => c.name).join(" · ")}
            </span>
            {country.code !== "TH" && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Plane className="h-3 w-3" />
                {Math.round(km).toLocaleString("en-US")} km from {home.name}
              </span>
            )}
          </p>
        </div>
        <button onClick={onClose} aria-label="Close" className="-mr-1 -mt-1 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300">{country.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {country.highlights.map((h, i) => (
          <span
            key={h}
            style={{ animationDelay: `${150 + i * 70}ms` }}
            className="animate-in fade-in zoom-in-95 fill-mode-both rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-gray-300 duration-500 motion-reduce:animate-none"
          >
            {h}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <button onClick={onPrev} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <span className="text-[11px] tabular-nums text-gray-500">
          {position} / {total}
        </span>
        <button onClick={onNext} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CountryCard({ country, active, onSelect }: { country: Country; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      onPointerMove={tilt}
      onPointerLeave={untilt}
      style={{ transform: "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}
      className={`group relative block h-full w-full overflow-hidden rounded-2xl border p-4 text-left transition-[transform,border-color,background-color] duration-200 ease-out ${
        active ? "border-white/40 bg-white/[0.07]" : "border-white/[0.06] bg-white/[0.025] hover:border-white/15"
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.09), transparent 60%)" }}
      />
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${country.visited ? "via-emerald-400/60" : "via-blue-400/60"} to-transparent`}
      />
      <div className="relative flex items-start justify-between gap-2">
        <span className="text-3xl leading-none transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">{flagOf(country.code)}</span>
        <StatusPill country={country} />
      </div>
      <h3 className="relative mt-3 font-medium text-white">{country.name}</h3>
      <p className="relative mt-0.5 truncate text-xs text-gray-500">{country.cities.map((c) => c.name).join(" · ")}</p>
      <p className="relative mt-3 flex items-center justify-between text-[11px] text-gray-500">
        <span className="truncate">{country.highlights[0]}</span>
        {country.code !== "TH" && <span className="shrink-0 tabular-nums">{distanceFromHome(country).toLocaleString("en-US")} km</span>}
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
  // The card steps through the current filter; a country outside it still gets a position in the full list.
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[700px] w-[700px] translate-x-1/3 rounded-full bg-gradient-to-b from-emerald-900/20 to-cyan-900/20 opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-t from-indigo-900/20 to-blue-900/20 opacity-40 blur-3xl" />
      </div>

      {/* Header */}
      <header className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-8">
        <Link href="/" className="font-display text-lg font-medium tracking-[0.22em] text-white">
          Kowit C.
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      <main className="container mx-auto max-w-6xl flex-1 px-4 pb-16">
        {/* Hero: intro and controls on the left, globe on the right. Phones get intro, globe, then controls. */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-6">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700 motion-reduce:animate-none lg:col-start-1 lg:row-start-1 lg:self-end">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <GlobeIcon className="h-5 w-5 shrink-0 text-gray-400" />
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">World Map</p>
              </div>
              <h1 className="bg-gradient-to-r from-white via-emerald-100 to-blue-200 bg-clip-text text-4xl font-light tracking-tight text-transparent md:text-6xl">
                Countries
              </h1>
              <p className="max-w-md leading-relaxed text-gray-400">
                Collecting passport stamps and airport lounges. Every route starts in {home.name}: solid lines are trips
                taken, dashed ones are still on the list.
              </p>
            </div>
          </div>

          <div className="order-last animate-in fade-in slide-in-from-left-6 space-y-6 duration-700 motion-reduce:animate-none lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 xl:grid-cols-4">
              <Stat value={visited.length} label="Visited" delay={0} />
              <Stat value={wishlist.length} label="To go" delay={120} />
              <Stat value={citiesVisited} label="Cities" delay={240} />
              <Stat value={distanceFromHome(furthest) / 1000} suffix="k km" label="Furthest" delay={360} />
            </div>

            <ProgressRing />

            <div className="space-y-3">
              <FilterSwitch filter={filter} onChange={changeFilter} />
              <button
                onClick={toggleTour}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-gray-950 shadow-lg shadow-emerald-500/10 transition-all hover:bg-gray-100 hover:shadow-emerald-500/25"
              >
                {touring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 transition-transform group-hover:scale-110" />}
                {touring ? "Pause the tour" : `Take the tour · ${list.length} stops`}
              </button>
            </div>
          </div>

          {/* Globe */}
          <div ref={globeRef} className="relative scroll-mt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="relative mx-auto aspect-square w-full max-w-[640px] animate-in fade-in zoom-in-90 duration-1000 motion-reduce:animate-none">
              {/* Starfield */}
              <div aria-hidden className="pointer-events-none absolute -inset-6">
                {stars.map((s, i) => (
                  <span
                    key={i}
                    className="absolute animate-pulse rounded-full bg-white/70 motion-reduce:animate-none"
                    style={{
                      left: `${s.left}%`,
                      top: `${s.top}%`,
                      width: s.size,
                      height: s.size,
                      animationDelay: `${s.delay}s`,
                      animationDuration: `${s.duration}s`,
                    }}
                  />
                ))}
              </div>
              {/* Atmosphere */}
              <div aria-hidden className="pointer-events-none absolute inset-[5%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18)_55%,rgba(16,185,129,0.08)_68%,transparent_72%)] blur-xl" />
              <div aria-hidden className="pointer-events-none absolute inset-[8%] rounded-full shadow-[0_0_80px_10px_rgba(56,189,248,0.12)]" />

              <Globe selected={selected} filter={filter} reducedMotion={reduced} onSelect={select} onInteract={stopTour} />

              {!country && (
                <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px] text-gray-500 animate-in fade-in duration-1000">
                  Drag to spin · tap a coloured country
                </p>
              )}
            </div>

            {country && (
              <div className="relative z-10 -mt-10 lg:absolute lg:inset-x-6 lg:bottom-2 lg:mt-0">
                <DetailCard
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

        {/* Country cards */}
        {[
          { title: "Been there", sub: "Stamped and remembered.", items: visited, show: filter !== "wishlist" },
          { title: "Next up", sub: "Waiting for a long weekend.", items: wishlist, show: filter !== "visited" },
        ]
          .filter((group) => group.show)
          .map((group) => (
            <section key={group.title} className="mt-16 space-y-5">
              <Reveal className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-white/5 pt-8">
                <h2 className="text-2xl font-light tracking-tight text-white md:text-3xl">{group.title}</h2>
                <p className="text-sm text-gray-500">
                  {group.items.length} countries · {group.sub}
                </p>
              </Reveal>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {group.items.map((c, i) => (
                  <Reveal key={c.code} delay={(i % 4) * 80}>
                    <CountryCard country={c} active={c.code === selected} onSelect={() => pickFromGrid(c.code)} />
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
