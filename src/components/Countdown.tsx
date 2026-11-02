"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

// Computed on the client only, so server HTML and hydration never disagree about "today".
export function Countdown({ date, label }: { date: string; label: string }) {
  const days = useSyncExternalStore(noop, () => Math.ceil((new Date(date).getTime() - Date.now()) / 864e5), () => null);
  if (days === null || days <= 0) return null;
  return (
    <p className="fade mt-9 inline-flex items-baseline gap-2 rounded-full border border-current/25 bg-white/10 px-5 py-2 backdrop-blur-md">
      <span className="display text-2xl">{days}</span>
      <span className="text-[10px] uppercase tracking-[0.3em] opacity-80">{label}</span>
    </p>
  );
}
