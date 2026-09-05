import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import KpButton from "../components/KpButton";
import SectionEyebrow from "../components/SectionEyebrow";
import useReveal, { revealDelay } from "../lib/useReveal";
import { load, save } from "../lib/bookingFlow";
import { booking } from "../content/booking";
import { packages } from "../content/services";
import { sizes } from "../content/vehicles";

/** Today, as the `min` for the date input — nobody books a detail in the past. */
function today(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * The homepage's fast path into the quote flow.
 *
 * This is not a second booking form. It collects everything /book/ asks for except the photos and
 * the add-ons, writes it into the flow's own state, and drops the visitor at /book/photos with
 * five of the seven steps already answered. There is exactly one place a booking is completed, and
 * it is not here — that is what stops the page having two forms of different quality again.
 */
export default function Book() {
  const draft = load();
  const navigate = useNavigate();
  const [chosenSize, setChosenSize] = useState(
    sizes.find((entry) => entry.id === draft.size)?.name ?? "",
  );
  const [chosenService, setChosenService] = useState(draft.service ?? "");
  const headRef = useReveal<HTMLDivElement>();
  const formRef = useReveal<HTMLDivElement>();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "");
    save({
      ...load(),
      size: sizes.find((entry) => entry.name === text("size"))?.id ?? null,
      service: text("service") || null,
      name: text("name"),
      phone: text("phone"),
      email: text("email"),
      date: text("date"),
      window: text("window"),
      notes: text("notes"),
    });
    navigate("/book/photos");
  }

  return (
    <section aria-labelledby="book-heading" className="kp-section kp-book" id="book">
      <div className="kp-book__grid">
        <div className="kp-book__head kp-reveal" ref={headRef}>
          <div className="kp-reveal">
            <SectionEyebrow>{booking.eyebrow}</SectionEyebrow>
          </div>
          <h2 className="kp-section__title kp-reveal" id="book-heading" style={revealDelay(1)}>
            {booking.heading}
          </h2>
          <p className="kp-book__lede kp-reveal" style={revealDelay(2)}>{booking.intro}</p>
          <div className="kp-book__next kp-reveal" style={revealDelay(3)}>
            <h3>{booking.next.label}</h3>
            <ol>
              {booking.next.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="kp-book__panel kp-reveal" ref={formRef}>
          <form className="kp-book__form" onSubmit={onSubmit}>
            <label className="kp-field">
              <span className="kp-field__label">{booking.fields.name.label}</span>
              <input
                autoComplete="name"
                defaultValue={draft.name}
                name="name"
                placeholder={booking.fields.name.placeholder}
                required
              />
            </label>

            <label className="kp-field">
              <span className="kp-field__label">{booking.fields.phone.label}</span>
              <input
                autoComplete="tel"
                defaultValue={draft.phone}
                name="phone"
                placeholder={booking.fields.phone.placeholder}
                required
                type="tel"
              />
              <span className="kp-field__hint">{booking.fields.phone.hint}</span>
            </label>

            <label className="kp-field">
              <span className="kp-field__label">{booking.fields.email.label}</span>
              <input
                autoComplete="email"
                defaultValue={draft.email}
                name="email"
                placeholder={booking.fields.email.placeholder}
                type="email"
              />
              <span className="kp-field__hint">{booking.fields.email.hint}</span>
            </label>

            <label className="kp-field">
              <span className="kp-field__label">{booking.fields.size.label}</span>
              <select name="size" onChange={(e) => setChosenSize(e.target.value)} required value={chosenSize}>
                <option disabled value="">{booking.fields.size.placeholder}</option>
                {sizes.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label className="kp-field kp-field--wide">
              <span className="kp-field__label">{booking.fields.service.label}</span>
              <select name="service" onChange={(e) => setChosenService(e.target.value)} required value={chosenService}>
                <option disabled value="">{booking.fields.service.placeholder}</option>
                {packages.map((item) => (
                  <option key={item.title}>{item.title}</option>
                ))}
              </select>
            </label>

            <label className="kp-field">
              <span className="kp-field__label">{booking.fields.date.label}</span>
              <input defaultValue={draft.date} min={today()} name="date" required type="date" />
              <span className="kp-field__hint">{booking.fields.date.hint}</span>
            </label>

            <label className="kp-field">
              <span className="kp-field__label">{booking.fields.window.label}</span>
              <select defaultValue={draft.window || booking.windows[0]} name="window">
                {booking.windows.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </label>

            <label className="kp-field kp-field--wide">
              <span className="kp-field__label">{booking.fields.notes.label}</span>
              <textarea
                defaultValue={draft.notes}
                name="notes"
                placeholder={booking.fields.notes.placeholder}
                rows={3}
              />
            </label>

            <div className="kp-book__actions">
              <KpButton type="submit">{booking.submit}</KpButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
