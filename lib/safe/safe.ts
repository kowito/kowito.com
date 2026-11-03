import Safe, { type Eip1193Provider, EthSafeSignature } from "@safe-global/protocol-kit";
import { getMultiSendCallOnlyDeployments, getMultiSendDeployments } from "@safe-global/safe-deployments";
import type {
  SafeMultisigConfirmationResponse,
  SafeMultisigTransactionResponse,
  SafeTransaction,
  SafeTransactionData,
} from "@safe-global/types-kit";
import {
  type Address,
  type Hex,
  concat,
  getAddress,
  hashDomain,
  hashMessage,
  hashStruct,
  isAddressEqual,
  keccak256,
  parseAbi,
  recoverAddress,
  zeroAddress,
} from "viem";
import { getPublicClient } from "./chain-client";
import type { ChainConfig } from "./chains";

export const APP_ORIGIN = "kowito.com/safe";

// ---------------------------------------------------------------------------
// SDK instances

const readKits = new Map<string, Promise<Safe>>();

/** protocol-kit bound to the public RPCs (with their fallbacks), for reads and for building transactions. */
export function getReadKit(chain: ChainConfig, safeAddress: Address): Promise<Safe> {
  const key = `${chain.chain.id}:${safeAddress.toLowerCase()}`;
  let kit = readKits.get(key);
  if (!kit) {
    // A viem client is an EIP-1193 provider, so protocol-kit's reads share its fallback transport.
    kit = Safe.init({ provider: getPublicClient(chain) as unknown as Eip1193Provider, safeAddress });
    kit.catch(() => readKits.delete(key));
    readKits.set(key, kit);
  }
  return kit;
}

/** protocol-kit bound to the connected wallet, for signing and executing. */
export function getSignerKit(provider: Eip1193Provider, signer: Address, safeAddress: Address): Promise<Safe> {
  return Safe.init({ provider, signer, safeAddress });
}

// ---------------------------------------------------------------------------
// EIP-712 hashing, computed locally so we never rely on the service's
// safeTxHash. domainHash + messageHash are what hardware wallets display.

function versionAtLeast(version: string, target: string): boolean {
  // Versions can carry a suffix, e.g. "1.3.0+L2" or a custom deployment's "1.4.1-RWA".
  const a = version.split(/[+-]/)[0].split(".").map((n) => parseInt(n, 10));
  const b = target.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) !== b[i]) return (a[i] ?? 0) > b[i];
  }
  return true;
}

export type SafeTxFields = Pick<
  SafeTransactionData,
  "to" | "value" | "data" | "operation" | "safeTxGas" | "baseGas" | "gasPrice" | "gasToken" | "refundReceiver"
> & { nonce: number | string };

export type SafeTxHashes = { domainHash: Hex; messageHash: Hex; safeTxHash: Hex };

export function computeSafeTxHashes(args: {
  chainId: number;
  safeAddress: Address;
  version: string;
  tx: SafeTxFields;
}): SafeTxHashes {
  const { chainId, safeAddress, version, tx } = args;
  const withChainId = versionAtLeast(version, "1.3.0");
  // Safes before 1.0.0 called the baseGas field dataGas.
  const gasField = versionAtLeast(version, "1.0.0") ? "baseGas" : "dataGas";

  const domainHash = withChainId
    ? hashDomain({
        domain: { chainId: BigInt(chainId), verifyingContract: safeAddress },
        types: {
          EIP712Domain: [
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
        },
      })
    : hashDomain({
        domain: { verifyingContract: safeAddress },
        types: { EIP712Domain: [{ name: "verifyingContract", type: "address" }] },
      });

  const safeTxType = [
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "data", type: "bytes" },
    { name: "operation", type: "uint8" },
    { name: "safeTxGas", type: "uint256" },
    { name: gasField, type: "uint256" },
    { name: "gasPrice", type: "uint256" },
    { name: "gasToken", type: "address" },
    { name: "refundReceiver", type: "address" },
    { name: "nonce", type: "uint256" },
  ];
  const message: Record<string, unknown> = {
    to: tx.to,
    value: BigInt(tx.value),
    data: tx.data || "0x",
    operation: Number(tx.operation),
    safeTxGas: BigInt(tx.safeTxGas),
    [gasField]: BigInt(tx.baseGas),
    gasPrice: BigInt(tx.gasPrice),
    gasToken: tx.gasToken || zeroAddress,
    refundReceiver: tx.refundReceiver || zeroAddress,
    nonce: BigInt(tx.nonce),
  };
  // The field set depends on the Safe version, so the types are only known at runtime.
  const messageHash = hashStruct({ primaryType: "SafeTx", types: { SafeTx: safeTxType }, data: message } as never);

  return { domainHash, messageHash, safeTxHash: keccak256(concat(["0x1901", domainHash, messageHash])) };
}

const GET_TRANSACTION_HASH_ABI = parseAbi([
  "function getTransactionHash(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce) view returns (bytes32)",
]);

/** Asks the Safe contract itself for the hash, as a check on computeSafeTxHashes that doesn't share any code with it. */
export function getOnchainSafeTxHash(chain: ChainConfig, safeAddress: Address, tx: SafeTxFields): Promise<Hex> {
  return getPublicClient(chain).readContract({
    address: safeAddress,
    abi: GET_TRANSACTION_HASH_ABI,
    functionName: "getTransactionHash",
    args: [
      getAddress(tx.to),
      BigInt(tx.value),
      (tx.data || "0x") as Hex,
      Number(tx.operation),
      BigInt(tx.safeTxGas),
      BigInt(tx.baseGas),
      BigInt(tx.gasPrice),
      getAddress(tx.gasToken || zeroAddress),
      getAddress(tx.refundReceiver || zeroAddress),
      BigInt(tx.nonce),
    ],
  });
}

// ---------------------------------------------------------------------------
// Signature checks for confirmations returned by the service

export type ConfirmationCheck = {
  owner: Address;
  /** Recovered signer matches the claimed owner (undefined = not checkable locally, e.g. contract signatures). */
  validSignature: boolean | undefined;
  isCurrentOwner: boolean;
};

export async function checkConfirmation(
  confirmation: SafeMultisigConfirmationResponse,
  safeTxHash: Hex,
  owners: readonly string[],
): Promise<ConfirmationCheck> {
  const owner = getAddress(confirmation.owner);
  const isCurrentOwner = owners.some((o) => isAddressEqual(o as Address, owner));
  let validSignature: boolean | undefined;
  try {
    const sig = confirmation.signature as Hex;
    if (confirmation.signatureType === "EOA") {
      validSignature = isAddressEqual(await recoverAddress({ hash: safeTxHash, signature: sig }), owner);
    } else if (confirmation.signatureType === "ETH_SIGN") {
      // eth_sign signatures have v shifted by 4 so the Safe can tell them apart.
      const v = parseInt(sig.slice(130, 132), 16) - 4;
      const normalized = `${sig.slice(0, 130)}${v.toString(16).padStart(2, "0")}` as Hex;
      const hash = hashMessage({ raw: safeTxHash });
      validSignature = isAddressEqual(await recoverAddress({ hash, signature: normalized }), owner);
    }
  } catch {
    validSignature = false;
  }
  return { owner, validSignature, isCurrentOwner };
}

// ---------------------------------------------------------------------------
// Executing queued transactions

/**
 * A confirmation from the service as a signature the Safe accepts. The service stores a contract
 * signature (from an owner that is itself a smart account, e.g. another Safe) already encoded as if
 * it were the only one: owner, offset, v = 0, then its length and data. Next to other signatures
 * the offset changes, so only the data is kept and protocol-kit lays it out again.
 */
export function toSafeSignature(confirmation: SafeMultisigConfirmationResponse): EthSafeSignature {
  if (confirmation.signatureType !== "CONTRACT_SIGNATURE") return new EthSafeSignature(confirmation.owner, confirmation.signature);
  const hex = confirmation.signature.slice(2);
  const start = parseInt(hex.slice(64, 128), 16) * 2;
  const length = parseInt(hex.slice(start, start + 64), 16) * 2;
  return new EthSafeSignature(confirmation.owner, `0x${hex.slice(start + 64, start + 64 + length)}`, true);
}

/** A queued transaction, signed with exactly its `confirmations`, ready to execute. */
export async function toExecutableTransaction(kit: Safe, tx: SafeMultisigTransactionResponse): Promise<SafeTransaction> {
  // protocol-kit's own conversion adds contract signatures as plain ones, which the Safe rejects.
  const safeTx = await kit.toSafeTransactionType({ ...tx, confirmations: [] });
  for (const confirmation of tx.confirmations ?? []) safeTx.addSignature(toSafeSignature(confirmation));
  return safeTx;
}

// ---------------------------------------------------------------------------
// MultiSend

const MULTISEND_VERSIONS = ["1.1.1", "1.3.0", "1.4.1", "1.5.0"];

/** Official MultiSend / MultiSendCallOnly deployments: the only delegatecall targets we treat as expected. */
export function getTrustedDelegateCallTargets(chainId: number): Address[] {
  const network = String(chainId);
  const out = new Set<Address>();
  for (const version of MULTISEND_VERSIONS) {
    for (const getter of [getMultiSendDeployments, getMultiSendCallOnlyDeployments]) {
      // networkAddresses maps chain id to the deployed address(es) for that chain.
      const addresses = getter({ version, network, released: true })?.networkAddresses[network];
      if (!addresses) continue;
      for (const address of Array.isArray(addresses) ? addresses : [addresses]) out.add(getAddress(address));
    }
  }
  return [...out];
}

export type MetaTx = { operation: number; to: Address; value: bigint; data: Hex };

/** Unpacks the `transactions` bytes argument of MultiSend.multiSend. */
export function unpackMultiSend(packed: Hex): MetaTx[] {
  const hex = packed.slice(2);
  const txs: MetaTx[] = [];
  let i = 0;
  while (i < hex.length) {
    // operation (1 byte) + to (20) + value (32) + data length (32)
    if (i + 2 + 40 + 64 + 64 > hex.length) throw new Error("Malformed MultiSend payload");
    const operation = parseInt(hex.slice(i, i + 2), 16);
    i += 2;
    const to = getAddress(`0x${hex.slice(i, i + 40)}`);
    i += 40;
    const value = BigInt(`0x${hex.slice(i, i + 64)}`);
    i += 64;
    const length = Number(BigInt(`0x${hex.slice(i, i + 64)}`));
    i += 64;
    const data = `0x${hex.slice(i, i + length * 2)}` as Hex;
    i += length * 2;
    if (data.length !== 2 + length * 2) throw new Error("Malformed MultiSend payload");
    txs.push({ operation, to, value, data });
  }
  return txs;
}
