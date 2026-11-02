"use client";
import { useEffect, useState } from "react";
import type { Wedding } from "@/lib/db";
import { LiveRsvps } from "./LiveRsvps";

type Props = { wedding: Wedding; published: boolean; onPublish: (v: boolean) => void; onClose: () => void; realtimeUrl: string; capabilities: { email: boolean; domains: boolean } };

export function SendPanel({ wedding, published, onPublish, onClose, realtimeUrl, capabilities }: Props) {
  const [origin, setOrigin] = useState("");
  const [guests, setGuests] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [domain, setDomain] = useState(wedding.custom_domain ?? "");
  const [domainStatus, setDomainStatus] = useState<string | null>(null);
  useEffect(() => setOrigin(window.location.origin), []);
  const url = `${origin}/w/${wedding.slug}`;
  const text = encodeURIComponent(`You're invited to our wedding ✨ ${url}`);

  async function sendInvites() {
    const list = guests.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const email = l.match(/[^\s<>,]+@[^\s<>,]+/)?.[0] ?? "";
      return { name: l.replace(email, "").replace(/[<>,]/g, "").trim() || email.split("@")[0], email };
    }).filter((g) => g.email);
    if (!list.length) return setStatus("Add one guest per line, like: Priya Sharma priya@example.com");
    setStatus("Sending…");
    const res = await fetch(`/api/weddings/${wedding.id}/send`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ guests: list }) });
    const data = await res.json();
    setStatus(res.ok ? data.message : data.error);
    if (res.ok) setGuests("");
  }

  async function connectDomain() {
    setDomainStatus("Connecting…");
    const res = await fetch(`/api/weddings/${wedding.id}/domain`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ domain }) });
    const data = await res.json();
    setDomainStatus(res.ok ? data.message : data.error);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-sm" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="fade h-full w-full max-w-md overflow-y-auto bg-paper p-7 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="display text-3xl">Share your wedding</h2>
          <button onClick={onClose} className="text-2xl text-muted hover:text-ink" aria-label="Close">×</button>
        </div>

        <div className="mt-8 rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{published ? "Your website is live" : "Publish your website"}</p>
              <p className="text-sm text-muted">{published ? "Guests can open it and RSVP." : "Only you can see it until you publish."}</p>
            </div>
            <button onClick={() => onPublish(!published)} className={`btn !px-4 !py-2 ${published ? "btn-ghost" : "btn-dark"}`}>{published ? "Unpublish" : "Publish"}</button>
          </div>
          {published && (
            <>
              <input readOnly value={url} onFocus={(e) => e.target.select()} className="field mt-4 !text-sm" />
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <button onClick={() => navigator.clipboard.writeText(url)} className="btn btn-ghost !px-2 !py-2">Copy link</button>
                <a target="_blank" href={`https://wa.me/?text=${text}`} className="btn btn-ghost !px-2 !py-2">WhatsApp</a>
                <a target="_blank" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent("You're invited ✨")}`} className="btn btn-ghost !px-2 !py-2">Telegram</a>
              </div>
              <a href={`/w/${wedding.slug}/invite`} target="_blank" className="mt-2 block text-center text-sm text-muted underline underline-offset-4">Print or save invitation as PDF</a>
            </>
          )}
        </div>

        {published && (
          <div className="mt-6 rounded-2xl border border-line p-5">
            <p className="font-medium">Email invitations</p>
            <p className="text-sm text-muted">One guest per line — name and email.</p>
            <textarea value={guests} onChange={(e) => setGuests(e.target.value)} rows={5} placeholder={"Priya Sharma priya@example.com\nОльга Иванова olga@example.ru"} className="field mt-3 !text-sm" />
            <button onClick={sendInvites} className="btn btn-dark mt-3 w-full">Send invitations</button>
            {!capabilities.email && <p className="mt-2 text-xs text-muted">Email delivery isn’t configured yet — guests will be saved and sent once it is.</p>}
            {status && <p className="mt-3 text-sm">{status}</p>}
          </div>
        )}

        {published && (
          <div className="mt-6 rounded-2xl border border-line p-5">
            <p className="font-medium">Your own domain</p>
            <p className="text-sm text-muted">e.g. anya-and-rohan.com — we connect it for you.</p>
            <div className="mt-3 flex gap-2">
              <input value={domain} onChange={(e) => setDomain(e.target.value.trim().toLowerCase())} placeholder="yournames.com" className="field !text-sm" />
              <button onClick={connectDomain} disabled={!domain} className="btn btn-ghost !px-4 disabled:opacity-40">Connect</button>
            </div>
            {!capabilities.domains && <p className="mt-2 text-xs text-muted">Custom domains are part of the Heritage plan.</p>}
            {domainStatus && <p className="mt-3 whitespace-pre-line text-sm">{domainStatus}</p>}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-line p-5">
          <p className="font-medium">Replies, live</p>
          <LiveRsvps weddingId={wedding.id} realtimeUrl={realtimeUrl} />
        </div>
      </aside>
    </div>
  );
}
