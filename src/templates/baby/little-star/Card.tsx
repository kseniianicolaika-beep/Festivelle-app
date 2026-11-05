"use client";
import type { CSSProperties, ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, shapeOf, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { CardFrame } from "../_shared/ui";
import { Bunting, Chubby, Confetti, Rattle, Spark, Wreath, LS } from "./art";
import { Monogram } from "./bits";
import { lsFonts } from "./fonts";
import { LS_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

export default function LittleStarCard({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const [a, b] = nameParts(profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const f = Math.min(fit(a, 8), b ? fit(b, 8) : 1) * sc;
  const pal: Partial<Record<string, [string, string, string]>> = {
    // [backdrop, card, ink]
    story: ["var(--ls-navy)", "var(--ls-navy)", "var(--ls-cream)"],
    post: [LS.butter, LS.butter, "var(--ls-navy)"],
    hashtag: [LS.mint, LS.mint, "var(--ls-navy)"],
    table: [LS.sky, LS.sky, "var(--ls-navy)"],
  };
  const [bg, card, ink] = pal[kind] ?? [LS.sky, "var(--ls-cream)", "var(--ls-navy)"];
  const scallop = !pal[kind];

  const names = (size: number, inline = true) => (
    <h2 className="d leading-[.98]" style={{ fontSize: `${size * f}cqw` }}>
      <E path="profile.partner1" className={`ls-up ${inline ? "inline-block" : "block"}`} style={dl(1.6)}>{a}</E>
      {b && <span className={`h ls-up mx-[.15em] text-[.62em] text-[var(--ls-peach)] ${inline ? "inline-block" : "block"}`} style={dl(1.7)}>&amp;</span>}
      {b && <E path="profile.partner2" className={`ls-up ${inline ? "inline-block" : "block"}`} style={dl(1.8)}>{b}</E>}
    </h2>
  );
  const wreath = (w: number, inner?: ReactNode) => (
    <div className="relative mx-auto" style={{ width: `${w}cqw` }}>
      <div className="aspect-square"><Wreath className="h-full w-full" pop={animate} /></div>
      <div className="absolute inset-[18%] grid place-items-center rounded-full bg-[#fffaf0]">{inner ?? <Monogram a={a} b={b} size={`${w * 0.26}cqw`} />}</div>
    </div>
  );
  const pill = (t: string, bgc = "var(--ls-navy)", fg = "var(--ls-cream)") => t ? <span className="d ls-up inline-block rounded-full" style={{ background: bgc, color: fg, fontSize: "2.3cqw", padding: "1.2cqw 2.6cqw", letterSpacing: ".12em", fontWeight: 800, textTransform: "uppercase", ...dl(2.1) }}>{t}</span> : null;

  let body: ReactNode;
  if (shape === "landscape") {
    body = (
      <div className="absolute inset-[3cqw] flex items-center gap-[4cqw] rounded-[3cqw] px-[5cqw]" style={{ background: card }}>
        <Confetti n={16} seed={6} className="opacity-60" />
        <div className="relative shrink-0">{wreath(30)}<Rattle className="absolute -bottom-[2cqw] -right-[5cqw] w-[9cqw] rotate-[24deg]" /></div>
        <div className="relative flex-1 text-center">
          <E path="texts.headline" as="h2" className="d ls-stamp block leading-none" style={{ fontSize: "10cqw", ...dl(0.8) }}>{c.headline}</E>
          <E path="texts.body" as="p" multiline className="h ls-up mt-[2cqw] block" style={{ fontSize: "3.6cqw", lineHeight: 1.15, ...dl(1.2) }}>{c.body}</E>
          <div className="mt-[2.4cqw]">{pill(b ? `${a} & ${b}` : a, LS.butter, "var(--ls-navy)")}</div>
        </div>
      </div>
    );
  } else if (kind === "table") {
    body = <div className="absolute inset-0 grid place-items-center"><Confetti n={20} seed={5} />{wreath(78, <div className="text-center"><E path="texts.headline" className="lbl block" style={{ fontSize: "3.2cqw" }}>{c.headline}</E><p className="d ls-stamp leading-none" style={{ fontSize: "26cqw", ...dl(1.2) }}>{c.number}</p></div>)}</div>;
  } else if (kind === "hashtag") {
    body = (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[8cqw] text-center">
        <Confetti n={26} seed={8} />
        {wreath(48, <Chubby c={LS.butter} face className="ls-stamp w-[60%]" />)}
        <E path="texts.body" className="h ls-up mt-[5cqw] block" style={{ fontSize: "6.5cqw", ...dl(1.4) }}>{c.body}</E>
        <E path="texts.hashtag" className="d ls-up mt-[1cqw] block" style={{ fontSize: "8cqw", ...dl(1.6) }}>{c.hashtag}</E>
      </div>
    );
  } else {
    const list = kind === "program" || kind === "menu";
    const tall = shape === "tall";
    const sq = shape === "square";
    body = (
      <div className={`absolute ${scallop ? "inset-x-[4cqw] bottom-[4cqw] top-[2cqw] ls-scallop" : "inset-0"}`} style={{ background: card, "--r": "2.2cqw" } as CSSProperties}>
        <Confetti n={tall ? 30 : 18} seed={kind.length} className={kind === "story" ? "" : "opacity-60"} />
        <div className={`absolute inset-x-0 flex flex-col items-center px-[7cqw] text-center ${scallop ? "bottom-[6cqw] top-[7cqw]" : tall ? "bottom-[8cqw] top-[12cqw]" : "bottom-[6cqw] top-[7cqw]"}`}>
          {list ? (
            <>
              {wreath(30, <Chubby c={LS.butter} face className="w-[62%]" />)}
              <E path="texts.headline" as="h2" className="d ls-up mt-[3cqw] block leading-none" style={{ fontSize: "9cqw", ...dl(0.9) }}>{c.headline}</E>
              <div className="mt-[4cqw] flex w-full flex-1 flex-col justify-center gap-[3.2cqw]">
                {c.items.map((it, i) => (
                  <div key={i} className="ls-up flex items-start gap-[2.4cqw] text-left" style={dl(1.1 + i * 0.12)}>
                    <Chubby c={[LS.butter, LS.sky, LS.peach, LS.mint, LS.lilac][i % 5]} className="mt-[.4cqw] w-[5cqw] shrink-0" />
                    <div>
                      <E path={`items.${i}.title`} className="d block" style={{ fontSize: "4.4cqw", lineHeight: 1.1 }}>{it.title}</E>
                      {it.detail && <E path={`items.${i}.detail`} className="h block opacity-75" style={{ fontSize: "4cqw", lineHeight: 1.15 }}>{it.detail}</E>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {wreath(tall ? 58 : sq ? 40 : 54)}
              {c.eyebrow && <E path="texts.eyebrow" className="lbl ls-up mt-[4cqw] block opacity-70" style={{ fontSize: tall ? "2.8cqw" : "2.2cqw", ...dl(1.4) }}>{kind === "event" ? c.headline : c.eyebrow}</E>}
              <div className="mt-[1.4cqw]">{names(tall ? 13 : sq ? 9 : 11.5, !tall)}</div>
              {(c.lead || c.body) && kind !== "save" && kind !== "post" && (
                <E path={c.body ? "texts.body" : "profile.inviteLine"} as="p" multiline className="h ls-up mt-[2cqw] block" style={{ fontSize: tall ? "6cqw" : "4.4cqw", lineHeight: 1.12, ...dl(1.9) }}>{c.body || c.lead}</E>
              )}
              <div className="mt-auto flex flex-wrap items-center justify-center gap-[1.6cqw] pt-[2cqw]">
                {kind === "save" ? <span className="d ls-stamp" style={{ fontSize: "8cqw", ...dl(2) }}>{c.date}</span> : pill(c.date, kind === "story" ? LS.butter : "var(--ls-navy)", kind === "story" ? "var(--ls-navy)" : "var(--ls-cream)")}
                {pill(c.where, kind === "story" ? LS.peach : LS.butter, "var(--ls-navy)")}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <CardFrame id="little-star" kind={kind} animate={animate} className={`ls ${lsFonts} ${className}`} style={{ ...bxVars(theme, design, "playful"), background: bg, color: ink }}>
      <style href="bx-little-star" precedence="default">{LS_CSS}</style>
      {scallop && shape !== "landscape" && kind !== "table" && kind !== "hashtag" && <Bunting n={7} className="absolute inset-x-0 top-0 z-[2] h-[9cqw] w-full" />}
      {body}
      {kind === "story" && <Spark className="absolute right-[10%] top-[6%] w-[5cqw] text-[var(--ls-butter)]" />}
    </CardFrame>
  );
}
