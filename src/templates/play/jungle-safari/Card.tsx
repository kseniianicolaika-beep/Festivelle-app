"use client";
import { useRef } from "react";
import type { CardProps } from "../../types";
import { CardCopy } from "../_shared/CardCopy";
import { STACKS } from "../_shared/fonts";
import { Grain, cardText, fontClass, gsap, ratioNum, ratioOf, shapeOf, useAnim, worldVars } from "../_shared/kit";
import { Frond, Giraffe, JG, Lion, Monkey, Monstera, Paw, Toucan, Vine } from "./art";

export default function Card({ kind, profile: p, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const t = cardText(kind, design, p);
  const shape = shapeOf(kind);
  const W = 500;
  const H = Math.round(W / ratioNum(kind));
  const list = t.mode === "list";
  const wide = shape === "wide";
  const art = !list && t.mode !== "number";

  useAnim(ref, ({ reduce }) => {
    if (!animate || reduce) return;
    gsap.from(".jg-c-l", { x: -260, duration: 1.6, ease: "power3.out" });
    gsap.from(".jg-c-r", { x: 260, duration: 1.6, ease: "power3.out" });
    gsap.from(".jg-c-peek", { y: 200, duration: 1.1, ease: "back.out(1.5)", stagger: 0.2, delay: 0.8 });
    gsap.from(".jg-c-drop", { y: -200, duration: 1.2, ease: "bounce.out", delay: 1 });
    gsap.from("[data-c]", { y: 18, scale: 0.92, autoAlpha: 0, duration: 0.9, ease: "back.out(2)", stagger: 0.08, delay: 0.4 });
    gsap.to(".jg-monkey", { rotate: 8, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" });
    gsap.utils.toArray<SVGGElement>(".jg-sway").forEach((l, i) => gsap.to(l, { rotate: i % 2 ? 3 : -3, duration: 2.6 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%" }));
  }, [animate, kind]);

  const k = wide ? 0.55 : shape === "tall" ? 0.95 : shape === "square" ? 0.7 : 0.8;

  return (
    <div
      ref={ref}
      className={`${fontClass} @container relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", ...worldVars(design, { bg: JG.sage, ink: JG.deep, accent: JG.terra, display: STACKS.jungle.display, body: STACKS.jungle.body }), background: "radial-gradient(80% 55% at 50% 35%, #FBF8E8 0%, #E9F0D8 60%, #CFE0BC 100%)", color: "var(--w-ink)", fontFamily: "var(--w-body)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <Vine x1={-10} y1={12} x2={W + 10} y2={18} sag={wide ? 20 : 34} />
        {art && !wide && <g className="jg-c-drop"><Monkey x={W * 0.84} y={36} s={0.36 * k / 0.8} /></g>}
        {art && !wide && (
          <>
            <g className="jg-c-peek"><Giraffe x={W - 24} y={H + 20} s={0.7 * k} /></g>
            <g className="jg-c-peek"><Lion x={W * 0.24} y={H - 60 * k} s={0.55 * k} /></g>
          </>
        )}
        {art && wide && !photoUrl && <g className="jg-c-peek"><Lion x={W * 0.2} y={H * 0.62} s={0.55} /><Toucan x={W * 0.08} y={H * 0.25} s={0.45} /></g>}
        {(list || t.mode === "number") && <g className="jg-c-peek"><Lion x={W * 0.5} y={H + 10} s={0.5} /></g>}
        <g className="jg-c-l">
          <g className="jg-sway"><Monstera x={-30} y={H + 30} r={22} s={0.9 * k} /></g>
          <g className="jg-sway"><Frond x={-20} y={H * (shape === "tall" ? 0.7 : 0.6)} r={12} s={0.7 * k} /></g>
        </g>
        <g className="jg-c-r">
          <g className="jg-sway"><Monstera x={W + 30} y={H + 30} r={-22} s={0.8 * k} c={JG.leaf2} /></g>
          {!wide && <g className="jg-sway"><Frond x={W + 20} y={H * 0.45} r={-80} s={0.55 * k} c={JG.leaf} /></g>}
        </g>
        {t.mode === "number" && <circle cx={W / 2} cy={H * 0.5} r={H * 0.24} fill={JG.mustard} opacity=".9" />}
      </svg>
      {wide && photoUrl && art && (
        <div className="absolute left-[6%] top-1/2 aspect-square w-[34%] -translate-y-1/2 overflow-hidden rounded-full border-[1.4cqw]" style={{ borderColor: JG.cream }} data-c="photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" data-edit-photo="photo" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="absolute flex justify-center" style={{ top: list ? "12%" : t.mode === "number" ? "18%" : wide ? "14%" : shape === "tall" ? "13%" : "13%", ...(wide ? { left: "44%", right: "5%" } : { left: "11%", right: "11%" }) }}>
        <CardCopy
          t={t}
          nameSize={wide ? 10 : shape === "tall" ? 18 : shape === "square" ? 13 : 15}
          gap={shape === "tall" ? 2.6 : 1.7}
          s={{
            eyebrow: { fontSize: wide ? "2.1cqw" : "2.7cqw", fontWeight: 800, letterSpacing: ".26em", textTransform: "uppercase", color: JG.mustard, background: JG.deep, borderRadius: "999px", padding: "0.8cqw 2.6cqw" },
            name: { fontFamily: "var(--w-display)", fontWeight: 900, textTransform: "uppercase", textShadow: `0 .7cqw 0 ${JG.mustard}` },
            line: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: wide ? "3.2cqw" : "4.4cqw", color: "var(--w-accent)" },
            lead: { fontSize: wide ? "2.4cqw" : shape === "tall" ? "4cqw" : "3.3cqw", lineHeight: 1.45, fontWeight: 600, opacity: 0.85, margin: 0 },
            meta: { fontSize: wide ? "2.3cqw" : "3cqw", fontWeight: 700, lineHeight: 1.45, background: "rgba(255,255,255,.75)", borderRadius: "999px", padding: wide ? "1cqw 3cqw" : "1.3cqw 4cqw" },
            footer: { fontFamily: "var(--w-display)", fontSize: wide ? "2.8cqw" : "3.6cqw", fontWeight: 700, opacity: 0.85 },
            headline: { fontFamily: "var(--w-display)", fontWeight: 900, fontSize: list ? "8cqw" : wide ? "5.4cqw" : "5.6cqw", lineHeight: 1.05, color: list || t.mode === "thanks" ? "var(--w-ink)" : "var(--w-accent)", margin: 0 },
            item: { fontFamily: "var(--w-display)", fontWeight: 800, fontSize: shape === "tall" ? "5.6cqw" : "4.6cqw" },
            detail: { fontSize: shape === "tall" ? "3.5cqw" : "3cqw", opacity: 0.7, fontWeight: 600 },
            number: { fontFamily: "var(--w-display)", fontWeight: 900, fontSize: "30cqw", color: JG.deep, marginTop: "2cqw" },
            hashtag: { fontFamily: "var(--w-display)", fontWeight: 900, color: "var(--w-accent)" },
          }}
          ornament={t.mode === "names" || t.mode === "greeting" || t.mode === "thanks" ? <div data-c="orn" className="flex" style={{ gap: "1.4cqw" }} aria-hidden>{[0, 1, 2].map((i) => <svg key={i} viewBox="-16 -18 32 32" style={{ width: "3.6cqw", transform: `rotate(80deg) translateX(${i % 2 ? -0.8 : 0}cqw)` }}><Paw c={JG.leaf2} /></svg>)}</div> : undefined}
        />
      </div>
      <Grain opacity={0.24} />
    </div>
  );
}
