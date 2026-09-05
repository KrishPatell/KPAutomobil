import { useState } from "react";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { faq, faqs } from "../content/faqs";

function Row({ index, isOpen, onToggle }: { index: number; isOpen: boolean; onToggle: () => void }) {
  const revealRef = useReveal<HTMLDivElement>();
  const item = faqs[index];
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className={`kp-faq__row kp-reveal${isOpen ? " kp-faq__row--open" : ""}`} ref={revealRef} style={revealDelay(index, 40)}>
      <h3 className="kp-faq__q">
        <button
          aria-controls={panelId}
          aria-expanded={isOpen}
          className="kp-faq__button"
          id={buttonId}
          onClick={onToggle}
          type="button"
        >
          <span>{item.question}</span>
          <span aria-hidden="true" className="kp-faq__plus">+</span>
        </button>
      </h3>
      {/* grid-template-rows 0fr → 1fr, so the answer animates to its own height without anyone
          measuring scrollHeight. The runtime version set a pixel height on the row and went out of
          step with the text the moment a line wrapped differently. */}
      <div aria-labelledby={buttonId} className="kp-faq__panel" id={panelId} role="region">
        <div className="kp-faq__panel-inner">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  // One open row at a time, and it may be none — an accordion that cannot be fully closed hides
  // the next question behind an answer nobody asked for.
  const [open, setOpen] = useState<number | null>(0);
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section aria-labelledby="faq-heading" className="kp-section kp-faq" id="faq">
      <div className="kp-faq__grid">
        <div className="kp-faq__head kp-reveal" ref={headRef}>
          <div className="kp-reveal">
            <SectionEyebrow>{faq.eyebrow}</SectionEyebrow>
          </div>
          <h2 className="kp-section__title kp-reveal" id="faq-heading" style={revealDelay(1)}>
            {faq.heading}
          </h2>
          <p className="kp-faq__lede kp-reveal" style={revealDelay(2)}>{faq.intro}</p>
        </div>

        <div className="kp-faq__list">
          {faqs.map((item, index) => (
            <Row
              index={index}
              isOpen={open === index}
              key={item.question}
              onToggle={() => setOpen(open === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
