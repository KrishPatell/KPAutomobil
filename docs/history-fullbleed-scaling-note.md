# Fix: KP Automobil site not filling the screen (fixed-width white space)

## Context

On monitors wider than 1440px the site renders at a fixed 1440px width, pinned to the
left edge, leaving a dead white strip on the right (see
`src/imports/Screenshot_2026-09-04_at_6.35.12_PM.png`). This is not a rendering bug — it
is the architecture: the app renders an imported Figma frame
(`src/imports/1440WLight`) that is a single **1440px-wide, absolutely-positioned** export,
and the mobile equivalent (`src/imports/390WLight`) is a fixed 390px frame. These imports
are generated/read-only.

`src/index.css` currently:
- pins `.kp-automobil__desktop { width: 1440px }` and `.kp-site-footer { width: 1440px }`
- scales the design **down** only for viewports 768–1439px via
  `@media (min-width: 768px) and (max-width: 1439px) { zoom: calc(100vw / 1440px) }`
- has **no rule above 1440px**, so wide screens keep the frame at natural 1440px → white space.

**Desired outcome (user choice):** true edge-to-edge — proportionally scale the whole
1440px design *up* so it always fills `100vw` at any width. Tradeoff accepted: on ultrawide
monitors all content (text/images) grows proportionally.

## Approach

All changes are in `src/index.css` only. No changes to `src/App.tsx`, components, or the
read-only imports are required.

### 1. Scale the desktop frame at all widths ≥ 768px
Change the existing bounded media query so the proportional `zoom` applies at every desktop
width, not just below 1440px. This makes the frame shrink below 1440 and grow above it,
always filling the viewport.

Replace:
```css
@media (min-width: 768px) and (max-width: 1439px) {
  .kp-automobil__desktop { zoom: calc(100vw / 1440px); }
  .kp-site-footer { zoom: calc(100vw / 1440px); }
}
```
with an unbounded desktop rule:
```css
@media (min-width: 768px) {
  .kp-automobil__desktop { zoom: calc(100vw / 1440px); }
  .kp-site-footer { zoom: calc(100vw / 1440px); }
}
```
(The `@media (max-width: 767px)` mobile block already sets `.kp-automobil__desktop { display: none }`
and switches to the 390px mobile frame, so this rule never affects mobile.)

### 2. Confirm the footer scales in lockstep
The footer is a hand-built component (`SiteFooter` in `src/App.tsx`) fixed at
`width: 1440px`. It is already covered by the same rule above, so it scales identically to
the desktop frame — no separate change needed beyond keeping it inside the media query.

### 3. Nav note (no change unless desired)
`.kp-nav` is `position: fixed`, full-width, with a centered `max-width: 820px` pill, and
lives outside `.kp-automobil__desktop`, so it is **not** affected by `zoom` — it stays a
normal, centered pill at all widths. This is the intended floating-nav behavior; leave as-is.

## Files to modify
- `src/index.css` — the one media-query edit described in step 1 (lines ~308–316).

## Verification
1. The Vite dev server is already running on `$PORT`; open the preview.
2. Resize the browser wide (>1440px, e.g. 1920 and 2560): the design must fill the full
   width with **no white strip** on the right; the hero image spans corner to corner.
3. Resize to a laptop width (~1280px) and tablet (~800px): design scales down smoothly,
   still full-bleed, no horizontal scrollbar.
4. Resize below 768px: the 390px mobile frame takes over and fills the width.
5. Confirm no horizontal overflow appears at any width (body already has
   `overflow-x: hidden`).
