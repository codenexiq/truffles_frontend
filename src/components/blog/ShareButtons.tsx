"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";

/** Share a post on WhatsApp / Facebook, or copy its link (plan: social cross-promotion). */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  // The real address is only known in the browser ("" while rendering on the server).
  const pageUrl = useSyncExternalStore(
    () => () => {},
    () => window.location.href,
    () => ""
  );

  const btn =
    "inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface px-4 py-2 text-xs uppercase tracking-[0.15em] text-zinc-300 transition-colors hover:border-gold hover:text-gold-light cursor-pointer";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", pageUrl);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
        <Share2 className="h-4 w-4" /> Share
      </span>
      <a
        className={btn}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl}`)}`}
      >
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
      <a
        className={btn}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
      >
        Facebook
      </a>
      <button type="button" className={btn} onClick={copy}>
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
