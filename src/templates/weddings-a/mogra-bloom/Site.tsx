"use client";
import { useId, useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { eventWhen, siteData } from "../_shared/data";
import { revealOnScroll, useDaysLeft, useLenis, useScene } from "../_shared/motion";
import { ff, Photo, rootVars, Sec } from "../_shared/ui";
import { bloom, Gajra, GajraArt, JasmineDefs, JasmineMark, Kasavu, Lamp, Roofline, type Strand } from "./art";
import { FACES, FONTS } from "./faces";
import "./mogra.css";

const it = ff.script;

// Hero garlands — one composition for wide screens, one for phones.
const WIDE: Strand[] = [
  { pts: [[-40, 60], [300, 250], [1140, 250], [1480, 60]], seed: 5, step: 12, s: 1.05, flowerEvery: 4 },
  { pts: [[-30, 20], [400, 360], [1040, 360], [1470, 20]], seed: 2, step: 13, s: 1.45 },
  { pts: [[262, 205], [264, 300], [258, 380], [262, 470]], seed: 8, step: 12, s: 1.15, leaves: false },
  { pts: [[1178, 205], [1176, 300], [1182, 380], [1178, 450]], seed: 9, step: 12, s: 1.15, leaves: false },
];
const TALL: Strand[] = [
  { pts: [[-14, 24], [110, 236], [290, 236], [414, 24]], seed: 2, step: 12, s: 1 },
  { pts: [[60, 128], [61, 190], [58, 240], [60, 300]], seed: 8, step: 11, s: 0.75, leaves: false },
  { pts: [[340, 128], [339, 180], [342, 230], [340, 280]], seed: 9, step: 11, s: 0.75, leaves: false },
];

export default function MograSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const S = siteData(profile, design);
  const { a, b, L, W, date } = S;
  const ref = useRef<HTMLDivElement>(null);
  const id = "h" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  const ready = useScene(ref, (k) => {
    bloom(k, "[data-hero-art]", 0.1);
    const tl = k.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo("[data-in]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.6)
      .from("[data-eyebrow]", { y: 10, opacity: 0, duration: 1.2 }, 0.6)
      .fromTo("[data-ink]", { clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0% -20% 0)", duration: 1.9, ease: "power2.inOut", stagger: 0.45 }, 0.9)
      .from("[data-amp]", { opacity: 0, scale: 0.7, duration: 1.4 }, 1.5)
      .from("[data-hero-meta] > *", { y: 14, opacity: 0, duration: 1.1, stagger: 0.12 }, 2.1)
      .from("[data-kasavu]", { scaleX: 0, duration: 2.2, ease: "power3.inOut" }, 0.4)
      .from("[data-lamp]", { opacity: 0, y: 20, duration: 1.6 }, 1.8);
    if (compact) return;
    const st = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
    k.gsap.to("[data-hero-art]", { yPercent: -18, scrollTrigger: st });
    k.gsap.to("[data-hero-copy]", { yPercent: -20, opacity: 0.2, scrollTrigger: st });
    revealOnScroll(k, { y: 26 });
    k.q("[data-sec-gajra]").forEach((el) => {
      const t = bloom(k, `[data-sec-gajra="${el.dataset.secGajra}"]`);
      t.pause();
      k.ST.create({ trigger: el, start: "top 85%", once: true, onEnter: () => t.play() });
    });
  }, [compact]);

  const vis = S.visible.filter((sid) => has(sid));
  function has(sid: SectionId) {
    switch (sid) {
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
  }
  const muted = { color: "var(--t-muted)" };
  const label = (n: number, title: string) => (
    <div data-reveal className="mb-10 @3xl:mb-0">
      <p className="text-[11px] tracking-[0.4em]" style={{ color: "var(--t-gold)" }}>{String(n).padStart(2, "0")}</p>
      <h2 className="mog-italic mt-3 text-[2.4rem] font-light leading-[1.05] @3xl:text-[2.9rem]" style={it}>{title}</h2>
    </div>
  );
  const grid = (n: number, title: string, body: ReactNode, wide = false) => (
    <div className={`mx-auto grid max-w-6xl px-6 py-24 @3xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] @3xl:gap-16 @3xl:px-16 @3xl:py-32 ${wide ? "" : ""}`}>
      {label(n, title)}
      <div>{body}</div>
    </div>
  );

  const render = (sid: SectionId, i: number): ReactNode => {
    const n = i + 1;
    switch (sid) {
      case "invitation":
        return grid(n, L.invitation, (
          <div className="grid items-center gap-12 @3xl:grid-cols-[1fr_1fr]">
            <figure data-reveal className="relative mx-auto w-full max-w-sm">
              <div className="overflow-hidden rounded-t-full bg-[color-mix(in_oklab,var(--t-accent)_10%,var(--t-surface))] p-[6px] shadow-[0_40px_70px_-50px_rgba(60,60,30,.6)]">
                <Photo src={heroUrl} className="aspect-[3/4] w-full rounded-t-full object-cover" style={{ filter: "saturate(.9) contrast(.98)" }}
                  fallback={<div className="grid aspect-[3/4] place-items-center rounded-t-full"><JasmineMark className="w-24 opacity-70" /></div>} />
              </div>
              <Kasavu className="mt-3" />
              <div className="pointer-events-none absolute -left-10 -top-6 w-[75%] -rotate-6" data-sec-gajra="photo">
                <GajraArt viewBox="0 0 300 120" className="w-full" strands={[{ pts: [[0, 20], [80, 110], [200, 110], [300, 30]], seed: 12, step: 12 }]} />
              </div>
            </figure>
            <div data-reveal="0.15">
              <E as="p" multiline path="profile.inviteLine" className="mog-italic block text-[1.85rem] font-light leading-[1.35] @3xl:text-[2.3rem]" style={it}>{S.invite}</E>
              <p className="mt-8 text-[11px] uppercase tracking-[0.36em]" style={muted}>{b ? `${a} · ${b}` : a}</p>
            </div>
          </div>
        ));
      case "story":
        return grid(n, L.story, (
          <div data-reveal>
            <p className="mb-2 text-7xl leading-none" style={{ ...ff.display, color: "var(--t-gold)" }}>“</p>
            <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.6rem] font-light leading-[1.55] @3xl:text-[2rem]" style={ff.display}>{profile.story}</E>
          </div>
        ));
      case "details":
        return grid(n, L.details, (
          <div className="grid gap-14 @2xl:grid-cols-2">
            {date && (
              <div data-reveal>
                <p className="text-[11px] uppercase tracking-[0.36em]" style={muted}>{L.when}</p>
                <p className="mt-4 text-[7.5rem] font-light leading-[0.85]" style={ff.display}>{date.day}</p>
                <p className="mt-2 text-3xl font-light" style={ff.display}>{date.month} {date.year}</p>
                <p className="mog-italic mt-1 text-xl" style={{ ...it, color: "var(--t-muted)" }}>{date.weekday}</p>
              </div>
            )}
            {S.where && (
              <div data-reveal="0.12">
                <p className="text-[11px] uppercase tracking-[0.36em]" style={muted}>{L.where}</p>
                <E as="p" path={S.wherePath} className="mt-6 block text-[2.5rem] font-light leading-[1.08]" style={ff.display}>{S.where}</E>
                {profile.venue && profile.city && <E as="p" path="profile.city" className="mog-italic mt-2 block text-xl" style={{ ...it, color: "var(--t-muted)" }}>{profile.city}</E>}
                {calendarUrl && <a href={calendarUrl} className="mog-link mt-8 inline-block text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--t-accent)" }}>{L.calendar}</a>}
              </div>
            )}
          </div>
        ));
      case "schedule":
        return grid(n, L.events, (
          <ol>
            {S.events.map((e, j) => (
              <li key={j} data-reveal={j * 0.1} className="grid grid-cols-[44px_1fr] gap-6">
                <svg viewBox="0 0 44 150" className="h-full min-h-[150px] w-[44px]" preserveAspectRatio="xMidYMin meet" aria-hidden overflow="visible">
                  <JasmineDefs id={`${id}e${j}`} />
                  <Gajra id={`${id}e${j}`} strand={{ pts: [[22, 18], [23, 60], [21, 100], [22, 150]], seed: 20 + j, step: 10, s: 1, leaves: false, flowerEvery: 99 }} />
                  <use href={`#${id}e${j}f`} x="5" y="1" width="34" height="34" />
                </svg>
                <div className="pb-12">
                  <p className="text-[11px] uppercase tracking-[0.36em]" style={{ color: "var(--t-accent)" }}>{e.time}</p>
                  <h3 className="mt-2 text-[2.1rem] font-light leading-tight @3xl:text-[2.6rem]" style={ff.display}>{e.name}</h3>
                  <p className="mog-italic mt-1 text-lg" style={{ ...it, color: "var(--t-muted)" }}>{[eventWhen({ ...e, time: undefined }, S.lang), e.venue].filter(Boolean).join(" · ")}</p>
                </div>
              </li>
            ))}
            {calendarUrl && !S.visible.includes("details") && <li className="pl-[68px]"><a href={calendarUrl} className="mog-link text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--t-accent)" }}>{L.calendar}</a></li>}
          </ol>
        ));
      case "venue":
        return grid(n, L.venue, (
          <div>
            <div data-reveal className="max-w-md" style={{ color: "color-mix(in oklab, var(--t-gold) 85%, var(--t-ink))" }}><Roofline className="w-full" /></div>
            <div data-reveal="0.1" className="mt-10">
              <E as="p" path={S.wherePath} className="block text-[2.5rem] font-light leading-[1.08]" style={ff.display}>{S.where}</E>
              {profile.venue && profile.city && <p className="mog-italic mt-1 text-xl" style={{ ...it, color: "var(--t-muted)" }}>{profile.city}</p>}
              <a target="_blank" rel="noreferrer" href={S.map} className="mog-link mt-8 inline-block text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--t-accent)" }}>{L.directions} →</a>
              {S.goa && <p className="mt-10 max-w-lg text-[15px] leading-relaxed" style={muted}><span className="mb-2 block text-[11px] uppercase tracking-[0.36em]">{L.travel}</span>{L.travelText}</p>}
            </div>
          </div>
        ));
      case "gallery":
        return grid(n, L.gallery, (
          <div className="columns-2 gap-4 @3xl:columns-3">
            {S.gallery.map((g, j) => (
              <div key={g.key} data-reveal={(j % 3) * 0.08} className="mb-4 break-inside-avoid bg-[var(--t-surface)] p-[5px] shadow-[0_0_0_1px_color-mix(in_oklab,var(--t-gold)_40%,transparent)]">
                <Photo slot="gallery" galleryKey={g.key} src={g.src} className="w-full object-cover" />
              </div>
            ))}
          </div>
        ));
      case "rsvp":
        return grid(n, L.rsvp, (
          <div data-reveal className="mog-rsvp relative">
            <Kasavu thin />
            <div className="px-6 py-10 @2xl:px-10">
              <p className="mog-italic mb-8 text-2xl" style={{ ...it, color: "var(--t-muted)" }}>{L.attend}</p>
              {children}
            </div>
            <Kasavu thin />
          </div>
        ));
      case "info":
        return grid(n, L.info, (
          <div data-reveal><E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl font-light leading-relaxed" style={{ ...ff.display, color: "var(--t-muted)" }}>{S.info}</E></div>
        ));
    }
    return null;
  };

  const motes = compact ? [] : Array.from({ length: 14 }, (_, i) => ({ l: 44 + ((i * 37) % 13), d: 10 + (i % 5) * 2.5, dl: -i * 1.3, x: ((i * 29) % 80) - 40 }));

  return (
    <div ref={ref} lang={profile.language ?? "en"} style={{ ...rootVars(theme, design, "mogra-bloom", FACES), ...ff.body }} className={`mog wa-paper @container relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] ${FONTS} ${ready ? "" : "wa-pre"}`}>
      {/* ── Hero: a jasmine string inks itself across cream paper ── */}
      <header data-hero className={`relative isolate flex flex-col overflow-hidden ${compact ? "min-h-[640px]" : "min-h-[100svh]"}`}>
        <div data-hero-art className="pointer-events-none absolute inset-x-0 top-0">
          <GajraArt viewBox="0 0 1440 500" className="hidden w-full @3xl:block" strands={WIDE} />
          <GajraArt viewBox="0 0 400 320" className="w-full @3xl:hidden" strands={TALL} />
        </div>
        <div data-hero-copy className="relative z-[2] flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-[54cqw] text-center @3xl:pb-8 @3xl:pt-[24cqw]">
          <p data-in data-eyebrow className="text-[11px] uppercase tracking-[0.42em]" style={muted}>{S.occ === "wedding" ? W.wedding : S.line}</p>
          <h1 data-in className="mt-7 flex flex-col items-center font-light leading-[0.95] @3xl:flex-row @3xl:items-baseline @3xl:gap-8" style={ff.display}>
            <E path="profile.partner1" className="block text-[clamp(3.6rem,15cqw,8.8rem)] @3xl:text-[clamp(4rem,9cqw,8.8rem)]"><span data-ink className="inline-block px-[0.06em]">{a}</span></E>
            {b && <span data-amp className="mog-italic my-1 block text-[clamp(2rem,7cqw,3.6rem)] leading-none" style={{ ...it, color: "var(--t-gold)" }}>&amp;</span>}
            {b && <E path="profile.partner2" className="block text-[clamp(3.6rem,15cqw,8.8rem)] @3xl:text-[clamp(4rem,9cqw,8.8rem)]"><span data-ink className="inline-block px-[0.06em]">{b}</span></E>}
          </h1>
          <div data-in data-hero-meta className="mt-9 flex flex-col items-center gap-3">
            <span className="h-px w-16 bg-[var(--t-gold)]" />
            {date && <p className="text-[12px] uppercase tracking-[0.42em]">{date.full}</p>}
            {S.where && <E as="p" path={S.wherePath} className="mog-italic block text-xl" style={{ ...it, color: "var(--t-muted)" }}>{S.where}</E>}
            {days !== null && days > 0 && <p className="mt-3 text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--t-accent)" }}>{days} · {W.days}</p>}
          </div>
        </div>
        <div className="relative z-[1]">
          <div className="relative mx-auto w-[86px] @3xl:w-[104px]" data-lamp>
            {motes.map((m, q) => <span key={q} className="mog-mote" style={{ left: `${m.l}%`, top: "10%", ["--d" as string]: `${m.d}s`, ["--dl" as string]: `${m.dl}s`, ["--x" as string]: `${m.x}px` }} />)}
            <Lamp className="w-full" still={compact} />
          </div>
          <div data-kasavu className="mt-3 pb-5"><Kasavu style={{ ["--kb" as string]: "12px" }} /></div>
        </div>
      </header>

      {vis.map((sid, i) => (
        <Sec key={sid} id={sid}>
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 @3xl:px-16" aria-hidden>
            <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--t-gold)_45%,transparent)]" /><JasmineMark className="w-6" /><span className="h-px flex-1 bg-[color-mix(in_oklab,var(--t-gold)_45%,transparent)]" />
          </div>
          {render(sid, i)}
        </Sec>
      ))}

      <footer className="relative pt-16 text-center">
        <Lamp className="mx-auto w-16" still={compact} />
        {profile.blessing && <E as="p" path="profile.blessing" className="mog-italic mx-auto mt-8 block max-w-xl px-6 text-3xl" style={{ ...it, color: "var(--t-accent)" }}>{profile.blessing}</E>}
        <p className="mt-8 text-5xl font-light" style={ff.display}>{a[0]}{b && <><span className="mog-italic mx-2 text-3xl" style={{ ...it, color: "var(--t-gold)" }}>&amp;</span>{b[0]}</>}</p>
        {S.occ === "wedding" && <p className="mt-4 text-[11px] uppercase tracking-[0.36em]" style={muted}>{L.forever}</p>}
        {credit && <div className="mt-10 text-[11px] tracking-wide" style={muted}>{credit}</div>}
        <div className="mt-12 pb-5"><Kasavu style={{ ["--kb" as string]: "12px" }} /></div>
      </footer>
    </div>
  );
}
