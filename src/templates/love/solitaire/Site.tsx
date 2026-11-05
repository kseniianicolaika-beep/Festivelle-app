"use client";
import { useRef } from "react";
import gsap from "gsap";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite, occasionLine } from "@/lib/occasions";
import { LENIS_CSS, Sections, Split, labels, mapUrl, media, useCountdown, useLenis, useScrollStage, vars, GRAIN, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { Doorway, Ring, Rule, Silk } from "./art";

// SOLITAIRE — "the hush after yes". A single brilliant on blush silk; the page opens like an iris of light from the stone.
export default function Site({ profile: p, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(p);
  const L = labels(p);
  const cd = useCountdown(p.date, !compact);
  const where = p.venue || p.city || "";
  const date = formatDate(p.date, p.language);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  useLenis(!compact);
  useScrollStage(root, compact, (el) => {
    const ring = el.querySelector(".sol-hero-ring");
    if (ring) gsap.to(ring, { yPercent: 40, rotate: 14, scale: 0.86, ease: "none", scrollTrigger: { trigger: el.querySelector(".sol-hero"), start: "top top", end: "bottom top", scrub: true } });
    el.querySelectorAll(".sol-num").forEach((n) => gsap.from(n, { yPercent: 60, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 85%", once: true } }));
  });

  const H = compact ? "min-h-[600px]" : "min-h-[100svh]";
  const sec = compact ? "px-6 py-16" : "px-6 py-24 md:py-36";
  const tag = (s: string) => <p className="cap mb-8 text-center text-[10px] text-[var(--t-accent)]">{s}</p>;

  return (
    <div ref={root} lang={p.language ?? "en"} style={vars(theme, design, "playfair")} className={`sol ${fontClass} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`}>
      <style href="love-sol" precedence="default">{CSS + LENIS_CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] opacity-70 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />

      {/* ── Intro: silk, a glint, the iris opens from the stone ── */}
      <header data-section="intro" className={`sol-hero relative ${H} overflow-hidden`}>
        <div className={`absolute inset-0 ${compact ? "" : "iris"}`}>
          <Silk className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_38%,rgba(255,255,255,.75),transparent_70%)]" />
        </div>
        {!compact && (
          <div aria-hidden className="flare pointer-events-none absolute left-1/2 top-[30%] z-[2] h-40 w-40 -translate-x-1/2 -translate-y-1/2">
            <svg viewBox="0 0 100 100" className="h-full w-full"><path d="M50 0l3 47 47 3-47 3-3 47-3-47-47-3 47-3Z" fill="#fff" /><circle cx="50" cy="50" r="10" fill="#fff" opacity=".8" /></svg>
          </div>
        )}
        <div className={`relative z-[2] mx-auto flex ${H} max-w-6xl flex-col items-center justify-center px-6 text-center`}>
          <div className="sol-hero-ring">
            <Ring id="sol-hero" className={`ringin ${compact ? "w-28" : "w-36 md:w-48"} drop-shadow-[0_18px_30px_rgba(120,50,70,.18)]`} />
          </div>
          <p className="cap up mt-6 text-[10px] text-[var(--t-muted)]" style={{ animationDelay: "1.3s" }}>{L.engagementOf}</p>
          <h1 className={`d mt-5 leading-[.86] ${compact ? "text-[64px]" : "text-[clamp(72px,11vw,160px)]"}`}>
              <span style={{ fontSize: `${fitName(a, b, 8, false)}em` }}>
            <E path="profile.partner1" className="block"><Split text={a} delay={1.5} /></E>
            {b && <span className="sc fade block text-[0.42em] leading-[1.1] text-[var(--t-accent)]" style={{ animationDelay: "2.1s" }}>{L.and}</span>}
            {b && <E path="profile.partner2" className="block"><Split text={b} delay={1.9} /></E>}
          </span>
            </h1>
          <div className="up mt-8 flex items-center gap-5" style={{ animationDelay: "2.5s" }}>
            <span className="line h-px w-12 bg-[var(--t-gold)] md:w-20" style={{ animationDelay: "2.6s" }} />
            <p className="di text-xl md:text-2xl">{date}</p>
            <span className="line h-px w-12 bg-[var(--t-gold)] md:w-20" style={{ animationDelay: "2.6s" }} />
          </div>
          {where && <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="cap up mt-3 block text-[10px] text-[var(--t-muted)]" style={{ animationDelay: "2.7s" }}>{where}</E>}
        </div>
        {!compact && (
          <div aria-hidden className="fade absolute bottom-8 left-1/2 z-[2] -translate-x-1/2 text-center" style={{ animationDelay: "3.2s" }}>
            <div className="mx-auto h-14 w-px bg-gradient-to-b from-transparent to-[var(--t-gold)]" />
          </div>
        )}
      </header>

      <main className="relative z-[2]">
        <Sections
          design={design}
          render={{
            invitation: (
              <section className={`${sec} mx-auto max-w-5xl`}>
                <div className={`grid items-center gap-12 ${compact ? "" : "md:grid-cols-[.9fr_1.1fr] md:gap-20"}`}>
                  <div data-rv className="relative mx-auto w-full max-w-[360px]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[999px_999px_14px_14px] shadow-[0_40px_80px_-40px_rgba(110,40,60,.45)] ring-1 ring-[var(--t-gold)]/40">
                      {heroUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" data-px="0.12" />
                      ) : (
                        <div data-edit-photo="hero" className="relative h-full w-full"><Silk id="sol-por" className="absolute inset-0 h-full w-full" /><Ring id="sol-por-r" className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
                      )}
                    </div>
                    <div className="absolute -inset-3 -z-10 rounded-[999px_999px_20px_20px] border border-[var(--t-gold)]/40" />
                  </div>
                  <div data-rv className={compact ? "text-center" : "text-center md:text-left"}>
                    <p className="cap mb-6 text-[10px] text-[var(--t-accent)]">{L.invitation}</p>
                    <E as="p" multiline path="profile.inviteLine" className="d block text-[clamp(30px,4.2vw,52px)] leading-[1.12]">{p.inviteLine || occasionInvite(p)}</E>
                    <Rule className={`mt-10 w-48 ${compact ? "mx-auto" : "mx-auto md:mx-0"}`} />
                  </div>
                </div>
              </section>
            ),
            story: p.story && (
              <section className={`${sec} relative mx-auto max-w-4xl text-center`}>
                <span aria-hidden className="sol-num di pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none text-[clamp(160px,26vw,320px)] leading-none text-[var(--t-accent)] opacity-[.08]">“</span>
                <div data-rv>{tag(L.story)}</div>
                <E as="p" multiline path="profile.story" className="di relative block whitespace-pre-line text-[clamp(26px,3.6vw,44px)] leading-[1.3]" >{p.story}</E>
                <div data-rv className="mt-12 flex justify-center"><Ring id="sol-story" glint={false} className="w-16 opacity-80" /></div>
              </section>
            ),
            details: (p.date || where) && (
              <section className={`${sec} mx-auto max-w-5xl`}>
                <div data-rv>{tag(L.details)}</div>
                <div data-rv className="relative overflow-hidden rounded-[6px] bg-[var(--t-surface)] p-10 text-center shadow-[0_30px_80px_-50px_rgba(110,40,60,.5)] md:p-16" style={{ backgroundImage: GRAIN }}>
                  <div className="pointer-events-none absolute inset-3 border border-[var(--t-gold)]/40" />
                  <div className={`grid gap-10 ${compact ? "" : "md:grid-cols-3 md:gap-0 md:divide-x md:divide-[var(--t-gold)]/30"}`}>
                    <div>
                      <p className="cap text-[9px] text-[var(--t-muted)]">{L.when}</p>
                      <p className="d deboss sol-num mt-3 text-6xl md:text-7xl">{p.date ? new Date(p.date + "T12:00:00Z").getUTCDate() : "—"}</p>
                      <p className="di mt-2 text-xl">{date}</p>
                    </div>
                    <div>
                      <p className="cap text-[9px] text-[var(--t-muted)]">{p.language === "ru" ? "Начало" : p.language === "hi" ? "समय" : "The hour"}</p>
                      <p className="d deboss sol-num mt-3 text-6xl md:text-7xl">{p.events?.[0]?.time?.replace(/\s?[ap]m/i, "") ?? "—"}</p>
                      <p className="di mt-2 text-xl">{p.events?.[0]?.name ?? ""}</p>
                    </div>
                    <div>
                      <p className="cap text-[9px] text-[var(--t-muted)]">{L.where}</p>
                      <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-5 block text-3xl leading-tight md:text-4xl">{where}</E>
                      {p.venue && p.city && <E as="p" path="profile.city" className="di mt-2 block text-xl">{p.city}</E>}
                    </div>
                  </div>
                  {cd && (
                    <p className="cap mt-12 text-[10px] text-[var(--t-accent)]">
                      <span className="d mr-2 text-2xl normal-case tracking-normal text-[var(--t-ink)]">{cd.d}</span>{L.days} · <span className="d mx-2 text-2xl normal-case tracking-normal text-[var(--t-ink)]">{cd.h}</span>{L.hrs} · <span className="d mx-2 text-2xl normal-case tracking-normal text-[var(--t-ink)]">{cd.m}</span>{L.min}
                    </p>
                  )}
                </div>
              </section>
            ),
            schedule: !!p.events?.length && (
              <section className={`${sec} mx-auto max-w-3xl`}>
                <div data-rv>{tag(L.events)}</div>
                <ol data-rv-stagger className="divide-y divide-[var(--t-gold)]/30 border-y border-[var(--t-gold)]/30">
                  {p.events.map((e, i) => (
                    <li key={i} className="grid grid-cols-[72px_1fr] items-baseline gap-4 py-8 md:grid-cols-[140px_1fr_auto] md:gap-8">
                      <p className="di text-2xl text-[var(--t-accent)] md:text-3xl">{e.time ?? `0${i + 1}`}</p>
                      <div>
                        <p className="d text-3xl md:text-[40px] md:leading-none">{e.name}</p>
                        {e.venue && <p className="cap mt-3 text-[9px] text-[var(--t-muted)]">{e.venue}</p>}
                      </div>
                      <p className={`di text-lg text-[var(--t-muted)] ${compact ? "col-start-2" : "col-start-2 md:col-start-3"}`}>{formatDate(e.date, p.language)}</p>
                    </li>
                  ))}
                </ol>
                {calendarUrl && <div data-rv className="mt-12 text-center"><a href={calendarUrl} className="cap inline-flex items-center gap-3 border-b border-[var(--t-gold)] pb-2 text-[10px] transition hover:text-[var(--t-accent)]">◇ {L.calendar}</a></div>}
              </section>
            ),
            venue: where && (
              <section className={`${sec} mx-auto max-w-4xl text-center`}>
                <div data-rv>{tag(L.venue)}</div>
                <Doorway className="mx-auto w-40 md:w-52" />
                <div data-rv><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-8 block text-[clamp(40px,6vw,76px)] leading-none">{where}</E></div>
                {p.venue && p.city && <p data-rv className="di mt-3 text-2xl text-[var(--t-muted)]">{p.city}</p>}
                <a data-rv href={mapUrl(p)} target="_blank" rel="noreferrer" className="cap mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--t-gold)]/70 px-7 py-3.5 text-[10px] transition hover:bg-[var(--t-surface)]">{L.directions} →</a>
              </section>
            ),
            gallery: gallery.length > 0 && (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <div data-rv>{tag(L.gallery)}</div>
                <div className={`grid gap-4 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-6"}`}>
                  {gallery.map((k, i) => (
                    <figure key={k} data-rv className={`overflow-hidden rounded-[3px] ring-1 ring-[var(--t-gold)]/30 ${compact ? "" : ["md:col-span-3 md:row-span-2", "md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2"][i % 6]}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-[1.4s] hover:scale-[1.04]" />
                    </figure>
                  ))}
                </div>
              </section>
            ),
            rsvp: children && (
              <section className={`${sec} mx-auto max-w-xl`}>
                <div data-rv className="relative bg-[var(--t-surface)] px-7 py-12 shadow-[0_40px_90px_-50px_rgba(110,40,60,.55)] md:px-12" style={{ backgroundImage: GRAIN }}>
                  <div className="pointer-events-none absolute inset-2.5 border border-[var(--t-gold)]/35" />
                  <div className="relative text-center">
                    <Ring id="sol-rsvp" glint={false} className="mx-auto mb-4 w-12" />
                    <p className="d text-4xl md:text-5xl">{L.rsvp}</p>
                    <p className="di mt-2 text-lg text-[var(--t-muted)]">{L.attend}</p>
                  </div>
                  <div className="relative mt-8">{children}</div>
                </div>
              </section>
            ),
            info: info && (
              <section className={`${sec} mx-auto max-w-2xl text-center`}>
                <div data-rv>{tag(L.info)}</div>
                <E as="p" multiline path="texts.body" className="di block whitespace-pre-line text-2xl leading-relaxed text-[var(--t-muted)]">{info}</E>
              </section>
            ),
          }}
        />
      </main>

      <footer className="relative z-[2] overflow-hidden pb-16 pt-20 text-center">
        <Silk id="sol-foot" className="absolute inset-0 -z-10 h-full w-full opacity-70" />
        <div data-rv className="relative mx-auto flex h-36 w-36 items-center justify-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden><circle cx="50" cy="50" r="47" fill="none" stroke="var(--t-gold)" strokeWidth=".5" /><circle cx="50" cy="50" r="43" fill="none" stroke="var(--t-gold)" strokeWidth=".3" strokeDasharray=".6 1.6" /><path d="M50 1l2 3-2 3-2-3Z" fill="var(--t-gold)" /></svg>
          <p className="d foil text-5xl">{a[0]}<span className="sc mx-1 text-3xl text-[var(--t-accent)]">&amp;</span>{b?.[0]}</p>
        </div>
        {p.blessing && <E as="p" path="profile.blessing" className="sc mt-8 block text-4xl text-[var(--t-accent)]">{p.blessing}</E>}
        <p className="cap mt-6 text-[9px] text-[var(--t-muted)]">{occasionLine(p)} · {date}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
