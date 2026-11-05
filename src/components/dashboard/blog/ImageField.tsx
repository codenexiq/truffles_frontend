"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { api } from "@/lib/dashboard/api";
import { prepareImage } from "@/lib/dashboard/media";
import { resolveMediaSrc } from "@/lib/blogMedia";
import { useErrorMessage } from "@/hooks/dashboard/useErrorMessage";

/** Picks a picture, shrinks it in the browser, uploads it, and reports its `/media/<id>` path. */
export function ImageField({
  value,
  onChange,
  label,
  disabled = false,
  compact = false,
}: {
  value: string;
  onChange: (path: string) => void;
  label: string;
  disabled?: boolean;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const msg = useErrorMessage();

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await prepareImage(file);
      onChange(await api.uploadImage(blob));
    } catch (e) {
      setError(msg(e));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const size = compact ? "h-20 w-28" : "h-32 w-48";

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-dash-muted">{label}</p>
      <div className="flex items-center gap-3">
        <div className={`${size} shrink-0 overflow-hidden rounded-xl border border-dash-line bg-dash-bg`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- a small preview of an upload, no optimisation needed
            <img src={resolveMediaSrc(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-dash-muted">
              <ImagePlus className="size-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            aria-label={label}
            disabled={disabled || busy}
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={disabled || busy}
            className="flex items-center gap-2 rounded-lg border border-dash-line bg-dash-card px-3 py-2 text-sm font-medium transition hover:bg-dash-bg disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {busy ? "Uploading…" : value ? "Replace picture" : "Upload picture"}
          </button>
          {value && !busy && !disabled && (
            <button type="button" onClick={() => onChange("")} className="flex items-center gap-1.5 text-xs text-red-700 hover:underline">
              <Trash2 className="size-3.5" /> Remove
            </button>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
