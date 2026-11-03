// ============================================
// Truffles Cafe Restaurant - Type Definitions
// ============================================

// --- Menu Types ---
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: MenuCategory;
  tags: string[];
  isAvailable: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  allergens?: string[];
  nutritionInfo?: NutritionInfo;
}

export type MenuCategory =
  | "starters"
  | "mains"
  | "desserts"
  | "beverages"
  | "specials"
  | "kids"
  | "sides";

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface MenuSection {
  id: string;
  title: string;
  description?: string;
  items: MenuItem[];
}

// --- Reservation Types ---
export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  occasion?: string;
  status: ReservationStatus;
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

// --- Contact Types ---
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// --- Blog Types ---
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  publishedAt: string;
  tags: string[];
  readingTime: number;
}

export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
}

// --- Gallery Types ---
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  width: number;
  height: number;
}

export type GalleryCategory =
  | "interior"
  | "food"
  | "drinks"
  | "events"
  | "ambience";

// --- Event Types ---
export interface RestaurantEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image?: string;
  price?: number;
  isFeatured: boolean;
}

// --- Testimonial Types ---
export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

// --- Team Types ---
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// --- Navigation Types ---
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// --- SEO Types ---
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

// --- API Response Types ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

