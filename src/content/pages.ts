// The opening band of each page: eyebrow, H1, standfirst, and the closing CTA.
//
// Headings come from docs/information-architecture.pdf. They are editorial lines, not page names —
// the page name lives in src/content/nav.ts and labels the breadcrumb. Keeping the two apart is
// why About can be called "About" in the nav and still open with "One person. One van. Your
// driveway."

import { site } from "./site"

export type PageCopy = {
  eyebrow: string
  heading: string
  standfirst: string
}

export const pageCopy = {
  services: {
    eyebrow: "Services & pricing",
    heading: "Every price, before anyone touches the car.",
    standfirst:
      "Three packages, a short list of extras, and what each one costs at every vehicle size. Nothing on this page is a range you have to call about.",
  },
  gallery: {
    eyebrow: "Gallery",
    heading: "The work, unedited.",
    standfirst:
      "Same car, same angle, same light. Drag the handle to see what changed — and nothing else changed, because a filter would make the after shot worthless.",
  },
  about: {
    eyebrow: `About ${site.name}`,
    heading: "One person. One van. Your driveway.",
    standfirst:
      "No franchise, no rotating crew, no shop to drive to. The person who quotes your car is the person who details it.",
  },
  serviceAreas: {
    eyebrow: "Service areas",
    heading: `Mobile detailing across ${site.region}.`,
    standfirst:
      "The van brings its own water and power, so the job happens wherever the car already is — a driveway, an office lot, an apartment space.",
  },
  contact: {
    eyebrow: "Contact",
    heading: "Talk to us.",
    standfirst:
      "For a price, the quote tool is faster than a message — it takes about a minute. For everything else, this reaches the same person.",
  },
  bookingTerms: {
    eyebrow: "Booking terms",
    heading: "Booking terms, in plain English.",
    standfirst:
      "What the deposit does, when it comes back, what happens if the price has to change, and who pays the card fee. No clause here needs a second reading.",
  },
  book: {
    eyebrow: "Instant quote",
    heading: "Your price, in about a minute.",
    standfirst:
      "Eight short steps. The total updates as you go, and nothing is charged until you have seen it.",
  },
} satisfies Record<string, PageCopy>

/** The closing band every page ends on. The IA is explicit that everything feeds /book/. */
export const closingCta = {
  eyebrow: "Next step",
  heading: "See your price before you commit to anything.",
  body: `Pick a package, send four photos, and the written number comes back before the $${site.deposit} deposit. It is refundable with ${site.refundNoticeHours}+ hours notice, and it comes off the final bill.`,
}
