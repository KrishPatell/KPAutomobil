// The comparison table.
//
// The frame shipped this as eight generic virtues — "Premium Products", "Dedicated Service",
// "Quality Over Speed" — every one of which a car wash down the road would also tick. A comparison
// where both columns are opinions is not a comparison, and "premium experience" is on the banned
// list in docs/content-brief.md for exactly this reason.
//
// So each row here is a checkable fact about how the booking works, drawn from the brief's pricing-
// honesty position: the price arrives before the booking, the deposit is refundable, the van comes
// to the car, one person does the work, and the number does not move at the door. The right-hand
// column says what is normal elsewhere — not an accusation, just the default this business is
// built against.

import { site } from "./site";

export type CompareRow = {
  feature: string;
  /** What KP does. Rendered with a tick. */
  kp: string;
  /** The common alternative. Rendered with a cross. */
  others: string;
};

export const rows: CompareRow[] = [
  { feature: "Getting a price", kp: "In writing, from your photos, before you book", others: "Call back for an estimate" },
  { feature: "Who quotes it", kp: "Nobody has to come out first", others: "A visit to see the car" },
  { feature: "Where the work happens", kp: "Your driveway, lot or garage", others: "You drive to them and wait" },
  { feature: "Who does the work", kp: "KP Automobil, every booking", others: "Whoever is rostered" },
  { feature: "Holding the slot", kp: `$${site.deposit}, refundable with ${site.refundNoticeHours}+ hours notice`, others: "Non-refundable, or no slot held" },
  { feature: "Paying by card", kp: "Same price as cash", others: "A processing fee on top" },
  { feature: "On arrival", kp: "The quote is the price", others: "Add-ons priced at the door" },
  { feature: "What the van carries", kp: "Its own water and power", others: "Your hose and your outlet" },
];

export const compare = {
  eyebrow: "The Difference",
  heading: "Eight things you can check before you book.",
  intro:
    "No vague quote, no card fee, no price change in your driveway. Every line below is either true of a booking or it is not — there is nothing here to take on trust.",
  kpLabel: site.name,
  othersLabel: "Most detailers",
  featureLabel: "How it works",
};
