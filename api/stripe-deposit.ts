import Stripe from "stripe"

export const depositAmountCents = 5_000

const maxValueLength = 500
const baseServices = ["Interior Refresh", "Full Detail", "Deep Restoration"]
const availableAddOns = ["Ceramic Coating", "Hand Wax"]

export type BookingDetails = {
  addOns?: unknown
  email?: unknown
  model?: unknown
  name?: unknown
  package?: unknown
  phone?: unknown
  vehicle?: unknown
}

export class CheckoutValidationError extends Error {}

function getString(value: unknown, maximum = maxValueLength) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : ""
}

export function getBookingDetails(body: unknown): BookingDetails {
  if (!body || typeof body !== "object") return {}
  const booking = (body as { booking?: unknown }).booking
  return booking && typeof booking === "object" ? booking as BookingDetails : {}
}

function getSelectedAddOns(addOns: unknown) {
  if (!Array.isArray(addOns)) return []

  return addOns
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, availableAddOns.length)
}

export async function createDepositCheckoutSession({
  booking,
  origin,
  secretKey,
}: {
  booking: BookingDetails
  origin: string
  secretKey: string
}) {
  const email = getString(booking.email, 254)
  const name = getString(booking.name)
  const vehicle = getString(booking.vehicle)
  const service = getString(booking.package)
  const model = getString(booking.model)
  const phone = getString(booking.phone)
  const selectedAddOns = getSelectedAddOns(booking.addOns)

  if (
    !email ||
    !name ||
    !vehicle ||
    !baseServices.includes(service) ||
    !model ||
    !phone ||
    selectedAddOns.some((addOn) => !availableAddOns.includes(addOn))
  ) {
    throw new CheckoutValidationError("Complete your booking details first.")
  }

  const stripe = new Stripe(secretKey)
  const addOns = selectedAddOns.join(", ")
  const selectedServices = [service, ...selectedAddOns].join(" + ")

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    submit_type: "book",
    billing_address_collection: "auto",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "KP Automobil refundable booking deposit",
            description: `For ${selectedServices}`,
          },
          unit_amount: depositAmountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      add_ons: addOns || "None",
      customer_name: name,
      phone,
      service,
      selected_services: selectedServices,
      vehicle: `${vehicle} · ${model}`,
    },
    success_url: `${origin}/book/deposit?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/book/deposit?payment=cancelled`,
  })
}

export async function getCheckoutPaymentStatus({
  secretKey,
  sessionId,
}: {
  secretKey: string
  sessionId: string
}) {
  if (!sessionId.startsWith("cs_")) {
    throw new CheckoutValidationError("Invalid checkout session.")
  }

  const stripe = new Stripe(secretKey)
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return { paid: session.payment_status === "paid" }
}
