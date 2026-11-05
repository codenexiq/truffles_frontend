"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDay } from "@/lib/dashboard/format";
import type { PageMeta, Reservation } from "@/types/dashboard";
import { StatusBadge } from "./StatusBadge";

export function ReservationList({
  items,
  meta,
  loading,
  onOpen,
  onPage,
}: {
  items: Reservation[];
  meta: PageMeta | null;
  loading: boolean;
  onOpen: (r: Reservation) => void;
  onPage: (page: number) => void;
}) {
  if (!loading && items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-dash-line bg-dash-card px-6 py-16 text-center text-sm text-dash-muted">
        No reservations match these filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-dash-line bg-dash-card">
      <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"} aria-busy={loading}>
        {/* wide screens: a table */}
        <table className="hidden w-full text-left text-sm md:table">
          <thead className="border-b border-dash-line bg-dash-bg/60 text-xs uppercase tracking-wider text-dash-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Guest</th>
              <th className="px-5 py-3 font-semibold">Visit</th>
              <th className="px-5 py-3 font-semibold">Guests</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-line">
            {items.map((r) => (
              <tr key={r.id} className="cursor-pointer hover:bg-dash-bg/50" onClick={() => onOpen(r)}>
                <td className="px-5 py-3.5">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-dash-muted">{r.phone}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p>{formatDay(r.date)}</p>
                  <p className="text-xs text-dash-muted">{r.time}</p>
                </td>
                <td className="px-5 py-3.5">{r.guests}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(r);
                    }}
                    className="font-medium text-dash-gold-dark hover:underline"
                    aria-label={`View ${r.name}'s reservation`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* phones: cards */}
        <ul className="divide-y divide-dash-line md:hidden">
          {items.map((r) => (
            <li key={r.id}>
              <button onClick={() => onOpen(r)} className="block w-full px-4 py-4 text-left hover:bg-dash-bg/50">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{r.name}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-sm text-dash-muted">
                  {formatDay(r.date)} · {r.time} · {r.guests} guests
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between border-t border-dash-line px-5 py-3 text-sm">
          <p className="text-dash-muted">
            {meta.total} reservation{meta.total === 1 ? "" : "s"} · page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPage(meta.page - 1)}
              disabled={meta.page <= 1 || loading}
              aria-label="Previous page"
              className="rounded-lg border border-dash-line p-2 hover:bg-dash-bg disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => onPage(meta.page + 1)}
              disabled={meta.page >= meta.totalPages || loading}
              aria-label="Next page"
              className="rounded-lg border border-dash-line p-2 hover:bg-dash-bg disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
