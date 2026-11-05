"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, dateParts, fit, langOf, shapeOf, toRoman } from "../_shared/data";
import { CardRoot, ff } from "../_shared/ui";
import { BirchBranch, Crest, NevaScene } from "./art";
import { FACES, FONTS, sc as smallcaps } from "./faces";
import "./neva.css";

const SILVER = "#8a97a5";

export default function NevaCard({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const [a, b] = nameParts(profile);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const dp = dateParts(profile.date, langOf(profile));
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const still = !animate;
  const longest = b && b.length > a.length ? b : a;
  const ia = a[0] ?? "", ib = b ? b[0] ?? "" : undefined;
  const caps = (size: number, color = SILVER) => ({ ...smallcaps, fontSize: `${size}cqw`, color });
  const root = (children: React.ReactNode, cls = "") => (
    <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="neva-monogram" faces={FACES} fonts={FONTS} animate={animate} className={`neva neva-ivory wa-paper text-[var(--t-ink)] ${cls} ${className}`}>
      <div className="pointer-events-none absolute inset-[3cqw] z-[2] border border-[#c3ccd5]" />
      <div className="pointer-events-none absolute inset-[4cqw] z-[2] border border-[#dfe4ea]" />
      {children}
    </CardRoot>
  );
  const names = (size: number, row = false) => {
    const s = fit(longest, size * sc, 7);
    return (
      <div data-in className={`flex ${row ? "flex-row flex-wrap items-baseline justify-center gap-x-[2.4cqw]" : "flex-col items-center"} text-center leading-[1]`} style={ff.display}>
        <E path="profile.partner1" className="block" style={{ fontSize: `${s}cqw` }}>{a}</E>
        {b && <span className="block leading-[0.9]" style={{ ...ff.script, fontSize: `${s * 0.62}cqw`, color: SILVER }}>&amp;</span>}
        {b && <E path="profile.partner2" className="block" style={{ fontSize: `${s}cqw` }}>{b}</E>}
      </div>
    );
  };
  const meta = (size = 2.6) => (
    <div data-in className="flex flex-col items-center" style={{ gap: "0.8cqw" }}>
      {c.date && <p style={caps(size, "var(--t-ink)")}>{c.date}</p>}
      {c.where && <E as="p" path={c.wherePath} className="block italic text-[var(--t-muted)]" style={{ ...ff.display, fontSize: `${size * 1.15}cqw` }}>{c.where}</E>}
    </div>
  );
  const rule = (w = 10) => <div className="flex items-center justify-center" style={{ gap: "1.6cqw", color: SILVER }}><span className="h-px bg-current" style={{ width: `${w}cqw` }} /><span className="rotate-45 border border-current" style={{ width: "1.2cqw", height: "1.2cqw" }} /><span className="h-px bg-current" style={{ width: `${w}cqw` }} /></div>;
  const body = (cls: string, children: React.ReactNode) => <div className={`absolute z-[3] flex flex-col items-center text-center ${cls}`}>{children}</div>;
  const win = (cls: string, layout: "square" | "wide" | "tall" = "square", round = "rounded-full") => (
    <div className={`neva-frame absolute z-[3] overflow-hidden ${round} ${cls}`}><NevaScene layout={layout} className="h-full w-full" still={still} /></div>
  );

  if (kind === "save") {
    return root(<>
      {win("left-1/2 top-[9cqw] aspect-square w-[54cqw] -translate-x-1/2")}
      {body("inset-x-[8cqw] bottom-[9cqw] top-[68cqw] justify-between", <>
        <E as="p" path="texts.eyebrow" className="block leading-none" style={{ ...ff.script, fontSize: `${fit(c.eyebrow, 8.5, 15)}cqw`, color: SILVER }}>{c.eyebrow}</E>
        {names(8.5, true)}
        {dp && <p data-in className="wa-foil neva-silver leading-none" style={{ ...ff.display, fontSize: "11cqw" }}>{dp.dd} · {toRoman(+dp.mm)} · {dp.year}</p>}
        {c.where && <E as="p" path={c.wherePath} className="block" style={caps(2.6)}>{c.where}</E>}
      </>)}
    </>);
  }

  if (kind === "story") {
    return root(<>
      {win("inset-x-[9cqw] top-[9cqw] h-[44%]", "tall", "rounded-t-full")}
      <div className="absolute left-1/2 top-[calc(9cqw+44%)] z-[4] w-[22cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--t-bg)] p-[1.5cqw]" style={{ color: SILVER }}><Crest a={ia} b={ib} /></div>
      {body("inset-x-[8cqw] bottom-[9cqw] top-[calc(9cqw+44%+14cqw)] justify-between", <>
        <E as="p" path="texts.eyebrow" className="block" style={caps(3)}>{c.eyebrow}</E>
        {names(14)}
        {meta(3.1)}
        {c.footer && <E as="p" path={c.footerPath} className="block" style={{ ...ff.script, fontSize: "6cqw", color: SILVER }}>{c.footer}</E>}
      </>)}
    </>);
  }

  if (kind === "post") {
    return root(<>
      {win("left-1/2 top-[10cqw] aspect-square w-[50cqw] -translate-x-1/2")}
      {body("inset-x-[8cqw] bottom-[8cqw] top-[63cqw] justify-between", <>
        <E as="p" path="texts.eyebrow" className="block" style={caps(2.3)}>{c.eyebrow}</E>
        {names(7.5, true)}
        {c.date && <p style={caps(2.3, "var(--t-ink)")}>{c.date}</p>}
      </>)}
    </>);
  }

  if (kind === "table") {
    return root(<>
      {body("inset-0 justify-center", <>
        <div data-in className="w-[58cqw]" style={{ color: SILVER }}><Crest a={ia} b={ib} num={c.number} /></div>
        <E as="p" path="texts.headline" className="mt-[2cqw] block" style={caps(3)}>{c.headline}</E>
      </>)}
    </>);
  }

  if (shape === "wide") {
    return root(<>
      {win("left-[8cqw] top-1/2 aspect-square h-[70%] -translate-y-1/2")}
      {body("bottom-[8cqw] left-[52%] right-[7cqw] top-[8cqw] justify-center", <>
        <div className="w-[12cqw]" style={{ color: SILVER }}><Crest a={ia} b={ib} /></div>
        <E as="p" path="texts.headline" className="mt-[1cqw] block leading-none" style={{ ...ff.script, fontSize: `${9.5 * sc}cqw`, color: SILVER }}>{c.headline}</E>
        <E as="p" multiline path="texts.body" className="mt-[2cqw] block italic leading-snug" style={{ ...ff.display, fontSize: "2.8cqw" }}>{c.body}</E>
        <p className="mt-[2.4cqw]" style={caps(2.2, "var(--t-ink)")}>{b ? `${a} & ${b}` : a}</p>
      </>)}
    </>);
  }

  if (kind === "program" || kind === "menu") {
    const tall = kind === "menu";
    return root(<>
      {body(`inset-x-[9cqw] bottom-[9cqw] top-[9cqw] justify-between`, <>
        <div data-in className="flex flex-col items-center" style={{ gap: "1.4cqw" }}>
          <div className={tall ? "w-[24cqw]" : "w-[16cqw]"} style={{ color: SILVER }}><Crest a={ia} b={ib} /></div>
          <E as="p" path="texts.headline" className="block italic leading-none" style={{ ...ff.display, fontSize: `${(tall ? 11 : 7.5) * sc}cqw` }}>{c.headline}</E>
          {rule(tall ? 12 : 9)}
        </div>
        <ul data-in className="w-full">
          {c.items.map((it, i) => (
            <li key={i} className="flex flex-col items-center" style={{ padding: `${tall ? 3.2 : 1.8}cqw 0` }}>
              <E as="p" path={`items.${i}.title`} className="block" style={caps(tall ? 3.6 : 2.7, "var(--t-ink)")}>{it.title}</E>
              {it.detail && <E as="p" path={`items.${i}.detail`} className="block italic text-[var(--t-muted)]" style={{ ...ff.display, fontSize: `${tall ? 4.2 : 3}cqw`, marginTop: "0.6cqw" }}>{it.detail}</E>}
            </li>
          ))}
        </ul>
        <p style={{ ...ff.script, fontSize: `${tall ? 6 : 4.4}cqw`, color: SILVER }}>{b ? `${a} & ${b}` : a}</p>
      </>)}
    </>);
  }

  if (kind === "hashtag") {
    return root(<>
      <BirchBranch className="absolute left-[2cqw] top-[2cqw] z-[3] w-[30cqw]" seed={3} color={SILVER} />
      {body("inset-x-[9cqw] bottom-[10cqw] top-[14cqw] justify-between", <>
        <div className="w-[32cqw]" style={{ color: SILVER }}><Crest a={ia} b={ib} /></div>
        <p data-in style={{ ...ff.script, fontSize: "7.5cqw", color: SILVER }}>{c.body}</p>
        <E as="p" path="texts.hashtag" className="block break-all leading-tight" style={{ ...ff.display, fontSize: `${fit(c.hashtag, 8, 14) * sc}cqw` }}>{c.hashtag}</E>
        <p style={caps(2.3)}>{b ? `${a} & ${b}` : a}</p>
      </>)}
    </>);
  }

  // invite, event, welcome, greeting
  const sign = kind === "welcome";
  const greeting = kind === "greeting";
  return root(<>
    <BirchBranch className="absolute left-[2cqw] top-[2cqw] z-[3] w-[26cqw]" seed={3} color={SILVER} />
    {sign && <BirchBranch className="absolute right-[2cqw] top-[2cqw] z-[3] w-[22cqw]" seed={8} color={SILVER} flip />}
    {body(`inset-x-[9cqw] bottom-[9cqw] top-[10cqw] justify-between`, <>
      <div data-in className="flex flex-col items-center" style={{ gap: "2cqw" }}>
        <div className={sign ? "w-[30cqw]" : "w-[24cqw]"} style={{ color: SILVER }}><Crest a={ia} b={ib} /></div>
        {kind === "event" ? (
          <>
            <p style={caps(2.3)}>{c.lead}</p>
            <E as="p" path="texts.headline" className="block italic leading-none" style={{ ...ff.display, fontSize: `${fit(c.headline, 9, 12) * sc}cqw` }}>{c.headline}</E>
          </>
        ) : (
          c.eyebrow && <E as="p" path="texts.eyebrow" className="block" style={caps(sign ? 2.8 : 2.4)}>{c.eyebrow}</E>
        )}
      </div>
      {names(kind === "event" ? 7.5 : sign ? 14 : greeting ? 10 : 12, kind === "event")}
      {kind === "invite" && c.lead && <E as="p" multiline path={c.leadPath} className="block max-w-[68cqw] italic leading-snug text-[var(--t-muted)]" style={{ ...ff.display, fontSize: "3.3cqw" }}>{c.lead}</E>}
      {greeting && c.body && <E as="p" multiline path="texts.body" className="block italic leading-snug text-[var(--t-muted)]" style={{ ...ff.display, fontSize: "3.6cqw" }}>{c.body}</E>}
      <div className="flex flex-col items-center" style={{ gap: "2cqw" }}>
        {rule()}
        {meta(sign ? 3 : 2.5)}
        {c.footer && <E as="p" path={c.footerPath} className="block" style={{ ...ff.script, fontSize: "5.5cqw", color: SILVER }}>{c.footer}</E>}
      </div>
    </>)}
  </>);
}
