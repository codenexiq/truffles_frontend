import type { NextConfig } from "next";

// ============================================================
// Security headers + Content-Security-Policy (CSP)
//
// The CSP tells the browser exactly which sources the site may load from, so that
// even if an attacker managed to inject markup, their scripts could not run,
// could not talk to their own servers, and the page could not be framed.
// ============================================================
const isDev = process.env.NODE_ENV === "development";

// The only external server the site sends data to: the Truffles API.
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? (isDev ? "http://localhost:5001" : "");
let backendOrigin = "";
try {
  backendOrigin = backendUrl ? new URL(backendUrl).origin : "";
} catch {
  throw new Error(`NEXT_PUBLIC_BACKEND_URL is not a valid URL: "${backendUrl}"`);
}
if (!isDev && !backendOrigin) {
  // Loud warning during production builds (src/lib/backend.ts also fails the build).
  console.warn("WARNING: NEXT_PUBLIC_BACKEND_URL is not set; the production build will fail.");
}

const csp = [
  "default-src 'self'",
  // Scripts may only come from our own origin; no external script host is allowed, ever.
  // 'unsafe-inline' is needed because Next.js streams each page's data in small inline scripts,
  // and a stricter, nonce-based policy would force every page to render on demand (slower,
  // uncacheable). Tested: with plain 'self' the site does not hydrate. The upgrade path is a
  // per-request nonce via proxy.ts (see SECURITY.md). Development also needs eval for hot reload.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Inline style *attributes* are required by Tailwind/Framer Motion animations.
  "style-src 'self' 'unsafe-inline'",
  // The Truffles API serves pictures uploaded from the dashboard (blog covers and photos).
  `img-src 'self' data: blob: https://i.ytimg.com${backendOrigin ? ` ${backendOrigin}` : ""}`,
  "font-src 'self' data:",
  `connect-src 'self'${backendOrigin ? ` ${backendOrigin}` : ""}${isDev ? " ws: wss:" : ""}`,
  "frame-src https://www.youtube-nocookie.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Forces HTTPS for two years (browsers ignore this over plain http, so it is safe to send everywhere).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  // Allows a throw-away build folder for testing without touching the dev server.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Self-contained server bundle (server.js + only the dependencies it needs): this is what the
  // deploy workflow uploads, so the live server does not need the source code or devDependencies.
  output: "standalone",
  // Do not advertise the framework in a response header.
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  // Images are local, except pictures uploaded from the dashboard: those come from the Truffles API's /media/ path.
  // That one address (and nothing else) may be resized by the image optimizer.
  images: {
    remotePatterns: backendOrigin
      ? [
          {
            protocol: new URL(backendOrigin).protocol === "https:" ? "https" : "http",
            hostname: new URL(backendOrigin).hostname,
            port: new URL(backendOrigin).port,
            pathname: "/api/v1/media/**",
          },
        ]
      : [],
    // Next blocks "localhost" as an image source unless told otherwise; only needed while developing locally.
    dangerouslyAllowLocalIP: isDev,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The staff dashboard is private: tell search engines to stay away (the pages also carry a noindex tag).
      { source: "/dashboard/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  // Adds integrity hashes to scripts, which lets the CSP stay strict without nonces.
  experimental: { sri: { algorithm: "sha256" } },
};

export default nextConfig;
