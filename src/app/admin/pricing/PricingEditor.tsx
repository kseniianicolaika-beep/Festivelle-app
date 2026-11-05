"use client";
import { useState, useTransition } from "react";
import type { Pricing } from "@/lib/pricing";
import { savePricingAction } from "../actions";

type J = unknown;
const label = (k: string) => k.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
const set = (obj: J, path: (string | number)[], v: J): J => {
  if (!path.length) return v;
  const [h, ...rest] = path;
  const c = (Array.isArray(obj) ? [...obj] : { ...(obj as object) }) as Record<string | number, J>;
  c[h] = set(c[h], rest, v);
  return c;
};

// A generic, schema-following editor: numbers → number inputs, strings → text, string lists → one-per-line.
function Node({ value, path, onChange, depth }: { value: J; path: (string | number)[]; onChange: (p: (string | number)[], v: J) => void; depth: number }) {
  if (typeof value === "number") return <input type="number" step="any" value={value} onChange={(e) => onChange(path, Number(e.target.value))} className="field !w-28 !rounded-xl !px-3 !py-1.5 !text-sm" />;
  if (typeof value === "boolean") return <input type="checkbox" checked={value} onChange={(e) => onChange(path, e.target.checked)} />;
  if (typeof value === "string") return <input value={value} onChange={(e) => onChange(path, e.target.value)} className="field !rounded-xl !px-3 !py-1.5 !text-sm" />;
  if (Array.isArray(value) && value.every((x) => typeof x === "string"))
    return <textarea rows={Math.max(2, value.length)} value={value.join("\n")} onChange={(e) => onChange(path, e.target.value.split("\n"))} className="field !rounded-xl !px-3 !py-1.5 !text-sm" />;
  const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v] as const) : Object.entries(value as object);
  const money = !Array.isArray(value) && entries.length === 3 && entries.every(([k]) => ["USD", "INR", "RUB"].includes(k));
  if (money)
    return (
      <div className="flex flex-wrap gap-2">
        {entries.map(([k, v]) => <label key={k} className="flex items-center gap-1 text-xs text-muted">{k}<Node value={v} path={[...path, k]} onChange={onChange} depth={depth + 1} /></label>)}
      </div>
    );
  return (
    <div className={depth ? "space-y-3 border-l border-line pl-4" : "space-y-6"}>
      {entries.map(([k, v]) => (
        <div key={k} className={typeof v === "object" && v && !Array.isArray(v) && depth === 0 ? "glass rounded-3xl p-5" : ""}>
          <p className={depth === 0 ? "display mb-3 text-2xl" : "mb-1 text-xs font-medium uppercase tracking-wider text-muted"}>{Array.isArray(value) ? `#${Number(k) + 1}` : label(k)}</p>
          <Node value={v} path={[...path, Array.isArray(value) ? Number(k) : k]} onChange={onChange} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

export function PricingEditor({ initial, defaults }: { initial: Pricing; defaults: Pricing }) {
  const [p, setP] = useState<J>(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(p) !== JSON.stringify(initial);
  return (
    <div className="mt-8">
      <div className="sticky top-3 z-20 mb-6 flex items-center gap-3 rounded-full bg-paper/90 p-2 shadow-lg backdrop-blur">
        <button disabled={!dirty || pending} onClick={() => start(async () => { await savePricingAction(JSON.stringify(p)); setMsg("Saved ♥ live now"); })} className="btn btn-dark !py-2 disabled:opacity-40">{pending ? "Saving…" : "Save pricing"}</button>
        <button onClick={() => { if (confirm("Reset every price to the defaults? (Not saved until you press Save.)")) setP(defaults); }} className="btn btn-ghost !py-2">Reset to defaults</button>
        {msg && !dirty && <span className="text-sm text-emerald-700">{msg}</span>}
        {dirty && <span className="text-sm text-amber-700">Unsaved changes</span>}
      </div>
      <Node value={p} path={[]} depth={0} onChange={(path, v) => { setMsg(null); setP((x: J) => set(x, path, v)); }} />
    </div>
  );
}
