"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { fit } from "../_shared/kit";
import { Crescent, DoorLeaf, Lantern, Skyline, StarRule, Stars, pointed } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

export const LANTERNS = [
  { x: 7, len: 18, glass: "#FFB547", d: 0 },
  { x: 17, len: 34, glass: "#F2685A", d: 1 },
  { x: 27, len: 10, glass: "#5FD3B8", d: 2 },
  { x: 63, len: 26, glass: "#FFB547", d: 3 },
  { x: 94, len: 30, glass: "#F2685A", d: 4 },
];

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.timeline()
      .to(q(".em-open-mid, .em-medal"), { opacity: 0, scale: 1.08, duration: 0.6, ease: "power2.in" })
      .to(q(".em-leaf.l"), { rotateY: 108, duration: 2, ease: "power2.inOut" }, 0.35)
      .to(q(".em-leaf.r"), { rotateY: -108, duration: 2, ease: "power2.inOut" }, 0.35)
      .call(onOpen, [], 0.9);
  };
  return (
    <div ref={ref} className="em-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <div className="em-leaf l"><DoorLeaf side="l" /></div>
      <div className="em-leaf r"><DoorLeaf side="r" /></div>
      <div className="em-medal" />
      <div className="em-open-mid">
        <p className="em-ar em-gold em-open-ar" lang="ar">عيد مبارك</p>
        <p className="em-open-to">{g.name}</p>
        <p className="gk-tap">{g.w.open}</p>
      </div>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = [".em-ar-h", ".em-head", ".em-line", ".em-name", ".em-moon", ".em-lan", ".em-sky"];
      if (!g.opened) {
        gsap.set(els, { autoAlpha: 0 });
        return;
      }
      gsap.timeline({ delay: 0.2 })
        .from(".em-moon", { autoAlpha: 0, y: 60, rotate: -20, duration: 2.4, ease: "power3.out" })
        .from(".em-sky", { autoAlpha: 0, y: 80, duration: 1.8, ease: "power3.out" }, 0.2)
        .from(".em-lan", { autoAlpha: 0, yPercent: -100, duration: 1.6, stagger: 0.12, ease: "elastic.out(1,.6)" }, 0.5)
        .from(".em-ar-h", { autoAlpha: 0, scale: 0.86, filter: "blur(14px)", duration: 1.8, ease: "power3.out" }, 0.9)
        .from(".em-head", { autoAlpha: 0, letterSpacing: "0.9em", duration: 1.6, ease: "power3.out" }, 1.4)
        .from([".em-line", ".em-name"], { autoAlpha: 0, y: 18, duration: 1.1, stagger: 0.2 }, 1.9);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  return (
    <header ref={ref} className="em-hero">
      <Stars />
      <Crescent className="em-moon" />
      <div className="em-lanterns">
        {LANTERNS.map((l) => (
          <div key={l.x} className="em-lan" style={{ left: `${l.x}%` }}>
            <div className="em-sway" style={{ animationDelay: `${-l.d * 1.1}s`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <i style={{ height: `${l.len}cqi` }} />
              <Lantern glass={l.glass} seed={l.d} />
            </div>
          </div>
        ))}
      </div>
      <div className="em-sky"><Skyline /></div>
      <div className="em-hero-in">
        <p className="em-ar em-gold em-ar-h" lang="ar">عيد مبارك</p>
        <E as="h1" path="texts.headline" className="em-head" style={{ ["--k" as string]: fit(g.headline, 1, 14, 0.6) } as CSSProperties}>{g.headline}</E>
        <E as="p" path="texts.eyebrow" className="em-line">{g.line}</E>
        <p className="em-name" style={{ ["--k" as string]: fit(g.name, 1, 11, 0.55) } as CSSProperties}><E path="profile.partner1">{g.name}</E></p>
      </div>
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div className="em-letter" data-rv style={{ isolation: "isolate" }}>
      <svg className="em-arch" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
        <path d={pointed(100, 140, 0.24)} fill="#0F332D" stroke="#D4AF37" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path d={pointed(92, 134, 0.24)} transform="translate(4 4)" fill="none" stroke="#D4AF37" strokeOpacity=".35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      {g.heroUrl && (
        <figure className="em-photo" style={{ width: "min(220px,58%)", margin: "0 auto 30px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={g.heroUrl} alt="" data-edit-photo="hero" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }} />
        </figure>
      )}
      <span className="gk-kicker">{g.w.letter}</span>
      <h2 className="gk-title" style={{ marginBottom: ".5em" }}><E path="profile.partner1">{g.name}</E></h2>
      <E as="p" path="profile.story" multiline className="gk-msg em-msg">{g.message}</E>
      <StarRule className="em-rule" style={{ marginTop: 30 }} />
      <E as="p" path="profile.blessing" className="em-sign">{g.signoff}</E>
    </div>
  );
}

const CFG: SiteCfg = {
  id: "eid-mubarak",
  cls: "em",
  css: CSS,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  ornament: <StarRule className="em-rule" />,
  frame: (img: ReactNode) => <figure className="gk-photo em-photo">{img}</figure>,
  footer: ({ g }) => (
    <footer className="gk-foot">
      <Crescent className="em-foot-moon" style={{ width: 110, margin: "0 auto", display: "block" }} />
      <p className="em-ar em-gold" lang="ar" style={{ fontSize: "clamp(44px,6cqi,72px)", margin: "10px 0 0" }}>عيد مبارك</p>
      <E as="p" path="profile.blessing" className="em-sign">{g.signoff}</E>
      {!g.compact && <button type="button" className="gk-btn" style={{ marginTop: 32 }} onClick={g.replay}>{g.w.again}</button>}
      {g.props.credit && <div className="gk-credit">{g.props.credit}</div>}
    </footer>
  ),
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
