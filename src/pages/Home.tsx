// The homepage.
//
// Lifted out of App.tsx when the site grew from one page to eight. The markup is unchanged — this
// is the design the rest of the site is built to match — but every string and array it used to
// hold inline now comes from src/content/, and the three booking entry points are real links to
// /book/ instead of an in-place state swap.

import { useState } from "react"
import { Link } from "../router"
import { Arrow, ButtonLink, Eyebrow, Mark, Reveal, SlotDeposit } from "../components/primitives"
import Comparison from "../components/Comparison"
import { about } from "../content/about"
import { rows as compareRows } from "../content/compare"
import { faqs } from "../content/faqs"
import { media } from "../content/media"
import { primaryCta } from "../content/nav"
import { processSteps } from "../content/process"
import { promiseCards } from "../content/promise"
import { bookablePackages, packages } from "../content/services"
import { serviceArea } from "../content/site"
import { bodyStyles } from "../content/vehicles"
import { workCards } from "../content/work"

export default function Home() {
  const [activePackage, setActivePackage] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const active = packages[activePackage]

  return (
    <>
      <section className="hero">
        <img
          className="hero-image"
          src={media.hero}
          alt="Mobile detailer washing a car in a driveway"
        />
        <div className="hero-wash" />
        <div className="hero-content">
          <Reveal>
            <Eyebrow>{serviceArea}</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h1>Mobile detailing with a real price upfront.</h1>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              Send four photos. See your price in writing. No callback. No
              driveway upsell.
            </p>
          </Reveal>
          <Reveal className="delay-3">
            <div className="hero-actions">
              <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
              <a className="quiet-link" href="#services">
                See the packages <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-proof delay-4">
          <span>HOW PRICING WORKS</span>
          <strong>
            4 <small>photos</small>
          </strong>
          <p>
            <b>One clear price</b>
            <small>2 interior + 2 exterior shots</small>
          </p>
        </Reveal>
      </section>
      <section className="section about" id="about">
        <div className="section-head">
          <Reveal>
            <Eyebrow>About KP Automobil</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>
              Our team, one mobile setup, and a price you agree to before we arrive.
            </h2>
          </Reveal>
        </div>
        <div className="about-grid">
          <Reveal className="about-image image-tall">
            <img src={media.about} alt="Detailer polishing a black car" />
          </Reveal>
          <Reveal className="about-image">
            <img src={media.foam} alt="Car covered in snow foam during a wash" />
          </Reveal>
          <Reveal className="about-card delay-2">
            <div>
              {about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <dl>
              <div>
                <dt>
                  <SlotDeposit />
                </dt>
                <dd>Refundable deposit</dd>
              </div>
              <div>
                <dt>0%</dt>
                <dd>Card fee</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>
      <section className="section services" id="services">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>Services</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>Three packages and two add-ons. That is the whole menu.</h2>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              Pick the one that sounds closest. The price comes from your
              photos, not from a guess over the phone.
            </p>
          </Reveal>
        </div>
        <div className="services-layout">
          <div
            className="service-tabs"
            role="tablist"
            aria-label="Detailing packages"
          >
            {packages.map((item, index) => (
              <button
                aria-selected={activePackage === index}
                className={activePackage === index ? "active" : ""}
                key={item.name}
                onClick={() => setActivePackage(index)}
                role="tab"
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{item.name}</b>
                {item.addOn && <small>Add-on</small>}
              </button>
            ))}
          </div>
          <div className="service-panel" role="tabpanel">
            <div className="service-panel__top">
              <div>
                <span className="service-kicker">
                  {active.addOn ? "Add-on service" : "Package"}
                </span>
                <h3>{active.name}</h3>
                <p>{active.description}</p>
                <span className="price-note">
                  Priced from your photos, before you book
                </span>
                <ButtonLink href={`/book/?package=${active.slug}`}>
                  Book {active.name}
                </ButtonLink>
              </div>
              <img
                src={active.image}
                alt={`${active.name} detailing service`}
              />
            </div>
            <div className="included">
              <span>What's included</span>
              <ul>
                {active.items.map((item) => (
                  <li key={item}>
                    <i>+</i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section vehicles" id="vehicles">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>Vehicles we service</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>Four sizes. Yours decides the price, and nothing else does.</h2>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              Every package is priced by how much car there is. Pick your size
              and the booking form opens with that answer already filled in.
            </p>
          </Reveal>
        </div>
        <div className="driveway-grid">
          {bodyStyles.map((item, index) => (
            <Reveal
              className={`driveway-card delay-${Math.min(index + 1, 4)}${
                item.compact ? " driveway-card--compact" : ""
              }`}
              key={item.name}
            >
              <Link href={`/book/?size=${item.size}`}>
                <img src={item.image} alt={`${item.name} vehicle`} />
                <b>{item.name}</b>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="process" id="process">
        <div className="process-grid">
          <div className="process-panel">
            <img
              src={media.process}
              alt="KP Automobil van heading to a driveway booking"
            />
            <div className="process-shade" />
            <div className="process-panel__content">
              <div className="process-panel__cluster">
                <Reveal>
                  <Eyebrow>How it works</Eyebrow>
                </Reveal>
                <Reveal className="delay-1">
                  <h2>
                    Three steps, and the price is settled before anyone touches
                    the car.
                  </h2>
                </Reveal>
                <Reveal className="delay-2">
                  <p>
                    Send four photos, choose a time, and see the price before we arrive.
                    No site visit, no phone tag, and no new figure in your driveway.
                  </p>
                </Reveal>
                <Reveal className="delay-3">
                  <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
                </Reveal>
              </div>
            </div>
          </div>
          <ol className="process-cards">
            {processSteps.map((step, index) => (
              <Reveal
                className={`process-card delay-${Math.min(index + 1, 4)}`}
                key={step.number}
              >
                <img src={step.image} alt={step.imageAlt} />
                <div>
                  <h3>
                    <span>{step.number}</span>
                    {step.title}
                  </h3>
                  <p>{step.body}</p>
                  <small>{step.meta}</small>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="section results" id="results">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>Before & after</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>Same BMW, same driveway. See five finishes come back.</h2>
          </Reveal>
        </div>
        <Reveal className="comparison">
          <Comparison />
        </Reveal>
      </section>
      <section className="section work" id="work">
        <div className="section-head work-head">
          <div>
            <Reveal>
              <Eyebrow>The work</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>What each package looks like when it is finished.</h2>
            </Reveal>
          </div>
          <Reveal className="delay-2">
            <p>
              Reference photography for now. Our own documented job photos replace
              these as the work comes in.
            </p>
          </Reveal>
        </div>
        <div className="work-grid">
          {bookablePackages.map((item, index) => (
            <Reveal className={`work-card delay-${index + 1}`} key={item.name}>
              <Link href={`/book/?package=${item.slug}`}>
                <img src={item.image} alt={`${item.name} detailing example`} />
                <span>
                  <b>{item.name}</b>
                  <small>{item.showcaseNote}</small>
                  <em>
                    Book this package <Arrow />
                  </em>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section why" id="why">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>The difference</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>Eight things you can check before you book.</h2>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              No vague quote, no card fee, no price change in your driveway.
              Every line below is something you can check.
            </p>
          </Reveal>
        </div>
        <Reveal className="why-table-wrap">
          <table className="why-table">
            <caption className="sr-only">
              How KP Automobil compares with most detailers
            </caption>
            <thead>
              <tr>
                <th>How it works</th>
                <th className="why-kp"><span className="why-kp__brand"><Mark /></span></th>
                <th>Most detailers</th>
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
      <section className="section reviews" id="reviews">
        <div className="section-head section-head--center reviews-head">
          <Reveal>
            <Eyebrow>Recent work</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <div className="reviews-head__title">
              <Mark />
              <h2>Reference work for the care your car can expect.</h2>
            </div>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              These are reference-detailing examples. Our own documented work
              replaces them as bookings are completed.
            </p>
          </Reveal>
        </div>
        <div className="review-gallery" aria-label="Reference detailing work">
          {workCards.map((card, index) => (
            <Reveal className={`review-card delay-${index + 1}`} key={card.title}>
              <article>
                <img src={card.image} alt={card.imageAlt} />
                <div className="review-card__copy">
                  <b>{card.title}</b>
                  <small>{card.caption}</small>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section promise" id="promise">
        <div className="promise-head">
          <div>
            <Reveal>
              <Eyebrow>What we promise</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>No vague quote. No surprise number at the driveway.</h2>
            </Reveal>
          </div>
        </div>
        <div className="promise-grid">
          {promiseCards.map((card, index) => (
            <Reveal
              className={`promise-card delay-${index + 1}`}
              key={card.label}
            >
              <img alt="" className="promise-card__image" src={card.image} />
              <div className="promise-card__shade" />
              <div className="promise-card__content">
                <div className="promise-card__heading">
                  <b>{card.label}</b>
                  <small>{card.title}</small>
                </div>
                <p>{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section faq" id="faq">
        <div className="faq-layout">
          <div className="faq-copy">
            <Reveal>
              <Eyebrow>FAQ</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>Questions, answered plainly.</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>If yours is not here, add it to the quote form notes.</p>
            </Reveal>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <Reveal
                className={`faq-row delay-${Math.min(index + 1, 4)}`}
                key={item.question}
              >
                <h3>
                  <button
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <b>{openFaq === index ? "×" : "+"}</b>
                  </button>
                </h3>
                <div
                  className={
                    openFaq === index ? "faq-answer open" : "faq-answer"
                  }
                >
                  <p>{item.answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
