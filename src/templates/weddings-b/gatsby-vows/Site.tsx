"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { GATSBY_LOOK } from "./look";
import { fit, fontClass, gsap, lookStyle, Sections, SplitText, ScrollTrigger, useLenis, useStage, useUntil } from "../_shared/kit";
import { dateParts, langOf, mapUrl, media, nameParts, occasionInvite, occasionOf, toRoman, words } from "../_shared/text";
import { Bubbles, Chevrons, DoorArt, Facade, Fan, StepArch, Tower } from "./art";
import { s, GatsbyStyles } from "./styles";

const GOLD = "linear-gradient(160deg,#8c6a2e,#f6e3a8 28%,#a67f3a 52%,#f3d98f 78%,#8c6a2e)";
const disp: CSSProperties = { fontFamily: "var(--wd)" };
const scr: CSSProperties = { fontFamily: "var(--ws)" };

const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-[10.5px] uppercase tracking-[0.42em] text-[#d6b36a] ${className}`}>{children}</p>
);

/** Cut-corner gilt panel with an inner hairline. */
export function Panel({ children, className = "", n = 18, inner = "" }: { children: ReactNode; className?: string; n?: number; inner?: string }) {
  return (
    <div className={`${s.notch} relative p-px ${className}`} style={{ "--n": `${n}px`, background: GOLD } as CSSProperties}>
      <div className={`${s.notch} relative h-full bg-[#0f0d0c]`} style={{ "--n": `${n - 0.4}px` } as CSSProperties}>
        <div aria-hidden className={`${s.notch} pointer-events-none absolute inset-[6px] p-px opacity-40`} style={{ "--n": `${n - 4}px`, background: GOLD } as CSSProperties}>
          <div className={`${s.notch} h-full bg-[#0f0d0c]`} style={{ "--n": `${n - 4.4}px` } as CSSProperties} />
        </div>
        <div className={`relative ${inner}`}>{children}</div>
      </div>
    </div>
  );
}

function Heading({ eyebrow, title }: { eyebrow?: string; title: ReactNode }) {
  return (
    <div data-rise className="mb-14 text-center">
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className={`${s.foil} inline-block text-[2.4rem] uppercase leading-none tracking-[0.14em] md:text-[3.6rem]`} style={disp}>{title}</h2>
      <div data-drawon><Chevrons className="mx-auto mt-6 w-56" /></div>
    </div>
  );
}

function DecoButton({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className={`${s.notch} group relative inline-block p-px transition`} style={{ "--n": "10px", background: GOLD } as CSSProperties}>
      <span className={`${s.notch} block bg-[#0f0d0c] px-7 py-3 text-[11px] uppercase tracking-[0.36em] text-[#f1e3bf] transition group-hover:bg-[#1a1612]`} style={{ "--n": "9.6px" } as CSSProperties}>{children}</span>
    </a>
  );
}

const DoorFrame = () => (
  <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(214,179,106,.12) 0 1px, transparent 1px 22px)" }}>
    <div className="absolute inset-[14px] border-y border-[#d6b36a]/50" />
    <div className="absolute inset-[24px] border-y border-[#d6b36a]/25" />
  </div>
);

function Gate({ a, b, label, onOpen }: { a: string; b: string; label: string; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const [gone, setGone] = useState(false);
  const open = () => {
    const el = ref.current;
    if (done.current || !el) return;
    done.current = true;
    onOpen();
    const q = gsap.utils.selector(el);
    gsap.timeline({ onComplete: () => setGone(true) })
      .to(q("[data-mono]"), { scale: 1.25, opacity: 0, duration: 0.7, ease: "power2.in" })
      .to(q("[data-hint]"), { opacity: 0, duration: 0.3 }, 0)
      .to(q("[data-door=l]"), { rotateY: -112, duration: 1.9, ease: "power3.inOut" }, 0.2)
      .to(q("[data-door=r]"), { rotateY: 112, duration: 1.9, ease: "power3.inOut" }, 0.2)
      .to(q("[data-door]"), { opacity: 0, duration: 0.6 }, 1.5);
  };
  useStage(ref, (g, q) => {
    g.timeline()
      .from(q("[data-draw]"), { drawSVG: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.015 })
      .from(q("[data-ray]"), { drawSVG: 0, duration: 1.1, ease: "power2.out", stagger: { each: 0.03, from: "center" } }, 0.3)
      .from(q("[data-mono]"), { opacity: 0, scale: 0.7, duration: 1.1, ease: "power3.out" }, 0.6)
      .from(q("[data-hint]"), { opacity: 0, y: 10, duration: 0.8 }, 1.4);
    const auto = g.delayedCall(3.4, open);
    return () => auto.kill();
  }, []);
  if (gone) return null;
  return (
    <div ref={ref} className={s.gate} onClick={open} role="button" aria-label={label} tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}>
      <div data-door="l" className={`${s.door} ${s.lacquer} left-0`} style={{ transformOrigin: "0% 50%" }}>
        <DoorFrame /><DoorArt className="absolute inset-y-0 right-0 h-full w-auto" />
      </div>
      <div data-door="r" className={`${s.door} ${s.lacquer} right-0`} style={{ transformOrigin: "100% 50%" }}>
        <DoorFrame /><DoorArt className="absolute inset-y-0 left-0 h-full w-auto -scale-x-100" />
      </div>
      <div data-mono className="absolute left-1/2 top-1/2 flex h-[124px] w-[124px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full" style={{ background: "radial-gradient(circle,#15120f 60%,#0b0a09)" }}>
        <div className="absolute inset-0 rounded-full p-px" style={{ background: GOLD }}><div className="h-full w-full rounded-full bg-[#100e0c]" /></div>
        <p className={`${s.foil} relative text-[2.4rem] leading-none`} style={disp}>{a[0]}<span className="mx-1 text-[1.7rem]" style={scr}>&amp;</span>{b ? b[0] : ""}</p>
      </div>
      <p data-hint className="absolute bottom-[12%] left-0 right-0 text-center text-[10.5px] uppercase tracking-[0.5em] text-[#d6b36a]">{label}</p>
    </div>
  );
}

export default function GatsbySite({ profile, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const L = words(profile);
  const lang = langOf(profile);
  const occ = occasionOf(profile);
  const [a, b] = nameParts(profile);
  const dp = dateParts(profile.date, lang);
  const until = useUntil(profile.date);
  const where = profile.venue || profile.city || "";
  const gallery = design?.gallery ?? [];
  const events = profile.events ?? [];
  const longest = Math.max([...a].length, [...(b || "")].length);
  useLenis(!compact);

  useStage(root, (g, q) => {
    const tl = g.timeline({ paused: !compact, defaults: { ease: "power3.out" } });
    tl.from(q("[data-hero-fan] [data-ray]"), { drawSVG: 0, duration: 1.4, stagger: { each: 0.012, from: "center" } }, 0)
      .from(q("[data-hero-arch] [data-draw]"), { drawSVG: 0, duration: 2, ease: "power2.inOut" }, 0)
      .from(q("[data-hero-in]"), { opacity: 0, y: 24, duration: 1.2, stagger: 0.12 }, 0.5);
    if (!compact) {
      const names = q("[data-name]");
      const split = SplitText.create(names, { type: "chars", charsClass: "inline-block" });
      tl.from(split.chars, { opacity: 0, y: 40, rotateX: -70, transformOrigin: "50% 100%", duration: 1.1, stagger: 0.045 }, 0.7);
      g.to(q("[data-hero-bg]"), { scale: 1.35, opacity: 0.15, ease: "none", scrollTrigger: { trigger: q("header")[0], start: "top top", end: "bottom top", scrub: true } });
      g.to(q("[data-hero-arch-wrap]"), { yPercent: -10, ease: "none", scrollTrigger: { trigger: q("header")[0], start: "top top", end: "bottom top", scrub: true } });
      const portrait = q("[data-portrait]")[0];
      if (portrait) {
        g.fromTo(q("[data-portrait] img"), { filter: "grayscale(1) sepia(0.45) contrast(1.1)", scale: 1.18 }, { filter: "grayscale(0) sepia(0.08) contrast(1.02)", scale: 1, ease: "none", scrollTrigger: { trigger: portrait, start: "top 85%", end: "center 40%", scrub: true } });
        g.from(q("[data-portrait-frame]"), { clipPath: "inset(50% 0% 50% 0%)", duration: 1.6, ease: "power3.inOut", scrollTrigger: { trigger: portrait, start: "top 80%" } });
      }
      const rise = q("[data-rise]");
      g.set(rise, { opacity: 0, y: 44 });
      ScrollTrigger.batch(rise, { start: "top 88%", once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, ease: "power3.out", overwrite: true }) });
      q("[data-drawon]").forEach((el) => g.from(el.querySelectorAll("[data-draw],[data-ray]"), { drawSVG: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.02, scrollTrigger: { trigger: el, start: "top 88%" } }));
      const fac = q("[data-facade]")[0];
      if (fac) g.from(fac.querySelectorAll("[data-draw]"), { drawSVG: 0, ease: "none", stagger: 0.01, scrollTrigger: { trigger: fac, start: "top 85%", end: "bottom 55%", scrub: 0.6 } });
      const tower = q("[data-tower]")[0];
      if (tower) {
        const t2 = g.timeline({ scrollTrigger: { trigger: tower, start: "top 80%" } });
        t2.from(tower.querySelectorAll("[data-draw]"), { drawSVG: 0, duration: 1.2, stagger: 0.01, ease: "power2.inOut" })
          .from(tower.querySelectorAll("[data-pour]"), { drawSVG: 0, duration: 0.6 }, 0.6)
          .from([...tower.querySelectorAll("[data-fill]")].reverse(), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.5, stagger: 0.12, ease: "power1.inOut" }, 0.9)
          .from(tower.querySelectorAll("[data-bubble]"), { opacity: 0, y: 6, duration: 0.6, stagger: 0.02 }, 1.6);
        g.to(tower.querySelectorAll("[data-bubble]"), { y: -8, opacity: 0.2, duration: 1.8, repeat: -1, yoyo: true, stagger: { each: 0.08, from: "random" }, ease: "sine.inOut", delay: 3 });
      }
    }
    intro.current = tl;
  }, [compact]);

  const nameSize = fit("x".repeat(longest), 15.5, 74, 0.82);
  const Name = ({ v, path }: { v: string; path: string }) => (
    <E as="span" path={path} className={`${s.foil} block uppercase leading-[0.98] tracking-[0.1em]`} style={{ ...disp, fontSize: `${nameSize}cqw`, perspective: "600px" }}>
      <span data-name>{v}</span>
    </E>
  );

  const hero = (
    <header className={`${s.lacquer} relative overflow-hidden`} style={{ minHeight: compact ? 780 : "100svh" }}>
      {!compact && <Bubbles className={s.bubbleCanvas} />}
      <div data-hero-bg data-hero-fan className="pointer-events-none absolute bottom-[14%] left-1/2 w-[min(1500px,190vw)] -translate-x-1/2 opacity-50">
        <Fan rays={56} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b0a09] to-transparent" />
      {!compact && dp && (
        <>
          <p className="absolute left-6 top-1/2 hidden origin-left -translate-y-1/2 -rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.6em] text-[#d6b36a]/60 lg:block" style={{ translate: "12px 0" }}>{dp.weekday} · {dp.full}</p>
          <p className="absolute right-6 top-1/2 hidden origin-right -translate-y-1/2 rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.6em] text-[#d6b36a]/60 lg:block" style={{ translate: "-12px 0" }}>{[profile.venue, profile.city].filter(Boolean).join(" · ")}</p>
        </>
      )}
      <div className="relative flex flex-col items-center justify-center px-5 py-10" style={{ minHeight: compact ? 780 : "100svh" }}>
        <div data-hero-arch-wrap className="relative aspect-[2/3]" style={{ width: compact ? "min(88%, 470px)" : "min(90vw, 60svh, 600px)", containerType: "inline-size" }}>
          <div data-hero-arch className="absolute inset-0"><StepArch className="h-full w-full" /></div>
          <div className="absolute inset-0 flex flex-col items-center px-[9%] pt-[17%] text-center">
            <div data-hero-in data-hero-fan className="w-[34cqw]"><Fan rays={26} rings={false} /></div>
            <p data-hero-in className="mt-[3cqw] uppercase text-[#d6b36a]" style={{ fontSize: "2.3cqw", letterSpacing: "0.5em" }}>{occ === "wedding" ? L.wedding : L.invited}</p>
            <h1 className="mt-[5cqw] w-full">
              <Name v={a} path="profile.partner1" />
              {b && (
                <>
                  <span data-hero-in className="block leading-none text-[#e9cf98]" style={{ ...scr, fontSize: `${nameSize * 0.75}cqw`, margin: "0.5cqw 0 1.5cqw" }}>&amp;</span>
                  <Name v={b} path="profile.partner2" />
                </>
              )}
            </h1>
            <div data-hero-in className="mt-[5cqw] w-[62cqw]"><Chevrons /></div>
            {dp && (
              <p data-hero-in className="mt-[4cqw] uppercase text-[#f1e3bf]" style={{ ...disp, fontSize: "4.6cqw", letterSpacing: "0.3em" }}>
                {dp.dd}<span className="mx-[1.6cqw] text-[#d6b36a]">◆</span>{dp.roman}<span className="mx-[1.6cqw] text-[#d6b36a]">◆</span>{dp.year}
              </p>
            )}
            {where && occ !== "greeting" && (
              <p data-hero-in className="mt-[2cqw] uppercase text-[#a89a7c]" style={{ fontSize: "2.3cqw", letterSpacing: "0.38em" }}>
                <E path={profile.venue ? "profile.venue" : "profile.city"}>{where}</E>{profile.venue && profile.city ? ` · ${profile.city}` : ""}
              </p>
            )}
            <div data-hero-in className="mt-auto mb-[8cqw] flex h-[17cqw] items-end justify-center gap-[2.4cqw]">
              {until && occ !== "greeting" && ([[until.d, L.days], [until.h, L.hours], [until.m, L.minutes]] as const).map(([n, l]) => (
                <div key={l} className={`${s.notch} p-px`} style={{ "--n": "1.8cqw", background: GOLD } as CSSProperties}>
                  <div className={`${s.notch} flex w-[17cqw] flex-col items-center bg-[#0f0d0c] py-[1.8cqw]`} style={{ "--n": "1.7cqw" } as CSSProperties}>
                    <span className={`${s.foil} leading-none`} style={{ ...disp, fontSize: "6.4cqw" }}>{String(n).padStart(2, "0")}</span>
                    <span className="mt-[1cqw] uppercase text-[#a89a7c]" style={{ fontSize: "1.7cqw", letterSpacing: "0.3em" }}>{l}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {!compact && <div className={`${s.scrollCue} absolute bottom-6 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-[#d6b36a] to-transparent`} />}
      </div>
    </header>
  );

  const portrait = (
    <div data-portrait className="relative px-6 pb-8 pt-4">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
        <p className={`hidden text-right text-[2.6rem] leading-tight text-[#e9cf98] ${compact ? "" : "md:block"}`} style={scr}>{L.forever}</p>
        <div data-portrait-frame className={`${s.arch} relative mx-auto p-[2px]`} style={{ width: compact ? "min(78%, 360px)" : "min(80vw, 420px)", background: GOLD }}>
          <div className={`${s.arch} relative aspect-[3/4] overflow-hidden bg-[#13110f]`}>
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="hero" src={heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: compact ? "grayscale(0.2) sepia(0.15)" : undefined }} />
            ) : (
              <div data-edit-photo="hero" className={`${s.lacquer} absolute inset-0 flex items-end justify-center pb-[30%]`}><Fan rays={30} className="w-[80%]" /></div>
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b0a09]/55 via-transparent to-transparent" />
          </div>
        </div>
        <p className={`hidden text-[10.5px] uppercase leading-[2.4] tracking-[0.5em] text-[#d6b36a]/80 ${compact ? "" : "md:block"}`}>{dp ? <>{dp.weekday}<br />{dp.full}</> : null}</p>
      </div>
    </div>
  );

  const sections = {
    invitation: occ !== "greeting" && (
      <section className="relative px-6 py-24 md:py-32">
        <div data-rise className="mx-auto max-w-3xl text-center">
          <div data-drawon><Fan rays={24} className="mx-auto w-44 md:w-60" /></div>
          <Eyebrow className="mb-8 mt-8">{L.invited}</Eyebrow>
          <E as="p" multiline path="profile.inviteLine" className="block text-[1.75rem] leading-[1.4] text-[#f1e3bf] md:text-[2.6rem]" style={disp}>{profile.inviteLine || occasionInvite(profile)}</E>
          <div data-drawon><Chevrons className="mx-auto mt-12 w-60" /></div>
        </div>
      </section>
    ),
    story: profile.story && (
      <section className="relative px-6 py-24 md:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-16">
          <div data-rise className="text-center md:text-left">
            <div data-drawon className="mx-auto w-52 md:mx-0 md:w-64"><Fan rays={30} /></div>
            <Eyebrow className="mt-5">{L.chapter} · I</Eyebrow>
            <h2 className={`${s.foil} mt-3 inline-block text-[2.6rem] uppercase leading-[1.05] tracking-[0.14em] md:text-[3.4rem]`} style={disp}>{L.story}</h2>
          </div>
          <div data-rise className="relative border-l border-[#d6b36a]/30 pl-6 md:pl-10">
            <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.18rem] font-light leading-[1.85] text-[#e8dcc2] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-[#e2c27c] md:text-[1.35rem]" style={{ fontFamily: "var(--wbody)" }}>{profile.story}</E>
            <p className="mt-8 text-[2rem] text-[#e9cf98]" style={scr}>{L.forever}</p>
          </div>
        </div>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <Heading eyebrow={L.invited} title={L.details} />
        <div className={`mx-auto grid max-w-4xl gap-6 ${compact ? "" : "md:grid-cols-2"}`}>
          {dp && (
            <div data-rise><Panel inner="px-8 pb-10 pt-8 text-center">
              <Fan rays={18} rings={false} className="mx-auto w-28" />
              <Eyebrow className="mt-4">{L.when}</Eyebrow>
              <p className={`${s.foil} mt-3 inline-block text-[5.5rem] leading-none`} style={disp}>{dp.dd}</p>
              <p className="mt-2 text-xl uppercase tracking-[0.3em] text-[#f1e3bf]" style={disp}>{dp.month} {dp.year}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#a89a7c]">{dp.weekday}{events[0]?.time ? ` · ${events[0].time}` : ""}</p>
            </Panel></div>
          )}
          {where && (
            <div data-rise><Panel inner="px-8 pb-10 pt-8 text-center flex flex-col items-center">
              <Fan rays={18} rings={false} className="mx-auto w-28" />
              <Eyebrow className="mt-4">{L.where}</Eyebrow>
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-5 block text-[2.3rem] uppercase leading-tight tracking-[0.1em] text-[#f1e3bf]" style={disp}>{where}</E>
              {profile.venue && profile.city && <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#a89a7c]">{profile.city}</p>}
              <div className="mt-7"><DecoButton href={mapUrl(profile)} external>{L.directions}</DecoButton></div>
            </Panel></div>
          )}
        </div>
      </section>
    ),
    schedule: events.length > 0 && (
      <section className="relative px-6 py-20 md:py-28">
        <Heading eyebrow={L.ceremony} title={L.events} />
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {events.map((e, i) => (
            <div data-rise key={i}>
              <Panel n={14}>
                <div className={`grid items-stretch ${compact ? "grid-cols-[76px_1fr]" : "grid-cols-[76px_1fr] md:grid-cols-[110px_1fr_auto]"}`}>
                  <div className="relative flex flex-col items-center justify-center border-r border-dashed border-[#d6b36a]/35 py-6">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-[#a89a7c]">No.</span>
                    <span className={`${s.foil} text-[2.6rem] leading-none`} style={disp}>{toRoman(i + 1)}</span>
                  </div>
                  <div className="px-6 py-6 md:px-8">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#d6b36a]">{dateParts(e.date, lang)?.full}{e.time && <span className={compact ? "" : "md:hidden"}>{dateParts(e.date, lang) ? " · " : ""}{e.time}</span>}</p>
                    <h3 className="mt-2 text-[1.7rem] uppercase leading-tight tracking-[0.12em] text-[#f1e3bf] md:text-[2rem]" style={disp}>{e.name}</h3>
                    {e.venue && <p className="mt-1 text-sm tracking-wide text-[#a89a7c]">{e.venue}</p>}
                  </div>
                  {!compact && e.time && (
                    <div className="hidden items-center border-l border-[#d6b36a]/20 px-8 md:flex">
                      <span className={`${s.foil} whitespace-nowrap text-[2.2rem] uppercase`} style={disp}>{e.time}</span>
                    </div>
                  )}
                </div>
              </Panel>
            </div>
          ))}
        </div>
        {calendarUrl && <div data-rise className="mt-12 text-center"><DecoButton href={calendarUrl}>{L.calendar}</DecoButton></div>}
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className={`mx-auto grid max-w-5xl items-center gap-12 ${compact ? "" : "md:grid-cols-2"}`}>
          <div data-facade className="mx-auto w-[min(72vw,330px)]"><Facade /></div>
          <div data-rise className={`text-center ${compact ? "" : "md:text-left"}`}>
            <Eyebrow>{L.venue}</Eyebrow>
            <E as="h2" path={profile.venue ? "profile.venue" : "profile.city"} className={`${s.foil} mt-5 inline-block text-[2.6rem] uppercase leading-[1.05] tracking-[0.1em] md:text-[3.6rem]`} style={disp}>{where}</E>
            {profile.venue && profile.city && <p className="mt-3 text-sm uppercase tracking-[0.4em] text-[#a89a7c]">{profile.city}</p>}
            <div className="mt-9"><DecoButton href={mapUrl(profile)} external>{L.directions}</DecoButton></div>
            {/goa/i.test(`${profile.city} ${profile.venue}`) && (
              <div className="mt-12 border-t border-[#d6b36a]/25 pt-8">
                <Eyebrow className="mb-3">{L.travel}</Eyebrow>
                <p className="text-[1.05rem] font-light leading-relaxed text-[#cfc2a4]">{L.travelText}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className="relative px-6 py-20 md:py-28">
        <Heading title={L.gallery} />
        <div className={`mx-auto grid max-w-6xl grid-cols-2 gap-4 ${compact ? "" : "md:grid-cols-3 md:gap-7"}`}>
          {gallery.map((k, i) => (
            <div data-rise key={k} className={!compact && i % 3 === 1 ? "md:translate-y-14" : ""}>
              <div className={`${s.arch} p-[1.5px]`} style={{ background: GOLD }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className={`${s.arch} aspect-[3/4] w-full object-cover`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div className="mx-auto max-w-xl">
          <div data-tower className="mx-auto mb-4 w-[min(64vw,250px)]"><Tower /></div>
          <p data-rise className="mb-10 text-center text-[2.6rem] leading-none text-[#e9cf98]" style={scr}>{L.reply}</p>
          <div data-rise><Panel inner="p-7 md:p-10">{children}</Panel></div>
        </div>
      </section>
    ),
    info: design?.texts?.body && (
      <section className="relative px-6 py-20">
        <div data-rise className="mx-auto max-w-2xl"><Panel inner="px-8 py-10 text-center">
          <Eyebrow className="mb-5">{L.info}</Eyebrow>
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[1.1rem] font-light leading-relaxed text-[#e8dcc2]">{design.texts.body}</E>
        </Panel></div>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${fontClass} ${s.root} ${s.lacquer} relative overflow-hidden`} style={lookStyle(GATSBY_LOOK, design, "gatsby-vows")}>
      <GatsbyStyles />
      {!compact && <Gate a={a} b={b} label={L.enter} onOpen={() => intro.current?.play()} />}
      {hero}
      {portrait}
      <Sections design={design} map={sections} />
      <footer className="relative px-6 pb-16 pt-16 text-center">
        <div data-drawon><Fan rays={30} className="mx-auto w-56" /></div>
        <div className="relative mx-auto -mt-2 h-28 w-28">
          <div className="absolute inset-[14px] rotate-45 p-px" style={{ background: GOLD }}><div className="h-full w-full bg-[#0b0a09]" /></div>
          <div className="absolute inset-[22px] rotate-45 border border-[#d6b36a]/40" />
          <p className={`${s.foil} absolute inset-0 flex items-center justify-center text-[1.9rem]`} style={disp}>{a[0]}{b ? <span className="mx-0.5 text-[1.3rem]" style={scr}>&amp;</span> : null}{b?.[0]}</p>
        </div>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-6 block text-[2.2rem] text-[#e9cf98]" style={scr}>{profile.blessing}</E>}
        {dp && <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-[#a89a7c]">{dp.full}</p>}
        <div className="mt-10 text-xs text-[#a89a7c]/80">{credit}</div>
      </footer>
    </div>
  );
}
