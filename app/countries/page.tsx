"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Globe, MapPin, CheckCircle2 } from "lucide-react";
import { countries, type Country } from "./data";

const WorldMap = dynamic(() => import("./map").then((mod) => ({ default: mod.WorldMap })), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-900/50">
      <p className="text-gray-500 text-sm">Loading map…</p>
    </div>
  ),
});

const visitedCount = countries.filter((c) => c.visited).length;
const cityCount = countries.reduce((acc, c) => acc + c.cities.length, 0);

export default function CountriesPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[700px] w-[700px] rounded-full bg-gradient-to-b from-blue-900/20 to-cyan-900/20 blur-3xl translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-t from-indigo-900/20 to-blue-900/20 blur-3xl -translate-x-1/3 translate-y-1/3 opacity-40" />
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

      <main className="container mx-auto max-w-5xl px-4 pb-12">

        {/* Page header */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-gray-400 shrink-0" />
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">World Map</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white">Countries</h1>
          <p className="max-w-xl text-gray-400 leading-relaxed">
            Collecting passport stamps and airport lounges. {visitedCount} visited, {countries.length - visitedCount} left on the list.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-300">
              <CheckCircle2 className="h-3 w-3" />
              {visitedCount} visited
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
              <Globe className="h-3 w-3" />
              {countries.length} countries
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
              <MapPin className="h-3 w-3" />
              {cityCount} cities
            </span>
          </div>
        </div>

        {/* Map + Detail */}
        <div className="grid gap-6 lg:grid-cols-5">

          {/* Map */}
          <div className="lg:col-span-3 rounded-3xl border border-gray-800 bg-black/30 overflow-hidden h-[500px]">
            <div className="h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500" />
            <WorldMap onCountrySelect={setSelectedCountry} />
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedCountry ? (
              <div className="sticky top-6 rounded-3xl border border-gray-800 bg-black/30 overflow-hidden">
                <div className={`h-[2px] ${selectedCountry.visited ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`} />
                <div className="p-6 space-y-5">

                  {/* Name + badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-2xl font-light tracking-tight text-white">{selectedCountry.name}</h2>
                      {selectedCountry.visited ? (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium text-green-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Visited
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-300">
                          Wishlist
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedCountry.cities.join(" · ")}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed">{selectedCountry.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-gray-700 bg-gray-900/60 px-2.5 py-0.5 text-xs text-gray-300"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            ) : (
              <div className="sticky top-6 flex flex-col items-center justify-center rounded-3xl border border-gray-800 bg-black/20 h-[200px] text-center px-6">
                <Globe className="h-8 w-8 text-gray-700 mb-3" />
                <p className="text-sm text-gray-500">Click a country on the map<br />to see details</p>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
