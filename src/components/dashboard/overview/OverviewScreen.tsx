"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, CalendarDays, Clock3, RefreshCw, Users } from "lucide-react";
import { api } from "@/lib/dashboard/api";
import { dropCached } from "@/lib/dashboard/cache";
import { STATUS_LABEL } from "@/lib/dashboard/format";
import { useErrorMessage } from "@/hooks/dashboard/useErrorMessage";
import type { ReservationStats, ReservationStatus } from "@/types/dashboard";
import { StatusBadge } from "@/components/dashboard/reservations/StatusBadge";

const ORDER: ReservationStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export function OverviewScreen() {
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [error, setError] = useState("");
  // "Refresh" bumps this to force a real request; otherwise numbers already loaded come from the cache.
  const [refreshes, setRefreshes] = useState(0);
  const msg = useErrorMessage();

  useEffect(() => {
    let alive = true;
    api
      .stats()
      .then((r) => {
        if (!alive) return;
        setStats(r.data);
        setError("");
      })
      .catch((e) => alive && setError(msg(e)));
    return () => {
      alive = false;
    };
  }, [msg, refreshes]);

  const refresh = () => {
    dropCached((k) => k === "stats");
    setRefreshes((n) => n + 1);
  };

  const cards = stats
    ? [
        { label: "Reservations today", value: stats.today.reservations, icon: CalendarDays },
        { label: "Guests today", value: stats.today.guests, icon: Users },
        { label: "Next 7 days", value: stats.upcomingWeek, icon: CalendarClock },
        { label: "Awaiting confirmation", value: stats.byStatus.pending, icon: Clock3 },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Overview</h1>
          <p className="mt-1 text-sm text-dash-muted">A quick look at the restaurant&apos;s bookings.</p>
        </div>
        <button
          onClick={refresh}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-dash-line bg-dash-card px-3.5 py-2.5 text-sm font-medium text-dash-ink transition hover:bg-dash-bg"
          title="Load the latest numbers from the server"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats
          ? cards.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-dash-line bg-dash-card p-5">
                <Icon className="size-5 text-dash-gold" />
                <p className="mt-4 font-serif text-4xl">{value}</p>
                <p className="mt-1 text-sm text-dash-muted">{label}</p>
              </div>
            ))
          : !error && Array.from({ length: 4 }, (_, i) => <div key={i} className="h-[138px] animate-pulse rounded-2xl border border-dash-line bg-dash-card" />)}
      </div>

      {stats && (
        <section className="mt-8 rounded-2xl border border-dash-line bg-dash-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">All reservations · {stats.total}</h2>
            <Link href="/dashboard/reservations" className="text-sm font-medium text-dash-gold-dark hover:underline">
              Open list →
            </Link>
          </div>
          <ul className="divide-y divide-dash-line">
            {ORDER.map((s) => (
              <li key={s} className="flex items-center justify-between py-3">
                <StatusBadge status={s} />
                <Link href={`/dashboard/reservations?status=${s}`} className="text-sm hover:underline" aria-label={`${stats.byStatus[s]} ${STATUS_LABEL[s]}`}>
                  <span className="font-semibold">{stats.byStatus[s]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
