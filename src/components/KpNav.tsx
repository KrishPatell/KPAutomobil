import BrandMark from "./BrandMark";
import KpButton from "./KpButton";
import { site } from "../content/site";

type KpNavProps = {
  onBook: () => void;
  onNavigate: (label: string) => void;
};

const links: Array<{ label: string; target: string }> = [
  { label: "Packages", target: "#services" },
  { label: "Results", target: "#results" },
  { label: "Promise", target: "#promise" },
  { label: "FAQ", target: "#faq" },
];

export default function KpNav({ onBook, onNavigate }: KpNavProps) {
  return (
    <header className="kp-nav" aria-label="Primary">
      <div className="kp-nav__pill">
        <button
          type="button"
          className="kp-nav__brand"
          onClick={() => onNavigate("Mobile detailing with a real price upfront")}
          aria-label={`${site.name} — back to top`}
        >
          <BrandMark />
        </button>
        <nav className="kp-nav__links" aria-label="Sections">
          {links.map((link) => (
            <button key={link.label} type="button" onClick={() => onNavigate(link.target)}>
              {link.label}
            </button>
          ))}
        </nav>
        <KpButton size="sm" onClick={onBook}>Book Now</KpButton>
      </div>
    </header>
  );
}
