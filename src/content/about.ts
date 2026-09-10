// About copy. The template said Gomobil "delivers professional mobile car wash and detailing
// services directly to your location, providing exceptional vehicle care with unmatched
// convenience" — a sentence that could sit unchanged on any competitor's site, which is the
// one test docs/content-brief.md says every line has to pass.
//
// The two stat slots are brief §3b. We have detailed zero cars commercially, so the template's
// "850+ vehicles serviced" is not available to us and neither is anything like it. These two
// numbers are true on the day the site goes live and stay true: the deposit is $50 and fully
// refundable with 24+ hours notice, and Kunj absorbs the whole Stripe cost so the card fee
// passed to the customer is zero.

import { media } from "./media"

export const about = {
  eyebrow: "About KP Automobil",
  heading: "One van, one detailer, and a price you agree to before we arrive.",
  body: [
    "KP Automobil is Kunj — one person, one van, working in your driveway. Home, work or an apartment garage: the car stays where it is.",
    "Send two interior and two exterior photos and the price comes back on screen. No callback, no walkaround, no new number once we pull up.",
  ],
  stats: [
    { amount: 50, figure: "$50", label: "Refundable deposit" },
    { amount: undefined, figure: "0%", label: "Card fee" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
//  /about/
//
//  docs/information-architecture.pdf sources this page from a 20-minute interview with Kunj that
//  has not happened, and says in as many words: do not write this generically. So this file holds
//  only what is already established and attributable, and the beats that need the interview sit
//  below with `body: null`. A null chapter does not render — the page is shorter and true rather
//  than longer and invented. Filling one in is a one-line edit here and nothing else changes.
//
//  The one genuinely personal thing we do have is Kunj's own sentence about why the business exists,
//  quoted verbatim from docs/content-brief.md §2. It is his, it is on the record, and it is the
//  reason every other decision on this site went the way it did — so it leads the page.
// ─────────────────────────────────────────────────────────────────────────────────────────────────

export type StoryChapter = {
  number: string
  title: string
  /** Null until Kunj has answered it. Null chapters are not rendered. */
  body: string | null
}

export type KitItem = {
  name: string
  detail: string
  image: string
  imageAlt: string
  /** The package or add-on on the price list this exists for. Nothing rides along for the photo. */
  where: string
}

export const aboutPage = {
  anchors: [
    { href: "#story", label: "The story" },
    { href: "#pricing", label: "How we price" },
    { href: "#kit", label: "In the van" },
  ],

  quote: {
    label: "Kunj, owner",
    text: "I hate it when I have to wait for a quote because I fear someone will give me a call and try to upsell me.",
    /** Not a slogan — the design brief this whole site was built from. */
    note: "That sentence is the reason the price is on screen instead of on a callback.",
  },

  story: {
    eyebrow: "The story",
    heading: "One person, and no layer between you and him.",
    intro:
      "There is no franchise behind this, no dispatcher, and no crew that rotates. The person who reads your photos and sets your price is the person who turns up and does the work.",
    chapters: [
      {
        number: "01",
        title: "Owner-operated, and that is the product",
        body: "Kunj quotes the car, details the car, and hands it back. Nothing is passed to a subcontractor and nobody arrives who has not seen your photos. If something on the day is not right, you are talking to the person who can fix it.",
      },
      {
        number: "02",
        title: "Mobile, because moving the car is your problem otherwise",
        body: "Home, office lot, apartment garage — the van brings its own water and power, so the car stays where you parked it. No drop-off window, no ride home, no day without a car.",
      },
      {
        number: "03",
        title: "Priced from photographs, before anyone commits",
        body: "Two interior shots and two exterior shots turn a range into a number. If those photos hide something the car turns out to need, the revised figure is in writing before any work starts — and you can say no to it.",
      },
      {
        number: "04",
        title: "No upsell, because there is nothing to upsell",
        body: "Every extra is a named line item with its own price, added by you and removable by you. There is no commission, no package to talk you up to, and nothing discussed at the door without a written number first.",
      },
      // ── Needs the interview. Rendered only once there is a real answer. ────────────────────────
      { number: "05", title: "Where Kunj learned to detail", body: null },
      { number: "06", title: "The car that started it", body: null },
      { number: "07", title: "Why this town", body: null },
    ] satisfies StoryChapter[],
  },

  pricing: {
    eyebrow: "How we price",
    heading: "Three inputs, and you can see all of them.",
    intro:
      "Nothing about the number is discretionary. The same car, the same package and the same photos produce the same price whoever is asking.",
    steps: [
      {
        title: "How much car there is",
        body: "Sedan, SUV, three-row or truck. Footprint sets the band — a coupe, an electric car and a full-size luxury sedan all price as a sedan, because the badge is not what takes the time.",
      },
      {
        title: "Which package the car needs",
        body: "Interior Refresh, Full Detail or Deep Restoration. Every price for every size is published, so the package you pick is a decision you make with the numbers in front of you.",
      },
      {
        title: "What the photos show",
        body: "Pet hair, set-in stains, a smell, a car that has gone years. Each one adds a named line you can see and take off — never a quiet multiplier on the total.",
      },
    ],
    /**
     * The null rule, said out loud on the page. src/lib/quote.ts returns total: null the moment any
     * line is unpriced, and this is the sentence that explains what the visitor is looking at.
     */
    nullRule: {
      title: "When we do not have a price yet",
      body: "Some extras are not priced from a photograph, and those say so instead of guessing. The total goes to “priced from your photos” rather than quietly leaving a line out and correcting you later.",
    },
  },

  kit: {
    eyebrow: "In the van",
    heading: "Everything here maps to a line you can book.",
    intro:
      "Nothing rides along to make the van look serious. Each item below exists because a package on the price list needs it.",
    items: [
      {
        name: "Water and power",
        detail: "A tank and a supply on board, so a driveway, a lot bay or an apartment space is a complete workspace.",
        image: media.vanWaterPower,
        imageAlt: "Water tank, power station and hose setup inside a mobile detailing van",
        where: "Every job",
      },
      {
        name: "Hot-water extractor",
        detail: "Shampoo goes into the carpet and comes back out with the dirt in it, rather than drying back into the weave.",
        image: media.addonHeavyStainTreatment,
        imageAlt: "Hot-water extractor lifting soil from a fabric car seat",
        where: "Deep Restoration",
      },
      {
        name: "Steam",
        detail: "Vents, seams, seat rails and the places a cloth cannot reach without taking something apart.",
        image: media.steamCleaningInterior,
        imageAlt: "Steam cleaner working through a car dashboard air vent",
        where: "Deep Restoration",
      },
      {
        name: "Clay bar",
        detail: "Bonded contamination pulled off the clearcoat so wax or coating has clean paint to sit on.",
        image: media.clayBarDecontamination,
        imageAlt: "Clay bar being worked across a wet dark car hood",
        where: "Deep Restoration",
      },
      {
        name: "Wax and hand applicators",
        detail: "Applied in sections and buffed by hand. A machine is quicker and leaves more behind.",
        image: media.addonHandWax,
        imageAlt: "Hand wax being applied to a red car fender",
        where: "Hand Wax",
      },
      {
        name: "Ceramic coating kit",
        detail: "Laid on decontaminated paint one panel at a time and levelled before it flashes.",
        image: media.addonCeramicCoating,
        imageAlt: "Ceramic coating being applied to a glossy car hood",
        where: "Ceramic Coating",
      },
    ] satisfies KitItem[],
  },

  stats: {
    eyebrow: "True on day one",
    heading: "Two numbers, and neither one is a review.",
    /**
     * Content brief §3b. We have detailed zero cars commercially, so "850+ vehicles" is not
     * available and neither is anything shaped like it. These two are true the day the site goes
     * live and stay true.
     */
    note: "KP Automobil is new. There is no vehicle count and no star rating on this page because there is no honest one to print.",
  },
}
