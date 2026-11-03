import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "@/functions/api/safe-tx/[[path]]";
import { CHAINS, serviceSlugOf } from "./chains";

// Lives outside functions/: Cloudflare would deploy any file in there as a route.

const SAFE = "0x849D52316331967b6fF1198e5E32A0eB168D039d";

function call(path: string, init: RequestInit & { key?: string } = {}) {
  const { key, ...rest } = init;
  const request = new Request(`https://kowito.com${path}`, rest);
  const segments = path.split("?")[0].replace("/api/safe-tx/", "").split("/").filter(Boolean);
  return onRequest({ request, env: { SAFE_API_KEY: key }, params: { path: segments } });
}

function stubUpstream(response = new Response('{"ok":true}', { status: 200, headers: { "Content-Type": "application/json" } })) {
  const upstream = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    void input;
    void init;
    return response.clone();
  });
  vi.stubGlobal("fetch", upstream);
  return upstream;
}

afterEach(() => vi.unstubAllGlobals());

describe("safe-tx proxy", () => {
  it("knows the same Transaction Service slug as the app for every network", async () => {
    const upstream = stubUpstream();
    for (const c of CHAINS) {
      const res = await call(`/api/safe-tx/${c.chain.id}/v1/about/`);
      expect(res.status, c.chain.name).toBe(200);
      expect(String(upstream.mock.lastCall?.[0])).toBe(`https://api.safe.global/tx-service/${serviceSlugOf(c)}/api/v1/about/`);
    }
  });

  it("keeps the trailing slash and query string, and adds the key", async () => {
    const upstream = stubUpstream();
    await call(`/api/safe-tx/1/v2/safes/${SAFE}/multisig-transactions/?executed=false&limit=100`, { key: "secret" });
    const [url, init] = upstream.mock.lastCall!;
    expect(String(url)).toBe(`https://api.safe.global/tx-service/eth/api/v2/safes/${SAFE}/multisig-transactions/?executed=false&limit=100`);
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer secret");
  });

  it("forwards proposals as JSON and answers 204 without a body", async () => {
    const upstream = stubUpstream(new Response(null, { status: 204 }));
    const res = await call(`/api/safe-tx/8453/v2/safes/${SAFE}/multisig-transactions/`, {
      method: "POST",
      body: '{"nonce":1}',
      headers: { Origin: "https://kowito.com" },
    });
    expect(res.status).toBe(204);
    expect(await res.text()).toBe("");
    const init = upstream.mock.lastCall![1]!;
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"nonce":1}');
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
  });

  it("only lets this site use the key from a browser", async () => {
    stubUpstream();
    const from = (origin: string) => call("/api/safe-tx/1/v1/about/", { headers: { Origin: origin } }).then((r) => r.status);
    expect(await from("https://kowito.com")).toBe(200);
    expect(await from("https://www.kowito.com")).toBe(200);
    expect(await from("https://abc123.kowito-com.pages.dev")).toBe(200);
    expect(await from("http://localhost:8788")).toBe(200);
    expect(await from("https://evil.example")).toBe(403);
    expect(await from("https://kowito.com.evil.example")).toBe(403);
    expect(await from("null")).toBe(403);
  });

  it("refuses other methods, networks and paths", async () => {
    const upstream = stubUpstream();
    expect((await call("/api/safe-tx/1/v1/about/", { method: "DELETE" })).status).toBe(405);
    expect((await call("/api/safe-tx/100/v1/about/")).status).toBe(404);
    expect((await call("/api/safe-tx/1/admin/")).status).toBe(404);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("explains a refusal when the key is missing", async () => {
    stubUpstream(new Response("{}", { status: 429 }));
    const res = await call("/api/safe-tx/1/v1/about/");
    expect(res.status).toBe(429);
    expect((await res.json()).message).toMatch(/SAFE_API_KEY is not set/);
  });
});
