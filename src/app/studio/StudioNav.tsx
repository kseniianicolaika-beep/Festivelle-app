import Link from "next/link";
import type { Workspace } from "@/lib/workspace";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import { Wordmark } from "@/components/brand/Wordmark";
import { SignOut } from "./SignOut";

const TABS = [
  { id: "weddings", href: "/studio", label: "Celebrations" },
  { id: "library", href: "/studio/library", label: "Library" },
  { id: "settings", href: "/studio/settings", label: "Workspace" },
  { id: "billing", href: "/studio/billing", label: "Billing" },
  { id: "partners", href: "/partners", label: "Vendors" },
] as const;

// The studio's quiet masthead: wordmark + workspace on the left, a hairline tab rail, account on the right.
export function StudioNav({ current, list, email, admin, active }: { current: Workspace; list: Workspace[]; email: string; admin: boolean; active: (typeof TABS)[number]["id"] }) {
  return (
    <nav className="relative z-30 mx-auto max-w-[1320px] px-5 pt-5 md:px-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/studio" className="hidden shrink-0 sm:block" aria-label="Studio home"><Wordmark size="text-[1.6rem]" /></Link>
          <span className="hidden h-6 w-px bg-line-strong sm:block" />
          <WorkspaceSwitcher current={current} list={list} />
        </div>
        <div className="flex items-center gap-3 text-[13px] text-muted">
          {admin && <Link href="/admin" className="rounded-full border border-wine/30 px-3 py-1 text-[10px] tracking-[.24em] text-wine transition hover:bg-wine hover:text-[#fbeee6]">ADMIN</Link>}
          <span className="hidden max-w-[220px] truncate lg:inline">{email}</span>
          <SignOut />
        </div>
      </div>
      <div className="scroll-hide mt-5 flex gap-7 overflow-x-auto border-b border-line-strong">
        {TABS.map((t) => (
          <Link key={t.id} href={t.href} className={`relative whitespace-nowrap pb-3 text-[13.5px] transition ${active === t.id ? "text-ink" : "text-muted hover:text-ink"}`}>
            {t.label}
            {active === t.id && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-wine" />}
          </Link>
        ))}
      </div>
    </nav>
  );
}
