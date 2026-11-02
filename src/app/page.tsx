import { redirect } from "next/navigation";

// No marketing page here — the public landing site lives separately. The app opens straight into the studio.
export default function Home() {
  redirect("/studio");
}
