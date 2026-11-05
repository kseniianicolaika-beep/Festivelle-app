"use client";
import { useRef } from "react";
import gsap from "gsap";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { GRAIN, LENIS_CSS, Sections, labels, mapUrl, media, useCountdown, useLenis, useScrollStage, vars, fitName } from "../_shared/kit";
import { CSS, Sunset, fontClass } from "./art";

const yesWord = (lang?: string) => (lang === "ru" ? "ДА." : lang === "hi" ? "हाँ!" : "YES.");

// SHE SAID YES — the proposal photo, full-bleed and cinematic. Letterbox bars pull open, a giant YES. stamps down,
// and the date lands in bold. The rest scrolls like the credits of their own film.
export default function Site({ profile: p, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(p);
  const L = labels(p);
  const cd = useCountdown(p.date, !compact);
  const where = p.venue || p.city || "";
  const date = formatDate(p.date, p.language);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const ru = p.language === "ru", hi = p.language === "hi";
  const amp = ru ? "и" : "&";
  const dd = p.date ? `${p.date.slice(8, 10)}.${p.date.slice(5, 7)}.${p.date.slice(2, 4)}` : "";
  const mon = p.date ? new Date(p.date + "T12:00:00Z").toLocaleDateString(ru ? "ru-RU" : hi ? "hi-IN" : "en-GB", { month: "short", timeZone: "UTC" }).replace(".", "") : "";
  useLenis(!compact);
  useScrollStage(root, compact, (el) => {
    const img = el.querySelector(".sy-hero-img");
    if (img) gsap.to(img, { yPercent: 18, scale: 1.12, ease: "none", scrollTrigger: { trigger: el.querySelector(".sy-hero"), start: "top top", end: "bottom top", scrub: true } });
    const yes = el.querySelector(".sy-yes");
    if (yes) gsap.to(yes, { yPercent: -60, opacity: 0, ease: "none", scrollTrigger: { trigger: el.querySelector(".sy-hero"), start: "30% top", end: "bottom top", scrub: true } });
    el.querySelectorAll<HTMLElement>(".sy-marquee").forEach((m) => gsap.to(m, { xPercent: -30, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } }));
  });

  const sec = compact ? "px-6 py-14" : "px-6 py-20 md:px-12 md:py-28";
  const Kicker = ({ n, children: c }: { n: string; children: React.ReactNode }) => (
    <div data-rv className="mb-10 flex items-baseline gap-4 border-b-2 border-[var(--t-ink)] pb-3">
      <span className="d text-2xl text-[var(--t-accent)]">{n}</span>
      <p className="m text-[11px]">{c}</p>
    </div>
  );

  return (
    <div ref={root} lang={p.language ?? "en"} style={vars(theme, design, "modern")} className={`sy ${fontClass} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`}>
      <style href="love-sy" precedence="default">{CSS + LENIS_CSS}</style>

      {/* ── Intro: full-bleed, letterbox, YES. ── */}
      <header data-section="intro" className={`sy-hero relative overflow-hidden bg-black text-[#fff6ea] ${compact ? "h-[640px]" : "h-[100svh] min-h-[560px]"}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="sy-hero-img absolute inset-0">
          {heroUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img data-edit-photo="hero" src={heroUrl} alt="" className={`h-full w-full object-cover ${compact ? "" : "ken"}`} />
          ) : (
            <div data-edit-photo="hero" className="h-full w-full"><Sunset className={`h-full w-full ${compact ? "" : "ken"}`} /></div>
          )}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25),transparent_30%,transparent_55%,rgba(30,10,10,.75))]" />
          <div aria-hidden className="filmgrain pointer-events-none absolute -inset-[10%] opacity-50 mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
        </div>
        <div className="sy-yes absolute inset-0 z-[2] flex flex-col items-center justify-center px-5 text-center">
          <p className="d stamp sun select-none text-[clamp(110px,26vw,380px)] drop-shadow-[0_10px_40px_rgba(0,0,0,.35)]">{yesWord(p.language)}</p>
        </div>
        <div className={`absolute inset-x-0 z-[3] flex flex-col items-start gap-3 px-5 md:px-10 ${compact ? "" : "md:flex-row md:items-end md:justify-between"} ${compact ? "bottom-[12%]" : "bottom-[13%]"}`}>
          <div className="up" style={{ animationDelay: "2.3s" }}>
            <h1 className={`d ${compact ? "text-4xl" : "text-[clamp(40px,6vw,96px)]"}`}>
              <span style={{ fontSize: `${fitName(a, b, 7, true)}em` }}>
              <E path="profile.partner1">{a}</E>{b && <span className="it mx-2 text-[.5em] text-[#ffcf88]">{amp}</span>}{b && <E path="profile.partner2">{b}</E>}
            </span>
            </h1>
            <p className="m mt-3 text-[10px] text-[#ffcf88]">{L.saidYes}</p>
          </div>
          {dd && <p className={`d outline up md:text-right ${compact ? "text-4xl" : "text-[clamp(44px,7vw,120px)]"}`} style={{ animationDelay: "2.5s" }}>{dd}</p>}
        </div>
        {/* letterbox bars */}
        <div className={`absolute inset-x-0 top-0 z-[4] flex items-end justify-between bg-black px-5 pb-2 md:px-10 ${compact ? "" : "bar"}`} style={{ height: "9%" }}>
          <p className="m text-[9px] text-white/70">{hi ? "दृश्य 01" : ru ? "Сцена 01" : "Scene 01"} — <E path={p.venue ? "profile.venue" : "profile.city"}>{where}</E></p>
          <p className="m hidden text-[9px] text-white/70 sm:block">{p.city}</p>
        </div>
        <div className={`absolute inset-x-0 bottom-0 z-[4] flex items-start justify-between bg-black px-5 pt-2 md:px-10 ${compact ? "" : "bar"}`} style={{ height: "9%" }}>
          <p className="m text-[9px] text-white/70">{date}</p>
          <p className="m text-[9px] text-[#ffcf88]">{occasionLineShort(p.language)}</p>
        </div>
      </header>

      <main className="relative z-[2]">
        <Sections
          design={design}
          render={{
            invitation: (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <div data-rv><E as="p" multiline path="profile.inviteLine" className="d block text-[clamp(40px,7vw,104px)]">{p.inviteLine || occasionInvite(p)}</E></div>
                <div data-rv className="mt-10 flex flex-wrap items-center gap-4">
                  <span className="h-[2px] w-16 bg-[var(--t-accent)]" />
                  <p className="it text-xl md:text-2xl">{a} {amp} {b} · {date}</p>
                </div>
              </section>
            ),
            story: p.story && (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <Kicker n="01">{L.story}</Kicker>
                <div className={`grid items-center gap-10 ${compact ? "" : "md:grid-cols-[1fr_1.2fr]"}`}>
                  <div data-rv className="relative aspect-[4/5] overflow-hidden bg-black">
                    <Sunset className="h-full w-full" />
                    <div className="absolute inset-x-0 top-0 h-[8%] bg-black" /><div className="absolute inset-x-0 bottom-0 h-[8%] bg-black" />
                    <p className="m absolute bottom-[10%] left-4 text-[9px] text-white/80">{p.city}</p>
                  </div>
                  <div data-rv><E as="p" multiline path="profile.story" className="it block whitespace-pre-line text-[clamp(24px,2.8vw,36px)] leading-[1.35]">{p.story}</E></div>
                </div>
              </section>
            ),
            details: (p.date || where) && (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <Kicker n="02">{L.details}</Kicker>
                <div className={`grid gap-10 ${compact ? "" : "md:grid-cols-[1.3fr_1fr]"}`}>
                  <div data-rv className="flex items-end gap-4">
                    <p className="d sun text-[clamp(140px,22vw,300px)]">{p.date?.slice(8, 10)}</p>
                    <div className="pb-4">
                      <p className="d text-[clamp(40px,6vw,80px)] uppercase">{mon}</p>
                      <p className="d outline text-[clamp(40px,6vw,80px)] [--ol:var(--t-ink)]">{p.date?.slice(0, 4)}</p>
                    </div>
                  </div>
                  <div data-rv className="flex flex-col justify-end gap-6 border-l-2 border-[var(--t-ink)] pl-6">
                    <div><p className="m text-[10px] text-[var(--t-accent)]">{L.when}</p><p className="d mt-2 text-3xl">{p.events?.[0]?.time ?? date}</p></div>
                    <div><p className="m text-[10px] text-[var(--t-accent)]">{L.where}</p><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-2 block text-3xl">{where}</E>{p.venue && p.city && <p className="it text-lg">{p.city}</p>}</div>
                    {cd && <div><p className="m text-[10px] text-[var(--t-accent)]">{L.until}</p><p className="d mt-2 text-5xl tabular-nums">{cd.d}<span className="it ml-2 text-lg">{L.days}</span></p></div>}
                  </div>
                </div>
              </section>
            ),
            schedule: !!p.events?.length && (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <Kicker n="03">{L.events}</Kicker>
                <ol data-rv-stagger>
                  {p.events.map((e, i) => (
                    <li key={i} className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-[var(--t-ink)]/25 py-6 md:grid-cols-[220px_1fr_auto]">
                      <p className="d text-4xl text-[var(--t-accent)] md:text-6xl">{e.time}</p>
                      <p className="d text-2xl md:text-4xl">{e.name}</p>
                      <p className="it col-span-2 mt-1 text-[var(--t-muted)] md:col-span-1 md:mt-0">{[formatDate(e.date, p.language), e.venue].filter(Boolean).join(" · ")}</p>
                    </li>
                  ))}
                </ol>
                {calendarUrl && <div data-rv className="mt-10"><a href={calendarUrl} className="m inline-flex bg-[var(--t-ink)] px-7 py-4 text-[11px] text-[var(--t-bg)] transition hover:bg-[var(--t-accent)]">{L.calendar} →</a></div>}
              </section>
            ),
            venue: where && (
              <section className="relative overflow-hidden bg-[#1d0f17] text-[#fff6ea]">
                <Sunset className="absolute inset-0 h-full w-full opacity-80" />
                <div className={`relative mx-auto flex max-w-6xl flex-col justify-end ${compact ? "min-h-[420px] px-6 py-12" : "min-h-[80vh] px-6 py-20 md:px-12"}`}>
                  <p data-rv className="m text-[11px] text-[#ffcf88]">04 — {L.venue}</p>
                  <div data-rv><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-4 block text-[clamp(56px,11vw,170px)]">{where}</E></div>
                  {p.venue && p.city && <p data-rv className="it text-2xl">{p.city}</p>}
                  <a data-rv href={mapUrl(p)} target="_blank" rel="noreferrer" className="m mt-8 inline-flex w-fit bg-[#fff6ea] px-7 py-4 text-[11px] text-[#1d0f17] transition hover:bg-[#ffcf88]">{L.directions} →</a>
                </div>
              </section>
            ),
            gallery: gallery.length > 0 && (
              <section className={`${compact ? "py-12" : "py-20"} overflow-hidden bg-black`}>
                <div className="flex snap-x gap-3 overflow-x-auto px-6 pb-2">
                  {gallery.map((k) => (
                    <figure key={k} className="relative shrink-0 snap-center bg-black px-0 py-5" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #3a3a3a 35%, transparent 38%)", backgroundSize: "18px 14px", backgroundRepeat: "repeat-x", backgroundPosition: "0 2px, 0 100%" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className={`${compact ? "h-56" : "h-[52vh]"} w-auto object-cover`} />
                    </figure>
                  ))}
                </div>
              </section>
            ),
            rsvp: children && (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <div className={`grid gap-10 ${compact ? "" : "md:grid-cols-2"}`}>
                  <div data-rv>
                    <p className="d sun text-[clamp(90px,14vw,200px)]">RSVP</p>
                    <p className="it mt-2 text-2xl">{L.attend}</p>
                  </div>
                  <div data-rv className="border-2 border-[var(--t-ink)] bg-[var(--t-surface)] p-7 shadow-[10px_10px_0_var(--t-accent)] md:p-10">{children}</div>
                </div>
              </section>
            ),
            info: info && (
              <section className={`${sec} mx-auto max-w-4xl`}>
                <Kicker n="05">{L.info}</Kicker>
                <E as="p" multiline path="texts.body" className="it block whitespace-pre-line text-2xl leading-relaxed">{info}</E>
              </section>
            ),
          }}
        />
      </main>

      <footer className="relative overflow-hidden bg-black pb-12 pt-16 text-center text-[#fff6ea]">
        <div className="sy-marquee whitespace-nowrap"><p className="d sun text-[clamp(70px,14vw,200px)]">{Array.from({ length: 4 }, () => `${yesWord(p.language)} `).join("")}</p></div>
        {p.blessing && <E as="p" path="profile.blessing" className="it mt-6 block text-2xl text-[#ffcf88]">{p.blessing}</E>}
        <p className="m mt-6 text-[10px] text-white/70">{a} {amp} {b} · {L.toWedding}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-white/50">{credit}</div>}
      </footer>
    </div>
  );
}

function occasionLineShort(lang?: string) {
  return lang === "ru" ? "Мы помолвлены" : lang === "hi" ? "हमारी सगाई" : "We're engaged";
}
