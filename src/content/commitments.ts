// KP Automobil has no customers yet, so this slot carries commitments instead of reviews.
// Content brief §3c: if we fill it, every word must be true and attributable.
// Every claim below is one of the brief's confirmed facts. Do not add a quote here.

import { site } from "./site";

const owner = site.owner;

export type Commitment = {
  /** Who or what is speaking — rendered in orange. */
  label: string;
  /** Supporting line under the label. */
  sublabel: string;
  body: string;
};

export const commitmentsEyebrow = "The promise";
export const commitmentsHeading = "No reviews yet. Here is what we will hold ourselves to instead.";

export const commitmentsIntro =
  "Five things a first customer can hold us to on day one. Every one of them is checkable — none of them is a testimonial we do not have.";

/** Screen-reader / control labels for the carousel. */
export const commitmentsControls = {
  prev: "Previous commitment",
  next: "Next commitment",
  goTo: (index: number) => `Show commitment ${index + 1}`,
};

export const commitments: Commitment[] = [
  {
    label: "Kunj",
    sublabel: "Owner, KP Automobil",
    body: "KP Automobil is new. There are no customer reviews to show yet, and we are not going to borrow anyone else's. Here is what you get instead.",
  },
  {
    label: "The price",
    sublabel: "Agreed before we arrive",
    body: "You see the price on screen and approve it before you book. If your photos show pet hair or set-in stains that change the work, the new price comes to you in writing. We never raise it standing at your car.",
  },
  {
    label: "The van",
    sublabel: "Water and power on board",
    body: `Nothing plugs into your outlet and nothing runs off your hose. The van arrives carrying its own supply, so a driveway, an office lot or an apartment space all work the same.`,
  },
  {
    label: "The work",
    sublabel: `${owner} does every job`,
    body: `${owner} is the person who quotes your car and the person who details it. There is no crew rota and no handover, so the standard on your booking is the same one on every other booking.`,
  },
  {
    label: "The deposit",
    sublabel: "$50, fully refundable",
    body: "The $50 deposit comes off your final bill. Cancel 24 or more hours ahead and you get all of it back. Card, Zelle or cash cost the same — the card fee is ours, not yours.",
  },
];
