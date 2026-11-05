import { StyleTag, fibres, grain } from "../_shared/kit";

// Terracotta Table styles (prefixed, hoisted once per page).
export const s = { root: "tt-root", sand: "tt-sand", clay: "tt-clay", arch: "tt-arch", tile: "tt-tile", label: "tt-label", still: "tt-still", pill: "tt-pill", title: "tt-title", night: "tt-night" } as const;

const CSS = `
.tt-root { -webkit-font-smoothing: antialiased; }
.tt-sand { background-color: var(--t-bg); background-image: ${grain(0.16, 0.85)}, ${fibres(0.08)}, radial-gradient(120% 60% at 80% 0%, rgba(232,184,150,.25), transparent 60%); }
.tt-clay {
  background-color: #b8572f;
  background-image: ${grain(0.32, 0.8)}, radial-gradient(70% 90% at 20% 30%, rgba(214,120,72,.55), transparent 70%), radial-gradient(60% 80% at 85% 80%, rgba(120,48,22,.45), transparent 70%);
  background-blend-mode: multiply, normal, normal;
}
.tt-night { background-color: #24140d; background-image: ${grain(0.25, 0.85)}, radial-gradient(80% 60% at 50% 0%, rgba(184,87,47,.28), transparent 70%); }
.tt-arch { border-radius: 1000px 1000px 0 0; }
.tt-tile {
  background-color: #c4683f;
  background-image: ${grain(0.3, 0.8)},
    linear-gradient(45deg, rgba(255,235,210,.14) 25%, transparent 25%, transparent 75%, rgba(255,235,210,.14) 75%),
    linear-gradient(45deg, rgba(255,235,210,.14) 25%, transparent 25%, transparent 75%, rgba(255,235,210,.14) 75%),
    radial-gradient(circle at 50% 50%, rgba(255,240,220,.18) 0 2px, transparent 3px);
  background-size: 220px 220px, 56px 56px, 56px 56px, 28px 28px;
  background-position: 0 0, 0 0, 28px 28px, 0 0;
  background-blend-mode: multiply, normal, normal, normal;
}
.tt-label { font-family: var(--wb-manrope), var(--font-deva), system-ui, sans-serif; text-transform: uppercase; letter-spacing: .34em; font-weight: 500; }
.tt-pill { display: inline-flex; align-items: center; gap: .6em; border: 1px solid currentColor; border-radius: 999px; padding: .95em 1.8em; transition: background .4s, color .4s; }
.tt-pill:hover { background: #b8572f; color: #fbeee0; border-color: #b8572f; }
.tt-title { text-shadow: 0 1px 24px rgba(255,236,200,.55); }
`;
export const TerraStyles = () => <StyleTag id="wb-terracotta" css={CSS} />;
