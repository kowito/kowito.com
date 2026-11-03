"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { type Address, getAddress } from "viem";
import { useConnection } from "wagmi";
import { buttonClass } from "@/components/comic";
import { findSafeNetworks } from "@/lib/safe/chain-client";
import { CHAINS, getChainByShortName } from "@/lib/safe/chains";
import { shortAddress } from "@/lib/safe/format";
import { getSafesByOwner } from "@/lib/safe/service";
import { cn } from "@/lib/utils";
import { forgetSafe, useRecentSafes } from "../_hooks/use-recent-safes";
import { Avatar } from "./address";
import { parseSafeParam, safeHref } from "./links";
import { Button, Card, Loading, Notice, inputClass } from "./ui";

function SafeLink({ href, address, title, subtitle, onForget }: { href: string; address: string; title: string; subtitle: string; onForget?: () => void }) {
  return (
    <li className="group flex items-center gap-2">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-4 border-2 border-transparent px-2 py-3 transition hover:border-black hover:bg-[#FFF4DC]">
        <Avatar address={address} size="lg" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xl font-bold">{title}</span>
          <span className="block truncate text-sm text-neutral-700">{subtitle}</span>
        </span>
        <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" strokeWidth={3} />
      </Link>
      {onForget && (
        <button
          onClick={onForget}
          aria-label="Remove from this list"
          title="Remove from this list"
          className="grid h-10 w-10 shrink-0 place-items-center border-2 border-transparent opacity-0 transition hover:border-black hover:bg-[#FF3B30] hover:text-white focus:opacity-100 group-hover:opacity-100"
        >
          <X className="h-5 w-5" strokeWidth={3} />
        </button>
      )}
    </li>
  );
}

/** Safes owned by the connected wallet, across every supported network. */
function useOwnedSafes(owner: Address | undefined) {
  return useQuery({
    queryKey: ["owned-safes-all", owner],
    enabled: Boolean(owner),
    queryFn: async () => {
      const results = await Promise.allSettled(CHAINS.map(async (c) => ({ chain: c, safes: (await getSafesByOwner(c, owner!)).safes })));
      const found = results.flatMap((r) =>
        r.status === "fulfilled" ? r.value.safes.map((s) => ({ chain: r.value.chain, address: getAddress(s) })) : [],
      );
      return { found, failed: results.filter((r) => r.status === "rejected").length };
    },
  });
}

/** `find`: an address from a link that didn't say which network; it is looked up straight away. */
export function HomeView({ find }: { find?: Address }) {
  const router = useRouter();
  const recent = useRecentSafes();
  const { address } = useConnection();
  const owned = useOwnedSafes(address);
  const [input, setInput] = useState(find ?? "");

  // Accepts "eth:0x…", a bare address, or a whole link copied from Safe{Wallet} or this page.
  const parsed = input ? parseSafeParam(input) : undefined;
  const valid = parsed?.ok || parsed?.reason === "no-network";

  const search = useMutation({
    mutationFn: (safe: Address) => findSafeNetworks(safe),
    onSuccess: (chains, safe) => {
      if (chains.length !== 1) return;
      // From a link, replace it so Back doesn't land on the lookup again.
      if (safe === find) router.replace(safeHref(chains[0], safe));
      else router.push(safeHref(chains[0], safe));
    },
  });

  const { mutate } = search;
  useEffect(() => {
    if (find) mutate(find);
  }, [find, mutate]);

  const open = () => {
    if (parsed?.ok) router.push(safeHref(parsed.chain, parsed.address));
    else if (parsed?.reason === "no-network") search.mutate(parsed.address);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <Card title="Paste your Safe's address" subtitle="Or a link from the Safe{Wallet} app. We'll find which network it's on.">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            open();
          }}
        >
          <input
            className={cn(inputClass, "h-16 font-mono text-xl")}
            placeholder="0x…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.trim());
              search.reset();
            }}
            spellCheck={false}
            autoComplete="off"
            aria-label="Safe address"
          />
          {parsed && !valid && (
            <p className="text-base font-bold text-[#E5221A]">
              {parsed.reason === "unknown-network"
                ? `“${parsed.prefix}” isn't a network we support. We support ${CHAINS.map((c) => c.chain.name).join(", ")}.`
                : "This doesn't look like an address. It should start with 0x and be 42 characters long."}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={!valid} loading={search.isPending}>
            {!search.isPending && <Search className="h-6 w-6" strokeWidth={3} />}
            {search.isPending ? "Looking on every network…" : "Find my Safe"}
          </Button>

          {search.isSuccess && search.data.length === 0 && (
            <Notice tone="warning" title="No Safe found at this address">
              We checked {CHAINS.map((c) => c.chain.name).join(", ")}. Double-check the address — it should be the Safe&apos;s
              address, not an owner&apos;s wallet.
            </Notice>
          )}
          {search.isSuccess && search.data.length > 1 && search.variables && (
            <div className="flex flex-col gap-3">
              <p className="text-lg font-bold">This address is a Safe on several networks. Which one?</p>
              <p className="-mt-2 text-base">Each network has its own separate Safe — owners and money can differ.</p>
              {search.data.map((c) => (
                <Link key={c.shortName} href={safeHref(c, search.variables)} className={buttonClass("md", "justify-between bg-white")}>
                  {c.chain.name} <ArrowRight className="h-5 w-5" strokeWidth={3} />
                </Link>
              ))}
            </div>
          )}
        </form>
      </Card>

      {address && (
        <Card title="Your Safes" subtitle={`Safes where ${shortAddress(address)} is an owner`} color="#FFF4DC">
          {owned.isPending && <Loading label="Looking on every network…" />}
          {owned.data && owned.data.found.length === 0 && (
            <p className="text-lg">None found. If you expected one, paste its address above.</p>
          )}
          {owned.data && owned.data.failed > 0 && <p className="mb-2 text-sm">Some networks couldn&apos;t be checked right now.</p>}
          <ul className="flex flex-col">
            {owned.data?.found.map((s) => {
              const name = recent.find((r) => r.chain === s.chain.shortName && r.address.toLowerCase() === s.address.toLowerCase())?.name;
              return (
                <SafeLink
                  key={`${s.chain.shortName}:${s.address}`}
                  href={safeHref(s.chain, s.address)}
                  address={s.address}
                  title={name ?? shortAddress(s.address, 6)}
                  subtitle={name ? `${s.chain.chain.name} · ${shortAddress(s.address)}` : s.chain.chain.name}
                />
              );
            })}
          </ul>
        </Card>
      )}

      {recent.length > 0 && (
        <Card title="Recently opened">
          <ul className="flex flex-col">
            {recent.map((s) => {
              const network = getChainByShortName(s.chain)?.chain.name ?? s.chain;
              return (
                <SafeLink
                  key={`${s.chain}:${s.address}`}
                  href={safeHref(s.chain, s.address)}
                  address={s.address}
                  title={s.name ?? shortAddress(s.address, 6)}
                  subtitle={s.name ? `${network} · ${shortAddress(s.address)}` : network}
                  onForget={() => forgetSafe(s.chain, s.address)}
                />
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
