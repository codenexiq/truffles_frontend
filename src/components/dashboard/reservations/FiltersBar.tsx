"use client";

import { Search } from "lucide-react";
import { STATUS_LABEL } from "@/lib/dashboard/format";
import type { ReservationFilters, ReservationSort, ReservationStatus } from "@/types/dashboard";

const input =
  "rounded-xl border border-dash-line bg-dash-card px-3 py-2.5 text-sm text-dash-ink focus:border-dash-gold focus:outline-none";

export function FiltersBar({
  value,
  search,
  onSearch,
  onChange,
}: {
  value: ReservationFilters;
  /** what is typed in the box right now (applied after a short pause) */
  search: string;
  onSearch: (q: string) => void;
  onChange: (patch: Partial<ReservationFilters>) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
      <label className="relative sm:col-span-2 lg:col-span-1">
        <span className="sr-only">Search by name, email or phone</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dash-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name, email or phone"
          maxLength={100}
          className={`${input} w-full pl-9`}
        />
      </label>

      <label>
        <span className="sr-only">Status</span>
        <select
          value={value.status}
          onChange={(e) => onChange({ status: e.target.value as ReservationStatus | "" })}
          className={`${input} w-full`}
        >
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABEL) as ReservationStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">From date</span>
        <input type="date" value={value.from} max={value.to || undefined} onChange={(e) => onChange({ from: e.target.value })} className={`${input} w-full`} title="From date" />
      </label>

      <label>
        <span className="sr-only">To date</span>
        <input type="date" value={value.to} min={value.from || undefined} onChange={(e) => onChange({ to: e.target.value })} className={`${input} w-full`} title="To date" />
      </label>

      <label>
        <span className="sr-only">Sort</span>
        <select value={value.sort} onChange={(e) => onChange({ sort: e.target.value as ReservationSort })} className={`${input} w-full`}>
          <option value="newest">Newest requests</option>
          <option value="date_asc">Visit date ↑</option>
          <option value="date_desc">Visit date ↓</option>
        </select>
      </label>
    </div>
  );
}
