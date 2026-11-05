"use client";
import { useRef } from "react";
import gsap from "gsap";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { LENIS_CSS, Sections, Split, labels, mapUrl, media, useCountdown, useLenis, useScrollStage, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { Corner, Fan, Glass, Sunburst, Tower, velvet } from "./art";
import { Bubbles } from "./Bubbles";

export function Candle({ className = "", h = 120 }: { className?: string; h?: number }) {
  return (
    <svg viewBox={`0 0 30 ${h}`} className={className} aria-hidden>
      <defs>
        <radialGradient id="ct-halo"><stop offset="0" stopColor="#ffd98a" stopOpacity=".55" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
        <linearGradient id="ct-wax" x1="0" x2="1"><stop offset="0" stopColor="#d9cbb3" /><stop offset=".4" stopColor="#fff8ea" /><stop offset="1" stopColor="#bfae92" /></linearGradient>
      </defs>
      <circle cx="15" cy="14" r="14" fill="url(#ct-halo)" />
      <path className="flick" d="M15 4c3 5 5 8 5 11a5 5 0 0 1-10 0c0-3 2-6 5-11Z" fill="#ffe7a8" />
      <path className="flick" d="M15 10c1.4 2.4 2.2 3.6 2.2 5a2.2 2.2 0 0 1-4.4 0c0-1.4.8-2.6 2.2-5Z" fill="#fff" />
      <path d="M15 19v4" stroke="#3a2a1a" strokeWidth="1" />
      <rect x="9" y="23" width="12" height={h - 30} rx="1.5" fill="url(#ct-wax)" />
      <rect x="5" y={h - 8} width="20" height="4" rx="1" fill="var(--t-gold)" />
      <rect x="8" y={h - 4} width="14" height="4" fill="var(--t-gold)" opacity=".7" />
    </svg>
  );
}

const Frame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative border border-[var(--t-gold)]/50 ${className}`}>
    <div className="pointer-events-none absolute inset-2 border border-[var(--t-gold)]/20" />
    <Corner className="absolute -left-px -top-px w-10" />
    <Corner className="absolute -right-px -top-px w-10 rotate-90" />
    <Corner className="absolute -bottom-px -right-px w-10 rotate-180" />
    <Corner className="absolute -bottom-px -left-px w-10 -rotate-90" />
    {children}
  </div>
);

// CHAMPAGNE TOAST — black tie, candlelight and a tower of coupes. Velvet curtains part on a pour of champagne.
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
  useLenis(!compact);
  useScrollStage(root, compact, (el) => {
    const t = el.querySelector(".ct-hero-tower");
    if (t) gsap.to(t, { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: { trigger: el.querySelector(".ct-hero"), start: "top top", end: "bottom top", scrub: true } });
    const sb = el.querySelector(".ct-hero-sun");
    if (sb) gsap.to(sb, { rotate: 6, opacity: 0.4, ease: "none", scrollTrigger: { trigger: el.querySelector(".ct-hero"), start: "top top", end: "bottom top", scrub: true } });
  });

  const H = compact ? "min-h-[640px]" : "min-h-[100svh]";
  const sec = compact ? "px-6 py-16" : "px-6 py-24 md:py-32";
  const Title = ({ children }: { children: React.ReactNode }) => (
    <div data-rv className="mb-12 flex flex-col items-center gap-4 text-center">
      <Fan className="w-16" />
      <p className="k text-[11px] text-[var(--t-gold)]">{children}</p>
    </div>
  );

  return (
    <div ref={root} lang={p.language ?? "en"} style={vars(theme, design, "deco")} className={`ct ${fontClass} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`}>
      <style href="love-ct" precedence="default">{CSS + LENIS_CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: "repeating-linear-gradient(45deg,var(--t-gold) 0 1px,transparent 1px 22px),repeating-linear-gradient(-45deg,var(--t-gold) 0 1px,transparent 1px 22px)" }} />

      {/* ── Intro ── */}
      <header data-section="intro" className={`ct-hero relative ${H} overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_70%,rgba(255,200,120,.16),transparent_70%)]" />
        <Sunburst className="ct-hero-sun absolute inset-x-0 bottom-0 h-[62%] w-full origin-bottom opacity-70" />
        {compact ? null : <Bubbles className="absolute inset-0 z-[3]" count={140} />}
        <div className={`relative z-[2] mx-auto flex ${H} max-w-6xl flex-col items-center justify-center px-6 pb-10 text-center`}>
          <p className="k fade text-[11px] text-[var(--t-muted)]" style={{ animationDelay: "2s" }}>{L.engagementOf}</p>
          <h1 className={`d mt-6 leading-[.95] ${compact ? "text-[46px]" : "text-[clamp(52px,8vw,120px)]"}`}>
              <span style={{ fontSize: `${fitName(a, b, 6, false)}em` }}>
            <E path="profile.partner1" className={`block ${compact ? "" : "md:inline"}`}><Split text={a} cls="track gold inline-block" delay={2.1} step={0.05} /></E>
            {b && <span className={`i fade block text-[.5em] normal-case leading-[1.2] tracking-normal text-[var(--t-accent)] ${compact ? "" : "md:mx-[.4em] md:inline"}`} style={{ animationDelay: "2.6s" }}>{ru ? "и" : "&"}</span>}
            {b && <E path="profile.partner2" className={`block ${compact ? "" : "md:inline"}`}><Split text={b} cls="track gold inline-block" delay={2.4} step={0.05} /></E>}
          </span>
            </h1>
          <div className={`ct-hero-tower relative mt-6 flex items-end justify-center gap-6 ${compact ? "" : "md:gap-14"}`}>
            <Candle className={`rise ${compact ? "w-5" : "w-6 md:w-8"}`} h={110} />
            <Tower id="ct-hero" className={`rise ${compact ? "w-52" : "w-56 md:w-72"}`} />
            <Candle className={`rise ${compact ? "w-5" : "w-6 md:w-8"}`} h={90} />
          </div>
          <div className="up mt-8 flex items-center gap-5" style={{ animationDelay: "3s" }}>
            <span className="rule w-14 md:w-24" />
            <p className="k text-[12px] md:text-sm">{date}</p>
            <span className="rule w-14 md:w-24" />
          </div>
          {where && <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="i up mt-2 block text-xl text-[var(--t-muted)]" style={{ animationDelay: "3.1s" }}>{where}</E>}
        </div>
        {!compact && (
          <>
            <div aria-hidden className="cl pointer-events-none absolute inset-y-0 left-0 z-[5] w-1/2" style={velvet("l")}><div className="absolute bottom-[30%] right-6 h-3 w-16 rounded-full bg-[var(--t-gold)] opacity-80" /></div>
            <div aria-hidden className="cr pointer-events-none absolute inset-y-0 right-0 z-[5] w-1/2" style={velvet("r")}><div className="absolute bottom-[30%] left-6 h-3 w-16 rounded-full bg-[var(--t-gold)] opacity-80" /></div>
          </>
        )}
      </header>

      <main className="relative z-[2]">
        <Sections
          design={design}
          render={{
            invitation: (
              <section className={`${sec} mx-auto max-w-4xl`}>
                <Frame className="px-8 py-16 text-center md:px-20 md:py-24">
                  <div data-rv>
                    <Glass className="mx-auto mb-8 w-16" />
                    <E as="p" multiline path="profile.inviteLine" className="i block text-[clamp(28px,4vw,48px)] leading-[1.2]">{p.inviteLine || occasionInvite(p)}</E>
                    <p className="k mt-10 text-[11px] text-[var(--t-gold)]">{ru ? "Чёрный галстук" : hi ? "ब्लैक टाई" : "Black tie · Candlelight · Champagne"}</p>
                  </div>
                </Frame>
              </section>
            ),
            story: p.story && (
              <section className={`${sec} mx-auto max-w-5xl`}>
                <Title>{L.story}</Title>
                <div className={`grid items-center gap-12 ${compact ? "" : "md:grid-cols-[1fr_1.2fr]"}`}>
                  <div data-rv className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-t-full border border-[var(--t-gold)]/60 p-2">
                    <div className="h-full w-full overflow-hidden rounded-t-full">
                      {heroUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover [filter:sepia(.25)_contrast(1.05)]" />
                      ) : (
                        <div data-edit-photo="hero" className="flex h-full w-full items-end justify-center bg-[radial-gradient(circle_at_50%_70%,rgba(255,200,120,.2),transparent_70%)] pb-8"><Tower id="ct-por" className="w-3/4" pour={false} /></div>
                      )}
                    </div>
                  </div>
                  <div data-rv>
                    <E as="p" multiline path="profile.story" className="i block whitespace-pre-line text-[clamp(24px,2.6vw,34px)] leading-[1.45] first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--ct-display)] first-letter:text-[3.4em] first-letter:not-italic first-letter:leading-[.8] first-letter:text-[var(--t-gold)]">{p.story}</E>
                  </div>
                </div>
              </section>
            ),
            details: (p.date || where) && (
              <section className={`${sec} mx-auto max-w-5xl`}>
                <Title>{L.details}</Title>
                <div data-rv-stagger className={`grid gap-5 ${compact ? "" : "md:grid-cols-3"}`}>
                  {[
                    [L.when, date, p.date ? new Date(p.date + "T12:00:00Z").toLocaleDateString(ru ? "ru-RU" : hi ? "hi-IN" : "en-GB", { weekday: "long", timeZone: "UTC" }) : ""],
                    [ru ? "Время" : hi ? "समय" : "The hour", p.events?.[0]?.time ?? "", p.events?.[0]?.name ?? ""],
                    [L.where, where, p.venue && p.city ? p.city : ""],
                  ].map(([k, v, sub], i) => (
                    <Frame key={i} className="bg-[var(--t-surface)]/70 px-6 py-12 text-center">
                      <p className="k text-[10px] text-[var(--t-gold)]">{k}</p>
                      <p className="d mt-5 text-[28px] leading-tight">{i === 2 ? <E path={p.venue ? "profile.venue" : "profile.city"}>{v}</E> : v}</p>
                      {sub && <p className="i mt-2 text-lg capitalize text-[var(--t-muted)]">{sub}</p>}
                    </Frame>
                  ))}
                </div>
                {cd && (
                  <div data-rv className="mt-14 flex justify-center gap-5 text-center md:gap-14">
                    {[[cd.d, L.days], [cd.h, L.hrs], [cd.m, L.min], [cd.s, L.sec]].map(([n, l], i) => (
                      <div key={i}><p className="d gold text-4xl tabular-nums md:text-6xl">{String(n).padStart(2, "0")}</p><p className="k mt-2 text-[9px] text-[var(--t-muted)]">{l}</p></div>
                    ))}
                  </div>
                )}
              </section>
            ),
            schedule: !!p.events?.length && (
              <section className={`${sec} mx-auto max-w-3xl`}>
                <Title>{L.events}</Title>
                <ol data-rv-stagger className="relative">
                  {p.events.map((e, i) => (
                    <li key={i} className="grid grid-cols-[112px_1fr] items-center gap-4 border-t border-[var(--t-gold)]/25 py-8 last:border-b md:grid-cols-[160px_1fr]">
                      <p className="d gold whitespace-nowrap text-2xl md:text-4xl">{e.time ?? `0${i + 1}`}</p>
                      <div>
                        <p className="i text-3xl md:text-4xl">{e.name}</p>
                        <p className="k mt-2 text-[10px] text-[var(--t-muted)]">{[formatDate(e.date, p.language), e.venue].filter(Boolean).join(" · ")}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                {calendarUrl && <div data-rv className="mt-12 text-center"><a href={calendarUrl} className="k inline-flex border border-[var(--t-gold)]/70 px-7 py-3.5 text-[10px] text-[var(--t-gold)] transition hover:bg-[var(--t-gold)] hover:text-[var(--t-bg)]">{L.calendar}</a></div>}
              </section>
            ),
            venue: where && (
              <section className={`${sec} relative mx-auto max-w-4xl overflow-hidden text-center`}>
                <Sunburst className="absolute inset-x-0 top-0 h-[60%] w-full opacity-50" rays={28} />
                <div className="relative">
                  <Title>{L.venue}</Title>
                  <div data-rv><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d gold block text-[clamp(40px,7vw,88px)] leading-none">{where}</E></div>
                  {p.venue && p.city && <p data-rv className="i mt-4 text-2xl text-[var(--t-muted)]">{p.city}</p>}
                  <a data-rv href={mapUrl(p)} target="_blank" rel="noreferrer" className="k mt-10 inline-flex border border-[var(--t-gold)]/70 px-7 py-3.5 text-[10px] text-[var(--t-gold)] transition hover:bg-[var(--t-gold)] hover:text-[var(--t-bg)]">{L.directions}</a>
                </div>
              </section>
            ),
            gallery: gallery.length > 0 && (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <Title>{L.gallery}</Title>
                <div className={`grid gap-5 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
                  {gallery.map((k, i) => (
                    <figure key={k} data-rv className={`overflow-hidden border border-[var(--t-gold)]/50 p-1.5 ${i % 2 ? "rounded-t-full md:translate-y-10" : "rounded-t-full"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-t-full object-cover" />
                    </figure>
                  ))}
                </div>
              </section>
            ),
            rsvp: children && (
              <section className={`${sec} mx-auto max-w-xl`}>
                <Frame className="bg-[var(--t-surface)] px-7 py-14 md:px-12">
                  <div className="relative text-center">
                    <Glass className="mx-auto mb-4 w-14" />
                    <p className="d gold text-4xl">{L.rsvp}</p>
                    <p className="i mt-2 text-xl text-[var(--t-muted)]">{L.attend}</p>
                  </div>
                  <div className="relative mt-8">{children}</div>
                </Frame>
              </section>
            ),
            info: info && (
              <section className={`${sec} mx-auto max-w-2xl text-center`}>
                <Title>{L.info}</Title>
                <E as="p" multiline path="texts.body" className="i block whitespace-pre-line text-2xl leading-relaxed text-[var(--t-muted)]">{info}</E>
              </section>
            ),
          }}
        />
      </main>

      <footer className="relative z-[2] pb-16 pt-16 text-center">
        <div data-rv className="flex items-end justify-center gap-2"><Glass className="w-14 -rotate-12" /><Glass className="w-14 rotate-12" /></div>
        {p.blessing && <E as="p" path="profile.blessing" className="i mt-6 block text-3xl text-[var(--t-accent)]">{p.blessing}</E>}
        <p className="d gold mt-6 text-3xl">{a}{b && <span className="i mx-3 normal-case text-[var(--t-accent)]">&amp;</span>}{b}</p>
        <p className="k mt-3 text-[10px] text-[var(--t-muted)]">{date}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
