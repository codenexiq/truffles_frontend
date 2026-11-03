import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { VideoPlayer } from "./VideoPlayer";
import type { Block } from "@/data/blogPosts";

/** Renders a post's content blocks. Server component; video is the only client piece. */
export function PostBody({ blocks, title }: { blocks: Block[]; title: string }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <Reveal key={i}>
                <p className="text-base font-light leading-[1.85] text-zinc-300 sm:text-lg">{b.text}</p>
              </Reveal>
            );

          case "h2":
            return (
              <Reveal key={i}>
                <h2 className="pt-4 font-serif text-2xl text-zinc-100 sm:text-3xl">{b.text}</h2>
              </Reveal>
            );

          case "list":
            return (
              <Reveal key={i}>
                <div className="luxury-card rounded-2xl p-6 sm:p-7">
                  {b.title && (
                    <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-gold">{b.title}</p>
                  )}
                  <ul className="space-y-2.5">
                    {b.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-zinc-300 sm:text-base">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );

          case "quote":
            return (
              <Reveal key={i}>
                <blockquote className="border-l-2 border-gold pl-6">
                  <p className="font-serif text-xl italic leading-relaxed text-zinc-200 sm:text-2xl">
                    &ldquo;{b.text}&rdquo;
                  </p>
                  {b.cite && <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-gold">{b.cite}</footer>}
                </blockquote>
              </Reveal>
            );

          case "note":
            return (
              <Reveal key={i}>
                <div className="flex gap-3 rounded-xl border border-gold/25 bg-gold/5 p-5">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                    {b.label && <strong className="mr-2 font-semibold text-gold-light">{b.label}:</strong>}
                    {b.text}
                  </p>
                </div>
              </Reveal>
            );

          case "pairing":
            return (
              <Reveal key={i}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {b.items.map((p) => (
                    <div key={p.drink} className="luxury-card rounded-2xl p-5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Pairing</p>
                      <p className="mt-2 font-serif text-xl text-zinc-100">{p.drink}</p>
                      <p className="text-sm text-gold-light">with {p.with.toLowerCase()}</p>
                      <p className="mt-2 text-sm font-light leading-relaxed text-zinc-400">{p.why}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            );

          case "gallery":
            return (
              <Reveal key={i} variant="scale">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {b.images.map((img) => (
                    <div
                      key={img.src}
                      className="theme-dark group relative aspect-square overflow-hidden rounded-xl border border-gold/20"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            );

          case "image":
            return (
              <Reveal key={i} variant="scale">
                <figure className="m-0">
                  <div className="theme-dark relative aspect-[16/10] overflow-hidden rounded-2xl border border-gold/20">
                    <Image src={b.src} alt={b.alt} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                  </div>
                  {b.caption && <figcaption className="mt-3 text-center text-xs text-zinc-500">{b.caption}</figcaption>}
                </figure>
              </Reveal>
            );

          case "video":
            return (
              <Reveal key={i} variant="scale">
                <figure className="m-0">
                  <VideoPlayer video={b.video} title={b.caption ?? title} />
                  {b.caption && <figcaption className="mt-3 text-center text-xs text-zinc-500">{b.caption}</figcaption>}
                </figure>
              </Reveal>
            );

          case "cta":
            return (
              <Reveal key={i}>
                <div className="theme-dark flex flex-col items-start justify-between gap-5 rounded-2xl border border-gold/30 bg-gradient-to-br from-surface to-band p-6 sm:flex-row sm:items-center sm:p-8">
                  <p className="font-serif text-xl text-white sm:text-2xl">{b.text}</p>
                  <Link
                    href={b.href}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-sm bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a0a0c] transition hover:brightness-110"
                  >
                    {b.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            );
        }
      })}
    </div>
  );
}
