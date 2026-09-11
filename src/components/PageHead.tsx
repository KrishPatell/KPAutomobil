// The opening band of every sub-page: breadcrumb, eyebrow, H1, standfirst.
//
// `title` is the page's name — it labels the breadcrumb and the nav. `heading` is the editorial H1
// the IA actually specifies ("One person. One van. Your driveway."), which is rarely the same
// string. Keeping them apart stops the breadcrumb from turning into a sentence.

import type { ReactNode } from "react"
import Breadcrumb from "./Breadcrumb"
import { Eyebrow, Reveal } from "./primitives"

export default function PageHead({
  eyebrow,
  title,
  heading,
  standfirst,
  children,
  compact = false,
}: {
  eyebrow: string
  title: string
  heading: string
  standfirst: string
  children?: ReactNode
  /** Used where the next section should begin immediately below the page introduction. */
  compact?: boolean
}) {
  return (
    <section className={`page-head${compact ? " page-head--compact" : ""}`}>
      <div className="page-head__inner">
        <Breadcrumb title={title} />
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal className="delay-1">
          <h1>{heading}</h1>
        </Reveal>
        <Reveal className="delay-2">
          <p className="page-head__standfirst">{standfirst}</p>
        </Reveal>
        {children && <Reveal className="delay-3">{children}</Reveal>}
      </div>
    </section>
  )
}
