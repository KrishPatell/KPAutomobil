// Before / after pairs for the drag-to-reveal slider.
//
// Every pair must be the same car, same angle, same lighting — that is the whole claim the gallery
// makes ("The work, unedited"), and a mismatched pair breaks it. `category` drives the gallery
// filter chips.

import { media } from "./media"

export type ComparisonPair = {
  title: string
  caption: string
  before: string
  after: string
  category: "exterior" | "interior" | "pet-hair" | "stains"
}

export const comparisonPairs: ComparisonPair[] = [
  {
    title: "Road film",
    caption: "Road grime lifted from paint and wheels.",
    before: media.bmwHeavyDirty,
    after: media.bmwFinished,
    category: "exterior",
  },
  {
    title: "Road-film coupe",
    caption: "A wet-weather layer lifted from paint, glass, and wheels.",
    before: media.porscheHeavyDirty,
    after: media.porscheClean,
    category: "exterior",
  },
  {
    title: "Pollen SUV",
    caption: "Pollen, brake dust, and lower-panel grime cleared away.",
    before: media.suvHeavyDirty,
    after: media.suvClean,
    category: "exterior",
  },
  {
    title: "Dried mud",
    caption: "Mud spatter off the lower panels and arches, paint left even.",
    before: media.bmwMud,
    after: media.bmwFinished,
    category: "exterior",
  },
  {
    title: "Pollen season",
    caption: "A full pollen layer cleared without marring the clearcoat.",
    before: media.bmwPollen,
    after: media.bmwFinished,
    category: "exterior",
  },
  {
    title: "Water spotting",
    caption: "Hard-water spots taken off glass and paint.",
    before: media.bmwWaterSpot,
    after: media.bmwFinished,
    category: "stains",
  },
  {
    title: "Paint haze",
    caption: "Surface haze cut back so the colour reads properly again.",
    before: media.bmwPaintHaze,
    after: media.bmwFinished,
    category: "exterior",
  },
]

export const results = {
  eyebrow: "Results",
  heading: "Drag the handle. Same car, same angle, same light.",
  intro:
    "No filters and no staged lighting. If the after shot needed a different lens to look good, it would not be an after shot.",
}
