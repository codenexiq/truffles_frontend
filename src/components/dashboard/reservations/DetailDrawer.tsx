"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, X } from "lucide-react";
import clsx from "clsx";
import { formatDay, formatStamp, NEXT_STATUSES, STATUS_LABEL } from "@/lib/dashboard/format";
import { api } from "@/lib/dashboard/api";
import type { HistoryEntry, Reservation, ReservationStatus } from "@/types/dashboard";
import { StatusBadge } from "./StatusBadge";

const ACTION_STYLE: Partial<Record<ReservationStatus, string>> = {
  confirmed: "bg-emerald-600 text-dash-on-gold hover:bg-emerald-700",
  completed: "bg-dash-gold text-dash-on-gold hover:bg-dash-gold-dark",
  cancelled: "bg-dash-card text-red-700 ring-1 ring-red-200 hover:bg-red-50",
  pending: "bg-dash-card text-dash-ink ring-1 ring-dash-line hover:bg-dash-bg",
};

const ACTION_LABEL: Record<ReservationStatus, string> = {
  confirmed: "Confirm",
  completed: "Mark completed",
  cancelled: "Cancel reservation",
  pending: "Move back to pending",
};

type Props = {
  item: Reservation | null;
  /** false for read-only staff: the buttons are hidden (the API refuses the change anyway) */
  canEdit: boolean;
  onClose: () => void;
  onChangeStatus: (id: string, status: ReservationStatus) => Promise<string | null>;
};

// keyed by id so opening another reservation starts with a clean busy/error state
export function DetailDrawer(props: Props) {
  return props.item ? <Drawer key={props.item.id} {...props} item={props.item} /> : null;
}

function Drawer({ item, canEdit, onClose, onChangeStatus }: Props & { item: Reservation }) {
  const [busy, setBusy] = useState<ReservationStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const actions = canEdit ? NEXT_STATUSES[item.status] : [];

  // The status history is fetched once per reservation (then cached). It is fetched again only after the status
  // changes, because that is the one thing that makes the cached copy out of date.
  const historyKey = `${item.id}:${item.status}`;
  const [history, setHistory] = useState<{ key: string; items: HistoryEntry[] | null }>({ key: "", items: null });
  useEffect(() => {
    let alive = true;
    api
      .history(item.id)
      .then((r) => alive && setHistory({ key: historyKey, items: r.data }))
      .catch(() => alive && setHistory({ key: historyKey, items: null }));
    return () => {
      alive = false;
    };
  }, [item.id, historyKey]);
  const historyLoading = history.key !== historyKey;

  async function act(status: ReservationStatus) {
    if (status === "cancelled" && !window.confirm(`Cancel the reservation for ${item.name}?`)) return;
    setBusy(status);
    setError("");
    const problem = await onChangeStatus(item.id, status);
    setBusy(null);
    if (problem) setError(problem);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button aria-label="Close details" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-label="Reservation details" className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-dash-card shadow-2xl">
        <div className="flex items-start justify-between border-b border-dash-line p-6">
          <div>
            <h2 className="font-serif text-2xl">{item.name}</h2>
            <div className="mt-2">
              <StatusBadge status={item.status} />
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-dash-bg">
            <X className="size-5" />
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-5 p-6 text-sm">
          <Item label="Date" value={formatDay(item.date)} />
          <Item label="Time" value={item.time} />
          <Item label="Guests" value={String(item.guests)} />
          <Item label="Occasion" value={item.occasion || "—"} />
          <div className="col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-dash-muted">Contact</dt>
            <dd className="mt-2 space-y-1.5">
              <a href={`mailto:${item.email}`} className="flex items-center gap-2 break-all hover:text-dash-gold-dark">
                <Mail className="size-4 shrink-0 text-dash-gold" /> {item.email}
              </a>
              <a href={`tel:${item.phone}`} className="flex items-center gap-2 hover:text-dash-gold-dark">
                <Phone className="size-4 shrink-0 text-dash-gold" /> {item.phone}
              </a>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-dash-muted">Special requests</dt>
            {/* rendered as plain text, so nothing a guest typed can run as code */}
            <dd className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-dash-bg p-3">{item.specialRequests || "None"}</dd>
          </div>
          <Item label="Requested" value={formatStamp(item.createdAt)} />
          <Item label="Last updated" value={formatStamp(item.updatedAt)} />
        </dl>

        <section className="px-6 pb-6" aria-label="Status history">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dash-muted">History</h3>
          {historyLoading ? (
            <p className="mt-2 text-sm text-dash-muted">Loading…</p>
          ) : !history.items || history.items.length === 0 ? (
            <p className="mt-2 text-sm text-dash-muted">No status changes yet.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {history.items.map((h) => (
                <li key={h.id} className="flex items-baseline justify-between gap-3">
                  <span>
                    {h.fromStatus ? `${STATUS_LABEL[h.fromStatus]} → ` : ""}
                    <strong className="font-semibold">{STATUS_LABEL[h.toStatus]}</strong>
                    <span className="text-dash-muted"> · {h.source === "guest" ? "by the guest" : h.changedBy ? `by ${h.changedBy}` : "by staff"}</span>
                  </span>
                  <time dateTime={h.changedAt} className="shrink-0 text-xs text-dash-muted">
                    {formatStamp(h.changedAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-auto border-t border-dash-line p-6">
          {error && (
            <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {actions.length === 0 ? (
            <p className="text-sm text-dash-muted">
              {canEdit
                ? `This reservation is ${STATUS_LABEL[item.status].toLowerCase()} and cannot be changed.`
                : "Your account can view reservations but not change them."}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {actions.map((s) => (
                <button
                  key={s}
                  onClick={() => act(s)}
                  disabled={busy !== null}
                  className={clsx("flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-60", ACTION_STYLE[s])}
                >
                  {busy === s && <Loader2 className="size-4 animate-spin" />}
                  {ACTION_LABEL[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-dash-muted">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
