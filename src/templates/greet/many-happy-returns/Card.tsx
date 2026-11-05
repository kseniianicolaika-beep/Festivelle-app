import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { Cake, DecoCorner, Fan, Sunburst } from "./art";
import { CSS, DEFAULTS, FOIL, VARS } from "./style";

const CARD_CSS = `
.mhrc{background:radial-gradient(80% 50% at 50% 100%,rgba(228,170,90,.2),transparent 70%),radial-gradient(100% 70% at 50% 0%,#221b16,#0E0C0B 75%)}
.mhrc-frame{position:absolute;inset:3.4cqw;border:1px solid rgba(228,198,140,.4);z-index:2}
.mhrc-frame::after{content:"";position:absolute;inset:1.2cqw;border:1px solid rgba(228,198,140,.16)}
.mhrc-c{position:absolute;width:13cqw;z-index:3;animation:gc-pop 1s .2s both}
.mhrc-c.tl{left:1.6cqw;top:1.6cqw}.mhrc-c.tr{right:1.6cqw;top:1.6cqw;rotate:90deg}.mhrc-c.br{right:1.6cqw;bottom:1.6cqw;rotate:180deg}.mhrc-c.bl{left:1.6cqw;bottom:1.6cqw;rotate:270deg}
.mhrc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding:13cqw 11cqw 0;z-index:5}
.mhrc-copy{flex:1;justify-content:center}
.mhrc .gc-headline{font-family:var(--g-deco);text-transform:uppercase;letter-spacing:.3em;font-size:calc(4.2cqw * var(--k,1));color:var(--g-accent);line-height:1.4}
.mhrc .gc-name{font-family:var(--g-display);font-style:italic;${FOIL};--gc-n:15cqw;padding:0 .1em .08em}
.mhrc .gc-eyebrow{font-family:var(--g-deco);color:var(--g-muted)}
.mhrc .gc-body{font-family:var(--g-body);font-weight:300;--gc-b:3.6cqw;--lines:6;color:#E9DCC6}
.mhrc .gc-sign{font-family:var(--g-display);font-style:italic;${FOIL}}
.mhrc .gc-number,.mhrc .gc-hashtag{${FOIL};font-family:var(--g-deco)}
.mhrc .gc-items b{font-style:italic}
.mhrc-ground{position:relative;width:100%;display:flex;justify-content:center;flex:none;margin-top:2cqw}
.mhrc-sun{position:absolute;bottom:0;left:50%;translate:-50% 0;width:110cqw;opacity:.9;animation:gc-fade 2s both}
.mhrc-cake{position:relative;width:24cqw;animation:gc-rise 1.4s .5s both}
.mhrc-fan{width:34cqw}
.mhrc[data-fmt=tall] .mhrc-in{padding-top:30cqw}
.mhrc[data-fmt=tall] .gc-headline{font-size:calc(5.6cqw * var(--k,1))}
.mhrc[data-fmt=tall] .gc-name{--gc-n:20cqw}
.mhrc[data-fmt=tall] .mhrc-cake{width:40cqw}
.mhrc[data-fmt=land] .mhrc-in{padding:6cqw 8cqw 0}
.mhrc[data-fmt=land] .gc-headline{font-size:calc(3cqw * var(--k,1))}
.mhrc[data-fmt=land] .gc-name{--gc-n:10cqw}
.mhrc[data-fmt=land] .mhrc-cake{width:11cqw}
.mhrc[data-fmt=land] .mhrc-sun{width:62cqw;opacity:.6}
.mhrc[data-fmt=land] .mhrc-c{width:9cqw}
.mhrc[data-fmt=square] .gc-name{--gc-n:12cqw}
.mhrc[data-fmt=square] .mhrc-cake{width:18cqw}
.mhrc[data-kind=greeting] .gc-name{--gc-n:13cqw}
.mhrc[data-kind=greeting] .mhrc-cake{width:17cqw}
.mhrc[data-kind=greeting] .mhrc-in{padding-top:11cqw}
`;

export default function Card(p: CardProps) {
  const age = p.profile.age;
  return (
    <CardRoot p={p} cls="mhr mhrc" vars={VARS} defaults={DEFAULTS} templateId="many-happy-returns" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          <div className="mhrc-frame" />
          {(["tl", "tr", "br", "bl"] as const).map((k) => <DecoCorner key={k} className={`mhrc-c ${k}`} />)}
          <div className="mhrc-in">
            <Copy c={c} className="mhrc-copy" order={["headline", "eyebrow", "name", "divider", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]} divider={<Fan className="mhrc-fan" />} nameChars={7} headChars={18} />
            <div className="mhrc-ground">
              <Sunburst className="mhrc-sun" />
              <Cake className="mhrc-cake" candles={age && age < 8 ? age : 5} />
            </div>
          </div>
        </>
      )}
    </CardRoot>
  );
}
