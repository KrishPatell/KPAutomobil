// Reference-detailing imagery for the static Recent Work section on the homepage.
//
// These are factual descriptions of service actions, not customer quotes, ratings, or claims
// about completed KP Automobil jobs. The photography is explicitly labelled as reference work
// until the business has its own documented portfolio.

import { media } from "./media"

export type WorkCard = {
  image: string
  imageAlt: string
  title: string
  caption: string
}

export const workCards: WorkCard[] = [
  {
    image: media.recentWorkInterior,
    imageAlt: "Detailer vacuuming the rear cabin of a modern car",
    title: "Interior reset",
    caption: "Vacuumed through the seats, rails, and center console.",
  },
  {
    image: media.recentWorkHandWax,
    imageAlt: "Hand wax being applied to clean dark vehicle paint",
    title: "Hand wax",
    caption: "Applied in sections and buffed by hand between full details.",
  },
  {
    image: media.recentWorkExterior,
    imageAlt: "Clean wheel, glass, and paint receiving a final microfiber wipe",
    title: "Exterior finish",
    caption: "Wheel faces, glass, and paint finished for the driveway.",
  },
]
