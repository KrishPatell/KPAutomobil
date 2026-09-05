// The deposit seam.
//
// KP takes a refundable deposit to hold a slot. There are no Stripe keys yet, so `takeDeposit`
// returns `unavailable` and the deposit step says the slot is requested rather than held. It does
// not render a card field: collecting card details into a form that goes nowhere would be the
// worst possible version of this.
//
// When Stripe exists, this function creates the PaymentIntent and returns its client secret, and
// the step swaps its note for the payment element. Nothing else needs to move.

import { site } from "../content/site";

export type DepositResult =
  | { status: "unavailable"; reason: string }
  | { status: "ready"; clientSecret: string };

export const depositAmount = site.deposit;

export async function takeDeposit(): Promise<DepositResult> {
  return {
    status: "unavailable",
    reason: "Card payments are not switched on yet, so nothing is charged at this step.",
  };
}
