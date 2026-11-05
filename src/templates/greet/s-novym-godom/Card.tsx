import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { Baubles, Flake, Mandarin, Yolka } from "./art";
import { CSS, DEFAULTS, GOLDTXT, VARS } from "./style";

const CARD_CSS = `
.nyc{background:radial-gradient(60% 40% at 50% 85%,rgba(255,190,110,.18),transparent 70%),radial-gradient(120% 90% at 50% 0%,#1A2C5E,#0B1838 60%,#060E26)}
.nyc-flake{position:absolute;opacity:.7;animation:gc-spin 40s linear infinite}
.nyc-tree{position:absolute;left:50%;bottom:-2cqw;width:50cqw;translate:-50% 0;z-index:2;animation:gc-rise 1.4s .2s both}
.nyc-m{position:absolute;bottom:1cqw;width:12cqw;z-index:3;animation:gc-pop .9s both}
.nyc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10cqw 11cqw 66cqw;z-index:5}
.nyc .gc-orn{font-family:var(--g-script);color:var(--g-accent);font-size:6cqw}
.nyc .gc-headline{${GOLDTXT};--gc-h:11cqw}
.nyc .gc-name{color:var(--g-ink);--gc-n:9.5cqw}
.nyc .gc-eyebrow{font-family:var(--g-body);text-transform:none;letter-spacing:.02em;font-style:italic;font-size:3.2cqw}
.nyc .gc-body{font-family:var(--g-body);--gc-b:3.2cqw;--lines:5;color:#E6E9F2}
.nyc .gc-number,.nyc .gc-hashtag{${GOLDTXT}}
.nyc-rule{width:34cqw}
.nyc[data-kind=greeting] .nyc-tree{width:36cqw}
.nyc[data-kind=greeting] .nyc-in{padding-bottom:50cqw}
.nyc[data-kind=greeting] .nyc-m{width:9cqw}
.nyc[data-fmt=tall] .nyc-tree{width:56cqw}
.nyc[data-fmt=tall] .nyc-in{padding:24cqw 10cqw 84cqw}
.nyc[data-fmt=tall] .gc-headline{--gc-h:14cqw}
.nyc[data-fmt=tall] .gc-name{--gc-n:12cqw}
.nyc[data-fmt=tall] .nyc-m{width:16cqw}
.nyc[data-fmt=land] .nyc-tree{left:auto;right:4cqw;translate:0 0;width:30cqw}
.nyc[data-fmt=land] .nyc-in{padding:6cqw 38cqw 6cqw 8cqw}
.nyc[data-fmt=land] .gc-headline{--gc-h:7.5cqw}
.nyc[data-fmt=land] .gc-name{--gc-n:6cqw}
.nyc[data-fmt=land] .nyc-m{width:7cqw}
.nyc[data-fmt=land] .gc-orn{font-size:4cqw}
.nyc[data-fmt=square] .nyc-tree{left:auto;right:2cqw;translate:0 0;width:36cqw}
.nyc[data-fmt=square] .nyc-in{padding:8cqw 36cqw 8cqw 8cqw}
.nyc[data-fmt=square] .gc-headline{--gc-h:8.6cqw}
.nyc[data-fmt=square] .gc-name{--gc-n:8cqw}
.nyc[data-fmt=square] .nyc-m{width:9cqw}
`;

export default function Card(p: CardProps) {
  const ru = p.profile.language === "ru";
  return (
    <CardRoot p={p} cls="ny nyc" vars={VARS} defaults={DEFAULTS} templateId="s-novym-godom" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          <Flake seed={1} className="nyc-flake" style={{ left: "5%", top: "4%", width: "11cqw" }} />
          <Flake seed={3} className="nyc-flake" style={{ right: "6%", top: "9%", width: "8cqw", animationDuration: "50s" }} />
          <Flake seed={5} className="nyc-flake" style={{ left: "8%", top: "52%", width: "7cqw" }} />
          <Flake seed={6} className="nyc-flake" style={{ right: "8%", top: "48%", width: "9cqw", animationDuration: "34s" }} />
          <Yolka className="nyc-tree" />
          <Mandarin className="nyc-m" style={{ left: c.fmt === "land" || c.fmt === "square" ? "52%" : "16%" }} rot={-12} />
          <Mandarin className="nyc-m" style={{ right: c.fmt === "land" || c.fmt === "square" ? "3%" : "16%", animationDelay: ".2s" }} rot={14} leaf={false} />
          <div className="nyc-in">
            <Copy
              c={c}
              order={["divider", "headline", "eyebrow", "name", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]}
              divider={!ru && (c.kind === "greeting" || c.kind === "story" || c.kind === "post" || c.kind === "invite") ? <span className="gc-orn" lang="ru">С Новым годом!</span> : <Baubles className="nyc-rule" />}
              headChars={13}
              nameChars={11}
            />
          </div>
        </>
      )}
    </CardRoot>
  );
}
