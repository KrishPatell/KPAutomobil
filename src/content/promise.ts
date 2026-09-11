// The three promise cards. Each one is a fact about how the business runs, not a claim about how
// good the work is — we have no reviews yet and these have to be true on day one.

import { media } from "./media"

export type PromiseCard = {
  label: string
  title: string
  body: string
  image: string
}

export const promiseCards: PromiseCard[] = [
  {
    label: "The price",
    title: "Agreed before we arrive",
    body: "You see the written price before you book. We do not add a surprise number at the driveway.",
    image: media.promiseDirty,
  },
  {
    label: "The van",
    title: "Water and power on board",
    body: "The van carries what the job needs, so your home, office lot, or apartment space can work.",
    image: media.promiseFoam,
  },
  {
    label: "The work",
    title: "Our team does every job",
    body: "The same written scope guides the team from quote through handoff. There is no surprise handoff.",
    image: media.promiseClean,
  },
]
