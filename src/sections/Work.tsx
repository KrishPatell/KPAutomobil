import { useEffect, useRef, useState } from "react";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { shots, work, type WorkShot } from "../content/work";

type WorkProps = {
  /** Opens the booking dialog with this package already selected. */
  onBook: (packageTitle: string) => void;
};

function Card({ index, onBook, shot }: { index: number; onBook: (title: string) => void; shot: WorkShot }) {
  const revealRef = useReveal<HTMLLIElement>();

  return (
    <li className="kp-work__item kp-reveal" ref={revealRef} style={revealDelay(index, 60)}>
      <button className="kp-work__card" onClick={() => onBook(shot.packageTitle)} type="button">
        <span className="kp-work__shot">
          <img alt={shot.imageAlt} loading="lazy" src={shot.image} />
        </span>
        <span className="kp-work__bar">
          <span className="kp-work__meta">
            <span className="kp-work__name">{shot.packageTitle}</span>
            <span className="kp-work__note">{shot.note}</span>
          </span>
          <span aria-hidden="true" className="kp-work__go">{work.cta} →</span>
        </span>
      </button>
    </li>
  );
}

export default function Work({ onBook }: WorkProps) {
  const railRef = useRef<HTMLOListElement>(null);
  const headRef = useReveal<HTMLDivElement>();

  // Which arrows are live. Derived from the rail's own scroll position rather than an index,
  // because the rail is a real scroll container: a trackpad swipe moves it without going
  // through the buttons, and an index would drift out of step the first time that happened.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setAtStart(rail.scrollLeft <= 1);
      // 1px of slack: a fractional layout width leaves scrollLeft a hair short of max forever.
      setAtEnd(rail.scrollLeft >= max - 1);
    };

    sync();
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      rail.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  /** One card's worth of travel, measured off the first card so it survives any breakpoint. */
  function nudge(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".kp-work__item");
    const step = card ? card.getBoundingClientRect().width + 21.6 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  const anyReference = shots.some((shot) => shot.reference);

  return (
    <section aria-labelledby="work-heading" className="kp-section kp-work" id="work">
      <div className="kp-work__head kp-reveal" ref={headRef}>
        <div className="kp-work__intro">
          <div className="kp-reveal">
            <SectionEyebrow>{work.eyebrow}</SectionEyebrow>
          </div>
          <h2 className="kp-section__title kp-reveal" id="work-heading" style={revealDelay(1)}>
            {work.heading}
          </h2>
          <p className="kp-work__lede kp-reveal" style={revealDelay(2)}>{work.intro}</p>
        </div>
        <div className="kp-work__controls kp-reveal" style={revealDelay(3)}>
          <button
            aria-label={work.prevLabel}
            className="kp-work__arrow"
            disabled={atStart}
            onClick={() => nudge(-1)}
            type="button"
          >
            ←
          </button>
          <button
            aria-label={work.nextLabel}
            className="kp-work__arrow"
            disabled={atEnd}
            onClick={() => nudge(1)}
            type="button"
          >
            →
          </button>
        </div>
      </div>

      <ol className="kp-work__rail" ref={railRef}>
        {shots.map((shot, index) => (
          <Card index={index} key={shot.id} onBook={onBook} shot={shot} />
        ))}
      </ol>

      {anyReference && <p className="kp-work__reference">{work.referenceNote}</p>}
    </section>
  );
}
