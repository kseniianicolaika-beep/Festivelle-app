"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { designVars } from "@/lib/themes";
import { formatDate } from "@/lib/profile";
import { BaseCSS } from "../_shared/CardKit";
import { annivFontVars, STACK } from "../_shared/fonts";
import { faceVars, Grain, media, numeral, paletteVars, Photo, Sections, standardReveals, useAnniv, useDaysLeft, useLenis, useMotion, yearsWord } from "../_shared/kit";
import { Diya, GoldDust, JAALI, Jharokha, Palace, Surya, Toran } from "./art";

export const GOLD_PALETTE = { bg: "#40090F", ink: "#F8E9C8", accent: "#E2B356", deep: "#22050A", muted: "#DDBF95", marigold: "#F2A93B", ivory: "#FBF1DE" };
export const GOLD_FACES = { display: STACK.yeseva, script: STACK.cormorant, body: STACK.cormorant, label: STACK.cormsc };

export const GOLD_CSS = `
.gj{background:radial-gradient(90% 60% at 50% 0%,#6a1520,transparent 70%),linear-gradient(180deg,var(--a-bg),var(--a-deep));background-color:var(--a-bg);color:var(--a-ink);font-family:var(--a-body)}
.gj-gold{background:linear-gradient(100deg,#a8741f 0%,#fbe3a2 20%,#c8912f 40%,#fff3c9 55%,#b07a22 75%,#f6d488 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gj-foil 7s ease-in-out infinite}
@keyframes gj-foil{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.gj-sway{transform-box:view-box;animation:gj-sway 5s ease-in-out infinite alternate}
@keyframes gj-sway{from{transform:rotate(-2.2deg)}to{transform:rotate(2.2deg)}}
.gj-flame{animation:gj-flame 1.6s ease-in-out infinite alternate}
@keyframes gj-flame{0%{transform:scale(1,1) skewX(0)}30%{transform:scale(.92,1.08) skewX(3deg)}60%{transform:scale(1.04,.95) skewX(-2deg)}100%{transform:scale(.96,1.05) skewX(1deg)}}
.gj-glow{animation:gj-glow 2.2s ease-in-out infinite alternate}
@keyframes gj-glow{from{opacity:.65}to{opacity:1}}
.gj-win{animation:gj-win 4s ease-in-out infinite alternate}
@keyframes gj-win{from{opacity:.55}to{opacity:.95}}
.gj-spin{animation:gj-spin 90s linear infinite}
@keyframes gj-spin{to{transform:rotate(360deg)}}
.gj-door-l{transform-origin:left center;animation:gj-dl 2.8s cubic-bezier(.6,0,.2,1) .7s both}
.gj-door-r{transform-origin:right center;animation:gj-dr 2.8s cubic-bezier(.6,0,.2,1) .7s both}
@keyframes gj-dl{80%{opacity:1}to{transform:perspective(1800px) rotateY(-100deg);opacity:0}}
@keyframes gj-dr{80%{opacity:1}to{transform:perspective(1800px) rotateY(100deg);opacity:0}}
.gj-doors{animation:gj-hide 0s linear 3.6s both}
@keyframes gj-hide{to{visibility:hidden}}
.gj-rise{animation:gj-rise 1.8s cubic-bezier(.16,1,.3,1) both}
@keyframes gj-rise{from{opacity:0;transform:translateY(24px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
.gj-sun{animation:gj-sun 2.6s cubic-bezier(.16,1,.3,1) 1.4s both}
@keyframes gj-sun{from{opacity:0;transform:scale(.5) rotate(-40deg)}to{opacity:1;transform:none}}
.gj-btn{display:inline-flex;align-items:center;gap:.7rem;border:1px solid var(--a-accent);border-radius:999px 999px 6px 6px;padding:.9rem 1.8rem .8rem;font-family:var(--a-label);letter-spacing:.26em;text-transform:uppercase;font-size:12px;transition:background .4s,color .4s}
.gj-btn:hover{background:var(--a-accent);color:var(--a-deep)}
.gj-orn{display:flex;align-items:center;justify-content:center;gap:12px;color:var(--a-accent)}
.gj-orn:before,.gj-orn:after{content:"";height:1px;width:70px;background:linear-gradient(90deg,transparent,currentColor)}
.gj-orn:after{transform:scaleX(-1)}
`;

const Lotus = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 20" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth=".9"><path d="M20 18 C14 12 14 6 20 1 C26 6 26 12 20 18 Z M20 18 C12 16 7 11 6 6 C12 6 17 10 20 18 Z M20 18 C28 16 33 11 34 6 C28 6 23 10 20 18 Z M2 18 H38" /></svg>
);

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const A = useAnniv(profile, design);
  const L = A.L;
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  useMotion(root, !compact, (g) => {
    standardReveals(g);
    g.to(".gj-palace", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".gj-hero", start: "top top", end: "bottom top", scrub: true } });
    g.to(".gj-hero-arch", { scale: 1.08, autoAlpha: 0.3, ease: "none", scrollTrigger: { trigger: ".gj-hero", start: "center center", end: "bottom top", scrub: true } });
    g.utils.toArray<HTMLElement>(".gj-arch-in").forEach((el) => g.from(el, { clipPath: "inset(100% 0 0 0)", duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }));
  });

  const n = A.age ? numeral(A.age, A.lang, true) : "";
  const head = (t: string) => <div className="mb-12 text-center" data-rise><Lotus className="mx-auto w-10 text-[var(--a-accent)]" /><p className="an-cap mt-3 text-[12.5px] text-[var(--a-muted)]">{t}</p></div>;
  const archPhoto = (src: string | null | undefined, slot: "hero" | "gallery", key?: string, cls = "") => (
    <div className={`gj-arch-in relative ${cls}`}>
      <div className="absolute inset-[5%_5%_2.5%] overflow-hidden rounded-t-[50%_32%]">
        <Photo src={src} slot={slot} galleryKey={key} className="h-full w-full object-cover" fallback={<div className="h-full w-full" style={{ backgroundImage: JAALI(), backgroundColor: "#2a070b" }} />} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#40090f]/60 via-transparent to-transparent" />
      </div>
      <Jharokha className="relative block h-full w-full" />
    </div>
  );

  const sections = {
    invitation: (
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-14 @3xl:grid-cols-[0.8fr_1.2fr]">
          {archPhoto(heroUrl, "hero", undefined, "mx-auto aspect-[3/4.3] w-[min(78cqw,400px)]")}
          <div className="text-center @3xl:text-left" data-rise>
            <p className="an-cap text-[12px] text-[var(--a-accent)]">{L.invite}</p>
            <E as="p" multiline path="profile.inviteLine" className="an-f-b mt-6 block text-[clamp(1.7rem,4.4cqw,2.7rem)] italic leading-[1.4]">{A.invite}</E>
            <div className="gj-orn mt-8 @3xl:justify-start"><Lotus className="w-8" /></div>
          </div>
        </div>
      </section>
    ),
    story: profile.story && (
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        {head(L.story)}
        {A.since && <p className="gj-gold an-f-d text-[clamp(3.4rem,13cqw,7.5rem)] leading-none" data-rise>{numeral(A.since, A.lang, true)} <span className="an-f-s align-middle text-[.4em] italic text-[var(--a-muted)]">—</span> {numeral(A.year ?? "", A.lang, true)}</p>}
        <E as="p" multiline path="profile.story" className="mx-auto mt-10 block max-w-2xl whitespace-pre-line text-[clamp(1.35rem,3.2cqw,1.8rem)] leading-[1.65]" >{profile.story}</E>
        {A.age && <p className="an-cap mt-8 text-[12px] text-[var(--a-accent)]" data-rise>{n} {yearsWord(A.age, A.lang)} · {L.together}</p>}
      </section>
    ),
    details: (profile.date || A.where) && (
      <section className="mx-auto max-w-4xl px-6 py-20">
        {head(L.details)}
        <div className="grid gap-8 @2xl:grid-cols-2" data-stagger>
          {[[L.when, A.date, A.events[0]?.time, "date"], [L.where, profile.venue || profile.city, profile.venue ? profile.city : "", "where"]].filter((x) => x[1]).map(([k, v, sub, t]) => (
            <div key={t} className="relative rounded-t-[999px] border border-[var(--a-accent)]/60 bg-[#2a070b]/50 px-8 pb-10 pt-20 text-center" style={{ backgroundImage: JAALI("#e2b356", 0.08) }}>
              <p className="an-cap text-[12px] text-[var(--a-muted)]">{k}</p>
              {t === "where" ? <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d mt-4 block text-[clamp(1.8rem,4.5cqw,2.5rem)] leading-tight">{v}</E> : <p className="an-f-d mt-4 text-[clamp(1.8rem,4.5cqw,2.5rem)] leading-tight">{v}</p>}
              {sub && <p className="mt-2 text-lg text-[var(--a-muted)]">{sub}</p>}
            </div>
          ))}
        </div>
        {days !== null && days > 0 && <p className="an-cap mt-10 text-center text-[12px] text-[var(--a-accent)]">{days} {L.days}</p>}
      </section>
    ),
    schedule: A.events.length > 0 && (
      <section className="mx-auto max-w-6xl px-6 py-20">
        {head(L.events)}
        <div className="grid gap-10 @3xl:grid-cols-3" data-stagger>
          {A.events.map((e, i) => (
            <div key={i} className="relative mx-auto w-full max-w-[340px]">
              <Jharokha className="absolute inset-0 h-full w-full" fill="rgba(34,5,10,.55)" />
              <div className="relative px-8 pb-10 pt-28 text-center">
                <p className="gj-gold an-f-d text-4xl">{e.time ?? ""}</p>
                <h3 className="an-f-d mt-4 text-[1.9rem] leading-tight">{e.name}</h3>
                <p className="mt-3 text-lg italic text-[var(--a-muted)]">{[formatDate(e.date, profile.language), e.venue].filter(Boolean).join(" · ")}</p>
                <Diya className="mx-auto mt-6 w-12" delay={i * 0.4} />
              </div>
            </div>
          ))}
        </div>
        {calendarUrl && <div className="mt-12 text-center" data-rise><a href={calendarUrl} className="gj-btn">✦ {L.calendar}</a></div>}
      </section>
    ),
    venue: A.where && (
      <section className="relative mx-auto max-w-5xl px-6 pt-20 text-center">
        {head(L.venue)}
        <div data-rise>
          <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="gj-gold an-f-d block text-[clamp(2.8rem,10cqw,5.6rem)] leading-[1.05]">{profile.venue || profile.city}</E>
          {profile.venue && profile.city && <p className="an-cap mt-4 text-[13px] text-[var(--a-muted)]">{profile.city}</p>}
          <a target="_blank" rel="noreferrer" href={A.mapUrl} className="gj-btn mt-10">{L.directions} →</a>
        </div>
        <Palace className="mx-auto mt-12 w-full max-w-4xl opacity-90" />
      </section>
    ),
    gallery: A.gallery.length > 0 && (
      <section className="mx-auto max-w-6xl px-6 py-20">
        {head(L.gallery)}
        <div className="grid grid-cols-2 gap-6 @3xl:grid-cols-3">
          {A.gallery.map((k) => <div key={k}>{archPhoto(media(k), "gallery", k, "aspect-[3/4.3] w-full")}</div>)}
        </div>
      </section>
    ),
    rsvp: children && (
      <section className="mx-auto max-w-xl px-6 py-20">
        {head(L.rsvp)}
        <div className="relative rounded-t-[999px] border-2 border-[var(--a-accent)] bg-[var(--a-ivory)] px-7 pb-12 pt-28 text-[#3a0a10] shadow-[0_50px_90px_-40px_rgba(0,0,0,.8)] @md:px-12" data-rise>
          <div className="pointer-events-none absolute inset-2 rounded-t-[999px] border border-[#c8912f]/40" />
          <Surya className="absolute left-1/2 top-4 w-24 -translate-x-1/2" spin={false} />
          <p className="an-f-d relative mb-8 text-center text-3xl">{L.reply}</p>
          {children}
        </div>
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
    <div ref={root} lang={profile.language ?? "en"} className={`gj an-site @container relative overflow-hidden ${annivFontVars}`} style={{ ...designVars(theme, design), ...paletteVars(design, GOLD_PALETTE), ...faceVars(design, "royal", GOLD_FACES) }}>
      <BaseCSS />
      <style href="an-gold" precedence="default">{GOLD_CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: JAALI("#e2b356", 0.06) }} />
      <Grain opacity={0.2} blend="overlay" />

      {/* ── Opening: carved palace doors swing open onto a sun-lit jharokha ── */}
      <header data-section="intro" className={`gj-hero relative flex flex-col items-center overflow-hidden text-center ${compact ? "min-h-[760px]" : "min-h-[100svh]"}`}>
        {!compact && <GoldDust className="absolute inset-0 z-[1]" />}
        <Toran className="relative z-[2] -mb-6 w-[max(100%,760px)] shrink-0" swags={6} />
        <div className="gj-hero-arch relative z-[2] mx-auto mt-2 w-[min(92cqw,640px)] flex-1 px-2">
          <Jharokha className="absolute inset-0 h-full w-full" fill="rgba(30,4,8,.35)" />
          <div className="relative flex h-full flex-col items-center px-[9%] pb-[clamp(11rem,26cqw,15rem)] pt-[clamp(2.5rem,8cqw,4rem)]">
            <div className="gj-sun relative mx-auto w-[min(56cqw,300px)]">
              <Surya className="w-full" />
              <p className="gj-gold an-f-d absolute inset-0 flex items-center justify-center pt-[4%] text-[min(17cqw,94px)] leading-none">{n || "✦"}</p>
            </div>
            <p className="gj-rise an-cap mt-4 text-[12px] text-[var(--a-accent)]" style={{ animationDelay: "2.2s" }}>{A.milestone}</p>
            <h1 className="gj-rise an-f-d mt-5 text-[clamp(2.9rem,10cqw,5.6rem)] leading-[1.02]" style={{ animationDelay: "2.5s" }}>
              <E path="profile.partner1" className="gj-gold">{A.a}</E>
              {A.b && <><span className="an-f-s block py-1 text-[.5em] italic text-[var(--a-ink)]">&amp;</span><E path="profile.partner2" className="gj-gold">{A.b}</E></>}
            </h1>
            <p className="gj-rise an-f-s mt-5 text-[clamp(1.4rem,3.6cqw,2rem)] italic text-[var(--a-muted)]" style={{ animationDelay: "2.9s" }}>{A.line}</p>
            <div className="gj-rise gj-orn mt-6" style={{ animationDelay: "3.1s" }}><Lotus className="w-8" /></div>
            <p className="gj-rise an-f-d mt-4 text-[clamp(1.2rem,3cqw,1.6rem)]" style={{ animationDelay: "3.2s" }}>{A.date}</p>
            {A.where && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="gj-rise an-cap mt-2 block text-[12px] text-[var(--a-muted)]" style={{ animationDelay: "3.3s" }}>{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
          </div>
        </div>
        <div className="gj-palace pointer-events-none absolute inset-x-0 bottom-0 z-[1]">
          <Palace className="relative left-1/2 w-[max(100%,560px)] -translate-x-1/2" />
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-[6cqw]">
            {[0, 1, 2, 3, 4].map((i) => <Diya key={i} className="w-[min(9cqw,52px)]" delay={i * 0.3} />)}
          </div>
        </div>
        {!compact && (
          <div aria-hidden className="gj-doors pointer-events-none absolute inset-0 z-30 flex motion-reduce:hidden">
            {["l", "r"].map((s) => (
              <div key={s} className={`gj-door-${s} relative h-full w-1/2 border-[#c8912f] ${s === "l" ? "border-r-2" : "border-l-2"}`} style={{ background: `linear-gradient(${s === "l" ? 90 : 270}deg, #2a070b, #5a121b 60%, #3a0a10)` }}>
                <div className="absolute inset-[6%] rounded-t-[999px] border border-[#e2b356]/70" style={{ backgroundImage: JAALI("#e2b356", 0.45) }} />
                <div className="absolute inset-[9%] rounded-t-[999px] border border-[#e2b356]/30" />
                <span className={`absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-[#e2b356] bg-[radial-gradient(circle_at_35%_30%,#fbe3a2,#9b6a1f)] ${s === "l" ? "right-4" : "left-4"}`} />
              </div>
            ))}
          </div>
        )}
      </header>

      <main className="relative">
        <Sections design={design} render={sections} />
      </main>

      <footer className="relative px-6 pb-16 pt-16 text-center">
        <div className="relative mx-auto w-40" data-rise>
          <Surya className="w-full" spin={false} />
          <p className="gj-gold an-f-d absolute inset-0 flex items-center justify-center text-4xl">{A.initials}</p>
        </div>
        {profile.blessing && <E as="p" path="profile.blessing" className="an-f-s mt-6 block text-3xl italic text-[var(--a-accent)]">{profile.blessing}</E>}
        <p className="an-cap mt-4 text-[11px] text-[var(--a-muted)]">{L.forever}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--a-muted)]">{credit}</div>}
      </footer>
    </div>
  );
}
