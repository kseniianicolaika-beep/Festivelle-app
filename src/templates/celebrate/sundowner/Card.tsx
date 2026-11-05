"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Sun, Palm, Shimmer, Wave, SKY, SEA, SD_CSS } from "./art";
import { SD_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { cardText, shapeOf, fit, dateParts } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const age = profile.age;
  const isList = kind === "menu" || kind === "program";
  const dp = dateParts(profile, kind === "event" ? profile.events?.[design.eventIndex ?? 0]?.date : undefined);
  const nameSize = fit(c.name.toUpperCase(), (wide ? 9 : tall ? 16 : 14) * sc, 6, 0.4);
  // horizon height as a share of the card: list pieces keep a short sunset band at the top
  const horizon = isList ? (tall ? 26 : 30) : wide ? 62 : tall ? 50 : square ? 58 : 52;

  const scene = (
    <>
      <div className="absolute inset-x-0 top-0" style={{ height: `${horizon}%`, background: SKY }} />
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: `${horizon}%` }}>
        <Sun className="absolute left-1/2 -translate-x-1/2" style={{ width: isList ? "46cqw" : wide ? "34cqw" : "70cqw", bottom: isList ? "-18cqw" : wide ? "-12cqw" : "-26cqw" }} />
        {age && !isList && kind !== "table" && <p aria-hidden className="absolute inset-x-0 text-center font-extrabold leading-[0.8] tracking-[-0.06em] text-[#fff3e3] mix-blend-soft-light" style={{ fontFamily: F.brico, fontSize: wide ? "34cqw" : "62cqw", bottom: "-0.12em" }}>{age}</p>}
      </div>
      <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: `${horizon}%`, background: SEA }}>
        {!isList && <div className="absolute left-1/2 top-0 h-[30%] w-[70cqw] -translate-x-1/2 opacity-70"><Shimmer className="h-full w-full" lines={7} /></div>}
      </div>
      <div className="absolute inset-x-0 h-px bg-[#ffe0a3]/70" style={{ top: `${horizon}%` }} />
      {!isList && <Palm className={`absolute -left-[12cqw] ${animate ? "" : ""}`} style={{ width: wide ? "26cqw" : "44cqw", bottom: `${100 - horizon - 4}%` }} />}
      {!isList && <Palm flip className="absolute -right-[12cqw]" style={{ width: wide ? "22cqw" : "38cqw", bottom: `${100 - horizon - 2}%` }} />}
    </>
  );
  const hand = (s: string, size: number, cls = "text-[#ffe0a3]") => <p className={`sd-hand ${cls}`} style={{ fontSize: `${size}cqw`, lineHeight: 1 }}>{s}</p>;
  const when = c.date && (
    <div className="flex flex-col items-center gap-[1cqw]">
      <p className="font-bold uppercase" style={{ fontFamily: F.brico, fontSize: wide ? "2.6cqw" : "4cqw", letterSpacing: "0.04em" }}>{dp && kind !== "save" ? `${dp.weekday} · ${dp.day} ${dp.month}` : c.date}{c.time ? ` · ${c.time}` : ""}</p>
      {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: wide ? "1.7cqw" : "2.3cqw", letterSpacing: "0.35em" }}>{c.where}</E>}
    </div>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center pt-[8cqw] text-center">
        <E as="p" path="texts.headline" className="block font-semibold uppercase text-[#fff3e3]" style={{ fontSize: "3.6cqw", letterSpacing: "0.5em" }}>{c.headline}</E>
        <p className="font-extrabold leading-[0.85] text-[#fff8ec] drop-shadow-[0_4px_30px_rgba(90,20,60,.4)]" style={{ fontFamily: F.brico, fontSize: `${40 * sc}cqw` }}>{c.number}</p>
        <div className="absolute inset-x-0 bottom-[8cqw]">{hand(`${c.name}${age ? ` · ${age}` : ""}`, 6)}</div>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-start gap-[2cqw] px-[8cqw] pt-[10cqw] text-center">
        <E as="p" path="texts.body" className="sd-hand block text-[#ffe0a3]" style={{ fontSize: "8cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="block break-all font-extrabold uppercase leading-[0.9] text-[#fff8ec]" style={{ fontFamily: F.brico, fontSize: `${fit(c.hashtag, 12, 9) * sc}cqw`, letterSpacing: "-0.03em" }}>{c.hashtag}</E>
        <Wave live={animate} bars={28} className="absolute bottom-[10cqw] h-[10cqw] w-[60cqw] text-[#ffc47a]" />
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative flex h-full flex-col items-center justify-start pt-[6cqw] text-center">
        <E as="p" path="texts.headline" className="block font-extrabold uppercase leading-[0.9] text-[#fff8ec]" style={{ fontFamily: F.brico, fontSize: `${fit(c.headline, 10, 9) * sc}cqw`, letterSpacing: "-0.03em" }}>{c.headline}</E>
        <div className="absolute inset-x-0 bottom-[5cqw] flex flex-col items-center gap-[1cqw] px-[16cqw]">
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.4cqw", lineHeight: 1.45 }}>{c.body}</E>}
          {hand(`— ${c.name}`, 4.4, "text-[var(--t-gold)]")}
        </div>
      </div>
    );
  } else if (isList) {
    body = (
      <div className="relative flex h-full flex-col items-center px-[9cqw] text-center">
        <div className="flex flex-col items-center justify-center" style={{ height: `${horizon}%` }}>
          <E as="p" path="texts.headline" className="block font-extrabold uppercase leading-[0.9] text-[#fff8ec]" style={{ fontFamily: F.brico, fontSize: `${fit(c.headline, tall ? 14 : 11, 9)}cqw`, letterSpacing: "-0.03em" }}>{c.headline}</E>
        </div>
        <ol className="w-full text-left" style={{ marginTop: "4cqw" }}>
          {c.items.map((it, i) => (
            <li key={i} className="border-b border-white/15" style={{ padding: tall ? "3.4cqw 0" : "2.6cqw 0" }}>
              <E as="p" path={`items.${i}.title`} className="block font-extrabold uppercase leading-tight" style={{ fontFamily: F.brico, fontSize: tall ? "5.4cqw" : "4.4cqw" }}>{it.title}</E>
              {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "3.2cqw" : "2.6cqw", marginTop: "0.8cqw" }}>{it.detail}</E>}
            </li>
          ))}
        </ol>
        <div className="mt-auto pb-[9cqw]">{hand(`${c.name}${age ? ` · ${age}` : ""}`, 6.4, "text-[var(--t-gold)]")}</div>
      </div>
    );
  } else {
    body = (
      <>
        <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-[1cqw] px-[7cqw] text-center" style={{ paddingTop: tall ? "16cqw" : square ? "6cqw" : "9cqw" }}>
          {c.eyebrow && <E as="p" path="texts.eyebrow" className="block font-semibold uppercase text-[#ffe0a3]" style={{ fontSize: "2.3cqw", letterSpacing: "0.45em" }}>{c.eyebrow}</E>}
          {c.headline && <E as="p" path="texts.headline" className="block font-extrabold uppercase leading-[0.95] text-[#fff8ec]" style={{ fontFamily: F.brico, fontSize: `${fit(c.headline, kind === "greeting" ? 9 : 7, 12)}cqw` }}>{c.headline}</E>}
          <h2 className="font-extrabold uppercase leading-[0.86] text-[#fff8ec] drop-shadow-[0_4px_24px_rgba(90,20,60,.35)]" style={{ fontFamily: F.brico, fontSize: `${nameSize}cqw`, letterSpacing: "-0.04em" }}><E path="profile.partner1">{c.name}</E></h2>
          {c.line && hand(c.line, tall ? 8 : 6.6)}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-[2cqw] px-[9cqw] text-center" style={{ top: `${horizon}%`, paddingTop: square ? "5cqw" : "8cqw", paddingBottom: tall ? "12cqw" : "7cqw" }}>
          {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[74cqw]" style={{ fontSize: tall ? "3.8cqw" : "3.2cqw", lineHeight: 1.45 }}>{c.lead}</E>}
          {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[76cqw]" style={{ fontSize: "3.2cqw", lineHeight: 1.5 }}>{c.body}</E>}
          <div className="mt-auto flex flex-col items-center gap-[2cqw]">
            {!square && <Wave live={animate} bars={30} className="h-[6cqw] w-[54cqw] text-[#ffc47a]/80" />}
            {when}
            {c.footer && <E as="p" path={c.footerPath} className="sd-hand block text-[var(--t-gold)]" style={{ fontSize: "5.4cqw" }}>{c.footer}</E>}
          </div>
        </div>
      </>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("sundowner", theme, design, SD_VARS)} className={`${FONT_VARS} ${animate ? "" : "sd-still"} bg-[#13233f] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(40,20,60,.7)] ${className}`} style={{ fontFamily: F.brico }}>
      <style href="cel-sd" precedence="default">{SD_CSS}</style>
      {scene}
      <Grain opacity={0.12} blend="overlay" />
      {body}
    </CardFrame>
  );
}
