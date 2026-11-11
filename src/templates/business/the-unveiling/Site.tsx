"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Plinth, UV_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../../celebrate/_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, bizLine, agendaOf } from "../_shared/words";
import { venueLine } from "../_shared/ui";

export const UV_VARS = { "--t-bg": "#faf4ec", "--t-surface": "#fffaf3", "--t-ink": "#3a1a22", "--t-muted": "#8c6f6a", "--t-accent": "#7d1d3a", "--t-gold": "#b8955a" };

function Head({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div data-r className="mb-12 text-center md:mb-16">
      <p className="mb-3 text-[10px] uppercase tracking-[0.55em] text-[var(--t-gold)]">{kicker ?? "✦"}</p>
      <h2 className="text-[2.6rem] italic leading-none md:text-[4rem]" style={{ fontFamily: F.bodoni }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
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
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-plinth]"), { y: 80, opacity: 0, duration: 1.6, ease: "power3.out" })
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.1, duration: 1.1, ease: "power3.out" }, "<.4");
  }, [compact]);

  const unveil = () => {
    const host = root.current;
    if (!host || open) return;
    setOpen(true);
    const silk = host.querySelector("[data-plinth] [data-silk]");
    const gem = host.querySelector("[data-plinth] [data-gem]");
    if (silk) gsap.to(silk, { y: -260, x: 60, rotate: 18, opacity: 0, duration: 1.6, ease: "power3.inOut" });
    if (gem) setTimeout(() => burstFrom(host, gem, { colors: ["#d9b57a", "#f6d3cf", "#7d1d3a", "#fff4d6"], n: 60, shapes: ["strip", "circle"], angle: [220, 320], velocity: [400, 800], gravity: 700, size: 7 }), 700);
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} uv-ivory uv-float relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("the-unveiling", theme, design, UV_VARS), fontFamily: F.tenor }}>
      <style href="biz-uv" precedence="default">{UV_CSS}</style>

      <header className={`relative grid items-center overflow-hidden px-5 md:px-12 ${compact ? "min-h-[700px] gap-6 py-10" : "min-h-[100svh] gap-10 py-14 md:grid-cols-2"}`}>
        <Grain opacity={0.07} freq={0.9} />
        <div className={`relative ${compact ? "text-center" : "text-center md:text-left"}`}>
          <p data-hero-in className="text-[10px] uppercase tracking-[0.55em] text-[var(--t-gold)]">{L.invited}</p>
          <h1 className={`mt-5 italic leading-[0.92] ${compact ? "text-[52px]" : "text-[clamp(3.2rem,8vw,7.4rem)]"}`} style={{ fontFamily: F.bodoni }}>
            <E path="profile.partner1" className="uv-gold uv-shine">{name}</E>
          </h1>
          <p data-hero-in className="mt-4 text-xl italic text-[var(--t-muted)] md:text-2xl" style={{ fontFamily: F.corm }}>{bizLine(profile)}</p>
          <div data-hero-in className={`mt-8 flex flex-col gap-1 text-[11px] uppercase tracking-[0.4em] ${compact ? "items-center" : "items-center md:items-start"}`}>
            <span>{fmt(profile)}</span>
            {venue && <E path={profile.venue ? "profile.venue" : "profile.city"} className="text-[var(--t-muted)]">{venueLine(profile)}</E>}
          </div>
        </div>
        <div className="relative flex flex-col items-center">
          <button type="button" data-plinth onClick={compact ? undefined : unveil} aria-label={L.tapReveal} className={`relative outline-none ${compact ? "w-[220px] cursor-default" : "w-[min(70vw,380px)] cursor-pointer"}`}>
            <Plinth className="w-full" />
          </button>
          {!compact && <p data-hero-in className="mt-5 text-sm italic text-[var(--t-muted)]" style={{ fontFamily: F.corm }}>{open ? `✦ ${L.revealed} ✦` : L.tapReveal}</p>}
        </div>
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.9rem] italic leading-[1.35] md:text-[2.9rem]" style={{ fontFamily: F.bodoni }}>{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="mt-10 text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]"><span className="uv-gold mr-3 text-5xl italic tracking-normal" style={{ fontFamily: F.bodoni }}>{d}</span>{L.days}</p>}</Countdown>}
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[1fr_1.1fr]">
              <div data-r className="relative mx-auto w-[min(80vw,400px)]">
                <div className="aspect-[3/4] overflow-hidden rounded-[999px_999px_24px_24px] bg-[#f3dcd6]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
              </div>
              <div className="text-center md:text-left">
                <p data-r className="text-[10px] uppercase tracking-[0.55em] text-[var(--t-gold)]">{L.about}</p>
                <h2 data-r className="mt-3 text-[2.4rem] italic leading-none md:text-[3.4rem]" style={{ fontFamily: F.bodoni }}>{name}</h2>
                {profile.story && <E as="p" multiline path="profile.story" className="mt-8 block whitespace-pre-line text-[1.35rem] leading-[1.7] md:text-[1.5rem]" style={{ fontFamily: F.corm }}>{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative mx-auto max-w-5xl px-6 py-24">
              <Head title={L.details} />
              <div className="grid gap-px overflow-hidden rounded-[28px] bg-[var(--t-gold)]/30 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? dp.dayMonth : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.time, v: agenda[0]?.detail ?? "", s: agenda[0]?.title ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="bg-[var(--t-surface)] px-6 py-12 text-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--t-gold)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-4 block text-[1.9rem] italic leading-tight" style={{ fontFamily: F.bodoni }}>{x.v}</E> : <p className="mt-4 text-[1.9rem] italic leading-tight" style={{ fontFamily: F.bodoni }}>{x.v}</p>}
                    {x.s && <p className="mt-2 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block rounded-full border border-[var(--t-accent)]/40 px-7 py-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-accent)] transition hover:bg-[var(--t-accent)] hover:text-white">{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: agenda.length ? () => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head title={L.programme} />
              {agenda.map((e, i) => (
                <div key={i} data-r data-d={i * 0.08} className="flex items-baseline gap-4 py-5">
                  <p className="shrink-0 text-[1.6rem] italic md:text-[2.2rem]" style={{ fontFamily: F.bodoni }}>{e.title}</p>
                  <span className="mb-2 flex-1 border-b border-dotted border-[var(--t-gold)]/70" />
                  <span className="shrink-0 text-sm uppercase tracking-[0.3em] text-[var(--t-accent)]">{e.detail}</span>
                </div>
              ))}
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative px-6 py-24 text-center">
              <Head title={L.venue} />
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="uv-gold block text-[2.8rem] italic leading-none md:text-[5rem]" style={{ fontFamily: F.bodoni }}>{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-4 block text-[11px] uppercase tracking-[0.55em] text-[var(--t-muted)]">{profile.city}</E>}
              <a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-10 inline-block rounded-full bg-[var(--t-accent)] px-8 py-3.5 text-[11px] uppercase tracking-[0.4em] text-[#faf4ec] transition hover:brightness-110">{L.directions}</a>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head title={L.gallery} />
              <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="mb-4 break-inside-avoid overflow-hidden rounded-[20px]">
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
              <div data-r className="rounded-[32px] bg-[var(--t-surface)] px-6 py-10 shadow-[0_40px_80px_-40px_rgba(125,29,58,.35)] ring-1 ring-[var(--t-gold)]/30 md:px-12">{children}</div>
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
        <Plinth veiled={false} className="mx-auto w-24" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-2xl italic text-[var(--t-accent)]" style={{ fontFamily: F.bodoni }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
