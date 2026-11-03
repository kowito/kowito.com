import { describe, expect, it } from "vitest";
import { getChainByShortName } from "@/lib/safe/chains";
import { parseSafeParam, safeHref, safeWalletHref } from "./links";

const SAFE = "0x849D52316331967b6fF1198e5E32A0eB168D039d";
const LOWER = SAFE.toLowerCase();

describe("parseSafeParam", () => {
  it("reads eth:0x… and checksums the address", () => {
    expect(parseSafeParam(`eth:${LOWER}`)).toMatchObject({ ok: true, chain: { shortName: "eth" }, address: SAFE });
  });

  it("reads links copied from Safe{Wallet}", () => {
    for (const link of [
      `https://app.safe.global/home?safe=eth:${SAFE}`,
      `https://app.safe.global/transactions/queue?safe=base:${SAFE}`,
      `https://app.safe.global/transactions/tx?safe=arb1:${SAFE}&id=multisig_${SAFE}_0x${"ab".repeat(32)}`,
      `https://app.safe.global/eth:${SAFE}/balances`,
      `https://app.safe.global/home?safe=eth%3A${SAFE}`,
    ]) {
      expect(parseSafeParam(link), link).toMatchObject({ ok: true, address: SAFE });
    }
  });

  it("reads links from this page", () => {
    expect(parseSafeParam(`https://kowito.com${safeHref("oeth", SAFE, "activity")}`)).toMatchObject({
      ok: true,
      chain: { shortName: "oeth" },
    });
  });

  it("accepts Safe{Wallet}'s matic: and the newer pol: for Polygon", () => {
    expect(parseSafeParam(`matic:${SAFE}`)).toMatchObject({ ok: true, chain: { chain: { id: 137 } } });
    expect(parseSafeParam(`pol:${SAFE}`)).toMatchObject({ ok: true, chain: { chain: { id: 137 } } });
    expect(parseSafeParam(`BSC:${SAFE}`)).toMatchObject({ ok: true, chain: { chain: { id: 56 } } });
  });

  it("asks for the network when only an address is given", () => {
    expect(parseSafeParam(` ${LOWER} `)).toEqual({ ok: false, reason: "no-network", address: SAFE });
  });

  it("rejects unknown networks, short addresses and transaction hashes", () => {
    expect(parseSafeParam(`gno:${SAFE}`)).toEqual({ ok: false, reason: "unknown-network", prefix: "gno" });
    expect(parseSafeParam("eth:0x1234")).toEqual({ ok: false, reason: "bad-address" });
    expect(parseSafeParam(`0x${"ab".repeat(32)}`)).toEqual({ ok: false, reason: "bad-address" });
    expect(parseSafeParam("")).toEqual({ ok: false, reason: "bad-address" });
  });
});

describe("links", () => {
  it("round-trips through safeHref", () => {
    const href = safeHref("matic", SAFE, "send", { token: "native" });
    expect(href).toBe(`/safe?safe=matic:${SAFE}&tab=send&token=native`);
    const param = new URL(href, "https://kowito.com").searchParams.get("safe")!;
    expect(parseSafeParam(param)).toMatchObject({ ok: true, chain: { chain: { id: 137 } }, address: SAFE });
  });

  it("links to Safe{Wallet} with its own prefix", () => {
    expect(safeWalletHref(getChainByShortName("pol")!, SAFE)).toBe(`https://app.safe.global/home?safe=matic:${SAFE}`);
  });
});
