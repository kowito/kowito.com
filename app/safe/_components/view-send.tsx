"use client";

import type { MetaTransactionData } from "@safe-global/types-kit";
import { useState } from "react";
import { ArrowRight, ClipboardPaste } from "lucide-react";
import { type Address, encodeFunctionData, formatUnits, getAddress, isAddress, isAddressEqual, parseUnits } from "viem";
import { display, ink } from "@/components/comic";
import { ERC20_ABI } from "@/lib/safe/decode";
import { formatAmount } from "@/lib/safe/format";
import { cn } from "@/lib/utils";
import { type TokenBalance, useBalances } from "../_hooks/use-safe-queries";
import { useSafe } from "./safe-context";
import { TxReview } from "./tx-review";
import { Who } from "./tx-summary";
import { Button, Card, Loading, Notice, Step, inputClass } from "./ui";

function tokenKey(t: TokenBalance) {
  return t.address ?? "native";
}

function parseAmount(amount: string, decimals: number): { value?: bigint; tooPrecise?: boolean } {
  const text = amount.trim().replace(/,/g, "");
  // parseUnits would quietly round away the extra digits; with money, say so instead.
  if ((text.split(".")[1]?.length ?? 0) > decimals) return { tooPrecise: true };
  try {
    const value = parseUnits(text, decimals);
    return value > 0n ? { value } : {};
  } catch {
    return {};
  }
}

export function SendView({ initialToken }: { initialToken?: string }) {
  const { safeAddress } = useSafe();
  const balances = useBalances();
  const [selected, setSelected] = useState(initialToken ?? "native");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [review, setReview] = useState<MetaTransactionData>();

  // Before anything that can show a spinner instead: sending changes the balances, and the
  // review must stay mounted through that, or it would forget it was sent and offer to send again.
  if (review) {
    return (
      <TxReview
        buildKey={JSON.stringify(review)}
        build={(kit, nonce) => kit.createTransaction({ transactions: [review], options: { nonce } })}
        onCancel={() => setReview(undefined)}
        // Start over afterwards, so going back can't send the same money twice.
        onDone={() => {
          setRecipient("");
          setAmount("");
        }}
      />
    );
  }

  if (balances.isPending) return <Loading />;
  const tokens = balances.data?.tokens ?? [];
  const token = tokens.find((t) => tokenKey(t).toLowerCase() === selected.toLowerCase()) ?? tokens[0];
  if (!token) return <Notice tone="danger">No balances available.</Notice>;

  const recipientValid = isAddress(recipient, { strict: false });
  const { value: parsed, tooPrecise } = parseAmount(amount, token.decimals);
  const exceeds = parsed !== undefined && parsed > token.balance;
  const recipientIsSafe = recipientValid && isAddressEqual(recipient as Address, safeAddress);
  const recipientIsToken = recipientValid && token.address && isAddressEqual(recipient as Address, token.address);
  const canContinue = recipientValid && parsed && !exceeds && !recipientIsToken;

  return (
    <Card title="Send money" className="mx-auto w-full max-w-2xl">
      <form
        className="flex flex-col gap-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canContinue) return;
          const to = getAddress(recipient);
          setReview(
            token.address
              ? { to: token.address, value: "0", data: encodeFunctionData({ abi: ERC20_ABI, functionName: "transfer", args: [to, parsed] }) }
              : { to, value: parsed.toString(), data: "0x" },
          );
        }}
      >
        <Step number={1} title="What do you want to send?">
          <div className="grid gap-3 sm:grid-cols-2">
            {tokens.map((t) => {
              const active = tokenKey(t) === tokenKey(token);
              return (
                <button
                  key={tokenKey(t)}
                  type="button"
                  onClick={() => {
                    setSelected(tokenKey(t));
                    setAmount("");
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 text-left transition",
                    ink,
                    active ? "-rotate-1 bg-[#FFD400] shadow-[4px_4px_0_0_#000]" : "bg-white hover:bg-[#FFF4DC]",
                  )}
                >
                  {t.logoUri ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.logoUri} alt="" className="h-10 w-10 shrink-0 rounded-full border-2 border-black bg-white" />
                  ) : (
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-black bg-[#4CC9F0] text-xs font-bold">
                      {t.symbol.slice(0, 4)}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-xl font-bold">{t.symbol}</span>
                    <span className="block truncate text-sm">{formatAmount(t.balance, t.decimals, 4)} available</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Step>

        <Step number={2} title="Who should receive it?">
          <div className="flex gap-3">
            <input
              className={cn(inputClass, "font-mono")}
              placeholder="Paste their address (starts with 0x)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.trim())}
              spellCheck={false}
              autoComplete="off"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigator.clipboard.readText().then((t) => setRecipient(t.trim()), () => undefined)}
            >
              <ClipboardPaste className="h-5 w-5" strokeWidth={2.5} /> Paste
            </Button>
          </div>
          {recipient && !recipientValid && (
            <p className="text-base font-bold text-[#E5221A]">
              This doesn&apos;t look like an address. It should start with 0x and be 42 characters long.
            </p>
          )}
          {recipientValid && (
            <p className="text-lg">
              Sending to <Who address={recipient} />
            </p>
          )}
          {recipientIsSafe && <Notice tone="warning">That&apos;s this Safe&apos;s own address. The money would stay here.</Notice>}
          {recipientIsToken && (
            <Notice tone="danger" title="Wrong address!">
              That&apos;s the token&apos;s own contract address. Money sent there is lost forever.
            </Notice>
          )}
        </Step>

        <Step number={3} title="How much?">
          <div className={cn("bg-white p-4 transition focus-within:shadow-[4px_4px_0_0_#000]", ink)}>
            <div className="flex items-center gap-3">
              <input
                className={`${display} min-w-0 flex-1 bg-transparent text-6xl tracking-wide outline-none placeholder:text-neutral-300`}
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Amount"
              />
              <span className={`${display} text-3xl`}>{token.symbol}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-base">
              <span>
                You have <strong>{formatAmount(token.balance, token.decimals)} {token.symbol}</strong>
              </span>
              <Button type="button" variant="secondary" size="sm" onClick={() => setAmount(formatUnits(token.balance, token.decimals))}>
                Send all
              </Button>
            </div>
          </div>
          {amount && !parsed && (
            <p className="text-base font-bold text-[#E5221A]">
              {tooPrecise
                ? `${token.symbol} can't be split into more than ${token.decimals} decimal places.`
                : "Enter an amount greater than 0, like 10 or 0.5."}
            </p>
          )}
          {exceeds && (
            <p className="text-base font-bold text-[#E5221A]">
              That&apos;s more than this Safe has ({formatAmount(token.balance, token.decimals)} {token.symbol}).
            </p>
          )}
        </Step>

        <Button type="submit" variant="go" size="lg" className="w-full" disabled={!canContinue}>
          Continue <ArrowRight className="h-6 w-6" strokeWidth={3} />
        </Button>
      </form>
    </Card>
  );
}
