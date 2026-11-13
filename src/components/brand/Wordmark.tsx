import { BRAND } from "@/lib/brand";

// The Festivelle logo — identical to festivelle.love (web-times src/components/Brand.astro):
// the wordmark in Parisienne, wine ink #7a1c33, with the outlined heart sitting top-right.
const INK = "#7a1c33";

/** The outlined heart from the logo. Used alone where there is no room for the wordmark. */
export function Heart({ className = "h-[24px] w-[26px]", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 32 30" className={className} style={style} aria-hidden>
      <path d="M16 27C7 20.5 3 15.6 3 10.4 3 6.3 6.1 3.4 9.7 3.4c2.6 0 4.8 1.4 6.3 3.6 1.5-2.2 3.7-3.6 6.3-3.6 3.6 0 6.7 2.9 6.7 7 0 5.2-4 10.1-13 16.6Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20.5 6.5c2.5.3 4.4 2 4.6 4.6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Compact mark (the logo heart) — kept under the old name so existing call sites keep working. */
export function Seal({ className = "h-8 w-8", tone = INK }: { className?: string; tone?: string; gold?: string }) {
  return <span className={`inline-flex items-center justify-center ${className}`} style={{ color: tone }}><Heart className="h-[75%] w-[81%]" /></span>;
}

/** `size` is the font size of the wordmark (the website header uses 2.05rem); the heart scales with it. */
export function Wordmark({ className = "", size = "text-[2.05rem]", tone }: { className?: string; size?: string; seal?: boolean; sealClass?: string; tone?: string }) {
  return (
    <span className={`brand inline-flex items-start gap-[2px] leading-none ${size} ${className}`} style={{ color: tone || INK }}>
      <span className="brand-word">{BRAND.name}</span>
      <Heart className="brand-heart" />
    </span>
  );
}
