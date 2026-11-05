"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Presence } from "@/lib/realtime";
import { AnimatePresence, motion } from "motion/react";
import { EditContext, type EditCtx } from "@/components/designs/Editable";
import { sectionLayout, SECTIONS, type Doc, type SectionId } from "@/lib/templates";
import type { Profile } from "@/lib/profile";
import { CURATED_ACCENTS, FONT_PAIRS, pathLabel, type FontPairId } from "@/lib/editor-options";

export type EditMsg = { id: string; role: "user" | "assistant"; content: string; chips: string[]; kind?: string };
type Undo = { kind: "doc"; docId: string; versionId: string; label: string } | { kind: "profile"; field: string; value: string; label: string };

type Props = {
  weddingId: string;
  doc: Doc;
  profile: Profile;
  luxury: boolean;
  enabled: boolean;
  selected: string | null;
  onSelect: (p: string | null) => void;
  onDoc: (d: Doc) => void;
  onProfile: (p: Partial<Profile>) => void;
  onMessage: (m: EditMsg) => void;
  onPhotoSlot: (slot: string) => void;
  onAsk: (path: string) => void;
  peers?: Presence[];
  children: React.ReactNode;
};

const j = (method: string, body: unknown) => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const quote = (v: string) => `“${v.length > 70 ? v.slice(0, 70) + "…" : v}”`;

// The visual editor. Wraps the live preview: <E> texts become inline-editable, [data-edit-photo] opens the photo
// picker, [data-edit-section] selects a website section. Every edit PATCHes the same design/profile the chat uses
// and leaves a quiet ✎ line in the conversation, so the AI always knows what changed.
export function EditorShell({ weddingId, doc, profile, luxury, enabled, selected, onSelect, onDoc, onProfile, onMessage, onPhotoSlot, onAsk, peers = [], children }: Props) {
  const [undo, setUndo] = useState<Undo[]>([]);
  const [redo, setRedo] = useState<Undo[]>([]);
  const [history, setHistory] = useState<null | { id: string; label: string | null; created_at: string }[]>(null);
  const [err, setErr] = useState<string | null>(null);

  const patchDoc = useCallback(async (body: Record<string, unknown>, label: string, log = true) => {
    const r = await fetch(`/api/weddings/${weddingId}/documents/${doc.id}`, j("PATCH", { ...body, log: log ? `✎ ${label}` : undefined }));
    const d = await r.json();
    if (!r.ok) { setErr(d.error ?? "Couldn’t save that change."); return false; }
    onDoc(d.doc);
    if (d.message) onMessage(d.message);
    setUndo((u) => [...u.slice(-49), { kind: "doc", docId: doc.id, versionId: d.versionId, label }]);
    setRedo([]);
    return true;
  }, [weddingId, doc.id, onDoc, onMessage]);

  const patchProfile = useCallback(async (field: string, value: string, label: string, track = true) => {
    const prev = String(profile[field as keyof Profile] ?? "");
    const r = await fetch(`/api/weddings/${weddingId}`, j("PATCH", { profile: { [field]: value }, log: `✎ ${label}` }));
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { setErr(d.error ?? "Couldn’t save that change."); return; }
    onProfile({ [field]: value || undefined } as Partial<Profile>);
    if (d.message) onMessage(d.message);
    if (track) { setUndo((u) => [...u.slice(-49), { kind: "profile", field, value: prev, label }]); setRedo([]); }
  }, [weddingId, profile, onProfile, onMessage]);

  const commit = useCallback((path: string, value: string) => {
    const label = `Edited ${pathLabel(path)} → ${quote(value)}`;
    if (path.startsWith("profile.")) return void patchProfile(path.slice(8), value, label);
    if (path.startsWith("texts.")) return void patchDoc({ texts: { [path.slice(6)]: value } }, label);
    const it = path.match(/^items\.(\d+)\.(title|detail)$/);
    if (it) {
      const items = [...(doc.design.items ?? [])];
      const i = Number(it[1]);
      items[i] = { ...(items[i] ?? { title: "" }), [it[2]]: value };
      return void patchDoc({ items: items.filter((x) => x.title.trim()) }, label);
    }
    if (path === "number" && /^\d+$/.test(value)) return void patchDoc({ number: Number(value) }, label);
  }, [doc.design.items, patchDoc, patchProfile]);

  async function step(dir: "undo" | "redo") {
    const [from, setFrom, setTo] = dir === "undo" ? [undo, setUndo, setRedo] : [redo, setRedo, setUndo];
    const e = from[from.length - 1];
    if (!e) return;
    setFrom((s) => s.slice(0, -1));
    if (e.kind === "profile") {
      const now = String(profile[e.field as keyof Profile] ?? "");
      await patchProfile(e.field, e.value, `${dir === "undo" ? "Undid" : "Redid"}: ${e.label}`, false);
      setTo((s) => [...s, { ...e, value: now }]);
      return;
    }
    const r = await fetch(`/api/weddings/${weddingId}/documents/${e.docId}/history`, j("POST", { versionId: e.versionId, log: `✎ ${dir === "undo" ? "Undid" : "Redid"}: ${e.label}` }));
    const d = await r.json();
    if (!r.ok) return setErr(d.error);
    if (d.doc.id === doc.id) onDoc(d.doc);
    if (d.message) onMessage(d.message);
    setTo((s) => [...s, { ...e, versionId: d.versionId }]);
  }

  // Keyboard: ⌘Z / ⌘⇧Z (not while typing inside an editable text).
  useEffect(() => {
    if (!enabled) return;
    const onKey = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement | null;
      if (t?.isContentEditable || t?.tagName === "INPUT" || t?.tagName === "TEXTAREA") return;
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "z") { ev.preventDefault(); void step(ev.shiftKey ? "redo" : "undo"); }
      if (ev.key === "Escape") onSelect(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => { if (err) { const t = setTimeout(() => setErr(null), 4000); return () => clearTimeout(t); } }, [err]);

  const ctx: EditCtx = useMemo(() => ({ editable: enabled, selected, select: (p) => onSelect(p), commit }), [enabled, selected, onSelect, commit]);

  // Clicks on photo slots and sections (attributes set by the layouts).
  function onClickCapture(e: React.MouseEvent) {
    if (!enabled) return;
    const el = e.target as HTMLElement;
    if (el.closest("[contenteditable=true]")) return;
    const photo = el.closest<HTMLElement>("[data-edit-photo]");
    if (photo) { e.preventDefault(); e.stopPropagation(); onSelect(`photo:${photo.dataset.editPhoto}`); onPhotoSlot(photo.dataset.editPhoto ?? "photo"); return; }
    const section = el.closest<HTMLElement>("[data-edit-section]");
    if (section) { onSelect(`section:${section.dataset.editSection}`); return; }
    if (!el.closest("[data-edit-path]")) onSelect(null);
  }

  const sec = doc.kind === "website" ? sectionLayout(doc.design.sections) : null;
  const secId = selected?.startsWith("section:") ? (selected.slice(8) as SectionId) : null;
  const moveSection = (d: -1 | 1 | 0) => {
    if (!sec || !secId) return;
    const order = [...sec.order];
    const hidden = new Set(sec.hidden);
    const i = order.indexOf(secId);
    if (d === 0) { if (hidden.has(secId)) hidden.delete(secId); else hidden.add(secId); }
    else if (i >= 0 && order[i + d]) [order[i], order[i + d]] = [order[i + d], order[i]];
    const name = SECTIONS[secId] ?? secId;
    void patchDoc({ sections: { order, hidden: [...hidden] } }, d === 0 ? `${hidden.has(secId) ? "Hid" : "Showed"} the ${name} section` : `Moved the ${name} section ${d < 0 ? "up" : "down"}`);
  };
  // ── Drag-to-reorder sections directly on the preview (desktop; touch uses the Sections list) ──
  const wrap = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ from: SectionId; over: SectionId | null; after: boolean } | null>(null);
  useEffect(() => {
    const root = wrap.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-edit-section]");
    els.forEach((el) => {
      if (enabled && sec) { el.draggable = true; el.classList.add("fv-draggable"); }
      else { el.draggable = false; el.classList.remove("fv-draggable"); }
    });
  });
  useEffect(() => {
    const root = wrap.current;
    if (!root) return;
    root.querySelectorAll(".fv-drop-before,.fv-drop-after").forEach((el) => el.classList.remove("fv-drop-before", "fv-drop-after"));
    if (drag?.over) root.querySelector(`[data-edit-section="${drag.over}"]`)?.classList.add(drag.after ? "fv-drop-after" : "fv-drop-before");
  }, [drag]);
  const sectionAt = (t: EventTarget | null) => (t as HTMLElement | null)?.closest<HTMLElement>("[data-edit-section]") ?? null;
  const dnd = enabled && sec ? {
    onDragStart: (e: React.DragEvent) => {
      if ((e.target as HTMLElement).isContentEditable) return;
      const el = sectionAt(e.target);
      if (!el) return;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", el.dataset.editSection!);
      setDrag({ from: el.dataset.editSection as SectionId, over: null, after: false });
    },
    onDragOver: (e: React.DragEvent) => {
      if (!drag) return;
      const el = sectionAt(e.target);
      if (!el) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const over = el.dataset.editSection as SectionId;
      const after = e.clientY > r.top + r.height / 2;
      if (drag.over !== over || drag.after !== after) setDrag({ ...drag, over, after });
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (!drag?.over || !sec || drag.over === drag.from) return setDrag(null);
      const order = sec.order.filter((x) => x !== drag.from);
      const i = order.indexOf(drag.over) + (drag.after ? 1 : 0);
      order.splice(i, 0, drag.from);
      const name = SECTIONS[drag.from] ?? drag.from;
      setDrag(null);
      void patchDoc({ sections: { order, hidden: [...sec.hidden] } }, `Moved the ${name} section`);
    },
    onDragEnd: () => setDrag(null),
  } : {};

  // Collaborators' selections glow on the preview in their colour.
  useEffect(() => {
    const root = wrap.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-peer]").forEach((el) => { el.removeAttribute("data-peer"); el.style.removeProperty("--peer"); });
    for (const p of peers) {
      if (!p.path) continue;
      const sel = p.path.startsWith("section:") ? `[data-edit-section="${p.path.slice(8)}"]` : p.path.startsWith("photo:") ? `[data-edit-photo="${p.path.slice(6)}"]` : `[data-edit-path="${p.path}"]`;
      const el = root.querySelector<HTMLElement>(sel);
      if (el) { el.setAttribute("data-peer", p.name); el.style.setProperty("--peer", p.color); }
    }
  });

  const scale = doc.design.scale ?? 1;
  const accent = doc.design.palette?.accent;

  async function openHistory() {
    if (history) return setHistory(null);
    const r = await fetch(`/api/weddings/${weddingId}/documents/${doc.id}/history`);
    if (r.ok) setHistory((await r.json()).versions);
  }
  async function restore(id: string) {
    const r = await fetch(`/api/weddings/${weddingId}/documents/${doc.id}/history`, j("POST", { versionId: id, log: "✎ Restored an earlier version" }));
    const d = await r.json();
    if (!r.ok) return setErr(d.error);
    onDoc(d.doc);
    if (d.message) onMessage(d.message);
    setUndo((u) => [...u, { kind: "doc", docId: doc.id, versionId: d.versionId, label: "Restored an earlier version" }]);
    setHistory(null);
  }

  return (
    <EditContext.Provider value={ctx}>
      {enabled && (
        <div className="relative z-30 mx-4 mt-2 md:mx-5">
          <div className="glass scroll-soft flex items-center gap-1.5 overflow-x-auto rounded-full p-1.5 text-[12.5px]">
            <button onClick={() => step("undo")} disabled={!undo.length} className="rounded-full px-2.5 py-1 disabled:opacity-30" title="Undo (⌘Z)">↶</button>
            <button onClick={() => step("redo")} disabled={!redo.length} className="rounded-full px-2.5 py-1 disabled:opacity-30" title="Redo (⌘⇧Z)">↷</button>
            <button onClick={openHistory} className={`rounded-full px-2.5 py-1 ${history ? "bg-wine text-white" : ""}`} title="Version history">History</button>
            <span className="mx-1 h-4 w-px shrink-0 bg-line" />
            {selected ? (
              <>
                <span className="shrink-0 rounded-full bg-blush/70 px-2.5 py-1 text-wine">✎ {pathLabel(selected)}</span>
                <button onClick={() => onAsk(selected)} className="shrink-0 rounded-full bg-gradient-to-r from-rose to-[#c5a06a] px-3 py-1 text-white" title="Ask the designer about this element">Ask about this ✦</button>
                {secId && sec && (
                  <>
                    <button onClick={() => moveSection(-1)} disabled={sec.order.indexOf(secId) <= 0} className="rounded-full px-2 py-1 disabled:opacity-30">↑</button>
                    <button onClick={() => moveSection(1)} disabled={sec.order.indexOf(secId) >= sec.order.length - 1} className="rounded-full px-2 py-1 disabled:opacity-30">↓</button>
                    <button onClick={() => moveSection(0)} className="rounded-full px-2.5 py-1 text-rose">{sec.hidden.has(secId) ? "Show" : "Hide"}</button>
                  </>
                )}
              </>
            ) : (
              <span className="shrink-0 px-1.5 italic text-muted">Click any text to edit · click a photo to swap it</span>
            )}
            <span className="mx-1 h-4 w-px shrink-0 bg-line" />
            <select value={doc.design.fonts ?? ""} onChange={(e) => patchDoc({ fonts: e.target.value || null }, `Changed fonts to ${e.target.value ? FONT_PAIRS[e.target.value as FontPairId].name : "the template default"}`)} className="shrink-0 rounded-full bg-white/70 px-2 py-1 outline-none" title="Font pairing">
              <option value="">Template fonts</option>
              {Object.entries(FONT_PAIRS).map(([k, f]) => <option key={k} value={k}>{f.name}</option>)}
            </select>
            <button onClick={() => patchDoc({ scale: Math.max(scale - 0.1, 0.7) }, "Made the names smaller")} className="shrink-0 rounded-full px-2 py-1" title="Smaller names">A−</button>
            <button onClick={() => patchDoc({ scale: Math.min(scale + 0.1, 1.4) }, "Made the names bigger")} className="shrink-0 rounded-full px-2 py-1 text-[14px]" title="Bigger names">A+</button>
            <button onClick={() => patchDoc({ align: doc.design.align === "left" ? "center" : "left" }, `Aligned text ${doc.design.align === "left" ? "centre" : "left"}`)} className="shrink-0 rounded-full px-2 py-1" title="Alignment">{doc.design.align === "left" ? "≡ left" : "≡ centre"}</button>
            <span className="flex shrink-0 items-center gap-1 pl-1">
              {CURATED_ACCENTS.map((c) => (
                <button key={c} onClick={() => patchDoc({ palette: { accent: c } }, `Changed the accent colour`)} className={`h-5 w-5 rounded-full ring-2 ring-offset-1 ring-offset-white ${accent === c ? "ring-wine" : "ring-transparent"}`} style={{ background: c }} aria-label={`Accent ${c}`} />
              ))}
              {luxury ? (
                <label className="relative h-5 w-5 cursor-pointer overflow-hidden rounded-full ring-1 ring-line" title="Any colour (Luxury)" style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}>
                  <input type="color" value={accent ?? "#c06c78"} onChange={(e) => patchDoc({ palette: { accent: e.target.value } }, "Changed the accent colour")} className="absolute inset-0 opacity-0" />
                </label>
              ) : (
                <span className="pl-1 text-[10.5px] text-muted" title="Any colour comes with the Luxury package">+ more with Luxury</span>
              )}
              {(accent || doc.design.fonts) && <button onClick={() => patchDoc({ palette: null, fonts: null }, "Reset fonts and colours to the template")} className="rounded-full px-2 py-1 text-muted">Reset</button>}
            </span>
          </div>
          <AnimatePresence>
            {history && (
              <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass scroll-soft absolute left-0 top-full z-40 mt-2 max-h-72 w-72 overflow-y-auto rounded-2xl p-2 text-[13px]">
                {history.map((v) => (
                  <li key={v.id}><button onClick={() => restore(v.id)} className="w-full rounded-xl px-3 py-2 text-left hover:bg-white"><span className="block truncate">{v.label?.replace(/^✎\s*/, "") || "Change"}</span><span className="text-[11px] text-muted">before · {new Date(v.created_at).toLocaleString()}</span></button></li>
                ))}
                {!history.length && <li className="px-3 py-2 text-muted">No earlier versions yet.</li>}
              </motion.ul>
            )}
          </AnimatePresence>
          <AnimatePresence>{err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 rounded-full bg-wine px-4 py-1.5 text-center text-[12.5px] text-white">{err}</motion.p>}</AnimatePresence>
        </div>
      )}
      <div ref={wrap} onClickCapture={onClickCapture} {...dnd} className="contents">{children}</div>
    </EditContext.Provider>
  );
}
