"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { VideoRef } from "@/data/blogPosts";

/**
 * Plays an uploaded video file, or a YouTube video. YouTube is loaded only
 * after a click (a "facade"), so the page stays fast and no tracking scripts
 * load until the visitor chooses to watch.
 */
export function VideoPlayer({ video, title }: { video: VideoRef; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (video.kind === "file") {
    return (
      <video
        src={video.src}
        poster={video.poster}
        controls
        playsInline
        preload="metadata"
        aria-label={title}
        className="aspect-video w-full rounded-2xl border border-gold/20 bg-black object-cover"
      />
    );
  }

  return (
    <div className="theme-dark relative aspect-video w-full overflow-hidden rounded-2xl border border-gold/20 bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 cursor-pointer"
        >
          <Image
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-black/30" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#e5c378] to-[#aa771c] text-[#0a0a0c] shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-transform group-hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
