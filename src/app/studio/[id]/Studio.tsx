"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Collab } from "./editor/Collab";
import { SectionList } from "./editor/SectionList";
import { Cropper } from "./editor/Cropper";
import type { Presence } from "@/lib/realtime";
import type { Wedding } from "@/lib/db";
import type { Profile } from "@/lib/profile";
import { displayNames, occasionOf, OCCASIONS } from "@/lib/occasions";
import { OCCASION_THEMES, THEMES, themeById } from "@/lib/themes";
import { sectionLayout } from "@/lib/templates";
import { MOTIFS, INVOCATIONS, type MotifId, type InvocationId } from "@/lib/motifs";
import { KINDS, PAPER_LAYOUTS, SITE_LAYOUTS, type Doc } from "@/lib/templates";
import { PieceView } from "@/components/designs/PieceView";
import { Paper } from "@/components/designs/Paper";
import { Motif } from "@/components/Motif";
import { BRAND } from "@/lib/brand";
import { Aurora } from "@/components/fx/Aurora";
import { Petals } from "@/components/fx/Petals";
import { Tilt } from "@/components/fx/Tilt";
import { Heart } from "@/components/fx/Heart";
import { Seal, Wordmark } from "@/components/brand/Wordmark";
import { assetUrl, uploadAsset, type Asset } from "@/lib/upload-client";
import { SendPanel } from "./SendPanel";
import { openSupport } from "@/components/SupportHeart";
import { Gallery, type Pick } from "./Gallery";
import { EditorShell } from "./editor/EditorShell";
import { pathLabel } from "@/lib/editor-options";

// Stamps a soft, diagonal "Festivelle preview" mark across an exported image.
async function watermark(src: string) {
  const img = await new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  const c = Object.assign(document.createElement("canvas"), { width: img.width, height: img.height });
  const g = c.getContext("2d")!;
  g.drawImage(img, 0, 0);
  g.save();
  g.translate(c.width / 2, c.height / 2);
  g.rotate(-Math.PI / 7);
  g.font = `italic ${Math.round(c.width / 11)}px Georgia, serif`;
  g.textAlign = "center";
  g.fillStyle = "rgba(120,40,60,.22)";
  for (let y = -c.height; y < c.height; y += c.width / 3.2) g.fillText(`${BRAND.name} preview`, 0, y);
  g.restore();
  return c.toDataURL("image/png");
}

export type Msg = { id: string; role: "user" | "assistant"; content: string; chips: string[]; kind?: string };
const ease = [0.2, 0.7, 0.2, 1] as const;
const json = (method: string, body: unknown) => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

// Reveals a fresh reply word by word, like ink settling on paper.
function Ink({ text, animate }: { text: string; animate: boolean }) {
  if (!animate) return <>{text}</>;
  return (
    <>
      {text.split(/(\s+)/).map((w, i) => (
        <motion.span key={i} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: i * 0.016, duration: 0.5 }}>{w}</motion.span>
      ))}
    </>
  );
}

type Props = { wedding: Wedding; initialMessages: Msg[]; initialDocs: Doc[]; initialPhotos: Asset[]; realtimeUrl: string; capabilities: { email: boolean; domains: boolean }; editable: boolean; adminView?: boolean };

export function Studio({ wedding, initialMessages, initialDocs, initialPhotos, realtimeUrl, capabilities, editable, adminView }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [fresh, setFresh] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(wedding.profile);
  const [themeId, setThemeId] = useState(wedding.theme);
  const [published, setPublished] = useState(wedding.published);
  const [docs, setDocs] = useState(initialDocs);
  const [activeId, setActiveId] = useState(initialDocs[0]?.id);
  const [photos, setPhotos] = useState(initialPhotos);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [panel, setPanel] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [gallery, setGallery] = useState<null | { mode: "add" | "restyle" }>(null);
  const [picker, setPicker] = useState<null | "motif" | "photo" | "sections">(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(editable);
  const [crop, setCrop] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [chatOpen, setChatOpen] = useState(true);
  // First-minute onboarding: until the first answers (names) arrive, the design waits softly out of focus,
  // then "blooms" into place the moment it has something to say.
  const [bloom, setBloom] = useState(0);
  const [bloomToast, setBloomToast] = useState(false);
  const named = !!profile.partner1;
  const wasNamed = useRef(named);
  useEffect(() => {
    if (named && !wasNamed.current) { setBloom((b) => b + 1); setNudge(true); setBloomToast(true); }
    wasNamed.current = named;
  }, [named]);
  useEffect(() => { if (!bloomToast) return; const t = setTimeout(() => setBloomToast(false), 8000); return () => clearTimeout(t); }, [bloomToast]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const pieceRef = useRef<HTMLDivElement>(null);
  const doc = docs.find((d) => d.id === activeId) ?? docs[0];
  const theme = themeById(doc?.design.theme ?? themeId);
  const last = [...messages].reverse().find((m) => m.kind !== "edit");
  const multiSelect = last?.role === "assistant" && /(tap any|select all|all that apply|which celebrations|какие события)/i.test(last.content);
  const occ = occasionOf(profile);
  const names = displayNames(profile);
  const suiteThemes = (OCCASION_THEMES[occ] ?? []).map(themeById).concat(THEMES.filter((t) => !(OCCASION_THEMES[occ] ?? []).includes(t.id))).slice(0, 10);
  const sec = sectionLayout(doc?.design.sections);
  const layouts = doc?.kind === "website" ? SITE_LAYOUTS : PAPER_LAYOUTS;

  useEffect(() => {
    // Braces matter: newer browsers return a Promise from scrollTo, which must not become the effect cleanup.
    scroller.current?.scrollTo({ top: 1e9, behavior: "smooth" });
  }, [messages, thinking]);

  const replaceDoc = (d: Doc) => setDocs((all) => all.map((x) => (x.id === d.id ? d : x)));
  const [peers, setPeers] = useState<Presence[]>([]);
  const pendingRemote = useRef(false);
  // A collaborator (or their chat) changed something: pull a fresh snapshot. Never clobber text being typed.
  const pullRemote = useCallback(async () => {
    if ((document.activeElement as HTMLElement | null)?.isContentEditable) { pendingRemote.current = true; return; }
    pendingRemote.current = false;
    const r = await fetch(`/api/weddings/${wedding.id}/state`, { cache: "no-store" });
    if (!r.ok) return;
    const st = await r.json();
    setProfile(st.profile);
    setThemeId(st.theme);
    setPublished(st.published);
    setDocs(st.docs);
    setMessages((cur) => (st.messages.length >= cur.length ? st.messages.map((m: Msg) => ({ ...m, chips: m.chips ?? [] })) : cur));
  }, [wedding.id]);
  useEffect(() => {
    const onBlur = () => { if (pendingRemote.current) setTimeout(() => void pullRemote(), 50); };
    document.addEventListener("focusout", onBlur);
    return () => document.removeEventListener("focusout", onBlur);
  }, [pullRemote]);
  const say = (content: string) => {
    const id = crypto.randomUUID();
    setFresh(id);
    setMessages((m) => [...m, { id, role: "assistant", content, chips: [] }]);
  };

  async function send(text: string) {
    if (!text.trim() || thinking) return;
    if (/^(show me templates|browse templates|templates)$/i.test(text.trim())) return setGallery({ mode: "add" });
    setInput("");
    setSelected([]);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text, chips: [] }]);
    setThinking(true);
    try {
      const res = await fetch(`/api/weddings/${wedding.id}/chat`, json("POST", { message: text, docId: doc?.id, selectedPath: editMode ? selectedPath ?? undefined : undefined }));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data.profile);
      setThemeId(data.theme);
      if (data.doc) replaceDoc(data.doc);
      if (data.added) { setDocs((all) => [...all, data.added]); setActiveId(data.added.id); }
      const id = crypto.randomUUID();
      setFresh(id);
      setMessages((m) => [...m, { id, role: "assistant", content: data.reply, chips: data.chips }]);
      if (/publish/i.test(text)) setPanel(true);
      setNudge(true);
    } catch (e) {
      say(`Forgive me — ${(e as Error).message || "something went wrong"}. Shall we try again?`);
    } finally {
      setThinking(false);
    }
  }

  const patchWedding = (body: Record<string, unknown>) => fetch(`/api/weddings/${wedding.id}`, json("PATCH", body)).then((r) => r.ok);
  async function patchDoc(body: Record<string, unknown>) {
    if (!doc) return;
    const r = await fetch(`/api/weddings/${wedding.id}/documents/${doc.id}`, json("PATCH", body));
    if (r.ok) replaceDoc((await r.json()).doc);
  }

  async function pick(p: Pick) {
    const mode = gallery?.mode;
    setGallery(null);
    if (mode === "restyle" && doc) {
      await patchDoc({ layout: p.layout, theme: p.theme, motif: p.motif ?? null, ...(p.fonts ? { fonts: p.fonts } : {}), ...(p.template ? { template: p.template } : {}) });
      return say(`Restyled in ${themeById(p.theme).name}. Tell me anything you'd like refined — wording, motif, size, colours.`);
    }
    const r = await fetch(`/api/weddings/${wedding.id}/documents`, json("POST", p));
    const d = await r.json();
    if (!r.ok) return say(d.error);
    setDocs((all) => [...all, d.doc]);
    setActiveId(d.doc.id);
    setSheet(true);
    say(`Your ${KINDS[p.kind].name.toLowerCase()} is ready, in ${themeById(p.theme).name}. Ask me to change anything — “warmer wording”, “add a lotus”, “make the names bigger”.`);
  }

  async function removeDoc() {
    if (!doc || docs.length <= 1 || !confirm(`Remove this ${KINDS[doc.kind].name.toLowerCase()}?`)) return;
    const r = await fetch(`/api/weddings/${wedding.id}/documents/${doc.id}`, { method: "DELETE" });
    if (r.ok) { const rest = docs.filter((d) => d.id !== doc.id); setDocs(rest); setActiveId(rest[0]?.id); }
  }

  async function applyPhoto(key: string) {
    setPicker(null);
    if (doc?.kind === "website") { await patchWedding({ heroKey: key }); setProfile((p) => ({ ...p, heroKey: key })); }
    else { await patchDoc({ photoKey: key, layout: "photo" }); }
    say("What a beautiful photograph ♥ It’s in place.");
  }

  async function upload(file: File) {
    setBusy("Uploading…");
    try {
      const asset = await uploadAsset(file, wedding.workspace_id, { weddingId: wedding.id });
      setPhotos((p) => [asset, ...p]);
      await applyPhoto(asset.key);
    } catch (e) { alert((e as Error).message); } finally { setBusy(null); }
  }

  async function saveCrop(file: File) {
    setBusy("Saving your crop…");
    try {
      const asset = await uploadAsset(file, wedding.workspace_id, { weddingId: wedding.id });
      setPhotos((p) => [asset, ...p]);
      setCrop(null);
      await applyPhoto(asset.key);
    } catch (e) { alert((e as Error).message); } finally { setBusy(null); }
  }
  const pieceAspect = (() => {
    if (!doc || doc.kind === "website") return 3 / 2;
    const [a, b] = String(KINDS[doc.kind].ratio).split("/").map(Number);
    return a && b ? a / b : 1;
  })();
  const currentPhoto = doc?.kind === "website" ? profile.heroKey : doc?.design.photoKey;

  async function download(share = false) {
    const node = pieceRef.current?.querySelector("[data-piece]") as HTMLElement | null;
    if (!node || !doc) return;
    setBusy("Preparing your file…");
    try {
      const { toPng } = await import("html-to-image");
      let url = await toPng(node, { pixelRatio: 3, cacheBust: true });
      // Greeting cards are free to make; the clean file comes with a purchased package.
      if ((occ === "greeting" || doc.kind === "greeting") && !wedding.tier) url = await watermark(url);
      const filename = `${names}-${KINDS[doc.kind].name}.png`.replace(/\s+/g, "-");
      if (share) {
        const file = new File([await (await fetch(url)).blob()], filename, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: names }).catch(() => {}); return; }
      }
      const link = Object.assign(document.createElement("a"), { href: url, download: filename });
      link.click();
    } catch { alert("Couldn’t prepare the image — please try again."); } finally { setBusy(null); }
  }

  const designKey = doc ? [doc.id, doc.layout, doc.design.theme ?? themeId, doc.design.template ?? "", doc.design.fonts ?? "", doc.design.motif ?? "", bloom, device].join("|") : "";
  const Canvas = doc && (
    <div ref={pieceRef} className={`relative m-auto flex w-full justify-center transition-[filter,opacity,transform] duration-[1600ms] ease-[var(--ease-expo)] ${!named && editable ? "opacity-60 blur-[5px] saturate-[.7] scale-[.985]" : ""}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={designKey}
          initial={{ opacity: 0, y: 18, scale: 0.975, filter: "blur(10px)", clipPath: "circle(18% at 50% 42%)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", clipPath: "circle(150% at 50% 42%)" }}
          exit={{ opacity: 0, y: -10, scale: 0.985, filter: "blur(8px)", transition: { duration: 0.35 } }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full justify-center"
        >
          {doc.kind === "website" ? (
            device === "phone" ? (
              <div className="device-phone shrink-0" style={{ width: "min(392px, calc(100vw - 40px))" }}>
                <div className="screen">
                  <div data-piece className="scroll-soft h-[min(72dvh,780px)] overflow-y-auto">
                    <PieceView doc={doc} profile={profile} suiteTheme={themeId} rsvpSlot={<div className="py-6 text-center"><p className="display text-3xl">Kindly reply</p><p className="mt-2 text-sm text-[var(--t-muted)]">Your guests RSVP right here.</p></div>} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="device-browser w-full max-w-[1080px]">
                <div className="device-bar">
                  <i /><i /><i />
                  <span className="mx-auto flex max-w-[70%] items-center gap-1.5 truncate rounded-full bg-white/80 px-4 py-1 text-[11px] text-muted"><svg viewBox="0 0 16 16" className="h-2.5 w-2.5 shrink-0" fill="currentColor" aria-hidden><path d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5v-5A1.5 1.5 0 0 1 3.5 7H4Zm2 0h4V5a2 2 0 1 0-4 0v2Z" /></svg>{wedding.custom_domain ?? (wedding.subdomain ? `${wedding.subdomain}.festivelle.com` : `…/w/${wedding.slug}`)}</span>
                </div>
                <div data-piece className="scroll-soft max-h-[64dvh] overflow-y-auto md:max-h-[calc(100dvh-262px)]">
                  <PieceView doc={doc} profile={profile} suiteTheme={themeId} rsvpSlot={<div className="py-6 text-center"><p className="display text-3xl">Kindly reply</p><p className="mt-2 text-sm text-[var(--t-muted)]">Your guests RSVP right here.</p></div>} />
                </div>
              </div>
            )
          ) : (
            // Fit the whole piece in view: width is limited by the available height × the piece's aspect ratio.
            <MaybeTilt on={!editMode}>
              <div className="shadow-[0_1px_1px_rgba(74,20,36,.06),0_50px_90px_-50px_rgba(74,20,36,.7)]" style={{ width: `min(${KINDS[doc.kind].ratio === "7/5" ? 620 : 460}px, calc(100vw - 40px), calc((100dvh - 330px) * ${KINDS[doc.kind].ratio}))` }}>
              <div data-piece><PieceView doc={doc} profile={profile} suiteTheme={themeId} /></div>
              </div>
            </MaybeTilt>
          )}
        </motion.div>
      </AnimatePresence>
      {bloom > 0 && <span key={`ring-${bloom}`} aria-hidden className="bloom-ring pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--gold)]" />}
    </div>
  );

  return (
    <div className="grain relative flex h-dvh flex-col overflow-hidden bg-ivory">
      <Aurora colors={[`${theme.accent}22`, `${theme.gold}30`, "#f3c9cf55", "#fbe7dc88"]} />

      <header className="relative z-30 flex items-center justify-between gap-2 px-3 py-2.5 md:px-6 md:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/studio" className="flex shrink-0 items-center" aria-label={`${BRAND.name} studio`}><Seal className="h-8 w-8 sm:hidden" /><span className="hidden sm:inline"><Wordmark size="text-[1.45rem]" /></span></Link>
          <span className="hidden h-5 w-px bg-line-strong sm:block" />
          <span className="truncate font-display text-[1.15rem] italic text-ink-soft">{profile.partner1 ? names : `a new ${OCCASIONS[occ].name.toLowerCase()}`}</span>
          {adminView && <span className="hidden rounded-full bg-wine px-3 py-1 text-[10px] tracking-widest text-[#fbeee6] sm:inline">ADMIN VIEW</span>}
          {!editable && <span className="rounded-full bg-blush px-3 py-1 text-[10px] tracking-widest text-wine">VIEW ONLY</span>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={openSupport} aria-label="Talk to our wedding concierge" className="rounded-full bg-[radial-gradient(circle_at_30%_25%,#e58a98,#a8344f_60%,#5a1a2e)] p-2.5 shadow-md md:hidden"><Heart className="heartbeat h-4 w-4" color="#fff6f0" /></button>
          <button onClick={() => { setSheet(true); setNudge(false); }} className="btn btn-ghost relative !px-4 !py-2 md:hidden">
            Design{nudge && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-ping rounded-full bg-rose" />}
          </button>
          <Collab weddingId={wedding.id} realtimeUrl={realtimeUrl} docId={doc?.id} path={selectedPath} onRemoteChange={pullRemote} onPeers={setPeers} />
          <Link href={`/studio/${wedding.id}/video`} className="link-u hidden px-2 text-[13px] text-ink-soft sm:inline" title="Video invitation">▶ Video</Link>
          {editable && <button onClick={() => setPanel(true)} className="btn btn-dark !px-4 !py-2 md:!px-5 md:!py-2.5">{published ? "Share" : "Publish ♥"}</button>}
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 gap-4 md:px-4 md:pb-4">
        {/* ── Conversation: a floating, letter-like panel (collapsible on desktop so the design can take the stage) ── */}
        <section className={`glass flex w-full flex-col overflow-hidden transition-[width,opacity,margin] duration-700 ease-[var(--ease-expo)] md:rounded-[30px] md:shadow-[0_40px_90px_-50px_rgba(74,20,36,.55)] ${chatOpen ? "md:w-[380px] lg:w-[420px]" : "md:pointer-events-none md:-mr-4 md:w-0 md:opacity-0"}`}>
          <div className="hidden items-center justify-between border-b border-white/60 px-6 py-3 md:flex">
            <p className="flex items-center gap-2 text-[10.5px] uppercase tracking-[.28em] text-muted"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose/50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose" /></span>Your designer</p>
            <button onClick={() => setChatOpen(false)} className="rounded-full p-1.5 text-muted transition hover:bg-white/70 hover:text-ink" title="Hide the conversation — let the design take the stage" aria-label="Hide conversation">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
          </div>
          <div ref={scroller} className="scroll-soft flex-1 space-y-5 overflow-y-auto px-5 py-6 md:px-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => m.kind === "edit" ? (
                <motion.p key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[11.5px] italic text-muted/80">{m.content}</motion.p>
              ) : (
                <motion.div key={m.id} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55, ease }} className={`flex ${m.role === "user" ? "justify-end" : "gap-3"}`}>
                  {m.role === "assistant" && <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f3c9cf] to-[#f1dcb3] text-[11px] text-wine shadow-sm">✦</span>}
                  <div className={m.role === "user" ? "max-w-[82%] rounded-[22px] rounded-br-md bg-gradient-to-br from-[#5a1a2e] to-[#2a1a1f] px-4 py-2.5 text-[15px] text-[#fff6f0] shadow-[0_10px_24px_-14px_rgba(74,20,36,.8)]" : "max-w-[88%] whitespace-pre-line pt-0.5 font-display text-[1.18rem] leading-[1.5] text-ink"}>
                    {m.role === "assistant" ? <Ink text={m.content} animate={m.id === fresh} /> : m.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {thinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pl-1">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}><Heart className="h-3 w-3" color="var(--rose)" /></motion.span>
                ))}
                <span className="font-display text-base italic text-muted">designing with love…</span>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {bloomToast && (
              <motion.button initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} onClick={() => { setBloomToast(false); setSheet(true); setNudge(false); }} className="mx-4 mb-2 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#5a1a2e] to-[#2a1a1f] px-4 py-3 text-left text-[#fbeee6] shadow-[0_20px_40px_-20px_rgba(74,20,36,.9)] md:hidden">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-lg">✦</span>
                <span className="flex-1"><span className="block font-display text-lg italic leading-tight">Your design just bloomed</span><span className="text-[12px] opacity-70">Tap to see it — then keep talking</span></span>
                <span>→</span>
              </motion.button>
            )}
          </AnimatePresence>
          {editable && (
            <>
              <AnimatePresence>
                {last?.role === "assistant" && last.chips?.length > 0 && !thinking && (
                  <motion.div key={last.id} initial="h" animate="s" exit={{ opacity: 0 }} variants={{ s: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }} className="scroll-soft flex gap-2 overflow-x-auto px-5 pb-3 md:flex-wrap md:px-6">
                    {last.chips.map((c) => {
                      const on = selected.includes(c);
                      return (
                        <motion.button key={c} variants={{ h: { opacity: 0, y: 10, scale: 0.9 }, s: { opacity: 1, y: 0, scale: 1 } }} whileTap={{ scale: 0.95 }} onClick={() => (multiSelect && !/just one|only one/i.test(c) ? setSelected((s) => (on ? s.filter((x) => x !== c) : [...s, c])) : send(c))} className={`shrink-0 rounded-full border px-4 py-2 text-[13.5px] transition-colors ${on ? "border-wine bg-wine text-[#fff6f0]" : "border-white/80 bg-white/75 text-ink shadow-[0_6px_16px_-10px_rgba(74,20,36,.4)] hover:border-rose"}`}>
                          {on && "♥ "}{c}
                        </motion.button>
                      );
                    })}
                    {multiSelect && selected.length > 0 && <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => send(selected.join(", "))} className="shrink-0 rounded-full bg-gradient-to-r from-rose to-[#c5a06a] px-4 py-2 text-[13.5px] text-white shadow-md">Continue →</motion.button>}
                  </motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="m-3 mb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-1.5 rounded-full border border-white/80 bg-white/85 p-1.5 shadow-[0_10px_30px_-18px_rgba(74,20,36,.5)] transition focus-within:border-rose/50 focus-within:shadow-[0_0_0_4px_rgba(192,108,120,.12)]">
                <button type="button" onClick={() => setGallery({ mode: "add" })} className="rounded-full p-2.5 text-muted transition hover:bg-blush hover:text-wine" title="Templates" aria-label="Templates">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
                </button>
                <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={editMode && selectedPath ? `Ask about the ${pathLabel(selectedPath)} — “make it warmer”…` : "Tell me anything — in any language…"} className="min-w-0 flex-1 bg-transparent px-1.5 py-2 text-[16px] outline-none placeholder:text-muted/70 md:text-[15px]" />
                <motion.button whileTap={{ scale: 0.9 }} disabled={!input.trim() || thinking} className="rounded-full bg-gradient-to-br from-[#5a1a2e] to-[#2a1a1f] p-2.5 text-[#fff6f0] transition disabled:opacity-25" aria-label="Send">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </motion.button>
              </form>
            </>
          )}
        </section>

        {/* ── Live canvas (bottom sheet on phones) ── */}
        <section className={`fixed inset-x-0 bottom-0 top-[52px] z-40 flex flex-col overflow-hidden rounded-t-[28px] bg-ivory shadow-[0_-30px_60px_-30px_rgba(74,20,36,.5)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] md:static md:z-auto md:min-w-0 md:flex-1 md:translate-y-0 md:rounded-[30px] md:border md:border-white/50 md:bg-white/25 md:shadow-[inset_0_1px_0_rgba(255,255,255,.7)] ${sheet ? "translate-y-0" : "translate-y-[105%]"}`} style={{ backgroundImage: `radial-gradient(60% 55% at 50% 52%, ${theme.gold}30, transparent 75%), radial-gradient(40% 40% at 80% 10%, ${theme.accent}12, transparent 70%)` }}>
          <Petals count={8} colors={theme.petals} className="absolute" />
          {!chatOpen && (
            <motion.button initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} onClick={() => setChatOpen(true)} className="absolute bottom-6 left-6 z-30 hidden items-center gap-2.5 rounded-full bg-wine py-2.5 pl-3 pr-5 text-[13px] text-[#fbeee6] shadow-[0_20px_40px_-18px_rgba(74,20,36,.8)] md:flex">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">✦</span>Talk to your designer
            </motion.button>
          )}
          <button onClick={() => setSheet(false)} className="relative z-10 mx-auto mt-2 flex flex-col items-center md:hidden" aria-label="Back to chat"><span className="h-1.5 w-12 rounded-full bg-muted/30" /><span className="mt-1 text-[11px] text-muted">back to chat</span></button>

          {/* pieces strip */}
          <div className="scroll-soft relative z-10 flex items-end gap-3 overflow-x-auto px-4 pb-2 pt-3 md:px-5">
            {docs.map((d) => (
              <button key={d.id} onClick={() => setActiveId(d.id)} className="group shrink-0 text-center" title={KINDS[d.kind].name}>
                <div className={`overflow-hidden rounded-[4px] shadow-[0_8px_18px_-12px_rgba(74,20,36,.6)] transition duration-500 ${d.id === doc?.id ? "-translate-y-1 ring-1 ring-wine ring-offset-[3px] ring-offset-ivory" : "opacity-70 group-hover:-translate-y-0.5 group-hover:opacity-100"}`} style={{ width: 48 }}>
                  {d.kind === "website" ? (
                            <div className="flex aspect-[3/4] flex-col items-center justify-center gap-1 ring-1 ring-black/5" style={{ background: themeById(d.design.theme ?? themeId).bg, color: themeById(d.design.theme ?? themeId).accent }}><span className="text-[9px] tracking-widest">www</span><Motif theme={themeById(d.design.theme ?? themeId)} motif={d.design.motif} className="w-9" /></div>
                  ) : (
                    <Paper kind={d.kind} layout={d.layout} design={d.design} profile={profile} theme={themeById(d.design.theme ?? themeId)} animate={false} className="!shadow-none" />
                  )}
                </div>
                <p className={`mt-1 max-w-[64px] truncate text-[10px] ${d.id === doc?.id ? "text-wine" : "text-muted"}`}>{KINDS[d.kind].name}</p>
              </button>
            ))}
            {editable && (
              <button onClick={() => setGallery({ mode: "add" })} className="shrink-0 text-center">
                <div className="flex aspect-[3/4] w-[46px] items-center justify-center rounded-lg border border-dashed border-rose/50 bg-white/50 text-xl text-rose transition hover:bg-blush">+</div>
                <p className="mt-1 text-[10px] text-rose">Add piece</p>
              </button>
            )}
          </div>

          {/* toolbar */}
          {editable && doc && (
            <div className="scroll-soft relative z-20 flex items-center gap-2 overflow-x-auto px-4 pb-1 md:flex-wrap md:px-5">
              <button onClick={() => { setEditMode((v) => !v); setSelectedPath(null); }} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] transition ${editMode ? "bg-wine text-white shadow-md" : "border border-line-strong bg-white/50 text-ink-soft hover:bg-white"}`} title="Edit directly on the preview">✎ {editMode ? "Editing" : "Edit on preview"}</button>
              {doc.kind === "website" && (
                <div className="flex shrink-0 rounded-full border border-line-strong bg-white/50 p-0.5 text-[12.5px]" role="group" aria-label="Preview device">
                  {(["desktop", "phone"] as const).map((d) => (
                    <button key={d} onClick={() => setDevice(d)} aria-pressed={device === d} className="relative rounded-full px-3 py-1" title={d === "desktop" ? "Desktop preview" : "Phone preview"}>
                      {device === d && <motion.span layoutId="dev" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                      <span className={`relative flex items-center gap-1.5 ${device === d ? "text-white" : "text-muted"}`}>
                        {d === "desktop" ? <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></svg> : <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>}
                        <span className="hidden lg:inline">{d === "desktop" ? "Desktop" : "Phone"}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setGallery({ mode: "restyle" })} className="shrink-0 rounded-full border border-line-strong bg-white/50 px-3.5 py-1.5 text-[13px] text-ink-soft transition hover:border-wine/40 hover:bg-white hover:text-ink">✦ Templates</button>
              <label className="relative flex shrink-0 items-center rounded-full border border-line-strong bg-white/50 pl-3.5 text-[13px] text-ink-soft transition hover:bg-white" title="Layout">
                <span className="text-[10px] uppercase tracking-[.2em] text-muted">Layout</span>
                <select value={doc.layout} onChange={(e) => patchDoc({ layout: e.target.value })} className="cursor-pointer appearance-none bg-transparent py-1.5 pl-2 pr-7 font-display text-[15px] italic text-ink outline-none">
                  {Object.entries(layouts).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
                <span aria-hidden className="pointer-events-none absolute right-3 text-[10px] text-muted">▾</span>
              </label>
              <button onClick={() => setPicker(picker === "motif" ? null : "motif")} className="shrink-0 rounded-full border border-line-strong bg-white/50 px-3.5 py-1.5 text-[13px] text-ink-soft transition hover:border-wine/40 hover:bg-white hover:text-ink">Motif</button>
              <button onClick={() => setPicker(picker === "photo" ? null : "photo")} className="shrink-0 rounded-full border border-line-strong bg-white/50 px-3.5 py-1.5 text-[13px] text-ink-soft transition hover:border-wine/40 hover:bg-white hover:text-ink">{doc.kind === "website" ? "Photos" : "Photo"}</button>
              {doc.kind === "website" && <button onClick={() => setPicker(picker === "sections" ? null : "sections")} className="shrink-0 rounded-full border border-line-strong bg-white/50 px-3.5 py-1.5 text-[13px] text-ink-soft transition hover:border-wine/40 hover:bg-white hover:text-ink">Sections</button>}
              {doc.kind !== "website" && <button onClick={() => download()} className="shrink-0 rounded-full border border-line-strong bg-white/50 px-3.5 py-1.5 text-[13px] text-ink-soft transition hover:border-wine/40 hover:bg-white hover:text-ink">↓ PNG</button>}
              {(doc.kind === "greeting" || occ === "greeting") && <button onClick={() => download(true)} className="shrink-0 rounded-full border border-line-strong bg-white/50 px-3.5 py-1.5 text-[13px] text-ink-soft transition hover:border-wine/40 hover:bg-white hover:text-ink">Share</button>}
              {doc.kind !== "website" && <a href={`/studio/${wedding.id}/print/${doc.id}`} target="_blank" className="shrink-0 rounded-full border border-line-strong bg-white/50 px-3.5 py-1.5 text-[13px] text-ink-soft transition hover:border-wine/40 hover:bg-white hover:text-ink">Print / PDF</a>}
              {docs.length > 1 && <button onClick={removeDoc} className="shrink-0 rounded-full px-3 py-1.5 text-[13px] text-muted hover:text-rose">Remove</button>}
              {/* suite colours */}
              <div className="flex shrink-0 items-center gap-1.5 pl-1" title="Design world for the whole suite">
              {suiteThemes.map((t) => (
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} key={t.id} onClick={() => { setThemeId(t.id); patchWedding({ theme: t.id }); if (doc?.design.theme) patchDoc({ theme: null }); }} title={t.name} className={`h-6 w-6 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-ivory transition ${t.id === theme.id ? "ring-wine" : "ring-transparent"}`} style={{ background: `conic-gradient(from 210deg, ${t.bg}, ${t.accent}, ${t.gold}, ${t.bg})` }} />
              ))}
              </div>
            </div>
          )}

          {/* pickers */}
          <AnimatePresence>
            {picker && doc && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass scroll-soft relative z-30 mx-4 mt-2 max-h-[38dvh] overflow-y-auto rounded-3xl p-4 md:mx-5">
                {picker === "sections" ? (
                  <div>
                    <p className="mb-2 text-[12px] text-muted">Drag to reorder (or drag sections right on the preview), tap to hide — or just say “move the gallery up”.</p>
                    <SectionList order={sec.order} hidden={[...sec.hidden]} onChange={(order, hidden) => patchDoc({ sections: { order, hidden } })} />
                  </div>
                ) : picker === "motif" ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
                      {MOTIFS.map((m) => (
                        <button key={m.id} onClick={() => { patchDoc({ motif: m.id as MotifId }); setPicker(null); }} className={`rounded-2xl p-2 text-center transition hover:bg-white ${doc.design.motif === m.id ? "bg-white ring-1 ring-wine" : ""}`}>
                          <Motif theme={theme} motif={m.id} className="h-8 w-full" />
                          <p className="mt-1 truncate text-[10.5px] text-muted">{m.name}</p>
                        </button>
                      ))}
                    </div>
                    {doc.kind !== "website" && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3 text-[12px]">
                        <span className="mr-1 text-muted">Sacred invocation (optional):</span>
                        {(Object.entries(INVOCATIONS) as [InvocationId, (typeof INVOCATIONS)[InvocationId]][]).map(([k, v]) => (
                          <button key={k} onClick={() => patchDoc({ invocation: k })} className={`rounded-full px-3 py-1 ${doc.design.invocation === k ? "bg-wine text-white" : "bg-white/70"}`}>{v.label}</button>
                        ))}
                        {doc.design.invocation && <button onClick={() => patchDoc({ invocation: null })} className="rounded-full px-3 py-1 text-rose">None</button>}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                    {currentPhoto && editable && (
                      <button onClick={() => setCrop(currentPhoto)} className="relative block aspect-square overflow-hidden rounded-2xl ring-2 ring-wine" title="Crop the current photo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl(currentPhoto)} alt="" className="h-full w-full object-cover opacity-70" />
                        <span className="absolute inset-0 grid place-items-center text-[11px] font-medium text-wine"><span className="rounded-full bg-white/90 px-2 py-1">✂ Crop current</span></span>
                      </button>
                    )}
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-rose/50 bg-white/50 text-center text-[11px] text-rose hover:bg-blush">
                      <span className="text-xl">+</span>Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                    </label>
                    {photos.map((p) => {
                      const inGallery = !!doc.design.gallery?.includes(p.key);
                      return (
                        <div key={p.id} className="relative">
                          <button onClick={() => applyPhoto(p.key)} className="block aspect-square w-full overflow-hidden rounded-2xl ring-wine transition hover:ring-2" title={doc.kind === "website" ? "Use as cover photo" : "Use this photo"}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={assetUrl(p.key)} alt="" loading="lazy" className="h-full w-full object-cover" />
                          </button>
                          {editable && <button onClick={() => setCrop(p.key)} className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] text-wine shadow" title="Crop, then use">✂</button>}
                          {doc.kind === "website" && (
                            <button onClick={() => patchDoc({ gallery: inGallery ? doc.design.gallery!.filter((k) => k !== p.key) : [...(doc.design.gallery ?? []), p.key] })} className={`absolute bottom-1.5 right-1.5 rounded-full px-2 py-0.5 text-[10px] shadow ${inGallery ? "bg-wine text-white" : "bg-white/90 text-wine"}`}>{inGallery ? "♥ Gallery" : "+ Gallery"}</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {doc ? (
            <EditorShell
              weddingId={wedding.id}
              doc={doc}
              profile={profile}
              luxury={wedding.tier === "luxury" || !!adminView}
              enabled={editable && editMode}
              selected={selectedPath}
              onSelect={setSelectedPath}
              onDoc={replaceDoc}
              onProfile={(p) => setProfile((x) => ({ ...x, ...p }))}
              onMessage={(m) => setMessages((all) => [...all, { ...m, chips: m.chips ?? [] }])}
              onPhotoSlot={() => setPicker("photo")}
              peers={peers.filter((x) => x.doc_id === doc.id && x.path)}
              onAsk={() => { setSheet(false); setTimeout(() => inputRef.current?.focus(), 350); }}
            >
              <div className="scroll-soft relative z-10 flex flex-1 overflow-y-auto p-5 md:p-6">{Canvas}</div>
            </EditorShell>
          ) : (
            <div className="scroll-soft relative z-10 flex flex-1 overflow-y-auto p-5 md:p-6">{Canvas}</div>
          )}
          <p className="relative z-10 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center font-display text-sm italic text-muted">{!named && editable ? "Tell me your names — your design will bloom as we talk ✦" : <>{doc && KINDS[doc.kind].name} · {theme.name} — {theme.mood}</>}</p>
        </section>
      </div>

      <AnimatePresence>{busy && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-wine px-5 py-2.5 text-sm text-white shadow-xl"><span className="heartbeat mr-2 inline-block">♥</span>{busy}</motion.div>}</AnimatePresence>
      <AnimatePresence>{gallery && <Gallery profile={profile} mode={gallery.mode} initialKind={gallery.mode === "restyle" ? doc?.kind : occ === "greeting" ? "greeting" : "invite"} onPick={pick} onClose={() => setGallery(null)} />}</AnimatePresence>
      <AnimatePresence>
        {crop && <Cropper key={crop} src={`/api/media?key=${encodeURIComponent(crop)}&raw=1`} pieceAspect={pieceAspect} onDone={saveCrop} onClose={() => setCrop(null)} />}
        {panel && <SendPanel wedding={wedding} published={published} onPublish={async (v) => { if (await patchWedding({ published: v })) setPublished(v); }} onClose={() => setPanel(false)} realtimeUrl={realtimeUrl} capabilities={capabilities} />}
      </AnimatePresence>
    </div>
  );
}

function MaybeTilt({ on, children }: { on: boolean; children: React.ReactNode }) {
  return on ? <Tilt className="shrink-0">{children}</Tilt> : <div className="shrink-0">{children}</div>;
}
