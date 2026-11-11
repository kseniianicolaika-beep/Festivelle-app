"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { SunSea, Palm, Balustrade, ST_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, bizLine, agendaOf } from "../_shared/words";

export const ST_VARS = { "--t-bg": "#fbf3ea", "--t-surface": "#fffaf4", "--t-ink": "#3e2418", "--t-muted": "#8a6a5e", "--t-accent": "#c8553d", "--t-gold": "#b23a52" };

function Head({ n, title }: { n: number; title: string }) {
  return (
    <div data-r className="mb-12 flex items-end gap-5 border-b border-[var(--t-ink)]/15 pb-5 md:mb-16">
      <span className="text-[13px] tabular-nums tracking-[0.3em] text-[var(--t-accent)]" style={{ fontFamily: F.brico }}>{String(n).padStart(2, "0")}</span>
      <h2 className="text-[2.4rem] leading-none tracking-[-0.02em] md:text-[3.6rem]" style={{ fontFamily: F.fraun }}>{title}</h2>
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
    const hero = q("[data-hero]")[0];
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-sun]"), { y: 120, duration: 2.4, ease: "power3.out" })
      .from(q("[data-palm]"), { y: 60, opacity: 0, stagger: 0.15, duration: 1.4, ease: "power3.out" }, "<.4")
      .from(q("[data-hero-in]"), { y: 30, opacity: 0, stagger: 0.1, duration: 1.1, ease: "power3.out" }, "<.2");
    if (hero) gsap.to(q("[data-sun]"), { y: 70, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} st-paper relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("sunset-terrace", theme, design, ST_VARS), fontFamily: F.brico }}>
      <style href="biz-st" precedence="default">{ST_CSS}</style>

      <header data-hero className={`relative flex flex-col overflow-hidden px-5 md:px-12 ${compact ? "pb-10 pt-10" : "min-h-[100svh] justify-between pb-12 pt-12 md:pt-16"}`}>
        <Grain opacity={0.08} freq={0.9} />
        <div data-hero-in className="relative flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-[var(--t-muted)]">
          <span>{L.invited}</span>
          <span>{dp ? `${dp.dd}.${dp.mm}.${dp.year}` : fmt(profile)}</span>
        </div>
        <div className={`relative ${compact ? "mt-8" : "mt-10 grid items-end gap-10 md:mt-16 md:grid-cols-[1.1fr_1fr]"}`}>
          <div>
            <h1 className={`leading-[0.88] tracking-[-0.035em] ${compact ? "text-[54px]" : "text-[clamp(3.6rem,10vw,9rem)]"}`} style={{ fontFamily: F.fraun }}>
              <E path="profile.partner1">{name}</E>
            </h1>
            <p data-hero-in className={`st-grad mt-4 italic ${compact ? "text-2xl" : "text-2xl md:text-4xl"}`} style={{ fontFamily: F.fraun }}>{bizLine(profile)}</p>
          </div>
          <div className={`relative ${compact ? "mx-auto mt-8 w-full max-w-[340px]" : "w-full"}`}>
            <SunSea className="w-full" />
            <div data-palm className="absolute bottom-[26%] left-[-4%] w-[22%]"><Palm className="w-full" /></div>
            <div data-palm className="absolute bottom-[26%] right-[2%] w-[16%]"><Palm flip className="w-full" /></div>
          </div>
        </div>
        <div className="relative mt-6"><Balustrade className="h-7 w-full opacity-80 md:h-9" /></div>
        <div data-hero-in className="relative mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="text-xl md:text-2xl" style={{ fontFamily: F.fraun }}>{fmt(profile)}{agenda[0]?.detail ? ` · ${agenda[0].detail}` : ""}</p>
          {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[12px] uppercase tracking-[0.3em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
        </div>
      </header>

      <Sections
        design={design}
        className="relative mx-auto max-w-6xl px-5 md:px-12"
        render={{
          invitation: (
            <section className="relative py-20 md:py-28">
              <E as="p" multiline path="profile.inviteLine" className="block max-w-4xl text-[2rem] leading-[1.2] tracking-[-0.015em] md:text-[3.2rem]" style={{ fontFamily: F.fraun }}>{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="mt-10 flex items-baseline gap-3 text-[var(--t-muted)]"><span className="st-grad text-6xl tabular-nums" style={{ fontFamily: F.fraun }}>{d}</span><span className="text-xs uppercase tracking-[0.3em]">{L.days}</span></p>}</Countdown>}
            </section>
          ),
          story: (profile.story || heroUrl) ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.host} />
              <div className="grid items-start gap-10 md:grid-cols-[1fr_1.2fr]">
                <div data-r className="aspect-[4/5] overflow-hidden rounded-t-[999px] bg-[#f3dccb]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.25rem] leading-[1.7] md:text-[1.4rem]">{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.details} />
              <dl className="grid gap-8 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? dp.dayMonth : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.time, v: agenda[0]?.detail ?? "", s: agenda[0]?.title ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="border-t-2 border-[var(--t-accent)] pt-5">
                    <dt className="text-[11px] uppercase tracking-[0.35em] text-[var(--t-muted)]">{x.k}</dt>
                    {x.path ? <E as="dd" path={x.path} className="mt-3 block text-[2rem] leading-tight" style={{ fontFamily: F.fraun }}>{x.v}</E> : <dd className="mt-3 text-[2rem] leading-tight" style={{ fontFamily: F.fraun }}>{x.v}</dd>}
                    {x.s && <dd className="mt-1 capitalize text-[var(--t-muted)]">{x.s}</dd>}
                  </div>
                ))}
              </dl>
              {calendarUrl && <a data-r href={calendarUrl} className="mt-10 inline-block rounded-full border border-[var(--t-ink)]/30 px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] transition hover:bg-[var(--t-ink)] hover:text-[var(--t-bg)]">{L.calendar}</a>}
            </section>
          ) : null,
          schedule: agenda.length ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.programme} />
              <ol>
                {agenda.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.06} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-[var(--t-ink)]/12 py-6 md:grid-cols-[9rem_1fr]">
                    <span className="st-grad text-2xl tabular-nums md:text-3xl" style={{ fontFamily: F.fraun }}>{e.detail || "—"}</span>
                    <span className="text-[1.5rem] tracking-[-0.01em] md:text-[2rem]" style={{ fontFamily: F.fraun }}>{e.title}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.venue} />
              <div className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[3rem] leading-[0.95] tracking-[-0.03em] md:text-[5.5rem]" style={{ fontFamily: F.fraun }}>{profile.venue || profile.city}</E>
                <div data-r>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="block text-[12px] uppercase tracking-[0.35em] text-[var(--t-muted)]">{profile.city}</E>}
                  <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-[var(--t-accent)] px-7 py-3 text-[11px] uppercase tracking-[0.3em] text-white transition hover:brightness-110">{L.directions} →</a>
                </div>
              </div>
            </section>
          ) : null,
          gallery: gallery.length ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.gallery} />
              <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="mb-4 break-inside-avoid overflow-hidden rounded-[18px]">
                    { }
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.register} />
              <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
                <p data-r className="st-grad text-[2rem] italic leading-tight md:text-[2.6rem]" style={{ fontFamily: F.fraun }}>{L.reserve}</p>
                <div data-r className="rounded-[28px] bg-[var(--t-surface)] px-6 py-10 shadow-[0_30px_60px_-35px_rgba(62,36,24,.45)] md:px-10">{children}</div>
              </div>
            </section>
          ) : null,
          info: info ? (k: number) => (
            <section className="relative py-20">
              <Head n={k} title={L.info} />
              <E as="p" multiline path="texts.body" className="block max-w-3xl whitespace-pre-line text-xl leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative mt-10 overflow-hidden px-5 pb-12 pt-16 text-center md:px-12">
        <SunSea className="st-shimmer mx-auto w-56 opacity-90" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-2xl italic" style={{ fontFamily: F.fraun }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
