"use client";
import { useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { Particles } from "../_shared/Particles";
import { fit, pick } from "../_shared/kit";
import { Baubles, ClockFace, Flake, Mandarin, Yolka } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const SNOW = ["#FFFFFF", "#E7EEFF", "#F6E7B8"];
export const nyYear = () => {
  const d = new Date();
  return d.getMonth() >= 8 ? d.getFullYear() + 1 : d.getFullYear();
};
const noop = () => () => {};
function Year() {
  const y = useSyncExternalStore(noop, nyYear, () => null);
  return y ? <span className="ny-year">{y}</span> : null;
}
export const FLAKES = [
  { l: "6%", t: "14%", w: 60, s: 1 }, { l: "40%", t: "8%", w: 34, s: 2 }, { l: "88%", t: "10%", w: 48, s: 3 },
  { l: "14%", t: "72%", w: 40, s: 4 }, { l: "56%", t: "40%", w: 26, s: 5 }, { l: "92%", t: "62%", w: 36, s: 6 },
];

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  useIso(() => {
    gsap.set(ref.current!.querySelector(".ny-hh"), { rotate: -1, svgOrigin: "0 0" });
    gsap.set(ref.current!.querySelector(".ny-mh"), { rotate: -12, svgOrigin: "0 0" });
  }, []);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.timeline()
      .to(q(".gk-tap"), { opacity: 0, duration: 0.3 })
      .to(q(".ny-mh"), { rotate: 0, svgOrigin: "0 0", duration: 1.4, ease: "power2.inOut" }, 0.1)
      .to(q(".ny-hh"), { rotate: 0, svgOrigin: "0 0", duration: 1.4, ease: "power2.inOut" }, 0.1)
      .fromTo(q(".ny-ring"), { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.9, duration: 1.1, stagger: 0.16, ease: "power2.out" }, 1.5)
      .to(q(".ny-clockbox"), { scale: 1.03, duration: 0.08, yoyo: true, repeat: 11, ease: "none" }, 1.5)
      .to(q(".ny-flash"), { opacity: 1, scale: 2.4, duration: 0.6, ease: "power2.out" }, 3.2)
      .to(q(".ny-open-in"), { scale: 1.4, opacity: 0, duration: 0.9, ease: "power2.in" }, 3.2)
      .call(onOpen, [], 3.5);
  };
  return (
    <div ref={ref} className="ny-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      {FLAKES.map((f) => <Flake key={f.s} seed={f.s} className="ny-flake" style={{ left: f.l, top: f.t, width: f.w }} />)}
      <div className="ny-open-in">
        <p className="ny-open-t ny-gold">{pick({ en: "Midnight is near…", ru: "Скоро полночь…", hi: "आधी रात होने को है…" }, g.lang)}</p>
        <div className="ny-clockbox">
          <ClockFace className="ny-clock" />
          {Array.from({ length: 12 }, (_, i) => <i key={i} className="ny-ring" />)}
        </div>
        <p className="gk-tap">{pick({ en: "Tap to strike twelve", ru: "Нажмите — пусть пробьют куранты", hi: "बारह बजाने के लिए छुएँ" }, g.lang)}</p>
      </div>
      <div className="ny-flash" />
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = [".ny-orn", ".ny-head", ".ny-line", ".ny-name", ".ny-tree", ".ny-mand", ".ny-year"];
      if (!g.opened) {
        gsap.set(els, { autoAlpha: 0 });
        return;
      }
      gsap.timeline({ delay: 0.1 })
        .from(".ny-year", { autoAlpha: 0, scale: 1.2, duration: 2.4, ease: "power3.out" })
        .from(".ny-tree", { autoAlpha: 0, y: 80, duration: 1.8, ease: "power3.out" }, 0.2)
        .from(".ny-mand", { autoAlpha: 0, y: 30, rotate: -40, duration: 0.9, stagger: 0.12, ease: "back.out(2)" }, 1)
        .from(".ny-orn", { autoAlpha: 0, y: 12, duration: 1 }, 0.6)
        .from(".ny-head", { autoAlpha: 0, y: 30, filter: "blur(10px)", duration: 1.5, ease: "power3.out" }, 0.8)
        .from([".ny-line", ".ny-name"], { autoAlpha: 0, y: 16, duration: 1, stagger: 0.18 }, 1.4);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  return (
    <header ref={ref} className="ny-hero">
      {!g.compact && <Particles mode="fall" colors={SNOW} count={120} size={9} speed={0.55} />}
      {FLAKES.map((f) => <Flake key={f.s} seed={f.s} className="ny-flake" style={{ left: f.l, top: f.t, width: f.w * 1.3, animationDuration: `${30 + f.s * 6}s` }} />)}
      <Year />
      <div className="ny-txt">
        {g.lang !== "ru" && <p className="ny-orn" lang="ru">С Новым годом!</p>}
        <E as="h1" path="texts.headline" className="ny-head ny-gold" style={{ ["--k" as string]: fit(g.headline, 1, 13, 0.55) } as CSSProperties}>{g.headline}</E>
        <E as="p" path="texts.eyebrow" className="ny-line">{g.line}</E>
        <p className="ny-name" style={{ ["--k" as string]: fit(g.name, 1, 11, 0.55) } as CSSProperties}><E path="profile.partner1">{g.name}</E></p>
      </div>
      <div className="ny-treebox">
        <Yolka className="ny-tree" />
        <Mandarin className="ny-mand" style={{ left: "8%" }} rot={-10} />
        <Mandarin className="ny-mand" style={{ left: "18%", bottom: "-1%" }} rot={20} leaf={false} />
        <Mandarin className="ny-mand" style={{ right: "10%" }} rot={8} />
      </div>
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div style={{ position: "relative" }}>
      {g.heroUrl && (
        <figure className="ny-photo" data-rv="scale" style={{ width: "min(240px,60%)", margin: "0 auto 36px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={g.heroUrl} alt="" data-edit-photo="hero" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />
        </figure>
      )}
      <div className="ny-letter" data-rv>
        <Flake seed={9} color="#7C8DB8" sw={1.2} className="" style={{ width: 54, display: "block", margin: "0 auto 10px" }} />
        <span className="gk-kicker">{g.w.letter}</span>
        <h2 className="gk-title" style={{ marginBottom: ".5em" }}><E path="profile.partner1">{g.name}</E></h2>
        <E as="p" path="profile.story" multiline className="gk-msg ny-msg">{g.message}</E>
        <E as="p" path="profile.blessing" className="ny-sign">{g.signoff}</E>
      </div>
    </div>
  );
}

const CFG: SiteCfg = {
  id: "s-novym-godom",
  cls: "ny",
  css: CSS,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  ornament: <Baubles className="ny-rule" />,
  frame: (img: ReactNode) => <figure className="gk-photo ny-photo">{img}</figure>,
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
