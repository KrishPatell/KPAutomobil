import { useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent } from "react";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { pairs, results } from "../content/results";

/** Arrow-key step, in percent of the frame. */
const STEP = 4;

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export default function Results() {
  const revealRef = useReveal<HTMLElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const [index, setIndex] = useState(0);

  const pair = pairs[index];
  const many = pairs.length > 1;

  function splitFrom(clientX: number) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    setSplit(clamp(((clientX - rect.left) / rect.width) * 100));
  }

  // Pointer capture rather than window listeners: the stage keeps receiving moves even when the
  // cursor leaves it mid-drag, and the browser cleans up for us if the gesture is cancelled.
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    splitFrom(event.clientX);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    splitFrom(event.clientX);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowLeft: -STEP, ArrowRight: STEP, Home: -100, End: 100 };
    const delta = keys[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    setSplit((current) => clamp(current + delta));
  }

  function step(direction: 1 | -1) {
    setIndex((current) => (current + direction + pairs.length) % pairs.length);
    setSplit(50);
  }

  return (
    <section aria-labelledby="results-heading" className="kp-section kp-results" id="results" ref={revealRef}>
      <div className="kp-section__inner">
        {/* One centred column. The frame stacked an eyebrow, a heading and a caption that each
            found their own left edge, which is what read as crooked. */}
        <div className="kp-results__head">
          <div className="kp-reveal">
            <SectionEyebrow>{results.eyebrow}</SectionEyebrow>
          </div>
          <h2 className="kp-section__title kp-reveal" id="results-heading" style={revealDelay(1)}>
            {results.heading}
          </h2>
          <p className="kp-results__intro kp-reveal" style={revealDelay(2)}>{results.intro}</p>
        </div>

        <figure className="kp-results__figure kp-reveal" style={revealDelay(3)}>
          <div
            className="kp-compare"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            ref={stageRef}
          >
            <img alt={pair.afterAlt} className="kp-compare__img" src={pair.after} />
            {/* clip-path, not a width on a wrapper: a narrowing wrapper would squash the image
                inside it, and this keeps both halves at the identical scale at every split. */}
            <img
              alt={pair.beforeAlt}
              className="kp-compare__img kp-compare__img--before"
              src={pair.before}
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            />

            <span className="kp-compare__tag kp-compare__tag--before" style={{ opacity: split < 14 ? 0 : 1 }}>
              {results.beforeLabel}
            </span>
            <span className="kp-compare__tag kp-compare__tag--after" style={{ opacity: split > 86 ? 0 : 1 }}>
              {results.afterLabel}
            </span>

            <div
              aria-label={results.handleLabel}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(split)}
              className="kp-compare__handle"
              onKeyDown={onKeyDown}
              role="slider"
              style={{ left: `${split}%` }}
              tabIndex={0}
            >
              <span aria-hidden="true">↔</span>
            </div>
          </div>

        </figure>

        {/* The export drew these arrows over a single slide and wired them to nothing. They come
            back the moment there is a second pair to move to. */}
        {many && (
          <div className="kp-results__controls">
            <button aria-label={results.prevLabel} className="kp-results__arrow" onClick={() => step(-1)} type="button">
              ‹
            </button>
            <span className="kp-results__count">
              {String(index + 1).padStart(2, "0")} / {String(pairs.length).padStart(2, "0")}
            </span>
            <button aria-label={results.nextLabel} className="kp-results__arrow" onClick={() => step(1)} type="button">
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
