"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Wedding } from "@/lib/db";
import type { Profile } from "@/lib/profile";
import { coupleNames } from "@/lib/profile";
import { THEMES, petalColors, themeById } from "@/lib/themes";
import { InvitationCard } from "@/components/InvitationCard";
import { WeddingSite } from "@/components/WeddingSite";
import { BRAND } from "@/lib/brand";
import { Aurora } from "@/components/fx/Aurora";
import { Petals } from "@/components/fx/Petals";
import { Tilt } from "@/components/fx/Tilt";
import { Heart } from "@/components/fx/Heart";
import { SendPanel } from "./SendPanel";

export type Msg = { id: string; role: "user" | "assistant"; content: string; chips: string[] };
type Tab = "invite" | "save" | "site";
const ease = [0.2, 0.7, 0.2, 1] as const;

// Reveals a fresh reply word by word, like ink settling on paper.
function Ink({ text, animate }: { text: string; animate: boolean }) {
  if (!animate) return <>{text}</>;
  const words = text.split(/(\s+)/);
  return (
    <>
      {words.map((w, i) => (
        <motion.span key={i} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: i * 0.018, duration: 0.5 }}>
          {w}
        </motion.span>
      ))}
    </>
  );
}

export function Studio({ wedding, initialMessages, realtimeUrl, capabilities, adminView }: { wedding: Wedding; initialMessages: Msg[]; realtimeUrl: string; capabilities: { email: boolean; domains: boolean }; adminView?: boolean }) {
  const [messages, setMessages] = useState(initialMessages);
  const [fresh, setFresh] = useState<string | null>(null);
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
  const multiSelect = last?.role === "assistant" && /(tap any|select all|all that apply|which celebrations|какие события)/i.test(last.content);
  const [a, b] = coupleNames(profile);

  useEffect(() => {
    // Braces matter: newer browsers return a Promise from scrollTo, which must not become the effect cleanup.
    scroller.current?.scrollTo({ top: 1e9, behavior: "smooth" });
  }, [messages, thinking]);

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
      const id = crypto.randomUUID();
      setFresh(id);
      setMessages((m) => [...m, { id, role: "assistant", content: data.reply, chips: data.chips }]);
      if (/publish/i.test(text)) setPanel(true);
      if (data.step === 9 && wedding.step < 9 && tab === "invite") setTimeout(() => setTab("site"), 900);
    } catch (e) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: `Forgive me — ${(e as Error).message || "something went wrong"}. Shall we try again?`, chips: [] }]);
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
    const id = crypto.randomUUID();
    setFresh(id);
    setMessages((m) => [...m, { id, role: "assistant", content: "What a beautiful photograph. It now opens your wedding website. ♥", chips: [] }]);
  }

  const preview = useMemo(
    () =>
      tab === "site" ? (
        <div className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[30px] bg-white shadow-[0_60px_120px_-60px_rgba(74,20,36,.6)] ring-1 ring-black/5">
          <div className="flex items-center gap-2 border-b border-line bg-white/80 px-5 py-3 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f3b6b6]" /><span className="h-2.5 w-2.5 rounded-full bg-[#f3dcb0]" /><span className="h-2.5 w-2.5 rounded-full bg-[#c9e3c4]" />
            <span className="mx-auto truncate rounded-full bg-ivory px-4 py-1 text-[11px] text-muted">🔒 {wedding.custom_domain ?? `…/w/${wedding.slug}`}</span>
          </div>
          <div className="scroll-soft max-h-[72dvh] overflow-y-auto">
            <WeddingSite profile={profile} theme={theme} heroUrl={heroUrl} compact>
              <div className="py-6 text-center">
                <p className="display text-3xl">Kindly reply</p>
                <p className="mt-2 text-sm text-[var(--t-muted)]">Your guests RSVP right here.</p>
              </div>
            </WeddingSite>
          </div>
        </div>
      ) : (
        <Tilt className="w-full max-w-[430px]"><InvitationCard profile={profile} theme={theme} variant={tab} /></Tilt>
      ),
    [tab, profile, theme, heroUrl, wedding.custom_domain, wedding.slug],
  );

  return (
    <div className="grain relative flex h-dvh flex-col overflow-hidden bg-ivory">
      <Aurora colors={[`${theme.accent}30`, `${theme.gold}38`, "#f3c9cf66", "#fbe7dc88"]} />

      <header className="relative z-20 flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/studio" className="display flex items-center gap-2 text-[1.4rem]"><Heart className="heartbeat h-3 w-3" color="var(--rose)" />{BRAND.name}</Link>
          <AnimatePresence mode="wait">
            <motion.span key={a + b} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="hidden truncate font-display text-lg italic text-muted sm:block">
              {profile.partner1 ? `${a} & ${b}` : "a new love story"}
            </motion.span>
          </AnimatePresence>
          {adminView && <span className="rounded-full bg-wine px-3 py-1 text-[10px] tracking-widest text-[#fbeee6]">ADMIN VIEW</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMobilePreview((v) => !v)} className="btn btn-ghost !px-4 !py-2 md:hidden">{mobilePreview ? "Chat" : "Preview"}</button>
          <button onClick={() => setPanel(true)} className="btn btn-dark !px-5 !py-2.5">{published ? "Send & share" : "Publish ♥"}</button>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 gap-4 px-0 pb-0 md:px-4 md:pb-4">
        {/* Conversation */}
        <section className={`${mobilePreview ? "hidden" : "flex"} glass w-full flex-col overflow-hidden md:flex md:w-[430px] md:rounded-[30px] lg:w-[470px]`}>
          <div ref={scroller} className="scroll-soft flex-1 space-y-6 overflow-y-auto px-6 py-7">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div key={m.id} layout initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55, ease }} className={`flex ${m.role === "user" ? "justify-end" : "gap-3"}`}>
                  {m.role === "assistant" && (
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f3c9cf] to-[#f1dcb3] text-[11px] text-wine shadow-sm">✦</span>
                  )}
                  <div className={m.role === "user" ? "max-w-[82%] rounded-[22px] rounded-br-md bg-gradient-to-br from-[#5a1a2e] to-[#2a1a1f] px-4 py-2.5 text-[15px] text-[#fff6f0] shadow-[0_10px_24px_-14px_rgba(74,20,36,.8)]" : "max-w-[88%] whitespace-pre-line pt-0.5 font-display text-[1.2rem] leading-[1.5] text-ink"}>
                    {m.role === "assistant" ? <Ink text={m.content} animate={m.id === fresh} /> : m.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {thinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pl-1">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}>
                    <Heart className="h-3 w-3" color="var(--rose)" />
                  </motion.span>
                ))}
                <span className="font-display text-base italic text-muted">designing with love…</span>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {last?.role === "assistant" && last.chips?.length > 0 && !thinking && (
              <motion.div key={last.id} initial="h" animate="s" exit={{ opacity: 0 }} variants={{ s: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }} className="flex flex-wrap gap-2 px-6 pb-3">
                {last.chips.map((c) => {
                  const on = selected.includes(c);
                  return (
                    <motion.button
                      key={c}
                      variants={{ h: { opacity: 0, y: 10, scale: 0.9 }, s: { opacity: 1, y: 0, scale: 1 } }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => (multiSelect && !/just one|only one/i.test(c) ? setSelected((s) => (on ? s.filter((x) => x !== c) : [...s, c])) : send(c))}
                      className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors ${on ? "border-wine bg-wine text-[#fff6f0]" : "border-white/80 bg-white/70 text-ink shadow-[0_6px_16px_-10px_rgba(74,20,36,.4)] hover:border-rose"}`}
                    >
                      {on && "♥ "}{c}
                    </motion.button>
                  );
                })}
                {multiSelect && selected.length > 0 && (
                  <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => send(selected.join(", "))} className="rounded-full bg-gradient-to-r from-rose to-[#c5a06a] px-4 py-2 text-[13.5px] text-white shadow-md">
                    Continue →
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="m-3 flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 p-1.5 shadow-[0_10px_30px_-18px_rgba(74,20,36,.5)] transition focus-within:border-rose/50 focus-within:shadow-[0_0_0_4px_rgba(192,108,120,.12)]">
            <label className="cursor-pointer rounded-full p-2.5 text-muted transition hover:bg-blush hover:text-wine" title="Add your photo">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 8" /></svg>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell me anything — in any language…" className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[15px] outline-none placeholder:text-muted/70" />
            <motion.button whileTap={{ scale: 0.9 }} disabled={!input.trim() || thinking} className="rounded-full bg-gradient-to-br from-[#5a1a2e] to-[#2a1a1f] p-2.5 text-[#fff6f0] transition disabled:opacity-25" aria-label="Send">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </motion.button>
          </form>
        </section>

        {/* Live canvas */}
        <section className={`${mobilePreview ? "flex" : "hidden"} relative min-w-0 flex-1 flex-col overflow-hidden md:flex md:rounded-[30px]`} style={{ background: `radial-gradient(60% 55% at 50% 48%, ${theme.gold}2e, transparent 75%)` }}>
          <Petals count={12} colors={petalColors(theme)} className="absolute" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
            <div className="glass flex rounded-full p-1 text-[13px]">
              {([["invite", "Invitation"], ["save", "Save the date"], ["site", "Website"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} className="relative rounded-full px-4 py-1.5">
                  {tab === k && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5a1a2e] to-[#2a1a1f]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className={`relative ${tab === k ? "text-[#fff6f0]" : "text-muted hover:text-ink"}`}>{l}</span>
                </button>
              ))}
            </div>
            <div className="glass flex items-center gap-1.5 rounded-full p-1.5" title="Design world">
              {THEMES.map((t) => (
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} key={t.id} onClick={() => { setThemeId(t.id); patch({ theme: t.id }); }} title={t.name} className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-white/0 transition ${t.id === themeId ? "ring-wine" : "ring-transparent"}`} style={{ background: `conic-gradient(from 210deg, ${t.bg}, ${t.accent}, ${t.gold}, ${t.bg})` }} />
              ))}
            </div>
          </div>
          <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={tab + themeId} initial={{ opacity: 0, y: 30, scale: 0.96, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(8px)" }} transition={{ duration: 0.75, ease }} className="flex w-full justify-center">
                {preview}
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={theme.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 pb-4 text-center font-display text-base italic text-muted">
              {theme.name} — {theme.mood}
            </motion.p>
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}
