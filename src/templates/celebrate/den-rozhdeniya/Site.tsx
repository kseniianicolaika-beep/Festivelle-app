"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { GzhelRose, GzhelBorder, PlateRim, Teapot, DR_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, lineOf, langOf } from "../_shared/words";

export const DR_VARS = { "--t-bg": "#f7f9fd", "--t-surface": "#ffffff", "--t-ink": "#0f2a6b", "--t-muted": "#5268a0", "--t-accent": "#1c46b5", "--t-gold": "#1c46b5", "--foil-a": "#0f2a6b", "--foil-b": "#5f86e0" };
const COBALTS = ["#1c46b5", "#0f2a6b", "#5f86e0", "#ffffff", "#9fb7ee"];
const HOORAY = { en: "Hooray!", ru: "Ура!", hi: "वाह!" };

function Head({ title }: { title: string }) {
  return (
    <div data-r className="mb-10 flex flex-col items-center text-center">
      <GzhelBorder className="w-48" />
      <h2 className="mt-3 text-[2.2rem] leading-tight text-[var(--t-accent)] md:text-[3rem]" style={{ fontFamily: F.ruslan }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [cheers, setCheers] = useState(0);
  const [name] = nameParts(profile);
  const L = words(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const age = profile.age;
  const lang = langOf(profile);
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    q("[data-flap]").forEach((n) => ((n as HTMLElement).style.animation = "none"));
    const tl = gsap.timeline({ delay: 0.4 });
    tl.from(q("[data-seal]"), { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.6)" })
      .to(q("[data-flap]"), { rotateX: -100, transformPerspective: 1400, transformOrigin: "50% 0%", opacity: 0, duration: 1.6, ease: "power3.inOut" }, "+=.3")
      .from(q("[data-plate]"), { scale: 0.8, rotate: -20, opacity: 0, duration: 1.6, ease: "expo.out" }, "<.5")
      .from(q("[data-rose]"), { scale: 0.2, rotate: -120, opacity: 0, duration: 1.4, ease: "back.out(1.4)" }, "<.3")
      .from(q("[data-hero-in]"), { y: 20, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" }, "<.4");
  }, [compact]);

  const hooray = () => {
    const host = root.current;
    const rose = host?.querySelector("[data-rose]");
    if (!host || !rose) return;
    setCheers((c) => c + 1);
    gsap.fromTo(rose, { scale: 0.75, rotate: -30 }, { scale: 1, rotate: 0, duration: 1.1, ease: "elastic.out(1,.4)" });
    burstFrom(host, rose, { colors: COBALTS, n: 70, shapes: ["circle", "rect", "star"], angle: [210, 330], velocity: [400, 850], gravity: 700, size: 10 });
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} dr-porcelain relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("den-rozhdeniya", theme, design, DR_VARS), fontFamily: F.kurale }}>
      <style href="cel-dr" precedence="default">{DR_CSS}</style>
      <Grain opacity={0.05} />

      <header className={`relative flex flex-col items-center overflow-hidden px-5 text-center ${compact ? "min-h-[680px] py-10" : "min-h-[100svh] py-14"}`}>
        <GzhelBorder className="w-[min(90vw,560px)]" />
        <p data-hero-in className="mt-6 text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{L.invited}</p>

        <button type="button" data-plate onClick={compact ? undefined : hooray} aria-label={HOORAY[lang]} className={`relative mt-6 outline-none ${compact ? "w-[290px] cursor-default" : "w-[min(84vw,440px)] cursor-pointer"}`}>
          <div className={compact ? "" : "dr-spin"}><PlateRim className="w-full drop-shadow-[0_30px_40px_rgba(15,42,107,.18)]" /></div>
          <div className="absolute inset-[18%] flex flex-col items-center justify-center">
            <div data-rose className="w-[50%]"><GzhelRose className="w-full" /></div>
            {age ? <p className="mt-[3%] leading-none text-[var(--t-accent)]" style={{ fontFamily: F.ruslan, fontSize: compact ? "64px" : "clamp(3.6rem, 15vw, 6.4rem)" }}>{age}</p> : null}
          </div>
          {!compact && cheers > 0 && <span key={cheers} className="absolute -top-2 right-0 rotate-12 text-3xl text-[var(--t-accent)] [animation:fadein_.4s_ease]" style={{ fontFamily: F.marck }}>{HOORAY[lang]}</span>}
        </button>

        <h1 className={`relative mt-6 leading-[1] text-[var(--t-accent)] ${compact ? "text-[46px]" : "text-[clamp(3rem,11vw,6rem)]"}`} style={{ fontFamily: F.ruslan }}>
          <E path="profile.partner1">{name}</E>
        </h1>
        <p data-hero-in className={`mt-2 text-[var(--t-ink)] ${compact ? "text-3xl" : "text-[2rem] md:text-[2.6rem]"}`} style={{ fontFamily: F.marck }}>{lineOf(profile)}</p>
        <p data-hero-in className="mt-5 text-lg">{fmt(profile)}{profile.events?.[0]?.time ? ` · ${profile.events[0].time}` : ""}</p>
        {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-1 block text-sm uppercase tracking-[0.3em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
        {!compact && <Countdown date={profile.date}>{(d) => <p data-hero-in className="mt-5 text-[11px] uppercase tracking-[0.35em] text-[var(--t-muted)]"><span className="mr-2 text-2xl tracking-normal text-[var(--t-accent)]" style={{ fontFamily: F.ruslan }}>{d}</span>{L.until}</p>}</Countdown>}

        {!compact && (
          <div data-flap aria-hidden className="dr-flap absolute inset-x-0 top-0 z-20 flex h-full flex-col items-center justify-center bg-[#f7f9fd]" style={{ backgroundImage: "linear-gradient(180deg,#ffffff,#eef3fc)" }}>
            <div className="absolute inset-4 border-2 border-[#1c46b5]" />
            <div className="absolute inset-6 border border-[#1c46b5]/50" />
            <div data-seal className="w-40"><GzhelRose className="w-full" /></div>
            <p className="mt-4 text-3xl text-[#1c46b5]" style={{ fontFamily: F.marck }}>{name}</p>
          </div>
        )}
      </header>

      <Sections
        design={design}
        className="relative mx-auto max-w-3xl px-5"
        render={{
          invitation: (
            <section className="relative py-16 text-center md:py-24">
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.7rem] leading-[1.5] md:text-[2.2rem]">{profile.inviteLine || occasionInvite(profile)}</E>
              <p data-r className="mt-6 text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.marck }}>{L.with}, {name}</p>
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative py-16 md:py-24">
              <Head title={L.about} />
              <div data-r className="relative mx-auto mb-10 w-[min(70vw,300px)]">
                <div className="aspect-square overflow-hidden rounded-full border-[6px] border-white shadow-[0_0_0_2px_#1c46b5,0_20px_40px_-20px_rgba(15,42,107,.4)]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                <GzhelRose leaves={false} className="absolute -bottom-6 -right-6 w-24" />
              </div>
              {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-center text-xl leading-[1.7]">{profile.story}</E>}
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative py-16 md:py-24">
              <Head title={L.details} />
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { k: L.when, v: dp ? `${dp.day} ${dp.month}` : fmt(profile), s: [dp?.weekday, profile.events?.[0]?.time].filter(Boolean).join(", ") },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="relative bg-white p-2 shadow-[0_20px_40px_-25px_rgba(15,42,107,.35)]">
                    <div className="relative flex min-h-[200px] flex-col items-center justify-center border-2 border-[var(--t-accent)] px-5 py-8 text-center">
                      <GzhelRose leaves={false} className="absolute -left-3 -top-3 w-12" />
                      <p className="text-xs uppercase tracking-[0.35em] text-[var(--t-muted)]">{x.k}</p>
                      {x.path ? <E as="p" path={x.path} className="mt-3 block text-[1.9rem] leading-tight text-[var(--t-accent)]" style={{ fontFamily: F.ruslan }}>{x.v}</E> : <p className="mt-3 text-[1.9rem] leading-tight text-[var(--t-accent)]" style={{ fontFamily: F.ruslan }}>{x.v}</p>}
                      {x.s && <p className="mt-2 text-[var(--t-muted)]">{x.s}</p>}
                    </div>
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block rounded-full border-2 border-[var(--t-accent)] px-6 py-2.5 text-sm uppercase tracking-[0.2em] text-[var(--t-accent)] transition hover:bg-[var(--t-accent)] hover:text-white">{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: profile.events?.length ? () => (
            <section className="relative py-16 md:py-24">
              <Head title={L.evening} />
              <ol className="mx-auto max-w-xl">
                {profile.events!.map((e, i) => (
                  <li key={i} data-r data-d={i * 0.08} className="flex items-center gap-5 border-b border-dashed border-[var(--t-accent)]/40 py-5">
                    <span className="w-20 shrink-0 text-right text-xl text-[var(--t-accent)]" style={{ fontFamily: F.ruslan }}>{e.time}</span>
                    <svg viewBox="0 0 20 20" className="w-4 shrink-0 text-[var(--t-accent)]" aria-hidden><path d="M10 0C6 4 6 12 10 20 14 12 14 4 10 0z" fill="currentColor" /></svg>
                    <div>
                      <p className="text-2xl leading-tight">{e.name}</p>
                      {e.venue && <p className="text-sm text-[var(--t-muted)]">{e.venue}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative py-16 text-center md:py-24">
              <Head title={L.venue} />
              <Teapot className="mx-auto w-48 md:w-60" />
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-6 block text-[2.4rem] leading-tight text-[var(--t-accent)] md:text-[3.4rem]" style={{ fontFamily: F.ruslan }}>{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-1 block uppercase tracking-[0.3em] text-[var(--t-muted)]">{profile.city}</E>}
              <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-8 inline-block rounded-full bg-[var(--t-accent)] px-7 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[#0f2a6b]">{L.directions}</a>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative py-16">
              <Head title={L.gallery} />
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 2) * 0.08} className="bg-white p-2 shadow-[0_0_0_2px_#1c46b5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative py-16">
              <Head title={L.rsvp} />
              <div data-r className="bg-white p-2 shadow-[0_30px_60px_-30px_rgba(15,42,107,.35)]"><div className="border-2 border-[var(--t-accent)] px-5 py-10 md:px-10">{children}</div></div>
            </section>
          ) : null,
          info: info ? () => (
            <section className="relative py-16 text-center">
              <Head title={L.info} />
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-lg leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <GzhelRose className="mx-auto w-28" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-3xl text-[var(--t-accent)]" style={{ fontFamily: F.marck }}>{profile.blessing}</E>}
        <GzhelBorder className="mx-auto mt-6 w-56" />
        {credit && <div className="mt-8 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
