"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { t, type Lang } from "@/lib/i18n";
import { HeartBurst } from "@/components/fx/HeartBurst";

const X = {
  en: { dear: "Dear", which: "Which celebrations will you attend?", meal: "Meal preference", meals: ["No preference", "Vegetarian", "Non-vegetarian", "Vegan", "Jain", "Child's meal"], dietary: "Allergies or dietary needs", plusOne: "Your guest's name" },
  ru: { dear: "Дорогая(ой)", which: "На каких событиях вы будете?", meal: "Предпочтения в еде", meals: ["Без предпочтений", "Вегетарианское", "Мясо / рыба", "Веганское", "Джайн", "Детское меню"], dietary: "Аллергии или ограничения", plusOne: "Имя вашего спутника" },
  hi: { dear: "प्रिय", which: "आप किन समारोहों में आएँगे?", meal: "भोजन पसंद", meals: ["कोई पसंद नहीं", "शाकाहारी", "मांसाहारी", "वीगन", "जैन", "बच्चों का भोजन"], dietary: "एलर्जी या आहार संबंधी ज़रूरतें", plusOne: "आपके अतिथि का नाम" },
} as const;

// Who receives replies: a couple (weddings…), hosts (parties) or organisers (business events = registration).
export type Audience = "couple" | "hosts" | "business";
const AUD: Record<Exclude<Audience, "couple">, Record<"en" | "ru" | "hi", { message: string; thanks: string; rsvp?: string; attend?: string; yes?: string; no?: string }>> = {
  hosts: {
    en: { message: "A note for the hosts", thanks: "Thank you — your reply is on its way to the hosts." },
    ru: { message: "Пожелание хозяевам праздника", thanks: "Спасибо — ваш ответ отправлен хозяевам праздника." },
    hi: { message: "मेज़बानों के लिए संदेश", thanks: "धन्यवाद — आपका जवाब मेज़बानों तक पहुँच रहा है।" },
  },
  business: {
    en: { message: "Anything the organisers should know?", thanks: "Thank you — your registration is confirmed.", rsvp: "Registration", attend: "Reserve your place", yes: "I'll attend", no: "Can't make it" },
    ru: { message: "Что важно знать организаторам?", thanks: "Спасибо — ваша регистрация подтверждена.", rsvp: "Регистрация", attend: "Забронируйте место", yes: "Я приду", no: "Не смогу" },
    hi: { message: "आयोजकों के लिए कोई जानकारी?", thanks: "धन्यवाद — आपका पंजीकरण हो गया है।", rsvp: "पंजीकरण", attend: "अपनी जगह सुरक्षित करें", yes: "मैं आऊँगा/आऊँगी", no: "नहीं आ सकूँगा/सकूँगी" },
  },
};

export type RsvpGuest = { token: string; name: string; email: string | null; plusOnes: number };

export function RsvpForm({ slug, lang, guest, events = [], askMeal = true, audience = "couple" }: { slug: string; lang: Lang; guest?: RsvpGuest | null; events?: string[]; askMeal?: boolean; audience?: Audience }) {
  const L = { ...t(lang), ...(audience === "couple" ? {} : AUD[audience][lang] ?? AUD[audience].en) };
  const x = X[lang] ?? X.en;
  const [attending, setAttending] = useState<boolean | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>(() => Object.fromEntries(events.map((e) => [e, true])));
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(form: FormData) {
    setState("sending");
    setError(null);
    const res = await fetch("/api/rsvp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, g: guest?.token, attending, name: form.get("name"), email: form.get("email"), party: form.get("party") ?? 1, message: form.get("message"), meal: form.get("meal"), dietary: form.get("dietary"), plusOne: form.get("plusOne"), events: events.length > 1 && attending ? picked : events.length ? Object.fromEntries(events.map((e) => [e, !!attending])) : undefined }) });
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
      {guest && <p className="script mb-2 text-3xl text-[var(--t-accent)]">{x.dear} {guest.name.split(" ")[0]}</p>}
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
              <input name="name" required defaultValue={guest?.name} placeholder={L.name} className={input} />
              <input name="email" type="email" defaultValue={guest?.email ?? ""} placeholder={L.email} className={input} />
              {attending && events.length > 1 && (
                <fieldset className="pt-4">
                  <legend className="pb-2 text-sm text-[var(--t-muted)]">{x.which}</legend>
                  <div className="flex flex-wrap gap-2">
                    {events.map((e) => (
                      <button type="button" key={e} onClick={() => setPicked((p) => ({ ...p, [e]: !p[e] }))} className={`rounded-full border px-3.5 py-1.5 text-sm transition ${picked[e] ? "border-[var(--t-accent)] bg-[var(--t-accent)] text-white" : "border-[var(--t-gold)]/60"}`}>{picked[e] ? "✓ " : ""}{e}</button>
                    ))}
                  </div>
                </fieldset>
              )}
              {attending && (!guest || guest.plusOnes > 0) && <input name="party" type="number" min={1} max={guest ? 1 + guest.plusOnes : 20} defaultValue={1} aria-label={L.party} placeholder={L.party} className={input} />}
              {attending && guest && guest.plusOnes > 0 && <input name="plusOne" placeholder={x.plusOne} className={input} />}
              {attending && askMeal && (
                <>
                  <select name="meal" aria-label={x.meal} defaultValue="" className={`${input} appearance-none`}>
                    <option value="" disabled>{x.meal}</option>
                    {x.meals.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input name="dietary" placeholder={x.dietary} className={input} />
                </>
              )}
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
