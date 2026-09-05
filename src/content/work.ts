// The work rail.
//
// The frame called this "Vehicles We've Recently Serviced." — which is the fifth "we have nothing
// yet" problem on this page, and the most direct lie of the lot: KP has detailed zero cars
// commercially, so there are no recently serviced vehicles and these five photos are stock. The
// testimonials got deleted, the before/after pair got a `reference` flag; this section gets the
// honest version of the same idea.
//
// So it is no longer a claim about past jobs. It is what each package actually looks like when it
// is done, one card per package, in the same order as src/content/services.ts — and one plain note
// under the rail saying the photography is reference until Kunj's own shots exist. Every card is a
// button: it opens the booking dialog with that package already chosen, which is the flow item 7
// asked for.
//
// When Kunj sends real job photos: swap `image`, set `reference: false`, and rewrite `note` as the
// vehicle and the problem actually solved ("2016 Honda Pilot · two dogs, four years, never
// detailed"), never a generic label.

import imgTesla from "../imports/1440WLight/858ac59c533de617e6ed18ec8031fc4a07c0835f.png";
import imgSilver from "../imports/1440WLight/f78d2e920428db1bee50f7f5e5e9b5a77fc99edb.png";
import imgBlue from "../imports/1440WLight/8f9b949be2c84db8c6782760daa08368225b5f25.png";
import imgInterior from "../imports/1440WLight/2c0b095cbd13138aaabd6eedbf692c1f026269a3.png";
import imgTint from "../imports/1440WLight/7111a7022af51d5c1a84349416e3cc5ca0666e7e.png";

export type WorkShot = {
  id: string;
  /** Must match a `title` in src/content/services.ts — it is what the card books. */
  packageTitle: string;
  /** The one thing this photo is showing. Not a restatement of the package name. */
  note: string;
  image: string;
  imageAlt: string;
  /** True while this is stock photography rather than one of Kunj's jobs. */
  reference: boolean;
};

export const shots: WorkShot[] = [
  {
    id: "interior-refresh",
    packageTitle: "Interior Refresh",
    note: "Dash, console and door cards wiped down; mats out and cleaned.",
    image: imgInterior,
    imageAlt: "A car interior showing the steering wheel, gear shift and centre console controls",
    reference: true,
  },
  {
    id: "full-detail",
    packageTitle: "Full Detail",
    note: "Washed by hand, wheels and tires done, glass clear inside and out.",
    image: imgTesla,
    imageAlt: "A black Tesla Model Y parked on wet pavement beside a white building",
    reference: true,
  },
  {
    id: "deep-restoration",
    packageTitle: "Deep Restoration",
    note: "Carpets and seats extracted, paint clayed — the reset for a car that has never had one.",
    image: imgSilver,
    imageAlt: "A silver sports car with gold rims parked on concrete",
    reference: true,
  },
  {
    id: "ceramic-coating",
    packageTitle: "Ceramic Coating",
    note: "A cured layer over clean paint. Water beads instead of sitting.",
    image: imgBlue,
    imageAlt: "The rear quarter of a dark blue sports car, tail light and wheel in high gloss",
    reference: true,
  },
  {
    id: "hand-wax",
    packageTitle: "Hand Wax",
    note: "Applied and buffed by hand, for the months between full details.",
    image: imgTint,
    imageAlt: "The side of a white car at sunset, gold alloy wheels and tinted windows",
    reference: true,
  },
];

export const work = {
  eyebrow: "The Work",
  heading: "What each package looks like when it is finished.",
  intro:
    "Five packages, five cards. Pick the one that matches the state your car is in and the quote opens with it already chosen.",
  cta: "Book this",
  referenceNote:
    "Reference photography. KP Automobil is new — Kunj's own job photos replace these as the work comes in.",
  prevLabel: "Scroll left",
  nextLabel: "Scroll right",
};
