// About copy. The template said Gomobil "delivers professional mobile car wash and detailing
// services directly to your location, providing exceptional vehicle care with unmatched
// convenience" — a sentence that could sit unchanged on any competitor's site, which is the
// one test docs/content-brief.md says every line has to pass.
//
// The two stat slots are brief §3b. We have detailed zero cars commercially, so the template's
// "850+ vehicles serviced" is not available to us and neither is anything like it. These two
// numbers are true on the day the site goes live and stay true: the deposit is $50 and fully
// refundable with 24+ hours notice, and Kunj absorbs the whole Stripe cost so the card fee
// passed to the customer is zero.

export const about = {
  eyebrow: "About KP Automobil",
  heading: "One van, one detailer, and a price you agree to before we arrive.",
  body: [
    "KP Automobil is Kunj — one person, one van, working in your driveway. Home, work or an apartment garage: the car stays where it is.",
    "Send two interior and two exterior photos and the price comes back on screen. No callback, no walkaround, no new number once we pull up.",
  ],
  stats: [
    { figure: "$50", label: "Refundable deposit" },
    { figure: "0%", label: "Card fee" },
  ],
};
