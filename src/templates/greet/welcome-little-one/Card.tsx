import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { BABY, Cloud, Mobile, Rattle, SleepyMoon, Stitch, softStar } from "./art";
import { CSS, DEFAULTS, VARS } from "./style";

const CARD_CSS = `
.wlc{background:radial-gradient(70% 45% at 50% 52%,#fff,transparent 70%),linear-gradient(180deg,#CFDDF2 0%,#EAF0F9 55%,#F8EEF0 100%)}
.wlc-mobile{position:absolute;left:50%;top:0;width:76cqw;translate:-50% 0;z-index:2;animation:gc-rise 1.2s both}
.wlc-moon{position:absolute;right:6cqw;top:6cqw;width:12cqw;z-index:1}
.wlc-st{position:absolute;z-index:1;animation:gc-twinkle 3s ease-in-out infinite}
.wlc-cl{position:absolute;bottom:-2cqw;z-index:3}
.wlc-rattle{position:absolute;left:5cqw;bottom:8cqw;width:13cqw;rotate:-18deg;z-index:4;animation:gc-pop 1s .8s both}
.wlc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:52cqw 11cqw 26cqw;z-index:5}
.wlc .gc-name{font-family:var(--g-display);font-weight:800;color:var(--g-ink);--gc-n:15cqw;letter-spacing:-.02em;text-shadow:0 1cqw 0 #fff}
.wlc .gc-headline{font-family:var(--g-script);color:var(--g-blush);--gc-h:9cqw}
.wlc .gc-eyebrow{font-weight:700;color:var(--g-muted)}
.wlc .gc-body{font-family:var(--g-body);--gc-b:3.2cqw;--lines:5}
.wlc .gc-sign{color:var(--g-blush)}
.wlc .gc-number,.wlc .gc-hashtag{font-weight:800;color:var(--g-accent)}
.wlc-rule{width:34cqw}
.wlc[data-kind=greeting] .wlc-in{padding:44cqw 11cqw 24cqw}
.wlc[data-kind=greeting] .wlc-mobile{width:62cqw}
.wlc[data-fmt=tall] .wlc-mobile{width:96cqw}
.wlc[data-fmt=tall] .wlc-in{padding:84cqw 10cqw 50cqw}
.wlc[data-fmt=tall] .gc-name{--gc-n:16cqw}
.wlc[data-fmt=tall] .gc-headline{--gc-h:12cqw}
.wlc[data-fmt=tall] .wlc-rattle{width:15cqw;bottom:6cqw}
.wlc[data-fmt=land] .wlc-mobile{left:4cqw;translate:0 0;width:40cqw}
.wlc[data-fmt=land] .wlc-in{padding:8cqw 8cqw 12cqw 46cqw}
.wlc[data-fmt=land] .gc-name{--gc-n:9cqw}
.wlc[data-fmt=land] .gc-headline{--gc-h:6cqw}
.wlc[data-fmt=land] .wlc-rattle{left:auto;right:4cqw;width:8cqw}
.wlc[data-fmt=land] .wlc-moon{width:7cqw}
.wlc[data-fmt=square] .wlc-mobile{width:56cqw}
.wlc[data-fmt=square] .wlc-in{padding:36cqw 14cqw 14cqw}
.wlc[data-fmt=square] .gc-name{--gc-n:12cqw}
.wlc[data-fmt=square] .wlc-rattle{display:none}
`;

const STARS = [
  { l: "8%", t: "36%", s: 4, c: BABY.butter }, { l: "86%", t: "34%", s: 3.4, c: BABY.blush }, { l: "14%", t: "62%", s: 2.6, c: BABY.mint }, { l: "84%", t: "64%", s: 3, c: BABY.butter },
];

export default function Card(p: CardProps) {
  return (
    <CardRoot p={p} cls="wl wlc" vars={VARS} defaults={DEFAULTS} templateId="welcome-little-one" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          {STARS.map((s, i) => (
            <svg key={i} viewBox="-20 -20 40 40" className="wlc-st" style={{ left: s.l, top: s.t, width: `${s.s * 2}cqw`, animationDelay: `${i * 0.6}s` }} aria-hidden><path d={softStar(18)} fill={s.c} /></svg>
          ))}
          <SleepyMoon className="wlc-moon" />
          <Mobile className="wlc-mobile" />
          <Cloud className="wlc-cl" style={{ left: "-8%", width: "56%" }} />
          <Cloud className="wlc-cl" style={{ right: "-10%", width: "58%", bottom: "-4cqw" }} tint="#FFF7F5" />
          <Rattle className="wlc-rattle" />
          <div className="wlc-in">
            <Copy c={c} order={["eyebrow", "name", "headline", "divider", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]} divider={<Stitch className="wlc-rule" />} nameChars={9} headChars={20} />
          </div>
        </>
      )}
    </CardRoot>
  );
}
