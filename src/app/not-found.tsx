import Link from "next/link";
import { SITE_URL } from "@/lib/brand";
import { Wordmark } from "@/components/brand/Wordmark";

export default function NotFound() {
  return (
    <main className="grain flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center">
      <a href={SITE_URL} aria-label="Festivelle"><Wordmark /></a>
      <h1 className="display mt-10 max-w-xl text-5xl leading-tight">This page has <em className="text-rose">wandered off</em></h1>
      <p className="mt-5 max-w-md text-muted">The link may be old, or the celebration may have moved.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/studio" className="btn btn-dark">Your studio<span className="btn-arrow">→</span></Link>
        <a href={SITE_URL} className="btn btn-ghost">Browse festivelle.love</a>
      </div>
    </main>
  );
}
