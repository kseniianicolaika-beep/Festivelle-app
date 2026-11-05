"use client";
import type { CSSProperties, ReactNode } from "react";
import { E } from "@/components/designs/Editable";
import type { CardText } from "./kit";

/** Scale factor so long names (Александра, Rudraksh-Aarav) never overflow. */
export const fit = (s: string, at = 6) => {
  const n = Math.max(1, [...s].length);
  return n <= at ? 1 : Math.max(0.42, Math.pow(at / n, 0.78));
};

export type CopyStyle = {
  eyebrow?: CSSProperties; name?: CSSProperties; line?: CSSProperties; lead?: CSSProperties; meta?: CSSProperties; footer?: CSSProperties; headline?: CSSProperties; item?: CSSProperties; detail?: CSSProperties; number?: CSSProperties; hashtag?: CSSProperties;
};

/** Typographic block for every card kind. Sizes in cqw (card is a size container). */
export function CardCopy({ t, s, nameSize = 15, gap = 2.4, ornament, beforeName, afterMeta, nameWrap, align = "center", className = "", style, compactMeta }: {
  t: CardText; s: CopyStyle; nameSize?: number; gap?: number; ornament?: ReactNode; beforeName?: ReactNode; afterMeta?: ReactNode; nameWrap?: (n: ReactNode) => ReactNode; align?: "center" | "left"; className?: string; style?: CSSProperties; compactMeta?: boolean;
}) {
  const ta = align === "center" ? "center" : "left";
  const name = (
    <E path={t.name.path!} as="h1" className="block leading-[0.92]" style={{ fontSize: `${nameSize * fit(t.name.text)}cqw`, ...s.name }}>
      {t.name.text}
    </E>
  );
  const meta = (t.date || t.where) && (
    <div data-c="meta" style={{ ...s.meta }}>
      {t.date && <p className="m-0">{[t.date, t.time].filter(Boolean).join(compactMeta ? " · " : " · ")}</p>}
      {t.where && (
        <p className="m-0">
          {t.where.path ? <E path={t.where.path}>{t.where.text}</E> : t.where.text}
          {t.city ? `, ${t.city}` : ""}
        </p>
      )}
    </div>
  );
  const col = { display: "flex", flexDirection: "column" as const, alignItems: align === "center" ? "center" : "flex-start", textAlign: ta as CSSProperties["textAlign"], gap: `${gap}cqw`, ...style };

  if (t.mode === "list")
    return (
      <div className={className} style={col}>
        {t.headline && <E path={t.headline.path!} as="h2" className="block" style={s.headline}>{t.headline.text}</E>}
        {ornament}
        <ol className="m-0 flex list-none flex-col p-0" style={{ gap: `${gap * 1.1}cqw`, alignItems: col.alignItems }}>
          {t.items.map((it, i) => (
            <li key={i} data-c="item" style={{ display: "flex", flexDirection: "column", alignItems: col.alignItems }}>
              <E path={`items.${i}.title`} style={s.item}>{it.title}</E>
              {it.detail && <E path={`items.${i}.detail`} style={s.detail}>{it.detail}</E>}
            </li>
          ))}
        </ol>
        <div data-c="footer" style={s.footer}>{t.name.text}</div>
      </div>
    );
  if (t.mode === "number")
    return (
      <div className={className} style={col}>
        {t.headline && <E path={t.headline.path!} as="p" className="block" style={s.eyebrow}>{t.headline.text}</E>}
        <p data-c="name" className="m-0 leading-none" style={s.number}>{t.number}</p>
        {ornament}
        <p data-c="footer" className="m-0" style={s.footer}>{t.name.text}</p>
      </div>
    );
  if (t.mode === "hashtag")
    return (
      <div className={className} style={col}>
        {t.body && <E path={t.body.path!} as="p" className="block" style={s.eyebrow}>{t.body.text}</E>}
        <div data-c="name">
          <E path={t.hashtag!.path!} as="p" className="block break-all leading-[1.02]" style={{ fontSize: `${(nameSize * 0.62) * fit(t.hashtag!.text, 10)}cqw`, ...s.hashtag }}>{t.hashtag!.text}</E>
        </div>
        {ornament}
        <p data-c="footer" className="m-0" style={s.footer}>{t.name.text}</p>
      </div>
    );
  if (t.mode === "thanks")
    return (
      <div className={className} style={col}>
        <div data-c="name"><E path={t.headline!.path!} as="h2" className="block" style={s.headline}>{t.headline!.text}</E></div>
        {ornament}
        {t.body && <E path={t.body.path!} as="p" multiline className="block" style={s.lead}>{t.body.text}</E>}
        <p data-c="footer" className="m-0" style={s.footer}>— {t.name.text}</p>
      </div>
    );
  if (t.mode === "greeting")
    return (
      <div className={className} style={col}>
        {t.headline && <div data-c="eyebrow"><E path={t.headline.path!} as="h2" className="block" style={s.headline}>{t.headline.text}</E></div>}
        <div data-c="name">{nameWrap ? nameWrap(name) : name}</div>
        {ornament}
        {t.body && <E path={t.body.path!} as="p" multiline className="block" style={s.lead}>{t.body.text}</E>}
        {t.footer && <div data-c="footer"><E path={t.footer.path!} style={s.footer}>{t.footer.text}</E></div>}
      </div>
    );
  return (
    <div className={className} style={col}>
      {t.eyebrow && <div data-c="eyebrow"><E path={t.eyebrow.path!} style={s.eyebrow}>{t.eyebrow.text}</E></div>}
      {t.headline && <div data-c="eyebrow"><E path={t.headline.path!} style={s.headline}>{t.headline.text}</E></div>}
      {beforeName}
      <div data-c="name">{nameWrap ? nameWrap(name) : name}</div>
      {t.line && <p data-c="line" className="m-0" style={s.line}>{t.line.text}</p>}
      {ornament}
      {t.lead && <div data-c="lead"><E path={t.lead.path!} as="p" multiline className="block" style={s.lead}>{t.lead.text}</E></div>}
      {meta}
      {afterMeta}
      {t.footer && <div data-c="footer"><E path={t.footer.path!} style={s.footer}>{t.footer.text}</E></div>}
    </div>
  );
}
