// /about/ — "One person. One van. Your driveway."
//
// docs/information-architecture.pdf sources this page from a 20-minute interview with Kunj that has
// not happened, and says outright: do not write this generically. Inventing an origin story here is
// exactly the AI-generated content that was ruled out, so the page renders only the chapters that
// have a real body — see the note above `aboutPage` in src/content/about.ts. The unanswered ones
// carry `body: null`, do not render, and become one-line edits once the interview happens.
//
// The layout is the sticky split panel from the homepage, because it is the most distinctive thing
// in the design system and a story told in numbered chapters is exactly what it is for.

import PageHead from "../components/PageHead"
import AnchorBar from "../components/AnchorBar"
import CtaBand from "../components/CtaBand"
import { ButtonLink, Eyebrow, Reveal, SlotDeposit } from "../components/primitives"
import { pageCopy } from "../content/pages"
import { about, aboutPage } from "../content/about"
import { media } from "../content/media"
import { primaryCta } from "../content/nav"

export default function About() {
  const chapters = aboutPage.story.chapters.filter((chapter) => chapter.body !== null)

  return (
    <>
      <PageHead
        eyebrow={pageCopy.about.eyebrow}
        heading={pageCopy.about.heading}
        standfirst={pageCopy.about.standfirst}
        title="About"
      >
        <AnchorBar anchors={aboutPage.anchors} />
      </PageHead>

      {/* Kunj's own sentence, verbatim from docs/content-brief.md. The only first-person line on
          the site, and the reason every pricing decision behind it went the way it did. */}
      <section className="section story-quote">
        <div className="story-quote__inner">
          <Reveal>
            <blockquote>
              <p>“{aboutPage.quote.text}”</p>
              <footer>
                <span>{aboutPage.quote.label}</span>
                <small>{aboutPage.quote.note}</small>
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="process" id="story">
        <div className="process-grid">
          <div className="process-panel">
            <img alt="Our team working on a car at a customer's home" src={media.about} />
            <div className="process-shade" />
            <div className="process-panel__content">
              <div className="process-panel__cluster">
                <Reveal>
                  <Eyebrow>{aboutPage.story.eyebrow}</Eyebrow>
                </Reveal>
                <Reveal className="delay-1">
                  <h2>{aboutPage.story.heading}</h2>
                </Reveal>
                <Reveal className="delay-2">
                  <p>{aboutPage.story.intro}</p>
                </Reveal>
                <Reveal className="delay-3">
                  <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
                </Reveal>
              </div>
            </div>
          </div>

          <ol className="story-cards">
            {chapters.map((chapter, index) => (
              <Reveal
                as="li"
                className={`story-card delay-${Math.min(index + 1, 4)}`}
                key={chapter.number}
              >
                <span>{chapter.number}</span>
                <div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section extras-section" id="pricing">
        <div className="section-head">
          <Reveal>
            <Eyebrow>{aboutPage.pricing.eyebrow}</Eyebrow>
          </Reveal>
          <div>
            <Reveal className="delay-1">
              <h2>{aboutPage.pricing.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{aboutPage.pricing.intro}</p>
            </Reveal>
          </div>
        </div>

        <div className="extras-layout">
          <ol className="extras-list">
            {aboutPage.pricing.steps.map((step, index) => (
              <Reveal
                as="li"
                className={`extras-item delay-${Math.min(index + 1, 4)}`}
                key={step.title}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="extras-promise delay-2">
            <h3>{aboutPage.pricing.nullRule.title}</h3>
            <ul>
              <li>{aboutPage.pricing.nullRule.body}</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section addon-section" id="kit">
        <div className="section-head">
          <Reveal>
            <Eyebrow>{aboutPage.kit.eyebrow}</Eyebrow>
          </Reveal>
          <div>
            <Reveal className="delay-1">
              <h2>{aboutPage.kit.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{aboutPage.kit.intro}</p>
            </Reveal>
          </div>
        </div>

        <ul className="addon-grid">
          {aboutPage.kit.items.map((item, index) => (
            <Reveal
              as="li"
              className={`addon-card delay-${Math.min(index + 1, 4)}`}
              key={item.name}
            >
              <img
                alt={item.imageAlt}
                className="addon-card__image"
                loading="lazy"
                src={item.image}
              />
              <h3>{item.name}</h3>
              <p>{item.detail}</p>
              <span className="addon-card__price">{item.where}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section story-stats">
        <div className="story-stats__head">
          <Reveal>
            <Eyebrow>{aboutPage.stats.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>{aboutPage.stats.heading}</h2>
          </Reveal>
        </div>

        <dl className="story-stats__grid">
          {about.stats.map((stat, index) => (
            <Reveal
              className={`story-stat delay-${Math.min(index + 1, 4)}`}
              key={stat.label}
            >
              <dt>{stat.label}</dt>
              <dd>{stat.amount !== undefined ? <SlotDeposit /> : stat.figure}</dd>
            </Reveal>
          ))}
        </dl>

      </section>

      <CtaBand />
    </>
  )
}
