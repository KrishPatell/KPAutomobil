// The seam between the booking form and whatever ends up receiving it.
//
// Nothing receives it yet: there is no backend, no form service and no confirmed inbox — site.email
// is still null. So a submitted request is kept in sessionStorage under one key, and that is
// stated on screen rather than dressed up as "we'll be in touch shortly".
//
// When the /book/ flow lands (docs/information-architecture.pdf), `send` becomes the POST and this
// module is the only file that changes.

export type BookingRequest = {
  name: string;
  phone: string;
  email: string;
  address: string;
  size: string;
  bodyStyle: string;
  vehicleNote: string;
  service: string;
  conditions: string[];
  addOns: string[];
  /** How many of the four photo slots were filled. The files themselves are not in here. */
  photoCount: number;
  photosSkipped: boolean;
  date: string;
  window: string;
  /** Preferred method for the balance. Nothing is charged either way. */
  payMethod: string;
  /** Dollars, or null when any line in the quote is still unpriced. */
  total: number | null;
  notes: string;
};

const KEY = "kp-booking-draft";

export function loadDraft(): Partial<BookingRequest> {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<BookingRequest>) : {};
  } catch {
    // Private browsing, or storage disabled. An empty form is the right fallback.
    return {};
  }
}

/**
 * Records the request. Returns `false` when it could only be held locally, so the caller can say
 * so instead of claiming it was sent.
 */
export async function send(request: BookingRequest): Promise<boolean> {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(request));
  } catch {
    // Nothing to do — the UI does not depend on the draft surviving a reload.
  }
  return false;
}

// ── /contact/ ───────────────────────────────────────────────────────────────────────────────────
//
// Same seam, same honesty: there is no inbox behind this either. `sendMessage` returns false so the
// page can say the message was held locally rather than claiming somebody was notified. When an
// inbox exists this becomes the POST and nothing above the seam changes.

export type ContactMessage = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  /** Name of an attached file, if the visitor picked one. The file itself is not stored. */
  photoName: string | null;
  /** Milliseconds since the epoch. Also drives the client-side rate limit. */
  sentAt: number;
};

const MESSAGE_KEY = "kp-contact-message";
const LAST_SENT_KEY = "kp-contact-last-sent";

/** One message a minute. A rate limit, not a bot test — a real person is never asked to prove one. */
export const MESSAGE_INTERVAL_MS = 60_000;

/** How long until another message is allowed. 0 means now. */
export function messageCooldown(now = Date.now()): number {
  try {
    const raw = window.localStorage.getItem(LAST_SENT_KEY);
    if (!raw) return 0;
    const elapsed = now - Number(raw);
    if (!Number.isFinite(elapsed) || elapsed < 0) return 0;
    return Math.max(0, MESSAGE_INTERVAL_MS - elapsed);
  } catch {
    // Storage disabled. Not being able to rate limit is not a reason to block a real person.
    return 0;
  }
}

/**
 * Records the message. Returns `false` when it could only be held locally, which is every time
 * until an inbox is wired up — so the caller says that rather than "we'll be in touch".
 */
export async function sendMessage(message: ContactMessage): Promise<boolean> {
  try {
    window.sessionStorage.setItem(MESSAGE_KEY, JSON.stringify(message));
    window.localStorage.setItem(LAST_SENT_KEY, String(message.sentAt));
  } catch {
    // Nothing to do — the UI does not depend on the draft surviving a reload.
  }
  return false;
}
