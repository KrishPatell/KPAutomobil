// The state behind /book/: what has been answered, which step that makes you eligible for, and
// how it survives a reload.
//
// Deliberate choices:
//
// - **Steps are slugs, not indices.** /book/photos is a real, shareable URL and stays valid if a
//   step is inserted before it.
// - **You cannot deep-link past your answers.** `firstIncomplete` bounces a jump to /book/quote
//   back to whatever is actually unanswered, so the summary can never render half a booking. The
//   Vehicles tiles and Services CTAs get around this honestly, by passing ?size= / ?package=,
//   which fills the answer in before the guard runs.
// - **Photo blobs are not persisted.** sessionStorage is a few megabytes and four phone photos are
//   not. The downscaled previews are kept so a reload still shows what you picked; the originals
//   are asked for again. See src/lib/photos.ts.

import type { PhotoEntry, PhotoSlotId } from "./photos";
import { PHOTO_SLOTS } from "./photos";
import type { SizeId } from "../content/vehicles";
import { sizes } from "../content/vehicles";
import { packages } from "../content/services";
import { booking } from "../content/booking";

export const STEPS = [
  { slug: "size", label: "Vehicle" },
  { slug: "package", label: "Package" },
  { slug: "extras", label: "Add-ons" },
  { slug: "photos", label: "Photos" },
  { slug: "contact", label: "Contact" },
  { slug: "quote", label: "Your price" },
  { slug: "deposit", label: "Deposit" },
] as const;

export type StepSlug = (typeof STEPS)[number]["slug"];

export type FlowState = {
  size: SizeId | null;
  service: string | null;
  addOns: string[];
  photos: Partial<Record<PhotoSlotId, PhotoEntry>>;
  name: string;
  phone: string;
  email: string;
  date: string;
  window: string;
  notes: string;
};

export const emptyState: FlowState = {
  size: null,
  service: null,
  addOns: [],
  photos: {},
  name: "",
  phone: "",
  email: "",
  date: "",
  // Seeded, not blank: the contact step's select shows this slot from the start, so leaving
  // state empty meant the summary said "no time chosen" about a time the visitor could see.
  window: booking.windows[0],
  notes: "",
};

const KEY = "kp-book-flow";

export function isSizeId(value: string | null): value is SizeId {
  return !!value && sizes.some((size) => size.id === value);
}

export function isPackageTitle(value: string | null): value is string {
  return !!value && packages.some((pkg) => pkg.title === value && !pkg.addOn);
}

export function isStep(value: string | undefined): value is StepSlug {
  return STEPS.some((step) => step.slug === value);
}

/**
 * Whether a step's own question has been answered. Add-ons and notes are optional by design, so
 * their steps are complete the moment you have seen them — `extras` is gated on the answer before
 * it instead, which is what stops a jump straight to /book/photos.
 */
export function isComplete(state: FlowState, slug: StepSlug): boolean {
  switch (slug) {
    case "size":
      return state.size !== null;
    case "package":
      return state.service !== null;
    case "extras":
      return state.service !== null;
    case "photos":
      return PHOTO_SLOTS.every((slot) => Boolean(state.photos[slot.id]));
    case "contact":
      return state.name.trim() !== "" && state.phone.trim() !== "" && state.date !== "";
    case "quote":
      return true;
    case "deposit":
      return true;
  }
}

/** The furthest step the visitor has earned. Everything before it is answered. */
export function firstIncomplete(state: FlowState): StepSlug {
  for (const step of STEPS) {
    if (!isComplete(state, step.slug)) return step.slug;
  }
  return STEPS[STEPS.length - 1].slug;
}

/** True when `target` may be rendered: it is answered already, or it is the next thing to answer. */
export function canVisit(state: FlowState, target: StepSlug): boolean {
  const order = STEPS.findIndex((step) => step.slug === target);
  const allowed = STEPS.findIndex((step) => step.slug === firstIncomplete(state));
  return order <= allowed;
}

export function load(): FlowState {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { ...emptyState };
    const saved = JSON.parse(raw) as Partial<FlowState>;
    return { ...emptyState, ...saved, photos: saved.photos ?? {} };
  } catch {
    return { ...emptyState };
  }
}

export function save(state: FlowState): void {
  try {
    // The File objects are dropped here, not in the reducer — the live state keeps them so the
    // current session can still upload, and only the reload path loses them.
    const photos = Object.fromEntries(
      Object.entries(state.photos).map(([id, entry]) => [id, { ...entry, file: null }]),
    );
    sessionStorage.setItem(KEY, JSON.stringify({ ...state, photos }));
  } catch {
    // Quota or private browsing. The flow still works, it just will not survive a reload.
  }
}

export function clear(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to do.
  }
}
