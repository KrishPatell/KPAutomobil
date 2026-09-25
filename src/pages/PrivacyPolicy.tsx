import PageHead from "../components/PageHead"
import { site } from "../content/site"

export default function PrivacyPolicy() {
  return (
    <>
      <PageHead
        eyebrow="Privacy"
        heading="The information we collect and why."
        standfirst="We use the details you submit to prepare your quote, arrange the service, and process your deposit."
        title="Privacy Policy"
      />
      <section className="section terms-section">
        <div className="terms-section__head">
          <p>
            Quote details, contact information, vehicle photos, and payment
            status are used only to handle your request and provide the booked
            service. Card details are handled by Stripe and are not stored by
            {` ${site.name}`}.
          </p>
          <p>
            To request access, correction, or deletion of your information,
            email <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </section>
    </>
  )
}
