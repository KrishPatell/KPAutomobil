// The seam between the browser forms and the Resend-backed Vercel functions.
//
// The request is also kept in sessionStorage as a local fallback. That gives the UI an honest
// answer if the deployment is missing Resend env vars or the network fails during a local preview.

export type BookingRequest = {
  name: string;
  phone: string;
  email: string;
  address?: string;
  size: string;
  bodyStyle?: string;
  vehicleNote?: string;
  service: string;
  conditions?: string[];
  addOns?: string[];
  /** How many of the four photo slots were filled. The files themselves are not in here. */
  photoCount?: number;
  photosSkipped?: boolean;
  date: string;
  window: string;
  /** Preferred method for the balance. Nothing is charged either way. */
  payMethod?: string;
  /** Dollars, or null when any line in the quote is still unpriced. */
  total?: number | null;
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

export async function send(request: BookingRequest, photos: File[] = []): Promise<boolean> {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(request));
  } catch {
    // Nothing to do — the UI does not depend on the draft surviving a reload.
  }
  const data = new FormData();
  data.append("payload", JSON.stringify(request));
  for (const photo of photos) data.append("photos", photo, photo.name);
  return postForm("/api/booking", data);
}

// ── /contact/ ───────────────────────────────────────────────────────────────────────────────────
//
// Same seam, same fallback. The original image, when present, goes to the function as multipart
// data and is attached to the email.

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

export async function sendMessage(message: ContactMessage, photo?: File | null): Promise<boolean> {
  try {
    window.sessionStorage.setItem(MESSAGE_KEY, JSON.stringify(message));
    window.localStorage.setItem(LAST_SENT_KEY, String(message.sentAt));
  } catch {
    // Nothing to do — the UI does not depend on the draft surviving a reload.
  }
  const data = new FormData();
  data.append("name", message.name);
  data.append("email", message.email);
  data.append("phone", message.phone);
  data.append("subject", message.subject);
  data.append("message", message.message);
  if (photo) data.append("photo", photo, photo.name);
  return postForm("/api/contact", data);
}

async function postForm(path: string, data: FormData): Promise<boolean> {
  try {
    const response = await fetch(path, {
      body: data,
      method: "POST",
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { ok?: boolean };
    return result.ok === true;
  } catch {
    return false;
  }
}
