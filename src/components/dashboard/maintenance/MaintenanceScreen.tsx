"use client";

import { useEffect, useState } from "react";
import { CircleCheck, Clock, ExternalLink, Loader2, Power, PowerOff, Save, TriangleAlert } from "lucide-react";
import { api, ApiError } from "@/lib/dashboard/api";
import { formatStamp } from "@/lib/dashboard/format";
import { useAuth } from "@/components/dashboard/auth/AuthProvider";
import { useErrorMessage } from "@/hooks/dashboard/useErrorMessage";
import type { MaintenanceLogEntry, MaintenanceSettings } from "@/types/dashboard";

const field =
  "w-full rounded-xl border border-dash-line bg-dash-card px-3.5 py-2.5 text-sm text-dash-ink placeholder:text-dash-muted/70 focus:border-dash-gold focus:outline-none disabled:opacity-60";
const lab = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dash-muted";

/** Loads the settings once (then they are cached), and hands them to the form. */
export function MaintenanceScreen() {
  const msg = useErrorMessage();
  const [state, setState] = useState<{ settings: MaintenanceSettings | null; error: string } | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .maintenance()
      .then((r) => alive && setState({ settings: r.data, error: "" }))
      .catch((e) => alive && setState({ settings: null, error: msg(e) }));
    return () => {
      alive = false;
    };
  }, [msg]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl">Maintenance</h1>
      <p className="mb-8 mt-1 text-sm text-dash-muted">Take the public website offline for a while, with a message for visitors. The dashboard stays available.</p>

      {!state && (
        <div className="flex justify-center py-20 text-dash-gold">
          <Loader2 className="size-6 animate-spin" aria-label="Loading" />
        </div>
      )}
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.settings && <Form initial={state.settings} />}
    </div>
  );
}

function Form({ initial }: { initial: MaintenanceSettings }) {
  const { user } = useAuth();
  const msg = useErrorMessage();
  const canChange = user?.role === "admin" || user?.role === "super_admin";

  const [saved, setSaved] = useState(initial);
  const [title, setTitle] = useState(initial.title);
  const [message, setMessage] = useState(initial.message);
  const [eta, setEta] = useState(initial.eta ?? "");
  const [busy, setBusy] = useState<"toggle" | "save" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const textDirty = title !== saved.title || message !== saved.message || eta !== (saved.eta ?? "");

  function check(): string[] {
    const out: string[] = [];
    if (title.trim().length < 3) out.push("Add a heading (at least 3 characters).");
    if (message.trim().length < 5) out.push("Add a message for visitors (at least 5 characters).");
    return out;
  }

  async function submit(enabled: boolean, kind: "toggle" | "save") {
    const problems = check();
    if (problems.length) return setErrors(problems);
    setErrors([]);
    setNotice("");
    setBusy(kind);
    try {
      const r = await api.saveMaintenance({ enabled, title: title.trim(), message: message.trim(), eta: eta.trim() });
      setSaved(r.data);
      setTitle(r.data.title);
      setMessage(r.data.message);
      setEta(r.data.eta ?? "");
      setNotice(
        kind === "save"
          ? "Message saved."
          : enabled
            ? "Maintenance mode is ON. The website will show the maintenance page within about 15 seconds."
            : "Maintenance mode is OFF. The website will reopen within about 15 seconds.",
      );
    } catch (e) {
      const details = e instanceof ApiError ? e.details : [];
      setErrors(details.length ? details.map((d) => d.message) : [msg(e)]);
    } finally {
      setBusy(null);
    }
  }

  async function toggle() {
    if (!saved.enabled) {
      const ok = window.confirm("Turn on maintenance mode?\n\nVisitors will see the maintenance page instead of the website (within about 15 seconds). The dashboard stays available.");
      if (!ok) return;
    }
    await submit(!saved.enabled, "toggle");
  }

  return (
    <div className="space-y-6">
      {/* status */}
      <section className={`rounded-2xl border p-5 sm:p-6 ${saved.enabled ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`} aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {saved.enabled ? <TriangleAlert className="size-7 text-red-700" /> : <CircleCheck className="size-7 text-emerald-700" />}
            <div>
              <p className={`font-serif text-xl ${saved.enabled ? "text-red-900" : "text-emerald-900"}`}>{saved.enabled ? "Maintenance mode is ON" : "The website is live"}</p>
              <p className="text-sm text-dash-muted">
                {saved.updatedAt ? `Last changed by ${saved.updatedBy ?? "staff"} · ${formatStamp(saved.updatedAt)}` : "Never switched on."}
              </p>
            </div>
          </div>
          {canChange && (
            <button
              onClick={toggle}
              disabled={busy !== null}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 ${saved.enabled ? "bg-emerald-700" : "bg-red-700"}`}
            >
              {busy === "toggle" ? <Loader2 className="size-4 animate-spin" /> : saved.enabled ? <PowerOff className="size-4" /> : <Power className="size-4" />}
              {saved.enabled ? "Turn off and reopen the website" : "Turn on maintenance mode"}
            </button>
          )}
        </div>
        {!canChange && <p className="mt-3 text-sm text-dash-muted">Only administrators can switch maintenance mode on or off.</p>}
      </section>

      {notice && (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {errors.length > 0 && (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          <ul className="list-disc space-y-0.5 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* message */}
      <section className="space-y-4 rounded-2xl border border-dash-line bg-dash-card p-5 sm:p-6">
        <h2 className="font-serif text-xl">What visitors see</h2>
        <div>
          <label className={lab} htmlFor="m-title">Heading</label>
          <input id="m-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} disabled={!canChange || busy !== null} className={field} />
        </div>
        <div>
          <label className={lab} htmlFor="m-message">Message</label>
          <textarea id="m-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={400} disabled={!canChange || busy !== null} className={field} />
          <p className="mt-1 text-right text-xs text-dash-muted">{message.length}/400</p>
        </div>
        <div>
          <label className={lab} htmlFor="m-eta">Expected back (optional)</label>
          <input id="m-eta" value={eta} onChange={(e) => setEta(e.target.value)} maxLength={60} disabled={!canChange || busy !== null} className={field} placeholder="e.g. around 8 PM tonight" />
        </div>
        {canChange && (
          <div className="flex justify-end">
            <button
              onClick={() => submit(saved.enabled, "save")}
              disabled={busy !== null || !textDirty}
              className="flex items-center gap-2 rounded-xl border border-dash-line bg-dash-card px-4 py-2.5 text-sm font-semibold transition hover:bg-dash-bg disabled:opacity-50"
            >
              {busy === "save" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save message
            </button>
          </div>
        )}
      </section>

      {/* preview */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl">Preview</h2>
          <a href="/maintenance" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-dash-gold-dark hover:underline">
            Open the real page <ExternalLink className="size-3.5" />
          </a>
        </div>
        <div className="theme-dark rounded-2xl bg-page px-6 py-10 text-center text-zinc-100">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold-light">✦ Rooftop Dining · F-10, Islamabad ✦</p>
          <p className="mt-4 font-serif text-3xl text-white">{title || "…"}</p>
          <span className="mx-auto mt-4 block h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-zinc-300">{message}</p>
          {eta.trim() && (
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-xs text-gold-light">
              <Clock className="size-3.5" /> Expected back: {eta.trim()}
            </p>
          )}
        </div>
        <p className="mt-2 text-xs text-dash-muted">Visitors also see the restaurant&apos;s phone numbers so they can still book by calling.</p>
      </section>

      <History version={saved.updatedAt ?? ""} />
    </div>
  );
}

/** The last few times it was switched. Fetched once; fetched again only after a change (`version`). */
function History({ version }: { version: string }) {
  const [loaded, setLoaded] = useState<{ version: string; items: MaintenanceLogEntry[] } | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .maintenanceHistory()
      .then((r) => alive && setLoaded({ version, items: r.data }))
      .catch(() => alive && setLoaded({ version, items: [] }));
    return () => {
      alive = false;
    };
  }, [version]);

  return (
    <section className="rounded-2xl border border-dash-line bg-dash-card p-5 sm:p-6">
      <h2 className="mb-3 font-serif text-xl">History</h2>
      {!loaded || loaded.version !== version ? (
        <p className="text-sm text-dash-muted">Loading…</p>
      ) : loaded.items.length === 0 ? (
        <p className="text-sm text-dash-muted">Nothing yet.</p>
      ) : (
        <ul className="divide-y divide-dash-line text-sm">
          {loaded.items.map((h) => (
            <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span>
                <strong className={h.enabled ? "text-red-700" : "text-emerald-700"}>{h.enabled ? "Switched ON" : "Switched OFF"}</strong>
                <span className="text-dash-muted"> · by {h.changedBy ?? "staff"}</span>
              </span>
              <time dateTime={h.changedAt} className="text-xs text-dash-muted">
                {formatStamp(h.changedAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
