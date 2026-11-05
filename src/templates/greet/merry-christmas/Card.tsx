import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { Candle, Frost, Wreath } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const CARD_CSS = `
.mcc{background:radial-gradient(55% 40% at 50% 42%,rgba(255,190,110,.2),transparent 70%),radial-gradient(120% 90% at 50% 30%,#163A31,#0E2520 55%,#08160F)}
.mcc-fern{position:absolute;width:44cqw;z-index:1;opacity:.55}
.mcc-fern.a{left:0;top:0}.mcc-fern.b{right:0;bottom:0;transform:scale(-1,-1)}
.mcc-wr{position:absolute;left:50%;top:7cqw;width:86cqw;translate:-50% 0;aspect-ratio:1;z-index:2;animation:gc-fade 1.8s both}
.mcc-wr svg{width:100%;height:100%}
.mcc-wr-in{position:absolute;inset:23%;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:5}
.mcc .gc-copy{gap:1.4cqw}
.mcc .gc-headline{font-style:italic;--gc-h:8.4cqw;color:var(--g-ink)}
.mcc .gc-name{--gc-n:7.6cqw}
.mcc .gc-eyebrow{font-family:var(--g-body);font-style:italic;text-transform:none;letter-spacing:.02em;font-size:2.8cqw}
.mcc-below{position:absolute;left:0;right:0;bottom:0;top:96cqw;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 12cqw 8cqw;z-index:5}
.mcc .gc-body{font-family:var(--g-body);--gc-b:3.1cqw;--lines:5;color:#E7E0D1}
.mcc .gc-lead{color:var(--g-muted)}
.mcc .gc-sign{color:var(--g-accent)}
.mcc .gc-number{font-style:italic;color:var(--g-accent)}
.mcc-cand{position:absolute;bottom:2cqw;display:flex;align-items:flex-end;gap:1cqw;z-index:4}
.mcc-cand svg{width:9cqw}
.mcc-cand.l{left:5cqw}.mcc-cand.r{right:5cqw}
.mcc-rule{width:34cqw}
.mcc[data-fmt=tall] .mcc-wr{top:28cqw;width:94cqw}
.mcc[data-fmt=tall] .mcc-below{top:126cqw}
.mcc[data-fmt=tall] .gc-headline{--gc-h:9.2cqw}
.mcc[data-fmt=tall] .gc-name{--gc-n:8.4cqw}
.mcc[data-fmt=tall] .gc-lead{--gc-l:3.8cqw}
.mcc[data-fmt=tall] .mcc-cand svg{width:12cqw}
.mcc[data-fmt=square] .mcc-wr{top:1cqw;width:74cqw}
.mcc[data-fmt=square] .mcc-below{top:84cqw;padding:0 10cqw 2cqw}
.mcc[data-fmt=square] .gc-lead{display:none}
.mcc[data-fmt=square] .mcc-cand{display:none}
.mcc[data-fmt=land] .mcc-wr{left:4cqw;top:5cqw;width:62cqw;translate:0 0}
.mcc[data-fmt=land] .mcc-below{left:64cqw;right:4cqw;top:0;padding:0 2cqw}
.mcc[data-fmt=land] .gc-headline{--gc-h:6cqw}
.mcc[data-fmt=land] .gc-name{--gc-n:5.4cqw}
.mcc[data-fmt=land] .mcc-cand{display:none}
.mcc[data-fmt=land] .gc-body{--gc-b:2.2cqw}
`;

export default function Card(p: CardProps) {
  return (
    <CardRoot p={p} cls="mc mcc" vars={VARS} defaults={DEFAULTS} templateId="merry-christmas" css={CSS + CARD_CSS}>
      {(c) => {
        const inner = { ...c, lead: null, body: null, items: [], meta: [], signoff: null, number: null, hashtag: null };
        const below = { ...c, eyebrow: null, headline: null, name: null, name2: null };
        const ringOnly = c.kind === "program" || c.kind === "menu" || c.kind === "table" || c.kind === "hashtag";
        return (
          <>
            <Frost className="mcc-fern a" seed={3} />
            <Frost className="mcc-fern b" seed={9} />
            <div className="mcc-wr">
              <Wreath />
              <div className="mcc-wr-in">
                {ringOnly ? <Copy c={{ ...c, lead: null, body: null, items: [], meta: [], signoff: null }} order={["eyebrow", "headline", "number", "hashtag"]} /> : <Copy c={inner} order={["eyebrow", "headline", "name"]} headChars={15} nameChars={11} />}
              </div>
            </div>
            <div className="mcc-below">
              <Copy c={ringOnly ? { ...below, number: null, hashtag: null } : below} order={["lead", "items", "body", "meta", "signoff"]} />
            </div>
            <div className="mcc-cand l"><Candle h={1.3} seed={0} /><Candle h={0.85} seed={1} /></div>
            <div className="mcc-cand r"><Candle h={0.8} seed={2} /><Candle h={1.2} seed={3} /></div>
          </>
        );
      }}
    </CardRoot>
  );
}
