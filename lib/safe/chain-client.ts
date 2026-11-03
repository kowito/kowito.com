import { type Address, type PublicClient, createPublicClient, fallback, http, parseAbi } from "viem";
import { CHAINS, type ChainConfig } from "./chains";

const clients = new Map<number, PublicClient>();

/** The chain's RPCs in order; a rate-limited or failing one hands over to the next. */
export function transportFor(config: ChainConfig) {
  return fallback(config.rpcUrls.map((url) => http(url, { timeout: 10_000 })));
}

export function getPublicClient(config: ChainConfig): PublicClient {
  let client = clients.get(config.chain.id);
  if (!client) {
    client = createPublicClient({ chain: config.chain, transport: transportFor(config) });
    clients.set(config.chain.id, client);
  }
  return client;
}

const SAFE_PROBE_ABI = parseAbi(["function getThreshold() view returns (uint256)"]);

/** Networks where `address` is a deployed Safe, so people don't have to know which network they're on. */
export async function findSafeNetworks(address: Address): Promise<ChainConfig[]> {
  const found = await Promise.all(
    CHAINS.map(async (config) => {
      try {
        const threshold = await getPublicClient(config).readContract({
          address,
          abi: SAFE_PROBE_ABI,
          functionName: "getThreshold",
        });
        return threshold > 0n ? config : undefined;
      } catch {
        return undefined;
      }
    }),
  );
  return found.filter((c): c is ChainConfig => Boolean(c));
}
