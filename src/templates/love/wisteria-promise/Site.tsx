"use client";
import { useRef } from "react";
import gsap from "gsap";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite, occasionLine } from "@/lib/occasions";
import { GRAIN, LENIS_CSS, Sections, labels, mapUrl, media, useCountdown, useLenis, useScrollStage, vars, fitName } from "../_shared/kit";
import { CSS, Canopy, Florets, Leaves, Raceme, Wash, WpDefs, fontClass } from "./art";

// WISTERIA PROMISE — lilac, wisteria and watercolour skies at dusk. Ink blooms outward like a wet wash,
// racemes grow down from the pergola and the names are brushed in.
export default function Site({ profile: p, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(p);
  const L = labels(p);
  const cd = useCountdown(p.date, !compact);
  const where = p.venue || p.city || "";
  const date = formatDate(p.date, p.language);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const ru = p.language === "ru";
  const amp = ru ? "и" : "&";
  useLenis(!compact);
  useScrollStage(root, compact, (el) => {
    const c = el.querySelector(".wp-canopy");
    if (c) gsap.to(c, { yPercent: -20, ease: "none", scrollTrigger: { trigger: el.querySelector(".wp-hero"), start: "top top", end: "bottom top", scrub: true } });
    el.querySelectorAll(".wp-side").forEach((n) => gsap.from(n, { scaleY: 0, transformOrigin: "top", duration: 2.2, ease: "power2.out", scrollTrigger: { trigger: n, start: "top 85%", once: true } }));
  });

  const sec = compact ? "px-6 py-14" : "px-6 py-20 md:py-28";
  const Title = ({ children: c }: { children: React.ReactNode }) => (
    <div data-rv className="mb-10 text-center">
      <p className="br inkc text-5xl md:text-6xl">{c}</p>
    </div>
  );
  const Card = ({ children: c, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div data-rv className={`relative rounded-[3px] bg-[var(--t-surface)]/80 p-8 shadow-[0_30px_70px_-50px_rgba(70,40,110,.6)] backdrop-blur-sm md:p-12 ${className}`} style={{ backgroundImage: GRAIN }}>{c}</div>
  );

  return (
    <div ref={root} lang={p.language ?? "en"} style={vars(theme, design, "classic")} className={`wp ${fontClass} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`}>
      <style href="love-wp" precedence="default">{CSS + LENIS_CSS}</style>
      <WpDefs />

      {/* ── Intro ── */}
      <header data-section="intro" className={`wp-hero relative overflow-hidden ${compact ? "min-h-[640px]" : "min-h-[100svh]"}`}>
        <div className={`absolute inset-0 ${compact ? "" : "bleed"}`}>
          <Wash className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 opacity-60 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
        </div>
        <Canopy className={`wp-canopy absolute inset-x-[-4%] top-0 h-[340px]`} count={compact ? 8 : 15} grow={!compact} />
        {!compact && <Florets n={16} />}
        <div className={`relative z-[2] mx-auto flex ${compact ? "min-h-[640px] justify-center pt-[200px]" : "min-h-[100svh] justify-center pt-[200px] md:pt-[150px]"} max-w-5xl flex-col items-center px-6 pb-16 text-center`}>
          <p className="cap up text-[var(--t-muted)]" style={{ animationDelay: "2s" }}>{L.engagementOf}</p>
          <h1 className={`br inkc mt-2 ${compact ? "text-[76px]" : "text-[clamp(72px,9vw,140px)]"}`}>
              <span style={{ fontSize: `${fitName(a, b, 7, true)}em` }}>
            <E path="profile.partner1" className={`${compact ? "" : "ink"} inline-block px-[.1em]`} style={{ animationDelay: "2.2s" }}>{a}</E>
            {b && <span className={`di ${compact ? "" : "up"} mx-2 inline-block align-middle text-[.32em] text-[var(--t-accent)]`} style={{ animationDelay: "3s" }}>{amp}</span>}
            {b && <E path="profile.partner2" className={`${compact ? "" : "ink"} inline-block px-[.1em]`} style={{ animationDelay: "2.8s" }}>{b}</E>}
          </span>
            </h1>
          <p className="di up mt-2 text-2xl md:text-3xl" style={{ animationDelay: "3.4s" }}>{occasionLine(p)}</p>
          <div className="up mt-8 flex items-center gap-4" style={{ animationDelay: "3.6s" }}>
            <Raceme h={40} seed={4} className="w-5 -rotate-90" />
            <p className="d text-xl tracking-wide md:text-2xl">{date}</p>
            <Raceme h={40} seed={5} className="w-5 rotate-90" />
          </div>
          {where && <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="cap up mt-3 block text-[var(--t-muted)]" style={{ animationDelay: "3.7s" }}>{where}{p.city && p.venue ? ` · ${p.city}` : ""}</E>}
        </div>
      </header>

      <main className="relative z-[2]">
        <Sections
          design={design}
          render={{
            invitation: (
              <section className={`${sec} relative mx-auto max-w-3xl text-center`}>
                <div data-rv><E as="p" multiline path="profile.inviteLine" className="di block text-[clamp(30px,4vw,48px)] leading-[1.3]">{p.inviteLine || occasionInvite(p)}</E></div>
              </section>
            ),
            story: p.story && (
              <section className={`${sec} relative mx-auto max-w-5xl`}>
                <Title>{L.story}</Title>
                <div className={`grid items-center gap-12 ${compact ? "" : "md:grid-cols-2"}`}>
                  <div data-rv className="relative mx-auto aspect-[4/5] w-full max-w-[360px]">
                    <div className="absolute inset-0 overflow-hidden rounded-[50%]" style={{ filter: "url(#wp-wc)" }}>
                      {heroUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div data-edit-photo="hero" className="relative h-full w-full"><Wash className="h-full w-full" /></div>
                      )}
                    </div>
                    <Raceme h={150} seed={11} className="wp-side absolute -left-6 -top-6 w-20" />
                    <Raceme h={110} seed={12} className="wp-side absolute -right-2 -top-4 w-16" />
                    <Leaves className="absolute -bottom-6 -right-6 w-16 rotate-[150deg]" seed={3} />
                  </div>
                  <div data-rv><E as="p" multiline path="profile.story" className="di block whitespace-pre-line text-[clamp(22px,2.4vw,30px)] leading-[1.55]">{p.story}</E></div>
                </div>
              </section>
            ),
            details: (p.date || where) && (
              <section className={`${sec} relative mx-auto max-w-5xl`}>
                <Title>{L.details}</Title>
                <div className={`grid gap-6 ${compact ? "" : "md:grid-cols-3"}`}>
                  <Card className="text-center"><p className="cap text-[var(--t-accent)]">{L.when}</p><p className="d mt-3 text-3xl">{date}</p></Card>
                  <Card className="text-center"><p className="cap text-[var(--t-accent)]">{ru ? "Время" : p.language === "hi" ? "समय" : "The hour"}</p><p className="d mt-3 text-3xl">{p.events?.[0]?.time ?? "—"}</p></Card>
                  <Card className="text-center"><p className="cap text-[var(--t-accent)]">{L.where}</p><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-3 block text-3xl">{where}</E></Card>
                </div>
                {cd && <p data-rv className="br inkc mt-10 text-center text-5xl">{cd.d} {L.days}</p>}
              </section>
            ),
            schedule: !!p.events?.length && (
              <section className={`${sec} relative mx-auto max-w-3xl`}>
                <Title>{L.events}</Title>
                <ol className="relative">
                  <div className="absolute bottom-4 left-[18px] top-4 w-px bg-[var(--t-gold)]" />
                  {p.events.map((e, i) => (
                    <li key={i} data-rv className="relative mb-10 pl-14">
                      <Raceme h={34} seed={i + 20} className="absolute left-[10px] top-1 w-4" />
                      <p className="cap text-[var(--t-accent)]">{e.time}</p>
                      <p className="d mt-1 text-3xl md:text-4xl">{e.name}</p>
                      <p className="di mt-1 text-lg text-[var(--t-muted)]">{[formatDate(e.date, p.language), e.venue].filter(Boolean).join(" · ")}</p>
                    </li>
                  ))}
                </ol>
                {calendarUrl && <div data-rv className="text-center"><a href={calendarUrl} className="cap inline-flex rounded-full border border-[var(--t-accent)] px-7 py-3 text-[var(--t-accent)] transition hover:bg-[var(--t-accent)] hover:text-white">{L.calendar}</a></div>}
              </section>
            ),
            venue: where && (
              <section className={`${sec} relative mx-auto max-w-4xl text-center`}>
                <Title>{L.venue}</Title>
                <div data-rv className="relative mx-auto w-full max-w-[420px]">
                  <svg viewBox="0 0 300 260" className="w-full" aria-hidden>
                    <g fill="none" stroke="var(--t-ink)" strokeOpacity=".6" strokeWidth="1">
                      <path d="M20 250V120q0-40 40-40h180q40 0 40 40v130" /><path d="M10 250h280" />
                      {[50, 110, 170, 230].map((x) => <g key={x}><path d={`M${x - 20} 250V140a20 20 0 0 1 40 0v110`} /><path d={`M${x} 120v130M${x - 20} 190h40`} strokeOpacity=".3" /></g>)}
                      <path d="M60 80l90-50 90 50" />
                    </g>
                  </svg>
                  <div className="absolute inset-x-0 -top-4 flex justify-around">{[1, 2, 3, 4, 5].map((i) => <Raceme key={i} h={70 + (i % 3) * 30} seed={i + 30} className="w-10" />)}</div>
                </div>
                <div data-rv><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-6 block text-[clamp(36px,5vw,60px)]">{where}</E></div>
                {p.venue && p.city && <p data-rv className="di text-xl text-[var(--t-muted)]">{p.city}</p>}
                <a data-rv href={mapUrl(p)} target="_blank" rel="noreferrer" className="cap mt-8 inline-flex rounded-full bg-[var(--t-accent)] px-7 py-3 text-white shadow-[0_14px_30px_-14px_rgba(80,40,140,.7)] transition hover:-translate-y-0.5">{L.directions}</a>
              </section>
            ),
            gallery: gallery.length > 0 && (
              <section className={`${sec} relative mx-auto max-w-6xl`}>
                <Title>{L.gallery}</Title>
                <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
                  {gallery.map((k) => (
                    <figure key={k} data-rv className="mb-4 break-inside-avoid overflow-hidden rounded-[3px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover" />
                    </figure>
                  ))}
                </div>
              </section>
            ),
            rsvp: children && (
              <section className={`${sec} relative mx-auto max-w-xl`}>
                <Card>
                  <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 gap-6">{[1, 2, 3].map((i) => <Raceme key={i} h={60 + i * 14} seed={i + 40} className="w-8" />)}</div>
                  <p className="br inkc text-center text-6xl">{L.rsvp}</p>
                  <p className="di mt-1 text-center text-xl text-[var(--t-muted)]">{L.attend}</p>
                  <div className="mt-8">{children}</div>
                </Card>
              </section>
            ),
            info: info && (
              <section className={`${sec} relative mx-auto max-w-2xl text-center`}>
                <Title>{L.info}</Title>
                <E as="p" multiline path="texts.body" className="di block whitespace-pre-line text-2xl leading-relaxed text-[var(--t-muted)]">{info}</E>
              </section>
            ),
          }}
        />
      </main>

      <footer className="relative overflow-hidden pb-14 pt-40 text-center">
        <Wash className="absolute inset-0 -z-0 h-full w-full opacity-70" />
        <Canopy className="absolute inset-x-0 top-0 h-[200px]" count={11} grow={false} seed={9} />
        <div className="relative">
          {p.blessing && <E as="p" path="profile.blessing" className="br inkc block text-5xl">{p.blessing}</E>}
          <p className="br inkc mt-4 text-6xl">{a}{b && <span className="di mx-2 text-2xl">{amp}</span>}{b}</p>
          <p className="cap mt-3 text-[var(--t-muted)]">{date}</p>
          {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
        </div>
      </footer>
    </div>
  );
}
