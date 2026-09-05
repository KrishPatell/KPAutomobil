import { useRef, useState, type KeyboardEvent } from "react";
import svgPaths from "../imports/1440WLight/svg-badzmtz89q";
import KpButton from "../components/KpButton";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { packages, services } from "../content/services";

type ServicesProps = {
  /** Opens the booking dialog with this package already selected. */
  onBook: (packageTitle: string) => void;
};

/** The orange plus that marks every line of the inclusion list. */
function PlusIcon() {
  return (
    <svg aria-hidden="true" className="kp-services__plus" fill="none" height="14.39" viewBox="0 0 14.39 14.39" width="14.39">
      <path d={svgPaths.p21269f00} fill="#FD5303" />
    </svg>
  );
}

export default function Services({ onBook }: ServicesProps) {
  // The stuck highlight Kunj reported was structural: in the frame only tab 1 was a real
  // <button>, and it hardcoded its own dark background and orange text. The runtime patcher
  // toggled a class on all five, so removing it from tab 1 could not turn off a highlight that
  // was never conditional. One piece of state, and the class is derived from it.
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const revealRef = useReveal<HTMLElement>();
  const pkg = packages[active];

  function focusTab(index: number) {
    const next = (index + packages.length) % packages.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  // Arrow keys move between tabs, as a tablist is expected to. The list is vertical on desktop
  // and horizontal below 900px, so both axes are wired.
  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const step = keys[event.key];
    if (step) {
      event.preventDefault();
      focusTab(active + step);
      return;
    }
    if (event.key === "Home") { event.preventDefault(); focusTab(0); }
    if (event.key === "End") { event.preventDefault(); focusTab(packages.length - 1); }
  }

  return (
    <section aria-labelledby="services-heading" className="kp-section kp-services" id="services" ref={revealRef}>
      <div className="kp-section__inner">
        <header className="kp-services__head">
          <div className="kp-reveal"><SectionEyebrow>{services.eyebrow}</SectionEyebrow></div>
          {/* Five fixed-width overflow-clip word boxes in the frame ("Services" "Designed"
              "Around" "Your" "Vehicle."), each sized to Figma's cached metrics. One h2. */}
          <h2 className="kp-section__title kp-reveal" id="services-heading" style={revealDelay(1)}>
            {services.heading}
          </h2>
          <p className="kp-services__intro kp-reveal" style={revealDelay(2)}>{services.intro}</p>
        </header>

        <div className="kp-services__body kp-reveal" style={revealDelay(3)}>
          <div
            aria-label="Detailing packages"
            className="kp-services__tabs"
            onKeyDown={onTabKeyDown}
            role="tablist"
          >
            {packages.map((item, index) => (
              <button
                aria-controls="services-panel"
                aria-selected={index === active}
                className={`kp-tab${index === active ? " kp-tab--on" : ""}`}
                id={`services-tab-${index}`}
                key={item.title}
                onClick={() => setActive(index)}
                ref={(el) => { tabRefs.current[index] = el; }}
                role="tab"
                tabIndex={index === active ? 0 : -1}
                type="button"
              >
                <span className="kp-tab__num">{String(index + 1).padStart(2, "0")}</span>
                <span className="kp-tab__name">{item.title}</span>
                {item.addOn && <span className="kp-tab__badge">Add-on</span>}
              </button>
            ))}
          </div>

          {/* Keyed on the package so React remounts the panel and the swap animation restarts,
              which is what the old `void panel.offsetWidth` reflow hack was reaching for. */}
          <div
            aria-labelledby={`services-tab-${active}`}
            className="kp-services__panel"
            id="services-panel"
            key={pkg.title}
            role="tabpanel"
            tabIndex={0}
          >
            <div className="kp-services__top">
              <div className="kp-services__summary">
                <h3 className="kp-services__title">{pkg.title}</h3>
                <p className="kp-services__desc">{pkg.desc}</p>
                <p className="kp-services__price">
                  {pkg.price === null ? services.priceNote : `From $${pkg.price}`}
                </p>
                <KpButton onClick={() => onBook(pkg.title)} size="md">Book Now</KpButton>
              </div>
              <figure className="kp-services__media">
                <img alt={pkg.imageAlt} src={pkg.image} />
              </figure>
            </div>

            <div className="kp-services__included">
              <p className="kp-services__included-label">{services.includedLabel}</p>
              {/* One list that fills left to right. The frame froze it into two fixed 367px
                  columns of 4 and 3, so a four-item package like Hand Wax blanked the entire
                  right-hand column and left the price and CTA stranded at the bottom. */}
              <ul className="kp-services__list">
                {pkg.included.map((line) => (
                  <li key={line}><PlusIcon />{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
