// Scroll reveal. One observer per element, disconnected the moment it fires.
//
// This is the implementation the live page uses: the element starts at `.reveal` (opacity 0,
// translateY 22px) and gains `.is-visible` the first time it crosses the threshold. Both classes
// are defined in src/index.css, along with `.delay-1` … `.delay-4` for staggering a group, and the
// whole thing is switched off under `prefers-reduced-motion: reduce`.

import { useEffect, useRef, useState } from "react"

export default function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, className: visible ? "reveal is-visible" : "reveal" }
}
