import { useNavigate } from "react-router-dom";
import KpNav from "./components/KpNav";
import BrandMark from "./components/BrandMark";
import KpButton from "./components/KpButton";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Vehicles from "./sections/Vehicles";
import Process from "./sections/Process";
import Results from "./sections/Results";
import Work from "./sections/Work";
import WhyChoose from "./sections/WhyChoose";
import Commitments from "./sections/Commitments";
import Faq from "./sections/Faq";
import Book from "./sections/Book";
import useReveal from "./lib/useReveal";
import { type SizeId } from "./content/vehicles";
import { site, location, mapsUrl, telHref, mailHref } from "./content/site";

function SiteFooter({ onBook }: { onBook: () => void }) {
  const socials = site.socials.filter((s): s is { label: string; href: string } => Boolean(s.href));
  // The footer's type-in animation used to run on mount, eleven thousand pixels above the fold,
  // so it had always finished by the time anyone scrolled here. Now it waits for the footer.
  const revealRef = useReveal<HTMLElement>();
  return (
    <footer className="kp-site-footer" ref={revealRef} aria-label={`${site.name} footer`}>
      <div className="kp-site-footer__grid">
        <section className="kp-site-footer__brand">
          <div className="kp-site-footer__mark" aria-label={site.name}><BrandMark /></div>
          <p>{site.tagline}</p>
          <KpButton size="sm" onClick={onBook}>Start your quote</KpButton>
          <div className="kp-site-footer__contact">
            <strong>Contact</strong>
            {telHref && <a href={telHref}>{site.phone}</a>}
            {mailHref && <a href={mailHref}>{site.email}</a>}
            <a href={mapsUrl} target="_blank" rel="noreferrer">{location} ↗</a>
          </div>
        </section>
        <nav className="kp-site-footer__column" aria-label="Company">
          <strong>Company</strong>
          <a href="#top">Home</a>
          <a href="#about">About KP</a>
          <a href="#services">Packages</a>
          <a href="#process">How it works</a>
        </nav>
        <nav className="kp-site-footer__column" aria-label="Services">
          <strong>Services</strong>
          <a href="#services">Interior Refresh</a>
          <a href="#services">Full Detail</a>
          <a href="#services">Deep Restoration</a>
          <a href="#services">Ceramic Coating</a>
          <div className="kp-site-footer__services-info">
            <strong>Information</strong>
            <a href="#faq">FAQ</a>
            <a href="#promise">Pricing promise</a>
            <a href="#book">Book a detail</a>
          </div>
          <a className="kp-site-footer__map" href={mapsUrl} target="_blank" rel="noreferrer">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.24 7-12A7 7 0 1 0 5 9c0 6.76 7 12 7 12Z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="9" r="2.35" stroke="currentColor" strokeWidth="1.7"/></svg>
            <span><b>Service area</b><small>{location}</small></span><em>↗</em>
          </a>
        </nav>
      </div>
      <div className="kp-site-footer__bottom-wrap"><div className="kp-site-footer__bottom">
        <span>© 2026 {site.name}. All rights reserved.</span>
        <span>Card, Zelle, or cash — one price.</span>
        {socials.length > 0 && (
          <div>{socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>)}</div>
        )}
      </div></div>
    </footer>
  );
}

/**
 * The page is now twelve real sections and a footer.
 *
 * Everything that used to be here — the two imported Figma frames, the `isMobile` branch that
 * swapped between them, the `copyMap` that rewrote their text at runtime, the delegated click
 * handler that matched buttons by their label, and the four-field booking modal — is gone. Each
 * section owns its own copy (`src/content/`), its own markup, and its own handlers, and the page
 * is responsive at every width instead of being a 1440px canvas scaled with `zoom`.
 */
export default function App() {
  const navigate = useNavigate();

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * Every CTA on the page lands in the one real flow at /book/. There used to be a modal as well,
   * with four fields to the section form's eight, so whoever clicked "Book Now" got the worse
   * form. Now there is a single destination, and the sections that already know something about
   * the visitor hand it over in the query string rather than asking again — see the ?size= /
   * ?package= reader in src/routes/book/BookFlow.tsx.
   */
  function openBooking() {
    navigate("/book");
  }

  /** Opens the flow with the package the visitor was reading already chosen. */
  function bookPackage(packageTitle: string) {
    navigate(`/book?package=${encodeURIComponent(packageTitle)}`);
  }

  /** A vehicle tile answers step one of the quote, so the flow opens on step two. */
  function bookSize(size: SizeId) {
    navigate(`/book?size=${encodeURIComponent(size)}`);
  }

  return (
    <main className="kp-automobil" aria-label={`${site.name} mobile detailing`} id="top">
      <KpNav onBook={openBooking} onNavigate={scrollTo} />
      <Hero onExplore={() => scrollTo("#services")} />
      <About />
      <Services onBook={bookPackage} />
      <Vehicles onSelectSize={bookSize} />
      <Process onStart={openBooking} />
      <Results />
      <Work onBook={bookPackage} />
      <WhyChoose />
      <Commitments />
      <Faq />
      <Book />
      <SiteFooter onBook={openBooking} />
    </main>
  );
}
