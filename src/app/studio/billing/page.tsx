import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace } from "@/lib/workspace";
import { creditBalance } from "@/lib/commerce";
import { getPricing } from "@/lib/pricing";
import { Wash } from "@/components/fx/Wash";
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
    <main className="relative min-h-dvh overflow-x-clip">
      <Wash />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="billing" />
      <div className="relative z-10 mx-auto max-w-[1100px] px-5 pb-28 pt-10 md:px-10">
        <p className="kicker text-rose">Your account</p>
        <h1 className="t-h1 mt-4">Billing & <em className="text-rose">credits</em></h1>
        <p className="t-lede mt-4 max-w-xl">Designing is free. You pay once per celebration to publish — never a subscription.</p>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-line-strong bg-line-strong md:grid-cols-2">
          <div className="bg-paper/90 p-8">
            <p className="eyebrow text-muted">AI today</p>
            <p className="display mt-3 text-7xl font-light">{Math.max(P.credits.freeTextPerDay - usage[0].n, 0)}</p>
            <p className="text-sm text-muted">free messages left today (of {P.credits.freeTextPerDay})</p>
          </div>
          <div className="bg-paper/90 p-8">
            <p className="eyebrow text-muted">Credits</p>
            <p className="display mt-3 text-7xl font-light">{balance}</p>
            <BuyCredits packs={P.credits.packs} />
          </div>
        </div>
        <h2 className="t-h3 mt-16">Your purchases</h2>
        <div className="mt-5 divide-y divide-line-strong border-y border-line-strong">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-4 px-1 py-5 text-sm">
              <span className="font-display text-lg">{o.description}<span className="block text-xs text-muted">{new Date(o.created_at).toLocaleDateString()}</span></span>
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
