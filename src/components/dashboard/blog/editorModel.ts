import type { Block } from "@/types/dashboard";
import { youtubeId } from "@/lib/dashboard/media";

/** A block as the editor holds it: the real block plus a stable key (for React) and, for lists, the raw typed text. */
export type EditorBlock = Block & { key: string; raw?: string; videoInput?: string };

let counter = 0;
const nextKey = () => `b${++counter}`;

/** Blocks the editor can add. (Older "pairing" blocks are kept and shown, but cannot be created here.) */
export const ADDABLE: { type: Block["type"]; label: string; hint: string }[] = [
  { type: "p", label: "Paragraph", hint: "Normal text" },
  { type: "h2", label: "Heading", hint: "A section title" },
  { type: "list", label: "List", hint: "Bullet points in a card" },
  { type: "quote", label: "Quote", hint: "A highlighted quote" },
  { type: "note", label: "Note", hint: "A tip or highlighted note" },
  { type: "image", label: "Picture", hint: "One large picture" },
  { type: "gallery", label: "Gallery", hint: "Several small pictures" },
  { type: "video", label: "YouTube video", hint: "Plays after a click" },
  { type: "cta", label: "Button", hint: "A call-to-action button" },
];

export const BLOCK_LABEL: Record<Block["type"], string> = {
  p: "Paragraph",
  h2: "Heading",
  list: "List",
  quote: "Quote",
  note: "Note",
  pairing: "Drink pairings",
  image: "Picture",
  gallery: "Gallery",
  video: "YouTube video",
  cta: "Button",
};

export function emptyBlock(type: Block["type"]): EditorBlock {
  const key = nextKey();
  switch (type) {
    case "p":
      return { key, type, text: "" };
    case "h2":
      return { key, type, text: "" };
    case "list":
      return { key, type, title: "", items: [], raw: "" };
    case "quote":
      return { key, type, text: "", cite: "" };
    case "note":
      return { key, type, label: "", text: "" };
    case "image":
      return { key, type, src: "", alt: "", caption: "" };
    case "gallery":
      return { key, type, images: [] };
    case "video":
      return { key, type, video: { kind: "youtube", id: "" }, caption: "", videoInput: "" };
    case "cta":
      return { key, type, text: "", label: "", href: "/reservations" };
    case "pairing":
      return { key, type, items: [] };
  }
}

/** Blocks from the server -> editor blocks. */
export function toEditor(blocks: Block[]): EditorBlock[] {
  return blocks.map((b) => {
    const key = nextKey();
    if (b.type === "list") return { ...b, key, raw: b.items.join("\n") };
    if (b.type === "video") return { ...b, key, videoInput: b.video.kind === "youtube" ? b.video.id : "" };
    return { ...b, key };
  });
}

const opt = (s: string | undefined) => (s && s.trim() ? s.trim() : undefined);

/** Editor blocks -> what the server expects (keys and helper fields removed, blanks dropped). */
export function toPayload(blocks: EditorBlock[]): Block[] {
  return blocks.map((b): Block => {
    switch (b.type) {
      case "p":
      case "h2":
        return { type: b.type, text: b.text.trim() };
      case "list":
        return {
          type: "list",
          title: opt(b.title),
          items: (b.raw ?? b.items.join("\n"))
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean),
        };
      case "quote":
        return { type: "quote", text: b.text.trim(), cite: opt(b.cite) };
      case "note":
        return { type: "note", label: opt(b.label), text: b.text.trim() };
      case "image":
        return { type: "image", src: b.src, alt: b.alt.trim(), caption: opt(b.caption) };
      case "gallery":
        return { type: "gallery", images: b.images.map((i) => ({ src: i.src, alt: i.alt.trim() })) };
      case "video": {
        const id = b.video.kind === "youtube" ? (youtubeId(b.videoInput ?? "") ?? b.video.id) : "";
        return { type: "video", video: { kind: "youtube", id }, caption: opt(b.caption) };
      }
      case "cta":
        return { type: "cta", text: b.text.trim(), label: b.label.trim(), href: b.href.trim() };
      case "pairing":
        return { type: "pairing", items: b.items };
    }
  });
}

/** A plain-language problem with a block, or null when it is fine. `n` is its position (1-based) for the message. */
export function blockProblem(b: EditorBlock, n: number): string | null {
  const at = `Block ${n} (${BLOCK_LABEL[b.type]})`;
  switch (b.type) {
    case "p":
    case "h2":
      return b.text.trim() ? null : `${at} is empty.`;
    case "list":
      return (b.raw ?? "").split("\n").some((x) => x.trim()) ? null : `${at} needs at least one item.`;
    case "quote":
    case "note":
      return b.text.trim() ? null : `${at} is empty.`;
    case "image":
      if (!b.src) return `${at} needs a picture.`;
      return b.alt.trim() ? null : `${at} needs a short description of the picture.`;
    case "gallery":
      if (b.images.length === 0) return `${at} needs at least one picture.`;
      return b.images.every((i) => i.alt.trim()) ? null : `${at}: describe every picture.`;
    case "video":
      return youtubeId(b.videoInput ?? "") ? null : `${at} needs a valid YouTube link.`;
    case "cta": {
      if (!b.text.trim() || !b.label.trim()) return `${at} needs text and a button label.`;
      return /^(\/[A-Za-z0-9/_\-#?=&.%]*|https:\/\/\S+)$/.test(b.href.trim()) ? null : `${at}: the link must be a page on this site (like /reservations) or start with https://`;
    }
    default:
      return null;
  }
}
