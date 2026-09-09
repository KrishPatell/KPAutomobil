// The global header, on every page except /book/.
//
// Two things it does that the homepage-only version could not:
//   - real cross-page links, since there are now pages to link to
//   - a menu below 900px. The CSS hides `.nav nav` at that width and nothing replaced it, so the
//     site had no mobile navigation at all. With seven new pages that is no longer survivable.

import { useEffect, useState } from "react"
import { Link, useRoute } from "../router"
import { navPages, primaryCta } from "../content/nav"
import { site, telHref } from "../content/site"
import { Arrow, Mark } from "./primitives"

export default function SiteNav() {
  const { path } = useRoute()
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the menu on navigation, and stop the page scrolling behind it while it is open.
  useEffect(() => {
    setOpen(false)
  }, [path])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const isCurrent = (href: string) =>
    (href.length > 1 ? href.slice(0, -1) : href) === path

  return (
    <header className={`nav${stuck ? " is-stuck" : ""}`}>
      <Link aria-label={`${site.name} home`} className="nav-brand" href="/">
        <Mark />
      </Link>

      <nav aria-label="Main">
        {navPages.map((page) => (
          <Link
            aria-current={isCurrent(page.href) ? "page" : undefined}
            href={page.href}
            key={page.href}
          >
            {page.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        {telHref && (
          <a className="nav-phone" href={telHref}>
            {site.phone}
          </a>
        )}
        <Link className="button button--light nav-cta" href={primaryCta.href}>
          <span>{primaryCta.label}</span>
          <Arrow />
        </Link>
        <button
          aria-controls="nav-menu"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className={`nav-toggle${open ? " is-open" : ""}`}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <i />
          <i />
        </button>
      </div>

      <div className={`nav-menu${open ? " is-open" : ""}`} id="nav-menu">
        <nav aria-label="Main, mobile">
          {navPages.map((page) => (
            <Link
              aria-current={isCurrent(page.href) ? "page" : undefined}
              href={page.href}
              key={page.href}
            >
              <span>{page.label}</span>
              <Arrow />
            </Link>
          ))}
        </nav>
        <div className="nav-menu__foot">
          <Link className="button button--light" href={primaryCta.href}>
            <span>{primaryCta.label}</span>
            <Arrow />
          </Link>
          {telHref && <a href={telHref}>{site.phone}</a>}
        </div>
      </div>
    </header>
  )
}
