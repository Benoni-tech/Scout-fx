"use client";

import { usePathname } from "next/navigation";

/** Renders its children everywhere except the admin area (e.g. the public footer). */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  return usePathname().startsWith("/admin") ? null : <>{children}</>;
}
