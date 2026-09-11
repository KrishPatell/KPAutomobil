// /contact/ — the form, the channels, and what happens after the button.
//
// Two rules from docs/information-architecture.pdf are load-bearing here:
//
//   1. "We reply within one business day" ships only if Kunj commits to it. It is
//      `site.replyWindow`, it is null, and the line does not render. The page instead says what is
//      true — the quote tool answers instantly and a message does not.
//   2. No street address. It is a mobile business; there is nothing to put on a map and no door to
//      knock on.
//
// Phone, email and social links all come from site.ts and every one of them is null today, so each
// channel is filtered out rather than rendered dead. If all of them are missing the column still
// has something real in it: the quote tool.

import { site } from "./site"

export const contactPage = {
  form: {
    eyebrow: "Send a message",
    heading: "Anything the quote tool does not cover.",
    intro:
      "For a price, the quote tool is faster — it is about a minute and the number is on screen at the end. Use this for everything else.",

    fields: {
      name: { label: "Your name", placeholder: "First and last" },
      email: { label: "Email", placeholder: "you@example.com" },
      phone: {
        label: "Phone",
        placeholder: "(000) 000-0000",
        hint: "Optional. Only used to answer this message.",
      },
      subject: { label: "What is this about", placeholder: "Choose a topic" },
      message: {
        label: "Message",
        placeholder: "As much or as little as you like.",
      },
      photo: {
        label: "Photo",
        hint: "Optional. If it is easier to show than describe.",
        empty: "No photo attached",
        clear: "Remove",
      },
    },

    subjects: [
      "A price or a package",
      "A booking I already have",
      "Whether you cover my address",
      "Something else",
    ],

    /**
     * The honeypot. A real visitor never sees this field, so anything typed into it came from a
     * script. Cheaper than a CAPTCHA and it does not make a human prove anything.
     */
    honeypot: { label: "Leave this field empty" },

    submit: "Send message",
    submitting: "Sending…",

    errorRequired: "This one is needed.",
    errorEmail: "That does not look like an email address.",
    errorMessage: "A sentence or two is enough.",
    /** Rate limit, not a bot accusation. One a minute is plenty for a real person. */
    errorTooFast: "That went through a moment ago. Give it a minute before sending another.",

    successTitle: "Held, and here is exactly where it is.",
    /**
     * Says plainly what did and did not happen. There is no inbox wired up yet — see
     * src/lib/booking.ts — and claiming "we'll be in touch shortly" would be the one kind of lie
     * this site is built against.
     */
    successBody:
      "Your message is saved in this browser. There is no inbox connected to this form yet, so nothing has been emailed to anyone and nobody has been notified. When the inbox is live this page sends for real and nothing else about it changes.",
    successAgain: "Write another",
    pendingNote:
      "This form is not connected to an inbox yet. Until it is, use the quote tool — that one works end to end.",
  },

  channels: {
    eyebrow: "Other ways",
    heading: "Where this actually reaches.",
    /** Always true, always available, and genuinely the fastest route. */
    quote: {
      label: "The quote tool",
      value: "About a minute, price on screen",
      note: "The only channel here that answers instantly.",
      href: "/book/",
    },
    phone: { label: "Phone", note: "Calls and texts reach the team." },
    email: { label: "Email", note: "Written questions, written answers." },
    instagram: { label: "Instagram", note: "Jobs go up the day they are done." },
    facebook: { label: "Facebook", note: "The same posts, a different feed." },
    /** Renders only when site.replyWindow is set. Do not publish a window Kunj has not agreed to. */
    replyLabel: "Reply time",
    hoursLabel: "Hours",
    /** Shown while site.hours is empty. An honest gap beats invented opening times. */
    hoursPending:
      "Set hours are not published yet. Pick a slot in the quote tool and the time you choose is the time we work to.",
    addressLabel: "Address",
    addressNote: `There isn't one to give. ${site.name} is mobile — the work happens where the car already is, and there is no unit to visit.`,
  },

  faq: {
    eyebrow: "Before you write",
    heading: "Three that come up most.",
    items: [
      {
        question: "Can I get a price over a message?",
        answer:
          "You can, but it is slower and it is the same number. The quote tool asks the questions that set the price and shows it on screen at the end.",
      },
      {
        question: "Do you take bookings by phone?",
        answer:
          "The slot and the deposit go through the quote tool so the written price exists before any money moves. That written price is the whole point.",
      },
      {
        question: "I already booked and something changed.",
        answer: `Say so here with the name on the booking. Moving a slot with ${site.refundNoticeHours}+ hours notice costs nothing, and the deposit follows the booking.`,
      },
    ],
  },
}
