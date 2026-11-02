"use client";
import { useState } from "react";
import { motion } from "motion/react";
import type { Role, Workspace } from "@/lib/workspace";
import { assetUrl } from "@/lib/upload-client";
import { AGENCY_PLANS, COUPLE_PLANS } from "@/lib/plans";

const ROLE_LABEL: Record<Role, string> = { owner: "Owner", admin: "Admin", designer: "Designer", client: "Client (view & request)", family: "Family (view only)" };
type Props = { ws: Workspace; members: { user_id: string; email: string; role: Role }[]; invites: { email: string; role: Role }[]; logos: { id: string; key: string; name: string }[]; me: string; manage: boolean };

const Card = ({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) => (
  <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="glass rounded-[30px] p-6 md:p-8">
    <h2 className="display text-3xl">{title}</h2>
    {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    <div className="mt-6">{children}</div>
  </motion.section>
);

export function Settings({ ws, members, invites, logos, me, manage }: Props) {
  const [name, setName] = useState(ws.name);
  const [kind, setKind] = useState(ws.kind);
  const [brand, setBrand] = useState(ws.brand ?? {});
  const [saved, setSaved] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("designer");
  const [link, setLink] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [team, setTeam] = useState(members);

  async function save() {
    const r = await fetch(`/api/workspaces/${ws.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, kind, brand }) });
    setSaved(r.ok ? "Saved ♥" : (await r.json()).error);
    setTimeout(() => setSaved(null), 2500);
  }
  async function invite() {
    setMsg(null);
    const r = await fetch(`/api/workspaces/${ws.id}/members`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, role }) });
    const d = await r.json();
    if (!r.ok) return setMsg(d.error);
    setLink(d.link);
    setEmail("");
  }
  async function changeRole(userId: string, r: Role | "remove") {
    const res = await fetch(`/api/workspaces/${ws.id}/members`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId, role: r }) });
    if (res.ok) setTeam((t) => (r === "remove" ? t.filter((m) => m.user_id !== userId) : t.map((m) => (m.user_id === userId ? { ...m, role: r } : m))));
  }

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <Card title="Identity" sub="How this workspace appears to your team.">
        <label className="eyebrow text-muted">Name</label>
        <input disabled={!manage} value={name} onChange={(e) => setName(e.target.value)} className="field mt-2" />
        <p className="eyebrow mt-5 text-muted">Type</p>
        <div className="mt-2 grid grid-cols-2 gap-1 rounded-full bg-white/60 p-1 text-sm">
          {(["personal", "agency"] as const).map((k) => (
            <button disabled={!manage} key={k} onClick={() => setKind(k)} className={`rounded-full py-2 transition ${kind === k ? "bg-wine text-white" : "text-muted"}`}>{k === "agency" ? "Agency / planner" : "Personal"}</button>
          ))}
        </div>
        {manage && <button onClick={save} className="btn btn-dark mt-6">Save changes</button>}
        {saved && <span className="ml-3 text-sm text-rose">{saved}</span>}
      </Card>

      <Card title="Brand kit" sub={kind === "agency" ? "Your agency’s signature on every client’s wedding site." : "Switch to an agency workspace to white-label."}>
        <div className={kind === "agency" ? "" : "pointer-events-none opacity-50"}>
          <label className="eyebrow text-muted">Agency name</label>
          <input disabled={!manage} value={brand.name ?? ""} onChange={(e) => setBrand({ ...brand, name: e.target.value })} placeholder="Goa Dream Weddings" className="field mt-2" />
          <p className="eyebrow mt-5 text-muted">Logo</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {logos.map((l) => (
              <button disabled={!manage} key={l.id} onClick={() => setBrand({ ...brand, logoKey: l.key })} className={`h-16 w-16 overflow-hidden rounded-2xl bg-white p-2 ring-2 transition ${brand.logoKey === l.key ? "ring-wine" : "ring-transparent"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl(l.key)} alt={l.name} className="h-full w-full object-contain" />
              </button>
            ))}
            {!logos.length && <p className="text-sm text-muted">Upload a logo in Library → Logos.</p>}
          </div>
          <p className="eyebrow mt-5 text-muted">Signature on guest sites</p>
          <div className="mt-2 grid gap-1 rounded-3xl bg-white/60 p-1 text-sm sm:grid-cols-3">
            {([["agency", "Designed by us"], ["show", "Ours + yours"], ["hidden", "No signature"]] as const).map(([k, l]) => (
              <button disabled={!manage} key={k} onClick={() => setBrand({ ...brand, credit: k })} className={`rounded-full px-3 py-2 transition ${(brand.credit ?? "agency") === k ? "bg-wine text-white" : "text-muted"}`}>{l}</button>
            ))}
          </div>
          {manage && <button onClick={save} className="btn btn-dark mt-6">Save brand kit</button>}
        </div>
      </Card>

      <Card title="Team & clients" sub="One email can belong to many workspaces. Clients and family see and comment, but can’t edit.">
        <ul className="divide-y divide-line">
          {team.map((m) => (
            <li key={m.user_id} className="flex items-center gap-3 py-3 text-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e58a98] to-[#5a1a2e] text-xs text-white">{m.email[0]?.toUpperCase()}</span>
              <span className="min-w-0 flex-1 truncate">{m.email}{m.user_id === me && <span className="text-muted"> (you)</span>}</span>
              {manage && m.role !== "owner" && m.user_id !== me ? (
                <select value={m.role} onChange={(e) => changeRole(m.user_id, e.target.value as Role | "remove")} className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs">
                  {(Object.keys(ROLE_LABEL) as Role[]).filter((r) => r !== "owner").map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                  <option value="remove">Remove…</option>
                </select>
              ) : (
                <span className="rounded-full bg-blush px-3 py-1 text-xs text-wine">{ROLE_LABEL[m.role]}</span>
              )}
            </li>
          ))}
          {invites.map((i) => (
            <li key={i.email + i.role} className="flex items-center gap-3 py-3 text-sm text-muted">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-rose/40">✉</span>
              <span className="flex-1 truncate">{i.email}</span>
              <span className="text-xs italic">invited · {ROLE_LABEL[i.role]}</span>
            </li>
          ))}
        </ul>
        {manage && (
          <div className="mt-5 rounded-3xl bg-white/50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="field !py-2.5" />
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="field !w-auto !py-2.5">
                {(Object.keys(ROLE_LABEL) as Role[]).filter((r) => r !== "owner").map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
              <button onClick={invite} disabled={!email} className="btn btn-dark !py-2.5 disabled:opacity-40">Invite</button>
            </div>
            {msg && <p className="mt-2 text-sm text-rose">{msg}</p>}
            {link && (
              <div className="mt-3 text-sm">
                <p className="text-muted">Share this private link with them:</p>
                <div className="mt-1 flex gap-2"><input readOnly value={link} onFocus={(e) => e.target.select()} className="field !py-2 !text-xs" /><button onClick={() => navigator.clipboard.writeText(link)} className="btn btn-ghost !px-4 !py-2">Copy</button></div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card title="Plans" sub="Billing opens soon — everything is free while we’re in early access.">
        <p className="eyebrow mb-3 text-muted">{kind === "agency" ? "For agencies & planners" : "For couples"}</p>
        <div className="grid gap-3">
          {(kind === "agency" ? AGENCY_PLANS : COUPLE_PLANS).map((p, i) => (
            <div key={p.id} className={`rounded-3xl border p-5 ${i === 1 ? "border-gold bg-white/70" : "border-line bg-white/40"}`}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="display text-2xl">{p.name}</p>
                <p className="text-right"><span className="display text-2xl">{p.inr}</span>{p.usd && <span className="ml-2 text-sm text-muted">{p.usd}</span>}</p>
              </div>
              {"note" in p && p.note && <p className="text-right text-[11px] text-muted">{p.note}</p>}
              <ul className="mt-3 grid gap-1.5 text-sm">{p.points.map((x) => <li key={x} className="flex gap-2"><span className="text-gold">✦</span>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
