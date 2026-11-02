import { currentUser } from "@/lib/auth/server";
import { createWorkspace, setActiveWorkspace, roleIn } from "@/lib/workspace";

// Create a workspace (e.g. an agency) — the creator becomes its owner. One email can own or join many.
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const name = String(b.name ?? "").trim().slice(0, 80);
  if (!name) return Response.json({ error: "Give your workspace a name." }, { status: 400 });
  const id = await createWorkspace(user, name, b.kind === "agency" ? "agency" : "personal");
  await setActiveWorkspace(id);
  return Response.json({ id });
}

// Switch the active workspace.
export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!(await roleIn(user, String(id)))) return Response.json({ error: "Not a member" }, { status: 403 });
  await setActiveWorkspace(id);
  return Response.json({ ok: true });
}
