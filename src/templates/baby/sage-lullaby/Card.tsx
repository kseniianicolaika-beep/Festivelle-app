"use client";
import type { CSSProperties, ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, shapeOf, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { CardFrame, Grain } from "../_shared/ui";
import { Eucalyptus, Stave } from "./art";
import { slWords } from "./words";
import { slFonts } from "./fonts";
import { SL_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

export default function SageLullabyCard({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const X = slWords(profile);
  const [a, b] = nameParts(profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const f = Math.min(fit(a, 7), b ? fit(b, 7) : 1) * sc;
  const top = (
    <div className="sl-in absolute inset-x-[6cqw] top-[5cqw] flex justify-between border-b border-[color-mix(in_oklab,var(--t-ink)_30%,transparent)] pb-[1.4cqw]" style={dl(0.2)}>
      <span className="lbl" style={{ fontSize: "1.6cqw" }}>{X.vol}</span>
      <span className="lbl" style={{ fontSize: "1.6cqw" }}>{kind === "save" ? "" : c.date}</span>
    </div>
  );

  let body: ReactNode;
  if (shape === "landscape") {
    body = (
      <>
        <Eucalyptus className="absolute -left-[4%] -top-[12%] w-[34%] rotate-[-14deg]" leaves={13} />
        <div className="absolute inset-y-[12%] left-[38%] right-[6%] flex flex-col justify-center">
          <E path="texts.headline" as="h2" className="d i sl-type block text-[var(--sl-deep)]" style={{ fontSize: "10cqw", lineHeight: 1, ...dl(0.8) }}>{c.headline}</E>
          <E path="texts.body" as="p" multiline className="d sl-in mt-[2cqw] block" style={{ fontSize: "2.8cqw", lineHeight: 1.5, ...dl(1.4) }}>{c.body}</E>
          <p className="lbl sl-in mt-[3cqw] text-[var(--sl-green)]" style={{ fontSize: "1.6cqw", ...dl(1.8) }}>{b ? `${a} & ${b}` : a}</p>
          <Stave className="sl-in mt-[3cqw] w-[70%] text-[var(--sl-deep)]" notes={6} />
        </div>
      </>
    );
  } else if (kind === "table") {
    body = (
      <div className="absolute inset-0 grid place-items-center">
        <Eucalyptus className="absolute -left-[6%] bottom-[-8%] w-[46%]" leaves={12} />
        <Eucalyptus className="absolute -right-[8%] -top-[10%] w-[40%] rotate-180" leaves={10} seed={8} variant="willow" />
        <div className="relative text-center">
          <E path="texts.headline" className="lbl sl-in block text-[var(--t-muted)]" style={{ fontSize: "2.6cqw", ...dl(0.5) }}>{c.headline}</E>
          <p className="d i sl-in text-[var(--sl-deep)]" style={{ fontSize: "40cqw", lineHeight: 0.9, ...dl(0.8) }}>{c.number}</p>
        </div>
      </div>
    );
  } else if (kind === "program" || kind === "menu") {
    const tall = kind === "menu";
    body = (
      <>
        {top}
        <Eucalyptus className={`absolute ${tall ? "-bottom-[2%] -right-[12%] w-[60%] rotate-[24deg]" : "-right-[8%] top-[10%] w-[30%] rotate-[8deg] opacity-80"}`} leaves={12} />
        <div className="absolute inset-x-[7cqw] bottom-[7cqw] top-[13cqw] flex flex-col">
          <p className="lbl sl-in text-[var(--sl-green)]" style={{ fontSize: "2cqw", ...dl(0.5) }}>{X.contents}</p>
          <E path="texts.headline" as="h2" className="d i sl-type mt-[1cqw] block text-[var(--sl-deep)]" style={{ fontSize: "10cqw", lineHeight: 1, ...dl(0.7) }}>{c.headline}</E>
          <ol className={`flex flex-col ${tall ? "mt-[14cqw] gap-[5cqw]" : "mt-auto"}`}>
            {c.items.map((it, i) => (
              <li key={i} className="sl-in flex gap-[3cqw] border-t border-[color-mix(in_oklab,var(--t-ink)_22%,transparent)] py-[2.4cqw]" style={dl(1 + i * 0.12)}>
                <span className="d i text-[var(--sl-green)]" style={{ fontSize: "4.4cqw", lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <E path={`items.${i}.title`} className="d block" style={{ fontSize: tall ? "5.4cqw" : "4.2cqw", lineHeight: 1.1 }}>{it.title}</E>
                  {it.detail && <E path={`items.${i}.detail`} className="mt-[.6cqw] block text-[var(--t-muted)]" style={{ fontSize: tall ? "3cqw" : "2.4cqw", lineHeight: 1.4 }}>{it.detail}</E>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </>
    );
  } else {
    // magazine cover
    const tall = shape === "tall";
    const sq = shape === "square";
    body = (
      <>
        {top}
        <div className="absolute inset-x-[6cqw]" style={{ top: tall ? "16cqw" : "10cqw" }}>
          {kind === "hashtag" ? (
            <>
              <E path="texts.body" className="lbl sl-in block text-[var(--sl-green)]" style={{ fontSize: "2.4cqw", ...dl(0.6) }}>{c.body}</E>
              <E path="texts.hashtag" className="d i sl-type mt-[2cqw] block text-[var(--sl-deep)]" style={{ fontSize: "11cqw", lineHeight: 1, ...dl(0.9) }}>{c.hashtag}</E>
            </>
          ) : (
            <>
              <E path="texts.eyebrow" className="lbl sl-in block text-[var(--sl-green)]" style={{ fontSize: tall ? "2.6cqw" : "2cqw", ...dl(0.5) }}>{kind === "event" ? c.headline : c.eyebrow}</E>
              <h2 className="d i mt-[1.4cqw] leading-[.86] tracking-[-.02em] text-[var(--sl-deep)]" style={{ fontSize: `${(tall ? 19 : sq ? 15 : 17) * f}cqw` }}>
                <E path="profile.partner1" className="sl-type block" style={dl(0.8)}>{a}</E>
                {b && <span className="sl-type block" style={dl(1.3)}><span className="not-italic text-[var(--sl-green)]">&amp;</span> <E path="profile.partner2">{b}</E></span>}
              </h2>
            </>
          )}
        </div>
        <Eucalyptus className="absolute w-[56%]" style={{ right: "-14%", bottom: tall ? "14%" : sq ? "-20%" : "6%" }} delay={0.3} leaves={14} />
        <div className="absolute left-[6cqw] w-[46%]" style={{ bottom: tall ? "26%" : sq ? "8%" : "17%" }}>
          {kind === "save" ? (
            <p className="d i sl-in text-[var(--sl-deep)]" style={{ fontSize: "7cqw", lineHeight: 1.05, ...dl(1.9) }}>{c.date}<span className="lbl mt-[1.6cqw] block not-italic text-[var(--t-muted)]" style={{ fontSize: "1.8cqw" }}>{c.where}</span></p>
          ) : kind !== "hashtag" && (
            <>
              {(c.lead || c.body) && !sq && (
                <E path={c.body ? "texts.body" : "profile.inviteLine"} as="p" multiline className="d sl-in block border-t border-[color-mix(in_oklab,var(--t-ink)_25%,transparent)] pt-[1.6cqw]" style={{ fontSize: tall ? "3.8cqw" : "3cqw", lineHeight: 1.35, ...dl(1.9) }}>{c.body || c.lead}</E>
              )}
              {kind !== "greeting" && <p className="lbl sl-in mt-[2cqw] text-[var(--t-muted)]" style={{ fontSize: tall ? "2.2cqw" : "1.7cqw", lineHeight: 1.8, ...dl(2.1) }}>{c.date}<br />{c.where}</p>}
            </>
          )}
        </div>
        {!sq && <Stave className="absolute inset-x-[6cqw] text-[var(--sl-deep)]" style={{ bottom: tall ? "8%" : "5%" }} notes={tall ? 8 : 9} />}
      </>
    );
  }

  return (
    <CardFrame id="sage-lullaby" kind={kind} animate={animate} className={`sl sl-linen ${slFonts} ${className}`} style={bxVars(theme, design, "modern")}>
      <style href="bx-sage-lullaby" precedence="default">{SL_CSS}</style>
      <Grain opacity={0.14} seed={21} />
      {body}
    </CardFrame>
  );
}
