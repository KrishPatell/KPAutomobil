import type { SizeId } from "./vehicles"

/** Dollar amounts used by both the browser quote UI and the server checkout validator. */
export type SizePrices = Record<SizeId, number | null>

const unpriced: SizePrices = {
  sedan: null,
  suv: null,
  "three-row": null,
  truck: null,
}

export const packagePrices: Record<string, SizePrices> = {
  "Interior Refresh": { sedan: 250, suv: 285, "three-row": 315, truck: 305 },
  "Full Detail": { sedan: 300, suv: 375, "three-row": 415, truck: 405 },
  "Deep Restoration": { sedan: 475, suv: 550, "three-row": 600, truck: 585 },
}

export const addOnPrices: Record<string, SizePrices> = {
  "Ceramic Coating": { sedan: 700, suv: 700, "three-row": 750, truck: 750 },
  "Machine Buffing": { sedan: 115, suv: 150, "three-row": 165, truck: 165 },
  "Pet Hair Removal": { ...unpriced },
  "Heavy Stain Treatment": { ...unpriced },
  "Odour Removal": { ...unpriced },
  "Engine Bay": { ...unpriced },
  "Headlight Restoration": { ...unpriced },
  "Trunk Deep Clean": { ...unpriced },
}
