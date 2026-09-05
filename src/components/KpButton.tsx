// One button. The page shipped four: the nav pill CTA, the hero CTA (33px tall with a black
// arrow chip, visibly thinner than the nav's — the mismatch Kunj spotted), the services CTA and
// the footer CTA, each with its own padding, radius and arrow treatment.
//
// Two sizes only: `sm` (38px) inside chrome like the nav and footer, `md` (46px) for the CTAs
// that sit in the page itself. Everything else — type, radius, arrow, hover, focus ring — is
// shared, so a button looks the same wherever it lands.

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md";
type Variant = "light" | "dark" | "ghost";

type KpButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  /** Trailing arrow. On by default — it is what makes these read as calls to action. */
  arrow?: boolean;
};

export default function KpButton({
  children,
  size = "md",
  variant = "light",
  arrow = true,
  className,
  type = "button",
  ...rest
}: KpButtonProps) {
  const classes = ["kp-btn", `kp-btn--${size}`, `kp-btn--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...rest}>
      <span className="kp-btn__label">{children}</span>
      {arrow && <span className="kp-btn__arrow" aria-hidden="true">→</span>}
    </button>
  );
}
