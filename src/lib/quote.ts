// Turns a booking state into the line items the summary renders.
//
// The whole module is built around one rule: **a null price is not zero.** If any cell the quote
// needs is unconfirmed, `total` is null and the summary says so instead of adding up the cells it
// happens to have. An under-total is a lie the customer only finds out about on the day, which is
// the exact failure this business is positioned against. See src/content/pricing.ts.

import { addOnPrices, packagePrices } from "../content/pricing"
import { addOns as addOnCatalogue } from "../content/services"
import type { ConditionId } from "../content/services"
import type { SizeId } from "../content/vehicles"

export type QuoteLine = {
  label: string
  /** Dollars, or null when this line has no confirmed price yet. */
  amount: number | null
  /** True for the package itself, false for an add-on. Drives the summary's grouping. */
  base: boolean
}

export type Quote = {
  lines: QuoteLine[]
  /** Sum of every line, or null if any single line is unpriced. */
  total: number | null
  /** True when at least one line is unpriced, so the UI can explain the missing total. */
  hasUnpriced: boolean
}

export function quote(size: SizeId | null, service: string | null, addOns: string[]): Quote {
  const lines: QuoteLine[] = []

  if (service) {
    lines.push({
      label: service,
      amount: size ? (packagePrices[service]?.[size] ?? null) : null,
      base: true,
    })
  }
  for (const addOn of addOns) {
    lines.push({
      label: addOn,
      amount: size ? (addOnPrices[addOn]?.[size] ?? null) : null,
      base: false,
    })
  }

  const hasUnpriced = lines.some((line) => line.amount === null)
  const total = lines.length === 0 || hasUnpriced
    ? null
    : lines.reduce((sum, line) => sum + (line.amount ?? 0), 0)

  return { lines, total, hasUnpriced }
}

/**
 * The add-ons a set of condition answers pre-checks.
 *
 * This is the answer to two IA requirements that look contradictory: the condition step has to move
 * the price "immediately and visibly", but add-ons must be "removable, never locked on". A hidden
 * multiplier satisfies the first and breaks the second — you cannot remove a number you cannot see.
 * A pre-checked, named, removable line item satisfies both, and it shows the customer exactly what
 * their honesty bought them rather than burying it in a rate.
 */
export function suggestAddOns(conditions: ConditionId[]): string[] {
  return addOnCatalogue
    .filter((addOn) => addOn.condition !== undefined && conditions.includes(addOn.condition))
    .map((addOn) => addOn.name)
}

/** Merges suggestions into a selection without clobbering anything the visitor already removed. */
export function applySuggestions(current: string[], suggested: string[]): string[] {
  const merged = [...current]
  for (const name of suggested) {
    if (!merged.includes(name)) merged.push(name)
  }
  // Keep catalogue order so the summary does not reshuffle as boxes are ticked.
  return addOnCatalogue.map((addOn) => addOn.name).filter((name) => merged.includes(name))
}

export function money(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`
}
