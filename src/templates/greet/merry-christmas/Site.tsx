"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { Particles } from "../_shared/Particles";
import { fit, pick } from "../_shared/kit";
import { Candle, Frost, Holly, Wreath } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const SNOW = ["#FFFFFF", "#EAF3FF", "#DDE9F2"];

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.timeline()
      .to(q(".mc-write"), { opacity: 0, scale: 1.04, duration: 0.6 })
      .to(q(".mc-frost"), { "--r": "130vmax", duration: 2.2, ease: "power2.in" }, 0.2)
      .to(q(".mc-mull"), { scale: 1.25, opacity: 0, duration: 1.6, ease: "power2.in" }, 1.2)
      .call(onOpen, [], 2);
  };
  return (
    <div ref={ref} className="mc-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <div className="mc-frost">
        <Frost className="mc-fern a" seed={3} />
        <Frost className="mc-fern b" seed={7} />
        <Frost className="mc-fern c" seed={11} />
        <Frost className="mc-fern d" seed={13} />
      </div>
      <div className="mc-mull"><i className="v" /><i className="h" /><i className="f" /><div className="mc-ledge" /></div>
      <div className="mc-write">
        <p className="w1">{g.headline}</p>
        <p className="gk-tap">{pick({ en: "Tap to clear the frost", ru: "Нажмите, чтобы растопить иней", hi: "पाला हटाने के लिए छुएँ" }, g.lang)}</p>
      </div>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    if (g.compact || g.reduced || !g.opened || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.6 })
        .from(".mc-wreath", { rotate: -10, scale: 0.94, duration: 3, ease: "power3.out" })
        .from(".mc-wr-in > *", { autoAlpha: 0, y: 18, filter: "blur(6px)", duration: 1.3, stagger: 0.2, ease: "power3.out" }, 0.4);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  return (
    <header ref={ref} className="mc-hero">
      {!g.compact && <Particles mode="fall" colors={SNOW} count={110} size={10} speed={0.6} />}
      <div className="mc-wr">
        <Wreath className="mc-wreath" />
        <div className="mc-wr-in">
          <E as="p" path="texts.eyebrow" className="mc-line">{g.line}</E>
          <E as="h1" path="texts.headline" className="mc-head" style={{ ["--k" as string]: fit(g.headline, 1, 15, 0.6) } as CSSProperties}>{g.headline}</E>
          <p className="mc-name" style={{ ["--k" as string]: fit(g.name, 1, 11, 0.55) } as CSSProperties}><E path="profile.partner1">{g.name}</E></p>
        </div>
      </div>
      <div className="mc-candles">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}><Candle h={1.4} seed={0} /><Candle h={0.9} seed={1} /></div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}><Candle h={0.8} seed={2} /><Candle h={1.25} seed={3} /></div>
      </div>
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div style={{ position: "relative" }}>
      {g.heroUrl && (
        <figure className="mc-photo" data-rv="scale" style={{ width: "min(260px,64%)", margin: "0 auto -30px", rotate: "-3deg", position: "relative", zIndex: 2 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={g.heroUrl} alt="" data-edit-photo="hero" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />
        </figure>
      )}
      <div className="mc-letter" data-rv>
        <Holly className="mc-rule" style={{ marginBottom: 18 }} />
        <span className="gk-kicker">{g.w.letter}</span>
        <h2 className="gk-title" style={{ marginBottom: ".5em" }}><E path="profile.partner1">{g.name}</E></h2>
        <E as="p" path="profile.story" multiline className="gk-msg mc-msg">{g.message}</E>
        <E as="p" path="profile.blessing" className="mc-sign">{g.signoff}</E>
      </div>
    </div>
  );
}

const CFG: SiteCfg = {
  id: "merry-christmas",
  cls: "mc",
  css: CSS,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  ornament: <Holly className="mc-rule" />,
  frame: (img: ReactNode, i: number) => <figure className="gk-photo mc-photo" style={{ rotate: `${[-2, 1.6, -1][i % 3]}deg` }}>{img}</figure>,
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
