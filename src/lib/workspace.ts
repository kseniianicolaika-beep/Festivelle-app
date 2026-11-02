import { cookies } from "next/headers";
import { sql } from "./db";
import { isAdmin } from "./admin";

export type Role = "owner" | "admin" | "designer" | "client" | "family";
export const ROLES: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin — manage team & settings",
  designer: "Designer — create and edit",
  client: "Client — view & request changes",
  family: "Family — view only",
};
export const canEdit = (r?: Role | null) => r === "owner" || r === "admin" || r === "designer";
export const canManage = (r?: Role | null) => r === "owner" || r === "admin";

export type Brand = { name?: string; logoKey?: string; accent?: string; credit?: "show" | "agency" | "hidden" };
export type Workspace = { id: string; name: string; kind: "personal" | "agency"; brand: Brand; plan: string; role: Role };

type U = { id: string; email: string; name?: string | null; emailVerified?: boolean | null; role?: string | null };
const COOKIE = "ws";

export async function listWorkspaces(user: U) {
  return (await sql`
    SELECT w.id, w.name, w.kind, w.brand, w.plan, m.role FROM members m JOIN workspaces w ON w.id = m.workspace_id
    WHERE m.user_id = ${user.id} ORDER BY w.kind = 'personal' DESC, w.created_at`) as Workspace[];
}

export async function createWorkspace(user: U, name: string, kind: "personal" | "agency") {
  const [w] = (await sql`
    WITH w AS (INSERT INTO workspaces (name, kind, created_by) VALUES (${name}, ${kind}, ${user.id}) RETURNING id)
    INSERT INTO members (workspace_id, user_id, email, role) SELECT id, ${user.id}, ${user.email.toLowerCase()}, 'owner' FROM w RETURNING workspace_id`) as { workspace_id: string }[];
  return w.workspace_id;
}

// Every signed-in user always has at least a personal workspace.
export async function ensureWorkspaces(user: U) {
  let list = await listWorkspaces(user);
  if (!list.length) {
    await createWorkspace(user, `${user.name || user.email.split("@")[0]}'s weddings`, "personal");
    list = await listWorkspaces(user);
  }
  return list;
}

export async function activeWorkspace(user: U) {
  const list = await ensureWorkspaces(user);
  const wanted = (await cookies()).get(COOKIE)?.value;
  const current = list.find((w) => w.id === wanted) ?? list[0];
  return { current, list };
}

export async function setActiveWorkspace(id: string) {
  (await cookies()).set(COOKIE, id, { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });
}

export async function roleIn(user: U, workspaceId: string): Promise<Role | null> {
  if (!/^[0-9a-f-]{36}$/i.test(workspaceId)) return null;
  const r = (await sql`SELECT role FROM members WHERE workspace_id = ${workspaceId} AND user_id = ${user.id}`) as { role: Role }[];
  return r[0]?.role ?? (isAdmin(user) ? "owner" : null);
}
