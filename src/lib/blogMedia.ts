import { BACKEND_URL } from "@/lib/backend";
import type { Block } from "@/data/blogPosts";

/**
 * Blog posts made in the dashboard store pictures as `/media/<id>` (kept in the API's database).
 * This turns that into the address the browser can load; the site's own `/images/...` files stay as they are.
 */
export function resolveMediaSrc(src: string): string {
  return src.startsWith("/media/") ? `${BACKEND_URL}/api/v1${src}` : src;
}

/** The same post body, with every picture address ready to load. */
export function resolveBlocks(blocks: Block[]): Block[] {
  return blocks.map((b) => {
    if (b.type === "image") return { ...b, src: resolveMediaSrc(b.src) };
    if (b.type === "gallery") return { ...b, images: b.images.map((i) => ({ ...i, src: resolveMediaSrc(i.src) })) };
    return b;
  });
}
