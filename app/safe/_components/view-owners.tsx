"use client";

import type Safe from "@safe-global/protocol-kit";
import { useState } from "react";
import { Plus } from "lucide-react";
import { type Address, getAddress, isAddress } from "viem";
import { display } from "@/components/comic";
import { explorerUrl } from "@/lib/safe/chains";
import { cn } from "@/lib/utils";
import { useWallet } from "../_hooks/use-wallet";
import { AddressView, Avatar, CopyButton, ExplorerLink } from "./address";
import { useSafe } from "./safe-context";
import { TxReview } from "./tx-review";
import { Badge, Button, Card, Details, Field, Notice, Row, inputClass } from "./ui";

type Change =
  | { kind: "add"; owner: Address; threshold: number }
  | { kind: "remove"; owner: Address; threshold: number }
  | { kind: "swap"; oldOwner: Address; newOwner: Address }
  | { kind: "threshold"; threshold: number };

function build(change: Change, kit: Safe, nonce: number) {
  switch (change.kind) {
    case "add":
      return kit.createAddOwnerTx({ ownerAddress: change.owner, threshold: change.threshold }, { nonce });
    case "remove":
      return kit.createRemoveOwnerTx({ ownerAddress: change.owner, threshold: change.threshold }, { nonce });
    case "swap":
      return kit.createSwapOwnerTx({ oldOwnerAddress: change.oldOwner, newOwnerAddress: change.newOwner }, { nonce });
    case "threshold":
      return kit.createChangeThresholdTx(change.threshold, { nonce });
  }
}

function ThresholdSelect({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  return (
    <select className={cn(inputClass, "w-56 cursor-pointer")} value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <option key={n} value={n}>
          {n} of {max} owners
        </option>
      ))}
    </select>
  );
}

const ADDRESS_HINT = "It should start with 0x and be 42 characters long, and not already be an owner.";

export function OwnersView() {
  const { chain, info } = useSafe();
  const { address } = useWallet();
  const [change, setChange] = useState<Change>();
  const [editing, setEditing] = useState<{ owner: Address; kind: "remove" | "swap" }>();
  const [removeThreshold, setRemoveThreshold] = useState(1);
  const [swapTo, setSwapTo] = useState("");
  const [adding, setAdding] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const [addThreshold, setAddThreshold] = useState(info.threshold);
  const [threshold, setThreshold] = useState(info.threshold);

  const ownerCount = info.owners.length;
  const isExistingOwner = (a: string) => info.owners.some((o) => o.toLowerCase() === a.toLowerCase());
  const newOwnerValid = isAddress(newOwner, { strict: false }) && !isExistingOwner(newOwner);
  const swapValid = isAddress(swapTo, { strict: false }) && !isExistingOwner(swapTo);

  if (change) {
    return (
      <TxReview buildKey={JSON.stringify(change)} build={(kit, nonce) => build(change, kit, nonce)} onCancel={() => setChange(undefined)} />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Card title="Owners" subtitle="These people can approve transactions from this Safe.">
        <ul className="flex flex-col gap-3">
          {info.owners.map((owner) => {
            const isYou = address && owner.toLowerCase() === address.toLowerCase();
            const isEditing = editing?.owner === owner;
            return (
              <li key={owner} className="border-2 border-black bg-[#FFF4DC] p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar address={owner} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate font-mono text-base font-bold sm:text-lg" title={owner}>
                        {owner}
                      </span>
                      <CopyButton value={owner} />
                      <ExplorerLink href={explorerUrl(chain, "address", owner)} />
                    </div>
                    {isYou && <Badge tone="accent">You</Badge>}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditing({ owner, kind: "swap" });
                        setSwapTo("");
                      }}
                    >
                      Replace
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={ownerCount === 1}
                      onClick={() => {
                        setEditing({ owner, kind: "remove" });
                        setRemoveThreshold(Math.min(info.threshold, ownerCount - 1));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                {isEditing && editing.kind === "remove" && (
                  <div className="mt-4 flex flex-col gap-4 border-2 border-black bg-white p-4">
                    <p className={`${display} text-2xl`}>Remove this owner?</p>
                    <Field label="After removing, how many approvals should be needed?">
                      <ThresholdSelect value={removeThreshold} max={ownerCount - 1} onChange={setRemoveThreshold} />
                    </Field>
                    <div className="flex flex-wrap gap-4">
                      <Button onClick={() => setChange({ kind: "remove", owner, threshold: removeThreshold })}>Continue</Button>
                      <Button variant="link" onClick={() => setEditing(undefined)}>
                        Never mind
                      </Button>
                    </div>
                  </div>
                )}

                {isEditing && editing.kind === "swap" && (
                  <div className="mt-4 flex flex-col gap-4 border-2 border-black bg-white p-4">
                    <p className={`${display} text-2xl`}>Replace with someone else</p>
                    <Field label="New owner's address" error={swapTo && !swapValid ? ADDRESS_HINT : undefined}>
                      <input
                        className={cn(inputClass, "font-mono")}
                        placeholder="0x…"
                        value={swapTo}
                        onChange={(e) => setSwapTo(e.target.value.trim())}
                        spellCheck={false}
                      />
                    </Field>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        disabled={!swapValid}
                        onClick={() => setChange({ kind: "swap", oldOwner: owner, newOwner: getAddress(swapTo) })}
                      >
                        Continue
                      </Button>
                      <Button variant="link" onClick={() => setEditing(undefined)}>
                        Never mind
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {adding ? (
          <div className="mt-6 flex flex-col gap-5 border-2 border-black bg-white p-4">
            <p className={`${display} text-2xl`}>Add an owner</p>
            <Field label="Their wallet address" error={newOwner && !newOwnerValid ? ADDRESS_HINT : undefined}>
              <input
                className={cn(inputClass, "font-mono")}
                placeholder="0x…"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value.trim())}
                spellCheck={false}
                autoFocus
              />
            </Field>
            <Field label="After adding, how many approvals should be needed?">
              <ThresholdSelect value={addThreshold} max={ownerCount + 1} onChange={setAddThreshold} />
            </Field>
            <div className="flex flex-wrap gap-4">
              <Button
                disabled={!newOwnerValid}
                onClick={() => setChange({ kind: "add", owner: getAddress(newOwner), threshold: addThreshold })}
              >
                Continue
              </Button>
              <Button variant="link" onClick={() => setAdding(false)}>
                Never mind
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" size="lg" className="mt-6 w-full" onClick={() => setAdding(true)}>
            <Plus className="h-6 w-6" strokeWidth={3} /> Add an owner
          </Button>
        )}
      </Card>

      <Card title="Approvals needed">
        <p className="text-xl">
          Right now,{" "}
          <strong className="bg-[#FFD400] px-1">
            {info.threshold} of {ownerCount}
          </strong>{" "}
          owners must approve every transaction.
        </p>
        <p className="mt-1 text-base text-neutral-700">A higher number is safer. A lower number is more convenient.</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ThresholdSelect value={threshold} max={ownerCount} onChange={setThreshold} />
          <Button size="lg" disabled={threshold === info.threshold} onClick={() => setChange({ kind: "threshold", threshold })}>
            Change
          </Button>
        </div>
      </Card>

      <Details summary="Advanced security info">
        {info.modules.length > 0 ? (
          <Notice tone="warning" title="This Safe has add-ons (modules)">
            An add-on can move funds without owner approvals. Only keep add-ons you recognize and trust.
          </Notice>
        ) : (
          <p className="text-base">No add-ons are turned on. Only owners can move funds.</p>
        )}
        <div className="divide-y-2 divide-dashed divide-black/25">
          <Row label="Add-ons (modules)">
            {info.modules.length === 0 ? (
              <span>None</span>
            ) : (
              <div className="flex flex-col gap-1">
                {info.modules.map((m) => (
                  <AddressView key={m} address={m} chain={chain} full />
                ))}
              </div>
            )}
          </Row>
          <Row label="Guard">{info.guard ? <AddressView address={info.guard} chain={chain} full /> : <span>None</span>}</Row>
          <Row label="Fallback handler">
            {info.fallbackHandler ? <AddressView address={info.fallbackHandler} chain={chain} full /> : <span>None</span>}
          </Row>
          <Row label="Safe version">{info.version}</Row>
        </div>
      </Details>
    </div>
  );
}
