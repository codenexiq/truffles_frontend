"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Play } from "lucide-react";
import { categoryLabel, formatPostDate, readingMinutes, type BlogPost } from "@/data/blogPosts";
import { cn } from "@/utils";

interface PostCardProps {
  post: BlogPost;
  /** Large horizontal layout for the featured post. */
  featured?: boolean;
  index?: number;
}

export function PostCard({ post, featured = false, index = 0 }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 160, damping: 20, delay: (index % 3) * 0.07 }}
      className="h-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "luxury-card group relative flex h-full overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-gold",
          featured ? "flex-col lg:flex-row" : "flex-col"
        )}
      >
        <div
          className={cn(
            "theme-dark relative overflow-hidden",
            featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[380px] lg:w-[55%]" : "aspect-[16/10]"
          )}
        >
          <Image
            src={post.cover}
            alt={post.coverAlt}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"}
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full border border-gold/50 bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold-light backdrop-blur-sm">
            {categoryLabel(post.category)}
          </span>
          {post.video && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-black/50 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
                <Play className="ml-0.5 h-6 w-6 fill-white" />
              </span>
            </span>
          )}
        </div>

        <div className={cn("flex flex-1 flex-col p-6 sm:p-7", featured && "lg:justify-center lg:p-10")}>
          {featured && (
            <span className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gold">Latest from the blog</span>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingMinutes(post)} min read
            </span>
          </div>
          <h3
            className={cn(
              "mt-3 font-serif text-zinc-100 transition-colors group-hover:text-gold-light",
              featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
            )}
          >
            {post.title}
          </h3>
          <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-zinc-400">{post.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-gold">
            Read more
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
