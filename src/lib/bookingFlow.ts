// The state behind /book/: what has been answered, which step that makes you eligible for, and
// how it survives a reload.
//
// Deliberate choices:
//
// - **Steps are slugs, not indices.** /book/photos is a real, shareable URL and stays valid if a
//   step is inserted before it.
// - **You cannot deep-link past your answers.** `firstIncomplete` bounces a jump to /book/deposit
//   back to whatever is actually unanswered, so the summary can never render half a booking. The
//   Vehicles tiles and Services CTAs get around this honestly, by passing ?size= / ?package=,
//   which fills the answer in before the guard runs.
// - **Photo blobs are not persisted.** Storage is a few megabytes and four phone photos are not.
//   The downscaled previews are kept so a reload still shows what you picked; the originals are
//   asked for again. See src/lib/photos.ts.
// - **Answers persist in localStorage, previews and all, for a week.** The IA asks for progress to
//   survive, and somebody who starts a quote at lunch and finishes it that evening should not have
//   to retype it. A week later it is stale — prices move and so do cars — so it is dropped.

import type { PhotoEntry, PhotoSlotId } from "./photos"
import { PHOTO_SLOTS } from "./photos"
import type { SizeId } from "../content/vehicles"
import { sizeIds } from "../content/vehicles"
import type { ConditionId } from "../content/services"
import { bookablePackages, conditions } from "../content/services"
import { booking } from "../content/booking"

export const STEPS = [
  { slug: "vehicle", label: "Vehicle" },
  { slug: "service", label: "Service" },
  { slug: "condition", label: "Condition" },
  { slug: "photos", label: "Photos" },
  { slug: "extras", label: "Add-ons" },
  { slug: "slot", label: "Time" },
  { slug: "details", label: "Details" },
  { slug: "deposit", label: "Deposit" },
] as const

export type StepSlug = (typeof STEPS)[number]["slug"]

export type FlowState = {
  size: SizeId | null
  /** The body style tapped in step 1, for the record. The size above is what prices the job. */
  bodyStyle: string | null
  vehicleNote: string
  service: string | null
  /** The conditions answered *yes*. A key is present only once the visitor has said yes to it. */
  conditions: ConditionId[]
  /**
   * The conditions answered at all, yes or no. Tracked separately from the yes-list because an
   * unanswered question and a question answered "no" are different things, and rendering the
   * second when only the first is true puts words in the visitor's mouth.
   */
  conditionsAnswered: ConditionId[]
  photos: Partial<Record<PhotoSlotId, PhotoEntry>>
  /** True once the visitor has either added four photos or explicitly skipped the step. */
  photosSkipped: boolean
  addOns: string[]
  date: string
  window: string
  name: string
  phone: string
  email: string
  address: string
  notes: string
  /** Preferred method for the balance. Nothing is charged either way — see src/lib/payments.ts. */
  payMethod: string
}

export const emptyState: FlowState = {
  size: null,
  bodyStyle: null,
  vehicleNote: "",
  service: null,
  conditions: [],
  conditionsAnswered: [],
  photos: {},
  photosSkipped: false,
  addOns: [],
  date: "",
  // Seeded, not blank: the slot step's control shows this window from the start, so leaving state
  // empty meant the summary said "no time chosen" about a time the visitor could see.
  window: booking.windows[0],
  name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  payMethod: "card",
}

const KEY = "kp-book-flow"
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export function isSizeId(value: string | null): value is SizeId {
  return !!value && sizeIds.includes(value as SizeId)
}

export function isPackageName(value: string | null): value is string {
  return !!value && bookablePackages.some((item) => item.name === value)
}

export function isStep(value: string | undefined): value is StepSlug {
  return STEPS.some((step) => step.slug === value)
}

export function stepIndex(slug: StepSlug): number {
  return STEPS.findIndex((step) => step.slug === slug)
}

/**
 * Whether a step's own question has been answered.
 *
 * Photos and add-ons are optional by design — you can get a price without them — so they complete
 * on an explicit skip as well as on an answer. What is not optional is that the step was *seen*:
 * `photosSkipped` is set by the skip button, never by default, so nobody is silently walked past
 * the thing that makes the quote reliable.
 */
export function isComplete(state: FlowState, slug: StepSlug): boolean {
  switch (slug) {
    case "vehicle":
      return state.size !== null
    case "service":
      return state.service !== null
    case "condition":
      return conditions.every((item) => state.conditionsAnswered.includes(item.id))
    case "photos":
      return state.photosSkipped || PHOTO_SLOTS.every((slot) => Boolean(state.photos[slot.id]))
    case "extras":
      return true
    case "slot":
      return state.date !== "" && state.window !== ""
    case "details":
      return state.name.trim() !== "" && state.phone.trim() !== "" && state.address.trim() !== ""
    case "deposit":
      return true
  }
}

/** The furthest step the visitor has earned. Everything before it is answered. */
export function firstIncomplete(state: FlowState): StepSlug {
  for (const step of STEPS) {
    if (!isComplete(state, step.slug)) return step.slug
  }
  return STEPS[STEPS.length - 1].slug
}

/** True when `target` may be rendered: it is answered already, or it is the next thing to answer. */
export function canVisit(state: FlowState, target: StepSlug): boolean {
  return stepIndex(target) <= stepIndex(firstIncomplete(state))
}

/** How many photo slots are filled. Drives the step's own progress line. */
export function photoCount(state: FlowState): number {
  return PHOTO_SLOTS.filter((slot) => Boolean(state.photos[slot.id])).length
}

export function load(): FlowState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...emptyState }
    const saved = JSON.parse(raw) as Partial<FlowState> & { savedAt?: number }
    if (!saved.savedAt || Date.now() - saved.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(KEY)
      return { ...emptyState }
    }
    return { ...emptyState, ...saved, photos: saved.photos ?? {} }
  } catch {
    return { ...emptyState }
  }
}

export function save(state: FlowState): void {
  try {
    // The File objects are dropped here, not in the reducer — the live state keeps them so the
    // current session can still upload, and only the reload path loses them.
    const photos = Object.fromEntries(
      Object.entries(state.photos).map(([id, entry]) => [id, { ...entry, file: null }]),
    )
    localStorage.setItem(KEY, JSON.stringify({ ...state, photos, savedAt: Date.now() }))
  } catch {
    // Quota or private browsing. The flow still works, it just will not survive a reload.
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to do.
  }
}
