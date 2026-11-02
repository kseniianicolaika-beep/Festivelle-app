import { SupportHeart } from "@/components/SupportHeart";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SupportHeart />
    </>
  );
}
