// The booking form.
//
// The frame's version was five unlabelled boxes, a misspelt "Preffered Date", a Submit button
// wired to nothing, and a "Prefer speaking with our team directly?" panel printing a phone number
// nobody has confirmed. It also asked for a "Message" and a "vehicle type" without saying why
// either one mattered.
//
// This version asks only for what the quote actually needs, says what happens next, and does not
// promise a callback that KP has no way to make yet. The four photos and the $50 deposit are the
// next step, not this one — that is the /book/ flow in docs/information-architecture.pdf.

import { site } from "./site";

export const booking = {
  eyebrow: "Book Now",
  heading: "Start the quote. It takes about a minute.",
  intro:
    "Tell us what the car is and when suits you. The photo step comes next, and the written price comes back before any money moves.",

  fields: {
    name: { label: "Your name", placeholder: "First and last" },
    phone: { label: "Phone", placeholder: "(000) 000-0000" },
    email: { label: "Email", placeholder: "you@example.com", hint: "Optional. Where the written price is sent." },
    size: { label: "Vehicle size", placeholder: "Choose a size" },
    service: { label: "Package", placeholder: "Choose a package" },
    // The frame spelled this "Preffered Date".
    date: { label: "Preferred date", hint: `Serving ${site.city}, ${site.regionShort}.` },
    window: { label: "Time of day" },
    notes: {
      label: "Anything we should price in?",
      placeholder: "Pet hair, spills, smoke, or anything you would rather we knew before quoting.",
    },
  },

  /**
   * What happens after the button. This column used to be empty space next to the form; it now
   * carries the three facts the brand is built on. Every line has to stay true on day one —
   * docs/content-brief.md. Do not add a fourth step promising a callback.
   */
  next: {
    label: "What happens next",
    steps: [
      "You send four photos — two inside, two outside.",
      "A written price comes back, and that is the price on the day.",
      `$${site.deposit} holds the slot, refundable with ${site.refundNoticeHours}+ hours notice.`,
    ],
  },

  windows: ["Morning (8am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)"],

  submit: "Continue to photos",
  submitting: "Saving…",

  /** Shown after a successful submit. Says only what is actually true. */
  successTitle: "Saved. Next: four photos.",
  successBody: `Two interior and two exterior shots are what turn this into a real number. The written price comes back before the $${site.deposit} deposit, and the deposit is refundable with ${site.refundNoticeHours}+ hours notice.`,

  /** Shown when nothing is wired up to receive the request yet. */
  pendingNote:
    "The photo upload and deposit step are not live yet. Your answers are held in this browser so nothing has to be typed twice when they are.",

  errorRequired: "This one is needed to quote the job.",
  errorPhone: "A number we can reach you on.",
};
