import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { Crescent, Lantern, Skyline, StarRule, Stars, pointed } from "./art";
import { CSS, DEFAULTS, GOLD, VARS } from "./style";

const CARD_CSS = `
.emc{background:radial-gradient(60% 35% at 75% 12%,rgba(233,199,102,.14),transparent 70%),linear-gradient(180deg,#051613,#0A2723 55%,#113A32)}
.emc-arch{position:absolute;left:8cqw;right:8cqw;top:9cqw;bottom:0;z-index:1}
.emc-arch svg{width:100%;height:100%;overflow:visible}
.emc-moon{position:absolute;right:4cqw;top:3cqw;width:24cqw;z-index:2;animation:gc-fade 2s both}
.emc-lan{position:absolute;top:0;z-index:3;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;animation:gc-sway 5s ease-in-out infinite}
.emc-lan i{display:block;width:1px;background:#C9A24A}
.emc-lan svg{width:9cqw}
.emc-sky{position:absolute;left:0;right:0;bottom:0;height:24cqw;z-index:2}
.emc-sky svg{width:100%;height:100%}
.emc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30cqw 15cqw 26cqw;z-index:5}
.emc .gc-ar{font-family:var(--g-arabic);font-weight:700;${GOLD};font-size:15cqw;line-height:1.25;direction:rtl}
.emc .gc-headline{font-family:var(--g-display);text-transform:uppercase;letter-spacing:.3em;padding-left:.3em;font-size:calc(4.4cqw * var(--k,1));color:var(--g-ink)}
.emc .gc-eyebrow{font-family:var(--g-body);text-transform:none;letter-spacing:.02em;font-style:italic;font-size:3.4cqw;color:var(--g-muted)}
.emc .gc-name{--gc-n:10cqw}
.emc .gc-body{font-family:var(--g-body);--gc-b:3.4cqw;--lines:5;color:#EDE3CB;max-width:66cqw}
.emc .gc-number,.emc .gc-hashtag{${GOLD};font-family:var(--g-display)}
.emc-rule{width:36cqw}
.emc[data-fmt=tall] .emc-in{padding:52cqw 14cqw 46cqw}
.emc[data-fmt=tall] .gc-ar{font-size:20cqw}
.emc[data-fmt=tall] .gc-headline{font-size:calc(6cqw * var(--k,1))}
.emc[data-fmt=tall] .gc-name{--gc-n:14cqw}
.emc[data-fmt=tall] .emc-lan svg{width:12cqw}
.emc[data-fmt=tall] .emc-sky{height:40cqw}
.emc[data-fmt=land] .emc-in{padding:9cqw 24cqw 16cqw}
.emc[data-fmt=land] .gc-ar{font-size:9cqw}
.emc[data-fmt=land] .gc-headline{font-size:calc(3cqw * var(--k,1))}
.emc[data-fmt=land] .gc-name{--gc-n:6.4cqw}
.emc[data-fmt=land] .emc-arch{left:22cqw;right:22cqw;top:5cqw}
.emc[data-fmt=land] .emc-lan svg{width:6cqw}
.emc[data-fmt=land] .emc-moon{width:15cqw}
.emc[data-fmt=land] .emc-sky{height:15cqw}
.emc[data-fmt=square] .emc-in{padding:22cqw 18cqw 22cqw}
.emc[data-fmt=square] .gc-ar{font-size:12cqw}
.emc[data-fmt=square] .emc-arch{left:16cqw;right:16cqw;top:7cqw}
.emc[data-fmt=square] .emc-sky{height:18cqw}
.emc[data-kind=greeting] .emc-in{padding-top:26cqw;padding-bottom:22cqw}
.emc[data-kind=greeting] .gc-ar{font-size:12cqw}
`;

const LAN = [
  { x: 6, len: 14, glass: "#FFB547" },
  { x: 16, len: 26, glass: "#F2685A" },
  { x: 84, len: 20, glass: "#5FD3B8" },
];

export default function Card(p: CardProps) {
  return (
    <CardRoot p={p} cls="em emc" vars={VARS} defaults={DEFAULTS} templateId="eid-mubarak" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          <Stars n={40} seed={c.fmt.length} />
          <div className="emc-arch">
            <svg viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
              <path d={pointed(100, 140, 0.3)} fill="rgba(15,51,45,.55)" stroke="#D4AF37" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
              <path d={pointed(94, 136, 0.3)} transform="translate(3 4)" fill="none" stroke="#D4AF37" strokeOpacity=".35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <Crescent className="emc-moon" />
          {LAN.map((l, i) => (
            <div key={i} className="emc-lan" style={{ left: `${l.x}%`, animationDelay: `${-i * 1.3}s` }}>
              <i style={{ height: `${l.len}cqw` }} />
              <Lantern glass={l.glass} seed={i} />
            </div>
          ))}
          <div className="emc-sky"><Skyline /></div>
          <div className="emc-in">
            <Copy
              c={c}
              order={["divider", "headline", "eyebrow", "name", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]}
              divider={c.kind === "greeting" || c.kind === "story" || c.kind === "post" || c.kind === "invite" || c.kind === "welcome" ? <span className="gc-ar" lang="ar">عيد مبارك</span> : <StarRule className="emc-rule" />}
              headChars={14}
              nameChars={11}
            />
          </div>
        </>
      )}
    </CardRoot>
  );
}
