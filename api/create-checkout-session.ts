import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  CheckoutValidationError,
  createDepositCheckoutSession,
  getBookingDetails,
} from "./stripe-deposit"

function getAppOrigin() {
  const configuredUrl = process.env.APP_URL
  if (!configuredUrl) return null

  try {
    const url = new URL(configuredUrl)
    if (url.protocol !== "https:" && url.hostname !== "localhost") return null
    return url.origin
  } catch {
    return null
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST")
    return response.status(405).json({ error: "Method not allowed." })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return response.status(503).json({ error: "Payments are not configured." })
  }

  const origin = getAppOrigin()
  if (!origin) {
    return response.status(503).json({ error: "Payments are not configured." })
  }

  try {
    const session = await createDepositCheckoutSession({
      booking: getBookingDetails(request.body),
      origin,
      secretKey,
    })

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.")
    }

    return response.status(200).json({ url: session.url })
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return response.status(400).json({ error: error.message })
    }
    console.error("Unable to create Stripe Checkout session", error)
    return response
      .status(502)
      .json({ error: "Unable to start secure checkout." })
  }
}
