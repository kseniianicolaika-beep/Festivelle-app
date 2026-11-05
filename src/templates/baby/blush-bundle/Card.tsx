"use client";
import type { CSSProperties, ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, shapeOf, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { CardFrame, Grain } from "../_shared/ui";
import { Booties, Bow, Seal } from "./art";
import { Envelope } from "./Envelope";
import { Bouquet } from "./Site";
import { bbFonts } from "./fonts";
import { BB_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

/** A silk band tied across the card with a bow. */
const Band = ({ vertical = false, at = "80%", bow = "28cqw" }: { vertical?: boolean; at?: string; bow?: string }) => (
  <>
    <div className="absolute z-[3]" style={vertical
      ? { top: 0, bottom: 0, left: at, width: "3.4cqw", background: "linear-gradient(90deg,#d98e9c,#f9dde1 40%,#e6a7b2 60%,#c47b8a)" }
      : { left: 0, right: 0, top: at, height: "3.4cqw", background: "linear-gradient(180deg,#d98e9c,#f9dde1 40%,#e6a7b2 60%,#c47b8a)" }} />
    <div className="bb-bloom absolute z-[4]" style={{ ...(vertical ? { left: `calc(${at} + 1.7cqw)`, top: "50%" } : { top: `calc(${at} + 1.7cqw)`, left: "50%" }), width: bow, transform: "translate(-50%,-42%)", ...dl(0.6) }}><Bow className="w-full" /></div>
  </>
);

export default function BlushBundleCard({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const [a, b] = nameParts(profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const f = Math.min(fit(a, 7), b ? fit(b, 7) : 1) * sc;

  const names = (size: number) => (
    <h2 className="s" style={{ fontSize: `${size * f}cqw` }}>
      <E path="profile.partner1" className="bb-fade block" style={dl(1)}>{a}</E>
      {b && <span className="bb-fade block text-[.55em] leading-[.9] text-[var(--bb-rose)]" style={dl(1.2)}>&amp;</span>}
      {b && <E path="profile.partner2" className="bb-fade block" style={dl(1.3)}>{b}</E>}
    </h2>
  );
  const eyebrow = (t: string, size = 2.1) => t ? <E path="texts.eyebrow" className="lbl bb-fade block text-[var(--t-muted)]" style={{ fontSize: `${size}cqw`, ...dl(0.8) }}>{t}</E> : null;
  const meta = (size = 3.2) => (c.date || c.where) && (
    <div className="d bb-fade italic" style={{ fontSize: `${size}cqw`, lineHeight: 1.45, ...dl(1.6) }}>{c.date && <div>{c.date}</div>}{c.where && <div className="text-[var(--t-muted)]">{c.where}</div>}</div>
  );
  const paper = (children: ReactNode) => (
    <div className="bb-letterpaper absolute inset-0">
      <Grain opacity={0.16} seed={13} />
      {children}
    </div>
  );

  let body: ReactNode;
  if (kind === "story") {
    body = (
      <div className="bb-wash absolute inset-0">
        <Bouquet className="-left-[12%] -top-[4%] w-[62%]" />
        <Bouquet className="-bottom-[6%] -right-[12%] w-[58%] rotate-180" flip delay={0.5} />
        <div className="absolute inset-x-[8%] top-[34%]">
          <div className="pt-[48%]">
            <Envelope seal={[...a][0]}>
              <div className="flex h-full flex-col items-center px-[5cqw] pt-[5cqw] text-center">
                <p className="lbl text-[2.2cqw] text-[var(--t-muted)]">{c.eyebrow}</p>
                <h2 className="s mt-[1cqw]" style={{ fontSize: `${12 * f}cqw` }}><E path="profile.partner1">{a}</E>{b && <span className="text-[var(--bb-rose)]"> &amp; </span>}{b && <E path="profile.partner2">{b}</E>}</h2>
                <p className="d mt-[1.6cqw] text-[3.4cqw] italic">{c.date}</p>
              </div>
            </Envelope>
          </div>
        </div>
        <p className="s bb-fade absolute inset-x-[10%] top-[80%] text-center text-[var(--bb-rose)]" style={{ fontSize: "8cqw", ...dl(4) }}>{c.lead}</p>
      </div>
    );
  } else if (shape === "landscape") {
    body = paper(
      <>
        <Band vertical at="36%" bow="16cqw" />
        <Bouquet className="-left-[6%] top-[4%] w-[34%]" />
        <Booties className="absolute bottom-[8%] left-[6%] w-[22%]" />
        <div className="absolute inset-y-[10%] left-[46%] right-[5%] flex flex-col items-center justify-center text-center">
          <E path="texts.headline" as="h2" className="s bb-fade block text-[var(--bb-rose)]" style={{ fontSize: "11cqw", ...dl(0.6) }}>{c.headline}</E>
          <E path="texts.body" as="p" multiline className="d bb-fade mt-[1.6cqw] block italic" style={{ fontSize: "2.8cqw", lineHeight: 1.45, ...dl(1) }}>{c.body}</E>
          <p className="s bb-fade mt-[2cqw]" style={{ fontSize: "5cqw", ...dl(1.4) }}>{b ? `${a} & ${b}` : a}</p>
        </div>
      </>,
    );
  } else if (kind === "table") {
    body = paper(
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <Bouquet className="-left-[10%] -top-[10%] w-[50%]" />
        <Bouquet className="-bottom-[10%] -right-[10%] w-[46%] rotate-180" flip />
        <Bow className="bb-fade w-[26cqw]" style={dl(0.4)} />
        <E path="texts.headline" className="lbl bb-fade mt-[2cqw] block text-[var(--t-muted)]" style={{ fontSize: "3cqw", ...dl(0.7) }}>{c.headline}</E>
        <p className="s bb-fade text-[var(--bb-rose)]" style={{ fontSize: "34cqw", lineHeight: 0.9, ...dl(1) }}>{c.number}</p>
      </div>,
    );
  } else {
    const list = kind === "program" || kind === "menu";
    const tall = shape === "tall";
    const sq = shape === "square";
    body = paper(
      <>
        <Bouquet className="-left-[12%] -top-[8%] w-[56%]" />
        <Bouquet className="-right-[14%] -top-[10%] w-[44%]" flip delay={0.4} />
        {!list && !sq && <Band at="83%" bow="24cqw" />}
        <div className={`absolute inset-x-[9%] flex flex-col items-center text-center ${sq ? "bottom-[8%] top-[26%]" : tall ? "bottom-[6%] top-[16%]" : "bottom-[20%] top-[24%]"}`}>
          {list ? (
            <>
              <E path="texts.headline" as="h2" className="s bb-fade block text-[var(--bb-rose)]" style={{ fontSize: "12cqw", ...dl(0.6) }}>{c.headline}</E>
              <div className={`flex w-full flex-col ${tall ? "mt-[8cqw] gap-[7cqw]" : "mt-[3cqw] flex-1 justify-center gap-[3cqw]"}`}>
                {c.items.map((it, i) => (
                  <div key={i} className="bb-fade" style={dl(0.9 + i * 0.12)}>
                    <E path={`items.${i}.title`} className="lbl block" style={{ fontSize: "2.6cqw" }}>{it.title}</E>
                    {it.detail && <E path={`items.${i}.detail`} className="d mt-[.6cqw] block italic text-[var(--t-muted)]" style={{ fontSize: "3.6cqw" }}>{it.detail}</E>}
                  </div>
                ))}
              </div>
              <Seal letter={[...a][0] ?? ""} className="mt-auto w-[10cqw]" />
            </>
          ) : kind === "hashtag" ? (
            <>
              <Booties className="w-[36%]" />
              <E path="texts.body" className="s bb-fade mt-[4cqw] block" style={{ fontSize: "8cqw", ...dl(0.8) }}>{c.body}</E>
              <E path="texts.hashtag" className="lbl bb-fade mt-[3cqw] block text-[var(--bb-rose)]" style={{ fontSize: "4cqw", letterSpacing: ".14em", ...dl(1.2) }}>{c.hashtag}</E>
            </>
          ) : (
            <>
              {eyebrow(kind === "event" ? c.headline : c.eyebrow, sq ? 2.4 : 2.1)}
              <div className="mt-[1.5cqw]">{names(sq ? 13 : 15)}</div>
              {kind === "save" && <p className="d bb-fade mt-[2cqw] italic text-[var(--bb-rose)]" style={{ fontSize: "6cqw", ...dl(1.5) }}>{c.date}</p>}
              {(c.lead || c.body) && kind !== "save" && !sq && (
                <E path={c.body ? "texts.body" : "profile.inviteLine"} as="p" multiline className="d bb-fade mt-[2cqw] block italic" style={{ fontSize: "3.3cqw", lineHeight: 1.45, ...dl(1.4) }}>{c.body || c.lead}</E>
              )}
              <div className="mt-auto">{kind === "save" ? <p className="lbl text-[var(--t-muted)]" style={{ fontSize: "2.2cqw" }}>{c.where}</p> : meta(sq ? 3 : 3.2)}</div>
            </>
          )}
        </div>
        {!list && !sq && c.footer && <E path="texts.footer" className="s bb-fade absolute inset-x-0 bottom-[4%] block text-center text-[var(--bb-rose)]" style={{ fontSize: "5cqw", ...dl(2) }}>{c.footer}</E>}
      </>,
    );
  }

  return (
    <CardFrame id="blush-bundle" kind={kind} animate={animate} className={`bb ${animate ? "bb-anim" : ""} ${bbFonts} ${className}`} style={bxVars(theme, design, "classic")}>
      <style href="bx-blush-bundle" precedence="default">{BB_CSS}</style>
      {body}
    </CardFrame>
  );
}
