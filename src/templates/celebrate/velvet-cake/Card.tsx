"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Cake, Drape, VC_CSS } from "./art";
import { VC_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { cardText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const shine = animate ? "vc-shine" : "";
  const age = profile.age;
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 8 : tall ? 15 : 13.5) * sc, 7, 0.45);
  const rule = <div className="flex items-center justify-center gap-[2cqw] text-[var(--t-gold)]"><span className="h-px w-[10cqw] bg-current" /><span className="h-[1.2cqw] w-[1.2cqw] rounded-full bg-current" /><span className="h-px w-[10cqw] bg-current" /></div>;
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[0.8cqw]">
      {rule}
      {c.date && <p className="italic" style={{ fontFamily: F.playfair, fontSize: wide ? "2.8cqw" : "4.2cqw" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: wide ? "1.7cqw" : "2.2cqw", letterSpacing: "0.4em" }}>{c.where}</E>}
      {c.footer && <E as="p" path={c.footerPath} className="block text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "5.4cqw" }}>{c.footer}</E>}
    </div>
  );
  const drapes = !wide && !square && (
    <>
      <Drape className="pointer-events-none absolute inset-y-0 left-0 h-full w-[13cqw]" />
      <Drape flip className="pointer-events-none absolute inset-y-0 right-0 h-full w-[13cqw]" />
    </>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "3.4cqw", letterSpacing: "0.5em" }}>{c.headline}</E>
        <p className={`vc-foil ${shine} italic leading-none`} style={{ fontFamily: F.playfair, fontSize: `${42 * sc}cqw` }}>{c.number}</p>
        <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "6cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[16cqw] text-center">
        <Cake lit className="w-[30cqw]" />
        <E as="p" path="texts.body" className="block text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "7cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`vc-foil ${shine} block break-all italic leading-tight`} style={{ fontFamily: F.playfair, fontSize: `${fit(c.hashtag, 10, 10) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[36%_1fr] items-center gap-[4cqw] px-[9cqw]">
        <Cake lit={false} className="w-full" />
        <div className="flex flex-col items-center gap-[1.4cqw] text-center">
          <E as="p" path="texts.headline" className={`vc-foil ${shine} block italic leading-none`} style={{ fontFamily: F.playfair, fontSize: `${fit(c.headline, 10, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block italic" style={{ fontSize: "3cqw", lineHeight: 1.4 }}>{c.body}</E>}
          {rule}
          <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "5cqw" }}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[16cqw] py-[14cqw]" : square ? "px-[10cqw] py-[7cqw]" : "px-[16cqw] py-[10cqw]"}`}>
        <div className="flex w-full flex-col items-center gap-[1.4cqw]">
          {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.2cqw", letterSpacing: "0.45em" }}>{c.eyebrow}</E>}
          {c.headline && <E as="p" path="texts.headline" className={`block italic leading-[1.02] ${c.showName ? "text-[var(--t-accent)]" : `vc-foil ${shine}`}`} style={{ fontFamily: c.showName ? F.vibes : F.playfair, fontSize: `${fit(c.headline, c.showName ? 9 : tall ? 13 : 11, 10)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="italic leading-[0.95]" style={{ fontFamily: F.playfair, fontSize: `${nameSize}cqw` }}><E path="profile.partner1" className={`vc-foil ${shine}`}>{c.name}</E></h2>}
          {c.showName && c.line && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: tall ? "8cqw" : "6.4cqw", lineHeight: 1.05 }}>{c.line}</p>}
        </div>
        {!isList && (
          <div className="relative flex w-full flex-col items-center">
            {age && c.showName ? <span className={`vc-foil ${shine} absolute right-[2cqw] top-[6%] italic leading-none`} style={{ fontFamily: F.playfair, fontSize: tall ? "16cqw" : "12cqw" }}>{age}</span> : null}
            <Cake lit className="drop-shadow-[0_2cqw_3cqw_rgba(0,0,0,.45)]" style={{ width: tall ? "62cqw" : square ? "28cqw" : "44cqw" }} />
          </div>
        )}
        {isList && <Cake lit className="drop-shadow-[0_2cqw_3cqw_rgba(0,0,0,.45)]" style={{ width: tall ? "34cqw" : "24cqw" }} />}
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[64cqw] italic" style={{ fontSize: tall ? "3.9cqw" : "3.3cqw", lineHeight: 1.4 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[66cqw] italic" style={{ fontSize: "3.2cqw", lineHeight: 1.45 }}>{c.body}</E>}
        {isList && (
          <ol className="w-full">
            {c.items.map((it, i) => (
              <li key={i} className="flex flex-col items-center" style={{ padding: tall ? "3.4cqw 0" : "2.4cqw 0", borderTop: i ? "1px solid rgba(216,166,87,.3)" : undefined }}>
                <E as="p" path={`items.${i}.title`} className="block italic" style={{ fontFamily: F.playfair, fontSize: tall ? "6cqw" : "4.8cqw" }}>{it.title}</E>
                {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "3.4cqw" : "2.8cqw", marginTop: "0.6cqw" }}>{it.detail}</E>}
              </li>
            ))}
          </ol>
        )}
        {isList && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "6.4cqw" }}>{c.name}</p>}
        <div className="w-full">{footer}</div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("velvet-cake", theme, design, VC_VARS)} className={`${FONT_VARS} vc-velvet ${animate ? "" : "vc-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(40,0,10,.8)] ${className}`} style={{ fontFamily: F.cormG }}>
      <style href="cel-vc" precedence="default">{VC_CSS}</style>
      <Grain opacity={0.16} blend="overlay" freq={1.1} />
      {drapes}
      {body}
    </CardFrame>
  );
}
