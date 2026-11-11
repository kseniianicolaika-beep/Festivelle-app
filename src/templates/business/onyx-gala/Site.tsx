"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Sunburst, Chevrons, Fan, Door, OG_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, bizLine, agendaOf } from "../_shared/words";
import { venueLine } from "../_shared/ui";

export const OG_VARS = { "--t-bg": "#0e0e10", "--t-surface": "#151517", "--t-ink": "#f1e6cf", "--t-muted": "#b3a78e", "--t-accent": "#d6b36a", "--t-gold": "#d6b36a" };

function Head({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div data-r className="mb-12 flex flex-col items-center text-center md:mb-16">
      <Fan className="mb-4 w-20 opacity-90" />
      {kicker && <p className="mb-3 text-[10px] uppercase tracking-[0.55em] text-[var(--t-muted)]" style={{ fontFamily: F.cinzel }}>{kicker}</p>}
      <h2 className="og-foil text-[2.3rem] uppercase leading-none tracking-[0.12em] md:text-[3.4rem]" style={{ fontFamily: F.poiret }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [name] = nameParts(profile);
  const L = words(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const agenda = agendaOf(profile);
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.25 })
      .to(q("[data-door='l']"), { xPercent: -100, duration: 2.1, ease: "power3.inOut" })
      .to(q("[data-door='r']"), { xPercent: 100, duration: 2.1, ease: "power3.inOut" }, "<")
      .from(q("[data-burst]"), { scale: 0.6, opacity: 0, transformOrigin: "50% 100%", duration: 1.8, ease: "expo.out" }, "<.7")
      .from(q("[data-hero-in]"), { y: 26, opacity: 0, stagger: 0.12, duration: 1.1, ease: "power3.out" }, "<.4")
      .set(q("[data-doors]"), { display: "none" });
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} og-onyx og-rays relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("onyx-gala", theme, design, OG_VARS), fontFamily: F.tenor }}>
      <style href="biz-og" precedence="default">{OG_CSS}</style>

      <header className={`relative flex flex-col items-center justify-center overflow-hidden px-5 text-center ${compact ? "min-h-[680px] py-14" : "min-h-[100svh] py-16"}`}>
        <Grain opacity={0.1} blend="overlay" freq={1} />
        <div className="pointer-events-none absolute inset-x-6 inset-y-6 border border-[var(--t-gold)]/40 md:inset-x-10 md:inset-y-10" />
        <div className="pointer-events-none absolute inset-x-9 inset-y-9 border border-[var(--t-gold)]/20 md:inset-x-14 md:inset-y-14" />

        <div data-burst className={`relative ${compact ? "w-[300px]" : "w-[min(86vw,560px)]"}`}><Sunburst className="w-full" /></div>
        <p data-hero-in className="relative mt-4 text-[10px] uppercase tracking-[0.6em] text-[var(--t-muted)] md:text-[11px]" style={{ fontFamily: F.cinzel }}>{L.invited}</p>
        <h1 className={`relative mt-4 uppercase leading-[0.95] tracking-[0.08em] ${compact ? "text-[44px]" : "text-[clamp(2.8rem,9vw,6.8rem)]"}`} style={{ fontFamily: F.poiret }}>
          <E path="profile.partner1" className="og-foil og-shine">{name}</E>
        </h1>
        <p data-hero-in className={`relative mt-4 italic text-[var(--t-gold)] ${compact ? "text-xl" : "text-xl md:text-3xl"}`} style={{ fontFamily: F.corm }}>{bizLine(profile)}</p>
        <div data-hero-in className="relative mt-8"><Chevrons className="h-3 w-48 md:w-64" /></div>
        <div data-hero-in className="relative mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 uppercase tracking-[0.35em]" style={{ fontFamily: F.cinzel }}>
          {dp ? <p className="text-sm md:text-base">{dp.dd} · {dp.mm} · {dp.year}</p> : <p className="text-sm">{fmt(profile)}</p>}
          {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[11px] text-[var(--t-muted)]">{venueLine(profile)}</E>}
        </div>

        {!compact && (
          <div data-doors className="pointer-events-none absolute inset-0 z-20 flex">
            <div data-door="l" className="h-full w-1/2"><Door className="h-full w-full" /></div>
            <div data-door="r" className="h-full w-1/2"><Door flip className="h-full w-full" /></div>
          </div>
        )}
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
              <Chevrons className="mx-auto mb-10 h-3 w-40" />
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.7rem] italic leading-[1.45] md:text-[2.5rem]" style={{ fontFamily: F.corm }}>{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="mt-10 text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]" style={{ fontFamily: F.cinzel }}><span className="og-foil mr-3 text-4xl tracking-normal" style={{ fontFamily: F.poiret }}>{d}</span>{L.days}</p>}</Countdown>}
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[5fr_6fr]">
              <div data-r className="relative mx-auto w-[min(78vw,380px)]">
                <div className="aspect-[4/5] rounded-t-[999px] border border-[var(--t-gold)]/70 p-3">
                  <div className="h-full w-full overflow-hidden rounded-t-[999px] bg-[#1a1a1d]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover grayscale-[35%]" /></div>
                </div>
                <Fan className="absolute -bottom-6 left-1/2 w-28 -translate-x-1/2" />
              </div>
              <div className="text-center md:text-left">
                <p data-r className="text-[10px] uppercase tracking-[0.55em] text-[var(--t-muted)]" style={{ fontFamily: F.cinzel }}>{L.hosted} {name}</p>
                <h2 data-r className="og-foil mt-4 text-[2.2rem] uppercase leading-none tracking-[0.1em] md:text-[3rem]" style={{ fontFamily: F.poiret }}>{L.host}</h2>
                {profile.story && <E as="p" multiline path="profile.story" className="mt-8 block whitespace-pre-line text-[1.35rem] leading-[1.7] md:text-[1.5rem]" style={{ fontFamily: F.corm }}>{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative mx-auto max-w-5xl px-6 py-24">
              <Head title={L.details} />
              <div className="grid gap-px border border-[var(--t-gold)]/40 bg-[var(--t-gold)]/30 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? dp.dayMonth : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.time, v: agenda[0]?.detail ?? "", s: agenda[0]?.title ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="bg-[#111113] px-6 py-12 text-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--t-gold)]" style={{ fontFamily: F.cinzel }}>{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-4 block text-[1.9rem] leading-tight" style={{ fontFamily: F.poiret }}>{x.v}</E> : <p className="mt-4 text-[1.9rem] leading-tight" style={{ fontFamily: F.poiret }}>{x.v}</p>}
                    {x.s && <p className="mt-2 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block border border-[var(--t-gold)]/60 px-7 py-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-gold)] transition hover:bg-[var(--t-gold)]/10" style={{ fontFamily: F.cinzel }}>{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: agenda.length ? () => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head title={L.programme} />
              <ol>
                {agenda.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.08} className="grid grid-cols-[3.2rem_1fr_auto] items-baseline gap-4 border-b border-[var(--t-gold)]/25 py-6">
                    <span className="og-foil text-3xl" style={{ fontFamily: F.poiret }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[1.45rem] md:text-[1.8rem]" style={{ fontFamily: F.corm }}>{e.title}</span>
                    <span className="text-xs uppercase tracking-[0.35em] text-[var(--t-gold)]" style={{ fontFamily: F.cinzel }}>{e.detail}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative px-6 py-24 text-center">
              <Head title={L.venue} />
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="og-foil og-shine block text-[2.6rem] uppercase leading-none tracking-[0.06em] md:text-[4.6rem]" style={{ fontFamily: F.poiret }}>{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-5 block text-[11px] uppercase tracking-[0.55em] text-[var(--t-muted)]">{profile.city}</E>}
              <a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-10 inline-block bg-[var(--t-gold)] px-8 py-3.5 text-[11px] uppercase tracking-[0.4em] text-[#0e0e10] transition hover:brightness-110" style={{ fontFamily: F.cinzel }}>{L.directions}</a>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head title={L.gallery} />
              <div className={`grid grid-cols-2 gap-3 ${compact ? "" : "md:grid-cols-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="aspect-[4/5] overflow-hidden border border-[var(--t-gold)]/40">
                    { }
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head title={L.register} kicker={L.reserve} />
              <div data-r className="relative border border-[var(--t-gold)]/50 bg-[#141416]/95 px-6 py-10 md:px-12">
                <span className="pointer-events-none absolute -inset-2 border border-[var(--t-gold)]/20" />
                {children}
              </div>
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
        <Sunburst className="mx-auto w-40 opacity-80" rays={13} />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-2xl italic text-[var(--t-gold)]" style={{ fontFamily: F.corm }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
