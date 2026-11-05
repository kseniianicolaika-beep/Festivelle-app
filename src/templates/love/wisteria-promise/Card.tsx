"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { KINDS } from "@/lib/templates";
import { cardCopy, GRAIN, shellStyle, vars, fitName } from "../_shared/kit";
import { CSS, Canopy, Leaves, Raceme, Wash, WpDefs, fontClass } from "./art";

// WISTERIA PROMISE stationery — cold-press watercolour paper, a wisteria canopy, dusk wash and brush calligraphy.
export default function Card({ kind, profile: p, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardCopy(kind, design, p, "western");
  const [a, b] = nameParts(p);
  const ratio = KINDS[kind].ratio;
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const d = (s: number) => ({ animationDelay: `${s}s` });
  const ru = p.language === "ru";
  const amp = ru ? "и" : "&";
  const both = <>{a}{b && <> {amp} {b}</>}</>;
  const landscape = kind === "thankyou";

  const names = (size = 16, inline = false) => (
    <h2 className="br inkc" style={{ fontSize: `${size * sc * fitName(a, b, 7, inline)}cqw` }}>
      <E path="profile.partner1" className={`ink inline-block px-[.12em] ${inline ? "" : "block"}`} style={d(1.2)}>{a}</E>
      {b && <span className={`di up text-[var(--t-accent)] ${inline ? "mx-[.15em] align-middle" : "block"}`} style={{ fontSize: ".3em", lineHeight: 1.6, ...d(1.7) }}>{amp}</span>}
      {b && <E path="profile.partner2" className={`ink inline-block px-[.12em] ${inline ? "" : "block"}`} style={d(1.6)}>{b}</E>}
    </h2>
  );
  const cap = (t: React.ReactNode, size = 2.4, path?: string, delay = 0.9) =>
    path ? <E as="p" path={path} className="cap up block text-[var(--t-muted)]" style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</E> : <p className="cap up text-[var(--t-muted)]" style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</p>;
  const when = (size = 4.2) => (
    <div className="up" style={d(2)}>
      {c.date && <p className="d" style={{ fontSize: `${size}cqw` }}>{c.date}{c.time && <> · {c.time}</>}</p>}
      {c.where && <E as="p" path={c.wherePath} className="cap mt-[.8cqw] block text-[var(--t-muted)]" style={{ fontSize: `${size * 0.55}cqw` }}>{c.where}</E>}
    </div>
  );
  const footer = (size = 9) => (c.footer ? <E as="p" path={c.footerPath} className="br inkc ink block" style={{ fontSize: `${size}cqw`, ...d(2.3) }}>{c.footer}</E> : null);
  const head = (size = 14, brush = true) => <E as="p" path="texts.headline" className={`${brush ? "br inkc ink" : "di up"} block`} style={{ fontSize: `${size * sc}cqw`, lineHeight: 1, ...d(0.9) }}>{c.headline}</E>;
  const items = (big = false) => (
    <ul className="w-full">
      {c.items.map((it, i) => (
        <li key={i} className="up" style={{ padding: `${big ? 2.6 : 2}cqw 0`, ...d(1 + i * 0.12) }}>
          <E as="p" path={`items.${i}.title`} className="di block" style={{ fontSize: `${big ? 6 : 5}cqw`, lineHeight: 1.1 }}>{it.title}</E>
          {it.detail && <E as="p" path={`items.${i}.detail`} className="d block text-[var(--t-muted)]" style={{ fontSize: `${big ? 3.6 : 3.1}cqw`, marginTop: ".6cqw" }}>{it.detail}</E>}
        </li>
      ))}
    </ul>
  );
  const canopy = (h = 34, n = 7, seed = 3) => <Canopy cq className="absolute inset-x-[-6%] top-0 z-[2]" count={n} grow={animate} seed={seed} />;
  const wash = <Wash className="absolute inset-0 h-full w-full opacity-90" />;
  const col = "relative z-[1] flex h-full flex-col items-center text-center";

  const body = (() => {
    switch (kind) {
      case "save":
        return (
          <>{wash}{canopy(34, 7, 5)}
            <div className={`${col} justify-end gap-[2.4cqw] px-[10cqw] pb-[12cqw]`}>
              {cap(c.eyebrow, 2.8, "texts.eyebrow")}
              <p className="br inkc ink leading-none" style={{ fontSize: `${30 * sc}cqw`, ...d(1) }}>{p.date ? Number(p.date.slice(8, 10)) : "—"}</p>
              <p className="di up" style={{ fontSize: "6cqw", ...d(1.4) }}>{c.date.replace(/^\d+\s*/, "")}</p>
              {names(11, true)}
              <p className="di up text-[var(--t-muted)]" style={{ fontSize: "3.8cqw", ...d(2) }}>{c.lead}{c.where && <> · <E path={c.wherePath}>{c.where}</E></>}</p>
            </div>
          </>
        );
      case "story":
        return (
          <>{wash}{canopy(40, 8, 7)}
            <div className={`${col} justify-end gap-[3cqw] px-[10cqw] pb-[14cqw]`}>
              {photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-edit-photo="photo" src={photoUrl} alt="" className="up aspect-[4/5] w-[52cqw] rounded-[50%] object-cover" style={{ filter: "url(#wp-wc)", ...d(1) }} />
              )}
              {cap(c.eyebrow, 3, "texts.eyebrow")}
              {names(21)}
              {when(5)}
              {footer(10)}
            </div>
          </>
        );
      case "post":
        return (
          <>{wash}{canopy(30, 8, 2)}
            <div className={`${col} justify-end gap-[1.6cqw] px-[8cqw] pb-[9cqw]`}>
              {names(15, true)}
              {cap(c.eyebrow, 2.4, "texts.eyebrow", 1.8)}
              {when(3.6)}
            </div>
          </>
        );
      case "thankyou":
        return (
          <div className="relative grid h-full grid-cols-[40%_1fr]">
            <div className="relative overflow-hidden">{wash}<Canopy cq className="absolute inset-x-[-10%] top-0" count={4} grow={animate} seed={8} /></div>
            <div className="relative z-[1] flex flex-col items-center justify-center gap-[1.6cqw] px-[5cqw] text-center">
              {head(13)}
              <E as="p" multiline path="texts.body" className="di up block text-[var(--t-muted)]" style={{ fontSize: "3cqw", lineHeight: 1.4, ...d(1.4) }}>{c.body}</E>
              <p className="br inkc" style={{ fontSize: "7cqw" }}>{both}</p>
            </div>
          </div>
        );
      case "program":
      case "menu":
        return (
          <>{canopy(28, 7, 4)}
            <div className={`${col} px-[12cqw] pb-[10cqw] ${kind === "menu" ? "pt-[46cqw]" : "pt-[40cqw]"}`}>
              {head(kind === "menu" ? 20 : 15)}
              <p className="di mt-[1cqw] text-[var(--t-accent)]" style={{ fontSize: "4.4cqw" }}>{both}</p>
              <div className="mt-[3cqw] flex w-full flex-1 flex-col justify-evenly">{items(kind === "menu")}</div>
              <Leaves className="w-[14cqw] rotate-90" />
            </div>
          </>
        );
      case "table":
        return (
          <>{wash}{canopy(30, 8, 6)}
            <div className={`${col} justify-end pb-[10cqw]`}>
              <E as="p" path="texts.headline" className="cap block text-[var(--t-muted)]" style={{ fontSize: "3cqw" }}>{c.headline}</E>
              <p className="br inkc ink leading-none" style={{ fontSize: `${40 * sc}cqw`, ...d(1) }}>{c.number}</p>
              <p className="di text-[var(--t-accent)]" style={{ fontSize: "4.6cqw" }}>{both}</p>
            </div>
          </>
        );
      case "hashtag":
        return (
          <>{wash}{canopy(32, 8, 9)}
            <div className={`${col} justify-end gap-[3cqw] px-[9cqw] pb-[13cqw]`}>
              <E as="p" path="texts.body" className="br inkc ink block" style={{ fontSize: "12cqw", ...d(1) }}>{c.body}</E>
              <E as="p" path="texts.hashtag" className="di up block break-all" style={{ fontSize: `${8 * sc}cqw`, ...d(1.6) }}>{c.hashtag}</E>
              {cap(both, 2.2, undefined, 2)}
            </div>
          </>
        );
      case "greeting":
        return (
          <>{canopy(30, 7, 10)}
            <div className={`${col} justify-end gap-[2.6cqw] px-[11cqw] pb-[12cqw]`}>
              {head(17)}
              {c.body && <E as="p" multiline path="texts.body" className="di up block whitespace-pre-line" style={{ fontSize: "4.3cqw", lineHeight: 1.5, ...d(1.4) }}>{c.body}</E>}
              {footer(10)}
              <p className="cap text-[var(--t-muted)]" style={{ fontSize: "2.2cqw" }}>{both}</p>
            </div>
          </>
        );
      case "event":
      case "welcome":
      default: // invite
        return (
          <>{canopy(34, 7, kind === "invite" ? 3 : 12)}
            <div className={`${col} justify-end gap-[2.4cqw] px-[11cqw] pb-[11cqw]`}>
              {cap(c.eyebrow, 2.3, "texts.eyebrow")}
              {kind === "event" ? <><p className="di up text-[var(--t-accent)]" style={{ fontSize: "5.6cqw", ...d(1) }}>{both}</p>{head(13)}</> : names(kind === "welcome" ? 21 : 18)}
              {kind === "invite" && <E as="p" multiline path={c.leadPath} className="di up block" style={{ fontSize: "4.2cqw", lineHeight: 1.35, ...d(1.8) }}>{c.lead}</E>}
              <div className="flex items-center gap-[2cqw]"><Raceme h={36} seed={4} className="w-[3cqw] -rotate-90" /><span className="h-px w-[14cqw] bg-[var(--t-gold)]" /><Raceme h={36} seed={5} className="w-[3cqw] rotate-90" /></div>
              {when(4)}
              {kind === "invite" && footer(8)}
            </div>
          </>
        );
    }
  })();

  return (
    <div
      lang={p.language ?? "en"}
      style={{ ...vars(theme, design, "classic"), ...shellStyle(ratio) }}
      className={`wp ${fontClass} ${animate ? "" : "still"} relative w-full overflow-hidden rounded-[2px] bg-[var(--t-surface)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(70,40,110,.45),0_0_0_1px_rgba(0,0,0,.04)] ${className}`}
    >
      <style href="love-wp" precedence="default">{CSS}</style>
      <WpDefs />
      {!landscape && <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_50%_at_50%_100%,color-mix(in_oklab,var(--t-accent)_12%,transparent),transparent_70%)]" />}
      {body}
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}
