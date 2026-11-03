import type { SafeMultisigTransactionResponse, SafeTransactionData } from "@safe-global/types-kit";
import { type Address, getAddress } from "viem";
import { type ChainConfig, serviceSlugOf } from "./chains";
import { APP_ORIGIN } from "./safe";

/*
 * The handful of Safe Transaction Service endpoints the page uses.
 *
 * In production, requests go through the Cloudflare Pages Function at /api/safe-tx
 * (functions/api/safe-tx), which adds SAFE_API_KEY on the server. `next dev` doesn't
 * run Pages Functions, so development talks to Safe directly, without a key.
 */

export type ListResponse<T> = { count: number; next?: string | null; previous?: string | null; results: T[] };

export type ServiceBalance = {
  tokenAddress: string | null;
  token: { name: string; symbol: string; decimals: number; logoUri?: string } | null;
  balance: string;
};

function baseUrl(chain: ChainConfig): string {
  return process.env.NODE_ENV === "development"
    ? `https://api.safe.global/tx-service/${serviceSlugOf(chain)}/api`
    : `/api/safe-tx/${chain.chain.id}`;
}

export class ServiceError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

// The service rate-limits bursts, such as checking every network at once. A 429 means the
// request was turned away unprocessed, so it is safe to wait and send it again, POSTs included.
const RETRY_DELAYS = [1_000, 2_500, 5_000];

async function send(chain: ChainConfig, path: string, body?: unknown): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${baseUrl(chain)}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status !== 429 || attempt === RETRY_DELAYS.length) return res;
    // Jitter, so requests that were refused together don't all come back at the same moment.
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt] + Math.random() * 1_000));
  }
}

async function request<T>(chain: ChainConfig, path: string, body?: unknown): Promise<T> {
  const res = await send(chain, path, body);
  const text = await res.text();
  if (!res.ok) {
    let message = res.statusText || "Request failed";
    try {
      // The service reports errors under different keys depending on the endpoint.
      const json = JSON.parse(text);
      const detail = json.message ?? json.detail ?? json.nonFieldErrors ?? json.data;
      message = typeof detail === "string" ? detail : Array.isArray(detail) ? detail.join(" ") : JSON.stringify(detail ?? json);
    } catch {
      // Not JSON; keep the status text.
    }
    throw new ServiceError(res.status, `${message} (HTTP ${res.status})`);
  }
  return (text ? JSON.parse(text) : undefined) as T;
}

// The service rejects addresses that aren't checksummed (HTTP 422), so every path goes through getAddress.

export function getPendingTransactions(chain: ChainConfig, safe: Address, currentNonce: number) {
  return request<ListResponse<SafeMultisigTransactionResponse>>(
    chain,
    `/v2/safes/${getAddress(safe)}/multisig-transactions/?executed=false&nonce__gte=${currentNonce}&limit=100`,
  );
}

export function getHistory(chain: ChainConfig, safe: Address, limit: number) {
  return request<ListResponse<SafeMultisigTransactionResponse>>(
    chain,
    `/v2/safes/${getAddress(safe)}/multisig-transactions/?executed=true&ordering=-nonce&limit=${limit}`,
  );
}

export function getBalances(chain: ChainConfig, safe: Address) {
  return request<ListResponse<ServiceBalance>>(chain, `/v2/safes/${getAddress(safe)}/balances/?exclude_spam=true&trusted=false&limit=200`);
}

export function getSafesByOwner(chain: ChainConfig, owner: Address) {
  return request<{ safes: string[] }>(chain, `/v1/owners/${getAddress(owner)}/safes/`);
}

export function proposeTransaction(
  chain: ChainConfig,
  args: { safe: Address; data: SafeTransactionData; safeTxHash: string; sender: Address; signature: string },
) {
  return request<void>(chain, `/v2/safes/${getAddress(args.safe)}/multisig-transactions/`, {
    ...args.data,
    contractTransactionHash: args.safeTxHash,
    sender: getAddress(args.sender),
    signature: args.signature,
    origin: APP_ORIGIN,
  });
}

export function confirmTransaction(chain: ChainConfig, safeTxHash: string, signature: string) {
  return request<void>(chain, `/v1/multisig-transactions/${safeTxHash}/confirmations/`, { signature });
}
