import type { ReactNode } from "react";
import { AdminLayoutChrome } from "@/components/admin/admin-layout-chrome";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutChrome>{children}</AdminLayoutChrome>;
}
