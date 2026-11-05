import type { Metadata } from "next";
import { AuthProvider } from "@/components/dashboard/auth/AuthProvider";

// The staff dashboard is private: keep it out of search engines (next.config.ts also sends an X-Robots-Tag header).
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

// Every dashboard page waits for the sign-in check before it shows anything, so it can never be an "instant" page.
// That is intended for a private area; this opts it out of Next.js's instant-navigation check (public pages keep it).
export const instant = false;

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* Its own light palette (dash-* colours in globals.css), independent of the public site's theme. */}
      <div className="min-h-screen bg-dash-bg text-dash-ink">{children}</div>
    </AuthProvider>
  );
}
