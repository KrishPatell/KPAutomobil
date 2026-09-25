# KP Automobil

Marketing site for KP Automobil — owner-operated mobile car detailing. React 19 + Vite 8 +
Tailwind CSS v4.

This started as a Figma Make export and is now maintained here, in Claude Code and Codex. There is
no Figma sync any more: **everything under `src/` is ours to edit**, including the generated frames.
Do not treat `src/imports/` as read-only.

## Running it

Nothing is running by default — start it yourself.

```
pnpm install
pnpm dev      # Vite on $PORT, default 8443
pnpm build    # must stay clean
pnpm format   # oxfmt
```

Toolchain is pinned in `.mise.toml` (node 22, pnpm 10.34) but newer versions work fine.

## The one thing to understand first

The whole page is a generated Figma frame: `src/imports/1440WLight/index.tsx` is a single
1440×11521px absolutely-positioned canvas built from 725 flat, machine-named functions
(`Container37`, `Section9`, …). `src/imports/390WLight/` is a second full export of the same page
for mobile.

`src/App.tsx` currently renders one frame and then **rewrites it in the DOM at runtime** — matching
copy by exact string, hiding chrome by `data-name`, and wiring the tabs, FAQ and before/after
slider by querying Tailwind class fragments like `[class*="text-[24.5px]"]`.

**This is being dismantled, not extended.** It is brittle in a way that fails silently: Figma splits
wrapped text across separate `<p>` elements, so whole-element string matching misses any headline or
quote that wrapped. That is how a fabricated customer review stayed on screen.

If you are tempted to add another `querySelector` into the generated markup — extract the section
into a real component instead.

### Section map

`Main` holds 11 absolutely-positioned sections. The generated names are arbitrary; this is the real
top-to-bottom order.

| Order | Generated name | Section |
|---|---|---|
| 1 | `Section9` | Hero |
| 2 | `Section10` | About + stat blocks |
| 3 | `Section` | Services (5 package tabs) |
| 4 | `Section1` | Vehicles We Service |
| 5 | `Section2` | How It Works |
| 6 | `Section3` | Before & After slider |
| 7 | `Section4` | Recent Work |
| 8 | `Section5` | Why Choose |
| 9 | — | **Extracted** → `src/sections/Commitments.tsx` |
| 10 | `Section7` | FAQ |
| 11 | `Section8` | Book Now form |

`Banner` (template nav), `Section11` (promo strip) and `Footer` are hidden at runtime and replaced
by `src/components/KpNav.tsx` and the `SiteFooter` in `App.tsx`.

Extracted sections carry an `id` and are linked from the nav by anchor (`#promise`). Sections still
in the generated frame have no ids, so `scrollToLabel` in `App.tsx` falls back to matching their
heading text — convert one more link to an anchor with each extraction.

There is no testimonials section. The slot it occupied now holds **commitments** — see below.

## Where things go

- **Copy and data live in `src/content/`, never inline in JSX.** One file per concern.
  `src/content/site.ts` holds brand, phone, email, city and region — the `[CITY]`/`[PHONE]`
  placeholders resolve from there, so there is exactly one place to fill in when they're confirmed.
- Extracted sections go in `src/sections/`, one file per section, real props and real handlers.
- Shared UI (nav, footer, booking dialog) goes in `src/components/`.
- `src/imports/` shrinks as sections are extracted. It should end up holding only shared primitives
  (icon components, SVG path data) and the PNGs.
- `src/index.css` holds fonts, bespoke styling, and the responsive scaling rules.

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
- `pnpm build` must stay clean before you call anything done.
- Before finishing UI work, check the page in a browser at 1920 / 1440 / 1024 / 768 / 390. The
  extraction work is only safe if it is visually invisible.
