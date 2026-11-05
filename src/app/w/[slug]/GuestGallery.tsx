"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Photo = { id: string; key: string; uploader: string | null; caption: string | null };
const T = {
  en: { title: "Moments from our guests", share: "Share your photos", name: "Your name", sending: "Uploading…", thanks: "Thank you! Your photos will appear once the hosts approve them." },
  ru: { title: "Мгновения от гостей", share: "Поделитесь фото", name: "Ваше имя", sending: "Загружаем…", thanks: "Спасибо! Фото появятся после одобрения хозяев." },
  hi: { title: "मेहमानों के पल", share: "अपनी तस्वीरें साझा करें", name: "आपका नाम", sending: "अपलोड हो रहा है…", thanks: "धन्यवाद! मेज़बानों की स्वीकृति के बाद तस्वीरें दिखेंगी।" },
};

// Guest gallery: approved photos + (premium packages) a gentle upload that waits for the hosts' approval.
export function GuestGallery({ slug, canUpload, lang = "en", guestName }: { slug: string; canUpload: boolean; lang?: "en" | "ru" | "hi"; guestName?: string | null }) {
  const L = T[lang] ?? T.en;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [name, setName] = useState(guestName ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { fetch(`/api/guests/photos?slug=${encodeURIComponent(slug)}`).then((r) => r.json()).then((j) => setPhotos(j.photos ?? [])); }, [slug]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setStatus(L.sending);
    for (const f of Array.from(files).slice(0, 10)) {
      const r = await fetch("/api/guests/photos", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, contentType: f.type, size: f.size, uploader: name }) });
      const j = await r.json();
      if (!r.ok) { setStatus(j.error); return; }
      await fetch(j.url, { method: "PUT", headers: { "content-type": f.type }, body: f });
    }
    setStatus(L.thanks);
  }

  if (!photos.length && !canUpload) return null;
  return (
    <section className="bg-[var(--t-bg)] px-6 py-20 text-center text-[var(--t-ink)]">
      <p className="eyebrow text-[var(--t-muted)]">♡</p>
      <h2 className="display mt-2 text-4xl">{L.title}</h2>
      {photos.length > 0 && (
        <div className="mx-auto mt-10 max-w-5xl columns-2 gap-3 md:columns-3">
          {photos.map((p, i) => (
            <motion.figure key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.05 }} className="mb-3 break-inside-avoid overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/media?key=${encodeURIComponent(p.key)}`} alt={p.caption ?? ""} loading="lazy" className="w-full" />
              {p.uploader && <figcaption className="py-1.5 text-xs text-[var(--t-muted)]">— {p.uploader}</figcaption>}
            </motion.figure>
          ))}
        </div>
      )}
      {canUpload && (
        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={L.name} className="w-full border-b border-[var(--t-gold)]/50 bg-transparent py-3 text-center outline-none" />
          <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
          <button onClick={() => input.current?.click()} className="rounded-full bg-[var(--t-ink)] px-8 py-3.5 text-[12px] uppercase tracking-[0.3em] text-[var(--t-bg)]">{L.share}</button>
          {status && <p className="text-sm text-[var(--t-muted)]">{status}</p>}
        </div>
      )}
    </section>
  );
}
