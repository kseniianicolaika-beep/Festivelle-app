"use client";
import { useId, useRef } from "react";
import type { CardProps } from "../../types";
import { CardCopy } from "../_shared/CardCopy";
import { STACKS } from "../_shared/fonts";
import { Grain, cardText, fontClass, gsap, ratioNum, ratioOf, shapeOf, useAnim, worldVars } from "../_shared/kit";
import { FeltCloud, HangStar, MobileBar, SM, SleepyMoon, Zzz } from "./art";
import { FeltNumber } from "./Site";

export default function Card({ kind, profile: p, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const t = cardText(kind, design, p);
  const shape = shapeOf(kind);
  const W = 500;
  const H = Math.round(W / ratioNum(kind));
  const list = t.mode === "list";
  const wide = shape === "wide";
  const art = !list && t.mode !== "number";

  useAnim(ref, ({ reduce }) => {
    if (!animate || reduce) return;
    gsap.from(".sm-c-moon", { y: 120, autoAlpha: 0, duration: 2, ease: "power3.out" });
    gsap.from(".sm-c-drop", { y: -200, duration: 1.6, ease: "bounce.out", stagger: 0.15, delay: 0.3 });
    gsap.from("[data-c]", { y: 14, autoAlpha: 0, duration: 1.1, ease: "power2.out", stagger: 0.1, delay: 0.6 });
    gsap.utils.toArray<SVGGElement>(".sm-hang").forEach((h, i) => gsap.to(h, { rotate: i % 2 ? 4 : -4, duration: 2.8 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" }));
    gsap.utils.toArray<SVGTextElement>(".sm-z").forEach((z, i) => gsap.fromTo(z, { opacity: 0 }, { opacity: 1, duration: 1.4, yoyo: true, repeat: -1, delay: i * 0.45 }));
  }, [animate, kind]);

  const moonS = wide ? 0.62 : shape === "tall" ? 0.62 : shape === "square" ? 0.42 : 0.5;
  const moonY = wide ? H * 0.52 : shape === "tall" ? H * 0.25 : shape === "square" ? H * 0.24 : H * 0.27;
  const top = wide ? "16%" : shape === "tall" ? "42%" : shape === "square" ? "42%" : "45%";

  return (
    <div
      ref={ref}
      className={`${fontClass} @container relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", ...worldVars(design, { bg: SM.sky, ink: SM.ink, accent: "#C7798A", display: STACKS.moon.display, body: STACKS.moon.body }), background: `linear-gradient(180deg, #CFDCF0 0%, ${SM.powder} 40%, var(--w-bg) 100%)`, color: "var(--w-ink)", fontFamily: "var(--w-body)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <MobileBar w={W} y={wide ? 14 : 20} />
        <g className="sm-c-drop"><HangStar x={W * 0.1} y={wide ? 26 : 34} len={wide ? 50 : shape === "tall" ? 120 : 70} s={0.55} /></g>
        {!wide && <g className="sm-c-drop"><HangStar x={W * 0.9} y={34} len={shape === "tall" ? 90 : 46} s={0.5} c={SM.lilac} /></g>}
        {art && !(wide && photoUrl) && <g className="sm-c-moon"><SleepyMoon id={`${uid}-m`} x={wide ? W * 0.24 : W / 2} y={moonY} s={moonS} /><Zzz x={(wide ? W * 0.24 : W / 2) + 50 * moonS} y={moonY - 110 * moonS} s={moonS} /></g>}
        {!wide && art && p.age && shape === "tall" ? <g className="sm-c-drop"><FeltNumber n={p.age} x={W * 0.78} y={34} len={40} s={0.5} /></g> : null}
        {t.mode === "number" && <g className="sm-c-moon"><circle cx={W / 2} cy={H * 0.5} r={H * 0.24} fill={SM.moon} opacity=".55" /></g>}
        <FeltCloud x={W * 0.08} y={H - 10} s={wide ? 0.8 : 1} />
        <FeltCloud x={W * 0.32} y={H + 4} s={wide ? 0.6 : 0.8} c="#F4F7FC" />
        <FeltCloud x={W * 0.94} y={H - 14} s={wide ? 0.8 : 1} />
        <FeltCloud x={W * 0.7} y={H + 6} s={wide ? 0.6 : 0.8} c="#F4F7FC" />
      </svg>
      {wide && photoUrl && art && (
        <div className="absolute left-[7%] top-[14%] aspect-[4/5] w-[30%] overflow-hidden rounded-t-full rounded-b-[3cqw] bg-[#FFFBF2] p-[1.2cqw]" data-c="photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" data-edit-photo="photo" className="h-full w-full rounded-t-full rounded-b-[2.4cqw] object-cover" />
        </div>
      )}
      <div className="absolute flex justify-center" style={{ top: list ? "12%" : t.mode === "number" ? "20%" : top, ...(wide ? { left: "44%", right: "5%" } : { left: "10%", right: "10%" }) }}>
        <CardCopy
          t={t}
          nameSize={wide ? 12 : shape === "tall" ? 19 : shape === "square" ? 15 : 17}
          gap={shape === "tall" ? 2.6 : 1.8}
          s={{
            eyebrow: { fontSize: wide ? "2.1cqw" : "2.7cqw", fontWeight: 800, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--w-accent)" },
            name: { fontFamily: "var(--w-display)", fontStyle: "italic", fontWeight: 600 },
            line: { fontFamily: "var(--w-display)", fontStyle: "italic", fontWeight: 500, fontSize: wide ? "3.4cqw" : "4.8cqw", color: "var(--w-accent)" },
            lead: { fontSize: wide ? "2.5cqw" : shape === "tall" ? "4cqw" : "3.3cqw", lineHeight: 1.5, opacity: 0.75, margin: 0 },
            meta: { fontSize: wide ? "2.3cqw" : "3cqw", fontWeight: 700, lineHeight: 1.55, opacity: 0.8 },
            footer: { fontFamily: "var(--w-display)", fontStyle: "italic", fontSize: wide ? "3cqw" : "4cqw", fontWeight: 600, opacity: 0.8 },
            headline: { fontFamily: "var(--w-display)", fontStyle: "italic", fontWeight: 600, fontSize: list ? "9cqw" : wide ? "6.4cqw" : "6.4cqw", lineHeight: 1.05, color: list || t.mode === "thanks" ? "var(--w-ink)" : "var(--w-accent)", margin: 0 },
            item: { fontFamily: "var(--w-display)", fontStyle: "italic", fontWeight: 600, fontSize: shape === "tall" ? "6.6cqw" : "5.2cqw" },
            detail: { fontSize: shape === "tall" ? "3.4cqw" : "2.9cqw", opacity: 0.65 },
            number: { fontFamily: "var(--w-display)", fontStyle: "italic", fontWeight: 700, fontSize: "30cqw", color: SM.ink, marginTop: "2cqw" },
            hashtag: { fontFamily: "var(--w-display)", fontStyle: "italic", fontWeight: 700, color: "var(--w-accent)" },
          }}
          ornament={t.mode === "names" || t.mode === "greeting" || t.mode === "thanks" ? <Dash /> : undefined}
        />
      </div>
      <Grain opacity={0.2} />
    </div>
  );
}

const Dash = () => (
  <svg viewBox="0 0 120 12" style={{ width: "16cqw" }} aria-hidden data-c="orn"><path d="M2 6 H118" stroke="#9DB5DA" strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round" /><circle cx="60" cy="6" r="4" fill="#D9B98A" /></svg>
);
