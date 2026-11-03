"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Wallet } from "lucide-react";
import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import { Panel } from "@/components/comic";
import { getChainById } from "@/lib/safe/chains";
import { errorMessage, shortAddress } from "@/lib/safe/format";
import { Avatar } from "./address";
import { Button } from "./ui";

export function ConnectButton() {
  const { address, chainId, isConnected, connector } = useConnection();
  const connectors = useConnectors();
  const { connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  // EIP-6963 wallets announce themselves; hide the generic "Injected" entry when any did.
  const hasAnnounced = connectors.some((c) => c.type === "injected" && c.id !== "injected");
  const options = connectors.filter((c) => !(hasAnnounced && c.id === "injected"));

  return (
    <div className="relative" ref={ref}>
      {isConnected && address ? (
        <Button variant="secondary" onClick={() => setOpen((v) => !v)} className="font-sans text-base font-bold normal-case">
          <Avatar address={address} />
          <span className="font-mono">{shortAddress(address)}</span>
          <span className="hidden text-neutral-600 sm:inline">{getChainById(chainId ?? 0)?.chain.name ?? `Chain ${chainId}`}</span>
          <ChevronDown className="h-4 w-4" strokeWidth={3} />
        </Button>
      ) : (
        <Button onClick={() => setOpen((v) => !v)} loading={isPending}>
          <Wallet className="h-5 w-5" strokeWidth={2.5} /> Connect wallet
        </Button>
      )}

      {open && (
        <Panel className="absolute right-0 z-30 mt-3 w-80 p-3">
          {isConnected && address ? (
            <>
              <div className="flex items-center gap-3 p-2">
                <Avatar address={address} size="lg" />
                <div className="min-w-0">
                  <p className="truncate font-mono text-base font-bold">{shortAddress(address, 6)}</p>
                  <p className="text-sm text-neutral-700">via {connector?.name}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <>
              <p className="px-2 pb-2 text-sm font-bold uppercase tracking-wider">Choose your wallet</p>
              {options.length === 0 && <p className="px-2 pb-2 text-base">No wallet found in this browser. Install MetaMask or Rabby first.</p>}
              {options.map((c) => (
                <button
                  key={c.uid}
                  className="flex h-14 w-full items-center gap-3 border-2 border-transparent px-2 text-left text-lg font-bold transition hover:border-black hover:bg-[#FFD400]"
                  // Keep the picker open while connecting so errors stay visible.
                  onClick={() => connect({ connector: c }, { onSuccess: () => setOpen(false) })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.icon ? <img src={c.icon} alt="" className="h-8 w-8" /> : <Wallet className="h-8 w-8" />}
                  {c.name}
                </button>
              ))}
              {error && <p className="px-2 pt-2 text-sm font-bold text-[#E5221A]">{errorMessage(error)}</p>}
            </>
          )}
        </Panel>
      )}
    </div>
  );
}
