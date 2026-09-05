import heroImage from "../imports/1440WLight/5a05f90c4323f8eb1048b55a1bf1ff72916c246a.png";
import KpButton from "../components/KpButton";
import useReveal, { revealDelay } from "../lib/useReveal";
import { hero } from "../content/hero";
import { serviceArea } from "../content/site";

type HeroProps = {
  /** Scrolls to the packages section. */
  onExplore: () => void;
};

export default function Hero({ onExplore }: HeroProps) {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section className="kp-hero" id="top" ref={revealRef} aria-label="KP Automobil">
      <img className="kp-hero__image" src={heroImage} alt="" aria-hidden="true" />
      {/* One wash instead of the two stacked overlays (0.4 over 0.75) that made the photo
          invisible, plus a gradient so the copy at the bottom still has something to sit on. */}
      <div className="kp-hero__wash" aria-hidden="true" />

      <div className="kp-hero__inner">
        <div className="kp-hero__copy">
          <p className="kp-hero__pill kp-reveal">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s7-5.24 7-12A7 7 0 1 0 5 9c0 6.76 7 12 7 12Z" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="9" r="2.35" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            {serviceArea}
          </p>
          <h1 className="kp-hero__headline kp-reveal" style={revealDelay(1)}>
            {hero.headline}
          </h1>
          <p className="kp-hero__subline kp-reveal" style={revealDelay(2)}>
            {hero.subline}
          </p>
          <div className="kp-hero__actions kp-reveal" style={revealDelay(3)}>
            <KpButton size="md" onClick={onExplore}>{hero.cta}</KpButton>
          </div>
        </div>

        <aside className="kp-hero__proof kp-reveal" style={revealDelay(4)}>
          <p className="kp-hero__proof-eyebrow">{hero.proof.eyebrow}</p>
          <div className="kp-hero__proof-body">
            <p className="kp-hero__proof-figure">
              {hero.proof.figure}<span>{hero.proof.figureUnit}</span>
            </p>
            <div className="kp-hero__proof-text">
              <b>{hero.proof.title}</b>
              <span>{hero.proof.detail}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
