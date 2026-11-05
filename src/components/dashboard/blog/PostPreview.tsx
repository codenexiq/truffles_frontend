"use client";

import { Clock } from "lucide-react";
import { PostBody } from "@/components/blog/PostBody";
import { resolveBlocks, resolveMediaSrc } from "@/lib/blogMedia";
import { categoryLabel, formatPostDate, readingMinutes, type BlogCategoryId, type BlogPost } from "@/data/blogPosts";
import type { Block } from "@/types/dashboard";

/**
 * How the post will look on the website. It draws the article with the website's own components inside a dark frame
 * (the public blog is dark), so what you see here is what visitors get.
 */
export function PostPreview(props: {
  title: string;
  excerpt: string;
  category: BlogCategoryId;
  author: string;
  date: string;
  cover: string;
  coverAlt: string;
  body: Block[];
}) {
  const { title, excerpt, category, author, date, cover, coverAlt, body } = props;
  const blocks = resolveBlocks(body);
  const mins = readingMinutes({ body } as BlogPost);

  return (
    <div className="theme-dark overflow-hidden rounded-2xl bg-page text-zinc-100">
      <div className="relative">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- preview of an upload
          <img src={resolveMediaSrc(cover)} alt={coverAlt} className="h-56 w-full object-cover opacity-50 sm:h-72" />
        ) : (
          <div className="h-40 w-full bg-band" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-band/40 to-page" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10">
          <span className="inline-block rounded-full bg-gradient-to-r from-[#e5c378] to-[#c99a2e] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a1305]">
            {categoryLabel(category)}
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">{title || "Untitled post"}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-300">
            <span>{author || "The Truffles Team"}</span>
            <span className="text-zinc-500">•</span>
            <time dateTime={date}>{date ? formatPostDate(date) : ""}</time>
            <span className="text-zinc-500">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gold" /> {mins} min read
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <p className="mb-10 border-l-2 border-gold pl-5 font-serif text-xl italic leading-relaxed text-zinc-300">{excerpt}</p>
        <PostBody blocks={blocks} title={title} />
      </div>
    </div>
  );
}
