"use client";
import { useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { eventWhen, siteData } from "../_shared/data";
import { ensureGsap, reducedMotion, revealOnScroll, useDaysLeft, useLenis, useScene } from "../_shared/motion";
import { ff, Photo, rootVars, Sec } from "../_shared/ui";
import { lari, MarigoldArt, PETAL_COLORS, Splash, Sun, toran, Urli, Wreath } from "./art";
import { FACES, FONTS, sunshine } from "./faces";
import "./haldi.css";

const disp = { ...ff.display } as const;
const BG = ["#fff8ec", "#fde7a8"]; // cream, turmeric wash — alternating like tent panels

/** Tap a marigold: it bursts into petals and grows back. */
export function burstAt(host: HTMLElement, target: Element, x: number, y: number) {
  if (reducedMotion()) return;
  const gsap = ensureGsap();
  const box = host.getBoundingClientRect();
  const px = x - box.left, py = y - box.top;
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    p.className = "haldi-petal";
    p.style.left = `${px - 5}px`; p.style.top = `${py - 7}px`;
    p.style.background = PETAL_COLORS[i % PETAL_COLORS.length];
    host.appendChild(p);
    const a = (i / 16) * Math.PI * 2 + Math.random() * 0.4, d = 50 + Math.random() * 90;
    gsap.timeline({ onComplete: () => p.remove() })
      .to(p, { x: Math.cos(a) * d, y: Math.sin(a) * d - 30, rotation: Math.random() * 540, duration: 0.55, ease: "power2.out" })
      .to(p, { y: `+=${180 + Math.random() * 160}`, x: `+=${(Math.random() - 0.5) * 80}`, rotation: "+=360", opacity: 0, duration: 1.6, ease: "power1.in" });
  }
  gsap.timeline().to(target, { scale: 0, duration: 0.18, ease: "power2.in", transformOrigin: "50% 50%" }).to(target, { scale: 1, duration: 0.9, ease: "elastic.out(1, .45)", delay: 2.2 });
}

export default function HaldiSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const S = siteData(profile, design);
  const { a, b, L, W, date } = S;
  const ref = useRef<HTMLDivElement>(null);
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  const ready = useScene(ref, (k) => {
    const tl = k.gsap.timeline();
    tl.from("[data-hero] [data-toran]", { y: -90, duration: 1.3, ease: "bounce.out" }, 0.1)
      .from("[data-hero] [data-lari]", { y: -900, duration: 1.6, ease: "bounce.out", stagger: { each: 0.12, from: "edges" } }, 0.2)
      .from("[data-hero] [data-splash]", { scale: 0, rotate: -40, opacity: 0, transformOrigin: "50% 50%", duration: 1.6, ease: "power3.out", stagger: 0.15 }, 0.5)
      .from("[data-hero] [data-hsun]", { scale: 0, rotate: -90, transformOrigin: "50% 50%", duration: 1.3, ease: "back.out(2)" }, 0.8);
    const split = new k.Split("[data-names] .haldi-n", { type: "chars", charsClass: "wa-ch" });
    tl.fromTo("[data-in]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 1.1)
      .from(split.chars, { scale: 0, y: 40, rotate: () => (Math.random() - 0.5) * 50, duration: 0.9, ease: "back.out(3)", stagger: 0.05 }, 1.15)
      .from("[data-amp]", { scale: 0, rotate: -30, duration: 0.8, ease: "back.out(3)" }, 1.5)
      .from("[data-hero-meta] > *", { y: 20, opacity: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.1 }, 1.7)
      .from("[data-badge]", { scale: 0, rotate: -120, duration: 1, ease: "back.out(2.4)" }, 2);
    if (compact) return;
    const st = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
    k.gsap.to("[data-hero] [data-hsun]", { rotate: 50, yPercent: 15, scrollTrigger: st });
    k.gsap.to("[data-hero] [data-lari]", { y: (i: number) => -60 - (i % 3) * 30, scrollTrigger: st });
    revealOnScroll(k, { y: 40, blur: false });
    k.q("[data-pop]").forEach((el) => k.gsap.from(el, { scale: 0.6, rotate: -8, opacity: 0, duration: 1, ease: "back.out(2)", scrollTrigger: { trigger: el, start: "top 85%", once: true } }));
    k.q("[data-sec] [data-mg]").forEach((el, i) => k.gsap.from(el, { scale: 0, duration: 0.6, ease: "back.out(3)", delay: (i % 22) * 0.03, scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
  }, [compact]);

  const onTap = (e: React.PointerEvent) => {
    if (compact || !ref.current) return;
    const mg = (e.target as Element).closest("[data-mg]");
    if (mg) burstAt(ref.current, mg, e.clientX, e.clientY);
  };

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
  const head = (n: number, title: string) => (
    <div data-reveal className="mb-12 flex flex-col items-center text-center">
      <p className="text-xl" style={{ ...ff.script, color: "var(--t-accent)" }}>— {String(n).padStart(2, "0")} —</p>
      <h2 className="haldi-d mt-1 text-[2.8rem] font-semibold leading-[1] @3xl:text-[4rem]" style={disp}>{title}</h2>
    </div>
  );
  const pad = "px-6 @3xl:px-16";

  const render = (sid: SectionId, i: number): ReactNode => {
    const n = i + 1;
    switch (sid) {
      case "invitation":
        return (
          <div className={`mx-auto grid max-w-6xl items-center gap-14 py-24 @3xl:grid-cols-2 @3xl:py-32 ${pad}`}>
            <div data-pop className="relative mx-auto aspect-square w-full max-w-[420px]">
              <div className="absolute inset-[13%] overflow-hidden rounded-full bg-[#fde7a8]">
                <Photo src={heroUrl} className="h-full w-full object-cover" fallback={<Sun className="h-full w-full p-6" still />} />
              </div>
              <Wreath className="haldi-mg absolute inset-0 h-full w-full" />
            </div>
            <div data-reveal className="text-center @3xl:text-left">
              {head(n, L.invitation)}
              <E as="p" multiline path="profile.inviteLine" className="haldi-d -mt-4 block text-[1.8rem] italic leading-[1.3] @3xl:text-[2.3rem]" style={disp}>{S.invite}</E>
              <p className="mt-6 -rotate-2 text-3xl" style={{ ...ff.script, color: "var(--t-accent)" }}>{sunshine(S.lang)} ☀</p>
            </div>
          </div>
        );
      case "story":
        return (
          <div className={`relative mx-auto max-w-3xl py-24 text-center @3xl:py-32 ${pad}`}>
            <Splash className="pointer-events-none absolute left-1/2 top-1/2 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-50" seed={11} />
            <div className="relative">
              {head(n, L.story)}
              <div data-reveal><E as="p" multiline path="profile.story" className="haldi-d block whitespace-pre-line text-[1.6rem] italic leading-[1.5] @3xl:text-[2rem]" style={disp}>{profile.story}</E></div>
            </div>
          </div>
        );
      case "details":
        return (
          <div className={`mx-auto max-w-5xl py-24 @3xl:py-32 ${pad}`}>
            {head(n, L.details)}
            <div className="grid gap-10 @3xl:grid-cols-2">
              {date && (
                <div data-pop className="haldi-tag relative -rotate-2 rounded-[22px] px-8 pb-10 pt-14 text-center">
                  <MarigoldArt viewBox="-24 -24 48 48" className="haldi-mg absolute -top-7 left-1/2 w-14 -translate-x-1/2">{(id) => <g data-mg><use href={`#${id}o`} x="-22" y="-22" width="44" height="44" /></g>}</MarigoldArt>
                  <p className="text-lg" style={{ ...ff.script, color: "var(--t-accent)" }}>{L.when}</p>
                  <p className="haldi-d mt-2 text-[6rem] font-semibold leading-[0.9]" style={disp}>{date.day}</p>
                  <p className="haldi-d text-3xl" style={disp}>{date.month} {date.year}</p>
                  <p className="mt-1 italic opacity-70">{date.weekday}</p>
                </div>
              )}
              {S.where && (
                <div data-pop className="haldi-tag relative rotate-2 rounded-[22px] px-8 pb-10 pt-14 text-center">
                  <MarigoldArt viewBox="-24 -24 48 48" className="haldi-mg absolute -top-7 left-1/2 w-14 -translate-x-1/2">{(id) => <g data-mg><use href={`#${id}y`} x="-22" y="-22" width="44" height="44" /></g>}</MarigoldArt>
                  <p className="text-lg" style={{ ...ff.script, color: "var(--t-accent)" }}>{L.where}</p>
                  <E as="p" path={S.wherePath} className="haldi-d mt-4 block text-[2.6rem] font-semibold leading-[1.05]" style={disp}>{S.where}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-2 block text-xl italic opacity-75">{profile.city}</E>}
                </div>
              )}
            </div>
            {calendarUrl && <div className="mt-14 text-center"><a href={calendarUrl} className="wa-btn haldi-btn">{L.calendar}</a></div>}
          </div>
        );
      case "schedule":
        return (
          <div className={`mx-auto max-w-4xl py-24 @3xl:py-32 ${pad}`}>
            {head(n, L.events)}
            <ol className="relative">
              <span aria-hidden className="absolute bottom-0 left-[27px] top-0 w-[2px] bg-[repeating-linear-gradient(to_bottom,#b06a1a_0_6px,transparent_6px_11px)] @3xl:left-1/2 @3xl:-ml-px" />
              {S.events.map((e, j) => (
                <li key={j} data-reveal={j * 0.1} className={`relative mb-12 pl-20 @3xl:w-1/2 @3xl:pl-0 ${j % 2 ? "@3xl:ml-auto @3xl:pl-16" : "@3xl:pr-16 @3xl:text-right"}`}>
                  <MarigoldArt viewBox="-24 -24 48 48" className={`haldi-mg absolute left-0 top-0 w-14 ${j % 2 ? "@3xl:-left-7" : "@3xl:left-auto @3xl:-right-7"}`}>{(id) => <g data-mg><use href={`#${id}${j % 2 ? "y" : "o"}`} x="-22" y="-22" width="44" height="44" /></g>}</MarigoldArt>
                  <div className={`haldi-tag inline-block rounded-[18px] px-6 py-5 text-left ${j % 2 ? "rotate-1" : "-rotate-1"}`}>
                    <p className="text-xl" style={{ ...ff.script, color: "var(--t-accent)" }}>{e.time}</p>
                    <h3 className="haldi-d text-[2rem] font-semibold leading-tight" style={disp}>{e.name}</h3>
                    <p className="mt-1 text-sm italic opacity-70">{[eventWhen({ ...e, time: undefined }, S.lang), e.venue].filter(Boolean).join(" · ")}</p>
                  </div>
                </li>
              ))}
            </ol>
            {calendarUrl && !S.visible.includes("details") && <div className="text-center"><a href={calendarUrl} className="wa-btn haldi-btn">{L.calendar}</a></div>}
          </div>
        );
      case "venue":
        return (
          <div className={`mx-auto max-w-3xl py-24 text-center @3xl:py-32 ${pad}`}>
            {head(n, L.venue)}
            <div data-pop className="mx-auto w-full max-w-md"><Urli className="w-full" /></div>
            <E as="p" path={S.wherePath} className="haldi-d mt-8 block text-[2.8rem] font-semibold leading-[1.05]" style={disp}>{S.where}</E>
            {profile.venue && profile.city && <p className="mt-2 text-xl italic opacity-75">{profile.city}</p>}
            <a target="_blank" rel="noreferrer" href={S.map} className="wa-btn haldi-btn mt-8">{L.directions} →</a>
            {S.goa && <p className="mx-auto mt-10 max-w-xl text-lg italic leading-relaxed opacity-75"><span className="mb-1 block not-italic" style={{ ...ff.script, color: "var(--t-accent)" }}>{L.travel}</span>{L.travelText}</p>}
          </div>
        );
      case "gallery":
        return (
          <div className={`mx-auto max-w-6xl py-24 @3xl:py-32 ${pad}`}>
            {head(n, L.gallery)}
            <div className="grid grid-cols-2 gap-6 @3xl:grid-cols-3">
              {S.gallery.map((g, j) => (
                <div key={g.key} data-pop className="relative bg-white p-3 pb-10 shadow-[0_20px_40px_-24px_rgba(120,50,0,.5)]" style={{ transform: `rotate(${[-3, 2, -1.5, 3, -2.5, 1][j % 6]}deg)` }}>
                  <Photo slot="gallery" galleryKey={g.key} src={g.src} className="aspect-square w-full object-cover" />
                  <MarigoldArt viewBox="-24 -24 48 48" className="haldi-mg absolute -top-5 left-1/2 w-10 -translate-x-1/2">{(id) => <g data-mg><use href={`#${id}${j % 2 ? "y" : "o"}`} x="-22" y="-22" width="44" height="44" /></g>}</MarigoldArt>
                </div>
              ))}
            </div>
          </div>
        );
      case "rsvp":
        return (
          <div className="pb-24 @3xl:pb-32">
            <div className="haldi-awning" aria-hidden />
            <div className={`mx-auto max-w-2xl pt-20 ${pad}`}>
              {head(n, L.rsvp)}
              <p data-reveal className="-mt-6 mb-10 text-center text-3xl" style={{ ...ff.script, color: "var(--t-accent)" }}>{L.attend}</p>
              <div data-pop className="haldi-tag rounded-[28px] p-7 @2xl:p-10">{children}</div>
            </div>
          </div>
        );
      case "info":
        return (
          <div className={`mx-auto max-w-2xl py-24 text-center ${pad}`}>
            {head(n, L.info)}
            <div data-reveal><E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed opacity-80">{S.info}</E></div>
          </div>
        );
    }
    return null;
  };

  return (
    <div ref={ref} onPointerDown={onTap} lang={profile.language ?? "en"} style={{ ...rootVars(theme, design, "haldi-sun", FACES), ...ff.body }}
      className={`haldi haldi-b @container relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] ${FONTS} ${ready ? "" : "wa-pre"}`}>
      {/* ── Hero: a turmeric morning under a toran ── */}
      <header data-hero className={`relative isolate flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,#ffe27a,#fbc53a_55%,#f6a829)] ${compact ? "min-h-[660px]" : "min-h-[100svh]"}`}>
        <Splash className="pointer-events-none absolute -left-24 top-[12%] w-[380px] opacity-70 @3xl:w-[520px]" seed={3} color="#ffd34a" />
        <Splash className="pointer-events-none absolute -right-28 bottom-[6%] w-[420px] opacity-70 @3xl:w-[600px]" seed={7} color="#f39c34" />
        <Sun className="pointer-events-none absolute left-1/2 top-1/2 w-[min(118cqw,760px)] -translate-x-1/2 -translate-y-[54%] opacity-95" still={compact} />
        {/* garlands: wide (four laris) / narrow (two) */}
        <MarigoldArt viewBox="0 0 1440 900" className="haldi-mg pointer-events-auto absolute inset-x-0 top-0 hidden w-full @3xl:block" style={{ height: "auto" }}>
          {(id) => <>{lari(id, 70, 10, 560, 1.15, 1)}{lari(id, 170, 10, 380, 1, 2)}{lari(id, 1270, 10, 420, 1, 4)}{lari(id, 1370, 10, 600, 1.15, 5)}{toran(id, 1440, 1.25, 3)}</>}
        </MarigoldArt>
        <MarigoldArt viewBox="0 0 390 844" className="haldi-mg absolute inset-x-0 top-0 w-full @3xl:hidden">
          {(id) => <>{lari(id, 26, 8, 380, 0.85, 1)}{lari(id, 364, 8, 300, 0.85, 4)}{toran(id, 390, 0.85, 3)}</>}
        </MarigoldArt>
        <div className="relative z-[2] flex flex-col items-center px-8 pt-16 text-center">
          <p data-in className="text-2xl @3xl:text-3xl" style={{ ...ff.script, color: "#9a2f12" }}>{S.occ === "wedding" ? W.wedding : S.line}</p>
          <h1 data-in data-names className="haldi-d mt-2 flex flex-col items-center font-bold leading-[0.88] text-[#5a1f08] @3xl:flex-row @3xl:items-baseline @3xl:gap-6" style={disp}>
            <E path="profile.partner1" className="haldi-n block text-[clamp(3.8rem,17cqw,9rem)]">{a}</E>
            {b && <span data-amp className="block text-[clamp(2.6rem,10cqw,5rem)] text-[var(--t-accent)]" style={ff.script}>&amp;</span>}
            {b && <E path="profile.partner2" className="haldi-n block text-[clamp(3.8rem,17cqw,9rem)]">{b}</E>}
          </h1>
          <div data-in data-hero-meta className="mt-6 flex flex-col items-center gap-2 text-[#5a1f08]">
            {date && <p className="haldi-d text-2xl font-medium @3xl:text-3xl" style={disp}>{date.full}</p>}
            {S.where && <E as="p" path={S.wherePath} className="block text-lg italic">{S.where}</E>}
            <p className="mt-2 -rotate-2 text-2xl" style={{ ...ff.script, color: "var(--t-accent)" }}>{sunshine(S.lang)}</p>
          </div>
        </div>
        {days !== null && days > 0 && (
          <div data-badge className="absolute bottom-10 right-6 z-[3] grid h-28 w-28 place-items-center rounded-full bg-[var(--t-accent)] text-center text-[#fff6e0] shadow-[0_14px_30px_-12px_rgba(120,30,0,.6)] @3xl:bottom-16 @3xl:right-[12%] @3xl:h-36 @3xl:w-36" style={{ animation: compact ? undefined : "haldi-wobble 4s ease-in-out infinite" }}>
            <div><p className="haldi-d text-4xl font-bold leading-none @3xl:text-5xl" style={disp}>{days}</p><p className="mt-1 px-3 text-[11px] leading-tight" style={ff.script}>{W.days}</p></div>
          </div>
        )}
        <div className="haldi-scallop absolute inset-x-0 -bottom-[21px] z-[4]" style={{ ["--sc" as string]: "#f9b934" }} />
      </header>

      {vis.map((sid, i) => (
        <Sec key={sid} id={sid} style={{ background: BG[i % 2] }}>
          <div data-sec>{render(sid, i)}</div>
          {i < vis.length - 1 && sid !== "rsvp" && <div className="haldi-scallop absolute inset-x-0 -bottom-[21px] z-[2]" style={{ ["--sc" as string]: BG[i % 2] }} />}
        </Sec>
      ))}

      <footer className="relative overflow-hidden bg-[#f8b02f] pb-14 pt-28 text-center text-[#5a1f08]">
        <MarigoldArt viewBox="0 0 1440 80" className="haldi-mg absolute inset-x-0 top-0 w-full">{(id) => toran(id, 1440, 1, 9)}</MarigoldArt>
        {profile.blessing && <E as="p" path="profile.blessing" className="mx-auto mb-6 block max-w-xl px-6 text-3xl" style={{ ...ff.script, color: "#9a2f12" }}>{profile.blessing}</E>}
        <p className="haldi-d text-7xl font-bold" style={disp}>{a[0]}{b && <><span className="mx-2 text-5xl text-[var(--t-accent)]" style={ff.script}>&amp;</span>{b[0]}</>}</p>
        {S.occ === "wedding" && <p className="mt-4 text-2xl" style={ff.script}>{L.forever}</p>}
        {credit && <div className="mt-10 text-[11px] tracking-wide opacity-70">{credit}</div>}
      </footer>
    </div>
  );
}
