"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { AlertCircle, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { Honeypot } from "@/components/ui/Honeypot";
import { SITE_CONFIG } from "@/constants";
import { API_V1 } from "@/lib/backend";
import { isValidEmail, whatsappLink } from "@/utils";
import { findPromotion } from "@/data/promotions";

type Status = "idle" | "sending" | "sent" | "error";

const SUBJECTS = [
  "General enquiry",
  "Offers & promotions",
  "Event booking",
  "Feedback",
  "Collaboration / press",
] as const;

// The form lives on a white rounded card (like the cards on the other pages), so its colours are fixed hex values.
const inputCls =
  "w-full rounded-2xl border border-[#e4e4e7] bg-[#fafafa] px-4 py-3 text-[0.95rem] text-[#18181b] transition-all duration-300 placeholder:text-[#a1a1aa] hover:border-[#d4af37]/60 focus:border-[#d4af37] focus:bg-[#ffffff] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/20";
const labelCls = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71717a]";
const errCls = "mt-1.5 text-xs font-medium text-[#dc2626]";
const pillBtn =
  "relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-[0.98rem] font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:pointer-events-none disabled:opacity-60";

const EASE = [0.16, 1, 0.3, 1] as const;
/** The card flies in, then each row of the form rises in one after another. */
const formIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, when: "beforeChildren", staggerChildren: 0.08 } },
};
const rowIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function ContactForm() {
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Arriving from an offer (?offer=eid): pre-fill the subject and message
  /* eslint-disable react-hooks/set-state-in-effect -- one-time read of browser-only values (URL, today's date) after mount keeps server and browser HTML identical */
  useEffect(() => {
    const offer = findPromotion(new URLSearchParams(window.location.search).get("offer"));
    if (!offer) return;
    setSubject("Offers & promotions");
    setMessage(`Hello, I would like to know more about the ${offer.label} (${offer.highlight}).`);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!isValidEmail(email)) next.email = "Please enter a valid email address.";
    if (message.trim().length < 10) next.message = "Please write a little more (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch(`${API_V1}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: trap,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject,
          message: message.trim(),
        }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      const json = await res.json().catch(() => null);
      setServerError(json?.errors?.[0]?.message ?? (res.status === 429 ? (json?.message ?? "") : ""));
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const waHref = whatsappLink(
    SITE_CONFIG.whatsapp,
    `Hello Truffles! ${subject}: ${message.trim() || "I would like to get in touch."}${name ? ` (${name})` : ""}`
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={formIn}
      className="relative overflow-hidden rounded-[2rem] bg-[#ffffff] p-6 text-[#18181b] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:p-9"
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="space-y-5 py-6 text-center"
            role="status"
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]"
            >
              <CheckCircle2 className="h-8 w-8" />
            </motion.div>
            <h3 className="font-sans text-3xl font-semibold text-[#18181b]">Message sent</h3>
            <p className="mx-auto max-w-md text-[0.95rem] font-light leading-relaxed text-[#52525b]">
              Thank you, {name.split(" ")[0]}. We have your message. For a quicker reply you can also reach us on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${pillBtn} bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] text-[#0a0a0c] shadow-[0_12px_26px_-12px_rgba(170,119,28,0.85)] hover:brightness-110`}
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
              <button
                type="button"
                onClick={() => {
                  setName("");
                  setEmail("");
                  setPhone("");
                  setMessage("");
                  setSubject(SUBJECTS[0]);
                  setStatus("idle");
                }}
                className={`${pillBtn} cursor-pointer border border-[#18181b] text-[#18181b] hover:bg-[#18181b] hover:text-[#ffffff]`}
              >
                Send Another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-5">
            <motion.div variants={rowIn}>
              <p className="inline-block rounded-full bg-gradient-to-r from-[#e5c378] to-[#c99a2e] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1305]">
                Send a message
              </p>
              <h3 className="mt-3 font-sans text-[1.6rem] font-semibold leading-tight text-[#18181b]">How can we help?</h3>
            </motion.div>

            <Honeypot value={trap} onChange={setTrap} />
            <motion.div variants={rowIn} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ct-name" className={labelCls}>Name *</label>
                <input id="ct-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Full name" />
                {errors.name && <p className={errCls}>{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="ct-email" className={labelCls}>Email *</label>
                <input id="ct-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" />
                {errors.email && <p className={errCls}>{errors.email}</p>}
              </div>
            </motion.div>

            <motion.div variants={rowIn} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ct-phone" className={labelCls}>Phone</label>
                <input id="ct-phone" type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="03xx-xxxxxxx" />
              </div>
              <div>
                <label htmlFor="ct-subject" className={labelCls}>What is it about? *</label>
                <select id="ct-subject" className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)}>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.div variants={rowIn}>
              <label htmlFor="ct-message" className={labelCls}>Your message *</label>
              <textarea id="ct-message" rows={5} className={`${inputCls} resize-none`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
              {errors.message && <p className={errCls}>{errors.message}</p>}
            </motion.div>

            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {serverError || "We couldn't send your message just now."} Please message us on WhatsApp or call{" "}
                      {SITE_CONFIG.phones[0].display}.
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={rowIn} className="flex flex-wrap items-center gap-3">
              <motion.button
                type="submit"
                disabled={status === "sending"}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={`${pillBtn} cursor-pointer bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] text-[#0a0a0c] shadow-[0_12px_26px_-12px_rgba(170,119,28,0.85)]`}
              >
                {!reduce && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    initial={{ left: "-30%" }}
                    animate={{ left: ["-30%", "130%"] }}
                    transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.8 }}
                  />
                )}
                <motion.span
                  className="relative flex"
                  animate={status === "sending" && !reduce ? { x: [0, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.7, repeat: status === "sending" ? Infinity : 0 }}
                >
                  <Send className="h-4 w-4" />
                </motion.span>
                <span className="relative">{status === "sending" ? "Sending..." : "Send Message"}</span>
              </motion.button>
              <motion.a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={`${pillBtn} border border-[#18181b] text-[#18181b] hover:bg-[#18181b] hover:text-[#ffffff]`}
              >
                <MessageCircle className="h-4 w-4" /> Or WhatsApp
              </motion.a>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
