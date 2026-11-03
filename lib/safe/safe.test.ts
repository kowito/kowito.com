import { EthSafeSignature, buildSignatureBytes, calculateSafeTransactionHash, encodeMultiSendData } from "@safe-global/protocol-kit";
import { OperationType, type SafeMultisigConfirmationResponse, type SafeTransactionData } from "@safe-global/types-kit";
import { encodeFunctionData, getAddress, parseAbi, zeroAddress } from "viem";
import { describe, expect, it } from "vitest";
import { coerceInput } from "./abi-input";
import { ERC20_ABI, decodeAny, decodeLocally } from "./decode";
import { computeSafeTxHashes, getTrustedDelegateCallTargets, toSafeSignature, unpackMultiSend } from "./safe";

const SAFE = getAddress("0x1234567890AbcdEF1234567890aBcdef12345678");
const RECIPIENT = getAddress("0x00000000000000000000000000000000000000AA");
const TOKEN = getAddress("0x00000000000000000000000000000000000000bb");

const tx: SafeTransactionData = {
  to: TOKEN,
  value: "12345",
  data: encodeFunctionData({ abi: ERC20_ABI, functionName: "transfer", args: [RECIPIENT, 10n ** 18n] }),
  operation: OperationType.Call,
  safeTxGas: "0",
  baseGas: "0",
  gasPrice: "0",
  gasToken: zeroAddress,
  refundReceiver: zeroAddress,
  nonce: 42,
};

describe("computeSafeTxHashes", () => {
  for (const version of ["1.0.0", "1.1.1", "1.2.0", "1.3.0", "1.3.0+L2", "1.4.1", "1.5.0"]) {
    it(`matches protocol-kit for Safe ${version}`, () => {
      const ours = computeSafeTxHashes({ chainId: 11155111, safeAddress: SAFE, version, tx });
      const theirs = calculateSafeTransactionHash(SAFE, tx, version.split("+")[0], 11155111n);
      expect(ours.safeTxHash).toBe(theirs);
    });
  }

  it("binds the hash to the chain for Safe >= 1.3.0 only", () => {
    const hash = (chainId: number, version: string) =>
      computeSafeTxHashes({ chainId, safeAddress: SAFE, version, tx }).safeTxHash;
    expect(hash(1, "1.3.0")).not.toBe(hash(10, "1.3.0"));
    expect(hash(1, "1.1.1")).toBe(hash(10, "1.1.1"));
  });

  it("changes when any field changes", () => {
    const base = computeSafeTxHashes({ chainId: 1, safeAddress: SAFE, version: "1.4.1", tx }).safeTxHash;
    const changed = computeSafeTxHashes({ chainId: 1, safeAddress: SAFE, version: "1.4.1", tx: { ...tx, nonce: 43 } });
    expect(changed.safeTxHash).not.toBe(base);
  });
});

describe("MultiSend", () => {
  const inner = [
    { to: TOKEN, value: "0", data: tx.data, operation: OperationType.Call },
    { to: RECIPIENT, value: "1000", data: "0x", operation: OperationType.Call },
  ];
  const packed = encodeMultiSendData(inner) as `0x${string}`;

  it("unpacks what protocol-kit packs", () => {
    expect(unpackMultiSend(packed)).toEqual([
      { operation: 0, to: TOKEN, value: 0n, data: tx.data },
      { operation: 0, to: RECIPIENT, value: 1000n, data: "0x" },
    ]);
  });

  it("rejects truncated payloads", () => {
    expect(() => unpackMultiSend(packed.slice(0, -10) as `0x${string}`)).toThrow();
  });

  it("decodes a batch and its inner calls locally", () => {
    const data = encodeFunctionData({
      abi: parseAbi(["function multiSend(bytes transactions)"]),
      functionName: "multiSend",
      args: [packed],
    });
    const decoded = decodeLocally(data);
    expect(decoded?.method).toBe("multiSend");
    expect(decoded?.inner?.[0].decoded?.method).toBe("transfer");
    expect(decoded?.inner?.[1].decoded).toBeUndefined();
  });

  it("knows the official MultiSendCallOnly 1.4.1 address on mainnet and BSC", () => {
    expect(getTrustedDelegateCallTargets(1)).toContain("0x9641d764fc13c8B624c04430C7356C1C7C8102e2");
    expect(getTrustedDelegateCallTargets(56)).toContain("0x9641d764fc13c8B624c04430C7356C1C7C8102e2");
  });
});

describe("decodeAny", () => {
  it("prefers local decoding over the service's", () => {
    const decoded = decodeAny(tx.data as `0x${string}`, { method: "somethingElse", parameters: [] });
    expect(decoded).toMatchObject({ method: "transfer", source: "local" });
    expect(decoded?.params.map((p) => p.value)).toEqual([RECIPIENT, (10n ** 18n).toString()]);
  });

  it("falls back to the service for unknown selectors", () => {
    expect(decodeAny("0xdeadbeef", { method: "mystery", parameters: [] })).toMatchObject({
      method: "mystery",
      source: "service",
    });
  });
});

describe("coerceInput", () => {
  it("parses scalars, arrays and tuples", () => {
    expect(coerceInput({ type: "uint256", name: "x" }, "0x10")).toBe(16n);
    expect(coerceInput({ type: "bool", name: "b" }, "true")).toBe(true);
    expect(coerceInput({ type: "address[]", name: "a" }, `["${RECIPIENT}"]`)).toEqual([RECIPIENT]);
    expect(
      coerceInput(
        {
          type: "tuple",
          name: "t",
          components: [
            { type: "address", name: "to" },
            { type: "uint256", name: "amount" },
          ],
        },
        `{"to":"${RECIPIENT}","amount":"5"}`,
      ),
    ).toEqual({ to: RECIPIENT, amount: 5n });
  });

  it("rejects bad input with the parameter name", () => {
    expect(() => coerceInput({ type: "address", name: "owner" }, "0x123")).toThrow(/owner/);
    expect(() => coerceInput({ type: "uint8[2]", name: "pair" }, "[1]")).toThrow(/pair/);
  });
});

describe("toSafeSignature", () => {
  // Sepolia Safe 0x9d2b…9466, nonce 8: one owner signed directly, one is a smart account.
  // `onchain` is the signature blob the Safe accepted when it executed.
  const confirmations = [
    {
      owner: "0x7647B706675c905D56342635545b8cad2DD3a42F",
      signatureType: "EOA",
      signature:
        "0x5a38af0241efa9a7c2a28a3fc29a807edafa0fc0181f77c2d37a161e9f9e88ab1939d49002aac26b63d93dfab2923ae80381e042da13c8f3dd27fea753a8ceaf1b",
    },
    {
      owner: "0x868002873D287f27D12cb94a70Cde4D2b2d3Ff3f",
      signatureType: "CONTRACT_SIGNATURE",
      signature:
        "0x000000000000000000000000868002873d287f27d12cb94a70cde4d2b2d3ff3f0000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e08587b23f49a1a1ebef789ec25276b78aa6fd1d2d7eb5a0abf26a0075a702411e75687c2523aa5d0af1a0eec272ca6e270c9a7619c9a3f0e0986e2f048345ecde00000000000000000000000000000000000000000000000000000000000000257b14bdf48e3ff32cce9e30f509a70d2c6793ca8a37180317384684401c66d65f1d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042226f726967696e223a2268747470733a2f2f797562697369676e2d746573746e65742e706f6a656368612e6c69222c2263726f73734f726967696e223a66616c7365000000000000000000000000000000000000000000000000000000000000",
    },
  ] as SafeMultisigConfirmationResponse[];
  const onchain =
    "0x5a38af0241efa9a7c2a28a3fc29a807edafa0fc0181f77c2d37a161e9f9e88ab1939d49002aac26b63d93dfab2923ae80381e042da13c8f3dd27fea753a8ceaf1b000000000000000000000000868002873d287f27d12cb94a70cde4d2b2d3ff3f0000000000000000000000000000000000000000000000000000000000000082000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e08587b23f49a1a1ebef789ec25276b78aa6fd1d2d7eb5a0abf26a0075a702411e75687c2523aa5d0af1a0eec272ca6e270c9a7619c9a3f0e0986e2f048345ecde00000000000000000000000000000000000000000000000000000000000000257b14bdf48e3ff32cce9e30f509a70d2c6793ca8a37180317384684401c66d65f1d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042226f726967696e223a2268747470733a2f2f797562697369676e2d746573746e65742e706f6a656368612e6c69222c2263726f73734f726967696e223a66616c7365000000000000000000000000000000000000000000000000000000000000";

  it("rebuilds the exact signatures the Safe accepted, contract signature included", () => {
    // Hex compares case-insensitively; protocol-kit writes the owner checksummed.
    expect(buildSignatureBytes(confirmations.map(toSafeSignature)).toLowerCase()).toBe(onchain);
  });

  it("would not if contract signatures were added as plain ones", () => {
    const naive = confirmations.map((c) => new EthSafeSignature(c.owner, c.signature));
    expect(buildSignatureBytes(naive).toLowerCase()).not.toBe(onchain);
  });
});

describe("computeSafeTxHashes versions", () => {
  it("reads versions with a suffix", () => {
    const hash = (version: string) => computeSafeTxHashes({ chainId: 1, safeAddress: SAFE, version, tx }).safeTxHash;
    expect(hash("1.4.1-RWA")).toBe(hash("1.4.1"));
    expect(hash("1.3.0-custom")).toBe(hash("1.3.0"));
  });
});
