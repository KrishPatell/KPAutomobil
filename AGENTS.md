# KP Automobil

Marketing site for KP Automobil — owner-operated mobile car detailing. React 19 + Vite 8 +
Tailwind CSS v4.

This started as a Figma Make export and is now maintained here, in Claude Code and Codex. There is
no Figma sync any more: **everything under `src/` is ours to edit.**

## Running it

Nothing is running by default — start it yourself.

```
pnpm install
pnpm dev      # Vite on $PORT, default 8443
pnpm build    # must stay clean
pnpm format   # oxfmt
```

Toolchain is pinned in `.mise.toml` (node 22, pnpm 10.34) but newer versions work fine.

## The two routes

`src/main.tsx` mounts a router with exactly two destinations:

| Route | What it is | Entry |
|---|---|---|
| `/` | The marketing page | `src/App.tsx` |
| `/book/:step` | The quote flow — **the product** | `src/routes/book/BookFlow.tsx` |

`/book/:step` is a real path, not a hash, so every step is shareable and the browser's Back button
works. That needs an SPA fallback wherever `dist/` is served — Vite's dev server and `vite preview`
do it already; a static host needs "rewrite everything to `/index.html`" or `/book/photos` 404s on
a hard refresh. `public/_redirects` covers Netlify-style hosts; other hosts need their own rule.

## How the marketing page is built

`src/App.tsx` renders twelve sections and a footer, in order. Each one is a real component in
`src/sections/` with its own copy in `src/content/`, its own markup, and its own handlers.

| Order | Section | File |
|---|---|---|
| 1 | Hero | `src/sections/Hero.tsx` |
| 2 | About | `src/sections/About.tsx` |
| 3 | Packages (tabs) | `src/sections/Services.tsx` |
| 4 | Vehicles we service | `src/sections/Vehicles.tsx` |
| 5 | How it works | `src/sections/Process.tsx` |
| 6 | Before & after | `src/sections/Results.tsx` |
| 7 | The work (rail) | `src/sections/Work.tsx` |
| 8 | Why choose (table) | `src/sections/WhyChoose.tsx` |
| 9 | Commitments (rail + dots) | `src/sections/Commitments.tsx` |
| 10 | FAQ (accordion) | `src/sections/Faq.tsx` |
| 11 | Book now (form) | `src/sections/Book.tsx` |
| 12 | Footer | `SiteFooter` in `src/App.tsx` |

Nav and footer links are anchors to section ids (`#services`, `#results`, `#promise`, `#faq`,
`#book`). Every CTA that starts a booking — nav, hero, package cards, vehicle tiles, process, work
rail, footer — goes to `/book`, and the ones that already know something about the visitor hand it
over in the query string (`/book?size=suv`, `/book?package=Full%20Detail`) rather than asking
again.

The `#book` section is the **fast path**, not a second form. It collects everything the flow needs
except the photos and the add-ons, writes it into the flow's own state, and drops the visitor at
`/book/photos`. There is one place a booking is completed and it is not the homepage — the page
briefly had two forms of different quality, and whoever clicked "Book Now" got the worse one.

## How the `/book/` flow is built

Seven steps, in `src/routes/book/`: **size → package → add-ons → four photos → contact → your price
→ deposit**. `BookFlow.tsx` is the shell and owns three things; each `Step*.tsx` owns one question.

| Concern | Where |
|---|---|
| Step list, state shape, persistence, the deep-link guard | `src/lib/bookingFlow.ts` |
| Line items and the total | `src/lib/quote.ts` |
| Photo validation, downscaled preview, `uploadPhotos()` | `src/lib/photos.ts` |
| `takeDeposit()` — the Stripe seam | `src/lib/payments.ts` |
| The price matrix | `src/content/pricing.ts` |
| Every string | `src/content/bookFlow.ts` |

Three rules the flow depends on:

- **A null price is not zero.** `src/content/pricing.ts` ships every cell as `null` because Kunj
  has not set prices. `quote()` returns a null total if *any* line is unpriced, and the summary
  says when the real number arrives instead of adding up the cells it happens to have. Do not
  invent a number, an "estimate", or a "from" figure to fill the gap.
- **You cannot deep-link past your answers.** `firstIncomplete()` bounces a jump to `/book/quote`
  back to whatever is actually unanswered. The `?size=` / `?package=` hand-off gets around it
  honestly, by filling the answer in before the guard runs.
- **Photo blobs are not persisted.** sessionStorage is a few megabytes and four phone photos are
  not, so only the 420px previews survive a reload. A slot with a thumbnail but no `File` renders
  as "attach again" rather than quietly uploading a thumbnail.

## What used to be here

This started as a Figma Make export: one 1440×11521px absolutely-positioned canvas of 725 flat
machine-named functions, a second full export for mobile, and an `App.tsx` that rewrote both in the
DOM at runtime — matching copy by exact string, hiding chrome by `data-name`, and wiring tabs and
sliders by querying Tailwind class fragments.

All of that is gone. It is worth knowing why, because the failure mode is the reason for the
content rules below: **Figma splits wrapped text across separate `<p>` elements**, so matching a
whole element's `textContent` silently missed any headline or quote that happened to wrap. That is
how a fabricated customer review survived a pass that was supposed to remove it.

Two consequences that still bind:

- **No new `querySelector` into markup you did not write.** If a section needs behaviour, it needs
  a component.
- **The page is responsive for real**, not a fixed canvas scaled with `zoom`. There is no mobile
  copy of anything; each section handles its own widths. Check work at 1920 / 1440 / 1024 / 768 /
  390 before calling it done.

`src/imports/1440WLight/` is now only the PNGs and `svg-badzmtz89q.ts` (shared SVG path data).
Four PNGs in there are no longer referenced by anything and can go whenever someone wants the
1.8 MB back.

## Not built yet

There is no backend, no inbox (`site.email` is still null), no file storage and no Stripe account,
so the last step records the request and says so rather than showing a fake confirmation. Three
functions are the entire seam, and nothing above them needs to change when they start working:

- `send()` in `src/lib/booking.ts` — POSTs the request. Returns `false` today.
- `uploadPhotos()` in `src/lib/photos.ts` — sends the four originals. Returns `false` today.
- `takeDeposit()` in `src/lib/payments.ts` — creates the PaymentIntent. Returns
  `{ status: "unavailable" }` today, and the step renders no card field, because collecting card
  details into a form that goes nowhere would be the worst possible version of this.

Prices land in `src/content/pricing.ts` — fill the cells, change nothing else.

`.figma/make/site.json` still carries `robots.index: false` (the Figma preview default). Flip it
at launch.

## Where things go

- **Copy and data live in `src/content/`, never inline in JSX.** One file per concern.
  `src/content/site.ts` holds brand, phone, email, city and region — the `[CITY]`/`[PHONE]`
  placeholders resolve from there, so there is exactly one place to fill in when they're confirmed.
- Extracted sections go in `src/sections/`, one file per section, real props and real handlers.
- Shared UI (nav, buttons, brand mark, section eyebrow) goes in `src/components/`.
- `src/imports/` holds only SVG path data and the PNGs now. Nothing there is generated code any more.
- The `/book/` flow lives in `src/routes/book/` — one file per step, plus the shell.
- `src/index.css` holds fonts and all styling, including the flow's. The flow reuses `.kp-field`
  and `.kp-btn` on purpose: it must not look like a different website from the one that sent the
  visitor into it.
- Shared logic lives in `src/lib/`: `useReveal` (one IntersectionObserver for every scroll reveal
  on the page), `bookingFlow`, `quote`, `photos`, `payments`, `booking`.

## Content rules — these are not style preferences

`docs/content-brief.md` is the contract. The short version:

- **Never invent a review, rating, star count, or statistic.** KP Automobil is new and has none.
  Every number and quote on the page must be true on day one and attributable.
- The old testimonials carousel is gone. `src/content/commitments.ts` replaces it, and it is named
  for what it holds so nobody drops a quote back into it. When real reviews exist they get their own
  file and their own section — they do not go in there.
- Prices are still TBC. Do not fill in a number that nobody confirmed.
  (`docs/mpg-detailing-price-list-reference.xlsx` is a *competitor's* list, kept for reference only —
  it is not KP's pricing.)
- The brand's whole position is pricing honesty: a real price on screen, no callback, no upsell,
  no card fees, no price change on arrival.
- Banned words: elevate · transform · seamless · premium experience · unlock · revolutionary ·
  passion for perfection · we treat every car like our own · cutting-edge · your satisfaction is our
  priority. If a line could sit unchanged on a competitor's site, rewrite it.

## Reference material

- `docs/content-brief.md` — the content contract, slot budgets, and the "we have nothing yet"
  conflict resolutions.
- `docs/information-architecture.pdf` — Blitz Studio's 8-page IA. The `/book/` instant-quote flow is
  the actual product; every other page feeds it. Not built yet.
- `docs/design-idea.pdf` — render of a later design iteration.
- `docs/kp11-logo.jpeg` — logo asset. Note it reads "KP11 Mobile Auto Spa"; the site brand is
  **KP Automobil**.

## Code quality

- Double quotes for strings containing apostrophes, or escape them. An unescaped apostrophe in a
  single-quoted string breaks the build.
- Default-export components.
- `pnpm build` and `npx tsc --noEmit` must both stay clean before you call anything done. They
  are clean right now, so any error you see is yours.
- **Do not run `pnpm format`.** oxfmt strips semicolons and rewrites every file it touches, which
  buries a one-line change in a thousand-line diff.
- Before finishing UI work, check the page in a browser at 1920 / 1440 / 1024 / 768 / 390.
