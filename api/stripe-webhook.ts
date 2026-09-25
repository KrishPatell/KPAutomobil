import type { VercelRequest, VercelResponse } from "@vercel/node"
import Stripe from "stripe"

export const config = {
  api: { bodyParser: false },
}

async function rawBody(request: VercelRequest) {
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
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
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers["stripe-signature"]
  if (!secretKey || !webhookSecret || typeof signature !== "string") {
    return response.status(400).json({ error: "Webhook is not configured." })
  }

  try {
    const stripe = new Stripe(secretKey)
    const event = stripe.webhooks.constructEvent(
      await rawBody(request),
      signature,
      webhookSecret,
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      // Add appointment fulfilment here once bookings are stored server-side.
      console.info("Stripe deposit paid", { checkoutSessionId: session.id })
    }

    return response.status(200).json({ received: true })
  } catch (error) {
    console.error("Stripe webhook verification failed", error)
    return response.status(400).json({ error: "Invalid webhook signature." })
  }
}
