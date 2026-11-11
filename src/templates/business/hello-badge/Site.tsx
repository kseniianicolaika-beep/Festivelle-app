"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Strap, Coffee, HB_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../../celebrate/_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, bizLine, agendaOf } from "../_shared/words";
import { venueLine } from "../_shared/ui";

export const HB_VARS = { "--t-bg": "#eef1ea", "--t-surface": "#fffdf8", "--t-ink": "#26332a", "--t-muted": "#6e7b70", "--t-accent": "#7d1d3a", "--t-gold": "#5e7d63" };

function Head({ title }: { title: string }) {
  return (
    <div data-r className="mb-10 flex items-center gap-4 md:mb-14">
      <span className="rounded-full bg-[var(--t-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fffdf8]">●</span>
      <h2 className="text-[2.2rem] leading-none tracking-[-0.02em] md:text-[3.2rem]" style={{ fontFamily: F.brico }}>{title}</h2>
    </div>
  );
}

/** The badge itself: "Hello, I'm" band + event name. */
function Badge({ name, L, line, compact, onClick, done }: { name: string; L: ReturnType<typeof words>; line: string; compact?: boolean; onClick?: () => void; done: boolean }) {
  return (
    <button type="button" data-badge onClick={onClick} aria-label={L.connect} className={`hb-card relative block overflow-hidden rounded-[22px] text-left outline-none ${compact ? "w-[280px] cursor-default" : "w-[min(86vw,420px)] cursor-pointer"}`}>
      <div className="mx-auto mt-3 h-3 w-14 rounded-full bg-[#e3e6dd]" />
      <div className="mt-3 bg-[var(--t-accent)] px-6 py-4 text-[#fffdf8]">
        <p className="text-[2rem] font-bold leading-none tracking-[-0.02em] md:text-[2.6rem]" style={{ fontFamily: F.brico }}>{L.hello}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.3em] opacity-80">{line}</p>
      </div>
      <div className="px-6 pb-7 pt-6">
        <p className={`font-semibold leading-[0.95] tracking-[-0.03em] ${compact ? "text-[38px]" : "text-[clamp(2.4rem,7vw,3.6rem)]"}`} style={{ fontFamily: F.caveat }}>
          <E path="profile.partner1">{name}</E>
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-[var(--t-muted)]">{done ? `✓ ${L.connected}` : L.connect}</p>
      </div>
    </button>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
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
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-lanyard]"), { y: -500, rotate: 14, transformOrigin: "50% 0%", duration: 1.8, ease: "elastic.out(1, 0.45)" })
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" }, "<.6");
  }, [compact]);

  const connect = () => {
    const host = root.current;
    if (!host || done) return;
    setDone(true);
    const badge = host.querySelector("[data-badge]");
    if (badge) {
      gsap.fromTo(badge, { rotate: 0 }, { rotate: 6, duration: 0.18, yoyo: true, repeat: 3, ease: "sine.inOut", transformOrigin: "50% 0%" });
      burstFrom(host, badge, { colors: ["#7d1d3a", "#5e7d63", "#b8a27a", "#fffdf8"], n: 50, shapes: ["circle", "rect"], angle: [200, 340], velocity: [350, 750], gravity: 900, size: 8 }, -60);
    }
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} hb-sage hb-steam relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("hello-badge", theme, design, HB_VARS), fontFamily: F.brico }}>
      <style href="biz-hb" precedence="default">{HB_CSS}</style>

      <header className={`relative grid items-center gap-8 overflow-hidden px-5 md:px-12 ${compact ? "min-h-[700px] pb-10 pt-6" : "min-h-[100svh] pb-14 pt-8 md:grid-cols-[1fr_1fr]"}`}>
        <div data-lanyard className={`relative flex flex-col items-center ${compact ? "" : "md:order-2"}`}>
          <Strap className={compact ? "h-[110px] w-[120px]" : "h-[22vh] w-[140px]"} />
          <div className="hb-swing -mt-1"><Badge name={name} L={L} line={bizLine(profile)} compact={compact} onClick={compact ? undefined : connect} done={done} /></div>
        </div>
        <div className={`relative ${compact ? "text-center" : "text-center md:text-left"}`}>
          <p data-hero-in className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--t-accent)]">{L.invited}</p>
          <E as="p" multiline path="profile.inviteLine" className="mt-4 block text-[1.8rem] leading-[1.15] tracking-[-0.02em] md:text-[2.8rem]">{profile.inviteLine || occasionInvite(profile)}</E>
          <div data-hero-in className={`mt-8 flex flex-wrap gap-3 ${compact ? "justify-center" : "justify-center md:justify-start"}`}>
            <span className="rounded-full bg-[var(--t-surface)] px-5 py-2.5 text-sm font-semibold shadow-sm">{fmt(profile)}{agenda[0]?.detail ? ` · ${agenda[0].detail}` : ""}</span>
            {venue && <E path={profile.venue ? "profile.venue" : "profile.city"} className="rounded-full bg-[var(--t-surface)] px-5 py-2.5 text-sm font-semibold shadow-sm">{venueLine(profile)}</E>}
          </div>
          <div data-hero-in className={`mt-10 w-40 ${compact ? "mx-auto" : "mx-auto md:mx-0"}`}><Coffee className="w-full" /></div>
        </div>
      </header>

      <Sections
        design={design}
        className="relative mx-auto max-w-5xl px-5 md:px-12"
        render={{
          invitation: !compact ? (
            <Countdown date={profile.date}>{(d) => (
              <section className="relative py-16 text-center">
                <p data-r className="inline-flex items-baseline gap-3 rounded-full bg-[var(--t-surface)] px-7 py-4 shadow-sm"><span className="text-5xl font-bold tracking-[-0.03em] text-[var(--t-accent)]">{d}</span><span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--t-muted)]">{L.days}</span></p>
              </section>
            )}</Countdown>
          ) : null,
          story: (profile.story || heroUrl) ? () => (
            <section className="relative py-16">
              <Head title={L.about} />
              <div className="hb-card grid items-center gap-8 rounded-[28px] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10">
                <div data-r className="aspect-[4/3] overflow-hidden rounded-[18px] bg-[#dfe7d8]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.2rem] leading-[1.7]">{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative py-16">
              <Head title={L.details} />
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? dp.dayMonth : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.time, v: agenda[0]?.detail ?? "", s: agenda[0]?.title ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.08} className="hb-card rounded-[22px] p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--t-gold)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-3 block text-[1.7rem] font-semibold leading-tight tracking-[-0.02em]">{x.v}</E> : <p className="mt-3 text-[1.7rem] font-semibold leading-tight tracking-[-0.02em]">{x.v}</p>}
                    {x.s && <p className="mt-1 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <a data-r href={calendarUrl} className="mt-8 inline-block rounded-full bg-[var(--t-ink)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--t-bg)] transition hover:bg-[var(--t-accent)]">{L.calendar}</a>}
            </section>
          ) : null,
          schedule: agenda.length ? () => (
            <section className="relative py-16">
              <Head title={L.agenda} />
              <ol className="grid gap-3">
                {agenda.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.06} className="hb-card flex items-center gap-5 rounded-[18px] px-5 py-4">
                    <span className="min-w-[5.5rem] rounded-full bg-[#eef1ea] px-3 py-1.5 text-center text-sm font-semibold tabular-nums text-[var(--t-gold)]">{e.detail || "—"}</span>
                    <span className="text-[1.25rem] font-semibold tracking-[-0.01em] md:text-[1.45rem]">{e.title}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative py-16">
              <Head title={L.venue} />
              <div className="hb-card flex flex-wrap items-end justify-between gap-6 rounded-[28px] p-8 md:p-10">
                <div>
                  <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[2.4rem] font-bold leading-[0.95] tracking-[-0.03em] md:text-[3.8rem]">{profile.venue || profile.city}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-2 block text-[var(--t-muted)]">{profile.city}</E>}
                </div>
                <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--t-accent)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#fffdf8] transition hover:brightness-110">{L.directions} →</a>
              </div>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative py-16">
              <Head title={L.gallery} />
              <div className={`grid grid-cols-2 gap-3 ${compact ? "" : "md:grid-cols-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.06} className="aspect-square overflow-hidden rounded-[18px]">
                    { }
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative py-16">
              <Head title={L.register} />
              <div data-r className="hb-card rounded-[28px] p-6 md:p-10">
                <p className="mb-6 text-lg font-semibold text-[var(--t-accent)]">{L.reserve}</p>
                {children}
              </div>
            </section>
          ) : null,
          info: info ? () => (
            <section className="relative py-16">
              <Head title={L.info} />
              <E as="p" multiline path="texts.body" className="block max-w-3xl whitespace-pre-line text-xl leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative px-6 pb-12 pt-14 text-center">
        <Coffee className="mx-auto w-28" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-3xl" style={{ fontFamily: F.caveat }}>{profile.blessing}</E>}
        {credit && <div className="mt-8 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
