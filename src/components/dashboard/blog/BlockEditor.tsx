"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { youtubeId } from "@/lib/dashboard/media";
import { ADDABLE, BLOCK_LABEL, emptyBlock, type EditorBlock } from "./editorModel";
import { ImageField } from "./ImageField";

const input =
  "w-full rounded-lg border border-dash-line bg-dash-card px-3 py-2 text-sm text-dash-ink placeholder:text-dash-muted/70 focus:border-dash-gold focus:outline-none disabled:opacity-60";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-dash-muted";

/** The post's content: a stack of blocks that can be added, edited, reordered and removed. */
export function BlockEditor({
  blocks,
  onChange,
  disabled = false,
}: {
  blocks: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
  disabled?: boolean;
}) {
  const patch = (i: number, p: Partial<EditorBlock>) => onChange(blocks.map((b, j) => (j === i ? ({ ...b, ...p } as EditorBlock) : b)));
  const remove = (i: number) => onChange(blocks.filter((_, j) => j !== i));
  const move = (i: number, d: -1 | 1) => {
    const k = i + d;
    if (k < 0 || k >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[k]] = [next[k], next[i]];
    onChange(next);
  };

  return (
    <div>
      {blocks.length === 0 && (
        <p className="rounded-xl border border-dashed border-dash-line bg-dash-card px-4 py-8 text-center text-sm text-dash-muted">
          No content yet. Add your first block below.
        </p>
      )}

      <ol className="space-y-3">
        {blocks.map((b, i) => (
          <li key={b.key} className="rounded-xl border border-dash-line bg-dash-card">
            <div className="flex items-center justify-between border-b border-dash-line px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-dash-gold-dark">
                {i + 1}. {BLOCK_LABEL[b.type]}
              </p>
              <div className="flex items-center gap-1">
                <IconBtn title="Move up" onClick={() => move(i, -1)} disabled={disabled || i === 0}>
                  <ArrowUp className="size-4" />
                </IconBtn>
                <IconBtn title="Move down" onClick={() => move(i, 1)} disabled={disabled || i === blocks.length - 1}>
                  <ArrowDown className="size-4" />
                </IconBtn>
                <IconBtn title="Remove this block" onClick={() => remove(i)} disabled={disabled} danger>
                  <Trash2 className="size-4" />
                </IconBtn>
              </div>
            </div>

            <div className="space-y-3 p-4">
              {b.type === "p" && (
                <div>
                  <label className={label}>Text</label>
                  <textarea value={b.text} onChange={(e) => patch(i, { text: e.target.value })} rows={5} maxLength={4000} disabled={disabled} className={input} />
                </div>
              )}

              {b.type === "h2" && (
                <div>
                  <label className={label}>Heading</label>
                  <input value={b.text} onChange={(e) => patch(i, { text: e.target.value })} maxLength={200} disabled={disabled} className={input} />
                </div>
              )}

              {b.type === "list" && (
                <>
                  <div>
                    <label className={label}>Card title (optional)</label>
                    <input value={b.title ?? ""} onChange={(e) => patch(i, { title: e.target.value })} maxLength={100} disabled={disabled} className={input} placeholder="e.g. Good to know" />
                  </div>
                  <div>
                    <label className={label}>Items (one per line)</label>
                    <textarea value={b.raw ?? ""} onChange={(e) => patch(i, { raw: e.target.value })} rows={5} disabled={disabled} className={input} />
                  </div>
                </>
              )}

              {b.type === "quote" && (
                <>
                  <div>
                    <label className={label}>Quote</label>
                    <textarea value={b.text} onChange={(e) => patch(i, { text: e.target.value })} rows={3} maxLength={600} disabled={disabled} className={input} />
                  </div>
                  <div>
                    <label className={label}>Who said it (optional)</label>
                    <input value={b.cite ?? ""} onChange={(e) => patch(i, { cite: e.target.value })} maxLength={100} disabled={disabled} className={input} />
                  </div>
                </>
              )}

              {b.type === "note" && (
                <>
                  <div>
                    <label className={label}>Label (optional)</label>
                    <input value={b.label ?? ""} onChange={(e) => patch(i, { label: e.target.value })} maxLength={40} disabled={disabled} className={input} placeholder="e.g. Tip" />
                  </div>
                  <div>
                    <label className={label}>Note</label>
                    <textarea value={b.text} onChange={(e) => patch(i, { text: e.target.value })} rows={3} maxLength={600} disabled={disabled} className={input} />
                  </div>
                </>
              )}

              {b.type === "image" && (
                <>
                  <ImageField label="Picture" value={b.src} onChange={(src) => patch(i, { src })} disabled={disabled} />
                  <div>
                    <label className={label}>Description (for screen readers)</label>
                    <input value={b.alt} onChange={(e) => patch(i, { alt: e.target.value })} maxLength={200} disabled={disabled} className={input} />
                  </div>
                  <div>
                    <label className={label}>Caption (optional)</label>
                    <input value={b.caption ?? ""} onChange={(e) => patch(i, { caption: e.target.value })} maxLength={200} disabled={disabled} className={input} />
                  </div>
                </>
              )}

              {b.type === "gallery" && (
                <>
                  <div className="space-y-3">
                    {b.images.map((img, k) => (
                      <div key={`${img.src}-${k}`} className="flex flex-col gap-3 rounded-lg bg-dash-bg p-3 sm:flex-row sm:items-start">
                        <ImageField
                          compact
                          label={`Picture ${k + 1}`}
                          value={img.src}
                          disabled={disabled}
                          onChange={(src) =>
                            patch(i, { images: src ? b.images.map((x, j) => (j === k ? { ...x, src } : x)) : b.images.filter((_, j) => j !== k) } as Partial<EditorBlock>)
                          }
                        />
                        <div className="flex-1">
                          <label className={label}>Description</label>
                          <input
                            value={img.alt}
                            onChange={(e) => patch(i, { images: b.images.map((x, j) => (j === k ? { ...x, alt: e.target.value } : x)) } as Partial<EditorBlock>)}
                            maxLength={200}
                            disabled={disabled}
                            className={input}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {b.images.length < 12 && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => patch(i, { images: [...b.images, { src: "", alt: "" }] } as Partial<EditorBlock>)}
                      className="flex items-center gap-2 text-sm font-medium text-dash-gold-dark hover:underline disabled:opacity-60"
                    >
                      <Plus className="size-4" /> Add a picture
                    </button>
                  )}
                </>
              )}

              {b.type === "video" && (
                <>
                  <div>
                    <label className={label}>YouTube link</label>
                    <input
                      value={b.videoInput ?? ""}
                      onChange={(e) => patch(i, { videoInput: e.target.value })}
                      disabled={disabled}
                      className={input}
                      placeholder="https://www.youtube.com/watch?v=…"
                    />
                    <p className="mt-1 text-xs text-dash-muted">
                      {b.videoInput ? (youtubeId(b.videoInput) ? "✓ Video found." : "That does not look like a YouTube link.") : "Paste the video's address from YouTube."}
                    </p>
                  </div>
                  <div>
                    <label className={label}>Caption (optional)</label>
                    <input value={b.caption ?? ""} onChange={(e) => patch(i, { caption: e.target.value })} maxLength={200} disabled={disabled} className={input} />
                  </div>
                </>
              )}

              {b.type === "cta" && (
                <>
                  <div>
                    <label className={label}>Text next to the button</label>
                    <input value={b.text} onChange={(e) => patch(i, { text: e.target.value })} maxLength={200} disabled={disabled} className={input} placeholder="e.g. Ready for an evening on the rooftop?" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={label}>Button label</label>
                      <input value={b.label} onChange={(e) => patch(i, { label: e.target.value })} maxLength={40} disabled={disabled} className={input} placeholder="Reserve a table" />
                    </div>
                    <div>
                      <label className={label}>Goes to</label>
                      <input value={b.href} onChange={(e) => patch(i, { href: e.target.value })} maxLength={300} disabled={disabled} className={input} placeholder="/reservations" />
                    </div>
                  </div>
                </>
              )}

              {b.type === "pairing" && <p className="text-sm text-dash-muted">Drink pairings are kept as they are (they cannot be edited here).</p>}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4">
        <p className={label}>Add a block</p>
        <div className="flex flex-wrap gap-2">
          {ADDABLE.map((a) => (
            <button
              key={a.type}
              type="button"
              disabled={disabled || blocks.length >= 80}
              onClick={() => onChange([...blocks, emptyBlock(a.type)])}
              title={a.hint}
              className="flex items-center gap-1.5 rounded-lg border border-dash-line bg-dash-card px-3 py-2 text-sm font-medium transition hover:bg-dash-gold-soft disabled:opacity-60"
            >
              <Plus className="size-3.5 text-dash-gold-dark" /> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, title, onClick, disabled, danger }: { children: React.ReactNode; title: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md p-1.5 transition hover:bg-dash-bg disabled:opacity-30 ${danger ? "text-red-700" : "text-dash-muted"}`}
    >
      {children}
    </button>
  );
}
