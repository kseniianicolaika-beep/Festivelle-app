"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, dateParts, fit, langOf, shapeOf } from "../_shared/data";
import { CardRoot, ff } from "../_shared/ui";
import { Bougainvillea, Church, Flourish, Postmark, Stamp, Tile, TileField, WaxSeal } from "./art";
import { FACES, FONTS, SALUTE } from "./faces";
import "./lisbon.css";

const num = { fontFamily: "var(--wa-garamond), Georgia, serif" };

export default function LisbonCard({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const [a, b] = nameParts(profile);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const lang = langOf(profile);
  const T = SALUTE[lang];
  const dp = dateParts(profile.date, lang);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const longest = b && b.length > a.length ? b : a;
  const ini = b ? `${a[0] ?? ""}${b[0] ?? ""}` : (a[0] ?? "");
  const root = (cls: string, children: React.ReactNode) => (
    <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="lisbon-letter" faces={FACES} fonts={FONTS} animate={animate} className={`lis text-[var(--t-ink)] ${cls} ${className}`}>{children}</CardRoot>
  );

  const names = (size: number, row = false) => {
    const s = fit(longest, size * sc, 7);
    return (
      <div data-in className={`flex ${row ? "flex-row flex-wrap items-baseline justify-center gap-x-[2.4cqw]" : "flex-col items-center"} text-center leading-[0.95]`} style={ff.display}>
        <E path="profile.partner1" className="block italic" style={{ fontSize: `${s}cqw` }}>{a}</E>
        {b && <span className="block leading-[0.8] text-[var(--t-accent)]" style={{ ...ff.script, fontSize: `${s * 0.7}cqw` }}>&amp;</span>}
        {b && <E path="profile.partner2" className="block italic" style={{ fontSize: `${s}cqw` }}>{b}</E>}
      </div>
    );
  };
  const meta = (size = 2.3) => (
    <div data-in className="flex flex-col items-center" style={{ gap: "0.8cqw" }}>
      {c.date && <p className="uppercase" style={{ fontSize: `${size}cqw`, letterSpacing: "0.3em" }}>{c.date}</p>}
      {c.where && <E as="p" path={c.wherePath} className="block italic text-[var(--t-muted)]" style={{ ...ff.display, fontSize: `${size * 1.45}cqw` }}>{c.where}</E>}
    </div>
  );
  const band = (h: string, v: "rosa" | "estrela" = "estrela") => <div className="relative w-full shrink-0" style={{ height: h }}><TileField size={34} variant={v} className="absolute inset-0 h-full w-full" /></div>;

  // ── Save the date: an addressed envelope front ──
  if (kind === "save") {
    return root("lis-laid wa-paper bg-[var(--t-surface)]", (
      <>
        <div className="absolute inset-x-0 top-0 h-[3cqw] bg-[repeating-linear-gradient(135deg,var(--t-accent)_0_3cqw,#fbfcff_3cqw_6cqw,#b8323f_6cqw_9cqw,#fbfcff_9cqw_12cqw)]" />
        <div className="absolute inset-x-0 bottom-0 h-[3cqw] bg-[repeating-linear-gradient(135deg,var(--t-accent)_0_3cqw,#fbfcff_3cqw_6cqw,#b8323f_6cqw_9cqw,#fbfcff_9cqw_12cqw)]" />
        <Stamp className="absolute right-[7cqw] top-[8cqw] z-[3] h-[24cqw] w-[19cqw] rotate-3" value={dp?.year ?? ""} />
        <Postmark className="absolute right-[18cqw] top-[18cqw] z-[3] w-[44cqw] -rotate-12 text-[var(--t-accent)] opacity-70" top={(profile.city || "GOA").toUpperCase()} mid={dp ? `${dp.dd}.${dp.mm}.${dp.year}` : ""} />
        <p className="absolute left-[8cqw] top-[9cqw] z-[3] uppercase text-[var(--t-accent)]" style={{ fontSize: "2.1cqw", letterSpacing: "0.3em" }}>{T.post}</p>
        <div className="absolute inset-x-[8cqw] bottom-[10cqw] top-[44cqw] z-[3] flex flex-col items-center justify-between text-center">
          <E as="p" path="texts.eyebrow" className="block text-[var(--t-accent)]" style={{ ...ff.script, fontSize: `${10 * sc}cqw` }}>{c.eyebrow}</E>
          {names(12)}
          {dp && (
            <div data-in className="flex items-center" style={{ gap: "3cqw", ...num }}>
              <span style={{ fontSize: "11cqw" }}>{dp.dd}</span><span className="h-[10cqw] w-px bg-[var(--t-accent)]/50" /><span style={{ fontSize: "11cqw" }}>{dp.mm}</span><span className="h-[10cqw] w-px bg-[var(--t-accent)]/50" /><span style={{ fontSize: "11cqw" }}>{dp.year}</span>
            </div>
          )}
          {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.4cqw", letterSpacing: "0.4em" }}>{c.where}</E>}
        </div>
      </>
    ));
  }

  // ── Social + signage on the azulejo wall: story, post, welcome, hashtag ──
  if (kind === "story" || kind === "post" || kind === "welcome" || kind === "hashtag") {
    const tall = shape === "tall";
    const square = shape === "square";
    return root("bg-[#fbfcff]", (
      <>
        <TileField size={square ? 120 : 110} className="absolute inset-0 h-full w-full" variant={square ? "estrela" : "rosa"} />
        <div className={`lis-laid wa-paper lis-sheet absolute flex flex-col items-center justify-between text-center ${tall ? "inset-x-[9cqw] inset-y-[15cqw] px-[7cqw] py-[12cqw]" : square ? "inset-[13cqw] px-[6cqw] py-[6cqw]" : "inset-[9cqw] px-[7cqw] py-[9cqw]"}`} style={square ? { borderRadius: "50%" } : undefined}>
          {kind === "hashtag" ? (
            <>
              <p data-in className="text-[var(--t-accent)]" style={{ ...ff.script, fontSize: "8cqw" }}>{c.body}</p>
              <Church className="w-[44cqw] text-[var(--t-accent)]" />
              <E as="p" path="texts.hashtag" className="block break-all italic leading-tight" style={{ ...ff.display, fontSize: `${fit(c.hashtag, 8.6, 14) * sc}cqw` }}>{c.hashtag}</E>
              <p className="uppercase text-[var(--t-muted)]" style={{ fontSize: "2.2cqw", letterSpacing: "0.3em" }}>{b ? `${a} & ${b}` : a}</p>
            </>
          ) : square ? (
            <>
              <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.2cqw", letterSpacing: "0.3em" }}>{c.eyebrow}</E>
              {names(8.4)}
              {meta(2)}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center" style={{ gap: "2cqw" }}>
                <Flourish className="w-[34cqw] text-[var(--t-accent)]" />
                <E as="p" path="texts.eyebrow" className="block leading-tight text-[var(--t-accent)]" style={{ ...ff.script, fontSize: `${fit(c.eyebrow, tall ? 9 : 7.5, 15)}cqw` }}>{c.eyebrow}</E>
              </div>
              {names(tall ? 14 : 12.5)}
              <Church className={`${tall ? "w-[52cqw]" : "w-[40cqw]"} text-[var(--t-accent)]`} />
              {meta(tall ? 2.8 : 2.4)}
              {c.footer && tall && <E as="p" path={c.footerPath} className="block text-[var(--t-accent)]" style={{ ...ff.script, fontSize: "6cqw" }}>{c.footer}</E>}
            </>
          )}
        </div>
        {!square && <WaxSeal initials={ini} className={`absolute left-1/2 z-[3] w-[17cqw] -translate-x-1/2 drop-shadow-[0_1cqw_1.4cqw_rgba(5,15,45,.4)] ${tall ? "bottom-[8cqw]" : "bottom-[3cqw]"}`} />}
      </>
    ));
  }

  // ── Table number: one great tile ──
  if (kind === "table") {
    return root("bg-[#fbfcff]", (
      <>
        <Tile variant="rosa" className="absolute inset-0 h-full w-full" />
        <div className="lis-laid wa-paper absolute left-1/2 top-1/2 flex aspect-square w-[50cqw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full shadow-[0_0_0_1.4cqw_#fbfcff,0_0_0_1.8cqw_var(--t-accent)]">
          <E as="p" path="texts.headline" className="relative z-[2] block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.6cqw", letterSpacing: "0.4em" }}>{c.headline}</E>
          <p className="relative z-[2] leading-[0.95] text-[var(--t-accent)]" style={{ ...num, fontSize: `${24 * sc}cqw` }}>{c.number}</p>
        </div>
      </>
    ));
  }

  // ── Thank-you postcard ──
  if (shape === "wide") {
    return root("lis-laid wa-paper bg-[var(--t-surface)]", (
      <>
        <div className="absolute inset-y-[5cqw] left-[5cqw] w-[42%] overflow-hidden">
          <TileField size={60} variant="estrela" className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-[10%] grid place-items-center bg-[#fbfcff]/92"><Church className="w-[86%] text-[var(--t-accent)]" /></div>
        </div>
        <div className="absolute bottom-[8cqw] left-[52%] top-[8cqw] w-px bg-[var(--t-ink)]/15" />
        <Stamp className="absolute right-[5cqw] top-[5cqw] z-[3] h-[13cqw] w-[10.5cqw] rotate-3" value={dp?.year ?? ""} />
        <div className="absolute inset-y-[6cqw] left-[55%] right-[5cqw] flex flex-col justify-center" style={{ gap: "1.6cqw" }}>
          <E as="p" path="texts.headline" className="block leading-none text-[var(--t-accent)]" style={{ ...ff.script, fontSize: `${9.5 * sc}cqw` }}>{c.headline}</E>
          <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ fontSize: "2.9cqw" }}>{c.body}</E>
          <p className="text-[var(--t-muted)]" style={{ ...ff.script, fontSize: "3.6cqw" }}>{T.love}</p>
          <p className="italic" style={{ ...ff.display, fontSize: "3.8cqw" }}>{b ? `${a} & ${b}` : a}</p>
        </div>
      </>
    ));
  }

  // ── Programme & menu: tile band header, a handwritten list ──
  if (kind === "program" || kind === "menu") {
    const tall = kind === "menu";
    return root("lis-laid wa-paper bg-[var(--t-surface)]", (
      <div className="relative z-[2] flex h-full flex-col">
        {band(tall ? "12cqw" : "9cqw")}
        <div className="flex flex-1 flex-col items-center justify-between px-[9cqw] py-[7cqw] text-center">
          <div data-in className="flex flex-col items-center" style={{ gap: "1cqw" }}>
            <E as="p" path="texts.headline" className="block italic leading-none" style={{ ...ff.display, fontSize: `${(tall ? 12 : 8.5) * sc}cqw` }}>{c.headline}</E>
            <Flourish className={`${tall ? "w-[44cqw]" : "w-[30cqw]"} text-[var(--t-accent)]`} />
            <p className="text-[var(--t-accent)]" style={{ ...ff.script, fontSize: `${tall ? 6.5 : 4.6}cqw` }}>{b ? `${a} & ${b}` : a}</p>
          </div>
          <ul data-in className="w-full">
            {c.items.map((it, i) => (
              <li key={i} className="flex flex-col items-center" style={{ padding: `${tall ? 3.4 : 1.8}cqw 0` }}>
                <Tile variant="estrela" className="mb-[1.6cqw]" style={{ width: tall ? "5cqw" : "3.6cqw" }} />
                <E as="p" path={`items.${i}.title`} className="block uppercase" style={{ fontSize: `${tall ? 3.4 : 2.5}cqw`, letterSpacing: "0.3em" }}>{it.title}</E>
                {it.detail && <E as="p" path={`items.${i}.detail`} className="block italic text-[var(--t-muted)]" style={{ fontSize: `${tall ? 4.6 : 3.3}cqw`, marginTop: "0.6cqw" }}>{it.detail}</E>}
              </li>
            ))}
          </ul>
          <p className="uppercase text-[var(--t-muted)]" style={{ fontSize: "2cqw", letterSpacing: "0.34em" }}>{dp?.roman}</p>
        </div>
        {band(tall ? "5cqw" : "4cqw", "rosa")}
      </div>
    ));
  }

  // ── Letters: invite, event, greeting ──
  const greeting = kind === "greeting";
  return root("lis-laid wa-paper bg-[var(--t-surface)]", (
    <div className="relative z-[2] flex h-full flex-col">
      {band("10cqw")}
      {kind !== "event" && <Bougainvillea className="pointer-events-none absolute -right-[3cqw] top-[3cqw] z-[3] w-[24cqw]" seed={4} />}
      <div className="flex flex-1 flex-col items-center justify-between px-[9cqw] pb-[8cqw] pt-[6cqw] text-center">
        {kind === "event" ? (
          <div data-in className="flex flex-col items-center" style={{ gap: "1cqw" }}>
            <p className="uppercase text-[var(--t-muted)]" style={{ fontSize: "2.1cqw", letterSpacing: "0.32em" }}>{c.lead}</p>
            <E as="p" path="texts.headline" className="block leading-none text-[var(--t-accent)]" style={{ ...ff.script, fontSize: `${11 * sc}cqw` }}>{c.headline}</E>
          </div>
        ) : (
          <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.1cqw", letterSpacing: "0.34em" }}>{c.eyebrow}</E>
        )}
        {names(kind === "event" ? 9 : greeting ? 10 : 12.5, kind === "event")}
        {kind === "invite" && c.lead && <E as="p" multiline path={c.leadPath} className="block max-w-[70cqw] italic leading-snug text-[var(--t-muted)]" style={{ fontSize: "3.4cqw" }}>{c.lead}</E>}
        {greeting && c.body && <E as="p" multiline path="texts.body" className="block italic leading-snug text-[var(--t-muted)]" style={{ fontSize: "3.6cqw" }}>{c.body}</E>}
        {!greeting && <Church className="w-[34cqw] text-[var(--t-accent)]" />}
        {meta(2.3)}
        {c.footer && <E as="p" path={c.footerPath} className="block text-[var(--t-accent)]" style={{ ...ff.script, fontSize: "5.5cqw" }}>{c.footer}</E>}
      </div>
      <WaxSeal initials={ini} className="absolute bottom-[3cqw] right-[5cqw] w-[13cqw] rotate-[-8deg] drop-shadow-[0_1cqw_1.2cqw_rgba(5,15,45,.4)]" />
    </div>
  ));
}
