"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Pencil, Plus, RefreshCw, Search, Send, Trash2, Undo2 } from "lucide-react";
import clsx from "clsx";
import { api, blogListKey } from "@/lib/dashboard/api";
import { dropCached } from "@/lib/dashboard/cache";
import { formatDay } from "@/lib/dashboard/format";
import { resolveMediaSrc } from "@/lib/blogMedia";
import { categoryLabel } from "@/data/blogPosts";
import { useAuth } from "@/components/dashboard/auth/AuthProvider";
import { useErrorMessage } from "@/hooks/dashboard/useErrorMessage";
import type { BlogFilters, BlogPostSummary, BlogStatus, PageMeta } from "@/types/dashboard";

const input = "rounded-xl border border-dash-line bg-dash-card px-3 py-2.5 text-sm text-dash-ink focus:border-dash-gold focus:outline-none";

function StatusPill({ status }: { status: BlogStatus }) {
  return (
    <span
      className={clsx(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        status === "published" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-amber-50 text-amber-800 ring-amber-200",
      )}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

export function BlogsScreen() {
  const { user } = useAuth();
  const msg = useErrorMessage();
  const canEdit = user?.role !== "staff";
  const canDelete = user?.role === "admin" || user?.role === "super_admin";

  const [filters, setFilters] = useState<BlogFilters>({ status: "", q: "", page: 1 });
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<BlogPostSummary[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [refreshes, setRefreshes] = useState(0);
  const [loadedFor, setLoadedFor] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const latest = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => (f.q === search ? f : { ...f, q: search, page: 1 })), 350);
    return () => clearTimeout(t);
  }, [search]);

  const key = `${blogListKey(filters)}#${refreshes}`;
  const loading = loadedFor !== key;

  useEffect(() => {
    const id = ++latest.current;
    api
      .blogPosts(filters)
      .then((r) => {
        if (id !== latest.current) return;
        setItems(r.data);
        setMeta(r.meta ?? null);
        setError("");
      })
      .catch((e) => id === latest.current && setError(msg(e)))
      .finally(() => id === latest.current && setLoadedFor(`${blogListKey(filters)}#${refreshes}`));
  }, [filters, refreshes, msg]);

  const refresh = useCallback(() => {
    dropCached((k) => k.startsWith("blog:"));
    setRefreshes((n) => n + 1);
  }, []);

  async function toggle(p: BlogPostSummary) {
    const next: BlogStatus = p.status === "published" ? "draft" : "published";
    setBusyId(p.id);
    setError("");
    try {
      const r = await api.setBlogStatus(p.id, next);
      setItems((list) => list.map((x) => (x.id === p.id ? { ...x, status: r.data.status, updatedAt: r.data.updatedAt, updatedBy: r.data.updatedBy } : x)));
    } catch (e) {
      setError(msg(e));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(p: BlogPostSummary) {
    if (!window.confirm(`Delete "${p.title}" for good? This cannot be undone.`)) return;
    setBusyId(p.id);
    setError("");
    try {
      await api.deleteBlogPost(p.id);
      setItems((list) => list.filter((x) => x.id !== p.id));
      setMeta((m) => (m ? { ...m, total: Math.max(0, m.total - 1) } : m));
    } catch (e) {
      setError(msg(e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Blogs</h1>
          <p className="mt-1 text-sm text-dash-muted">Write and publish the posts that appear on the website&apos;s blog.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-dash-line bg-dash-card px-3.5 py-2.5 text-sm font-medium transition hover:bg-dash-bg disabled:opacity-60"
            title="Load the latest posts from the server"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          {canEdit && (
            <Link href="/dashboard/blogs/new" className="flex items-center gap-2 rounded-xl bg-dash-gold-dark px-4 py-2.5 text-sm font-semibold text-dash-on-gold transition hover:brightness-110">
              <Plus className="size-4" /> New post
            </Link>
          )}
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_200px]">
        <label className="relative">
          <span className="sr-only">Search posts</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dash-muted" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or web address" maxLength={80} className={`${input} w-full pl-9`} />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as BlogStatus | "", page: 1 }))} className={`${input} w-full`}>
            <option value="">All posts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dash-line bg-dash-card px-6 py-16 text-center text-sm text-dash-muted">
          {filters.q || filters.status ? "No posts match these filters." : "No posts yet. Create your first one with “New post”."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-dash-line bg-dash-card">
          <ul className={clsx("divide-y divide-dash-line transition-opacity", loading && "opacity-60")} aria-busy={loading}>
            {items.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
                <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-dash-bg sm:h-16 sm:w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element -- small list thumbnail */}
                  <img src={resolveMediaSrc(p.cover)} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/dashboard/blogs/edit?id=${encodeURIComponent(p.id)}`} className="truncate font-medium hover:text-dash-gold-dark hover:underline">
                      {p.title}
                    </Link>
                    <StatusPill status={p.status} />
                  </div>
                  <p className="mt-1 text-xs text-dash-muted">
                    {categoryLabel(p.category)} · {formatDay(p.date)} · by {p.author}
                    {p.updatedBy ? ` · edited by ${p.updatedBy}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {p.status === "published" && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" title="View on the website" aria-label={`View ${p.title} on the website`} className="rounded-lg p-2 text-dash-muted transition hover:bg-dash-bg hover:text-dash-ink">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <Link href={`/dashboard/blogs/edit?id=${encodeURIComponent(p.id)}`} title={canEdit ? "Edit" : "View"} aria-label={`${canEdit ? "Edit" : "View"} ${p.title}`} className="rounded-lg p-2 text-dash-muted transition hover:bg-dash-bg hover:text-dash-ink">
                    <Pencil className="size-4" />
                  </Link>
                  {canEdit && (
                    <button
                      onClick={() => toggle(p)}
                      disabled={busyId === p.id}
                      className="flex items-center gap-1.5 rounded-lg border border-dash-line px-3 py-1.5 text-xs font-semibold transition hover:bg-dash-bg disabled:opacity-60"
                    >
                      {p.status === "published" ? <Undo2 className="size-3.5" /> : <Send className="size-3.5" />}
                      {p.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => remove(p)} disabled={busyId === p.id} title="Delete" aria-label={`Delete ${p.title}`} className="rounded-lg p-2 text-red-700 transition hover:bg-red-50 disabled:opacity-60">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {meta && meta.total > 0 && (
            <div className="flex items-center justify-between border-t border-dash-line px-5 py-3 text-sm">
              <p className="text-dash-muted">
                {meta.total} post{meta.total === 1 ? "" : "s"} · page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setFilters((f) => ({ ...f, page: meta.page - 1 }))} disabled={meta.page <= 1 || loading} aria-label="Previous page" className="rounded-lg border border-dash-line p-2 hover:bg-dash-bg disabled:opacity-40">
                  <ChevronLeft className="size-4" />
                </button>
                <button onClick={() => setFilters((f) => ({ ...f, page: meta.page + 1 }))} disabled={meta.page >= meta.totalPages || loading} aria-label="Next page" className="rounded-lg border border-dash-line p-2 hover:bg-dash-bg disabled:opacity-40">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
