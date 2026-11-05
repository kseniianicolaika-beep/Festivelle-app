"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { designVars } from "@/lib/themes";
import { formatDate } from "@/lib/profile";
import { BaseCSS } from "../_shared/CardKit";
import { annivFontVars, STACK } from "../_shared/fonts";
import { faceVars, Grain, media, paletteVars, Photo, Sections, standardReveals, useAnniv, useDaysLeft, useLenis, useMotion, yearsWord } from "../_shared/kit";
import { Flake, Grove, Snow } from "./art";

export const SB_PALETTE = { bg: "#EDF1F5", ink: "#1E2A38", accent: "#5E7A96", paper: "#FBFCFD", muted: "#6A7B8E", line: "#C3CED9" };
export const SB_FACES = { display: STACK.alice, script: STACK.marck, body: STACK.cormorant, label: STACK.cormsc };
export const DEAR = { en: "Dear friends,", ru: "Дорогие друзья,", hi: "प्रिय मित्रों," } as const;

export const SB_CSS = `
.sb{background:linear-gradient(180deg,#f6f8fa,var(--a-bg) 40%,#e6ebf0);color:var(--a-ink);font-family:var(--a-body)}
.sb-silver{background:linear-gradient(105deg,#6f7f90 0%,#dfe6ed 18%,#8d9cab 34%,#ffffff 50%,#9aa8b6 66%,#e8eef3 82%,#6f7f90 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sb-foil 9s ease-in-out infinite;filter:drop-shadow(0 1px 0 rgba(255,255,255,.9)) drop-shadow(0 2px 3px rgba(30,42,56,.18))}
@keyframes sb-foil{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.sb-grow{animation:sb-grow 2.6s cubic-bezier(.16,1,.3,1) both}
@keyframes sb-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.sb-snow{animation-name:sb-fall;animation-timing-function:linear;animation-iteration-count:infinite}
@keyframes sb-fall{from{transform:translate3d(0,-5vh,0)}50%{transform:translate3d(18px,50vh,0)}to{transform:translate3d(-6px,105vh,0)}}
.sb-unfold{transform-origin:top center;animation:sb-unfold 2.2s cubic-bezier(.2,.8,.2,1) .2s both}
@keyframes sb-unfold{from{transform:perspective(1400px) rotateX(-88deg);opacity:0}40%{opacity:1}to{transform:perspective(1400px) rotateX(0)}}
.sb-flap{transform-origin:bottom center;animation:sb-flap 1.6s cubic-bezier(.6,0,.3,1) .1s both}
@keyframes sb-flap{from{transform:perspective(1400px) rotateX(0)}to{transform:perspective(1400px) rotateX(-180deg);opacity:0}}
.sb-rise{animation:sb-rise 1.6s cubic-bezier(.16,1,.3,1) both}
@keyframes sb-rise{from{opacity:0;transform:translateY(16px);filter:blur(6px)}}
.sb-deboss{text-shadow:0 1px 0 rgba(255,255,255,.95),0 -1px 0 rgba(30,42,56,.15)}
.sb-btn{display:inline-flex;align-items:center;gap:.6rem;border-bottom:1px solid var(--a-accent);padding:.4rem .2rem;font-family:var(--a-label);letter-spacing:.24em;text-transform:uppercase;font-size:13px;color:var(--a-accent);transition:letter-spacing .4s}
.sb-btn:hover{letter-spacing:.32em}
.sb-dots{flex:1;border-bottom:1px dotted var(--a-line);transform:translateY(-.35em);margin:0 .8rem}
`;

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const A = useAnniv(profile, design);
  const L = A.L;
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  useMotion(root, !compact, (g) => {
    standardReveals(g);
    g.to(".sb-grove-l", { yPercent: -12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true } });
    g.to(".sb-grove-r", { yPercent: -22, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true } });
    g.to(".sb-num", { yPercent: 20, autoAlpha: 0.4, ease: "none", scrollTrigger: { trigger: ".sb-hero", start: "top top", end: "bottom top", scrub: true } });
  });

  const head = (t: string) => <div className="mb-10 flex items-center justify-center gap-4 text-[var(--a-accent)]" data-rise><span className="h-px w-12 bg-[var(--a-line)]" /><Flake className="w-5" /><p className="an-cap text-[13px]">{t}</p><Flake className="w-5" /><span className="h-px w-12 bg-[var(--a-line)]" /></div>;

  const sections = {
    invitation: (
      <section className="px-6 py-20 @3xl:px-10">
        <div className="mx-auto max-w-2xl" data-rise>
          <p className="an-f-s text-[clamp(2rem,6cqw,3rem)] text-[var(--a-accent)]">{DEAR[A.lang]}</p>
          <E as="p" multiline path="profile.inviteLine" className="an-f-d mt-6 block text-[clamp(1.5rem,4cqw,2.2rem)] leading-[1.55]">{A.invite}</E>
        </div>
      </section>
    ),
    story: profile.story && (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          {head(L.story)}
          <div data-rise>
            <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[clamp(1.3rem,3.2cqw,1.65rem)] leading-[1.75] first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--a-display)] first-letter:text-[3.6em] first-letter:leading-[.85] first-letter:text-[var(--a-accent)]">{profile.story}</E>
            <p className="an-f-s mt-8 text-right text-4xl text-[var(--a-accent)]">{A.a}{A.b ? ` & ${A.b}` : ""}</p>
            {A.since && <p className="an-cap mt-2 text-right text-[12px] text-[var(--a-muted)]">{A.since} — {A.year} · {A.age} {yearsWord(A.age, A.lang)}</p>}
          </div>
        </div>
      </section>
    ),
    details: (profile.date || A.where) && (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {head(L.details)}
          <div className="grid gap-px bg-[var(--a-line)] @2xl:grid-cols-2" data-stagger>
            {profile.date && <div className="bg-[var(--a-paper)] px-8 py-10 text-center"><p className="an-cap text-[12px] text-[var(--a-muted)]">{L.when}</p><p className="an-f-d mt-3 text-[clamp(1.7rem,4.4cqw,2.3rem)]">{A.date}</p>{days !== null && days > 0 && <p className="an-f-s mt-2 text-2xl text-[var(--a-accent)]">{days} {L.days}</p>}</div>}
            {A.where && <div className="bg-[var(--a-paper)] px-8 py-10 text-center"><p className="an-cap text-[12px] text-[var(--a-muted)]">{L.where}</p><E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d mt-3 block text-[clamp(1.7rem,4.4cqw,2.3rem)]">{profile.venue || profile.city}</E>{profile.venue && profile.city && <E as="p" path="profile.city" className="an-f-s mt-2 block text-2xl text-[var(--a-accent)]">{profile.city}</E>}</div>}
          </div>
        </div>
      </section>
    ),
    schedule: A.events.length > 0 && (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          {head(L.events)}
          <ul data-stagger>
            {A.events.map((e, i) => (
              <li key={i} className="py-4">
                <div className="flex items-baseline"><span className="an-f-d text-[clamp(1.4rem,3.6cqw,1.9rem)]">{e.name}</span><span className="sb-dots" /><span className="an-f-d text-[clamp(1.3rem,3.4cqw,1.7rem)] text-[var(--a-accent)]">{e.time}</span></div>
                <p className="an-cap mt-1 text-[11.5px] text-[var(--a-muted)]">{[formatDate(e.date, profile.language), e.venue].filter(Boolean).join(" · ")}</p>
              </li>
            ))}
          </ul>
          {calendarUrl && <div className="mt-8 text-center"><a href={calendarUrl} className="sb-btn">❄ {L.calendar}</a></div>}
        </div>
      </section>
    ),
    venue: A.where && (
      <section className="px-6 py-16 text-center">
        {head(L.venue)}
        <div data-rise>
          <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="sb-silver an-f-d block text-[clamp(2.4rem,8cqw,4.6rem)] leading-[1.1]">{profile.venue || profile.city}</E>
          {profile.venue && profile.city && <p className="an-f-s mt-3 text-3xl text-[var(--a-accent)]">{profile.city}</p>}
          <a target="_blank" rel="noreferrer" href={A.mapUrl} className="sb-btn mt-8">{L.directions} →</a>
        </div>
      </section>
    ),
    gallery: A.gallery.length > 0 && (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          {head(L.gallery)}
          <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-3" data-stagger>
            {A.gallery.map((k) => <div key={k} className="bg-white p-2 shadow-[0_20px_40px_-25px_rgba(30,42,56,.5)]"><Photo src={media(k)} slot="gallery" galleryKey={k} className="aspect-[4/5] w-full object-cover grayscale-[.25]" /></div>)}
          </div>
        </div>
      </section>
    ),
    rsvp: children && (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl">
          {head(L.rsvp)}
          <div className="relative bg-white px-7 py-10 shadow-[0_30px_70px_-40px_rgba(30,42,56,.55)] @md:px-12" data-rise>
            <p className="an-f-s mb-8 text-center text-3xl text-[var(--a-accent)]">{L.reply}</p>
            {children}
          </div>
        </div>
      </section>
    ),
    info: A.info && (
      <section className="px-6 py-16 text-center">
        {head(L.info)}
        <E as="p" multiline path="texts.body" className="mx-auto block max-w-2xl whitespace-pre-line text-xl leading-relaxed text-[var(--a-muted)]">{A.info}</E>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`sb an-site @container relative overflow-hidden ${annivFontVars}`} style={{ ...designVars(theme, design), ...paletteVars(design, SB_PALETTE), ...faceVars(design, "playfair", SB_FACES) }}>
      <BaseCSS />
      <style href="an-sb" precedence="default">{SB_CSS}</style>
      <Grain opacity={0.18} />
      {/* birch groves framing the letter on wide screens */}
      <div aria-hidden className="sb-grove-l pointer-events-none absolute left-0 top-[60svh] hidden h-[160svh] w-[18cqw] opacity-60 @5xl:block"><Grove count={3} seed={11} spread={300} h={1400} animate={false} className="h-full w-full" /></div>
      <div aria-hidden className="sb-grove-r pointer-events-none absolute right-0 top-[90svh] hidden h-[160svh] w-[18cqw] opacity-60 @5xl:block"><Grove count={3} seed={29} spread={300} h={1400} animate={false} className="h-full w-full" /></div>

      {/* ── Opening: the letter unfolds; birches grow from the snow; silver 25 appears like frost ── */}
      <header data-section="intro" className={`sb-hero relative flex flex-col items-center justify-end overflow-hidden ${compact ? "min-h-[720px]" : "min-h-[100svh]"}`}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_10%,#fff,transparent_70%)]" />
        <Grove count={9} seed={7} h={700} spread={1400} animate className="absolute inset-x-0 bottom-0 h-[78%] w-full opacity-90" />
        <Snow count={compact ? 24 : 60} animate />
        <div className="relative z-[2] mb-[8svh] w-[min(88cqw,560px)]">
          <div className="sb-unfold relative bg-[var(--a-paper)]/95 px-[clamp(1.6rem,7cqw,3.4rem)] pb-10 pt-10 text-center shadow-[0_40px_80px_-40px_rgba(30,42,56,.55)] backdrop-blur-sm">
            {!compact && <div aria-hidden className="sb-flap absolute inset-x-0 top-0 h-1/2 bg-[var(--a-paper)] shadow-[0_-1px_0_var(--a-line)_inset]" />}
            <div className="absolute inset-3 border border-[var(--a-line)]" />
            <p className="sb-rise an-cap relative text-[12px] text-[var(--a-accent)]" style={{ animationDelay: "1.6s" }}>{A.milestone}</p>
            <p className="sb-num sb-silver an-f-d relative mt-2 text-[clamp(6rem,30cqw,10rem)] leading-[.95]">{A.age ?? "❄"}</p>
            <h1 className="sb-rise an-f-d relative mt-2 text-[clamp(2.1rem,7cqw,3.4rem)] leading-[1.1]" style={{ animationDelay: "2.1s" }}>
              <E path="profile.partner1">{A.a}</E>{A.b && <><span className="an-f-s mx-3 text-[var(--a-accent)]">{A.lang === "ru" ? "и" : "&"}</span><E path="profile.partner2">{A.b}</E></>}
            </h1>
            <p className="sb-rise an-f-s relative mt-3 text-[clamp(1.5rem,4.2cqw,2rem)] text-[var(--a-accent)]" style={{ animationDelay: "2.4s" }}>{A.line}</p>
            <div className="sb-rise relative mt-5 flex items-center justify-center gap-3 text-[var(--a-muted)]" style={{ animationDelay: "2.7s" }}><span className="h-px w-10 bg-current opacity-40" /><Flake className="w-4" /><span className="h-px w-10 bg-current opacity-40" /></div>
            <p className="sb-rise an-f-d relative mt-3 text-xl" style={{ animationDelay: "2.8s" }}>{A.date}</p>
            {A.where && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="sb-rise an-cap relative mt-1 block text-[12px] text-[var(--a-muted)]" style={{ animationDelay: "2.9s" }}>{[profile.venue, profile.city].filter(Boolean).join(", ")}</E>}
          </div>
        </div>
      </header>

      <main className="relative">
        {heroUrl && (
          <div className="mx-auto -mt-2 max-w-3xl px-6 pt-12" data-rise>
            <div className="bg-white p-3 shadow-[0_30px_60px_-35px_rgba(30,42,56,.6)]"><Photo src={heroUrl} className="aspect-[16/10] w-full object-cover grayscale-[.2]" /></div>
          </div>
        )}
        <Sections design={design} render={sections} />
      </main>

      <footer className="relative overflow-hidden px-6 pb-14 pt-20 text-center">
        <Grove count={7} seed={41} h={400} spread={1400} animate={false} className="absolute inset-x-0 bottom-0 h-full w-full opacity-30" />
        <div className="relative" data-rise>
          <p className="sb-silver an-f-d text-6xl">{A.initials.split("").join(" · ")}</p>
          {profile.blessing && <E as="p" path="profile.blessing" className="an-f-s mt-6 block text-3xl text-[var(--a-accent)]">{profile.blessing}</E>}
          <p className="an-cap mt-4 text-[12px] text-[var(--a-muted)]">{L.forever}</p>
          {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--a-muted)]">{credit}</div>}
        </div>
      </footer>
    </div>
  );
}
