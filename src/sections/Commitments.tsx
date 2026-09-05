import { useEffect, useRef, useState } from "react";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import {
  commitments,
  commitmentsControls,
  commitmentsEyebrow,
  commitmentsHeading,
  commitmentsIntro,
  type Commitment,
} from "../content/commitments";

const CARD_BACKGROUND =
  "linear-gradient(180deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 100%), linear-gradient(90deg, rgb(27, 27, 27) 0%, rgb(27, 27, 27) 100%)";

function CommitmentCard({ commitment, index }: { commitment: Commitment; index: number }) {
  const revealRef = useReveal<HTMLLIElement>();

  return (
    <li className="kp-promise__item kp-reveal" ref={revealRef} style={revealDelay(index, 60)}>
      <article className="kp-promise__card" style={{ backgroundImage: CARD_BACKGROUND }}>
        <p className="kp-promise__body">{commitment.body}</p>
        <footer className="kp-promise__meta">
          <p className="kp-promise__label">{commitment.label}</p>
          <p className="kp-promise__sub">{commitment.sublabel}</p>
        </footer>
      </article>
    </li>
  );
}

export default function Commitments() {
  const railRef = useRef<HTMLUListElement>(null);
  const headRef = useReveal<HTMLDivElement>();

  // Which card is nearest the left edge of the rail. Read off scroll position rather than kept as
  // the source of truth, so a swipe, a keyboard scroll and a dot click all agree.
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setAtStart(rail.scrollLeft <= 1);
      setAtEnd(rail.scrollLeft >= max - 1);
      const card = rail.querySelector<HTMLElement>(".kp-promise__item");
      const step = card ? card.getBoundingClientRect().width + 14.39 : 1;
      setActive(Math.min(commitments.length - 1, Math.round(rail.scrollLeft / step)));
    };

    sync();
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      rail.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  function scrollToCard(index: number) {
    const rail = railRef.current;
    const card = rail?.querySelectorAll<HTMLElement>(".kp-promise__item")[index];
    if (!rail || !card) return;
    rail.scrollTo({ left: card.offsetLeft - rail.offsetLeft, behavior: "smooth" });
  }

  return (
    <section aria-labelledby="commitments-heading" className="kp-section kp-promise" id="promise">
      <div className="kp-promise__head kp-reveal" ref={headRef}>
        <div className="kp-promise__intro">
          <div className="kp-reveal">
            <SectionEyebrow>{commitmentsEyebrow}</SectionEyebrow>
          </div>
          <h2 className="kp-section__title kp-reveal" id="commitments-heading" style={revealDelay(1)}>
            {commitmentsHeading}
          </h2>
          <p className="kp-promise__lede kp-reveal" style={revealDelay(2)}>{commitmentsIntro}</p>
        </div>
        <div className="kp-promise__controls kp-reveal" style={revealDelay(3)}>
          <button
            aria-label={commitmentsControls.prev}
            className="kp-promise__arrow"
            disabled={atStart}
            onClick={() => scrollToCard(Math.max(0, active - 1))}
            type="button"
          >
            ←
          </button>
          <button
            aria-label={commitmentsControls.next}
            className="kp-promise__arrow"
            disabled={atEnd}
            onClick={() => scrollToCard(Math.min(commitments.length - 1, active + 1))}
            type="button"
          >
            →
          </button>
        </div>
      </div>

      <ul className="kp-promise__rail" ref={railRef}>
        {commitments.map((commitment, index) => (
          <CommitmentCard commitment={commitment} index={index} key={commitment.label} />
        ))}
      </ul>

      <div className="kp-promise__dots">
        {commitments.map((commitment, index) => (
          <button
            aria-current={index === active}
            aria-label={commitmentsControls.goTo(index)}
            className={`kp-promise__dot${index === active ? " kp-promise__dot--on" : ""}`}
            key={commitment.label}
            onClick={() => scrollToCard(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
