"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Eclipse, Stars, EC_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../../celebrate/_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, bizLine, agendaOf } from "../_shared/words";
import { venueLine } from "../_shared/ui";

export const EC_VARS = { "--t-bg": "#0b0a0b", "--t-surface": "#151314", "--t-ink": "#f5ebdd", "--t-muted": "#a89c8c", "--t-accent": "#e4c58e", "--t-gold": "#e4c58e" };

function Head({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div data-r className="mb-12 text-center md:mb-16">
      {kicker && <p className="mb-3 text-[10px] uppercase tracking-[0.6em] text-[var(--t-muted)]">{kicker}</p>}
      <h2 className="ec-gold text-[2.6rem] italic leading-none md:text-[4rem]" style={{ fontFamily: F.bodoni }}>{title}</h2>
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
  const agenda = agendaOf(profile);
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.3 })
      .from(q("[data-corona]"), { scale: 0.3, opacity: 0, duration: 2.6, ease: "expo.out" })
      .from(q("[data-flare]"), { scale: 0, opacity: 0, duration: 1, ease: "back.out(3)" }, "-=1.4")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, filter: "blur(8px)", stagger: 0.12, duration: 1.2, ease: "power3.out" }, "<.2");
  }, [compact]);

  const reveal = () => {
    const host = root.current;
    if (!host || lit) return;
    setLit(true);
    const ecl = host.querySelector("[data-eclipse]");
    gsap.fromTo(host.querySelectorAll("[data-eclipse] [data-corona]"), { scale: 1 }, { scale: 1.35, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.out" });
    gsap.fromTo(host.querySelectorAll("[data-eclipse] [data-flare]"), { scale: 1 }, { scale: 2.4, duration: 0.45, yoyo: true, repeat: 1, ease: "power2.out" });
    if (ecl) burstFrom(host, ecl, { colors: ["#fff4d6", "#e4c58e", "#ffffff", "#b8955a"], n: 70, shapes: ["circle", "star"], velocity: [250, 700], gravity: 120, size: 5, life: 2.8 });
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} ec-night ec-pulse relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("eclipse-launch", theme, design, EC_VARS), fontFamily: F.tenor }}>
      <style href="biz-ec" precedence="default">{EC_CSS}</style>

      <header className={`relative flex flex-col items-center justify-center overflow-hidden px-5 text-center ${compact ? "min-h-[680px] py-12" : "min-h-[100svh] py-16"}`}>
        <Stars />
        <p data-hero-in className="relative text-[10px] uppercase tracking-[0.7em] text-[var(--t-muted)]">{L.invited}</p>
        <button type="button" data-eclipse onClick={compact ? undefined : reveal} aria-label={L.tapReveal} className={`relative my-8 outline-none ${compact ? "w-[230px] cursor-default" : "w-[min(70vw,360px)] cursor-pointer"}`}>
          <Eclipse className="w-full" />
        </button>
        <h1 className={`relative italic leading-[0.95] ${compact ? "text-[48px]" : "text-[clamp(3rem,10vw,7.5rem)]"}`} style={{ fontFamily: F.bodoni }}>
          <E path="profile.partner1" className="ec-gold ec-shine">{name}</E>
        </h1>
        <p data-hero-in className="relative mt-4 text-[11px] uppercase tracking-[0.55em] text-[var(--t-accent)]">{bizLine(profile)}</p>
        {!compact && <p data-hero-in className="relative mt-3 text-xs italic text-[var(--t-muted)]">{lit ? `✦ ${L.revealed} ✦` : L.tapReveal}</p>}
        <div data-hero-in className="relative mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] uppercase tracking-[0.4em]">
          <span>{fmt(profile)}</span>
          {venue && <><span className="text-[var(--t-accent)]">✦</span><E path={profile.venue ? "profile.venue" : "profile.city"} className="text-[var(--t-muted)]">{venueLine(profile)}</E></>}
        </div>
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.9rem] italic leading-[1.35] md:text-[2.9rem]" style={{ fontFamily: F.bodoni }}>{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && (
                <Countdown date={profile.date}>{(d, h) => (
                  <div data-r className="mx-auto mt-12 flex max-w-sm justify-center gap-px overflow-hidden rounded-2xl border border-[var(--t-gold)]/30 bg-[var(--t-gold)]/20">
                    {[[d, L.days], [h, "h"]].map(([v, k], i) => (
                      <div key={i} className="flex-1 bg-[#0f0e0f] px-6 py-6">
                        <p className="ec-gold text-5xl tabular-nums" style={{ fontFamily: F.bodoni }}>{v}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{k}</p>
                      </div>
                    ))}
                  </div>
                )}</Countdown>
              )}
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
              <div data-r className="relative mx-auto aspect-square w-[min(78vw,420px)] overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(228,197,142,.5),0_0_80px_10px_rgba(228,197,142,.15)]">
                <HeroPhoto url={heroUrl} className="h-full w-full object-cover" />
              </div>
              <div className="text-center md:text-left">
                <p data-r className="text-[10px] uppercase tracking-[0.6em] text-[var(--t-muted)]">{L.about}</p>
                <h2 data-r className="ec-gold mt-3 text-[2.6rem] italic leading-none md:text-[3.6rem]" style={{ fontFamily: F.bodoni }}>{name}</h2>
                {profile.story && <E as="p" multiline path="profile.story" className="mt-8 block whitespace-pre-line text-[1.15rem] leading-[1.8] text-[var(--t-ink)]/90 md:text-[1.25rem]">{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative mx-auto max-w-5xl px-6 py-24">
              <Head title={L.details} />
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? dp.dayMonth : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.time, v: agenda[0]?.detail ?? "", s: agenda[0]?.title ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="rounded-2xl border border-[var(--t-gold)]/25 bg-[#121012] px-6 py-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--t-accent)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-4 block text-[1.9rem] italic leading-tight" style={{ fontFamily: F.bodoni }}>{x.v}</E> : <p className="mt-4 text-[1.9rem] italic leading-tight" style={{ fontFamily: F.bodoni }}>{x.v}</p>}
                    {x.s && <p className="mt-2 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block rounded-full border border-[var(--t-gold)]/50 px-7 py-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-gold)] transition hover:bg-[var(--t-gold)]/10">{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: agenda.length ? () => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head title={L.programme} />
              <ol className="relative border-l border-[var(--t-gold)]/40 pl-8">
                {agenda.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.08} className="relative py-6">
                    <span className="absolute -left-[37px] top-8 h-3 w-3 rounded-full bg-[var(--t-gold)] shadow-[0_0_16px_4px_rgba(228,197,142,.5)]" />
                    <p className="text-[11px] uppercase tracking-[0.45em] text-[var(--t-accent)]">{e.detail}</p>
                    <p className="mt-2 text-[1.7rem] italic md:text-[2.2rem]" style={{ fontFamily: F.bodoni }}>{e.title}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative px-6 py-24 text-center">
              <Head title={L.venue} />
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[2.8rem] italic leading-none md:text-[5rem]" style={{ fontFamily: F.bodoni }}>{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-4 block text-[11px] uppercase tracking-[0.55em] text-[var(--t-muted)]">{profile.city}</E>}
              <a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-10 inline-block rounded-full bg-[var(--t-gold)] px-8 py-3.5 text-[11px] uppercase tracking-[0.4em] text-[#0b0a0b] transition hover:brightness-110">{L.directions}</a>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head title={L.gallery} />
              <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl">
                    { }
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head title={L.register} kicker={L.reserve} />
              <div data-r className="rounded-[28px] border border-[var(--t-gold)]/35 bg-[#121012]/95 px-6 py-10 shadow-[0_0_80px_-20px_rgba(228,197,142,.25)] md:px-12">{children}</div>
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
        <Eclipse className="mx-auto w-24 opacity-90" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-6 block text-2xl italic text-[var(--t-accent)]" style={{ fontFamily: F.bodoni }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
