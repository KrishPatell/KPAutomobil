import Stripe from "stripe"
import { randomUUID } from "node:crypto"
import { paymentConfig } from "../src/content/paymentConfig"

type SizeId = "sedan" | "suv" | "three-row" | "truck"

const maxValueLength = 500
const baseServices = ["Interior Refresh", "Full Detail", "Deep Restoration"]
const availableAddOns = [
  "Ceramic Coating",
  "Machine Buffing",
  "Pet Hair Removal",
  "Heavy Stain Treatment",
  "Odour Removal",
  "Engine Bay",
  "Headlight Restoration",
  "Trunk Deep Clean",
]
const sizes: SizeId[] = ["sedan", "suv", "three-row", "truck"]

export type BookingDetails = {
  addOns?: unknown
  email?: unknown
  model?: unknown
  name?: unknown
  package?: unknown
  phone?: unknown
  size?: unknown
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

function isSize(value: string): value is SizeId {
  return sizes.includes(value as SizeId)
}

export function getCheckoutLineItems(
  service: string,
  selectedAddOns: string[],
  size: SizeId,
) {
  const selectedServices = [service, ...selectedAddOns].join(" + ")
  return [
    {
      price_data: {
        currency: paymentConfig.currency,
        product_data: {
          name: "KP Automobil refundable booking deposit",
          description: `${selectedServices} · ${size} vehicle`,
          metadata: { service_name: service, vehicle_size: size },
        },
        unit_amount: paymentConfig.depositAmountCents,
      },
      quantity: 1,
    },
  ]
}

export async function createCheckoutSession({
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
  const size = getString(booking.size)
  const selectedAddOns = getSelectedAddOns(booking.addOns)

  if (
    !name ||
    !vehicle ||
    !baseServices.includes(service) ||
    !phone ||
    !isSize(size) ||
    selectedAddOns.some((addOn) => !availableAddOns.includes(addOn))
  ) {
    throw new CheckoutValidationError("Complete your booking details first.")
  }

  const stripe = new Stripe(secretKey)
  const addOns = selectedAddOns.join(", ")
  const selectedServices = [service, ...selectedAddOns].join(" + ")
  const lineItems = getCheckoutLineItems(service, selectedAddOns, size)
  const orderId = randomUUID()

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email || undefined,
    submit_type: "pay",
    billing_address_collection: "auto",
    client_reference_id: orderId,
    line_items: lineItems,
    metadata: {
      add_ons: addOns || "None",
      customer_name: name,
      order_id: orderId,
      order_status: "checkout_created",
      phone,
      service,
      selected_services: selectedServices,
      vehicle: model ? `${vehicle} · ${model}` : vehicle,
      vehicle_size: size,
    },
    payment_intent_data: {
      metadata: { order_id: orderId, service, vehicle_size: size },
    },
    success_url: `${origin}/book/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/book/payment-cancelled`,
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
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  })
  return {
    amountTotal: session.amount_total,
    currency: session.currency,
    orderId: session.client_reference_id,
    paid: session.payment_status === "paid",
    products:
      session.line_items?.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amountTotal: item.amount_total,
      })) ?? [],
    status: session.status,
  }
}
