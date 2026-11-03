"use client";

import { useSyncExternalStore } from "react";

/** A Safe the person opened, with an optional nickname they gave it. Stored in this browser only. */
export type RecentSafe = { chain: string; address: string; name?: string };

const KEY = "safer:recent-safes";
const EVENT = "safer:recent-safes-changed";
const EMPTY: RecentSafe[] = [];

let cachedRaw: string | null = null;
let cachedValue: RecentSafe[] = EMPTY;

function read(): RecentSafe[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as RecentSafe[]) : EMPTY;
    } catch {
      cachedValue = EMPTY;
    }
  }
  return cachedValue;
}

function write(list: RecentSafe[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage unavailable (private mode); the list is a convenience only.
  }
}

const same = (s: RecentSafe, chain: string, address: string) =>
  s.chain === chain && s.address.toLowerCase() === address.toLowerCase();

export function rememberSafe(chain: string, address: string) {
  const list = read();
  const existing = list.find((s) => same(s, chain, address));
  write([{ chain, address, name: existing?.name }, ...list.filter((s) => !same(s, chain, address))].slice(0, 12));
}

export function forgetSafe(chain: string, address: string) {
  write(read().filter((s) => !same(s, chain, address)));
}

export function setSafeName(chain: string, address: string, name: string) {
  const list = read();
  const trimmed = name.trim() || undefined;
  if (list.some((s) => same(s, chain, address))) {
    write(list.map((s) => (same(s, chain, address) ? { ...s, name: trimmed } : s)));
  } else {
    write([{ chain, address, name: trimmed }, ...list]);
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useRecentSafes(): RecentSafe[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useSafeName(chain: string, address: string): string | undefined {
  return useRecentSafes().find((s) => same(s, chain, address))?.name;
}
