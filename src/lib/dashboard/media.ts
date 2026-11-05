const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 3 * 1024 * 1024; // what the server accepts
const MAX_SIDE = 2000; // pixels: plenty for a blog, and keeps pictures light for visitors
const KEEP_AS_IS_BYTES = 1.5 * 1024 * 1024;

/**
 * Gets a picture ready to upload: checks the type, and shrinks big photos in the browser (longest side 2000 px,
 * saved as WebP). Phone photos are often 5-10 MB; after this they are typically a few hundred KB, which is faster for
 * visitors and lighter on the server and database.
 */
export async function prepareImage(file: File): Promise<Blob> {
  if (!ALLOWED.includes(file.type)) throw new Error("Please choose a JPEG, PNG, WebP or GIF picture.");

  if (file.type === "image/gif") {
    // keep animation: no re-encoding
    if (file.size > MAX_BYTES) throw new Error("That GIF is over 3 MB. Please choose a smaller one.");
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("That file could not be read as a picture.");
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= KEEP_AS_IS_BYTES) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Your browser could not process that picture.");
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (type: string, quality: number) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  let blob = await toBlob("image/webp", 0.85);
  if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg", 0.85);
  if (!blob) throw new Error("Your browser could not process that picture.");
  if (blob.size > MAX_BYTES) throw new Error("That picture is still over 3 MB after shrinking. Please choose a smaller one.");
  return blob;
}

/** Pulls the 11-character video id out of a YouTube link (watch, youtu.be, embed, shorts) or a bare id. */
export function youtubeId(input: string): string | null {
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else {
        const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/);
        id = m ? m[1] : null;
      }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** "Hi-Tea at Truffles: What to Expect" -> "hi-tea-at-truffles-what-to-expect" (the server makes the final, unique one) */
export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}
