// Copy for the /book/ flow. One entry per step, in the order they are asked.
//
// The tone rule from docs/content-brief.md holds here more than anywhere: this is the page that
// takes money, so nothing on it may promise something KP cannot do on day one. No "instant
// quote", no "we'll call you back in 15 minutes", no star ratings. The flow's honest pitch is
// that the price is written before the deposit and does not move afterwards.

import { site } from "./site";

export const bookFlow = {
  title: "Get your price",
  intro: `Seven short steps. Nothing is charged until you have a written price in front of you.`,
  backToSite: "Back to the site",
  next: "Continue",
  back: "Back",
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,

  size: {
    heading: "What are we working on?",
    lede: "Footprint sets the price, not the badge. Pick whichever is closest.",
  },
  package: {
    heading: "Which package?",
    lede: "You can change this after the photos if KP thinks a different one fits better.",
    unpriced: "Priced from your photos",
  },
  extras: {
    heading: "Anything on top?",
    lede: "Both of these are sold alongside a package, never instead of one. Skip if you are not sure — you can add them on the day.",
    none: "No add-ons",
    skip: "Skip this",
  },
  photos: {
    heading: "Four photos",
    lede: "Two outside, two inside. This is the whole reason KP can price the job before turning up, so it is worth 30 seconds in the driveway.",
    add: "Add photo",
    replace: "Replace",
    remove: "Remove",
    reattach: "Attach this one again",
    reattachNote:
      "This page was reloaded, so the full-size files were dropped. The thumbnails are yours — attach the originals again before sending.",
    counter: (done: number, total: number) => `${done} of ${total} added`,
  },
  contact: {
    heading: "Where and when",
    lede: "A phone number is enough. KP replies with the written price on the same number.",
  },
  quote: {
    heading: "Your quote",
    lede: "Everything you have picked, in one place.",
    vehicleLabel: "Vehicle",
    packageLabel: "Package",
    addOnsLabel: "Add-ons",
    photosLabel: "Photos",
    whenLabel: "When",
    contactLabel: "Contact",
    totalLabel: "Total",
    editLabel: "Change",
  },
  deposit: {
    heading: `The $${site.deposit} deposit`,
    amountLabel: "Refundable deposit",
    lede: `It comes off the final bill and it is refundable with ${site.refundNoticeHours}+ hours notice. It exists because a no-show costs a half-day KP cannot resell.`,
    submit: "Send this request",
    sending: "Sending…",
    doneTitle: "Request held",
    doneBody:
      "Your answers, your photos and your preferred slot are recorded in this browser. Nothing has been charged.",
    pendingNote:
      "The send and the deposit are not switched on yet — there is no inbox or payment account to send them to. Rather than show a fake confirmation, this says exactly where your request is.",
    startAgain: "Start again",
  },
};
