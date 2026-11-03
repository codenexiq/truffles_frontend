import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/motion/SplitText";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { GuestStories } from "@/components/blog/GuestStories";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Blog | Truffles Rooftop, F-10 Islamabad",
  description:
    "Dishes, drink pairings, celebration ideas, videos and guest stories from Truffles Rooftop Restaurant, F-10 Islamabad.",
};

export default function BlogPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-20 pt-40 text-center sm:pb-24 sm:pt-48">
        <Image
          src={IMAGES.heroInterior}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/55 to-page" />
        <div className="aurora" />

        <Container className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-light backdrop-blur-md">
            ✦ The Truffles Blog ✦
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-normal leading-[1.05] text-white sm:text-6xl md:text-7xl">
            <SplitText text="Stories from" delay={0.2} />{" "}
            <span className="italic">
              <SplitText text="our rooftop" delay={0.5} wordClassName="animate-shimmer" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-300 sm:text-base">
            Dishes and pairings, ideas for your celebrations, videos from behind the scenes, and
            what our guests have to say.
          </p>
        </Container>
      </section>

      <BlogIndex />
      <GuestStories />
    </>
  );
}
