"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { DiscoBall, Flecks, Sparkle, DT_CSS } from "./art";
import { DT_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { cardText, shapeOf, fit, dateParts } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide";
  const tall = shape === "tall";
  const age = profile.age;
  const dp = dateParts(profile, kind === "event" ? profile.events?.[design.eventIndex ?? 0]?.date : undefined);
  const nameSize = fit(c.name.toUpperCase(), (wide ? 9 : tall ? 14 : 12.5) * sc, 6.5, 0.4);
  const isList = kind === "menu" || kind === "program";

  const neonAge = (size: number) => age ? (
    <div aria-hidden className="flex justify-center leading-[0.8]" style={{ fontFamily: F.monoton, fontSize: `${size}cqw` }}>
      {String(age).split("").map((d, i) => <span key={i} className={`dt-neon ${animate ? "dt-neon-flicker" : ""}`} style={{ animationDelay: `${i * 1.7}s` }}>{d}</span>)}
    </div>
  ) : null;

  const name = (size = nameSize) => (
    <h2 className="font-black uppercase leading-[0.9]" style={{ fontFamily: F.unb, fontSize: `${size}cqw`, letterSpacing: "-0.03em" }}>
      <E path="profile.partner1" className="dt-chrome">{c.name}</E>
    </h2>
  );
  const pill = (c.date || c.where) && (
    <div className="flex flex-col items-center gap-[1.4cqw]">
      {c.date && (
        <p className="rounded-full bg-[var(--t-accent)] font-extrabold uppercase text-[#1a0b2a]" style={{ fontSize: wide ? "2.2cqw" : "3.1cqw", padding: "1.2cqw 3.6cqw", letterSpacing: "0.02em" }}>
          {dp && kind !== "save" ? `${dp.weekday} ${dp.dd}.${dp.mm}.${dp.yy}` : c.date}{c.time ? ` · ${c.time}` : ""}
        </p>
      )}
      {c.where && <E as="p" path={c.wherePath} className="block font-bold uppercase text-[var(--t-muted)]" style={{ fontSize: wide ? "1.8cqw" : "2.5cqw", letterSpacing: "0.3em" }}>{c.where}</E>}
    </div>
  );
  const eyebrow = c.eyebrow && <E as="p" path="texts.eyebrow" className="block font-bold uppercase text-[var(--t-gold)]" style={{ fontSize: wide ? "1.8cqw" : "2.5cqw", letterSpacing: "0.4em" }}>{c.eyebrow}</E>;

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block font-bold uppercase text-[var(--t-gold)]" style={{ fontSize: "4cqw", letterSpacing: "0.5em" }}>{c.headline}</E>
        <p className="dt-neon leading-[0.85]" style={{ fontFamily: F.monoton, fontSize: `${46 * sc}cqw` }}>{c.number}</p>
        <p className="font-black uppercase" style={{ fontSize: "4cqw" }}><span className="dt-chrome">{c.name}{age ? ` × ${age}` : ""}</span></p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[9cqw] text-center">
        <E as="p" path="texts.body" className="block text-[var(--t-gold)]" style={{ fontFamily: F.caveat, fontSize: "8cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="dt-chrome block break-all font-black uppercase leading-[0.95]" style={{ fontSize: `${fit(c.hashtag, 12, 9) * sc}cqw`, letterSpacing: "-0.03em" }}>{c.hashtag}</E>
        <div className="flex gap-[2cqw] text-[var(--t-accent)]"><Sparkle className="w-[4cqw]" /><Sparkle className="w-[4cqw]" /><Sparkle className="w-[4cqw]" /></div>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[42%_1fr] items-center px-[7cqw]">
        <div className="relative flex flex-col items-center">{neonAge(30) ?? <DiscoBall string={false} twinkle={animate} className="w-[26cqw]" />}</div>
        <div className="flex flex-col items-start gap-[2cqw]">
          <E as="p" path="texts.headline" className="dt-chrome block font-black uppercase leading-[0.9]" style={{ fontSize: `${fit(c.headline, 10, 9) * sc}cqw`, letterSpacing: "-0.03em" }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block max-w-[46cqw] font-light" style={{ fontSize: "2.5cqw", lineHeight: 1.45 }}>{c.body}</E>}
          <p className="text-[var(--t-gold)]" style={{ fontFamily: F.caveat, fontSize: "5cqw" }}>— {c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[9cqw] pb-[12cqw] pt-[2cqw]" : "px-[8cqw] pb-[8cqw] pt-0"}`}>
        <div className="relative flex w-full flex-col items-center">
          <DiscoBall twinkle={animate} className={animate ? "dt-sway" : ""} style={{ width: `${tall ? 36 : shape === "square" ? 18 : isList ? 18 : 26}cqw`, marginTop: tall ? "-8cqw" : "-6cqw" }} />
        </div>
        <div className="relative flex w-full flex-col items-center gap-[2cqw]">
          {c.showName && neonAge(tall ? 62 : shape === "square" ? 34 : 50)}
          {eyebrow}
          {c.headline && <E as="p" path="texts.headline" className={`block font-black uppercase leading-[0.95] ${c.showName ? "text-[var(--t-accent)]" : "dt-chrome"}`} style={{ fontSize: `${fit(c.headline, c.showName ? 8 : tall ? 12 : 10, 10)}cqw`, letterSpacing: "-0.02em" }}>{c.headline}</E>}
          {c.showName && name(age ? nameSize * 0.9 : nameSize)}
          {c.showName && c.line && kind !== "welcome" && <p className="font-medium uppercase text-[var(--t-muted)]" style={{ fontSize: wide ? "1.8cqw" : "2.6cqw", letterSpacing: "0.3em" }}>{c.line}</p>}
          {kind === "welcome" && <p className="text-[var(--t-gold)]" style={{ fontFamily: F.caveat, fontSize: "7cqw" }}>{c.line}</p>}
          {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[74cqw] font-light" style={{ fontSize: tall ? "3.6cqw" : "3cqw", lineHeight: 1.45 }}>{c.lead}</E>}
          {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[76cqw] font-light" style={{ fontSize: "3.1cqw", lineHeight: 1.5 }}>{c.body}</E>}
          {isList && (
            <ol className="w-full text-left" style={{ marginTop: "2cqw" }}>
              {c.items.map((it, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] items-baseline border-t border-white/15" style={{ gap: "3cqw", padding: tall ? "3.4cqw 0" : "2.4cqw 0" }}>
                  <span className="text-[var(--t-accent)]" style={{ fontFamily: F.monoton, fontSize: tall ? "7cqw" : "5.5cqw" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <E as="p" path={`items.${i}.title`} className="block font-extrabold uppercase leading-tight" style={{ fontSize: tall ? "4.6cqw" : "3.8cqw" }}>{it.title}</E>
                    {it.detail && <E as="p" path={`items.${i}.detail`} className="block font-light text-[var(--t-muted)]" style={{ fontSize: tall ? "3cqw" : "2.5cqw", marginTop: "0.6cqw" }}>{it.detail}</E>}
                  </div>
                </li>
              ))}
            </ol>
          )}
          {isList && <p className="text-[var(--t-gold)]" style={{ fontFamily: F.caveat, fontSize: "6cqw" }}>{c.name}{age ? ` × ${age}` : ""}</p>}
        </div>
        <div className="relative w-full">
          {pill}
          {c.footer && <E as="p" path={c.footerPath} className="mt-[2cqw] block text-[var(--t-gold)]" style={{ fontFamily: F.caveat, fontSize: "5.4cqw" }}>{c.footer}</E>}
        </div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("dirty-thirty", theme, design, DT_VARS)} className={`${FONT_VARS} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(40,10,70,.8)] ${className}`} style={{ background: "radial-gradient(90% 55% at 50% 12%, #4a2477 0%, #26113f 50%, #140a24 100%)", fontFamily: F.unb }}>
      <style href="cel-dt" precedence="default">{DT_CSS}</style>
      <div className="absolute inset-0 overflow-hidden opacity-70"><Flecks count={34} spin={false} size="240cqw" /></div>
      <Grain opacity={0.16} blend="overlay" />
      {body}
    </CardFrame>
  );
}
