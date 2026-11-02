import { SupportHeart } from "@/components/SupportHeart";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SupportHeart lift />
    </>
  );
}
