// Turns a booking state into the line items the summary step renders.
//
// The whole function is built around one rule: a null price is not zero. If any cell the quote
// needs is unconfirmed, `total` is null and the summary says so instead of adding up the cells it
// happens to have. See src/content/pricing.ts.

import { addOnPrices, packagePrices } from "../content/pricing";
import type { SizeId } from "../content/vehicles";

export type QuoteLine = {
  label: string;
  /** Dollars, or null when this line has no confirmed price yet. */
  amount: number | null;
};

export type Quote = {
  lines: QuoteLine[];
  /** Sum of every line, or null if any single line is unpriced. */
  total: number | null;
};

export function quote(size: SizeId | null, service: string | null, addOns: string[]): Quote {
  const lines: QuoteLine[] = [];

  if (service) {
    lines.push({ label: service, amount: size ? (packagePrices[service]?.[size] ?? null) : null });
  }
  for (const addOn of addOns) {
    lines.push({ label: addOn, amount: size ? (addOnPrices[addOn]?.[size] ?? null) : null });
  }

  const unpriced = lines.some((line) => line.amount === null);
  const total = lines.length === 0 || unpriced
    ? null
    : lines.reduce((sum, line) => sum + (line.amount ?? 0), 0);

  return { lines, total };
}

export function money(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
