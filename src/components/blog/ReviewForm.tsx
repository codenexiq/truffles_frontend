"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "@/components/ui/Honeypot";
import { API_V1 } from "@/lib/backend";
import { cn } from "@/utils";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "w-full rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-zinc-100 transition placeholder:text-zinc-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";
const labelCls = "mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-400";

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/**
 * Lets guests submit a review (plan 1.E).
 * Reviews go to the API for the team to read. Nothing a guest types appears
 * on the site until someone adds it to the testimonials list.
 */
export function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<{ name?: string; rating?: string; comment?: string }>({});

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (rating < 1) next.rating = "Please choose a star rating.";
    if (comment.trim().length < 10) next.comment = "Please tell us a little more (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch(`${API_V1}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: trap, name: name.trim(), rating, comment: comment.trim() }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const shownRating = hover || rating;

  return (
    <div className="luxury-card relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="space-y-4 py-8 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-3xl text-zinc-100">Thank you, {name.split(" ")[0]}!</h3>
            <p className="mx-auto max-w-sm text-sm font-light leading-relaxed text-zinc-400">
              Your review has been received. Our team reads every one, and we are glad you shared it.
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setName("");
                setRating(0);
                setComment("");
                setStatus("idle");
              }}
            >
              Write Another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <Honeypot value={trap} onChange={setTrap} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Share your experience</p>
              <h3 className="mt-1 font-serif text-2xl text-zinc-100">Write a review</h3>
            </div>

            <div>
              <label htmlFor="rv-name" className={labelCls}>Your name *</label>
              <input id="rv-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Full name" />
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <span className={labelCls} id="rv-rating-label">Your rating *</span>
              <div
                role="radiogroup"
                aria-labelledby="rv-rating-label"
                className="flex items-center gap-1"
                onMouseLeave={() => setHover(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <motion.button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => setRating(n)}
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    whileTap={{ scale: 0.85 }}
                    className="cursor-pointer p-1 outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        n <= shownRating ? "fill-[#d4af37] text-gold" : "text-zinc-600"
                      )}
                    />
                  </motion.button>
                ))}
                <span className="ml-3 min-w-20 text-sm text-gold-light">{RATING_WORDS[shownRating]}</span>
              </div>
              {errors.rating && <p className="mt-1.5 text-xs text-red-400">{errors.rating}</p>}
            </div>

            <div>
              <label htmlFor="rv-comment" className={labelCls}>Your review *</label>
              <textarea id="rv-comment" rows={4} className={`${inputCls} resize-none`} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you enjoy? What made it special?" />
              {errors.comment && <p className="mt-1.5 text-xs text-red-400">{errors.comment}</p>}
            </div>

            {status === "error" && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                We couldn&apos;t send your review just now. Please try again in a moment.
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={status === "sending"} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {status === "sending" ? "Sending..." : "Submit Review"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
