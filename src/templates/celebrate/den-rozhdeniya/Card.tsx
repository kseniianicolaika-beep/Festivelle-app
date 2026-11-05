"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { GzhelRose, GzhelBorder, PlateRim, Teapot, DR_CSS } from "./art";
import { DR_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { cardText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const age = profile.age;
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 7.5 : tall ? 12 : 11) * sc, 7, 0.45);

  const plate = (w: number, num: number) => (
    <div className="relative shrink-0" style={{ width: `${w}cqw` }}>
      <PlateRim className="w-full" />
      <div className="absolute inset-[18%] flex flex-col items-center justify-center">
        <GzhelRose className="w-[52%]" />
        {age ? <p className="mt-[3%] leading-none text-[var(--t-accent)]" style={{ fontFamily: F.ruslan, fontSize: `${num}cqw` }}>{age}</p> : null}
      </div>
    </div>
  );
  const frame = (
    <>
      <div className="absolute inset-[3cqw] border-[0.6cqw] border-[var(--t-accent)]" />
      <div className="absolute inset-[4.6cqw] border border-[var(--t-accent)]/60" />
      <GzhelRose leaves={false} className="absolute left-[1cqw] top-[1cqw] w-[11cqw]" />
      <GzhelRose leaves={false} className="absolute right-[1cqw] top-[1cqw] w-[11cqw]" />
      <GzhelRose leaves={false} className="absolute bottom-[1cqw] left-[1cqw] w-[11cqw]" />
      <GzhelRose leaves={false} className="absolute bottom-[1cqw] right-[1cqw] w-[11cqw]" />
    </>
  );
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[0.8cqw]">
      <GzhelBorder className="w-[42cqw]" />
      {c.date && <p style={{ fontSize: wide ? "2.8cqw" : "4cqw" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: wide ? "1.8cqw" : "2.3cqw", letterSpacing: "0.3em" }}>{c.where}</E>}
      {c.footer && <E as="p" path={c.footerPath} className="block text-[var(--t-accent)]" style={{ fontFamily: F.marck, fontSize: "5cqw" }}>{c.footer}</E>}
    </div>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "3.6cqw", letterSpacing: "0.4em" }}>{c.headline}</E>
        <div className="relative w-[58cqw]">
          <PlateRim className="w-full" />
          <p className="absolute inset-0 grid place-items-center leading-none text-[var(--t-accent)]" style={{ fontFamily: F.ruslan, fontSize: `${26 * sc}cqw` }}>{c.number}</p>
        </div>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[12cqw] text-center">
        <GzhelRose className="w-[34cqw]" />
        <E as="p" path="texts.body" className="block text-[var(--t-ink)]" style={{ fontFamily: F.marck, fontSize: "7cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="block break-all leading-tight text-[var(--t-accent)]" style={{ fontFamily: F.ruslan, fontSize: `${fit(c.hashtag, 9, 10) * sc}cqw` }}>{c.hashtag}</E>
        <GzhelBorder className="w-[44cqw]" />
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[40%_1fr] items-center gap-[3cqw] px-[9cqw]">
        <Teapot className="w-full" />
        <div className="flex flex-col items-center gap-[1.6cqw] text-center">
          <E as="p" path="texts.headline" className="block leading-none text-[var(--t-accent)]" style={{ fontFamily: F.ruslan, fontSize: `${fit(c.headline, 8, 9) * sc}cqw` }}>{c.headline}</E>
          <GzhelBorder className="w-[30cqw]" />
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.6cqw", lineHeight: 1.5 }}>{c.body}</E>}
          <p className="text-[var(--t-accent)]" style={{ fontFamily: F.marck, fontSize: "4.8cqw" }}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[11cqw] py-[14cqw]" : "px-[11cqw] py-[10cqw]"}`}>
        <div className="flex w-full flex-col items-center gap-[1.6cqw]">
          {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.3cqw", letterSpacing: "0.35em" }}>{c.eyebrow}</E>}
          {!isList && c.showName && plate(tall ? 62 : square ? 34 : 48, tall ? 13 : square ? 7 : 10)}
          {isList && <GzhelRose className="w-[26cqw]" />}
          {c.headline && <E as="p" path="texts.headline" className="block leading-[1.05] text-[var(--t-accent)]" style={{ fontFamily: F.ruslan, fontSize: `${fit(c.headline, c.showName ? 7 : tall ? 11 : 9, 10)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="leading-[1.02] text-[var(--t-accent)]" style={{ fontFamily: F.ruslan, fontSize: `${nameSize}cqw` }}><E path="profile.partner1">{c.name}</E></h2>}
          {c.showName && c.line && <p style={{ fontFamily: F.marck, fontSize: tall ? "7cqw" : "5.6cqw", lineHeight: 1.1 }}>{c.line}</p>}
          {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[66cqw]" style={{ fontSize: tall ? "3.7cqw" : "3.1cqw", lineHeight: 1.5 }}>{c.lead}</E>}
          {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[68cqw]" style={{ fontSize: "3.2cqw", lineHeight: 1.5 }}>{c.body}</E>}
          {isList && (
            <ol className="w-full">
              {c.items.map((it, i) => (
                <li key={i} className="flex flex-col items-center border-b border-dashed border-[var(--t-accent)]/40" style={{ padding: tall ? "3cqw 0" : "2.2cqw 0" }}>
                  <E as="p" path={`items.${i}.title`} className="block text-[var(--t-accent)]" style={{ fontFamily: F.ruslan, fontSize: tall ? "5.6cqw" : "4.6cqw" }}>{it.title}</E>
                  {it.detail && <E as="p" path={`items.${i}.detail`} className="block" style={{ fontSize: tall ? "3.3cqw" : "2.7cqw", marginTop: "0.6cqw" }}>{it.detail}</E>}
                </li>
              ))}
            </ol>
          )}
          {isList && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.marck, fontSize: "6cqw" }}>{c.name}</p>}
        </div>
        <div className="w-full">{footer}</div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("den-rozhdeniya", theme, design, DR_VARS)} className={`${FONT_VARS} dr-porcelain text-[var(--t-ink)] shadow-[0_40px_80px_-40px_rgba(15,42,107,.45)] ${className}`} style={{ fontFamily: F.kurale }}>
      <style href="cel-dr" precedence="default">{DR_CSS}</style>
      <Grain opacity={0.05} />
      {frame}
      {body}
    </CardFrame>
  );
}
