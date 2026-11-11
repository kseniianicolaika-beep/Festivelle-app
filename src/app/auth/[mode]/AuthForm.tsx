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

  // Switching between sign-in and sign-up keeps ?next= (e.g. a template chosen on festivelle.love).
  const keepNext = (e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.assign(e.currentTarget.pathname + window.location.search); };

  async function google() {
    setPending(true);
    const next = new URLSearchParams(window.location.search).get("next");
    const res = await authClient.signIn.social({ provider: "google", callbackURL: next?.startsWith("/") ? next : "/studio" });
    if (res?.error) { setError(res.error.message ?? "Google sign-in failed"); setPending(false); }
  }

  return (
    <form action={onSubmit} className="mt-9 space-y-3">
      <button type="button" onClick={google} disabled={pending} className="btn btn-ghost w-full !py-3.5">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12Z" /></svg>
        Continue with Google
      </button>
      <div className="flex items-center gap-3 py-2 text-[11px] uppercase tracking-[0.25em] text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      {mode === "sign-up" && <input name="name" placeholder="Your name" className="field" autoComplete="name" />}
      <input name="email" type="email" required placeholder="Email" className="field" autoComplete="email" />
      <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" className="field" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} />
      {mode === "sign-in" && <p className="text-right text-xs"><Link className="text-muted underline hover:text-ink" href="/auth/forgot-password">Forgot password?</Link></p>}
      {error && <p role="alert" className="text-sm text-rose">{error}</p>}
      <button disabled={pending} className="btn btn-dark w-full disabled:opacity-60">{pending ? "One moment…" : mode === "sign-up" ? "Create account" : "Sign in"}</button>
      <p className="pt-4 text-center text-sm text-muted">
        {mode === "sign-up" ? <>Already have an account? <Link className="text-ink underline" href="/auth/sign-in" onClick={keepNext}>Sign in</Link></> : <>New here? <Link className="text-ink underline" href="/auth/sign-up" onClick={keepNext}>Create an account</Link></>}
      </p>
    </form>
  );
}
