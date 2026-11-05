import { StyleTag } from "../_shared/kit";

// Lotus Vows styles (hoisted by React 19 <style href precedence>).
export const s = { root: "lt-root", silk: "lt-silk", foil: "lt-foil", still: "lt-still", env: "lt-env", flap: "lt-flap", pocket: "lt-pocket", liner: "lt-liner", float: "lt-float", pulse: "lt-pulse" } as const;
const CSS = `
.lt-root { -webkit-font-smoothing: antialiased; }
.lt-silk {
  background:
    radial-gradient(90% 60% at 50% 0%, #fff9f6 0%, transparent 60%),
    radial-gradient(70% 50% at 0% 100%, rgba(184,84,111,.10), transparent 70%),
    radial-gradient(60% 50% at 100% 70%, rgba(201,162,101,.12), transparent 70%),
    #fbefed;
}
.lt-foil {
  background: linear-gradient(105deg, var(--foil-a) 0%, #c08a4c 20%, #e0b876 26%, #c08a4c 32%, var(--foil-a) 50%, #8f5d2c 64%, #c08a4c 80%, var(--foil-a) 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: lt-sheen 9s ease-in-out infinite;
}
.lt-still .lt-foil { animation: none; background-position: 35% 50%; }
@keyframes lt-sheen { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.lt-flame { animation: lt-flicker 1.6s ease-in-out infinite; }
@keyframes lt-flicker { 0%,100% { transform: scale(1,1) skewX(0deg); } 25% { transform: scale(.96,1.06) skewX(-2deg); } 50% { transform: scale(1.03,.95) skewX(1.5deg); } 75% { transform: scale(.98,1.04) skewX(-1deg); } }
.lt-spark { animation: lt-spark 2.4s ease-out infinite; }
@keyframes lt-spark { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-30px); opacity: 0; } }
.lt-still .lt-flame, .lt-still .lt-spark { animation: none; }
.lt-float { animation: lt-float 7s ease-in-out infinite; }
@keyframes lt-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.lt-pulse { animation: lt-pulse 2.2s ease-in-out infinite; }
@keyframes lt-pulse { 0%,100% { opacity: .5; } 50% { opacity: 1; } }

/* The envelope opening */
.lt-env { position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; background: radial-gradient(80% 70% at 50% 40%, #fbefed, #f1d4d4); animation: lt-failsafe .8s ease 8s forwards; perspective: 1600px; }
@keyframes lt-failsafe { to { opacity: 0; visibility: hidden; } }
@media (prefers-reduced-motion: reduce) { .lt-env { display: none; } .lt-flame, .lt-spark, .lt-float, .lt-pulse { animation: none !important; } }
.lt-liner { background:
  radial-gradient(circle at 50% 50%, rgba(201,162,101,.55) 1.2px, transparent 1.6px) 0 0 / 18px 18px,
  radial-gradient(circle at 50% 50%, rgba(255,255,255,.35) 1px, transparent 1.4px) 9px 9px / 18px 18px,
  linear-gradient(160deg, #9d3f5a, #6e2440); }
.lt-pocket { background: linear-gradient(170deg, #f8dcdc, #efc5c8); clip-path: polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%); box-shadow: inset 0 0 0 1px rgba(201,162,101,.4); }
.lt-flap { clip-path: polygon(0 0, 100% 0, 50% 100%); background: linear-gradient(180deg, #f6d2d4, #eebdc2); transform-origin: 50% 0; backface-visibility: hidden; }
`;
export const LotusStyles = () => <StyleTag id="wb-lotus" css={CSS} />;
