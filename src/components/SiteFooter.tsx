import { Link } from "../router"
import { navPages } from "../content/nav"
import {
  instagramHref,
  location,
  mailHref,
  mapsUrl,
  site,
  telHref,
} from "../content/site"
import { Mark } from "./primitives"

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer footer--compact">
      <div className="footer-shell">
        <div className="footer-brand">
          <Link aria-label={`${site.name} home`} href="/">
            <Mark />
          </Link>
          <p>{site.tagline}</p>
          {instagramHref && (
            <a
              aria-label="KP11 Mobile Auto Spa on Instagram"
              href={instagramHref}
              rel="noreferrer"
              target="_blank"
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <rect height="18" rx="5" width="18" x="3" y="3" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  fill="currentColor"
                  r="1"
                  stroke="none"
                />
              </svg>
            </a>
          )}
        </div>

        <div className="footer-links">
          <strong>Contact</strong>
          {telHref && <a href={telHref}>{site.phone}</a>}
          {mailHref && <a href={mailHref}>{site.email}</a>}
          <a href={mapsUrl} rel="noreferrer" target="_blank">
            {location}
          </a>
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
          <strong>Legal</strong>
          <Link href="/booking-terms/">Terms of Service</Link>
          <Link href="/privacy-policy/">Privacy Policy</Link>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span>
            Powered by{" "}
            <a href="https://blitzstudio.xyz/" rel="noreferrer" target="_blank">
              Blitz Studio
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
