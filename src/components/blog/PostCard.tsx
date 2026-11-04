"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Play } from "lucide-react";
import { EventCardUI, type CardBadge } from "@/components/events/EventCardUI";
import { WideCard } from "@/components/about/WideCard";
import { categoryLabel, formatPostDate, readingMinutes, type BlogPost } from "@/data/blogPosts";

interface PostCardProps {
  post: BlogPost;
  /** Large horizontal layout for the featured post. */
  featured?: boolean;
  index?: number;
}

/** A blog post, shown as the same white rounded card used on the Events, About and Menu pages. */
export function PostCard({ post, featured = false, index = 0 }: PostCardProps) {
  const router = useRouter();
  const mins = readingMinutes(post);
  const href = `/blog/${post.slug}`;

  if (featured) {
    return (
      <WideCard
        image={post.cover}
        alt={post.coverAlt}
        pill={`Latest · ${categoryLabel(post.category)}`}
        title={post.title}
        paragraphs={[post.excerpt]}
        facts={[formatPostDate(post.date), `${mins} min read`, ...(post.video ? ["Video"] : [])]}
        buttonLabel="Read the article"
        href={href}
      />
    );
  }

  const badges: CardBadge[] = [
    { label: categoryLabel(post.category), tone: "dark" },
    ...(post.video ? [{ label: "Video", tone: "gold" as const, icon: <Play className="h-3 w-3 fill-current" /> }] : []),
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      // a little wave across each row of three cards
      variants={{ hidden: {}, show: { transition: { delayChildren: (index % 3) * 0.12 } } }}
      className="h-full"
    >
      <EventCardUI
        index={index}
        image={post.cover}
        alt={post.coverAlt}
        title={post.title}
        subtitle={post.excerpt}
        clamp
        badges={badges}
        infoA={{ icon: <CalendarDays className="h-5 w-5" />, text: formatPostDate(post.date) }}
        infoB={{ icon: <Clock className="h-5 w-5" />, text: `${mins} min read` }}
        buttonLabel="Read More"
        onClick={() => router.push(href)}
      />
    </motion.div>
  );
}
