// The before/after slider.
//
// docs/content-brief.md §3g calls this "the strongest asset we have" and says it cannot launch
// empty — but the same brief says real photos only, and KP has detailed zero cars commercially,
// so there is nothing of Kunj's to put in it yet. This is the fourth "we have nothing yet"
// problem, and it gets the same answer the testimonials got: keep the section, do not claim what
// is not ours.
//
// So the pair below is the stock pair the export shipped with, flagged `reference: true`. That
// flag puts one plain line under the slider saying so, and it is the only thing standing between
// this section and the same lie the fabricated reviews told. When Kunj sends a real pair: add it
// to the front of `pairs` with `reference: false` and write the caption the brief asks for —
// vehicle, package, and the specific problem solved ("2016 Honda Pilot · Deep Restoration · two
// dogs, four years, never detailed"), never a generic label.
//
// `pairs` drives the carousel: the arrows and the counter only render once there are two, so the
// dead prev/next buttons in the export disappear until they mean something.

import imgBefore from "../imports/1440WLight/505593d73bde8af5bfbbd47b09c07cb19a8e5c0f.png";
import imgAfter from "../imports/1440WLight/169c3269761df8accf364e4f8c82b4270a13dd5e.png";

export type Pair = {
  id: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  /** Vehicle, package, and the problem actually solved. Never a generic label. */
  caption: string;
  /** True while this is a stock photo rather than one of Kunj's jobs. */
  reference: boolean;
};

export const pairs: Pair[] = [
  {
    id: "creta",
    before: imgBefore,
    after: imgAfter,
    beforeAlt: "A compact SUV caked in dried road mud, parked on wet gravel",
    afterAlt: "The same SUV washed clean, its blue paint and wheels visible again",
    caption: "Exterior wash and decontamination · a winter's worth of road film, one pass",
    reference: true,
  },
];

export const results = {
  eyebrow: "Before & After",
  heading: "Same car, same spot. Drag to see what comes off.",
  intro:
    "Two photos taken from one position, one detail apart. Nothing retouched, and no flattering angle on the second shot to make the first look worse than it was.",
  beforeLabel: "Before",
  afterLabel: "After",
  handleLabel: "Drag to compare before and after",
  referenceNote: "Stock reference pair. Kunj's own before-and-afters replace it as jobs come in.",
  prevLabel: "Previous comparison",
  nextLabel: "Next comparison",
};
