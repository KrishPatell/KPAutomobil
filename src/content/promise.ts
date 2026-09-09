// The three promise cards. Each one is a fact about how the business runs, not a claim about how
// good the work is — we have no reviews yet and these have to be true on day one.

import { media } from "./media"
import { site } from "./site"

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
    title: `${site.owner} does every job`,
    body: "One person quotes your car and one person details it. There is no handoff.",
    image: media.promiseClean,
  },
]
