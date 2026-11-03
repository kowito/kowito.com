import { afterEach, describe, expect, it, vi } from "vitest";
import { getChainById } from "./chains";
import { ServiceError, getBalances } from "./service";

const SAFE = "0x849D52316331967b6fF1198e5E32A0eB168D039d";
const mainnet = getChainById(1)!;

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function stubResponses(...statuses: number[]) {
  const responses = statuses.map((status) => new Response(status === 200 ? '{"count":0,"results":[]}' : "{}", { status }));
  const fetch = vi.fn(async () => responses.shift()!);
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

describe("service requests", () => {
  it("wait and retry when rate-limited", async () => {
    vi.useFakeTimers();
    const fetch = stubResponses(429, 429, 200);
    const result = getBalances(mainnet, SAFE);
    await vi.runAllTimersAsync();
    expect(await result).toEqual({ count: 0, results: [] });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("give up after a few tries", async () => {
    vi.useFakeTimers();
    stubResponses(429, 429, 429, 429);
    const result = getBalances(mainnet, SAFE).catch((e) => e);
    await vi.runAllTimersAsync();
    expect(await result).toBeInstanceOf(ServiceError);
  });

  it("checksum the address, which the service requires", async () => {
    const fetch = stubResponses(200);
    await getBalances(mainnet, SAFE.toLowerCase() as `0x${string}`);
    expect(String((fetch.mock.calls[0] as unknown[])[0])).toContain(SAFE);
  });
});
