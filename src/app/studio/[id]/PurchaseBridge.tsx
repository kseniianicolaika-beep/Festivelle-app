"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Checkout, guessCurrency } from "@/components/Checkout";

// Handles `?buy=<product>` (e.g. from the video studio) and the `?paid=` / `?pending=` return from checkout.
export function PurchaseBridge({ weddingId }: { weddingId: string }) {
  const [buy, setBuy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- reads the URL once after mount */
    const q = new URLSearchParams(window.location.search);
    const b = q.get("buy");
    if (b && /^(site|video|host|credits)_[a-z0-9]+$/.test(b)) setBuy(b);
    if (q.get("paid")) setNote(q.get("paid")!.startsWith("site") ? "Thank you ♥ Your site is live — share it from “Share”." : "Thank you ♥ Your purchase is ready.");
    if (q.get("pending")) setNote("We’re waiting for the payment to be confirmed — this usually takes a moment. Refresh shortly.");
    if (b || q.get("paid") || q.get("pending")) window.history.replaceState(null, "", window.location.pathname);
  }, []);
  useEffect(() => { if (note) { const t = setTimeout(() => setNote(null), 7000); return () => clearTimeout(t); } }, [note]);
  return (
    <>
      <AnimatePresence>{buy && <Checkout product={buy} weddingId={weddingId} currency={guessCurrency()} onClose={() => setBuy(null)} />}</AnimatePresence>
      <AnimatePresence>
        {note && (
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="fixed left-1/2 top-5 z-[70] w-[min(92vw,460px)] -translate-x-1/2 rounded-2xl bg-wine px-5 py-3.5 text-center text-sm text-[#fbeee6] shadow-2xl">
            {note}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
