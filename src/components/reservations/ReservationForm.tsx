"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  MessageCircle,
  Minus,
  Plus,
  Send,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "@/components/ui/Honeypot";
import { OCCASIONS, SITE_CONFIG } from "@/constants";
import { API_V1 } from "@/lib/backend";
import { whatsappLink, cn } from "@/utils";
import { OFFER_OCCASION, findPromotion, type Promotion } from "@/data/promotions";
import { MAX_GUESTS, TIME_SLOTS, reservationHints } from "@/data/reservationConfig";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "w-full rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-zinc-100 transition placeholder:text-zinc-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";
const labelCls = "mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-400";
const groupTitle = "text-[11px] uppercase tracking-[0.25em] text-gold";

/** YYYY-MM-DD in the visitor's local time (toISOString would use UTC). */
const localISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const niceDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

interface Confirmation {
  ref: string;
  name: string;
  date: string;
  time: string;
  guests: number;
}

export function ReservationForm() {
  const [today, setToday] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [decor, setDecor] = useState(false);
  const [offer, setOffer] = useState<Promotion | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Confirmation | null>(null);

  // Today's date, and arriving from an offer (?offer=hi-tea&addon=premium-decor)
  /* eslint-disable react-hooks/set-state-in-effect -- one-time read of browser-only values (URL, today's date) after mount keeps server and browser HTML identical */
  useEffect(() => {
    setToday(localISO(new Date()));
    const q = new URLSearchParams(window.location.search);
    const o = findPromotion(q.get("offer"));
    if (o) {
      setOffer(o);
      const occ = OFFER_OCCASION[o.id];
      if (occ) setOccasion(occ);
      if (o.addon && q.get("addon") === o.addon.param) setDecor(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const hints = useMemo(() => reservationHints(date, time, guests, today), [date, time, guests, today]);

  const setGuestCount = (n: number) => setGuests(Math.min(MAX_GUESTS, Math.max(1, n)));

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a phone number we can reach you on.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Please enter a valid email address.";
    if (!date) e.date = "Please choose a date.";
    else if (today && date < today) e.date = "That date has passed. Please choose today or later.";
    if (!time) e.time = "Please choose a time.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /** Everything the team needs that the API has no dedicated field for. */
  function composeRequests() {
    return [
      offer && `Offer: ${offer.label} (${offer.highlight})`,
      decor && "Premium decor add-on requested",
      notes.trim(),
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch(`${API_V1}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: trap,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          date,
          time,
          guests,
          occasion: occasion || undefined,
          specialRequests: composeRequests() || undefined,
        }),
      });

      if (res.ok) {
        const json = await res.json().catch(() => null);
        const id: string = json?.data?.id ?? String(Date.now());
        setDone({ ref: `TR-${id.slice(-6).toUpperCase()}`, name: name.trim(), date, time, guests });
        setStatus("sent");
        return;
      }

      // Show the server's own reason when it gave one (e.g. more than 30 guests)
      const json = await res.json().catch(() => null);
      setServerError(json?.errors?.[0]?.message ?? (res.status === 429 ? (json?.message ?? "") : ""));
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const waText = done
    ? `Hello Truffles! I just requested a table (ref ${done.ref}): ${done.guests} guest${done.guests > 1 ? "s" : ""}, ${niceDate(done.date)} at ${done.time}. Name: ${done.name}.`
    : `Hello Truffles! I would like to book a table${date ? ` on ${niceDate(date)}` : ""}${time ? ` at ${time}` : ""} for ${guests}. Name: ${name || "-"}.`;
  const waHref = whatsappLink(SITE_CONFIG.whatsapp, waText);

  function reset() {
    setName("");
    setPhone("");
    setEmail("");
    setDate("");
    setTime("");
    setGuests(2);
    setOccasion("");
    setNotes("");
    setDecor(false);
    setOffer(null);
    setErrors({});
    setDone(null);
    setStatus("idle");
  }

  return (
    <div className="luxury-card relative overflow-hidden rounded-2xl p-6 sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" && done ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 18 }}
            className="space-y-6 py-4 text-center"
            role="status"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-serif text-3xl text-zinc-100">Request received</h3>
              <p className="mx-auto mt-2 max-w-md text-sm font-light leading-relaxed text-zinc-400">
                Thank you, {done.name.split(" ")[0]}. This is a booking <strong className="font-medium text-zinc-200">request</strong>:
                our team will confirm it with you. For a faster answer, message us on WhatsApp.
              </p>
            </div>

            <dl className="mx-auto grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 text-left text-sm">
              {[
                ["Reference", done.ref],
                ["Guests", String(done.guests)],
                ["Date", niceDate(done.date)],
                ["Time", done.time],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface p-3.5">
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{k}</dt>
                  <dd className="mt-1 font-medium text-zinc-100">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="md" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
                </Button>
              </a>
              <Button variant="outline" size="md" onClick={reset}>
                Make Another Request
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
            className="space-y-9"
          >
            <Honeypot value={trap} onChange={setTrap} />
            {/* Offer chip, when arriving from the Offers page */}
            <AnimatePresence>
              {offer && (
                <motion.div
                  initial={{ opacity: 0, y: -12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-light">
                    <span className="flex items-center gap-2.5">
                      <Tag className="h-4 w-4 shrink-0 text-gold" />
                      <span>
                        Booking for: <strong className="font-semibold">{offer.label} · {offer.highlight}</strong>
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label="Remove offer"
                      onClick={() => setOffer(null)}
                      className="rounded p-1 text-gold transition-colors hover:bg-gold/20 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Details */}
            <fieldset className="space-y-5">
              <legend className={groupTitle}>Your details</legend>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rs-name" className={labelCls}>Name *</label>
                  <input id="rs-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Full name" />
                  {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="rs-phone" className={labelCls}>Phone *</label>
                  <input id="rs-phone" type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="03xx-xxxxxxx" />
                  {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="rs-email" className={labelCls}>Email *</label>
                <input id="rs-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </div>
            </fieldset>

            {/* Table */}
            <fieldset className="space-y-5">
              <legend className={groupTitle}>Your table</legend>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rs-date" className={labelCls}>Date *</label>
                  <input id="rs-date" type="date" min={today} className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
                  {errors.date && <p className="mt-1.5 text-xs text-red-400">{errors.date}</p>}
                </div>

                <div>
                  <span className={labelCls} id="rs-guests-label">Guests *</span>
                  <div className="flex items-center gap-3" role="group" aria-labelledby="rs-guests-label">
                    <motion.button
                      type="button"
                      aria-label="Fewer guests"
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setGuestCount(guests - 1)}
                      disabled={guests <= 1}
                      className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 bg-surface text-zinc-200 transition-colors hover:border-gold hover:text-gold disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    <div className="relative h-12 min-w-16 flex-1 overflow-hidden rounded-lg border border-white/15 bg-surface text-center" aria-live="polite">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={guests}
                          initial={{ y: 14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -14, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="absolute inset-0 flex items-center justify-center font-serif text-xl text-zinc-100"
                        >
                          {guests} {guests === 1 ? "guest" : "guests"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <motion.button
                      type="button"
                      aria-label="More guests"
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setGuestCount(guests + 1)}
                      disabled={guests >= MAX_GUESTS}
                      className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 bg-surface text-zinc-200 transition-colors hover:border-gold hover:text-gold disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              <div>
                <span className={labelCls} id="rs-time-label">Time *</span>
                <LayoutGroup id="rs-times">
                  <div role="radiogroup" aria-labelledby="rs-time-label" className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                    {TIME_SLOTS.map((s) => {
                      const on = time === s.value;
                      return (
                        <motion.button
                          key={s.value}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setTime(s.value)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "relative rounded-lg border px-2 py-2.5 text-xs transition-colors cursor-pointer",
                            on ? "border-transparent font-semibold text-[#0a0a0c]" : "border-white/15 bg-surface text-zinc-300 hover:border-gold/60 hover:text-zinc-100"
                          )}
                        >
                          {on && (
                            <motion.span
                              layoutId="rs-slot-pill"
                              transition={{ type: "spring", stiffness: 420, damping: 32 }}
                              className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#e5c378] to-[#aa771c] shadow-[0_0_18px_rgba(212,175,55,0.35)]"
                            />
                          )}
                          <span className="relative z-10">{s.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </LayoutGroup>
                {errors.time && <p className="mt-1.5 text-xs text-red-400">{errors.time}</p>}
              </div>

              {/* Hints that react to the date, time and party size */}
              <AnimatePresence initial={false}>
                {hints.map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p
                      className={cn(
                        "flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm",
                        h.tone === "offer"
                          ? "border-gold/40 bg-gold/10 text-gold-light"
                          : "border-white/15 bg-white/[0.03] text-zinc-300"
                      )}
                    >
                      {h.tone === "offer" ? <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> : <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />}
                      {h.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </fieldset>

            {/* Extras */}
            <fieldset className="space-y-5">
              <legend className={groupTitle}>Make it special (optional)</legend>
              <div>
                <label htmlFor="rs-occasion" className={labelCls}>Occasion</label>
                <select id="rs-occasion" className={inputCls} value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                  <option value="">Just a meal</option>
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/15 bg-surface p-4 transition-colors hover:border-gold/60">
                <input
                  type="checkbox"
                  checked={decor}
                  onChange={(e) => setDecor(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#d4af37]"
                />
                <span>
                  <span className="block text-sm text-zinc-100">Add premium decor to my table</span>
                  <span className="mt-0.5 block text-xs text-zinc-400">Our team will contact you with decor options and pricing.</span>
                </span>
              </label>

              <div>
                <label htmlFor="rs-notes" className={labelCls}>Notes for the team</label>
                <textarea id="rs-notes" rows={3} className={`${inputCls} resize-none`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, celebration details, seating wishes..." />
              </div>
            </fieldset>

            {status === "error" && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {serverError || "We couldn't send your request just now."} You can also message us on WhatsApp or call{" "}
                  {SITE_CONFIG.phones[0].display} and we will book it for you.
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" size="lg" disabled={status === "sending"} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {status === "sending" ? "Sending..." : "Request Reservation"}
              </Button>
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="outline" size="lg" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Or WhatsApp
                </Button>
              </a>
            </div>
            <p className="text-xs text-zinc-500">
              This sends a booking request. Your table is confirmed once our team replies.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
