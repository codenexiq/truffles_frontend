// ============================================
// Reservation rules and offer-aware hints.
// Facts come from "Truffles Restaurant Website Plan" (Section 1.B / 1.F).
// ============================================

/** The backend rejects bookings above this and asks guests to call. */
export const MAX_GUESTS = 30;
/** Above this we gently suggest talking to the team or planning an event. */
export const LARGE_GROUP = 12;

/**
 * Bookable start times, every 30 minutes.
 * ASSUMPTION: 12:00 PM to 9:30 PM. Adjust once real opening hours are confirmed.
 */
export const TIME_SLOTS: { value: string; label: string }[] = (() => {
  const out: { value: string; label: string }[] = [];
  for (let mins = 12 * 60; mins <= 21 * 60 + 30; mins += 30) {
    const h24 = Math.floor(mins / 60);
    const m = mins % 60;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const label = `${h12}:${String(m).padStart(2, "0")} ${h24 >= 12 ? "PM" : "AM"}`;
    out.push({ value: label, label });
  }
  return out;
})();

const minutesOf = (label: string) => {
  const [hm, ap] = label.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return ((h % 12) + (ap === "PM" ? 12 : 0)) * 60 + m;
};

/** Hi-Tea starts on 1st February. UPDATE THE YEAR if the launch date changes. */
export const HI_TEA_START = "2027-02-01";
/** Truffles anniversary, every 24th of February. */
const ANNIVERSARY_MONTH_DAY = "02-24";

export interface SlotHint {
  id: string;
  tone: "offer" | "info";
  text: string;
}

/** Messages to show for the chosen date, time and party size. */
export function reservationHints(date: string, time: string, guests: number, today: string): SlotHint[] {
  const hints: SlotHint[] = [];
  const t = time ? minutesOf(time) : null;

  // Lunch offer: every day, 12:00 to 3:30 PM
  if (t !== null && t >= 12 * 60 && t <= 15 * 60) {
    hints.push({ id: "lunch", tone: "offer", text: "This time falls in our lunch window: 20% off, 12:00 to 3:30 PM." });
  }
  // Hi-tea: from 1st Feb, 3 to 6 PM
  if (t !== null && t >= 15 * 60 && t <= 17 * 60 + 30 && date >= HI_TEA_START) {
    hints.push({ id: "hitea", tone: "offer", text: "This is hi-tea time: Rs. 1,995, 3:00 to 6:00 PM." });
  }
  if (date && date.endsWith(ANNIVERSARY_MONTH_DAY)) {
    hints.push({ id: "anniv", tone: "offer", text: "It is our anniversary: 30% off on selected items." });
  }
  if (date && date === today) {
    hints.push({ id: "today", tone: "info", text: "For a same-day table, calling or WhatsApp is the quickest way to get an answer." });
  }
  if (guests > LARGE_GROUP) {
    hints.push({ id: "group", tone: "info", text: `For groups of more than ${LARGE_GROUP}, it helps to talk to our team. You can also plan it as an event.` });
  }
  return hints;
}
