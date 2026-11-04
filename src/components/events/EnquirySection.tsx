"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { AlertCircle, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Honeypot } from "@/components/ui/Honeypot";
import { SITE_CONFIG } from "@/constants";
import { isValidEmail, whatsappLink } from "@/utils";
import { EVENT_TYPES, eventTypeShort, eventTypeTitle } from "@/data/eventsData";
import { EVENT_TYPE_EVENT } from "./eventBus";
import { EventQuickBooking } from "./EventQuickBooking";
import { FloatingGlows } from "@/components/motion/FloatingGlows";
import { API_V1 } from "@/lib/backend";

const ENDPOINT = `${API_V1}/contact`;

type Status = "idle" | "sending" | "sent" | "error";

interface Fields {
  name: string;
  phone: string;
  email: string;
  type: string;
  date: string;
  guests: string;
  notes: string;
}

const EMPTY: Fields = { name: "", phone: "", email: "", type: "", date: "", guests: "", notes: "" };

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

/** Plain-text summary used for both the server enquiry and WhatsApp. */
function summary(f: Fields) {
  return [
    f.name && `Name: ${f.name}`,
    f.phone && `Phone: ${f.phone}`,
    f.date && `Preferred date: ${f.date}`,
    f.guests && `Guests: ${f.guests}`,
    f.notes && `Notes: ${f.notes}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function EnquirySection() {
  const reduce = useReducedMotion();
  const [f, setF] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [minDate, setMinDate] = useState("");

  const set = (k: keyof Fields) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  // Event type can be chosen elsewhere on the page (cards, packages) or via ?type=
  /* eslint-disable react-hooks/set-state-in-effect -- one-time read of browser-only values (URL, today's date) after mount keeps server and browser HTML identical */
  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
    const initial = new URLSearchParams(window.location.search).get("type");
    if (initial && EVENT_TYPES.some((t) => t.id === initial)) setF((p) => ({ ...p, type: initial }));
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setF((p) => ({ ...p, type: id }));
    };
    window.addEventListener(EVENT_TYPE_EVENT, onPick);
    return () => window.removeEventListener(EVENT_TYPE_EVENT, onPick);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const typeTitle = eventTypeTitle(f.type);
  const typeShort = eventTypeShort(f.type);
  const waText = `Hello Truffles! I would like to enquire about ${
    typeShort ? `a ${typeShort}` : "hosting an event"
  }.
${summary(f)}`.trim();
  const waHref = whatsappLink(SITE_CONFIG.whatsapp, waText);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (f.name.trim().length < 2) next.name = "Please enter your name.";
    if (f.phone.replace(/\D/g, "").length < 7) next.phone = "Please enter a phone number we can reach you on.";
    if (!isValidEmail(f.email)) next.email = "Please enter a valid email address.";
    if (!f.type) next.type = "Please choose an event type.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: trap,
          name: f.name.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          subject: `Event enquiry: ${typeTitle}`,
          message: summary(f) || `Event enquiry: ${typeTitle}`,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="enquire" className="relative scroll-mt-24 overflow-hidden bg-page py-20 sm:py-28">
      <FloatingGlows />
      <Container className="relative z-10">
        <SectionHeading
          badge="HOW TO BOOK"
          title="Plan Your Event With Us"
          subtitle="Send an enquiry, or call or WhatsApp us for a quick booking."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Enquiry form */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={formIn}
            className="relative overflow-hidden rounded-[2rem] bg-[#ffffff] p-6 text-[#18181b] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:p-9 lg:col-span-7"
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                  className="space-y-5 py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>
                  <h3 className="font-sans text-3xl font-semibold text-[#18181b]">Enquiry sent</h3>
                  <p className="mx-auto max-w-md text-[0.95rem] font-light leading-relaxed text-[#52525b]">
                    Thank you, {f.name.split(" ")[0]}. Your {typeShort} enquiry is with us. For a faster reply you can also
                    message us on WhatsApp.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${pillBtn} bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] text-[#0a0a0c] shadow-[0_12px_26px_-12px_rgba(170,119,28,0.85)] hover:brightness-110`}
                    >
                      <MessageCircle className="h-4 w-4" /> Message on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setF(EMPTY);
                        setStatus("idle");
                      }}
                      className={`${pillBtn} cursor-pointer border border-[#18181b] text-[#18181b] hover:bg-[#18181b] hover:text-[#ffffff]`}
                    >
                      Send Another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="space-y-5">
                  <motion.div variants={rowIn}>
                    <p className="inline-block rounded-full bg-gradient-to-r from-[#e5c378] to-[#c99a2e] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1305]">
                      Event enquiry
                    </p>
                    <h3 className="mt-3 font-sans text-[1.6rem] font-semibold leading-tight text-[#18181b]">Tell us about your event</h3>
                  </motion.div>

                  <Honeypot value={trap} onChange={setTrap} />
                  <motion.div variants={rowIn} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ev-name" className={labelCls}>Your name *</label>
                      <input id="ev-name" className={inputCls} value={f.name} onChange={set("name")} autoComplete="name" placeholder="Full name" />
                      {errors.name && <p className={errCls}>{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="ev-phone" className={labelCls}>Phone *</label>
                      <input id="ev-phone" type="tel" className={inputCls} value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="03xx-xxxxxxx" />
                      {errors.phone && <p className={errCls}>{errors.phone}</p>}
                    </div>
                  </motion.div>

                  <motion.div variants={rowIn} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ev-email" className={labelCls}>Email *</label>
                      <input id="ev-email" type="email" className={inputCls} value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@email.com" />
                      {errors.email && <p className={errCls}>{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="ev-type" className={labelCls}>Event type *</label>
                      <select id="ev-type" className={inputCls} value={f.type} onChange={set("type")}>
                        <option value="">Choose an event</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                      {errors.type && <p className={errCls}>{errors.type}</p>}
                    </div>
                  </motion.div>

                  <motion.div variants={rowIn} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ev-date" className={labelCls}>Preferred date</label>
                      <input id="ev-date" type="date" min={minDate} className={inputCls} value={f.date} onChange={set("date")} />
                    </div>
                    <div>
                      <label htmlFor="ev-guests" className={labelCls}>Number of guests</label>
                      <input id="ev-guests" type="number" min={1} className={inputCls} value={f.guests} onChange={set("guests")} placeholder="e.g. 25" />
                    </div>
                  </motion.div>

                  <motion.div variants={rowIn}>
                    <label htmlFor="ev-notes" className={labelCls}>Tell us about your event</label>
                    <textarea id="ev-notes" rows={4} className={`${inputCls} resize-none`} value={f.notes} onChange={set("notes")} placeholder="Theme, decor ideas, dietary needs..." />
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
                            We couldn&apos;t send your enquiry just now. Please message us on WhatsApp or call{" "}
                            {SITE_CONFIG.phones[0].display} and we will take it from there.
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={rowIn} className="flex flex-wrap items-center gap-3 pt-1">
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
                      <span className="relative">{status === "sending" ? "Sending..." : "Send Enquiry"}</span>
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

          {/* Quick booking */}
          <div className="lg:col-span-5">
            <EventQuickBooking />
          </div>
        </div>
      </Container>
    </section>
  );
}
