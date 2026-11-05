import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { Berries, Blini, FolkBand, FolkSun, Ribbons } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const CARD_CSS = `
.msc{background:linear-gradient(180deg,#D7EAF6 0%,#F6F1E2 40%,#FFF4E0 70%)}
.msc-band{position:absolute;left:0;right:0;width:100%;height:10cqw;z-index:4}
.msc-band.b{bottom:0}
.msc-rib{position:absolute;left:0;right:0;top:0;width:100%;height:38cqw;z-index:1}
.msc-sun{position:absolute;left:50%;top:6cqw;width:42cqw;translate:-50% 0;z-index:2;animation:gc-pop 1.1s both}
.msc-blini{position:absolute;left:50%;bottom:7cqw;width:36cqw;translate:-50% 0;z-index:3;animation:gc-rise 1.2s .4s both}
.msc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:46cqw 10cqw 42cqw;z-index:5}
.msc .gc-headline{color:var(--g-accent);text-shadow:.5cqw .5cqw 0 #F2B33A;--gc-h:8.6cqw}
.msc .gc-name{color:var(--g-ink);--gc-n:10cqw}
.msc .gc-eyebrow{font-family:var(--g-body);text-transform:none;letter-spacing:.02em;font-size:3.2cqw}
.msc .gc-body{font-family:var(--g-body);--gc-b:3.1cqw;--lines:5;color:#4A2418}
.msc .gc-number,.msc .gc-hashtag{color:var(--g-accent);text-shadow:.6cqw .6cqw 0 #F2B33A}
.msc-rule{width:36cqw}
.msc[data-kind=greeting] .msc-sun{width:32cqw;top:4cqw}
.msc[data-kind=greeting] .msc-in{padding:36cqw 10cqw 34cqw}
.msc[data-kind=greeting] .msc-blini{width:28cqw}
.msc[data-fmt=tall] .msc-sun{width:46cqw;top:12cqw}
.msc[data-fmt=tall] .msc-in{padding:64cqw 10cqw 64cqw}
.msc[data-fmt=tall] .msc-blini{width:52cqw;bottom:12cqw}
.msc[data-fmt=tall] .gc-headline{--gc-h:11cqw}
.msc[data-fmt=tall] .gc-name{--gc-n:13cqw}
.msc[data-fmt=tall] .msc-band{height:14cqw}
.msc[data-fmt=land] .msc-sun{left:16cqw;top:12cqw;width:26cqw}
.msc[data-fmt=land] .msc-blini{left:auto;right:5cqw;translate:0 0;width:22cqw;bottom:7cqw}
.msc[data-fmt=land] .msc-in{padding:8cqw 26cqw 10cqw 34cqw}
.msc[data-fmt=land] .gc-headline{--gc-h:6.4cqw}
.msc[data-fmt=land] .gc-name{--gc-n:6.6cqw}
.msc[data-fmt=land] .msc-band{height:6cqw}
.msc[data-fmt=square] .msc-sun{width:30cqw;top:4cqw}
.msc[data-fmt=square] .msc-blini{left:auto;right:4cqw;translate:0 0;width:24cqw}
.msc[data-fmt=square] .msc-in{padding:34cqw 12cqw 12cqw}
.msc[data-fmt=square] .gc-headline{--gc-h:7.4cqw}
`;

export default function Card(p: CardProps) {
  return (
    <CardRoot p={p} cls="ms msc" vars={VARS} defaults={DEFAULTS} templateId="maslenitsa" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          <Ribbons className="msc-rib" n={7} />
          <FolkSun className="msc-sun" />
          <Blini className="msc-blini" n={c.fmt === "tall" ? 9 : 7} />
          <FolkBand className="msc-band b" n={c.fmt === "land" ? 8 : 5} />
          <div className="msc-in">
            <Copy c={c} order={["headline", "eyebrow", "name", "divider", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]} divider={<Berries className="msc-rule" />} headChars={16} nameChars={10} />
          </div>
        </>
      )}
    </CardRoot>
  );
}
