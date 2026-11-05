"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { Particles } from "../_shared/Particles";
import { fit, pick } from "../_shared/kit";
import { GiltCorner, RoseRule, StillLife } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const DUST = ["#FFE7B8", "#FFF4DA"];

/** The gilded frame with its picture light; `photo` edit slot = hero. */
export function Framed({ src, className, style, light = true }: { src: string | null; className?: string; style?: CSSProperties; light?: boolean }) {
  return (
    <div className={className} style={style}>
      <span className="mp-cord" />
      {light && <><span className="mp-light" /><span className="mp-cone" /></>}
      <div className="mp-frame">
        {(["tl", "tr", "bl", "br"] as const).map((c) => <GiltCorner key={c} className={`mp-gc ${c}`} />)}
        <div className="mp-mat">
          <div className="mp-pic">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {src ? <img src={src} alt="" data-edit-photo="hero" /> : <StillLife />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.set(q(".mp-cone"), { opacity: 0 });
    gsap.timeline()
      .to(q(".gk-tap, .mp-open-t"), { opacity: 0, duration: 0.4 })
      .to(q(".mp-drape"), { scaleY: 0.92, y: -10, duration: 0.35, ease: "power2.out" }, 0.1)
      .to(q(".mp-drape"), { yPercent: -130, scaleY: 0.5, duration: 1.3, ease: "power3.in" }, 0.45)
      .to(q(".mp-cone"), { opacity: 1, duration: 0.25, repeat: 2, yoyo: true, ease: "steps(1)" }, 1.5)
      .to(q(".mp-cone"), { opacity: 1, duration: 0.3 }, 2.2)
      .to(q(".mp-open-fr"), { scale: 1.12, opacity: 0, duration: 1.1, ease: "power2.in" }, 2.7)
      .call(onOpen, [], 3);
  };
  return (
    <div ref={ref} className="mp-open mp-wall" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <div className="mp-open-in">
        <p className="mp-open-t">{pick({ en: "Unveiled, just for you", ru: "Только для тебя", hi: "सिर्फ़ आपके लिए" }, g.lang)}</p>
        <div className="mp-open-fr">
          <Framed src={g.heroUrl} />
          <div className="mp-drape" />
        </div>
        <p className="gk-tap">{pick({ en: "Tap to lift the veil", ru: "Нажмите, чтобы снять покрывало", hi: "पर्दा हटाने के लिए छुएँ" }, g.lang)}</p>
      </div>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = [".mp-hero-fr", ".mp-head", ".mp-line", ".mp-name", ".mp-plaque"];
      if (!g.opened) {
        gsap.set(els, { autoAlpha: 0 });
        return;
      }
      gsap.timeline({ delay: 0.2 })
        .from(".mp-hero-fr", { autoAlpha: 0, scale: 0.94, y: 30, duration: 1.8, ease: "power3.out" })
        .from(".mp-head", { autoAlpha: 0, y: 26, filter: "blur(8px)", duration: 1.4, ease: "power3.out" }, 0.6)
        .from([".mp-line", ".mp-name"], { autoAlpha: 0, y: 16, duration: 1, stagger: 0.18 }, 1.1)
        .from(".mp-plaque", { autoAlpha: 0, y: 10, duration: 0.9 }, 1.5);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  return (
    <header ref={ref} className="mp-hero mp-wall">
      {!g.compact && <Particles mode="float" colors={DUST} count={40} size={6} speed={0.4} style={{ opacity: 0.6 }} />}
      <Framed src={g.heroUrl} className="mp-hero-fr" />
      <div className="mp-hero-txt">
        <E as="h1" path="texts.headline" className="mp-head" style={{ ["--k" as string]: fit(g.headline, 1, 16, 0.6) } as CSSProperties}>{g.headline}</E>
        <E as="p" path="texts.eyebrow" className="mp-line">{g.line}</E>
        <p className="mp-name" style={{ ["--k" as string]: fit(g.name, 1, 10, 0.55) } as CSSProperties}><E path="profile.partner1">{g.name}</E></p>
        <div className="mp-plaque" style={{ marginTop: 28 }}>
          <span className="mp-plq-name">{g.name}</span>
          <span className="mp-plq-sub">{pick({ en: "a portrait, framed with love", ru: "портрет, обрамлённый любовью", hi: "प्यार से सजाई एक तस्वीर" }, g.lang)}</span>
        </div>
      </div>
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div className="mp-letter" data-rv>
      <span className="gk-kicker">{g.w.letter}</span>
      <h2 className="gk-title" style={{ marginBottom: ".5em" }}><E path="profile.partner1">{g.name}</E></h2>
      <E as="p" path="profile.story" multiline className="gk-msg mp-msg">{g.message}</E>
      <RoseRule className="mp-rule" style={{ marginTop: 26 }} />
      <E as="p" path="profile.blessing" className="mp-sign">{g.signoff}</E>
    </div>
  );
}

const CFG: SiteCfg = {
  id: "memory-portrait",
  cls: "mp",
  css: CSS,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  ornament: <RoseRule className="mp-rule" />,
  frame: (img: ReactNode) => <figure className="gk-photo mp-photo">{img}</figure>,
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
