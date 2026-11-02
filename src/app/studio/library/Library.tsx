"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MOTIFS } from "@/lib/motifs";
import { THEMES } from "@/lib/themes";
import { Motif } from "@/components/Motif";
import { assetUrl, uploadAsset, type Asset } from "@/lib/upload-client";

const TABS = [
  { id: "photo", label: "Photographs" },
  { id: "logo", label: "Logos & monograms" },
  { id: "motifs", label: "Motif collection" },
] as const;

export function Library({ workspaceId, initial, editable }: { workspaceId: string; initial: Asset[]; editable: boolean }) {
  const [assets, setAssets] = useState(initial);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("photo");
  const [busy, setBusy] = useState(0);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [themeIdx, setThemeIdx] = useState(0);

  async function add(files: FileList | File[]) {
    setErr(null);
    for (const f of Array.from(files)) {
      setBusy((n) => n + 1);
      try {
        const a = await uploadAsset(f, workspaceId, { kind: tab === "logo" ? "logo" : "photo" });
        setAssets((x) => [a, ...x]);
      } catch (e) {
        setErr((e as Error).message);
      } finally {
        setBusy((n) => n - 1);
      }
    }
  }
  async function remove(id: string) {
    if (!confirm("Remove this from the library?")) return;
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
    setAssets((x) => x.filter((a) => a.id !== id));
  }

  const shown = assets.filter((a) => (tab === "logo" ? a.kind === "logo" : a.kind !== "logo"));

  return (
    <div className="mt-10">
      <div className="glass inline-flex flex-wrap gap-1 rounded-full p-1 text-sm">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="relative rounded-full px-4 py-2">
            {tab === t.id && <motion.span layoutId="libtab" className="absolute inset-0 rounded-full bg-wine" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className={`relative ${tab === t.id ? "text-[#fbeee6]" : "text-muted"}`}>{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "motifs" ? (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
            Preview in
            {THEMES.map((t, i) => (
              <button key={t.id} onClick={() => setThemeIdx(i)} title={t.name} className={`h-6 w-6 rounded-full ring-2 ring-offset-2 ring-offset-ivory ${i === themeIdx ? "ring-wine" : "ring-transparent"}`} style={{ background: `conic-gradient(${t.bg}, ${t.accent}, ${t.gold}, ${t.bg})` }} />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {MOTIFS.map((m, i) => (
              <motion.div key={m.id + themeIdx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-3xl p-5" style={{ background: THEMES[themeIdx].surface, border: `1px solid ${THEMES[themeIdx].gold}44` }}>
                <Motif theme={THEMES[themeIdx]} motif={m.id} className="draw h-16 w-full" />
                <p className="display mt-3 text-lg" style={{ color: THEMES[themeIdx].ink }}>{m.name}</p>
                <p className="text-[11px] uppercase tracking-widest" style={{ color: THEMES[themeIdx].muted }}>{m.tags.join(" · ")}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">Ask the designer in any wedding: “use the lotus motif” or “add khokhloma berries to the menu”.</p>
        </>
      ) : (
        <>
          {editable && (
            <label
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
              className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[28px] border-2 border-dashed px-6 py-10 text-center transition ${drag ? "border-rose bg-blush/50" : "border-rose/30 bg-white/40 hover:border-rose/60"}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush text-2xl text-rose">{busy ? <span className="heartbeat">♥</span> : "+"}</span>
              <span className="display text-2xl">{busy ? `Uploading ${busy}…` : tab === "logo" ? "Drop your logo or monogram" : "Drop your photographs here"}</span>
              <span className="text-sm text-muted">or tap to choose · JPG, PNG, WebP, SVG · up to 15 MB</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && add(e.target.files)} />
            </label>
          )}
          {err && <p className="mt-3 text-sm text-rose">{err}</p>}
          <div className="mt-6 columns-2 gap-4 sm:columns-3 lg:columns-4">
            <AnimatePresence>
              {shown.map((a) => (
                <motion.figure key={a.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-[0_20px_40px_-30px_rgba(74,20,36,.6)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl(a.key)} alt={a.name ?? ""} loading="lazy" className={`w-full ${a.kind === "logo" ? "bg-ivory p-6" : ""}`} />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    <span className="truncate">{a.name}</span>
                    {editable && <button onClick={() => remove(a.id)} className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur hover:bg-white/40">Remove</button>}
                  </figcaption>
                </motion.figure>
              ))}
            </AnimatePresence>
          </div>
          {!shown.length && <p className="mt-10 text-center font-display text-xl italic text-muted">Nothing here yet.</p>}
        </>
      )}
    </div>
  );
}
