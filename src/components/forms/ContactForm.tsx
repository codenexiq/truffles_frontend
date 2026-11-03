"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
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

const inputCls =
  "w-full rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-zinc-100 transition placeholder:text-zinc-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";
const labelCls = "mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-400";

export function ContactForm() {
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
    <div className="luxury-card relative overflow-hidden rounded-2xl p-6 sm:p-9">
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-3xl text-zinc-100">Message sent</h3>
            <p className="mx-auto max-w-md text-sm font-light leading-relaxed text-zinc-400">
              Thank you, {name.split(" ")[0]}. We have your message. For a quicker reply you can also reach us on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="md" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Button>
              </a>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setName("");
                  setEmail("");
                  setPhone("");
                  setMessage("");
                  setSubject(SUBJECTS[0]);
                  setStatus("idle");
                }}
              >
                Send Another
              </Button>
            </div>
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ct-name" className={labelCls}>Name *</label>
                <input id="ct-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Full name" />
                {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="ct-email" className={labelCls}>Email *</label>
                <input id="ct-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            </div>

            <div>
              <label htmlFor="ct-message" className={labelCls}>Your message *</label>
              <textarea id="ct-message" rows={5} className={`${inputCls} resize-none`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
              {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
            </div>

            {status === "error" && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {serverError || "We couldn't send your message just now."} Please message us on WhatsApp or call{" "}
                  {SITE_CONFIG.phones[0].display}.
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" size="lg" disabled={status === "sending"} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {status === "sending" ? "Sending..." : "Send Message"}
              </Button>
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="outline" size="lg" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Or WhatsApp
                </Button>
              </a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
