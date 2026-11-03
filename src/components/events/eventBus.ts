export const EVENT_TYPE_EVENT = "truffles:event-type";

/** Pre-selects an event type in the enquiry form and scrolls to it. */
export function selectEventType(id: string) {
  window.dispatchEvent(new CustomEvent(EVENT_TYPE_EVENT, { detail: id }));
  document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
