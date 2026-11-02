"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(form: FormData) {
    setPending(true);
    setError(null);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const res =
      mode === "sign-up"
        ? await authClient.signUp.email({ email, password, name: String(form.get("name") || email.split("@")[0]) })
        : await authClient.signIn.email({ email, password });
    if (res.error) {
      setError(res.error.message ?? "Something went wrong");
      setPending(false);
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.href = next?.startsWith("/") ? next : "/studio";
  }

  return (
    <form action={onSubmit} className="mt-10 space-y-3">
      {mode === "sign-up" && <input name="name" placeholder="Your name" className="field" autoComplete="name" />}
      <input name="email" type="email" required placeholder="Email" className="field" autoComplete="email" />
      <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" className="field" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} />
      {error && <p role="alert" className="text-sm text-rose">{error}</p>}
      <button disabled={pending} className="btn btn-dark w-full disabled:opacity-60">{pending ? "One moment…" : mode === "sign-up" ? "Create account" : "Sign in"}</button>
      <p className="pt-4 text-center text-sm text-muted">
        {mode === "sign-up" ? <>Already have an account? <Link className="text-ink underline" href="/auth/sign-in">Sign in</Link></> : <>New here? <Link className="text-ink underline" href="/auth/sign-up">Create an account</Link></>}
      </p>
    </form>
  );
}
