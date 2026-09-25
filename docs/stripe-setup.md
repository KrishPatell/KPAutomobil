# Stripe Checkout

Every completed booking request can open Stripe Checkout for the fixed $50 refundable booking deposit. The selected service, vehicle and add-ons are included in the Checkout description and metadata. The amount is resolved on the server from the shared payment configuration; the browser cannot choose or override it.
The browser never receives a secret Stripe key.

## Deployment setup

This project needs a platform that runs the `api/` directory as server functions, such as Vercel.
In the project's environment settings, add:

- `STRIPE_SECRET_KEY` — use either a test secret key with a matching test account, or a live secret key for production.
- `STRIPE_WEBHOOK_SECRET` — the signing secret for the endpoint below.
- `APP_URL` — the canonical HTTPS URL for the site, for example `https://kpautomobil.example`. Stripe only redirects to this configured origin.

Create a Stripe webhook that sends `checkout.session.completed` to:

`https://your-domain.example/api/stripe-webhook`

The handler verifies Stripe's signature before accepting an event and marks the Checkout Session metadata as paid. Stripe is the current persistent order record because this project has no application database. The success screen also retrieves the session server-side; it never trusts the redirect query alone.

## Local testing

Copy `.env.example` to `.env.local`, add a newly generated `sk_test_…` key, then restart `pnpm dev`. Vite serves the same two local API routes as Vercel:

- `POST /api/create-checkout-session`
- `GET /api/checkout-session?session_id=…`

Use Stripe's published test card details only in test mode. The website uses Stripe-hosted Checkout, so a publishable key is not needed for this flow.

## Before accepting payments

- The provided secret key was exposed in chat. Rotate it in the Stripe Dashboard before using this integration.
- Do not combine a test secret key with a live publishable key. This hosted-Checkout implementation does not need a publishable key at all.
- The current site does not persist appointment requests or uploaded photos. The Checkout Session keeps basic contact and service metadata in Stripe, but an appointment backend is still required before treating a paid deposit as a confirmed booking.
