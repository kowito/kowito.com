"use client";

import type { MetaTransactionData } from "@safe-global/types-kit";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { type AbiFunction, type Hex, encodeFunctionData, formatUnits, getAddress, isAddress, isHex, parseUnits } from "viem";
import { buttonClass, display } from "@/components/comic";
import { coerceInput, functionSignature, parseAbiText, placeholderFor } from "@/lib/safe/abi-input";
import { decodeLocally } from "@/lib/safe/decode";
import { errorMessage } from "@/lib/safe/format";
import { cn } from "@/lib/utils";
import { AddressView } from "./address";
import { useSafe } from "./safe-context";
import { DecodedCallView } from "./tx-details";
import { TxReview } from "./tx-review";
import { Badge, Button, Card, Empty, Field, Notice, inputClass, textareaClass } from "./ui";

type BatchItem = MetaTransactionData & { label: string };

const iconButton = "grid h-9 w-9 place-items-center border-2 border-transparent hover:border-black hover:bg-[#FFD400] disabled:opacity-30";

export function AdvancedView() {
  const { chain } = useSafe();
  const native = chain.chain.nativeCurrency;

  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<"abi" | "raw">("abi");
  const [abiText, setAbiText] = useState("");
  const [fnIndex, setFnIndex] = useState(0);
  const [args, setArgs] = useState<Record<number, string>>({});
  const [rawData, setRawData] = useState("");
  const [formError, setFormError] = useState<string>();
  const [batch, setBatch] = useState<BatchItem[]>([]);
  // Snapshot of the batch under review, so clearing the editable batch after proposing doesn't affect it.
  const [reviewing, setReviewing] = useState<BatchItem[]>();

  const abi = useMemo(() => {
    try {
      return { functions: parseAbiText(abiText), error: undefined };
    } catch (e) {
      return { functions: [] as AbiFunction[], error: errorMessage(e) };
    }
  }, [abiText]);
  const writable = abi.functions.filter((f) => f.stateMutability !== "view" && f.stateMutability !== "pure");
  const fn = writable[fnIndex];

  function addToBatch() {
    setFormError(undefined);
    try {
      if (!isAddress(to, { strict: false })) throw new Error("Enter a valid contract address");
      const wei = value.trim() ? parseUnits(value.trim(), native.decimals) : 0n;
      let data: Hex = "0x";
      let label: string;
      if (mode === "abi") {
        if (!fn) throw new Error("Paste an ABI and pick a function");
        const values = fn.inputs.map((input, i) => coerceInput(input, args[i] ?? ""));
        data = encodeFunctionData({ abi: [fn], functionName: fn.name, args: values });
        label = fn.name;
        if (wei > 0n && fn.stateMutability !== "payable") throw new Error(`${fn.name} is not payable; set value to 0`);
      } else {
        const raw = rawData.trim() || "0x";
        if (!isHex(raw) || raw.length % 2 !== 0) throw new Error("Data must be 0x-prefixed, even-length hex");
        data = raw;
        label = raw === "0x" ? "Transfer" : `Raw call ${raw.slice(0, 10)}`;
      }
      setBatch((b) => [...b, { to: getAddress(to), value: wei.toString(), data, label }]);
      setArgs({});
      setRawData("");
      setValue("");
    } catch (e) {
      setFormError(errorMessage(e));
    }
  }

  function move(i: number, delta: number) {
    setBatch((b) => {
      const next = [...b];
      const [item] = next.splice(i, 1);
      next.splice(i + delta, 0, item);
      return next;
    });
  }

  if (reviewing) {
    const transactions = reviewing.map(({ to, value, data }) => ({ to, value, data }));
    return (
      <TxReview
        buildKey={JSON.stringify(transactions)}
        // onlyCalls: batches go through MultiSendCallOnly, which cannot delegatecall.
        build={(kit, nonce) => kit.createTransaction({ transactions, onlyCalls: true, options: { nonce } })}
        onCancel={() => setReviewing(undefined)}
        onDone={() => setBatch([])}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Notice title="For experienced users">
        Use this to call any smart contract directly. If you only want to send money, use <strong>Send</strong> instead.
      </Notice>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
        <Card title="New call" subtitle="Encode a contract call and add it to the batch.">
          <div className="flex flex-col gap-6">
            <Field label="Contract address">
              <input className={cn(inputClass, "font-mono")} placeholder="0x…" value={to} onChange={(e) => setTo(e.target.value.trim())} spellCheck={false} />
            </Field>
            <Field label={`Value (${native.symbol})`} hint="Leave empty for 0">
              <input className={cn(inputClass, "font-mono")} inputMode="decimal" placeholder="0" value={value} onChange={(e) => setValue(e.target.value)} />
            </Field>

            <div className="flex flex-wrap gap-3">
              {(["abi", "raw"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)} className={buttonClass("sm", mode === m ? "bg-[#FFD400]" : "bg-white")}>
                  {m === "abi" ? "Contract ABI" : "Raw calldata"}
                </button>
              ))}
            </div>

            {mode === "abi" ? (
              <>
                <Field label="ABI" hint="JSON ABI, or one signature per line, e.g. transfer(address to, uint256 amount)" error={abi.error}>
                  <textarea
                    className={cn(textareaClass, "h-36")}
                    value={abiText}
                    onChange={(e) => {
                      setAbiText(e.target.value);
                      setFnIndex(0);
                      setArgs({});
                    }}
                    spellCheck={false}
                  />
                </Field>
                {writable.length > 0 && (
                  <Field label="Function">
                    <select
                      className={cn(inputClass, "cursor-pointer font-mono text-base")}
                      value={fnIndex}
                      onChange={(e) => {
                        setFnIndex(Number(e.target.value));
                        setArgs({});
                      }}
                    >
                      {writable.map((f, i) => (
                        <option key={i} value={i}>
                          {functionSignature(f)}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                {fn?.inputs.map((input, i) => (
                  <Field
                    key={`${fnIndex}-${i}`}
                    label={
                      <>
                        {input.name || `arg ${i}`} <span className="font-mono text-sm font-normal">{input.type}</span>
                      </>
                    }
                  >
                    <input
                      className={cn(inputClass, "font-mono")}
                      placeholder={placeholderFor(input)}
                      value={args[i] ?? ""}
                      onChange={(e) => setArgs((a) => ({ ...a, [i]: e.target.value }))}
                      spellCheck={false}
                    />
                  </Field>
                ))}
              </>
            ) : (
              <Field label="Data" hint="0x for a plain value transfer">
                <textarea className={cn(textareaClass, "h-36")} placeholder="0x…" value={rawData} onChange={(e) => setRawData(e.target.value)} spellCheck={false} />
              </Field>
            )}

            {formError && <Notice tone="danger">{formError}</Notice>}
            <Button variant="secondary" size="lg" onClick={addToBatch}>
              <Plus className="h-6 w-6" strokeWidth={3} /> Add to batch
            </Button>
          </div>
        </Card>

        <Card title="Batch" subtitle={`${batch.length} call${batch.length === 1 ? "" : "s"}`} color="#FFF4DC" className="lg:sticky lg:top-6">
          {batch.length === 0 ? (
            <Empty>Calls you add appear here. Several calls become one transaction.</Empty>
          ) : (
            <ol className="flex flex-col gap-3">
              {batch.map((item, i) => {
                const decoded = decodeLocally(item.data as Hex);
                return (
                  <li key={i} className="border-2 border-black bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className={`${display} grid h-8 w-8 shrink-0 place-items-center bg-black text-lg text-[#FFD400]`}>{i + 1}</span>
                        <span className="truncate text-lg font-bold">{item.label}</span>
                      </span>
                      <span className="flex">
                        <button className={iconButton} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                          <ArrowUp className="h-4 w-4" strokeWidth={3} />
                        </button>
                        <button className={iconButton} disabled={i === batch.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                          <ArrowDown className="h-4 w-4" strokeWidth={3} />
                        </button>
                        <button className={iconButton} onClick={() => setBatch((b) => b.filter((_, j) => j !== i))} aria-label="Remove">
                          <X className="h-4 w-4" strokeWidth={3} />
                        </button>
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <AddressView address={item.to} chain={chain} />
                      {BigInt(item.value) > 0n && (
                        <Badge>
                          {formatUnits(BigInt(item.value), native.decimals)} {native.symbol}
                        </Badge>
                      )}
                    </div>
                    {decoded && (
                      <div className="mt-3">
                        <DecodedCallView decoded={decoded} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
          <Button variant="go" size="lg" className="mt-6 w-full" disabled={batch.length === 0} onClick={() => setReviewing(batch)}>
            Review {batch.length > 1 ? "batch" : "transaction"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
