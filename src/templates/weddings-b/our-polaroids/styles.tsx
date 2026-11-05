import { StyleTag } from "../_shared/kit";

// Our Polaroids — a love diary: cream paper, washi tape, polaroids, red pen.
const names = ["root", "paper", "still", "tape", "tapeTop", "tapeCorner", "polaroid", "photo", "develop", "gloss", "caption", "stamp", "stampInner", "stampValue", "calendar", "calRings", "calMonth", "calGrid", "calWk", "calDay", "calOn", "calCircle", "calHeart", "sticky", "ruled", "label", "torn", "shadow", "hand", "mono", "pin"] as const;
export const s = Object.fromEntries(names.map((n) => [n, `pl-${n}`])) as Record<(typeof names)[number], string>;

const CSS = `
.pl-root { --paper: #f5f0e6; --ink: #2b2724; --pen: #d2462e; --blue: #2f4f8f; --stampink: #2f4f8f; --kraft: #d9c3a0; -webkit-font-smoothing: antialiased; }
.pl-paper {
  background-color: var(--t-bg, var(--paper));
  background-image:
    radial-gradient(rgba(43,39,36,.13) 1px, transparent 1.3px),
    radial-gradient(130% 80% at 15% 0%, rgba(255,255,255,.7), transparent 60%),
    radial-gradient(120% 90% at 100% 100%, rgba(217,195,160,.35), transparent 60%);
  background-size: 22px 22px, 100% 100%, 100% 100%;
}
.pl-hand { font-family: var(--ws); }
.pl-mono { font-family: var(--wb-mono), var(--wb-kalam), ui-monospace, monospace; letter-spacing: .04em; }

.pl-tape { position: absolute; display: block; width: 34%; height: 9%; min-height: 14px; opacity: .88; mix-blend-mode: multiply; z-index: 3;
  clip-path: polygon(0 8%, 4% 0, 8% 10%, 12% 0, 16% 8%, 20% 0, 80% 0, 84% 9%, 88% 0, 92% 10%, 96% 0, 100% 8%, 100% 92%, 96% 100%, 92% 90%, 88% 100%, 84% 91%, 80% 100%, 20% 100%, 16% 92%, 12% 100%, 8% 90%, 4% 100%, 0 92%);
  box-shadow: inset 0 0 0 100px rgba(255,255,255,.08); }
.pl-tapeTop { top: -4%; left: 33%; transform: rotate(-4deg); }
.pl-tapeCorner { bottom: 6%; right: -9%; transform: rotate(-38deg); width: 30%; }

.pl-polaroid { position: relative; margin: 0; background: #fdfcf8; padding: 5.5% 5.5% 0; box-shadow: 0 1px 1px rgba(0,0,0,.08), 0 10px 24px -10px rgba(60,40,20,.45), 0 30px 60px -30px rgba(60,40,20,.35); }
.pl-polaroid::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(160deg, rgba(255,255,255,.6), transparent 40%, rgba(0,0,0,.03)); }
.pl-photo { position: relative; aspect-ratio: 1 / 1; overflow: hidden; background: #2d2a2a; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
.pl-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: contrast(1.04) saturate(.92) sepia(.08); }
.pl-develop { position: absolute; inset: 0; background: linear-gradient(180deg, #4b5561, #2f3640); opacity: 0; pointer-events: none; }
.pl-gloss { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, rgba(255,255,255,.18), transparent 35%), radial-gradient(140% 100% at 50% 50%, transparent 60%, rgba(0,0,0,.18)); }
.pl-caption { font-family: var(--ws); color: var(--ink); text-align: center; line-height: 1.05; padding: 7% 4% 9%; }

.pl-stamp { display: inline-block; padding: 7px; background: #fbf7ef;
  -webkit-mask: radial-gradient(circle at 5px 5px, transparent 3.2px, #000 3.6px) -5px -5px / 10px 10px;
  mask: radial-gradient(circle at 5px 5px, transparent 3.2px, #000 3.6px) -5px -5px / 10px 10px;
  filter: drop-shadow(0 2px 3px rgba(60,40,20,.25)); }
.pl-stampInner { position: relative; overflow: hidden; border: 1px solid rgba(47,79,143,.35); background: #e9eef6; }
.pl-stampValue { position: absolute; right: 6px; top: 4px; font-family: var(--wb-mono), monospace; font-size: 11px; color: var(--pen); }

.pl-calendar { position: relative; background: #fffdf8; padding: 9% 7% 7%; box-shadow: 0 12px 30px -16px rgba(60,40,20,.5); color: var(--ink); }
.pl-calRings { position: absolute; top: -6px; left: 8%; right: 8%; display: flex; justify-content: space-between; }
.pl-calRings span { width: 6px; height: 16px; border-radius: 4px; background: linear-gradient(90deg, #8d8d8d, #e8e8e8, #8d8d8d); box-shadow: 0 1px 1px rgba(0,0,0,.3); }
.pl-calMonth { font-family: var(--ws); font-size: 2.1em; line-height: 1; text-transform: lowercase; margin-bottom: .35em; }
.pl-calMonth span { font-family: var(--wb-mono), monospace; font-size: .38em; letter-spacing: .2em; color: rgba(43,39,36,.55); vertical-align: middle; margin-left: .4em; }
.pl-calGrid { display: grid; grid-template-columns: repeat(7, 1fr); gap: .25em .1em; text-align: center; font-family: var(--wb-mono), monospace; font-size: .82em; }
.pl-calWk { color: var(--pen); font-size: .8em; text-transform: uppercase; padding-bottom: .3em; border-bottom: 1px solid rgba(43,39,36,.15); }
.pl-calDay { position: relative; padding: .28em 0; color: rgba(43,39,36,.75); }
.pl-calOn { color: var(--pen); font-weight: 700; }
.pl-calCircle { position: absolute; left: -35%; top: -28%; width: 170%; height: 156%; overflow: visible; }
.pl-calHeart { position: absolute; right: -55%; top: -45%; width: 60%; transform: rotate(14deg); }

.pl-sticky { position: relative; padding: 9% 9% 11%; box-shadow: 0 1px 1px rgba(0,0,0,.06), 0 14px 22px -14px rgba(60,40,20,.5); }
.pl-sticky::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 16%; background: linear-gradient(180deg, rgba(0,0,0,.06), transparent); }
.pl-ruled { --rule: 1.9em; --pt: 0px; background-color: #fffdf8;
  background-image: linear-gradient(90deg, transparent 2.6em, rgba(210,70,46,.35) 2.6em, rgba(210,70,46,.35) calc(2.6em + 1px), transparent calc(2.6em + 1px)), linear-gradient(180deg, transparent calc(var(--rule) - 1px), rgba(47,79,143,.22) calc(var(--rule) - 1px));
  background-size: 100% 100%, 100% var(--rule); background-repeat: no-repeat, repeat-y; background-position: 0 0, 0 calc(var(--pt) - var(--rule) * .16); }
.pl-label { display: inline-block; background: #fffdf8; padding: .45em .9em; font-family: var(--wb-mono), var(--wb-kalam), monospace; letter-spacing: .08em; box-shadow: 0 2px 6px -2px rgba(60,40,20,.35); }
.pl-torn { clip-path: polygon(0 3%, 6% 0, 12% 2%, 19% 0, 27% 3%, 35% 1%, 44% 3%, 52% 0, 61% 2%, 70% 0, 78% 3%, 86% 1%, 93% 3%, 100% 0, 100% 100%, 0 100%); }
.pl-shadow { filter: drop-shadow(0 14px 22px rgba(60,40,20,.28)); }
.pl-pin { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #ff8a73, var(--pen) 55%, #8d2414); box-shadow: 1px 3px 3px rgba(0,0,0,.35); z-index: 4; }
@media (prefers-reduced-motion: reduce) { .pl-develop { display: none; } }
`;
export const PolaroidStyles = () => <StyleTag id="wb-polaroids" css={CSS} />;
