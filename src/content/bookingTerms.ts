// Booking terms that are true today. Keep this separate from marketing copy: a term should be
// specific enough to rely on, and never fill a gap with a made-up policy.

import { site } from "./site"

export const bookingTerms = {
  eyebrow: "Before you book",
  heading: "The practical parts, stated plainly.",
  intro:
    "These are the terms behind the quote flow. If anything about the car changes, you see it in writing before work begins.",
  items: [
    {
      label: "01",
      title: "Your written price",
      body:
        "The price is based on your vehicle, the package and the photos you send. If the photos or the car show that the scope needs to change, we send the revised number before any work starts. You choose whether to go ahead.",
    },
    {
      label: "02",
      title: `The $${site.deposit} deposit`,
      body: `The deposit holds the requested slot and comes off the final bill. It is fully refundable when you give at least ${site.refundNoticeHours} hours' notice.`,
    },
    {
      label: "03",
      title: "Your requested time",
      body:
        "Choosing a date and time in the quote tool sends a request; it is not confirmed until the team agrees it with you. We will not present a time as booked before that happens.",
    },
    {
      label: "04",
      title: "How you pay",
      body:
        "Card, Zelle or cash are the same price. There is no card-processing fee added on top of the written quote.",
    },
    {
      label: "05",
      title: "The place we work",
      body:
        "The service is mobile, so the car stays where it is. Tell us in advance about access, parking or building rules that could affect the work area.",
    },
  ],
} as const
