import KpButton from "../../components/KpButton";
import { bookFlow } from "../../content/bookFlow";
import { packages } from "../../content/services";
import { addOnPrices } from "../../content/pricing";
import { money } from "../../lib/quote";
import type { StepProps } from "./BookFlow";

/** Step 3. Optional by design — the Continue button is never disabled here. */
export default function StepExtras({ state, set, next, goTo }: StepProps) {
  const extras = packages.filter((pkg) => pkg.addOn);

  function toggle(title: string) {
    set({
      addOns: state.addOns.includes(title)
        ? state.addOns.filter((entry) => entry !== title)
        : [...state.addOns, title],
    });
  }

  return (
    <section className="kp-step">
      <h1 className="kp-step__heading">{bookFlow.extras.heading}</h1>
      <p className="kp-step__lede">{bookFlow.extras.lede}</p>

      <ul className="kp-step__choices kp-step__choices--wide">
        {extras.map((pkg) => {
          const on = state.addOns.includes(pkg.title);
          const price = state.size ? addOnPrices[pkg.title]?.[state.size] : null;
          return (
            <li key={pkg.title}>
              <button
                aria-pressed={on}
                className={`kp-choice${on ? " is-on" : ""}`}
                onClick={() => toggle(pkg.title)}
                type="button"
              >
                <b>{pkg.title}</b>
                <span>{pkg.desc}</span>
                <em className="kp-choice__price">
                  {price === null ? bookFlow.package.unpriced : money(price)}
                </em>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="kp-step__actions">
        <button className="kp-step__back" onClick={() => goTo("package")} type="button">
          {bookFlow.back}
        </button>
        <KpButton onClick={next} size="md">
          {state.addOns.length === 0 ? bookFlow.extras.skip : bookFlow.next}
        </KpButton>
      </div>
    </section>
  );
}
