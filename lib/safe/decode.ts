import type { DataDecoded } from "@safe-global/types-kit";
import { type AbiFunction, type Address, type Hex, decodeFunctionData, getAbiItem, isAddressEqual, parseAbi } from "viem";
import { type MetaTx, unpackMultiSend } from "./safe";

export const ERC20_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]);

const SAFE_ABI = parseAbi([
  "function addOwnerWithThreshold(address owner, uint256 _threshold)",
  "function removeOwner(address prevOwner, address owner, uint256 _threshold)",
  "function swapOwner(address prevOwner, address oldOwner, address newOwner)",
  "function changeThreshold(uint256 _threshold)",
  "function enableModule(address module)",
  "function disableModule(address prevModule, address module)",
  "function setGuard(address guard)",
  "function setModuleGuard(address moduleGuard)",
  "function setFallbackHandler(address handler)",
  "function changeMasterCopy(address _masterCopy)",
  "function approveHash(bytes32 hashToApprove)",
]);

const MULTISEND_ABI = parseAbi(["function multiSend(bytes transactions)"]);

const KNOWN_ABI = [...ERC20_ABI, ...SAFE_ABI, ...MULTISEND_ABI];

/** Safe calls that change who controls the account. */
export const SENSITIVE_SAFE_METHODS = new Set([
  "addOwnerWithThreshold",
  "removeOwner",
  "swapOwner",
  "changeThreshold",
  "enableModule",
  "disableModule",
  "setGuard",
  "setModuleGuard",
  "setFallbackHandler",
  "changeMasterCopy",
]);

export type DecodedParam = { name: string; type: string; value: string };

export type DecodedCall = {
  method: string;
  params: DecodedParam[];
  /** "local" when decoded in the browser against known ABIs, "service" when we fell back to the Safe service. */
  source: "local" | "service";
  /** Inner calls when this is a MultiSend batch. */
  inner?: (MetaTx & { decoded?: DecodedCall })[];
};

function stringify(value: unknown): string {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return `[${value.map(stringify).join(", ")}]`;
  if (value && typeof value === "object") return JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v));
  return String(value);
}

export function decodeLocally(data: Hex | undefined | null): DecodedCall | undefined {
  if (!data || data === "0x" || data.length < 10) return undefined;
  try {
    const { functionName, args } = decodeFunctionData({ abi: KNOWN_ABI, data });
    const item = getAbiItem({ abi: KNOWN_ABI, name: functionName, args } as never) as AbiFunction | undefined;
    const inputs = item?.inputs ?? [];
    const values = (args ?? []) as readonly unknown[];
    const decoded: DecodedCall = {
      method: functionName,
      source: "local",
      params: inputs.map((input, i) => ({ name: input.name ?? `arg${i}`, type: input.type, value: stringify(values[i]) })),
    };
    if (functionName === "multiSend") {
      decoded.inner = unpackMultiSend(values[0] as Hex).map((tx) => ({ ...tx, decoded: decodeAny(tx.data) }));
    }
    return decoded;
  } catch {
    return undefined;
  }
}

function fromService(dataDecoded: DataDecoded): DecodedCall {
  return {
    method: dataDecoded.method,
    source: "service",
    params: dataDecoded.parameters.map((p) => ({ name: p.name, type: p.type, value: stringify(p.value) })),
  };
}

/** Local decoding first; the service's decoding is only used for ABIs we don't ship. */
export function decodeAny(data: Hex | undefined | null, serviceDecoded?: DataDecoded | null): DecodedCall | undefined {
  const local = decodeLocally(data);
  if (local?.inner && serviceDecoded) {
    const serviceInner = serviceDecoded.parameters[0]?.valueDecoded;
    local.inner = local.inner.map((tx, i) => {
      const candidate = serviceInner?.[i];
      // Only borrow the service's label when it describes exactly the bytes we unpacked.
      const matches = candidate?.dataDecoded && candidate.data?.toLowerCase() === tx.data.toLowerCase();
      return { ...tx, decoded: tx.decoded ?? (matches ? fromService(candidate.dataDecoded!) : undefined) };
    });
  }
  return local ?? (serviceDecoded ? fromService(serviceDecoded) : undefined);
}

export function isSelfCall(to: string, safeAddress: Address): boolean {
  return isAddressEqual(to as Address, safeAddress);
}
