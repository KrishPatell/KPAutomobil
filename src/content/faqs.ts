// The questions people ask before booking a detailer they have not used before.
//
// Every answer is a confirmed fact from docs/content-brief.md — the $50 refundable deposit, the
// 24-hour notice window, no card fees, the four photos, and the promise that the price does not
// change once we are standing at the car. Nothing here is a turnaround time, a guarantee, or a
// claim about results that nobody has agreed to.

import { site } from "./site"

export type Faq = { question: string; answer: string }

export const faq = {
  eyebrow: "FAQ",
  heading: "Questions, answered plainly.",
  intro:
    "The things people ask before booking a detailer they have not used before. If yours is not here, the quote form has a notes box.",
}

/** The homepage set. Short answers, in the order they are usually asked. */
export const faqs: Faq[] = [
  {
    question: "Do I need to provide water or electricity?",
    answer: `No. ${site.name} arrives with what the service needs.`,
  },
  {
    question: "Will the price change on arrival?",
    answer:
      "No. If your photos show extra work, the revised price comes in writing before arrival.",
  },
  {
    question: "How does the photo quote work?",
    answer:
      "Send two interior and two exterior shots. We review them and send a real price before the deposit.",
  },
  {
    question: `Is the $${site.deposit} deposit refundable?`,
    answer: `Yes. Cancel with at least ${site.refundNoticeHours} hours notice and the deposit is fully refundable. It also comes off the final bill.`,
  },
  {
    question: "Where can you detail my car?",
    answer: "At home, work, or an apartment space with safe access to the vehicle.",
  },
  {
    question: "Do you charge card fees?",
    answer: "No. Card, Zelle, or cash — the price is the same.",
  },
]

/**
 * Shown on /services/ underneath the homepage set. These are pricing-and-scope questions that only
 * come up once somebody is reading the packages in detail, so they would be noise on the homepage.
 */
export const serviceFaqs: Faq[] = [
  {
    question: "What photos do I need?",
    answer:
      "Two interior and two exterior shots. Daylight, whole car in frame, and one close-up of anything you already know about.",
  },
  {
    question: "Why is the price a range until I send photos?",
    answer:
      "Because the same package is a different amount of work on a car with pet hair in the carpet than on one that was detailed last month. The photos are what turn the range into one number.",
  },
  {
    question: "Can I book an add-on on its own?",
    answer:
      "Ceramic Coating and Hand Wax are finishing steps, so they are booked alongside a package rather than by themselves.",
  },
  {
    question: "What if the car needs more work than the photos showed?",
    answer:
      "You get told before we start, with the revised number, and you decide. Nothing is added to the bill without you agreeing to it first.",
  },
]
