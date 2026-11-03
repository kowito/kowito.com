"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/comic";
import { errorMessage } from "@/lib/safe/format";
import { groupByNonce, useHistory, usePendingTransactions } from "../_hooks/use-safe-queries";
import type { ActionState } from "../_hooks/use-tx-actions";
import { useSafe } from "./safe-context";
import { isRejection } from "./tx-details";
import { HistoryRow, PendingTxCard } from "./tx-card";
import { ActionStatus } from "./tx-review";
import { Button, Card, Empty, Loading, Notice } from "./ui";

const PAGE = 20;

export function ActivityView() {
  const { safeAddress } = useSafe();
  const pending = usePendingTransactions();
  const [limit, setLimit] = useState(PAGE);
  const history = useHistory(limit);
  const [sent, setSent] = useState<ActionState>({ status: "idle" });

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <SectionTitle
          title="Waiting"
          sub={
            <button onClick={() => pending.refetch()} className="underline-offset-2 hover:underline">
              {pending.isFetching ? "Refreshing…" : "Refresh"}
            </button>
          }
        />
        <ActionStatus state={sent} />
        {pending.isPending && <Loading />}
        {pending.error && <Notice tone="danger">{errorMessage(pending.error)}</Notice>}
        {pending.data?.length === 0 && <Empty>Nothing is waiting. You&apos;re all caught up!</Empty>}
        {pending.data &&
          groupByNonce(pending.data).flatMap(([, txs]) => {
            const cancelled = txs.some((tx) => isRejection(tx, safeAddress));
            return txs.map((tx) => (
              <PendingTxCard key={tx.safeTxHash} tx={tx} conflicting={txs.length > 1} cancelled={cancelled} onSent={setSent} />
            ));
          })}
      </section>

      <Card title="Done">
        {history.isPending && <Loading />}
        {history.error && <Notice tone="danger">{errorMessage(history.error)}</Notice>}
        {history.data?.results.length === 0 && <Empty>No completed transactions yet.</Empty>}
        <div className="flex flex-col gap-3">
          {history.data?.results.map((tx) => <HistoryRow key={tx.safeTxHash} tx={tx} />)}
        </div>
        {history.data && history.data.count > history.data.results.length && (
          <Button variant="secondary" size="lg" className="mt-6 w-full" onClick={() => setLimit((l) => l + PAGE)} loading={history.isFetching}>
            Show more
          </Button>
        )}
      </Card>
    </div>
  );
}
