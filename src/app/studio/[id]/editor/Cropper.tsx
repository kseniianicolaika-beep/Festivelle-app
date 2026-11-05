"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const ASPECTS: [string, number | null][] = [["This piece", null], ["Original", 0], ["1 : 1", 1], ["4 : 5", 4 / 5], ["3 : 2", 3 / 2], ["16 : 9", 16 / 9]];

// Photo cropping: pan (drag / touch), zoom (slider, wheel or pinch), straighten-free.
// Outputs a new JPEG (max 2400px) — the original stays in the library untouched.
export function Cropper({ src, pieceAspect, onDone, onClose }: { src: string; pieceAspect: number; onDone: (file: File) => Promise<void> | void; onClose: () => void }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [aspectSel, setAspectSel] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // offset of image centre from frame centre, in frame px
  const [busy, setBusy] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinch = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ d: number; z: number } | null>(null);

  useEffect(() => {
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);

  const aspect = aspectSel === null ? pieceAspect : aspectSel === 0 ? (img ? img.naturalWidth / img.naturalHeight : 1) : aspectSel;
  const W = 320;
  const H = W / aspect;
  // "cover" base scale so the image always fills the frame at zoom 1
  const base = img ? Math.max(W / img.naturalWidth, H / img.naturalHeight) : 1;
  const s = base * zoom;
  const iw = img ? img.naturalWidth * s : W;
  const ih = img ? img.naturalHeight * s : H;
  const clamp = (p: { x: number; y: number }) => ({ x: Math.max(Math.min(p.x, (iw - W) / 2), -(iw - W) / 2), y: Math.max(Math.min(p.y, (ih - H) / 2), -(ih - H) / 2) });
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- keep the photo covering the frame
  useEffect(() => { setPos((p) => clamp(p)); }, [zoom, aspect, img]);

  function down(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.size === 2) {
      const [a, b] = [...pinch.current.values()];
      pinchStart.current = { d: Math.hypot(a.x - b.x, a.y - b.y), z: zoom };
      drag.current = null;
    } else drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  }
  function move(e: React.PointerEvent) {
    if (pinch.current.has(e.pointerId)) pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinchStart.current && pinch.current.size === 2) {
      const [a, b] = [...pinch.current.values()];
      setZoom(Math.min(Math.max((pinchStart.current.z * Math.hypot(a.x - b.x, a.y - b.y)) / pinchStart.current.d, 1), 5));
      return;
    }
    if (!drag.current) return;
    setPos(clamp({ x: drag.current.px + e.clientX - drag.current.x, y: drag.current.py + e.clientY - drag.current.y }));
  }
  function up(e: React.PointerEvent) {
    pinch.current.delete(e.pointerId);
    if (pinch.current.size < 2) pinchStart.current = null;
    drag.current = null;
  }

  async function save() {
    if (!img) return;
    setBusy(true);
    // Frame → natural-pixel rectangle
    const sx = (iw / 2 - W / 2 - pos.x) / s;
    const sy = (ih / 2 - H / 2 - pos.y) / s;
    const sw = W / s;
    const sh = H / s;
    const outW = Math.round(Math.min(2400, sw));
    const outH = Math.round(outW / aspect);
    const c = document.createElement("canvas");
    c.width = outW;
    c.height = outH;
    const g = c.getContext("2d")!;
    g.imageSmoothingQuality = "high";
    g.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.9));
    if (!blob) return setBusy(false);
    await onDone(new File([blob], `cropped-${Date.now()}.jpg`, { type: "image/jpeg" }));
    setBusy(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-end justify-center bg-wine/40 backdrop-blur-md sm:items-center" onClick={onClose}>
      <motion.div initial={{ y: 30 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-[32px] bg-paper p-6 shadow-2xl sm:rounded-[32px]">
        <div className="flex items-center justify-between">
          <h3 className="display text-3xl">Frame your <em className="text-rose">photo</em></h3>
          <button onClick={onClose} className="text-2xl text-muted" aria-label="Close">×</button>
        </div>
        <p className="mt-1 text-xs text-muted">Drag to position · pinch, scroll or slide to zoom</p>
        <div className="mt-4 flex justify-center">
          <div ref={frame} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
            onWheel={(e) => setZoom((z) => Math.min(Math.max(z - e.deltaY * 0.0015, 1), 5))}
            className="relative cursor-grab touch-none overflow-hidden rounded-2xl bg-black/5 shadow-inner active:cursor-grabbing" style={{ width: W, height: H, maxHeight: "52dvh" }}>
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" draggable={false} className="pointer-events-none absolute max-w-none select-none"
                style={{ width: iw, height: ih, left: W / 2 - iw / 2 + pos.x, top: H / 2 - ih / 2 + pos.y }} />
            ) : <p className="grid h-full place-items-center text-sm text-muted">Loading…</p>}
            {/* rule-of-thirds guide */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">{Array.from({ length: 9 }).map((_, i) => <span key={i} className="border border-white/30" />)}</div>
          </div>
        </div>
        <input type="range" min={1} max={5} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-4 w-full accent-[#c06c78]" aria-label="Zoom" />
        <div className="mt-3 flex flex-wrap gap-1.5 text-[12px]">
          {ASPECTS.map(([l, a]) => (
            <button key={l} onClick={() => setAspectSel(a)} className={`rounded-full px-3 py-1 ${aspectSel === a ? "bg-wine text-white" : "bg-white/70"}`}>{l}</button>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
          <button onClick={save} disabled={!img || busy} className="btn btn-dark flex-1 disabled:opacity-40">{busy ? "Saving…" : "Use this crop"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
