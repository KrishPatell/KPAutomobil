// Client routing, hand-rolled.
//
// The site has exactly two runtime dependencies and already drove the booking flow with
// history.pushState by hand in two places. This is that pattern, factored out once, rather than a
// third dependency to do the same job.
//
// The part routers usually get wrong is the anchor: middle-click, cmd-click, "copy link address"
// and the browser's own back button all have to keep working. So <Link> renders a real <a> with a
// real href and only intercepts the one case it can improve — an unmodified left click.

import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react"

const listeners = new Set<() => void>()

function read(): string {
  if (typeof window === "undefined") return "/"
  return window.location.pathname + window.location.search
}

let current = read()

function emit() {
  const next = read()
  if (next === current) return
  current = next
  for (const listener of listeners) listener()
}

if (typeof window !== "undefined") window.addEventListener("popstate", emit)

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function snapshot() {
  return current
}

/**
 * The comparison key for a path.
 *
 * The IA writes its URLs with a trailing slash (`/services/`) and that is what we link to, but a
 * visitor who types `/services` must land on the same page. Both collapse to `/services` here, so
 * routes are matched on one shape and never have to spell out both.
 */
export function routeKey(pathname: string): string {
  const path = pathname.split("?")[0].split("#")[0]
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1)
  return path || "/"
}

export function navigate(to: string, options: { replace?: boolean } = {}) {
  if (typeof window === "undefined") return

  const url = new URL(to, window.location.origin)
  const samePath = routeKey(url.pathname) === routeKey(window.location.pathname)

  window.history[options.replace ? "replaceState" : "pushState"](
    {},
    "",
    url.pathname + url.search + url.hash,
  )
  emit()

  if (url.hash) {
    // An in-page anchor keeps the scroll behaviour the CSS already defines.
    document.getElementById(url.hash.slice(1))?.scrollIntoView({ block: "start" })
  } else if (!samePath) {
    window.scrollTo({ top: 0 })
  }
}

export function useRoute() {
  const href = useSyncExternalStore(subscribe, snapshot, snapshot)
  const queryIndex = href.indexOf("?")
  const pathname = queryIndex === -1 ? href : href.slice(0, queryIndex)
  const search = queryIndex === -1 ? "" : href.slice(queryIndex)

  return {
    /** Trailing-slash-normalised, for matching. */
    path: routeKey(pathname),
    /** Exactly what is in the address bar. */
    pathname,
    params: new URLSearchParams(search),
    navigate,
  }
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function Link({ href, children, onClick, ...rest }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return
    // Anything but a plain left click is the browser's business, not ours.
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (rest.target && rest.target !== "_self") return
    if (!href.startsWith("/")) return

    event.preventDefault()
    navigate(href)
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
