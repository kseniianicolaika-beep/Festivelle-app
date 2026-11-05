import { requireAdminPage } from "@/lib/admin-guard";
import { CATALOG } from "@/lib/catalog";
import { getTemplateAdmin } from "@/lib/template-admin";
import { AdminNav } from "../AdminNav";
import { TemplatesEditor } from "./TemplatesEditor";

export default async function TemplatesAdmin() {
  const user = await requireAdminPage("/admin/templates");
  const admin = await getTemplateAdmin();
  const list = CATALOG.map((t) => ({ id: t.id, name: t.name, occasion: t.occasion, theme: t.theme, tier: t.tier }));
  return (
    <main className="grain relative min-h-dvh">
      <AdminNav active="templates" email={user.email} />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <h1 className="display text-5xl">Template <em className="text-rose">curation</em></h1>
        <p className="mt-3 max-w-2xl text-muted">Feature designs on the homepage, hide any from the public catalog, set the order, and build seasonal collections (Diwali, New Year, wedding season…) with optional start/end dates. Changes go live on save.</p>
        <TemplatesEditor list={list} initial={admin} />
      </div>
    </main>
  );
}

export const instant = false;
