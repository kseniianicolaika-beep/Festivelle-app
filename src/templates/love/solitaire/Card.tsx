"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { KINDS } from "@/lib/templates";
import { cardCopy, GRAIN, shellStyle, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { Ring, Rule, Silk } from "./art";

// SOLITAIRE stationery — cotton letterpress on blush, a foil brilliant, deep-debossed names.
export default function Card({ kind, profile: p, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardCopy(kind, design, p, "western");
  const [a, b] = nameParts(p);
  const ratio = KINDS[kind].ratio;
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const d = (s: number) => ({ animationDelay: `${s}s` });

  const Names = ({ size = 13, foil = false, inline = false }: { size?: number; foil?: boolean; inline?: boolean }) => (
    <h2 className={`d leading-[.9] ${foil ? "" : "deboss"}`} style={{ fontSize: `${size * sc * fitName(a, b, 8, inline)}cqw` }}>
      <E path="profile.partner1" className={`up ${inline ? "" : "block"} ${foil ? "foil" : ""}`} style={d(0.5)}>{a}</E>
      {b && <span className={`sc fade text-[var(--t-accent)] ${inline ? "mx-[.25em]" : "block"}`} style={{ fontSize: "0.5em", lineHeight: 1.25, textShadow: "none", ...d(0.9) }}>&amp;</span>}
      {b && <E path="profile.partner2" className={`up ${inline ? "" : "block"} ${foil ? "foil" : ""}`} style={d(0.7)}>{b}</E>}
    </h2>
  );
  const Cap = ({ children, path, size = 2.1, cls = "text-[var(--t-muted)]", delay = 0.3 }: { children: React.ReactNode; path?: string; size?: number; cls?: string; delay?: number }) =>
    path ? <E as="p" path={path} className={`cap up block ${cls}`} style={{ fontSize: `${size}cqw`, ...d(delay) }}>{children}</E> : <p className={`cap up ${cls}`} style={{ fontSize: `${size}cqw`, ...d(delay) }}>{children}</p>;
  const When = ({ size = 4.4 }: { size?: number }) => (
    <div className="up" style={d(1.1)}>
      {c.date && <p className="di" style={{ fontSize: `${size}cqw` }}>{c.date}</p>}
      {(c.time || c.where) && (
        <p className="cap mt-[1cqw] text-[var(--t-muted)]" style={{ fontSize: "2cqw" }}>
          {c.time}{c.time && c.where ? " · " : ""}{c.where && <E path={c.wherePath}>{c.where}</E>}
        </p>
      )}
    </div>
  );
  const Footer = ({ size = 5.4 }: { size?: number }) => (c.footer ? <E as="p" path={c.footerPath} className="sc fade block text-[var(--t-accent)]" style={{ fontSize: `${size}cqw`, ...d(1.4) }}>{c.footer}</E> : null);
  const Items = ({ big = false }: { big?: boolean }) => (
    <ul className="w-full">
      {c.items.map((it, i) => (
        <li key={i} className="up" style={{ padding: `${big ? 3.2 : 2.4}cqw 0`, ...d(0.6 + i * 0.12) }}>
          <svg viewBox="0 0 10 10" className="mx-auto mb-[1.4cqw] w-[2cqw]" aria-hidden><path d="M5 0l5 5-5 5-5-5Z" fill="var(--t-gold)" /></svg>
          <E as="p" path={`items.${i}.title`} className="d block" style={{ fontSize: `${big ? 6.4 : 5}cqw`, lineHeight: 1.05 }}>{it.title}</E>
          {it.detail && <E as="p" path={`items.${i}.detail`} className="di block text-[var(--t-muted)]" style={{ fontSize: `${big ? 3.6 : 3}cqw`, marginTop: "0.8cqw" }}>{it.detail}</E>}
        </li>
      ))}
    </ul>
  );
  const Head = ({ size = 9 }: { size?: number }) => <E as="p" path="texts.headline" className="di up block leading-none" style={{ fontSize: `${size}cqw`, ...d(0.3) }}>{c.headline}</E>;
  const Photo = ({ cls }: { cls: string }) =>
    photoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img data-edit-photo="photo" src={photoUrl} alt="" className={`${cls} object-cover`} />
    ) : (
      <div data-edit-photo="photo" className={`${cls} relative`}><Silk id={`sol-ph-${kind}`} className="absolute inset-0 h-full w-full" /><Ring id={`sol-phr-${kind}`} className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
    );

  const frame = (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-[2.6cqw] border border-[var(--t-gold)]/55" />
      <div aria-hidden className="pointer-events-none absolute inset-[3.6cqw] border border-[var(--t-gold)]/20" />
    </>
  );
  const col = "relative flex h-full flex-col items-center text-center";

  const body = (() => {
    switch (kind) {
      case "save":
        return (
          <div className={`${col} justify-between px-[10cqw] py-[11cqw]`}>
            {frame}
            <div className="flex flex-col items-center gap-[2cqw]">
              <Ring id="sol-c" className="ringin w-[20cqw]" />
              <E as="p" path="texts.eyebrow" className="cap up block text-[var(--t-accent)]" style={{ fontSize: "2.3cqw", ...d(0.3) }}>{c.eyebrow}</E>
            </div>
            <div>
              <p className="d deboss up leading-[.8]" style={{ fontSize: `${40 * sc}cqw`, ...d(0.5) }}>{p.date ? new Date(p.date + "T12:00:00Z").getUTCDate() : "♢"}</p>
              <p className="di up" style={{ fontSize: "6cqw", marginTop: "7cqw", ...d(0.8) }}>{c.date.replace(/^\d+\s*/, "")}</p>
            </div>
            <div className="flex flex-col items-center gap-[1.6cqw]">
              <Names size={7} inline foil />
              <p className="di up text-[var(--t-muted)]" style={{ fontSize: "3.6cqw", ...d(1) }}>{c.lead}</p>
              {c.where && <Cap path={c.wherePath} delay={1.2}>{c.where}</Cap>}
            </div>
          </div>
        );
      case "event":
        return (
          <div className={`${col} justify-center gap-[3.4cqw] px-[10cqw] py-[11cqw]`}>
            {frame}
            <Ring id="sol-c" className="ringin w-[18cqw]" />
            <E as="p" path="texts.eyebrow" className="cap up block text-[var(--t-muted)]" style={{ fontSize: "2.1cqw", ...d(0.2) }}>{c.eyebrow}</E>
            <p className="sc up text-[var(--t-accent)]" style={{ fontSize: "7cqw", ...d(0.4) }}>{a}{b && <> &amp; {b}</>}</p>
            <Head size={11} />
            <Rule className="w-[40cqw]" />
            <When size={5} />
          </div>
        );
      case "story":
        return (
          <div className={`${col} justify-between`}>
            <Silk id="sol-c-silk" className="absolute inset-0 h-full w-full" />
            <div className="relative mt-[11cqw] w-[60cqw]">
              <div className="iris relative aspect-[3/4] overflow-hidden rounded-[999px_999px_3cqw_3cqw] shadow-[0_6cqw_10cqw_-6cqw_rgba(110,40,60,.5)] ring-1 ring-[var(--t-gold)]/50"><Photo cls="h-full w-full" /></div>
              <Ring id="sol-c" className="ringin absolute -bottom-[8cqw] left-1/2 w-[18cqw] -translate-x-1/2" />
            </div>
            <div className="relative mb-[12cqw] mt-[12cqw] flex flex-col items-center gap-[3cqw] px-[8cqw]">
              <E as="p" path="texts.eyebrow" className="cap up block text-[var(--t-accent)]" style={{ fontSize: "2.8cqw", ...d(0.4) }}>{c.eyebrow}</E>
              <Names size={15} />
              <When size={5.6} />
              <Footer size={7} />
            </div>
          </div>
        );
      case "post":
        return (
          <div className={`${col} justify-center gap-[2.4cqw]`}>
            <Silk id="sol-c-silk" className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_45%,rgba(255,255,255,.7),transparent)]" />
            <div className="relative flex flex-col items-center gap-[2.4cqw]">
              <Ring id="sol-c" className="ringin w-[24cqw]" />
              <Names size={12} inline />
              <E as="p" path="texts.eyebrow" className="cap up block text-[var(--t-accent)]" style={{ fontSize: "2.4cqw", ...d(1) }}>{c.eyebrow}</E>
              <p className="di up" style={{ fontSize: "4.4cqw", ...d(1.2) }}>{c.date}</p>
            </div>
          </div>
        );
      case "welcome":
        return (
          <div className={`${col} justify-between px-[10cqw] py-[12cqw]`}>
            {frame}
            <Ring id="sol-c" className="ringin w-[24cqw]" />
            <div className="flex flex-col items-center gap-[3cqw]">
              <E as="p" path="texts.eyebrow" className="di up block text-[var(--t-muted)]" style={{ fontSize: "5cqw", ...d(0.3) }}>{c.eyebrow}</E>
              <Names size={17} />
            </div>
            <When size={5} />
          </div>
        );
      case "program":
      case "menu":
        return (
          <div className={`${col} px-[10cqw] py-[12cqw]`}>
            {frame}
            <Ring id="sol-c" glint={false} className="ringin w-[14cqw]" />
            <Head size={kind === "menu" ? 13 : 10} />
            <p className="sc up mt-[1cqw] text-[var(--t-accent)]" style={{ fontSize: "5cqw", ...d(0.4) }}>{a}{b && <> &amp; {b}</>}</p>
            <div className="mt-[3cqw] flex w-full flex-1 flex-col justify-evenly"><Items big={kind === "menu"} /></div>
          </div>
        );
      case "table":
        return (
          <div className={`${col} justify-center gap-[2cqw]`}>
            {frame}
            <div className="relative flex h-[62cqw] w-[62cqw] items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden><circle cx="50" cy="50" r="48" fill="none" stroke="var(--t-gold)" strokeWidth=".5" /><circle cx="50" cy="50" r="44" fill="none" stroke="var(--t-gold)" strokeWidth=".25" strokeDasharray=".6 1.4" /></svg>
              <Ring id="sol-c" className="absolute -top-[9cqw] left-1/2 w-[18cqw] -translate-x-1/2" />
              <div>
                <E as="p" path="texts.headline" className="cap block text-[var(--t-muted)]" style={{ fontSize: "2.6cqw" }}>{c.headline}</E>
                <p className="d deboss up leading-none" style={{ fontSize: `${30 * sc}cqw` }}>{c.number}</p>
              </div>
            </div>
            <p className="sc text-[var(--t-accent)]" style={{ fontSize: "5cqw" }}>{a}{b && <> &amp; {b}</>}</p>
          </div>
        );
      case "hashtag":
        return (
          <div className={`${col} justify-center gap-[3.4cqw] px-[9cqw]`}>
            {frame}
            <Ring id="sol-c" className="ringin w-[22cqw]" />
            <E as="p" path="texts.body" className="sc up block text-[var(--t-accent)]" style={{ fontSize: "8cqw", ...d(0.3) }}>{c.body}</E>
            <E as="p" path="texts.hashtag" className="d foil up block break-all leading-[1]" style={{ fontSize: `${9.5 * sc}cqw`, ...d(0.5) }}>{c.hashtag}</E>
            <Rule className="w-[40cqw]" />
            <p className="cap text-[var(--t-muted)]" style={{ fontSize: "2.1cqw" }}>{a}{b && <> &amp; {b}</>}</p>
          </div>
        );
      case "thankyou":
        return (
          <div className="relative grid h-full grid-cols-[42%_1fr]">
            <div className="relative overflow-hidden">
              <Silk id="sol-c-silk" className="absolute inset-0 h-full w-full" />
              <Ring id="sol-c" className="ringin absolute left-1/2 top-1/2 w-[24cqw] -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative flex flex-col items-center justify-center gap-[2cqw] px-[6cqw] text-center">
              <div aria-hidden className="pointer-events-none absolute inset-[2.6cqw] left-0 border border-l-0 border-[var(--t-gold)]/50" />
              <E as="p" path="texts.headline" className="d deboss up block leading-[.9]" style={{ fontSize: `${11 * sc}cqw`, ...d(0.3) }}>{c.headline}</E>
              <E as="p" multiline path="texts.body" className="di up block text-[var(--t-muted)]" style={{ fontSize: "3cqw", lineHeight: 1.35, ...d(0.6) }}>{c.body}</E>
              <p className="sc up text-[var(--t-accent)]" style={{ fontSize: "5cqw", ...d(0.9) }}>{a}{b && <> &amp; {b}</>}</p>
            </div>
          </div>
        );
      case "greeting":
        return (
          <div className={`${col} justify-center gap-[3cqw] px-[11cqw] py-[12cqw]`}>
            {frame}
            <Ring id="sol-c" className="ringin w-[22cqw]" />
            <E as="p" path="texts.headline" className="sc up block text-[var(--t-accent)]" style={{ fontSize: `${12 * sc}cqw`, lineHeight: 1, ...d(0.3) }}>{c.headline}</E>
            {c.eyebrow && <E as="p" path="texts.eyebrow" className="cap up block text-[var(--t-muted)]" style={{ fontSize: "2.1cqw", ...d(0.5) }}>{c.eyebrow}</E>}
            <Names size={9} inline />
            {c.body && <E as="p" multiline path="texts.body" className="di up block whitespace-pre-line" style={{ fontSize: "4cqw", lineHeight: 1.4, ...d(0.9) }}>{c.body}</E>}
            <Footer />
          </div>
        );
      default: // invite
        return (
          <div className={`${col} justify-between px-[11cqw] py-[11cqw]`}>
            {frame}
            <div className="flex flex-col items-center gap-[2.2cqw]">
              <Ring id="sol-c" className="ringin w-[21cqw]" />
              <E as="p" path="texts.eyebrow" className="cap up block text-[var(--t-muted)]" style={{ fontSize: "2.1cqw", ...d(0.3) }}>{c.eyebrow}</E>
            </div>
            <Names size={14} />
            <div className="flex flex-col items-center gap-[2.6cqw]">
              <E as="p" multiline path={c.leadPath} className="di up block max-w-[64cqw]" style={{ fontSize: "3.9cqw", lineHeight: 1.35, ...d(0.9) }}>{c.lead}</E>
              <Rule className="w-[38cqw]" />
              <When />
              <Footer />
            </div>
          </div>
        );
    }
  })();

  return (
    <div
      lang={p.language ?? "en"}
      style={{ ...vars(theme, design, "playfair"), ...shellStyle(ratio) }}
      className={`sol ${fontClass} ${animate ? "" : "still"} relative w-full overflow-hidden rounded-[2px] bg-[var(--t-surface)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(110,40,60,.5),0_0_0_1px_rgba(0,0,0,.04)] ${className}`}
    >
      <style href="love-sol" precedence="default">{CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_100%_0%,color-mix(in_oklab,var(--t-accent)_10%,transparent),transparent_60%),radial-gradient(70%_50%_at_0%_100%,color-mix(in_oklab,var(--foil-b)_18%,transparent),transparent_60%)]" />
      {body}
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}
