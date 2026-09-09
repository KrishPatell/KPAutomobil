// The 404. A dead end is still a page — it says where it is, and offers the two routes out that
// are actually useful.

import { ButtonLink } from "../components/primitives"
import { Link } from "../router"
import { navPages, primaryCta } from "../content/nav"

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="section-head section-head--center">
        <p className="eyebrow">
          <i />
          404
        </p>
        <h2>That page is not here.</h2>
        <p>
          The link may be old, or the address mistyped. Everything the site has is one tap away
          below.
        </p>
      </div>
      <div className="notfound-actions">
        <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
        <nav aria-label="All pages" className="notfound-links">
          {navPages.map((page) => (
            <Link href={page.href} key={page.href}>
              {page.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
