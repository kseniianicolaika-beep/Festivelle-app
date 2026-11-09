import Link from "next/link";
import { notFound } from "next/navigation";
import { Music } from "@/templates/_kit/Music";
import { MUSIC_NAMES } from "@/templates/_kit/music-meta";
import type { MusicId } from "@/templates/types";

// DEV ONLY: audition every generative score. /dev/music?id=sitar-dawn
export default async function DevMusic({ searchParams }: { searchParams: Promise<{ id?: string; lang?: string }> }) {
  if (process.env.NODE_ENV === "production" && process.env.DEV_PREVIEW !== "1") notFound();
  const sp = await searchParams;
  const ids = Object.keys(MUSIC_NAMES) as MusicId[];
  const id = ids.includes(sp.id as MusicId) ? (sp.id as MusicId) : ids[0];
  return (
    <main className="grain min-h-dvh bg-ivory px-6 py-16">
      <p className="kicker text-rose">Generative scores</p>
      <h1 className="t-h1 mt-4">{MUSIC_NAMES[id]}</h1>
      <p className="t-lede mt-3 max-w-lg">Composed live with WebAudio — tap the toggle in the corner. Every play is different.</p>
      <ul className="mt-10 flex flex-wrap gap-2">
        {ids.map((m) => <li key={m}><Link href={`/dev/music?id=${m}`} className={`rounded-full px-4 py-2 text-sm ${m === id ? "bg-wine text-white" : "bg-white/70"}`}>{MUSIC_NAMES[m]}</Link></li>)}
      </ul>
      <Music key={id} id={id} lang={sp.lang} />
    </main>
  );
}
