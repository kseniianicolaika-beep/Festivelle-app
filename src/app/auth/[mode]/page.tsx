import { notFound } from "next/navigation";
import { AuthForm } from "./AuthForm";
import { BRAND } from "@/lib/brand";
import { Aurora } from "@/components/fx/Aurora";
import { Petals } from "@/components/fx/Petals";
import { Sparkles } from "@/components/fx/Sparkles";
import { Verses } from "@/components/fx/Verses";
import { Heart } from "@/components/fx/Heart";

export function generateStaticParams() {
  return [{ mode: "sign-in" }, { mode: "sign-up" }];
}

export default async function AuthPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  if (mode !== "sign-in" && mode !== "sign-up") notFound();
  return (
    <main className="grain relative grid min-h-dvh lg:grid-cols-[1.15fr_1fr]">
      {/* Romance panel */}
      <section className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#5a1a2e_0%,#3a0f1c_55%,#26101a_100%)] p-14 text-[#fbeee6] lg:flex lg:flex-col lg:justify-between">
        <Aurora colors={["#c06c7855", "#c5a06a40", "#8e2c4a55", "#f1dcb322"]} />
        <Petals count={20} className="absolute" />
        <Sparkles color="#f1dcb3" />
        <p className="relative flex items-center gap-2 display text-2xl"><Heart className="heartbeat h-4 w-4" color="#e8a3ab" /> {BRAND.name}</p>
        <div className="relative max-w-xl">
          <p className="eyebrow mb-8 text-[#f1dcb3]/80">Made with love in Goa</p>
          <Verses />
        </div>
        <p className="relative text-sm text-[#fbeee6]/55">Invitations · Save-the-dates · Wedding websites · Live RSVPs</p>
      </section>

      {/* Form */}
      <section className="relative flex items-center justify-center overflow-hidden px-5 py-16">
        <Aurora />
        <div className="lg:hidden"><Petals count={12} className="absolute" /></div>
        <div className="glass rise relative w-full max-w-[400px] rounded-[32px] p-9">
          <p className="display text-center text-3xl lg:hidden">{BRAND.name}</p>
          <h1 className="display text-center text-[2.6rem] leading-tight">{mode === "sign-up" ? <>Begin your <em className="text-rose">story</em></> : <>Welcome <em className="text-rose">back</em></>}</h1>
          <p className="mt-2 text-center text-sm text-muted">{mode === "sign-up" ? "Your designs are saved as you talk." : "Your love story is right where you left it."}</p>
          <AuthForm mode={mode} />
        </div>
      </section>
    </main>
  );
}
