"use server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth/server";
import { setEmailPrefs } from "@/lib/lifecycle";

export async function saveEmailPrefs(form: FormData) {
  const user = await currentUser();
  if (!user?.email) return;
  await setEmailPrefs(user.email, { unsubscribed: form.get("reminders") !== "on", anniversary: form.get("anniversary") === "on" });
  revalidatePath("/studio/settings");
}
