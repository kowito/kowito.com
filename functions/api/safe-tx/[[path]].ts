/*
 * Cloudflare Pages Function: forwards /api/safe-tx/<chainId>/<path> to the Safe
 * Transaction Service and adds SAFE_API_KEY, so the key never reaches browsers.
 * Set SAFE_API_KEY under Pages → Settings → Variables and Secrets.
 */

type Env = { SAFE_API_KEY?: string };
type Context = { request: Request; env: Env; params: { path?: string | string[] } };

// Chain id → Safe Transaction Service slug. Keep in sync with lib/safe/chains.ts; lib/safe/proxy.test.ts checks.
const SLUGS: Record<string, string> = {
  "1": "eth",
  "10": "oeth",
  "56": "bnb",
  "137": "pol",
  "8453": "base",
  "42161": "arb1",
  "11155111": "sep",
};

const json = (status: number, message: string) => Response.json({ message }, { status });

/** Only this site may use the key from a browser. Same-origin GETs carry no Origin header and pass. */
function allowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false; // e.g. "null" from sandboxed iframes
  }
  const { hostname, protocol } = parsed;
  return (
    hostname === "kowito.com" ||
    hostname === "www.kowito.com" ||
    hostname.endsWith(".kowito-com.pages.dev") ||
    hostname === "kowito-com.pages.dev" ||
    (protocol === "http:" && hostname === "localhost")
  );
}

export async function onRequest({ request, env, params }: Context): Promise<Response> {
  if (!["GET", "POST"].includes(request.method)) return json(405, "Method not allowed");
  if (!allowedOrigin(request.headers.get("Origin"))) return json(403, "Forbidden");

  const segments = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  const chainId = segments[0];
  const slug = chainId && SLUGS[chainId];
  if (!slug) return json(404, `Chain ${chainId} is not supported`);

  // Use the raw pathname rather than the parsed segments: the service's routes need their trailing slashes.
  const url = new URL(request.url);
  const path = url.pathname.slice(`/api/safe-tx/${chainId}`.length);
  if (!/^\/v[12]\//.test(path)) return json(404, "Not found");

  const headers: Record<string, string> = { Accept: "application/json" };
  if (env.SAFE_API_KEY) headers.Authorization = `Bearer ${env.SAFE_API_KEY}`;
  let body: string | undefined;
  if (request.method === "POST") {
    body = await request.text();
    headers["Content-Type"] = "application/json";
  }

  const upstream = await fetch(`https://api.safe.global/tx-service/${slug}/api${path}${url.search}`, {
    method: request.method,
    headers,
    body,
  });

  if (!env.SAFE_API_KEY && [401, 403, 429].includes(upstream.status)) {
    return json(upstream.status, `The Safe service refused the request (HTTP ${upstream.status}). SAFE_API_KEY is not set.`);
  }
  // A 204 (e.g. a proposal) must not carry a body, not even an empty string.
  return new Response((await upstream.text()) || null, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-store" },
  });
}
