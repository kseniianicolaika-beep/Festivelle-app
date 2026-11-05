"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const T = {
  en: { ask: "Ask us anything", hint: "Parking, dress code, timings…", fallback: "I couldn't answer that just now — please ask the hosts directly.", hello: "Hello! I know the plans by heart — what would you like to know?" },
  ru: { ask: "Задайте вопрос", hint: "Парковка, дресс-код, время…", fallback: "Не могу ответить прямо сейчас — спросите, пожалуйста, у хозяев.", hello: "Здравствуйте! Я знаю все планы — что подсказать?" },
  hi: { ask: "कुछ भी पूछें", hint: "पार्किंग, ड्रेस कोड, समय…", fallback: "अभी उत्तर नहीं दे पाया — कृपया मेज़बानों से पूछें।", hello: "नमस्ते! मुझे सारी योजनाएँ पता हैं — क्या जानना चाहेंगे?" },
};

// Floating guest concierge (answers only from the hosts' details).
export function GuestAssistant({ slug, g, lang = "en" }: { slug: string; g?: string | null; lang?: "en" | "ru" | "hi" }) {
  const L = T[lang] ?? T.en;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ role: "me" | "ai"; text: string }[]>([{ role: "ai", text: L.hello }]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const question = q.trim();
    if (!question || busy) return;
    setQ("");
    setBusy(true);
    setLog((l) => [...l, { role: "me", text: question }]);
    const r = await fetch("/api/guests/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, g, question }) }).then((r) => r.json()).catch(() => ({}));
    setLog((l) => [...l, { role: "ai", text: r.answer || L.fallback }]);
    setBusy(false);
  }

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }} className="mb-3 flex h-[420px] w-[min(88vw,340px)] flex-col overflow-hidden rounded-3xl border border-[var(--t-gold)]/40 bg-[var(--t-surface)] text-[var(--t-ink)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--t-gold)]/30 px-5 py-3"><span className="display text-xl">{L.ask}</span><button onClick={() => setOpen(false)} aria-label="Close" className="text-xl opacity-60">×</button></div>
            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
              {log.map((m, i) => <p key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${m.role === "me" ? "ml-auto bg-[var(--t-accent)] text-white" : "bg-[var(--t-bg)]"}`}>{m.text}</p>)}
              {busy && <p className="w-12 animate-pulse rounded-2xl bg-[var(--t-bg)] px-3.5 py-2">…</p>}
            </div>
            <form onSubmit={ask} className="flex gap-2 border-t border-[var(--t-gold)]/30 p-3">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.hint} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              <button className="rounded-full bg-[var(--t-ink)] px-4 py-2 text-xs text-[var(--t-bg)]" disabled={busy}>→</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full bg-[var(--t-ink)] px-4 py-3 text-sm text-[var(--t-bg)] shadow-xl">♡ {L.ask}</button>
    </div>
  );
}
