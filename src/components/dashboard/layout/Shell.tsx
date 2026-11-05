"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck, LayoutDashboard, Loader2, LogOut, Menu, Newspaper, Wrench, X } from "lucide-react";
import clsx from "clsx";
import { MaintenanceBanner } from "@/components/dashboard/maintenance/MaintenanceBanner";
import { useAuth } from "@/components/dashboard/auth/AuthProvider";

const NAV = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/dashboard/blogs", label: "Blogs", icon: Newspaper },
  { href: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/dashboard/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-dash-gold">
        <Loader2 className="size-6 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
              active ? "bg-dash-gold-soft text-dash-gold-dark" : "text-dash-muted hover:bg-dash-bg hover:text-dash-ink",
            )}
          >
            <Icon className="size-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* desktop sidebar */}
      <aside className="hidden border-r border-dash-line bg-dash-card p-6 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dash-gold">Truffles</p>
          <p className="mb-8 mt-1 font-serif text-xl">Dashboard</p>
          {nav}
        </div>
        <Account email={user.email} onLogout={logout} />
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-dash-line bg-dash-card px-4 py-3 lg:hidden">
        <p className="font-serif text-lg">Truffles Dashboard</p>
        <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="rounded-lg p-2 hover:bg-dash-bg">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>
      {open && (
        <div className="border-b border-dash-line bg-dash-card p-4 lg:hidden">
          {nav}
          <div className="mt-4 border-t border-dash-line pt-4">
            <Account email={user.email} onLogout={logout} />
          </div>
        </div>
      )}

      <div className="min-w-0">
        <MaintenanceBanner />
        <div className="p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}

function Account({ email, onLogout }: { email: string; onLogout: () => void }) {
  return (
    <div className="text-sm">
      <p className="truncate text-dash-muted" title={email}>
        {email}
      </p>
      <button onClick={onLogout} className="mt-2 flex items-center gap-2 font-medium text-dash-gold-dark hover:underline">
        <LogOut className="size-4" /> Sign out
      </button>
    </div>
  );
}
