import { StyleTag, grain } from "../_shared/kit";

// Gzhel Garden styles (prefixed gz-, hoisted once per page).
export const s = { root: "gz-root", glaze: "gz-glaze", net: "gz-net", still: "gz-still", spin: "gz-spin", rule: "gz-rule", leader: "gz-leader" } as const;

const CSS = `
.gz-root { -webkit-font-smoothing: antialiased; }
.gz-glaze {
  background-color: #fbfcff;
  background-image: radial-gradient(60% 40% at 22% 8%, rgba(255,255,255,.95), transparent 70%), radial-gradient(80% 60% at 90% 100%, rgba(169,191,238,.16), transparent 70%), ${grain(0.06, 1.1)};
}
.gz-net {
  background-image:
    radial-gradient(circle, rgba(28,63,148,.22) 1.1px, transparent 1.6px),
    repeating-linear-gradient(45deg, rgba(28,63,148,.07) 0 1px, transparent 1px 16px),
    repeating-linear-gradient(-45deg, rgba(28,63,148,.07) 0 1px, transparent 1px 16px);
  background-size: 22.6px 22.6px, auto, auto;
}
.gz-rule { background: linear-gradient(90deg, transparent, #1c3f94 12%, #1c3f94 88%, transparent); height: 1px; }
.gz-leader { flex: 1; border-bottom: 1.5px dotted rgba(28,63,148,.35); transform: translateY(-.35em); min-width: 1.5rem; }
.gz-spin { animation: gz-spin 120s linear infinite; }
@keyframes gz-spin { to { transform: rotate(360deg); } }
.gz-still .gz-spin { animation: none; }
@media (prefers-reduced-motion: reduce) { .gz-spin { animation: none; } }
`;
export const GzhelStyles = () => <StyleTag id="wb-gzhel" css={CSS} />;
