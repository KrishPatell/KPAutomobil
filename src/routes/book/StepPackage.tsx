import KpButton from "../../components/KpButton";
import { bookFlow } from "../../content/bookFlow";
import { packages } from "../../content/services";
import { packagePrices } from "../../content/pricing";
import { money } from "../../lib/quote";
import type { StepProps } from "./BookFlow";
import { STEPS } from "../../lib/bookingFlow";

/**
 * Step 2. Only the three real packages — Ceramic Coating and Hand Wax are add-ons and get their
 * own step, which is the distinction src/content/services.ts marks with `addOn`.
 */
export default function StepPackage({ state, set, next, goTo }: StepProps) {
  const choices = packages.filter((pkg) => !pkg.addOn);

  return (
    <section className="kp-step">
      <h1 className="kp-step__heading">{bookFlow.package.heading}</h1>
      <p className="kp-step__lede">{bookFlow.package.lede}</p>

      <ul className="kp-step__choices kp-step__choices--wide">
        {choices.map((pkg) => {
          const price = state.size ? packagePrices[pkg.title]?.[state.size] : null;
          return (
            <li key={pkg.title}>
              <button
                aria-pressed={state.service === pkg.title}
                className={`kp-choice${state.service === pkg.title ? " is-on" : ""}`}
                onClick={() => set({ service: pkg.title })}
                type="button"
              >
                <b>{pkg.title}</b>
                <span>{pkg.desc}</span>
                <em className="kp-choice__price">
                  {price === null ? bookFlow.package.unpriced : money(price)}
                </em>
                <small>{pkg.included.slice(0, 3).join(" · ")}</small>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="kp-step__actions">
        <button className="kp-step__back" onClick={() => goTo(STEPS[0].slug)} type="button">
          {bookFlow.back}
        </button>
        <KpButton disabled={!state.service} onClick={next} size="md">
          {bookFlow.next}
        </KpButton>
      </div>
    </section>
  );
}
