"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, dateParts, fit, langOf, shapeOf } from "../_shared/data";
import { CardRoot, ff } from "../_shared/ui";
import { bloom, GajraArt, JasmineMark, Kasavu, Lamp, Wreath, type Strand } from "./art";
import { FACES, FONTS } from "./faces";
import "./mogra.css";

const it = ff.script;
const SWAG: Strand[] = [
  { pts: [[-10, 14], [120, 150], [380, 150], [510, 14]], seed: 2, step: 12, s: 0.95 },
  { pts: [[78, 82], [79, 120], [77, 150], [78, 190]], seed: 8, step: 11, s: 0.8, leaves: false },
  { pts: [[422, 82], [421, 120], [423, 150], [422, 180]], seed: 9, step: 11, s: 0.8, leaves: false },
];
const SIDES = (h: number): Strand[] => [
  { pts: [[30, -10], [32, h * 0.3], [27, h * 0.65], [30, h * 0.9]], seed: 31, step: 11, s: 0.95, flowerEvery: 3 },
  { pts: [[470, -10], [468, h * 0.32], [473, h * 0.6], [470, h * 0.84]], seed: 32, step: 11, s: 0.95, flowerEvery: 3 },
];

export default function MograCard({ kind, profile, theme, design, animate = true, className }: CardProps) {
  const [a, b] = nameParts(profile);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const dp = dateParts(profile.date, langOf(profile));
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const still = !animate;
  const longest = b && b.length > a.length ? b : a;
  const muted = { color: "var(--t-muted)" };

  const names = (size: number, row = false) => {
    const s = fit(longest, size * sc, 8);
    return (
      <div data-in className={`flex ${row ? "flex-row flex-wrap items-baseline justify-center gap-x-[2.4cqw]" : "flex-col items-center"} font-light leading-[0.98]`} style={ff.display}>
        <E path="profile.partner1" className="block" style={{ fontSize: `${s}cqw` }}>{a}</E>
        {b && <span className="mog-italic block leading-none" style={{ ...it, fontSize: `${s * 0.5}cqw`, color: "var(--t-gold)", margin: row ? 0 : `${s * 0.05}cqw 0` }}>&amp;</span>}
        {b && <E path="profile.partner2" className="block" style={{ fontSize: `${s}cqw` }}>{b}</E>}
      </div>
    );
  };
  const caps = (t: string, size = 2.1, path?: string) => (path ? <E as="p" path={path} className="block uppercase" style={{ fontSize: `${size}cqw`, letterSpacing: "0.38em", ...muted }}>{t}</E> : <p className="uppercase" style={{ fontSize: `${size}cqw`, letterSpacing: "0.38em", ...muted }}>{t}</p>);
  const rule = <span className="block h-px w-[12cqw] bg-[var(--t-gold)]" />;
  const where = (size = 3.4) => (c.where ? <E as="p" path={c.wherePath} className="mog-italic block" style={{ ...it, fontSize: `${size}cqw`, ...muted }}>{c.where}</E> : null);
  const footer = (size = 4.4) => (c.footer ? <E as="p" path={c.footerPath} className="mog-italic block" style={{ ...it, fontSize: `${size}cqw`, color: "var(--t-accent)" }}>{c.footer}</E> : null);
  const band = (thick = 2.2) => <div className="absolute inset-x-0" style={{ bottom: "4.5cqw" }}><Kasavu style={{ ["--kb" as string]: `${thick}cqw`, ["--kt" as string]: "0.35cqw", ["--kg" as string]: "0.6cqw" }} /></div>;
  const root = (children: React.ReactNode, extra = "") => (
    <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="mogra-bloom" faces={FACES} fonts={FONTS} animate={animate}
      className={`mog wa-paper bg-[var(--t-surface)] text-[var(--t-ink)] ${extra} ${className ?? ""}`}
      scene={(k) => { bloom(k, "", 0.1); k.gsap.from(k.q("[data-in]"), { opacity: 0, y: 10, filter: "blur(4px)", duration: 1.3, ease: "power3.out", stagger: 0.14, delay: 0.7 }); }}>
      {children}
    </CardRoot>
  );
  const swag = (h = "34cqw") => <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: h }}><GajraArt viewBox="0 0 500 200" className="w-full" strands={SWAG} /></div>;

  // Square: a ring of jasmine holds the names / the table number.
  if (shape === "square") {
    return root(
      <>
        <Wreath className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ gap: "2cqw" }}>
          {kind === "table" ? (
            <>
              <E as="p" path="texts.headline" className="mog-italic block" style={{ ...it, fontSize: "5cqw", ...muted }}>{c.headline}</E>
              <p className="font-light leading-[0.85]" style={{ ...ff.display, fontSize: `${26 * sc}cqw` }}>{c.number}</p>
            </>
          ) : (
            <>
              {c.eyebrow && caps(c.eyebrow, 1.8, "texts.eyebrow")}
              {names(9.5)}
              {c.date && <p className="uppercase" style={{ fontSize: "2cqw", letterSpacing: "0.34em" }}>{c.date}</p>}
            </>
          )}
        </div>
        {band(1.3)}
      </>,
    );
  }

  // Wide thank-you: jasmine hangs at the left like a doorway garland.
  if (shape === "wide") {
    return root(
      <>
        <div className="pointer-events-none absolute inset-y-0 left-[3cqw] w-[24%]"><GajraArt viewBox="0 0 200 360" className="h-full w-auto" strands={[
          { pts: [[40, -10], [42, 100], [36, 200], [40, 300]], seed: 41, step: 11, s: 1 },
          { pts: [[100, -10], [98, 80], [103, 160], [100, 240]], seed: 42, step: 11, s: 1 },
          { pts: [[160, -10], [162, 60], [157, 130], [160, 180]], seed: 43, step: 11, s: 1 },
        ]} /></div>
        <div className="absolute inset-y-0 right-[6cqw] flex w-[58%] flex-col items-center justify-center text-center" style={{ gap: "2.2cqw" }}>
          <JasmineMark className="w-[5cqw]" />
          <E as="p" path="texts.headline" className="mog-italic block font-light leading-none" style={{ ...it, fontSize: `${10 * sc}cqw` }}>{c.headline}</E>
          <E as="p" multiline path="texts.body" className="block font-light leading-snug" style={{ ...ff.display, fontSize: "3.2cqw", ...muted }}>{c.body}</E>
          {rule}
          <p className="uppercase" style={{ fontSize: "1.9cqw", letterSpacing: "0.38em" }}>{b ? `${a} · ${b}` : a}</p>
        </div>
        {band(1.4)}
      </>,
    );
  }

  // Lists: order of ceremony & menu.
  if (kind === "program" || kind === "menu") {
    const tall = kind === "menu";
    return root(
      <>
        {swag()}
        <div className={`absolute inset-x-[10cqw] flex flex-col items-center justify-between text-center ${tall ? "bottom-[14cqw] top-[40cqw]" : "bottom-[13cqw] top-[33cqw]"}`}>
          <div data-in className="flex flex-col items-center" style={{ gap: "1.2cqw" }}>
            <E as="p" path="texts.headline" className="mog-italic block font-light leading-none" style={{ ...it, fontSize: `${(tall ? 12 : 9) * sc}cqw` }}>{c.headline}</E>
            <p className="uppercase" style={{ fontSize: "1.9cqw", letterSpacing: "0.38em", ...muted }}>{b ? `${a} · ${b}` : a}</p>
          </div>
          <ul data-in className="w-full">
            {c.items.map((x, i) => (
              <li key={i} className="flex flex-col items-center" style={{ padding: `${tall ? 3.4 : 1.8}cqw 0` }}>
                <E as="p" path={`items.${i}.title`} className="block font-light" style={{ ...ff.display, fontSize: `${tall ? 6 : 4.4}cqw` }}>{x.title}</E>
                {x.detail && <E as="p" path={`items.${i}.detail`} className="mog-italic block" style={{ ...it, fontSize: `${tall ? 3.8 : 2.9}cqw`, ...muted, marginTop: "0.6cqw" }}>{x.detail}</E>}
                {i < c.items.length - 1 && <JasmineMark className={tall ? "mt-[3.4cqw] w-[4cqw]" : "mt-[1.8cqw] w-[3cqw]"} />}
              </li>
            ))}
          </ul>
          {c.date && <p className="uppercase" style={{ fontSize: "1.9cqw", letterSpacing: "0.38em", ...muted }}>{c.date}</p>}
        </div>
        {band()}
      </>,
    );
  }

  // Hashtag sign: wreath + tag.
  if (kind === "hashtag") {
    return root(
      <>
        <Wreath className="absolute left-1/2 top-[8%] w-[60%] -translate-x-1/2" />
        <div className="absolute left-1/2 top-[8%] grid aspect-square w-[60%] -translate-x-1/2 place-items-center"><JasmineMark className="w-[12cqw]" /></div>
        <div className="absolute inset-x-[8cqw] bottom-[16cqw] flex flex-col items-center text-center" style={{ gap: "2.4cqw" }}>
          <p data-in className="mog-italic" style={{ ...it, fontSize: "6cqw", ...muted }}>{c.body}</p>
          <E as="p" path="texts.hashtag" className="block break-all font-light leading-[1.05]" style={{ ...ff.display, fontSize: `${fit(c.hashtag, 9.5, 15) * sc}cqw` }}>{c.hashtag}</E>
          {rule}
          <p className="uppercase" style={{ fontSize: "2cqw", letterSpacing: "0.38em", ...muted }}>{b ? `${a} · ${b}` : a}</p>
        </div>
        {band()}
      </>,
    );
  }

  // Save the date: two strands hang at the edges like a temple doorway; the date takes the stage.
  if (kind === "save") {
    return root(
      <>
        <div className="pointer-events-none absolute inset-0"><GajraArt viewBox="0 0 500 700" className="h-full w-full" strands={SIDES(700)} /></div>
        <div className="absolute inset-x-[14cqw] bottom-[15cqw] top-[12cqw] flex flex-col items-center justify-between text-center">
          {caps(c.eyebrow, 2.2, "texts.eyebrow")}
          {names(10.5, true)}
          {dp && (
            <div data-in className="flex flex-col items-center">
              <p className="font-light leading-[0.8]" style={{ ...ff.display, fontSize: "30cqw" }}>{dp.day}</p>
              <p className="mog-italic" style={{ ...it, fontSize: "6cqw", ...muted }}>{dp.month} {dp.year}</p>
            </div>
          )}
          <div data-in className="flex flex-col items-center" style={{ gap: "1.2cqw" }}>{rule}{where(3.4)}</div>
        </div>
        {band()}
      </>,
    );
  }

  // Story & welcome sign: garland above, lamp below — the full ritual frame.
  if (kind === "story" || kind === "welcome") {
    const story = kind === "story";
    return root(
      <>
        {swag(story ? "40cqw" : "36cqw")}
        <div className={`absolute inset-x-[9cqw] flex flex-col items-center text-center ${story ? "top-[46cqw]" : "top-[38cqw]"}`} style={{ gap: story ? "4.5cqw" : "3.4cqw" }}>
          {c.eyebrow && caps(c.eyebrow, story ? 2.6 : 2.2, "texts.eyebrow")}
          {names(story ? 15 : 13)}
          {rule}
          {c.date && <p data-in className="uppercase" style={{ fontSize: `${story ? 2.8 : 2.3}cqw`, letterSpacing: "0.36em" }}>{c.date}</p>}
          {where(story ? 4.4 : 3.6)}
          {story && footer(5.4)}
        </div>
        <div className="absolute left-1/2 w-[17%] -translate-x-1/2" style={{ bottom: story ? "12cqw" : "10cqw" }}><Lamp className="w-full" still={still} /></div>
        {band()}
      </>,
    );
  }

  // Portrait paper: invite, event, greeting.
  return root(
    <>
      {swag()}
      <div className="absolute inset-x-[10cqw] bottom-[13cqw] top-[31cqw] flex flex-col items-center justify-between text-center">
        {kind === "event" ? (
          <div data-in className="flex flex-col items-center" style={{ gap: "1.4cqw" }}>
            <p className="uppercase" style={{ fontSize: "1.9cqw", letterSpacing: "0.38em", ...muted }}>{c.lead}</p>
            <E as="p" path="texts.headline" className="mog-italic block font-light leading-none" style={{ ...it, fontSize: `${11 * sc}cqw`, color: "var(--t-accent)" }}>{c.headline}</E>
          </div>
        ) : c.eyebrow ? caps(c.eyebrow, 2, "texts.eyebrow") : <span />}
        {names(kind === "event" ? 8 : kind === "greeting" ? 10 : 13, kind === "event")}
        {kind === "greeting" ? (
          c.body ? <E as="p" multiline path="texts.body" className="block font-light leading-snug" style={{ ...ff.display, fontSize: "3.7cqw", ...muted }}>{c.body}</E> : <span />
        ) : kind === "invite" && c.lead ? (
          <E as="p" multiline path={c.leadPath} className="mog-italic block max-w-[66cqw] leading-snug" style={{ ...it, fontSize: "3.6cqw", ...muted }}>{c.lead}</E>
        ) : <span />}
        <div data-in className="flex flex-col items-center" style={{ gap: "1.3cqw" }}>
          {rule}
          {c.date && <p className="uppercase" style={{ fontSize: "2.3cqw", letterSpacing: "0.36em" }}>{c.date}</p>}
          {where(3.3)}
          {footer(4.4)}
        </div>
      </div>
      {band()}
    </>,
  );
}
