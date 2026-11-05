import { NextResponse, type NextRequest } from "next/server";
import { getMaintenanceNotice } from "@/lib/siteStatus";

/**
 * Maintenance mode. When an administrator switches it on in the dashboard, every public page is answered with the
 * maintenance page (HTTP 503, so search engines know it is temporary). The dashboard itself stays reachable, so it
 * can always be switched off again.
 *
 * It runs before every page request but is cheap: the API is asked at most once every few seconds (see lib/siteStatus.ts),
 * and if the API cannot be reached the website simply stays open.
 */
export async function proxy(request: NextRequest) {
  const notice = await getMaintenanceNotice();
  if (!notice) {
    // Open site. Next marks prerendered pages (like the home page) as cacheable for a YEAR by a shared cache such as the
    // host's CDN. A copy kept that way never reaches this check, so switching maintenance on would not show on it.
    // Pages must be re-checked with the server each time; pictures, fonts and scripts (not matched here) stay cached.
    const open = NextResponse.next();
    open.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
    return open;
  }

  // Pass the text along to the page (set here, on the server, from the API's answer).
  const headers = new Headers(request.headers);
  headers.set("x-maintenance", Buffer.from(JSON.stringify(notice)).toString("base64url"));

  return NextResponse.rewrite(new URL("/maintenance", request.url), {
    request: { headers },
    status: 503,
    headers: {
      "Retry-After": "600",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export const config = {
  // Pages only. Not: Next's own files, the dashboard (so it can switch maintenance off), the maintenance page itself,
  // or anything with a file extension (pictures, fonts, icons), which the maintenance page needs.
  matcher: ["/((?!_next/|dashboard|maintenance|.*\\..*).*)"],
};
