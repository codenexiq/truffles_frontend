"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Clapperboard } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FloatingGlows } from "@/components/motion/FloatingGlows";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { PostCard } from "./PostCard";
import { BLOG_CATEGORIES, type BlogCategoryId, type BlogPost } from "@/data/blogPosts";

type Tab = "all" | BlogCategoryId | "stories";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All Posts" },
  ...BLOG_CATEGORIES,
  { id: "stories", label: "Guest Stories" },
];

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState<"all" | BlogCategoryId>("all");

  const onTab = (id: Tab) => {
    if (id === "stories") {
      // Guest stories live further down the page rather than being a filter.
      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setFilter(id);
  };

  const shown =
    filter === "all"
      ? posts
      : filter === "videos"
        ? posts.filter((p) => p.video)
        : posts.filter((p) => p.category === filter);

  const [featured, ...rest] = shown;
  const showFeatured = filter === "all" && featured;
  const grid = showFeatured ? rest : shown;

  return (
    <section className="relative overflow-hidden bg-page py-16 sm:py-20">
      <FloatingGlows />
      <Container className="relative z-10">
        <AnimatedTabs
          groupId="blog-tabs"
          className="mb-12 flex flex-wrap items-center justify-center gap-2.5"
          active={filter}
          onChange={onTab as (id: "all" | BlogCategoryId) => void}
          tabs={TABS as { id: "all" | BlogCategoryId; label: string }[]}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {showFeatured && (
              <div className="mb-8">
                <PostCard post={featured} featured />
              </div>
            )}

            {grid.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            )}

            {shown.length === 0 && (
              <div className="mx-auto max-w-md py-14 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/5 text-gold">
                  <Clapperboard className="h-7 w-7" />
                </span>
                <p className="mt-5 font-serif text-2xl text-zinc-100">Videos are coming soon</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-zinc-400">
                  Behind-the-scenes kitchen clips and event highlights will land here. In the meantime,
                  see how guests celebrate with us.
                </p>
                <Link
                  href="/events"
                  className="mt-6 inline-block rounded-full border border-gold/50 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-[#0a0a0c]"
                >
                  See Our Events
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
