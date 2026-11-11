"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Network, CN_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, bizLine, agendaOf } from "../_shared/words";
import { venueLine } from "../_shared/ui";

export const CN_VARS = { "--t-bg": "#141833", "--t-surface": "#1b2045", "--t-ink": "#f4ecff", "--t-muted": "#b7b0d6", "--t-accent": "#e9b949", "--t-gold": "#e9b949" };

function Head({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div data-r className="mb-12 text-center md:mb-16">
      <Network still className="mx-auto mb-4 w-24 opacity-80" />
      {kicker && <p className="mb-2 text-[10px] uppercase tracking-[0.55em] text-[var(--t-muted)]">{kicker}</p>}
      <h2 className="cn-gold text-[2.4rem] leading-none md:text-[3.6rem]" style={{ fontFamily: F.prata }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [linked, setLinked] = useState(false);
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
    const hero = q("[data-hero-net]")[0];
    if (!hero) return;
    gsap.timeline({ delay: 0.2 })
      .from(hero.querySelectorAll("[data-node]"), { scale: 0, opacity: 0, transformOrigin: "center", transformBox: "fill-box", stagger: { each: 0.06, from: "random" }, duration: 0.7, ease: "back.out(2)" })
      .fromTo(hero.querySelectorAll("[data-link]"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.07, duration: 0.9, ease: "power2.inOut" }, "-=0.4")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" }, "<.3");
  }, [compact]);

  const connect = () => {
    const host = root.current;
    if (!host || linked) return;
    setLinked(true);
    const net = host.querySelector("[data-hero-net]");
    if (!net) return;
    gsap.fromTo(net.querySelectorAll("[data-link]"), { strokeOpacity: 0.55, strokeWidth: 0.8 }, { strokeOpacity: 1, strokeWidth: 1.6, stagger: 0.04, duration: 0.4, yoyo: true, repeat: 1 });
    gsap.fromTo(net.querySelectorAll("[data-node]"), { scale: 1 }, { scale: 1.6, transformOrigin: "center", transformBox: "fill-box", stagger: 0.04, duration: 0.3, yoyo: true, repeat: 1 });
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} cn-night relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("constellation", theme, design, CN_VARS), fontFamily: F.tenor }}>
      <style href="biz-cn" precedence="default">{CN_CSS}</style>

      <header className={`relative flex flex-col items-center justify-center px-5 text-center ${compact ? "min-h-[680px] py-12" : "min-h-[100svh] py-16"}`}>
        <p data-hero-in className="relative text-[10px] uppercase tracking-[0.6em] text-[var(--t-muted)]">{L.invited}</p>
        <button type="button" data-hero-net onClick={compact ? undefined : connect} aria-label={L.connect} className={`relative my-6 outline-none ${compact ? "w-[300px] cursor-default" : "w-[min(88vw,620px)] cursor-pointer"}`}>
          <Network className="w-full" />
        </button>
        <h1 className={`relative leading-[1] ${compact ? "text-[42px]" : "text-[clamp(2.8rem,8vw,6.4rem)]"}`} style={{ fontFamily: F.prata }}>
          <E path="profile.partner1" className="cn-gold cn-shine">{name}</E>
        </h1>
        <p data-hero-in className="relative mt-3 text-xl italic text-[#f3a7b5] md:text-2xl" style={{ fontFamily: F.corm }}>{bizLine(profile)}</p>
        {!compact && <p data-hero-in className="relative mt-2 text-xs italic text-[var(--t-muted)]">{linked ? `✦ ${L.connected} ✦` : `${L.connect} ✦`}</p>}
        <div data-hero-in className="relative mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] uppercase tracking-[0.4em]">
          <span>{fmt(profile)}</span>
          {venue && <><span className="text-[var(--t-accent)]">✦</span><E path={profile.venue ? "profile.venue" : "profile.city"} className="text-[var(--t-muted)]">{venueLine(profile)}</E></>}
        </div>
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-28">
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.9rem] italic leading-[1.4] md:text-[2.7rem]" style={{ fontFamily: F.corm }}>{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="mt-10 text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]"><span className="cn-gold mr-3 text-5xl tracking-normal" style={{ fontFamily: F.prata }}>{d}</span>{L.days}</p>}</Countdown>}
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
              <div data-r className="relative mx-auto w-[min(78vw,400px)]">
                <div className="aspect-square overflow-hidden rounded-full ring-1 ring-[var(--t-gold)]/50 ring-offset-8 ring-offset-[#141833]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
              </div>
              <div className="text-center md:text-left">
                <p data-r className="text-[10px] uppercase tracking-[0.55em] text-[var(--t-muted)]">{L.about}</p>
                <h2 data-r className="cn-gold mt-3 text-[2.3rem] leading-none md:text-[3.2rem]" style={{ fontFamily: F.prata }}>{name}</h2>
                {profile.story && <E as="p" multiline path="profile.story" className="mt-8 block whitespace-pre-line text-[1.35rem] leading-[1.7] md:text-[1.5rem]" style={{ fontFamily: F.corm }}>{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative mx-auto max-w-5xl px-6 py-24">
              <Head title={L.details} />
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? dp.dayMonth : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.time, v: agenda[0]?.detail ?? "", s: agenda[0]?.title ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="rounded-[24px] border border-[var(--t-gold)]/25 bg-[#1b2045]/80 px-6 py-10 text-center backdrop-blur">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--t-accent)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-4 block text-[1.8rem] leading-tight" style={{ fontFamily: F.prata }}>{x.v}</E> : <p className="mt-4 text-[1.8rem] leading-tight" style={{ fontFamily: F.prata }}>{x.v}</p>}
                    {x.s && <p className="mt-2 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block rounded-full border border-[var(--t-gold)]/50 px-7 py-3 text-[11px] uppercase tracking-[0.4em] text-[var(--t-gold)] transition hover:bg-[var(--t-gold)]/10">{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: agenda.length ? () => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head title={L.programme} />
              <ol>
                {agenda.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.08} className="flex items-center gap-5 border-b border-[var(--t-muted)]/20 py-6">
                    <span className="relative h-3 w-3 shrink-0 rounded-full bg-[#f4ecff] shadow-[0_0_14px_4px_rgba(233,185,73,.45)]" />
                    <span className="flex-1 text-[1.5rem] md:text-[1.9rem]" style={{ fontFamily: F.prata }}>{e.title}</span>
                    <span className="text-xs uppercase tracking-[0.35em] text-[var(--t-accent)]">{e.detail}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative px-6 py-24 text-center">
              <Head title={L.venue} />
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="cn-gold block text-[2.6rem] leading-none md:text-[4.6rem]" style={{ fontFamily: F.prata }}>{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-4 block text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{profile.city}</E>}
              <a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-10 inline-block rounded-full bg-[var(--t-gold)] px-8 py-3.5 text-[11px] uppercase tracking-[0.4em] text-[#141833] transition hover:brightness-110">{L.directions}</a>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head title={L.gallery} />
              <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="mb-4 break-inside-avoid overflow-hidden rounded-[20px] ring-1 ring-[var(--t-gold)]/25">
                    { }
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head title={L.register} kicker={L.reserve} />
              <div data-r className="rounded-[28px] border border-[var(--t-gold)]/30 bg-[#1b2045]/90 px-6 py-10 md:px-12">{children}</div>
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

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Network still className="mx-auto w-40 opacity-80" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-2xl italic text-[#f3a7b5]" style={{ fontFamily: F.corm }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
