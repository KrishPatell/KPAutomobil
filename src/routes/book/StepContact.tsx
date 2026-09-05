import KpButton from "../../components/KpButton";
import { bookFlow } from "../../content/bookFlow";
import { booking } from "../../content/booking";
import type { StepProps } from "./BookFlow";

/** Today, as the `min` for the date input — nobody books a detail in the past. */
function today(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Step 5. These are the fields the homepage form used to collect on its own; they live here now so
 * there is one place a booking is filled in rather than two competing ones.
 *
 * Email is optional on purpose. KP replies by text, and demanding an address for a job that is
 * quoted and confirmed over the phone is a field that only loses bookings.
 */
export default function StepContact({ state, set, next, goTo }: StepProps) {
  const ready = state.name.trim() !== "" && state.phone.trim() !== "" && state.date !== "";

  return (
    <section className="kp-step">
      <h1 className="kp-step__heading">{bookFlow.contact.heading}</h1>
      <p className="kp-step__lede">{bookFlow.contact.lede}</p>

      <form
        className="kp-step__form"
        onSubmit={(event) => {
          event.preventDefault();
          if (ready) next();
        }}
      >
        <label className="kp-field">
          <span className="kp-field__label">{booking.fields.name.label}</span>
          <input
            autoComplete="name"
            name="name"
            onChange={(event) => set({ name: event.target.value })}
            placeholder={booking.fields.name.placeholder}
            required
            value={state.name}
          />
        </label>

        <label className="kp-field">
          <span className="kp-field__label">{booking.fields.phone.label}</span>
          <input
            autoComplete="tel"
            name="phone"
            onChange={(event) => set({ phone: event.target.value })}
            placeholder={booking.fields.phone.placeholder}
            required
            type="tel"
            value={state.phone}
          />
          <span className="kp-field__hint">{booking.fields.phone.hint}</span>
        </label>

        <label className="kp-field">
          <span className="kp-field__label">{booking.fields.email.label}</span>
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => set({ email: event.target.value })}
            placeholder={booking.fields.email.placeholder}
            type="email"
            value={state.email}
          />
          <span className="kp-field__hint">{booking.fields.email.hint}</span>
        </label>

        <label className="kp-field">
          <span className="kp-field__label">{booking.fields.date.label}</span>
          <input
            min={today()}
            name="date"
            onChange={(event) => set({ date: event.target.value })}
            required
            type="date"
            value={state.date}
          />
          <span className="kp-field__hint">{booking.fields.date.hint}</span>
        </label>

        <label className="kp-field">
          <span className="kp-field__label">{booking.fields.window.label}</span>
          <select
            name="window"
            onChange={(event) => set({ window: event.target.value })}
            value={state.window || booking.windows[0]}
          >
            {booking.windows.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </label>

        <label className="kp-field kp-field--wide">
          <span className="kp-field__label">{booking.fields.notes.label}</span>
          <textarea
            name="notes"
            onChange={(event) => set({ notes: event.target.value })}
            placeholder={booking.fields.notes.placeholder}
            rows={3}
            value={state.notes}
          />
        </label>

        <div className="kp-step__actions kp-step__actions--form">
          <button className="kp-step__back" onClick={() => goTo("photos")} type="button">
            {bookFlow.back}
          </button>
          <KpButton disabled={!ready} size="md" type="submit">
            {bookFlow.next}
          </KpButton>
        </div>
      </form>
    </section>
  );
}
