import Link from "next/link";
import { BRAND } from "@/lib/brand";
import type { Workspace } from "@/lib/workspace";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import { Heart } from "@/components/fx/Heart";
import { SignOut } from "./SignOut";

const TABS = [
  { id: "weddings", href: "/studio", label: "Weddings" },
  { id: "library", href: "/studio/library", label: "Library" },
  { id: "settings", href: "/studio/settings", label: "Workspace" },
] as const;

export function StudioNav({ current, list, email, admin, active }: { current: Workspace; list: Workspace[]; email: string; admin: boolean; active: (typeof TABS)[number]["id"] }) {
  return (
    <nav className="relative z-30 mx-auto max-w-6xl px-5 pt-5 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/studio" className="display hidden items-center gap-2 text-2xl sm:flex"><Heart className="heartbeat h-3.5 w-3.5" color="var(--rose)" />{BRAND.name}</Link>
          <WorkspaceSwitcher current={current} list={list} />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          {admin && <Link href="/admin" className="rounded-full bg-wine px-3 py-1.5 text-[11px] tracking-widest text-[#fbeee6]">ADMIN</Link>}
          <span className="hidden lg:inline">{email}</span>
          <SignOut />
        </div>
      </div>
      <div className="mt-5 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <Link key={t.id} href={t.href} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${active === t.id ? "bg-wine text-[#fbeee6] shadow-md" : "text-muted hover:bg-white/60 hover:text-ink"}`}>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
