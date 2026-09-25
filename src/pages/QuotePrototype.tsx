// A single-path request-for-price flow. Each choice opens the next full-screen
// section, keeping the context connected without putting the customer in a maze
// of small forms.

import { useEffect, useRef, useState } from "react"
import { Link, useRoute } from "../router"
import { Arrow, Mark } from "../components/primitives"
import { bookFlow } from "../content/bookFlow"
import { addOns, conditions, quoteServiceChoices } from "../content/services"
import type { ConditionId } from "../content/services"
import { quoteBodyStyles, sizeLabels } from "../content/vehicles"
import { startingPrice } from "../content/pricing"
import { media } from "../content/media"
import { site } from "../content/site"
import { send } from "../lib/booking"
import { preview, validate } from "../lib/photos"

type Answers = Record<ConditionId, boolean | null>
type Step = "service" | "vehicle" | "addons" | "location" | "condition" | "photos" | "contact" | "policies"
type PhotoId = "front" | "rear" | "cabin" | "seats"
type GooglePlace = { formatted_address?: string name?: string }
type GoogleAutocomplete = {
  addListener: (event: "place_changed", listener: () => void) => void
  getPlace: () => GooglePlace
}

type CheckoutVerification = {
  amountTotal: number | null
  currency: string | null
  orderId: string | null
  paid: boolean
  products: Array<{
    amountTotal: number
    description: string
    quantity: number | null
  }>
  status: string | null
}

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options: {
              componentRestrictions: { country: string }
              fields: string[]
            },
          ) => GoogleAutocomplete
        }
      }
    }
  }
}

const steps: Array<{ id: Step label: string }> = [
  { id: "service", label: "Service" },
  { id: "vehicle", label: "Vehicle" },
  { id: "addons", label: "Add-ons" },
  { id: "location", label: "Your car" },
  { id: "condition", label: "Condition" },
  { id: "photos", label: "Photos" },
  { id: "contact", label: "Contact" },
  { id: "policies", label: "Review" },
]

const photoSlots: Array<{
  id: PhotoId
  title: string
  hint: string
  reference: string
}> = [
  {
    id: "front",
    title: "Front three-quarter",
    hint: "Show the front and one side.",
    reference: media.photoGuideFront,
  },
  {
    id: "rear",
    title: "Rear three-quarter",
    hint: "Show the rear and the other side.",
    reference: media.photoGuideRear,
  },
  {
    id: "cabin",
    title: "Front cabin",
    hint: "Driver’s area, seats and carpet.",
    reference: media.photoGuideCabin,
  },
  {
    id: "seats",
    title: "Rear seats or boot",
    hint: "Show the main area that needs work.",
    reference: media.photoGuideRearSeats,
  },
]

const emptyAnswers = (): Answers => ({
  "pet-hair": null,
  stains: null,
  odour: null,
  "long-gap": null,
})

export default function QuotePrototype() {
  const { params, path } = useRoute()
  const checkoutSessionId = params.get("session_id")
  const requestedPackage = quoteServiceChoices.find(
    (item) => item.slug === params.get("package"),
  )
  const defaultService = requestedPackage ?? quoteServiceChoices[0]
  const [step, setStep] = useState<Step>("service")
  const [serviceTab, setServiceTab] = useState(defaultService.name)
  const [service, setService] = useState<string | null>(
    requestedPackage?.name ?? null,
  )
  const [bodyStyle, setBodyStyle] = useState<string | null>(null)
  const [addOnNames, setAddOnNames] = useState<string[]>([])
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [locationType, setLocationType] = useState("Home")
  const [address, setAddress] = useState("")
  const [access, setAccess] = useState("")
  const [photos, setPhotos] = useState<Partial<Record<PhotoId, File>>>({})
  const [photoPreviews, setPhotoPreviews] =
    useState<Partial<Record<PhotoId, string>>>({})
  const [photoErrors, setPhotoErrors] =
    useState<Partial<Record<PhotoId, string>>>({})
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [vehicleNote, setVehicleNote] = useState("")
  const [consent, setConsent] = useState(false)
  const [outcome, setOutcome] = useState<"sent" | "saved" | null>(null)
  const [sending, setSending] = useState(false)
  const [startingCheckout, setStartingCheckout] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const [verification, setVerification] =
    useState<CheckoutVerification | "loading" | "error" | null>(
      path === "/book/payment-success" ? "loading" : null,
    )
  const [openPhotoMenu, setOpenPhotoMenu] = useState<PhotoId | null>(null)
  const addressRef = useRef<HTMLInputElement>(null)
  const stepNavRef = useRef<HTMLElement>(null)

  const selectedService = quoteServiceChoices.find(
    (item) => item.name === service,
  )
  const viewedService =
    quoteServiceChoices.find((item) => item.name === serviceTab) ??
    defaultService
  const selectedVehicle = quoteBodyStyles.find(
    (item) => item.name === bodyStyle,
  )
  const selectedAddOns = addOns.filter((item) => addOnNames.includes(item.name))
  const checkoutTotal = site.deposit
  const conditionsComplete = conditions.every(
    (item) => answers[item.id] !== null,
  )
  const photoCount = Object.keys(photos).length
  const completed = new Set<Step>([
    ...(service ? ["service" as Step] : []),
    ...(bodyStyle ? ["vehicle" as Step, "addons" as Step] : []),
    ...(address ? ["location" as Step] : []),
    ...(conditionsComplete ? ["condition" as Step] : []),
    ...(photoCount === photoSlots.length ? ["photos" as Step] : []),
    ...(name && phone ? ["contact" as Step] : []),
  ])

  useEffect(() => {
    const input = addressRef.current
    if (!input) return
    const connect = () => {
      const Autocomplete = window.google?.maps?.places?.Autocomplete
      if (!Autocomplete) return
      const autocomplete = new Autocomplete(input, {
        componentRestrictions: { country: "us" },
        fields: ["formatted_address", "name"],
      })
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        setAddress(place.formatted_address ?? place.name ?? input.value)
      })
    }
    if (window.google?.maps?.places?.Autocomplete) {
      connect()
      return
    }
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key || document.getElementById("kp-google-places")) return
    const script = document.createElement("script")
    script.id = "kp-google-places"
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    script.async = true
    script.addEventListener("load", connect, { once: true })
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    const current = stepNavRef.current?.querySelector<HTMLElement>(
      '[aria-current="step"]',
    )
    current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }, [step])

  useEffect(() => {
    if (path !== "/book/payment-success") return
    if (!checkoutSessionId) {
      setVerification("error")
      return
    }
    let live = true
    fetch(
      `/api/checkout-session?session_id=${encodeURIComponent(checkoutSessionId)}`,
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("Payment verification failed.")
        return response.json() as Promise<CheckoutVerification>
      })
      .then((result) => live && setVerification(result))
      .catch(() => live && setVerification("error"))
    return () => {
      live = false
    }
  }, [checkoutSessionId, path])

  function advance(next: Step) {
    setStep(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  function chooseService(next: string) {
    setServiceTab(next)
    setService(next)
    window.setTimeout(() => advance("vehicle"), 350)
  }
  function chooseVehicle(next: string) {
    setBodyStyle(next)
    window.setTimeout(() => advance("addons"), 350)
  }
  function toggleAddOn(next: string) {
    setAddOnNames((current) =>
      current.includes(next)
        ? current.filter((item) => item !== next)
        : [...current, next],
    )
  }
  function setCondition(id: ConditionId, value: boolean) {
    const next = { ...answers, [id]: value }
    setAnswers(next)
    if (conditions.every((item) => next[item.id] !== null))
      window.setTimeout(() => advance("photos"), 350)
  }
  async function addPhoto(id: PhotoId, file: File | undefined) {
    if (!file) return
    const problem = validate(file)
    if (problem) {
      setPhotoErrors((current) => ({ ...current, [id]: problem }))
      return
    }
    try {
      const thumbnail = await preview(file)
      setPhotos((current) => ({ ...current, [id]: file }))
      setPhotoPreviews((current) => ({ ...current, [id]: thumbnail }))
      setPhotoErrors((current) => ({ ...current, [id]: undefined }))
    } catch {
      setPhotoErrors((current) => ({
        ...current,
        [id]: "We could not read that image. Try another photo.",
      }))
    }
  }

  async function requestPrice() {
    if (
      !service ||
      !selectedVehicle ||
      !address ||
      !name ||
      !phone ||
      photoCount !== photoSlots.length ||
      !consent ||
      sending
    )
      return
    setSending(true)
    const files = photoSlots
      .map((slot) => photos[slot.id])
      .filter((file): file is File => file instanceof File)
    const delivered = await send(
      {
        name,
        phone,
        email,
        address: `${locationType}: ${address}`,
        size: selectedVehicle.size,
        bodyStyle: selectedVehicle.name,
        vehicleNote,
        service,
        conditions: conditions
          .filter((item) => answers[item.id])
          .map((item) => item.question.replace(/[?]$/, "")),
        addOns: selectedAddOns.map((item) => item.name),
        photoCount,
        photosSkipped: false,
        date: "",
        window: "",
        total: null,
        notes: access,
      },
      files,
    )
    setSending(false)
    setOutcome(delivered ? "sent" : "saved")
  }

  async function startCheckout() {
    if (!selectedService || !selectedVehicle) {
      setCheckoutError("Choose a service and vehicle before opening checkout.")
      return
    }

    setStartingCheckout(true)
    setCheckoutError("")
    try {
      const response = await fetch("/api/create-checkout-session", {
        body: JSON.stringify({
          booking: {
            addOns: selectedAddOns.map((item) => item.name),
            email,
            model: vehicleNote,
            name,
            package: selectedService.name,
            phone,
            size: selectedVehicle.size,
            vehicle: selectedVehicle.name,
          },
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
      const result = (await response.json()) as { error?: string url?: string }
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Unable to start secure checkout.")
      }
      window.location.assign(result.url)
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Unable to start secure checkout.",
      )
      setStartingCheckout(false)
    }
  }

  const stage = steps.findIndex((item) => item.id === step) + 1

  return (
    <main className="quote-wizard">
      <header className="quote-wizard__header">
        <Link aria-label={`${site.name} home`} href="/">
          <Mark />
        </Link>
        <div
          className="quote-wizard__progress"
          aria-label={`Step ${stage} of ${steps.length}`}
        >
          <span>
            Step {stage} of {steps.length}
          </span>
          <i style={{ width: `${(stage / steps.length) * 100}%` }} />
        </div>
        <Link href="/">Back to site</Link>
      </header>
      {path === "/book/payment-success" ||
      path === "/book/payment-cancelled" ? (
        <PaymentResult
          cancelled={path === "/book/payment-cancelled"}
          verification={verification}
        />
      ) : (
        <>
          <nav
            className="quote-wizard__steps"
            aria-label="Quote steps"
            ref={stepNavRef}
          >
            {steps.map((item, index) => (
              <button
                aria-current={item.id === step ? "step" : undefined}
                className={
                  item.id === step
                    ? "is-current"
                    : completed.has(item.id)
                      ? "is-complete"
                      : ""
                }
                disabled={index > 0 && !completed.has(steps[index - 1].id)}
                key={item.id}
                onClick={() => advance(item.id)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <section className="quote-wizard__stage" key={step}>
            {step === "service" && (
              <>
                <Intro
                  number="01"
                  title="Start with the work you want done."
                  text="Each package is shown clearly below. Pick one to continue to your vehicle."
                />
                <div
                  className="quote-wizard__tabs"
                  role="tablist"
                  aria-label="Services"
                >
                  {quoteServiceChoices.map((item) => (
                    <button
                      aria-selected={serviceTab === item.name}
                      className={serviceTab === item.name ? "is-selected" : ""}
                      key={item.name}
                      onClick={() => setServiceTab(item.name)}
                      role="tab"
                      type="button"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="quote-wizard__service-card">
                  <img
                    alt={`${viewedService.name} detailing service`}
                    src={viewedService.image}
                  />
                  <div>
                    <p>SELECTED SERVICE</p>
                    <h2>{viewedService.name}</h2>
                    <span>{viewedService.description}</span>
                    <b>
                      {startingPrice(viewedService.name) === null
                        ? "Priced from your photos"
                        : `From $${startingPrice(viewedService.name)}`}
                    </b>
                    <button
                      onClick={() => chooseService(viewedService.name)}
                      type="button"
                    >
                      {service === viewedService.name
                        ? "Continue with this service"
                        : "Choose this service"}
                      <Arrow />
                    </button>
                  </div>
                </div>
              </>
            )}
            {step === "vehicle" && (
              <>
                <Intro
                  number="02"
                  title="What are we working on?"
                  text="Choose the closest shape. Vehicle footprint sets the starting price, not the badge."
                />
                <div className="quote-wizard__vehicle-grid">
                  {quoteBodyStyles.map((item) => (
                    <button
                      aria-pressed={bodyStyle === item.name}
                      className={bodyStyle === item.name ? "is-selected" : ""}
                      key={item.name}
                      onClick={() => chooseVehicle(item.name)}
                      type="button"
                    >
                      <img alt="" src={item.image} />
                      <b>{item.name}</b>
                      <span>Prices as {sizeLabels[item.size]}</span>
                    </button>
                  ))}
                </div>
                <label className="quote-wizard__field">
                  <span>
                    Year, make and model <small>Optional</small>
                  </span>
                  <input
                    onChange={(event) => setVehicleNote(event.target.value)}
                    placeholder="Example: 2022 BMW X5"
                    value={vehicleNote}
                  />
                </label>
              </>
            )}
            {step === "addons" && (
              <>
                <Intro
                  number="03"
                  title="Anything else the car needs?"
                  text="Add any extras now. You can leave this blank and continue."
                />
                <div className="quote-wizard__addons">
                  {addOns.map((item) => (
                    <label key={item.name}>
                      <img alt={item.imageAlt} src={item.image} />
                      <input
                        checked={addOnNames.includes(item.name)}
                        onChange={() => toggleAddOn(item.name)}
                        type="checkbox"
                      />
                      <span>
                        <b>{item.name}</b>
                        <small>{item.description}</small>
                        <em>
                          {item.name === "Ceramic Coating"
                            ? "From $700"
                            : "Confirmed from your photos"}
                        </em>
                      </span>
                      <i>{addOnNames.includes(item.name) ? "Added" : "Add"}</i>
                    </label>
                  ))}
                </div>
                <Next onClick={() => advance("location")}>
                  Continue to where your car is
                </Next>
              </>
            )}
            {step === "location" && (
              <>
                <Intro
                  number="04"
                  title="Where will the car be?"
                  text="Start typing the address and choose the matching result from Google. We use this only to plan the visit."
                />
                <div className="quote-wizard__location-types">
                  {["Home", "Work", "Storage", "Marina", "Other"].map(
                    (type) => (
                      <button
                        className={locationType === type ? "is-selected" : ""}
                        key={type}
                        onClick={() => setLocationType(type)}
                        type="button"
                      >
                        {type}
                      </button>
                    ),
                  )}
                </div>
                <div className="quote-wizard__fields">
                  <label className="quote-wizard__field">
                    <span>Find your address</span>
                    <input
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Start typing an address"
                      ref={addressRef}
                      value={address}
                    />
                  </label>
                  <label className="quote-wizard__field">
                    <span>
                      Access notes <small>Optional</small>
                    </span>
                    <input
                      onChange={(event) => setAccess(event.target.value)}
                      placeholder="Parking, gate code, or where the car is"
                      value={access}
                    />
                  </label>
                </div>
                <Next disabled={!address} onClick={() => advance("condition")}>
                  Continue to condition
                </Next>
              </>
            )}
            {step === "condition" && (
              <>
                <Intro
                  number="05"
                  title="Tell us what we should expect."
                  text="A straight answer helps us request the right photos and write the scope before we arrive."
                />
                <div className="quote-wizard__conditions">
                  {conditions.map((item) => (
                    <article key={item.id}>
                      <div>
                        <b>{item.question}</b>
                        <span>{item.help}</span>
                      </div>
                      <p>
                        <button
                          aria-pressed={answers[item.id] === true}
                          className={
                            answers[item.id] === true ? "is-selected" : ""
                          }
                          onClick={() => setCondition(item.id, true)}
                          type="button"
                        >
                          Yes
                        </button>
                        <button
                          aria-pressed={answers[item.id] === false}
                          className={
                            answers[item.id] === false ? "is-selected" : ""
                          }
                          onClick={() => setCondition(item.id, false)}
                          type="button"
                        >
                          No
                        </button>
                      </p>
                    </article>
                  ))}
                </div>
              </>
            )}
            {step === "photos" && (
              <>
                <Intro
                  number="06 · FOUR PHOTOS"
                  title="Show us the car from every side."
                  text="Two exterior and two interior photos give us the information to write the price. Use your camera or choose an existing photo for each angle."
                />
                <div className="quote-wizard__photos">
                  {photoSlots.map((slot, index) => (
                    <div
                      className={photos[slot.id] ? "is-filled" : ""}
                      key={slot.id}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div className="quote-wizard__photo-main">
                        <div className="quote-wizard__photo-example">
                          <img
                            alt={
                              photoPreviews[slot.id]
                                ? `Your ${slot.title} photo`
                                : `Example ${slot.title} angle`
                            }
                            src={photoPreviews[slot.id] ?? slot.reference}
                          />
                        </div>
                        <div>
                          <b>{slot.title}</b>
                          <small>{photos[slot.id]?.name ?? slot.hint}</small>
                        </div>
                      </div>
                      <div className="quote-wizard__photo-actions">
                        <button
                          aria-expanded={openPhotoMenu === slot.id}
                          onClick={() =>
                            setOpenPhotoMenu((current) =>
                              current === slot.id ? null : slot.id,
                            )
                          }
                          type="button"
                        >
                          {photos[slot.id] ? "Replace photo" : "Add photo"}
                          <svg
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 16 16"
                          >
                            <path d="m4 6 4 4 4-4" />
                          </svg>
                        </button>
                        {openPhotoMenu === slot.id && (
                          <div className="quote-wizard__photo-menu">
                            {bookFlow.photos.actions.map((action) => {
                              const inputId = `quote-photo-${slot.id}-${action.id}`
                              return (
                                <label htmlFor={inputId} key={action.id}>
                                  {action.label}
                                  <input
                                    accept={action.accept}
                                    capture={action.capture}
                                    id={inputId}
                                    onChange={(event) => {
                                      void addPhoto(
                                        slot.id,
                                        event.target.files?.[0],
                                      )
                                      setOpenPhotoMenu(null)
                                      event.currentTarget.value = ""
                                    }}
                                    type="file"
                                  />
                                </label>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      {photoErrors[slot.id] && (
                        <em className="quote-wizard__photo-error">
                          {photoErrors[slot.id]}
                        </em>
                      )}
                    </div>
                  ))}
                </div>
                <Next
                  disabled={photoCount !== photoSlots.length}
                  onClick={() => advance("contact")}
                >
                  Continue to contact
                </Next>
              </>
            )}
            {step === "contact" && (
              <>
                <Intro
                  number="07"
                  title="Where should we send the written price?"
                  text="A phone number is required. Email is optional, but useful for a copy of the scope."
                />
                <div className="quote-wizard__fields quote-wizard__fields--three">
                  <label className="quote-wizard__field">
                    <span>Name</span>
                    <input
                      onChange={(event) => setName(event.target.value)}
                      placeholder="First and last"
                      value={name}
                    />
                  </label>
                  <label className="quote-wizard__field">
                    <span>Phone</span>
                    <input
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="(000) 000-0000"
                      type="tel"
                      value={phone}
                    />
                  </label>
                  <label className="quote-wizard__field">
                    <span>
                      Email <small>Optional</small>
                    </span>
                    <input
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                    />
                  </label>
                </div>
                <Next
                  disabled={!name || !phone}
                  onClick={() => advance("policies")}
                >
                  Review request
                </Next>
              </>
            )}
            {step === "policies" && (
              <>
                <Intro
                  number="08 · REVIEW"
                  title={`Pay the $${site.deposit} deposit.`}
                  text={`Review the scope, then pay the refundable $${site.deposit} deposit to hold your booking request. It comes off the final bill.`}
                />
                <dl className="quote-wizard__review">
                  <div>
                    <dt>Service</dt>
                    <dd>{selectedService?.name}</dd>
                  </div>
                  <div>
                    <dt>Vehicle</dt>
                    <dd>
                      {selectedVehicle?.name}
                      {vehicleNote ? ` · ${vehicleNote}` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>Add-ons</dt>
                    <dd>
                      {selectedAddOns.length
                        ? selectedAddOns.map((item) => item.name).join(", ")
                        : "None"}
                    </dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>
                      {locationType} · {address}
                    </dd>
                  </div>
                  <div>
                    <dt>Photos</dt>
                    <dd>{photoCount} of 4 attached</dd>
                  </div>
                </dl>
                <label className="quote-wizard__consent">
                  <input
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    type="checkbox"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/booking-terms">Booking Terms</Link> and
                    understand that the ${site.deposit} deposit is refundable
                    with {site.refundNoticeHours}+ hours notice.
                  </span>
                </label>
                <div className="quote-wizard__payment">
                  <div>
                    <p>SECURE CARD PAYMENT</p>
                    <b>${site.deposit} refundable deposit</b>
                    <span>
                      Pay now with Visa or Mastercard. Your service, vehicle,
                      and add-ons stay attached to the payment.
                    </span>
                  </div>
                  <button
                    disabled={!consent || startingCheckout}
                    onClick={() => void startCheckout()}
                    type="button"
                  >
                    {startingCheckout
                      ? "Opening secure checkout…"
                      : `Pay $${checkoutTotal} deposit`}
                    <Arrow />
                  </button>
                  <PaymentMarks />
                  {checkoutError && <em role="alert">{checkoutError}</em>}
                </div>
                {outcome ? (
                  <div className="quote-wizard__outcome">
                    <b>
                      {outcome === "sent"
                        ? "Request copy sent."
                        : "Request copy saved in this browser."}
                    </b>
                    <span>
                      {outcome === "sent"
                        ? "The scope and photos were also sent to the team."
                        : "Email delivery is unavailable locally, but this does not block payment."}
                    </span>
                  </div>
                ) : (
                  <Next
                    disabled={!consent || sending}
                    onClick={() => void requestPrice()}
                  >
                    {sending
                      ? "Sending copy…"
                      : "Send request copy to the team"}
                  </Next>
                )}
              </>
            )}
          </section>
        </>
      )}
    </main>
  )
}

function PaymentMarks() {
  return (
    <div
      className="quote-wizard__payment-marks"
      aria-label="Visa and Mastercard accepted"
    >
      <span className="quote-wizard__visa" aria-label="Visa">
        VISA
      </span>
      <span className="quote-wizard__mastercard" aria-label="Mastercard">
        <i />
        <i />
      </span>
    </div>
  )
}

function PaymentResult({
  cancelled,
  verification,
}: {
  cancelled: boolean
  verification: CheckoutVerification | "loading" | "error" | null
}) {
  const verified = typeof verification === "object" && verification?.paid
  return (
    <section className="quote-wizard__payment-result">
      <p>{cancelled ? "PAYMENT CANCELLED" : "PAYMENT STATUS"}</p>
      <h1>
        {cancelled
          ? "Nothing was charged."
          : verification === "loading"
            ? "Verifying your payment…"
            : verified
              ? "Payment confirmed."
              : "We could not confirm that payment."}
      </h1>
      <span>
        {cancelled
          ? "Your quote is unchanged. Return to the booking flow whenever you are ready."
          : verified
            ? "Stripe confirmed the payment on the server. Keep the order reference below."
            : verification === "error"
              ? "Please contact us before trying again so we can check the Checkout session."
              : "Please wait while the server checks the Checkout session."}
      </span>
      {verified && (
        <dl>
          <div>
            <dt>Order</dt>
            <dd>{verification.orderId}</dd>
          </div>
          <div>
            <dt>Total paid</dt>
            <dd>
              ${((verification.amountTotal ?? 0) / 100).toFixed(2)}{" "}
              {verification.currency?.toUpperCase()}
            </dd>
          </div>
        </dl>
      )}
      <Link
        className="quote-wizard__result-link"
        href={cancelled ? "/book" : "/"}
      >
        {cancelled ? "Return to booking" : "Back to site"}
        <Arrow />
      </Link>
    </section>
  )
}

function Intro({
  number,
  text,
  title,
}: {
  number: string
  text: string
  title: string
}) {
  return (
    <div className="quote-wizard__intro">
      <p>{number}</p>
      <h1>{title}</h1>
      <span>{text}</span>
    </div>
  )
}

function Next({
  children,
  disabled,
  onClick,
}: {
  children: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      className="quote-wizard__next"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
      <Arrow />
    </button>
  )
}
