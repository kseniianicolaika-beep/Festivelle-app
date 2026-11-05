import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { GiltCorner, RoseRule, StillLife } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const CARD_CSS = `
.mpc-fr{position:absolute;left:50%;top:13cqw;width:50cqw;translate:-50% 0;z-index:2;animation:gc-rise 1.4s both}
.mpc-fr .mp-frame{padding:3.2cqw}
.mpc-fr .mp-light{top:-6cqw}
.mpc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:0 10cqw 10cqw;z-index:5}
.mpc .gc-headline{font-style:italic;--gc-h:8cqw}
.mpc .gc-name{--gc-n:9cqw}
.mpc .gc-eyebrow{font-family:var(--g-body);font-style:italic;text-transform:none;letter-spacing:.02em;font-size:3cqw}
.mpc .gc-body{font-family:var(--g-body);--gc-b:3.1cqw;--lines:4;color:#EADCC6}
.mpc .gc-copy{gap:1.6cqw}
.mpc-rule{width:34cqw}
.mpc[data-kind=greeting] .mpc-fr{width:40cqw;top:9cqw}
.mpc[data-fmt=tall] .mpc-fr{width:54cqw;top:24cqw}
.mpc[data-fmt=tall] .mpc-in{padding-bottom:24cqw}
.mpc[data-fmt=tall] .gc-headline{--gc-h:10cqw}
.mpc[data-fmt=tall] .gc-name{--gc-n:12cqw}
.mpc[data-fmt=land] .mpc-fr{left:8cqw;top:9cqw;translate:0 0;width:30cqw}
.mpc[data-fmt=land] .mpc-in{justify-content:center;padding:6cqw 6cqw 6cqw 46cqw}
.mpc[data-fmt=square] .mpc-fr{left:8cqw;top:12cqw;translate:0 0;width:36cqw}
.mpc[data-fmt=square] .mpc-in{justify-content:center;padding:6cqw 6cqw 6cqw 50cqw}
.mpc[data-fmt=square] .gc-headline{--gc-h:6.6cqw}
.mpc[data-fmt=square] .gc-name{--gc-n:7.4cqw}
`;

export default function Card(p: CardProps) {
  return (
    <CardRoot p={p} cls="mp mpc mp-wall" vars={VARS} defaults={DEFAULTS} templateId="memory-portrait" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          <div className="mpc-fr">
            <span className="mp-light" />
            <span className="mp-cone" />
            <div className="mp-frame">
              {(["tl", "tr", "bl", "br"] as const).map((k) => <GiltCorner key={k} className={`mp-gc ${k}`} />)}
              <div className="mp-mat">
                <div className="mp-pic">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.photoUrl ? <img src={p.photoUrl} alt="" data-edit-photo="photo" /> : <StillLife />}
                </div>
              </div>
            </div>
          </div>
          <div className="mpc-in">
            <Copy c={c} order={["headline", "eyebrow", "name", "divider", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]} divider={<RoseRule className="mpc-rule" />} headChars={16} nameChars={10} />
          </div>
        </>
      )}
    </CardRoot>
  );
}
