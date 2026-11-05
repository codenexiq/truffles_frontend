export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** YYYY-MM-DD */
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReservationSort = "newest" | "date_asc" | "date_desc";

export interface ReservationFilters {
  status: ReservationStatus | "";
  q: string;
  from: string;
  to: string;
  sort: ReservationSort;
  page: number;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReservationStats {
  total: number;
  byStatus: Record<ReservationStatus, number>;
  today: { reservations: number; guests: number };
  upcomingWeek: number;
}

export type StaffRole = "super_admin" | "admin" | "manager" | "staff";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
}

/** One status change of a reservation (who, when, from what to what). */
export interface HistoryEntry {
  id: string;
  fromStatus: ReservationStatus | null;
  toStatus: ReservationStatus;
  changedAt: string;
  /** staff member's name; null for a guest */
  changedBy: string | null;
  source: "staff" | "guest";
}

// ---------------- blog ----------------
import type { Block, BlogCategoryId } from "@/data/blogPosts";

export type { Block, BlogCategoryId };
export type BlogStatus = "draft" | "published";

/** A post as listed in the dashboard (no body). */
export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategoryId;
  author: string;
  /** `/images/...` or `/media/<id>` */
  cover: string;
  coverAlt: string;
  hasVideo: boolean;
  status: BlogStatus;
  /** YYYY-MM-DD shown on the post */
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface BlogPostFull extends BlogPostSummary {
  body: Block[];
}

/** What the editor sends when saving. */
export interface BlogPostInput {
  slug?: string;
  title: string;
  excerpt: string;
  category: BlogCategoryId;
  author: string;
  cover: string;
  coverAlt: string;
  body: Block[];
  status: BlogStatus;
  date: string;
}

export interface BlogFilters {
  status: BlogStatus | "";
  q: string;
  page: number;
}

// ---------------- maintenance ----------------
export interface MaintenanceSettings {
  enabled: boolean;
  title: string;
  message: string;
  /** free text such as "around 8 PM tonight" */
  eta: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface MaintenanceLogEntry {
  id: string;
  enabled: boolean;
  title: string;
  changedAt: string;
  changedBy: string | null;
}

export interface MaintenanceInput {
  enabled: boolean;
  title: string;
  message: string;
  eta: string;
}
