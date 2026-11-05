"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { fit, pick } from "../_shared/kit";
import { BABY, Cloud, Mobile, Rattle, SleepyMoon, Stitch, softStar } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

export const SKY_STARS = [
  { l: "12%", t: "22%", s: 18, c: BABY.butter }, { l: "24%", t: "48%", s: 12, c: BABY.blush }, { l: "80%", t: "40%", s: 16, c: BABY.butter },
  { l: "70%", t: "62%", s: 10, c: BABY.mint }, { l: "8%", t: "60%", s: 10, c: BABY.butter }, { l: "90%", t: "20%", s: 12, c: BABY.blush },
];
const Star = ({ s, c, className, style }: { s: number; c: string; className?: string; style?: CSSProperties }) => (
  <svg viewBox="-20 -20 40 40" width={s * 2} height={s * 2} className={className} style={style} aria-hidden><path d={softStar(18)} fill={c} /></svg>
);

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.timeline()
      .to(q(".wl-open-mid"), { opacity: 0, y: -20, duration: 0.5 })
      .to(q(".wl-open-mobile"), { rotate: 8, duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut", transformOrigin: "50% 0" }, 0)
      .to(q(".wl-oc.l"), { xPercent: -110, duration: 1.6, ease: "power3.inOut", stagger: 0.08 }, 0.4)
      .to(q(".wl-oc.r"), { xPercent: 110, duration: 1.6, ease: "power3.inOut", stagger: 0.08 }, 0.4)
      .to(q(".wl-open-mobile"), { y: "-60vh", duration: 1.1, ease: "power2.in" }, 1)
      .call(onOpen, [], 1.4);
  };
  return (
    <div ref={ref} className="wl-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <Cloud className="wl-oc l" style={{ left: "-18%", top: "8%" }} />
      <Cloud className="wl-oc r" style={{ right: "-22%", top: "26%" }} />
      <Cloud className="wl-oc l" style={{ left: "-24%", top: "48%" }} tint="#FFF8F8" />
      <Cloud className="wl-oc r" style={{ right: "-16%", top: "62%" }} />
      <Cloud className="wl-oc l" style={{ left: "-8%", bottom: "-6%" }} tint="#FFF9EC" />
      <Cloud className="wl-oc r" style={{ right: "-10%", bottom: "-10%" }} />
      <Mobile className="wl-open-mobile" />
      <div className="wl-open-mid">
        <p className="wl-open-t">{pick({ en: "A little someone has arrived…", ru: "Кто-то маленький появился на свет…", hi: "एक नन्हा मेहमान आया है…" }, g.lang)}</p>
        <p className="gk-tap">{g.w.open}</p>
      </div>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  const [bursts, setBursts] = useState<number[]>([]);
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = [".wl-line", ".wl-name", ".wl-head", ".wl-mobile", ".wl-rattle", ".wl-clouds svg"];
      if (!g.opened) {
        gsap.set(els, { autoAlpha: 0 });
        return;
      }
      gsap.timeline({ delay: 0.1 })
        .from(".wl-clouds svg", { autoAlpha: 0, y: 60, duration: 1.4, stagger: 0.1, ease: "power3.out" })
        .from(".wl-mobile", { autoAlpha: 0, y: -200, duration: 1.6, ease: "elastic.out(1,.55)" }, 0.2)
        .from(".wl-line", { autoAlpha: 0, y: 10, duration: 0.8 }, 0.7)
        .from(".wl-name", { autoAlpha: 0, scale: 0.6, duration: 1.1, ease: "back.out(2)" }, 0.9)
        .from(".wl-head", { autoAlpha: 0, y: 14, duration: 0.9 }, 1.3)
        .from(".wl-rattle", { autoAlpha: 0, rotate: -80, duration: 1, ease: "back.out(2)" }, 1.5);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  const shake = () => {
    const el = ref.current?.querySelector(".wl-rattle");
    if (el && !g.reduced) gsap.fromTo(el, { rotate: -30 }, { rotate: -18, duration: 0.6, ease: "elastic.out(3,.2)" });
    const id = Date.now();
    setBursts((b) => [...b.slice(-3), id]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1400);
  };
  return (
    <header ref={ref} className="wl-hero">
      {SKY_STARS.map((s, i) => <Star key={i} s={s.s} c={s.c} className="wl-star wl-tw" style={{ left: s.l, top: s.t, animationDelay: `${i * 0.5}s` }} />)}
      <SleepyMoon className="wl-moon wl-drift" />
      <Mobile className="wl-mobile" />
      <div className="wl-hero-in">
        <E as="p" path="texts.eyebrow" className="wl-line">{g.line}</E>
        <h1 className="wl-name" style={{ ["--k" as string]: fit(g.name, 1, 9, 0.5) } as CSSProperties}><E path="profile.partner1">{g.name}</E></h1>
        <E as="p" path="texts.headline" className="wl-head" style={{ ["--k" as string]: fit(g.headline, 1, 20, 0.6) } as CSSProperties}>{g.headline}</E>
      </div>
      <div className="wl-clouds">
        <Cloud style={{ left: "-6%", width: "46%" }} />
        <Cloud style={{ left: "30%", width: "44%", bottom: "-12%" }} tint="#FFF7F5" />
        <Cloud style={{ right: "-8%", width: "48%" }} />
      </div>
      {!g.compact && (
        <button type="button" className="wl-rattle" onClick={shake} aria-label="rattle">
          <Rattle />
          {bursts.map((id) => (
            <span key={id} className="wl-burst" style={{ left: "50%", top: "20%" }}>
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <Star key={k} s={9} c={[BABY.butter, BABY.blush, BABY.mint][k % 3]} style={{ position: "absolute", animation: `wl-pop${k} 1.3s ease-out forwards` }} />
              ))}
            </span>
          ))}
        </button>
      )}
    </header>
  );
}

const POP = Array.from({ length: 6 }, (_, k) => {
  const a = (k / 6) * Math.PI * 2 - Math.PI / 2;
  return `@keyframes wl-pop${k}{from{transform:translate(-50%,-50%) scale(.3);opacity:1}to{transform:translate(${Math.round(Math.cos(a) * 90)}px,${Math.round(Math.sin(a) * 90)}px) scale(1.1) rotate(120deg);opacity:0}}`;
}).join("");

function Letter({ g }: { g: G }) {
  return (
    <div style={{ position: "relative", paddingTop: 70 }}>
      <div className="wl-letter" data-rv>
        <Cloud className="wl-letter-cloud" />
        {g.heroUrl && (
          <figure className="wl-photo" style={{ width: "min(240px,62%)", margin: "0 auto 30px", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.heroUrl} alt="" data-edit-photo="hero" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
          </figure>
        )}
        <span className="gk-kicker">{g.w.letter}</span>
        <h2 className="gk-title" style={{ marginBottom: ".5em" }}><E path="profile.partner1">{g.name}</E></h2>
        <E as="p" path="profile.story" multiline className="gk-msg wl-msg">{g.message}</E>
        <Stitch className="wl-rule" style={{ marginTop: 26 }} />
        <E as="p" path="profile.blessing" className="wl-sign">{g.signoff}</E>
      </div>
    </div>
  );
}

const CFG: SiteCfg = {
  id: "welcome-little-one",
  cls: "wl",
  css: CSS + POP,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  ornament: <Stitch className="wl-rule" />,
  frame: (img: ReactNode) => <figure className="gk-photo wl-photo">{img}</figure>,
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
