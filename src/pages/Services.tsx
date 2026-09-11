// /services/ — the full menu, with every price on the page.
//
// The homepage puts the three packages behind tabs, which is right for a summary and wrong here:
// this is the page somebody lands on to compare, so all three are open at once, in full-width rows
// that alternate the image side. Each row carries its own four-size price strip, because "from
// $250" is only half an answer if you drive a three-row.

import PageHead from "../components/PageHead"
import AnchorBar from "../components/AnchorBar"
import CtaBand from "../components/CtaBand"
import { ButtonLink, Eyebrow, Mark, Reveal, RollingPrice } from "../components/primitives"
import { pageCopy } from "../content/pages"
import { addOns, bookablePackages, servicesPage } from "../content/services"
import { addOnPrices, packagePrices, pricing } from "../content/pricing"
import { sizeIds, sizeLabels } from "../content/vehicles"
import type { SizeId } from "../content/vehicles"
import { rows as compareRows, compare } from "../content/compare"
import { serviceFaqs } from "../content/faqs"
import { site } from "../content/site"

/** The four-cell price strip under a package. A null cell says so rather than showing a zero. */
function PriceStrip({ prices }: { prices: Record<SizeId, number | null> }) {
  return (
    <dl className="price-strip">
      {sizeIds.map((size) => (
        <div className="price-strip__cell" key={size}>
          <dt>{sizeLabels[size]}</dt>
          <dd>
            {prices[size] === null ? (
              <span className="price-strip__pending">{pricing.pendingTotal}</span>
            ) : (
              <RollingPrice amount={prices[size] as number} />
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default function Services() {
  return (
    <>
      <PageHead
        eyebrow={pageCopy.services.eyebrow}
        heading={pageCopy.services.heading}
        standfirst={pageCopy.services.standfirst}
        title="Services & Pricing"
      >
        <AnchorBar anchors={servicesPage.anchors} />
      </PageHead>

      <section className="section pkg-section" id="packages">
        <div className="section-head">
          <Reveal>
            <Eyebrow>{servicesPage.packages.eyebrow}</Eyebrow>
          </Reveal>
          <div>
            <Reveal className="delay-1">
              <h2>{servicesPage.packages.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{servicesPage.packages.intro}</p>
            </Reveal>
          </div>
        </div>

        <div className="pkg-rows">
          {bookablePackages.map((item) => (
            <Reveal as="article" className="pkg-row" id={item.slug} key={item.slug}>
              <div className="pkg-row__media">
                <img alt={`${item.name} detailing`} src={item.image} />
              </div>

              <div className="pkg-row__body">
                <header>
                  <h3>{item.name}</h3>
                  <p className="pkg-row__desc">{item.description}</p>
                </header>

                <div className="pkg-row__included">
                  <span className="pkg-row__label">What is included</span>
                  <ul>
                    {item.items.map((line) => (
                      <li key={line}>
                        <i>+</i>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pkg-row__pricing">
                  <span className="pkg-row__label">Price by vehicle size</span>
                  <PriceStrip prices={packagePrices[item.name]} />
                  <p className="pkg-row__qualifier">{pricing.qualifier}</p>
                </div>

                <ButtonLink href={`/book/?package=${item.slug}`} variant="dark">
                  Book {item.name}
                </ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section addon-section" id="add-ons">
        <div className="section-head">
          <Reveal>
            <Eyebrow>{servicesPage.addOns.eyebrow}</Eyebrow>
          </Reveal>
          <div>
            <Reveal className="delay-1">
              <h2>{servicesPage.addOns.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{servicesPage.addOns.intro}</p>
            </Reveal>
          </div>
        </div>

        <ul className="addon-grid">
          {addOns.map((addOn, index) => {
            const prices = addOnPrices[addOn.name]
            const from = prices
              ? Object.values(prices).filter((value): value is number => value !== null)
              : []
            return (
              <Reveal
                as="li"
                className={`addon-card delay-${Math.min(index + 1, 4)}`}
                key={addOn.name}
              >
                <img alt={addOn.imageAlt} className="addon-card__image" loading="lazy" src={addOn.image} />
                <h3>{addOn.name}</h3>
                <p>{addOn.description}</p>
                <span className="addon-card__price">
                  {from.length > 0
                    ? <>{pricing.startingLabel} <RollingPrice amount={Math.min(...from)} /></>
                    : pricing.unpricedNote}
                </span>
              </Reveal>
            )
          })}
        </ul>
      </section>

      <section className="section extras-section" id="extras">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>{servicesPage.extras.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>{servicesPage.extras.heading}</h2>
          </Reveal>
          <Reveal className="delay-2">
            <p>{servicesPage.extras.intro}</p>
          </Reveal>
        </div>

        <div className="extras-layout">
          <ol className="extras-list">
            {servicesPage.extras.reasons.map((reason, index) => (
              <Reveal
                as="li"
                className={`extras-item delay-${Math.min(index + 1, 4)}`}
                key={reason.title}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="extras-promise delay-2">
            <h3>{servicesPage.extras.promise.title}</h3>
            <ul>
              {servicesPage.extras.promise.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section why" id="compare">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>{servicesPage.compare.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>{servicesPage.compare.heading}</h2>
          </Reveal>
        </div>
        <Reveal className="why-table-wrap">
          <table className="why-table">
            <caption className="sr-only">
              How {site.name} compares with most detailers
            </caption>
            <thead>
              <tr>
                <th>{compare.featureLabel}</th>
                <th className="why-kp"><span className="why-kp__brand"><Mark /></span></th>
                <th>{compare.othersLabel}</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.feature}>
                  <th>{row.feature}</th>
                  <td className="why-kp">
                    <span className="why-mark">✓</span>
                    {row.kp}
                  </td>
                  <td>
                    <span className="why-mark why-mark--no">×</span>
                    {row.others}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section className="section faq">
        <div className="faq-layout">
          <div className="faq-copy">
            <Reveal>
              <Eyebrow>{servicesPage.faq.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>{servicesPage.faq.heading}</h2>
            </Reveal>
          </div>
          <div className="faq-list">
            {serviceFaqs.map((item, index) => (
              <Reveal
                className={`faq-row is-open delay-${Math.min(index + 1, 4)}`}
                key={item.question}
              >
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
