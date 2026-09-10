// The small shared pieces of the design system: the orange arrow, the wordmark, the button, the
// mono eyebrow, and the reveal wrapper. Extracted from App.tsx unchanged so every page draws on
// the same vocabulary rather than re-deriving it.

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link } from "../router"
import { site } from "../content/site"
import useReveal from "../lib/useReveal"

export function Arrow() {
  return (
    <span aria-hidden="true" className="arrow">
      →
    </span>
  )
}

export function LocationPin() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 10.5c0 5.2-8 11-8 11s-8-5.8-8-11a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function Mark() {
  if (site.logo.src) {
    return <img className="mark mark--logo" src={site.logo.src} alt={site.logo.alt} />
  }

  return (
    <span className="mark">
      <b>{site.mark.lead}</b>
      <small>{site.mark.tail}</small>
    </span>
  )
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "light",
  className = "",
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "light" | "dark" | "outline"
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      className={`button button--${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      <span>{children}</span>
      <Arrow />
    </button>
  )
}

/**
 * The same button styling on an anchor, for links that navigate rather than act.
 *
 * It goes through the router's Link so an internal href does not reload the page, while still
 * rendering a real <a> that can be copied, middle-clicked and opened in a new tab.
 */
export function ButtonLink({
  children,
  href,
  variant = "light",
  className = "",
}: {
  children: ReactNode
  href: string
  variant?: "light" | "dark" | "outline"
  className?: string
}) {
  return (
    <Link className={`button button--${variant} ${className}`} href={href}>
      <span>{children}</span>
      <Arrow />
    </Link>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <i />
      {children}
    </p>
  )
}

/** A brief one-time slot-style reveal for each price. */
export function RollingPrice({ amount }: { amount: number }) {
  const amountRef = useRef<HTMLSpanElement>(null)
  const [displayedAmount, setDisplayedAmount] = useState(amount)
  const [isRolling, setIsRolling] = useState(false)

  useEffect(() => {
    const element = amountRef.current
    if (!element) return
    let frame = 0
    let hasPlayed = false
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const run = () => {
      if (hasPlayed || reducedMotion) return
      hasPlayed = true
      setIsRolling(true)
      const start = window.performance.now()
      const duration = 760
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        setDisplayedAmount(Math.round(eased * amount))
        if (progress < 1) frame = window.requestAnimationFrame(tick)
        else {
          setDisplayedAmount(amount)
          setIsRolling(false)
        }
      }
      frame = window.requestAnimationFrame(tick)
    }

    if (reducedMotion) {
      setDisplayedAmount(amount)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.55 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <span
      aria-label={`$${amount.toLocaleString("en-US")}`}
      className={`rolling-price${isRolling ? " is-rolling" : ""}`}
      ref={amountRef}
    >
      <span aria-hidden="true">${displayedAmount.toLocaleString("en-US")}</span>
    </span>
  )
}

export function SlotDeposit() {
  return <RollingPrice amount={site.deposit} />
}

/**
 * Scroll-reveal wrapper.
 *
 * `as` exists because the reveal is often the direct child of a <ul> or an <ol>, and a <div> in
 * there is invalid markup that screen readers drop out of the list. Pass the element the parent
 * expects — "li", "article", "figure" — and the motion comes along unchanged.
 */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: ReactNode
  className?: string
  as?: "div" | "li" | "article" | "figure" | "section"
  id?: string
}) {
  const motion = useReveal<HTMLElement>()
  return (
    <Tag className={`${motion.className} ${className}`} id={id} ref={motion.ref as never}>
      {children}
    </Tag>
  )
}
