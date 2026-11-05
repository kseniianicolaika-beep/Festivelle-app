"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { fit, pick } from "../_shared/kit";
import { Doves, Olive } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

if (typeof window !== "undefined") gsap.registerPlugin(DrawSVGPlugin);

const lede = (s: string) => (s.match(/^[^.!?।]+[.!?।]/)?.[0] ?? s).trim();

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.timeline({ defaults: { ease: "power3.inOut" } })
      .to(q(".gk-tap"), { opacity: 0, duration: 0.3 })
      .to(q(".wg-belly"), { xPercent: 130, rotate: 6, duration: 0.9 }, 0.1)
      .to(q(".wg-vellum"), { yPercent: -125, duration: 1.1 }, 0.6)
      .fromTo(q(".wg-cardp .wg-t"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power2.inOut" }, 1.2)
      .to(q(".wg-envwrap"), { scale: 1.12, opacity: 0, duration: 0.9, ease: "power2.in" }, 2.3)
      .call(onOpen, [], 2.6);
  };
  return (
    <div ref={ref} className="wg-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <div className="wg-envwrap">
        <div className="wg-cardp">
          <Doves className="wg-dv" sw={2.2} />
          <p className="wg-t wg-press">{g.headline}</p>
        </div>
        <div className="wg-vellum" />
        <div className="wg-belly"><span>{g.name}</span></div>
      </div>
      <p className="gk-tap">{g.w.open}</p>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = [".wg-big", ".wg-to", ".wg-mast", ".wg-foot", ".wg-doves"];
      if (!g.opened) {
        gsap.set(els, { autoAlpha: 0 });
        return;
      }
      gsap.timeline({ delay: 0.15 })
        .from(".wg-mast", { autoAlpha: 0, y: -10, duration: 0.8 })
        .fromTo(".wg-big", { autoAlpha: 1, clipPath: "inset(0 100% -10% 0)" }, { clipPath: "inset(0 0% -10% 0)", duration: 1.8, ease: "power3.inOut" }, 0.2)
        .from(".wg-doves .wg-draw > *", { drawSVG: "0%", duration: 2.4, stagger: 0.04, ease: "power2.inOut" }, 0.6)
        .from(".wg-to", { autoAlpha: 0, y: 18, duration: 1 }, 1.4)
        .from(".wg-foot", { autoAlpha: 0, duration: 1 }, 1.8);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  return (
    <header ref={ref} className="wg-hero">
      <div className="wg-mast wg-caps">
        <span>Nº 01</span>
        <span>{pick({ en: "With gratitude", ru: "С благодарностью", hi: "आभार सहित" }, g.lang)}</span>
      </div>
      <div className="wg-mid">
        <Doves className="wg-doves" />
        <E as="h1" path="texts.headline" className="wg-big wg-press" style={{ ["--k" as string]: fit(g.headline, 1, 9, 0.42) } as CSSProperties}>{g.headline}</E>
        <div className="wg-to">
          <span className="wg-caps" style={{ color: "var(--g-muted)" }}>{pick({ en: "for", ru: "для", hi: "के लिए" }, g.lang)}</span>
          <p className="wg-name" style={{ ["--k" as string]: fit(g.name, 1, 14, 0.55) } as CSSProperties}><E path="profile.partner1">{g.name}</E></p>
        </div>
      </div>
      <div className="wg-foot">
        <E as="p" path="profile.inviteLine" className="wg-caps" style={{ maxWidth: 420, lineHeight: 1.8, letterSpacing: ".18em" }}>{g.wish}</E>
        {!g.compact && <span className="wg-caps">{g.w.scroll} ↓</span>}
      </div>
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div className="wg-letter">
      <div data-rv>
        <span className="gk-kicker" style={{ textAlign: "left" }}>{g.w.letter}</span>
        <p className="wg-lede" style={{ marginTop: 18 }}>“{lede(g.message)}”</p>
        {g.heroUrl && (
          <figure className="wg-photo" style={{ margin: "32px 0 0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.heroUrl} alt="" data-edit-photo="hero" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
            <figcaption className="wg-caps" style={{ marginTop: 10, color: "var(--g-muted)" }}>{g.name}</figcaption>
          </figure>
        )}
      </div>
      <div className="wg-col" data-rv data-rv-delay="0.15">
        <E as="p" path="profile.story" multiline className="gk-msg wg-msg">{g.message}</E>
        <E as="p" path="profile.blessing" className="wg-sign">{g.signoff}</E>
        <Olive className="wg-rule" style={{ margin: "30px 0 0" }} />
      </div>
    </div>
  );
}

const CFG: SiteCfg = {
  id: "with-gratitude",
  cls: "wg",
  css: CSS,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  ornament: <Olive className="wg-rule" />,
  frame: (img: ReactNode) => <figure className="gk-photo wg-photo">{img}</figure>,
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
