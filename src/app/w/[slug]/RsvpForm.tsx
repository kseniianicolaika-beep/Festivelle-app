"use client";
import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";

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

  if (state === "done") return <p className="display fade py-10 text-center text-2xl">{L.thanks}</p>;
  const input = "w-full border-b border-[var(--t-gold)]/60 bg-transparent py-3 outline-none placeholder:text-[var(--t-muted)] focus:border-[var(--t-accent)]";
  return (
    <form action={submit} className="text-center">
      <p className="eyebrow text-[var(--t-muted)]">{L.rsvp}</p>
      <h2 className="display mt-3 text-4xl">{L.attend}</h2>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {([true, false] as const).map((v) => (
          <button type="button" key={String(v)} onClick={() => setAttending(v)} className={`rounded-full border px-4 py-3 text-sm transition ${attending === v ? "border-[var(--t-accent)] bg-[var(--t-accent)] text-white" : "border-[var(--t-gold)]/60"}`}>{v ? L.yes : L.no}</button>
        ))}
      </div>
      {attending !== null && (
        <div className="fade mt-6 space-y-2 text-left">
          <input name="name" required placeholder={L.name} className={input} />
          <input name="email" type="email" placeholder={L.email} className={input} />
          {attending && <input name="party" type="number" min={1} max={20} defaultValue={1} aria-label={L.party} placeholder={L.party} className={input} />}
          <textarea name="message" rows={2} placeholder={L.message} className={input} />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button disabled={state === "sending"} className="mt-6 w-full rounded-full bg-[var(--t-ink)] py-3.5 text-sm tracking-widest text-[var(--t-bg)] disabled:opacity-60">{L.send}</button>
        </div>
      )}
    </form>
  );
}
