"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/dashboard/api";
import { useAuth } from "@/components/dashboard/auth/AuthProvider";
import { useErrorMessage } from "@/hooks/dashboard/useErrorMessage";
import type { BlogPostFull } from "@/types/dashboard";
import { BlogEditor } from "./BlogEditor";

/** Loads the post named in the address (?id=...) once, then hands it to the editor. No id = a new post. */
function Loader() {
  const params = useSearchParams();
  const id = params.get("id");
  const created = params.get("created");
  const { user } = useAuth();
  const msg = useErrorMessage();
  const [loaded, setLoaded] = useState<{ id: string; post: BlogPostFull | null; error: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    api
      .blogPost(id)
      .then((r) => alive && setLoaded({ id, post: r.data, error: "" }))
      .catch((e) => alive && setLoaded({ id, post: null, error: msg(e) }));
    return () => {
      alive = false;
    };
  }, [id, msg]);

  const canEdit = user?.role !== "staff";
  const canDelete = user?.role === "admin" || user?.role === "super_admin";

  if (!id) return <BlogEditor key="new" initial={null} canEdit={canEdit} canDelete={canDelete} />;

  if (!loaded || loaded.id !== id) {
    return (
      <div className="flex justify-center py-24 text-dash-gold">
        <Loader2 className="size-6 animate-spin" aria-label="Loading" />
      </div>
    );
  }
  if (!loaded.post) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {loaded.error || "That post could not be found."}
        </p>
        <Link href="/dashboard/blogs" className="mt-4 inline-block text-sm font-medium text-dash-gold-dark hover:underline">
          ← Back to all posts
        </Link>
      </div>
    );
  }
  return (
    <BlogEditor
      key={loaded.post.id}
      initial={loaded.post}
      canEdit={canEdit}
      canDelete={canDelete}
      banner={created === "published" ? "Post created and published." : created === "draft" ? "Draft created." : undefined}
    />
  );
}

export function BlogEditorScreen() {
  // useSearchParams needs a Suspense boundary so the page can still be built ahead of time
  return (
    <Suspense fallback={null}>
      <Loader />
    </Suspense>
  );
}
