"use client";
import { useMemo, useState, useTransition } from "react";
import type { TemplateAdmin, Collection } from "@/lib/template-admin";
import { saveTemplatesAction } from "./actions";

type Row = { id: string; name: string; occasion: string; theme: string; tier: string };

export function TemplatesEditor({ list, initial }: { list: Row[]; initial: TemplateAdmin }) {
  const [a, setA] = useState<TemplateAdmin>(initial);
  const [filter, setFilter] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(a) !== JSON.stringify(initial);

  const ordered = useMemo(() => {
    const rank = (id: string) => { const i = a.order.indexOf(id); return i < 0 ? 1e9 : i; };
    return [...list].map((r, i) => ({ r, i })).sort((x, y) => rank(x.r.id) - rank(y.r.id) || x.i - y.i).map(({ r }) => r);
  }, [list, a.order]);
  const shown = ordered.filter((r) => !filter || `${r.name} ${r.occasion} ${r.id}`.toLowerCase().includes(filter.toLowerCase()));

  const toggle = (key: "featured" | "hidden", id: string) => setA((x) => ({ ...x, [key]: x[key].includes(id) ? x[key].filter((i) => i !== id) : [...x[key], id] }));
  const move = (id: string, d: -1 | 1) => setA((x) => {
    const ids = ordered.map((r) => r.id);
    const i = ids.indexOf(id);
    const j = i + d;
    if (j < 0 || j >= ids.length) return x;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    return { ...x, order: ids };
  });
  const setCol = (i: number, c: Partial<Collection>) => setA((x) => ({ ...x, collections: x.collections.map((cc, k) => (k === i ? { ...cc, ...c } : cc)) }));

  return (
    <div className="mt-8">
      <div className="sticky top-3 z-20 mb-6 flex flex-wrap items-center gap-3 rounded-full bg-paper/90 p-2 shadow-lg backdrop-blur">
        <button disabled={!dirty || pending} onClick={() => start(async () => { const s = await saveTemplatesAction(JSON.stringify(a)); setA(s); setMsg("Saved ♥ live now"); })} className="btn btn-dark !py-2 disabled:opacity-40">{pending ? "Saving…" : "Save"}</button>
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter templates…" className="field !w-56 !rounded-full !py-2 !text-sm" />
        {msg && !dirty && <span className="text-sm text-emerald-700">{msg}</span>}
        {dirty && <span className="text-sm text-amber-700">Unsaved changes</span>}
        <span className="ml-auto pr-3 text-xs text-muted">{list.length} templates · {a.featured.length} featured · {a.hidden.length} hidden</span>
      </div>

      <section className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <p className="display text-2xl">Seasonal collections</p>
          <button onClick={() => setA((x) => ({ ...x, collections: [...x.collections, { id: "", name: "New collection", templateIds: [], active: true }] }))} className="btn btn-ghost !py-2 text-sm">+ Collection</button>
        </div>
        <div className="mt-4 space-y-4">
          {a.collections.map((c, i) => (
            <div key={i} className="rounded-2xl border border-line bg-white/60 p-4">
              <div className="grid gap-2 md:grid-cols-[2fr_3fr_1fr_1fr_auto]">
                <input value={c.name} onChange={(e) => setCol(i, { name: e.target.value })} className="field !py-2 !text-sm" placeholder="Name" />
                <input value={c.blurb ?? ""} onChange={(e) => setCol(i, { blurb: e.target.value })} className="field !py-2 !text-sm" placeholder="One-line description" />
                <input type="date" value={c.starts ?? ""} onChange={(e) => setCol(i, { starts: e.target.value || null })} className="field !py-2 !text-sm" title="Starts" />
                <input type="date" value={c.ends ?? ""} onChange={(e) => setCol(i, { ends: e.target.value || null })} className="field !py-2 !text-sm" title="Ends" />
                <div className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-1"><input type="checkbox" checked={c.active} onChange={(e) => setCol(i, { active: e.target.checked })} />Active</label>
                  <button onClick={() => setA((x) => ({ ...x, collections: x.collections.filter((_, k) => k !== i) }))} className="text-rose">Remove</button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {list.map((t) => {
                  const on = c.templateIds.includes(t.id);
                  return <button key={t.id} onClick={() => setCol(i, { templateIds: on ? c.templateIds.filter((x) => x !== t.id) : [...c.templateIds, t.id] })} className={`rounded-full px-2.5 py-1 text-xs ${on ? "bg-wine text-[#fbeee6]" : "bg-white text-muted"}`}>{t.name}</button>;
                })}
                {!list.length && <span className="text-xs text-muted">The catalog is empty.</span>}
              </div>
            </div>
          ))}
          {!a.collections.length && <p className="text-sm text-muted">No collections yet.</p>}
        </div>
      </section>

      <div className="glass mt-6 overflow-x-auto rounded-[28px]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted"><tr className="border-b border-line">{["Order", "Template", "Occasion", "Tier", "Featured", "Visible"].map((h) => <th key={h} className="eyebrow px-4 py-3 font-normal">{h}</th>)}</tr></thead>
          <tbody>
            {shown.map((t) => {
              const hidden = a.hidden.includes(t.id);
              return (
                <tr key={t.id} className={`border-b border-line/60 ${hidden ? "opacity-50" : ""}`}>
                  <td className="whitespace-nowrap px-4 py-2"><button onClick={() => move(t.id, -1)} className="px-1 text-muted hover:text-ink" aria-label="Up">↑</button><button onClick={() => move(t.id, 1)} className="px-1 text-muted hover:text-ink" aria-label="Down">↓</button></td>
                  <td className="px-4 py-2"><a href={`/templates/${t.id}`} target="_blank" className="display text-lg hover:text-rose">{t.name}</a><span className="block font-mono text-[10px] text-muted">{t.id}</span></td>
                  <td className="px-4 py-2">{t.occasion}</td>
                  <td className="px-4 py-2">{t.tier}</td>
                  <td className="px-4 py-2"><input type="checkbox" checked={a.featured.includes(t.id)} onChange={() => toggle("featured", t.id)} /></td>
                  <td className="px-4 py-2"><input type="checkbox" checked={!hidden} onChange={() => toggle("hidden", t.id)} /></td>
                </tr>
              );
            })}
            {!shown.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">{list.length ? "No matches." : "Templates appear here as the catalog is filled."}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
