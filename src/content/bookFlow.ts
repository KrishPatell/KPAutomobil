// Copy for the /book/ flow. One entry per step, in the order they are asked.
//
// The tone rule from docs/content-brief.md holds here more than anywhere: this is the page that
// takes money, so nothing on it may promise something KP cannot do on day one. No "we'll call you
// back in 15 minutes", no star ratings, no confirmed appointment. The flow's honest pitch is that
// the price is written before the deposit and does not move afterwards.
//
// Two things on this page are deliberately blunt rather than reassuring:
//
//   - The slot step says **requested**, not booked. There is no calendar backend to promise
//     against, and a confirmation the business cannot honour is worse than a caveat.
//   - The deposit step says plainly that nothing was charged and where the request actually went.
//     See src/lib/payments.ts and src/lib/booking.ts — both return "not delivered" on purpose.

import { site } from "./site"

export const bookFlow = {
  title: "Get your price",
  intro:
    "Eight short steps, about a minute. Nothing is charged until a written price is in front of you.",
  backToSite: "Back to the site",
  next: "Continue",
  back: "Back",
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
  progressLabel: "Your quote",

  vehicle: {
    heading: "What are we working on?",
    lede: "Footprint sets the price, not the badge. A coupe, an EV and a full-size luxury sedan all price the same.",
    noteLabel: "Year, make and model",
    notePlaceholder: "2019 Honda Accord",
    noteHint: "Optional, and only for the record — it does not change the price.",
    sizeLabel: "Prices as",
  },

  service: {
    heading: "Which package?",
    lede: "Prices below are for your size. If the photos show a different package fits better, you get told before anything is charged, not after.",
    pickSizeFirst: "Pick a vehicle first and the prices fill in.",
  },

  condition: {
    heading: "How rough is it, honestly?",
    lede: "Be straight here. It costs you less than us finding out on the day — every answer below adds a named line you can see and remove, never a hidden rate.",
    yes: "Yes",
    no: "No",
    none: "None of these",
    noneHint: "Answering none is a fine answer. It just means nothing is added.",
    addedLabel: "Added by your answers",
    addedNote: "Each of these is a line item on the next screen and every one can be taken off.",
  },

  photos: {
    heading: "Four photos",
    lede: "Two outside, two inside. This is the whole reason the price can be written before anyone turns up, so it is worth thirty seconds in the driveway.",
    add: "Add photo",
    replace: "Replace",
    remove: "Remove",
    reattach: "Attach this one again",
    reattachNote:
      "This page was reloaded, so the full-size files were dropped. The thumbnails are yours — attach the originals again before sending.",
    counter: (done: number, total: number) => `${done} of ${total} added`,
    skip: "Skip the photos",
    skipped: "Photos skipped",
    skippedNote:
      "Without them the price on the next screen is an estimate from the size and package alone. It is confirmed — or corrected — once photos arrive, and you see the number before you pay.",
    undoSkip: "Add photos after all",
  },

  extras: {
    heading: "Anything on top?",
    lede: "Add-ons sit alongside a package, never instead of one. The ticked ones came from your answers a moment ago — untick anything you do not want.",
    suggested: "Suggested",
    none: "No add-ons",
    unpricedTag: "Priced from photos",
  },

  slot: {
    heading: "When suits you?",
    lede: "Pick a day and a window. This is a request, not a confirmed booking — there is no live calendar yet, so the time is agreed with you before the deposit.",
    dateLabel: "Preferred date",
    windowLabel: "Time of day",
    requestedNote: "Requested, not confirmed.",
  },

  details: {
    heading: "Where and how to reach you",
    lede: "A phone number and an address are enough. The written price comes back on the same number.",
    addressHint: "Where the car will be parked. A driveway, a lot, a kerbside space.",
  },

  deposit: {
    heading: `The $${site.deposit} deposit`,
    amountLabel: "Refundable deposit",
    lede: `It comes off the final bill and it is refundable with ${site.refundNoticeHours}+ hours notice. It exists because a no-show costs a half-day that cannot be resold.`,
    summaryLabel: "Your quote",
    totalLabel: "Total",
    balanceLabel: `Due on the day`,
    methodsLabel: "How you would like to pay the balance",
    methodsNote: "No card fees. Whatever method you pick, the price is the price.",
    methods: [
      { id: "card", label: "Card", note: "Processing cost is absorbed, not passed on." },
      { id: "zelle", label: "Zelle", note: "Sent on the day, once the work is signed off." },
      { id: "cash", label: "Cash", note: "Paid on completion, receipt by text." },
    ],
    termsLink: "Read the booking terms",
    submit: "Send this request",
    sending: "Sending…",
    doneTitle: "Request held",
    doneBody:
      "Your answers, your thumbnails and your preferred window are recorded in this browser. Nothing has been charged and nothing has been sent.",
    pendingNote:
      "The send and the deposit are not switched on yet — there is no inbox or payment account behind them. Rather than show a confirmation that has not happened, this says exactly where your request is.",
    startAgain: "Start again",
  },

  /** The sticky running total on narrow screens. */
  pill: {
    label: "Running total",
    empty: "No package yet",
  },
}
