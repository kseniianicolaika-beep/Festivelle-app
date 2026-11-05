import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { Bow, RoseCorner, WaxSeal, silk } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const CARD_CSS = `
.llc{background:radial-gradient(120% 90% at 50% 40%,#FFFDF8 0%,#F7EFE3 100%)}
.llc .gc-headline{font-style:italic;color:var(--g-ink)}
.llc .gc-name{--gc-n:13cqw}
.llc[data-fmt=tall] .gc-name{--gc-n:17cqw}
.llc[data-fmt=land] .gc-name{--gc-n:9cqw}
.llc-rose{position:absolute;pointer-events:none;z-index:1;animation:gc-fade 2.4s ease both}
.llc-rose.a{left:-11cqw;top:-10cqw;width:66cqw}
.llc-rose.b{right:-10cqw;bottom:-9cqw;width:50cqw;rotate:180deg;animation-delay:.3s}
.llc[data-fmt=tall] .llc-rose.a{width:84cqw}.llc[data-fmt=tall] .llc-rose.b{width:70cqw}
.llc[data-fmt=land] .llc-rose.a{left:auto;right:-8cqw;top:-12cqw;width:52cqw;rotate:90deg}
.llc[data-fmt=land] .llc-rose.b{right:-6cqw;bottom:-12cqw;width:40cqw}
.llc[data-fmt=square] .llc-rose.a{width:56cqw}.llc[data-fmt=square] .llc-rose.b{width:40cqw}
.llc-edge{position:absolute;inset:3.2cqw;border:1px solid rgba(166,68,89,.22);z-index:2;pointer-events:none}
.llc-edge::after{content:"";position:absolute;inset:1.1cqw;border:.5px solid rgba(194,154,98,.35)}
.llc-body{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28cqw 12cqw 16cqw;z-index:5}
.llc[data-fmt=tall] .llc-body{padding:44cqw 11cqw 34cqw}
.llc[data-fmt=square] .llc-body{padding:14cqw 16cqw}
.llc[data-fmt=land] .llc-body{right:34cqw;padding:7cqw 4cqw 7cqw 9cqw}
.llc[data-fmt=land]{--gc-h:9.5cqw;--gc-n:9cqw;--gc-s:5cqw}
.llc[data-kind=greeting] .llc-body{padding-top:24cqw}
.llc-flour{width:34cqw;height:auto}
.llc-flour path{stroke-dasharray:700;animation:gc-draw 2.6s .9s cubic-bezier(.6,.1,.2,1) both;--len:700}
.llc-seal{width:13cqw;margin-top:1cqw;animation:gc-pop 1s 2s both}
.llc[data-fmt=tall] .llc-seal{width:18cqw}
.llc[data-fmt=land] .llc-seal{width:8cqw}
.llc-band{position:absolute;top:0;bottom:0;left:6cqw;width:3.6cqw;z-index:3;box-shadow:2px 0 5px rgba(90,40,40,.15);animation:gc-fade 1.6s .2s both}
.llc-bow{position:absolute;left:-2.5cqw;width:20cqw;z-index:4;animation:gc-pop 1.1s .6s both}
.llc[data-fmt=land] .llc-band{left:auto;right:30cqw;width:3cqw}
.llc[data-fmt=land] .llc-bow{left:auto;right:23cqw;width:17cqw}
.llc .gc-number{font-style:italic}
`;

const Flourish = () => (
  <svg className="llc-flour" viewBox="0 0 600 40" aria-hidden>
    <path d="M20 22C90 6 150 34 220 20S330 4 300 20s40 18 80 0 110-14 200 2" fill="none" stroke="var(--g-gold)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Card(p: CardProps) {
  const ribbon = p.kind === "invite" || p.kind === "thankyou" || p.kind === "welcome";
  return (
    <CardRoot p={p} cls="ll llc" vars={VARS} defaults={DEFAULTS} templateId="love-letter" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          <RoseCorner className="llc-rose a" seed={1} />
          <RoseCorner className="llc-rose b" seed={7} />
          {ribbon && (
            <>
              <div className="llc-band" style={{ background: silk.replace("90deg", "0deg") }} />
              <Bow className="llc-bow" style={{ top: c.fmt === "land" ? "38cqw" : "60cqw" }} />
            </>
          )}
          <div className="llc-edge" />
          <div className="llc-body">
            <Copy
              c={c}
              order={c.kind === "greeting" || c.kind === "story" || c.kind === "post" ? ["eyebrow", "name", "divider", "headline", "lead", "body", "signoff"] : ["eyebrow", "headline", "name", "divider", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]}
              divider={c.name ? <Flourish /> : null}
              nameChars={9}
            />
            {(c.kind === "greeting" || c.kind === "invite" || c.kind === "story") && <WaxSeal letter={(c.name?.text.trim()[0] ?? "♥").toUpperCase()} className="llc-seal" />}
          </div>
        </>
      )}
    </CardRoot>
  );
}
