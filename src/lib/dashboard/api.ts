import type {
  AdminUser,
  BlogFilters,
  BlogPostFull,
  BlogPostInput,
  BlogPostSummary,
  BlogStatus,
  HistoryEntry,
  MaintenanceInput,
  MaintenanceLogEntry,
  MaintenanceSettings,
  PageMeta,
  Reservation,
  ReservationFilters,
  ReservationStats,
  ReservationStatus,
} from "@/types/dashboard";
import { API_V1 } from "@/lib/backend";
import { cached, dropCached, updateCached } from "./cache";

// The dashboard talks to the same API as the rest of the site (its /dashboard routes), through the site's one backend setting.
const BASE = API_V1;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    /** per-field problems from the server (validation errors), when it sent any */
    public details: { field: string; message: string }[] = [],
  ) {
    super(message);
  }
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PageMeta;
}

/** One place that talks to the API. The session lives in an HttpOnly cookie, so the browser sends it for us. */
async function request<T>(path: string, init: RequestInit = {}): Promise<Envelope<T>> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection and try again.", 0);
  }
  let body: Partial<Envelope<T>> & { errors?: { field: string; message: string }[] } = {};
  try {
    body = await res.json();
  } catch {
    /* empty or non-JSON body */
  }
  if (!res.ok) {
    throw new ApiError(body.message || `Request failed (${res.status})`, res.status, Array.isArray(body.errors) ? body.errors : []);
  }
  return body as Envelope<T>;
}

const PAGE_SIZE = 10;

/** Fired on the window when the maintenance settings change (so other parts of the page can follow). */
export const MAINTENANCE_EVENT = "dashboard:maintenance";

/** The cache key of one page of the reservation list (also tells the cache which filters it was loaded with). */
export function listKey(f: ReservationFilters, limit = PAGE_SIZE): string {
  const p = new URLSearchParams({ page: String(f.page), limit: String(limit), sort: f.sort });
  if (f.status) p.set("status", f.status);
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.from) p.set("from", f.from);
  if (f.to) p.set("to", f.to);
  return `res:${p}`;
}

type ListEnvelope = Envelope<Reservation[]>;


/** The cache key of one page of the blog list. */
export function blogListKey(f: BlogFilters): string {
  const p = new URLSearchParams({ page: String(f.page), limit: "10" });
  if (f.status) p.set("status", f.status);
  if (f.q.trim()) p.set("q", f.q.trim());
  return `blog:list:${p}`;
}

/** After saving / publishing a post: the lists are out of date (order, status, title), so they are dropped and fetched
 *  when next looked at; the post's own cached copy is replaced with what the server just returned. */
function afterBlogChange(post: BlogPostFull) {
  dropCached((key) => key.startsWith("blog:list:"));
  updateCached<{ data: BlogPostFull }>(`blog:post:${post.id}`, (_k, env) => ({ ...env, data: post }));
  void cached(`blog:post:${post.id}`, async () => ({ success: true, message: "", data: post }) as Envelope<BlogPostFull>);
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: AdminUser }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request<null>("/auth/logout", { method: "POST" }),
  me: () => request<AdminUser>("/auth/me"),

  // ---- reads: each is asked of the server once, then served from the cache (see cache.ts) ----
  stats: () => cached("stats", () => request<ReservationStats>("/dashboard/reservations/stats")),

  reservations: (f: ReservationFilters, limit = PAGE_SIZE) => {
    const key = listKey(f, limit);
    return cached(key, () => request<Reservation[]>(`/dashboard/reservations?${key.slice("res:".length)}`));
  },

  history: (id: string) =>
    cached(`hist:${id}`, () => request<HistoryEntry[]>(`/dashboard/reservations/${encodeURIComponent(id)}/history`)),

  /**
   * Changes a status. Afterwards the cache is brought in line so nothing has to be fetched again:
   *  - the reservation is updated inside every cached list that contains it;
   *  - lists filtered by status (their membership changed) are dropped, except the one on screen (`keepKey`),
   *    which keeps showing the row with its new status;
   *  - the overview numbers and this reservation's history are dropped (they are fetched when next looked at).
   */
  setStatus: async (id: string, status: ReservationStatus, keepKey?: string) => {
    const r = await request<Reservation>(`/dashboard/reservations/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    updateCached<ListEnvelope>("res:", (_key, env) => ({ ...env, data: env.data.map((x) => (x.id === id ? r.data : x)) }));
    dropCached((key) => key === "stats" || key === `hist:${id}` || (key.startsWith("res:") && key.includes("status=") && key !== keepKey));
    return r;
  },

  // ---------------- blog ----------------
  blogPosts: (f: BlogFilters) => {
    const key = blogListKey(f);
    return cached(key, () => request<BlogPostSummary[]>(`/dashboard/blog/posts?${key.slice("blog:list:".length)}`));
  },

  blogPost: (id: string) => cached(`blog:post:${id}`, () => request<BlogPostFull>(`/dashboard/blog/posts/${encodeURIComponent(id)}`)),

  createBlogPost: async (input: BlogPostInput) => {
    const r = await request<BlogPostFull>("/dashboard/blog/posts", { method: "POST", body: JSON.stringify(input) });
    afterBlogChange(r.data);
    return r;
  },

  updateBlogPost: async (id: string, input: BlogPostInput) => {
    const r = await request<BlogPostFull>(`/dashboard/blog/posts/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });
    afterBlogChange(r.data);
    return r;
  },

  setBlogStatus: async (id: string, status: BlogStatus) => {
    const r = await request<BlogPostFull>(`/dashboard/blog/posts/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    afterBlogChange(r.data);
    return r;
  },

  deleteBlogPost: async (id: string) => {
    await request<null>(`/dashboard/blog/posts/${encodeURIComponent(id)}`, { method: "DELETE" });
    dropCached((key) => key.startsWith("blog:list:") || key === `blog:post:${id}`);
  },

  /** Sends one picture (already shrunk in the browser) and returns its `/media/<id>` path. */
  uploadImage: async (blob: Blob): Promise<string> => {
    let res: Response;
    try {
      res = await fetch(`${BASE}/dashboard/media`, { method: "POST", credentials: "include", headers: { "Content-Type": blob.type }, body: blob });
    } catch {
      throw new ApiError("Cannot reach the server. Check your connection and try again.", 0);
    }
    const body = (await res.json().catch(() => ({}))) as { message?: string; data?: { path?: string } };
    if (!res.ok || !body.data?.path) throw new ApiError(body.message || `Upload failed (${res.status})`, res.status);
    return body.data.path;
  },

  // ---------------- maintenance ----------------
  maintenance: () => cached("maint", () => request<MaintenanceSettings>("/dashboard/maintenance")),

  maintenanceHistory: () => cached("maint:history", () => request<MaintenanceLogEntry[]>("/dashboard/maintenance/history")),

  /** Saves the settings (and switches the live website's maintenance mode on or off). */
  saveMaintenance: async (input: MaintenanceInput) => {
    const r = await request<MaintenanceSettings>("/dashboard/maintenance", { method: "PUT", body: JSON.stringify(input) });
    // what the server just returned replaces the cached copy, and the history list is fetched again when next looked at
    dropCached((key) => key === "maint" || key === "maint:history");
    void cached("maint", async () => r);
    // lets the "maintenance is ON" banner in the page frame update straight away
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<MaintenanceSettings>(MAINTENANCE_EVENT, { detail: r.data }));
    return r;
  },
};
