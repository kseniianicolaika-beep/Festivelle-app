import Link from "next/link";
import { InvitationCard } from "@/components/InvitationCard";
import { BRAND } from "@/lib/brand";
import { THEMES, themeById } from "@/lib/themes";
import type { Profile } from "@/lib/profile";

const demo: Profile = { partner1: "Anya", partner2: "Rohan", date: "2027-02-14", venue: "Ashwem Beach, North Goa", city: "Goa, India", tradition: "Russian–Indian fusion" };
const demoRu: Profile = { partner1: "Мария", partner2: "Иван", date: "2027-01-23", venue: "Villa Pinto, Assagao", city: "Goa, India", language: "ru" };

const plans = [
  { name: "Draft", price: "Free", inr: "", points: ["Unlimited conversation & designs", "All five design worlds", "Private preview link"], cta: "Start designing" },
  { name: "Celebration", price: "$79", inr: "₹4,999 · one-time", points: ["Publish your wedding website", "Email, WhatsApp & Telegram invitations", "Live RSVPs & guest list", "English · Русский · हिन्दी"], cta: "Most couples choose this", featured: true },
  { name: "Heritage", price: "$199", inr: "₹14,999 · one-time", points: ["Your own domain, set up for you", "Print-ready invitation suite", "Priority human concierge", "Every future feature included"], cta: "For the full experience" },
];

export default function Home() {
  return (
    <main className="grain">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="display text-2xl">{BRAND.name}</span>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/auth/sign-in" className="hidden px-3 py-2 text-muted hover:text-ink sm:block">Sign in</Link>
          <Link href="/studio" className="btn btn-dark">Begin</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-10 md:grid-cols-[1.1fr_1fr] md:pt-16">
        <div>
          <p className="eyebrow rise text-gold">Made in Goa · for weddings everywhere</p>
          <h1 className="display rise rise-2 mt-6 text-5xl leading-[1.02] md:text-7xl">
            Say it once.<br />
            <em className="text-rose">We’ll design</em> the rest.
          </h1>
          <p className="rise rise-3 mt-7 max-w-md text-lg leading-relaxed text-muted">
            Tell our AI designer about the two of you — in English, Russian or Hindi — and watch your invitation,
            save-the-date and wedding website compose themselves, honouring the traditions you grew up with.
          </p>
          <div className="rise rise-4 mt-10 flex flex-wrap gap-3">
            <Link href="/studio" className="btn btn-dark">Start the conversation →</Link>
            <a href="#how" className="btn btn-ghost">See how it works</a>
          </div>
          <p className="mt-6 text-xs text-muted">Free to design. Pay only when you publish.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-6 top-14 hidden w-56 rotate-[-6deg] opacity-90 md:block">
            <InvitationCard profile={demoRu} theme={themeById("belaya-noch")} variant="save" />
          </div>
          <div className="relative md:ml-24 md:rotate-[3deg]">
            <InvitationCard profile={demo} theme={themeById("konkan-sunset")} />
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-3">
          {[
            ["Talk", "Answer a few warm questions — names, traditions, dates, the feeling you want. Tap or type, in your language."],
            ["Watch", "Every answer redesigns your suite live: invitation, save-the-date and a full wedding website with RSVP."],
            ["Send", "Publish in one tap. Invite guests by email, WhatsApp or Telegram, and see RSVPs arrive in real time."],
          ].map(([h, p], i) => (
            <div key={h}>
              <p className="display text-5xl text-gold">0{i + 1}</p>
              <h3 className="display mt-4 text-3xl">{h}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="eyebrow text-center text-gold">Five design worlds</p>
        <h2 className="display mt-4 text-center text-4xl md:text-5xl">From Ashwem sunsets to Petersburg white nights</h2>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
          {THEMES.map((th) => (
            <div key={th.id} className="group">
              <div className="aspect-[3/4] rounded-2xl p-4 transition-transform duration-500 group-hover:-translate-y-1" style={{ background: th.bg, color: th.ink, border: `1px solid ${th.gold}55` }}>
                <div className="flex h-full flex-col justify-between">
                  <div className="flex gap-1.5">{[th.accent, th.gold, th.ink].map((c) => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}</div>
                  <p className="display text-2xl leading-tight">{th.name}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-snug text-muted">{th.mood}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="eyebrow text-gold">Why Goa</p>
            <h2 className="display mt-4 text-4xl md:text-5xl">The most beautiful place to say yes — и сказать «да».</h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-paper/70">
            Warm winters, Portuguese villas, whitewashed chapels and long golden beaches — a few hours from Delhi and Mumbai,
            and a familiar second home for Russian families. Plan from anywhere; we’ll introduce you to trusted Goan venues and planners when you’re ready.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="display text-center text-4xl md:text-5xl">One wedding, one simple price</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-3xl border p-8 ${p.featured ? "border-gold bg-paper shadow-[0_30px_60px_-40px_rgba(80,50,20,.5)]" : "border-line"}`}>
              <p className="eyebrow text-muted">{p.name}</p>
              <p className="display mt-4 text-5xl">{p.price}</p>
              <p className="mt-1 h-5 text-xs text-muted">{p.inr}</p>
              <ul className="mt-8 space-y-3 text-sm">{p.points.map((x) => <li key={x} className="flex gap-3"><span className="text-gold">✦</span>{x}</li>)}</ul>
              <Link href="/studio" className={`btn mt-10 w-full ${p.featured ? "btn-dark" : "btn-ghost"}`}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line py-10 text-center text-xs text-muted">
        {BRAND.name} · crafted in Goa, India · English · Русский · हिन्दी
      </footer>
    </main>
  );
}
