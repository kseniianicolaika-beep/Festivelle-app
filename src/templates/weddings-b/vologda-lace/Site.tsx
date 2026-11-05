"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { fit, fontClass, grain, gsap, lookStyle, Sections, ScrollTrigger, SplitText, useLenis, useStage, useUntil } from "../_shared/kit";
import { dateParts, langOf, mapUrl, media, nameParts, occasionInvite, occasionOf, words } from "../_shared/text";
import { Bell, Birch, Church, Crown, Divider, LaceBand, OvalLace, Rosette } from "./art";
import { monthOf, VL, VOLOGDA_LOOK } from "./look";
import { s, VologdaStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const scr: CSSProperties = { fontFamily: "var(--ws)" };

const Caps = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <p className={`uppercase ${className}`} style={{ letterSpacing: "0.34em", fontSize: 11.5, color: VL.gold, ...style }}>{children}</p>
);

function Heading({ title, kicker }: { title: ReactNode; kicker?: string }) {
  return (
    <div data-rise className="mb-12 text-center">
      {kicker && <Caps className="mb-3">{kicker}</Caps>}
      <h2 className="text-[3rem] leading-none md:text-[4.2rem]" style={{ ...scr, color: VL.ink }}>{title}</h2>
      <div data-drawon><Divider className="mx-auto mt-5 w-56" /></div>
    </div>
  );
}

/** A sheet of cotton paper with lace edging top and bottom. */
function Sheet({ children, className = "", inner = "" }: { children: ReactNode; className?: string; inner?: string }) {
  return (
    <div className={`relative ${className}`}>
      <LaceBand className={`${s.lace} relative z-[1] -mb-px block rotate-180`} height={34} />
      <div className={`relative shadow-[0_30px_60px_-40px_rgba(90,64,40,.45)] ${inner}`} style={{ backgroundColor: VL.cream, backgroundImage: grain(0.12, 0.9) }}>
        <div aria-hidden className="pointer-events-none absolute inset-x-5 inset-y-3 border-x" style={{ borderColor: `${VL.thread}55` }} />
        <div className="relative">{children}</div>
      </div>
      <LaceBand className={`${s.lace} relative z-[1] -mt-px block`} height={34} />
    </div>
  );
}

function ThreadButton({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className="inline-flex items-center gap-3 rounded-full border px-7 py-3 text-[12px] uppercase tracking-[0.3em] transition hover:bg-white/60" style={{ borderColor: `${VL.gold}99`, color: VL.ink }}>
      <span style={{ color: VL.gold }}>✦</span>{children}
    </a>
  );
}

function Veil({ a, b, label, onOpen }: { a: string; b: string; label: string; onOpen: () => void }) {
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
      .to(q("[data-bells]"), { y: -40, opacity: 0, duration: 0.8, ease: "power2.in" })
      .to(q("[data-rose]"), { rotate: 25, scale: 1.08, duration: 2, ease: "power2.inOut" }, 0)
      .to(el, { yPercent: -108, duration: 2, ease: "power3.inOut" }, 0.25);
  };
  useStage(ref, (g, q) => {
    g.timeline()
      .from(q("[data-rose] [data-draw]"), { drawSVG: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.01 }, 0)
      .from(q("[data-rose] [data-petal]"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 1, stagger: { each: 0.03, from: "center" } }, 0.2)
      .from(q("[data-bells] > *"), { y: -80, opacity: 0, duration: 1.2, stagger: 0.15, ease: "back.out(1.4)" }, 0.4)
      .from(q("[data-mono]"), { opacity: 0, scale: 0.8, filter: "blur(6px)", duration: 1.2 }, 0.9)
      .from(q("[data-hint]"), { opacity: 0, y: 10, duration: 0.8 }, 1.5);
    const auto = g.delayedCall(3, open);
    return () => auto.kill();
  }, []);
  if (gone) return null;
  return (
    <div ref={ref} className={`${s.veil} ${s.paper} cursor-pointer overflow-visible`} onClick={open} role="button" tabIndex={0} aria-label={label} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
      style={{ backgroundColor: VL.paper, backgroundImage: `repeating-linear-gradient(45deg, ${VL.thread}14 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, ${VL.thread}14 0 1px, transparent 1px 9px)` }}>
      <div data-bells className="absolute left-0 right-0 top-0 flex justify-center gap-[9vw]">
        {[70, 120, 70].map((r, i) => <div key={i} className={s.swing} style={{ animationDelay: `${i * 0.4}s` }}><Bell rope={r} className="w-[44px]" /></div>)}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div data-rose className="relative" style={{ width: "min(84vw, 70vh)" }}>
          <Rosette className={`${s.lace} h-auto w-full`} petals={12} />
          <div data-mono className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[30%] w-[30%] items-center justify-center rounded-full shadow-[0_0_0_1px_rgba(180,138,74,.5),0_0_0_6px_#fffcf5,0_0_0_7px_rgba(180,138,74,.35)]" style={{ background: VL.cream }}>
              <p className="whitespace-nowrap text-[clamp(1.6rem,4.5vw,2.8rem)] leading-none" style={{ ...scr, color: VL.ink }}>{a[0]}<span style={{ color: VL.gold }}> & </span>{b?.[0]}</p>
            </div>
          </div>
        </div>
      </div>
      <p data-hint className="absolute bottom-[9%] left-0 right-0 text-center text-[11px] uppercase tracking-[0.5em]" style={{ color: VL.gold }}>{label}</p>
      <LaceBand className={`${s.lace} absolute left-0 right-0 top-full block`} height={46} />
    </div>
  );
}

export default function VologdaSite({ profile, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
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
  const longest = Math.max([...a].length, [...(b || "")].length, 4);
  useLenis(!compact);

  useStage(root, (g, q) => {
    const tl = g.timeline({ paused: !compact, defaults: { ease: "power3.out" } });
    tl.from(q("[data-hero] [data-draw]"), { drawSVG: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.004 }, 0)
      .from(q("[data-crown=l]"), { x: -40, y: -60, rotate: -20, opacity: 0, duration: 1.8 }, 0.2)
      .from(q("[data-crown=r]"), { x: 40, y: -60, rotate: 20, opacity: 0, duration: 1.8 }, 0.35)
      .from(q("[data-hero-in]"), { opacity: 0, y: 20, filter: "blur(6px)", duration: 1.3, stagger: 0.12 }, 0.6);
    if (!compact) {
      const split = SplitText.create(q("[data-name]"), { type: "chars", charsClass: "inline-block" });
      tl.from(split.chars, { opacity: 0, y: 26, filter: "blur(8px)", duration: 1.2, stagger: 0.05 }, 0.7);
      g.to(q("[data-side-rose]"), { yPercent: 18, ease: "none", scrollTrigger: { trigger: q("header")[0], start: "top top", end: "bottom top", scrub: true } });
      const rise = q("[data-rise]");
      g.set(rise, { opacity: 0, y: 36 });
      ScrollTrigger.batch(rise, { start: "top 88%", once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 1.3, stagger: 0.12, ease: "power3.out", overwrite: true }) });
      q("[data-drawon]").forEach((el) => g.from(el.querySelectorAll("[data-draw]"), { drawSVG: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.01, scrollTrigger: { trigger: el, start: "top 88%" } }));
      const church = q("[data-church]")[0];
      if (church) {
        g.from(church.querySelectorAll("[data-draw]"), { drawSVG: 0, ease: "none", stagger: 0.01, scrollTrigger: { trigger: church, start: "top 85%", end: "bottom 55%", scrub: 0.6 } });
        g.from(church.querySelectorAll("[data-dome]"), { scale: 0, transformOrigin: "50% 100%", stagger: 0.12, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: church, start: "center 70%" } });
      }
      const thread = q("[data-thread]")[0];
      if (thread) g.from(thread, { scaleY: 0, transformOrigin: "50% 0%", ease: "none", scrollTrigger: { trigger: thread, start: "top 75%", end: "bottom 60%", scrub: true } });
      const portrait = q("[data-portrait]")[0];
      if (portrait) g.from(q("[data-portrait] [data-oval]"), { clipPath: "ellipse(0% 0% at 50% 50%)", duration: 1.8, ease: "power3.inOut", scrollTrigger: { trigger: portrait, start: "top 80%" } });
    }
    intro.current = tl;
  }, [compact]);

  const nameVw = fit("x".repeat(longest), 15, 80, 0.48);
  const nameStyle: CSSProperties = { ...disp, fontStyle: "italic", fontWeight: 300, color: VL.ink, fontSize: compact ? `${Math.min(nameVw * 0.62, 5.2)}rem` : `min(${nameVw}vw, 7.2rem, 11svh)`, lineHeight: 1 };

  const hero = (
    <header data-hero className="relative overflow-hidden" style={{ minHeight: compact ? 760 : "100svh" }}>
      <LaceBand className={`${s.lace} absolute left-0 right-0 top-0 block rotate-180`} height={compact ? 34 : 46} />
      <div data-side-rose aria-hidden className="pointer-events-none absolute -left-[22vw] top-[18%] w-[46vw] min-w-[300px] opacity-30 md:opacity-55 md:-left-[12vw] md:w-[34vw]"><Rosette className={`${s.drift} ${s.lace} w-full`} /></div>
      <div data-side-rose aria-hidden className="pointer-events-none absolute -right-[22vw] top-[48%] w-[46vw] min-w-[300px] opacity-30 md:opacity-55 md:-right-[12vw] md:w-[34vw]"><Rosette className={`${s.drift} ${s.lace} w-full`} petals={12} /></div>
      <div className="relative flex flex-col items-center justify-center px-6 pb-20 pt-16 text-center" style={{ minHeight: compact ? 760 : "100svh" }}>
        <div className="flex items-end justify-center gap-2">
          <div data-crown="l" style={{ rotate: "-12deg" }}><Crown className="w-[80px] md:w-[96px]" /></div>
          <div data-crown="r" style={{ rotate: "12deg" }}><Crown className="w-[80px] md:w-[96px]" /></div>
        </div>
        <Caps className="mt-6" style={{ fontSize: 12 }}>{occ === "wedding" ? L.wedding : L.invited}</Caps>
        <h1 className="mt-6">
          <E as="span" path="profile.partner1" className="block" style={nameStyle}><span data-name>{a}</span></E>
          {b && (
            <>
              <span data-hero-in className="my-1 block leading-none" style={{ ...scr, color: VL.gold, fontSize: compact ? "2.8rem" : "clamp(2.8rem,6vw,4.6rem)" }}>&amp;</span>
              <E as="span" path="profile.partner2" className="block" style={nameStyle}><span data-name>{b}</span></E>
            </>
          )}
        </h1>
        <div data-hero-in className="mt-8 w-[min(70vw,300px)]"><Divider /></div>
        {dp && (
          <div data-hero-in className="mt-6 flex items-center justify-center gap-5" style={{ color: VL.ink }}>
            <span className="text-[13px] uppercase tracking-[0.3em]" style={{ color: VL.muted }}>{dp.weekday}</span>
            <span className="text-[2.6rem] leading-none" style={{ ...disp, color: VL.gold }}>{dp.day}</span>
            <span className="text-[13px] uppercase tracking-[0.3em]" style={{ color: VL.muted }}>{monthOf(profile.date, lang)} {dp.year}</span>
          </div>
        )}
        {where && occ !== "greeting" && (
          <p data-hero-in className="mt-3 text-[1.25rem] italic" style={{ ...disp, color: VL.muted }}>
            <E path={profile.venue ? "profile.venue" : "profile.city"}>{where}</E>{profile.venue && profile.city ? `, ${profile.city}` : ""}
          </p>
        )}
        <div data-hero-in className="mt-10 flex h-[96px] items-center justify-center gap-4">
          {until && occ !== "greeting" && ([[until.d, L.days], [until.h, L.hours], [until.m, L.minutes]] as const).map(([n, l]) => (
            <div key={l} className="relative flex h-[92px] w-[92px] flex-col items-center justify-center">
              <Rosette className={`${s.lace} absolute inset-0 h-full w-full opacity-90`} petals={8} />
              <div className="relative flex h-[50px] w-[50px] flex-col items-center justify-center rounded-full" style={{ background: VL.cream }}>
                <span className="text-[1.6rem] leading-none" style={{ ...disp, color: VL.ink }}>{n}</span>
                <span className="text-[8px] uppercase tracking-[0.2em]" style={{ color: VL.muted }}>{l}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LaceBand className={`${s.lace} absolute bottom-0 left-0 right-0 block`} height={compact ? 34 : 46} />
    </header>
  );

  const portrait = (
    <div data-portrait className="relative px-6 py-20">
      <div className={`mx-auto grid max-w-5xl items-center gap-10 ${compact ? "" : "md:grid-cols-[1fr_auto_1fr]"}`}>
        <p className={`hidden text-right text-[2.3rem] leading-tight ${compact ? "" : "md:block"}`} style={{ ...scr, color: VL.rose }}>{L.forever}</p>
        <div className="relative mx-auto" style={{ width: compact ? "min(72%, 320px)" : "min(76vw, 380px)" }}>
          <OvalLace className={`${s.lace} block h-auto w-full`} />
          <div data-oval className="absolute overflow-hidden rounded-[50%]" style={{ left: "10.9%", right: "10.9%", top: "8.6%", bottom: "8.6%" }}>
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" style={{ filter: "sepia(0.18) saturate(0.9)" }} />
            ) : (
              <div data-edit-photo="hero" className="flex h-full w-full items-center justify-center" style={{ background: VL.ivory }}><Church className="w-[80%]" /></div>
            )}
          </div>
        </div>
        <div className={`hidden ${compact ? "" : "md:block"}`}><Birch className="w-64" /></div>
      </div>
    </div>
  );

  const sections = {
    invitation: occ !== "greeting" && (
      <section className="relative px-5 py-16 md:py-24">
        <div data-rise className="mx-auto max-w-2xl">
          <Sheet inner="px-8 py-14 text-center md:px-16 md:py-16">
            <p className="text-[2.6rem] leading-none md:text-[3.2rem]" style={{ ...scr, color: VL.rose }}>{L.invited}</p>
            <div data-drawon><Divider className="mx-auto my-6 w-48" /></div>
            <E as="p" multiline path="profile.inviteLine" className="block text-[1.55rem] italic leading-[1.5] md:text-[1.9rem]" style={{ ...disp, color: VL.ink }}>{profile.inviteLine || occasionInvite(profile)}</E>
            <p className="mt-8 text-[2rem]" style={{ ...scr, color: VL.gold }}>{a}{b ? ` & ${b}` : ""}</p>
          </Sheet>
        </div>
      </section>
    ),
    story: profile.story && (
      <section className="relative px-6 py-20 md:py-28">
        <div className={`mx-auto grid max-w-5xl items-center gap-12 ${compact ? "" : "md:grid-cols-[1fr_1.3fr]"}`}>
          <div data-rise className="relative text-center">
            <div data-drawon><Birch className="mx-auto w-[min(80vw,340px)]" /></div>
            <h2 className="mt-4 text-[3rem] leading-none md:text-[3.8rem]" style={{ ...scr, color: VL.ink }}>{L.story}</h2>
          </div>
          <div data-rise>
            <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.35rem] leading-[1.75] first-letter:float-left first-letter:mr-3 first-letter:text-[4.6rem] first-letter:leading-[0.85] md:text-[1.5rem]" style={{ ...disp, color: VL.ink }}>{profile.story}</E>
            <p className="mt-6 text-[1.8rem]" style={{ ...scr, color: VL.rose }}>{L.forever}</p>
          </div>
        </div>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className="relative px-6 py-16 md:py-24">
        <Heading title={L.details} kicker={L.invited} />
        <div className={`mx-auto grid max-w-4xl justify-items-center gap-6 ${compact ? "" : "md:grid-cols-2"}`}>
          {dp && (
            <div data-rise className="relative flex aspect-square w-[min(84vw,360px)] items-center justify-center">
              <Rosette className={`${s.lace} absolute inset-0 h-full w-full`} petals={12} />
              <div className="relative flex h-[52%] w-[52%] flex-col items-center justify-center rounded-full text-center" style={{ background: VL.cream, boxShadow: `0 0 0 1px ${VL.thread}88` }}>
                <Caps style={{ fontSize: 10 }}>{L.when}</Caps>
                <p className="text-[3.6rem] leading-none" style={{ ...disp, color: VL.ink }}>{dp.day}</p>
                <p className="text-[1.05rem] italic" style={{ ...disp, color: VL.muted }}>{monthOf(profile.date, lang)} {dp.year}</p>
                {events[0]?.time && <p className="mt-1 text-[11px] uppercase tracking-[0.25em]" style={{ color: VL.gold }}>{events[0].time}</p>}
              </div>
            </div>
          )}
          {where && (
            <div data-rise className="relative flex aspect-square w-[min(84vw,360px)] items-center justify-center">
              <Rosette className={`${s.lace} absolute inset-0 h-full w-full`} petals={12} />
              <div className="relative flex h-[52%] w-[52%] flex-col items-center justify-center rounded-full px-3 text-center" style={{ background: VL.cream, boxShadow: `0 0 0 1px ${VL.thread}88` }}>
                <Caps style={{ fontSize: 10 }}>{L.where}</Caps>
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-1 block text-[1.3rem] leading-tight" style={{ ...disp, color: VL.ink }}>{where}</E>
                {profile.venue && profile.city && <p className="mt-1 text-[0.95rem] italic" style={{ ...disp, color: VL.muted }}>{profile.city}</p>}
              </div>
            </div>
          )}
        </div>
      </section>
    ),
    schedule: events.length > 0 && (
      <section className="relative px-6 py-16 md:py-24">
        <Heading title={L.events} kicker={L.ceremony} />
        <div className="relative mx-auto max-w-2xl">
          <div data-thread aria-hidden className="absolute bottom-0 left-[28px] top-0 w-px md:left-1/2" style={{ background: `linear-gradient(${VL.thread}00, ${VL.thread}, ${VL.thread}00)` }} />
          {events.map((e, i) => (
            <div data-rise key={i} className={`relative mb-12 pl-20 ${compact ? "" : `md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-16" : "md:pr-16 md:text-right"}`}`}>
              <div className={`absolute top-0 left-[8px] ${compact ? "" : i % 2 ? "md:left-[-20px]" : "md:left-auto md:right-[-20px]"}`}>
                <div className={s.swing} style={{ animationDelay: `${i * 0.5}s` }}><Bell rope={14} className="w-[40px]" /></div>
              </div>
              <p className="text-[12px] uppercase tracking-[0.3em]" style={{ color: VL.gold }}>{[e.time, dateParts(e.date, lang)?.full].filter(Boolean).join(" · ")}</p>
              <h3 className="mt-1 text-[2.3rem] italic leading-tight" style={{ ...disp, color: VL.ink }}>{e.name}</h3>
              {e.venue && <p className="text-[1.05rem] italic" style={{ ...disp, color: VL.muted }}>{e.venue}</p>}
            </div>
          ))}
        </div>
        {calendarUrl && <div data-rise className="mt-6 text-center"><ThreadButton href={calendarUrl}>{L.calendar}</ThreadButton></div>}
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div data-church className="mx-auto w-[min(90vw,560px)]"><Church /></div>
          <div data-rise className="mt-10">
            <Caps>{L.venue}</Caps>
            <E as="h2" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-3 block text-[2.6rem] leading-tight md:text-[3.6rem]" style={{ ...disp, color: VL.ink }}>{where}</E>
            {profile.venue && profile.city && <p className="mt-1 text-[1.3rem] italic" style={{ ...disp, color: VL.muted }}>{profile.city}</p>}
            <div className="mt-8"><ThreadButton href={mapUrl(profile)} external>{L.directions}</ThreadButton></div>
            {/goa/i.test(`${profile.city} ${profile.venue}`) && (
              <div className="mx-auto mt-12 max-w-xl">
                <Caps className="mb-3">{L.travel}</Caps>
                <p className="text-[1.2rem] italic leading-relaxed" style={{ ...disp, color: VL.muted }}>{L.travelText}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className="relative px-6 py-16 md:py-24">
        <Heading title={L.gallery} />
        <div className={`mx-auto grid max-w-5xl grid-cols-2 gap-6 ${compact ? "" : "md:grid-cols-3 md:gap-10"}`}>
          {gallery.map((k, i) => (
            <div data-rise key={k} className={`relative ${!compact && i % 3 === 1 ? "md:translate-y-10" : ""}`}>
              <OvalLace className={`${s.lace} block h-auto w-full`} n={36} />
              <div className="absolute overflow-hidden rounded-[50%]" style={{ left: "10.9%", right: "10.9%", top: "8.6%", bottom: "8.6%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className="relative px-5 py-16 md:py-24">
        <div className="mx-auto max-w-xl">
          <div data-rise className="mb-6 flex justify-center gap-10">
            {[0, 1].map((i) => <div key={i} className={s.swing} style={{ animationDelay: `${i * 0.6}s` }}><Bell rope={30} className="w-[40px]" /></div>)}
          </div>
          <div data-rise><Sheet inner="px-6 py-10 md:px-10">{children}</Sheet></div>
        </div>
      </section>
    ),
    info: design?.texts?.body && (
      <section className="relative px-5 py-16">
        <div data-rise className="mx-auto max-w-2xl"><Sheet inner="px-8 py-10 text-center">
          <Caps className="mb-4">{L.info}</Caps>
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[1.25rem] leading-relaxed" style={{ ...disp, color: VL.ink }}>{design.texts.body}</E>
        </Sheet></div>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${fontClass} ${s.root} ${s.paper} relative overflow-hidden`} style={lookStyle(VOLOGDA_LOOK, design, "vologda-lace")}>
      <VologdaStyles />
      {!compact && <Veil a={a} b={b} label={L.enter} onOpen={() => intro.current?.play()} />}
      {hero}
      {portrait}
      <Sections design={design} map={sections} />
      <footer className="relative px-6 pb-16 pt-12 text-center">
        <div className="flex items-end justify-center gap-1">
          <Crown className="w-16 -rotate-12" /><Crown className="w-16 rotate-12" />
        </div>
        <p className="mt-4 text-[2.6rem] leading-none" style={{ ...scr, color: VL.ink }}>{a}{b ? <span style={{ color: VL.gold }}> & </span> : null}{b}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-[1.4rem] italic" style={{ ...disp, color: VL.rose }}>{profile.blessing}</E>}
        {dp && <Caps className="mt-5">{dp.full}</Caps>}
        <LaceBand className={`${s.lace} mx-auto mt-10 block max-w-md`} height={30} />
        <div className="mt-8 text-xs" style={{ color: VL.muted }}>{credit}</div>
      </footer>
    </div>
  );
}
