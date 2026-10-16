import type { Metadata } from "next";
import AdminGate from "@/components/admin/AdminGate";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // -mt-24 cancels the space the public navbar normally takes (it's hidden on admin pages).
  return (
    <div className="-mt-24">
      <AdminGate>{children}</AdminGate>
    </div>
  );
}
