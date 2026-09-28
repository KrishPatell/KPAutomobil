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

export async function processStripeEvent(
  event: Stripe.Event,
  stripe: Pick<Stripe, "checkout">,
) {
  if (event.type !== "checkout.session.completed") return false

  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== "paid") return false

  await stripe.checkout.sessions.update(session.id, {
    metadata: {
      ...session.metadata,
      order_status: "paid",
      payment_confirmed_by: "stripe_webhook",
      webhook_event_id: event.id,
    },
  })
  return true
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST")
    return response
      .status(405)
      .json({ success: false, error: "Method not allowed." })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers["stripe-signature"]
  if (!secretKey || !webhookSecret || typeof signature !== "string") {
    return response
      .status(400)
      .json({ success: false, error: "Webhook is not configured." })
  }

  try {
    const stripe = new Stripe(secretKey)
    const event = stripe.webhooks.constructEvent(
      await rawBody(request),
      signature,
      webhookSecret,
    )

    await processStripeEvent(event, stripe)

    return response.status(200).json({ success: true, received: true })
  } catch (error) {
    console.error("Stripe webhook verification failed", error)
    return response
      .status(400)
      .json({ success: false, error: "Invalid webhook signature." })
  }
}
