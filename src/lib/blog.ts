import { cacheLife } from "next/cache";
import { API_V1 } from "@/lib/backend";
import { resolveBlocks, resolveMediaSrc } from "@/lib/blogMedia";
import { POSTS as BUILT_IN_POSTS, type BlogPost } from "@/data/blogPosts";

/** A published post as the API sends it (see the backend's /api/v1/blog/posts). */
type ApiPost = Omit<BlogPost, "cover" | "body"> & { cover: string; body: BlogPost["body"] };

/**
 * Posts published from the dashboard. The answer is kept for about a minute (and shared by every visitor), so the
 * API is asked roughly once a minute however many people read the blog. If the API cannot be reached the website
 * simply shows its built-in posts: the blog never goes down with it.
 */
async function fetchDashboardPosts(): Promise<BlogPost[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${API_V1}/blog/posts`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: ApiPost[] };
    if (!Array.isArray(json.data)) return [];
    return json.data.map((p) => ({ ...p, cover: resolveMediaSrc(p.cover), body: resolveBlocks(p.body) }));
  } catch {
    return [];
  }
}

/** Every post to show on the website, newest first: the dashboard's posts plus the built-in ones. */
export async function getAllPosts(): Promise<BlogPost[]> {
  const fromDashboard = await fetchDashboardPosts();
  // A dashboard post with the same web address replaces the built-in one (that is how a built-in post is overridden).
  const taken = new Set(fromDashboard.map((p) => p.slug));
  const all = [...fromDashboard, ...BUILT_IN_POSTS.filter((p) => !taken.has(p.slug))];
  return all.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug);
}
