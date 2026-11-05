import { Shell } from "@/components/dashboard/layout/Shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
