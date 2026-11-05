"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Loader2, Pencil, Save, Send, Trash2, Undo2 } from "lucide-react";
import { api, ApiError } from "@/lib/dashboard/api";
import { slugify } from "@/lib/dashboard/media";
import { BLOG_CATEGORIES } from "@/data/blogPosts";
import { useErrorMessage } from "@/hooks/dashboard/useErrorMessage";
import type { BlogCategoryId, BlogPostFull, BlogPostInput, BlogStatus } from "@/types/dashboard";
import { BlockEditor } from "./BlockEditor";
import { blockProblem, toEditor, toPayload, type EditorBlock } from "./editorModel";
import { ImageField } from "./ImageField";
import { PostPreview } from "./PostPreview";

interface Draft {
  title: string;
  slug: string;
  /** true once the editor has typed a web address themselves (then it is no longer made from the title) */
  slugTouched: boolean;
  excerpt: string;
  category: BlogCategoryId;
  author: string;
  cover: string;
  coverAlt: string;
  date: string;
  body: EditorBlock[];
}

/** Today in Pakistan time (UTC+5), the restaurant's clock. */
const pktToday = () => new Date(Date.now() + 5 * 3600_000).toISOString().slice(0, 10);

const blank = (): Draft => ({
  title: "",
  slug: "",
  slugTouched: false,
  excerpt: "",
  category: "menu",
  author: "The Truffles Team",
  cover: "",
  coverAlt: "",
  date: pktToday(),
  body: [],
});

const fromPost = (p: BlogPostFull): Draft => ({
  title: p.title,
  slug: p.slug,
  slugTouched: true,
  excerpt: p.excerpt,
  category: p.category,
  author: p.author,
  cover: p.cover,
  coverAlt: p.coverAlt,
  date: p.date,
  body: toEditor(p.body),
});

const snapshot = (d: Draft) => JSON.stringify({ ...d, body: toPayload(d.body) });

function problems(d: Draft): string[] {
  const out: string[] = [];
  if (d.title.trim().length < 3) out.push("Add a title (at least 3 characters).");
  if (d.excerpt.trim().length < 10) out.push("Write a short summary (at least 10 characters). It appears on the blog page.");
  if (d.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) out.push("The web address can only use lowercase letters, numbers and single dashes.");
  if (!d.author.trim()) out.push("Add an author name.");
  if (!d.cover) out.push("Upload a cover picture.");
  else if (d.coverAlt.trim().length < 2) out.push("Describe the cover picture (for screen readers).");
  if (d.body.length === 0) out.push("Add at least one block of content.");
  d.body.forEach((b, i) => {
    const p = blockProblem(b, i + 1);
    if (p) out.push(p);
  });
  return out;
}

const field =
  "w-full rounded-xl border border-dash-line bg-dash-card px-3.5 py-2.5 text-sm text-dash-ink placeholder:text-dash-muted/70 focus:border-dash-gold focus:outline-none disabled:opacity-60";
const lab = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dash-muted";

export function BlogEditor({ initial, canEdit, canDelete, banner }: { initial: BlogPostFull | null; canEdit: boolean; canDelete: boolean; banner?: string }) {
  const router = useRouter();
  const msg = useErrorMessage();
  const [draft, setDraft] = useState<Draft>(() => (initial ? fromPost(initial) : blank()));
  const [status, setStatus] = useState<BlogStatus>(initial?.status ?? "draft");
  const [postId] = useState<string | null>(initial?.id ?? null);
  const [savedSnap, setSavedSnap] = useState(() => snapshot(initial ? fromPost(initial) : blank()));
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [busy, setBusy] = useState<BlogStatus | "delete" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState(banner ?? "");

  const dirty = useMemo(() => snapshot(draft) !== savedSnap, [draft, savedSnap]);

  // warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (p: Partial<Draft>) => {
    setNotice("");
    setDraft((d) => ({ ...d, ...p }));
  };
  const setTitle = (title: string) => set({ title, ...(draft.slugTouched ? {} : { slug: slugify(title) }) });

  async function save(target: BlogStatus) {
    const list = problems(draft);
    if (list.length > 0) {
      setErrors(list);
      return;
    }
    setErrors([]);
    setNotice("");
    setBusy(target);
    const input: BlogPostInput = {
      ...(draft.slug ? { slug: draft.slug } : {}),
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      category: draft.category,
      author: draft.author.trim(),
      cover: draft.cover,
      coverAlt: draft.coverAlt.trim(),
      body: toPayload(draft.body),
      status: target,
      date: draft.date,
    };
    try {
      if (postId) {
        const r = await api.updateBlogPost(postId, { ...input, slug: draft.slug || undefined });
        setStatus(r.data.status);
        setDraft((d) => ({ ...d, slug: r.data.slug, slugTouched: true }));
        setSavedSnap(snapshot({ ...draft, slug: r.data.slug, slugTouched: true }));
        setNotice(target === "published" ? "Saved and published." : status === "published" && target === "draft" ? "Saved and moved back to drafts." : "Saved.");
      } else {
        const r = await api.createBlogPost(input);
        setSavedSnap(snapshot(draft)); // nothing left unsaved: no "leave page?" prompt while we move to the edit page
        router.replace(`/dashboard/blogs/edit?id=${encodeURIComponent(r.data.id)}&created=${target === "published" ? "published" : "draft"}`);
        return;
      }
    } catch (e) {
      const details = e instanceof ApiError ? e.details : [];
      setErrors(details.length ? details.map((d) => `${d.field.replace(/^body\./, "")}: ${d.message}`) : [msg(e)]);
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!postId || !window.confirm(`Delete "${draft.title}" for good? This cannot be undone.`)) return;
    setBusy("delete");
    try {
      await api.deleteBlogPost(postId);
      setSavedSnap(snapshot(draft));
      router.replace("/dashboard/blogs");
    } catch (e) {
      setErrors([msg(e)]);
      setBusy(null);
    }
  }

  const disabled = !canEdit || busy !== null;
  const publicUrl = status === "published" && draft.slug ? `/blog/${draft.slug}` : null;

  return (
    <div className="mx-auto max-w-4xl pb-28">
      <Link href="/dashboard/blogs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-dash-muted hover:text-dash-ink">
        <ArrowLeft className="size-4" /> All posts
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">{postId ? "Edit post" : "New post"}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-dash-muted">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${status === "published" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-amber-50 text-amber-800 ring-amber-200"}`}>
              {status === "published" ? "Published" : "Draft"}
            </span>
            {dirty && <span>Unsaved changes</span>}
            {publicUrl && (
              <a href={publicUrl} target="_blank" rel="noreferrer" className="font-medium text-dash-gold-dark hover:underline">
                View on the website ↗
              </a>
            )}
          </p>
        </div>

        <div className="flex rounded-xl border border-dash-line bg-dash-card p-1 text-sm" role="tablist" aria-label="Editor view">
          {(
            [
              ["edit", "Edit", Pencil],
              ["preview", "Preview", Eye],
            ] as const
          ).map(([id, text, Icon]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-medium transition ${tab === id ? "bg-dash-gold-soft text-dash-gold-dark" : "text-dash-muted hover:text-dash-ink"}`}
            >
              <Icon className="size-4" /> {text}
            </button>
          ))}
        </div>
      </div>

      {!canEdit && <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">Your account can view posts but not change them.</p>}
      {notice && (
        <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {errors.length > 0 && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">Please fix this before saving:</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {errors.slice(0, 8).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "preview" ? (
        <PostPreview title={draft.title} excerpt={draft.excerpt} category={draft.category} author={draft.author} date={draft.date} cover={draft.cover} coverAlt={draft.coverAlt} body={toPayload(draft.body)} />
      ) : (
        <div className="space-y-8">
          <section className="space-y-4 rounded-2xl border border-dash-line bg-dash-card p-5 sm:p-6">
            <h2 className="font-serif text-xl">Details</h2>
            <div>
              <label className={lab} htmlFor="title">Title</label>
              <input id="title" value={draft.title} onChange={(e) => setTitle(e.target.value)} maxLength={160} disabled={disabled} className={field} />
            </div>
            <div>
              <label className={lab} htmlFor="slug">Web address</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-dash-muted">/blog/</span>
                <input
                  id="slug"
                  value={draft.slug}
                  onChange={(e) => set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"), slugTouched: true })}
                  maxLength={120}
                  disabled={disabled}
                  className={field}
                  placeholder="made from the title"
                />
              </div>
              <p className="mt-1 text-xs text-dash-muted">Changing it later changes the post&apos;s link.</p>
            </div>
            <div>
              <label className={lab} htmlFor="excerpt">Short summary</label>
              <textarea id="excerpt" value={draft.excerpt} onChange={(e) => set({ excerpt: e.target.value })} rows={3} maxLength={300} disabled={disabled} className={field} />
              <p className="mt-1 text-right text-xs text-dash-muted">{draft.excerpt.length}/300 · shown on the blog page and in search results</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={lab} htmlFor="category">Category</label>
                <select id="category" value={draft.category} onChange={(e) => set({ category: e.target.value as BlogCategoryId })} disabled={disabled} className={field}>
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lab} htmlFor="author">Author</label>
                <input id="author" value={draft.author} onChange={(e) => set({ author: e.target.value })} maxLength={80} disabled={disabled} className={field} />
              </div>
              <div>
                <label className={lab} htmlFor="date">Date shown</label>
                <input id="date" type="date" value={draft.date} onChange={(e) => set({ date: e.target.value })} disabled={disabled} className={field} />
              </div>
            </div>
            <p className="text-xs text-dash-muted">A published post with a future date appears on the website on that day.</p>
          </section>

          <section className="space-y-4 rounded-2xl border border-dash-line bg-dash-card p-5 sm:p-6">
            <h2 className="font-serif text-xl">Cover picture</h2>
            <ImageField label="Cover" value={draft.cover} onChange={(cover) => set({ cover })} disabled={disabled} />
            <div>
              <label className={lab} htmlFor="coverAlt">Description (for screen readers)</label>
              <input id="coverAlt" value={draft.coverAlt} onChange={(e) => set({ coverAlt: e.target.value })} maxLength={200} disabled={disabled} className={field} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl">Content</h2>
            <BlockEditor blocks={draft.body} onChange={(body) => set({ body })} disabled={disabled} />
          </section>
        </div>
      )}

      {/* actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-dash-line bg-dash-card/95 px-4 py-3 backdrop-blur lg:left-[260px]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <div>
            {postId && canDelete && (
              <button onClick={remove} disabled={busy !== null} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60">
                {busy === "delete" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Delete
              </button>
            )}
          </div>
          {canEdit && (
            <div className="flex flex-wrap items-center gap-2">
              {status === "published" ? (
                <>
                  <Action onClick={() => save("draft")} busy={busy === "draft"} disabled={busy !== null} icon={<Undo2 className="size-4" />} variant="ghost">
                    Unpublish
                  </Action>
                  <Action onClick={() => save("published")} busy={busy === "published"} disabled={busy !== null || (!dirty && !!postId)} icon={<Save className="size-4" />}>
                    Save changes
                  </Action>
                </>
              ) : (
                <>
                  <Action onClick={() => save("draft")} busy={busy === "draft"} disabled={busy !== null || (!dirty && !!postId)} icon={<Save className="size-4" />} variant="ghost">
                    Save draft
                  </Action>
                  <Action onClick={() => save("published")} busy={busy === "published"} disabled={busy !== null} icon={<Send className="size-4" />}>
                    Publish
                  </Action>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Action({ children, onClick, busy, disabled, icon, variant = "primary" }: { children: React.ReactNode; onClick: () => void; busy: boolean; disabled: boolean; icon: React.ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
        variant === "primary" ? "bg-dash-gold-dark text-dash-on-gold hover:brightness-110" : "border border-dash-line bg-dash-card text-dash-ink hover:bg-dash-bg"
      }`}
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
