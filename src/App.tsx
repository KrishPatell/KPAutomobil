import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import DesktopDesign from "./imports/1440WLight";
import MobileDesign from "./imports/390WLight";
import KpNav from "./components/KpNav";
import { packages, faqs } from "./components/kpContent";

const serviceLabels = packages.map((pkg) => pkg.title);

const copyMap: Record<string, string> = {
  "Gomobil": "KP Automobil",
  "Gomobil Shop": "KP Automobil",
  "About Gomobil": "About KP Automobil",
  "Why Choose Gomobil": "Why KP Automobil",
  "© 2026 Gomobil. All Rights Reserved.": "© 2026 KP Automobil. All Rights Reserved.",
  "hello@gomobil.com": "[EMAIL]",
  "(323) 555-1234": "[PHONE]",
  "1234 Wilshire Blvd, Los Angeles, CA 90017": "[CITY], [REGION]",
  "Serving Los Angeles, CA": "Serving [CITY], [REGION]",
  "Serving Los Angeles, California.": "Serving [CITY], [REGION].",
  "New Customers Save 15% On Their First Detail. Book Today.": "$50 holds your slot. Fully refundable with 24+ hours notice.",
  "Mobile Car Wash & Detailing": "Mobile detailing with a real price upfront",
  "Professional mobile detailing tailored to your vehicle's condition, lifestyle, and maintenance needs.": "Send four photos. See your price. No callback required.",
  "Express Wash": "Interior Refresh",
  "Interior Detail": "Full Detail",
  "Premium Detail": "Deep Restoration",
  "Paint Correction": "Ceramic Coating",
  "Window Tint": "Hand Wax",
  "Starting at $79": "Price shown before you book",
  "850+": "$50",
  "Vehicles Serviced": "Refundable deposit",
  "100%": "0%",
  "4.8": "4",
  "/5": "photos",
  "Excellent": "One clear price",
  "Based on 356+ Car Owners": "2 interior + 2 exterior shots",
  "Our fully equipped mobile detailing team arrives directly at your home, office, apartment, or garage with everything needed to complete the service.": "Kunj arrives at your driveway with everything needed. Home, work, or apartment — your car stays where it is.",
  "Professional mobile detailing designed to deliver a more convenient, reliable, and premium vehicle care experience.": "No vague quote. No card fee. No price change at your driveway.",
  "A straightforward process designed around convenience, quality, and exceptional results.": "A straightforward quote flow. Four photos. A real price in about a minute.",
  "Choose the service that best fits your vehicle and preferred schedule. We'll confirm your appointment and handle the rest.": "Choose a package, select your vehicle size, then upload two interior and two exterior photos.",
  "Select a service": "Choose a package",
  "Select your vehicle type": "Choose vehicle size",
  "Select your preferred date": "Pick a time",
  "Book In Minutes": "Price before booking",
  "We Come To You": "We come to you",
  "No Waiting Time": "No waiting for a quote",
  "Dedicated Service": "Owner-operated",
  "Personalized Care": "Price in writing",
  "Premium Products": "No card fees",
  "Quality Over Speed": "No driveway upsell",
  "Frequently Asked Questions.": "Questions, answered plainly.",
  "Fill out the form and our team will reach out shortly to confirm your appointment.": "Start with your vehicle, then upload four photos to see your real price before paying the deposit.",
  "Message": "Vehicle notes",
  "Tell us about your vehicle or any special requests": "Anything we should price in? Pet hair, stains, odour, or personal items.",
};

function SiteFooter({ onBook }: { onBook: () => void }) {
  return (
    <footer className="kp-site-footer" aria-label="KP Automobil footer">
      <div className="kp-site-footer__grid">
        <section className="kp-site-footer__brand">
          <div className="kp-site-footer__mark" aria-label="KP Automobil">KP<span>Automobil</span></div>
          <p>Mobile detailing with the price shown before you book.</p>
          <button type="button" onClick={onBook}>Start your quote <span>↗</span></button>
          <div className="kp-site-footer__contact">
            <strong>Contact</strong>
            <a href="tel:[PHONE]">[PHONE]</a>
            <a href="mailto:[EMAIL]">[EMAIL]</a>
            <a href="https://maps.google.com/?q=[CITY]+[REGION]" target="_blank" rel="noreferrer">[CITY], [REGION] ↗</a>
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
            <a href="#pricing">Pricing promise</a>
            <a href="#booking">Book a detail</a>
            <a href="#sitemap">Sitemap</a>
          </div>
          <a className="kp-site-footer__map" href="https://maps.google.com/?q=[CITY]+[REGION]" target="_blank" rel="noreferrer">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.24 7-12A7 7 0 1 0 5 9c0 6.76 7 12 7 12Z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="9" r="2.35" stroke="currentColor" strokeWidth="1.7"/></svg>
            <span><b>Service area</b><small>[CITY], [REGION]</small></span><em>↗</em>
          </a>
        </nav>
      </div>
      <div className="kp-site-footer__bottom">
        <span>© 2026 KP Automobil. All rights reserved.</span>
        <span>Card, Zelle, or cash — one price.</span>
        <div><a href="#instagram">Instagram</a><a href="#facebook">Facebook</a><a href="#tiktok">TikTok</a></div>
      </div>
    </footer>
  );
}

export default function App() {
  const pageRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(packages[0].title);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(query.matches);
    query.addEventListener("change", updateViewport);
    return () => query.removeEventListener("change", updateViewport);
  }, []);

  useLayoutEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];
    const all = () => Array.from(root.querySelectorAll("p"));

    // 1. Text replacement.
    all().forEach((element) => {
      const current = element.textContent?.trim();
      if (current && copyMap[current]) element.textContent = copyMap[current];
    });

    // 2. Hide imported chrome we replace (footer, nav, promo strip).
    root.querySelectorAll('[data-name="Footer"]').forEach((el) => el.classList.add("kp-imported-footer"));
    root.querySelectorAll('[data-name="Banner"]').forEach((el) => el.classList.add("kp-hide-imported"));
    root.querySelectorAll('[data-name="Section"]').forEach((el) => {
      if (el.className.includes("h-[31.2px]")) el.classList.add("kp-hide-imported");
    });

    // 3. Keep tight labels on a single line.
    ["About KP Automobil", "Serving [CITY], [REGION]", "Serving [CITY], [REGION].", "Vehicles We Service"].forEach((txt) => {
      all().forEach((p) => {
        if (p.textContent?.trim() === txt) (p as HTMLElement).style.whiteSpace = "nowrap";
      });
    });

    // 4. Reframe the hero proof card (KP is new — no fabricated ratings).
    const metric = all().find((p) => p.textContent?.trim() === "4");
    metric?.closest('[data-name="Paragraph"]')?.classList.add("kp-quote-metric");

    // 5. Stats card: relabel the ambiguous "Reviews" stat. Since the testimonials section was
    // extracted, "Reviews" is the stat label and nothing else, so no class guard is needed —
    // the old 18.72px guard silently skipped the mobile frame, which uses 20.8px.
    all().forEach((p) => {
      if (p.textContent?.trim() === "Reviews") p.textContent = "Card fee";
    });

    // 6. Working package tabs + corrected hierarchy content.
    const panel = root.querySelector('[data-name="Tabpanel"]');
    const tabs = Array.from(root.querySelectorAll('[data-name="Tab"]'));
    const applyPackage = (index: number) => {
      const pkg = packages[index];
      if (!panel || !pkg) return;
      const title = panel.querySelector('[class*="text-[24.5px]"] p');
      if (title) title.textContent = pkg.title;
      const descWrap = panel.querySelector('[class*="text-[#aaa]"][class*="text-[14.4px]"]');
      if (descWrap) {
        const ps = descWrap.querySelectorAll("p");
        if (ps[0]) ps[0].textContent = pkg.descLines[0];
        if (ps[1]) ps[1].textContent = pkg.descLines[1];
      }
      const img = panel.querySelector("img");
      if (img) img.setAttribute("src", pkg.image);
      const items = panel.querySelectorAll('[class*="text-white"][class*="text-[14.4px]"]');
      items.forEach((wrap, i) => {
        const row = wrap.parentElement as HTMLElement | null;
        const p = wrap.querySelector("p");
        if (i < pkg.included.length) {
          if (p) p.textContent = pkg.included[i];
          if (row) row.style.display = "";
        } else if (row) {
          row.style.display = "none";
        }
      });
      tabs.forEach((t, ti) => t.classList.toggle("kp-tab--active", ti === index));
      if (panel instanceof HTMLElement) {
        panel.classList.remove("kp-tab-swap");
        void panel.offsetWidth;
        panel.classList.add("kp-tab-swap");
      }
    };
    tabs.forEach((tab, index) => {
      const el = tab as HTMLElement;
      el.style.cursor = "pointer";
      el.setAttribute("role", "button");
      el.tabIndex = 0;
      const onTab = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
        applyPackage(index);
        setSelectedService(packages[index].title);
      };
      el.addEventListener("click", onTab);
      cleanups.push(() => el.removeEventListener("click", onTab));
    });
    if (tabs.length) applyPackage(0);

    // 7. Before/After draggable comparison slider.
    const divider = root.querySelector('[data-name="Vertical Divider"]') as HTMLElement | null;
    const frame = divider?.parentElement as HTMLElement | null;
    const clip = frame?.querySelector('[data-name="Container"]') as HTMLElement | null;
    if (divider && frame && clip) {
      frame.classList.add("kp-ba");
      const setSplit = (ratio: number) => {
        const r = Math.min(0.98, Math.max(0.02, ratio));
        clip.style.right = `${(1 - r) * 100}%`;
        divider.style.left = `${r * 100}%`;
        divider.style.right = `${(1 - r) * 100}%`;
      };
      setSplit(0.5);
      let dragging = false;
      const ratioFrom = (clientX: number) => {
        const rect = frame.getBoundingClientRect();
        return (clientX - rect.left) / rect.width;
      };
      const onDown = (ev: PointerEvent) => { dragging = true; setSplit(ratioFrom(ev.clientX)); ev.preventDefault(); };
      const onMove = (ev: PointerEvent) => { if (dragging) setSplit(ratioFrom(ev.clientX)); };
      const onUp = () => { dragging = false; };
      const onKey = (ev: KeyboardEvent) => {
        const cur = parseFloat(divider.style.left || "50") / 100;
        if (ev.key === "ArrowLeft") { setSplit(cur - 0.04); ev.preventDefault(); }
        if (ev.key === "ArrowRight") { setSplit(cur + 0.04); ev.preventDefault(); }
      };
      frame.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      divider.tabIndex = 0;
      divider.setAttribute("role", "slider");
      divider.setAttribute("aria-label", "Drag to compare before and after");
      divider.addEventListener("keydown", onKey);
      cleanups.push(() => {
        frame.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        divider.removeEventListener("keydown", onKey);
      });
    }

    // 8. FAQ accordion.
    const faqRows = Array.from(root.querySelectorAll('[data-name="Button menu"]'))
      .map((bm) => ({ bm: bm as HTMLElement, row: bm.closest('[data-name="HorizontalBorder"]') as HTMLElement | null }))
      .filter((entry): entry is { bm: HTMLElement; row: HTMLElement } => Boolean(entry.row));
    faqRows.forEach(({ bm, row }, index) => {
      row.classList.add("kp-faq-row");
      const data = faqs[index];
      if (data) {
        const q = bm.querySelector('[class*="text-[#222]"] p');
        if (q) q.textContent = data.question;
        const answer = row.querySelector('[class*="opacity-0"]') as HTMLElement | null;
        if (answer) {
          answer.classList.add("kp-faq-answer");
          const aps = answer.querySelectorAll("p");
          if (aps[0]) aps[0].textContent = data.answer;
          for (let k = 1; k < aps.length; k += 1) aps[k].textContent = "";
        }
      }
      bm.style.cursor = "pointer";
      const toggle = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
        const open = row.classList.toggle("kp-faq--open");
        const answer = row.querySelector(".kp-faq-answer") as HTMLElement | null;
        if (open) {
          const h = answer ? answer.scrollHeight : 60;
          row.style.height = `${44 + h + 18}px`;
        } else {
          row.style.height = "";
        }
      };
      bm.addEventListener("click", toggle);
      cleanups.push(() => bm.removeEventListener("click", toggle));
    });

    // 9. Tag the Recent Work section for a cleaner restyle.
    const sections = Array.from(root.querySelectorAll('[data-name="Section"]')) as HTMLElement[];
    const recent = sections.find((s) =>
      Array.from(s.querySelectorAll("p")).some((p) => p.textContent?.trim() === "Recent Work"),
    );
    recent?.classList.add("kp-recent");

    return () => cleanups.forEach((fn) => fn());
  }, [isMobile]);

  function scrollToLabel(label: string) {
    const root = pageRef.current;
    if (!root) return;
    // Extracted sections are addressed by id ("#promise"). Sections still living in the
    // generated frame have no ids, so they fall back to matching their heading text.
    const target = label.startsWith("#")
      ? root.querySelector(label)
      : Array.from(root.querySelectorAll("p")).find(
          (element) => element.textContent?.trim() === label,
        );
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openBooking() {
    setSent(false);
    setBookingOpen(true);
  }

  function handlePageClick(event: MouseEvent<HTMLElement>) {
    const trigger = (event.target as HTMLElement).closest("button, [role='button']");
    if (!trigger) return;
    if (trigger.closest('[data-name="Tab"], [data-name="Button menu"], [data-name="Vertical Divider"]')) return;
    const label = trigger.textContent?.replace(/\s+/g, " ").trim() || "";

    if (label.includes("Book Now") || label.includes("Get Started") || label.includes("Start your quote")) {
      event.preventDefault();
      openBooking();
    }
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main
      className="kp-automobil"
      aria-label="KP Automobil mobile detailing"
      onClick={handlePageClick}
      ref={pageRef}
    >
      <KpNav onBook={openBooking} onNavigate={scrollToLabel} />
      {isMobile ? (
        <div className="kp-automobil__mobile"><MobileDesign /></div>
      ) : (
        <div className="kp-automobil__desktop"><DesktopDesign /></div>
      )}
      <SiteFooter onBook={openBooking} />
      {bookingOpen && (
        <div className="kp-booking" role="dialog" aria-modal="true" aria-label="Book a detailing service">
          <button className="kp-booking__scrim" aria-label="Close booking form" onClick={() => setBookingOpen(false)} />
          <section className="kp-booking__panel">
            <button className="kp-booking__close" aria-label="Close" onClick={() => setBookingOpen(false)}>×</button>
            <p className="kp-booking__eyebrow">REAL PRICE · NO CALLBACK</p>
            <h2>Start your instant quote.</h2>
            {sent ? (
              <div className="kp-booking__success"><strong>Next: four photos.</strong><span>We’ll use two interior and two exterior shots to confirm your written price before you pay the $50 deposit.</span></div>
            ) : (
              <form onSubmit={submitBooking}>
                <label>Name<input required name="name" placeholder="Your name" /></label>
                <label>Phone<input required name="phone" type="tel" placeholder="(000) 000–0000" /></label>
                <label>Service<select name="service" defaultValue={selectedService}>{serviceLabels.map((service) => <option key={service}>{service}</option>)}</select></label>
                <label>Vehicle size<select name="vehicle-size" defaultValue=""><option value="" disabled>Choose size</option><option>Sedan</option><option>SUV</option><option>Three-row SUV</option><option>Truck</option></select></label>
                <button type="submit">Continue to photos <span>↗</span></button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
