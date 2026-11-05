"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { DiscoBall, Flecks, Sparkle, DT_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, birthdayOf, lineOf } from "../_shared/words";

export const DT_VARS = { "--t-bg": "#140a24", "--t-surface": "#1e1135", "--t-ink": "#fff4fa", "--t-muted": "#bfaee0", "--t-accent": "#ff5fae", "--t-gold": "#ffd36e", "--foil-a": "#b9a6f0", "--foil-b": "#ffffff" };
export const DT_CONFETTI = ["#ff5fae", "#ffd36e", "#9ee7ff", "#cfc2f7", "#ffffff", "#ff8cc6"];
const TILES = ["#ff5fae", "#ffd36e", "#b9a6f0", "#9ee7ff"];

function Head({ n, title }: { n: number; title: string }) {
  return (
    <div data-r className="mb-10 flex items-end gap-4 md:mb-14">
      <span className="dt-neon text-5xl leading-none md:text-7xl" style={{ fontFamily: F.monoton }}>{String(n).padStart(2, "0")}</span>
      <h2 className="pb-1 text-[1.7rem] font-extrabold uppercase leading-none tracking-tight md:text-[2.8rem]" style={{ fontFamily: F.unb }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [spins, setSpins] = useState(0);
  const [name] = nameParts(profile);
  const L = words(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const age = profile.age ?? 30;
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    const tl = gsap.timeline();
    tl.from(q("[data-ball]"), { yPercent: -160, duration: 1.6, ease: "bounce.out" })
      .from(q("[data-num] > span"), { yPercent: 120, opacity: 0, rotate: (i) => (i ? 12 : -12), stagger: 0.12, duration: 1, ease: "back.out(1.8)" }, "-=.7")
      .from(q("[data-name-in]"), { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(2)" }, "-=.5")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }, "-=.4")
      .from(q("[data-flecks]"), { opacity: 0, duration: 1.4 }, 0.8);
    gsap.to(q("[data-num]"), { yPercent: -14, ease: "none", scrollTrigger: { trigger: q("header")[0], start: "top top", end: "bottom top", scrub: true } });
    q("[data-tile]").forEach((t, i) => gsap.from(t, { y: 80, rotate: i % 2 ? 6 : -6, opacity: 0, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: t, start: "top 92%", once: true } }));
  }, [compact]);

  const party = () => {
    const host = root.current;
    const ball = host?.querySelector("[data-ball] svg");
    if (!host || !ball) return;
    setSpins((s) => s + 1);
    gsap.fromTo(ball, { rotate: 0 }, { rotate: 360, duration: 1.4, ease: "power3.out", transformOrigin: "50% 66%" });
    burstFrom(host, ball, { colors: DT_CONFETTI, n: 90, shapes: ["star", "rect", "strip", "circle"], velocity: [400, 950], gravity: 800, size: 11 }, 30);
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`} style={{ ...tplVars("dirty-thirty", theme, design, DT_VARS), fontFamily: F.unb }}>
      <style href="cel-dt" precedence="default">{DT_CSS}</style>

      <header className={`relative flex flex-col items-center overflow-hidden text-center ${compact ? "min-h-[660px] pb-0 pt-0" : "min-h-[100svh]"}`}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_22%,#4a2477_0%,#26113f_45%,var(--t-bg)_85%)]" />
        <div data-flecks className="absolute inset-0 overflow-hidden"><Flecks spin={!compact} count={compact ? 30 : 50} /></div>
        <Grain opacity={0.14} blend="overlay" />

        <button type="button" data-ball onClick={party} aria-label="Disco" className={`relative z-10 cursor-pointer outline-none ${compact ? "-mt-[40px] w-[150px]" : "-mt-[60px] w-[min(46vw,230px)] md:w-[250px]"}`}>
          <div className={compact ? "" : "dt-sway"}><DiscoBall twinkle={!compact} className="w-full" /></div>
        </button>

        <div className="relative flex w-full flex-1 flex-col items-center justify-center px-5 pb-10">
          <div data-num aria-hidden className={`pointer-events-none flex select-none leading-[0.8] ${compact ? "text-[190px]" : "text-[clamp(11rem,46vw,30rem)]"}`} style={{ fontFamily: F.monoton }}>
            {String(age).split("").map((d, i) => <span key={i} className="dt-neon dt-neon-flicker inline-block" style={{ animationDelay: `${i * 1.7}s` }}>{d}</span>)}
          </div>
          <h1 data-name-in className={`relative -mt-[0.35em] font-black uppercase leading-[0.9] tracking-[-0.03em] ${compact ? "text-[54px]" : "text-[clamp(3.2rem,12vw,8.5rem)]"}`} style={{ fontFamily: F.unb }}>
            <E path="profile.partner1" className="dt-chrome">{name}</E>
          </h1>
          <p data-hero-in className={`mt-4 font-light uppercase tracking-[0.3em] text-[var(--t-muted)] ${compact ? "text-[11px]" : "text-xs md:text-sm"}`}>{lineOf(profile)} <Sparkle className="mx-1 inline w-3 text-[var(--t-gold)]" /> {fmt(profile)}</p>
          {!compact && (
            <Countdown date={profile.date}>
              {(d, h) => (
                <div data-hero-in className="mt-8 flex gap-3">
                  {[[d, L.days], [h, L.hours]].map(([v, l], i) => (
                    <div key={i} className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-md"><p className="text-3xl font-bold tabular-nums leading-none">{v}</p><p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[var(--t-muted)]">{l}</p></div>
                  ))}
                </div>
              )}
            </Countdown>
          )}
          {!compact && <p data-hero-in className="mt-6 text-[10px] uppercase tracking-[0.4em] text-[var(--t-accent)]">{spins ? "✦ ✦ ✦" : "↑ tap the ball"}</p>}
        </div>

        {/* marquee ribbon */}
        <div data-hero-in className="relative w-full -rotate-2 overflow-hidden border-y border-white/20 bg-[var(--t-accent)] py-3 text-[#1a0b2a]">
          <div className={compact ? "flex w-max" : "dt-marquee"}>
            {Array.from({ length: 2 }, (_, k) => (
              <div key={k} className="flex shrink-0 items-center">
                {Array.from({ length: 4 }, (_, i) => (
                  <span key={i} className="flex items-center gap-5 pr-5 text-sm font-extrabold uppercase tracking-wide md:text-lg">
                    <span>{dp ? `${dp.weekday} ${dp.dd}.${dp.mm}.${dp.yy}` : birthdayOf(profile)}</span><Sparkle className="w-3.5" />
                    <span>{venue}</span><Sparkle className="w-3.5" />
                    <span>{name} × {age}</span><Sparkle className="w-3.5" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="h-10" />
      </header>

      <Sections
        design={design}
        className="relative mx-auto max-w-6xl px-5 md:px-10"
        render={{
          invitation: (
            <section className="relative py-20 md:py-32">
              <E as="p" multiline path="profile.inviteLine" className="block text-[2rem] font-extrabold uppercase leading-[1.05] tracking-tight md:text-[4.4rem]" style={{ fontFamily: F.unb }}>{profile.inviteLine || occasionInvite(profile)}</E>
              <div data-r className="mt-8 flex items-center gap-3 text-[var(--t-gold)]"><Sparkle className="w-5" /><span className="text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">{L.invited}</span></div>
            </section>
          ),
          story: (profile.story || heroUrl) ? (n) => (
            <section className="relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
              <div>
                <Head n={n} title={L.about} />
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-lg font-light leading-relaxed md:text-xl" style={{ fontFamily: F.unb }}>{profile.story}</E>}
              </div>
              <div data-r="scale" className="relative mx-auto w-[min(80vw,380px)] rotate-3">
                <div className="rounded-[28px] bg-white p-3 pb-14 shadow-[0_40px_80px_-30px_rgba(255,95,174,.6)]">
                  <div className="aspect-square overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#ff5fae,#b9a6f0)]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                  <p className="absolute bottom-4 left-0 right-0 text-center text-2xl text-[#1a0b2a]" style={{ fontFamily: F.caveat }}>{name} ✦ {age}</p>
                </div>
                <DiscoBall string={false} className="absolute -right-8 -top-10 w-24 rotate-12" twinkle={!compact} />
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? (n) => (
            <section className="relative py-20 md:py-28">
              <Head n={n} title={L.details} />
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? `${dp.dd}.${dp.mm}` : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.evening, v: profile.events?.[0]?.time ?? "—", s: profile.events?.[0]?.name ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].map((x, i) => (
                  <div key={i} data-tile className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[28px] p-7 text-[#1a0b2a]" style={{ background: TILES[i], transform: `rotate(${[-1.5, 1, -0.5][i]}deg)` }}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.35em] opacity-70">{x.k}</p>
                    <div>
                      {x.path ? <E as="p" path={x.path} className="block break-words text-[2.4rem] font-black uppercase leading-[0.95] tracking-tight">{x.v}</E> : <p className="text-[2.6rem] font-black uppercase leading-[0.95] tracking-tight">{x.v}</p>}
                      {x.s && <p className="mt-2 text-sm font-medium capitalize opacity-75">{x.s}</p>}
                    </div>
                    <Sparkle className="absolute right-6 top-6 w-6 opacity-60" />
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10"><a href={calendarUrl} className="inline-flex items-center gap-2 rounded-full bg-[var(--t-ink)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--t-bg)] transition hover:scale-105">+ {L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: profile.events?.length ? (n) => (
            <section className="relative py-20 md:py-28">
              <Head n={n} title={L.evening} />
              <ol className="border-t border-white/15">
                {profile.events!.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.08} className="group grid grid-cols-[3.2rem_1fr_auto] items-center gap-4 border-b border-white/15 py-6 transition hover:bg-white/5 md:grid-cols-[5rem_1fr_auto] md:py-8">
                    <span className="text-3xl text-[var(--t-accent)] md:text-5xl" style={{ fontFamily: F.monoton }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-xl font-extrabold uppercase leading-tight tracking-tight md:text-4xl">{e.name}</p>
                      {e.venue && <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[var(--t-muted)]">{e.venue}</p>}
                    </div>
                    <span className="rounded-full border border-white/25 px-3 py-1 text-xs font-bold tabular-nums md:text-sm">{e.time}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? (n) => (
            <section className="relative overflow-hidden py-20 md:py-28">
              <Head n={n} title={L.venue} />
              <div data-r className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#ff5fae_0%,#b9a6f0_55%,#9ee7ff_100%)] p-8 text-[#1a0b2a] md:p-14">
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block break-words text-[3rem] font-black uppercase leading-[0.9] tracking-[-0.03em] md:text-[7rem]">{profile.venue || profile.city}</E>
                {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-sm font-bold uppercase tracking-[0.4em]">{profile.city}</E>}
                <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1a0b2a] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:scale-105">{L.directions} →</a>
                <DiscoBall string={false} twinkle={!compact} className="absolute -bottom-16 -right-12 w-52 opacity-90 md:w-72" />
              </div>
            </section>
          ) : null,
          gallery: gallery.length ? (n) => (
            <section className="relative py-20">
              <Head n={n} title={L.gallery} />
              <div className={`grid grid-cols-2 gap-5 ${compact ? "" : "md:grid-cols-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-tile className="rounded-[20px] bg-white p-2 pb-8 shadow-xl" style={{ transform: `rotate(${((i * 37) % 7) - 3}deg)` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-square w-full rounded-[14px] object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? (n) => (
            <section className="relative py-20">
              <Head n={n} title={L.reply} />
              <div data-r className="rounded-[32px] border border-white/15 bg-white/[.06] p-6 backdrop-blur-xl md:p-12">{children}</div>
            </section>
          ) : null,
          info: info ? (n) => (
            <section className="relative py-20">
              <Head n={n} title={L.info} />
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-lg font-light leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative overflow-hidden px-6 pb-14 pt-16 text-center">
        <p className="dt-neon text-[6rem] leading-none md:text-[10rem]" style={{ fontFamily: F.monoton }}>{age}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-3xl text-[var(--t-gold)]" style={{ fontFamily: F.caveat }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
