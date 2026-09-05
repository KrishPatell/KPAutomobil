// The three steps, rewritten around what actually happens. The template's version described a
// generic booking funnel — "choose the service that best fits your vehicle and preferred
// schedule", "enjoy a refreshed, showroom-worthy finish" — which is the exact test
// docs/content-brief.md sets: a line that could sit unchanged on a competitor's site gets
// rewritten. Nothing here is new; it is the quote flow the booking dialog already implements,
// said out loud.
//
// Each step carries a `chip`: one short factual line, all three drawn from the confirmed facts
// (the $50 refundable deposit, the van carrying its own supply, one price across card, Zelle
// and cash). They are the reason to trust the step above them, so they are not decoration.

import { site } from "./site";

import imgPanel from "../imports/1440WLight/e889eaaf6a46e055effc04767a7f673621364259.png";
import imgQuote from "../imports/1440WLight/19440e56c9c65186f3b6c30dec7f8a3ceeba185f.png";
import imgArrive from "../imports/1440WLight/6d20032164c0accdcb808ea7f49eb357b1d69b6a.png";
import imgDone from "../imports/1440WLight/09a2840f1423e6f94915dc184d61277e4b149837.png";

export type Step = {
  /** "01". Rendered as-is, so the zero is deliberate. */
  n: string;
  name: string;
  body: string;
  chip: string;
  image: string;
  imageAlt: string;
};

export const steps: Step[] = [
  {
    n: "01",
    name: "Price before booking",
    body: "Pick a package and your vehicle size, then send two interior and two exterior photos. The written price comes back in about a minute — no callback, and nobody has to come out to quote it.",
    chip: `$${site.deposit} deposit · refundable ${site.refundNoticeHours}h+`,
    image: imgQuote,
    imageAlt: "Booking a detail on a phone in a driveway, beside a black sedan",
  },
  {
    n: "02",
    name: "We come to you",
    body: `${site.owner} arrives at the time you picked with everything the job needs already in the van. Driveway, office lot or apartment parking — the car does not have to move.`,
    chip: "Everything travels in the van",
    image: imgArrive,
    imageAlt: "A detailer steam-cleaning a black sedan on a driveway next to the work van",
  },
  {
    n: "03",
    name: "Pay what you were quoted",
    body: "The number on your quote is the number you pay. The deposit comes off the total, the balance is due when the work is done, and nothing gets added at the door.",
    chip: "Card · Zelle · cash, one price",
    image: imgDone,
    imageAlt: "A finished black sedan parked on a stone driveway at sunset",
  },
];

export const process = {
  eyebrow: "How It Works",
  heading: "Three steps, and the price is settled before anyone touches the car.",
  intro:
    "Four photos and about a minute of your time. That is the whole quote — no site visit, no phone tag, and no new figure once we are standing in your driveway.",
  cta: "Start your quote",
  panelImage: imgPanel,
  panelImageAlt: `The ${site.name} van on the road, heading to a booking`,
};
