"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { api, listKey } from "@/lib/dashboard/api";
import { dropCached } from "@/lib/dashboard/cache";
import { useAuth } from "@/components/dashboard/auth/AuthProvider";
import { useErrorMessage } from "@/hooks/dashboard/useErrorMessage";
import { FiltersBar } from "@/components/dashboard/reservations/FiltersBar";
import { ReservationList } from "@/components/dashboard/reservations/ReservationList";
import { DetailDrawer } from "@/components/dashboard/reservations/DetailDrawer";
import type { PageMeta, Reservation, ReservationFilters, ReservationStatus } from "@/types/dashboard";

const STATUSES: ReservationStatus[] = ["pending", "confirmed", "cancelled", "completed"];

function ReservationsList() {
  const params = useSearchParams();
  const initialStatus = params.get("status") as ReservationStatus | null;

  const [filters, setFilters] = useState<ReservationFilters>({
    status: initialStatus && STATUSES.includes(initialStatus) ? initialStatus : "",
    q: "",
    from: "",
    to: "",
    sort: "newest",
    page: 1,
  });
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Reservation[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  // "Refresh" bumps this to force a real request; otherwise a page already loaded is served from the cache.
  const [refreshes, setRefreshes] = useState(0);
  // the filter combination the current list belongs to; loading = the filters have moved on since
  const [loadedFor, setLoadedFor] = useState("");
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { user } = useAuth();
  const msg = useErrorMessage();
  const latest = useRef(0);

  // apply the typed search a moment after the user stops typing
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => (f.q === search ? f : { ...f, q: search, page: 1 })), 350);
    return () => clearTimeout(t);
  }, [search]);

  const key = `${listKey(filters)}#${refreshes}`;
  const loading = loadedFor !== key;

  useEffect(() => {
    const id = ++latest.current; // ignore answers that arrive after a newer request
    api
      .reservations(filters)
      .then((r) => {
        if (id !== latest.current) return;
        setItems(r.data);
        setMeta(r.meta ?? null);
        setError("");
      })
      .catch((e) => id === latest.current && setError(msg(e)))
      .finally(() => id === latest.current && setLoadedFor(`${listKey(filters)}#${refreshes}`));
  }, [filters, refreshes, msg]);

  const change = useCallback((patch: Partial<ReservationFilters>) => setFilters((f) => ({ ...f, ...patch, page: 1 })), []);

  const refresh = useCallback(() => {
    dropCached((k) => k.startsWith("res:") || k === "stats" || k.startsWith("hist:"));
    setRefreshes((n) => n + 1);
  }, []);

  const changeStatus = useCallback(
    async (id: string, status: ReservationStatus): Promise<string | null> => {
      try {
        // the cache is updated by api.setStatus; the list on screen keeps its row, now with the new status
        const r = await api.setStatus(id, status, listKey(filters));
        setItems((list) => list.map((x) => (x.id === id ? r.data : x)));
        return null;
      } catch (e) {
        return msg(e);
      }
    },
    [msg, filters],
  );

  const selected = items.find((x) => x.id === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Reservations</h1>
          <p className="mt-1 text-sm text-dash-muted">Search, review and confirm table requests.</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-dash-line bg-dash-card px-3.5 py-2.5 text-sm font-medium text-dash-ink transition hover:bg-dash-bg disabled:opacity-60"
          title="Load the latest bookings from the server"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mb-4">
        <FiltersBar value={filters} search={search} onSearch={setSearch} onChange={change} />
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <ReservationList
        items={items}
        meta={meta}
        loading={loading}
        onOpen={(r) => setSelectedId(r.id)}
        onPage={(page) => setFilters((f) => ({ ...f, page }))}
      />

      <DetailDrawer item={selected} canEdit={user?.role !== "staff"} onClose={() => setSelectedId(null)} onChangeStatus={changeStatus} />
    </div>
  );
}

export function ReservationsScreen() {
  // useSearchParams needs a Suspense boundary so the page can still be built ahead of time
  return (
    <Suspense fallback={null}>
      <ReservationsList />
    </Suspense>
  );
}
