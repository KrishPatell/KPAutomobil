import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { bodyStyles, sizes, vehicles, type SizeId } from "../content/vehicles";

type VehiclesProps = {
  /** Opens the quote with this vehicle size already answered. */
  onSelectSize: (size: SizeId) => void;
};

/** Four pips, the first `filled` of them lit. A footprint read at a glance, no invented numbers. */
function Footprint({ filled }: { filled: number }) {
  return (
    <span aria-hidden="true" className="kp-size__pips">
      {[1, 2, 3, 4].map((step) => (
        <span className={step <= filled ? "kp-size__pip kp-size__pip--on" : "kp-size__pip"} key={step} />
      ))}
    </span>
  );
}

export default function Vehicles({ onSelectSize }: VehiclesProps) {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section aria-labelledby="vehicles-heading" className="kp-section kp-vehicles" id="vehicles" ref={revealRef}>
      <div className="kp-section__inner">
        <div className="kp-vehicles__head">
          <div className="kp-reveal">
            <SectionEyebrow>{vehicles.eyebrow}</SectionEyebrow>
          </div>
          <h2 className="kp-section__title kp-reveal" id="vehicles-heading" style={revealDelay(1)}>
            {vehicles.heading}
          </h2>
          <p className="kp-vehicles__intro kp-reveal" style={revealDelay(2)}>{vehicles.intro}</p>
        </div>

        {/* The frame's six tiles were plain divs with decorative labels — Sports Car, Electric
            Vehicle, Luxury Vehicle — none of which is a thing KP prices by. These four are the
            price tiers, and each one is a real button that answers step one of the quote. */}
        <ul className="kp-vehicles__sizes">
          {sizes.map((size, index) => (
            <li className="kp-reveal" key={size.id} style={revealDelay(index + 3)}>
              <button className="kp-size" onClick={() => onSelectSize(size.id)} type="button">
                <span className="kp-size__top">
                  <span className="kp-size__name">{size.name}</span>
                  <Footprint filled={size.scale} />
                </span>
                <span className="kp-size__fits">{size.fits}</span>
                <span className="kp-size__why">{size.why}</span>
                <span className="kp-size__examples">{size.examples}</span>
                <span className="kp-size__cta">
                  {vehicles.cardHint}
                  <span aria-hidden="true">→</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="kp-vehicles__rail-head kp-reveal" style={revealDelay(7)}>
          <h3>{vehicles.railLabel}</h3>
          <p>{vehicles.railNote}</p>
        </div>
        {/* Same scroll-snap mechanic as the package tabs, so the two rails behave alike. */}
        <ul className="kp-vehicles__rail kp-reveal" style={revealDelay(8)}>
          {bodyStyles.map((style) => (
            <li key={style.name}>
              <button className="kp-body" onClick={() => onSelectSize(style.size)} type="button">
                <img alt={style.imageAlt} className="kp-body__img" loading="lazy" src={style.image} />
                <span className="kp-body__name">{style.name}</span>
                <span className="kp-body__size">
                  {vehicles.pricedAs} {sizes.find((s) => s.id === style.size)?.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
