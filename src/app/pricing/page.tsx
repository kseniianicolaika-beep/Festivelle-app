import Link from "next/link";
import { headers } from "next/headers";
import { getPricing, currencyFor, fmt, TIERS, type Currency } from "@/lib/pricing";
import { BRAND } from "@/lib/brand";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";

const GROUPS = [
  ["wedding", "Weddings & engagements"],
  ["celebration", "Birthdays, baby showers, anniversaries & kids’ parties"],
  ["greeting", "Digital greetings"],
] as const;

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const P = await getPricing();
  const q = (await searchParams).c?.toUpperCase();
  const c: Currency = q === "INR" || q === "RUB" || q === "USD" ? q : currencyFor((await headers()).get("x-vercel-ip-country"));
  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <Link href="/" className="display text-2xl">{BRAND.name}</Link>
        <div className="flex gap-1 rounded-full bg-white/60 p-1 text-sm">
          {(["USD", "INR", "RUB"] as Currency[]).map((x) => <Link key={x} href={`?c=${x}`} className={`rounded-full px-3 py-1 ${x === c ? "bg-wine text-[#fbeee6]" : "text-muted"}`}>{x}</Link>)}
        </div>
      </nav>
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <p className="eyebrow text-rose">Design free, forever</p>
          <h1 className="display mt-3 max-w-3xl text-5xl leading-[1.05] md:text-7xl">Pay only when it’s <em className="text-rose">perfect</em></h1>
          <p className="mt-5 max-w-xl text-lg text-muted">Talk, design, preview on every screen and save drafts for free. When you’re ready, a one-time payment gives you your own link — no subscriptions, ever.</p>
        </Reveal>

        {GROUPS.map(([g, title], gi) => (
          <section key={g} className="mt-16">
            <Reveal><h2 className="display text-3xl">{title}</h2></Reveal>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {TIERS.map((t, i) => {
                const pk = P.packages[g][t];
                return (
                  <Reveal key={t} delay={gi * 0.05 + i * 0.07}>
                    <div className={`relative h-full rounded-[28px] p-7 transition duration-500 hover:-translate-y-1 ${t === "premium" ? "bg-wine text-[#fbeee6] shadow-[0_40px_80px_-40px_rgba(74,20,36,.8)]" : "glass"}`}>
                      {t === "premium" && <span className="absolute right-6 top-6 text-[10px] uppercase tracking-[.3em] opacity-80">most loved</span>}
                      <p className="display text-3xl">{pk.name}</p>
                      <p className="display mt-4 text-5xl">{fmt(pk.price[c], c)}</p>
                      <p className="text-xs opacity-70">one-time</p>
                      <ul className="mt-6 space-y-2 text-sm">{pk.features.map((f) => <li key={f}>♡ {f}</li>)}</ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-16 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-[28px] p-7">
              <h2 className="display text-3xl">Video invitations & greetings</h2>
              <ul className="mt-5 space-y-3">
                {TIERS.map((t) => <li key={t} className="flex items-baseline justify-between gap-4"><span><span className="display text-xl">{P.video[t].name}</span><span className="block text-xs text-muted">{P.video[t].features.join(" · ")}</span></span><span className="display text-2xl">{fmt(P.video[t].price[c], c)}</span></li>)}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glass h-full rounded-[28px] p-7">
              <h2 className="display text-3xl">Hosting</h2>
              <p className="mt-2 text-sm text-muted">Your link stays online up to {P.hosting.maxMonths} months from activation, and until {P.hosting.afterEventDays} days after your event — whichever comes first. Extend any time; extensions never auto-renew.</p>
              <ul className="mt-4 space-y-2">{P.hosting.extensions.map((e) => <li key={e.id} className="flex justify-between"><span>{e.label}</span><span className="display text-xl">{fmt(e.price[c], c)}</span></li>)}</ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="glass h-full rounded-[28px] p-7 md:col-span-2">
              <h2 className="display text-3xl">AI, included</h2>
              <p className="mt-2 text-sm text-muted">Our AI designer and writer are free to use — {P.credits.freeTextPerDay} messages a day, plus {P.credits.freeVisuals} AI illustrations to try. Need more? Credit packs never expire.</p>
              <ul className="mt-4 space-y-2">{P.credits.packs.map((p) => <li key={p.id} className="flex justify-between"><span>{p.credits} credits</span><span className="display text-xl">{fmt(p.price[c], c)}</span></li>)}</ul>
            </div>
          </Reveal>
        </section>
        <Reveal><div className="mt-16 text-center"><Link href="/studio/new" className="btn btn-dark">Begin — it’s free</Link><p className="mt-3 text-xs text-muted">Pay by Russian card / МИР / СБП, UPI and Indian cards, international cards, or crypto.</p></div></Reveal>
      </div>
    </main>
  );
}

export const instant = false;
