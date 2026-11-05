import { StyleTag } from "../_shared/kit";

// Gatsby Vows styles (hoisted once per page by React 19 <style href precedence>).
export const s = { arch: "gv-arch", bubbleCanvas: "gv-bubbleCanvas", door: "gv-door", foil: "gv-foil", gate: "gv-gate", goldLine: "gv-goldLine", lacquer: "gv-lacquer", notch: "gv-notch", perf: "gv-perf", root: "gv-root", scrollCue: "gv-scrollCue", still: "gv-still", ticket: "gv-ticket" } as const;
const CSS = `/* Gatsby Vows — black lacquer, gilt line-work, champagne. */
.gv-root {
  --gold-1: #8c6a2e;
  --gold-2: #f6e3a8;
  --gold-3: #c49a4c;
  --onyx: #0b0a09;
  --jade: #1f3b33;
  -webkit-font-smoothing: antialiased;
}

/* Gold foil that catches the light: a slow travelling highlight across a warm gilt gradient. */
.gv-foil {
  background: linear-gradient(105deg, var(--foil-a) 0%, var(--foil-b) 18%, #fff7dc 24%, var(--foil-b) 30%, var(--foil-a) 48%, #b8913f 62%, var(--foil-b) 78%, var(--foil-a) 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gv-sheen 9s ease-in-out infinite;
}
.gv-still .gv-foil { animation: none; background-position: 35% 50%; }
@keyframes gv-sheen { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

.gv-goldLine { background: linear-gradient(90deg, transparent, var(--foil-b), var(--foil-a), var(--foil-b), transparent); }

/* Notched (cut-corner) panels — the deco silhouette. */
.gv-notch {
  --n: 18px;
  clip-path: polygon(var(--n) 0, calc(100% - var(--n)) 0, 100% var(--n), 100% calc(100% - var(--n)), calc(100% - var(--n)) 100%, var(--n) 100%, 0 calc(100% - var(--n)), 0 var(--n));
}

.gv-lacquer {
  background:
    radial-gradient(120% 70% at 50% 0%, rgba(214, 179, 106, 0.10), transparent 60%),
    radial-gradient(90% 60% at 50% 110%, rgba(31, 59, 51, 0.35), transparent 70%),
    repeating-linear-gradient(90deg, rgba(214, 179, 106, 0.035) 0 1px, transparent 1px 64px),
    var(--onyx);
}

.gv-gate {
  position: fixed;
  inset: 0;
  z-index: 80;
  perspective: 1800px;
  animation: gv-gateFailsafe 0.8s ease 7s forwards;
}
@keyframes gv-gateFailsafe { to { opacity: 0; visibility: hidden; } }
@media (prefers-reduced-motion: reduce) { .gv-gate { display: none; } }

.gv-door { position: absolute; top: 0; bottom: 0; width: 50%; background: var(--onyx); backface-visibility: hidden; will-change: transform; }

.gv-ticket { --n: 14px; }
.gv-perf { background-image: radial-gradient(circle, var(--onyx) 3.5px, transparent 4px); background-size: 100% 14px; background-repeat: repeat-y; }

.gv-bubbleCanvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

.gv-arch {
  clip-path: polygon(0 100%, 0 34%, 7% 34%, 7% 27%, 14% 27%, 14% 20%, 20% 20%, 22% 13%, 30% 6%, 40% 1.5%, 50% 0, 60% 1.5%, 70% 6%, 78% 13%, 80% 20%, 86% 20%, 86% 27%, 93% 27%, 93% 34%, 100% 34%, 100% 100%);
}

.gv-scrollCue { animation: gv-cue 2.4s ease-in-out infinite; }
@keyframes gv-cue { 0%, 100% { transform: translateY(0); opacity: 0.35; } 50% { transform: translateY(8px); opacity: 0.9; } }
`;
export const GatsbyStyles = () => <StyleTag id="wb-gatsby" css={CSS} />;
