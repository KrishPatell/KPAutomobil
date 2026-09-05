// The price matrix for the /book/ flow.
//
// **Every number in here is null, and that is the feature.** docs/content-brief.md is explicit
// that KP has not set prices, and the brand's whole position is that the number you see is the
// number you pay. A placeholder like "from $149" would be the one lie the site cannot afford, so
// the flow is built to carry a null all the way to the summary and say what it actually knows:
// the price is written after the photos, before the deposit.
//
// When Kunj confirms the numbers, fill the cells in. Nothing else has to change — `quote()` in
// src/lib/quote.ts already sums them, and the summary step already renders a real total the moment
// every cell it needs is non-null.

import type { SizeId } from "./vehicles";
import { site } from "./site";

/** Dollars, or null while unconfirmed. One cell per package per vehicle size. */
export type SizePrices = Record<SizeId, number | null>;

const unpriced: SizePrices = { sedan: null, suv: null, "three-row": null, truck: null };

/**
 * Keyed by the package title in src/content/services.ts. The keys must match those titles exactly
 * — the flow passes the title through as the identifier, so a typo here shows up as a missing
 * price rather than a crash.
 */
export const packagePrices: Record<string, SizePrices> = {
  "Interior Refresh": { ...unpriced },
  "Full Detail": { ...unpriced },
  "Deep Restoration": { ...unpriced },
};

/** Add-ons are priced per vehicle size too — a truck's worth of paint is not a sedan's. */
export const addOnPrices: Record<string, SizePrices> = {
  "Ceramic Coating": { ...unpriced },
  "Hand Wax": { ...unpriced },
};

export const pricing = {
  deposit: site.deposit,
  refundNoticeHours: site.refundNoticeHours,
  /** Shown wherever a total would go while the matrix above is still null. */
  pendingTotal: "Priced from your photos",
  pendingNote:
    "KP writes the price after looking at your four photos, and that written price is what you pay on the day. No number is shown here that has not been quoted to you.",
};
