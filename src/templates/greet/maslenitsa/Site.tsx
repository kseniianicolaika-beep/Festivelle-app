"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { E } from "@/components/designs/Editable";
import type { SiteProps } from "../../types";
import { GreetSite, useIso, type G, type OpeningProps, type SiteCfg } from "../_shared/GreetSite";
import { fit, pick } from "../_shared/kit";
import { Berries, Blini, FolkBand, FolkSun, Ribbons } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

function Opening({ g, onOpen }: OpeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const open = () => {
    if (busy.current) return;
    busy.current = true;
    if (g.reduced) return onOpen();
    const q = gsap.utils.selector(ref);
    gsap.timeline()
      .to(q(".gk-tap, .ms-open-title"), { opacity: 0, duration: 0.3 })
      .set(q(".ms-fly"), { opacity: 1 }, 0.1)
      .to(q(".ms-fly"), { y: "-28vh", rotateX: 540, duration: 1.1, ease: "power2.out" }, 0.1)
      .to(q(".ms-stack > svg"), { y: 60, opacity: 0, duration: 0.8, ease: "power2.in" }, 0.5)
      .set(q(".ms-sunfly"), { y: "-28vh", scale: 0.4 }, 1.1)
      .to(q(".ms-fly"), { opacity: 0, duration: 0.3 }, 1.1)
      .to(q(".ms-sunfly"), { opacity: 1, scale: 2.4, rotate: 90, duration: 1.3, ease: "back.out(1.4)" }, 1.1)
      .to(q(".ms-open-band"), { opacity: 0, duration: 0.6 }, 1.4)
      .call(onOpen, [], 2.1);
  };
  return (
    <div ref={ref} className="ms-open" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()} role="button" tabIndex={0} aria-label={g.w.open} data-open>
      <FolkBand className="ms-open-band t" n={8} />
      <FolkBand className="ms-open-band b" n={8} seed={6} />
      <div className="ms-open-in" style={{ perspective: 900 }}>
        <p className="ms-open-title">{g.lang === "ru" ? "Масленица!" : pick({ en: "Maslenitsa!", ru: "Масленица!", hi: "मास्लेनित्सा!" }, g.lang)}</p>
        <div className="ms-stack">
          <Blini n={8} />
          <Blini className="ms-fly" n={1} butter={false} />
          <FolkSun className="ms-sunfly" />
        </div>
        <p className="gk-tap">{pick({ en: "Tap to flip the blin", ru: "Нажмите — переверните блин", hi: "ब्लिन पलटने के लिए छुएँ" }, g.lang)}</p>
      </div>
    </div>
  );
}

function Hero({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(6);
  useIso(() => {
    if (g.compact || g.reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = [".ms-sun", ".ms-head", ".ms-line", ".ms-name", ".ms-ribbons", ".ms-table"];
      if (!g.opened) {
        gsap.set(els, { autoAlpha: 0 });
        return;
      }
      gsap.timeline()
        .from(".ms-sun", { autoAlpha: 0, scale: 1.6, y: 80, duration: 1.4, ease: "power3.out" })
        .from(".ms-ribbons", { autoAlpha: 0, y: -80, duration: 1.2, ease: "power2.out" }, 0.2)
        .from(".ms-head", { autoAlpha: 0, scale: 0.5, duration: 0.9, ease: "back.out(2.2)" }, 0.7)
        .from([".ms-line", ".ms-name"], { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.15 }, 1)
        .from(".ms-table", { autoAlpha: 0, y: 80, duration: 1, ease: "power3.out" }, 0.9);
    }, ref);
    return () => ctx.revert();
  }, [g.opened, g.compact, g.reduced]);
  const flip = () => {
    setN((x) => (x >= 14 ? 4 : x + 1));
    if (!g.reduced) gsap.fromTo(ref.current!.querySelector(".ms-table-blini"), { scale: 1.08 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
  };
  return (
    <header ref={ref} className="ms-hero">
      <Ribbons className="ms-ribbons" />
      <FolkSun className="ms-sun" />
      <div className="ms-hero-in">
        <E as="h1" path="texts.headline" className="ms-head" style={{ ["--k" as string]: fit(g.headline, 1, 16, 0.55) } as CSSProperties}>{g.headline}</E>
        <E as="p" path="texts.eyebrow" className="ms-line">{g.line}</E>
        <p className="ms-name" style={{ ["--k" as string]: fit(g.name, 1, 10, 0.55) } as CSSProperties}><E path="profile.partner1">{g.name}</E></p>
      </div>
      <div className="ms-table">
        {!g.compact && <p className="ms-hint">{pick({ en: "Tap the stack — one more blin!", ru: "Нажмите — ещё блинчик!", hi: "छुएँ — एक और ब्लिन!" }, g.lang)}</p>}
        <button type="button" className="ms-table-blini" onClick={flip} aria-label="blin" disabled={g.compact}>
          <Blini n={n} />
          <span className="ms-count">{n}</span>
        </button>
        <FolkBand className="ms-band" n={10} />
      </div>
    </header>
  );
}

function Letter({ g }: { g: G }) {
  return (
    <div style={{ position: "relative", paddingTop: 60 }}>
      <div className="ms-letter" data-rv>
        <FolkSun className="ms-letter-sun" />
        {g.heroUrl && (
          <figure className="ms-photo" style={{ width: "min(230px,60%)", margin: "0 auto 30px", rotate: "-2deg" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.heroUrl} alt="" data-edit-photo="hero" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />
          </figure>
        )}
        <span className="gk-kicker">{g.w.letter}</span>
        <h2 className="gk-title" style={{ marginBottom: ".5em" }}><E path="profile.partner1">{g.name}</E></h2>
        <E as="p" path="profile.story" multiline className="gk-msg ms-msg">{g.message}</E>
        <Berries className="ms-rule" style={{ marginTop: 26 }} />
        <E as="p" path="profile.blessing" className="ms-sign">{g.signoff}</E>
      </div>
    </div>
  );
}

const CFG: SiteCfg = {
  id: "maslenitsa",
  cls: "ms",
  css: CSS,
  vars: VARS,
  defaults: DEFAULTS,
  Opening,
  Hero,
  letter: Letter,
  ornament: <Berries className="ms-rule" />,
  frame: (img: ReactNode, i: number) => <figure className="gk-photo ms-photo" style={{ rotate: `${[-2, 2, -1][i % 3]}deg` }}>{img}</figure>,
};

export default function Site(props: SiteProps) {
  return <GreetSite {...props} cfg={CFG} />;
}
