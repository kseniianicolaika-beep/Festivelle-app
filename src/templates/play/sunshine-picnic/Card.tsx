"use client";
import { useId, useRef } from "react";
import type { CardProps } from "../../types";
import { CardCopy } from "../_shared/CardCopy";
import { STACKS } from "../_shared/fonts";
import { Grain, cardText, fontClass, gsap, ratioNum, ratioOf, shapeOf, useAnim, worldVars } from "../_shared/kit";
import { Basket, Blanket, Grass, Kite, Marigold, PC, Squirrel, Sun, Toran, Tree } from "./art";

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
  const grassH = wide ? 80 : shape === "tall" ? 150 : 120;

  useAnim(ref, ({ reduce }) => {
    if (!animate || reduce) return;
    gsap.from(".pc-c-fly", { y: 300, x: -60, rotate: -40, duration: 2, ease: "power3.out", stagger: 0.2 });
    gsap.fromTo(".pc-c-str", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.8, ease: "power2.out", stagger: 0.2 });
    gsap.from("[data-c]", { y: 20, scale: 0.92, autoAlpha: 0, duration: 0.9, ease: "back.out(2)", stagger: 0.08, delay: 0.4 });
    gsap.to(".pc-rays", { rotate: 360, duration: 50, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
    gsap.utils.toArray<SVGGElement>(".pc-kite").forEach((k, i) => gsap.to(k, { rotate: i % 2 ? 6 : -6, y: -8, duration: 2 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 60%" }));
    gsap.utils.toArray<SVGGElement>(".pc-drop").forEach((d, i) => gsap.to(d, { rotate: i % 2 ? 5 : -5, duration: 1.8 + (i % 4) * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" }));
  }, [animate, kind]);

  const polaroid = !!photoUrl && (kind === "post" || kind === "thankyou");
  const kx = wide ? W * 0.12 : W * 0.15;
  const ky = wide ? H * 0.38 : shape === "tall" ? H * 0.58 : H * 0.6;

  return (
    <div
      ref={ref}
      className={`${fontClass} @container relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", ...worldVars(design, { bg: "#FFF3DA", ink: PC.ink, accent: PC.flame, display: STACKS.picnic.display, body: STACKS.picnic.body }), background: `linear-gradient(180deg, ${PC.sky} 0%, #E4F3EE 40%, var(--w-bg) 78%)`, color: "var(--w-ink)", fontFamily: "var(--w-body)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        {!wide && !(polaroid && shape === "square") && <Sun x={W * 0.86} y={H * 0.14} s={0.44} />}
        {art && !polaroid && (
          <>
            <path className="pc-c-str" d={`M${kx} ${ky + 20} C ${kx + 40} ${ky + 120} ${W * 0.4} ${H - 60} ${W * 0.48} ${H + 10}`} fill="none" stroke={PC.ink} strokeOpacity=".35" strokeWidth="1.2" />
            <g className="pc-c-fly"><Kite x={kx} y={ky} s={wide ? 0.5 : 0.55} r={-14} /></g>
            {!wide && <><path className="pc-c-str" d={`M${W * 0.84} ${ky + 50} C ${W * 0.8} ${ky + 150} ${W * 0.6} ${H - 40} ${W * 0.52} ${H + 10}`} fill="none" stroke={PC.ink} strokeOpacity=".35" strokeWidth="1.2" /><g className="pc-c-fly"><Kite x={W * 0.84} y={ky + 30} s={0.4} r={12} a={PC.teal} b={PC.pink} /></g></>}
          </>
        )}
        <g transform={`translate(0 ${H - grassH})`}><Grass w={W} h={grassH} /></g>
        {art && !wide && <><Tree x={W * 0.04} y={H - 12} s={shape === "tall" ? 0.6 : 0.5} /><Tree x={W * 0.98} y={H - 8} s={shape === "tall" ? 0.55 : 0.45} /></>}
        {art && !wide && !polaroid && <><Blanket id={`${uid}-b`} x={W / 2} y={H - grassH * 0.32} s={0.55} /><Basket x={W * 0.58} y={H - grassH * 0.32} s={0.55} /><Squirrel x={W * 0.38} y={H - grassH * 0.22} s={0.55} /></>}
        {art && wide && <Basket x={W * 0.9} y={H - 18} s={0.5} />}
        {(list || t.mode === "number") && <><Kite x={W * 0.86} y={H - grassH - 50} s={0.32} r={14} cls="pc-c-fly" /><Squirrel x={W * 0.18} y={H - grassH * 0.4} s={0.5} /></>}
        {t.mode === "number" && <Sun x={W / 2} y={H * 0.5} s={H / 360} />}
        <Toran w={W} sag={wide ? 14 : 22} n={wide ? 16 : 13} y={-6} />
      </svg>
      {polaroid && (
        <figure className="absolute bg-white p-[1.6cqw] pb-[6cqw] shadow-[0_2cqw_4cqw_-2cqw_rgba(74,35,16,.5)]" data-c="photo" style={wide ? { left: "7%", top: "20%", width: "34%", transform: "rotate(-4deg)" } : { left: "7%", top: "19%", width: "40%", transform: "rotate(-4deg)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl!} alt="" data-edit-photo="photo" className="aspect-square w-full object-cover" />
        </figure>
      )}
      <div className="absolute flex justify-center" style={{ top: list ? "15%" : t.mode === "number" ? "16%" : polaroid && !wide ? "22%" : wide ? "20%" : shape === "tall" ? "15%" : "16%", ...(wide || polaroid ? { left: polaroid ? "50%" : "26%", right: "5%" } : { left: "12%", right: "12%" }) }}>
        <CardCopy
          t={t}
          nameSize={polaroid ? 9 : wide ? 10 : shape === "tall" ? 19 : shape === "square" ? 13 : 16}
          gap={shape === "tall" ? 2.8 : 1.8}
          s={{
            eyebrow: { fontSize: wide ? "2.1cqw" : "2.8cqw", fontWeight: 800, letterSpacing: ".26em", textTransform: "uppercase", color: "var(--w-accent)" },
            name: { fontFamily: "var(--w-display)", fontWeight: 800, textShadow: `0 .6cqw 0 ${PC.marigold}` },
            line: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: wide ? "3.2cqw" : "4.4cqw", color: "var(--w-accent)" },
            lead: { fontSize: wide ? "2.4cqw" : shape === "tall" ? "4cqw" : "3.3cqw", lineHeight: 1.45, fontWeight: 600, opacity: 0.8, margin: 0 },
            meta: { fontSize: wide ? "2.3cqw" : "3.1cqw", fontWeight: 700, lineHeight: 1.45, background: "rgba(255,255,255,.75)", borderRadius: "999px", padding: wide ? "1cqw 3cqw" : "1.3cqw 4cqw" },
            footer: { fontFamily: "var(--w-display)", fontSize: wide ? "2.8cqw" : "3.6cqw", fontWeight: 700, opacity: 0.8 },
            headline: { fontFamily: "var(--w-display)", fontWeight: 800, fontSize: list ? "8cqw" : wide ? "5.4cqw" : "6cqw", lineHeight: 1.05, color: list || t.mode === "thanks" ? "var(--w-ink)" : "var(--w-accent)", margin: 0 },
            item: { fontFamily: "var(--w-display)", fontWeight: 800, fontSize: shape === "tall" ? "5.8cqw" : "4.6cqw" },
            detail: { fontSize: shape === "tall" ? "3.5cqw" : "3cqw", opacity: 0.7, fontWeight: 600 },
            number: { fontFamily: "var(--w-display)", fontWeight: 800, fontSize: "26cqw", color: PC.ink, marginTop: "5cqw" },
            hashtag: { fontFamily: "var(--w-display)", fontWeight: 800, color: "var(--w-accent)" },
          }}
          ornament={t.mode === "names" || t.mode === "greeting" || t.mode === "thanks" ? <svg viewBox="-60 -10 120 20" style={{ width: "18cqw" }} aria-hidden data-c="orn"><path d="M-56 0 H56" stroke={PC.marigold} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" /><Marigold s={0.7} /></svg> : undefined}
        />
      </div>
      <Grain opacity={0.24} />
    </div>
  );
}
