import { nanoid } from "nanoid";
import { sql } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { canManage, roleIn, ROLES, type Role } from "@/lib/workspace";
import { appUrl } from "@/lib/guard";

type P = { params: Promise<{ wsId: string }> };

// Invite someone by email → returns a private join link (works for new and existing accounts).
export async function POST(req: Request, { params }: P) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { wsId } = await params;
  if (!canManage(await roleIn(user, wsId))) return Response.json({ error: "Only owners and admins can invite." }, { status: 403 });
  const { email, role } = await req.json();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return Response.json({ error: "Enter a valid email." }, { status: 400 });
  if (!(role in ROLES) || role === "owner") return Response.json({ error: "Choose a role." }, { status: 400 });
  const token = nanoid(32);
  await sql`INSERT INTO invites (token, workspace_id, email, role, invited_by) VALUES (${token}, ${wsId}, ${String(email).toLowerCase()}, ${role}, ${user.id})`;
  return Response.json({ link: `${appUrl(req)}/join/${token}` });
}

// Change a member's role or remove them.
export async function PATCH(req: Request, { params }: P) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { wsId } = await params;
  if (!canManage(await roleIn(user, wsId))) return Response.json({ error: "Not allowed" }, { status: 403 });
  const { userId, role } = (await req.json()) as { userId: string; role: Role | "remove" };
  const [target] = (await sql`SELECT role FROM members WHERE workspace_id = ${wsId} AND user_id = ${userId}`) as { role: Role }[];
  if (!target) return Response.json({ error: "Not a member" }, { status: 404 });
  if (target.role === "owner") return Response.json({ error: "The owner can't be changed." }, { status: 400 });
  if (role === "remove") await sql`DELETE FROM members WHERE workspace_id = ${wsId} AND user_id = ${userId}`;
  else if (role in ROLES && role !== "owner") await sql`UPDATE members SET role = ${role} WHERE workspace_id = ${wsId} AND user_id = ${userId}`;
  return Response.json({ ok: true });
}
