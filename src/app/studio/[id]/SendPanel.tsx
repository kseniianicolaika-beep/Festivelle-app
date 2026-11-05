"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Wedding } from "@/lib/db";
import type { Pricing, Tier } from "@/lib/pricing";
import { priceGroup, displayNames } from "@/lib/occasions";
import { Checkout, guessCurrency, money } from "@/components/Checkout";
import { LiveRsvps } from "./LiveRsvps";

const TIERS: Tier[] = ["basic", "premium", "luxury"];
const rank = (t?: string | null) => TIERS.indexOf(t as Tier);

// Packages, live link, hosting window and extensions.
function Publishing({ wedding, published, onPublish, origin }: { wedding: Wedding; published: boolean; onPublish: (v: boolean) => void; origin: string }) {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [currency, setCurrency] = useState<"USD" | "INR" | "RUB">(() => guessCurrency());
  const [buy, setBuy] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/pricing").then((r) => r.json()).then((j) => setPricing(j.pricing));
  }, []);
  const group = priceGroup(wedding.profile);
  const pk = pricing?.packages[group];
  const expires = wedding.expires_at ? new Date(wedding.expires_at) : null;
  const expired = !!expires && expires < new Date();
  const live = wedding.subdomain && process.env.NEXT_PUBLIC_ROOT_DOMAIN ? `https://${wedding.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : `${origin}/w/${wedding.slug}`;

  return (
    <div className="mt-8 rounded-2xl border border-line p-5">
      {!wedding.tier ? (
        <>
          <p className="font-medium">Make it yours to share</p>
          <p className="text-sm text-muted">Designing is free forever. Choose a package to get your own link{wedding.subdomain ? "" : " like anna-mark.festivelle.com"}.</p>
        </>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">{expired ? "Hosting has ended" : published ? "Your site is live" : "Ready to go live"}</p>
            <p className="text-sm text-muted">{pk?.[wedding.tier].name ?? wedding.tier} package{expires ? ` · ${expired ? "ended" : "online until"} ${expires.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}` : ""}</p>
          </div>
          {!expired && <button onClick={() => onPublish(!published)} className={`btn !px-4 !py-2 ${published ? "btn-ghost" : "btn-dark"}`}>{published ? "Unpublish" : "Publish"}</button>}
        </div>
      )}

      {published && !expired && (
        <input readOnly value={live} onFocus={(e) => e.target.select()} className="field mt-4 !text-sm" />
      )}

      {pk && rank(wedding.tier) < 2 && (
        <div className="mt-4 grid gap-2">
          {TIERS.filter((t) => rank(t) > rank(wedding.tier)).map((t, i) => (
            <motion.button key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} onClick={() => setBuy(`site_${t}`)}
              className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${t === "premium" ? "border-rose bg-white" : "border-line bg-white/60"}`}>
              <div className="flex items-baseline justify-between">
                <span className="display text-2xl">{pk[t].name}{t === "premium" && <span className="ml-2 align-middle text-[10px] uppercase tracking-widest text-rose">most loved</span>}</span>
                <span className="display text-2xl">{money(pk[t].price[currency], currency)}</span>
              </div>
              <ul className="mt-2 space-y-0.5 text-xs text-muted">{pk[t].features.map((f) => <li key={f}>♡ {f}</li>)}</ul>
            </motion.button>
          ))}
        </div>
      )}

      {wedding.tier && pricing && (
        <div className="mt-5">
          <p className="text-sm font-medium">{expired ? "Bring it back" : "Keep it online longer"}</p>
          <p className="text-xs text-muted">One-time, never auto-renews.</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {pricing.hosting.extensions.map((e) => (
              <button key={e.id} onClick={() => setBuy(e.id)} className="rounded-xl border border-line bg-white/60 px-3 py-2 text-left text-sm transition hover:border-rose">
                <span className="block">{e.label}</span><span className="text-muted">{money(e.price[currency], currency)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>{buy && <Checkout product={buy} weddingId={wedding.id} currency={currency} onClose={() => setBuy(null)} />}</AnimatePresence>
    </div>
  );
}

type Props = { wedding: Wedding; published: boolean; onPublish: (v: boolean) => void; onClose: () => void; realtimeUrl: string; capabilities: { email: boolean; domains: boolean } };

export function SendPanel({ wedding, published, onPublish, onClose, realtimeUrl, capabilities }: Props) {
  const [origin] = useState(() => (typeof window === "undefined" ? "" : window.location.origin));
  const [guests, setGuests] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [domain, setDomain] = useState(wedding.custom_domain ?? "");
  const [domainStatus, setDomainStatus] = useState<string | null>(null);
  const url = wedding.subdomain && process.env.NEXT_PUBLIC_ROOT_DOMAIN ? `https://${wedding.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : `${origin}/w/${wedding.slug}`;
  const text = encodeURIComponent(`You're invited — ${displayNames(wedding.profile)} ✨ ${url}`);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end bg-wine/25 backdrop-blur-md" onClick={onClose}>
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 32 }} onClick={(e) => e.stopPropagation()} className="scroll-soft h-full w-full max-w-md overflow-y-auto bg-paper/95 p-7 shadow-[-30px_0_80px_-30px_rgba(74,20,36,.5)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h2 className="display text-[2.2rem]">Share your <em className="text-rose">joy</em></h2>
          <button onClick={onClose} className="text-2xl text-muted hover:text-ink" aria-label="Close">×</button>
        </div>

        <Publishing wedding={wedding} published={published} onPublish={onPublish} origin={origin} />
        <div className="mt-4">
          {published && (
            <>
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

        {published && wedding.tier === "luxury" && (
          <div className="mt-6 rounded-2xl border border-line p-5">
            <p className="font-medium">Your own domain</p>
            <p className="text-sm text-muted">e.g. anya-and-rohan.com — we connect it for you.</p>
            <div className="mt-3 flex gap-2">
              <input value={domain} onChange={(e) => setDomain(e.target.value.trim().toLowerCase())} placeholder="yournames.com" className="field !text-sm" />
              <button onClick={connectDomain} disabled={!domain} className="btn btn-ghost !px-4 disabled:opacity-40">Connect</button>
            </div>
            {(!capabilities.domains || wedding.tier !== "luxury") && <p className="mt-2 text-xs text-muted">Your own domain is included with the top package.</p>}
            {domainStatus && <p className="mt-3 whitespace-pre-line text-sm">{domainStatus}</p>}
          </div>
        )}

        <a href={`/studio/${wedding.id}/guests`} className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-white/60 p-5 transition hover:border-rose">
          <span><span className="block font-medium">Guest list & RSVPs</span><span className="text-sm text-muted">Households, per-event invites, meals, personal WhatsApp/Telegram links, reminders, CSV, guest photos</span></span>
          <span className="text-rose">→</span>
        </a>

        <div className="mt-6 rounded-2xl border border-line p-5">
          <p className="font-medium">Replies, live</p>
          <LiveRsvps weddingId={wedding.id} realtimeUrl={realtimeUrl} />
        </div>
      </motion.aside>
    </motion.div>
  );
}
