"use client";
import { authClient } from "@/lib/auth/client";

export function SignOut() {
  return (
    <button onClick={async () => { await authClient.signOut(); window.location.href = "/auth/sign-in"; }} className="underline-offset-4 hover:text-wine hover:underline">
      Sign out
    </button>
  );
}
