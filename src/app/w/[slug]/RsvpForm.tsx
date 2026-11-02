"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { t, type Lang } from "@/lib/i18n";
import { HeartBurst } from "@/components/fx/HeartBurst";

export function RsvpForm({ slug, lang }: { slug: string; lang: Lang }) {
  const L = t(lang);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(form: FormData) {
    setState("sending");
    setError(null);
    const res = await fetch("/api/rsvp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, attending, name: form.get("name"), email: form.get("email"), party: form.get("party"), message: form.get("message") }) });
    if (res.ok) return setState("done");
    setError((await res.json()).error);
    setState("idle");
  }

  if (state === "done")
    return (
      <div className="relative py-12 text-center">
        {attending && <HeartBurst color="var(--t-accent)" />}
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="display text-3xl">{L.thanks}</motion.p>
      </div>
    );
  const input = "w-full border-b border-[var(--t-gold)]/50 bg-transparent py-3.5 outline-none transition-colors placeholder:text-[var(--t-muted)] focus:border-[var(--t-accent)]";
  return (
    <form action={submit} className="text-center">
      <p className="eyebrow text-[var(--t-muted)]">{L.rsvp}</p>
      <h2 className="display mt-3 text-[2.6rem] leading-tight">{L.attend}</h2>
      <div className="mt-9 grid grid-cols-2 gap-3">
        {([true, false] as const).map((v) => (
          <motion.button whileTap={{ scale: 0.96 }} type="button" key={String(v)} onClick={() => setAttending(v)} className={`rounded-full border px-4 py-3.5 text-sm transition-colors duration-500 ${attending === v ? "border-[var(--t-accent)] bg-[var(--t-accent)] text-white shadow-[0_14px_30px_-14px_var(--t-accent)]" : "border-[var(--t-gold)]/60 hover:border-[var(--t-accent)]"}`}>
            {v ? "♥ " : ""}{v ? L.yes : L.no}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {attending !== null && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }} className="overflow-hidden">
            <div className="mt-6 space-y-1 text-left">
              <input name="name" required placeholder={L.name} className={input} />
              <input name="email" type="email" placeholder={L.email} className={input} />
              {attending && <input name="party" type="number" min={1} max={20} defaultValue={1} aria-label={L.party} placeholder={L.party} className={input} />}
              <textarea name="message" rows={2} placeholder={L.message} className={input} />
              {error && <p className="pt-2 text-sm text-red-700">{error}</p>}
              <button disabled={state === "sending"} className="mt-8 w-full rounded-full bg-[var(--t-ink)] py-4 text-[12px] uppercase tracking-[0.3em] text-[var(--t-bg)] transition hover:opacity-90 disabled:opacity-60">{state === "sending" ? "…" : L.send}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
