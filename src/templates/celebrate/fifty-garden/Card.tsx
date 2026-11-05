"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Eucalyptus, LongTable, FG_CSS } from "./art";
import { FG_VARS } from "./Site";
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
  const nameSize = fit(c.name, (wide ? 8 : tall ? 14 : 12.5) * sc, 8, 0.5);
  const num = (size: number) => age ? <p aria-hidden className="font-[250] italic leading-[0.78] tracking-[-0.05em] text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: `${size}cqw`, fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>{age}</p> : null;
  const caps = (s: string, size = 2.2, path?: string) => s ? (path ? <E as="p" path={path} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: `${size}cqw`, letterSpacing: "0.4em" }}>{s}</E> : <p className="uppercase text-[var(--t-muted)]" style={{ fontSize: `${size}cqw`, letterSpacing: "0.4em" }}>{s}</p>) : null;
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex w-full flex-col items-center gap-[0.8cqw] border-t border-[var(--t-ink)]/20 pt-[3cqw]">
      {c.date && <p className="italic text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: wide ? "2.8cqw" : "4cqw" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {caps(c.where, wide ? 1.7 : 2.1, c.wherePath)}
      {c.footer && <E as="p" path={c.footerPath} className="block italic" style={{ fontFamily: F.corm, fontSize: "4.4cqw" }}>{c.footer}</E>}
    </div>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center">
        <Eucalyptus seed={4} leaves={9} from={[30, 150]} ctrl={[150, 90]} to={[270, 150]} className="absolute top-[4cqw] w-[64cqw]" />
        {caps(c.headline, 3.4)}
        <p className="font-[250] italic leading-none text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: `${44 * sc}cqw` }}>{c.number}</p>
        <p className="italic" style={{ fontFamily: F.corm, fontSize: "5cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[10cqw] text-center">
        <Eucalyptus seed={6} leaves={11} className="absolute -left-[8cqw] -top-[6cqw] w-[56cqw]" />
        <Eucalyptus seed={9} leaves={10} from={[290, 20]} ctrl={[200, 200]} to={[20, 280]} className="absolute -bottom-[8cqw] -right-[8cqw] w-[52cqw]" />
        <E as="p" path="texts.body" className="relative block italic" style={{ fontFamily: F.corm, fontSize: "7cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="relative block break-all italic text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: `${fit(c.hashtag, 10, 10) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[1fr_1.1fr] items-center gap-[4cqw] px-[8cqw]">
        <div className="relative"><LongTable className="w-full" /></div>
        <div className="flex flex-col items-start gap-[1.6cqw]">
          <E as="p" path="texts.headline" className="block font-light italic leading-none" style={{ fontFamily: F.corm, fontSize: `${fit(c.headline, 10, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.3cqw", lineHeight: 1.6 }}>{c.body}</E>}
          <p className="italic text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: "3.6cqw" }}>— {c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[10cqw] pb-[12cqw] pt-[22cqw]" : square ? "px-[10cqw] py-[8cqw]" : "px-[10cqw] pb-[9cqw] pt-[16cqw]"}`}>
        <Eucalyptus seed={3} leaves={12} className="absolute -left-[10cqw] -top-[8cqw]" style={{ width: tall ? "70cqw" : "58cqw" }} />
        <Eucalyptus seed={8} leaves={9} from={[290, 20]} ctrl={[200, 200]} to={[20, 280]} className="absolute -bottom-[8cqw] -right-[10cqw]" style={{ width: tall ? "58cqw" : "44cqw" }} />
        <div className="relative flex w-full flex-col items-center gap-[1.8cqw]">
          {c.eyebrow && caps(c.eyebrow, 2.2, "texts.eyebrow")}
          {c.showName && !isList && num(tall ? 70 : square ? 34 : 54)}
          {c.headline && <E as="p" path="texts.headline" className={`block font-light italic leading-none ${c.showName ? "text-[var(--t-accent)]" : ""}`} style={{ fontFamily: F.corm, fontSize: `${fit(c.headline, c.showName ? 8 : tall ? 15 : 12, 10)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="font-light italic leading-[0.95]" style={{ fontFamily: F.corm, fontSize: `${age && !isList ? nameSize * 0.85 : nameSize}cqw` }}><E path="profile.partner1">{c.name}</E></h2>}
          {c.showName && caps(c.line, wide ? 1.7 : 2.2)}
          {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[66cqw] italic" style={{ fontFamily: F.corm, fontSize: tall ? "4.6cqw" : "3.8cqw", lineHeight: 1.4 }}>{c.lead}</E>}
          {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[68cqw] italic" style={{ fontFamily: F.corm, fontSize: "3.8cqw", lineHeight: 1.45 }}>{c.body}</E>}
          {isList && (
            <ol className="w-full text-left" style={{ marginTop: "3cqw" }}>
              {c.items.map((it, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] items-baseline border-t border-[var(--t-ink)]/15" style={{ gap: "3cqw", padding: tall ? "3.4cqw 0" : "2.6cqw 0" }}>
                  <span className="italic text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: tall ? "4cqw" : "3.2cqw" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <E as="p" path={`items.${i}.title`} className="block font-light italic leading-tight" style={{ fontFamily: F.corm, fontSize: tall ? "6.4cqw" : "5cqw" }}>{it.title}</E>
                    {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "2.9cqw" : "2.4cqw", marginTop: "0.8cqw", lineHeight: 1.5 }}>{it.detail}</E>}
                  </div>
                </li>
              ))}
            </ol>
          )}
          {isList && <p className="italic text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: "3.6cqw", marginTop: "2cqw" }}>{c.name}{age ? ` · ${age}` : ""}</p>}
        </div>
        <div className="relative w-full">{footer}</div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("fifty-garden", theme, design, FG_VARS)} className={`${FONT_VARS} fg-linen text-[var(--t-ink)] shadow-[0_40px_80px_-40px_rgba(38,51,42,.45)] ${className}`} style={{ fontFamily: F.montserrat }}>
      <style href="cel-fg" precedence="default">{FG_CSS}</style>
      <Grain opacity={0.1} />
      {body}
    </CardFrame>
  );
}
