"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Module, GridLines, SG_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, bizLine, agendaOf } from "../_shared/words";

export const SG_VARS = { "--t-bg": "#f6efe4", "--t-surface": "#fffaf2", "--t-ink": "#231a1c", "--t-muted": "#7a6a66", "--t-accent": "#7d1d3a", "--t-gold": "#d9b57a" };

function Head({ n, title }: { n: number; title: string }) {
  return (
    <div data-r className="mb-10 grid grid-cols-[3rem_1fr] items-start gap-4 md:mb-14 md:grid-cols-[8rem_1fr]">
      <span className="pt-2 text-sm font-semibold tabular-nums text-[var(--t-accent)]" style={{ fontFamily: F.unb }}>{String(n).padStart(2, "0")}</span>
      <h2 className="text-[2.2rem] font-semibold uppercase leading-[0.95] tracking-[-0.03em] md:text-[3.6rem]" style={{ fontFamily: F.unb }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [name] = nameParts(profile);
  const L = words(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const agenda = agendaOf(profile);
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.15 })
      .from(q("[data-gridline]"), { scaleY: 0, transformOrigin: "50% 0%", stagger: 0.04, duration: 1.1, ease: "power3.inOut" })
      .from(q("[data-tile]"), { scale: 0, rotate: -90, stagger: { each: 0.05, from: "random" }, duration: 0.9, ease: "back.out(1.6)" }, "<.3")
      .from(q("[data-hero-in]"), { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "power4.out" }, "<.2");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} sg-paper relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("summit-grid", theme, design, SG_VARS), fontFamily: F.montserrat }}>
      <style href="biz-sg" precedence="default">{SG_CSS}</style>

      <header className={`relative overflow-hidden px-5 md:px-12 ${compact ? "pb-12 pt-10" : "flex min-h-[100svh] flex-col justify-between pb-12 pt-10"}`}>
        <GridLines className="mx-5 md:mx-12" cols={compact ? 4 : 12} />
        <div data-hero-in className="relative flex items-center justify-between border-b-2 border-[var(--t-ink)] pb-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
          <span>{bizLine(profile)}</span>
          <span className="text-[var(--t-accent)]">{L.invited}</span>
        </div>
        <div className={`relative ${compact ? "mt-8" : "mt-10 grid items-end gap-10 md:grid-cols-[1.35fr_1fr]"}`}>
          <h1 className={`font-semibold uppercase leading-[0.86] tracking-[-0.05em] ${compact ? "text-[46px]" : "text-[clamp(3.2rem,9vw,8.4rem)]"}`} style={{ fontFamily: F.unb }}>
            <E path="profile.partner1">{name}</E>
          </h1>
          <Module className={compact ? "mt-8 w-[70%]" : "w-full max-w-[460px] justify-self-end"} />
        </div>
        <div data-hero-in className={`relative grid gap-6 border-t-2 border-[var(--t-ink)] pt-5 ${compact ? "mt-8 grid-cols-2" : "mt-10 grid-cols-2 md:grid-cols-4"}`}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--t-muted)]">{L.when}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums tracking-[-0.03em] md:text-4xl" style={{ fontFamily: F.unb }}>{dp ? `${dp.dd}.${dp.mm}` : fmt(profile)}</p>
            {dp && <p className="text-sm capitalize text-[var(--t-muted)]">{dp.weekday} · {dp.year}</p>}
          </div>
          {venue && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--t-muted)]">{L.where}</p>
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-1 block text-lg font-semibold leading-tight">{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <p className="text-sm text-[var(--t-muted)]">{profile.city}</p>}
            </div>
          )}
        </div>
      </header>

      <Sections
        design={design}
        className="relative mx-auto max-w-6xl px-5 md:px-12"
        render={{
          invitation: (
            <section className="relative grid gap-8 py-20 md:grid-cols-[8rem_1fr] md:py-28">
              <span className="hidden h-3 w-16 bg-[var(--t-accent)] md:block" />
              <div>
                <E as="p" multiline path="profile.inviteLine" className="block max-w-4xl text-[1.9rem] font-medium leading-[1.2] tracking-[-0.02em] md:text-[3rem]" style={{ fontFamily: F.unb }}>{profile.inviteLine || occasionInvite(profile)}</E>
                {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="mt-10 inline-flex items-baseline gap-3 bg-[var(--t-accent)] px-5 py-3 text-[#f6efe4]"><span className="text-4xl font-semibold tabular-nums" style={{ fontFamily: F.unb }}>{d}</span><span className="text-[11px] font-semibold uppercase tracking-[0.25em]">{L.days}</span></p>}</Countdown>}
              </div>
            </section>
          ),
          story: (profile.story || heroUrl) ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.about} />
              <div className="grid gap-10 md:grid-cols-[8rem_1fr_1fr]">
                <span className="hidden md:block" />
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.2rem] leading-[1.7] md:text-[1.3rem]">{profile.story}</E>}
                <div data-r className="relative aspect-square overflow-hidden bg-[#e9b8b4]">
                  <HeroPhoto url={heroUrl} className="h-full w-full object-cover grayscale contrast-110 mix-blend-multiply" />
                </div>
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.details} />
              <div className="grid border-l-2 border-t-2 border-[var(--t-ink)] md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? dp.dayMonth : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.time, v: agenda[0]?.detail ?? "", s: agenda[0]?.title ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.08} className="border-b-2 border-r-2 border-[var(--t-ink)] p-6 md:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--t-accent)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-6 block text-[1.7rem] font-semibold leading-tight tracking-[-0.02em]" style={{ fontFamily: F.unb }}>{x.v}</E> : <p className="mt-6 text-[1.7rem] font-semibold leading-tight tracking-[-0.02em]" style={{ fontFamily: F.unb }}>{x.v}</p>}
                    {x.s && <p className="mt-1 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <a data-r href={calendarUrl} className="mt-8 inline-block border-2 border-[var(--t-ink)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:bg-[var(--t-ink)] hover:text-[var(--t-bg)]">{L.calendar} ↗</a>}
            </section>
          ) : null,
          schedule: agenda.length ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.agenda} />
              <ol className="border-t-2 border-[var(--t-ink)]">
                {agenda.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.05} className="group grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 border-b border-[var(--t-ink)]/20 py-5 transition-colors hover:bg-[var(--t-accent)] hover:text-[#f6efe4] md:grid-cols-[8rem_1fr_auto] md:py-6">
                    <span className="pl-1 text-lg font-semibold tabular-nums md:text-2xl" style={{ fontFamily: F.unb }}>{e.detail || "—"}</span>
                    <span className="text-[1.25rem] font-medium tracking-[-0.01em] md:text-[1.7rem]">{e.title}</span>
                    <span className="pr-2 text-xl opacity-0 transition group-hover:opacity-100">→</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.venue} />
              <div className="grid items-end gap-8 md:grid-cols-[8rem_1fr_auto]">
                <Module cells={4} className="hidden w-full md:block" />
                <div>
                  <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[2.6rem] font-semibold uppercase leading-[0.9] tracking-[-0.04em] md:text-[4.8rem]" style={{ fontFamily: F.unb }}>{profile.venue || profile.city}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-sm font-semibold uppercase tracking-[0.2em] text-[var(--t-muted)]">{profile.city}</E>}
                </div>
                <a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="inline-block bg-[var(--t-ink)] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--t-bg)] transition hover:bg-[var(--t-accent)]">{L.directions} ↗</a>
              </div>
            </section>
          ) : null,
          gallery: gallery.length ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.gallery} />
              <div className={`grid grid-cols-2 gap-2 ${compact ? "" : "md:grid-cols-4"}`}>
                {gallery.map((g, i) => (
                  <div key={g} data-r data-d={(i % 4) * 0.05} className="aspect-square overflow-hidden">
                    { }
                    <img data-edit-photo="gallery" data-gallery-key={g} src={media(g)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.register} />
              <div className="grid gap-8 md:grid-cols-[8rem_1fr]">
                <span className="hidden md:block" />
                <div data-r className="border-2 border-[var(--t-ink)] bg-[var(--t-surface)] p-6 md:p-10">
                  <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--t-accent)]">{L.reserve}</p>
                  {children}
                </div>
              </div>
            </section>
          ) : null,
          info: info ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.info} />
              <E as="p" multiline path="texts.body" className="block max-w-3xl whitespace-pre-line text-xl leading-relaxed text-[var(--t-muted)] md:ml-[9rem]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative mt-10 border-t-2 border-[var(--t-ink)] px-5 pb-12 pt-10 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="text-2xl font-semibold uppercase tracking-[-0.03em] md:text-4xl" style={{ fontFamily: F.unb }}>{name}</p>
          <Module cells={4} className="w-36" />
        </div>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-lg text-[var(--t-muted)]">{profile.blessing}</E>}
        {credit && <div className="mt-8 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
