import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";
import { DEFAULT_NOTICE, type MaintenanceNotice } from "@/lib/siteStatus";

// Never show this page in search results.
export const metadata: Metadata = {
  title: "Back soon",
  robots: { index: false, follow: false },
};

/** The text arrives from the proxy (src/proxy.ts), which got it from the API. Opened directly, the default text shows. */
async function Notice() {
  let notice = DEFAULT_NOTICE;
  try {
    const raw = (await headers()).get("x-maintenance");
    if (raw) {
      const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<MaintenanceNotice>;
      notice = {
        title: String(parsed.title ?? DEFAULT_NOTICE.title).slice(0, 80),
        message: String(parsed.message ?? DEFAULT_NOTICE.message).slice(0, 400),
        eta: parsed.eta ? String(parsed.eta).slice(0, 60) : null,
      };
    }
  } catch {
    /* unreadable: show the default text */
  }
  return <MaintenanceView notice={notice} />;
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={<MaintenanceView notice={DEFAULT_NOTICE} />}>
      <Notice />
    </Suspense>
  );
}
