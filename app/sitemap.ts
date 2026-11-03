import type { MetadataRoute } from "next"

export const dynamic = "force-static"

// robots.txt points here. /anutta is left out: it asks not to be indexed.
const routes = ["/", "/safe", "/opensource", "/opensource/chopin", "/apple-prices", "/countries", "/books", "/personal-training", "/diet"]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `https://kowito.com${route === "/" ? "" : route}` }))
}
