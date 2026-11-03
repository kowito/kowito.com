import type { Chain, Transport } from "viem";
import { createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { transportFor } from "./chain-client";
import { CHAINS } from "./chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: CHAINS.map((c) => c.chain) as [Chain, ...Chain[]],
  connectors: [
    injected(),
    ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
  ],
  transports: Object.fromEntries(CHAINS.map((c) => [c.chain.id, transportFor(c)])) as Record<
    number,
    Transport
  >,
  ssr: true,
});
