"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Currency = "USD" | "INR" | "RUB";
type Quote = { description: string; list: number; amount: number; currency: Currency; promo?: string; upgradeFrom?: string | null };
type Provider = { id: string; label: string; note: string };

const SYM = { USD: "$", INR: "₹", RUB: "₽" } as const;
export const money = (n: number, c: Currency) => (c === "RUB" ? `${n.toLocaleString("ru-RU")} ₽` : `${SYM[c]}${n.toLocaleString(c === "INR" ? "en-IN" : "en-US")}`);

export function guessCurrency(): Currency {
  if (typeof navigator === "undefined") return "USD";
  const l = navigator.language.toLowerCase();
  return l.startsWith("ru") ? "RUB" : l.endsWith("-in") || l.startsWith("hi") ? "INR" : "USD";
}

// A calm, single-sheet checkout: price (with upgrade credit / promo), currency, then the payment method.
export function Checkout({ product, weddingId, currency: initial, onClose }: { product: string; weddingId?: string; currency?: Currency; onClose: () => void }) {
  const [currency, setCurrency] = useState<Currency>(initial ?? "USD");
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams({ product, currency, ...(weddingId ? { weddingId } : {}), ...(applied ? { promo: applied } : {}) });
    let live = true;
    fetch(`/api/checkout?${q}`).then(async (r) => {
      const j = await r.json();
      if (!live) return;
      if (!r.ok) { setError(j.error); setQuote(null); if (applied) setApplied(""); return; }
      setError(null); setQuote(j.quote); setProviders(j.providers);
    });
    return () => { live = false; };
  }, [product, currency, weddingId, applied]);

  async function pay(provider: string) {
    setBusy(provider);
    const r = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ product, currency, weddingId, promo: applied, provider }) });
    const j = await r.json();
    if (!r.ok) { setError(j.error); setBusy(null); return; }
    window.location.assign(j.url);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end justify-center bg-wine/30 backdrop-blur-md sm:items-center" onClick={onClose}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 30 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-[32px] bg-paper p-7 shadow-2xl sm:rounded-[32px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow text-rose">One-time · no subscription</p>
            <h3 className="display mt-1 text-3xl leading-tight">{quote?.description.split(" · ").slice(0, 2).join(" · ") ?? "Checkout"}</h3>
          </div>
          <button onClick={onClose} className="text-2xl text-muted hover:text-ink" aria-label="Close">×</button>
        </div>

        <div className="mt-5 flex gap-1 rounded-full bg-white/70 p-1 text-sm">
          {(["USD", "INR", "RUB"] as Currency[]).map((c) => (
            <button key={c} onClick={() => setCurrency(c)} className={`flex-1 rounded-full py-1.5 transition ${currency === c ? "bg-wine text-[#fbeee6]" : "text-muted"}`}>{SYM[c]} {c}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {quote && (
            <motion.div key={`${quote.amount}${quote.currency}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
              {quote.amount !== quote.list && <p className="text-muted line-through">{money(quote.list, quote.currency)}</p>}
              <p className="display foil text-6xl">{money(quote.amount, quote.currency)}</p>
              {quote.upgradeFrom && <p className="mt-1 text-xs text-muted">What you already paid is credited.</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={(e) => { e.preventDefault(); setApplied(promo.trim().toUpperCase()); }} className="mt-5 flex gap-2">
          <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo or partner code" className="field !py-2 !text-sm" />
          <button className="btn btn-ghost !px-4 !py-2 text-sm" disabled={!promo.trim()}>Apply</button>
        </form>
        {applied && quote?.promo && <p className="mt-2 text-xs text-emerald-700">Code {quote.promo} applied ♥</p>}
        {error && <p className="mt-3 text-sm text-rose">{error}</p>}

        <div className="mt-5 space-y-2">
          {quote && providers.map((p) => (
            <button key={p.id} onClick={() => pay(p.id)} disabled={!!busy} className="flex w-full items-center justify-between rounded-2xl border border-line bg-white/70 px-5 py-3.5 text-left transition hover:-translate-y-0.5 hover:border-rose hover:shadow-md disabled:opacity-50">
              <span><span className="block font-medium">{p.label}</span><span className="text-xs text-muted">{p.note}</span></span>
              <span className="text-rose">{busy === p.id ? "…" : "→"}</span>
            </button>
          ))}
          {quote && !providers.length && <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Payments in {currency} open very soon. Try another currency, or write to us via the heart below and we’ll publish it for you.</p>}
        </div>
        <p className="mt-5 text-center text-[11px] text-muted">Secure checkout. Your link goes live the moment payment is confirmed.</p>
      </motion.div>
    </motion.div>
  );
}
