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
  size: string;
  service: string;
  date: string;
  window: string;
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
