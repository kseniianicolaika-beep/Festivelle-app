import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Heart } from "@/components/fx/Heart";

export function SiteNav({ signedIn = false, cta = "Begin free" }: { signedIn?: boolean; cta?: string }) {
  return (
    <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-6">
      <Link href="/" className="display flex items-center gap-2 text-2xl"><Heart className="heartbeat h-3.5 w-3.5" color="var(--rose)" />{BRAND.name}</Link>
      <div className="flex items-center gap-1 text-sm md:gap-5">
        <Link href="/templates" className="hidden text-muted hover:text-ink sm:inline">Templates</Link>
        <Link href="/pricing" className="hidden text-muted hover:text-ink sm:inline">Pricing</Link>
        <Link href="/partners" className="hidden text-muted hover:text-ink md:inline">Vendors</Link>
        <Link href={signedIn ? "/studio" : "/studio/new"} className="btn btn-dark !px-4 !py-2">{signedIn ? "Your studio" : cta}</Link>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line/70 py-10 text-center text-sm text-muted">
      <p className="script text-2xl text-rose">with love, from Goa</p>
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
        <Link href="/templates">Templates</Link>
        <Link href="/invitations/wedding-invitations">Wedding invitations</Link>
        <Link href="/invitations/russian-wedding-invitations">Свадебные приглашения</Link>
        <Link href="/invitations/birthday-invitations">Birthday invitations</Link>
        <Link href="/invitations/baby-shower-invitations">Baby showers</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/partners">Vendors</Link>
      </div>
      <p className="mt-5 text-xs">© {new Date().getFullYear()} {BRAND.name}</p>
    </footer>
  );
}
