import polishImage from "../imports/1440WLight/cc6887674c6325a2a57f60e235ccc8654e9fb30c.png";
import foamImage from "../imports/1440WLight/a22e277837b0a41985dd651f2b83233b102b1a98.png";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { about } from "../content/about";

export default function About() {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section aria-labelledby="about-heading" className="kp-section kp-about" id="about" ref={revealRef}>
      <div className="kp-section__inner">
        <div className="kp-about__head">
          <div className="kp-reveal">
            <SectionEyebrow>{about.eyebrow}</SectionEyebrow>
          </div>
          {/* Twenty absolutely-positioned overflow-clip word boxes in the frame, which is why
              this heading rendered as the fragment "Automo  delivers…". One element instead. */}
          <h2 className="kp-section__title kp-reveal" id="about-heading" style={revealDelay(1)}>
            {about.heading}
          </h2>
        </div>

        <div className="kp-about__grid">
          <figure className="kp-about__media kp-reveal" style={revealDelay(2)}>
            <img alt="Our team polishing a black car door with a rotary buffer" src={polishImage} />
          </figure>
          {/* The frame stacked two near-identical copies of this photo behind a Figma mask. */}
          <figure className="kp-about__media kp-reveal" style={revealDelay(3)}>
            <img alt="A car covered in snow foam during a wash" src={foamImage} />
          </figure>

          <div className="kp-about__card kp-reveal" style={revealDelay(4)}>
            <div className="kp-about__body">
              {about.body.map((line) => <p key={line}>{line}</p>)}
            </div>
            <dl className="kp-about__stats">
              {about.stats.map((stat) => (
                <div className="kp-about__stat" key={stat.label}>
                  <dt>{stat.figure}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
