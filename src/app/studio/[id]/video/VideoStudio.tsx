"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { themeById, type Theme } from "@/lib/themes";
import type { MotifId } from "@/lib/motifs";
import { displayNames, nameParts, occasionInvite, occasionLine, occasionOf, OCCASIONS } from "@/lib/occasions";
import { BRAND } from "@/lib/brand";
import { Motif } from "@/components/Motif";
import { Heart } from "@/components/fx/Heart";

type Tier = "basic" | "premium" | "luxury";
const RANK: Record<Tier, number> = { basic: 1, premium: 2, luxury: 3 };
const TEMPLATES: { id: Tier; name: string; blurb: string; seconds: number }[] = [
  { id: "basic", name: "Whisper", blurb: "Elegant type that fades in like ink — one quiet scene.", seconds: 8 },
  { id: "premium", name: "Golden Hour", blurb: "Your photograph in slow Ken Burns light, drifting petals, two scenes.", seconds: 12 },
  { id: "luxury", name: "Sealed with Love", blurb: "A wax-sealed envelope opens into foil names, your photo and every event — four scenes.", seconds: 16 },
];
const FORMATS = { "9:16": [720, 1280], "16:9": [1280, 720] } as const;
type Format = keyof typeof FORMATS;

// ── easing & helpers ──
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const span = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const fadeIO = (t: number, a: number, b: number, f = 0.6) => Math.min(span(t, a, a + f), 1 - span(t, b - f, b));
const rand = (i: number) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };

function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

type Assets = { motif: HTMLImageElement | null; photo: HTMLImageElement | null; display: string; script: string; body: string };
type Ctx = { g: CanvasRenderingContext2D; W: number; H: number; t: number; th: Theme; p: Profile; A: Assets; dur: number };

function text(c: Ctx, s: string, x: number, y: number, size: number, opts: { font?: "display" | "script" | "body"; color?: string; alpha?: number; maxW?: number; italic?: boolean; spacing?: number; lh?: number; foil?: boolean } = {}) {
  const { g, A } = c;
  if (!s) return y;
  g.save();
  g.globalAlpha *= opts.alpha ?? 1;
  const fam = opts.font === "script" ? A.script : opts.font === "body" ? A.body : A.display;
  g.font = `${opts.italic ? "italic " : ""}${Math.round(size)}px ${fam}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  if (opts.spacing) (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${opts.spacing}px`;
  if (opts.foil) {
    const w = g.measureText(s).width;
    const sh = ((c.t * 0.35) % 1) * w * 2 - w;
    const grd = g.createLinearGradient(x - w / 2 + sh, 0, x + w / 2 + sh, 0);
    grd.addColorStop(0, c.th.foil[0]); grd.addColorStop(0.5, c.th.foil[1]); grd.addColorStop(1, c.th.foil[0]);
    g.fillStyle = grd;
  } else g.fillStyle = opts.color ?? c.th.ink;
  const lines = opts.maxW ? wrap(g, s, opts.maxW) : [s];
  const lh = size * (opts.lh ?? 1.25);
  const top = y - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => g.fillText(l, x, top + i * lh));
  g.restore();
  return top + lines.length * lh;
}

function background(c: Ctx, tint = 0.18) {
  const { g, W, H, th } = c;
  g.fillStyle = th.bg;
  g.fillRect(0, 0, W, H);
  const r = g.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, Math.max(W, H) * 0.7);
  r.addColorStop(0, th.gold + Math.round(tint * 255).toString(16).padStart(2, "0"));
  r.addColorStop(1, th.bg + "00");
  g.fillStyle = r;
  g.fillRect(0, 0, W, H);
}

function motif(c: Ctx, cx: number, cy: number, w: number, reveal: number, alpha = 1) {
  const { g, A } = c;
  if (!A.motif || reveal <= 0) return;
  const h = (w * 60) / 200;
  g.save();
  g.globalAlpha *= alpha;
  g.beginPath();
  g.rect(cx - w / 2, cy - h / 2, w * reveal, h); // drawn left → right, like a pen line
  g.clip();
  g.drawImage(A.motif, cx - w / 2, cy - h / 2, w, h);
  g.restore();
}

function petals(c: Ctx, n: number, alpha = 0.8) {
  const { g, W, H, t, th } = c;
  for (let i = 0; i < n; i++) {
    const speed = 0.05 + rand(i) * 0.06;
    const y = ((rand(i + 9) + t * speed) % 1.15) * H * 1.1 - H * 0.08;
    const x = rand(i + 3) * W + Math.sin(t * 0.9 + i) * W * 0.04;
    const s = (6 + rand(i + 5) * 10) * (W / 720);
    g.save();
    g.globalAlpha = alpha * (0.5 + rand(i + 7) * 0.5);
    g.translate(x, y);
    g.rotate(t * (0.6 + rand(i) * 1.4) + i);
    g.fillStyle = th.petals[i % th.petals.length];
    g.beginPath();
    g.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
}

function photo(c: Ctx, a: number, from: number, to: number, alpha = 1) {
  const { g, W, H, A, t } = c;
  if (!A.photo) { background(c, 0.32); return; }
  const k = clamp((t - from) / (to - from));
  const scale = 1.06 + k * 0.12 * a;
  const iw = A.photo.width, ih = A.photo.height;
  const cover = Math.max(W / iw, H / ih) * scale;
  g.save();
  g.globalAlpha *= alpha;
  g.drawImage(A.photo, W / 2 - (iw * cover) / 2 - k * W * 0.03, H / 2 - (ih * cover) / 2 - k * H * 0.02, iw * cover, ih * cover);
  const veil = g.createLinearGradient(0, 0, 0, H);
  veil.addColorStop(0, "rgba(0,0,0,.35)"); veil.addColorStop(0.55, "rgba(0,0,0,.15)"); veil.addColorStop(1, "rgba(0,0,0,.6)");
  g.fillStyle = veil;
  g.fillRect(0, 0, W, H);
  g.restore();
}

function namesBlock(c: Ctx, cy: number, alpha: number, onPhoto = false) {
  const { W, H, p } = c;
  const [a, b] = nameParts(p);
  const big = Math.min(W, H) * (W > H ? 0.13 : 0.15);
  const col = onPhoto ? "#fff7ee" : undefined;
  const rise = (1 - alpha) * H * 0.02;
  if (b) {
    text(c, a, W / 2, cy - big * 0.85 + rise, big, { alpha, foil: !onPhoto, color: col });
    text(c, "&", W / 2, cy + rise, big * 0.6, { font: "script", alpha, color: onPhoto ? "#fff7ee" : c.th.accent });
    text(c, b, W / 2, cy + big * 0.85 + rise, big, { alpha, foil: !onPhoto, color: col });
  } else text(c, a, W / 2, cy + rise, big * 1.1, { alpha, foil: !onPhoto, color: col, maxW: W * 0.85 });
}

function details(c: Ctx, cy: number, alpha: number, onPhoto = false) {
  const { W, H, p, th } = c;
  const s = Math.min(W, H);
  const col = onPhoto ? "#fff7ee" : th.ink;
  const d = formatDate(p.date, p.language);
  if (d) text(c, d, W / 2, cy, s * 0.05, { alpha, color: col });
  const where = p.venue || p.city;
  if (where) text(c, where.toUpperCase(), W / 2, cy + s * 0.07, s * 0.024, { font: "body", alpha: alpha * 0.85, color: onPhoto ? col : th.muted, spacing: 4, maxW: W * 0.8 });
}

function watermark(c: Ctx) {
  const { g, W, H } = c;
  g.save();
  g.translate(W / 2, H / 2);
  g.rotate(-Math.PI / 7);
  g.font = `italic ${Math.round(Math.min(W, H) / 11)}px Georgia, serif`;
  g.textAlign = "center";
  g.fillStyle = "rgba(255,255,255,.28)";
  g.strokeStyle = "rgba(90,26,46,.18)";
  for (let y = -H; y < H; y += Math.min(W, H) / 2.6) { g.fillText(`${BRAND.name} preview`, 0, y); g.strokeText(`${BRAND.name} preview`, 0, y); }
  g.restore();
}

// ── The three films ──
function drawBasic(c: Ctx) {
  const { W, H, t, p, th } = c;
  background(c);
  const s = Math.min(W, H);
  const out = 1 - span(t, c.dur - 0.8, c.dur);
  motif(c, W / 2, H * 0.24, s * 0.5, span(t, 0.2, 2.2), out);
  text(c, occasionLine(p), W / 2, H * 0.34, s * 0.03, { font: "body", color: th.muted, alpha: span(t, 1, 2.2) * out, spacing: 6 });
  namesBlock(c, H * 0.5, span(t, 1.5, 3.4) * out);
  details(c, H * 0.7, span(t, 3, 4.4) * out);
  text(c, p.inviteLine || occasionInvite(p), W / 2, H * 0.83, s * 0.032, { italic: true, color: th.muted, alpha: span(t, 4, 5.4) * out, maxW: W * 0.78 });
}

function drawPremium(c: Ctx) {
  const { W, H, t, p, th } = c;
  const s = Math.min(W, H);
  const cross = span(t, 5.6, 6.6);
  // Scene 1 — the photograph
  if (cross < 1) {
    photo(c, 1, 0, 6.6, 1);
    petals(c, 18, 0.7);
    text(c, occasionLine(p), W / 2, H * 0.3, s * 0.03, { font: "body", color: "#fff7ee", alpha: span(t, 0.6, 1.8), spacing: 6 });
    namesBlock(c, H * 0.5, span(t, 1, 2.8), true);
    details(c, H * 0.74, span(t, 2.6, 3.8), true);
  }
  // Scene 2 — the paper card
  if (cross > 0) {
    c.g.save();
    c.g.globalAlpha = cross;
    background(c, 0.22);
    petals(c, 14, 0.6);
    const out = 1 - span(t, c.dur - 0.8, c.dur);
    motif(c, W / 2, H * 0.2, s * 0.46, span(t, 6.2, 8), out);
    text(c, p.inviteLine || occasionInvite(p), W / 2, H * 0.38, s * 0.042, { italic: true, color: th.ink, alpha: span(t, 6.8, 8) * out, maxW: W * 0.8, lh: 1.35 });
    namesBlock(c, H * 0.58, span(t, 7.4, 9) * out);
    details(c, H * 0.78, span(t, 8.4, 9.6) * out);
    if (p.blessing) text(c, p.blessing, W / 2, H * 0.88, s * 0.045, { font: "script", color: th.accent, alpha: span(t, 9.4, 10.6) * out, maxW: W * 0.85 });
    c.g.restore();
  }
}

function drawLuxury(c: Ctx) {
  const { g, W, H, t, p, th } = c;
  const s = Math.min(W, H);
  const [a, b] = nameParts(p);
  // Scene 1 (0–4.4s) — the sealed envelope opens
  if (t < 4.6) {
    background(c, 0.12);
    const ew = s * 0.78, eh = ew * 0.66, ex = W / 2 - ew / 2, ey = H / 2 - eh / 2;
    const open = span(t, 2.2, 3.6);
    const lift = span(t, 3.2, 4.4);
    g.save();
    g.globalAlpha = 1 - span(t, 3.9, 4.5);
    // letter rising
    g.fillStyle = th.surface;
    g.fillRect(ex + ew * 0.06, ey + eh * 0.08 - lift * eh * 0.6, ew * 0.88, eh * 0.9);
    // envelope body
    g.fillStyle = th.accent;
    g.fillRect(ex, ey, ew, eh);
    g.fillStyle = "rgba(0,0,0,.12)";
    g.beginPath(); g.moveTo(ex, ey + eh); g.lineTo(W / 2, ey + eh * 0.5); g.lineTo(ex + ew, ey + eh); g.fill();
    // flap (folds open)
    g.fillStyle = th.accent;
    g.beginPath(); g.moveTo(ex, ey); g.lineTo(W / 2, ey + eh * 0.55 * (1 - open * 2)); g.lineTo(ex + ew, ey); g.closePath(); g.fill();
    g.strokeStyle = "rgba(255,255,255,.25)"; g.stroke();
    // wax seal with initials (breaks as the flap lifts)
    if (open < 0.4) {
      const sr = s * 0.075 * (1 + span(t, 1.6, 2.2) * 0.08);
      g.globalAlpha *= 1 - open * 2.5;
      g.fillStyle = th.gold;
      g.beginPath();
      for (let i = 0; i <= 24; i++) { const ang = (i / 24) * Math.PI * 2; const rr = sr * (1 + (i % 2 ? 0.06 : 0)); g.lineTo(W / 2 + Math.cos(ang) * rr, ey + eh * 0.55 + Math.sin(ang) * rr); }
      g.fill();
      g.strokeStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.arc(W / 2, ey + eh * 0.55, sr * 0.72, 0, Math.PI * 2); g.stroke();
      g.restore(); g.save();
      g.globalAlpha = (1 - open * 2.5) * (1 - span(t, 3.9, 4.5));
      text(c, b ? `${a[0]}${b[0]}` : a[0], W / 2, ey + eh * 0.55, s * 0.055, { color: th.dark ? th.bg : "#fff8ee" });
    }
    g.restore();
    text(c, `${BRAND.name}`, W / 2, H * 0.86, s * 0.022, { font: "body", color: th.muted, alpha: fadeIO(t, 0.3, 3.4), spacing: 8 });
  }
  // Scene 2 (4–8.4s) — foil names
  if (t >= 4 && t < 8.6) {
    g.save();
    g.globalAlpha = fadeIO(t, 4, 8.6);
    background(c, 0.24);
    petals(c, 16, 0.6);
    motif(c, W / 2, H * 0.22, s * 0.5, span(t, 4.3, 6.2));
    text(c, occasionLine(p), W / 2, H * 0.33, s * 0.03, { font: "body", color: th.muted, alpha: span(t, 4.8, 5.8), spacing: 6 });
    namesBlock(c, H * 0.52, span(t, 5, 6.6));
    details(c, H * 0.73, span(t, 6, 7.2));
    g.restore();
  }
  // Scene 3 (8–12.4s) — photograph & words
  if (t >= 8 && t < 12.6) {
    g.save();
    g.globalAlpha = fadeIO(t, 8, 12.6);
    photo(c, 1, 8, 12.6);
    petals(c, 12, 0.6);
    text(c, p.story || p.inviteLine || occasionInvite(p), W / 2, H * 0.5, s * 0.045, { italic: true, color: "#fff7ee", alpha: span(t, 8.6, 9.8), maxW: W * 0.8, lh: 1.4 });
    g.restore();
  }
  // Scene 4 (12–16s) — every event, then the date
  if (t >= 12) {
    g.save();
    g.globalAlpha = span(t, 12, 12.6) * (1 - span(t, c.dur - 0.7, c.dur));
    background(c, 0.2);
    const evs = (p.events ?? []).slice(0, 5);
    const top = H * (evs.length ? 0.2 : 0.4);
    text(c, displayNames(p), W / 2, top, s * 0.06, { foil: true, maxW: W * 0.85 });
    evs.forEach((e, i) => {
      const y = top + s * 0.14 + i * s * 0.12;
      const al = span(t, 12.5 + i * 0.35, 13.2 + i * 0.35);
      text(c, e.name, W / 2, y, s * 0.048, { alpha: al });
      text(c, [formatDate(e.date, p.language), e.time].filter(Boolean).join(" · "), W / 2, y + s * 0.045, s * 0.024, { font: "body", color: th.muted, alpha: al });
    });
    motif(c, W / 2, H * 0.84, s * 0.4, span(t, 13.6, 15), 0.9);
    if (!evs.length) details(c, H * 0.55, span(t, 12.6, 13.6));
    g.restore();
  }
}

const DRAW: Record<Tier, (c: Ctx) => void> = { basic: drawBasic, premium: drawPremium, luxury: drawLuxury };

export function VideoStudio({ id, profile, themeId, motif: motifId, videoTier }: { id: string; profile: Profile; themeId: string; motif?: MotifId; videoTier: Tier | null }) {
  const th = themeById(themeId);
  const occ = occasionOf(profile);
  const kindLabel = occ === "greeting" ? "video greeting" : "video invitation";
  const [tier, setTier] = useState<Tier>("premium");
  const [format, setFormat] = useState<Format>("9:16");
  const [recording, setRecording] = useState<null | number>(null);
  const [ready, setReady] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const motifBox = useRef<HTMLDivElement>(null);
  const fontBox = useRef<HTMLDivElement>(null);
  const assets = useRef<Assets>({ motif: null, photo: null, display: "Georgia, serif", script: "cursive", body: "system-ui, sans-serif" });
  const startAt = useRef(0);
  const isRec = useRef(false);
  const tpl = TEMPLATES.find((x) => x.id === tier)!;
  const unlocked = !!videoTier && RANK[videoTier] >= RANK[tier];
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  // Load fonts, the hand-drawn motif (as an image) and the cover photo (as a same-origin blob, so the canvas stays recordable).
  useEffect(() => {
    let alive = true;
    (async () => {
      await document.fonts?.ready;
      const spans = fontBox.current?.querySelectorAll("span");
      if (spans?.length === 3) {
        const [d, s, b] = Array.from(spans).map((el) => getComputedStyle(el).fontFamily);
        assets.current.display = d; assets.current.script = s; assets.current.body = b;
      }
      const svg = motifBox.current?.querySelector("svg");
      if (svg) {
        const clone = svg.cloneNode(true) as SVGSVGElement;
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        clone.setAttribute("width", "800"); clone.setAttribute("height", "240");
        clone.querySelectorAll("*").forEach((n) => { n.removeAttribute("class"); });
        const img = new Image();
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
        await img.decode().catch(() => {});
        if (alive) assets.current.motif = img;
      }
      if (profile.heroKey) {
        try {
          const blob = await (await fetch(`/api/media?key=${encodeURIComponent(profile.heroKey)}`)).blob();
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          await img.decode();
          if (alive) assets.current.photo = img;
        } catch { /* no photo — films fall back to a painted gradient */ }
      }
      if (alive) setReady(true);
    })();
    return () => { alive = false; };
  }, [profile.heroKey]);

  // Render loop (preview + recording share it).
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !ready) return;
    const [W, H] = FORMATS[format];
    cv.width = W; cv.height = H;
    const g = cv.getContext("2d")!;
    startAt.current = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = reduced && !isRec.current ? tpl.seconds * 0.45 : ((now - startAt.current) / 1000) % tpl.seconds;
      g.clearRect(0, 0, W, H);
      const c: Ctx = { g, W, H, t, th, p: profile, A: assets.current, dur: tpl.seconds };
      DRAW[tier](c);
      if (!unlocked) watermark(c);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [ready, format, tier, th, profile, unlocked, tpl.seconds, reduced]);

  async function record() {
    const cv = canvas.current;
    if (!cv || recording !== null) return;
    const types = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"];
    const mime = types.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m));
    if (!mime) return alert("Your browser can’t record video — please try Chrome, Edge or Safari.");
    setRecording(0);
    isRec.current = true;
    startAt.current = performance.now(); // restart the film from the first frame
    const rec = new MediaRecorder(cv.captureStream(30), { mimeType: mime, videoBitsPerSecond: 8_000_000 });
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: mime.split(";")[0] });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${displayNames(profile)}-${tpl.name}-${format.replace(":", "x")}.${mime.includes("mp4") ? "mp4" : "webm"}`.replace(/\s+/g, "-") });
      a.click();
      isRec.current = false;
      setRecording(null);
    };
    rec.start(250);
    const tick = setInterval(() => setRecording(Math.min(1, (performance.now() - startAt.current) / 1000 / tpl.seconds)), 200);
    setTimeout(() => { clearInterval(tick); rec.stop(); }, tpl.seconds * 1000 + 150);
  }

  return (
    <main className="grain relative min-h-dvh bg-ivory">
      {/* Offscreen sources the canvas reads from */}
      <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0" ref={motifBox}><Motif theme={th} motif={motifId} className="w-[400px]" /></div>
      <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0" ref={fontBox}><span className="display">a</span><span className="script">a</span><span>a</span></div>

      <header className="flex items-center justify-between px-5 py-4 md:px-8">
        <Link href={`/studio/${id}`} className="flex items-center gap-2 text-sm text-muted hover:text-ink">← Back to the studio</Link>
        <span className="display flex items-center gap-2 text-xl"><Heart className="heartbeat h-3 w-3" color="var(--rose)" />{BRAND.name}</span>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-20 md:grid-cols-[1fr_380px] md:px-8">
        <section className="flex flex-col items-center">
          <div className={`relative overflow-hidden rounded-[26px] bg-black shadow-[0_60px_120px_-50px_rgba(74,20,36,.7)] ring-1 ring-black/10 ${format === "9:16" ? "w-[min(100%,380px)] aspect-[9/16]" : "w-full aspect-video"}`}>
            <canvas ref={canvas} className="h-full w-full" />
            {!ready && <div className="absolute inset-0 flex items-center justify-center font-display text-lg italic text-white/70">Preparing your film…</div>}
            {recording !== null && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20"><div className="h-full bg-rose transition-[width] duration-200" style={{ width: `${recording * 100}%` }} /></div>
            )}
          </div>
          <p className="mt-4 text-center font-display text-sm italic text-muted">{tpl.seconds}-second {kindLabel} · {th.name} · change wording, photo and colours in the studio chat.</p>
        </section>

        <aside>
          <p className="eyebrow text-rose">{OCCASIONS[occ].name}</p>
          <h1 className="display mt-2 text-4xl leading-tight">Your <em className="text-rose">{kindLabel}</em></h1>
          <div className="mt-6 space-y-3">
            {TEMPLATES.map((x) => {
              const own = !!videoTier && RANK[videoTier] >= RANK[x.id];
              return (
                <motion.button whileTap={{ scale: 0.98 }} key={x.id} onClick={() => setTier(x.id)} className={`w-full rounded-3xl p-4 text-left transition ${tier === x.id ? "bg-white shadow-lg ring-1 ring-wine" : "bg-white/50 hover:bg-white/80"}`}>
                  <div className="flex items-center justify-between">
                    <p className="display text-2xl">{x.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-widest ${own ? "bg-emerald-600/90 text-white" : "bg-blush text-wine"}`}>{own ? "YOURS" : x.id.toUpperCase()}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{x.blurb}</p>
                </motion.button>
              );
            })}
          </div>
          <div className="glass mt-5 flex rounded-full p-1 text-sm">
            {(Object.keys(FORMATS) as Format[]).map((f) => (
              <button key={f} onClick={() => setFormat(f)} className={`flex-1 rounded-full py-2 transition ${format === f ? "bg-wine text-white" : "text-muted"}`}>{f === "9:16" ? "Stories · WhatsApp 9:16" : "Widescreen 16:9"}</button>
            ))}
          </div>
          <button onClick={record} disabled={!ready || recording !== null} className="btn btn-dark mt-5 w-full disabled:opacity-40">
            {recording !== null ? `Recording… ${Math.round(recording * 100)}%` : unlocked ? "↓ Download video" : "↓ Download preview (watermarked)"}
          </button>
          {!unlocked && (
            <Link href={`/studio/${id}?buy=video_${tier}`} className="btn btn-ghost mt-2 w-full text-center">Remove watermark — get {tpl.name}</Link>
          )}
          <p className="mt-4 text-xs leading-relaxed text-muted">Recorded in your browser at 30 fps{typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("video/mp4") ? " as MP4" : " (MP4 on Safari & recent Chrome, otherwise WebM)"}. Keep this tab open while it records.</p>
        </aside>
      </div>
    </main>
  );
}
