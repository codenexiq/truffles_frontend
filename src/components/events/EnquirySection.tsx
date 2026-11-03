"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "@/components/ui/Honeypot";
import { SITE_CONFIG } from "@/constants";
import { isValidEmail, whatsappLink } from "@/utils";
import { EVENT_TYPES, eventTypeShort, eventTypeTitle } from "@/data/eventsData";
import { EVENT_TYPE_EVENT } from "./eventBus";
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

const inputCls =
  "w-full rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-zinc-100 transition placeholder:text-zinc-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";
const labelCls = "mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-400";

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
      <Container>
        <SectionHeading
          badge="HOW TO BOOK"
          title="Plan Your Event With Us"
          subtitle="Send an enquiry, or call or WhatsApp us for a quick booking."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Enquiry form */}
          <Reveal variant="left" className="lg:col-span-7">
            <div className="luxury-card relative overflow-hidden rounded-2xl p-6 sm:p-9">
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
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="font-serif text-3xl text-zinc-100">Enquiry sent</h3>
                    <p className="mx-auto max-w-md text-sm font-light leading-relaxed text-zinc-400">
                      Thank you, {f.name.split(" ")[0]}. Your {typeShort} enquiry is with us. For a faster
                      reply you can also message us on WhatsApp.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <a href={waHref} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="md" className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" /> Message on WhatsApp
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                          setF(EMPTY);
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
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <Honeypot value={trap} onChange={setTrap} />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="ev-name" className={labelCls}>Your name *</label>
                        <input id="ev-name" className={inputCls} value={f.name} onChange={set("name")} autoComplete="name" placeholder="Full name" />
                        {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="ev-phone" className={labelCls}>Phone *</label>
                        <input id="ev-phone" type="tel" className={inputCls} value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="03xx-xxxxxxx" />
                        {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="ev-email" className={labelCls}>Email *</label>
                        <input id="ev-email" type="email" className={inputCls} value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@email.com" />
                        {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="ev-type" className={labelCls}>Event type *</label>
                        <select id="ev-type" className={inputCls} value={f.type} onChange={set("type")}>
                          <option value="">Choose an event</option>
                          {EVENT_TYPES.map((t) => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                          ))}
                        </select>
                        {errors.type && <p className="mt-1.5 text-xs text-red-400">{errors.type}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="ev-date" className={labelCls}>Preferred date</label>
                        <input id="ev-date" type="date" min={minDate} className={inputCls} value={f.date} onChange={set("date")} />
                      </div>
                      <div>
                        <label htmlFor="ev-guests" className={labelCls}>Number of guests</label>
                        <input id="ev-guests" type="number" min={1} className={inputCls} value={f.guests} onChange={set("guests")} placeholder="e.g. 25" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="ev-notes" className={labelCls}>Tell us about your event</label>
                      <textarea id="ev-notes" rows={4} className={`${inputCls} resize-none`} value={f.notes} onChange={set("notes")} placeholder="Theme, decor ideas, dietary needs..." />
                    </div>

                    {status === "error" && (
                      <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          We couldn&apos;t send your enquiry just now. Please message us on WhatsApp or call{" "}
                          {SITE_CONFIG.phones[0].display} and we will take it from there.
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button type="submit" variant="primary" size="lg" disabled={status === "sending"} className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {status === "sending" ? "Sending..." : "Send Enquiry"}
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
          </Reveal>

          {/* Quick booking */}
          <Reveal variant="right" delay={150} className="lg:col-span-5">
            <div className="space-y-5">
              <div className="luxury-card rounded-2xl p-7">
                <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Quick booking</p>
                <h3 className="mt-2 font-serif text-2xl text-zinc-100">Call or WhatsApp</h3>
                <p className="mt-2 text-sm font-light text-zinc-400">
                  The fastest way to check a date and talk through your plans.
                </p>

                <div className="mt-5 space-y-3">
                  <a href={whatsappLink(SITE_CONFIG.whatsapp, "Hello Truffles! I would like to book an event.")} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="primary" size="lg" className="flex w-full items-center justify-center gap-2">
                      <MessageCircle className="h-4 w-4" /> WhatsApp {SITE_CONFIG.phones[0].display}
                    </Button>
                  </a>
                  {SITE_CONFIG.phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="block">
                      <Button variant="outline" size="lg" className="flex w-full items-center justify-center gap-2">
                        <Phone className="h-4 w-4" /> Call {p.display}
                      </Button>
                    </a>
                  ))}
                </div>
              </div>

              <div className="luxury-card flex items-start gap-3 rounded-2xl p-6">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div className="text-sm text-zinc-400">
                  <p className="font-serif text-lg text-zinc-100">{SITE_CONFIG.address.venue}</p>
                  <p>
                    {SITE_CONFIG.address.area}, {SITE_CONFIG.address.city}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
