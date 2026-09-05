import KpButton from "../../components/KpButton";
import { bookFlow } from "../../content/bookFlow";
import { sizes } from "../../content/vehicles";
import type { StepProps } from "./BookFlow";

/** Step 1. The same four tiers as the marketing page's Vehicles section, and the same wording. */
export default function StepSize({ state, set, next }: StepProps) {
  return (
    <section className="kp-step">
      <h1 className="kp-step__heading">{bookFlow.size.heading}</h1>
      <p className="kp-step__lede">{bookFlow.size.lede}</p>

      <ul className="kp-step__choices">
        {sizes.map((size) => (
          <li key={size.id}>
            <button
              aria-pressed={state.size === size.id}
              className={`kp-choice${state.size === size.id ? " is-on" : ""}`}
              onClick={() => set({ size: size.id })}
              type="button"
            >
              <b>{size.name}</b>
              <span>{size.fits}</span>
              <small>{size.examples}</small>
            </button>
          </li>
        ))}
      </ul>

      <div className="kp-step__actions">
        <KpButton disabled={!state.size} onClick={next} size="md">
          {bookFlow.next}
        </KpButton>
      </div>
    </section>
  );
}
