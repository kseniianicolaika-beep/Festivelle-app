"use client";
import type { CSSProperties, ReactNode } from "react";
import { E } from "@/components/designs/Editable";
import type { Profile } from "@/lib/profile";
import type { Design, Kind } from "@/lib/templates";
import { bodyPath, footerPath, shapeOf, type CardText } from "./kit";

// Shared text stack for every paper/social kind. Templates restyle it through scoped CSS on these class hooks:
// .an-eyebrow .an-lead .an-head .an-name .an-amp .an-sub .an-both .an-num .an-tag .an-tagline .an-item-t .an-item-d
// .an-body .an-date .an-where .an-foot  — sizes are in cqw (card width) so it scales with the container.
export function KindBody({ kind, c, profile, design, a, b, rule, amp = "&", hideNames, hideFooter, gap, style, className = "" }: {
  kind: Kind; c: CardText; profile: Profile; design: Design; a: string; b: string; rule?: ReactNode; amp?: ReactNode;
  hideNames?: boolean; hideFooter?: boolean; gap?: string; style?: CSSProperties; className?: string;
}) {
  const shape = shapeOf(kind);
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const n = (shape === "wide" ? 7.4 : shape === "tall" ? 11 : shape === "square" ? 8.6 : 10) * scale * (c.headline && c.names ? 0.78 : 1);
  const both = b ? `${a} & ${b}` : a;
  return (
    <div className={`an-stack relative flex w-full flex-col items-center text-center ${className}`} style={{ gap: gap ?? (shape === "tall" ? "3.2cqw" : "2.2cqw"), ...style }}>
      {c.eyebrow && <E as="p" path="texts.eyebrow" className="an-eyebrow block">{c.eyebrow}</E>}
      {c.lead && (kind === "invite"
        ? <E as="p" multiline path="profile.inviteLine" className="an-lead block">{c.lead}</E>
        : <p className="an-lead">{c.lead}</p>)}
      {c.number !== undefined ? (
        <>
          <E as="p" path="texts.headline" className="an-head block">{c.headline}</E>
          <p className="an-num">{c.number}</p>
          <p className="an-both">{both}</p>
        </>
      ) : c.hashtag ? (
        <>
          <E as="p" path="texts.body" className="an-tagline block">{c.body}</E>
          <E as="p" path="texts.hashtag" className="an-tag block">{c.hashtag}</E>
          <p className="an-both">{both}</p>
        </>
      ) : (
        <>
          {c.headline && <E as="p" path="texts.headline" className="an-head block">{c.headline}</E>}
          {c.names && !hideNames && (
            <div className="an-names" style={{ fontSize: `${n}cqw` }}>
              <E as="h2" path="profile.partner1" className="an-name block">{a}</E>
              {b && <span className="an-amp block">{amp}</span>}
              {b && <E as="h2" path="profile.partner2" className="an-name block">{b}</E>}
            </div>
          )}
          {!c.names && kind !== "table" && <p className="an-both">{both}</p>}
          {c.sub && <p className="an-sub">{c.sub}</p>}
        </>
      )}
      {!!c.items.length && (
        <ul className="an-items w-full">
          {c.items.map((it, i) => (
            <li key={i} className="an-item">
              <E as="p" path={`items.${i}.title`} className="an-item-t block">{it.title}</E>
              {it.detail && <E as="p" path={`items.${i}.detail`} className="an-item-d block">{it.detail}</E>}
            </li>
          ))}
        </ul>
      )}
      {c.body && !c.hashtag && <E as="p" multiline path={bodyPath(kind, design)} className="an-body block whitespace-pre-line">{c.body}</E>}
      {!hideFooter && (c.date || c.where || c.footer) && (
        <div className="an-foot-wrap flex flex-col items-center">
          {rule}
          {c.date && <p className="an-date">{c.date}</p>}
          {c.where && <E as="p" path={c.where === profile.venue ? "profile.venue" : "profile.city"} className="an-where block">{c.where}</E>}
          {c.footer && <E as="p" path={footerPath(kind, design)} className="an-foot block">{c.footer}</E>}
        </div>
      )}
    </div>
  );
}

/** Base cqw sizes, overridable per template (lower specificity: :where). */
export const BASE_CARD_CSS = `
.an-f-d{font-family:var(--a-display)}.an-f-s{font-family:var(--a-script)}.an-f-b{font-family:var(--a-body)}.an-f-l{font-family:var(--a-label)}
.an-cap{font-family:var(--a-label);text-transform:uppercase;letter-spacing:.32em}
:where(.an-card) .an-eyebrow{font-size:2.3cqw;letter-spacing:.32em;text-transform:uppercase}
:where(.an-card) .an-lead{font-size:3cqw;line-height:1.55;max-width:76cqw}
:where(.an-card) .an-head{font-size:7cqw;line-height:1.05}
:where(.an-card) .an-names{line-height:1}
:where(.an-card) .an-amp{font-size:.62em;line-height:1.1}
:where(.an-card) .an-sub{font-size:2.6cqw;letter-spacing:.06em}
:where(.an-card) .an-both{font-size:4.4cqw}
:where(.an-card) .an-num{font-size:34cqw;line-height:.9}
:where(.an-card) .an-tagline{font-size:5.4cqw}
:where(.an-card) .an-tag{font-size:7cqw;line-height:1.15;overflow-wrap:anywhere;max-width:84cqw}
:where(.an-card) .an-items{margin-top:1cqw}
:where(.an-card) .an-item{padding:1.8cqw 0}
:where(.an-card) .an-item-t{font-size:4.6cqw}
:where(.an-card) .an-item-d{font-size:2.7cqw;margin-top:.5cqw;opacity:.75}
:where(.an-card) .an-body{font-size:3.6cqw;line-height:1.45;max-width:78cqw}
:where(.an-card) .an-date{font-size:4.4cqw}
:where(.an-card) .an-where{font-size:2.6cqw;letter-spacing:.08em;margin-top:.6cqw}
:where(.an-card) .an-foot{font-size:4.2cqw;margin-top:1.4cqw}
:where(.an-card[data-shape=tall]) .an-item-t{font-size:5.8cqw}
:where(.an-card[data-shape=tall]) .an-item-d{font-size:3.4cqw}
:where(.an-card[data-shape=tall]) .an-lead{font-size:3.8cqw}
:where(.an-card[data-shape=tall]) .an-eyebrow{font-size:2.9cqw}
:where(.an-card[data-shape=tall]) .an-date{font-size:5.6cqw}
:where(.an-card[data-shape=tall]) .an-where{font-size:3.3cqw}
:where(.an-card[data-shape=wide]) .an-head{font-size:6cqw}
:where(.an-card[data-shape=wide]) .an-body{font-size:2.6cqw}
:where(.an-card[data-shape=wide]) .an-both{font-size:3.2cqw}
:where(.an-card[data-shape=wide]) .an-eyebrow{font-size:1.7cqw}
:where(.an-card[data-shape=square]) .an-num{font-size:30cqw}
[lang=hi] .an-cap,[lang=hi] .an-eyebrow,[lang=hi] .an-where,[lang=hi] .an-item-d,[lang=hi] .an-date,[lang=hi] .cd-label,[lang=hi] .tn-label{letter-spacing:.03em!important}
@media (prefers-reduced-motion: reduce){.an-card *, .an-site *{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}}
`;

/** Hoisted, de-duplicated base stylesheet (React 19 <style precedence>). */
export function BaseCSS() {
  return <style href="an-base" precedence="default">{BASE_CARD_CSS}</style>;
}
