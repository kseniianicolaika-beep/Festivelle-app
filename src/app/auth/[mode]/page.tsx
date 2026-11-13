import { notFound } from "next/navigation";
import { AuthForm } from "./AuthForm";
import { ForgotForm } from "./ForgotForm";
import { BRAND, SITE_URL } from "@/lib/brand";
import { Aurora } from "@/components/fx/Aurora";
import { Petals } from "@/components/fx/Petals";
import { Sparkles } from "@/components/fx/Sparkles";
import { Verses } from "@/components/fx/Verses";
import { Wordmark } from "@/components/brand/Wordmark";
import Link from "next/link";

export function generateStaticParams() {
  return [{ mode: "sign-in" }, { mode: "sign-up" }, { mode: "forgot-password" }];
}

export default async function AuthPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  if (mode !== "sign-in" && mode !== "sign-up" && mode !== "forgot-password") notFound();
  return (
    <main className="grain relative grid min-h-dvh lg:grid-cols-[1.15fr_1fr]">
      {/* Romance panel */}
      <section className="noir relative hidden overflow-hidden p-14 lg:flex lg:flex-col lg:justify-between">
        <Aurora colors={["#c06c7855", "#c5a06a40", "#8e2c4a55", "#f1dcb322"]} />
        <Petals count={20} className="absolute" />
        <Sparkles color="#f1dcb3" />
        <Link href={SITE_URL} className="relative" aria-label={BRAND.name}><Wordmark tone="#f6ece2" /></Link>
        <div className="relative max-w-xl">
          <p className="kicker mb-8 text-[#c5a06a]">Made with love in Goa</p>
          <Verses />
        </div>
        <p className="relative text-sm text-[#fbeee6]/55">Invitations · Event websites · Video invitations · Live RSVPs</p>
      </section>

      {/* Form */}
      <section className="relative flex items-center justify-center overflow-hidden px-5 py-16">
        <Aurora />
        <div className="lg:hidden"><Petals count={12} className="absolute" /></div>
        <div className="glass rise relative w-full max-w-[420px] rounded-[32px] p-9 md:p-11">
          <Link href={SITE_URL} className="mb-6 flex justify-center lg:hidden" aria-label={BRAND.name}><Wordmark /></Link>
          {mode === "forgot-password" ? (
            <>
              <h1 className="t-h2 text-center">Reset your <em className="text-rose">password</em></h1>
              <p className="mt-2 text-center text-sm text-muted">We&apos;ll email you a 6-digit code.</p>
              <ForgotForm />
            </>
          ) : (
            <>
              <h1 className="t-h2 text-center">{mode === "sign-up" ? <>Begin your <em className="text-rose">story</em></> : <>Welcome <em className="text-rose">back</em></>}</h1>
              <p className="mt-2 text-center text-sm text-muted">{mode === "sign-up" ? "Your designs are saved as you talk." : "Your celebration is right where you left it."}</p>
              <AuthForm mode={mode} />
            </>
          )}
          <a href={SITE_URL} className="mt-6 block border-t border-line pt-5 text-center text-xs text-muted underline-offset-4 hover:text-ink hover:underline">← Browse designs and pricing on festivelle.love</a>
        </div>
      </section>
    </main>
  );
}
