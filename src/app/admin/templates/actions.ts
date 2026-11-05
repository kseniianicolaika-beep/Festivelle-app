"use server";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin-guard";
import { saveTemplateAdmin } from "@/lib/template-admin";

export async function saveTemplatesAction(json: string) {
  const admin = await requireAdminAction();
  const saved = await saveTemplateAdmin(JSON.parse(json), admin.email);
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
  revalidatePath("/");
  return saved;
}
