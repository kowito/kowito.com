"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { countries, home, type Country } from "./data";

export type Filter = "all" | "visited" | "wishlist";

export const matches = (c: Country, f: Filter) => f === "all" || (f === "visited" ? Boolean(c.visited) : !c.visited);

const COLORS = {
  land: 0x1e293b,
  border: 0x0b1220,
  visited: 0x10b981,
  wishlist: 0x3b82f6,
  dimmed: 0x273449,
  selected: 0xf8fafc,
};

const byCode = new Map(countries.map((c) => [c.code, c]));

type PolygonItem = am5.DataItem<am5map.IMapPolygonSeriesDataItem>;
const polygonId = (item: unknown) => (item as PolygonItem | undefined)?.get("id");

/** A small plane, nose pointing along +x so autoRotate lines it up with the route. */
const PLANE = "M22 12 14 10.2 9.4 2H7.4l3 8.4-5.8.4L2.4 8H.8l1 4-1 4h1.6l2.2-2.8 5.8.4-3 8.4h2L14 13.8z";

interface GlobeApi {
  paint: (selected: string | null, filter: Filter) => void;
  flyTo: (code: string) => void;
  spin: () => void;
}

interface GlobeProps {
  selected: string | null;
  filter: Filter;
  reducedMotion: boolean;
  onSelect: (code: string) => void;
  /** Any drag or click on the globe, so the page can stop an autoplaying tour. */
  onInteract: () => void;
}

export function Globe({ selected, filter, reducedMotion, onSelect, onInteract }: GlobeProps) {
  const el = useRef<HTMLDivElement>(null);
  const api = useRef<GlobeApi | null>(null);
  const latest = useRef({ selected, filter, onSelect, onInteract });

  useEffect(() => {
    latest.current = { selected, filter, onSelect, onInteract };
  }, [selected, filter, onSelect, onInteract]);

  useEffect(() => {
    if (!el.current) return;
    const root = am5.Root.new(el.current);
    if (!reducedMotion) root.setThemes([am5themes_Animated.new(root)]);
    // On touch screens a drag scrolls the page until the globe is tapped once.
    root.tapToActivate = true;

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        wheelY: "none",
        projection: am5map.geoOrthographic(),
        rotationX: -home.lon,
        rotationY: -20,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 12,
        paddingRight: 12,
      }),
    );

    // Ocean: a full-sphere polygon with radial shading so the globe reads as round.
    const ocean = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    ocean.mapPolygons.template.setAll({
      fillGradient: am5.RadialGradient.new(root, {
        stops: [{ color: am5.color(0x1b2b4b) }, { color: am5.color(0x0a1122) }, { color: am5.color(0x050913) }],
      }),
      strokeOpacity: 0,
      interactive: false,
    });
    ocean.data.push({ geometry: am5map.getGeoRectangle(90, 180, -90, -180) });

    const graticule = chart.series.push(am5map.GraticuleSeries.new(root, { step: 20 }));
    graticule.mapLines.template.setAll({ stroke: am5.color(0x94a3b8), strokeOpacity: 0.07 });

    const tooltip = am5.Tooltip.new(root, { getFillFromSprite: false, labelText: "{name}", paddingTop: 4, paddingBottom: 4 });
    tooltip.get("background")?.setAll({ fill: am5.color(0x0f172a), fillOpacity: 0.95, stroke: am5.color(0x334155), strokeOpacity: 1 });
    tooltip.label.setAll({ fill: am5.color(0xf1f5f9), fontSize: 12 });

    const land = chart.series.push(am5map.MapPolygonSeries.new(root, { geoJSON: am5geodata_worldLow, exclude: ["AQ"] }));
    land.mapPolygons.template.setAll({
      fill: am5.color(COLORS.land),
      stroke: am5.color(COLORS.border),
      strokeWidth: 0.5,
      tooltip,
      tooltipText: "{name}",
    });
    land.mapPolygons.template.states.create("hover", { stroke: am5.color(0xffffff), strokeWidth: 1.2 });
    land.mapPolygons.template.events.on("click", (ev) => {
      const id = polygonId(ev.target.dataItem);
      if (id && byCode.has(id)) latest.current.onSelect(id);
    });

    // Routes from Bangkok: solid for places visited, dashed for the wishlist.
    const routes = chart.series.push(am5map.MapLineSeries.new(root, {}));
    const routeOf = new Map<am5.DataItem<am5map.IMapLineSeriesDataItem>, Country>();
    routes.mapLines.template.setAll({ strokeWidth: 1.3, strokeOpacity: 0 });
    routes.mapLines.template.adapters.add("stroke", (stroke, target) => {
      const c = routeOf.get(target.dataItem as am5.DataItem<am5map.IMapLineSeriesDataItem>);
      return c ? am5.color(c.visited ? COLORS.visited : COLORS.wishlist) : stroke;
    });
    routes.mapLines.template.adapters.add("strokeDasharray", (dash, target) => {
      const c = routeOf.get(target.dataItem as am5.DataItem<am5map.IMapLineSeriesDataItem>);
      return c && !c.visited ? [3, 4] : dash;
    });

    const planes = chart.series.push(am5map.MapPointSeries.new(root, {}));
    planes.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Graphics.new(root, {
          svgPath: PLANE,
          scale: 0.55,
          centerX: am5.p50,
          centerY: am5.p50,
          fill: am5.color(0xffffff),
          fillOpacity: 0.95,
        }),
      }),
    );

    // Planes take off one after another rather than all at once.
    const takeoffs: ReturnType<typeof setTimeout>[] = [];
    let flight = 0;
    for (const c of countries) {
      if (c.code === "TH") continue;
      const dest = c.cities[0];
      const route = routes.pushDataItem({
        geometry: { type: "LineString", coordinates: [[home.lon, home.lat], [dest.lon, dest.lat]] },
      });
      routeOf.set(route, c);
      if (!c.visited) continue;
      const plane = planes.pushDataItem({ lineDataItem: route, positionOnLine: 0, autoRotate: true });
      if (!reducedMotion) {
        const duration = 5200 + (flight % 4) * 900;
        takeoffs.push(
          setTimeout(() => {
            plane.animate({ key: "positionOnLine", from: 0, to: 1, duration, loops: Infinity, easing: am5.ease.inOut(am5.ease.quad) });
          }, flight * 650),
        );
      }
      flight++;
    }

    // City dots; visited ones and home pulse.
    type CityPoint = { geometry: GeoJSON.Point; color: number; code: string; pulse: boolean; big: boolean };
    const cities = chart.series.push(am5map.MapPointSeries.new(root, {}));
    cities.bullets.push((r, _series, dataItem) => {
      const ctx = dataItem.dataContext as CityPoint;
      const group = am5.Container.new(r, {});
      const halo = group.children.push(
        am5.Circle.new(r, { radius: ctx.big ? 5 : 3.5, fill: am5.color(ctx.color), fillOpacity: 0.45 }),
      );
      group.children.push(
        am5.Circle.new(r, {
          radius: ctx.big ? 3.6 : 2.2,
          fill: am5.color(ctx.color),
          stroke: am5.color(COLORS.border),
          strokeWidth: 1,
        }),
      );
      if (ctx.pulse && !reducedMotion) {
        halo.animate({ key: "scale", from: 1, to: 3, duration: 2400, loops: Infinity, easing: am5.ease.out(am5.ease.cubic) });
        halo.animate({ key: "opacity", from: 0.9, to: 0, duration: 2400, loops: Infinity, easing: am5.ease.out(am5.ease.cubic) });
      }
      return am5.Bullet.new(r, { sprite: group });
    });
    cities.data.setAll([
      ...countries.flatMap((c) =>
        c.cities.map((city) => ({
          geometry: { type: "Point" as const, coordinates: [city.lon, city.lat] },
          color: c.visited ? COLORS.visited : COLORS.wishlist,
          code: c.code,
          pulse: Boolean(c.visited),
          big: false,
        })),
      ),
      { geometry: { type: "Point" as const, coordinates: [home.lon, home.lat] }, color: 0xffffff, code: "TH", pulse: true, big: true },
    ]);

    /* ── Behaviour ── */

    let spinning: ReturnType<typeof chart.animate<"rotationX">> | undefined;
    let resume: ReturnType<typeof setTimeout> | undefined;

    const stopSpin = () => {
      spinning?.stop();
      spinning = undefined;
      clearTimeout(resume);
    };

    const spin = () => {
      stopSpin();
      if (reducedMotion) return;
      const from = chart.get("rotationX", 0);
      spinning = chart.animate({ key: "rotationX", from, to: from + 360, duration: 80000, loops: Infinity });
    };

    const flyTo = (code: string) => {
      const c = byCode.get(code);
      if (!c) return;
      stopSpin();
      const { lat, lon } = c.cities[0];
      const current = chart.get("rotationX", 0);
      // Take the short way round, however many turns the auto-spin has added.
      const delta = ((((-lon - current) % 360) + 540) % 360) - 180;
      const duration = reducedMotion ? 0 : 1600;
      const easing = am5.ease.inOut(am5.ease.cubic);
      chart.animate({ key: "rotationX", to: current + delta, duration, easing });
      // Aim a little south of the country so it sits above the detail card.
      chart.animate({ key: "rotationY", to: Math.max(-70, Math.min(70, -(lat - 22))), duration, easing });
    };

    const paint = (sel: string | null, f: Filter) => {
      const duration = reducedMotion ? 0 : 500;
      land.mapPolygons.each((poly) => {
        const c = byCode.get(polygonId(poly.dataItem) ?? "");
        if (!c) return;
        const color = c.code === sel ? COLORS.selected : !matches(c, f) ? COLORS.dimmed : c.visited ? COLORS.visited : COLORS.wishlist;
        poly.set("cursorOverStyle", "pointer");
        poly.animate({ key: "fill", to: am5.color(color), duration });
      });
      for (const [route, c] of routeOf) {
        const show = matches(c, f) && (sel == null || c.code === sel || f !== "all");
        route.get("mapLine")?.animate({ key: "strokeOpacity", to: show ? (c.visited ? 0.55 : 0.3) : 0.04, duration });
      }
      planes.animate({ key: "opacity", to: f === "wishlist" ? 0 : 1, duration });
      cities.dataItems.forEach((item) => {
        const ctx = item.dataContext as CityPoint;
        const c = byCode.get(ctx.code);
        const show = ctx.big || (c != null && matches(c, f));
        item.bullets?.forEach((b) => b.get("sprite").animate({ key: "opacity", to: show ? 1 : 0, duration }));
      });
    };

    land.events.on("datavalidated", () => {
      const { selected: sel, filter: f } = latest.current;
      paint(sel, f);
      if (sel) flyTo(sel);
      else spin();
    });

    chart.chartContainer.events.on("pointerdown", () => {
      stopSpin();
      latest.current.onInteract();
    });
    chart.chartContainer.events.on("globalpointerup", () => {
      clearTimeout(resume);
      if (!latest.current.selected) resume = setTimeout(spin, 3500);
    });

    api.current = { paint, flyTo, spin };
    return () => {
      clearTimeout(resume);
      takeoffs.forEach(clearTimeout);
      api.current = null;
      root.dispose();
    };
  }, [reducedMotion]);

  useEffect(() => {
    api.current?.paint(selected, filter);
  }, [selected, filter]);

  useEffect(() => {
    if (selected) api.current?.flyTo(selected);
    else api.current?.spin();
  }, [selected]);

  return <div ref={el} className="h-full w-full" />;
}
