"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { TemplateDef } from "@/lib/catalog";
import { themeById } from "@/lib/themes";
import { LiveTemplate } from "../Live";

type Row = { id: string; name: string; blurb: string; count: number; t: TemplateDef };

// An editorial index of occasions. On desktop a live invitation follows the cursor and plays as you move between rows.
export function OccasionIndex({ rows, designs }: { rows: Row[]; designs: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const float = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let id = 0;
    const on = (e: PointerEvent) => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * (reduce ? 1 : 0.14);
      p.y += (p.ty - p.y) * (reduce ? 1 : 0.14);
      if (float.current) float.current.style.transform = `translate3d(${p.x + 28}px, ${p.y - 150}px, 0) rotate(${((p.tx - p.x) * 0.04).toFixed(2)}deg)`;
      id = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", on, { passive: true });
    id = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", on); cancelAnimationFrame(id); };
  }, []);
  return (
    <div className="relative" onPointerLeave={() => setHover(null)}>
      <ul className="border-t border-line-strong">
        {rows.map((r, i) => (
          <li key={r.id} onPointerEnter={() => setHover(i)} className="border-b border-line-strong">
            <Link href={`/templates?occasion=${r.id}`} className="group grid grid-cols-[2.4rem_1fr_auto] items-center gap-3 py-6 transition-[padding] duration-700 ease-[var(--ease-expo)] md:grid-cols-[4rem_1fr_1fr_auto] md:py-8 md:hover:pl-4">
              <span className="num text-lg text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-h2 transition-colors duration-500 group-hover:text-rose">{r.name}</span>
              <span className="hidden max-w-sm text-sm text-muted md:block">{r.blurb}</span>
              <span className="flex items-center gap-3 text-sm text-muted">
                <span className="hidden sm:inline">{r.count} {designs}</span>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:border-wine group-hover:bg-wine group-hover:text-white">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={float} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[230px] md:block">
        {rows.map((r, i) => (
          <div key={r.id} className={`absolute inset-x-0 top-0 transition-all duration-500 ease-[var(--ease-expo)] ${hover === i ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
            {hover === i && (
              <div className="rounded-[4px] p-4" style={{ background: themeById(r.t.theme).bg }}>
                <div className="poster-shadow overflow-hidden rounded-[2px]"><LiveTemplate t={r.t} play="mount" replayOnHover={false} /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
