import Link from "next/link";
import { BRAND } from "@/lib/brand";

const TABS = [
  ["overview", "/admin", "Celebrations"],
  ["orders", "/admin/orders", "Orders & revenue"],
  ["pricing", "/admin/pricing", "Pricing & packages"],
  ["promos", "/admin/promos", "Promo codes"],
  ["partners", "/admin/partners", "Partners"],
] as const;

export function AdminNav({ active, email }: { active: (typeof TABS)[number][0]; email: string }) {
  return (
    <nav className="relative z-10 mx-auto max-w-7xl px-6 pt-7">
      <div className="flex items-center justify-between">
        <Link href="/studio" className="display text-2xl">{BRAND.name}</Link>
        <span className="rounded-full bg-wine px-3.5 py-1.5 text-xs tracking-widest text-[#fbeee6]">ADMIN · {email}</span>
      </div>
      <div className="mt-6 flex gap-1 overflow-x-auto">
        {TABS.map(([id, href, label]) => (
          <Link key={id} href={href} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${active === id ? "bg-wine text-[#fbeee6] shadow-md" : "text-muted hover:bg-white/60 hover:text-ink"}`}>{label}</Link>
        ))}
      </div>
    </nav>
  );
}
