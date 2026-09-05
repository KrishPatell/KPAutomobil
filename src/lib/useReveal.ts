// Scroll-reveal. One IntersectionObserver for the whole page, shared by every consumer.
//
// The page had no animation system at all — the footer's keyframes fired on mount, which is
// eleven thousand pixels before anyone can see them. This is the replacement: an element marked
// `kp-reveal` starts hidden and gets `kp-reveal--in` the first time it scrolls into view, once,
// and is then unobserved.
//
// Two shapes, one class:
//   - a single element:  useReveal() on it, class "kp-reveal"
//   - a group:           useReveal() on the container, class "kp-reveal", and "kp-reveal" on the
//                        children too. The container's `--in` cascades to them, so a section
//                        costs one observer entry and children stagger with `--kp-delay`.
//
// If JavaScript never runs, nothing is hidden: the hiding rules are scoped to `.kp-motion`, a
// class this module puts on <html> at import time.

import { useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";

const IN = "kp-reveal--in";

/** Fraction of the element that must be showing before it counts as revealed. */
const RATIO = 0.2;

/** Elements taller than this share of the viewport can never hit RATIO, so height wins instead. */
const TALL = 0.9;

const pending = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;
let observerChecked = false;

if (typeof document !== "undefined") {
  document.documentElement.classList.add("kp-motion");
}

function getObserver(): IntersectionObserver | null {
  if (observerChecked) return observer;
  observerChecked = true;
  if (typeof IntersectionObserver === "undefined") return null;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        // A section taller than the viewport can never reach RATIO. Once any of it is on
        // screen that is as revealed as it is ever going to get, so let it through.
        const rootHeight = entry.rootBounds?.height ?? 0;
        const tall = rootHeight > 0 && entry.boundingClientRect.height > rootHeight * TALL;
        if (entry.intersectionRatio < RATIO && !tall) continue;

        const fire = pending.get(entry.target);
        pending.delete(entry.target);
        observer?.unobserve(entry.target);
        fire?.();
      }
    },
    // The bottom inset means a block reveals a little after it clears the fold rather than
    // the instant its first pixel appears.
    { rootMargin: "0px 0px -12% 0px", threshold: [0, RATIO] },
  );
  return observer;
}

/**
 * Reveals the element the ref is attached to the first time it scrolls into view.
 *
 * @param enabled pass false to leave the element alone (it stays visible).
 */
export default function useReveal<T extends HTMLElement>(enabled = true): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const io = getObserver();
    if (!io) {
      // No IntersectionObserver: show everything rather than hide it forever.
      el.classList.add(IN);
      return;
    }

    const reveal = () => el.classList.add(IN);
    pending.set(el, reveal);
    io.observe(el);

    return () => {
      pending.delete(el);
      io.unobserve(el);
    };
  }, [enabled]);

  return ref;
}

/**
 * Stagger step for children of a revealing group.
 *
 *     {items.map((item, i) => <li className="kp-reveal" style={revealDelay(i)} …
 */
export function revealDelay(index: number, step = 70): CSSProperties {
  return { "--kp-delay": `${index * step}ms` } as CSSProperties;
}
