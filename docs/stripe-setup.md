# Stripe deposit checkout

Every base service and selected add-on routes through the same Stripe Checkout flow for the existing $50 refundable deposit. The selected services appear in the Checkout description and Stripe metadata.
The browser never receives a secret Stripe key.

## Deployment setup

This project needs a platform that runs the `api/` directory as server functions, such as Vercel.
In the project's environment settings, add:

- `STRIPE_SECRET_KEY` — use either a test secret key with a matching test account, or a live secret key for production.
- `STRIPE_WEBHOOK_SECRET` — the signing secret for the endpoint below.
- `APP_URL` — the canonical HTTPS URL for the site, for example `https://kpautomobil.example`. Stripe only redirects to this configured origin.

Create a Stripe webhook that sends `checkout.session.completed` to:

`https://your-domain.example/api/stripe-webhook`

The handler verifies Stripe's signature before accepting an event. The payment is also checked server-side when Stripe redirects the customer back to the booking flow.

## Local testing

Copy `.env.example` to `.env.local`, add a newly generated `sk_test_…` key, then restart `pnpm dev`. Vite serves the same two local API routes as Vercel:

- `POST /api/create-checkout-session`
- `GET /api/checkout-session?session_id=…`

Use Stripe's published test card details only in test mode. The website uses Stripe-hosted Checkout, so a publishable key is not needed for this flow.

## Before accepting payments

- The provided secret key was exposed in chat. Rotate it in the Stripe Dashboard before using this integration.
- Do not combine a test secret key with a live publishable key. This hosted-Checkout implementation does not need a publishable key at all.
- The current site does not persist appointment requests or uploaded photos. The Checkout Session keeps basic contact and service metadata in Stripe, but an appointment backend is still required before treating a paid deposit as a confirmed booking.
