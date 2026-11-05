"use client";
import { useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { eventWhen, siteData, toRoman } from "../_shared/data";
import { revealOnScroll, useDaysLeft, useLenis, useScene } from "../_shared/motion";
import { ff, Photo, rootVars, Sec } from "../_shared/ui";
import { BirchBranch, Crest, Monogram, NevaScene, Rule, Wreath } from "./art";
import { FACES, FONTS, NEVA, sc } from "./faces";
import "./neva.css";

export default function NevaSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const S = siteData(profile, design);
  const { a, b, L, W, date } = S;
  const N = NEVA[S.lang];
  const ia = a[0] ?? "", ib = b ? b[0] ?? "" : undefined;
  const ref = useRef<HTMLDivElement>(null);
  const days = useDaysLeft(profile.date);
  const spb = /петербург|petersburg|spb|питер/i.test(`${profile.city} ${profile.venue}`);
  const whiteNight = spb && date && ["05", "06", "07"].includes(date.mm);
  useLenis(!compact);

  const ready = useScene(ref, (k) => {
    const g = k.gsap;
    g.set("[data-intro]", { display: "block" });
    const tl = g.timeline({ defaults: { ease: "power3.inOut" } });
    tl.from("[data-intro] svg path", { drawSVG: "0%", duration: 1.8, stagger: 0.008, ease: "power1.inOut" }, 0.1);
    k.q("[data-intro] [data-mono-letter]").forEach((t, i) => {
      g.set(t, { strokeDasharray: 600, strokeDashoffset: 600, fillOpacity: 0 });
      tl.to(t, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0.5 + i * 0.25).to(t, { fillOpacity: 1, duration: 0.8 }, 1.6 + i * 0.2);
    });
    tl.fromTo("[data-window]", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(50% at 50% 50%)", duration: 1.9, ease: "expo.inOut" }, 2.5)
      .to("[data-intro]", { scale: 1.5, opacity: 0, duration: 1.4, ease: "power2.in" }, 2.5)
      .from("[data-window] svg", { scale: 1.25, duration: 2.6, ease: "power3.out" }, 2.5)
      .set("[data-intro]", { display: "none" }, 4);
    const split = new k.Split("[data-names] .wa-name", { type: "chars", charsClass: "wa-ch" });
    tl.fromTo("[data-in]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 3.3)
      .from(split.chars, { opacity: 0, y: 18, filter: "blur(8px)", duration: 1.4, stagger: 0.06, ease: "power3.out" }, 3.35)
      .from("[data-hero-meta] > *", { opacity: 0, y: 12, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 3.7)
      .from("[data-crest]", { opacity: 0, y: -10, duration: 1.2, ease: "power3.out" }, 3.4);
    if (compact) return;
    revealOnScroll(k, { y: 24 });
    k.q("[data-draw] path").forEach((el) => g.from(el, { drawSVG: "0%", duration: 2.4, ease: "power1.inOut", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
    g.to("[data-window] svg", { scale: 1.12, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true } });
  }, [compact]);

  const has = (id: SectionId): boolean => {
    switch (id) {
      case "invitation": return S.occ !== "greeting";
      case "story": return !!profile.story;
      case "details": return !!(date || S.where);
      case "schedule": return S.events.length > 0;
      case "venue": return !!S.where;
      case "gallery": return S.gallery.length > 0;
      case "rsvp": return true;
      case "info": return !!S.info;
      default: return false;
    }
  };
  const vis = S.visible.filter(has);
  const pad = compact ? "px-6 py-20" : "px-6 py-24 @3xl:py-32";
  const head = (i: number, title: string) => (
    <div data-reveal className="mb-14 flex flex-col items-center text-center">
      <p className="text-[12px] text-[#8a97a5]" style={sc}>{N.chapter} {toRoman(i + 1)}</p>
      <h2 className="mt-4 text-[2.4rem] italic leading-[1.05] @3xl:text-[3.4rem]" style={ff.display}>{title}</h2>
      <Rule className="mt-6" />
    </div>
  );

  const section = (id: SectionId, i: number): ReactNode => {
    switch (id) {
      case "invitation":
        return (
          <div className={`mx-auto grid max-w-5xl items-center gap-14 ${pad} ${heroUrl ? "@3xl:grid-cols-[1fr_1.05fr]" : ""}`}>
            {heroUrl !== undefined && (
              <div data-reveal className="relative mx-auto w-full max-w-sm">
                <div className="neva-frame overflow-hidden rounded-[50%/42%]">
                  <Photo src={heroUrl} className="aspect-[3/4] w-full object-cover grayscale-[.25] sepia-[.08]" fallback={<div className="aspect-[3/4] w-full"><NevaScene layout="tall" className="h-full w-full" still={compact} /></div>} />
                </div>
                <BirchBranch className="pointer-events-none absolute -right-12 -top-10 w-32 @3xl:w-40" seed={4} />
              </div>
            )}
            <div className="text-center @3xl:text-left">
              {head(i, L.invitation)}
              <E as="p" multiline path="profile.inviteLine" className="block text-[1.7rem] italic leading-[1.5] @3xl:text-[2rem]" style={ff.display}>{S.invite}</E>
              <p data-reveal className="mt-10 text-[2.6rem] text-[#7d8a97]" style={ff.script}>{b ? `${a} & ${b}` : a}</p>
            </div>
          </div>
        );
      case "story":
        return (
          <div className={`mx-auto max-w-3xl ${pad}`}>
            {head(i, L.story)}
            <div className="grid gap-8 @3xl:grid-cols-[7rem_1fr]">
              <p data-reveal className="hidden text-[7rem] leading-[0.8] text-[#c3ccd5] @3xl:block" style={ff.display}>«</p>
              <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.45rem] leading-[1.75] @3xl:text-[1.6rem]" style={ff.body}>{profile.story}</E>
            </div>
          </div>
        );
      case "details":
        return (
          <div className={`mx-auto max-w-5xl ${pad}`}>
            {head(i, L.details)}
            <div className="grid items-start gap-16 text-center @3xl:grid-cols-2">
              {date && (
                <div data-reveal>
                  <p className="text-[13px] text-[#8a97a5]" style={sc}>{date.weekday}</p>
                  <p className="mt-4 text-[clamp(4.5rem,16cqw,8.5rem)] leading-[0.9]" style={ff.display}><span className="wa-foil neva-silver">{date.dd}</span><span className="mx-3 text-[#c3ccd5]">·</span><span className="wa-foil neva-silver">{toRoman(+date.mm)}</span></p>
                  <p className="mt-3 text-2xl italic" style={ff.display}>{date.month} {date.year}</p>
                  {whiteNight && <p className="mt-6 text-[12px] text-[#8a97a5]" style={sc}>{N.nights} · {N.sunset} 22:26 · {N.sunrise} 03:35</p>}
                </div>
              )}
              {S.where && (
                <div data-reveal="0.12" className="flex flex-col items-center">
                  <p className="text-[13px] text-[#8a97a5]" style={sc}>{L.where}</p>
                  <E as="p" path={S.wherePath} className="mt-5 block text-[2.2rem] leading-[1.15] @3xl:text-[2.6rem]" style={ff.display}>{S.where}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-xl italic text-[var(--t-muted)]" style={ff.display}>{profile.city}</E>}
                  {calendarUrl && <a href={calendarUrl} className="wa-btn mt-10 border border-[#b8c2cc] hover:border-[var(--t-ink)]">{L.calendar}</a>}
                </div>
              )}
            </div>
          </div>
        );
      case "schedule":
        return (
          <div className={`mx-auto max-w-3xl ${pad}`}>
            {head(i, L.events)}
            <ol className="relative">
              <span className="absolute bottom-0 left-[5.5rem] top-0 w-px bg-gradient-to-b from-transparent via-[#b8c2cc] to-transparent @3xl:left-[8rem]" />
              {S.events.map((e, j) => (
                <li key={j} data-reveal={j * 0.08} className="relative grid grid-cols-[5.5rem_1fr] gap-8 py-7 @3xl:grid-cols-[8rem_1fr]">
                  <p className="pt-1 text-right text-[1.7rem] leading-none @3xl:text-[2.2rem]" style={ff.display}>{e.time || toRoman(j + 1)}</p>
                  <span className="absolute left-[5.5rem] top-10 h-2 w-2 -translate-x-1/2 rotate-45 border border-[#8a97a5] bg-[var(--t-bg)] @3xl:left-[8rem]" />
                  <div>
                    <h3 className="text-[1.8rem] italic leading-tight @3xl:text-[2.1rem]" style={ff.display}>{e.name}</h3>
                    <p className="mt-1 text-[12px] text-[var(--t-muted)]" style={sc}>{[eventWhen({ ...e, time: undefined }, S.lang), e.venue].filter(Boolean).join(" · ")}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );
      case "venue":
        return (
          <div className={`mx-auto max-w-5xl ${pad}`}>
            {head(i, L.venue)}
            <div data-reveal className="neva-frame relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden @3xl:aspect-[16/7]">
              <NevaScene layout="wide" className="absolute inset-0 h-full w-full" still={compact} />
            </div>
            <div data-reveal className="mt-10 text-center">
              <E as="p" path={S.wherePath} className="block text-[2rem] italic" style={ff.display}>{S.where}</E>
              {profile.venue && profile.city && <p className="mt-1 text-[13px] text-[var(--t-muted)]" style={sc}>{profile.city}</p>}
              <a target="_blank" rel="noreferrer" href={S.map} className="wa-btn mt-8 bg-[var(--t-ink)] text-[var(--t-bg)]">{L.directions}</a>
              {S.goa && <p className="mx-auto mt-10 max-w-xl text-lg italic leading-relaxed text-[var(--t-muted)]">{L.travelText}</p>}
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className={`mx-auto max-w-6xl ${pad}`}>
            {head(i, L.gallery)}
            <div className="columns-2 gap-5 @3xl:columns-3">
              {S.gallery.map((g, j) => (
                <div key={g.key} data-reveal={(j % 3) * 0.08} className="neva-frame mb-6 break-inside-avoid overflow-hidden">
                  <Photo slot="gallery" galleryKey={g.key} src={g.src} className="w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        );
      case "rsvp":
        return (
          <div className={`mx-auto max-w-xl ${pad}`}>
            {head(i, L.rsvp)}
            <p data-reveal className="-mt-6 mb-10 text-center text-xl italic text-[var(--t-muted)]" style={ff.display}>{L.attend}</p>
            <div data-reveal className="neva-frame relative bg-[var(--t-surface)] p-7 @2xl:p-10">{children}</div>
          </div>
        );
      case "info":
        return (
          <div className={`mx-auto max-w-2xl text-center ${pad}`}>
            {head(i, L.info)}
            <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed text-[var(--t-muted)]">{S.info}</E>
          </div>
        );
      default: return null;
    }
  };

  const nameCls = "wa-name block text-[clamp(3.2rem,13cqw,7.5rem)] leading-[0.95]";
  return (
    <div ref={ref} lang={profile.language ?? "en"} style={{ ...rootVars(theme, design, "neva-monogram", FACES), ...ff.body }} className={`neva neva-ivory relative overflow-hidden text-[var(--t-ink)] @container ${FONTS} ${ready ? "" : "wa-pre"}`}>
      <header data-hero className={`relative flex flex-col items-center justify-center overflow-hidden px-6 text-center ${compact ? "min-h-[720px] py-12" : "min-h-[100svh] py-14"}`}>
        {!compact && <BirchBranch className="pointer-events-none absolute -left-4 top-0 w-36 opacity-80 @3xl:w-60" seed={3} />}
        {!compact && <BirchBranch className="pointer-events-none absolute -right-4 top-0 w-28 opacity-70 @3xl:w-48" seed={8} flip />}
        <div data-crest data-in className="w-[72px] text-[#8a97a5] @3xl:w-[88px]"><Crest a={ia} b={ib} /></div>
        <p data-in className="mt-4 text-[13px] text-[#8a97a5]" style={sc}>{S.occ === "wedding" ? W.wedding : S.line}</p>
        <div className="mt-6 flex w-full flex-col items-center gap-6 @3xl:flex-row @3xl:justify-center @3xl:gap-12">
          <h1 data-names data-in className="order-2 flex flex-col items-center @3xl:order-1 @3xl:w-[30%] @3xl:items-end" style={ff.display}>
            <E path="profile.partner1" className={nameCls}>{a}</E>
            {b && <span className="block text-[clamp(2rem,7cqw,3.4rem)] leading-none text-[#8a97a5] @3xl:hidden" style={ff.script}>&amp;</span>}
            {b && <E path="profile.partner2" className={`${nameCls} @3xl:hidden`}>{b}</E>}
          </h1>
          <div className="relative order-1 aspect-square w-[min(78cqw,46svh)] shrink-0 @3xl:order-2 @3xl:w-[min(34cqw,58svh)]">
            <div data-window className="neva-frame absolute inset-0 overflow-hidden rounded-full"><NevaScene layout="square" className="h-full w-full" still={compact} /></div>
            <div data-intro className="neva-mono absolute inset-[4%] hidden"><Wreath className="absolute inset-0 h-full w-full" stroke="#8a97a5" sw={1} /><Monogram a={ia} b={ib} className="absolute inset-[16%] h-[68%] w-[68%]" /></div>
          </div>
          {b && (
            <div data-in className="order-3 hidden @3xl:flex @3xl:w-[30%] @3xl:flex-col @3xl:items-start" style={ff.display}>
              <span className="block text-[3rem] leading-none text-[#8a97a5]" style={ff.script}>&amp;</span>
              <E path="profile.partner2" className={nameCls}>{b}</E>
            </div>
          )}
        </div>
        <div data-hero-meta data-in className="mt-8 flex flex-col items-center gap-2">
          {date && <p className="text-[15px] text-[var(--t-ink)]" style={sc}>{date.full}</p>}
          {S.where && <E as="p" path={S.wherePath} className="block text-lg italic text-[var(--t-muted)]" style={ff.display}>{S.where}</E>}
          {days !== null && days > 0 && <p className="mt-3 text-[12px] text-[#8a97a5]" style={sc}>{days} · {W.days}</p>}
        </div>
        <style>{`.neva [data-intro]{display:none}@media (prefers-reduced-motion:no-preference){.wa-pre.neva [data-intro]{display:block}.wa-pre.neva [data-window]{clip-path:circle(0% at 50% 50%)}}`}</style>
      </header>

      {vis.map((id, i) => (
        <Sec key={id} id={id} style={{ background: i % 2 ? "color-mix(in oklab, var(--t-bg) 70%, #e9e6f0)" : undefined }}>{section(id, i)}</Sec>
      ))}

      <footer className="relative pb-14 pt-24 text-center" style={{ background: "linear-gradient(to bottom, transparent, #e6e2ee)" }}>
        <div data-draw className="mx-auto w-28 text-[#8a97a5]"><Crest a={ia} b={ib} /></div>
        {profile.blessing && <E as="p" path="profile.blessing" className="mx-auto mt-8 block max-w-xl px-6 text-3xl text-[#7d8a97]" style={ff.script}>{profile.blessing}</E>}
        <p className="mt-6 text-[2.2rem] italic" style={ff.display}>{b ? `${a} & ${b}` : a}</p>
        {S.occ === "wedding" && <p className="mt-4 text-[12px] text-[#8a97a5]" style={sc}>{L.forever}</p>}
        {credit && <div className="mt-12 text-[11px] tracking-wide text-[var(--t-muted)]">{credit}</div>}
      </footer>
    </div>
  );
}
