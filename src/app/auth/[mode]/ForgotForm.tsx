"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

// Password recovery: Neon Auth emails a one-time code (delivered by Sequenzy via /api/email/auth-webhook),
// the user enters it with a new password, then signs in.
export function ForgotForm() {
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function sendCode(form: FormData) {
    setPending(true); setError(null);
    const e = String(form.get("email")).trim();
    const res = await authClient.emailOtp.sendVerificationOtp({ email: e, type: "forget-password" });
    setPending(false);
    if (res.error) return setError(res.error.message ?? "We couldn't send the code — try again.");
    setEmail(e); setStep("code");
  }

  async function reset(form: FormData) {
    setPending(true); setError(null);
    const res = await authClient.emailOtp.resetPassword({ email, otp: String(form.get("otp")).trim(), password: String(form.get("password")) });
    setPending(false);
    if (res.error) return setError(res.error.message ?? "That code didn't work — check it or request a new one.");
    setStep("done");
  }

  if (step === "done") return (
    <div className="mt-9 space-y-4 text-center">
      <p className="text-sm text-ink-soft">Your password has been changed.</p>
      <Link href="/auth/sign-in" className="btn btn-dark w-full">Sign in</Link>
    </div>
  );

  return step === "email" ? (
    <form action={sendCode} className="mt-9 space-y-3">
      <input name="email" type="email" required placeholder="Email" className="field" autoComplete="email" />
      {error && <p role="alert" className="text-sm text-rose">{error}</p>}
      <button disabled={pending} className="btn btn-dark w-full disabled:opacity-60">{pending ? "One moment…" : "Email me a code"}</button>
      <p className="pt-4 text-center text-sm text-muted">Remembered it? <Link className="text-ink underline" href="/auth/sign-in">Sign in</Link></p>
    </form>
  ) : (
    <form action={reset} className="mt-9 space-y-3">
      <p className="text-center text-sm text-muted">We sent a code to <span className="text-ink">{email}</span>.</p>
      <input name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required placeholder="6-digit code" className="field text-center tracking-[0.5em]" autoComplete="one-time-code" />
      <input name="password" type="password" required minLength={8} placeholder="New password (8+ characters)" className="field" autoComplete="new-password" />
      {error && <p role="alert" className="text-sm text-rose">{error}</p>}
      <button disabled={pending} className="btn btn-dark w-full disabled:opacity-60">{pending ? "One moment…" : "Set new password"}</button>
      <button type="button" onClick={() => { setStep("email"); setError(null); }} className="w-full pt-2 text-center text-xs text-muted underline">Use a different email or resend</button>
    </form>
  );
}
