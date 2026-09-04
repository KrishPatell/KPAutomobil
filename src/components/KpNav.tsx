type KpNavProps = {
  onBook: () => void;
  onNavigate: (label: string) => void;
};

const links: Array<{ label: string; target: string }> = [
  { label: "Packages", target: "Designed" },
  { label: "Results", target: "Difference." },
  { label: "Reviews", target: "Loved" },
  { label: "FAQ", target: "Frequently" },
];

export default function KpNav({ onBook, onNavigate }: KpNavProps) {
  return (
    <header className="kp-nav" aria-label="Primary">
      <div className="kp-nav__pill">
        <button
          type="button"
          className="kp-nav__brand"
          onClick={() => onNavigate("Mobile detailing with a real price upfront")}
          aria-label="KP Automobil — back to top"
        >
          KP<span>Automobil</span>
        </button>
        <nav className="kp-nav__links" aria-label="Sections">
          {links.map((link) => (
            <button key={link.label} type="button" onClick={() => onNavigate(link.target)}>
              {link.label}
            </button>
          ))}
        </nav>
        <button type="button" className="kp-nav__cta" onClick={onBook}>
          Book Now <span aria-hidden="true">→</span>
        </button>
      </div>
    </header>
  );
}
