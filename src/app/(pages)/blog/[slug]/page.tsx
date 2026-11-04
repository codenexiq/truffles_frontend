import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/motion/SplitText";
import { PostBody } from "@/components/blog/PostBody";
import { EventsHeroBg } from "@/components/events/EventsHeroBg";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingGlows } from "@/components/motion/FloatingGlows";
import { PostCard } from "@/components/blog/PostCard";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { CTASection } from "@/components/sections/CTASection";
import { SITE_CONFIG } from "@/constants";
import {
  POSTS,
  categoryLabel,
  formatPostDate,
  postBySlug,
  readingMinutes,
} from "@/data/blogPosts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

// All posts are pre-built, so navigation is fast. Opting out of the dev-only
// "instant navigation" check lets an unknown address return a true 404
// (wrapping the lookup in <Suspense> would turn it into a soft 404).
export const instant = false;


export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: "Post not found | Truffles Rooftop" };
  return {
    title: `${post.title} | Truffles Rooftop`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  return <PostContent params={params} />;
}

async function PostContent({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 2);

  // Structured data helps search engines show the post nicely.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Restaurant", name: SITE_CONFIG.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Article hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-16 pt-36 sm:pb-20 sm:pt-44">
        <EventsHeroBg src={post.cover} />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/60 to-page" />
        <HeroParticles className="pointer-events-none absolute inset-0" />

        <Container className="relative z-10 max-w-4xl">
          <Reveal variant="left">
            <Link
              href="/blog"
              className="group mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-light transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              All posts
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <span className="inline-block rounded-full bg-gradient-to-r from-[#e5c378] to-[#c99a2e] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a1305]">
              {categoryLabel(post.category)}
            </span>
          </Reveal>
          <h1 className="mt-4 font-serif text-4xl font-normal leading-[1.1] text-white sm:text-5xl md:text-6xl">
            <SplitText text={post.title} delay={0.15} stagger={0.05} />
          </h1>

          <Reveal delay={600}>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-300">
              <span>{post.author}</span>
              <span className="text-zinc-500">•</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span className="text-zinc-500">•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gold" />
                {readingMinutes(post)} min read
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Body */}
      <section className="relative overflow-hidden bg-page py-14 sm:py-20">
        <FloatingGlows />
        <Container className="relative z-10 max-w-3xl">
          <Reveal variant="left">
            <p className="mb-10 border-l-2 border-gold pl-5 font-serif text-xl italic leading-relaxed text-zinc-300 sm:text-2xl">
              {post.excerpt}
            </p>
          </Reveal>

          <PostBody blocks={post.body} title={post.title} />

          <Reveal>
            <div className="mt-14 border-t border-white/10 pt-8">
              <ShareButtons title={post.title} />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Related */}
      <section className="relative overflow-hidden border-t border-white/10 bg-band py-16 sm:py-20">
        <FloatingGlows />
        <Container className="relative z-10">
          <Reveal>
            <h2 className="mb-8 text-center font-serif text-3xl text-zinc-100">Keep reading</h2>
          </Reveal>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {related.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
