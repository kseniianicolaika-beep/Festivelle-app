"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { Particles } from "../_shared/Particles";
import { fit } from "../_shared/kit";
import { Cake, Coupes, DecoCorner, Fan, GoldBow, Sunburst } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

if (typeof window !== "undefined") gsap.registerPlugin(DrawSVGPlugin);

const BUBBLES = ["#F4DEA2", "#FFF1C9", "#E4C68C", "#C99A4A"];

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.timeline({ defaults: { ease: "power3.inOut" } })
      .to(q(".mhr-tap, .mhr-open-title"), { opacity: 0, duration: 0.4 })
      .to(q(".mhr-tag"), { rotate: 40, y: 40, opacity: 0, duration: 0.7, ease: "power2.in" }, 0)
      .to(q(".mhr-bow"), { y: -60, scale: 0.6, opacity: 0, duration: 0.7, ease: "back.in(1.6)" }, 0.15)
      .to(q(".mhr-rib.v"), { scaleY: 0, duration: 0.7 }, 0.4)
      .to(q(".mhr-rib.h"), { scaleX: 0, duration: 0.7 }, 0.45)
      .to(q(".mhr-lid"), { y: -150, rotate: -16, x: -40, opacity: 0, duration: 1.1, ease: "power2.inOut" }, 0.95)
      .to(q(".mhr-glow"), { opacity: 1, scale: 1.4, duration: 1, ease: "power2.out" }, 1.1)
      .to(ref.current, { "--r": "160vmax", duration: 1.6, ease: "power2.in" }, 1.7)
      .call(onOpen, [], 2.7);
  };
  return (
    <div ref={ref} className="mhr-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <div className="mhr-spot" />
      <Sunburst className="mhr-open-sun" />
      <div className="mhr-stage">
        <p className="mhr-deco mhr-open-title">{g.headline}</p>
        <div className="mhr-box">
          <div className="mhr-glow" />
          <div className="mhr-body"><i className="mhr-rib v" /><i className="mhr-rib h" /></div>
          <div className="mhr-lid"><i className="mhr-rib v" /></div>
          <GoldBow className="mhr-bow" />
          <div className="mhr-tag">{g.name}</div>
        </div>
        <p className="mhr-tap gk-tap mhr-deco">{g.w.open}</p>
      </div>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  const age = g.props.profile.age;
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      if (!g.opened) {
        gsap.set([".mhr-head", ".mhr-name", ".mhr-age", ".mhr-line", ".mhr-cake", ".mhr-c", ".mhr-frame"], { autoAlpha: 0 });
        return;
      }
      gsap.timeline({ delay: 0.1 })
        .from(".mhr-rays path", { drawSVG: "0%", duration: 1.6, stagger: { each: 0.015, from: "center" }, ease: "power2.out" })
        .from(".mhr-frame", { autoAlpha: 0, scale: 1.04, duration: 1.4 }, 0.2)
        .from(".mhr-c", { autoAlpha: 0, scale: 0.6, duration: 1, stagger: 0.08, ease: "back.out(1.6)" }, 0.6)
        .from(".mhr-head", { autoAlpha: 0, letterSpacing: "1em", duration: 1.6, ease: "power3.out" }, 0.5)
        .from(".mhr-name", { autoAlpha: 0, y: 40, scale: 0.94, filter: "blur(10px)", duration: 1.6, ease: "power3.out" }, 0.9)
        .from([".mhr-age", ".mhr-line"], { autoAlpha: 0, y: 16, duration: 1, stagger: 0.15 }, 1.6)
        .from(".mhr-cake", { autoAlpha: 0, y: 60, duration: 1.4, ease: "power3.out" }, 1.2)
        .from(".mhr-cake-lines > *", { drawSVG: "0%", duration: 1.8, stagger: 0.1 }, 1.3);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  return (
    <header ref={ref} className="mhr-hero">
      {!g.compact && <Particles mode="rise" colors={BUBBLES} count={70} size={12} speed={0.8} />}
      <div className="mhr-frame" />
      {(["tl", "tr", "br", "bl"] as const).map((c) => <DecoCorner key={c} className={`mhr-c ${c}`} />)}
      <div className="mhr-hero-in">
        <E as="p" path="texts.headline" className="mhr-deco mhr-head">{g.headline}</E>
        <E as="p" path="texts.eyebrow" className="mhr-line">{g.line}</E>
        <h1 className="mhr-name mhr-foil" style={{ ["--k" as string]: fit(g.name, 1, 7, 0.4) } as CSSProperties}><E path="profile.partner1">{g.name}</E></h1>
        {age ? <p className="mhr-age">{age} · {g.lang === "ru" ? "лет" : g.lang === "hi" ? "वर्ष" : "years"}</p> : null}
      </div>
      <div className="mhr-ground">
        <Sunburst className="mhr-sun" />
        <Cake className="mhr-cake" candles={age && age < 8 ? age : 5} />
      </div>
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div className="mhr-letter" data-rv>
      {(["tl", "tr", "br", "bl"] as const).map((c) => <DecoCorner key={c} className={`mhr-c ${c}`} />)}
      {g.heroUrl && (
        <figure className="mhr-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={g.heroUrl} alt="" data-edit-photo="hero" />
        </figure>
      )}
      <span className="gk-kicker">{g.w.letter}</span>
      <h2 className="gk-title mhr-foil" style={{ marginBottom: "0.6em" }}><E path="profile.partner1">{g.name}</E></h2>
      <E as="p" path="profile.story" multiline className="gk-msg mhr-msg">{g.message}</E>
      <Fan className="mhr-fan" style={{ marginTop: 36 }} />
      <E as="p" path="profile.blessing" className="mhr-sign mhr-foil">{g.signoff}</E>
    </div>
  );
}

const title = (k: string, t: string) => (
  <div data-rv>
    <span className="gk-kicker">{k}</span>
    <h2 className="gk-title mhr-foil">{t}</h2>
  </div>
);

const CFG: SiteCfg = {
  id: "many-happy-returns",
  cls: "mhr",
  css: CSS,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  title,
  ornament: <Fan className="mhr-fan" />,
  frame: (img: ReactNode) => <figure className="gk-photo mhr-photo">{img}</figure>,
  footer: ({ g }) => (
    <footer className="gk-foot">
      <Coupes className="mhr-coupes" />
      <E as="p" path="profile.blessing" className="mhr-sign mhr-foil">{g.signoff}</E>
      {!g.compact && <button type="button" className="gk-btn mhr-deco" style={{ marginTop: 36 }} onClick={g.replay}>{g.w.again}</button>}
      {g.props.credit && <div className="gk-credit">{g.props.credit}</div>}
    </footer>
  ),
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
