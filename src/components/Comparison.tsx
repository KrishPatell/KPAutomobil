// The drag-to-reveal before/after slider.
//
// Lifted out of App.tsx so /gallery/ can mount it against a filtered set of pairs while the
// homepage keeps the full list. The pairs are a prop rather than an import for that reason — the
// gallery's filter chips change the set, not the component.

import { useState } from "react"
import type { ComparisonPair } from "../content/results"
import { comparisonPairs } from "../content/results"

type ComparisonProps = {
  pairs?: ComparisonPair[]
}

export default function Comparison({ pairs = comparisonPairs }: ComparisonProps) {
  const [split, setSplit] = useState(50)
  const [pairIndex, setPairIndex] = useState(0)

  // A filter can shrink the list under a live index, so clamp rather than crash on an empty slot.
  const index = Math.min(pairIndex, pairs.length - 1)
  const pair = pairs[index]
  if (!pair) return null

  const changePair = (direction: number) => {
    setPairIndex((current) => (current + direction + pairs.length) % pairs.length)
    setSplit(50)
  }

  return (
    <figure>
      <div className="comparison-stage">
        <img
          className={pair.mirrored ? "comparison-image--mirrored" : undefined}
          src={pair.after}
          alt={`Finished vehicle after ${pair.title.toLowerCase()} service`}
        />
        {/*
          Keep the reveal mask outside the image transform. Mirroring a clipped image also
          mirrors the clipped area, which made the Audi and Ram slides reveal from the wrong
          side. The wrapper is always clipped left-to-right; only the photograph is mirrored.
        */}
        <div
          aria-hidden="true"
          className="comparison-before"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <img
            className={pair.mirrored ? "comparison-image--mirrored" : undefined}
            src={pair.before}
            alt=""
          />
        </div>
        <span className="comparison-label comparison-label--before">Before</span>
        <span className="comparison-label comparison-label--after">After</span>
        <input
          aria-label="Drag to compare before and after"
          max="98"
          min="2"
          onChange={(event) => setSplit(Number(event.target.value))}
          type="range"
          value={split}
        />
        <span className="comparison-handle" style={{ left: `${split}%` }}>
          ↔
        </span>
      </div>
      {pairs.length > 1 && (
        <div className="comparison-controls">
          <button
            aria-label="Previous before and after example"
            onClick={() => changePair(-1)}
            type="button"
          >
            ←
          </button>
          <div aria-label="Before and after examples" className="comparison-dots">
            {pairs.map((item, dot) => (
              <button
                aria-label={`Show ${item.title} example`}
                className={dot === index ? "active" : ""}
                key={item.title}
                onClick={() => {
                  setPairIndex(dot)
                  setSplit(50)
                }}
                type="button"
              />
            ))}
          </div>
          <button
            aria-label="Next before and after example"
            onClick={() => changePair(1)}
            type="button"
          >
            →
          </button>
        </div>
      )}
    </figure>
  )
}
