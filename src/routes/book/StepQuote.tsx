import KpButton from "../../components/KpButton";
import { bookFlow } from "../../content/bookFlow";
import { pricing } from "../../content/pricing";
import { sizes } from "../../content/vehicles";
import { money, quote } from "../../lib/quote";
import { PHOTO_SLOTS } from "../../lib/photos";
import type { StepProps } from "./BookFlow";

/**
 * Step 6. The summary — and the step where the pricing honesty either holds or does not.
 *
 * Every line renders its own price, and a line with no confirmed price says so. The total is only
 * a number when every single line has one; otherwise it is the sentence explaining when the real
 * number arrives. There is deliberately no "estimated" or "from" figure, because an estimate is
 * exactly the thing this business exists not to do.
 */
/** "Sat 6 Sep" — the ISO value the date input holds is not what anyone wants to read back. */
function readable(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function StepQuote({ state, next, goTo }: StepProps) {
  const result = quote(state.size, state.service, state.addOns);
  const sizeName = sizes.find((entry) => entry.id === state.size)?.name ?? "—";
  const photos = PHOTO_SLOTS.filter((slot) => state.photos[slot.id]).length;

  const rows: { label: string; value: string; step: Parameters<StepProps["goTo"]>[0] }[] = [
    { label: bookFlow.quote.vehicleLabel, value: sizeName, step: "size" },
    { label: bookFlow.quote.packageLabel, value: state.service ?? "—", step: "package" },
    {
      label: bookFlow.quote.addOnsLabel,
      value: state.addOns.length ? state.addOns.join(", ") : bookFlow.extras.none,
      step: "extras",
    },
    {
      label: bookFlow.quote.photosLabel,
      value: bookFlow.photos.counter(photos, PHOTO_SLOTS.length),
      step: "photos",
    },
    {
      label: bookFlow.quote.whenLabel,
      value: [readable(state.date), state.window].filter(Boolean).join(" · ") || "—",
      step: "contact",
    },
    {
      label: bookFlow.quote.contactLabel,
      value: [state.name, state.phone].filter(Boolean).join(" · ") || "—",
      step: "contact",
    },
  ];

  return (
    <section className="kp-step">
      <h1 className="kp-step__heading">{bookFlow.quote.heading}</h1>
      <p className="kp-step__lede">{bookFlow.quote.lede}</p>

      <dl className="kp-summary">
        {rows.map((row) => (
          <div className="kp-summary__row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
            <button onClick={() => goTo(row.step)} type="button">
              {bookFlow.quote.editLabel}
            </button>
          </div>
        ))}
      </dl>

      <div className="kp-total">
        <ul className="kp-total__lines">
          {result.lines.map((line) => (
            <li key={line.label}>
              <span>{line.label}</span>
              <b>{line.amount === null ? pricing.pendingTotal : money(line.amount)}</b>
            </li>
          ))}
        </ul>
        <p className="kp-total__figure">
          <span>{bookFlow.quote.totalLabel}</span>
          <b>{result.total === null ? pricing.pendingTotal : money(result.total)}</b>
        </p>
        {result.total === null && <p className="kp-total__note">{pricing.pendingNote}</p>}
      </div>

      <div className="kp-step__actions">
        <button className="kp-step__back" onClick={() => goTo("contact")} type="button">
          {bookFlow.back}
        </button>
        <KpButton onClick={next} size="md">
          {bookFlow.next}
        </KpButton>
      </div>
    </section>
  );
}
