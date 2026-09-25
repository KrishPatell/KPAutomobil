import CtaBand from "../components/CtaBand"
import PageHead from "../components/PageHead"
import { Eyebrow, Reveal } from "../components/primitives"
import { bookingTerms } from "../content/bookingTerms"
import { pageCopy } from "../content/pages"

export default function BookingTerms() {
  return (
    <>
      <PageHead
        eyebrow={pageCopy.bookingTerms.eyebrow}
        heading={pageCopy.bookingTerms.heading}
        standfirst={pageCopy.bookingTerms.standfirst}
        title="Booking Terms"
      />

      <section className="section terms-section">
        <div className="terms-section__head">
          <Reveal>
            <Eyebrow>{bookingTerms.eyebrow}</Eyebrow>
          </Reveal>
          <div>
            <Reveal className="delay-1">
              <h2>{bookingTerms.heading}</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>{bookingTerms.intro}</p>
            </Reveal>
          </div>
        </div>

        <ol className="terms-list">
          {bookingTerms.items.map((item, index) => (
            <Reveal
              as="li"
              className={`delay-${Math.min(index + 1, 4)}`}
              key={item.label}
            >
              <span>{item.label}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <CtaBand />
    </>
  )
}
