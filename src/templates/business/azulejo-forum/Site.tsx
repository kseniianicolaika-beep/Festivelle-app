"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Tile, TileWall, Border, AZ_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, bizLine, agendaOf } from "../_shared/words";
import { venueLine } from "../_shared/ui";

export const AZ_VARS = { "--t-bg": "#f8f6f0", "--t-surface": "#ffffff", "--t-ink": "#13294b", "--t-muted": "#5b6b86", "--t-accent": "#1f4e9c", "--t-gold": "#d9a441" };

function Head({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div data-r className="mb-12 flex flex-col items-center text-center md:mb-16">
      <Tile className="mb-5 w-12 rotate-45 rounded-[4px]" />
      {kicker && <p className="mb-2 text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{kicker}</p>}
      <h2 className="text-[2.4rem] leading-none md:text-[3.6rem]" style={{ fontFamily: F.prata }}>{title}</h2>
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
      .from(q("[data-az] > svg"), { rotateY: 90, opacity: 0, transformOrigin: "50% 50%", stagger: { each: 0.035, grid: "auto", from: "center" }, duration: 0.8, ease: "power2.out" })
      .from(q("[data-plaque]"), { y: 50, opacity: 0, scale: 0.94, duration: 1.2, ease: "power3.out" }, "-=0.5")
      .from(q("[data-hero-in]"), { y: 20, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" }, "<.3");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} az-paper relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("azulejo-forum", theme, design, AZ_VARS), fontFamily: F.tenor }}>
      <style href="biz-az" precedence="default">{AZ_CSS}</style>

      <header className={`relative flex flex-col items-center overflow-hidden ${compact ? "min-h-[680px]" : "min-h-[100svh]"}`}>
        <TileWall cols={compact ? 4 : 8} rows={compact ? 3 : 3} className="w-full" />
        <div data-plaque className={`az-plaque relative z-10 mx-5 text-center ${compact ? "-mt-24 px-6 py-9" : "-mt-36 px-10 py-12 md:-mt-48 md:px-20 md:py-16"}`}>
          <p data-hero-in className="text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{L.invited}</p>
          <h1 className={`mt-4 leading-[1.02] ${compact ? "text-[40px]" : "text-[clamp(2.6rem,7vw,5.6rem)]"}`} style={{ fontFamily: F.prata }}>
            <E path="profile.partner1">{name}</E>
          </h1>
          <p data-hero-in className="mt-3 text-lg italic text-[var(--t-accent)] md:text-2xl" style={{ fontFamily: F.corm }}>{bizLine(profile)}</p>
          <div data-hero-in className="mx-auto mt-6 h-px w-24 bg-[var(--t-accent)]" />
          <p data-hero-in className="mt-5 text-base uppercase tracking-[0.3em] md:text-lg">{fmt(profile)}</p>
          {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[12px] uppercase tracking-[0.3em] text-[var(--t-muted)]">{venueLine(profile)}</E>}
        </div>
        <div className="flex-1" />
        <Border className="mt-12 h-5 w-full" />
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-28">
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.8rem] leading-[1.4] md:text-[2.6rem]" style={{ fontFamily: F.corm }}>{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && <Countdown date={profile.date}>{(d) => <div data-r className="mx-auto mt-10 inline-flex items-center gap-4 border border-[var(--t-accent)] bg-white px-6 py-3"><span className="text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.prata }}>{d}</span><span className="text-[11px] uppercase tracking-[0.35em] text-[var(--t-muted)]">{L.days}</span></div>}</Countdown>}
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head title={L.about} />
              <div className="grid items-center gap-12 md:grid-cols-2">
                <div data-r className="relative mx-auto w-[min(80vw,420px)] bg-white p-3 shadow-[0_0_0_2px_#1f4e9c]">
                  <div className="aspect-[4/5] overflow-hidden"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                  <Tile className="absolute -bottom-6 -right-6 w-16 shadow-md" />
                </div>
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.4rem] leading-[1.7] md:text-[1.55rem]" style={{ fontFamily: F.corm }}>{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative mx-auto max-w-5xl px-6 py-24">
              <Head title={L.details} />
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? dp.dayMonth : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.time, v: agenda[0]?.detail ?? "", s: agenda[0]?.title ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="bg-white px-6 py-10 text-center shadow-[0_0_0_1px_#c9d3e6]">
                    <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--t-accent)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-4 block text-[1.8rem] leading-tight" style={{ fontFamily: F.prata }}>{x.v}</E> : <p className="mt-4 text-[1.8rem] leading-tight" style={{ fontFamily: F.prata }}>{x.v}</p>}
                    {x.s && <p className="mt-2 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block border border-[var(--t-accent)] px-6 py-3 text-[11px] uppercase tracking-[0.35em] text-[var(--t-accent)] transition hover:bg-[var(--t-accent)] hover:text-white">{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: agenda.length ? () => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head title={L.agenda} />
              <ol className="space-y-3">
                {agenda.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.06} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-5 bg-white py-3 pl-3 pr-5 shadow-[0_0_0_1px_#c9d3e6]">
                    <div className="relative aspect-square"><Tile variant={i} className="h-full w-full" /><span className="absolute inset-0 grid place-items-center"><span className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm text-[var(--t-accent)]" style={{ fontFamily: F.prata }}>{i + 1}</span></span></div>
                    <span className="text-[1.35rem] md:text-[1.6rem]" style={{ fontFamily: F.prata }}>{e.title}</span>
                    <span className="text-sm uppercase tracking-[0.25em] text-[var(--t-accent)]">{e.detail}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative px-6 py-24 text-center">
              <Head title={L.venue} />
              <div className="az-plaque mx-auto inline-block px-10 py-8">
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[2.4rem] leading-none md:text-[4rem]" style={{ fontFamily: F.prata }}>{profile.venue || profile.city}</E>
                {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{profile.city}</E>}
              </div>
              <div><a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-12 inline-block bg-[var(--t-accent)] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-white transition hover:brightness-110">{L.directions}</a></div>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head title={L.gallery} />
              <div className={`grid grid-cols-2 gap-3 ${compact ? "" : "md:grid-cols-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="aspect-square overflow-hidden bg-white p-2 shadow-[0_0_0_1px_#c9d3e6]">
                    { }
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head title={L.register} kicker={L.reserve} />
              <div data-r className="relative bg-white px-6 py-10 shadow-[0_0_0_2px_#1f4e9c,0_0_0_8px_#f8f6f0,0_0_0_9px_#1f4e9c] md:px-12">{children}</div>
            </section>
          ) : null,
          info: info ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-20 text-center">
              <Head title={L.info} />
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative pt-10 text-center">
        {profile.blessing && <E as="p" path="profile.blessing" className="mb-6 block px-6 text-2xl italic text-[var(--t-accent)]" style={{ fontFamily: F.corm }}>{profile.blessing}</E>}
        {credit && <div className="mb-8 px-6 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
        <TileWall cols={compact ? 4 : 10} rows={1} className="w-full" />
      </footer>
    </div>
  );
}
