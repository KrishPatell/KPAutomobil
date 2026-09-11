// /gallery/ — "The work, unedited."
//
// Two sections, each making a different honest claim, and both of them constrained by what we
// actually have:
//
//   1. The before/after pairs are the same car, same angle, same light. The filter chips are built
//      from the categories that exist in src/content/results.ts, not from the four values the type
//      allows. Today that is Exterior and Stains, because those are the only pairs that were shot.
//      Hard-coding "Interior" and "Pet hair" would ship two chips that filter to nothing.
//   2. Every still is tagged with the package it belongs to, so a photograph cannot imply a
//      service that is not on the price list.
//
// The disclaimer below is on the page, not in a footnote: this is reference photography and none of
// it is Kunj's own work yet. See the note at the top of src/content/media.ts — when the real shots
// land they replace the right-hand side of those bindings and nothing in this file changes.

import { media } from "./media"
import type { ComparisonPair } from "./results"

export const categoryLabels: Record<ComparisonPair["category"], string> = {
  exterior: "Exterior",
  interior: "Interior",
  "pet-hair": "Pet hair",
  stains: "Stains",
}

export type Still = {
  image: string
  title: string
  caption: string
  /**
   * The package or add-on on the price list this frame belongs to, or the stage of the job where
   * no single package owns it. It is never a service you cannot book.
   */
  label: string
}

/**
 * Rendered as a masonry column flow, so each photograph keeps its own proportions. That is the
 * point of the page: a uniform crop is an edit, and this page claims not to edit.
 */
export const galleryStills: Still[] = [
  {
    image: media.dirtyBmwDriveway,
    title: "Before anything is touched",
    caption: "How the car looked when the van pulled up. Nothing moved, nothing tidied for the shot.",
    label: "Arrival",
  },
  {
    image: media.foamWash,
    title: "Foam over the panels",
    caption: "The layer that lifts road grit off the clearcoat before a mitt goes anywhere near it.",
    label: "Full Detail",
  },
  {
    image: media.workInterior,
    title: "Cabin reset",
    caption: "Dash, console, trim, door cards and mats, done in that order so nothing lands twice.",
    label: "Interior Refresh",
  },
  {
    image: media.deepRestoration,
    title: "Hot-water extraction",
    caption: "Shampoo worked into the carpet, then pulled back out with the dirt in it.",
    label: "Deep Restoration",
  },
  {
    image: media.bmwFinished,
    title: "Finished sedan",
    caption: "Paint, glass and wheels done, parked back where it started.",
    label: "Full Detail",
  },
  {
    image: media.handWax,
    title: "Wax, on by hand",
    caption: "Applied in sections and buffed off by hand. A machine is faster and leaves more behind.",
    label: "Hand Wax",
  },
  {
    image: media.workRestore,
    title: "Seats after the shampoo",
    caption: "Upholstery brought back as far as it goes. Some marks are permanent, and we say so first.",
    label: "Deep Restoration",
  },
  {
    image: media.ceramicCoating,
    title: "Ceramic, panel by panel",
    caption: "Laid on decontaminated paint and levelled before it flashes, one panel at a time.",
    label: "Ceramic Coating",
  },
  {
    image: media.porscheClean,
    title: "Finished coupe",
    caption: "Wet-weather film off the paint, the glass and the wheel faces.",
    label: "Full Detail",
  },
  {
    image: media.processArrive,
    title: "Working where the car already is",
    caption: "A driveway is the whole workshop. Water and power come out of the van.",
    label: "On site",
  },
  {
    image: media.suvClean,
    title: "Finished SUV",
    caption: "Pollen and brake dust cleared, lower panels and arches included.",
    label: "Full Detail",
  },
  {
    image: media.whiteSuv,
    title: "Done and handed back",
    caption: "The car does not move for any of this. It is finished in the space it was parked in.",
    label: "On site",
  },
]

export const gallery = {
  /**
   * On the page, not in the small print. The brand's whole position is that it does not play games,
   * and putting somebody else's work up as ours would be the first game.
   */
  disclaimer: {
    label: "About these photographs",
    lines: [
      "These are reference shots, not KP Automobil jobs.",
      "The business is new and has not built a portfolio yet. Passing another detailer's work off as ours would be the first thing on this site that was not true.",
      "Every frame here gets replaced with our own as the work comes in.",
    ],
  },

  compare: {
    eyebrow: "Before & after",
    heading: "Drag the handle. Nothing else moved.",
    intro:
      "Same car, same angle, same light. No filter, no second lens, no darker before shot. An after that needs help to look good is not an after.",
    filterLabel: "Show",
    allLabel: "All",
  },

  stills: {
    eyebrow: "Stills",
    heading: "What each package actually leaves behind.",
    intro:
      "Every frame carries the package it belongs to, so nothing on this page implies a service that is not on the price list. Uncropped, in whatever light the driveway had.",
    openLabel: "View larger",
    closeLabel: "Close",
    previousLabel: "Previous photograph",
    nextLabel: "Next photograph",
  },

  /** Renders only when site.instagram is set. A dead social link is worse than no social link. */
  instagram: {
    eyebrow: "More of it",
    heading: "The rest goes up the day it is finished.",
    body: "Before and after, same rules, no edit. If a job did not go well it goes up anyway.",
    cta: "Open Instagram",
  },
}
