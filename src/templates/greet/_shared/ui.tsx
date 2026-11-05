import type { CSSProperties, ReactNode } from "react";
import { E } from "@/components/designs/Editable";
import { KINDS } from "@/lib/templates";
import type { CardProps } from "../../types";
import { GREET_FONTS } from "./fonts";
import { cardCopy, fit, overrides, type CardCopy, type GreetDefaults, type Txt } from "./kit";

// Paper grain as a tiny inline SVG (feTurbulence) — tiled, so it costs one decode.
export const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
export const FIBRES = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.012 .09' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 .4  0 0 0 0 .32  0 0 0 0 .25  0 0 0 .18 0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>")`;

const KIT_CSS = `
.gk{background:var(--g-bg);color:var(--g-ink);font-family:var(--g-body);position:relative;overflow-x:clip;-webkit-font-smoothing:antialiased}
.gk-wrap{container-type:inline-size;position:relative}
.gk img{display:block}
.gk-grain::after,.gc-grain::after{content:"";position:absolute;inset:0;pointer-events:none;background-image:${GRAIN};opacity:var(--grain,.35);mix-blend-mode:multiply;z-index:30}
.gk-sec{position:relative;padding:clamp(72px,13cqi,170px) clamp(22px,6cqi,96px);z-index:2}
.gk-kicker{font-family:var(--g-body);font-size:clamp(10px,1.05cqi,12.5px);letter-spacing:.34em;text-transform:uppercase;color:var(--g-accent);text-align:center;display:block}
.gk-title{font-family:var(--g-display);font-weight:400;font-size:clamp(34px,6.4cqi,76px);line-height:1.02;text-align:center;letter-spacing:-.01em;margin:.35em 0 0}
.gk-wish{font-family:var(--g-display);font-style:italic;font-weight:400;font-size:clamp(26px,4.6cqi,58px);line-height:1.22;max-width:17em;margin:0 auto;text-align:center;text-wrap:balance}
.gk-letter{position:relative;max-width:660px;margin:0 auto}
.gk-msg{display:block;font-size:clamp(17px,2cqi,21px);line-height:1.8;white-space:pre-line;text-wrap:pretty}
.gk-sign{display:block;font-family:var(--g-script);font-size:clamp(32px,4.6cqi,54px);line-height:1.1;color:var(--g-accent)}
.gk-btn{display:inline-flex;align-items:center;gap:.6em;border:1px solid color-mix(in oklab,currentColor 40%,transparent);border-radius:999px;padding:.85em 1.6em;font-size:12px;letter-spacing:.24em;text-transform:uppercase;transition:background .4s,color .4s,border-color .4s;cursor:pointer;background:transparent;color:inherit}
.gk-btn:hover{background:var(--g-ink);color:var(--g-bg);border-color:var(--g-ink)}
.gk-center{text-align:center}
.gk-meta{font-size:clamp(12px,1.2cqi,14px);letter-spacing:.24em;text-transform:uppercase;color:var(--g-muted)}
.gk-events{display:grid;gap:clamp(14px,2cqi,24px);max-width:820px;margin:clamp(28px,4cqi,56px) auto 0;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.gk-event{padding:clamp(22px,3cqi,36px);text-align:center;border:1px solid var(--g-line);background:var(--g-panel,transparent)}
.gk-event h3{font-family:var(--g-display);font-weight:400;font-size:clamp(24px,3cqi,34px);margin:0 0 .3em}
.gk-photos{display:grid;gap:clamp(12px,2cqi,26px);max-width:1100px;margin:clamp(32px,5cqi,64px) auto 0;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))}
.gk-photo{position:relative;margin:0;overflow:hidden}
.gk-photo img{width:100%;height:100%;object-fit:cover;aspect-ratio:4/5}
.gk-rsvp{max-width:620px;margin:clamp(28px,4cqi,48px) auto 0}
.gk-foot{position:relative;z-index:2;padding:clamp(70px,10cqi,130px) 24px clamp(40px,6cqi,70px);text-align:center}
.gk-credit{margin-top:40px;font-size:12px;opacity:.65}
.gk-overlay{position:fixed;inset:0;z-index:60;transition:opacity 1.1s ease,visibility 1.1s}
.gk-overlay.is-gone{opacity:0;visibility:hidden;pointer-events:none}
.gk-tap{font-family:var(--g-body);font-size:11px;letter-spacing:.34em;text-transform:uppercase;animation:gk-breathe 2.6s ease-in-out infinite}
@keyframes gk-breathe{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes gc-rise{from{opacity:0;transform:translateY(3cqw);filter:blur(4px)}}
@keyframes gc-fade{from{opacity:0}}
@keyframes gc-draw{from{stroke-dashoffset:var(--len,1000)}}
@keyframes gc-pop{from{opacity:0;transform:scale(.6)}70%{transform:scale(1.06)}}
@keyframes gc-sway{0%,100%{transform:rotate(var(--sw,3deg))}50%{transform:rotate(calc(var(--sw,3deg) * -1))}}
@keyframes gc-flicker{0%,100%{transform:scaleY(1) scaleX(1);opacity:1}25%{transform:scaleY(1.08) scaleX(.94);opacity:.92}50%{transform:scaleY(.95) scaleX(1.04)}75%{transform:scaleY(1.05) scaleX(.97);opacity:.96}}
@keyframes gc-twinkle{0%,100%{opacity:.25;transform:scale(.6)}50%{opacity:1;transform:scale(1)}}
@keyframes gc-shine{from{transform:translateX(-130%) skewX(-20deg)}to{transform:translateX(260%) skewX(-20deg)}}
@keyframes gc-spin{to{transform:rotate(360deg)}}
@keyframes gc-fall{from{transform:translate3d(0,-10%,0)}to{transform:translate3d(var(--dx,4%),110%,0)}}
@keyframes gc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(var(--fy,-1.5cqw))}}
.gc{position:relative;width:100%;overflow:hidden;container-type:inline-size;background:var(--g-bg);color:var(--g-ink);font-family:var(--g-body);-webkit-font-smoothing:antialiased}
.gc-copy{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:2.2cqw;z-index:5}
.gc-in{animation:gc-rise 1.3s cubic-bezier(.2,.7,.2,1) var(--d,0s) both}
.gc-eyebrow{display:block;font-size:2.3cqw;letter-spacing:.32em;text-transform:uppercase;color:var(--g-muted)}
.gc-headline{display:block;font-family:var(--g-display);font-weight:400;line-height:1.02;font-size:calc(var(--gc-h,9.5cqw) * var(--k,1))}
.gc-name{display:block;font-family:var(--g-script);line-height:1.05;color:var(--g-accent);font-size:calc(var(--gc-n,10cqw) * var(--k,1) * var(--scale,1))}
.gc-lead{display:block;font-size:var(--gc-l,3.1cqw);line-height:1.55;max-width:74cqw;color:var(--g-muted);text-wrap:balance}
.gc-body{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--lines,7);overflow:hidden;font-family:var(--g-display);font-size:var(--gc-b,3.5cqw);line-height:1.5;max-width:76cqw;white-space:pre-line;text-wrap:pretty}
.gc-sign{display:block;font-family:var(--g-script);font-size:var(--gc-s,5.4cqw);line-height:1.1;color:var(--g-accent)}
.gc-meta{display:block;font-size:2.5cqw;letter-spacing:.2em;text-transform:uppercase;color:var(--g-muted)}
.gc-items{list-style:none;margin:0;padding:0;width:100%;max-width:74cqw}
.gc-items li{padding:2cqw 0;border-top:1px solid var(--g-line)}
.gc-items li:first-child{border-top:0}
.gc-items b{display:block;font-family:var(--g-display);font-weight:400;font-size:4.8cqw}
.gc-items i{display:block;font-style:normal;font-size:2.8cqw;color:var(--g-muted);margin-top:.6cqw}
.gc-number{display:block;font-family:var(--g-display);line-height:.9;font-size:34cqw;color:var(--g-accent)}
.gc-hashtag{display:block;font-family:var(--g-display);font-size:9cqw;line-height:1.1;word-break:break-word;color:var(--g-accent)}
.gc[data-fmt=tall]{--gc-h:13cqw;--gc-n:14cqw;--gc-l:4.2cqw;--gc-b:4.4cqw;--gc-s:7.5cqw}
.gc[data-fmt=tall] .gc-eyebrow{font-size:3.2cqw}.gc[data-fmt=tall] .gc-meta{font-size:3.4cqw}
.gc[data-fmt=land]{--gc-h:7.4cqw;--gc-n:7.6cqw;--gc-l:2.3cqw;--gc-b:2.4cqw;--gc-s:4.2cqw}
.gc[data-fmt=land] .gc-eyebrow{font-size:1.7cqw}.gc[data-fmt=land] .gc-meta{font-size:1.8cqw}.gc[data-fmt=land] .gc-copy{gap:1.5cqw}
.gc[data-fmt=square]{--gc-h:9cqw;--gc-n:9.6cqw;--gc-l:2.9cqw;--gc-s:5cqw}
.gk:lang(hi) *,.gc:lang(hi) *{letter-spacing:0!important}
.is-static *,.is-static *::before,.is-static *::after{animation:none!important;transition:none!important}
@media (prefers-reduced-motion:reduce){.gc *,.gc *::before,.gc *::after,.gk *,.gk *::before,.gk *::after{animation:none!important;transition-duration:.01ms!important}}
`;

/** Kit + template CSS, hoisted and de-duplicated by React 19. */
export function Styles({ id, css }: { id: string; css: string }) {
  return (
    <>
      <style href="greet-kit" precedence="default">{KIT_CSS}</style>
      <style href={`greet-${id}`} precedence="default">{css}</style>
    </>
  );
}

export const T = ({ t, as, className, style, multiline }: { t: Txt; as?: "p" | "span" | "h1" | "h2" | "h3" | "div"; className?: string; style?: CSSProperties; multiline?: boolean }) =>
  t ? <E path={t.path} as={as ?? "span"} className={className} style={style} multiline={multiline}>{t.text}</E> : null;

type Slot = "eyebrow" | "headline" | "name" | "lead" | "items" | "number" | "hashtag" | "body" | "meta" | "signoff" | "divider";
const DEFAULT_ORDER: Slot[] = ["eyebrow", "headline", "name", "divider", "lead", "items", "number", "hashtag", "body", "meta", "signoff"];

/** The text stack of a card. Templates style it through the .gc-* hooks and may reorder slots. */
export function Copy({ c, order = DEFAULT_ORDER, divider, className = "", style, nameChars = 10, headChars = 14, extra }: { c: CardCopy; order?: Slot[]; divider?: ReactNode; className?: string; style?: CSSProperties; nameChars?: number; headChars?: number; extra?: Partial<Record<Slot, ReactNode>> }) {
  let i = 0;
  const d = () => ({ ["--d" as string]: `${0.25 + 0.16 * i++}s` }) as CSSProperties;
  const nameText = c.name2 ? `${c.name?.text} & ${c.name2.text}` : c.name?.text ?? "";
  const out: Record<Slot, ReactNode> = {
    eyebrow: c.eyebrow && <T t={c.eyebrow} className="gc-eyebrow gc-in" style={d()} />,
    headline: c.headline && <T t={c.headline} as="h2" className="gc-headline gc-in" style={{ ...d(), ["--k" as string]: fit(c.headline.text, 1, headChars, 0.5) }} />,
    name: c.name && (
      <p className="gc-name gc-in" style={{ ...d(), ["--k" as string]: fit(nameText, 1, nameChars, 0.42) }}>
        <T t={c.name} />
        {c.name2 && <> &amp; <T t={c.name2} /></>}
      </p>
    ),
    divider: divider ? <div className="gc-in" style={d()}>{divider}</div> : null,
    lead: c.lead && <T t={c.lead} as="p" multiline className="gc-lead gc-in" style={d()} />,
    items: c.items.length > 0 && (c.kind === "program" || c.kind === "menu") ? (
      <ul className="gc-items gc-in" style={d()}>
        {c.items.map((it, n) => (
          <li key={n}><E path={`items.${n}.title`} as="b">{it.title}</E>{it.detail && <E path={`items.${n}.detail`} as="i">{it.detail}</E>}</li>
        ))}
      </ul>
    ) : null,
    number: c.number !== null && <span className="gc-number gc-in" style={d()}>{c.number}</span>,
    hashtag: c.hashtag && <T t={c.hashtag} as="p" className="gc-hashtag gc-in" style={d()} />,
    body: c.body && <T t={c.body} as="p" multiline className="gc-body gc-in" style={d()} />,
    meta: c.meta.length > 0 && (
      <div className="gc-in" style={d()}>
        {c.meta.map((m, n) => (n === c.meta.length - 1 && c.metaPath && c.meta.length > 0 && n > 0 ? <E key={n} path={c.metaPath} as="span" className="gc-meta">{m}</E> : <span key={n} className="gc-meta">{m}</span>))}
      </div>
    ),
    signoff: c.signoff && <T t={c.signoff} as="p" className="gc-sign gc-in" style={d()} />,
  };
  return (
    <div className={`gc-copy ${className}`} style={style}>
      {order.map((s) => (extra?.[s] !== undefined ? <div key={s}>{extra[s]}</div> : out[s] ? <div key={s} style={{ display: "contents" }}>{out[s]}</div> : null))}
    </div>
  );
}

/** Card root: aspect from KINDS, tokens, fonts, static mode for export. */
export function CardRoot({ p, cls, vars, defaults, templateId, css, children, grain = true }: { p: CardProps; cls: string; vars: Record<string, string>; defaults: GreetDefaults; templateId: string; css: string; grain?: boolean; children: (c: CardCopy) => ReactNode }) {
  const c = cardCopy(p.kind, p.design, p.profile, defaults);
  const animate = p.animate !== false;
  return (
    <div
      lang={p.profile.language ?? "en"}
      data-fmt={c.fmt}
      data-kind={p.kind}
      className={`gc ${grain ? "gc-grain" : ""} ${cls} ${GREET_FONTS} ${animate ? "" : "is-static"} ${p.className ?? ""}`}
      style={{ ...vars, ...overrides(p.design, templateId), aspectRatio: KINDS[p.kind].ratio, ["--scale" as string]: String(Math.min(Math.max(p.design.scale ?? 1, 0.7), 1.4)) } as CSSProperties}
    >
      <Styles id={templateId} css={css} />
      {children(c)}
    </div>
  );
}
