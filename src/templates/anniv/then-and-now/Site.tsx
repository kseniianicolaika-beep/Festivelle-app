"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { designVars } from "@/lib/themes";
import { formatDate } from "@/lib/profile";
import { BaseCSS } from "../_shared/CardKit";
import { annivFontVars, STACK } from "../_shared/fonts";
import { faceVars, Grain, media, paletteVars, Photo, Sections, standardReveals, useAnniv, useDaysLeft, useLenis, useMotion, yearsWord } from "../_shared/kit";
import { Odometer, Postmark, Print, Ribbon, TnFilters } from "./art";

export const TN_PALETTE = { bg: "#F4ECDF", ink: "#2E2420", accent: "#B23A48", sepia: "#8C6A4F", muted: "#86725F", paper: "#FBF6EC" };
export const TN_FACES = { display: STACK.oldstd, script: STACK.caveat, body: STACK.oldstd, label: STACK.mono };

export const TN_CSS = `
.tn{background:var(--a-bg);color:var(--a-ink);font-family:var(--a-body)}
.tn-sepia{filter:sepia(.85) saturate(.75) contrast(1.05) brightness(.97)}
.tn-stamp{font-family:var(--a-label);color:#ff8a2a;font-size:clamp(10px,2.6cqw,15px);letter-spacing:.12em;text-shadow:0 0 4px rgba(255,120,30,.8);opacity:.9}
.tn-label{font-family:var(--a-label);text-transform:uppercase;letter-spacing:.28em}
.tn-hand{font-family:var(--a-script)}
.tn-ribbon{stroke-dashoffset:1;animation:tn-draw 2.6s cubic-bezier(.65,0,.25,1) 1s forwards}
@keyframes tn-draw{to{stroke-dashoffset:0}}
.tn-roll{animation:tn-roll 2.4s cubic-bezier(.3,0,.1,1) both}
@keyframes tn-roll{from{transform:translateY(calc(var(--from) * -1em))}to{transform:translateY(calc(var(--to) * -1em))}}
.tn-develop{animation:tn-develop 3.2s ease-out .3s both}
@keyframes tn-develop{from{filter:brightness(2.4) saturate(0) blur(6px);opacity:.3}to{filter:none;opacity:1}}
.tn-in-l{animation:tn-in-l 1.6s cubic-bezier(.16,1,.3,1) .2s both}
.tn-in-r{animation:tn-in-r 1.6s cubic-bezier(.16,1,.3,1) .5s both}
@keyframes tn-in-l{from{opacity:0;transform:translate(-30px,30px) rotate(-12deg)}}
@keyframes tn-in-r{from{opacity:0;transform:translate(30px,30px) rotate(12deg)}}
.tn-rise{animation:tn-rise 1.4s cubic-bezier(.16,1,.3,1) both}
@keyframes tn-rise{from{opacity:0;transform:translateY(20px)}}
.tn-btn{display:inline-flex;align-items:center;gap:.6rem;border:1.5px solid var(--a-ink);padding:.8rem 1.4rem;font-family:var(--a-label);font-size:12px;letter-spacing:.2em;text-transform:uppercase;transition:background .3s,color .3s}
.tn-btn:hover{background:var(--a-ink);color:var(--a-bg)}
.tn-range{appearance:none;-webkit-appearance:none;background:transparent;position:absolute;inset:0;width:100%;height:100%;cursor:ew-resize;opacity:0}
.tn-ticket{background:var(--a-paper);-webkit-mask:radial-gradient(circle 12px at 0 50%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 12px at 100% 50%,#0000 98%,#000) right/51% 100% no-repeat}
`;

/** Then | Now comparison: drag (or scroll) to wipe the years away. */
function Compare({ then, now, thenSlot, thenKey, sinceLabel, nowLabel }: { then?: string | null; now?: string | null; thenSlot: "hero" | "gallery"; thenKey?: string; sinceLabel: string; nowLabel: string }) {
  const [v, setV] = useState(50);
  return (
    <div className="tn-compare relative mx-auto aspect-[4/5] w-full max-w-[560px] select-none overflow-hidden bg-[#d9cbb4] shadow-[0_40px_80px_-40px_rgba(60,35,20,.6)] @3xl:aspect-[16/11] @3xl:max-w-[980px]">
      <Photo src={now} className="absolute inset-0 h-full w-full object-cover" />
      <div className="tn-compare-then absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
        <Photo src={then} slot={thenSlot} galleryKey={thenKey} className="tn-sepia absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_45%,rgba(70,40,15,.5))]" />
      </div>
      <div aria-hidden className="absolute inset-y-0 w-px bg-white shadow-[0_0_12px_rgba(0,0,0,.4)]" style={{ left: `${v}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--a-accent)] shadow-lg">⟷</span>
      </div>
      <span className="tn-label absolute left-4 top-4 bg-[#f3e9d6]/90 px-3 py-1.5 text-[11px]">{sinceLabel}</span>
      <span className="tn-label absolute right-4 top-4 bg-white/90 px-3 py-1.5 text-[11px]">{nowLabel}</span>
      <input aria-label="Then and now" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} className="tn-range" />
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const A = useAnniv(profile, design);
  const L = A.L;
  const days = useDaysLeft(profile.date);
  const thenKey = A.gallery[0];
  const thenSrc = thenKey ? media(thenKey) : heroUrl;
  const stamp = A.since && profile.date ? `'${String(A.since).slice(2)} ${profile.date.slice(5, 7)} ${profile.date.slice(8, 10)}` : undefined;
  useLenis(!compact);
  useMotion(root, !compact, (g) => {
    standardReveals(g);
    g.to(".tn-hero-then", { yPercent: -12, rotate: -9, ease: "none", scrollTrigger: { trigger: ".tn-hero", start: "top top", end: "bottom top", scrub: true } });
    g.to(".tn-hero-now", { yPercent: -24, rotate: 8, ease: "none", scrollTrigger: { trigger: ".tn-hero", start: "top top", end: "bottom top", scrub: true } });
    const cmp = document.querySelector(".tn-compare-then");
    if (cmp) g.fromTo(cmp, { clipPath: "inset(0 0% 0 0)" }, { clipPath: "inset(0 50% 0 0)", ease: "none", scrollTrigger: { trigger: cmp, start: "top 80%", end: "center 45%", scrub: true } });
  });

  const tag = (s: React.ReactNode, cls = "") => <p className={`tn-label text-[11px] text-[var(--a-muted)] ${cls}`}>{s}</p>;

  const sections = {
    invitation: (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="tn-hand text-3xl text-[var(--a-accent)]" data-rise>{L.invite}</p>
        <E as="p" multiline path="profile.inviteLine" className="an-f-d mt-6 block text-[clamp(1.8rem,5cqw,3rem)] italic leading-[1.3]">{A.invite}</E>
      </section>
    ),
    gallery: A.gallery.length > 1 && (
      <section className="px-6 py-16">
        {(
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center" data-rise>{tag(L.gallery)}</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 @3xl:grid-cols-4" data-stagger>
              {A.gallery.slice(1).map((k, i) => (
                <Print key={k} src={media(k)} slot="gallery" galleryKey={k} era={i % 2 ? "now" : "then"} tilt={[-3, 2, -1.5, 3][i % 4]} label={<span className="tn-hand text-xl text-[var(--a-sepia)]">{A.since && A.age ? A.since + Math.round(((i + 1) / A.gallery.length) * A.age) : ""}</span>} />
              ))}
            </div>
          </div>
        )}
      </section>
    ),
    story: profile.story && (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="relative bg-[var(--a-paper)] px-8 py-14 shadow-[0_30px_70px_-40px_rgba(60,35,20,.5)] @md:px-16" style={{ backgroundImage: "repeating-linear-gradient(transparent 0 35px, rgba(140,106,79,.14) 35px 36px)" }} data-rise>
          <span aria-hidden className="absolute bottom-0 left-12 top-0 w-px bg-[var(--a-accent)]/30" />
          {tag(L.story)}
          <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[clamp(1.25rem,3cqw,1.55rem)] leading-[36px]">{profile.story}</E>
          {A.age && <p className="tn-hand mt-8 -rotate-2 text-right text-3xl text-[var(--a-accent)]">— {A.age} {yearsWord(A.age, A.lang)} {L.together} ♡</p>}
        </div>
      </section>
    ),
    details: (profile.date || A.where) && (
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        {tag(L.details)}
        <div className="mt-8 grid gap-4 @2xl:grid-cols-2" data-stagger>
          {profile.date && <div className="tn-ticket px-10 py-10"><p className="tn-label text-[10px] text-[var(--a-accent)]">{L.when}</p><p className="an-f-d mt-3 text-3xl">{A.date}</p>{days !== null && days > 0 && <p className="tn-hand mt-2 text-2xl text-[var(--a-sepia)]">{days} {L.days}</p>}</div>}
          {A.where && <div className="tn-ticket px-10 py-10"><p className="tn-label text-[10px] text-[var(--a-accent)]">{L.where}</p><E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d mt-3 block text-3xl">{profile.venue || profile.city}</E>{profile.venue && profile.city && <p className="tn-hand mt-2 text-2xl text-[var(--a-sepia)]">{profile.city}</p>}</div>}
        </div>
      </section>
    ),
    schedule: A.events.length > 0 && (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">{tag(L.events)}</div>
        <div className="mt-10 space-y-4" data-stagger>
          {A.events.map((e, i) => (
            <div key={i} className="tn-ticket grid grid-cols-[auto_1fr] items-center gap-6 px-8 py-6 @md:grid-cols-[7rem_1fr_auto]">
              <p className="an-f-d text-3xl italic text-[var(--a-accent)]">{e.time ?? ""}</p>
              <div className="border-l border-dashed border-[var(--a-muted)]/40 pl-6"><h3 className="an-f-d text-2xl">{e.name}</h3><p className="tn-label mt-1 text-[10px] text-[var(--a-muted)]">{[formatDate(e.date, profile.language), e.venue].filter(Boolean).join(" · ")}</p></div>
              <p className="tn-label hidden text-[10px] text-[var(--a-muted)] @md:block">Nº {String(i + 1).padStart(2, "0")}</p>
            </div>
          ))}
        </div>
        {calendarUrl && <div className="mt-10 text-center"><a href={calendarUrl} className="tn-btn">+ {L.calendar}</a></div>}
      </section>
    ),
    venue: A.where && (
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="relative grid gap-8 bg-[var(--a-paper)] p-8 shadow-[0_30px_70px_-40px_rgba(60,35,20,.5)] @2xl:grid-cols-[1.3fr_1fr] @md:p-12" data-rise>
          <div>
            {tag(L.venue)}
            <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d mt-4 block text-[clamp(2.2rem,6cqw,3.4rem)] italic leading-tight">{profile.venue || profile.city}</E>
            {profile.venue && profile.city && <p className="tn-hand mt-2 text-3xl text-[var(--a-sepia)]">{profile.city}</p>}
            <a target="_blank" rel="noreferrer" href={A.mapUrl} className="tn-btn mt-8">{L.directions} →</a>
          </div>
          <div className="relative flex items-start justify-end border-dashed border-[var(--a-muted)]/40 @2xl:border-l @2xl:pl-8">
            <div className="h-28 w-24 rotate-3 border-[5px] border-dotted border-[var(--a-paper)] bg-[var(--a-accent)] p-2 outline outline-1 outline-[var(--a-muted)]/30"><div className="flex h-full items-center justify-center border border-white/60 text-center"><span className="an-f-d text-3xl italic text-white">{A.age ?? "♡"}</span></div></div>
            <Postmark city={profile.city ?? ""} date={A.dateNum} className="absolute -left-4 top-6 w-48 -rotate-6 @2xl:left-0" />
          </div>
        </div>
      </section>
    ),
    rsvp: children && (
      <section className="mx-auto max-w-xl px-6 py-20">
        <div className="relative bg-[var(--a-paper)] px-7 py-12 shadow-[0_40px_80px_-40px_rgba(60,35,20,.5)] @md:px-12" data-rise>
          <Ribbon className="absolute -top-8 left-0 h-16 w-full" animate={false} d="M0 110 C 200 60, 300 160, 400 110 S 600 60, 800 110" />
          <div className="mb-8 text-center">{tag(L.rsvp)}<p className="tn-hand mt-3 text-4xl text-[var(--a-accent)]">{L.reply}</p></div>
          {children}
        </div>
      </section>
    ),
    info: A.info && (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        {tag(L.info)}
        <E as="p" multiline path="texts.body" className="mt-5 block whitespace-pre-line text-xl leading-relaxed text-[var(--a-muted)]">{A.info}</E>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`tn an-site @container relative overflow-hidden ${annivFontVars}`} style={{ ...designVars(theme, design), ...paletteVars(design, TN_PALETTE), ...faceVars(design, "lora", TN_FACES) }}>
      <BaseCSS />
      <style href="an-tn" precedence="default">{TN_CSS}</style>
      <TnFilters />
      <Grain opacity={0.35} />

      {/* ── Opening: the old print develops, the year rolls forward, a ribbon ties then to now ── */}
      <header data-section="intro" className={`tn-hero relative overflow-hidden px-6 ${compact ? "pb-16 pt-12" : "flex min-h-[100svh] flex-col justify-center pb-16 pt-16"}`}>
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 @3xl:grid-cols-[1.15fr_1fr]">
          <div className="relative mx-auto h-[min(118cqw,660px)] w-full max-w-[640px] @3xl:order-2">
            <Ribbon className="absolute left-[-10%] top-[30%] z-[3] h-[40%] w-[120%]" />
            <div className="tn-hero-then absolute left-0 top-[4%] z-[1] w-[58%]"><div className="tn-in-l"><Print era="then" src={thenSrc} slot={thenKey ? "gallery" : "hero"} galleryKey={thenKey} tilt={-5} stamp={stamp} imgClass="tn-develop" label={<span className="tn-hand text-[clamp(1.1rem,3.4cqw,1.6rem)] text-[var(--a-sepia)]">{L.then}{A.since ? `, ${A.since}` : ""}</span>} /></div></div>
            <div className="tn-hero-now absolute bottom-[2%] right-0 z-[2] w-[58%]"><div className="tn-in-r"><Print era="now" src={heroUrl} tilt={4} label={<span className="tn-hand text-[clamp(1.1rem,3.4cqw,1.6rem)] text-[var(--a-ink)]">{L.now}{A.year ? `, ${A.year}` : ""}</span>} /></div></div>
          </div>
          <div className="relative text-center @3xl:text-left">
            <p className="tn-rise tn-label text-[11px] text-[var(--a-accent)]" style={{ animationDelay: ".4s" }}>{A.milestone}</p>
            <p className="an-f-d mt-4 flex items-end justify-center gap-4 text-[clamp(5rem,24cqw,11rem)] font-bold leading-none tracking-[-0.03em] text-[var(--a-ink)] @3xl:justify-start">{A.age ? <Odometer from={0} to={A.age} delay={0.9} /> : <Odometer from={A.since} to={A.year} delay={0.9} />}<span className="tn-hand pb-[.12em] text-[.26em] font-normal leading-[1.1] tracking-normal text-[var(--a-sepia)]">{A.age ? yearsWord(A.age, A.lang) : ""}<br />{A.since ? `${L.since} ${A.since}` : ""}</span></p>
            <h1 className="tn-rise an-f-d mt-6 text-[clamp(2.6rem,9cqw,5.2rem)] italic leading-[1]" style={{ animationDelay: "1.6s" }}>
              <E path="profile.partner1">{A.a}</E>{A.b && <><span className="tn-hand mx-3 text-[var(--a-accent)]">&amp;</span><E path="profile.partner2">{A.b}</E></>}
            </h1>
            <p className="tn-rise tn-hand mt-4 text-[clamp(1.6rem,4cqw,2.2rem)] text-[var(--a-sepia)]" style={{ animationDelay: "2s" }}>{A.line}</p>
            <div className="tn-rise mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 @3xl:justify-start" style={{ animationDelay: "2.3s" }}>
              {A.date && <span className="tn-label text-[11px]">{A.date}</span>}
              {A.where && <E path={profile.venue ? "profile.venue" : "profile.city"} className="tn-label text-[11px] text-[var(--a-muted)]">{A.where}</E>}
              {days !== null && days > 0 && <span className="tn-label text-[11px] text-[var(--a-accent)]">{days} {L.days}</span>}
            </div>
          </div>
        </div>
      </header>
      <section data-section="intro" className="relative px-6 pb-10 pt-6">
        <div className="mx-auto mb-10 flex max-w-5xl items-end justify-between gap-6" data-rise>
          <div>{tag(L.then + " / " + L.now)}<p className="an-f-d mt-2 text-[clamp(2.2rem,6cqw,3.6rem)] italic leading-none">{A.since ?? L.then} <span className="text-[var(--a-accent)]">→</span> {A.year ?? L.now}</p></div>
          <p aria-hidden className="tn-hand hidden text-4xl text-[var(--a-sepia)] @2xl:block">⟷</p>
        </div>
        <div data-rise><Compare then={thenSrc} now={heroUrl} thenSlot={thenKey ? "gallery" : "hero"} thenKey={thenKey} sinceLabel={`${L.then} · ${A.since ?? ""}`} nowLabel={`${L.now} · ${A.year ?? ""}`} /></div>
      </section>

      <main className="relative">
        <Sections design={design} render={sections} />
      </main>

      <footer className="relative px-6 pb-16 pt-12 text-center">
        <p className="an-f-d text-[clamp(3rem,10cqw,5rem)] italic leading-none" data-rise>{A.since ?? ""}<span className="mx-4 text-[var(--a-accent)]">—</span>{A.year ?? ""}</p>
        <p className="tn-hand mt-3 text-3xl text-[var(--a-sepia)]">{L.forever}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="tn-hand mt-6 block text-4xl text-[var(--a-accent)]">{profile.blessing}</E>}
        <p className="tn-label mt-6 text-[10px] text-[var(--a-muted)]">{A.a}{A.b ? ` & ${A.b}` : ""}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--a-muted)]">{credit}</div>}
      </footer>
    </div>
  );
}
