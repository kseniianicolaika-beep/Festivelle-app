"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { designVars } from "@/lib/themes";
import { formatDate } from "@/lib/profile";
import { BaseCSS } from "../_shared/CardKit";
import { annivFontVars, STACK } from "../_shared/fonts";
import { Grain, media, paletteVars, faceVars, Photo, Sections, standardReveals, useAnniv, useDaysLeft, useLenis, useMotion, yearsWord } from "../_shared/kit";
import { Doves, LocketRing, Strand } from "./art";

export const PEARL_PALETTE = { bg: "#F6F1E8", ink: "#2B2723", accent: "#9C8566", paper: "#FBF8F2", muted: "#857B6E", line: "#CDBFA9" };
export const PEARL_FACES = { display: STACK.cormorant, script: STACK.vibes, body: STACK.cormorant, label: STACK.tenor };

export const PEARL_CSS = `
.py{background:var(--a-bg);color:var(--a-ink);font-family:var(--a-body)}
.py-lustre{background:linear-gradient(115deg,#a99878 0%,#f8f3ec 16%,#e8d0d3 28%,#dbe5ea 40%,#fffdf9 50%,#c8b79f 66%,#f1e6de 82%,#a99878 100%);background-size:320% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:py-sheen 11s ease-in-out infinite;filter:drop-shadow(0 1px 0 rgba(255,255,255,.9)) drop-shadow(0 -1px 0 rgba(110,90,60,.22))}
.py-deboss{color:var(--a-bg);text-shadow:-1px -1px 0 rgba(255,255,255,.9),1px 1.5px 1px rgba(120,100,70,.28)}
@keyframes py-sheen{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.py-thread{stroke-dashoffset:1;animation:py-draw 2.2s cubic-bezier(.6,0,.2,1) .1s forwards}
@keyframes py-draw{to{stroke-dashoffset:0}}
.py-pearl{animation:py-pop .9s cubic-bezier(.2,1.6,.4,1) both}
@keyframes py-pop{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
.py-rise{animation:py-rise 1.6s cubic-bezier(.16,1,.3,1) both}
@keyframes py-rise{from{opacity:0;transform:translateY(22px);filter:blur(8px)}to{opacity:1;transform:none;filter:blur(0)}}
.py-ink{animation:py-ink 2.4s cubic-bezier(.7,0,.2,1) both}
@keyframes py-ink{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 -10% 0 0)}}
.py-btn{display:inline-flex;align-items:center;gap:.6rem;border:1px solid var(--a-line);border-radius:999px;padding:.8rem 1.5rem;font-family:var(--a-label);font-size:11px;letter-spacing:.28em;text-transform:uppercase;transition:background .4s,border-color .4s}
.py-btn:hover{background:#fff;border-color:var(--a-accent)}
`;

function Drop({ i }: { i: number }) {
  return (
    <div aria-hidden className="flex flex-col items-center py-2" data-draw="">
      <svg viewBox="0 0 20 90" className="h-20 w-5 text-[var(--a-line)]"><line x1="10" y1="0" x2="10" y2="72" stroke="currentColor" strokeWidth="1" /></svg>
      <span className="py-node -mt-1 block h-3.5 w-3.5 rounded-full shadow-[inset_-2px_-3px_5px_rgba(150,130,100,.35),inset_2px_2px_3px_#fff,0_2px_4px_rgba(90,70,40,.18)]" style={{ background: i % 2 ? "radial-gradient(circle at 35% 30%,#fff,#efe5da 55%,#cdbfaa)" : "radial-gradient(circle at 35% 30%,#fff,#f1e3e2 55%,#c9bcab)" }} />
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const A = useAnniv(profile, design);
  const L = A.L;
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  useMotion(root, !compact, (g) => {
    standardReveals(g);
    g.utils.toArray<HTMLElement>(".py-node").forEach((n) => g.from(n, { scale: 0, autoAlpha: 0, duration: 1, ease: "back.out(2.4)", scrollTrigger: { trigger: n, start: "top 88%", once: true } }));
    g.to(".py-ghost", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".py-hero", start: "top top", end: "bottom top", scrub: true } });
    g.to(".py-strand", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".py-hero", start: "top top", end: "bottom top", scrub: true } });
    const spine = document.querySelector(".py-spine");
    if (spine) g.fromTo(spine, { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: spine.parentElement, start: "top 70%", end: "bottom 70%", scrub: true } });
  });

  const n = A.age;
  const names = (
    <>
      <E as="span" path="profile.partner1" className="block">{A.a}</E>
      {A.b && <span className="an-f-s block py-2 text-[0.42em] leading-none text-[var(--a-accent)]">&amp;</span>}
      {A.b && <E as="span" path="profile.partner2" className="block">{A.b}</E>}
    </>
  );
  const eyebrow = (s: React.ReactNode, cls = "") => <p className={`an-cap text-[10.5px] text-[var(--a-muted)] ${cls}`}>{s}</p>;

  const sections = {
    invitation: (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div data-rise><Doves draw className="mx-auto mb-10 w-64 text-[var(--a-accent)]" /></div>
        <E as="p" multiline path="profile.inviteLine" className="an-f-d block text-[clamp(1.7rem,4.6cqw,2.7rem)] font-light italic leading-[1.45]">{A.invite}</E>
      </section>
    ),
    story: profile.story && (
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid items-center gap-10 @3xl:grid-cols-[1fr_1.3fr] @3xl:gap-16">
          <div className="text-center @3xl:text-right" data-rise>
            {eyebrow(L.story)}
            {A.since && <p className="py-lustre an-f-d mt-4 text-[clamp(5rem,20cqw,11rem)] font-light leading-[.85]">{A.since}</p>}
            {A.since && <p className="an-f-s mt-2 text-3xl text-[var(--a-accent)]">{L.since} {A.since}</p>}
          </div>
          <div data-rise className="relative">
            <p aria-hidden className="an-f-s absolute -left-2 -top-10 text-7xl text-[var(--a-line)]">“</p>
            <E as="p" multiline path="profile.story" className="an-f-d block whitespace-pre-line text-[clamp(1.35rem,3.4cqw,1.9rem)] leading-[1.6]">{profile.story}</E>
          </div>
        </div>
        {A.since && A.year && (
          <div className="relative mx-auto mt-16 grid max-w-3xl grid-cols-3 text-center" data-stagger>
            <div aria-hidden className="absolute left-[16%] right-[16%] top-[7px] h-px bg-[var(--a-line)]" />
            {[[A.since, L.married], [n, yearsWord(n, A.lang) + " " + L.together], [A.year, L.anniversary]].map(([v, l], i) => (
              <div key={i} className="relative flex flex-col items-center">
                <span className="py-node block h-4 w-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#efe5da_55%,#c7b8a2)] shadow-[0_2px_5px_rgba(90,70,40,.25)]" />
                <p className="an-f-d mt-4 text-4xl font-light">{v}</p>
                <p className="an-cap mt-1 text-[9.5px] text-[var(--a-muted)]">{l}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    ),
    details: (profile.date || A.where) && (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid border-y border-[var(--a-line)] @2xl:grid-cols-2" data-stagger>
          {profile.date && (
            <div className="px-6 py-10 text-center @2xl:border-r @2xl:border-[var(--a-line)]">
              {eyebrow(L.when)}
              <p className="an-f-d mt-4 text-[clamp(2rem,5cqw,2.8rem)] font-light">{A.date}</p>
              {A.events[0]?.time && <p className="mt-1 text-[var(--a-muted)]">{A.events[0].time}</p>}
              {days !== null && days > 0 && <p className="an-cap mt-5 text-[10px] text-[var(--a-accent)]">{days} {L.days}</p>}
            </div>
          )}
          {A.where && (
            <div className="px-6 py-10 text-center">
              {eyebrow(L.where)}
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d mt-4 block text-[clamp(2rem,5cqw,2.8rem)] font-light">{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-1 block text-[var(--a-muted)]">{profile.city}</E>}
            </div>
          )}
        </div>
      </section>
    ),
    schedule: A.events.length > 0 && (
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center" data-rise>{eyebrow(L.events)}<p className="an-f-s mt-3 text-5xl text-[var(--a-accent)]">{A.milestone}</p></div>
        <div className="relative mt-14">
          <div aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-[var(--a-line)]/50 @3xl:left-1/2" />
          <div aria-hidden className="py-spine absolute bottom-0 left-[11px] top-0 w-px origin-top bg-[var(--a-accent)] @3xl:left-1/2" />
          {A.events.map((e, i) => (
            <div key={i} className={`relative mb-14 pl-12 @3xl:w-1/2 @3xl:pl-0 ${i % 2 ? "@3xl:ml-auto @3xl:pl-14" : "@3xl:pr-14 @3xl:text-right"}`} data-rise>
              <span className={`py-node absolute top-2 left-[3px] block h-[17px] w-[17px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#f0e2e0_50%,#c6b8a3)] shadow-[0_2px_6px_rgba(90,70,40,.3)] ${i % 2 ? "@3xl:left-[-8.5px]" : "@3xl:left-auto @3xl:right-[-8.5px]"}`} />
              <p className="an-cap text-[10px] text-[var(--a-accent)]">{[e.time, formatDate(e.date, profile.language)].filter(Boolean).join(" · ")}</p>
              <h3 className="an-f-d mt-2 text-[2.4rem] font-light leading-tight">{e.name}</h3>
              {e.venue && <p className="mt-1 text-[1.05rem] italic text-[var(--a-muted)]">{e.venue}</p>}
            </div>
          ))}
        </div>
        {calendarUrl && <div className="text-center" data-rise><a href={calendarUrl} className="py-btn">◦ {L.calendar}</a></div>}
      </section>
    ),
    venue: A.where && (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center" data-rise>
        {eyebrow(L.venue)}
        <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d mt-5 block text-[clamp(2.6rem,8cqw,4.6rem)] font-light italic leading-none">{profile.venue || profile.city}</E>
        {profile.venue && profile.city && <p className="an-cap mt-4 text-[11px] text-[var(--a-muted)]">{profile.city}</p>}
        <a target="_blank" rel="noreferrer" href={A.mapUrl} className="py-btn mt-8">{L.directions} →</a>
      </section>
    ),
    gallery: A.gallery.length > 0 && (
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center" data-rise>{eyebrow(L.gallery)}</div>
        <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4" data-stagger>
          {A.gallery.map((k, i) => (
            <div key={k} className={`relative ${i % 2 ? "@3xl:mt-16" : ""}`}>
              <div className="overflow-hidden rounded-[50%] p-[5px] shadow-[0_0_0_1px_var(--a-line),0_30px_50px_-30px_rgba(80,60,30,.5)]" style={{ background: "radial-gradient(circle at 30% 20%,#fff,#efe6da)" }}>
                <Photo src={media(k)} slot="gallery" galleryKey={k} className="aspect-[3/4] w-full rounded-[50%] object-cover sepia-[.12] transition duration-700 hover:sepia-0" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    rsvp: children && (
      <section className="mx-auto max-w-xl px-6 py-20">
        <div className="relative bg-[var(--a-paper)] px-7 pb-10 pt-16 shadow-[0_40px_90px_-50px_rgba(80,60,30,.5),0_0_0_1px_rgba(160,140,110,.25)] @md:px-12" data-rise>
          <Strand count={17} width={600} sag={46} r={9} animate={false} className="absolute -top-5 left-1/2 w-[84%] -translate-x-1/2" />
          <div className="mb-8 text-center">{eyebrow(L.rsvp)}<p className="an-f-d mt-3 text-3xl font-light italic">{L.reply}</p></div>
          {children}
        </div>
      </section>
    ),
    info: A.info && (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center" data-rise>
        {eyebrow(L.info)}
        <E as="p" multiline path="texts.body" className="an-f-d mt-5 block whitespace-pre-line text-xl leading-relaxed text-[var(--a-muted)]">{A.info}</E>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`py an-site @container relative overflow-hidden ${annivFontVars}`} style={{ ...designVars(theme, design), ...paletteVars(design, PEARL_PALETTE), ...faceVars(design, "classic", PEARL_FACES) }}>
      <BaseCSS />
      <style href="an-pearl" precedence="default">{PEARL_CSS}</style>
      <Grain opacity={0.28} />

      {/* ── Opening: the strand is threaded, pearl by pearl, then the names are written in ink ── */}
      <header data-section="intro" className={`py-hero relative flex flex-col items-center justify-center overflow-hidden px-6 ${compact ? "min-h-[680px] pb-16 pt-36" : "min-h-[100svh] pb-20 pt-[clamp(8rem,22cqw,15rem)]"}`}>
        <div className="py-strand absolute -top-2 left-1/2 w-[max(100%,820px)] -translate-x-1/2"><Strand count={n && n <= 60 ? n : 30} width={1400} sag={150} r={13} className="w-full" /></div>
        <p aria-hidden className="py-ghost py-deboss an-f-d pointer-events-none absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 @3xl:left-[68%] @3xl:top-[52%] select-none text-[clamp(16rem,62cqw,44rem)] font-light italic leading-none opacity-80">{n ?? "∞"}</p>
        <div className="relative grid w-full max-w-6xl items-center gap-10 @3xl:grid-cols-[0.9fr_1.1fr] @3xl:gap-16">
          <div className="py-rise relative mx-auto w-[min(52cqw,300px)] @3xl:w-[min(34cqw,420px)]" style={{ animationDelay: "1.2s" }}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[50%] shadow-[0_50px_80px_-40px_rgba(60,40,20,.55)]">
              <Photo src={heroUrl} className="h-full w-full object-cover sepia-[.15] saturate-[.85]" fallback={<div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_40%_35%,#fff,#efe6da)]"><Doves className="w-2/3 text-[var(--a-accent)]" /></div>} />
              <div className="pointer-events-none absolute inset-0 rounded-[50%] shadow-[inset_0_0_40px_rgba(246,241,232,.9)]" />
            </div>
            <LocketRing className="pointer-events-none absolute -inset-[7%] h-[114%] w-[114%]" rx={180} ry={240} r={6.5} count={52} />
          </div>
          <div className="relative text-center @3xl:text-left">
            <p className="py-rise an-cap text-[11px] text-[var(--a-accent)]" style={{ animationDelay: "1.6s" }}>{A.milestone}</p>
            <h1 className="py-ink an-f-d mt-6 text-[clamp(3.6rem,13cqw,8.4rem)] font-light leading-[.92] tracking-[-0.02em]" style={{ animationDelay: "1.9s" }}>{names}</h1>
            <p className="py-rise an-f-s mt-6 text-[clamp(1.7rem,4cqw,2.4rem)] text-[var(--a-accent)]" style={{ animationDelay: "2.6s" }}>{A.line}</p>
            <div className="py-rise mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 @3xl:justify-start" style={{ animationDelay: "2.9s" }}>
              {A.date && <p className="an-f-d text-xl @md:text-2xl">{A.date}</p>}
              {A.date && A.where && <span className="h-1.5 w-1.5 rounded-full bg-[var(--a-line)]" />}
              {A.where && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d block text-xl italic text-[var(--a-muted)] @md:text-2xl">{A.where}</E>}
            </div>
            {days !== null && days > 0 && <p className="py-rise an-cap mt-6 inline-block rounded-full border border-[var(--a-line)] px-5 py-2 text-[10px] text-[var(--a-muted)]" style={{ animationDelay: "3.2s" }}><span className="an-f-d mr-2 text-lg normal-case tracking-normal text-[var(--a-ink)]">{days}</span>{L.days}</p>}
          </div>
        </div>
      </header>

      <main className="relative">
        <Sections design={design} render={sections} wrap={(id, node, i) => <>{i > 0 && <Drop i={i} />}{node}</>} />
      </main>

      <footer className="relative px-6 pb-16 pt-10 text-center">
        <div className="relative mx-auto h-36 w-36" data-rise>
          <LocketRing animate={false} rx={60} ry={60} r={5} count={30} className="absolute inset-0 h-full w-full" />
          <p className="an-f-d absolute inset-0 flex items-center justify-center text-4xl font-light italic">{A.initials.split("").join(" · ")}</p>
        </div>
        {profile.blessing && <E as="p" path="profile.blessing" className="an-f-s mt-8 block text-4xl text-[var(--a-accent)]">{profile.blessing}</E>}
        <p className="an-cap mt-4 text-[10px] text-[var(--a-muted)]">{L.forever}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--a-muted)]">{credit}</div>}
      </footer>
    </div>
  );
}
