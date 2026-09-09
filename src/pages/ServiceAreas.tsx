// /service-areas/ — where the van can actually work.
//
// The honest shape of this page is dictated by src/content/site.ts: `towns` is empty and
// `serviceRadiusMiles` is null, so the coverage list does not render and the ZIP checker answers
// with the one thing that is true today — any travel fee is quoted with the price, before the
// deposit. Fill either value in that one file and both light up with no change here.
//
// The permit question Kunj raised in docs/information-architecture.pdf is unanswered, so the on-site
// copy tells the visitor to check with their building. That is true whichever way the answer lands
// and claims nothing about permits.

import { useState } from "react"
import PageHead from "../components/PageHead"
import AnchorBar from "../components/AnchorBar"
import CtaBand from "../components/CtaBand"
import { Eyebrow, LocationPin, Reveal } from "../components/primitives"
import { pageCopy } from "../content/pages"
import { areasPage } from "../content/areas"
import type { Town } from "../content/site"
import { location, site } from "../content/site"

type Result =
  | { kind: "covered"; town: Town }
  | { kind: "travel"; town: Town }
  | { kind: "outside" }
  | { kind: "unknown" }
  | { kind: "invalid" }

/**
 * Answers only what the data supports. With no ZIPs on file the honest answer is "we have not
 * published a boundary", not a cheerful yes — a coverage claim nobody has agreed is exactly the
 * kind of thing this site exists not to do.
 */
function check(input: string): Result {
  const zip = input.trim()
  if (!/^\d{5}$/.test(zip)) return { kind: "invalid" }

  const answerable = site.towns.filter((town) => (town.zips ?? []).length > 0)
  if (answerable.length === 0) return { kind: "unknown" }

  const match = answerable.find((town) => (town.zips ?? []).includes(zip))
  if (!match) return { kind: "outside" }
  return match.travelFee ? { kind: "travel", town: match } : { kind: "covered", town: match }
}

const tones: Record<Result["kind"], string> = {
  covered: "yes",
  travel: "maybe",
  outside: "no",
  unknown: "pending",
  invalid: "no",
}

function resultCopy(result: Result): { title: string; body: string } {
  switch (result.kind) {
    case "covered":
      return { title: areasPage.zip.covered.title(result.town.name), body: areasPage.zip.covered.body }
    case "travel":
      return { title: areasPage.zip.travel.title(result.town.name), body: areasPage.zip.travel.body }
    case "outside":
      return areasPage.zip.outside
    case "invalid":
      return { title: areasPage.zip.invalid, body: areasPage.zip.unknown.body }
    default:
      return areasPage.zip.unknown
  }
}

export default function ServiceAreas() {
  const [zip, setZip] = useState("")
  const [result, setResult] = useState<Result | null>(null)

  const radius = site.serviceRadiusMiles
  const answer = result ? resultCopy(result) : null

  return (
    <>
      <PageHead
        eyebrow={pageCopy.serviceAreas.eyebrow}
        heading={pageCopy.serviceAreas.heading}
        standfirst={pageCopy.serviceAreas.standfirst}
        title="Service Areas"
      >
        <AnchorBar anchors={areasPage.anchors} />
      </PageHead>

      <section className="section areas-section" id="coverage">
        <div className="section-head">
          <Reveal>
            <Eyebrow>{areasPage.coverage.eyebrow}</Eyebrow>
          </Reveal>
          <div>
            <Reveal className="delay-1">
              <h2>{areasPage.coverage.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{areasPage.coverage.intro}</p>
            </Reveal>
          </div>
        </div>

        <div className="areas-layout">
          <Reveal className="areas-facts">
            <dl>
              <div>
                <dt>{areasPage.coverage.baseLabel}</dt>
                <dd>
                  <LocationPin />
                  {location}
                </dd>
              </div>
              <div>
                <dt>{areasPage.coverage.radiusLabel}</dt>
                <dd>
                  {radius === null ? (
                    <span className="areas-facts__pending">
                      {areasPage.coverage.radiusPending}
                    </span>
                  ) : (
                    `${radius} miles`
                  )}
                </dd>
              </div>
            </dl>

            {site.towns.length > 0 && (
              <ul className="areas-towns">
                <li className="areas-towns__head">
                  <span>{areasPage.coverage.townsLabel}</span>
                  <span>{areasPage.coverage.driveLabel}</span>
                </li>
                {site.towns.map((town) => (
                  <li key={town.name}>
                    <span>
                      {town.name}
                      {town.travelFee && <i>Travel fee</i>}
                    </span>
                    <span>{town.drive ?? "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal className="zip-card delay-1">
            <Eyebrow>{areasPage.zip.eyebrow}</Eyebrow>
            <h3>{areasPage.zip.heading}</h3>

            <form
              className="zip-form"
              onSubmit={(event) => {
                event.preventDefault()
                setResult(check(zip))
              }}
            >
              <label className="zip-field" htmlFor="zip">
                <span>{areasPage.zip.label}</span>
                <input
                  autoComplete="postal-code"
                  id="zip"
                  inputMode="numeric"
                  maxLength={5}
                  onChange={(event) => {
                    setZip(event.target.value.replace(/[^\d]/g, ""))
                    setResult(null)
                  }}
                  placeholder={areasPage.zip.placeholder}
                  value={zip}
                />
              </label>
              <button className="zip-submit" type="submit">
                {areasPage.zip.action}
              </button>
            </form>

            {answer && result && (
              <output className={`zip-result zip-result--${tones[result.kind]}`}>
                <b>{answer.title}</b>
                <p>{answer.body}</p>
              </output>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section areas-onsite" id="on-site">
        <div className="section-head">
          <Reveal>
            <Eyebrow>{areasPage.onSite.eyebrow}</Eyebrow>
          </Reveal>
          <div>
            <Reveal className="delay-1">
              <h2>{areasPage.onSite.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{areasPage.onSite.intro}</p>
            </Reveal>
          </div>
        </div>

        <div className="areas-needs">
          <ol className="areas-needs__list">
            {areasPage.onSite.needs.map((need, index) => (
              <Reveal
                as="li"
                className={`areas-need delay-${Math.min(index + 1, 4)}`}
                key={need.title}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{need.title}</h3>
                  <p>{need.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="areas-not delay-2">
            <h3>{areasPage.onSite.notNeeded.title}</h3>
            <ul>
              {areasPage.onSite.notNeeded.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section areas-travel" id="travel">
        <div className="areas-travel__inner">
          <div>
            <Reveal>
              <Eyebrow>{areasPage.travel.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>{areasPage.travel.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{areasPage.travel.body}</p>
            </Reveal>
          </div>

          <ul className="areas-travel__points">
            {areasPage.travel.points.map((point, index) => (
              <Reveal
                as="li"
                className={`delay-${Math.min(index + 1, 4)}`}
                key={point}
              >
                {point}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
