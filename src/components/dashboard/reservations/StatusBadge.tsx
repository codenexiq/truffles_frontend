import clsx from "clsx";
import { STATUS_LABEL } from "@/lib/dashboard/format";
import type { ReservationStatus } from "@/types/dashboard";

const STYLE: Record<ReservationStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  completed: "bg-stone-100 text-stone-700 ring-stone-300",
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={clsx("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", STYLE[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}
