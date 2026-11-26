"use client";
import { useEffect, useState } from "react";
import type { Pricing } from "@/lib/pricing";
import type { PriceGroup } from "@/lib/occasions";
import { guessCurrency, money } from "@/components/Checkout";

// Quiet reminder in the studio header: designing costs nothing; you pay once, only when you share.
export function FreeHint({ group }: { group: PriceGroup }) {
  const [from, setFrom] = useState<string | null>(null);
  useEffect(() => {
    const c = guessCurrency();
    fetch("/api/pricing").then((r) => r.json()).then((j: { pricing: Pricing }) => setFrom(money(j.pricing.packages[group].basic.price[c], c))).catch(() => {});
  }, [group]);
  return (
    <span className="hidden text-right text-[11px] leading-tight text-muted lg:block">
      Free while you design
      {from && <span className="block">from {from} once, when you share</span>}
    </span>
  );
}
