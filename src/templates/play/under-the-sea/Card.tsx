"use client";
import { useId, useRef } from "react";
import type { CardProps } from "../../types";
import { CardCopy } from "../_shared/CardCopy";
import { STACKS } from "../_shared/fonts";
import { Grain, cardText, fontClass, gsap, ratioNum, ratioOf, shapeOf, useAnim, worldVars } from "../_shared/kit";
import { Anemone, Coral, Fish, Kelp, Octopus, Puffer, Rays, Reef, Rock, SEA, Shell, Starfish, Turtle } from "./art";

export default function Card({ kind, profile: p, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const t = cardText(kind, design, p);
  const shape = shapeOf(kind);
  const W = 500;
  const H = Math.round(W / ratioNum(kind));
  const list = t.mode === "list";
  const wide = shape === "wide";
  const reefH = wide ? 80 : shape === "tall" ? 150 : 110;

  useAnim(ref, ({ reduce }) => {
    if (!animate || reduce) return;
    gsap.from(".us-c-up", { y: 60, autoAlpha: 0, duration: 1.4, ease: "power2.out", stagger: 0.12 });
    gsap.from("[data-c]", { y: 24, autoAlpha: 0, duration: 1, ease: "back.out(1.8)", stagger: 0.09, delay: 0.3 });
    gsap.utils.toArray<SVGGElement>(".us-kelp").forEach((k, i) => gsap.to(k, { rotate: i % 2 ? 4 : -4, duration: 3 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%" }));
    gsap.utils.toArray<SVGGElement>(".us-tail").forEach((tl) => gsap.to(tl, { scaleY: 0.7, rotate: 8, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "100% 50%" }));
    gsap.utils.toArray<SVGGElement>(".us-swim").forEach((f, i) => gsap.to(f, { y: i % 2 ? 8 : -8, x: i % 2 ? -6 : 6, duration: 2.2 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    gsap.utils.toArray<SVGCircleElement>(".us-cb").forEach((b, i) => gsap.fromTo(b, { y: 0, opacity: 0 }, { y: -H * 0.6, opacity: 1, duration: 5 + (i % 4), ease: "none", repeat: -1, delay: i * 0.6 }));
  }, [animate, kind]);

  const bub = Array.from({ length: 9 }, (_, i) => ({ x: (i * 67 + 30) % W, y: H - reefH + 10 - ((i * 23) % 60), r: 3 + (i % 4) * 2 }));
  const art = !list && t.mode !== "number";

  return (
    <div
      ref={ref}
      className={`${fontClass} @container relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", ...worldVars(design, { bg: "#BDEDE6", ink: SEA.ink, accent: "#C8553D", display: STACKS.sea.display, body: STACKS.sea.body }), background: "linear-gradient(180deg, #E4FAF6 0%, var(--w-bg) 38%, #6EC3C8 78%, #3A9DB0 100%)", color: "var(--w-ink)", fontFamily: "var(--w-body)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <Rays id={`${uid}-ray`} w={W} h={H * 0.85} n={5} />
        <path d={`M0 0 H${W} V10 C ${W * 0.85} 20 ${W * 0.7} 2 ${W * 0.55} 12 S ${W * 0.25} 22 ${W * 0.1} 10 S 0 12 0 12Z`} fill="#fff" opacity=".6" />
        {bub.map((b, i) => <circle key={i} className="us-cb" cx={b.x} cy={b.y} r={b.r} fill="none" stroke="#fff" strokeWidth="1.4" opacity={animate ? 0 : 0.7} />)}
        <g className="us-c-up">
          <Kelp x={wide ? 20 : 26} y={H + 6} h={H * (wide ? 0.75 : 0.55)} s={wide ? 0.6 : 0.85} />
          <Kelp x={wide ? 52 : 70} y={H + 6} h={H * (wide ? 0.5 : 0.38)} s={wide ? 0.55 : 0.75} c="#5FAE8C" flip />
          <Kelp x={W - (wide ? 20 : 26)} y={H + 6} h={H * (wide ? 0.7 : 0.5)} s={wide ? 0.6 : 0.85} flip />
          <Kelp x={W - (wide ? 52 : 70)} y={H + 6} h={H * (wide ? 0.42 : 0.32)} s={wide ? 0.55 : 0.75} c="#3F8A6E" />
        </g>
        <g transform={`translate(0 ${H - reefH})`}><Reef w={W} h={reefH} seed={kind.length} /></g>
        {art && !wide && (
          <g className="us-c-up">
            <Coral x={W * 0.24} y={H - reefH * 0.45} s={shape === "tall" ? 0.8 : 0.6} />
            <Anemone x={W * 0.72} y={H - reefH * 0.4} s={0.75} />
            <Starfish x={W * 0.5} y={H - reefH * 0.22} s={0.9} r={12} />
            <Shell x={W * 0.38} y={H - reefH * 0.15} s={0.7} r={-10} />
            <g className="us-swim"><Fish x={W * 0.8} y={H - reefH - (shape === "tall" ? 190 : 80)} s={shape === "tall" ? 0.7 : 0.5} flip /></g>
            <g className="us-swim"><Puffer x={W * 0.18} y={H - reefH - (shape === "tall" ? 120 : 60)} s={shape === "tall" ? 0.6 : 0.42} /></g>
            {shape === "tall" && <g className="us-swim"><Turtle x={W * 0.48} y={H * 0.62} s={0.75} /></g>}
            {shape === "tall" && <><Octopus x={W * 0.64} y={H - reefH * 0.62} s={0.55} /><Rock x={W * 0.66} y={H - reefH * 0.25} s={0.5} /></>}
          </g>
        )}
        {art && wide && !photoUrl && (
          <g className="us-c-up"><g className="us-swim"><Turtle x={140} y={H * 0.5} s={0.9} /></g><Coral x={110} y={H - 30} s={0.5} /></g>
        )}
        {(list || t.mode === "number") && (
          <g className="us-c-up">
            <g className="us-swim"><Fish x={W * 0.78} y={H - reefH - 30} s={0.4} flip /></g>
            <Starfish x={W * 0.3} y={H - reefH * 0.3} s={0.8} r={-10} />
          </g>
        )}
        {t.mode === "number" && (
          <g transform={`translate(${W / 2} ${H * 0.47})`}>
            <circle r={H * 0.24} fill="rgba(255,255,255,.25)" stroke="#fff" strokeWidth="3" />
            <ellipse cx={-H * 0.1} cy={-H * 0.12} rx={H * 0.04} ry={H * 0.07} transform="rotate(35)" fill="#fff" opacity=".55" />
          </g>
        )}
      </svg>

      {wide && photoUrl && art && (
        <div className="absolute left-[6%] top-1/2 aspect-square w-[34%] -translate-y-1/2 rounded-full p-[2.2%]" data-c="photo" style={{ background: "conic-gradient(from 210deg, #F3D9A0, #B8873C, #F6E2B0, #9C6E2E, #E9C77F, #B8873C, #F3D9A0)", boxShadow: "0 2cqw 4cqw -2cqw rgba(0,0,0,.5)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" data-edit-photo="photo" className="h-full w-full rounded-full object-cover" />
        </div>
      )}

      <div className="absolute flex justify-center" style={{ top: t.mode === "number" ? "16%" : wide ? "14%" : shape === "tall" ? "10%" : "11%", ...(wide ? { left: "44%", right: "5%" } : { left: "13%", right: "13%" }) }}>
        <CardCopy
          t={t}
          nameSize={wide ? 11 : shape === "tall" ? 20 : shape === "square" ? 15 : 17}
          gap={shape === "tall" ? 3 : 2}
          s={{
            eyebrow: { fontSize: wide ? "2.2cqw" : "3cqw", fontWeight: 800, letterSpacing: ".26em", textTransform: "uppercase", color: "#2A7F98" },
            name: { fontFamily: "var(--w-display)", fontWeight: 700, color: "var(--w-ink)", textShadow: "0 .5cqw 0 rgba(255,255,255,.6)" },
            line: { fontFamily: "var(--w-display)", fontWeight: 600, fontSize: wide ? "3.4cqw" : "4.6cqw", color: "var(--w-accent)" },
            lead: { fontSize: wide ? "2.6cqw" : shape === "tall" ? "4.2cqw" : "3.5cqw", lineHeight: 1.45, fontWeight: 600, opacity: 0.8, margin: 0 },
            meta: { fontSize: wide ? "2.4cqw" : "3.2cqw", fontWeight: 700, lineHeight: 1.45, background: "rgba(255,255,255,.6)", borderRadius: "999px", padding: wide ? "1cqw 3cqw" : "1.4cqw 4.2cqw" },
            footer: { fontFamily: "var(--w-display)", fontSize: wide ? "2.8cqw" : "3.6cqw", fontWeight: 600, opacity: 0.8 },
            headline: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: list ? "8cqw" : wide ? "6cqw" : "5.6cqw", lineHeight: 1.08, color: list || t.mode === "thanks" ? "var(--w-ink)" : "var(--w-accent)", margin: 0 },
            item: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: shape === "tall" ? "5.8cqw" : "4.6cqw" },
            detail: { fontSize: shape === "tall" ? "3.5cqw" : "3cqw", opacity: 0.7, fontWeight: 600 },
            number: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: "30cqw", color: "#fff", marginTop: "2cqw", textShadow: "0 .6cqw 0 rgba(18,59,74,.25)" },
            hashtag: { fontFamily: "var(--w-display)", fontWeight: 700, color: "var(--w-accent)" },
          }}
          ornament={t.mode === "names" || t.mode === "greeting" || t.mode === "thanks" ? <Wave /> : undefined}
        />
      </div>
      <Grain opacity={0.2} blend="overlay" />
    </div>
  );
}

const Wave = () => (
  <svg viewBox="0 0 200 16" style={{ width: "22cqw" }} aria-hidden data-c="orn"><path d="M2 9 C 18 1 34 1 50 9 S 82 17 98 9 S 130 1 146 9 S 182 17 198 9" fill="none" stroke="#2A7F98" strokeWidth="3" strokeLinecap="round" /></svg>
);
