// /gallery/ — "The work, unedited."
//
// Three shaping decisions, all of them consequences of what we actually have:
//
//   1. The filter chips are derived from the categories present in src/content/results.ts, not from
//      the four the type allows. Today that renders All · Exterior · Stains. Hard-coding "Interior"
//      and "Pet hair" would ship two chips that filter to an empty set.
//   2. The stills run as a masonry column flow rather than a uniform crop grid. A page claiming the
//      photographs are unedited should not be cropping them all to 4:3 to look tidy.
//   3. The disclaimer sits beside the first photograph, not under the last one. It is the most
//      important sentence on the page.

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import PageHead from "../components/PageHead"
import CtaBand from "../components/CtaBand"
import Comparison from "../components/Comparison"
import { Arrow, Eyebrow, Reveal } from "../components/primitives"
import { pageCopy } from "../content/pages"
import { categoryLabels, gallery, galleryStills } from "../content/gallery"
import { comparisonPairs } from "../content/results"
import type { ComparisonPair } from "../content/results"
import { instagramHref, site } from "../content/site"

type Filter = ComparisonPair["category"] | "all"

/** Only the categories that have at least one pair behind them, in the order they first appear. */
const categories = comparisonPairs.reduce<ComparisonPair["category"][]>((list, pair) => {
  if (!list.includes(pair.category)) list.push(pair.category)
  return list
}, [])

function Lightbox({
  index,
  onClose,
  onStep,
}: {
  index: number
  onClose: () => void
  onStep: (direction: number) => void
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowRight") onStep(1)
      if (event.key === "ArrowLeft") onStep(-1)
    }
    window.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, onStep])

  const still = galleryStills[index]

  // .site-shell is `overflow: clip`, which is exactly the kind of ancestor that clips a
  // fixed-position child. Mounting on <body> sidesteps the question rather than betting on it.
  return createPortal(
    <div
      aria-label={still.title}
      aria-modal="true"
      className="gallery-lightbox"
      onClick={onClose}
      role="dialog"
    >
      <button className="gallery-lightbox__close" onClick={onClose} type="button">
        {gallery.stills.closeLabel}
        <i aria-hidden="true">×</i>
      </button>

      <figure onClick={(event) => event.stopPropagation()}>
        <img alt={still.title} src={still.image} />
        <figcaption>
          <span>{still.label}</span>
          <b>{still.title}</b>
          <small>{still.caption}</small>
        </figcaption>
      </figure>

      <div className="gallery-lightbox__nav" onClick={(event) => event.stopPropagation()}>
        <button aria-label={gallery.stills.previousLabel} onClick={() => onStep(-1)} type="button">
          ←
        </button>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(galleryStills.length).padStart(2, "0")}
        </span>
        <button aria-label={gallery.stills.nextLabel} onClick={() => onStep(1)} type="button">
          →
        </button>
      </div>
    </div>,
    document.body,
  )
}

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>("all")
  const [lightbox, setLightbox] = useState<number | null>(null)

  const pairs =
    filter === "all" ? comparisonPairs : comparisonPairs.filter((pair) => pair.category === filter)

  const step = (direction: number) =>
    setLightbox((current) =>
      current === null
        ? current
        : (current + direction + galleryStills.length) % galleryStills.length,
    )

  return (
    <>
      <PageHead
        compact
        eyebrow={pageCopy.gallery.eyebrow}
        heading={pageCopy.gallery.heading}
        standfirst={pageCopy.gallery.standfirst}
        title="Gallery"
      />

      <section className="section gallery-compare" id="compare">
        <div className="gallery-head">
          <div>
            <Reveal>
              <Eyebrow>{gallery.compare.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>{gallery.compare.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{gallery.compare.intro}</p>
            </Reveal>
          </div>

          <Reveal className="gallery-notice delay-2">
            <span className="gallery-notice__label">{gallery.disclaimer.label}</span>
            {gallery.disclaimer.lines.map((line, index) => (
              <p className={index === 0 ? "gallery-notice__lead" : ""} key={line}>
                {line}
              </p>
            ))}
          </Reveal>
        </div>

        <Reveal className="gallery-filter">
          <span className="gallery-filter__label">{gallery.compare.filterLabel}</span>
          <div>
            <button
              aria-pressed={filter === "all"}
              className={filter === "all" ? "is-on" : ""}
              onClick={() => setFilter("all")}
              type="button"
            >
              {gallery.compare.allLabel}
              <i>{String(comparisonPairs.length).padStart(2, "0")}</i>
            </button>
            {categories.map((category) => {
              const count = comparisonPairs.filter((pair) => pair.category === category).length
              return (
                <button
                  aria-pressed={filter === category}
                  className={filter === category ? "is-on" : ""}
                  key={category}
                  onClick={() => setFilter(category)}
                  type="button"
                >
                  {categoryLabels[category]}
                  <i>{String(count).padStart(2, "0")}</i>
                </button>
              )
            })}
          </div>
        </Reveal>

        <Reveal className="comparison delay-1">
          {/* Keyed on the filter so a narrowed set opens on its own first pair, not a clamped index. */}
          <Comparison key={filter} pairs={pairs} />
        </Reveal>
      </section>

      <section className="section gallery-stills" id="stills">
        <div className="section-head">
          <Reveal>
            <Eyebrow>{gallery.stills.eyebrow}</Eyebrow>
          </Reveal>
          <div>
            <Reveal className="delay-1">
              <h2>{gallery.stills.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{gallery.stills.intro}</p>
            </Reveal>
          </div>
        </div>

        <ul className="gallery-grid">
          {galleryStills.map((still, index) => (
            <Reveal
              as="li"
              className={`gallery-tile delay-${(index % 4) + 1}`}
              key={`${still.title}-${index}`}
            >
              <button
                aria-label={`${gallery.stills.openLabel}: ${still.title}`}
                onClick={() => setLightbox(index)}
                type="button"
              >
                <img alt={still.caption} loading="lazy" src={still.image} />
                <span className="gallery-tile__foot">
                  <em>{String(index + 1).padStart(2, "0")}</em>
                  <b>{still.title}</b>
                  <small>{still.label}</small>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </section>

      {instagramHref && (
        <section className="section gallery-social">
          <div className="gallery-social__inner">
            <Reveal>
              <Eyebrow>{gallery.instagram.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>{gallery.instagram.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{gallery.instagram.body}</p>
            </Reveal>
            <Reveal className="delay-3">
              <a
                className="button button--light"
                href={instagramHref}
                rel="noreferrer"
                target="_blank"
              >
                <span>
                  {gallery.instagram.cta} · @{site.instagram}
                </span>
                <Arrow />
              </a>
            </Reveal>
          </div>
        </section>
      )}

      {lightbox !== null && (
        <Lightbox index={lightbox} onClose={() => setLightbox(null)} onStep={step} />
      )}

      <CtaBand />
    </>
  )
}
