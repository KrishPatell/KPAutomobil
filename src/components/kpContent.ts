// Real KP Automobil content used to drive the imported package tabs and FAQ
// accordion at runtime. No fabricated reviews, turnaround times, or statistics.
import imgInteriorRefresh from "../imports/1440WLight/2b131945f24866466367159fe580c38e0b007519.png"
import imgDeepRestoration from "../imports/1440WLight/cc6887674c6325a2a57f60e235ccc8654e9fb30c.png"
import imgFullDetail from "../imports/1440WLight/2c0b095cbd13138aaabd6eedbf692c1f026269a3.png"
import imgCeramic from "../imports/1440WLight/8f9b949be2c84db8c6782760daa08368225b5f25.png"
import imgHandWax from "../imports/1440WLight/5a05f90c4323f8eb1048b55a1bf1ff72916c246a.png"

export type Package = {
  title: string
  descLines: [string, string]
  image: string
  included: string[]
}

// Order matches the imported Tablist tabs (left → right).
export const packages: Package[] = [
  {
    title: "Interior Refresh",
    descLines: [
      "Perfect for routine upkeep and keeping your",
      "vehicle looking fresh between full details.",
    ],
    image: imgInteriorRefresh,
    included: [
      "Hand Wash",
      "Wheel & Tire Cleaning",
      "Exterior Drying",
      "Exterior Glass Cleaning",
      "Tire Dressing",
      "Door Jamb Wipe Down",
      "Quick Interior Vacuum",
    ],
  },
  {
    title: "Deep Restoration",
    descLines: [
      "For heavily soiled or long-neglected vehicles that",
      "need a thorough reset inside and out.",
    ],
    image: imgDeepRestoration,
    included: [
      "Full Interior Vacuum",
      "Stain & Spot Treatment",
      "Steam Clean",
      "Leather & Vinyl Conditioning",
      "Clay Bar Treatment",
      "Wheel Well Cleaning",
      "Streak-Free Glass",
    ],
  },
  {
    title: "Full Detail",
    descLines: [
      "A complete inside-and-out detail — the full reset",
      "for your everyday driver.",
    ],
    image: imgFullDetail,
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
    title: "Ceramic Coating",
    descLines: [
      "An add-on paint protection layer for longer-lasting",
      "gloss and easier upkeep.",
    ],
    image: imgCeramic,
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
    descLines: [
      "An add-on protective wax for a warm shine",
      "between full details.",
    ],
    image: imgHandWax,
    included: [
      "Hand Wash & Dry",
      "Wax Application",
      "Hand Buff",
      "Tire Dressing",
    ],
  },
]

export type Faq = { question: string answer: string }

// Order matches the imported FAQ rows (document order: left column, then right).
export const faqs: Faq[] = [
  {
    question: "Do I need to provide water or electricity?",
    answer:
      "No. KP Automobil arrives fully equipped with everything needed to complete your service.",
  },
  {
    question: "Where can you detail my car?",
    answer:
      "At your home, work, or apartment — as long as there is safe access to the vehicle, your car stays where it is.",
  },
  {
    question: "Will the price change on arrival?",
    answer:
      "No. We do not raise the price once we are standing at your car. If extra work is needed, you receive a revised price in writing before we arrive.",
  },
  {
    question: "How does the photo quote work?",
    answer:
      "Send two interior and two exterior photos. We review them and send back a real price before you pay the deposit.",
  },
  {
    question: "Is the $50 deposit refundable?",
    answer:
      "Yes. Cancel with at least 24 hours notice and your $50 deposit is fully refundable. It also comes off your final bill.",
  },
  {
    question: "Do you charge card fees?",
    answer:
      "No. Card, Zelle, or cash — the price is the same. KP Automobil absorbs the card processing cost.",
  },
  {
    question: "What photos do I need?",
    answer:
      "Two interior and two exterior shots. They help us give you a price you can actually rely on.",
  },
  {
    question: "Is ceramic coating worth it?",
    answer:
      "Ceramic coating adds a longer-lasting protective layer, enhanced gloss, and makes routine upkeep easier.",
  },
]
