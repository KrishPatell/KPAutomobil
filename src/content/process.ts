// How it works, in three steps. Rendered against the sticky split panel on the homepage.

import { media } from "./media"
import { site } from "./site"

export type ProcessStep = {
  number: string
  title: string
  body: string
  meta: string
  image: string
  imageAlt: string
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Price before booking",
    body: "Pick a package and your vehicle size, then send two interior and two exterior photos. The written price comes back in about a minute — no callback.",
    meta: `$${site.deposit} deposit · refundable ${site.refundNoticeHours}h+`,
    image: media.processQuote,
    imageAlt: "Booking a detail on a phone in a driveway",
  },
  {
    number: "02",
    title: "We come to you",
    body: `${site.owner} arrives at the time you picked with everything the job needs already in the van. Driveway, office lot or apartment parking — the car does not have to move.`,
    meta: "Everything travels in the van",
    image: media.processArrive,
    imageAlt: "A detailer working on a car in a driveway",
  },
  {
    number: "03",
    title: "Pay what you were quoted",
    body: "The number on your quote is the number you pay. The deposit comes off the total and nothing gets added at the door.",
    meta: "Card · Zelle · cash, one price",
    image: media.processDone,
    imageAlt: "A finished car parked on a driveway",
  },
]

export const process = {
  eyebrow: "How it works",
  heading: "Three steps, and none of them is waiting for a callback.",
  intro:
    "The whole point is that you know the number before anyone turns up. Everything below exists to make that true.",
}
