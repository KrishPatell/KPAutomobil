// The price matrix for /services/ and the /book/ quote tool.
//
// ─── PROVENANCE — read this before changing a number ────────────────────────────────────────────
//
// Source:     docs/mpg-detailing-price-list-reference.xlsx
// What it is: a COMPETITOR's published list (MPG Detailing), kept for reference. It is not, and has
//             never been, KP Automobil's own pricing.
// Mapping:    approved 2026-09-09 — "level with MPG". Where MPG lists an equivalent service the
//             figure is theirs, rounded off the .99 and read across four size tiers instead of
//             their two. Where MPG lists nothing equivalent, the cell below stays null.
// Status:     PROVISIONAL, pending Kunj's sign-off. These are the numbers the site quotes from
//             today; they are not numbers Kunj has confirmed as his.
//
// Two rules follow from that status and both are load-bearing:
//
//   1. Every price rendered on screen keeps its qualifier — the final number is confirmed from the
//      customer's four photos, before the deposit. No figure here is presented as final-on-sight.
//   2. A null is not a zero. `quote()` in src/lib/quote.ts returns `total: null` the moment any
//      single line is unpriced, and the summary then says "priced from your photos" rather than
//      quietly under-totalling. Do not invent a number to fill a null cell — an under-total is a
//      lie the customer only discovers on the day, which is the exact failure this brand is built
//      against.
//
// Why three-row sits above truck: a pickup has a big exterior but a small cabin, and these packages
// are interior-led. A minivan with a third row is more seats, more carpet and more glass than a crew
// cab, so it costs more to do properly.
//
// ────────────────────────────────────────────────────────────────────────────────────────────────

import type { SizeId } from "./vehicles"
import { site } from "./site"

/** Dollars, or null while unconfirmed. One cell per service per vehicle size. */
export type SizePrices = Record<SizeId, number | null>

const unpriced: SizePrices = { sedan: null, suv: null, "three-row": null, truck: null }

/**
 * Keyed by the package name in src/content/services.ts. The keys must match those names exactly —
 * the flow passes the name through as the identifier, so a typo here shows up as a missing price
 * rather than a crash.
 *
 * MPG equivalents: Interior Refresh → their "Interior Refresh" ($249.99 / $284.99).
 * Full Detail → their "MPG Refresh" ($299.99 / $374.99). Deep Restoration has no MPG equivalent;
 * it is set above Full Detail by the same step MPG puts between their interior and full tiers.
 */
export const packagePrices: Record<string, SizePrices> = {
  "Interior Refresh": { sedan: 250, suv: 285, "three-row": 315, truck: 305 },
  "Full Detail": { sedan: 300, suv: 375, "three-row": 415, truck: 405 },
  "Deep Restoration": { sedan: 475, suv: 550, "three-row": 600, truck: 585 },
}

/**
 * Add-ons are priced per vehicle size too — a truck's worth of paint is not a sedan's.
 *
 * Ceramic Coating maps to MPG's 2-year coating ($599.99 / $699.99). Hand Wax maps to their
 * Wash/Clay/Seal ($114.99 / $149.99). The other six have no MPG equivalent at all, so they stay
 * null and the total degrades honestly. That is deliberate — see the header.
 */
export const addOnPrices: Record<string, SizePrices> = {
  "Ceramic Coating": { sedan: 600, suv: 700, "three-row": 750, truck: 750 },
  "Hand Wax": { sedan: 115, suv: 150, "three-row": 165, truck: 165 },

  "Pet Hair Removal": { ...unpriced },
  "Heavy Stain Treatment": { ...unpriced },
  "Odour Removal": { ...unpriced },
  "Engine Bay": { ...unpriced },
  "Headlight Restoration": { ...unpriced },
  "Trunk Deep Clean": { ...unpriced },
}

/** The cheapest confirmed cell for a service, for the "From $250" line. Null if none is priced. */
export function startingPrice(name: string): number | null {
  const row = packagePrices[name] ?? addOnPrices[name]
  if (!row) return null
  const known = Object.values(row).filter((value): value is number => value !== null)
  return known.length > 0 ? Math.min(...known) : null
}

export const pricing = {
  deposit: site.deposit,
  refundNoticeHours: site.refundNoticeHours,

  /** Shown wherever a total would go while any line in it is still unpriced. */
  pendingTotal: "Priced from your photos",
  pendingNote:
    `${site.name} writes the price after looking at your four photos, and that written price is what you pay on the day. No number is shown here that has not been quoted to you.`,

  /** The qualifier that has to travel with every price on screen. Rule 1 in the header. */
  qualifier: "Confirmed from your photos, before you pay anything.",

  /** Shown against a service whose cell is null rather than a figure. */
  unpricedNote: "Priced from your photos — it depends on how much there is.",

  startingLabel: "From",
  sizeNote: "Prices shown per vehicle size. Pick yours in the quote tool.",
}
