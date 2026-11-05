"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { designVars } from "@/lib/themes";
import { formatDate } from "@/lib/profile";
import { BaseCSS } from "../_shared/CardKit";
import { annivFontVars, STACK } from "../_shared/fonts";
import { faceVars, Grain, media, paletteVars, Photo, Sections, standardReveals, useAnniv, useDaysLeft, useLenis, useMotion, yearsWord } from "../_shared/kit";
import { Bubbles, Chevron, CoupeTower, Fan } from "./art";

export const CD_PALETTE = { bg: "#0E0E10", ink: "#F1E6CF", accent: "#D6B36A", muted: "#B3A78E", champagne: "#F3DFA8", panel: "#151517" };
export const CD_FACES = { display: STACK.poiret, script: STACK.vibes, body: STACK.forum, label: STACK.montserrat };
export const ISSUE = { en: "The Decade Issue", ru: "Юбилейный выпуск", hi: "दशक विशेषांक" } as const;

export const CD_CSS = `
.cd{background:radial-gradient(70% 40% at 50% 0%,rgba(214,179,106,.12),transparent 70%),var(--a-bg);color:var(--a-ink);font-family:var(--a-body)}
.cd-gold{background:linear-gradient(100deg,#8f6e2c 0%,#f7e2a8 20%,#b8913f 40%,#fff6d8 55%,#a07a35 75%,#f1d590 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:cd-foil 6s ease-in-out infinite}
@keyframes cd-foil{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.cd-iris{animation:cd-iris 2.4s cubic-bezier(.7,0,.2,1) .2s both}
@keyframes cd-iris{from{clip-path:circle(0% at 50% 45%)}to{clip-path:circle(150% at 50% 45%)}}
.cd-rays{animation:cd-rays 60s linear infinite}
@keyframes cd-rays{to{transform:rotate(360deg)}}
.cd-fill{animation:cd-fill 1.1s cubic-bezier(.3,.7,.3,1) both}
@keyframes cd-fill{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1)}}
.cd-pour{stroke-dashoffset:1;animation:cd-pour 1s ease-in .6s forwards}
@keyframes cd-pour{to{stroke-dashoffset:0}}
.cd-bubble{animation-name:cd-up;animation-timing-function:ease-in;animation-iteration-count:infinite}
@keyframes cd-up{from{transform:translateY(0) translateX(0);opacity:0}15%{opacity:1}to{transform:translateY(-110vh) translateX(20px);opacity:0}}
.cd-rise{animation:cd-rise 1.4s cubic-bezier(.16,1,.3,1) both}
@keyframes cd-rise{from{opacity:0;transform:translateY(24px)}}
.cd-label{font-family:var(--a-label);text-transform:uppercase;letter-spacing:.34em;font-size:11px}
.cd-rule{height:1px;background:linear-gradient(90deg,transparent,var(--a-accent),transparent)}
.cd-btn{display:inline-flex;align-items:center;gap:.7rem;background:var(--a-accent);color:#0e0e10;padding:.95rem 1.8rem;font-family:var(--a-label);letter-spacing:.3em;text-transform:uppercase;font-size:11px;clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,10px 100%,0 50%);transition:filter .3s}
.cd-btn:hover{filter:brightness(1.15)}
.cd-panel{background:var(--a-panel);border:1px solid color-mix(in oklab,var(--a-accent) 45%,transparent);position:relative}
.cd-panel:before{content:"";position:absolute;inset:6px;border:1px solid color-mix(in oklab,var(--a-accent) 18%,transparent);pointer-events:none}
`;

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const A = useAnniv(profile, design);
  const L = A.L;
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  useMotion(root, !compact, (g) => {
    standardReveals(g);
    g.to(".cd-big", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".cd-hero", start: "top top", end: "bottom top", scrub: true } });
    g.to(".cd-tower", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".cd-hero", start: "top top", end: "bottom top", scrub: true } });
    g.utils.toArray<HTMLElement>(".cd-fan").forEach((el) => g.from(el, { scaleY: 0, transformOrigin: "bottom", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
  });

  const head = (kicker: string, title?: string) => (
    <div className="mb-12 text-center" data-rise>
      <Fan className="cd-fan mx-auto w-24 text-[var(--a-accent)]" />
      <p className="cd-label mt-4 text-[var(--a-accent)]">{kicker}</p>
      {title && <p className="an-f-d mt-3 text-[clamp(2rem,6cqw,3.4rem)] leading-tight">{title}</p>}
    </div>
  );

  const sections = {
    invitation: (
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div data-rise><Chevron className="mx-auto w-24 text-[var(--a-accent)]" /></div>
        <E as="p" multiline path="profile.inviteLine" className="an-f-d mt-8 block text-[clamp(1.8rem,5cqw,3rem)] leading-[1.35]">{A.invite}</E>
      </section>
    ),
    story: profile.story && (
      <section className="mx-auto max-w-5xl px-6 py-20">
        {head(L.story, A.since ? `${A.since} — ${A.year}` : undefined)}
        <div className="cd-panel p-8 @md:p-12" data-rise>
          <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[clamp(1.2rem,2.8cqw,1.45rem)] leading-[1.75] first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--a-display)] first-letter:text-[4.4em] first-letter:leading-[.8] first-letter:text-[var(--a-accent)]">{profile.story}</E>
          {A.age && <p className="an-f-s mt-8 text-right text-4xl text-[var(--a-accent)]">{A.age} {yearsWord(A.age, A.lang)}, {L.together}</p>}
        </div>
      </section>
    ),
    details: (profile.date || A.where) && (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid border-y border-[var(--a-accent)]/40 @2xl:grid-cols-3" data-stagger>
          {profile.date && <div className="px-6 py-10 text-center"><p className="cd-label text-[var(--a-muted)]">{L.when}</p><p className="an-f-d mt-3 text-3xl">{A.date}</p></div>}
          {A.where && <div className="border-[var(--a-accent)]/30 px-6 py-10 text-center @2xl:border-x"><p className="cd-label text-[var(--a-muted)]">{L.where}</p><E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d mt-3 block text-3xl">{profile.venue || profile.city}</E></div>}
          {days !== null && days > 0 && <div className="px-6 py-10 text-center"><p className="cd-label text-[var(--a-muted)]">{L.days}</p><p className="cd-gold an-f-d mt-1 text-5xl">{days}</p></div>}
        </div>
      </section>
    ),
    schedule: A.events.length > 0 && (
      <section className="mx-auto max-w-4xl px-6 py-20">
        {head(L.events)}
        <div className="cd-panel divide-y divide-[var(--a-accent)]/25 px-6 @md:px-10" data-stagger>
          {A.events.map((e, i) => (
            <div key={i} className="grid grid-cols-[5.5rem_1fr] items-center gap-5 py-7 @md:grid-cols-[9rem_1fr_auto]">
              <p className="cd-gold an-f-d whitespace-nowrap text-[clamp(1.4rem,3.6cqw,2.2rem)] leading-none">{e.time}</p>
              <div><h3 className="an-f-d text-[clamp(1.5rem,3.6cqw,2rem)]">{e.name}</h3><p className="cd-label mt-2 !text-[10px] text-[var(--a-muted)]">{[formatDate(e.date, profile.language), e.venue].filter(Boolean).join(" · ")}</p></div>
              <p className="an-f-d hidden text-5xl text-[var(--a-accent)]/40 @md:block">{["I", "II", "III", "IV", "V", "VI"][i]}</p>
            </div>
          ))}
        </div>
        {calendarUrl && <div className="mt-10 text-center"><a href={calendarUrl} className="cd-btn">{L.calendar}</a></div>}
      </section>
    ),
    venue: A.where && (
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        {head(L.venue)}
        <div data-rise>
          <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="cd-gold an-f-d block text-[clamp(2.8rem,10cqw,6rem)] leading-[1]">{profile.venue || profile.city}</E>
          {profile.venue && profile.city && <p className="cd-label mt-5 text-[var(--a-muted)]">{profile.city}</p>}
          <a target="_blank" rel="noreferrer" href={A.mapUrl} className="cd-btn mt-10">{L.directions}</a>
        </div>
      </section>
    ),
    gallery: A.gallery.length > 0 && (
      <section className="mx-auto max-w-6xl px-6 py-20">
        {head(L.gallery)}
        <div className="grid grid-cols-2 gap-4 @3xl:grid-cols-4" data-stagger>
          {A.gallery.map((k, i) => <div key={k} className={`cd-panel p-2 ${i % 5 === 0 ? "col-span-2 row-span-2" : ""}`}><Photo src={media(k)} slot="gallery" galleryKey={k} className="h-full w-full object-cover grayscale-[.3] transition duration-700 hover:grayscale-0" /></div>)}
        </div>
      </section>
    ),
    rsvp: children && (
      <section className="mx-auto max-w-xl px-6 py-20">
        {head(L.rsvp, L.reply)}
        <div className="cd-panel px-7 py-10 text-[#0e0e10] @md:px-12" style={{ background: "#f6eedd" }} data-rise>{children}</div>
      </section>
    ),
    info: A.info && (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        {head(L.info)}
        <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed text-[var(--a-muted)]">{A.info}</E>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`cd an-site @container relative overflow-hidden ${annivFontVars}`} style={{ ...designVars(theme, design), ...paletteVars(design, CD_PALETTE), ...faceVars(design, "deco", CD_FACES) }}>
      <BaseCSS />
      <style href="an-cd" precedence="default">{CD_CSS}</style>
      <Grain opacity={0.14} blend="screen" freq={1.1} />

      {/* ── Opening: a deco iris opens on the number; a coupe tower fills from the top ── */}
      <header data-section="intro" className={`cd-hero cd-iris relative overflow-hidden px-6 ${compact ? "pb-16 pt-10" : "flex min-h-[100svh] flex-col pb-14 pt-8"}`}>
        <Bubbles count={compact ? 14 : 30} />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[45%] aspect-square w-[160cqw] -translate-x-1/2 -translate-y-1/2 opacity-[.13]">
          <svg viewBox="0 0 200 200" className="cd-rays h-full w-full text-[var(--a-accent)]">{Array.from({ length: 48 }, (_, i) => <path key={i} d="M100 100 L98.4 0 L101.6 0Z" fill="currentColor" transform={`rotate(${i * 7.5} 100 100)`} />)}</svg>
        </div>
        {/* masthead */}
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between border-b border-[var(--a-accent)]/50 pb-3">
          <span className="cd-label text-[var(--a-muted)]">{A.since ? `${A.since}—${A.year}` : ""}</span>
          <span className="cd-label text-[var(--a-accent)]">{ISSUE[A.lang]}</span>
          <span className="cd-label hidden text-[var(--a-muted)] @md:inline">{A.dateNum}</span>
        </div>
        <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 pt-6 @3xl:grid-cols-[1.25fr_1fr]">
          <div className="relative text-center @3xl:text-left">
            <p className="cd-rise cd-label text-[var(--a-accent)]" style={{ animationDelay: "1.4s" }}>{A.milestone}</p>
            <p className="cd-big cd-gold an-f-d -my-[.06em] text-[clamp(11rem,52cqw,30rem)] leading-[.86] tracking-[-0.04em]">{A.age ?? "∞"}</p>
            <p className="cd-rise an-f-s -mt-2 text-[clamp(2rem,5cqw,3.2rem)] text-[var(--a-champagne)]" style={{ animationDelay: "1.8s" }}>{A.age ? `${yearsWord(A.age, A.lang)} ${L.together}` : A.line}</p>
            <h1 className="cd-rise an-f-d mt-6 text-[clamp(2.8rem,9cqw,5.4rem)] uppercase leading-[.95] tracking-[.06em]" style={{ animationDelay: "2.1s" }}>
              <E path="profile.partner1">{A.a}</E>{A.b && <><span className="an-f-s mx-3 align-middle text-[.6em] normal-case tracking-normal text-[var(--a-accent)]">&amp;</span><E path="profile.partner2">{A.b}</E></>}
            </h1>
            <div className="cd-rise mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 @3xl:justify-start" style={{ animationDelay: "2.4s" }}>
              <span className="cd-label">{A.date}</span>
              {A.where && <><Chevron className="w-6 text-[var(--a-accent)]" /><E path={profile.venue ? "profile.venue" : "profile.city"} className="cd-label text-[var(--a-muted)]">{A.where}</E></>}
            </div>
          </div>
          <div className="cd-tower relative mx-auto mt-14 w-[min(80cqw,440px)] @3xl:mt-0">
            <CoupeTower className="w-full drop-shadow-[0_0_30px_rgba(243,223,168,.25)]" />
          </div>
        </div>
        {heroUrl && (
          <div className="cd-rise relative mx-auto mt-10 w-full max-w-6xl" style={{ animationDelay: "2.6s" }}>
            <div className="cd-panel p-2"><Photo src={heroUrl} className="aspect-[16/7] w-full object-cover grayscale-[.35] contrast-[1.05]" /></div>
          </div>
        )}
      </header>

      <main className="relative">
        <Sections design={design} render={sections} />
      </main>

      <footer className="relative px-6 pb-14 pt-16 text-center">
        <div data-rise>
          <Fan className="mx-auto w-32 text-[var(--a-accent)]" />
          <p className="cd-gold an-f-d mt-4 text-5xl tracking-[.2em]">{A.initials}</p>
          {profile.blessing && <E as="p" path="profile.blessing" className="an-f-s mt-6 block text-4xl text-[var(--a-champagne)]">{profile.blessing}</E>}
          <p className="cd-label mt-4 text-[var(--a-muted)]">{L.forever}</p>
          {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--a-muted)]">{credit}</div>}
        </div>
      </footer>
    </div>
  );
}
