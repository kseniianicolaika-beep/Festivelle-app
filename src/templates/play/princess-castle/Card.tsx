"use client";
import { useId, useRef } from "react";
import type { CardProps } from "../../types";
import { CardCopy } from "../_shared/CardCopy";
import { STACKS } from "../_shared/fonts";
import { Grain, cardText, fontClass, gsap, ratioOf, shapeOf, useAnim, worldVars } from "../_shared/kit";
import { Crown, PR, Sparkle } from "./art";
import { Gate } from "./Site";

export default function Card({ kind, profile: p, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const t = cardText(kind, design, p);
  const shape = shapeOf(kind);
  const list = t.mode === "list";
  const wide = shape === "wide";
  const num = t.mode === "number";

  useAnim(ref, ({ reduce }) => {
    if (!animate) return;
    if (reduce) { gsap.set(".pr-doors", { autoAlpha: 0 }); return; }
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(".pr-c-gate", { y: 40, autoAlpha: 0, duration: 1, ease: "power3.out" })
      .to(".pr-plaque", { autoAlpha: 0, duration: 0.2 }, 0.6)
      .to(".pr-door-l", { rotateY: 98, duration: 1.6, ease: "power3.inOut" }, 0.7)
      .to(".pr-door-r", { rotateY: -98, duration: 1.6, ease: "power3.inOut" }, 0.7)
      .from("[data-c]", { y: 16, autoAlpha: 0, duration: 0.9, ease: "power2.out", stagger: 0.09 }, 0.2);
    gsap.utils.toArray<SVGElement>(".pr-tw").forEach((s, i) => gsap.to(s, { opacity: 0.2, duration: 1 + (i % 4) * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" }));
    gsap.utils.toArray<SVGPathElement>(".pr-flag").forEach((f, i) => gsap.to(f, { skewY: 8, scaleX: 0.9, duration: 0.7 + (i % 3) * 0.15, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "0% 50%" }));
  }, [animate, kind]);

  const gateW = num ? 62 : wide ? 34 : list ? 34 : shape === "tall" ? 66 : shape === "square" ? 40 : 60;
  const gateStyle = wide ? { left: "6%", bottom: "0", width: `${gateW}%` } : { left: `${(100 - gateW) / 2}%`, bottom: "0", width: `${gateW}%` };
  const inner = num ? (
    <span className="leading-none" style={{ fontFamily: "var(--w-display)", fontSize: "34cqw", color: PR.goldL }}>{t.number}</span>
  ) : wide && photoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photoUrl} alt="" data-edit-photo="photo" className="absolute inset-0 h-full w-full object-cover" />
  ) : p.age ? (
    <>
      <svg viewBox="-60 -40 120 70" style={{ width: "24cqw" }} aria-hidden><Crown /></svg>
      <span className="leading-none" style={{ fontFamily: "var(--w-display)", fontSize: "40cqw", color: PR.goldL, textShadow: "0 1cqw 3cqw rgba(0,0,0,.3)" }}>{p.age}</span>
    </>
  ) : (
    <svg viewBox="-60 -40 120 70" style={{ width: "40cqw" }} aria-hidden><Crown /></svg>
  );

  return (
    <div
      ref={ref}
      className={`${fontClass} @container relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", ...worldVars(design, { bg: PR.blush, ink: PR.plum, accent: PR.deep, display: STACKS.castle.display, body: STACKS.castle.body }), background: `linear-gradient(180deg, #E8DAF2 0%, #F6DFE8 45%, var(--w-bg) 100%)`, color: "var(--w-ink)", fontFamily: "var(--w-body)" }}
    >
      <svg viewBox="0 0 500 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        {Array.from({ length: 16 }, (_, i) => <Sparkle key={i} x={(i * 131) % 500} y={(i * 89) % 700} s={0.4 + (i % 3) * 0.25} c={i % 2 ? "#fff" : PR.goldL} />)}
      </svg>
      <div className="absolute inset-[2.4%] rounded-[1.4cqw] border" style={{ borderColor: PR.gold }} />
      <div className="absolute inset-[3.6%] rounded-[1cqw] border border-dashed" style={{ borderColor: PR.goldL }} />
      <div className="pr-c-gate absolute" style={gateStyle}>
        <Gate uid={uid} open={!animate}>{inner}</Gate>
      </div>
      {!num && (
        <div className="absolute flex justify-center" style={{ top: list ? "8%" : wide ? "12%" : "7%", ...(wide ? { left: "42%", right: "7%" } : { left: "10%", right: "10%" }) }}>
          <CardCopy
            t={t}
            nameSize={wide ? 9 : shape === "tall" ? 15 : shape === "square" ? 10 : 12}
            gap={shape === "tall" ? 2.2 : 1.2}
            compactMeta
            s={{
              eyebrow: { fontSize: wide ? "1.9cqw" : "2.5cqw", fontWeight: 600, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--w-accent)" },
              name: { fontFamily: "var(--w-display)" },
              line: { fontStyle: "italic", fontSize: wide ? "3.2cqw" : "4.2cqw", color: "var(--w-accent)", lineHeight: 1.1 },
              lead: { fontSize: wide ? "2.6cqw" : shape === "tall" ? "4cqw" : "3.3cqw", lineHeight: 1.3, opacity: 0.85, margin: 0 },
              meta: { fontSize: wide ? "2.4cqw" : "3.1cqw", lineHeight: 1.35, opacity: 0.85 },
              footer: { fontFamily: "var(--w-display)", fontSize: wide ? "2.8cqw" : "3.4cqw", opacity: 0.8 },
              headline: { fontFamily: "var(--w-display)", fontSize: list ? "8cqw" : wide ? "5.4cqw" : "5.4cqw", lineHeight: 1.1, color: list || t.mode === "thanks" ? "var(--w-ink)" : "var(--w-accent)", margin: 0 },
              item: { fontFamily: "var(--w-display)", fontSize: shape === "tall" ? "5.6cqw" : "4.4cqw" },
              detail: { fontSize: shape === "tall" ? "3.6cqw" : "3cqw", opacity: 0.7, fontStyle: "italic" },
              hashtag: { fontFamily: "var(--w-display)", color: "var(--w-accent)" },
            }}
            ornament={t.mode === "names" || t.mode === "greeting" || t.mode === "thanks" ? <svg viewBox="-60 -8 120 16" style={{ width: "20cqw" }} aria-hidden data-c="orn"><path d="M-56 0 H-12 M12 0 H56" stroke={PR.gold} strokeWidth="1.4" /><path d="M0 -6 L6 0 L0 6 L-6 0Z" fill={PR.gold} /></svg> : undefined}
          />
        </div>
      )}
      {num && t.headline && <p className="absolute inset-x-0 top-[9%] text-center text-[5cqw] uppercase tracking-[0.3em]" style={{ color: "var(--w-accent)", fontFamily: "var(--w-display)" }} data-c="eyebrow">{t.headline.text}</p>}
      <Grain opacity={0.2} />
    </div>
  );
}
