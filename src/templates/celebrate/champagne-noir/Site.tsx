"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { CoupeTower, Bottle, Candelabra, Corner, CN_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars, roman } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap, SplitText } from "../_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, birthdayOf, lineOf } from "../_shared/words";

export const CN_VARS = { "--t-bg": "#0b0909", "--t-surface": "#141011", "--t-ink": "#f3e9d8", "--t-muted": "#a99b87", "--t-accent": "#e8cf9c", "--t-gold": "#d8b46a", "--foil-a": "#9b733a", "--foil-b": "#f6e2ab" };
const GOLDS = ["#f6e2ab", "#d8b46a", "#fff4d2", "#b98b3e", "#fbe9c0"];

function Head({ n, title }: { n: number; title: string }) {
  return (
    <div data-r className="mb-12 flex flex-col items-center text-center md:mb-16">
      <span className="text-[11px] tracking-[0.5em] text-[var(--t-gold)]" style={{ fontFamily: F.tenor }}>{roman(n)}</span>
      <h2 className="mt-3 text-[2.4rem] italic leading-none md:text-[3.6rem]" style={{ fontFamily: F.bodoni }}>{title}</h2>
      <div className="mt-5 flex items-center gap-3 text-[var(--t-gold)]"><span className="h-px w-12 bg-current opacity-60" /><span className="h-1.5 w-1.5 rotate-45 bg-current" /><span className="h-px w-12 bg-current opacity-60" /></div>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [popped, setPopped] = useState(false);
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
    q("[data-lb],[data-lb-line]").forEach((n) => ((n as HTMLElement).style.animation = "none"));
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    const split = SplitText.create(q("[data-name]"), { type: "chars", mask: "chars", charsClass: "cn-foil" });
    tl.from(q("[data-lb-line]"), { scaleX: 0, duration: 1.1, ease: "power2.inOut" })
      .to(q("[data-lb='t']"), { yPercent: -100, duration: 1.5, ease: "expo.inOut" }, "+=.1")
      .to(q("[data-lb='b']"), { yPercent: 100, duration: 1.5, ease: "expo.inOut" }, "<")
      .to(q("[data-lb-line]"), { opacity: 0, duration: 0.4 }, "<")
      .from(q("[data-age]"), { scale: 1.15, opacity: 0, duration: 2.4 }, "<.3")
      .from(q("[data-draw]"), { drawSVG: 0, duration: 1.8, stagger: 0.05, ease: "power2.inOut" }, "<.2")
      .from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.04, onComplete: () => split.revert() }, "<.6")
      .from(q("[data-hero-in]"), { y: 20, opacity: 0, stagger: 0.12, duration: 1 }, "<.4");
    // parallax: tower drifts slower than page
    gsap.to(q("[data-age]"), { yPercent: 18, ease: "none", scrollTrigger: { trigger: q("header")[0], start: "top top", end: "bottom top", scrub: true } });
    return () => split.revert();
  }, [compact]);

  const pop = () => {
    const host = root.current;
    if (!host || popped) return;
    setPopped(true);
    const cork = host.querySelector("[data-pop] [data-cork]");
    const btl = host.querySelector("[data-pop]");
    if (cork && btl) {
      gsap.to(cork, { y: -260, x: 60, rotation: 520, opacity: 0, duration: 1.1, ease: "power2.out" });
      gsap.fromTo(btl, { rotation: -6 }, { rotation: 0, duration: 0.6, ease: "elastic.out(1.2,.4)" });
      burstFrom(host, btl, { colors: GOLDS, n: 70, angle: [235, 305], velocity: [500, 1000], gravity: 700, shapes: ["circle", "strip", "star", "rect"], size: 9 }, -60);
    }
    const liquids = host.querySelectorAll("header [data-liquid]");
    const stream = host.querySelector("header [data-stream]");
    if (stream) gsap.to(stream, { opacity: 1, duration: 0.4 });
    gsap.fromTo(liquids, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.9, stagger: 0.14, ease: "power2.out", delay: 0.3 });
  };

  const filledTower = compact || popped;
  const fill = { color: "var(--t-ink)" };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} relative overflow-hidden bg-[var(--t-bg)]`} style={{ ...tplVars("champagne-noir", theme, design, CN_VARS), ...fill, fontFamily: F.tenor }}>
      <style href="cel-cn" precedence="default">{CN_CSS}</style>

      {/* ── Hero: letterbox opens on a candlelit coupe tower ── */}
      <header className={`relative flex flex-col items-center overflow-hidden px-6 text-center ${compact ? "min-h-[640px] pb-14 pt-12" : "min-h-[100svh] pb-20 pt-16 md:pt-20"}`}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_42%,#3a2716_0%,#1a1210_45%,var(--t-bg)_80%)]" />
        <div aria-hidden className="absolute inset-0">
          {[[12, 18, 140], [82, 22, 180], [70, 64, 120], [22, 70, 160], [50, 12, 90], [92, 80, 110]].map(([x, y, s], i) => (
            <span key={i} className="cn-bokeh absolute rounded-full" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${i * 1.3}s`, background: "radial-gradient(circle, rgba(255,196,110,.35), rgba(255,196,110,0) 70%)", filter: "blur(6px)" }} />
          ))}
        </div>
        {!compact && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} className="cn-bubble" style={{ left: `${(i * 37) % 100}%`, width: 3 + (i % 4) * 2, height: 3 + (i % 4) * 2, animationDuration: `${9 + (i % 5) * 2.5}s`, animationDelay: `${-i * 1.7}s` }} />
            ))}
          </div>
        )}
        <Grain opacity={0.18} blend="overlay" />

        <p data-hero-in className="relative text-[10px] uppercase tracking-[0.55em] text-[var(--t-muted)] md:text-[11px]">
          {L.invited}
          {dp && <span className="mx-3 text-[var(--t-gold)]">✦</span>}
          {dp && `${dp.dd}.${dp.mm}.${dp.year}`}
        </p>

        <div className={`relative mt-6 flex w-full flex-1 flex-col items-center justify-center ${compact ? "" : "md:mt-4"}`}>
          {age ? (
            <span data-age aria-hidden className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 select-none leading-none" style={{ fontFamily: F.bodoni, fontSize: compact ? "300px" : "clamp(17rem, 52vw, 42rem)", color: "transparent", WebkitTextStroke: "1px rgba(216,180,106,.3)", letterSpacing: "-0.02em" }}>{age}</span>
          ) : null}
          <CoupeTower filled={filledTower} className={`relative ${compact ? "w-[230px]" : "w-[min(70vw,330px)] md:w-[360px]"}`} />
          <h1 className={`relative -mt-2 leading-[0.95] ${compact ? "text-[64px]" : "text-[clamp(3.6rem,13vw,9.5rem)]"}`} style={{ fontFamily: F.bodoni }}>
            <E path="profile.partner1" className="cn-foil cn-shine italic"><span data-name>{name}</span></E>
          </h1>
          <p data-hero-in className={`relative mt-1 text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>{lineOf(profile)}</p>
        </div>

        <div data-hero-in className="relative mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 text-[var(--t-gold)]">
            <span className="h-px w-10 bg-current md:w-16" />
            <p className="text-[1.35rem] italic text-[var(--t-ink)] md:text-2xl" style={{ fontFamily: F.bodoni }}>{fmt(profile)}</p>
            <span className="h-px w-10 bg-current md:w-16" />
          </div>
          {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[11px] uppercase tracking-[0.42em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
          {!compact && (
            <Countdown date={profile.date}>
              {(d) => <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-[var(--t-muted)]"><span className="mr-2 align-[-0.2em] text-2xl italic tracking-normal text-[var(--t-accent)]" style={{ fontFamily: F.bodoni }}>{d}</span>{L.until}</p>}
            </Countdown>
          )}
        </div>

        {!compact && (
          <button type="button" onClick={pop} aria-label={L.pop} className="group relative mt-8 flex items-end gap-3 text-left outline-none">
            <span data-pop className="block w-[30px] origin-bottom transition-transform duration-500 group-hover:-rotate-6"><Bottle initial={name[0]} className="w-full" /></span>
            <span className={`mb-2 border-b border-[var(--t-gold)]/50 pb-1 text-[10px] uppercase tracking-[0.4em] transition-opacity ${popped ? "opacity-40" : "text-[var(--t-accent)]"}`}>{popped ? "Santé ✦" : L.pop}</span>
          </button>
        )}

        {!compact && (
          <>
            <div data-lb="t" aria-hidden className="cn-lb-t absolute inset-x-0 top-0 z-20 h-1/2 bg-[#050404]" />
            <div data-lb="b" aria-hidden className="cn-lb-b absolute inset-x-0 bottom-0 z-20 h-1/2 bg-[#050404]" />
            <div data-lb-line aria-hidden className="cn-lb-l pointer-events-none absolute left-[10%] right-[10%] top-1/2 z-30 h-px bg-gradient-to-r from-transparent via-[#f6e2ab] to-transparent" />
          </>
        )}
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-36">
              <svg data-r viewBox="0 0 200 20" className="mx-auto mb-10 w-48 text-[var(--t-gold)]" aria-hidden><path d="M0 10h80M120 10h80" stroke="currentColor" strokeWidth=".6" /><path d="M86 4c4 7 24 7 28 0M100 11v6M94 18h12" fill="none" stroke="currentColor" strokeWidth=".8" /></svg>
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.9rem] italic leading-[1.35] md:text-[3.1rem]" style={{ fontFamily: F.bodoni }}>{profile.inviteLine || occasionInvite(profile)}</E>
              <p data-r className="mt-10 text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{birthdayOf(profile)}</p>
            </section>
          ),
          story: (profile.story || heroUrl) ? (n) => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[5fr_7fr] md:gap-20 md:py-32">
              <div data-r="left" className="relative mx-auto w-[min(72vw,340px)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[50%] p-[10px]" style={{ background: "conic-gradient(from 200deg,#8a6631,#f6e2ab,#b98b3e,#fff4d2,#8a6631)" }}>
                  <div className="h-full w-full overflow-hidden rounded-[50%] bg-[#1a1311]">
                    <HeroPhoto url={heroUrl} className="h-full w-full object-cover [filter:grayscale(.35)_contrast(1.05)_sepia(.15)]" />
                    {!heroUrl && <div className="absolute inset-[10px] grid place-items-center rounded-[50%]"><span className="cn-foil text-[8rem] italic" style={{ fontFamily: F.bodoni }}>{name[0]}</span></div>}
                  </div>
                </div>
                <Candelabra className="absolute -bottom-10 -right-6 w-28 md:-right-14 md:w-36" />
              </div>
              <div className="text-center md:text-left">
                <div className="md:[&>div]:items-start"><Head n={n} title={L.about} /></div>
                {profile.story && (
                  <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.35rem] leading-[1.7] text-[var(--t-ink)]/90 first-letter:float-left first-letter:mr-1 first-letter:mt-1 first-letter:text-[4.6rem] first-letter:italic first-letter:leading-[0.8] first-letter:text-[var(--t-gold)] md:text-[1.55rem]" style={{ fontFamily: F.bodoni }}>{profile.story}</E>
                )}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? (n) => (
            <section className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
              <Head n={n} title={L.details} />
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? `${dp.weekday}` : "", s: fmt(profile) },
                  { k: L.evening, v: profile.events?.[0]?.time ?? "", s: profile.events?.[0]?.name ?? "" },
                  { k: L.where, v: profile.venue || profile.city || "", s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v || x.s).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.12} className="relative border border-[var(--t-gold)]/45 p-[6px]">
                    <div className="relative flex min-h-[220px] flex-col items-center justify-center border border-[var(--t-gold)]/25 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(216,180,106,.12),transparent)] px-6 py-10 text-center">
                      <Corner className="absolute left-2 top-2 w-6" /><Corner className="absolute right-2 top-2 w-6 rotate-90" /><Corner className="absolute bottom-2 right-2 w-6 rotate-180" /><Corner className="absolute bottom-2 left-2 w-6 -rotate-90" />
                      <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--t-gold)]">{x.k}</p>
                      {x.path ? <E as="p" path={x.path} className="mt-4 block text-[2rem] italic leading-tight" style={{ fontFamily: F.bodoni }}>{x.v}</E> : <p className={`mt-4 text-[2rem] italic leading-tight ${i === 0 ? "capitalize" : ""}`} style={{ fontFamily: F.bodoni }}>{x.v}</p>}
                      {x.s && <p className="mt-2 text-sm text-[var(--t-muted)]">{x.s}</p>}
                    </div>
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-12 text-center"><a href={calendarUrl} className="inline-block border-b border-[var(--t-gold)]/60 pb-1 text-[11px] uppercase tracking-[0.4em] text-[var(--t-accent)] transition hover:border-[var(--t-accent)]">✦ {L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: profile.events?.length ? (n) => (
            <section className="relative mx-auto max-w-3xl px-6 py-24 md:py-32">
              <Head n={n} title={L.evening} />
              <ol className="relative">
                {profile.events!.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.08} className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-t border-[var(--t-gold)]/20 py-7 last:border-b md:grid-cols-[4rem_1fr_auto]">
                    <span className="text-sm italic text-[var(--t-gold)]" style={{ fontFamily: F.bodoni }}>{roman(i + 1)}.</span>
                    <div>
                      <p className="text-[1.7rem] italic leading-tight md:text-[2.2rem]" style={{ fontFamily: F.bodoni }}>{e.name}</p>
                      {e.venue && <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[var(--t-muted)]">{e.venue}</p>}
                    </div>
                    <span className="text-right text-[11px] uppercase tracking-[0.3em] text-[var(--t-accent)]">{e.time}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? (n) => (
            <section className="relative overflow-hidden px-6 py-24 text-center md:py-36">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_60%,rgba(255,190,100,.14),transparent)]" />
              <Head n={n} title={L.venue} />
              <Candelabra className="relative mx-auto mb-8 w-36 md:w-44" />
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative block text-[3rem] italic leading-none md:text-[5.5rem]" style={{ fontFamily: F.bodoni }}><span className="cn-foil cn-shine">{profile.venue || profile.city}</span></E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="relative mt-4 block text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{profile.city}</E>}
              <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="relative mt-10 inline-flex items-center gap-3 border border-[var(--t-gold)]/50 px-7 py-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-accent)] transition hover:bg-[var(--t-gold)]/10">{L.directions} →</a>
            </section>
          ) : null,
          gallery: gallery.length ? (n) => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head n={n} title={L.gallery} />
              <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="mb-4 break-inside-avoid border border-[var(--t-gold)]/35 p-[5px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover transition duration-700 [filter:sepia(.12)] hover:[filter:none]" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? (n) => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head n={n} title={L.reply} />
              <div data-r className="relative border border-[var(--t-gold)]/50 p-[6px]">
                <div className="relative border border-[var(--t-gold)]/25 bg-[var(--t-surface)] px-6 py-10 md:px-12">{children}</div>
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

      <footer className="relative px-6 pb-16 pt-10 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-[var(--t-gold)]/60"><span className="cn-foil text-5xl italic" style={{ fontFamily: F.bodoni }}>{name[0]}</span></div>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-6 block text-3xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
