import { notFound } from "next/navigation";
import { NewCelebrationView, type NewQuery } from "@/app/studio/new/View";
import type { Workspace } from "@/lib/workspace";

// DEV ONLY: the /studio/new experience without auth (the create action is a no-op). Same guard as /dev/template.
async function noop() {
  "use server";
}

export default async function DevStudioNew({ searchParams }: { searchParams: Promise<NewQuery & { agency?: string }> }) {
  if (process.env.NODE_ENV === "production" && process.env.DEV_PREVIEW !== "1") notFound();
  const q = await searchParams;
  const ws: Workspace = { id: "dev", name: q.agency ? "Goa Weddings Co." : "Anya’s studio", kind: q.agency ? "agency" : "personal", brand: {}, plan: "free", role: "owner" };
  return <NewCelebrationView q={q} current={ws} list={[ws]} email="preview@festivelle.dev" admin={false} create={noop} />;
}

export const instant = false;
