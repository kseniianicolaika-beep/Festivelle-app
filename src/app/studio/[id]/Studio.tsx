"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Wedding } from "@/lib/db";
import type { Profile } from "@/lib/profile";
import { coupleNames } from "@/lib/profile";
import { THEMES, themeById } from "@/lib/themes";
import { InvitationCard } from "@/components/InvitationCard";
import { WeddingSite } from "@/components/WeddingSite";
import { BRAND } from "@/lib/brand";
import { SendPanel } from "./SendPanel";

export type Msg = { id: string; role: "user" | "assistant"; content: string; chips: string[] };
type Tab = "invite" | "save" | "site";

export function Studio({ wedding, initialMessages, realtimeUrl, capabilities }: { wedding: Wedding; initialMessages: Msg[]; realtimeUrl: string; capabilities: { email: boolean; domains: boolean } }) {
  const [messages, setMessages] = useState(initialMessages);
  const [profile, setProfile] = useState<Profile>(wedding.profile);
  const [themeId, setThemeId] = useState(wedding.theme);
  const [published, setPublished] = useState(wedding.published);
  const [tab, setTab] = useState<Tab>("invite");
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [panel, setPanel] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const theme = themeById(themeId);
  const heroUrl = profile.heroKey ? `/api/media?key=${encodeURIComponent(profile.heroKey)}` : null;
  const last = messages[messages.length - 1];
  const multiSelect = last?.role === "assistant" && /Tap any that apply/.test(last.content);
  const [a, b] = coupleNames(profile);

  useEffect(() => scroller.current?.scrollTo({ top: 1e9, behavior: "smooth" }), [messages, thinking]);

  async function send(text: string) {
    if (!text.trim() || thinking) return;
    setInput("");
    setSelected([]);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text, chips: [] }]);
    setThinking(true);
    try {
      const res = await fetch(`/api/weddings/${wedding.id}/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data.profile);
      setThemeId(data.theme);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: data.reply, chips: data.chips }]);
      if (/Publish & send/.test(text)) setPanel(true);
      if (data.step >= 6 && tab === "invite" && data.step === 9) setTab("site");
    } catch (e) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: `Sorry — ${(e as Error).message || "something went wrong"}. Please try again.`, chips: [] }]);
    } finally {
      setThinking(false);
    }
  }

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/weddings/${wedding.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    return res.ok;
  }

  async function upload(file: File) {
    const res = await fetch(`/api/weddings/${wedding.id}/upload`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contentType: file.type }) });
    const { url, key, error } = await res.json();
    if (error) return alert(error);
    const put = await fetch(url, { method: "PUT", headers: { "content-type": file.type }, body: file });
    if (!put.ok) return alert("Upload failed");
    await patch({ heroKey: key });
    setProfile((p) => ({ ...p, heroKey: key }));
    setTab("site");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "What a photograph. It now opens your wedding website.", chips: [] }]);
  }

  const preview = useMemo(
    () =>
      tab === "site" ? (
        <div className="mx-auto w-full max-w-[720px] overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_40px_80px_-50px_rgba(40,20,10,.5)]">
          <div className="flex items-center gap-2 border-b border-line bg-paper px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="ml-3 truncate text-xs text-muted">{wedding.custom_domain ?? `…/w/${wedding.slug}`}</span>
          </div>
          <div className="max-h-[70dvh] overflow-y-auto">
            <WeddingSite profile={profile} theme={theme} heroUrl={heroUrl} compact>
              <div className="rounded-2xl border border-[var(--t-gold)]/50 p-6 text-center text-sm text-[var(--t-muted)]">RSVP form appears here for guests</div>
            </WeddingSite>
          </div>
        </div>
      ) : (
        <InvitationCard profile={profile} theme={theme} variant={tab} />
      ),
    [tab, profile, theme, heroUrl, wedding.custom_domain, wedding.slug],
  );

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-paper/80 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/studio" className="display text-xl">{BRAND.name}</Link>
          <span className="hidden truncate text-sm text-muted sm:block">{profile.partner1 ? `${a} & ${b}` : "New wedding"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMobilePreview((v) => !v)} className="btn btn-ghost !px-4 !py-2 md:hidden">{mobilePreview ? "Chat" : "Preview"}</button>
          <button onClick={() => setPanel(true)} className="btn btn-dark !px-5 !py-2">{published ? "Send & share" : "Publish"}</button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Conversation */}
        <section className={`${mobilePreview ? "hidden" : "flex"} w-full flex-col border-r border-line bg-paper md:flex md:w-[420px] lg:w-[460px]`}>
          <div ref={scroller} className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
            {messages.map((m) => (
              <div key={m.id} className={`fade flex ${m.role === "user" ? "justify-end" : ""}`}>
                <div className={m.role === "user" ? "max-w-[80%] rounded-3xl rounded-br-md bg-ink px-4 py-2.5 text-[15px] text-paper" : "max-w-[92%] whitespace-pre-line text-[15px] leading-relaxed"}>
                  {m.role === "assistant" && <span className="mr-2 text-gold">✦</span>}
                  {m.content}
                </div>
              </div>
            ))}
            {thinking && <p className="fade text-sm text-muted"><span className="text-gold">✦</span> designing…</p>}
          </div>

          {last?.role === "assistant" && last.chips?.length > 0 && !thinking && (
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              {last.chips.map((c) => {
                const on = selected.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => (multiSelect && !/Just one/.test(c) ? setSelected((s) => (on ? s.filter((x) => x !== c) : [...s, c])) : send(c))}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition ${on ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-gold"}`}
                  >
                    {c}
                  </button>
                );
              })}
              {multiSelect && selected.length > 0 && <button onClick={() => send(selected.join(", "))} className="rounded-full bg-gold px-4 py-1.5 text-sm text-white">Continue →</button>}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-line p-3">
            <label className="cursor-pointer rounded-full p-2.5 text-muted hover:bg-ivory hover:text-ink" title="Add your photo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 8" /></svg>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write anything — in any language…" className="field !rounded-full !py-2.5" />
            <button disabled={!input.trim() || thinking} className="rounded-full bg-ink p-2.5 text-paper disabled:opacity-30" aria-label="Send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
        </section>

        {/* Live canvas */}
        <section className={`${mobilePreview ? "flex" : "hidden"} grain min-w-0 flex-1 flex-col md:flex`}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5">
            <div className="flex rounded-full border border-line bg-paper p-1 text-sm">
              {([["invite", "Invitation"], ["save", "Save the date"], ["site", "Website"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 transition ${tab === k ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}>{l}</button>
              ))}
            </div>
            <div className="flex items-center gap-1.5" title="Design world">
              {THEMES.map((t) => (
                <button key={t.id} onClick={() => { setThemeId(t.id); patch({ theme: t.id }); }} title={t.name} className={`h-7 w-7 rounded-full border-2 transition ${t.id === themeId ? "scale-110 border-ink" : "border-white"}`} style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)` }} />
              ))}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 md:p-10">{preview}</div>
          <p className="pb-4 text-center text-xs text-muted">{theme.name} — {theme.mood}</p>
        </section>
      </div>

      {panel && (
        <SendPanel
          wedding={wedding}
          published={published}
          onPublish={async (v) => { if (await patch({ published: v })) setPublished(v); }}
          onClose={() => setPanel(false)}
          realtimeUrl={realtimeUrl}
          capabilities={capabilities}
        />
      )}
    </div>
  );
}
