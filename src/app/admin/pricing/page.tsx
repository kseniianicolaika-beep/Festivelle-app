import { requireAdminPage } from "@/lib/admin-guard";
import { getPricing, DEFAULT_PRICING } from "@/lib/pricing";
import { AdminNav } from "../AdminNav";
import { PricingEditor } from "./PricingEditor";

export default async function PricingAdmin() {
  const user = await requireAdminPage("/admin/pricing");
  const pricing = await getPricing();
  return (
    <main className="grain relative min-h-dvh">
      <AdminNav active="pricing" email={user.email} />
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-8">
        <h1 className="display text-5xl">Pricing & <em className="text-rose">packages</em></h1>
        <p className="mt-3 max-w-2xl text-muted">Every price (USD, INR, RUB), package feature, hosting rule, extension, video tier, AI allowance and partner fee. Changes apply immediately to new checkouts — no code changes needed.</p>
        <PricingEditor initial={pricing} defaults={DEFAULT_PRICING} />
      </div>
    </main>
  );
}

