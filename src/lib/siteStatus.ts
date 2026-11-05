import { API_V1 } from "@/lib/backend";

/** What the Truffles API says about the site (see the backend's /api/v1/site/status). */
export interface MaintenanceNotice {
  title: string;
  message: string;
  eta: string | null;
}

/** Used when the maintenance page is opened directly (for example to preview it) and no notice was passed along. */
export const DEFAULT_NOTICE: MaintenanceNotice = {
  title: "We'll be back soon",
  message: "Truffles Rooftop is getting a little polish. Please check back shortly, or call us to reserve a table.",
  eta: null,
};

const FRESH_MS = 10_000; // ask the API at most once per 10 seconds, however many visitors there are
const KEEP_LAST_ANSWER_MS = 5 * 60_000; // if the API stops answering, trust the last answer for this long
const TIMEOUT_MS = 1_500; // never make visitors wait on the API

let last: { at: number; notice: MaintenanceNotice | null } | null = null;
let inflight: Promise<{ notice: MaintenanceNotice | null } | null> | null = null;

async function ask(): Promise<{ notice: MaintenanceNotice | null } | null> {
  try {
    const res = await fetch(`${API_V1}/site/status`, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { maintenance?: { enabled?: boolean; title?: string; message?: string; eta?: string | null } } };
    const m = json.data?.maintenance;
    if (!m) return null;
    if (!m.enabled) return { notice: null };
    return {
      notice: {
        title: String(m.title ?? DEFAULT_NOTICE.title).slice(0, 80),
        message: String(m.message ?? DEFAULT_NOTICE.message).slice(0, 400),
        eta: m.eta ? String(m.eta).slice(0, 60) : null,
      },
    };
  } catch {
    return null;
  }
}

/**
 * The maintenance notice to show, or null when the site is open.
 *
 * Never takes the website down by accident: if the API cannot be reached and nothing is known, the site stays open.
 * (A "maintenance is on" answer already received is kept for a few minutes through a short API outage.)
 * The cache is per server process; it is only a load saver, correctness does not depend on it.
 */
export async function getMaintenanceNotice(): Promise<MaintenanceNotice | null> {
  const now = Date.now();
  if (last && now - last.at < FRESH_MS) return last.notice;

  if (!inflight) {
    inflight = ask()
      .then((answer) => {
        if (answer) last = { at: Date.now(), notice: answer.notice };
        return answer;
      })
      .finally(() => {
        inflight = null;
      });
  }
  const answer = await inflight;
  if (answer) return answer.notice;

  return last && now - last.at < KEEP_LAST_ANSWER_MS ? last.notice : null;
}
