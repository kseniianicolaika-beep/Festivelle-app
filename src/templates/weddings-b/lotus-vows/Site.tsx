"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { fit, fontClass, gsap, lookStyle, ScrollTrigger, Sections, useGid, useLenis, useStage, useUntil } from "../_shared/kit";
import { dateParts, langOf, mapUrl, media, nameParts, occasionInvite, occasionLine, occasionOf, words } from "../_shared/text";
import { ArchClip, ArchLine, Lotus, Mandap, Pond, Rushnyk, SealHalf } from "./art";
import { LOTUS_LOOK } from "./look";
import { s, LotusStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const scr: CSSProperties = { fontFamily: "var(--ws)" };
const PLUM = "#3d1530";

const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-[11px] uppercase tracking-[0.36em] text-[#b8546f] ${className}`} style={{ fontFamily: "var(--wbody)", fontWeight: 600 }}>{children}</p>
);

function Heading({ title, eyebrow }: { title: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div data-rise className="mb-12 text-center">
      <Lotus className="mx-auto mb-2 w-20" />
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="text-[2.4rem] leading-tight md:text-[3.2rem]" style={{ ...disp, color: PLUM }}>{title}</h2>
    </div>
  );
}

function SilkButton({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className="inline-flex items-center gap-3 rounded-full border border-[#c9a265]/70 bg-[#fff8f6]/70 px-7 py-3 text-[12px] uppercase tracking-[0.28em] text-[#3d1530] shadow-[0_12px_30px_-18px_rgba(61,21,48,.5)] backdrop-blur transition hover:bg-[#b8546f] hover:text-white" style={{ fontFamily: "var(--wbody)", fontWeight: 600 }}>
      <span className="text-[#c9a265]">✦</span>{children}
    </a>
  );
}

/** Arch-topped silk card. */
function ArchCard({ children, inner = "" }: { children: ReactNode; inner?: string }) {
  return (
    <div className="relative">
      <ArchLine W={400} H={520} spring={0.2} className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full" />
      <div className={`relative ${inner}`}>{children}</div>
    </div>
  );
}

function Envelope({ a, b, sub, label, onOpen }: { a: string; b: string; sub: string; label: string; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const [gone, setGone] = useState(false);
  const open = () => {
    const el = ref.current;
    if (done.current || !el) return;
    done.current = true;
    const q = gsap.utils.selector(el);
    gsap.timeline({ onComplete: () => setGone(true) })
      .to(q("[data-hint]"), { opacity: 0, duration: 0.3 }, 0)
      .to(q("[data-seal=l]"), { x: -26, y: 70, rotate: -38, opacity: 0, duration: 0.9, ease: "power2.in" }, 0)
      .to(q("[data-seal=r]"), { x: 26, y: 80, rotate: 34, opacity: 0, duration: 0.9, ease: "power2.in" }, 0)
      .to(q("[data-flap]"), { rotateX: 180, duration: 0.9, ease: "power2.inOut" }, 0.25)
      .set(q("[data-flap]"), { zIndex: 0 }, 0.7)
      .to(q("[data-card]"), { yPercent: -58, duration: 1.1, ease: "power3.out" }, 1)
      .to(q("[data-body]"), { yPercent: 70, opacity: 0, duration: 1, ease: "power2.in" }, 1.9)
      .to(q("[data-card]"), { scale: 1.5, opacity: 0, duration: 0.9, ease: "power2.in" }, 2.3)
      .add(onOpen, 2.4)
      .to(el, { opacity: 0, duration: 0.7 }, 2.5);
  };
  useStage(ref, (g, q) => {
    g.timeline()
      .from(q("[data-envwrap]"), { y: 40, opacity: 0, scale: 0.94, duration: 1.2, ease: "power3.out" })
      .from(q("[data-seal]"), { scale: 1.4, opacity: 0, duration: 0.7, ease: "back.out(2)" }, 0.6)
      .from(q("[data-hint]"), { opacity: 0, duration: 0.6 }, 1.1);
    const auto = g.delayedCall(3, open);
    return () => auto.kill();
  }, []);
  if (gone) return null;
  return (
    <div ref={ref} className={s.env} onClick={open} role="button" tabIndex={0} aria-label={label} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}>
      <div data-envwrap className="relative aspect-[10/7] w-[min(88vw,620px)]" style={{ transformStyle: "preserve-3d" }}>
        <div data-body className={`${s.liner} absolute inset-0 rounded-[6px] shadow-[0_40px_80px_-40px_rgba(61,21,48,.55)]`} />
        <div data-card className="absolute inset-x-[5%] bottom-[3%] top-[5%] flex flex-col items-center justify-center rounded-[3px] bg-[#fffaf6] px-6 text-center shadow-[0_10px_30px_-12px_rgba(61,21,48,.35)]">
          <Lotus className="w-[18%]" />
          <p className={`${s.foil} text-[clamp(1.6rem,6vw,2.6rem)] leading-tight`} style={disp}>{a}{b ? <span className="mx-2 text-[#b8546f]" style={scr}>&amp;</span> : null}{b}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-[#8b6075]" style={{ fontFamily: "var(--wbody)", fontWeight: 600 }}>{sub}</p>
        </div>
        <div data-body className={`${s.pocket} absolute inset-0 rounded-[6px]`} />
        <div data-flap className={`${s.flap} absolute inset-x-0 top-0 z-10 h-[56%]`} />
        <div className="absolute left-1/2 top-[56%] z-20 aspect-square w-[19%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_6px_10px_rgba(61,21,48,.35)]">
          <div data-seal="l" className="absolute inset-0"><SealHalf side="l" className="h-full w-full" /></div>
          <div data-seal="r" className="absolute inset-0"><SealHalf side="r" className="h-full w-full" /></div>
        </div>
      </div>
      <p data-hint className={`${s.pulse} absolute bottom-[10%] left-0 right-0 text-center text-[11px] uppercase tracking-[0.5em] text-[#8b6075]`}>{label}</p>
    </div>
  );
}

export default function LotusSite({ profile, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const clip = useGid("ltarch");
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
  const wide = !compact;
  useLenis(!compact);

  useStage(root, (g, q) => {
    const tl = g.timeline({ paused: !compact, defaults: { ease: "power3.out" } });
    tl.from(q("[data-hero-arch]"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.6, ease: "power3.inOut" }, 0)
      .from(q("[data-hero-arch] img"), { scale: 1.25, duration: 2.4, ease: "power2.out" }, 0)
      .from(q("[data-hero-line] [data-draw]"), { drawSVG: 0, duration: 2, ease: "power2.inOut" }, 0.2)
      .from(q("[data-hero-lotus] [data-petal]"), { scale: 0, transformOrigin: "50% 100%", duration: 1.2, stagger: 0.06, ease: "back.out(1.6)" }, 0.6)
      .from(q("[data-name]"), { opacity: 0, y: 30, filter: "blur(8px)", duration: 1.4, stagger: 0.25 }, 0.8)
      .from(q("[data-hero-in]"), { opacity: 0, y: 16, duration: 1, stagger: 0.1 }, 1.2);
    intro.current = tl;
    if (compact) return;
    g.to(q("[data-hero-arch] img"), { yPercent: 8, ease: "none", scrollTrigger: { trigger: q("header")[0], start: "top top", end: "bottom top", scrub: true } });
    const rise = q("[data-rise]");
    g.set(rise, { opacity: 0, y: 40 });
    ScrollTrigger.batch(rise, { start: "top 88%", once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, ease: "power3.out", overwrite: true }) });
    q("[data-drawon]").forEach((el) => g.from(el.querySelectorAll("[data-draw]"), { drawSVG: 0, duration: 1.8, stagger: 0.03, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 85%" } }));
    const thread = q("[data-thread]")[0];
    if (thread) g.from(thread, { scaleY: 0, transformOrigin: "50% 0%", ease: "none", scrollTrigger: { trigger: thread, start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
  }, [compact]);

  const nameVw = fit("x".repeat(longest), 15, 84, 0.62);
  const nameRem = fit("x".repeat(longest), compact ? 3.6 : 7.5, compact ? 20 : 26, 0.62);
  const nameStyle: CSSProperties = { ...disp, fontSize: `max(2.2rem, min(${nameVw}vw, ${nameRem}rem))`, color: PLUM, lineHeight: 1.05 };

  const hero = (
    <header className={`${s.silk} relative overflow-hidden`} style={{ minHeight: compact ? 860 : "100svh" }}>
      <ArchClip id={clip} />
      <Rushnyk className="absolute inset-x-0 top-3 opacity-80" />
      <div className={`relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-14 pt-16 ${wide ? "md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10 md:pt-20" : ""}`} style={{ minHeight: compact ? 860 : "100svh" }}>
        <div data-hero-in className={`order-0 mb-6 text-center ${wide ? "md:col-span-3 md:mb-0" : ""}`}><Eyebrow>{occ === "wedding" ? L.wedding : occasionLine(profile)}</Eyebrow></div>
        <div className={`order-2 text-center ${wide ? "mt-20 md:mt-0 md:order-none md:text-right" : "mt-20"}`}>
          <E as="h1" path="profile.partner1" className="block" style={nameStyle}><span data-name className="inline-block">{a}</span></E>
        </div>
        <div className={`relative order-1 ${wide ? "md:order-none" : ""}`} style={{ width: compact ? "min(70%, 330px)" : "min(74vw, 400px)" }}>
          <div data-hero-arch className="relative aspect-[3/4.2] overflow-hidden bg-[#f3d9d9]" style={{ clipPath: `url(#${clip})` }}>
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="hero" src={heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div data-edit-photo="hero" className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_60%,#fff4f0,#f1c9cd)]"><Lotus className="w-2/3" /></div>
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#fbefed] via-[#fbefed]/10 to-transparent" />
          </div>
          <div data-hero-line className="pointer-events-none absolute inset-x-[-3%] bottom-0 top-[-8%]"><ArchLine W={400} H={560} className="h-full w-full" /></div>
          <div data-hero-lotus className={`${s.float} absolute -bottom-[12%] left-1/2 w-[64%] -translate-x-1/2`}><Lotus /></div>
        </div>
        <div className={`order-3 text-center ${wide ? "md:order-none md:text-left" : ""}`}>
          {b && (
            <>
              <p data-name className="text-[3.4rem] leading-none text-[#b8546f] md:text-[4.4rem]" style={scr}>&amp;</p>
              <E as="h1" path="profile.partner2" className="block" style={nameStyle}><span data-name className="inline-block">{b}</span></E>
            </>
          )}
        </div>
        <div className={`order-4 mt-10 flex flex-col items-center text-center ${wide ? "md:col-span-3 md:mt-6" : ""}`}>
          {occ === "wedding" && <p data-hero-in className="text-[1.5rem] italic text-[#8b6075]" style={{ fontFamily: "var(--wbody)" }}>{occasionLine(profile)}</p>}
          {dp && (
            <p data-hero-in className="mt-3 flex flex-wrap items-center justify-center gap-x-4 text-[1.15rem] text-[#3d1530]" style={{ fontFamily: "var(--wbody)", fontWeight: 500 }}>
              <span>{dp.weekday}</span><span className="text-[#c9a265]">✦</span><span>{dp.full}</span>
              {where && occ !== "greeting" && <><span className="text-[#c9a265]">✦</span><E path={profile.venue ? "profile.venue" : "profile.city"}>{where}</E></>}
            </p>
          )}
          <div data-hero-in className="mt-6 flex h-[84px] items-end gap-3">
            {until && occ !== "greeting" && ([[until.d, L.days], [until.h, L.hours], [until.m, L.minutes]] as const).map(([n, l]) => (
              <div key={l} className="relative flex h-[80px] w-[72px] flex-col items-center justify-end pb-3">
                <ArchLine W={100} H={120} spring={0.36} className="absolute inset-0 h-full w-full" />
                <span className={`${s.foil} text-[1.6rem] leading-none`} style={disp}>{n}</span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#8b6075]" style={{ fontFamily: "var(--wbody)", fontWeight: 600 }}>{l}</span>
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
        <div data-rise className="mx-auto max-w-3xl text-center">
          <Rushnyk className="mx-auto max-w-md" />
          <Eyebrow className="mb-6 mt-10">{L.invitation}</Eyebrow>
          <E as="p" multiline path="profile.inviteLine" className="block text-[1.9rem] italic leading-[1.45] text-[#3d1530] md:text-[2.6rem]" style={{ fontFamily: "var(--wbody)", fontWeight: 400 }}>{profile.inviteLine || occasionInvite(profile)}</E>
          <Lotus className="mx-auto mt-8 w-24" />
        </div>
      </section>
    ),
    story: profile.story && (
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Heading title={L.story} />
          <div data-rise className="relative">
            <span aria-hidden className="absolute -left-2 -top-10 text-[7rem] leading-none text-[#b8546f]/25 md:-left-10" style={disp}>“</span>
            <E as="p" multiline path="profile.story" className="relative block whitespace-pre-line text-[1.4rem] leading-[1.75] text-[#3d1530] md:text-[1.7rem]" style={{ fontFamily: "var(--wbody)", fontWeight: 400 }}>{profile.story}</E>
          </div>
          <div data-thread className="mx-auto mt-10 h-24 w-px bg-gradient-to-b from-[#c9a265] to-[#b8546f]" />
          <p data-rise className="mt-4 text-[2.2rem] text-[#b8546f]" style={scr}>{L.forever}</p>
        </div>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-24">
        <Heading title={L.details} />
        <div className={`mx-auto grid max-w-4xl gap-10 ${wide ? "md:grid-cols-2" : ""}`}>
          {dp && (
            <div data-rise><ArchCard inner="px-10 pb-12 pt-[42%] text-center">
              <Eyebrow>{L.when}</Eyebrow>
              <p className={`${s.foil} mt-3 inline-block text-[5rem] leading-none`} style={disp}>{dp.day}</p>
              <p className="mt-2 text-[1.6rem]" style={{ ...disp, color: PLUM }}>{dp.month} {dp.year}</p>
              <p className="mt-1 text-[1.05rem] text-[#8b6075]" style={{ fontFamily: "var(--wbody)" }}>{dp.weekday}{events[0]?.time ? ` · ${events[0].time}` : ""}</p>
            </ArchCard></div>
          )}
          {where && (
            <div data-rise><ArchCard inner="px-10 pb-12 pt-[42%] text-center flex flex-col items-center">
              <Eyebrow>{L.where}</Eyebrow>
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-4 block text-[2rem] leading-tight" style={{ ...disp, color: PLUM }}>{where}</E>
              {profile.venue && profile.city && <p className="mt-1 text-[1.05rem] text-[#8b6075]" style={{ fontFamily: "var(--wbody)" }}>{profile.city}</p>}
              <div className="mt-6"><SilkButton href={mapUrl(profile)} external>{L.directions}</SilkButton></div>
            </ArchCard></div>
          )}
        </div>
      </section>
    ),
    schedule: events.length > 0 && (
      <section className="relative px-6 py-20 md:py-28">
        <div data-drawon className="mx-auto mb-4 w-[min(84vw,380px)]"><Mandap /></div>
        <div data-rise className="mb-12 text-center">
          <Eyebrow className="mb-3">{L.ceremony}</Eyebrow>
          <h2 className="text-[2.4rem] leading-tight md:text-[3.2rem]" style={{ ...disp, color: PLUM }}>{L.events}</h2>
        </div>
        <div className="relative mx-auto max-w-xl">
          <div aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px border-l border-dashed border-[#c9a265]" />
          {events.map((e, i) => (
            <div data-rise key={i} className="relative mb-10 flex gap-6">
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#c9a265]/70 bg-[#fff8f6]">
                <span className={`${s.foil} text-[1.4rem]`} style={disp}>{i + 1}</span>
              </div>
              <div className="pt-1">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#b8546f]" style={{ fontFamily: "var(--wbody)", fontWeight: 600 }}>{[dateParts(e.date, lang)?.full, e.time].filter(Boolean).join(" · ")}</p>
                <h3 className="mt-1 text-[1.8rem] leading-tight" style={{ ...disp, color: PLUM }}>{e.name}</h3>
                {e.venue && <p className="text-[1.05rem] text-[#8b6075]" style={{ fontFamily: "var(--wbody)" }}>{e.venue}</p>}
              </div>
            </div>
          ))}
        </div>
        {calendarUrl && <div data-rise className="mt-4 text-center"><SilkButton href={calendarUrl}>{L.calendar}</SilkButton></div>}
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div data-rise className="mx-auto max-w-3xl text-center">
          <Eyebrow>{L.venue}</Eyebrow>
          <E as="h2" path={profile.venue ? "profile.venue" : "profile.city"} className={`${s.foil} mt-4 inline-block text-[2.8rem] leading-tight md:text-[4rem]`} style={disp}>{where}</E>
          {profile.venue && profile.city && <p className="mt-2 text-[1.2rem] italic text-[#8b6075]" style={{ fontFamily: "var(--wbody)" }}>{profile.city}</p>}
          <div data-drawon className="relative mx-auto mt-6 w-[min(90vw,560px)]">
            <Pond />
            <Lotus className="absolute bottom-[22%] left-[12%] w-[16%]" />
            <Lotus className="absolute bottom-[14%] right-[18%] w-[20%]" />
            <Lotus className="absolute bottom-[4%] left-[42%] w-[12%]" open={0.7} />
          </div>
          <div className="mt-6"><SilkButton href={mapUrl(profile)} external>{L.directions}</SilkButton></div>
          {/goa/i.test(`${profile.city} ${profile.venue}`) && (
            <div className="mx-auto mt-12 max-w-xl">
              <Rushnyk className="mx-auto max-w-xs opacity-70" />
              <p className="mt-6 text-[1.9rem] text-[#b8546f]" style={scr}>{L.travel}</p>
              <p className="mt-2 text-[1.15rem] leading-relaxed text-[#5b3a4b]" style={{ fontFamily: "var(--wbody)" }}>{L.travelText}</p>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className="relative px-6 py-20 md:py-28">
        <Heading title={L.gallery} />
        <div className={`mx-auto grid max-w-6xl grid-cols-2 gap-5 ${wide ? "md:grid-cols-3 md:gap-8" : ""}`}>
          {gallery.map((k, i) => (
            <div data-rise key={k} className={wide && i % 3 === 1 ? "md:translate-y-12" : ""}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-[3/4.2] w-full object-cover" style={{ clipPath: `url(#${clip})` }} />
            </div>
          ))}
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div className="mx-auto max-w-xl">
          <p data-rise className="mb-8 text-center text-[2.8rem] text-[#b8546f]" style={scr}>{L.reply}</p>
          <div data-rise className="relative rounded-[28px] border border-[#c9a265]/50 bg-[#fff8f6]/80 p-7 shadow-[0_40px_80px_-50px_rgba(61,21,48,.5)] md:p-10">
            <Lotus className="absolute -top-12 left-1/2 w-24 -translate-x-1/2" />
            {children}
          </div>
        </div>
      </section>
    ),
    info: design?.texts?.body && (
      <section className="relative px-6 py-16">
        <div data-rise className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">{L.info}</Eyebrow>
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[1.25rem] leading-relaxed text-[#3d1530]" style={{ fontFamily: "var(--wbody)" }}>{design.texts.body}</E>
          <Rushnyk className="mx-auto mt-8 max-w-xs opacity-70" />
        </div>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${fontClass} ${s.root} ${s.silk} relative overflow-hidden`} style={lookStyle(LOTUS_LOOK, design, "lotus-vows")}>
      <LotusStyles />
      {!compact && <Envelope a={a} b={b} sub={dp?.full ?? ""} label={L.open} onOpen={() => intro.current?.play()} />}
      {hero}
      <Sections design={design} map={sections} />
      <footer className="relative px-6 pb-16 pt-10 text-center">
        <Lotus className="mx-auto w-28" />
        <p className={`${s.foil} mt-2 inline-block text-[2.6rem] leading-tight`} style={disp}>{a}{b ? <span className="mx-2 text-[#b8546f]" style={scr}>&amp;</span> : null}{b}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-2 block text-[2rem] text-[#b8546f]" style={scr}>{profile.blessing}</E>}
        {dp && <p className="mt-3 text-[11px] uppercase tracking-[0.4em] text-[#8b6075]">{dp.full}</p>}
        <Rushnyk className="mx-auto mt-8 max-w-sm opacity-70" />
        <div className="mt-8 text-xs text-[#8b6075]">{credit}</div>
      </footer>
    </div>
  );
}
