/**
 * Base URL of the Truffles API (the only server this site sends form data to).
 *
 * Production MUST set NEXT_PUBLIC_BACKEND_URL (for example https://api.yourdomain.com).
 * It fails loudly instead of quietly pointing visitors' browsers at "localhost",
 * and it refuses plain http in production so customer data is never sent unencrypted.
 */
const configured = process.env.NEXT_PUBLIC_BACKEND_URL;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !configured) {
  throw new Error(
    "NEXT_PUBLIC_BACKEND_URL is not set. Set it to your API's https address before building for production."
  );
}
if (isProduction && configured && !configured.startsWith("https://")) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL must use https:// in production.");
}

export const BACKEND_URL = (configured ?? "http://localhost:5001").replace(/\/$/, "");
export const API_V1 = `${BACKEND_URL}/api/v1`;
