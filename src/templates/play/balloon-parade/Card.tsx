"use client";
import { useId, useRef } from "react";
import type { CardProps } from "../../types";
import { CardCopy } from "../_shared/CardCopy";
import { STACKS } from "../_shared/fonts";
import { Grain, cardText, fontClass, gsap, ratioNum, ratioOf, shapeOf, useAnim, worldVars } from "../_shared/kit";
import { BALLOON_COLORS, BP, Balloon, BalloonGrad, Bear, Bunny, Bunting, Cloud, Duck, Lawn, NumberDefs, NumberGlyph } from "./art";

export default function Card({ kind, profile: p, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const t = cardText(kind, design, p);
  const shape = shapeOf(kind);
  const W = 500;
  const H = Math.round(W / ratioNum(kind));
  const list = t.mode === "list";

  useAnim(ref, ({ reduce }) => {
    if (!animate || reduce) return;
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from(".bp-rise", { y: H * 0.7, duration: 1.8, ease: "elastic.out(1, 0.7)", stagger: 0.12 })
      .from("[data-c]", { y: 18, scale: 0.9, autoAlpha: 0, duration: 0.8, ease: "back.out(2.2)", stagger: 0.08 }, 0.35)
      .from(".bp-critter", { y: 30, autoAlpha: 0, duration: 0.7, ease: "back.out(2.5)", stagger: 0.1 }, 0.5);
    gsap.utils.toArray<SVGGElement>(".bp-balloon, .bp-num").forEach((b, i) => gsap.to(b, { rotate: i % 2 ? 4 : -4, duration: 2.4 + (i % 4) * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%", delay: -i * 0.6 }));
    gsap.utils.toArray<SVGGElement>(".bp-flag").forEach((f, i) => gsap.to(f, { rotate: i % 2 ? 6 : -6, duration: 1.7 + (i % 3) * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" }));
    gsap.utils.toArray<SVGGElement>(".bp-eyes").forEach((e, i) => gsap.to(e, { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.09, yoyo: true, repeat: -1, repeatDelay: 2.6 + i * 1.4, delay: 1.5 + i }));
  }, [animate, kind]);

  // ── art per shape ──
  const lawnH = shape === "wide" ? 90 : shape === "tall" ? 150 : 120;
  const by = H - 22; // critters' feet
  const k = shape === "tall" ? 1.05 : shape === "wide" ? 0.62 : shape === "square" ? 0.72 : 0.84;
  const clusterL = (scale: number, x: number) => [[-20, 220], [-6, 290], [10, 200]].map(([tt, l], i) => (
    <Balloon key={`l${i}`} id={`${uid}-b${[0, 3, 1][i]}`} c={BALLOON_COLORS[[0, 3, 1][i]]} x={x - 30 * scale} y={by - 74 * scale} len={l * scale} tilt={tt} s={0.8 * scale} />
  ));
  const clusterR = (scale: number, x: number) => [[20, 230], [5, 300], [-10, 190]].map(([tt, l], i) => (
    <Balloon key={`r${i}`} id={`${uid}-b${[2, 4, 5][i]}`} c={BALLOON_COLORS[[2, 4, 5][i]]} x={x + 30 * scale} y={by - 72 * scale} len={l * scale} tilt={tt} s={0.8 * scale} />
  ));

  const fullArt = !list && t.mode !== "number";
  const textTop = shape === "tall" ? "13%" : shape === "wide" ? "16%" : shape === "square" ? "13%" : "14%";

  return (
    <div
      ref={ref}
      className={`${fontClass} @container relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", ...worldVars(design, { bg: BP.cream, ink: BP.ink, accent: BP.coral, paper: BP.paper, display: STACKS.balloon.display, body: STACKS.balloon.body }), background: `linear-gradient(180deg, #FDEBDD 0%, var(--w-bg) 55%)`, color: "var(--w-ink)", fontFamily: "var(--w-body)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden style={{ overflow: "hidden" }}>
        <defs>{BALLOON_COLORS.map((c, i) => <BalloonGrad key={i} id={`${uid}-b${i}`} c={c} />)}<NumberDefs uid={uid} /></defs>
        <g transform={`translate(${W * 0.12} ${H * (shape === "wide" ? 0.2 : 0.12)}) scale(.55)`} opacity=".9"><Cloud /></g>
        <g transform={`translate(${W * 0.86} ${H * (shape === "wide" ? 0.3 : 0.2)}) scale(.42)`} opacity=".85"><Cloud /></g>
        <Bunting w={W} sag={shape === "wide" ? 16 : 24} n={shape === "wide" ? 12 : 10} y={-6} />
        <g transform={`translate(0 ${H - lawnH})`}><Lawn w={W} h={lawnH} seed={kind.length} /></g>
        {fullArt && shape !== "wide" && (
          <g className="bp-rise">
            {clusterL(k, 70 * k + 18)}
            {clusterR(k, W - 70 * k - 18)}
          </g>
        )}
        {fullArt && shape === "wide" && !photoUrl && (
          <g className="bp-rise">
            {[[-14, 240, 0], [0, 300, 3], [14, 220, 1], [26, 180, 4]].map(([tt, l, c], i) => <Balloon key={i} id={`${uid}-b${c}`} c={BALLOON_COLORS[c]} x={102} y={by - 46} len={l * 0.82} tilt={tt} s={0.62} />)}
          </g>
        )}
        {fullArt && (shape === "tall" || kind === "invite" || kind === "save" || kind === "post") && p.age && shape !== "wide" ? (
          <g className="bp-rise"><NumberGlyph uid={uid} n={p.age} x={W / 2 + 14} y={by - 40} s={shape === "tall" ? 0.62 : shape === "square" ? 0.34 : 0.4} /></g>
        ) : null}
        {fullArt && shape !== "wide" && (
          <>
            <Bear x={70 * k + 18} y={by} s={k} />
            <Bunny x={W - 70 * k - 18} y={by} s={k} />
            {(shape === "tall" || kind === "invite" || kind === "save" || kind === "post") && p.age ? <Duck x={W / 2 - 4} y={by + 4} s={k * 0.8} /> : null}
          </>
        )}
        {fullArt && shape === "wide" && !photoUrl && <Bear x={132} y={by} s={0.62} />}
        {(list || t.mode === "number") && (
          <>
            <Balloon id={`${uid}-b0`} c={BALLOON_COLORS[0]} x={60} y={H - 30} len={shape === "tall" ? 260 : 150} tilt={-6} s={0.55} cls="bp-rise" />
            <Balloon id={`${uid}-b2`} c={BALLOON_COLORS[2]} x={W - 60} y={H - 30} len={shape === "tall" ? 300 : 170} tilt={6} s={0.55} cls="bp-rise" />
            <Duck x={W / 2} y={H - 18} s={0.55} />
          </>
        )}
        {t.mode === "number" && (
          <g transform={`translate(${W / 2} ${H * 0.93})`}>
            <Balloon id={`${uid}-b3`} c={BALLOON_COLORS[3]} len={H * 0.13} s={H / 265} cls="bp-rise" />
          </g>
        )}
      </svg>

      {shape === "wide" && photoUrl && fullArt && (
        <figure className="absolute left-[7%] top-[16%] w-[36%] rotate-[-4deg] bg-white p-[1.4cqw] pb-[5cqw] shadow-[0_2cqw_4cqw_-2cqw_rgba(47,58,86,.5)]" data-c="photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" data-edit-photo="photo" className="aspect-square w-full object-cover" />
        </figure>
      )}

      <div className="absolute inset-x-0 flex justify-center" style={{ top: t.mode === "number" ? "17%" : textTop, ...(shape === "wide" ? { left: "44%", right: "5%" } : { left: list ? "12%" : "16%", right: list ? "12%" : "16%" }) }}>
        <CardCopy
          t={t}
          nameSize={shape === "wide" ? 11 : shape === "tall" ? 21 : shape === "square" ? 15 : 17}
          gap={shape === "tall" ? 3.2 : 2}
          s={{
            eyebrow: { fontSize: shape === "wide" ? "2.2cqw" : "3cqw", fontWeight: 800, letterSpacing: ".26em", textTransform: "uppercase", color: "var(--w-accent)" },
            name: { fontFamily: "var(--w-display)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--w-ink)" },
            line: { fontFamily: "var(--w-display)", fontWeight: 600, fontSize: shape === "wide" ? "3.4cqw" : "4.6cqw", color: "var(--w-accent)" },
            lead: { fontSize: shape === "wide" ? "2.6cqw" : shape === "tall" ? "4.4cqw" : "3.6cqw", lineHeight: 1.4, fontWeight: 600, opacity: 0.8, maxWidth: "62cqw", margin: 0 },
            meta: { fontSize: shape === "wide" ? "2.4cqw" : "3.3cqw", fontWeight: 700, lineHeight: 1.45, background: "rgba(255,255,255,.75)", borderRadius: "999px", padding: shape === "wide" ? "1cqw 3cqw" : "1.4cqw 4.2cqw" },
            footer: { fontFamily: "var(--w-display)", fontSize: shape === "wide" ? "2.8cqw" : "3.6cqw", fontWeight: 600, opacity: 0.75 },
            headline: { fontFamily: "var(--w-display)", fontWeight: 600, fontSize: list ? "8cqw" : shape === "wide" ? "6.4cqw" : "6cqw", lineHeight: 1.05, color: list || t.mode === "thanks" ? "var(--w-ink)" : "var(--w-accent)", margin: 0 },
            item: { fontFamily: "var(--w-display)", fontWeight: 600, fontSize: shape === "tall" ? "6cqw" : "4.8cqw" },
            detail: { fontSize: shape === "tall" ? "3.6cqw" : "3cqw", opacity: 0.7, fontWeight: 600 },
            number: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: "30cqw", color: "#fff", marginTop: "3cqw", textShadow: "0 .6cqw 0 rgba(47,58,86,.18)" },
            hashtag: { fontFamily: "var(--w-display)", fontWeight: 700, color: "var(--w-accent)" },
          }}
          ornament={t.mode === "names" || t.mode === "greeting" || t.mode === "thanks" ? <Squiggle /> : undefined}
        />
      </div>
      <Grain opacity={0.28} />
    </div>
  );
}

const Squiggle = () => (
  <svg viewBox="0 0 160 14" style={{ width: "18cqw" }} aria-hidden data-c="orn"><path d="M2 8 Q 22 0 42 8 T 82 8 T 122 8 T 158 8" fill="none" stroke="var(--w-accent)" strokeWidth="3.5" strokeLinecap="round" /></svg>
);
