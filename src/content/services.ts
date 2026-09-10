// The three packages, plus the two add-ons that are big enough to have their own panel.
//
// Prices are not in here — they live in pricing.ts, keyed by package name and size tier, because
// the same package costs four different amounts. `priceNote` is what shows wherever a number is
// not yet confirmed.

import { media } from "./media"

export type Package = {
  name: string
  description: string
  items: string[]
  image: string
  /** True for the two that are extras rather than standalone bookings. */
  addOn?: boolean
  /** URL slug, for /book/?package=<slug>. */
  slug: string
  /** One line for the finished-work grid on the homepage. Says what the result looks like. */
  showcaseNote?: string
}

export const packages: Package[] = [
  {
    name: "Interior Refresh",
    slug: "interior-refresh",
    description: "Inside only, for the everyday car that needs a proper reset.",
    showcaseNote: "Dash, console, trim, and mats reset.",
    image: media.workInterior,
    items: [
      "Full interior vacuum",
      "Dash, console & trim",
      "Door panels",
      "Interior glass",
      "Cup holders & storage",
      "Floor mats",
    ],
  },
  {
    name: "Full Detail",
    slug: "full-detail",
    description: "A complete inside-and-out clean for the full reset.",
    showcaseNote: "Washed by hand, wheels and glass done.",
    image: media.fullDetailPorsche,
    items: [
      "Hand wash & dry",
      "Interior deep vacuum",
      "Wheel & tire clean",
      "Interior & exterior glass",
      "Door jamb wipe down",
      "Tire dressing",
    ],
  },
  {
    name: "Deep Restoration",
    slug: "deep-restoration",
    description:
      "For heavy soil, stains, pet hair, or a car that has not been detailed in years.",
    showcaseNote: "Extraction, steam, and stain treatment.",
    image: media.deepRestoration,
    items: [
      "Carpet & seat shampoo",
      "Hot-water extraction",
      "Steam clean",
      "Stain treatment",
      "Leather conditioning",
      "Clay bar treatment",
      "Wheel wells",
      "Streak-free glass",
    ],
  },
  {
    name: "Ceramic Coating",
    slug: "ceramic-coating",
    description: "An add-on protective layer over clean paint. Priced after photos.",
    image: media.ceramicCoating,
    addOn: true,
    items: [
      "Paint decontamination",
      "Surface preparation",
      "Ceramic application",
      "Cure & buff",
      "Hydrophobic finish",
    ],
  },
  {
    name: "Hand Wax",
    slug: "hand-wax",
    description:
      "An add-on warm shine between full details, applied and buffed by hand.",
    image: media.handWax,
    addOn: true,
    items: ["Hand wash & dry", "Wax application", "Hand buff", "Tire dressing"],
  },
]

/**
 * The line items the quote tool can add on top of a package.
 *
 * The two with their own panel above (Ceramic Coating, Hand Wax) are repeated here so the /book/
 * extras step and the /services/ add-on grid read one list and cannot drift apart. `condition` ties
 * an add-on to the answer in the condition step that suggests it — see suggestAddOns() in
 * src/lib/quote.ts. A suggested add-on is pre-checked and always removable.
 */
export type AddOn = {
  name: string
  description: string
  image: string
  imageAlt: string
  /** Which condition answer pre-checks this. Undefined means it is never auto-suggested. */
  condition?: ConditionId
}

export type ConditionId = "pet-hair" | "stains" | "odour" | "long-gap"

export const addOns: AddOn[] = [
  {
    name: "Ceramic Coating",
    description: "A protective layer over clean paint, applied after the detail and left to cure.",
    image: media.addonCeramicCoating,
    imageAlt: "Ceramic coating being applied to a car hood with a suede applicator",
  },
  {
    name: "Hand Wax",
    description: "A warm shine applied and buffed by hand, for cars between full details.",
    image: media.addonHandWax,
    imageAlt: "Hand wax being applied to a red car fender with a foam pad",
  },
  {
    name: "Pet Hair Removal",
    description:
      "Hair worked out of carpet and upholstery by hand before the vacuum. Slow, and the reason a pet car takes longer.",
    image: media.addonPetHairRemoval,
    imageAlt: "Pet hair being vacuumed and brushed from a car's rear seats and carpet",
    condition: "pet-hair",
  },
  {
    name: "Heavy Stain Treatment",
    description: "Spot treatment and extraction on set-in spills, in the seats and the carpet.",
    image: media.addonHeavyStainTreatment,
    imageAlt: "Hot-water extractor lifting a stain from a fabric car seat",
    condition: "stains",
  },
  {
    name: "Odour Removal",
    description: "Source cleaning plus an ozone treatment, for smoke and for anything that soaked in.",
    image: media.addonOdourRemoval,
    imageAlt: "Ozone generator treating the interior of a car",
    condition: "odour",
  },
  {
    name: "Engine Bay",
    description: "A degrease and dress of the bay, avoiding the electronics.",
    image: media.addonEngineBay,
    imageAlt: "Soft brush detailing a car engine bay",
  },
  {
    name: "Headlight Restoration",
    description: "Sanding and polishing clouded lenses back to clear, then sealing them.",
    image: media.addonHeadlightRestoration,
    imageAlt: "Polisher restoring a cloudy car headlight lens",
  },
  {
    name: "Trunk Deep Clean",
    description: "The trunk or cargo area emptied, vacuumed and wiped down, spare-wheel well included.",
    image: media.addonTrunkDeepClean,
    imageAlt: "Vacuum and cloth cleaning the spare-wheel well in an SUV trunk",
    condition: "long-gap",
  },
]

/** The condition questions asked in step 3 of /book/. Honest answers cost less than surprises. */
export const conditions: { id: ConditionId; question: string; help: string }[] = [
  {
    id: "pet-hair",
    question: "Does a pet ride in the car?",
    help: "Hair works into the weave and has to come out by hand before anything else.",
  },
  {
    id: "stains",
    question: "Any spills or set-in stains?",
    help: "Coffee, food, anything that soaked into a seat or the carpet.",
  },
  {
    id: "odour",
    question: "Any smell you want gone?",
    help: "Smoke, damp, or something that was left in the car too long.",
  },
  {
    id: "long-gap",
    question: "Has it gone more than a year without a detail?",
    help: "Not a problem — it just changes how long the first one takes.",
  },
]

/** The three you can actually book on their own. */
export const bookablePackages = packages.filter((item) => !item.addOn)

export function packageBySlug(slug: string): Package | undefined {
  return packages.find((item) => item.slug === slug)
}

export const services = {
  eyebrow: "Services",
  heading: "Services designed around your vehicle.",
  intro:
    "Three packages and a short list of extras. Pick the one that matches the state the car is actually in — the quote tool prices it against your size and your photos.",
  includedLabel: "What is included",
  priceNote: "Priced from your photos, before you book",
}

/**
 * Copy for /services/.
 *
 * The honesty block is the part that matters. Every detailer's site says "no hidden fees"; this one
 * lists the four things that actually do change a price and commits to how you find out. It is only
 * worth having if it is specific, so keep it specific.
 */
export const servicesPage = {
  anchors: [
    { href: "#packages", label: "Packages" },
    { href: "#add-ons", label: "Add-ons" },
    { href: "#extras", label: "What costs extra" },
    { href: "#compare", label: "Compare" },
  ],

  packages: {
    eyebrow: "The three packages",
    heading: "Pick the one that matches the state the car is in.",
    intro:
      "Each package is priced by how much car there is, so the four sizes below are the whole price list. The number you pay is confirmed from your photos before the deposit — it does not move after that.",
  },

  addOns: {
    eyebrow: "Add-ons",
    heading: "Extras, priced as line items you can take off.",
    intro:
      "These go on top of a package. Some of them we can price from a photo and some we cannot yet — where a price is missing it says so rather than guessing low and correcting you later.",
  },

  extras: {
    eyebrow: "What costs extra",
    heading: "When the price changes — and how you will know first.",
    intro:
      "A quote is only useful if it holds. These are the four things that move a number, and in every case you see the new figure in writing before any work starts.",
    reasons: [
      {
        title: "The photos did not show it",
        body: "Ground-in pet hair, a spill under a seat, mould in a footwell. If the car turns out to need more than the photos showed, you get the revised price before we start — and you can say no.",
      },
      {
        title: "You added something on the day",
        body: "An extra add-on you decided on once we were there. It is quoted and agreed the same way, and it goes on the same written total.",
      },
      {
        title: "The vehicle is a size up",
        body: "A three-row that was booked as an SUV, say. The size band changes, the package does not, and the difference is the published one on this page.",
      },
      {
        title: "You are outside the radius",
        body: "A travel fee is quoted with the price, before the deposit, never added afterwards.",
      },
    ],
    promise: {
      title: "What does not change it",
      lines: [
        "Paying by card. There is no surcharge — the processing cost is absorbed.",
        "The job taking longer than expected. That is our estimate to get right, not your bill.",
        "Anything discussed at the door without a written number first.",
      ],
    },
  },

  compare: {
    eyebrow: "Compare",
    heading: "How this works against how it usually works.",
  },

  faq: {
    eyebrow: "Before you book",
    heading: "The questions the packages raise.",
  },
}
