"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CardShell, fit, lookStyle, useStage } from "../_shared/kit";
import { cardText, dateParts } from "../_shared/text";
import { Spray, Sprig, Wash } from "./art";
import { SAGE_LOOK } from "./look";
import { s, SageStyles } from "./styles";

const serif: CSSProperties = { fontFamily: "var(--wd)" };
const cq = (n: number) => `${n}cqw`;

export default function SageCard({ kind, profile, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const c = cardText(kind, design, profile);
  const dp = dateParts(c.iso, c.lang);
  const land = kind === "thankyou";
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.3);
  const longest = Math.max([...c.a].length, [...(c.b || "")].length);
  const pair = `${c.a}${c.b ? ` & ${c.b}` : ""}`;

  useStage(ref, (g, q) => {
    const tl = g.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q("[data-stem]"), { drawSVG: 0, duration: 1.6, ease: "power2.inOut" }, 0);
    q("[data-leaf]").forEach((el, i) => tl.from(el, { scale: 0, opacity: 0, svgOrigin: (el as SVGGElement).dataset.o, duration: 0.8, ease: "back.out(1.6)" }, 0.3 + i * 0.035));
    tl.from(q("[data-in]"), { opacity: 0, y: 10, filter: "blur(6px)", duration: 1.2, stagger: 0.1 }, 0.4);
  }, [kind], animate);

  const Lb = ({ children, size = 1.9, path, className: cl = "" }: { children: ReactNode; size?: number; path?: string; className?: string }) =>
    path ? <E as="p" path={path} className={`${s.label} block text-[var(--t-muted)] ${cl}`} style={{ fontSize: cq(size) }}>{children}</E>
      : <p data-in className={`${s.label} text-[var(--t-muted)] ${cl}`} style={{ fontSize: cq(size) }}>{children}</p>;

  const names = (base: number, avail = 78) => {
    const size = fit("x".repeat(longest), base * scale, avail, 0.5);
    return (
      <div data-in className={`${s.press} font-light`} style={{ ...serif, fontSize: cq(size), lineHeight: 0.88, letterSpacing: "-0.02em" }}>
        <E as="h2" path="profile.partner1" className="block">{c.a}</E>
        {c.b && (
          <>
            <span className="block italic text-[var(--t-accent)]" style={{ fontSize: "0.42em", lineHeight: 1.15, paddingLeft: "1.6em" }}>&amp;</span>
            <E as="h2" path="profile.partner2" className="block" style={{ paddingLeft: "0.5em" }}>{c.b}</E>
          </>
        )}
      </div>
    );
  };
  const rule = <div data-in className={s.rule} style={{ width: "100%" }} />;
  const meta = (size = 1.8) => (
    <div data-in className="grid grid-cols-2 items-end" style={{ gap: cq(3) }}>
      <div>
        {dp && <p className="italic leading-tight" style={{ ...serif, fontSize: cq(size * 2.1) }}>{dp.day} {dp.month}<br />{dp.year}</p>}
        {c.time && <p className={`${s.label} text-[var(--t-muted)]`} style={{ fontSize: cq(size), marginTop: cq(1) }}>{dp?.weekday} · {c.time}</p>}
      </div>
      <div className="text-right">
        {c.where && (c.venue && kind !== "save" ? <E as="p" path="profile.venue" className="block italic leading-tight" style={{ ...serif, fontSize: cq(size * 2.1) }}>{c.where}</E> : <p className="italic leading-tight" style={{ ...serif, fontSize: cq(size * 2.1) }}>{c.where}</p>)}
        {c.city && c.city !== c.where && <p className={`${s.label} text-[var(--t-muted)]`} style={{ fontSize: cq(size), marginTop: cq(1) }}>{c.city}</p>}
      </div>
    </div>
  );
  const footer = (size = 3.6) => c.footer && <E as="p" path={design.texts?.footer ? "texts.footer" : "profile.blessing"} className="block italic text-[var(--t-accent)]" style={{ ...serif, fontSize: cq(size) }}>{c.footer}</E>;
  const col = (children: ReactNode, gap = 3, justify = "justify-end") => <div className={`flex h-full flex-col ${justify}`} style={{ gap: cq(gap) }}>{children}</div>;

  let body: ReactNode;
  let spray: ReactNode = <div className="pointer-events-none absolute" style={{ top: cq(-6), right: cq(-8), width: cq(64) }}><Spray seed={kind.length * 3} /></div>;
  switch (kind) {
    case "save":
      body = col(<>
        <Lb path="texts.eyebrow" size={2.1}>{c.eyebrow}</Lb>
        {dp && (
          <div data-in className={`${s.press} font-light`} style={{ ...serif, lineHeight: 0.8 }}>
            <span style={{ fontSize: cq(30), letterSpacing: "-0.03em" }}>{dp.dd}<span className="text-[var(--t-accent)]">.</span>{dp.mm}</span>
            <span className="block italic" style={{ fontSize: cq(8), marginTop: cq(2) }}>{dp.year}</span>
          </div>
        )}
        {rule}
        <p data-in className="italic" style={{ ...serif, fontSize: cq(6.4), lineHeight: 1.05 }}><E path="profile.partner1">{c.a}</E>{c.b && <> <span className="text-[var(--t-accent)]">&amp;</span> <E path="profile.partner2">{c.b}</E></>}</p>
        <Lb>{[c.where, c.sub].filter(Boolean).join(" — ")}</Lb>
      </>, 3.2);
      break;
    case "event":
      body = col(<>
        <p data-in className="italic text-[var(--t-muted)]" style={{ ...serif, fontSize: cq(3.4) }}>{pair}</p>
        <p data-in className={`${s.label} text-[var(--t-muted)]`} style={{ fontSize: cq(1.9) }}>{c.lead}</p>
        <E as="h3" path="texts.headline" className={`${s.press} block font-light leading-[0.95]`} style={{ ...serif, fontSize: cq(fit(c.headline, 13, 150, 0.48)) }}>{c.headline}</E>
        {rule}
        {meta()}
      </>, 3);
      break;
    case "story":
      spray = <div className="pointer-events-none absolute" style={{ top: cq(-8), right: cq(-12), width: cq(86) }}><Spray seed={4} /></div>;
      body = col(<>
        <Lb path="texts.eyebrow" size={2.6}>{c.eyebrow}</Lb>
        {photoUrl && (
          <div data-in className="relative overflow-hidden" style={{ width: cq(74), aspectRatio: "4 / 5", boxShadow: "0 2cqw 5cqw -3cqw rgba(40,50,40,.45)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-edit-photo="photo" src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "saturate(.82)" }} />
          </div>
        )}
        {names(photoUrl ? 15 : 22)}
        {rule}
        {meta(2.4)}
      </>, 4.4);
      break;
    case "post":
      body = col(<>
        <Lb path="texts.eyebrow" size={2.1}>{c.eyebrow}</Lb>
        {names(15, 64)}
        {rule}
        {meta(1.8)}
      </>, 2.6);
      break;
    case "welcome":
      body = col(<>
        <Lb path="texts.eyebrow" size={2.2}>{c.eyebrow}</Lb>
        {names(19)}
        {rule}
        {meta(2)}
        {footer(4)}
      </>, 3.4);
      break;
    case "program":
    case "menu": {
      const menu = kind === "menu";
      body = col(<>
        <E as="h3" path="texts.headline" className={`${s.press} block font-light italic leading-none`} style={{ ...serif, fontSize: cq(fit(c.headline, menu ? 16 : 10, 76, 0.46)) }}>{c.headline}</E>
        <p data-in className={`${s.label} text-[var(--t-muted)]`} style={{ fontSize: cq(menu ? 2.6 : 1.9) }}>{pair}{dp ? ` · ${dp.full}` : ""}</p>
        {rule}
        <ol className="flex flex-col" style={{ gap: cq(menu ? 7 : 3.4) }}>
          {c.items.map((it, i) => (
            <li data-in key={i} className="grid" style={{ gridTemplateColumns: `${cq(menu ? 9 : 7)} 1fr` }}>
              <span className="italic text-[var(--t-accent)]" style={{ ...serif, fontSize: cq(menu ? 5 : 3.6), lineHeight: 1 }}>{["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"][i] ?? i + 1}.</span>
              <div>
                <E as="span" path={`items.${i}.title`} className="block leading-tight" style={{ ...serif, fontSize: cq(menu ? 6 : 4.4) }}>{it.title}</E>
                {it.detail && <E as="span" path={`items.${i}.detail`} className="block italic leading-snug text-[var(--t-muted)]" style={{ ...serif, fontSize: cq(menu ? 4 : 3), marginTop: cq(0.6) }}>{it.detail}</E>}
              </div>
            </li>
          ))}
        </ol>
      </>, menu ? 4.4 : 3, menu ? "justify-center" : "justify-end");
      if (menu) spray = <div className="pointer-events-none absolute" style={{ top: cq(-8), right: cq(-14), width: cq(84) }}><Spray seed={12} /></div>;
      break;
    }
    case "table":
      spray = <div className="pointer-events-none absolute" style={{ bottom: cq(-10), left: cq(-12), width: cq(62), transform: "rotate(180deg)" }}><Spray seed={7} /></div>;
      body = (
        <div className="flex h-full flex-col items-end justify-start text-right">
          <E as="p" path="texts.headline" className={`${s.label} block text-[var(--t-muted)]`} style={{ fontSize: cq(2.6) }}>{c.headline}</E>
          <p data-in className={`${s.press} font-light italic`} style={{ ...serif, fontSize: cq(52), lineHeight: 0.9 }}>{c.number}</p>
          <p data-in className="italic text-[var(--t-accent)]" style={{ ...serif, fontSize: cq(4.4) }}>{pair}</p>
        </div>
      );
      break;
    case "hashtag":
      body = col(<>
        <E as="p" path="texts.body" className={`${s.label} block text-[var(--t-muted)]`} style={{ fontSize: cq(2.2), lineHeight: 1.8 }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`${s.press} block break-all font-light italic leading-none`} style={{ ...serif, fontSize: cq(fit(c.hashtag, 11, 80, 0.44)) }}>{c.hashtag}</E>
        {rule}
        <p data-in className="italic" style={{ ...serif, fontSize: cq(4) }}>{pair}</p>
      </>, 3.4);
      break;
    case "thankyou":
      spray = <div className="pointer-events-none absolute" style={{ top: cq(-6), left: cq(-6), width: cq(46), transform: "scaleX(-1)" }}><Spray seed={15} /></div>;
      body = (
        <div className="ml-auto flex h-full w-[58%] flex-col justify-center" style={{ gap: cq(2) }}>
          <E as="h3" path="texts.headline" className={`${s.press} block font-light italic leading-[0.9]`} style={{ ...serif, fontSize: cq(fit(c.headline, 11, 56, 0.46)) }}>{c.headline}</E>
          <div data-in className={s.rule} />
          <E as="p" multiline path="texts.body" className="block italic leading-snug text-[var(--t-muted)]" style={{ ...serif, fontSize: cq(2.9) }}>{c.body}</E>
          <p data-in className={`${s.label} text-[var(--t-ink)]`} style={{ fontSize: cq(1.5) }}>{pair}</p>
        </div>
      );
      break;
    case "greeting":
      body = col(<>
        <Lb path="texts.eyebrow" size={2}>{c.eyebrow}</Lb>
        {names(16)}
        {rule}
        {c.body && <E as="p" multiline path="texts.body" className="block italic leading-snug text-[var(--t-muted)]" style={{ ...serif, fontSize: cq(3.6) }}>{c.body}</E>}
        {footer(4.4)}
      </>, 3);
      break;
    default: // invite
      body = col(<>
        <Lb path="texts.eyebrow" size={1.9}>{c.eyebrow}</Lb>
        <E as="p" multiline path="profile.inviteLine" className="block max-w-[64cqw] italic leading-snug text-[var(--t-muted)]" style={{ ...serif, fontSize: cq(3.9) }}>{c.lead}</E>
        {names(19)}
        {rule}
        {meta(1.8)}
        {footer(3.6)}
      </>, 3);
  }

  return (
    <CardShell kind={kind} innerRef={ref} lang={profile.language ?? "en"} className={`${s.root} ${s.cotton} ${animate ? "" : s.still} ${className}`} style={{ ...lookStyle(SAGE_LOOK, design, "sage-linen"), background: undefined }}>
      <SageStyles />
      <Wash className="pointer-events-none absolute" style={{ top: land ? "-10%" : "-6%", right: "-14%", width: "80%", height: land ? "80%" : "44%" }} color="#c3d1c0" opacity={0.26} />
      {spray}
      <div aria-hidden className="pointer-events-none absolute" style={{ inset: cq(land ? 3 : 4), boxShadow: "inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 0 rgba(255,255,255,.9), 0 0 0 1px rgba(60,70,55,.08)" }} />
      <div className="absolute inset-0" style={{ padding: land ? "8cqw 9cqw" : kind === "menu" || kind === "story" ? "14cqw 11cqw" : "11cqw 10cqw" }}>{body}</div>
      {kind === "invite" || kind === "greeting" ? <div className="pointer-events-none absolute" style={{ bottom: cq(4), right: cq(6), width: cq(26), opacity: 0.85 }}><Sprig seed={41} seeded /></div> : null}
    </CardShell>
  );
}
