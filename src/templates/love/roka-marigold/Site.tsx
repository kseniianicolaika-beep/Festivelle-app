"use client";
import { useRef } from "react";
import gsap from "gsap";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { LENIS_CSS, Sections, labels, mapUrl, media, useCountdown, useLenis, useScrollStage, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { Bloom, Jharokha, Lari, RokaDefs, Thali, Toran, bandhani } from "./art";

const PETALS = Array.from({ length: 26 }, (_, i) => ({ x: Math.round(Math.cos(i * 2.4) * (120 + (i * 37) % 260)), y: Math.round(Math.sin(i * 2.4) * (90 + (i * 53) % 220) + 120), r: (i * 97) % 540, t: i % 4, s: 10 + (i * 7) % 14, d: 1.2 + (i % 6) * 0.06 }));

// ROKA MARIGOLD — a roka morning in marigold and turmeric. A genda-phool toran drops into place, petals burst,
// and the couple appear inside a cusped jharokha over a brass roka thali.
export default function Site({ profile: p, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(p);
  const L = labels(p);
  const cd = useCountdown(p.date, !compact);
  const where = p.venue || p.city || "";
  const date = formatDate(p.date, p.language);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const hi = p.language === "hi", ru = p.language === "ru";
  const shubh = hi ? "॥ शुभ रोका ॥" : ru ? "Шубх Рока" : "Shubh Roka";
  useLenis(!compact);
  useScrollStage(root, compact, (el) => {
    const spine = el.querySelector(".rk-spine");
    if (spine) gsap.fromTo(spine, { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: el.querySelector("main"), start: "top 70%", end: "bottom 80%", scrub: true } });
    el.querySelectorAll(".rk-bead").forEach((n) => gsap.from(n, { scale: 0, rotate: -120, duration: 0.9, ease: "back.out(2)", scrollTrigger: { trigger: n, start: "top 80%", once: true } }));
  });

  const sec = compact ? "px-6 py-14" : "px-6 py-20 md:py-28";
  const Chapter = ({ title, tone = 0, children: c, wide = false }: { title: string; tone?: number; children: React.ReactNode; wide?: boolean }) => (
    <section className={`${sec} relative`}>
      <div className={`relative mx-auto ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <Bloom tone={tone} className="rk-bead relative z-[2] w-12 drop-shadow-[0_6px_10px_rgba(150,60,0,.3)]" />
          <p data-rv className="sc text-3xl text-[var(--t-accent)] md:text-4xl">{title}</p>
        </div>
        {c}
      </div>
    </section>
  );
  const Card = ({ children: c, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div data-rv className={`relative rounded-[28px] bg-[var(--t-surface)] p-8 shadow-[0_30px_60px_-40px_rgba(140,60,0,.55)] ring-1 ring-[var(--t-gold)]/40 md:p-12 ${className}`}>
      <div className="gota absolute inset-x-8 top-0 h-[5px] rounded-b-full opacity-80" />
      {c}
    </div>
  );

  return (
    <div ref={root} lang={p.language ?? "en"} style={vars(theme, design, "royal")} className={`rk ${fontClass} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`}>
      <style href="love-rk" precedence="default">{CSS + LENIS_CSS}</style>
      <RokaDefs />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: bandhani(), backgroundSize: "26px 26px" }} />

      {/* ── Intro ── */}
      <header data-section="intro" className={`relative overflow-hidden ${compact ? "min-h-[680px]" : "min-h-[100svh]"} bg-[radial-gradient(80%_60%_at_50%_45%,#ffe9a8,transparent_75%)]`}>
        <div className={`absolute inset-x-0 top-0 z-[3] ${compact ? "" : "drop"}`}><Toran className={`w-full ${compact ? "h-[150px]" : "h-[150px] md:h-[200px]"}`} /></div>
        <div className={`relative z-[2] mx-auto flex ${compact ? "min-h-[680px] pt-[120px]" : "min-h-[100svh] pt-[130px] md:pt-[150px]"} max-w-5xl flex-col items-center justify-center px-5 pb-10`}>
          <div className={`pop relative w-full ${compact ? "max-w-[330px]" : "max-w-[440px]"}`} style={{ animationDelay: "1s" }}>
            <Jharokha className="absolute inset-0 h-full w-full" fill="color-mix(in oklab, var(--t-surface) 85%, transparent)" />
            <div className="relative flex flex-col items-center px-8 pb-6 pt-[22%] text-center md:px-14">
              <p className="d up text-[var(--t-accent)] md:text-xl" style={{ animationDelay: "1.5s" }}>{shubh}</p>
              <h1 className={`d mt-3 leading-[1.02] ${compact ? "text-[48px]" : "text-[clamp(46px,6vw,78px)]"}`}>
              <span style={{ fontSize: `${fitName(a, b, 7, false)}em` }}>
                <E path="profile.partner1" className="pop block" style={{ animationDelay: "1.7s" }}>{a}</E>
                {b && <span className="sc pop block text-[.42em] text-[var(--t-accent)]" style={{ animationDelay: "1.9s" }}>{L.and === "и" ? "и" : "&"}</span>}
                {b && <E path="profile.partner2" className="pop block" style={{ animationDelay: "2s" }}>{b}</E>}
              </span>
            </h1>
              <p className="sc up mt-2 text-xl text-[var(--t-accent)] md:text-2xl" style={{ animationDelay: "2.3s" }}>{hi ? "की सगाई" : ru ? "помолвка" : "are engaged"}</p>
              <div className="up mt-4 rounded-full bg-[var(--t-accent)] px-5 py-2 text-[var(--t-surface)] shadow-[0_8px_20px_-8px_rgba(160,40,10,.6)]" style={{ animationDelay: "2.5s" }}>
                <p className="text-sm md:text-base">{date}</p>
              </div>
              {where && <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="up mt-3 block text-[var(--t-muted)]" style={{ animationDelay: "2.6s" }}>{where}</E>}
              <Thali className={`pop mt-3 ${compact ? "w-44" : "w-52 md:w-60"}`} />
            </div>
          </div>
        </div>
        {!compact && (
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[45%] z-[4]">
            {PETALS.map((q, i) => (
              <span key={i} className="burst absolute" style={{ "--x": `${q.x}px`, "--y": `${q.y}px`, "--r": `${q.r}deg`, animationDelay: `${q.d}s` } as React.CSSProperties}>
                <Bloom tone={q.t} style={{ width: q.s, height: q.s }} />
              </span>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-[2]">
        {/* the marigold spine that threads the story together */}
        <div aria-hidden className={`rk-spine pointer-events-none absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 bg-[repeating-linear-gradient(180deg,#f08a1c_0_10px,#f7c531_10px_20px)] opacity-40`} />
        <Sections
          design={design}
          render={{
            invitation: (
              <Chapter title={L.invitation} tone={0}>
                <Card className="text-center">
                  <E as="p" multiline path="profile.inviteLine" className="d block text-[clamp(26px,3.6vw,40px)] leading-[1.35]">{p.inviteLine || occasionInvite(p)}</E>
                  <p className="mt-6 text-[var(--t-muted)]">{hi ? "दोनों परिवारों के आशीर्वाद के साथ" : ru ? "С благословения обеих семей" : "With the blessings of both our families"}</p>
                </Card>
              </Chapter>
            ),
            story: p.story && (
              <Chapter title={L.story} tone={1} wide>
                <div className={`grid items-center gap-10 ${compact ? "" : "md:grid-cols-2"}`}>
                  <div data-rv className="relative mx-auto aspect-[4/5] w-full max-w-[360px]">
                    <div className="absolute inset-0 overflow-hidden rounded-t-[50%] ring-4 ring-[var(--t-gold)]/60">
                      {heroUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div data-edit-photo="hero" className="flex h-full w-full items-center justify-center bg-[#ffe3a0]"><Thali className="w-3/4" /></div>
                      )}
                    </div>
                    <svg viewBox="0 0 100 40" className="absolute -left-3 -top-4 w-[110%]" aria-hidden><Lari x={8} y={0} n={3} size={9} seed={2} /><Lari x={96} y={0} n={3} size={9} seed={3} /></svg>
                  </div>
                  <Card>
                    <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-xl leading-[1.7] md:text-2xl">{p.story}</E>
                  </Card>
                </div>
              </Chapter>
            ),
            details: (p.date || where) && (
              <Chapter title={L.details} tone={2}>
                <div className={`grid gap-5 ${compact ? "" : "md:grid-cols-2"}`}>
                  <Card className="text-center">
                    <p className="cap text-xs text-[var(--t-muted)]">{L.when}</p>
                    <p className="d mt-3 text-4xl text-[var(--t-accent)]">{date}</p>
                    {p.events?.[0]?.time && <p className="mt-2 text-lg">{p.events[0].time}</p>}
                  </Card>
                  <Card className="text-center">
                    <p className="cap text-xs text-[var(--t-muted)]">{L.where}</p>
                    <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-3 block text-4xl text-[var(--t-accent)]">{where}</E>
                    {p.venue && p.city && <E as="p" path="profile.city" className="mt-2 block text-lg">{p.city}</E>}
                  </Card>
                </div>
                {cd && (
                  <div data-rv className="mt-8 flex flex-wrap justify-center gap-3">
                    {[[cd.d, L.days], [cd.h, L.hrs], [cd.m, L.min]].map(([n, l], i) => (
                      <div key={i} className="flex min-w-[96px] flex-col items-center rounded-full bg-[var(--t-accent)] px-5 py-3 text-[var(--t-surface)]"><span className="d text-3xl leading-none">{n}</span><span className="mt-1 text-xs opacity-85">{l}</span></div>
                    ))}
                  </div>
                )}
              </Chapter>
            ),
            schedule: !!p.events?.length && (
              <Chapter title={L.events} tone={3}>
                <div className="space-y-6">
                  {p.events.map((e, i) => (
                    <Card key={i} className={`flex items-center gap-6 ${compact ? "" : i % 2 ? "md:ml-24" : "md:mr-24"}`}>
                      <Bloom tone={i} className="w-14 shrink-0" />
                      <div className="flex-1">
                        <p className="d text-3xl leading-tight">{e.name}</p>
                        <p className="mt-1 text-[var(--t-muted)]">{[e.time, formatDate(e.date, p.language), e.venue].filter(Boolean).join(" · ")}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                {calendarUrl && <div data-rv className="mt-10 text-center"><a href={calendarUrl} className="inline-flex items-center gap-2 rounded-full bg-[var(--t-accent)] px-6 py-3 text-[var(--t-surface)] shadow-[0_10px_24px_-10px_rgba(160,40,10,.6)] transition hover:-translate-y-0.5">✿ {L.calendar}</a></div>}
              </Chapter>
            ),
            venue: where && (
              <Chapter title={L.venue} tone={0}>
                <div data-rv className="relative mx-auto max-w-[460px]">
                  <Jharokha className="absolute inset-0 h-full w-full" fill="var(--t-surface)" />
                  <div className="relative px-10 pb-12 pt-[30%] text-center">
                    <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d block text-4xl text-[var(--t-accent)] md:text-5xl">{where}</E>
                    {p.venue && p.city && <p className="mt-2 text-xl">{p.city}</p>}
                    <a href={mapUrl(p)} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[var(--t-accent)] px-6 py-2.5 text-[var(--t-accent)] transition hover:bg-[var(--t-accent)] hover:text-[var(--t-surface)]">{L.directions} →</a>
                  </div>
                </div>
              </Chapter>
            ),
            gallery: gallery.length > 0 && (
              <Chapter title={L.gallery} tone={1} wide>
                <div className={`grid gap-4 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                  {gallery.map((k, i) => (
                    <figure key={k} data-rv className={`overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_20px_40px_-30px_rgba(140,60,0,.6)] ${i % 3 === 1 ? "rotate-[1.5deg]" : "-rotate-[1deg]"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-square w-full rounded-[16px] object-cover" />
                    </figure>
                  ))}
                </div>
              </Chapter>
            ),
            rsvp: children && (
              <Chapter title={L.rsvp} tone={2}>
                <div data-rv className="relative mx-auto max-w-xl overflow-hidden rounded-[28px] bg-[var(--t-accent)] p-2 shadow-[0_40px_80px_-40px_rgba(160,40,10,.7)]">
                  <div className="gota absolute inset-x-0 top-0 h-2" /><div className="gota absolute inset-x-0 bottom-0 h-2" />
                  <div className="rounded-[22px] bg-[var(--t-surface)] p-7 md:p-10">
                    <p className="mb-6 text-center text-xl text-[var(--t-muted)]">{L.attend}</p>
                    {children}
                  </div>
                </div>
              </Chapter>
            ),
            info: info && (
              <Chapter title={L.info} tone={3}>
                <Card className="text-center"><E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed">{info}</E></Card>
              </Chapter>
            ),
          }}
        />
      </main>

      <footer className="relative z-[2] overflow-hidden pb-14 pt-10 text-center">
        <Thali className="mx-auto w-56" />
        {p.blessing && <E as="p" path="profile.blessing" className="sc mt-6 block text-3xl text-[var(--t-accent)]">{p.blessing}</E>}
        <p className="d mt-4 text-3xl">{a}{b && <span className="sc mx-2 text-[var(--t-accent)]">&amp;</span>}{b}</p>
        <p className="mt-2 text-[var(--t-muted)]">{shubh} · {date}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
