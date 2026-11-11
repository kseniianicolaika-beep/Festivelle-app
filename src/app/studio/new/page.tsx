import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canEdit } from "@/lib/workspace";
import { createCelebration, editorUrl } from "@/lib/create";
import { NewCelebrationView, type NewQuery } from "./View";

// Create a celebration from the catalog: occasion + (optional) template, then straight into the right editor.
async function create(form: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/new");
  const { current } = await activeWorkspace(user);
  if (!canEdit(current.role)) redirect("/studio");
  const id = await createCelebration({ workspaceId: current.id, ownerId: user.id, template: String(form.get("template") ?? ""), occasion: String(form.get("occasion") ?? ""), client: String(form.get("client") ?? "") });
  redirect(editorUrl(id, { product: String(form.get("product") ?? ""), tier: String(form.get("tier") ?? "") }));
}

export default async function NewCelebration({ searchParams }: { searchParams: Promise<NewQuery> }) {
  const q = await searchParams;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=${encodeURIComponent(`/studio/new?${new URLSearchParams(Object.entries(q).filter(([, v]) => typeof v === "string") as [string, string][])}`)}`);
  const { current, list } = await activeWorkspace(user);
  if (!canEdit(current.role)) redirect("/studio");
  return <NewCelebrationView q={q} current={current} list={list} email={user.email} admin={isAdmin(user)} create={create} />;
}

