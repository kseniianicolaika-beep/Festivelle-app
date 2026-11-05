import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { Doves, Olive } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const CARD_CSS = `
.wgc{background:#F8F4EC}
.wgc::before{content:"";position:absolute;inset:4.5cqw;box-shadow:inset .25cqw .25cqw .3cqw rgba(0,0,0,.12),inset -.25cqw -.25cqw .3cqw rgba(255,255,255,.95);z-index:1;pointer-events:none}
.wgc-dv{position:absolute;left:50%;top:12cqw;width:56cqw;translate:-50% 0;z-index:2;color:var(--g-accent)}
.wgc-dv .wg-draw>*{stroke-dasharray:600;animation:gc-draw 3s cubic-bezier(.6,.1,.2,1) both;--len:600}
.wgc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:44cqw 12cqw 14cqw;z-index:5}
.wgc .gc-headline{font-weight:300;letter-spacing:-.03em;--gc-h:17cqw;line-height:.95;text-shadow:0 1px 0 rgba(255,255,255,.85),0 -1px 0 rgba(0,0,0,.18)}
.wgc .gc-headline.gc-in{animation:wgc-ink 1.8s .3s cubic-bezier(.6,.1,.2,1) both}
@keyframes wgc-ink{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.wgc .gc-name{font-family:var(--g-display);font-style:italic;--gc-n:8cqw;color:var(--g-ink)}
.wgc .gc-eyebrow{font-family:var(--g-body);font-size:2.1cqw;color:var(--g-accent)}
.wgc .gc-body{font-family:var(--g-display);--gc-b:3.5cqw;--lines:6;color:#3a362f}
.wgc .gc-sign{font-family:var(--g-display);font-style:italic;color:var(--g-accent);--gc-s:5cqw}
.wgc .gc-meta,.wgc .gc-lead{font-family:var(--g-body)}
.wgc-rule{width:30cqw;color:var(--g-accent)}
.wgc-no{position:absolute;left:9cqw;right:9cqw;top:7.5cqw;display:flex;justify-content:space-between;font-family:var(--g-body);text-transform:uppercase;letter-spacing:.3em;font-size:1.8cqw;color:var(--g-muted);z-index:3}
.wgc[data-kind=greeting] .wgc-dv{width:44cqw;top:12cqw}
.wgc[data-kind=greeting] .wgc-in{padding:34cqw 12cqw 12cqw}
.wgc[data-kind=greeting] .gc-headline{--gc-h:14cqw}
.wgc[data-fmt=tall] .wgc-dv{top:26cqw;width:70cqw}
.wgc[data-fmt=tall] .wgc-in{padding:66cqw 11cqw 26cqw}
.wgc[data-fmt=tall] .gc-headline{--gc-h:22cqw}
.wgc[data-fmt=tall] .gc-name{--gc-n:10cqw}
.wgc[data-fmt=tall] .wgc-no{font-size:2.6cqw;top:10cqw}
.wgc[data-fmt=land] .wgc-dv{left:auto;right:7cqw;top:auto;bottom:10cqw;translate:0 0;width:36cqw}
.wgc[data-fmt=land] .wgc-in{align-items:flex-start;padding:12cqw 40cqw 10cqw 9cqw}
.wgc[data-fmt=land] .gc-copy{align-items:flex-start;text-align:left}
.wgc[data-fmt=land] .gc-headline{--gc-h:8.6cqw}
.wgc[data-fmt=land] .gc-name{--gc-n:5.4cqw}
.wgc[data-fmt=land] .wgc-no{font-size:1.3cqw;top:6cqw;left:7cqw;right:7cqw}
.wgc[data-fmt=square] .wgc-dv{top:11cqw;width:40cqw}
.wgc[data-fmt=square] .wgc-in{padding:30cqw 12cqw 10cqw}
.wgc[data-fmt=square] .gc-headline{--gc-h:13cqw}
`;

export default function Card(p: CardProps) {
  return (
    <CardRoot p={p} cls="wg wgc" vars={VARS} defaults={DEFAULTS} templateId="with-gratitude" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          <div className="wgc-no"><span>Nº 01</span><span>{p.profile.language === "ru" ? "С благодарностью" : p.profile.language === "hi" ? "आभार सहित" : "With gratitude"}</span></div>
          <Doves className="wgc-dv" />
          <div className="wgc-in">
            <Copy c={c} order={["headline", "eyebrow", "name", "divider", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]} divider={<Olive className="wgc-rule" />} headChars={9} nameChars={14} />
          </div>
        </>
      )}
    </CardRoot>
  );
}
