import type { ReservationStatus } from "@/types/dashboard";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "2026-11-05" -> "Thu, 5 Nov 2026" (no timezone maths: the string is a calendar day). */
export function formatDay(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[dow]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/** ISO timestamp -> "5 Nov 2026, 14:05" in Pakistan time. */
export function formatStamp(iso: string): string {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso;
  const pk = new Date(t.getTime() + 5 * 3600_000);
  const hh = String(pk.getUTCHours()).padStart(2, "0");
  const mm = String(pk.getUTCMinutes()).padStart(2, "0");
  return `${pk.getUTCDate()} ${MONTHS[pk.getUTCMonth()]} ${pk.getUTCFullYear()}, ${hh}:${mm}`;
}

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

/** Which statuses a reservation may move to (mirrors the API rules). */
export const NEXT_STATUSES: Record<ReservationStatus, ReservationStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled", "pending"],
  cancelled: ["pending"],
  completed: [],
};
