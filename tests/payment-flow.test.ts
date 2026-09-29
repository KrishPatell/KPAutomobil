import assert from "node:assert/strict"
import { Readable } from "node:stream"
import test from "node:test"
import {
  bookableServices,
  CheckoutValidationError,
  createCheckoutSession,
  getCheckoutLineItems,
} from "../api/stripe-deposit"
import createCheckoutHandler from "../api/create-checkout-session"
import checkoutStatusHandler from "../api/checkout-session"
import webhookHandler, { processStripeEvent } from "../api/stripe-webhook"
import {
  bookingEmailFields,
  bookingEmailHtml,
  sendEmail,
} from "../api/_email.js"

const validBooking = {
  addOns: ["Pet Hair Removal"],
  address: "1 Main Street, Boylston, MA",
  email: "customer@example.com",
  model: "Model Y",
  name: "Test Customer",
  package: "Interior Refresh",
  phone: "+1 555 0100",
  size: "suv",
  vehicle: "Electric",
}

test("booking email reflects the booking flow rather than the old quote flow", () => {
  const payload = {
    ...validBooking,
    bodyStyle: validBooking.vehicle,
    conditions: ["Pet in car: No", "Set-in stains: Yes"],
    locationType: "Home",
    notes: "Park beside the garage",
    photoCount: 4,
    photoLabels: [
      "Front three-quarter",
      "Rear three-quarter",
      "Front cabin",
      "Rear seats or boot",
    ],
    payment: {
      deposit: "$50 refundable deposit",
      method: "Card (Visa or Mastercard)",
      mode: "Test mode",
      provider: "Stripe Checkout",
      status: "Awaiting checkout completion",
    },
    service: validBooking.package,
    termsAccepted: true,
  }
  const html = bookingEmailHtml(payload)
  const fields = Object.fromEntries(bookingEmailFields(payload))

  assert.match(html, /Booking request/)
  assert.match(html, /New booking request received\./)
  assert.match(html, /Customer, vehicle, and service details are below\./)
  assert.doesNotMatch(html, /A customer submitted/i)
  assert.doesNotMatch(html, /ready for a written price/i)
  assert.match(html, /table-layout:fixed/)
  assert.match(html, /4 of 4 attached/)
  assert.match(html, /Card \(Visa or Mastercard\)/)
  assert.match(html, /Awaiting checkout completion/)
  assert.equal(fields["Location type"], "Home")
  assert.equal(fields["Booking terms"], "Accepted")
  assert.equal(fields["Photo attachments"], "4 of 4 attached")
})

function responseRecorder() {
  const result: {
    body?: unknown
    headers: Record<string, string>
    status?: number
  } = {
    headers: {},
  }
  const response = {
    setHeader(name: string, value: string) {
      result.headers[name] = value
    },
    status(status: number) {
      result.status = status
      return response
    },
    json(body: unknown) {
      result.body = body
      return response
    },
  }
  return { response, result }
}

test("every displayed service gets its own server-authored $50 USD deposit", async () => {
  for (const service of bookableServices) {
    let params: any
    const stripeClient = {
      checkout: {
        sessions: {
          create: async (value: unknown) => {
            params = value
            return {
              id: "cs_test_123",
              url: "https://checkout.stripe.test/session",
            }
          },
        },
      },
    } as any
    await createCheckoutSession({
      booking: {
        ...validBooking,
        package: service,
        amount: 1,
        currency: "eur",
        quantity: 99,
      } as any,
      origin: "http://localhost:8443",
      secretKey: "sk_test_unused",
      stripeClient,
    })
    const price = params.line_items[0]
    assert.equal(
      price.price_data.product_data.name,
      `${service} — refundable booking deposit`,
    )
    assert.equal(price.price_data.unit_amount, 5000)
    assert.equal(price.price_data.currency, "usd")
    assert.equal(price.quantity, 1)
    assert.equal(params.metadata.service, service)
  }
})

test("invalid products, add-ons, sizes, and incomplete bookings are rejected", async () => {
  const invalid = [
    { package: "Fake Detail" },
    { addOns: ["Fake Add-on"] },
    { size: "limousine" },
    { email: "" },
  ]
  for (const change of invalid) {
    await assert.rejects(
      createCheckoutSession({
        booking: { ...validBooking, ...change },
        origin: "http://localhost:8443",
        secretKey: "unused",
        stripeClient: {} as any,
      }),
      CheckoutValidationError,
    )
  }
})

test("Stripe checkout failures propagate instead of reporting success", async () => {
  const stripeClient = {
    checkout: {
      sessions: {
        create: async () => {
          throw new Error("Stripe unavailable")
        },
      },
    },
  } as any
  await assert.rejects(
    createCheckoutSession({
      booking: validBooking,
      origin: "http://localhost:8443",
      secretKey: "unused",
      stripeClient,
    }),
    /Stripe unavailable/,
  )
})

test("line item contains selected service details", () => {
  const [item] = getCheckoutLineItems("Full Detail", ["Engine Bay"], "truck")
  assert.equal(
    item.price_data.product_data.description,
    "Full Detail + Engine Bay · truck vehicle",
  )
})

test("email success and provider failure are both truthful", async () => {
  const previousKey = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = "re_test"
  try {
    const sent = await sendEmail({
      client: {
        emails: {
          send: async () => ({ data: { id: "email_123" }, error: null }),
        },
      },
      fields: [["Name", "Test"]],
      fromAddress: "test@example.com",
      subject: "Test",
      toAddress: "owner@example.com",
    })
    assert.equal(sent, "email_123")
    await assert.rejects(
      sendEmail({
        client: {
          emails: {
            send: async () => ({
              data: null,
              error: { message: "Provider rejected message" },
            }),
          },
        },
        fields: [],
        fromAddress: "test@example.com",
        subject: "Test",
      }),
      /Provider rejected message/,
    )
  } finally {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = previousKey
  }
})

test("API routes return structured JSON for invalid methods and missing config", async () => {
  const saved = {
    key: process.env.STRIPE_SECRET_KEY,
    url: process.env.APP_URL,
    webhook: process.env.STRIPE_WEBHOOK_SECRET,
  }
  delete process.env.STRIPE_SECRET_KEY
  delete process.env.APP_URL
  delete process.env.STRIPE_WEBHOOK_SECRET
  try {
    for (const [handler, request, expected] of [
      [createCheckoutHandler, { method: "GET" }, 405],
      [checkoutStatusHandler, { method: "POST" }, 405],
      [webhookHandler, { method: "GET", headers: {} }, 405],
      [createCheckoutHandler, { method: "POST", body: {} }, 503],
      [
        webhookHandler,
        Object.assign(Readable.from([]), { method: "POST", headers: {} }),
        400,
      ],
    ] as const) {
      const { response, result } = responseRecorder()
      const callHandler: any = handler
      await callHandler(request, response)
      assert.equal(result.status, expected)
      assert.equal((result.body as any).success, false)
      assert.equal(typeof (result.body as any).error, "string")
    }
  } finally {
    if (saved.key) process.env.STRIPE_SECRET_KEY = saved.key
    if (saved.url) process.env.APP_URL = saved.url
    if (saved.webhook) process.env.STRIPE_WEBHOOK_SECRET = saved.webhook
  }
})

test("webhook signature failures return JSON and never confirm payment", async () => {
  const saved = {
    key: process.env.STRIPE_SECRET_KEY,
    webhook: process.env.STRIPE_WEBHOOK_SECRET,
  }
  process.env.STRIPE_SECRET_KEY = "sk_test_invalid_for_signature_only"
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test"
  try {
    const request = Object.assign(Readable.from([Buffer.from("{}")]), {
      method: "POST",
      headers: { "stripe-signature": "t=1,v1=invalid" },
    })
    const { response, result } = responseRecorder()
    const originalError = console.error
    console.error = () => undefined
    try {
      await webhookHandler(request as any, response as any)
    } finally {
      console.error = originalError
    }
    assert.equal(result.status, 400)
    assert.deepEqual(result.body, {
      success: false,
      error: "Invalid webhook signature.",
    })
  } finally {
    if (saved.key === undefined) delete process.env.STRIPE_SECRET_KEY
    else process.env.STRIPE_SECRET_KEY = saved.key
    if (saved.webhook === undefined) delete process.env.STRIPE_WEBHOOK_SECRET
    else process.env.STRIPE_WEBHOOK_SECRET = saved.webhook
  }
})

test("a paid Checkout event is marked paid by the webhook processor", async () => {
  let update: any
  const stripeClient = {
    checkout: {
      sessions: {
        update: async (id: string, value: unknown) => {
          update = { id, value }
        },
      },
    },
  } as any
  const processed = await processStripeEvent(
    {
      id: "evt_test_paid",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_paid",
          payment_status: "paid",
          metadata: { order_id: "order_1" },
        },
      },
    } as any,
    stripeClient,
  )
  assert.equal(processed, true)
  assert.equal(update.id, "cs_test_paid")
  assert.equal(update.value.metadata.order_status, "paid")
  assert.equal(update.value.metadata.payment_confirmed_by, "stripe_webhook")
})
