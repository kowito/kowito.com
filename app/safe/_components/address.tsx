"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { type ChainConfig, explorerUrl } from "@/lib/safe/chains";
import { shortAddress } from "@/lib/safe/format";
import { cn } from "@/lib/utils";

const iconButton =
  "grid h-9 w-9 shrink-0 place-items-center border-2 border-transparent text-black transition hover:border-black hover:bg-[#FFD400]";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={iconButton}
      title="Copy"
      aria-label="Copy"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      }}
    >
      {copied ? <Check className="h-4 w-4 text-[#139A55]" strokeWidth={3} /> : <Copy className="h-4 w-4" strokeWidth={2.5} />}
    </button>
  );
}

export function ExplorerLink({ href }: { href?: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={iconButton}
      title="Open in block explorer"
      aria-label="Open in block explorer"
      onClick={(e) => e.stopPropagation()}
    >
      <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
    </a>
  );
}

/** Deterministic colour blob so owners are easier to tell apart at a glance. */
export function Avatar({ address, size = "md" }: { address: string; size?: "md" | "lg" | "xl" }) {
  const hue = parseInt(address.slice(2, 8), 16) % 360;
  const hue2 = parseInt(address.slice(-6), 16) % 360;
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full border-black",
        size === "md" && "h-7 w-7 border-2",
        size === "lg" && "h-11 w-11 border-[3px]",
        size === "xl" && "h-16 w-16 border-[3px] shadow-[3px_3px_0_0_#000]",
      )}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 85% 60%), hsl(${hue2} 85% 45%))` }}
      aria-hidden
    />
  );
}

export function AddressView({ address, chain, full }: { address: string; chain?: ChainConfig; full?: boolean }) {
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-2">
      <Avatar address={address} />
      <span className="truncate font-mono text-base font-bold" title={address}>
        {full ? address : shortAddress(address)}
      </span>
      <span className="-ml-1 flex items-center">
        <CopyButton value={address} />
        <ExplorerLink href={chain && explorerUrl(chain, "address", address)} />
      </span>
    </span>
  );
}
