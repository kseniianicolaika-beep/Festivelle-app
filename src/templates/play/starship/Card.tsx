"use client";
import { useId, useRef } from "react";
import type { CardProps } from "../../types";
import { CardCopy } from "../_shared/CardCopy";
import { STACKS } from "../_shared/fonts";
import { Grain, cardText, fontClass, gsap, ratioNum, ratioOf, shapeOf, useAnim, worldVars } from "../_shared/kit";
import { Alien, Hills, Moon, Planet, Rocket, SP, Stars } from "./art";

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
  const hillH = wide ? 70 : shape === "tall" ? 130 : 100;

  useAnim(ref, ({ reduce }) => {
    if (!animate || reduce) return;
    gsap.from(".sp-c-rocket", { x: -160, y: 260, duration: 2.2, ease: "power3.out" });
    gsap.to(".sp-c-rocket", { y: -8, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.2 });
    gsap.to(".sp-flame", { scaleY: 1.25, scaleX: 0.9, duration: 0.09, yoyo: true, repeat: -1, ease: "none" });
    gsap.from("[data-c]", { y: 20, autoAlpha: 0, duration: 0.9, ease: "back.out(1.8)", stagger: 0.09, delay: 0.25 });
    gsap.utils.toArray<SVGElement>(".sp-tw").forEach((s, i) => gsap.to(s, { opacity: 0.15, duration: 0.9 + (i % 4) * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: (i % 6) * 0.3 }));
    gsap.to(".sp-wave", { rotate: -28, duration: 0.45, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }, [animate, kind]);

  const rx = wide ? W * 0.2 : W * 0.8;
  const ry = wide ? H * 0.62 : H - hillH - (shape === "tall" ? 120 : 40);
  const rs = wide ? 0.62 : shape === "tall" ? 0.62 : 0.44;

  return (
    <div
      ref={ref}
      className={`${fontClass} @container relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", ...worldVars(design, { bg: SP.night, ink: SP.cream, accent: SP.red, mustard: SP.mustard, display: STACKS.star.display, body: STACKS.star.body }), background: `radial-gradient(120% 70% at 50% 100%, #3B3F86 0%, ${SP.indigo} 45%, var(--w-bg) 100%)`, color: "var(--w-ink)", fontFamily: "var(--w-body)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <Stars w={W} h={H} n={Math.round(H / 7)} seed={kind.length + 3} />
        {!wide && <Moon x={W * 0.86} y={H * 0.09} r={30} />}
        {art && <Planet id={`${uid}-p1`} x={wide ? W * 0.08 : W * 0.1} y={wide ? H * 0.2 : H * 0.55} r={shape === "tall" ? 46 : 34} c={SP.lilac} ring />}
        <g transform={`translate(0 ${H - hillH})`}><Hills w={W} h={hillH} /></g>
        {art && !wide && <><Planet id={`${uid}-p2`} x={W * 0.18} y={H - hillH + 6} r={26} c={SP.teal} /><Alien x={W * 0.18} y={H - hillH - 16} s={0.45} /></>}
        {art && !(wide && photoUrl) && (
          <g transform={`translate(${rx} ${ry}) rotate(${wide ? 28 : 24})`}>
            <path d={`M0 30 C -6 140 -30 260 -40 ${H}`} stroke="#fff" strokeOpacity=".12" strokeWidth={38 * rs} fill="none" strokeLinecap="round" />
            <g className="sp-c-rocket"><Rocket id={`${uid}-r`} s={rs} flame /></g>
          </g>
        )}
        {(list || t.mode === "number") && <g transform={`translate(${W * 0.84} ${H - hillH - 20}) rotate(20)`}><g className="sp-c-rocket"><Rocket id={`${uid}-r2`} s={0.3} flame /></g></g>}
        {t.mode === "number" && <Planet id={`${uid}-tn`} x={W / 2} y={H * 0.47} r={H * 0.22} c={SP.red} ring tilt={-12} />}
      </svg>

      {wide && photoUrl && art && (
        <div className="absolute left-[6%] top-1/2 aspect-square w-[34%] -translate-y-1/2 overflow-hidden rounded-full ring-[1.6cqw] ring-[#E9DCC0]" data-c="photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" data-edit-photo="photo" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="absolute flex justify-center" style={{ top: t.mode === "number" ? "15%" : wide ? "14%" : shape === "tall" ? "10%" : "10%", ...(wide ? { left: "44%", right: "5%" } : { left: "10%", right: "10%" }) }}>
        <CardCopy
          t={t}
          nameSize={wide ? 9 : shape === "tall" ? 15 : shape === "square" ? 12 : 13}
          gap={shape === "tall" ? 3 : 2}
          s={{
            eyebrow: { fontSize: wide ? "2cqw" : "2.7cqw", fontWeight: 600, letterSpacing: ".34em", textTransform: "uppercase", color: "var(--w-mustard)", fontFamily: "ui-monospace, monospace" },
            name: { fontFamily: "var(--w-display)", fontWeight: 900, textTransform: "uppercase", color: "var(--w-ink)", textShadow: `0 0 4cqw rgba(242,184,75,.35), 0 .7cqw 0 ${SP.red}` },
            line: { fontFamily: "var(--w-display)", fontWeight: 500, fontSize: wide ? "3cqw" : "4cqw", color: "var(--w-mustard)" },
            lead: { fontSize: wide ? "2.5cqw" : shape === "tall" ? "4cqw" : "3.3cqw", lineHeight: 1.45, opacity: 0.85, margin: 0 },
            meta: { fontSize: wide ? "2.3cqw" : "3cqw", lineHeight: 1.5, border: "1px solid rgba(255,255,255,.25)", borderRadius: "999px", padding: wide ? "1cqw 3cqw" : "1.3cqw 4cqw", background: "rgba(255,255,255,.05)" },
            footer: { fontFamily: "var(--w-display)", fontSize: wide ? "2.6cqw" : "3.2cqw", fontWeight: 500, opacity: 0.8 },
            headline: { fontFamily: "var(--w-display)", fontWeight: 700, textTransform: "uppercase", fontSize: list ? "6.4cqw" : wide ? "5cqw" : "5cqw", lineHeight: 1.1, color: list || t.mode === "thanks" ? "var(--w-ink)" : "var(--w-mustard)", margin: 0 },
            item: { fontFamily: "var(--w-display)", fontWeight: 700, fontSize: shape === "tall" ? "5cqw" : "4cqw" },
            detail: { fontSize: shape === "tall" ? "3.4cqw" : "2.9cqw", opacity: 0.7 },
            number: { fontFamily: "var(--w-display)", fontWeight: 900, fontSize: "26cqw", color: "#fff", marginTop: "5cqw", textShadow: "0 .6cqw 0 rgba(0,0,0,.25)" },
            hashtag: { fontFamily: "var(--w-display)", fontWeight: 800, color: "var(--w-mustard)" },
          }}
          ornament={t.mode === "names" || t.mode === "greeting" || t.mode === "thanks" ? <Orbit /> : undefined}
        />
      </div>
      <Grain opacity={0.14} blend="overlay" />
    </div>
  );
}

const Orbit = () => (
  <svg viewBox="0 0 160 20" style={{ width: "20cqw" }} aria-hidden data-c="orn"><path d="M4 14 C 40 0 120 0 156 14" fill="none" stroke="#FFF4DC" strokeOpacity=".5" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" /><circle cx="80" cy="4" r="4" fill="#F2B84B" /></svg>
);
