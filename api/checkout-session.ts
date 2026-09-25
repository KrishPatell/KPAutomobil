import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  CheckoutValidationError,
  getCheckoutPaymentStatus,
} from "./stripe-deposit"

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET")
    return response.status(405).json({ error: "Method not allowed." })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const sessionId = request.query.session_id
  if (!secretKey || typeof sessionId !== "string") {
    return response.status(400).json({ error: "Invalid checkout session." })
  }

  try {
    return response
      .status(200)
      .json(await getCheckoutPaymentStatus({ secretKey, sessionId }))
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return response.status(400).json({ error: error.message })
    }
    console.error("Unable to retrieve Stripe Checkout session", error)
    return response.status(502).json({ error: "Unable to verify payment." })
  }
}
