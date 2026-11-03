"use client";

import type { ReactNode } from "react";
import { type Address, formatUnits, isAddressEqual, maxUint256 } from "viem";
import { useConnection } from "wagmi";
import { display } from "@/components/comic";
import { explorerUrl } from "@/lib/safe/chains";
import { type DecodedCall, isSelfCall } from "@/lib/safe/decode";
import { formatAmount, shortAddress } from "@/lib/safe/format";
import { cn } from "@/lib/utils";
import { useTokenMeta } from "../_hooks/use-token-meta";
import { Avatar, CopyButton, ExplorerLink } from "./address";
import { useSafe } from "./safe-context";

export type Call = {
  to: string;
  value: string | bigint;
  data?: string | null;
  operation: number;
  decoded?: DecodedCall;
};

/** An address with a human label ("you", "owner", "this Safe") instead of just hex. */
export function Who({ address, plain, inOwnerList }: { address: string; plain?: boolean; inOwnerList?: boolean }) {
  const { chain, safeAddress, info } = useSafe();
  const { address: me } = useConnection();
  const a = address as Address;
  const label = isAddressEqual(a, safeAddress)
    ? "this Safe"
    : me && isAddressEqual(a, me)
      ? "you"
      : !inOwnerList && info.owners.some((o) => isAddressEqual(o, a))
        ? "owner"
        : undefined;
  return (
    <span className="inline-flex max-w-full items-center gap-2 align-middle">
      <Avatar address={address} />
      <span className="whitespace-nowrap font-mono text-base font-bold text-black" title={address}>
        {shortAddress(address)}
      </span>
      {label && <span className="border-2 border-black bg-white px-1.5 text-xs font-bold uppercase text-black">{label}</span>}
      {!plain && (
        <span className="-ml-1 inline-flex">
          <CopyButton value={address} />
          <ExplorerLink href={explorerUrl(chain, "address", address)} />
        </span>
      )}
    </span>
  );
}

function TokenAmount({ token, amount }: { token: Address; amount: bigint }) {
  const { chain } = useSafe();
  const meta = useTokenMeta(chain, token);
  if (amount === maxUint256) return <>an unlimited amount of {meta.data?.symbol ?? "this token"}</>;
  if (meta.isPending) return <>…</>;
  if (!meta.data) return <>{amount.toString()} units of an unknown token</>;
  return (
    <>
      {formatAmount(amount, meta.data.decimals)} {meta.data.symbol}
    </>
  );
}

const SECURITY_LABELS: Record<string, string> = {
  enableModule: "Turn on an add-on (module) that can move funds without approvals",
  disableModule: "Turn off an add-on (module)",
  setGuard: "Set a guard that checks every transaction",
  setModuleGuard: "Set a guard for add-ons",
  setFallbackHandler: "Change the fallback handler",
  changeMasterCopy: "Replace the Safe's core contract",
};

type Described = { title: ReactNode; detail?: ReactNode; danger?: boolean };

function useDescribe(call: Call, nonce?: number): Described {
  const { chain, safeAddress, info } = useSafe();
  const native = chain.chain.nativeCurrency;
  const value = BigInt(call.value);
  const data = call.data && call.data !== "0x" ? call.data : undefined;
  // The plain-language templates below assume the exact ERC-20 and Safe ABIs, so they only apply to
  // calls decoded here. A function the service decoded may share a name but not the parameters.
  const method = call.decoded?.source === "local" ? call.decoded.method : undefined;
  const anyMethod = call.decoded?.method;
  const p = call.decoded?.params.map((x) => x.value) ?? [];
  const self = isSelfCall(call.to, safeAddress);

  if (self && !data && value === 0n) {
    return {
      title: "Cancel a pending transaction",
      detail: `Uses up transaction #${nonce ?? "?"}, so any other transaction with that number can never go through.`,
    };
  }
  if (method === "multiSend") {
    return { title: `${call.decoded?.inner?.length ?? "Several"} actions in one go` };
  }
  if (self && method === "addOwnerWithThreshold") {
    return { title: "Add a new owner", detail: <><Who address={p[0]} /> · then {p[1]} of {info.owners.length + 1} approvals needed</> };
  }
  if (self && method === "removeOwner") {
    return { title: "Remove an owner", detail: <><Who address={p[1]} /> · then {p[2]} of {info.owners.length - 1} approvals needed</> };
  }
  if (self && method === "swapOwner") {
    return { title: "Replace an owner", detail: <><Who address={p[1]} /> → <Who address={p[2]} /></> };
  }
  if (self && method === "changeThreshold") {
    return { title: `Require ${p[0]} of ${info.owners.length} approvals`, detail: `Currently ${info.threshold} of ${info.owners.length}.` };
  }
  if (self && method && SECURITY_LABELS[method]) {
    return {
      title: "Change the Safe's security settings",
      detail: <>{SECURITY_LABELS[method]}{p[p.length - 1] && <>: <Who address={p[p.length - 1]} /></>}</>,
      danger: true,
    };
  }
  if (method === "transfer" && p.length === 2) {
    return {
      title: <>Send <TokenAmount token={call.to as Address} amount={BigInt(p[1])} /></>,
      detail: <>to <Who address={p[0]} /></>,
    };
  }
  if ((method === "approve" || method === "increaseAllowance") && p.length === 2) {
    return {
      title: <>Allow spending of <TokenAmount token={call.to as Address} amount={BigInt(p[1])} /></>,
      detail: <>by <Who address={p[0]} /></>,
      danger: BigInt(p[1]) === maxUint256,
    };
  }
  if (method === "transferFrom" && p.length === 3) {
    return {
      title: <>Move <TokenAmount token={call.to as Address} amount={BigInt(p[2])} /></>,
      detail: <>from <Who address={p[0]} /> to <Who address={p[1]} /></>,
    };
  }
  if (!data) {
    return {
      title: `Send ${formatAmount(value, native.decimals)} ${native.symbol}`,
      detail: <>to <Who address={call.to} /></>,
    };
  }
  return {
    title: "Use an app or contract",
    detail: (
      <>
        Calls {anyMethod ? <span className="font-mono font-bold">{anyMethod}</span> : "an unknown function"} on <Who address={call.to} />
        {value > 0n && ` and sends ${formatUnits(value, native.decimals)} ${native.symbol}`}
      </>
    ),
  };
}

/** Title only, for list rows. A batch is named after its first action, e.g. "Send 5 USDC + 2 more". */
export function TxTitle({ call, nonce }: { call: Call; nonce?: number }) {
  const { title } = useDescribe(call, nonce);
  const inner = call.decoded?.inner;
  if (inner?.length) {
    const first = inner[0];
    return (
      <>
        <TxTitle call={{ to: first.to, value: first.value, data: first.data, operation: first.operation, decoded: first.decoded }} />
        {inner.length > 1 && <span className="font-normal text-neutral-600"> + {inner.length - 1} more</span>}
      </>
    );
  }
  return <>{title}</>;
}

/** Full plain-language description, including each step of a batch. */
export function TxSummary({ call, nonce, size = "lg" }: { call: Call; nonce?: number; size?: "sm" | "md" | "lg" }) {
  const { title, detail, danger } = useDescribe(call, nonce);
  return (
    <div className="flex flex-col gap-2">
      <p
        className={cn(
          size === "lg" && `${display} text-4xl leading-none sm:text-5xl`,
          size === "md" && `${display} text-3xl leading-none sm:text-4xl`,
          size === "sm" && "text-xl font-bold",
          danger && "text-[#E5221A]",
        )}
      >
        {title}
      </p>
      {detail && <div className="text-lg leading-9">{detail}</div>}
      {call.decoded?.inner && (
        <ol className="mt-3 flex flex-col gap-3">
          {call.decoded.inner.map((inner, i) => (
            <li key={i} className="flex gap-4 border-2 border-black bg-white p-4">
              <span className={`${display} grid h-8 w-8 shrink-0 place-items-center bg-black text-lg text-[#FFD400]`}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <TxSummary
                  call={{ to: inner.to, value: inner.value, data: inner.data, operation: inner.operation, decoded: inner.decoded }}
                  size="sm"
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
