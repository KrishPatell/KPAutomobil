// The in-page jump bar under a page head. Styled off the homepage's `.service-tabs` so it reads as
// the same family, and it highlights whichever section is currently on screen.

import { useEffect, useState } from "react"

export type Anchor = { href: string; label: string }

export default function AnchorBar({ anchors }: { anchors: Anchor[] }) {
  const [active, setActive] = useState(anchors[0]?.href ?? "")

  useEffect(() => {
    const ids = anchors.map((anchor) => anchor.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    if (sections.length === 0) return

    // Bias the trigger line to a third of the way down so a section counts as "current" while it
    // is being read, not only once its top edge touches the very top of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries.filter((entry) => entry.isIntersecting)
        if (onScreen.length === 0) return
        const top = onScreen.reduce((best, entry) =>
          entry.boundingClientRect.top < best.boundingClientRect.top ? entry : best,
        )
        setActive(`#${top.target.id}`)
      },
      { rootMargin: "-20% 0px -66% 0px" },
    )
    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [anchors])

  return (
    <nav aria-label="On this page" className="anchor-bar">
      {anchors.map((anchor) => (
        <a
          aria-current={active === anchor.href ? "true" : undefined}
          className={active === anchor.href ? "is-active" : ""}
          href={anchor.href}
          key={anchor.href}
        >
          {anchor.label}
        </a>
      ))}
    </nav>
  )
}
