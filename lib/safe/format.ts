import { BaseError, formatUnits } from "viem";

export function shortAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function formatAmount(value: bigint | string, decimals: number, maxFraction = 6): string {
  const [whole, fraction = ""] = formatUnits(BigInt(value), decimals).split(".");
  const trimmed = fraction.slice(0, maxFraction).replace(/0+$/, "");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (!trimmed && whole === "0" && /[1-9]/.test(fraction)) return `< 0.${"0".repeat(maxFraction - 1)}1`;
  return trimmed ? `${grouped}.${trimmed}` : grouped;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

// Known failure patterns, rewritten for people who don't read revert codes.
const FRIENDLY_ERRORS: [RegExp, string][] = [
  [/user (rejected|denied)|rejected the request|action_rejected/i, "You cancelled the request in your wallet."],
  [/insufficient funds/i, "Your wallet doesn't have enough to pay the network fee."],
  [/GS013/, "This transaction would fail if completed. Check the details or ask whoever created it."],
  [/GS02[0-6]/, "Some approvals on this transaction are not valid."],
  [/Not enough Ether funds/i, "The Safe doesn't have enough funds for this transaction."],
  [/Transactions can only be signed by Safe owners/i, "Only owners of this Safe can approve."],
  [/HTTP 429|Too Many Requests/i, "The Safe service is busy. Please wait a minute and try again."],
  [/Failed to fetch|NetworkError|network error/i, "Couldn't reach the network. Check your connection and try again."],
];

/** Turns wallet, viem and api-kit errors into one readable line. */
export function errorMessage(error: unknown): string {
  if (!error) return "";
  const err = error as { code?: number; shortMessage?: string; message?: string };
  if (err.code === 4001) return FRIENDLY_ERRORS[0][1];
  const raw = `${err.shortMessage ?? ""} ${err.message ?? String(error)}`;
  for (const [pattern, friendly] of FRIENDLY_ERRORS) {
    if (pattern.test(raw)) return friendly;
  }
  if (error instanceof BaseError) return error.shortMessage;
  if (err.shortMessage) return err.shortMessage;
  const message = err.message ?? String(error);
  return message.length > 300 ? `${message.slice(0, 300)}…` : message;
}
