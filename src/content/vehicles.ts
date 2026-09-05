// The vehicle grid, rebuilt around the one thing it can honestly say: KP prices by how much car
// there is. docs/content-brief.md §3e calls the template's six illustrations decorative and asks
// for them to carry the quote logic instead, and the confirmed facts list fixes the four size
// classes as sedan · SUV · three-row · truck.
//
// So the section is two halves. The four size cards ARE the price tiers, and clicking one starts
// the quote with that size already answered. The photo rail underneath is the six stock cutouts
// the export shipped with, each labelled with the size it prices as — which is the useful part,
// because four of the six are sedans. A coupe, an EV and a full-size luxury sedan all cost the
// same as a Camry here, and that is worth saying out loud on a site about pricing honesty.
//
// No photo in the size cards on purpose: the export has one SUV cutout and no three-row or
// minivan at all, so a photo per tier would have meant showing the same Range Rover twice.

import imgSedan from "../imports/1440WLight/06431bf30dc9a56e4642cf6a55939156197d37aa.png";
import imgSuv from "../imports/1440WLight/2deeea5f74e7f75c94ba2f5f0097e563fff8e707.png";
import imgTruck from "../imports/1440WLight/5940b3a4d7f316436a734e6e92aff896f62d6511.png";
import imgElectric from "../imports/1440WLight/7fa865e7fd869526c81f3f26770a2d81f6493244.png";
import imgSports from "../imports/1440WLight/89602c4911c0560d7d092acf4303f8963ccfa99f.png";
import imgLuxury from "../imports/1440WLight/3d084481844e7e828f35bc278519f60f1da333c2.png";

/** The four price tiers. Matches the vehicle-size select in the booking dialog. */
export type SizeId = "sedan" | "suv" | "three-row" | "truck";

export type VehicleSize = {
  id: SizeId;
  /** Label shown on the card, and the value handed to the quote flow. */
  name: string;
  /** What lands in this tier, in the words someone would use about their own car. */
  fits: string;
  /** Why it costs what it costs — surface area and time, not badge. */
  why: string;
  /** Body styles a visitor can match against. Examples of size, not of past jobs. */
  examples: string;
  /** 1-4. Fills that many of the four footprint pips on the card. */
  scale: 1 | 2 | 3 | 4;
};

export const sizes: VehicleSize[] = [
  {
    id: "sedan",
    name: "Sedan",
    fits: "Two rows, a trunk, four doors or two.",
    why: "The baseline. Every package price starts here.",
    examples: "Camry · Civic · Model 3 · 3 Series",
    scale: 1,
  },
  {
    id: "suv",
    name: "SUV",
    fits: "Two rows and a hatch. Crossovers and wagons count.",
    why: "More glass and more carpet than a sedan, so a little more time.",
    examples: "RAV4 · CR-V · Model Y · Grand Cherokee",
    scale: 2,
  },
  {
    id: "three-row",
    name: "Three-row",
    fits: "A third row, or a minivan with sliding doors.",
    why: "Third-row carpet and eight seats are most of the extra work.",
    examples: "Pilot · Telluride · Odyssey · Suburban",
    scale: 3,
  },
  {
    id: "truck",
    name: "Truck",
    fits: "Crew cab, extended cab, any bed length.",
    why: "Tall panels, big glass, and a bed that usually needs its own pass.",
    examples: "F-150 · Silverado · Tacoma · Ram 1500",
    scale: 4,
  },
];

export type BodyStyle = {
  name: string;
  /** The tier this body style is priced as. */
  size: SizeId;
  image: string;
  imageAlt: string;
};

export const bodyStyles: BodyStyle[] = [
  { name: "Sedan", size: "sedan", image: imgSedan, imageAlt: "A white four-door sedan, front three-quarter view" },
  { name: "Coupe", size: "sedan", image: imgSports, imageAlt: "A white two-door sports coupe, front three-quarter view" },
  { name: "Electric", size: "sedan", image: imgElectric, imageAlt: "A white electric sedan, front three-quarter view" },
  { name: "Luxury sedan", size: "sedan", image: imgLuxury, imageAlt: "A white full-size luxury sedan, front three-quarter view" },
  { name: "SUV", size: "suv", image: imgSuv, imageAlt: "A white mid-size SUV, front three-quarter view" },
  { name: "Pickup", size: "truck", image: imgTruck, imageAlt: "A white crew-cab pickup truck, front three-quarter view" },
];

export const vehicles = {
  eyebrow: "Vehicles We Service",
  heading: "Four sizes. Yours decides the price, and nothing else does.",
  intro:
    "Every package is priced by how much car there is. Pick your size and the quote opens with that answer already filled in.",
  cardHint: "Start here",
  railLabel: "Whatever is on the driveway",
  railNote:
    "A coupe, an electric car and a full-size luxury sedan all price as a sedan. Footprint decides, not the badge on the grille.",
  pricedAs: "Prices as",
};
