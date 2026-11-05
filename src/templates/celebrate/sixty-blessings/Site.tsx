"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import type { Profile } from "@/lib/profile";
import { E } from "@/components/designs/Editable";
import { INVOCATIONS } from "@/lib/motifs";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Kuthuvilakku, Kalasam, Thoranam, MandapamArch, KOLAM_BG, SB_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, birthdayOf, langOf, lineOf } from "../_shared/words";

export const SB_VARS = { "--t-bg": "#3d0b12", "--t-surface": "#4b1119", "--t-ink": "#fbf0dc", "--t-muted": "#dcbf9c", "--t-accent": "#f0b545", "--t-gold": "#d4a24c", "--foil-a": "#8a5a1c", "--foil-b": "#ffe6a0" };
export const PETALS = ["#f2a93b", "#e8862a", "#fff8ec", "#f7c66b", "#c9452f"];

/** The ceremony's name, gently — only when sixty. */
export function ritual(p: Profile) {
  if (p.age !== 60) return birthdayOf(p);
  return { en: "Shashtiabdapoorthi", ru: "Шаштиабдапурти · 60-летие", hi: "षष्ठिपूर्ति" }[langOf(p)];
}

function Head({ title }: { title: string }) {
  return (
    <div data-r className="mb-12 flex flex-col items-center text-center md:mb-16">
      <svg viewBox="0 0 160 20" className="w-40 text-[var(--t-gold)]" aria-hidden><path d="M0 10h60M100 10h60" stroke="currentColor" strokeWidth=".8" /><path d="M80 2c6 4 8 8 0 16-8-8-6-12 0-16z" fill="currentColor" /><circle cx="66" cy="10" r="2" fill="currentColor" /><circle cx="94" cy="10" r="2" fill="currentColor" /></svg>
      <h2 className="sb-foil mt-4 text-[2.3rem] leading-tight md:text-[3.4rem]" style={{ fontFamily: F.yatra }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const [name] = nameParts(profile);
  const L = words(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const age = profile.age;
  const inv = design?.invocation ? INVOCATIONS[design.invocation] : null;
  const isLit = compact || lit;
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(q("[data-thor]"), { yPercent: -100, duration: 1.4, ease: "power3.out" })
      .from(q("[data-thor] [data-strand]"), { scaleY: 0, duration: 1.6, stagger: 0.12, ease: "power2.out" }, "<.5")
      .from(q("[data-arch]"), { opacity: 0, scale: 0.94, duration: 1.6, ease: "expo.out" }, "<.2")
      .from(q("[data-lamp]"), { y: 40, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" }, "<.3")
      .from(q("[data-hero-in]"), { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "<.2");
  }, [compact]);

  const light = () => {
    const host = root.current;
    if (!host || lit) return;
    setLit(true);
    host.querySelectorAll("[data-lamp]").forEach((lamp) => {
      gsap.fromTo(lamp.querySelectorAll("[data-flame]"), { opacity: 0, scale: 0.2, transformOrigin: "50% 100%" }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.22, ease: "back.out(2)" });
    });
    const arch = host.querySelector("[data-arch]");
    if (arch) burstFrom(host, arch, { colors: PETALS, n: 70, shapes: ["circle", "circle", "rect"], angle: [240, 300], velocity: [500, 900], gravity: 420, size: 11, life: 4 }, -120);
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`} style={{ ...tplVars("sixty-blessings", theme, design, SB_VARS), fontFamily: F.cormG }}>
      <style href="cel-sb" precedence="default">{SB_CSS}</style>
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: KOLAM_BG }} />

      <header className={`relative flex flex-col items-center overflow-hidden px-4 ${compact ? "min-h-[700px] pb-10" : "min-h-[100svh] pb-14"}`}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(240,150,50,.28),transparent_70%)]" />
        <Grain opacity={0.14} blend="overlay" />
        <div data-thor className={`relative z-10 flex w-[140%] -translate-x-0 ${compact ? "" : "sb-sway"}`}>
          {Array.from({ length: 6 }, (_, i) => <Thoranam key={i} className="h-[120px] w-1/6 shrink-0 md:h-[150px]" />)}
        </div>

        <div className={`relative -mt-6 flex w-full flex-1 items-end justify-center gap-4 md:-mt-10 md:gap-10`}>
          <div data-lamp className={`hidden shrink-0 md:block ${compact ? "" : "w-[110px]"}`}><Kuthuvilakku lit={isLit} className="w-full" /></div>

          <div data-arch className={`relative flex flex-col items-center px-6 text-center ${compact ? "w-[330px] pb-10 pt-24" : "w-[min(92vw,520px)] pb-12 pt-28 md:pt-32"}`}>
            <MandapamArch className="absolute inset-0 h-full w-full" />
            <div aria-hidden className="absolute inset-[6px] -z-0 rounded-t-[50%] bg-[radial-gradient(70%_50%_at_50%_30%,rgba(255,190,90,.14),transparent)]" />
            {inv && <p data-hero-in className="relative mb-3 text-xl text-[var(--t-accent)]" style={{ fontFamily: F.deva }} dir="auto">{inv.text}</p>}
            <Kalasam className={`relative ${compact ? "w-16" : "w-20"}`} />
            <p data-hero-in className="relative mt-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]" style={{ fontFamily: F.cinzel }}>{ritual(profile)}</p>
            {age ? <p data-hero-in className={`sb-foil sb-shine relative leading-none ${compact ? "text-[110px]" : "text-[clamp(7rem,26vw,11rem)]"}`} style={{ fontFamily: F.yatra }}>{age}</p> : null}
            <h1 className={`relative leading-[1.05] ${compact ? "text-[40px]" : "text-[clamp(2.6rem,9vw,4.4rem)]"}`} style={{ fontFamily: F.yatra }}>
              <E path="profile.partner1" className="sb-foil sb-shine">{name}</E>
            </h1>
            <p data-hero-in className="relative mt-2 text-xl italic text-[var(--t-muted)] md:text-2xl">{lineOf(profile)}</p>
            <div data-hero-in className="relative mt-6 flex items-center gap-3 text-[var(--t-gold)]"><span className="h-px w-10 bg-current" /><span className="h-2 w-2 rotate-45 border border-current" /><span className="h-px w-10 bg-current" /></div>
            <p data-hero-in className="relative mt-4 text-[1.35rem]" style={{ fontFamily: F.cinzel }}>{fmt(profile)}</p>
            {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-1 block text-[11px] uppercase tracking-[0.35em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
          </div>

          <div data-lamp className={`hidden shrink-0 md:block ${compact ? "" : "w-[110px]"}`}><Kuthuvilakku lit={isLit} className="w-full" /></div>
        </div>

        {!compact && (
          <div data-hero-in className="relative mt-8 flex flex-col items-center gap-4">
            <button type="button" onClick={light} className={`group flex items-center gap-3 rounded-full border border-[var(--t-gold)]/60 py-2 pl-2 pr-6 transition hover:bg-[var(--t-gold)]/10 ${lit ? "opacity-60" : ""}`}>
              <span data-lamp className="block w-7 md:hidden"><Kuthuvilakku lit={isLit} className="w-full" /></span>
              <span className="hidden h-7 w-7 place-items-center rounded-full bg-[var(--t-gold)]/20 md:grid">✦</span>
              <span className="text-[11px] uppercase tracking-[0.35em] text-[var(--t-accent)]" style={{ fontFamily: F.cinzel }}>{lit ? "शुभम्" : L.light}</span>
            </button>
            <Countdown date={profile.date}>{(d) => <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--t-muted)]"><span className="sb-foil mr-2 text-2xl tracking-normal" style={{ fontFamily: F.yatra }}>{d}</span>{L.until}</p>}</Countdown>
          </div>
        )}
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
              <Kalasam className="mx-auto mb-8 w-16" />
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.9rem] italic leading-[1.45] md:text-[2.7rem]">{profile.inviteLine || occasionInvite(profile)}</E>
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
              <div data-r className="relative mx-auto w-[min(76vw,360px)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border-[3px] border-[var(--t-gold)] p-2">
                  <div className="h-full w-full overflow-hidden rounded-t-full bg-[#5a1a22]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                </div>
                <Thoranam strands={false} className="absolute -top-4 left-1/2 h-14 w-[110%] -translate-x-1/2" />
              </div>
              <div className="text-center md:text-left">
                <div className="md:[&>div]:items-start"><Head title={L.about} /></div>
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.4rem] leading-[1.7] md:text-[1.6rem]">{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative mx-auto max-w-5xl px-6 py-24">
              <Head title={L.details} />
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { k: L.when, v: fmt(profile), s: [dp?.weekday, profile.events?.[0]?.time].filter(Boolean).join(" · ") },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.12} className="relative rounded-t-[120px] border border-[var(--t-gold)]/60 bg-[var(--t-surface)]/60 px-6 pb-10 pt-16 text-center">
                    <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--t-accent)]" style={{ fontFamily: F.cinzel }}>{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-4 block text-[2rem] leading-tight" style={{ fontFamily: F.yatra }}>{x.v}</E> : <p className="mt-4 text-[2rem] leading-tight" style={{ fontFamily: F.yatra }}>{x.v}</p>}
                    {x.s && <p className="mt-2 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block rounded-full border border-[var(--t-gold)]/60 px-6 py-2.5 text-[11px] uppercase tracking-[0.35em] text-[var(--t-accent)] transition hover:bg-[var(--t-gold)]/10" style={{ fontFamily: F.cinzel }}>{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: profile.events?.length ? () => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head title={L.events} />
              <ol className="relative border-l border-[var(--t-gold)]/40 pl-10">
                {profile.events!.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.08} className="relative pb-12 last:pb-0">
                    <span className="absolute -left-[3.05rem] top-1 block w-5"><svg viewBox="0 0 20 24" aria-hidden><path d="M10 2c-4 5-4 11 0 14 4-3 4-9 0-14z" fill="#f0b545" /><path d="M2 18h16l-3 4H5z" fill="#d4a24c" /></svg></span>
                    <p className="text-[12px] uppercase tracking-[0.35em] text-[var(--t-accent)]" style={{ fontFamily: F.cinzel }}>{[e.time, e.date ? fmt(profile, e.date) : ""].filter(Boolean).join(" · ")}</p>
                    <p className="mt-1 text-[1.9rem] leading-tight md:text-[2.3rem]" style={{ fontFamily: F.yatra }}>{e.name}</p>
                    {e.venue && <p className="text-[var(--t-muted)]">{e.venue}</p>}
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative px-6 py-24 text-center">
              <Head title={L.venue} />
              <div data-r className="relative mx-auto max-w-xl">
                <div className="mx-auto flex w-fit items-end gap-6"><Kuthuvilakku className="w-14" /><Kalasam className="w-24" /><Kuthuvilakku className="w-14" /></div>
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="sb-foil mt-8 block text-[2.8rem] leading-tight md:text-[4rem]" style={{ fontFamily: F.yatra }}>{profile.venue || profile.city}</E>
                {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-2 block text-[12px] uppercase tracking-[0.4em] text-[var(--t-muted)]" style={{ fontFamily: F.cinzel }}>{profile.city}</E>}
                <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-8 inline-block rounded-full bg-[var(--t-gold)] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-[#3d0b12] transition hover:brightness-110" style={{ fontFamily: F.cinzel }}>{L.directions}</a>
              </div>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head title={L.gallery} />
              <div className={`grid grid-cols-2 gap-5 ${compact ? "" : "md:grid-cols-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="overflow-hidden rounded-t-full border-2 border-[var(--t-gold)]/70 p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-t-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head title={L.rsvp} />
              <div data-r className="relative rounded-[28px] border border-[var(--t-gold)]/60 bg-[var(--t-surface)] px-6 py-10 md:px-12">{children}</div>
            </section>
          ) : null,
          info: info ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-20 text-center">
              <Head title={L.info} />
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Thoranam strands={false} className="mx-auto h-16 w-full max-w-md" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-3xl italic text-[var(--t-accent)]">{profile.blessing}</E>}
        <p className="mt-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]" style={{ fontFamily: F.cinzel }}>{L.with}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
