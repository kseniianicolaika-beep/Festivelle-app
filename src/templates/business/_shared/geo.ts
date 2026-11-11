/** Round SVG coordinates so server and client trig agree byte-for-byte (avoids hydration mismatches). */
export const r2 = (n: number) => Math.round(n * 100) / 100;
/** Point on a circle, rounded. */
export const polar = (cx: number, cy: number, r: number, a: number) => `${r2(cx + Math.cos(a) * r)} ${r2(cy + Math.sin(a) * r)}`;
