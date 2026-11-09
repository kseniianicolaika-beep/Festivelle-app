import { sql } from "@/lib/db";
import { requireAdminPage } from "@/lib/admin-guard";
import { AdminNav } from "../AdminNav";
import { setOrderStatus } from "../actions";

type O = { id: string; email: string | null; product: string; description: string; currency: string; amount_minor: number; list_minor: number; promo_code: string | null; partner: string | null; commission_minor: number; provider: string; status: string; created_at: string; paid_at: string | null };
const money = (minor: number, c: string) => `${(minor / 100).toLocaleString("en", { maximumFractionDigits: 2 })} ${c}`;

export default async function Orders() {
  const user = await requireAdminPage("/admin/orders");
  const orders = (await sql`SELECT o.*, p.name AS partner FROM orders o LEFT JOIN partners p ON p.id = o.partner_id ORDER BY o.created_at DESC LIMIT 500`) as O[];
  const totals = (await sql`SELECT currency, sum(amount_minor)::int AS revenue, sum(commission_minor)::int AS commission, count(*)::int AS n
    FROM orders WHERE status = 'paid' GROUP BY currency ORDER BY currency`) as { currency: string; revenue: number; commission: number; n: number }[];
  const byProduct = (await sql`SELECT split_part(product, '_', 1) AS kind, count(*)::int AS n FROM orders WHERE status = 'paid' GROUP BY 1 ORDER BY 2 DESC`) as { kind: string; n: number }[];
  return (
    <main className="grain relative min-h-dvh">
      <AdminNav active="orders" email={user.email} />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <h1 className="display text-5xl">Orders & <em className="text-rose">revenue</em></h1>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {totals.map((t) => (
            <div key={t.currency} className="glass rounded-3xl p-6">
              <p className="eyebrow text-muted">{t.currency} · {t.n} paid</p>
              <p className="display mt-2 text-4xl">{money(t.revenue, t.currency)}</p>
              <p className="text-xs text-muted">partner commission owed: {money(t.commission, t.currency)}</p>
            </div>
          ))}
          <div className="glass rounded-3xl p-6">
            <p className="eyebrow text-muted">Mix</p>
            <ul className="mt-2 text-sm">{byProduct.map((b) => <li key={b.kind}>{b.kind}: {b.n}</li>)}</ul>
          </div>
          {!totals.length && <p className="col-span-full text-muted">No paid orders yet.</p>}
        </div>
        <div className="glass mt-8 overflow-x-auto rounded-[28px]">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-muted"><tr className="border-b border-line">{["When", "Customer", "Item", "Amount", "Code / partner", "Provider", "Status"].map((h) => <th key={h} className="eyebrow px-4 py-3 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line/60">
                  <td className="px-4 py-3 text-muted">{new Date(o.created_at).toLocaleString("en-GB")}</td>
                  <td className="px-4 py-3">{o.email}</td>
                  <td className="px-4 py-3">{o.description}</td>
                  <td className="px-4 py-3">{money(o.amount_minor, o.currency)}{o.list_minor !== o.amount_minor && <span className="ml-1 text-xs text-muted line-through">{money(o.list_minor, o.currency)}</span>}</td>
                  <td className="px-4 py-3 text-xs">{o.promo_code}{o.partner ? ` · ${o.partner} (${money(o.commission_minor, o.currency)})` : ""}</td>
                  <td className="px-4 py-3">{o.provider}</td>
                  <td className="px-4 py-3">
                    <span className={o.status === "paid" ? "text-emerald-700" : o.status === "pending" ? "text-amber-700" : "text-muted"}>{o.status}</span>
                    {o.status === "paid" && o.amount_minor > 0 && (
                      <form action={setOrderStatus} className="inline"><input type="hidden" name="id" value={o.id} /><input type="hidden" name="status" value="refunded" /><button className="ml-2 text-[11px] text-muted underline" title="Marks as refunded here — issue the refund in the provider dashboard">mark refunded</button></form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

