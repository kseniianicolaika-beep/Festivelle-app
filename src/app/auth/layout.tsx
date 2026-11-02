import { SupportHeart } from "@/components/SupportHeart";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SupportHeart />
    </>
  );
}
