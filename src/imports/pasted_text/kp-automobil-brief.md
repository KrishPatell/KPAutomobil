# KP Automobil — Design-First Content Mapping Brief

**Paste this whole document into the model. Do not summarise it first.**

---

## 0. The one rule

**The design is fixed. The content bends to fit it.**

You are not designing a website. A design already exists, it has been approved, and your job is to fill it — the way a magazine art director hands a writer a laid-out page and says "this headline is two lines, forty characters each, go."

You do not propose new sections. You do not reorder sections. You do not suggest "a stronger approach would be." If our content genuinely cannot fill a slot, you say so explicitly and propose the closest thing that fits *the existing slot* — you never solve it by changing the layout.

The failure mode we are actively avoiding: a content brief written in a vacuum that a build agent then has to force into a real template, mangling both. That has already happened once. Content-first produced a spec nobody could build. This is content-*second*, and deliberately so.

---

## 1. The reference build

**https://gomobil.webflow.io/**

This is a Webflow template for a mobile car wash and detailing business. We like it as-is. Treat every layout decision in it as already settled and correct.

**Before you write a single word, go through the live site and inventory it.** Not a description — a slot map. For each section, record:

- Section name and order
- Every text slot in it: eyebrow, heading, subheading, body, labels, button text, captions, stat numbers, list items
- The approximate character count the design comfortably holds for each slot
- How many repeats a repeater section holds (how many service tabs, how many cards, how many table rows)
- Every image slot: aspect ratio, crop, and what kind of shot it needs
- What breaks if a slot runs long

That inventory is your first deliverable. Everything after depends on its accuracy, so read the actual rendered page rather than guessing from the screenshot.

### The sections, as we read them

Verify and correct this against the live site:

1. Announcement bar + navigation (dark)
2. Hero — full-bleed dark photography, location eyebrow, two-line H1, CTA, floating Google rating card
3. About / intro — light; large right-aligned statement paragraph, two-image composition, text card, two stat blocks
4. Services — dark; numbered vertical tab list on the left (01–05), detail panel on the right with service name, "Starting at $XX", booking CTA, image, and a two-column inclusions checklist
5. Vehicle types — light; grid of six vehicle illustrations with labels
6. How it works — split; dark image panel left with the section heading, three stacked numbered image-cards right
7. Before / after — dark; drag-to-reveal slider with arrows
8. Recent work — bento grid of vehicle images, each with a service label
9. Why choose us — comparison table, us vs. other car washes, feature rows with tick/cross
10. Testimonials — dark carousel of quote cards with name, role, avatar
11. FAQ — light; two-column accordion
12. Booking CTA — dark photographic background, multi-field form panel on the right
13. Footer — image panel left, link columns, contact block

---

## 2. The business you are filling it with

**KP Automobil** — kpautomobil.com. Mobile car detailing in the United States. Owner-operated: one person, one van, working in the customer's driveway. Owner is **Kunj**.

**Placeholders you may leave:** `[CITY]`, `[REGION]`, `[PHONE]`, prices, durations, town names. Never leave a placeholder for a *voice* decision — write the actual sentence.

### What the site has to do

Get a stranger from a cold Instagram ad into the instant quote flow and out the other side having paid a **$50 deposit**. Most traffic is mobile, arriving with about four seconds of patience.

### The positioning, in the owner's own words

> *"I hate it when I have to wait for a quote because I fear someone will give me a call and try to upsell me."*

That frustration is the whole brand. Competitors make you submit a form and wait for a callback. This one gives you a real price on screen in about sixty seconds. **The differentiator is pricing honesty, not detailing skill** — every detailer claims a good clean.

### Confirmed facts — do not contradict these

- **$50 deposit**, taken via Stripe at booking, comes off the final bill. Fully refundable with 24+ hours notice.
- **No card fees.** Kunj absorbs the full Stripe cost. Card, Zelle or cash — identical price. This is a claim, not fine print.
- **Photo-based pricing.** Customer uploads two interior and two exterior shots during booking. If heavy pet hair or set-in stains need extra work, the revised price arrives in writing *before* arrival. The promise: *"We never raise the price once we're standing at your car."*
- **Three packages:** Interior Refresh · Full Detail (most booked) · Deep Restoration
- **Add-ons:** pet hair removal, heavy stain treatment, odour treatment, engine bay, headlight restoration, trunk deep clean, ceramic coating, hand wax, and a personal-items surcharge when the car isn't emptied
- **Deep Restoration** includes carpet and seat shampoo with hot-water extraction, steam clean, leather conditioning
- Pricing scales by **vehicle size**: sedan, SUV, three-row, truck

### Voice

Plain, spoken, blunt. Short sentences. The brand's position is *we don't play games with your price* — so the copy earns that by being direct, not by claiming to be honest.

**Banned:** elevate · transform · seamless · premium experience · unlock · revolutionary · passion for perfection · we treat every car like our own · cutting-edge · your satisfaction is our priority.

Test every line: if it could sit unchanged on a competitor's site, rewrite it.

---

## 3. The conflicts — where our reality doesn't match the template

The template was built for an established business. Ours launches with nothing. **These are the hard problems, and how you handle them is the whole job.** Do not paper over them with invented numbers.

### 3a. The hero's Google rating card
Template shows a floating 4.9-star card with a review count. **We have zero reviews.** Options, ranked — argue for one:
- Replace the card's content with a different proof object that fits the same footprint and visual weight (e.g. the pricing promise, or "$50 holds your slot — fully refundable")
- Hide the card at launch, with a documented plan to restore it at five reviews

You may not invent a rating.

### 3b. The stat blocks (850+ vehicles / 100%)
Two stat slots in the About section. We have detailed zero cars commercially. Find two numbers that are **true on day one** and still carry weight. Think about what's genuinely quantifiable for a new business: response time, the refund window, the number of questions in the quote flow, hours in a Deep Restoration, the card fee passed to the customer (zero). Propose three pairs and recommend one.

### 3c. The testimonials carousel
No customers, no quotes, no avatars. This is the hardest slot. Two routes:
- **Repurpose the slot within its existing layout** — same carousel, same card shape, but the cards carry something real. A signed owner's note. The commitments we're making. The honest "we're new" statement.
- **Hide the section** until reviews exist.

Our position is that hiding it leaves a visible gap everyone can read, and that naming the newness is stronger for a brand built on not playing games. Make the case either way, but if you fill it, **every word must be true and attributable.**

### 3d. Five service tabs, three packages
The services section is built for five numbered items. We have three. Options:
- Run three tabs and confirm the layout holds
- Expand to five by promoting two add-ons to headline services (**Ceramic Coating** and **Hand Wax** are the natural candidates — both are real, both are priced separately)

Recommend one. If you expand, the two promoted items still need real inclusions lists and starting prices.

### 3e. The vehicle types grid — turn decoration into function
The template's six vehicle illustrations are decorative. **Ours shouldn't be.** We price by vehicle size, so this grid can become the first real touch of the quote logic — the moment a visitor understands pricing is calculated, not negotiated. Propose how the six slots map to our size classes, and what happens when one is clicked (deep-link into `/book/` with size preselected is the obvious answer — confirm it).

### 3f. The booking form at the bottom
Template has a static multi-field form. Ours is a multi-step quote flow at `/book/` with live price calculation, photo upload and Stripe deposit. Decide: does this section embed step one as a hook — year, make, model, then continue into the full flow — or is it a straight CTA panel? Recommend, and write the copy for whichever you pick.

### 3g. Before / after
This is the strongest asset we have and the template gives it a proper section. **It cannot launch empty.** Specify the minimum viable count, and what to do if Kunj delivers fewer. Captions must name the specific problem solved — `2016 Honda Pilot · Deep Restoration · two dogs, four years, never detailed` — never generic labels.

### 3h. Recent work bento grid
Same constraint: real photos only. Specify exactly how many images the grid needs, at what crops, and the shot list Kunj has to deliver.

---

## 4. What you deliver

### Deliverable 1 — Slot inventory
The audit from section 1. Table format. Section → slot → character budget → repeat count → what breaks if overrun.

### Deliverable 2 — Filled content map
Section by section, in template order, every slot filled with final copy. Format each as:

```
SECTION 04 — SERVICES
├─ Eyebrow          [12 char budget]  →  "Our Services"
├─ H2               [45 char, 2 lines] →  "…"
├─ Tab 01 label     [18 char]         →  "…"
├─ Tab 01 price     →  "Starting at $XXX"
├─ Tab 01 CTA       [12 char]         →  "…"
├─ Tab 01 checklist [8 items, 4 words each] → …
└─ Image            [4:3, dark, …]    →  [art direction]
```

Every slot accounted for. If a slot is intentionally left empty at launch, say so and say why.

### Deliverable 3 — Conflict resolutions
Each of 3a–3h, with your recommendation and the reasoning. One paragraph each. State the trade-off you're accepting.

### Deliverable 4 — Asset request list
The exact shot list for Kunj: how many photos, what subject, what crop, what aspect ratio, which slot each fills. He is shooting these himself on a phone, so specify things he can actually control — angle, time of day, framing consistency. This list is what unblocks the build.

### Deliverable 5 — Overflow risks
Any slot where our content is meaningfully longer or shorter than what the template holds, flagged for the build so it can be caught before it breaks in Webflow.

---

## 5. How you'll be judged

- Did every piece of copy get written to a real slot with a real character budget, or did you write prose and hope it fits?
- Did you resolve the four "we have nothing yet" problems honestly — no fake ratings, no invented stats, no fabricated testimonials?
- Does the pricing-honesty position come through, given you couldn't change a single layout?
- Would a Webflow builder be able to work straight from your output without asking a follow-up question?

---

## 6. Method

Do not restate this brief. Do not ask permission to start.

1. Audit the live template. Publish the slot inventory.
2. Flag the conflicts you found — including any we missed in section 3.
3. Then fill everything.

If a constraint here is genuinely wrong, argue against it with a reason. But the rule in section 0 is not up for negotiation: **the design is fixed.**