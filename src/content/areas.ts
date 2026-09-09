// /service-areas/ — where the van can actually work.
//
// Three things are unconfirmed, and every one of them is handled by omission rather than invention:
//
//   1. The coverage list and the radius. `site.towns` is empty and `site.serviceRadiusMiles` is
//      null, so the town list does not render and the ZIP checker answers with the one thing that
//      is true today — any travel fee is quoted with your price, before the deposit. Fill either
//      value in src/content/site.ts and both light up with no change to this file.
//   2. Whether office parks and apartment complexes need a permit. Kunj raised that question in
//      docs/information-architecture.pdf and nobody has answered it. So the on-site copy tells the
//      visitor to check with their building, which is true whichever way the answer goes, and
//      claims nothing about permits.
//   3. Weather and rescheduling. There is no confirmed policy, so there is no section about one.
//      Booking terms is where that lives once Kunj has decided it.

import { site } from "./site"

export const areasPage = {
  anchors: [
    { href: "#coverage", label: "Coverage" },
    { href: "#on-site", label: "On site" },
    { href: "#travel", label: "Travel" },
  ],

  coverage: {
    eyebrow: "Coverage",
    heading: `The van works out of ${site.city}.`,
    intro:
      "There is no shop and no bay to drive to, so the question is not where we are — it is how far the van goes and what it costs you if you are at the edge of that.",
    baseLabel: "Base",
    radiusLabel: "Radius",
    /** Shown while site.serviceRadiusMiles is null. Says what is unknown instead of rounding it. */
    radiusPending: "Not published yet",
    townsLabel: "Towns covered",
    driveLabel: "Drive time",
  },

  zip: {
    eyebrow: "Check an address",
    heading: "Put in a ZIP code.",
    label: "ZIP code",
    placeholder: "02116",
    action: "Check",
    invalid: "That needs to be five digits.",
    covered: {
      title: (town: string) => `${town} is covered.`,
      body: "Book it in the quote tool and pick a slot. No travel fee on this one.",
    },
    travel: {
      title: (town: string) => `${town} is just outside.`,
      body: "Still doable. A travel fee is quoted alongside your price, before the deposit — never added to the bill afterwards.",
    },
    outside: {
      title: "Not covered yet.",
      body: "The van does not get out this far today. Send a message anyway — the places people ask about are the places that get added.",
    },
    /**
     * The state the checker is actually in until Kunj confirms the coverage list. Answering
     * "you're covered" with no data behind it is the kind of claim this whole site exists to avoid.
     */
    unknown: {
      title: "The coverage list is not published yet.",
      body: `${site.city} is the base and the van travels out from there. Rather than draw a boundary nobody has agreed, the quote tool asks for your address and any travel fee comes back with your written price — before the deposit.`,
    },
  },

  onSite: {
    eyebrow: "On site",
    heading: "What the job needs from you.",
    intro:
      "Four things, and none of them is a hose. The whole list takes about a minute to sort out before we arrive.",
    needs: [
      {
        title: "A space the car can sit in",
        body: "Roughly a car length of clear room around it so the doors open and the machine can get round. A driveway, a lot bay, or a marked apartment space all work.",
      },
      {
        title: "The keys, or somebody who has them",
        body: "Doors, trunk and fuel flap all get opened. If you are not going to be there, tell us where the keys will be and we will work to that.",
      },
      {
        title: "The cabin emptied",
        body: "Anything personal out of the seats, the console and the trunk. A car that still has to be unpacked is one of the things that can move the price — if it does, the new figure comes to you in writing before any work starts.",
      },
      {
        title: "Permission, if your building wants it",
        body: "Some office parks and apartment complexes ask before a contractor works on site. Check with management first and we will fill in whatever they need.",
      },
    ],
    /** The inversion: the two things every other mobile detailer asks you for. */
    notNeeded: {
      title: "What we do not need",
      lines: [
        "Your water. The van carries its own tank.",
        "Your power. The van carries that too.",
        "Your time. You do not have to stand there while it happens.",
      ],
    },
  },

  travel: {
    eyebrow: "Travel",
    heading: "If you are outside the radius, you find out before you pay anything.",
    body: "A travel fee is a line on the quote like any other. It is quoted with the price, it is agreed before the deposit, and it does not appear on the bill afterwards. If it is not on your written quote, it is not owed.",
    points: [
      "Quoted with your price, not after it.",
      "Agreed before the deposit is taken.",
      "Never added at the door.",
    ],
  },
}
