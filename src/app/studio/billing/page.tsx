import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace } from "@/lib/workspace";
import { creditBalance } from "@/lib/commerce";
import { getPricing } from "@/lib/pricing";
import { Aurora } from "@/components/fx/Aurora";
import { StudioNav } from "../StudioNav";
import { BuyCredits } from "./BuyCredits";

type O = { id: string; description: string; currency: string; amount_minor: number; status: string; created_at: string };

export default async function Billing() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/billing");
  const { current, list } = await activeWorkspace(user);
  const [balance, P, orders, usage] = await Promise.all([
    creditBalance(user.id),
    getPricing(),
    sql`SELECT id, description, currency, amount_minor, status, created_at FROM orders WHERE user_id = ${user.id} AND status <> 'failed' ORDER BY created_at DESC LIMIT 50` as unknown as Promise<O[]>,
    sql`SELECT COALESCE(SUM(n),0)::int AS n FROM ai_usage WHERE user_id = ${user.id} AND kind = 'text' AND day = current_date` as unknown as Promise<{ n: number }[]>,
  ]);
  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="billing" />
      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-28 pt-8 md:px-6">
        <h1 className="display text-5xl">Billing & <em className="text-rose">credits</em></h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-3xl p-6">
            <p className="eyebrow text-muted">AI today</p>
            <p className="display mt-2 text-5xl">{Math.max(P.credits.freeTextPerDay - usage[0].n, 0)}</p>
            <p className="text-sm text-muted">free messages left today (of {P.credits.freeTextPerDay})</p>
          </div>
          <div className="glass rounded-3xl p-6">
            <p className="eyebrow text-muted">Credits</p>
            <p className="display mt-2 text-5xl">{balance}</p>
            <BuyCredits packs={P.credits.packs} />
          </div>
        </div>
        <h2 className="display mt-12 text-3xl">Your purchases</h2>
        <div className="glass mt-4 divide-y divide-line rounded-3xl">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
              <span>{o.description}<span className="block text-xs text-muted">{new Date(o.created_at).toLocaleDateString()}</span></span>
              <span className="text-right">{(o.amount_minor / 100).toLocaleString()} {o.currency}<span className={`block text-xs ${o.status === "paid" ? "text-emerald-700" : "text-muted"}`}>{o.status}</span></span>
            </div>
          ))}
          {!orders.length && <p className="px-5 py-8 text-center text-muted">Nothing yet — designing is free.</p>}
        </div>
      </div>
    </main>
  );
}

export const instant = false;
