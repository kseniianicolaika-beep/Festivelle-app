"use client";
import { useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { FIBRES } from "../_shared/ui";
import { fit } from "../_shared/kit";
import { Bow, Petals, RoseCorner, Sprig, WaxSeal, deckle, silk } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

if (typeof window !== "undefined") gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

const SHEET = deckle(5, 60, 0.55);

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.to(q(".ll-tap"), { opacity: 0, duration: 0.4 })
      .to(q(".ll-bow"), { y: -50, rotate: -28, opacity: 0, duration: 0.8, ease: "power2.in" }, 0)
      .to(q(".ll-band"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.9 }, 0.15)
      .to(q(".ll-seal"), { scale: 1.18, duration: 0.25, ease: "power2.out" }, 0.55)
      .to(q(".ll-seal"), { y: -36, rotate: -24, opacity: 0, duration: 0.55, ease: "power2.in" }, 0.8)
      .to(q(".ll-flap"), { rotateX: 180, duration: 1.15, ease: "power2.inOut" }, 0.95)
      .set(q(".ll-flap"), { zIndex: 1 }, 1.5)
      .to(q(".ll-sheet"), { yPercent: -58, duration: 1.15 }, 1.75)
      .set(q(".ll-sheet"), { zIndex: 9 }, 2.9)
      .to(q(".ll-sheet"), { yPercent: -10, scale: 1.5, opacity: 0, duration: 1.2, ease: "power2.in" }, 2.9)
      .to(q(".ll-env-body"), { y: "70vh", rotate: 4, duration: 1.1, ease: "power3.in" }, 2.9)
      .call(onOpen, [], 3.5);
  };
  return (
    <div ref={ref} className="ll-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <Petals className="ll-open-petals" />
      <div className="ll-stage">
        <div className="ll-env">
          <div className="ll-env-body">
            <div className="ll-env-back" />
            <div className="ll-sheet" style={{ clipPath: SHEET }}>
              <span className="ll-sheet-line">{g.headline}</span>
              <Sprig className="ll-sheet-sprig" />
            </div>
            <svg className="ll-pocket" viewBox="0 0 145 100" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="llpl" x1="0" x2="1"><stop offset="0" stopColor="#EADFCD" /><stop offset="1" stopColor="#F3EADD" /></linearGradient>
                <linearGradient id="llpr" x1="1" x2="0"><stop offset="0" stopColor="#E7DBC8" /><stop offset="1" stopColor="#F2E9DB" /></linearGradient>
                <linearGradient id="llpb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#F6EEE3" /><stop offset="1" stopColor="#EFE5D6" /></linearGradient>
              </defs>
              <path d="M0 0L66 54Q72.5 59 79 54L145 0V100H0Z" fill="url(#llpl)" />
              <path d="M145 0L79 54Q72.5 59 66 54L145 100Z" fill="url(#llpr)" />
              <path d="M0 100L62 50Q72.5 42 83 50L145 100Z" fill="url(#llpb)" />
              <path d="M0 100L62 50Q72.5 42 83 50L145 100" fill="none" stroke="#8a6a50" strokeOpacity=".12" strokeWidth=".35" />
            </svg>
            <p className="ll-to"><span>{g.w.forYou.toLowerCase()}</span> {g.name}</p>
            <div className="ll-flap">
              <div className="ll-flap-front" />
              <div className="ll-flap-in" />
            </div>
            <div className="ll-band" style={{ background: silk }} />
            <Bow className="ll-bow" />
            <WaxSeal letter={(g.name.trim()[0] ?? "♥").toUpperCase()} className="ll-seal" />
          </div>
        </div>
        <p className="ll-tap gk-tap">{g.w.open}</p>
      </div>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const hidden = [".ll-hero-kicker", ".ll-hero-name", ".ll-hero-head", ".ll-corner", ".ll-hero-cue"];
      if (!g.opened) {
        gsap.set(hidden, { autoAlpha: 0 });
        return;
      }
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(".ll-corner", { autoAlpha: 0, scale: 0.86, duration: 2.6, ease: "power2.out", stagger: 0.2 })
        .from(".ll-hero-kicker", { autoAlpha: 0, y: 14, duration: 1 }, 0.4)
        .fromTo(".ll-hero-name", { autoAlpha: 1, clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0% -20% 0)", duration: 2.4, ease: "power2.inOut" }, 0.7)
        .from(".ll-flourish path", { drawSVG: "0%", duration: 2, ease: "power2.inOut" }, 1.6)
        .from(".ll-hero-head", { autoAlpha: 0, y: 26, filter: "blur(8px)", duration: 1.4, ease: "power3.out" }, 2.2)
        .from(".ll-hero-cue", { autoAlpha: 0, duration: 1 }, 3);
      gsap.to(".ll-corner-a", { yPercent: -14, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".ll-corner-b", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  return (
    <header ref={ref} className="ll-hero">
      <div className="ll-cw ll-cw-a"><RoseCorner className="ll-corner ll-corner-a" seed={1} /></div>
      <div className="ll-cw ll-cw-b"><RoseCorner className="ll-corner ll-corner-b" seed={7} /></div>
      <div className="ll-hero-in">
        <E as="p" path="texts.eyebrow" className="gk-kicker ll-hero-kicker">{g.line}</E>
        <h1 className="ll-hero-name" style={{ ["--k" as string]: fit(g.name, 1, 9, 0.5) } as React.CSSProperties}>
          <E path="profile.partner1">{g.name}</E>
        </h1>
        <svg className="ll-flourish" viewBox="0 0 600 40" aria-hidden>
          <path d="M20 22C90 6 150 34 220 20S330 4 300 20s40 18 80 0 110-14 200 2" fill="none" stroke="var(--g-gold)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <E as="p" path="texts.headline" className="ll-hero-head">{g.headline}</E>
      </div>
      {!g.compact && <span className="ll-hero-cue gk-meta">{g.w.scroll}</span>}
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div className="ll-letter-wrap">
      {g.heroUrl && (
        <figure className="ll-pinned" data-rv="scale">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={g.heroUrl} alt="" data-edit-photo="hero" />
          <span className="ll-tape" style={{ background: silk }} />
        </figure>
      )}
      <div className="ll-sheet-shadow" data-rv>
        <article className="ll-letter" style={{ clipPath: SHEET }}>
          <p className="gk-kicker" style={{ textAlign: "left" }}>{g.w.letter}</p>
          <p className="ll-dear"><E path="profile.partner1">{g.name}</E>,</p>
          <E as="p" path="profile.story" multiline className="gk-msg ll-msg">{g.message}</E>
          <E as="p" path="profile.blessing" className="gk-sign ll-sign">{g.signoff}</E>
          <Sprig className="ll-letter-sprig" />
        </article>
      </div>
    </div>
  );
}

const frame = (img: React.ReactNode, i: number) => (
  <figure className="gk-photo ll-photo" style={{ rotate: `${[-2, 1.5, -1, 2.2][i % 4]}deg` }}>
    {img}
    <i className="ll-corner-tab l" />
    <i className="ll-corner-tab r" />
  </figure>
);

const CFG: SiteCfg = {
  id: "love-letter",
  cls: "ll",
  css: CSS + `.ll-open{background-image:${FIBRES},radial-gradient(ellipse at 50% 42%,#F1E8DC 0%,#DED0BD 70%,#CDBBA4 100%)}`,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  frame,
  ornament: <Sprig className="ll-orn" />,
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
