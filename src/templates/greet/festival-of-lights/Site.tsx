"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { Particles } from "../_shared/Particles";
import { fit, pick } from "../_shared/kit";
import { Diya, Jharokha, LotusRule, Rangoli, Toran } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

if (typeof window !== "undefined") gsap.registerPlugin(DrawSVGPlugin);

const EMBERS = ["#FFC766", "#FF9A3A", "#FFE7A0", "#F05A92"];
const RING = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
  return { left: `${50 + Math.cos(a) * 46}%`, top: `${50 + Math.sin(a) * 46}%` };
});

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .to(q(".gk-tap"), { opacity: 0, duration: 0.3 })
      .to(q(".fl-open-center .fl-flame, .fl-open-center .fl-glow"), { opacity: 1, duration: 0.5 }, 0.1)
      .fromTo(q(".fl-rl > *"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.03, ease: "power2.inOut" }, 0.3)
      .fromTo(q(".fl-rc"), { opacity: 1, clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1.5, ease: "power2.inOut" }, 0.9)
      .to(q(".fl-od .fl-flame, .fl-od .fl-glow"), { opacity: 1, duration: 0.35, stagger: 0.12 }, 1.4)
      .to(q(".fl-open-stage"), { scale: 1.5, opacity: 0, duration: 1.2, ease: "power2.in" }, 2.8)
      .call(onOpen, [], 3.3);
  };
  return (
    <div ref={ref} className="fl-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <div className="fl-open-stage">
        <p className="fl-open-deva fl-deva fl-gold">शुभ दीपावली</p>
        <div className="fl-ring">
          <Rangoli className="fl-rangoli" />
          {RING.map((p, i) => <Diya key={i} className="fl-od" style={p} seed={i + 2} />)}
          <Diya className="fl-open-center" seed={1} />
        </div>
        <p className="gk-tap">{pick({ en: "Tap to light the diya", ru: "Нажмите, чтобы зажечь дию", hi: "दीया जलाने के लिए छुएँ" }, g.lang)}</p>
      </div>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = [".fl-orn", ".fl-head", ".fl-line", ".fl-name", ".fl-toran", ".fl-diyas > *", ".fl-ground .fl-rangoli"];
      if (!g.opened) {
        gsap.set(els, { autoAlpha: 0 });
        return;
      }
      gsap.timeline({ delay: 0.1 })
        .from(".fl-ground .fl-rangoli", { autoAlpha: 0, scale: 0.6, rotate: -40, duration: 2, ease: "power3.out" })
        .from(".fl-arch", { drawSVG: "50% 50%", duration: 2.2, ease: "power2.inOut" }, 0)
        .from(".fl-toran", { autoAlpha: 0, y: -60, duration: 1.4, ease: "back.out(1.2)" }, 0.4)
        .from(".fl-diyas > *", { autoAlpha: 0, y: 20, duration: 0.6, stagger: { each: 0.12, from: "center" } }, 0.6)
        .from(".fl-orn", { autoAlpha: 0, y: 10, duration: 1 }, 1)
        .from(".fl-head", { autoAlpha: 0, scale: 0.9, filter: "blur(12px)", duration: 1.5, ease: "power3.out" }, 1.2)
        .from([".fl-line", ".fl-name"], { autoAlpha: 0, y: 18, duration: 1.1, stagger: 0.2 }, 1.8);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  return (
    <header ref={ref} className="fl-hero">
      {!g.compact && <Particles mode="rise" colors={EMBERS} count={60} size={9} speed={0.7} />}
      <Toran className="fl-toran" swags={4} />
      <div className="fl-archbox"><Jharokha /></div>
      <div className="fl-hero-in">
        {g.lang !== "hi" && <p className="fl-orn fl-deva">शुभ दीपावली</p>}
        <E as="h1" path="texts.headline" className="fl-head fl-gold" style={{ ["--k" as string]: fit(g.headline, 1, 12, 0.55) } as CSSProperties}>{g.headline}</E>
        <E as="p" path="texts.eyebrow" className="fl-line">{g.line}</E>
        <p className="fl-name" style={{ ["--k" as string]: fit(g.name, 1, 12, 0.55) } as CSSProperties}><E path="profile.partner1">{g.name}</E></p>
      </div>
      <div className="fl-ground">
        <Rangoli className="fl-rangoli" />
        <div className="fl-diyas">{Array.from({ length: 7 }, (_, i) => <Diya key={i} seed={i + 3} />)}</div>
      </div>
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div className="fl-letter" data-rv>
      <Diya className="fl-diya-top" seed={11} />
      {g.heroUrl && (
        <figure className="fl-photo" style={{ width: "min(240px,60%)", margin: "0 auto 30px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={g.heroUrl} alt="" data-edit-photo="hero" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }} />
        </figure>
      )}
      <span className="gk-kicker">{g.w.letter}</span>
      <h2 className="gk-title" style={{ marginBottom: ".5em" }}><E path="profile.partner1">{g.name}</E></h2>
      <E as="p" path="profile.story" multiline className="gk-msg fl-msg">{g.message}</E>
      <LotusRule className="fl-rule" style={{ marginTop: 30 }} />
      <E as="p" path="profile.blessing" className="fl-sign">{g.signoff}</E>
    </div>
  );
}

function Footer({ g }: { g: G }) {
  const [lit, setLit] = useState<boolean[]>([true, false, false, false, false]);
  const n = lit.filter(Boolean).length;
  return (
    <footer className="gk-foot">
      <span className="gk-kicker">{pick({ en: "Light a diya for them", ru: "Зажгите дию для них", hi: "उनके लिए एक दीया जलाएँ" }, g.lang)}</span>
      <div className="fl-light">
        {lit.map((on, i) => (
          <button key={i} type="button" aria-pressed={on} aria-label="diya" onClick={() => setLit((l) => l.map((x, j) => (j === i ? !x : x)))}>
            <Diya lit={on} seed={20 + i} />
          </button>
        ))}
      </div>
      <p className="fl-light-n">{n} / 5</p>
      <E as="p" path="profile.blessing" className="fl-sign" >{g.signoff}</E>
      {!g.compact && <button type="button" className="gk-btn" style={{ marginTop: 32 }} onClick={g.replay}>{g.w.again}</button>}
      {g.props.credit && <div className="gk-credit">{g.props.credit}</div>}
    </footer>
  );
}

const CFG: SiteCfg = {
  id: "festival-of-lights",
  cls: "fl",
  css: CSS + `.fl-letter{border:1px solid rgba(230,181,86,.55);border-radius:50% 50% 6px 6px / 190px 190px 6px 6px;box-shadow:0 0 0 8px #1C0D28,0 0 0 9px rgba(230,181,86,.22),0 40px 80px -30px rgba(0,0,0,.6)}`,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  footer: Footer,
  ornament: <LotusRule className="fl-rule" />,
  frame: (img: ReactNode) => <figure className="gk-photo fl-photo">{img}</figure>,
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
