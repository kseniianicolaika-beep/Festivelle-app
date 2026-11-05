"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { fit, fontClass, lookStyle, ScrollTrigger, Sections, useLenis, useStage, useUntil } from "../_shared/kit";
import { dateParts, langOf, mapUrl, media, nameParts, occasionInvite, occasionLine, occasionOf, words } from "../_shared/text";
import { Cone, HENNA, jaal, Mandala, Marigold, Paisley, Petal, Toran, Vine } from "./art";
import { MEHENDI_LOOK } from "./look";
import { s, MehendiStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const scr: CSSProperties = { fontFamily: "var(--ws)" };

const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-[11px] uppercase tracking-[0.34em] text-[#b4521d] ${className}`} style={{ fontFamily: "var(--wbody)" }}>{children}</p>
);

function Heading({ title, eyebrow }: { title: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div data-rise className="mb-12 text-center">
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className={`${s.stain} inline-block px-2 text-[2.6rem] leading-[1.35] md:text-[3.4rem]`} style={disp}>{title}</h2>
      <div data-pipeon className="mx-auto mt-2 w-[min(320px,80vw)]"><Vine leaves={7} /></div>
    </div>
  );
}

function HennaButton({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className="group relative inline-flex items-center gap-3 rounded-full bg-[#7a3112] px-7 py-3 text-[13px] tracking-[0.12em] text-[#fbefdc] shadow-[0_14px_30px_-16px_rgba(122,49,18,.8)] transition hover:bg-[#8f3b16]">
      <span aria-hidden className="absolute inset-[3px] rounded-full border border-dashed border-[#f3d6b0]/50" />
      <span className="relative">✿</span><span className="relative">{children}</span>
    </a>
  );
}

/** A cream card with scalloped top & bottom edges and a dotted henna border. */
function Scallop({ children, className = "", inner = "" }: { children: ReactNode; className?: string; inner?: string }) {
  return (
    <div className={`${s.glow} relative ${className}`} style={{ borderRadius: 4 }}>
      <div className={`${s.scallop} relative bg-[#fdf6ea]`}>
        <div aria-hidden className="pointer-events-none absolute inset-x-3 inset-y-[22px] rounded-[6px] border border-dashed border-[#b4521d]/45" />
        <div aria-hidden className="pointer-events-none absolute inset-x-5 inset-y-[28px] rounded-[4px] border border-[#7a3112]/15" />
        <div className={`relative ${inner}`}>{children}</div>
      </div>
    </div>
  );
}

/** Rose & marigold petals drifting down (deterministic positions — no hydration mismatch). */
function PetalShower({ n = 16, still = false }: { n?: number; still?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: n }, (_, i) => {
        const left = (i * 37 + 11) % 100;
        const size = 10 + ((i * 7) % 12);
        const st = { left: `${left}%`, width: size, "--dx": `${((i % 5) - 2) * 30}px`, "--rot": `${(i % 2 ? 1 : -1) * (360 + i * 40)}deg`, animationDuration: `${11 + (i % 6) * 2.3}s`, animationDelay: `${-((i * 1.7) % 12)}s` } as CSSProperties;
        return still
          ? <Petal key={i} kind={i} className="absolute" style={{ left: `${left}%`, top: `${(i * 53) % 90}%`, width: size, transform: `rotate(${i * 47}deg)`, opacity: 0.85 }} />
          : <Petal key={i} kind={i} className={s.fall} style={st} />;
      })}
    </div>
  );
}

export default function MehendiSite({ profile, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
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
    // The signature opening: the cone pipes the mandala ring by ring, then writes the names.
    const tl = g.timeline({ defaults: { ease: "power2.inOut" } });
    const pipes = q("[data-hero-mandala] [data-pipe]");
    tl.from(pipes, { drawSVG: 0, duration: 0.5, stagger: compact ? 0.008 : 0.022 }, 0.2)
      .from(q("[data-hero-mandala] [stroke-dasharray], [data-hero-mandala] g[fill] circle"), { opacity: 0, duration: 0.8, stagger: 0.01 }, 0.9);
    const cone = q("[data-cone]")[0] as HTMLElement | undefined;
    const ring = q("[data-hero-mandala] circle[data-pipe]").pop() as SVGCircleElement | undefined;
    const box = q("[data-hero-art]")[0] as HTMLElement | undefined;
    if (cone && ring && box) {
      const total = ring.getTotalLength();
      const prog = { p: 0 };
      const place = () => {
        const pt = ring.getPointAtLength(prog.p * total);
        const m = ring.getScreenCTM();
        const r = box.getBoundingClientRect();
        if (!m) return;
        g.set(cone, { x: pt.x * m.a + pt.y * m.c + m.e - r.left, y: pt.x * m.b + pt.y * m.d + m.f - r.top });
      };
      tl.fromTo(cone, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
        .to(prog, { p: 1, duration: pipes.length * (compact ? 0.008 : 0.022) + 0.5, ease: "none", onUpdate: place, onStart: place }, 0.2)
        .to(cone, { opacity: 0, y: "-=40", duration: 0.6 }, ">-0.1");
    }
    tl.from(q("[data-name]"), { clipPath: "inset(0% 100% 0% 0%)", duration: 1.3, stagger: 0.35, ease: "power1.inOut" }, compact ? 0.4 : 1.4)
      .from(q("[data-hero-in]"), { opacity: 0, y: 18, duration: 0.9, stagger: 0.1, ease: "power3.out" }, "<0.4")
      .from(q("[data-strand]"), { y: -60, opacity: 0, duration: 1.2, stagger: { each: 0.05, from: "center" }, ease: "back.out(1.4)" }, 0.1);
    if (compact) return;
    g.to(q("[data-hero-mandala]"), { rotate: 40, ease: "none", scrollTrigger: { trigger: q("header")[0], start: "top top", end: "bottom top", scrub: true } });
    const rise = q("[data-rise]");
    g.set(rise, { opacity: 0, y: 36 });
    ScrollTrigger.batch(rise, { start: "top 88%", once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: "power3.out", overwrite: true }) });
    q("[data-pipeon]").forEach((el) => g.from(el.querySelectorAll("[data-pipe]"), { drawSVG: 0, duration: 1.4, stagger: 0.015, ease: "power1.inOut", scrollTrigger: { trigger: el, start: "top 88%" } }));
    const vine = q("[data-timeline-vine]")[0];
    if (vine) g.from(vine, { drawSVG: 0, ease: "none", scrollTrigger: { trigger: q("[data-timeline]")[0], start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
    q("[data-bud]").forEach((el) => g.from(el, { scale: 0, rotate: -90, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: el, start: "top 80%" } }));
  }, [compact]);

  const nameVw = fit("x".repeat(longest), compact ? 4.4 : 17, compact ? 30 : 84, 0.5);
  const nameRem = fit("x".repeat(longest), compact ? 4 : 7, compact ? 26 : 34, 0.5);
  const Name = ({ v, path }: { v: string; path: string }) => (
    <E as="span" path={path} className="block leading-[1.25]" style={{ ...disp, fontSize: `max(2.2rem, min(${nameVw}vw, ${nameRem}rem))` }}>
      <span data-name className={`${s.stain} inline-block px-[0.1em]`}>{v}</span>
    </E>
  );

  const hero = (
    <header className={`${s.paper} relative overflow-hidden`} style={{ minHeight: compact ? 820 : "100svh" }}>
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: jaal(0.14) }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        {Array.from({ length: compact ? 2 : 4 }, (_, i) => <div key={i} className={`${s.sway} w-[340px] shrink-0 md:w-[380px] ${i > 1 ? "hidden lg:block" : ""}`} style={{ animationDelay: `${-i * 1.3}s` }}><Toran /></div>)}
      </div>
      <PetalShower n={compact ? 8 : 16} still={compact} />
      <div className={`relative mx-auto grid max-w-6xl items-center gap-6 px-6 pb-16 pt-36 ${compact ? "" : "md:grid-cols-[1.05fr_1fr] md:gap-10 md:pt-40"}`} style={{ minHeight: compact ? 820 : "100svh" }}>
        <div data-hero-art className={`relative mx-auto aspect-square w-[min(84vw,520px)] ${compact ? "w-[min(80%,380px)]" : "md:order-2"}`}>
          <div data-hero-mandala className="absolute inset-0"><Mandala core={46} /></div>
          <div className="absolute inset-[23.2%] overflow-hidden rounded-full shadow-[0_20px_40px_-20px_rgba(122,49,18,.6)]" style={{ background: "radial-gradient(circle,#fbe9cf,#e9c9a0)" }}>
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" style={{ filter: "sepia(0.18) saturate(1.05)" }} />
            ) : (
              <div data-edit-photo="hero" className="flex h-full w-full items-center justify-center"><Paisley className="h-3/4" /></div>
            )}
          </div>
          <Paisley className="absolute -bottom-[4%] -left-[6%] w-[24%] -rotate-[30deg]" />
          <Paisley className="absolute -bottom-[4%] -right-[6%] w-[24%] rotate-[30deg] -scale-x-100" />
          {!compact && <div data-cone className="pointer-events-none absolute left-0 top-0 z-10 w-[34px] opacity-0" style={{ translate: "-50% -100%", rotate: "-24deg", transformOrigin: "50% 100%" }}><Cone /></div>}
        </div>
        <div className={`relative text-center ${compact ? "" : "md:text-left"}`}>
          <p data-hero-in className={`text-[#b4521d] ${lang === "hi" ? "text-[1.35rem]" : "text-[12px] uppercase tracking-[0.4em]"}`} style={lang === "hi" ? scr : { fontFamily: "var(--wbody)" }}>
            {occ === "wedding" ? L.wedding : occasionLine(profile)}
          </p>
          <h1 className="mt-3">
            <Name v={a} path="profile.partner1" />
            {b && (
              <>
                <span data-hero-in className={`my-1 flex items-center gap-4 text-[#d9922a] ${compact ? "justify-center" : "justify-center md:justify-start"}`}>
                  <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b4521d]/60" />
                  <span className="text-[2.6rem] leading-none" style={scr}>&amp;</span>
                  <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b4521d]/60" />
                </span>
                <Name v={b} path="profile.partner2" />
              </>
            )}
          </h1>
          {occ === "wedding" && <p data-hero-in className="mt-4 text-[1.5rem] text-[#8a5a3c]" style={scr}>{occasionLine(profile)}</p>}
          {dp && (
            <div data-hero-in className={`mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[#4a1f0c] ${compact ? "justify-center" : "justify-center md:justify-start"}`}>
              <span className="text-[1.25rem]" style={{ fontFamily: "var(--wbody)" }}>{dp.weekday}</span>
              <span className="text-[#d9922a]">✿</span>
              <span className="text-[1.25rem]" style={{ fontFamily: "var(--wbody)" }}>{dp.full}</span>
            </div>
          )}
          {where && occ !== "greeting" && <p data-hero-in className="mt-1 text-[1rem] text-[#8a5a3c]"><E path={profile.venue ? "profile.venue" : "profile.city"}>{where}</E>{profile.venue && profile.city ? `, ${profile.city}` : ""}</p>}
          <div data-hero-in className={`mt-8 flex h-[88px] gap-3 ${compact ? "justify-center" : "justify-center md:justify-start"}`}>
            {until && occ !== "greeting" && ([[until.d, L.days], [until.h, L.hours], [until.m, L.minutes]] as const).map(([n, l]) => (
              <div key={l} className="relative flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full bg-[#fdf6ea]/80">
                <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden fill="none"><circle cx="50" cy="50" r="47" stroke={HENNA} strokeWidth="1" /><circle cx="50" cy="50" r="43" stroke={HENNA} strokeWidth="2" strokeDasharray="0 5" strokeLinecap="round" /></svg>
                <span className={`${s.stain} text-[1.7rem] leading-none`} style={{ fontFamily: "var(--wbody)", fontWeight: 500 }}>{n}</span>
                <span className="mt-1 text-[10px] tracking-[0.12em] text-[#8a5a3c]">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );

  const sections = {
    invitation: occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div data-rise className="relative mx-auto max-w-3xl text-center">
          <div data-pipeon className="mx-auto w-[min(420px,86vw)]"><Vine leaves={9} /></div>
          {!compact && <Paisley className="absolute -left-40 top-6 hidden w-28 -rotate-12 md:block" />}
          {!compact && <Paisley className="absolute -right-40 top-6 hidden w-28 rotate-12 -scale-x-100 md:block" />}
          <Eyebrow className="mb-6 mt-6">{L.invitation}</Eyebrow>
          <E as="p" multiline path="profile.inviteLine" className="block text-[1.7rem] leading-[1.6] text-[#5a240c] md:text-[2.3rem]" style={disp}>{profile.inviteLine || occasionInvite(profile)}</E>
          <div data-pipeon className="mx-auto mt-8 w-[min(420px,86vw)] -scale-y-100"><Vine leaves={9} /></div>
        </div>
      </section>
    ),
    story: profile.story && (
      <section className="relative px-6 py-20 md:py-28">
        <div className={`mx-auto grid max-w-5xl items-center gap-10 ${compact ? "" : "md:grid-cols-[0.8fr_1.2fr] md:gap-16"}`}>
          <div data-rise data-pipeon className="relative mx-auto w-[min(56vw,280px)]">
            <Paisley fill className="w-full -rotate-12" />
            <svg viewBox="0 0 100 100" className="absolute -right-6 bottom-0 w-24" aria-hidden><Marigold cx={50} cy={50} r={26} /></svg>
          </div>
          <div data-rise className={`text-center ${compact ? "" : "md:text-left"}`}>
            <Eyebrow>{L.story}</Eyebrow>
            <h2 className={`${s.stain} mt-2 inline-block text-[2.6rem] leading-[1.35] md:text-[3.2rem]`} style={disp}>{L.story}</h2>
            <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[1.2rem] leading-[1.9] text-[#4a1f0c] md:text-[1.32rem]" style={{ fontFamily: "var(--wbody)", fontWeight: 300 }}>{profile.story}</E>
            <p className="mt-6 text-[1.5rem] text-[#b4521d]" style={scr}>{L.forever}</p>
          </div>
        </div>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-24">
        <Heading title={L.details} />
        <div className={`mx-auto grid max-w-4xl gap-8 ${compact ? "" : "md:grid-cols-2"}`}>
          {dp && (
            <div data-rise><Scallop inner="px-8 pb-12 pt-12 text-center">
              <Mandala className="mx-auto w-16" />
              <Eyebrow className="mt-4">{L.when}</Eyebrow>
              <p className={`${s.stain} mt-2 text-[4.6rem] leading-none`} style={{ fontFamily: "var(--wbody)", fontWeight: 300 }}>{dp.day}</p>
              <p className="mt-1 text-[1.6rem] text-[#5a240c]" style={disp}>{dp.month} {dp.year}</p>
              <p className="mt-1 text-[#8a5a3c]">{dp.weekday}{events[0]?.time ? ` · ${events[0].time}` : ""}</p>
            </Scallop></div>
          )}
          {where && (
            <div data-rise><Scallop inner="px-8 pb-12 pt-12 text-center flex flex-col items-center">
              <Mandala className="mx-auto w-16" />
              <Eyebrow className="mt-4">{L.where}</Eyebrow>
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className={`${s.stain} mt-3 block text-[2.2rem] leading-[1.3]`} style={disp}>{where}</E>
              {profile.venue && profile.city && <p className="mt-1 text-[#8a5a3c]">{profile.city}</p>}
              <div className="mt-6"><HennaButton href={mapUrl(profile)} external>{L.directions}</HennaButton></div>
            </Scallop></div>
          )}
        </div>
      </section>
    ),
    schedule: events.length > 0 && (
      <section className="relative px-6 py-20 md:py-28">
        <Heading title={L.events} />
        <div data-timeline className="relative mx-auto max-w-3xl">
          <svg aria-hidden className={`absolute bottom-0 top-0 h-full w-10 ${compact ? "left-2" : "left-2 md:left-1/2 md:-translate-x-1/2"}`} viewBox="0 0 40 400" preserveAspectRatio="none" fill="none">
            <path data-timeline-vine d="M20 0C34 40 6 80 20 120S34 200 20 240 6 320 20 400" stroke={HENNA} strokeWidth="1.4" />
          </svg>
          {events.map((e, i) => {
            const right = i % 2 === 1;
            return (
              <div key={i} data-rise className={`relative mb-12 pl-16 ${compact ? "" : `md:w-1/2 md:pl-0 ${right ? "md:ml-auto md:pl-16" : "md:pr-16 md:text-right"}`}`}>
                <svg data-bud viewBox="0 0 40 40" aria-hidden className={`absolute top-1 h-10 w-10 left-2 ${compact ? "" : right ? "md:-left-5" : "md:left-auto md:-right-5"}`}><Marigold cx={20} cy={20} r={11} tone={i} /></svg>
                <p className="text-[12px] tracking-[0.2em] text-[#b4521d]">{[dateParts(e.date, lang)?.full, e.time].filter(Boolean).join(" · ")}</p>
                <h3 className="mt-1 text-[2rem] leading-[1.3] text-[#5a240c]" style={disp}>{e.name}</h3>
                {e.venue && <p className="text-[#8a5a3c]">{e.venue}</p>}
              </div>
            );
          })}
        </div>
        {calendarUrl && <div data-rise className="mt-6 text-center"><HennaButton href={calendarUrl}>{L.calendar}</HennaButton></div>}
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div data-rise className="mx-auto max-w-3xl">
          <div className={`${s.sway} relative z-10 mx-auto -mb-10 w-[min(92vw,560px)]`}><Toran /></div>
          <Scallop inner="px-8 pb-14 pt-16 text-center">
            <Eyebrow>{L.venue}</Eyebrow>
            <E as="h2" path={profile.venue ? "profile.venue" : "profile.city"} className={`${s.stain} mt-3 inline-block text-[2.6rem] leading-[1.3] md:text-[3.4rem]`} style={disp}>{where}</E>
            {profile.venue && profile.city && <p className="mt-1 text-[1.1rem] text-[#8a5a3c]">{profile.city}</p>}
            <div className="mt-7"><HennaButton href={mapUrl(profile)} external>{L.directions}</HennaButton></div>
            {/goa/i.test(`${profile.city} ${profile.venue}`) && (
              <div className="mx-auto mt-10 max-w-xl border-t border-dashed border-[#b4521d]/40 pt-7">
                <p className="text-[1.35rem] text-[#b4521d]" style={scr}>{L.travel}</p>
                <p className="mt-2 leading-relaxed text-[#5a3a28]">{L.travelText}</p>
              </div>
            )}
          </Scallop>
        </div>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className="relative px-6 py-20 md:py-28">
        <Heading title={L.gallery} />
        <div className={`mx-auto grid max-w-6xl grid-cols-2 gap-5 ${compact ? "" : "md:grid-cols-3 md:gap-8"}`}>
          {gallery.map((k, i) => (
            <div data-rise key={k} style={{ rotate: `${((i % 3) - 1) * 2}deg` }}>
              <div className={`${s.scallop} bg-[#fdf6ea] p-3`} style={{ "--r": "7px" } as CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div className="mx-auto max-w-xl">
          <p data-rise className={`${s.stain} mb-8 text-center text-[2.6rem] leading-[1.4]`} style={disp}>{L.reply}</p>
          <div data-rise className="relative">
            <Mandala className="pointer-events-none absolute -right-16 -top-16 w-40 opacity-30" />
            <Scallop inner="px-7 pb-10 pt-12 md:px-10">{children}</Scallop>
          </div>
        </div>
      </section>
    ),
    info: design?.texts?.body && (
      <section className="relative px-6 py-16">
        <div data-rise className="mx-auto max-w-2xl"><Scallop inner="px-8 pb-12 pt-12 text-center">
          <Eyebrow className="mb-4">{L.info}</Eyebrow>
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[1.1rem] leading-relaxed text-[#4a1f0c]">{design.texts.body}</E>
        </Scallop></div>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${fontClass} ${s.root} ${s.paper} relative overflow-hidden`} style={lookStyle(MEHENDI_LOOK, design, "mehendi-ambi")}>
      <MehendiStyles />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: jaal(0.07) }} />
      {hero}
      <div className="relative"><Sections design={design} map={sections} /></div>
      <footer className="relative px-6 pb-16 pt-12 text-center">
        <div className="relative mx-auto h-36 w-36">
          <div data-pipeon className="absolute inset-0"><Mandala /></div>
        </div>
        <p className={`${s.stain} mt-4 text-[2.4rem] leading-[1.4]`} style={disp}>{a}{b ? ` & ${b}` : ""}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-2 block text-[1.6rem] text-[#b4521d]" style={scr}>{profile.blessing}</E>}
        {dp && <p className="mt-3 text-[12px] tracking-[0.3em] text-[#8a5a3c]">{dp.full}</p>}
        <div className="mt-10 text-xs text-[#8a5a3c]">{credit}</div>
      </footer>
    </div>
  );
}
