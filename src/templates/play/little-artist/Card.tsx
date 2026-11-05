"use client";
import { useId, useRef } from "react";
import type { CardProps } from "../../types";
import { CardCopy } from "../_shared/CardCopy";
import { STACKS } from "../_shared/fonts";
import { Grain, cardText, fontClass, gsap, ratioNum, ratioOf, shapeOf, useAnim, worldVars } from "../_shared/kit";
import { Blob, Brush, Crayon, LA, PAINTS, Palette, WcDefs } from "./art";

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
    gsap.from(".la-c-blob", { scale: 0, transformOrigin: "50% 50%", duration: 1.6, ease: "expo.out", stagger: 0.12 });
    gsap.fromTo(".la-c-name", { clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0% -20% 0)", duration: 1.3, ease: "power2.inOut", delay: 0.5 });
    gsap.from("[data-c]:not([data-c=name])", { y: 14, autoAlpha: 0, duration: 0.9, ease: "back.out(2)", stagger: 0.08, delay: 0.9 });
    gsap.from(".la-c-char", { y: 120, duration: 1.2, ease: "back.out(1.4)", stagger: 0.12, delay: 0.3 });
    gsap.to(".la-brush", { rotate: 6, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" });
  }, [animate, kind]);

  const blobs = wide
    ? [[W * 0.62, H * 0.45, 130, 5], [W * 0.84, H * 0.6, 90, 1], [W * 0.15, H * 0.2, 50, 2]]
    : shape === "tall"
      ? [[W * 0.35, H * 0.26, 150, 5], [W * 0.68, H * 0.33, 130, 1], [W * 0.5, H * 0.18, 90, 3], [W * 0.85, H * 0.8, 60, 2], [W * 0.2, H * 0.62, 70, 6]]
      : [[W * 0.36, H * 0.33, 140, 5], [W * 0.68, H * 0.4, 120, 1], [W * 0.52, H * 0.22, 80, 3], [W * 0.1, H * 0.9, 50, 2], [W * 0.84, H * 0.72, 56, 6]];

  return (
    <div
      ref={ref}
      className={`${fontClass} @container relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", ...worldVars(design, { bg: LA.paper, ink: LA.ink, accent: LA.coral, display: STACKS.artist.display, body: STACKS.artist.body }), background: "var(--w-bg)", color: "var(--w-ink)", fontFamily: "var(--w-body)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <WcDefs id={uid} />
        {(art ? blobs : blobs.slice(0, 2).map(([x, y, r, c]) => [x, y, r * 0.8, c])).map(([x, y, r, c], i) => <Blob key={i} id={uid} x={x} y={y} r={r} ci={c} seed={i + kind.length} cls="la-c-blob" />)}
        {art && !wide && (
          <>
            <g className="la-c-char"><Palette x={W * 0.2} y={H - 60} s={shape === "tall" ? 0.9 : 0.7} r={-8} /></g>
            <g className="la-c-char"><Brush x={W * 0.84} y={H - 50} s={shape === "tall" ? 0.9 : 0.7} r={-28} c={LA.coral} /></g>
          </>
        )}
        {art && wide && !photoUrl && <g className="la-c-char"><Palette x={W * 0.17} y={H * 0.62} s={0.8} r={-8} /></g>}
        {(list || t.mode === "number") && <g className="la-c-char">{PAINTS.slice(0, 5).map((c, i) => <Crayon key={c} x={W * 0.3 + i * 26} y={H + 30} r={i % 2 ? 6 : -6} c={c} s={0.7} />)}</g>}
      </svg>
      {wide && photoUrl && art && (
        <figure className="absolute left-[6%] top-[14%] w-[34%] p-[1.4cqw]" data-c="photo" style={{ background: LA.sun, transform: "rotate(-3deg)", boxShadow: "0 2cqw 4cqw -2cqw rgba(53,42,69,.5)" }}>
          <div className="bg-white p-[1.2cqw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt="" data-edit-photo="photo" className="aspect-square w-full object-cover" />
          </div>
        </figure>
      )}
      <div className="absolute flex justify-center" style={{ top: list ? "8%" : t.mode === "number" ? "18%" : wide ? "14%" : shape === "tall" ? "12%" : "11%", ...(wide ? { left: photoUrl ? "45%" : "34%", right: "5%" } : { left: "9%", right: "9%" }) }}>
        <CardCopy
          t={t}
          nameSize={wide ? 15 : shape === "tall" ? 28 : shape === "square" ? 21 : 25}
          gap={shape === "tall" ? 2.4 : 1.4}
          nameWrap={(n) => <div className="la-c-name">{n}</div>}
          s={{
            eyebrow: { fontSize: wide ? "2.1cqw" : "2.8cqw", fontWeight: 700, letterSpacing: ".28em", textTransform: "uppercase", color: LA.violet },
            name: { fontFamily: "var(--w-display)", fontWeight: 700 },
            line: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: wide ? "4.4cqw" : "6.4cqw", color: "var(--w-accent)", lineHeight: 1 },
            lead: { fontSize: wide ? "2.4cqw" : shape === "tall" ? "3.8cqw" : "3.2cqw", lineHeight: 1.5, opacity: 0.85, margin: 0 },
            meta: { fontSize: wide ? "2.3cqw" : "3cqw", fontWeight: 600, lineHeight: 1.5, background: "rgba(255,255,255,.75)", borderRadius: "999px", padding: wide ? "1cqw 3cqw" : "1.2cqw 4cqw" },
            footer: { fontFamily: "var(--w-display)", fontSize: wide ? "4cqw" : "5cqw", fontWeight: 700, opacity: 0.85 },
            headline: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: list ? "12cqw" : wide ? "8cqw" : "8.4cqw", lineHeight: 0.95, color: list || t.mode === "thanks" ? "var(--w-ink)" : "var(--w-accent)", margin: 0 },
            item: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: shape === "tall" ? "8cqw" : "6.4cqw", lineHeight: 1 },
            detail: { fontSize: shape === "tall" ? "3.4cqw" : "2.9cqw", opacity: 0.7 },
            number: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: "40cqw", lineHeight: 0.9 },
            hashtag: { fontFamily: "var(--w-display)", fontWeight: 700, color: "var(--w-accent)" },
          }}
          ornament={t.mode === "names" || t.mode === "greeting" || t.mode === "thanks" ? <svg viewBox="0 0 200 20" style={{ width: "26cqw" }} aria-hidden data-c="orn"><path d="M4 12 C40 4 90 16 130 8 S 190 10 196 9" fill="none" stroke={LA.sun} strokeWidth="9" strokeLinecap="round" opacity=".85" /></svg> : undefined}
        />
      </div>
      <Grain opacity={0.32} />
    </div>
  );
}
