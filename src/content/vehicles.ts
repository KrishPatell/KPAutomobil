// Size tiers, and the body styles that map onto them.
//
// The insight worth keeping: a coupe, an electric car and a full-size luxury sedan all price as a
// sedan. Footprint decides, not the badge on the grille. That is why the booking flow asks for a
// body style rather than a year/make/model — it is one tap instead of three dropdowns, and it maps
// to the only thing that actually changes the price.

import { media } from "./media"

export type SizeId = "sedan" | "suv" | "three-row" | "truck"

export type Vehicle = {
  id: SizeId
  name: string
  image: string
  description: string
}

export type BodyStyle = {
  image: string
  name: string
  size: SizeId
  compact?: boolean
}

export const vehicles: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan",
    image: media.sedan,
    description: "Two rows, a trunk, four doors or two.",
  },
  {
    id: "suv",
    name: "SUV",
    image: media.suv,
    description: "Two rows and a hatch. Crossovers and wagons count.",
  },
  {
    id: "three-row",
    name: "Three-row",
    image: media.threeRowBooking,
    description: "A third row, or a minivan with sliding doors.",
  },
  {
    id: "truck",
    name: "Truck",
    image: media.truck,
    description: "Crew cab, extended cab, any bed length.",
  },
]

export const bodyStyles: BodyStyle[] = [
  { image: media.sedan, name: "Sedan", size: "sedan" },
  { image: media.coupe, name: "Coupe", size: "sedan" },
  { image: media.electric, name: "Electric", size: "sedan" },
  { image: media.luxury, name: "Luxury sedan", size: "sedan" },
  { image: media.suv, name: "SUV", size: "suv" },
  { image: media.threeRowCatalog, name: "Three-row SUV", size: "three-row" },
  { image: media.minivanCatalog, name: "Minivan", size: "three-row" },
  { image: media.truck, name: "Pickup", size: "truck", compact: true },
]

// The homepage uses the white catalogue cut-outs. The quote flow deliberately keeps its dark
// selection cards, so it receives its own image bindings instead of changing the shared grid.
export const quoteBodyStyles: BodyStyle[] = bodyStyles.map((style) => {
  if (style.name === "Three-row SUV") return { ...style, image: media.threeRowCatalogBlack }
  if (style.name === "Minivan") return { ...style, image: media.minivanCatalogBlack }
  return style
})

export const sizeLabels: Record<SizeId, string> = {
  sedan: "Sedan",
  suv: "SUV",
  "three-row": "Three-row",
  truck: "Truck",
}

export const sizeIds = vehicles.map((vehicle) => vehicle.id)

export function sizeFor(bodyStyleName: string): SizeId | null {
  return bodyStyles.find((style) => style.name === bodyStyleName)?.size ?? null
}
