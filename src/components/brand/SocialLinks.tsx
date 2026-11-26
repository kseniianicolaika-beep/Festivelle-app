import { SOCIAL } from "@/lib/brand";

// Line icons shared with the marketing site's footer (Icon.astro).
const PATHS: Record<(typeof SOCIAL)[number]["id"], string> = {
  instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17.5 6.5h.01",
  facebook: "M14 21v-8h3l.5-3.5H14V7.5c0-1 .4-1.5 1.5-1.5H18V3h-3c-2.8 0-4 1.6-4 4v2.5H8V13h3v8",
  pinterest: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM10.5 9.5c.4-1.6 2.6-2.2 3.8-1 1.4 1.3.6 4.5-1.4 4.6-1.1 0-1.7-.8-1.5-1.6M11.4 11.5 9.5 20",
  linkedin: "M4 4h16v16H4ZM8 10v6M8 7.5h.01M11.5 16v-6M11.5 12.5c0-1.5 1-2.5 2.3-2.5 1.4 0 2.2 1 2.2 2.6V16",
  youtube: "M3 8.5c0-2 1-3 3-3.2 4-.4 8-.4 12 0 2 .2 3 1.2 3 3.2v7c0 2-1 3-3 3.2-4 .4-8 .4-12 0-2-.2-3-1.2-3-3.2ZM10 9v6l5-3Z",
  x: "M4 4h4.5L20 20h-4.5ZM20 4l-6.8 7.7M4 20l6.8-7.7",
};

/** A quiet row of Festivelle's social profiles. Colour comes from the parent (currentColor). */
export function SocialLinks({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {SOCIAL.map((s) => (
        <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`Festivelle on ${s.label}`} title={s.label} className="rounded-full p-1.5 opacity-70 transition hover:opacity-100">
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={PATHS[s.id]} /></svg>
        </a>
      ))}
    </div>
  );
}
