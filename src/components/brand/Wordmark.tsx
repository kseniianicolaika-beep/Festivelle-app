import { BRAND } from "@/lib/brand";

// The Festivelle mark: a wax-seal monogram + an editorial wordmark whose "elle" leans into italic.
export function Seal({ className = "h-8 w-8", tone = "currentColor", gold = "var(--gold)" }: { className?: string; tone?: string; gold?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18.5" fill="none" stroke={gold} strokeWidth="1" />
      <g className="seal-spin">
        <circle cx="20" cy="20" r="15.2" fill="none" stroke={gold} strokeWidth=".6" strokeDasharray=".6 2.4" strokeLinecap="round" />
      </g>
      <text x="20" y="26.2" textAnchor="middle" fontFamily="var(--font-cormorant), Georgia, serif" fontStyle="italic" fontSize="19" fill={tone}>F</text>
      <path d="M27.4 10.6c-.7-.7-1.8-.6-2.3.2-.5-.8-1.6-.9-2.3-.2-.7.7-.6 1.7.1 2.4l2.2 2 2.2-2c.7-.7.8-1.7.1-2.4Z" fill="var(--rose)" />
    </svg>
  );
}

export function Wordmark({ className = "", size = "text-[1.7rem]", seal = true, sealClass = "", tone }: { className?: string; size?: string; seal?: boolean; sealClass?: string; tone?: string }) {
  const n = BRAND.name;
  const cut = /elle$/i.test(n) ? n.length - 4 : n.length;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} style={tone ? { color: tone } : undefined}>
      {seal && <Seal className={`h-[1.15em] w-[1.15em] shrink-0 text-[1.5rem] ${sealClass}`} />}
      <span className={`wordmark ${size}`}>{n.slice(0, cut)}<em>{n.slice(cut)}</em></span>
    </span>
  );
}
