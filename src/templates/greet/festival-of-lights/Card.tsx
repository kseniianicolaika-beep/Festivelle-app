import type { CardProps } from "../../types";
import { CardRoot, Copy } from "../_shared/ui";
import { Diya, Jharokha, LotusRule, Rangoli, Toran } from "./art";
import { CSS, DEFAULTS, GOLDTEXT, VARS } from "./style";

const CARD_CSS = `
.flc{background:radial-gradient(80% 40% at 50% 100%,rgba(255,150,60,.35),transparent 70%),radial-gradient(120% 80% at 50% 0%,#2c1440,#1C0D28 65%)}
.flc-toran{position:absolute;top:0;left:-3%;width:106%;z-index:4;animation:gc-rise 1.2s both}
.flc-arch{position:absolute;left:7cqw;right:7cqw;top:15cqw;bottom:4cqw;z-index:1}
.flc-arch svg{width:100%;height:100%}
.flc-rangoli{position:absolute;left:50%;bottom:0;width:78cqw;translate:-50% 52%;z-index:2;opacity:.9;animation:gc-fade 2s both}
.flc-diyas{position:absolute;left:0;right:0;bottom:2.5cqw;display:flex;justify-content:center;gap:1.5cqw;z-index:3}
.flc-diyas svg{width:13cqw}
.flc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:34cqw 13cqw 30cqw;z-index:5}
.flc .gc-headline{${GOLDTEXT};--gc-h:12cqw}
.flc .gc-name{font-family:var(--g-script);color:var(--g-pink);--gc-n:10cqw}
.flc .gc-eyebrow{font-family:var(--g-body);text-transform:none;letter-spacing:.02em;font-style:italic;font-size:3.4cqw;color:var(--g-muted)}
.flc .gc-orn{font-family:var(--gf-amita),var(--font-deva),serif;color:var(--g-accent);font-size:5cqw}
.flc .gc-body{font-family:var(--g-body);--gc-b:3.5cqw;--lines:5;color:#F3E2C4}
.flc .gc-sign{font-family:var(--g-script);color:var(--g-pink)}
.flc .gc-number,.flc .gc-hashtag{${GOLDTEXT};font-family:var(--g-display)}
.flc-rule{width:38cqw}
.flc[data-fmt=tall] .flc-in{padding:46cqw 12cqw 66cqw}
.flc[data-fmt=tall] .gc-headline{--gc-h:16cqw}
.flc[data-fmt=tall] .gc-name{--gc-n:13cqw}
.flc[data-fmt=tall] .flc-arch{top:22cqw}
.flc[data-fmt=tall] .flc-diyas svg{width:16cqw}
.flc[data-fmt=tall] .flc-rangoli{width:110cqw}
.flc[data-fmt=land] .flc-in{padding:17cqw 18cqw 17cqw}
.flc[data-fmt=land] .gc-headline{--gc-h:8cqw}
.flc[data-fmt=land] .gc-name{--gc-n:6cqw}
.flc[data-fmt=land] .flc-arch{left:22cqw;right:22cqw;top:10cqw}
.flc[data-fmt=land] .flc-diyas svg{width:8cqw}
.flc[data-fmt=land] .flc-rangoli{width:46cqw}
.flc[data-fmt=land] .gc-orn{font-size:3.4cqw}
.flc[data-fmt=square] .flc-in{padding:20cqw 16cqw 30cqw}
.flc[data-fmt=square] .flc-arch{left:14cqw;right:14cqw;top:13cqw}
.flc[data-fmt=square] .flc-diyas svg{width:10cqw}
.flc[data-fmt=square] .flc-rangoli{width:48cqw}
.flc[data-kind=greeting] .flc-in{padding-top:30cqw;padding-bottom:28cqw}
`;

export default function Card(p: CardProps) {
  const hi = p.profile.language === "hi";
  return (
    <CardRoot p={p} cls="fl flc" vars={VARS} defaults={DEFAULTS} templateId="festival-of-lights" css={CSS + CARD_CSS}>
      {(c) => (
        <>
          <div className="flc-arch"><Jharokha /></div>
          <Toran className="flc-toran" swags={c.fmt === "land" ? 5 : 3} />
          <Rangoli className="flc-rangoli" />
          <div className="flc-diyas">{Array.from({ length: c.fmt === "land" ? 7 : 5 }, (_, i) => <Diya key={i} seed={i + 3} />)}</div>
          <div className="flc-in">
            <Copy
              c={c}
              order={["divider", "headline", "eyebrow", "name", "lead", "items", "number", "hashtag", "body", "meta", "signoff"]}
              divider={!hi && (c.kind === "greeting" || c.kind === "story" || c.kind === "post" || c.kind === "invite") ? <span className="gc-orn">शुभ दीपावली</span> : <LotusRule className="flc-rule" />}
              headChars={12}
              nameChars={14}
            />
          </div>
        </>
      )}
    </CardRoot>
  );
}
