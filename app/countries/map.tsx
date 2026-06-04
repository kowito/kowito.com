"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { countries, type Country } from "./data";

interface WorldMapProps {
  onCountrySelect?: (country: Country | null) => void;
}

export function WorldMap({ onCountrySelect }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create root instance
    const root = am5.Root.new(containerRef.current);
    rootRef.current = root;

    // Create chart instance with smooth zoom
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        wheelX: "zoom",
        wheelY: "zoom",
        projection: am5map.geoMercator(),
      })
    );

    // Create series for world map
    const series = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
      })
    );

    // Map geodata names to our country names
    const geoNameMap: { [key: string]: string } = {
      "United States": "US",
      "Lao People's Democratic Republic": "Laos",
      "Lao PDR": "Laos",
      "Netherlands": "Netherlands",
      "Czech Republic": "Czech Republic",
      "South Korea": "South Korea",
      "New Zealand": "New Zealand",
      "South Africa": "South Africa",
      "Costa Rica": "Costa Rica",
    };

    // Get all countries from data
    const countryNames = new Set(countries.map((c) => c.name));

    // Customize polygons with smooth rendering
    series.mapPolygons.template.setAll({
      strokeOpacity: 0.15,
      stroke: am5.color(0x111827),
      fill: am5.color(0x1f2937),
      tooltipText: "{name}",
      interactive: true,
      toggleKey: "active",
    });

    // Hide Antarctica
    series.mapPolygons.template.adapters.add("visible", function (visible, target) {
      const data = (target.dataItem?.dataContext) as { name?: string } | undefined;
      if (data?.name === "Antarctica") {
        return false;
      }
      return visible;
    });

    // Color countries from our list
    series.mapPolygons.template.adapters.add("fill", function (fill, target) {
      const data = (target.dataItem?.dataContext) as { name?: string } | undefined;
      if (data?.name) {
        const mappedName = geoNameMap[data.name] || data.name;
        const country = countries.find((c) => c.name === mappedName);
        if (country?.visited) {
          return am5.color(0x10b981); // green for visited
        } else if (countryNames.has(mappedName)) {
          return am5.color(0x3b82f6); // blue for wishlist
        }
      }
      return fill;
    });

    // Handle hover
    series.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x06b6d4),
      strokeWidth: 2,
    });

    // Handle click
    series.mapPolygons.template.events.on("click", function (ev) {
      const data = (ev.target.dataItem?.dataContext) as { name?: string } | undefined;
      if (data?.name) {
        const mappedName = geoNameMap[data.name] || data.name;
        const country = countries.find((c) => c.name === mappedName);
        if (country && onCountrySelect) {
          onCountrySelect(country);
        }
      }
    });

    // Set zoom to fit and center
    series.events.on("datavalidated", function () {
      chart.goHome();
    });

    return () => {
      root.dispose();
    };
  }, [onCountrySelect]);

  return <div ref={containerRef} className="h-full w-full" />;
}
