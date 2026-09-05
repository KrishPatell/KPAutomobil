// The services section: five tabs, and what is behind each one.
//
// Two things here are deliberate and worth not "fixing" back:
//
// 1. **No prices.** docs/content-brief.md is explicit that nothing is confirmed, so every package
//    carries `price: null` and the panel renders `priceNote` instead. The template shipped
//    "Starting at $79", which was a made-up number for a business that has not set one.
// 2. **Five tabs for three packages.** Brief §3d: Interior Refresh, Full Detail and Deep
//    Restoration are the real packages; Ceramic Coating and Hand Wax are add-ons promoted to
//    headline slots because both are real and both are priced separately. `addOn` marks them so
//    the panel can say so rather than passing them off as full packages.
//
// The inclusion lists came over from the template with the wrong package: the first tab was
// "Express Wash" and kept its all-exterior checklist after it was renamed to Interior Refresh, so
// a package called Interior Refresh was advertising "Exterior Drying". They are ordinary
// detailing tasks, redistributed to the package whose name they match — **Kunj still needs to
// confirm the final list per package**, and the Deep Restoration entries are the ones the brief
// names outright (carpet and seat shampoo with hot-water extraction, steam, leather conditioning).

import imgInteriorRefresh from "../imports/1440WLight/2c0b095cbd13138aaabd6eedbf692c1f026269a3.png";
import imgFullDetail from "../imports/1440WLight/2b131945f24866466367159fe580c38e0b007519.png";
import imgDeepRestoration from "../imports/1440WLight/fb6138b1b853802e1ac2794f5e21bb84eb99643d.png";
import imgCeramic from "../imports/1440WLight/8f9b949be2c84db8c6782760daa08368225b5f25.png";
import imgHandWax from "../imports/1440WLight/858ac59c533de617e6ed18ec8031fc4a07c0835f.png";

export const services = {
  eyebrow: "Services",
  heading: "Three packages and two add-ons. That is the whole menu.",
  intro: "Pick the one that sounds closest. The price comes from your photos, not from a guess over the phone.",
  includedLabel: "What's included",
  /** Stands in for a price until Kunj sets one. Never replace this with a number nobody confirmed. */
  priceNote: "Priced from your photos, before you book",
};

export type Package = {
  title: string;
  desc: string;
  /** Alt text for the panel image. */
  imageAlt: string;
  image: string;
  /** Add-ons are sold alongside a package, not instead of one. Brief §3d. */
  addOn?: boolean;
  /** Confirmed price, in dollars. Null until Kunj sets one — see the note above. */
  price: number | null;
  included: string[];
};

// Order matches the brief: the three packages in escalating order, then the two add-ons.
export const packages: Package[] = [
  {
    title: "Interior Refresh",
    desc: "Inside only. For a car that gets used every day and just needs resetting.",
    image: imgInteriorRefresh,
    imageAlt: "The interior of a car, steering wheel and centre console",
    price: null,
    included: [
      "Full Interior Vacuum",
      "Dashboard & Console Wipe",
      "Door Panels & Trim",
      "Interior Glass",
      "Cup Holders & Storage",
      "Floor Mats Cleaned",
    ],
  },
  {
    title: "Full Detail",
    desc: "Inside and out in one visit. This is the one most people book.",
    image: imgFullDetail,
    imageAlt: "A gloved hand washing a car headlight with a soapy sponge",
    price: null,
    included: [
      "Hand Wash & Dry",
      "Interior Deep Vacuum",
      "Dashboard & Console Wipe",
      "Wheel & Tire Cleaning",
      "Interior & Exterior Glass",
      "Door Jamb Wipe Down",
      "Tire Dressing",
    ],
  },
  {
    title: "Deep Restoration",
    desc: "For a car that has never been detailed, or has not been for years.",
    image: imgDeepRestoration,
    imageAlt: "A car covered in snow foam during a wash",
    price: null,
    included: [
      "Carpet & Seat Shampoo",
      "Hot-Water Extraction",
      "Steam Clean",
      "Stain & Spot Treatment",
      "Leather & Vinyl Conditioning",
      "Clay Bar Treatment",
      "Wheel Well Cleaning",
      "Streak-Free Glass",
    ],
  },
  {
    title: "Ceramic Coating",
    desc: "An add-on. A protective layer over clean paint, so the shine lasts and dirt lets go easier.",
    image: imgCeramic,
    imageAlt: "The rear quarter of a dark blue car with a high-gloss finish",
    addOn: true,
    price: null,
    included: [
      "Paint Decontamination",
      "Surface Preparation",
      "Ceramic Application",
      "Cure & Buff",
      "Hydrophobic Finish",
      "Trim & Glass Coverage",
    ],
  },
  {
    title: "Hand Wax",
    desc: "An add-on. A warm shine between full details, applied and buffed by hand.",
    image: imgHandWax,
    imageAlt: "A glossy black car parked on wet pavement",
    addOn: true,
    price: null,
    included: ["Hand Wash & Dry", "Wax Application", "Hand Buff", "Tire Dressing"],
  },
];
