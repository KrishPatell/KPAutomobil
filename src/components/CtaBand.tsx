// The closing band. Every page ends on the same one, because the IA has every page feeding /book/.

import { ButtonLink, Eyebrow, Reveal } from "./primitives"
import { closingCta } from "../content/pages"
import { primaryCta } from "../content/nav"
import { site, telHref } from "../content/site"

export default function CtaBand() {
  return (
    <section className="section cta-band">
      <div className="cta-band__inner">
        <Reveal>
          <Eyebrow>{closingCta.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal className="delay-1">
          <h2>{closingCta.heading}</h2>
        </Reveal>
        <Reveal className="delay-2">
          <p>{closingCta.body}</p>
        </Reveal>
        <Reveal className="delay-3">
          <div className="cta-band__actions">
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            {telHref && (
              <a className="quiet-link" href={telHref}>
                Or call {site.phone}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
