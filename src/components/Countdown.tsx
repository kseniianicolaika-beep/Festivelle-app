"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

// Computed on the client only, so server HTML and hydration never disagree about "today".
export function Countdown({ date, label }: { date: string; label: string }) {
  const days = useSyncExternalStore(noop, () => Math.ceil((new Date(date).getTime() - Date.now()) / 864e5), () => null);
  if (days === null || days <= 0) return null;
  return <p className="fade mt-8 inline-block rounded-full border border-current/30 px-4 py-1.5 text-xs tracking-widest opacity-80">{days} {label}</p>;
}
