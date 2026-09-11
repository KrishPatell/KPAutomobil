// The global footer. /book/ uses BookFooter instead — see src/pages/Book/.

import { Link } from "../router"
import { navPages, primaryCta } from "../content/nav"
import { location, mapsUrl, mailHref, site, socials, telHref } from "../content/site"
import { Arrow, LocationPin, Mark } from "./primitives"

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-brand">
          <Link aria-label={`${site.name} home`} href="/">
            <Mark />
          </Link>
          <p>{site.tagline}</p>
          <Link className="button button--light" href={primaryCta.href}>
            <span>{primaryCta.label}</span>
            <Arrow />
          </Link>
        </div>

        <div className="footer-links">
          <strong>Explore</strong>
          {navPages.map((page) => (
            <Link href={page.href} key={page.href}>
              {page.label}
            </Link>
          ))}
        </div>

        <div className="footer-links">
          <strong>Information</strong>
          <Link href="/booking-terms/">Booking terms</Link>
          <Link href="/services/#extras">What costs extra</Link>
          {telHref && <a href={telHref}>{site.phone}</a>}
          {mailHref && <a href={mailHref}>{site.email}</a>}
          {socials.map((social) => (
            <a href={social.href} key={social.label} rel="noreferrer" target="_blank">
              {social.label}
            </a>
          ))}
          <a className="footer-service-area" href={mapsUrl} rel="noreferrer" target="_blank">
            <LocationPin />
            <span>
              <b>Service area</b>
              <small>{location}</small>
            </span>
            <Arrow />
          </a>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {site.name}
          </span>
          <nav aria-label="Footer navigation">
            <Link href="/services/">Services</Link>
            <Link href="/gallery/">Gallery</Link>
            <Link href="/about/">About</Link>
            <Link href="/booking-terms/">Booking terms</Link>
          </nav>
          <span>Owner-operated mobile detailing</span>
        </div>
      </div>
    </footer>
  )
}
