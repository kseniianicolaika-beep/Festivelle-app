import Link from "next/link";
import { headers } from "next/headers";
import { getPricing, currencyFor, fmt, TIERS, type Currency } from "@/lib/pricing";
import { Wash } from "@/components/fx/Wash";
import { SiteNav, SiteFooter } from "@/components/marketing/SiteNav";
import { SmoothScroll } from "@/components/marketing/landing/SmoothScroll";
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
    <main className="relative min-h-dvh overflow-x-clip">
      <SmoothScroll />
      <SiteNav />
      <Wash />
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-28 pt-10 md:px-10 md:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker fade-up text-rose">Design free, forever</p>
            <h1 className="t-hero mt-6 max-w-4xl">{["Pay", "only", "when", "it’s"].map((w, i) => <span key={w}><span className="wm"><span style={{ ["--i" as string]: i }}>{w}</span></span> </span>)}<span className="wm"><span style={{ ["--i" as string]: 4 }}><em className="text-rose">perfect</em></span></span></h1>
            <p className="t-lede fade-up mt-6 max-w-xl" style={{ ["--d" as string]: "400ms" }}>Talk, design, preview on every screen and save drafts for free. When you’re ready, a one-time payment gives you your own link — no subscriptions, ever.</p>
          </div>
          <div className="flex gap-0.5 rounded-full border border-line-strong bg-white/50 p-1 text-[13px]">
            {(["USD", "INR", "RUB"] as Currency[]).map((x) => <Link key={x} href={`?c=${x}`} scroll={false} className={`rounded-full px-3.5 py-1.5 ${x === c ? "bg-wine text-[#fbeee6]" : "text-muted hover:text-ink"}`}>{x}</Link>)}
          </div>
        </div>

        {GROUPS.map(([g, title], gi) => (
          <section key={g} className="mt-16">
            <Reveal><h2 className="t-h3 flex items-baseline gap-4"><span className="num text-lg text-rose">0{gi + 1}</span>{title}</h2></Reveal>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {TIERS.map((t, i) => {
                const pk = P.packages[g][t];
                return (
                  <Reveal key={t} delay={gi * 0.05 + i * 0.07}>
                    <div className={`relative h-full rounded-[26px] p-8 transition duration-700 ease-[var(--ease-expo)] hover:-translate-y-1.5 ${t === "premium" ? "noir shadow-[0_40px_80px_-40px_rgba(74,20,36,.8)]" : "border border-line-strong bg-white/45"}`}>
                      {t === "premium" && <span className="absolute right-6 top-6 text-[10px] uppercase tracking-[.3em] opacity-80">most loved</span>}
                      <p className="display text-3xl">{pk.name}</p>
                      <p className={`display mt-4 text-6xl font-light ${t === "premium" ? "foil" : ""}`} style={t === "premium" ? { ["--foil-a" as string]: "#b88c4f", ["--foil-b" as string]: "#f6dfae" } : undefined}>{fmt(pk.price[c], c)}</p>
                      <p className="text-xs opacity-70">one-time</p>
                      <ul className="mt-7 space-y-2.5 text-sm opacity-85">{pk.features.map((f) => <li key={f} className="flex gap-3"><span className="text-gold">✦</span>{f}</li>)}</ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-16 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[26px] border border-line-strong bg-white/45 p-8">
              <h2 className="t-h3">Video invitations & greetings</h2>
              <ul className="mt-5 space-y-3">
                {TIERS.map((t) => <li key={t} className="flex items-baseline justify-between gap-4"><span><span className="display text-xl">{P.video[t].name}</span><span className="block text-xs text-muted">{P.video[t].features.join(" · ")}</span></span><span className="display text-2xl">{fmt(P.video[t].price[c], c)}</span></li>)}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-[26px] border border-line-strong bg-white/45 p-8">
              <h2 className="t-h3">Hosting</h2>
              <p className="mt-2 text-sm text-muted">Your link stays online up to {P.hosting.maxMonths} months from activation, and until {P.hosting.afterEventDays} days after your event — whichever comes first. Extend any time; extensions never auto-renew.</p>
              <ul className="mt-4 space-y-2">{P.hosting.extensions.map((e) => <li key={e.id} className="flex justify-between"><span>{e.label}</span><span className="display text-xl">{fmt(e.price[c], c)}</span></li>)}</ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="h-full rounded-[26px] border border-line-strong bg-white/45 p-8 md:col-span-2">
              <h2 className="t-h3">AI, included</h2>
              <p className="mt-2 text-sm text-muted">Our AI designer and writer are free to use — {P.credits.freeTextPerDay} messages a day, plus {P.credits.freeVisuals} AI illustrations to try. Need more? Credit packs never expire.</p>
              <ul className="mt-4 space-y-2">{P.credits.packs.map((p) => <li key={p.id} className="flex justify-between"><span>{p.credits} credits</span><span className="display text-xl">{fmt(p.price[c], c)}</span></li>)}</ul>
            </div>
          </Reveal>
        </section>
        <Reveal><div className="mt-24 text-center"><p className="script text-4xl text-rose">and so it begins</p><Link href="/studio/new" className="btn btn-dark mt-8 !px-8 !py-4">Begin — it’s free<span className="btn-arrow">→</span></Link><p className="mt-4 text-xs text-muted">Pay by Russian card / МИР / СБП, UPI and Indian cards, international cards, or crypto.</p></div></Reveal>
      </div>
      <SiteFooter />
    </main>
  );
}

