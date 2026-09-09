// The eight pages, in the order the IA lists them. This is the routing table, the nav, the footer
// columns and the breadcrumb label source — one list, so a page cannot exist in the router and be
// missing from the navigation.

export type Page = {
  /** Canonical URL, trailing slash included. Matching is slash-insensitive; see src/router.tsx. */
  href: string
  /** Nav label. */
  label: string
  /** Breadcrumb / document title. */
  title: string
  /** False for pages that are reachable but not advertised in the main nav. */
  inNav: boolean
}

export const pages: Page[] = [
  { href: "/", label: "Home", title: "Home", inNav: false },
  { href: "/services/", label: "Services", title: "Services & Pricing", inNav: true },
  { href: "/gallery/", label: "Gallery", title: "Gallery", inNav: true },
  { href: "/service-areas/", label: "Service Areas", title: "Service Areas", inNav: true },
  { href: "/about/", label: "About", title: "About", inNav: true },
  { href: "/contact/", label: "Contact", title: "Contact", inNav: true },
  { href: "/book/", label: "Book", title: "Book & Instant Quote", inNav: false },
  { href: "/booking-terms/", label: "Booking Terms", title: "Booking Terms", inNav: false },
]

export const navPages = pages.filter((page) => page.inNav)

function trim(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path
}

/**
 * The page a path belongs to.
 *
 * It falls back to the first segment so the flow's own sub-paths — /book/photos, /book/deposit —
 * still resolve to the /book/ entry rather than dropping to undefined and taking the document title
 * with them.
 */
export function pageFor(path: string): Page | undefined {
  const key = trim(path)
  const exact = pages.find((page) => trim(page.href) === key)
  if (exact) return exact
  const root = `/${key.split("/")[1] ?? ""}`
  return root === "/" ? undefined : pages.find((page) => trim(page.href) === root)
}

/** The one CTA that every page points at. The IA is explicit that everything feeds /book/. */
export const primaryCta = { label: "Get an Instant Quote", href: "/book/" }
