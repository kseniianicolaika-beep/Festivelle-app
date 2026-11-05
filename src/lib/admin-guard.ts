import { notFound, redirect } from "next/navigation";
import { currentUser } from "./auth/server";
import { isAdmin } from "./admin";

export async function requireAdminPage(next: string) {
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=${next}`);
  if (!isAdmin(user)) notFound();
  return user;
}

export async function requireAdminAction() {
  const user = await currentUser();
  if (!user || !isAdmin(user)) throw new Error("Not allowed");
  return user;
}
