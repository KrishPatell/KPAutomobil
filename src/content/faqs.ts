// The eight questions the FAQ answers, in the order they appear.
//
// Every answer is a confirmed fact from docs/content-brief.md — the $50 refundable deposit, the
// 24-hour notice window, no card fees, the four photos, and the promise that the price does not
// change once we are standing at the car. Nothing here is a turnaround time or a guarantee that
// nobody has agreed to.

export type Faq = { question: string; answer: string };

export const faq = {
  eyebrow: "FAQ",
  heading: "Questions, answered plainly.",
  intro:
    "The eight things people ask before booking a detailer they have not used before. If yours is not here, the quote form has a notes box.",
};

// Order matches the imported FAQ rows (document order: left column, then right).
export const faqs: Faq[] = [
  {
    question: "Do I need to provide water or electricity?",
    answer:
      "No. KP Automobil arrives fully equipped with everything needed to complete your service.",
  },
  {
    question: "Where can you detail my car?",
    answer:
      "At your home, work, or apartment — as long as there is safe access to the vehicle, your car stays where it is.",
  },
  {
    question: "Will the price change on arrival?",
    answer:
      "No. We do not raise the price once we are standing at your car. If extra work is needed, you receive a revised price in writing before we arrive.",
  },
  {
    question: "How does the photo quote work?",
    answer:
      "Send two interior and two exterior photos. We review them and send back a real price before you pay the deposit.",
  },
  {
    question: "Is the $50 deposit refundable?",
    answer:
      "Yes. Cancel with at least 24 hours notice and your $50 deposit is fully refundable. It also comes off your final bill.",
  },
  {
    question: "Do you charge card fees?",
    answer:
      "No. Card, Zelle, or cash — the price is the same. KP Automobil absorbs the card processing cost.",
  },
  {
    question: "What photos do I need?",
    answer:
      "Two interior and two exterior shots. They help us give you a price you can actually rely on.",
  },
  {
    question: "Is ceramic coating worth it?",
    answer:
      "Ceramic coating adds a longer-lasting protective layer, enhanced gloss, and makes routine upkeep easier.",
  },
];
