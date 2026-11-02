"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Workspace } from "@/lib/workspace";

// One email, many workspaces: personal weddings, an agency, a friend's wedding you help with…
export function WorkspaceSwitcher({ current, list }: { current: Workspace; list: Workspace[] }) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"agency" | "personal">("agency");

  async function go(id: string) {
    await fetch("/api/workspaces", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    window.location.assign("/studio");
  }
  async function create() {
    const r = await fetch("/api/workspaces", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, kind }) });
    if (r.ok) window.location.assign("/studio");
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="glass flex max-w-[60vw] items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-sm transition hover:shadow-md">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white ${current.kind === "agency" ? "bg-gradient-to-br from-[#c5a06a] to-[#7a5a2c]" : "bg-gradient-to-br from-[#e58a98] to-[#5a1a2e]"}`}>{current.name[0]?.toUpperCase()}</span>
        <span className="truncate">{current.name}</span>
        <span className="text-muted">▾</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} className="absolute left-0 top-12 z-50 w-[300px] overflow-hidden rounded-3xl border border-white/70 bg-paper/95 p-2 shadow-[0_30px_60px_-30px_rgba(74,20,36,.5)] backdrop-blur-xl">
            <p className="eyebrow px-3 pb-1 pt-2 text-muted">Your workspaces</p>
            {list.map((w) => (
              <button key={w.id} onClick={() => go(w.id)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition hover:bg-blush/50 ${w.id === current.id ? "bg-blush/60" : ""}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-white ${w.kind === "agency" ? "bg-gradient-to-br from-[#c5a06a] to-[#7a5a2c]" : "bg-gradient-to-br from-[#e58a98] to-[#5a1a2e]"}`}>{w.name[0]?.toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{w.name}</span>
                  <span className="block text-[11px] capitalize text-muted">{w.kind} · {w.role}</span>
                </span>
                {w.id === current.id && <span className="text-rose">♥</span>}
              </button>
            ))}
            <div className="mt-1 border-t border-line p-2">
              {creating ? (
                <div className="space-y-2">
                  <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Goa Dream Weddings" className="field !py-2.5 !text-sm" />
                  <div className="grid grid-cols-2 gap-1 rounded-full bg-ivory p-1 text-xs">
                    {(["agency", "personal"] as const).map((k) => (
                      <button key={k} onClick={() => setKind(k)} className={`rounded-full py-1.5 capitalize ${kind === k ? "bg-wine text-white" : "text-muted"}`}>{k === "agency" ? "Agency / planner" : "Personal"}</button>
                    ))}
                  </div>
                  <button disabled={!name.trim()} onClick={create} className="btn btn-dark w-full !py-2.5 disabled:opacity-40">Create workspace</button>
                </div>
              ) : (
                <button onClick={() => setCreating(true)} className="w-full rounded-2xl px-3 py-2.5 text-left text-sm text-wine transition hover:bg-blush/50">+ New workspace (agency or personal)</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
