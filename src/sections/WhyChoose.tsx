import svgPaths from "../imports/1440WLight/svg-badzmtz89q";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { compare, rows } from "../content/compare";

/** Filled circle with a tick. The frame's own icon, kept. */
function Yes() {
  return (
    <svg aria-hidden="true" className="kp-compare-mark kp-compare-mark--yes" fill="none" height="21.59" viewBox="0 0 21.59 21.59" width="21.59">
      <path d={svgPaths.pf532500} fill="currentColor" />
    </svg>
  );
}

/** Filled circle with a cross. */
function No() {
  return (
    <svg aria-hidden="true" className="kp-compare-mark kp-compare-mark--no" fill="none" height="21.59" viewBox="0 0 21.59 21.59" width="21.59">
      <path d={svgPaths.p1a58ac00} fill="currentColor" />
    </svg>
  );
}

export default function WhyChoose() {
  const headRef = useReveal<HTMLDivElement>();
  const tableRef = useReveal<HTMLDivElement>();

  return (
    <section aria-labelledby="why-heading" className="kp-section kp-why" id="why">
      <div className="kp-why__head kp-reveal" ref={headRef}>
        <div className="kp-reveal">
          <SectionEyebrow>{compare.eyebrow}</SectionEyebrow>
        </div>
        <h2 className="kp-section__title kp-reveal" id="why-heading" style={revealDelay(1)}>
          {compare.heading}
        </h2>
        <p className="kp-why__intro kp-reveal" style={revealDelay(2)}>{compare.intro}</p>
      </div>

      {/* A real <table>. The frame drew this as three independent columns of floating text, which is
          why nothing lined up across a row and why a screen reader read eight virtues followed by
          sixteen unlabelled icons. */}
      <div className="kp-why__scroll kp-reveal" ref={tableRef}>
        <table className="kp-why__table">
          <caption className="kp-visually-hidden">
            {compare.heading}
          </caption>
          <thead>
            <tr>
              <th scope="col">{compare.featureLabel}</th>
              <th className="kp-why__col--kp" scope="col">{compare.kpLabel}</th>
              <th scope="col">{compare.othersLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr className="kp-reveal" key={row.feature} style={revealDelay(index, 45)}>
                <th scope="row">{row.feature}</th>
                <td className="kp-why__col--kp">
                  <span className="kp-why__cell"><Yes />{row.kp}</span>
                </td>
                <td>
                  <span className="kp-why__cell"><No />{row.others}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
