"use client";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Checkout, guessCurrency } from "@/components/Checkout";

export function BuyCredits({ packs }: { packs: { id: string; credits: number }[] }) {
  const [buy, setBuy] = useState<string | null>(null);
  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">{packs.map((p) => <button key={p.id} onClick={() => setBuy(p.id)} className="btn btn-ghost !px-4 !py-2 text-sm">+ {p.credits} credits</button>)}</div>
      <AnimatePresence>{buy && <Checkout product={buy} currency={guessCurrency()} onClose={() => setBuy(null)} />}</AnimatePresence>
    </>
  );
}
