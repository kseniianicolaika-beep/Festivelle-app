import { notFound } from "next/navigation";
import { AuthForm } from "./AuthForm";
import { BRAND } from "@/lib/brand";
import Link from "next/link";

export function generateStaticParams() {
  return [{ mode: "sign-in" }, { mode: "sign-up" }];
}

export default async function AuthPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  if (mode !== "sign-in" && mode !== "sign-up") notFound();
  return (
    <main className="grain flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="display block text-center text-3xl">{BRAND.name}</Link>
        <p className="mt-2 text-center text-sm text-muted">{mode === "sign-up" ? "Create your account to save your designs." : "Welcome back."}</p>
        <AuthForm mode={mode} />
      </div>
    </main>
  );
}
