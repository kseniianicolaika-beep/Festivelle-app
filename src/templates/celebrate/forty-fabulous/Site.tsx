"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Sunburst, ZigguratFrame, Fan, DecoRule, DoorPanel, FF_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars, roman } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, birthdayOf, lineOf } from "../_shared/words";

export const FF_VARS = { "--t-bg": "#0c0d0e", "--t-surface": "#0f1d19", "--t-ink": "#f1e6cf", "--t-muted": "#b3a78e", "--t-accent": "#e9cf8f", "--t-gold": "#d6b36a", "--foil-a": "#8f6a2c", "--foil-b": "#f7e2a8" };
const GOLDS = ["#f7e2a8", "#d6b36a", "#fff1c6", "#a37b35"];
const STEP = "polygon(0 14%, 12% 14%, 12% 7%, 26% 7%, 26% 0, 74% 0, 74% 7%, 88% 7%, 88% 14%, 100% 14%, 100% 100%, 0 100%)";

function Head({ n, title }: { n: number; title: string }) {
  return (
    <div data-r className="mb-12 text-center md:mb-16">
      <p className="text-xs tracking-[0.6em] text-[var(--t-gold)]" style={{ fontFamily: F.lime }}>{roman(n)}</p>
      <h2 className="ff-foil mt-3 text-[2.1rem] uppercase leading-none tracking-[0.18em] md:text-[3.4rem]" style={{ fontFamily: F.poiret }}>{title}</h2>
      <DecoRule className="mx-auto mt-5 w-56" />
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
  const age = profile.age;
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    q("[data-door]").forEach((n) => ((n as HTMLElement).style.animation = "none"));
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from(q("[data-door-seam]"), { scaleY: 0, duration: 0.9, ease: "power2.inOut" })
      .to(q("[data-door='l']"), { xPercent: -101, duration: 1.8, ease: "expo.inOut" }, "+=.15")
      .to(q("[data-door='r']"), { xPercent: 101, duration: 1.8, ease: "expo.inOut" }, "<")
      .to(q("[data-door-seam]"), { opacity: 0, duration: 0.3 }, "<")
      .from(q("[data-frame]"), { scaleY: 0.85, opacity: 0, duration: 1.6, ease: "expo.out" }, "<.5")
      .from(q("[data-rays] path"), { scale: 0, transformOrigin: "200px 220px", opacity: 0, duration: 1.2, stagger: { each: 0.02, from: "center" }, ease: "expo.out" }, "<.2")
      .from(q("[data-age]"), { y: 40, opacity: 0, duration: 1.4, ease: "expo.out" }, "<.3")
      .from(q("[data-hero-in]"), { y: 18, opacity: 0, letterSpacing: "0.6em", stagger: 0.12, duration: 1.2, ease: "power3.out" }, "<.3");
  }, [compact]);

  const flare = () => {
    const host = root.current;
    const sun = host?.querySelector("[data-sun]");
    if (!host || !sun) return;
    gsap.fromTo(sun.querySelectorAll("[data-rays] path"), { scale: 1 }, { scale: 1.25, transformOrigin: "200px 220px", duration: 0.35, yoyo: true, repeat: 1, stagger: { each: 0.01, from: "edges" }, ease: "power2.out" });
    burstFrom(host, sun, { colors: GOLDS, n: 60, shapes: ["star", "circle", "rect"], angle: [200, 340], velocity: [350, 800], gravity: 600, size: 8 });
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`} style={{ ...tplVars("forty-fabulous", theme, design, FF_VARS), fontFamily: F.tenor }}>
      <style href="cel-ff" precedence="default">{FF_CSS}</style>

      <header className={`relative flex items-center justify-center overflow-hidden px-5 ${compact ? "min-h-[680px] py-10" : "min-h-[100svh] py-12"}`}>
        <div aria-hidden className="ff-pattern absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_45%,rgba(20,70,56,.75),rgba(12,13,14,.2)_70%,transparent)]" />
        <Grain opacity={0.15} blend="overlay" />
        <Fan className="absolute left-0 top-0 w-24 rotate-90 opacity-60 md:w-40" />
        <Fan className="absolute right-0 top-0 w-24 rotate-180 opacity-60 md:w-40" />
        <Fan className="absolute bottom-0 left-0 w-24 opacity-60 md:w-40" />
        <Fan className="absolute bottom-0 right-0 w-24 -rotate-90 opacity-60 md:w-40" />

        <div data-frame className={`relative flex w-full flex-col items-center px-6 text-center ${compact ? "max-w-[340px] pb-10 pt-16" : "max-w-[560px] pb-14 pt-24 md:pt-28"}`}>
          <ZigguratFrame className="absolute inset-0 h-full w-full" />
          <p data-hero-in className="text-[10px] uppercase tracking-[0.5em] text-[var(--t-muted)] md:text-[11px]">{L.invited}</p>
          <button type="button" data-sun onClick={compact ? undefined : flare} aria-label="Sunburst" className={`relative mt-6 w-full outline-none ${compact ? "cursor-default" : "cursor-pointer"}`}>
            <Sunburst className={`mx-auto w-[88%] ${compact ? "" : "ff-rays"}`} />
            {age ? <span data-age className="ff-foil ff-shine absolute inset-x-0 bottom-[2%] block leading-none" style={{ fontFamily: F.lime, fontSize: compact ? "120px" : "clamp(7.5rem, 30vw, 13rem)" }}>{age}</span> : null}
          </button>
          <h1 className={`relative mt-6 uppercase leading-[1.05] tracking-[0.16em] ${compact ? "text-[38px]" : "text-[clamp(2.4rem,9vw,4.6rem)]"}`} style={{ fontFamily: F.poiret }}>
            <E path="profile.partner1" className="ff-foil ff-shine">{name}</E>
          </h1>
          <p data-hero-in className="mt-2 text-3xl text-[var(--t-accent)] md:text-4xl" style={{ fontFamily: F.vibes }}>{lineOf(profile)}</p>
          <DecoRule className="my-6 w-52" />
          <p data-hero-in className="text-lg uppercase tracking-[0.3em]" style={{ fontFamily: F.poiret }}>{fmt(profile)}</p>
          {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-1 block text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
          {!compact && (
            <Countdown date={profile.date}>
              {(d) => <p data-hero-in className="mt-6 text-[10px] uppercase tracking-[0.45em] text-[var(--t-muted)]"><span className="ff-foil mr-2 text-2xl tracking-normal" style={{ fontFamily: F.lime }}>{d}</span>{L.until}</p>}
            </Countdown>
          )}
        </div>

        {!compact && (
          <>
            <div data-door="l" aria-hidden className="ff-door-l absolute inset-y-0 left-0 z-20 w-1/2 overflow-hidden"><DoorPanel className="h-full w-full" /></div>
            <div data-door="r" aria-hidden className="ff-door-r absolute inset-y-0 right-0 z-20 w-1/2 overflow-hidden"><DoorPanel flip className="h-full w-full" /></div>
            <div data-door-seam data-door aria-hidden className="ff-seam pointer-events-none absolute inset-y-0 left-1/2 z-30 w-px bg-gradient-to-b from-transparent via-[#f7e2a8] to-transparent" />
          </>
        )}
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
              <Fan className="mx-auto mb-8 w-16 -rotate-45" />
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.7rem] uppercase leading-[1.45] tracking-[0.12em] md:text-[2.6rem]" style={{ fontFamily: F.poiret }}>{profile.inviteLine || occasionInvite(profile)}</E>
              <p data-r className="mt-8 text-[11px] uppercase tracking-[0.5em] text-[var(--t-gold)]">{birthdayOf(profile)}</p>
            </section>
          ),
          story: (profile.story || heroUrl) ? (n) => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-32">
              <div data-r="left" className="relative mx-auto w-[min(76vw,380px)]">
                <div className="relative aspect-[3/4] bg-[linear-gradient(135deg,#f7e2a8,#8f6a2c)] p-[3px]" style={{ clipPath: STEP }}>
                  <div className="h-full w-full overflow-hidden bg-[#0f1d19]" style={{ clipPath: STEP }}>
                    <HeroPhoto url={heroUrl} className="h-full w-full object-cover [filter:grayscale(1)_contrast(1.1)]" />
                  </div>
                </div>
                <Fan className="absolute -bottom-6 -left-6 w-20" />
              </div>
              <div className="text-center md:text-left">
                <Head n={n} title={L.about} />
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.15rem] leading-[1.9] text-[var(--t-ink)]/90 md:text-[1.25rem]">{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? (n) => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head n={n} title={L.details} />
              <div className="grid border-y border-[var(--t-gold)]/40 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? `${dp.day} ${dp.month}` : fmt(profile), s: dp ? `${dp.weekday} · ${dp.year}` : "" },
                  { k: L.evening, v: profile.events?.[0]?.time ?? "", s: profile.events?.[0]?.name ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.12} className="relative flex flex-col items-center px-6 py-12 text-center [&:not(:first-child)]:border-t [&:not(:first-child)]:border-[var(--t-gold)]/30 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--t-gold)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-5 block text-[1.9rem] uppercase leading-tight tracking-[0.1em]" style={{ fontFamily: F.poiret }}>{x.v}</E> : <p className="mt-5 text-[1.9rem] uppercase leading-tight tracking-[0.1em]" style={{ fontFamily: F.poiret }}>{x.v}</p>}
                    {x.s && <p className="mt-2 text-sm capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-12 text-center"><a href={calendarUrl} className="inline-block border border-[var(--t-gold)]/60 px-7 py-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-accent)] transition hover:bg-[var(--t-gold)]/10">{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: profile.events?.length ? (n) => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head n={n} title={L.evening} />
              <div className="relative">
                <div aria-hidden className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--t-gold)]/60 to-transparent" />
                {profile.events!.map((e, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="relative mb-14 flex flex-col items-center text-center last:mb-0">
                    <span className="relative z-10 grid h-16 w-16 rotate-45 place-items-center border border-[var(--t-gold)] bg-[var(--t-bg)]"><span className="ff-foil -rotate-45 text-lg" style={{ fontFamily: F.lime }}>{roman(i + 1)}</span></span>
                    <p className="mt-6 text-sm tracking-[0.35em] text-[var(--t-gold)]">{e.time}</p>
                    <p className="mt-2 bg-[var(--t-bg)] px-4 text-[1.7rem] uppercase tracking-[0.14em] md:text-[2.2rem]" style={{ fontFamily: F.poiret }}>{e.name}</p>
                    {e.venue && <p className="mt-1 bg-[var(--t-bg)] px-3 text-xs uppercase tracking-[0.3em] text-[var(--t-muted)]">{e.venue}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          venue: venue ? (n) => (
            <section className="relative px-6 py-24">
              <Head n={n} title={L.venue} />
              <div data-r className="relative mx-auto max-w-3xl px-8 pb-14 pt-24 text-center md:px-16">
                <ZigguratFrame className="absolute inset-0 h-full w-full" />
                <div aria-hidden className="absolute inset-[3px] -z-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(20,70,56,.6),transparent)]" style={{ clipPath: STEP }} />
                <Sunburst className="relative mx-auto -mt-10 mb-6 w-48" rays={24} />
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="ff-foil relative block text-[2.6rem] uppercase leading-[1.05] tracking-[0.12em] md:text-[4.4rem]" style={{ fontFamily: F.poiret }}>{profile.venue || profile.city}</E>
                {profile.venue && profile.city && <E as="p" path="profile.city" className="relative mt-3 block text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{profile.city}</E>}
                <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="relative mt-10 inline-block border border-[var(--t-gold)]/60 px-7 py-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-accent)] transition hover:bg-[var(--t-gold)]/10">{L.directions}</a>
              </div>
            </section>
          ) : null,
          gallery: gallery.length ? (n) => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head n={n} title={L.gallery} />
              <div className={`grid grid-cols-2 gap-5 ${compact ? "" : "md:grid-cols-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.1} className="bg-[linear-gradient(135deg,#f7e2a8,#8f6a2c)] p-[2px]" style={{ clipPath: STEP }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" style={{ clipPath: STEP }} />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? (n) => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head n={n} title={L.reply} />
              <div data-r className="relative border border-[var(--t-gold)]/60 bg-[var(--t-surface)] px-6 py-12 md:px-12">
                <Fan className="absolute left-0 top-0 w-12 rotate-90" /><Fan className="absolute right-0 top-0 w-12 rotate-180" />
                {children}
              </div>
            </section>
          ) : null,
          info: info ? (n) => (
            <section className="relative mx-auto max-w-2xl px-6 py-20 text-center">
              <Head n={n} title={L.info} />
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-lg leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Sunburst className="mx-auto w-40" rays={20} />
        <p className="ff-foil -mt-2 text-4xl uppercase tracking-[0.2em]" style={{ fontFamily: F.poiret }}>{name}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-3xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
