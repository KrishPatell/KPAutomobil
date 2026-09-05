import KpButton from "../components/KpButton";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { process, steps, type Step } from "../content/process";

type ProcessProps = {
  onStart: () => void;
};

/**
 * One card. It reveals itself rather than inheriting from the list, because the three cards span
 * roughly two screens — a single observer on the list would fire step 03 long before it is seen.
 */
function StepCard({ step }: { step: Step }) {
  const revealRef = useReveal<HTMLLIElement>();

  return (
    <li className="kp-step kp-reveal" ref={revealRef}>
      <div className="kp-step__shot">
        <img alt={step.imageAlt} loading="lazy" src={step.image} />
      </div>
      <div className="kp-step__body">
        <h3 className="kp-step__title">
          <span className="kp-step__n">{step.n}</span>
          <span className="kp-step__name">{step.name}</span>
        </h3>
        <p className="kp-step__text">{step.body}</p>
        <p className="kp-step__chip">{step.chip}</p>
      </div>
    </li>
  );
}

export default function Process({ onStart }: ProcessProps) {
  const panelRef = useReveal<HTMLDivElement>();

  return (
    <section aria-labelledby="process-heading" className="kp-process" id="process">
      <div className="kp-process__grid">
        {/* Sticky photo panel. The frame had this too and it is the best idea in the section, so
            it survives — only the fixed 900px height and the word-boxed heading go. */}
        <div className="kp-process__panel">
          <img alt={process.panelImageAlt} className="kp-process__panel-img" src={process.panelImage} />
          <div aria-hidden="true" className="kp-process__shade" />
          <div className="kp-process__panel-body kp-reveal" ref={panelRef}>
            <div className="kp-process__head">
              <div className="kp-reveal">
                <SectionEyebrow>{process.eyebrow}</SectionEyebrow>
              </div>
              <h2 className="kp-section__title kp-reveal" id="process-heading" style={revealDelay(1)}>
                {process.heading}
              </h2>
            </div>
            <div className="kp-process__foot">
              <p className="kp-process__intro kp-reveal" style={revealDelay(2)}>{process.intro}</p>
              <div className="kp-reveal" style={revealDelay(3)}>
                <KpButton onClick={onStart}>{process.cta}</KpButton>
              </div>
            </div>
          </div>
        </div>

        <ol className="kp-process__steps">
          {steps.map((step) => (
            <StepCard key={step.n} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}
