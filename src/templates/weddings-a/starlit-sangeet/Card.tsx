"use client";
import type { CSSProperties } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, dateParts, fit, langOf, shapeOf } from "../_shared/data";
import { CardRoot, ff } from "../_shared/ui";
import { Constellation, DecoCorner, Dhol, FairyLights, Fan, Moon, Shisha, StarDust } from "./art";
import { FACES, FONTS, LINES } from "./faces";
import "./sangeet.css";

const FOIL = { "--wa-f1": "#94701f", "--wa-f2": "#fff1c2", "--wa-f3": "var(--t-gold)" } as CSSProperties;
const muted = { color: "var(--t-muted)" };
const gold = { color: "var(--t-gold)" };

export default function SangeetCard({ kind, profile, theme, design, animate = true, className }: CardProps) {
  const [a, b] = nameParts(profile);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const lang = langOf(profile);
  const X = LINES[lang];
  const dp = dateParts(profile.date, lang);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const still = !animate;
  const long = b && b.length > a.length ? b : a;

  const names = ({ size, row = false }: { size: number; row?: boolean }) => {
    const s = fit(long, size * sc, 6);
    return (
      <div data-in className={`flex ${row ? "flex-row flex-wrap items-baseline justify-center gap-x-[2.5cqw]" : "flex-col items-center"} text-center uppercase leading-[1]`} style={ff.display}>
        <E path="profile.partner1" className="wa-foil block tracking-[0.06em]" style={{ ...FOIL, fontSize: `${s}cqw` }}>{a}</E>
        {b && <span className="block normal-case italic" style={{ ...ff.script, fontSize: `${s * 0.6}cqw`, color: "#f1e9ff", margin: row ? 0 : `${s * 0.02}cqw 0` }}>&amp;</span>}
        {b && <E path="profile.partner2" className="wa-foil block tracking-[0.06em]" style={{ ...FOIL, fontSize: `${s}cqw` }}>{b}</E>}
      </div>
    );
  };
  const where = (size = 2.2) => c.where ? <E as="p" path={c.wherePath} className="block uppercase" style={{ ...muted, fontSize: `${size}cqw`, letterSpacing: "0.32em" }}>{c.where}</E> : null;
  const eyebrow = (size = 2.2) => c.eyebrow ? <E as="p" path="texts.eyebrow" className="block uppercase" style={{ ...gold, fontSize: `${size}cqw`, letterSpacing: "0.36em" }}>{c.eyebrow}</E> : null;
  const footer = (size = 4.6) => c.footer ? <E as="p" path={c.footerPath} className="block italic" style={{ ...ff.script, fontSize: `${size}cqw`, color: "#e9e0ff" }}>{c.footer}</E> : null;
  const rule = (w = 9) => (
    <div className="flex items-center justify-center gap-[2cqw]" style={gold}>
      <span className="h-px bg-current opacity-60" style={{ width: `${w}cqw` }} />
      <Shisha className="w-[6cqw]" petals={10} />
      <span className="h-px bg-current opacity-60" style={{ width: `${w}cqw` }} />
    </div>
  );
  const frame = (
    <>
      <div className="pointer-events-none absolute inset-[3.5cqw] border border-[var(--t-gold)]/45" />
      <div className="pointer-events-none absolute inset-[4.6cqw] border border-[var(--t-gold)]/18" />
      <DecoCorner className="absolute left-[3.5cqw] top-[3.5cqw] w-[9cqw]" />
      <DecoCorner className="absolute right-[3.5cqw] top-[3.5cqw] w-[9cqw] rotate-90" />
      <DecoCorner className="absolute bottom-[3.5cqw] right-[3.5cqw] w-[9cqw] rotate-180" />
      <DecoCorner className="absolute bottom-[3.5cqw] left-[3.5cqw] w-[9cqw] -rotate-90" />
    </>
  );
  const root = (children: React.ReactNode, extra = "") => (
    <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="starlit-sangeet" faces={FACES} fonts={FONTS} animate={animate} className={`sang-sky sang-card text-[var(--t-ink)] ${extra} ${className ?? ""}`}>
      <StarDust className="absolute inset-0 h-full w-full" count={shape === "tall" ? 110 : 70} still={still} h={shape === "tall" ? 1800 : shape === "wide" ? 700 : 1000} />
      {children}
    </CardRoot>
  );
  const col = (gap: number, children: React.ReactNode, cls = "") => <div className={`absolute flex flex-col items-center text-center ${cls}`} style={{ gap: `${gap}cqw` }}>{children}</div>;

  // ── Thank-you (7:5): the dhol on one side, gratitude on the other ──
  if (shape === "wide") {
    return root(
      <>
        {frame}
        <FairyLights className="absolute inset-x-0 top-0 h-[16%] w-full" sag={50} bulbs={22} still={still} />
        <div className="absolute bottom-[14%] left-[8%] top-[22%] flex w-[36%] flex-col items-center justify-center">
          <Dhol className="w-full" />
          <Fan className="mt-[2cqw] w-[70%] opacity-70" />
        </div>
        {col(2, <>
          <E as="p" path="texts.headline" className="block italic leading-none" style={{ ...ff.script, fontSize: `${9 * sc}cqw`, color: "#f1e9ff" }}>{c.headline}</E>
          <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ ...ff.script, ...muted, fontSize: "2.8cqw" }}>{c.body}</E>
          {rule(5)}
          <p className="uppercase" style={{ ...ff.display, fontSize: "3.2cqw", letterSpacing: "0.16em" }}><span className="wa-foil" style={FOIL}>{b ? `${a} & ${b}` : a}</span></p>
          {where(1.6)}
        </>, "inset-y-[18%] right-[8%] w-[44%] justify-center")}
      </>,
    );
  }

  // ── Table number: the number set inside a ring of mirrors ──
  if (kind === "table") {
    return root(
      <>
        {frame}
        <div className="absolute left-1/2 top-1/2 aspect-square w-[64%] -translate-x-1/2 -translate-y-1/2">
          {Array.from({ length: 14 }, (_, i) => {
            const t = (i / 14) * Math.PI * 2;
            return <Shisha key={i} className="absolute w-[13%]" petals={i % 2 ? 8 : 12} style={{ left: `${50 + Math.cos(t) * 46 - 6.5}%`, top: `${50 + Math.sin(t) * 46 - 6.5}%` }} />;
          })}
        </div>
        {col(0.5, <>
          <E as="p" path="texts.headline" className="block uppercase" style={{ ...gold, fontSize: "2.6cqw", letterSpacing: "0.5em" }}>{c.headline}</E>
          <p className="italic leading-none" style={{ ...ff.script, fontSize: `${22 * sc}cqw` }}><span className="wa-foil" style={FOIL}>{c.number}</span></p>
          <p className="italic" style={{ ...ff.script, fontSize: "3.4cqw", color: "#e9e0ff" }}>{b ? `${a} & ${b}` : a}</p>
        </>, "inset-0 justify-center")}
      </>,
    );
  }

  // ── Square post: names inside a ring of mirrorwork ──
  if (kind === "post") {
    return root(
      <>
        <FairyLights className="absolute inset-x-0 top-0 h-[16%] w-full" sag={60} bulbs={22} still={still} />
        <div className="absolute left-1/2 top-[54%] aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2">
          {Array.from({ length: 22 }, (_, i) => {
            const t = (i / 22) * Math.PI * 2;
            return <Shisha key={i} className="absolute w-[8%]" petals={i % 2 ? 8 : 12} style={{ left: `${50 + Math.cos(t) * 47 - 4}%`, top: `${50 + Math.sin(t) * 47 - 4}%` }} />;
          })}
        </div>
        {col(2.2, <>
          {eyebrow(2)}
          {names({ size: 9.5 })}
          {c.date && <p className="uppercase" style={{ ...ff.display, fontSize: "3cqw", letterSpacing: "0.3em" }}>{c.date}</p>}
          {where(1.8)}
        </>, "inset-x-[14%] top-[54%] -translate-y-1/2")}
      </>,
    );
  }

  // ── Tall: story (9:16) & menu (4:9) ──
  if (shape === "tall") {
    if (kind === "menu") {
      return root(
        <>
          {frame}
          <Fan className="absolute left-1/2 top-[6%] w-[52%] -translate-x-1/2 opacity-90" />
          {col(2.5, <>
            <E as="p" path="texts.headline" className="block uppercase leading-none" style={{ ...ff.display, fontSize: `${12 * sc}cqw`, letterSpacing: "0.12em" }}><span className="wa-foil" style={FOIL}>{c.headline}</span></E>
            <p className="italic" style={{ ...ff.script, fontSize: "5cqw", color: "#e9e0ff" }}>{b ? `${a} & ${b}` : a}</p>
          </>, "inset-x-[10%] top-[19%]")}
          <ul data-in className="absolute inset-x-[11%] top-[36%] flex flex-col items-center text-center" style={{ gap: "5cqw" }}>
            {c.items.map((it, i) => (
              <li key={i} className="flex flex-col items-center" style={{ gap: "1.2cqw" }}>
                <span className="italic" style={{ ...ff.script, ...gold, fontSize: "4cqw" }}>{String(i + 1).padStart(2, "0")}</span>
                <E as="p" path={`items.${i}.title`} className="block uppercase" style={{ ...ff.display, fontSize: "5.6cqw", letterSpacing: "0.14em" }}>{it.title}</E>
                {it.detail && <E as="p" path={`items.${i}.detail`} className="block italic leading-snug" style={{ ...ff.script, ...muted, fontSize: "4.4cqw" }}>{it.detail}</E>}
              </li>
            ))}
          </ul>
          <div className="absolute inset-x-0 bottom-[6%] flex flex-col items-center" style={{ gap: "2cqw" }}>{rule(10)}<p className="uppercase" style={{ ...muted, fontSize: "2.6cqw", letterSpacing: "0.34em" }}>{c.date}</p></div>
        </>,
      );
    }
    return root(
      <>
        <FairyLights className="absolute inset-x-[-4%] top-0 h-[8%] w-[108%]" sag={70} bulbs={20} still={still} />
        <FairyLights className="absolute inset-x-[-4%] top-0 h-[13%] w-[108%] opacity-70" sag={120} bulbs={16} seed={9} still={still} />
        <Moon className="absolute right-[10%] top-[14%] w-[16%]" />
        <Constellation className="absolute left-1/2 top-[24%] w-[150%] -translate-x-1/2 opacity-50" />
        {col(4, <>
          {eyebrow(3)}
          {names({ size: 15 })}
          {dp && <p className="flex items-center gap-[3cqw]" style={{ ...ff.display, fontSize: "8cqw" }}><span className="wa-foil" style={FOIL}>{dp.dd}</span><span className="h-[6cqw] w-px bg-[var(--t-gold)]/60" /><span className="wa-foil" style={FOIL}>{dp.mm}</span><span className="h-[6cqw] w-px bg-[var(--t-gold)]/60" /><span className="wa-foil" style={FOIL}>{dp.year.slice(2)}</span></p>}
          {where(2.8)}
          {footer(6)}
        </>, "inset-x-[8%] top-[27%]")}
        <Fan className="absolute bottom-[5%] left-1/2 w-[90%] -translate-x-1/2 opacity-50" rays={27} />
        <div className="absolute inset-x-0 bottom-[3%] flex justify-center gap-[2.5cqw]">{Array.from({ length: 7 }, (_, i) => <Shisha key={i} className={i % 2 ? "w-[7cqw]" : "w-[10cqw]"} petals={i % 2 ? 8 : 12} />)}</div>
      </>,
    );
  }

  // ── Program (5:7): the night's setlist ──
  if (kind === "program") {
    return root(
      <>
        {frame}
        <div className="absolute inset-x-[12%] top-[9%] flex flex-col items-center text-center" style={{ gap: "1.6cqw" }}>
          <Dhol className="w-[28cqw]" />
          <E as="p" path="texts.headline" className="block uppercase leading-[1.05]" style={{ ...ff.display, fontSize: `${7.4 * sc}cqw`, letterSpacing: "0.12em" }}><span className="wa-foil" style={FOIL}>{c.headline}</span></E>
          <p className="italic" style={{ ...ff.script, fontSize: "4cqw", color: "#e9e0ff" }}>{b ? `${a} & ${b}` : a}</p>
          <ol data-in className="mt-[2cqw] w-full text-left">
            {c.items.map((it, i) => (
              <li key={i} className="flex items-baseline border-b border-[var(--t-gold)]/20" style={{ gap: "2.5cqw", padding: "1.8cqw 0" }}>
                <span className="italic" style={{ ...ff.script, ...gold, fontSize: "3.6cqw" }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <E as="p" path={`items.${i}.title`} className="block uppercase" style={{ ...ff.display, fontSize: "3.6cqw", letterSpacing: "0.1em" }}>{it.title}</E>
                  {it.detail && <E as="p" path={`items.${i}.detail`} className="block italic" style={{ ...ff.script, ...muted, fontSize: "2.8cqw" }}>{it.detail}</E>}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="absolute inset-x-0 bottom-[8%] text-center uppercase" style={{ ...muted, fontSize: "2cqw", letterSpacing: "0.34em" }}>{c.date}</p>
      </>,
    );
  }

  // ── Portrait & signs: invite, save, event, welcome, hashtag, greeting ──
  const isSign = shape === "sign";
  return root(
    <>
      {frame}
      <FairyLights className="absolute inset-x-[4%] top-[3.5cqw] h-[11%] w-[92%]" sag={60} bulbs={18} still={still} />
      <Fan className="absolute bottom-[3.5cqw] left-1/2 w-[80%] -translate-x-1/2 opacity-35" rays={27} />
      {kind === "save" && <Constellation className="absolute left-1/2 top-[18%] w-[130%] -translate-x-1/2 opacity-45" />}
      {kind === "hashtag" ? (
        col(3, <>
          <p data-in className="italic" style={{ ...ff.script, fontSize: "6cqw", color: "#e9e0ff" }}>{c.body}</p>
          <E as="p" path="texts.hashtag" className="block break-all leading-[1.1]" style={{ ...ff.display, fontSize: `${fit(c.hashtag, 9, 14) * sc}cqw`, letterSpacing: "0.04em" }}><span className="wa-foil" style={FOIL}>{c.hashtag}</span></E>
          {rule(8)}
          <p className="uppercase" style={{ ...muted, fontSize: "2.2cqw", letterSpacing: "0.34em" }}>{b ? `${a} & ${b}` : a}</p>
        </>, "inset-x-[10%] top-1/2 -translate-y-1/2")
      ) : kind === "greeting" ? (
        col(3, <>
          {eyebrow(2.2)}
          {names({ size: 10, row: true })}
          {rule(7)}
          {c.body && <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ ...ff.script, fontSize: "3.8cqw", color: "#e9e0ff" }}>{c.body}</E>}
          {footer(5)}
        </>, "inset-x-[11%] top-[22%]")
      ) : kind === "save" ? (
        col(3.2, <>
          {eyebrow(2.6)}
          {names({ size: 12.5 })}
          {dp && <p className="flex items-center gap-[2.5cqw]" style={{ ...ff.display, fontSize: "9cqw" }}><span className="wa-foil" style={FOIL}>{dp.dd}</span><span className="h-[7cqw] w-px bg-[var(--t-gold)]/60" /><span className="wa-foil" style={FOIL}>{dp.mm}</span><span className="h-[7cqw] w-px bg-[var(--t-gold)]/60" /><span className="wa-foil" style={FOIL}>{dp.year.slice(2)}</span></p>}
          {where(2.2)}
          <p className="italic" style={{ ...ff.script, ...muted, fontSize: "3.2cqw" }}>{X.night}</p>
        </>, "inset-x-[9%] top-[19%]")
      ) : (
        col(isSign ? 3.4 : 2.6, <>
          {kind === "event" ? (
            <>
              <Dhol className="w-[26cqw]" />
              <p className="uppercase" style={{ ...muted, fontSize: "2cqw", letterSpacing: "0.34em" }}>{c.lead}</p>
              <E as="p" path="texts.headline" className="block italic leading-none" style={{ ...ff.script, fontSize: `${9 * sc}cqw`, color: "#f1e9ff" }}>{c.headline}</E>
            </>
          ) : eyebrow(isSign ? 2.6 : 2.1)}
          {names({ size: kind === "event" ? 7.5 : isSign ? 14 : 11.5, row: kind === "event" })}
          {kind === "invite" && <p className="italic" style={{ ...ff.script, fontSize: "4cqw", color: "#e9e0ff" }}>{profile.occasion && profile.occasion !== "wedding" ? "" : X.night}</p>}
          {kind === "invite" && c.lead && <E as="p" multiline path={c.leadPath} className="block max-w-[66cqw] italic leading-snug" style={{ ...ff.script, ...muted, fontSize: "3.1cqw" }}>{c.lead}</E>}
          {rule(isSign ? 10 : 8)}
          {c.date && <p className="uppercase" style={{ ...ff.display, fontSize: `${isSign ? 3.6 : 3.2}cqw`, letterSpacing: "0.28em" }}>{c.date}</p>}
          {where(isSign ? 2.4 : 2)}
          {footer(4.4)}
        </>, `inset-x-[9%] ${kind === "event" ? "top-[15%]" : isSign ? "top-[20%]" : "top-[17%]"}`)
      )}
    </>,
  );
}
