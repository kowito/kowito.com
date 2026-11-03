"use client";

import { useState } from "react";
import { type Address, type Hex, formatUnits, isAddressEqual, maxUint256, zeroAddress } from "viem";
import { type DecodedCall, SENSITIVE_SAFE_METHODS, isSelfCall } from "@/lib/safe/decode";
import { type SafeTxFields, type SafeTxHashes, getTrustedDelegateCallTargets } from "@/lib/safe/safe";
import { AddressView, CopyButton } from "./address";
import { useSafe } from "./safe-context";
import { Badge, Notice, Row } from "./ui";

export type TxLike = SafeTxFields & { decoded?: DecodedCall };

export function isRejection(tx: { to: string; value: string; data?: string | null; operation: number }, safeAddress: Address) {
  return (
    isSelfCall(tx.to, safeAddress) && BigInt(tx.value) === 0n && (!tx.data || tx.data === "0x") && Number(tx.operation) === 0
  );
}

type Warning = { tone: "danger" | "warning"; text: string };

function collectWarnings(
  call: { to: string; operation: number; decoded?: DecodedCall },
  safeAddress: Address,
  trusted: Address[],
  out: Warning[],
  prefix = "",
) {
  if (call.operation === 1 && !trusted.some((t) => isAddressEqual(t, call.to as Address))) {
    out.push({
      tone: "danger",
      text: `${prefix}Danger: this gives the contract ${call.to} full control of your Safe. Don't approve unless you know exactly what it does.`,
    });
  }
  const method = call.decoded?.method;
  if (method && isSelfCall(call.to, safeAddress) && SENSITIVE_SAFE_METHODS.has(method)) {
    const tone = ["enableModule", "setGuard", "setModuleGuard", "setFallbackHandler", "changeMasterCopy"].includes(method)
      ? "danger"
      : "warning";
    out.push({
      tone,
      text:
        tone === "danger"
          ? `${prefix}This changes the Safe's security settings (${method}). It could let someone move funds without your approval.`
          : `${prefix}This changes who controls the Safe. Make sure you recognize every address.`,
    });
  }
  if ((method === "approve" || method === "increaseAllowance") && call.decoded?.params[1]?.value === maxUint256.toString()) {
    out.push({
      tone: "warning",
      text: `${prefix}This lets ${call.decoded.params[0]?.value} take any amount of this token from the Safe, at any time.`,
    });
  }
  call.decoded?.inner?.forEach((inner, i) => collectWarnings(inner, safeAddress, trusted, out, `${prefix}Call #${i + 1}: `));
}

export function TxWarnings({ tx }: { tx: TxLike }) {
  const { chainId, safeAddress } = useSafe();
  const warnings: Warning[] = [];
  collectWarnings(
    { to: tx.to, operation: Number(tx.operation), decoded: tx.decoded },
    safeAddress,
    getTrustedDelegateCallTargets(chainId),
    warnings,
  );
  if (BigInt(tx.gasPrice) > 0n || (tx.refundReceiver && tx.refundReceiver !== zeroAddress)) {
    warnings.push({
      tone: "warning",
      text: "Whoever completes this transaction will be paid back for the network fee from the Safe's funds.",
    });
  }
  if (warnings.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      {warnings.map((w, i) => (
        <Notice key={i} tone={w.tone} title={w.tone === "danger" ? "Careful!" : "Heads up"}>
          {w.text}
        </Notice>
      ))}
    </div>
  );
}

export function DecodedCallView({ decoded }: { decoded: DecodedCall }) {
  const { chain } = useSafe();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-lg font-bold">{decoded.method}</span>
        {decoded.source === "service" ? (
          <Badge tone="warning">Decoded by Safe service</Badge>
        ) : (
          <Badge tone="success">Decoded here</Badge>
        )}
      </div>
      {decoded.method !== "multiSend" && decoded.params.length > 0 && (
        <dl className="flex flex-col gap-2 border-l-[3px] border-black pl-3">
          {decoded.params.map((p, i) => (
            <div key={i}>
              <dt className="text-sm font-bold text-neutral-700">
                {p.name} · {p.type}
              </dt>
              <dd className="break-all font-mono text-sm">{p.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {decoded.inner && (
        <ol className="flex flex-col gap-3">
          {decoded.inner.map((call, i) => (
            <li key={i} className="border-2 border-black bg-[#FFF4DC] p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="grid h-7 w-7 place-items-center bg-black text-sm font-bold text-[#FFD400]">{i + 1}</span>
                <AddressView address={call.to} chain={chain} />
                {call.value > 0n && (
                  <Badge>
                    {formatUnits(call.value, chain.chain.nativeCurrency.decimals)} {chain.chain.nativeCurrency.symbol}
                  </Badge>
                )}
                {call.operation === 1 && <Badge tone="danger">Delegatecall</Badge>}
              </div>
              {call.decoded ? (
                <DecodedCallView decoded={call.decoded} />
              ) : call.data !== "0x" ? (
                <RawData data={call.data} />
              ) : (
                <span className="text-base">Plain transfer</span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function RawData({ data }: { data: string }) {
  const [open, setOpen] = useState(false);
  const long = data.length > 140;
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1 break-all font-mono text-sm leading-relaxed text-neutral-700">
        {open || !long ? data : `${data.slice(0, 140)}…`}
        {long && (
          <button className="ml-2 font-sans font-bold text-black underline underline-offset-4" onClick={() => setOpen(!open)}>
            {open ? "Show less" : `Show all ${(data.length - 2) / 2} bytes`}
          </button>
        )}
      </div>
      <CopyButton value={data} />
    </div>
  );
}

export function HashesView({ hashes, verified }: { hashes: SafeTxHashes; verified?: React.ReactNode }) {
  const items: [string, Hex][] = [
    ["safeTxHash", hashes.safeTxHash],
    ["Domain hash", hashes.domainHash],
    ["Message hash", hashes.messageHash],
  ];
  return (
    <div className="border-2 border-black bg-[#FFF4DC] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold">Check on your hardware wallet</p>
          <p className="text-sm text-neutral-700">A Ledger or Trezor should show these same codes when you approve.</p>
        </div>
        {verified}
      </div>
      <div className="flex flex-col gap-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <div className="text-sm font-bold text-neutral-700">{label}</div>
            <div className="flex items-start gap-2">
              <span className="min-w-0 flex-1 break-all font-mono text-sm leading-6">{value}</span>
              <CopyButton value={value} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The raw transaction fields; shown under "Technical details". Warnings are rendered separately via TxWarnings. */
export function TxDetails({ tx }: { tx: TxLike }) {
  const { chain, safeAddress } = useSafe();
  const value = BigInt(tx.value);
  return (
    <div className="divide-y-2 divide-dashed divide-black/25">
      <Row label="Contract (to)">
        <span className="inline-flex flex-wrap items-center gap-2">
          <AddressView address={tx.to} chain={chain} />
          {isSelfCall(tx.to, safeAddress) && <Badge>This Safe</Badge>}
        </span>
      </Row>
      <Row label="Value">
        {formatUnits(value, chain.chain.nativeCurrency.decimals)} {chain.chain.nativeCurrency.symbol}
      </Row>
      <Row label="Call type">{Number(tx.operation) === 1 ? <Badge tone="danger">Delegatecall</Badge> : <Badge>Call</Badge>}</Row>
      <Row label="Transaction #">{String(tx.nonce)}</Row>
      {(BigInt(tx.safeTxGas) > 0n || BigInt(tx.baseGas) > 0n || BigInt(tx.gasPrice) > 0n) && (
        <Row label="Gas params">
          <span className="font-mono text-sm">
            safeTxGas {tx.safeTxGas} · baseGas {tx.baseGas} · gasPrice {tx.gasPrice} · gasToken {tx.gasToken} · refundReceiver{" "}
            {tx.refundReceiver}
          </span>
        </Row>
      )}
      <Row label="Contract data">
        {tx.decoded ? (
          <DecodedCallView decoded={tx.decoded} />
        ) : tx.data && tx.data !== "0x" ? (
          <RawData data={tx.data} />
        ) : (
          <span className="text-neutral-600">None</span>
        )}
      </Row>
    </div>
  );
}
