"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";

const NUMBER = "917218678536"; // Support concierge (WhatsApp)
const TOPICS = [
  { label: "Help with my design", icon: "✦" },
  { label: "Plans & pricing", icon: "♡" },
  { label: "I'm a wedding agency", icon: "❧" },
  { label: "Something isn't working", icon: "❀" },
];

const open = (text: string) => window.open(`https://wa.me/${NUMBER}?text=${encodeURIComponent(`♥ ${text}\n\n— sent from ${BRAND.name}`)}`, "_blank", "noopener");

// A beating heart that opens a private line to our human concierge.
export const openSupport = () => window.dispatchEvent(new Event("open-support"));

export function SupportHeart({ lift = false }: { lift?: boolean }) {
  const [show, setShow] = useState(false);
  const [note, setNote] = useState("");
  // In the wedding editor on phones the chat owns the bottom edge — the header heart opens this instead.
  const editor = /^\/studio\/[0-9a-f-]{36}/.test(usePathname() ?? "");
  useEffect(() => {
    const on = () => setShow(true);
    window.addEventListener("open-support", on);
    return () => window.removeEventListener("open-support", on);
  }, []);
  return (
    <div className={`no-print fixed right-4 z-[70] md:right-6 ${editor ? (show ? "bottom-4 md:bottom-6" : "bottom-6 max-md:pointer-events-none max-md:opacity-0 md:bottom-6") : lift ? "bottom-24 md:bottom-6" : "bottom-5 md:bottom-6"}`}>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="absolute bottom-[76px] right-0 w-[min(88vw,340px)] origin-bottom-right overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#5a1a2e,#2a1a1f)] text-[#fbeee6] shadow-[0_40px_80px_-30px_rgba(74,20,36,.8)]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#c06c78]/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#c5a06a]/30 blur-3xl" />
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#f1dcb3]/80">Wedding concierge</p>
                  <p className="display mt-2 text-[1.9rem] leading-tight">Hello, <em className="text-[#f3b8c0]">lovebirds</em></p>
                </div>
                <button onClick={() => setShow(false)} aria-label="Close" className="-mr-1 -mt-1 rounded-full p-1.5 text-[#fbeee6]/60 transition hover:bg-white/10 hover:text-white">✕</button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#fbeee6]/75">A real person from our Goa team will answer — usually within minutes.</p>
              <div className="mt-5 grid gap-2">
                {TOPICS.map((t, i) => (
                  <motion.button key={t.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }} onClick={() => open(t.label)} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm transition hover:border-[#f1dcb3]/40 hover:bg-white/10">
                    <span className="text-[#f1dcb3]">{t.icon}</span>
                    <span className="flex-1">{t.label}</span>
                    <span className="translate-x-0 opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100">→</span>
                  </motion.button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (note.trim()) open(note.trim()); }} className="mt-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 pl-4">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Or write to us…" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40" />
                <button disabled={!note.trim()} className="rounded-full bg-[#f1dcb3] px-4 py-2 text-xs font-medium tracking-wide text-[#3a0f1c] transition disabled:opacity-40">Send ♥</button>
              </form>
              <p className="mt-3 text-center text-[10.5px] text-[#fbeee6]/45">Opens a private chat with our team</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setShow((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Talk to our wedding concierge"
        className="group relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#e58a98,#a8344f_55%,#5a1a2e)] shadow-[0_18px_40px_-12px_rgba(168,52,79,.75)]"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#e58a98]/30 [animation-duration:2.6s]" />
        <span className="absolute -inset-1.5 rounded-full border border-[#e58a98]/30" />
        <AnimatePresence mode="wait" initial={false}>
          {show ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-xl text-white">✕</motion.span>
          ) : (
            <motion.svg key="h" viewBox="0 0 24 24" className="heartbeat relative h-7 w-7" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" fill="#fff6f0" />
            </motion.svg>
          )}
        </AnimatePresence>
        {!show && <span className="pointer-events-none absolute right-[72px] hidden whitespace-nowrap rounded-full bg-white/90 px-3.5 py-1.5 text-xs text-wine opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100 md:block">Need a hand? We&apos;re here ♥</span>}
      </motion.button>
    </div>
  );
}
