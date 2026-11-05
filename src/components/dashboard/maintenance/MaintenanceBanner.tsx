"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { api, MAINTENANCE_EVENT } from "@/lib/dashboard/api";
import type { MaintenanceSettings } from "@/types/dashboard";

/**
 * A warning strip across the top of every dashboard page while the live website is in maintenance mode, so nobody
 * forgets it is on. The settings are loaded once per session (then cached) and follow any change made on the
 * Maintenance page.
 */
export function MaintenanceBanner() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .maintenance()
      .then((r) => alive && setOn(r.data.enabled))
      .catch(() => undefined); // the banner is a courtesy: if it cannot load, the page still works
    const follow = (e: Event) => setOn((e as CustomEvent<MaintenanceSettings>).detail.enabled);
    window.addEventListener(MAINTENANCE_EVENT, follow);
    return () => {
      alive = false;
      window.removeEventListener(MAINTENANCE_EVENT, follow);
    };
  }, []);

  if (!on) return null;
  return (
    <div role="status" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-red-700 px-4 py-2.5 text-center text-sm font-medium text-white">
      <TriangleAlert className="size-4 shrink-0" />
      <span>Maintenance mode is ON: visitors see the maintenance page instead of the website.</span>
      <Link href="/dashboard/maintenance" className="underline underline-offset-2 hover:no-underline">
        Manage
      </Link>
    </div>
  );
}
