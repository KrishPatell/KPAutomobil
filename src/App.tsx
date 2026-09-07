import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react"
import heroImage from "./imports/1440WLight/5a05f90c4323f8eb1048b55a1bf1ff72916c246a.png"
import aboutImage from "./imports/1440WLight/cc6887674c6325a2a57f60e235ccc8654e9fb30c.png"
import foamImage from "./imports/1440WLight/a22e277837b0a41985dd651f2b83233b102b1a98.png"
import beforeImage from "./imports/1440WLight/505593d73bde8af5bfbbd47b09c07cb19a8e5c0f.png"
import afterImage from "./imports/1440WLight/169c3269761df8accf364e4f8c82b4270a13dd5e.png"
import workInterior from "./imports/1440WLight/2c0b095cbd13138aaabd6eedbf692c1f026269a3.png"
import workDetail from "./imports/1440WLight/858ac59c533de617e6ed18ec8031fc4a07c0835f.png"
import workRestore from "./imports/1440WLight/f78d2e920428db1bee50f7f5e5e9b5a77fc99edb.png"
import sedanImage from "./imports/1440WLight/06431bf30dc9a56e4642cf6a55939156197d37aa.png"
import suvImage from "./imports/1440WLight/2deeea5f74e7f75c94ba2f5f0097e563fff8e707.png"
import truckImage from "./imports/1440WLight/5940b3a4d7f316436a734e6e92aff896f62d6511.png"
import electricImage from "./imports/1440WLight/7fa865e7fd869526c81f3f26770a2d81f6493244.png"
import coupeImage from "./imports/1440WLight/89602c4911c0560d7d092acf4303f8963ccfa99f.png"
import luxuryImage from "./imports/1440WLight/3d084481844e7e828f35bc278519f60f1da333c2.png"
import processImage from "./imports/1440WLight/e889eaaf6a46e055effc04767a7f673621364259.png"
import processQuoteImage from "./imports/1440WLight/19440e56c9c65186f3b6c30dec7f8a3ceeba185f.png"
import processArriveImage from "./imports/1440WLight/6d20032164c0accdcb808ea7f49eb357b1d69b6a.png"
import processDoneImage from "./imports/1440WLight/09a2840f1423e6f94915dc184d61277e4b149837.png"
import blackSedanReviewImage from "./assets/reviews/black-sedan-driveway.jpg"
import blueCoupeReviewImage from "./assets/reviews/blue-coupe-driveway.jpg"
import darkPickupReviewImage from "./assets/reviews/dark-pickup-driveway.jpg"
import whiteSuvReviewImage from "./assets/reviews/white-suv-driveway.jpg"
import handWaxImage from "./assets/booking/hand-wax-application.jpg"
import deepRestorationImage from "./assets/booking/deep-restoration-before.jpg"
import ceramicCoatingImage from "./assets/booking/ceramic-coating-application.jpg"
import bmwFinishedImage from "./assets/results/bmw-3-series-finished.jpg"
import threeRowCatalogImage from "./assets/booking/three-row-catalog-white-v3.jpg"
import minivanCatalogImage from "./assets/booking/minivan-catalog-white-v3.jpg"
import threeRowBookingImage from "./assets/booking/three-row-booking-black-v3.jpg"
import bmwCleanPromiseImage from "./assets/promise-bmw-clean-v3.png"
import bmwDirtyPromiseImage from "./assets/promise-bmw-dirty-v3.png"
import bmwFoamPromiseImage from "./assets/promise-bmw-foam-v3.png"
import porscheCleanImage from "./assets/results/porsche-clean-v2.jpg"
import suvCleanImage from "./assets/results/suv-clean-v2.jpg"
import bmwHeavyDirtyImage from "./assets/results/bmw-heavy-dirty-v3.jpg"
import porscheHeavyDirtyImage from "./assets/results/porsche-heavy-dirty-v3.jpg"
import suvHeavyDirtyImage from "./assets/results/suv-heavy-dirty-v3.jpg"
import fullDetailPorscheImage from "./assets/porsche-full-detail-user-v2.jpg"
import { commitments } from "./content/commitments"

type Package = {
  name: string
  description: string
  items: string[]
  image: string
  addOn?: boolean
}
type Vehicle = {
  id: string
  name: string
  image: string
  description: string
}
type BodyStyle = {
  image: string
  name: string
  size: string
  compact?: boolean
}
type BookingDraft = {
  vehicle: string
  package: string
  addOns: string[]
  name: string
  phone: string
  email: string
  model: string
  details: string
  photos: Array<File | null>
}

const packages: Package[] = [
  {
    name: "Interior Refresh",
    description: "Inside only, for the everyday car that needs a proper reset.",
    image: workInterior,
    items: [
      "Full interior vacuum",
      "Dash, console & trim",
      "Door panels",
      "Interior glass",
      "Cup holders & storage",
      "Floor mats",
    ],
  },
  {
    name: "Full Detail",
    description: "A complete inside-and-out clean for the full reset.",
    image: fullDetailPorscheImage,
    items: [
      "Hand wash & dry",
      "Interior deep vacuum",
      "Wheel & tire clean",
      "Interior & exterior glass",
      "Door jamb wipe down",
      "Tire dressing",
    ],
  },
  {
    name: "Deep Restoration",
    description:
      "For heavy soil, stains, pet hair, or a car that has not been detailed in years.",
    image: deepRestorationImage,
    items: [
      "Carpet & seat shampoo",
      "Hot-water extraction",
      "Steam clean",
      "Stain treatment",
      "Leather conditioning",
      "Clay bar treatment",
      "Wheel wells",
      "Streak-free glass",
    ],
  },
  {
    name: "Ceramic Coating",
    description:
      "An add-on protective layer over clean paint. Priced after photos.",
    image: ceramicCoatingImage,
    addOn: true,
    items: [
      "Paint decontamination",
      "Surface preparation",
      "Ceramic application",
      "Cure & buff",
      "Hydrophobic finish",
    ],
  },
  {
    name: "Hand Wax",
    description:
      "An add-on warm shine between full details, applied and buffed by hand.",
    image: handWaxImage,
    addOn: true,
    items: ["Hand wash & dry", "Wax application", "Hand buff", "Tire dressing"],
  },
]

const vehicles: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan",
    image: sedanImage,
    description: "Two rows, a trunk, four doors or two.",
  },
  {
    id: "suv",
    name: "SUV",
    image: suvImage,
    description: "Two rows and a hatch. Crossovers and wagons count.",
  },
  {
    id: "three-row",
    name: "Three-row",
    image: threeRowBookingImage,
    description: "A third row, or a minivan with sliding doors.",
  },
  {
    id: "truck",
    name: "Truck",
    image: truckImage,
    description: "Crew cab, extended cab, any bed length.",
  },
]

const bodyStyles: BodyStyle[] = [
  { image: sedanImage, name: "Sedan", size: "sedan" },
  { image: coupeImage, name: "Coupe", size: "sedan" },
  { image: electricImage, name: "Electric", size: "sedan" },
  { image: luxuryImage, name: "Luxury sedan", size: "sedan" },
  { image: suvImage, name: "SUV", size: "suv" },
  { image: threeRowCatalogImage, name: "Three-row SUV", size: "three-row" },
  { image: minivanCatalogImage, name: "Minivan", size: "three-row" },
  { image: truckImage, name: "Pickup", size: "truck", compact: true },
]

const processSteps = [
  [
    "01",
    "Price before booking",
    "Pick a package and your vehicle size, then send two interior and two exterior photos. The written price comes back in about a minute — no callback.",
    "$50 deposit · refundable 24h+",
    processQuoteImage,
    "Booking a detail on a phone in a driveway",
  ],
  [
    "02",
    "We come to you",
    "V arrives at the time you picked with everything the job needs already in the van. Driveway, office lot or apartment parking — the car does not have to move.",
    "Everything travels in the van",
    processArriveImage,
    "A detailer working on a car in a driveway",
  ],
  [
    "03",
    "Pay what you were quoted",
    "The number on your quote is the number you pay. The deposit comes off the total and nothing gets added at the door.",
    "Card · Zelle · cash, one price",
    processDoneImage,
    "A finished car parked on a driveway",
  ],
]

const promiseCards = [
  [
    "The price",
    "Agreed before we arrive",
    "You see the written price before you book. We do not add a surprise number at the driveway.",
    bmwDirtyPromiseImage,
  ],
  [
    "The van",
    "Water and power on board",
    "The van carries what the job needs, so your home, office lot, or apartment space can work.",
    bmwFoamPromiseImage,
  ],
  [
    "The work",
    "V does every job",
    "One person quotes your car and one person details it. There is no handoff.",
    bmwCleanPromiseImage,
  ],
]

const reviewCards = [
  [blackSedanReviewImage, "Hand Wax", "Warm shine, buffed by hand"],
  [blueCoupeReviewImage, "Driveway Finish", "Ready before you leave"],
  [darkPickupReviewImage, "Mobile Service", "Everything travels in the van"],
  [whiteSuvReviewImage, "SUV Detail", "Paint, wheels, and glass finished"],
  [blackSedanReviewImage, "Exterior Finish", "A clean driveway-ready sedan"],
  [blueCoupeReviewImage, "Full Detail", "Paintwork and glass completed"],
  [darkPickupReviewImage, "Truck Detail", "A complete exterior reset"],
  [whiteSuvReviewImage, "Driveway Detail", "An on-site finish, front to back"],
  [blackSedanReviewImage, "Sedan Finish", "Careful work across every panel"],
  [blueCoupeReviewImage, "Final Polish", "A clear, even gloss"],
]

const comparisonPairs = [
  [
    "Road film",
    "Road grime lifted from paint and wheels.",
    bmwHeavyDirtyImage,
    bmwFinishedImage,
  ],
  [
    "Road-film coupe",
    "A wet-weather layer lifted from paint, glass, and wheels.",
    porscheHeavyDirtyImage,
    porscheCleanImage,
  ],
  [
    "Pollen SUV",
    "Pollen, brake dust, and lower-panel grime cleared away.",
    suvHeavyDirtyImage,
    suvCleanImage,
  ],
] as const

const faqs = [
  [
    "Do I need to provide water or electricity?",
    "No. KP Automobil arrives with what the service needs.",
  ],
  [
    "Will the price change on arrival?",
    "No. If your photos show extra work, the revised price comes in writing before arrival.",
  ],
  [
    "How does the photo quote work?",
    "Send two interior and two exterior shots. We review them and send a real price before the deposit.",
  ],
  [
    "Is the $50 deposit refundable?",
    "Yes. Cancel with at least 24 hours notice and the deposit is fully refundable. It also comes off the final bill.",
  ],
  [
    "Where can you detail my car?",
    "At home, work, or an apartment space with safe access to the vehicle.",
  ],
  [
    "Do you charge card fees?",
    "No. Card, Zelle, or cash — the price is the same.",
  ],
]

const compareRows = [
  [
    "Getting a price",
    "In writing, from your photos, before you book",
    "Call back for an estimate",
  ],
  ["Who quotes it", "Nobody has to come out first", "A visit to see the car"],
  [
    "Where the work happens",
    "Your driveway, lot or garage",
    "You drive to them and wait",
  ],
  ["Who does the work", "V, every booking", "Whoever is rostered"],
  [
    "Holding the slot",
    "$50, refundable with 24+ hours notice",
    "Non-refundable, or no slot held",
  ],
  ["Paying by card", "Same price as cash", "A processing fee on top"],
  ["On arrival", "The quote is the price", "Add-ons priced at the door"],
  [
    "What the van carries",
    "Its own water and power",
    "Your hose and your outlet",
  ],
]

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return { ref, className: visible ? "reveal is-visible" : "reveal" }
}

function Arrow() {
  return (
    <span aria-hidden="true" className="arrow">
      →
    </span>
  )
}

function LocationPin() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 10.5c0 5.2-8 11-8 11s-8-5.8-8-11a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function Mark() {
  return (
    <span className="mark">
      <b>KP</b>
      <small>Automobil</small>
    </span>
  )
}
function Button({
  children,
  onClick,
  type = "button",
  variant = "light",
  className = "",
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "light" | "dark" | "outline"
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      className={`button button--${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      <span>{children}</span>
      <Arrow />
    </button>
  )
}
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <i />
      {children}
    </p>
  )
}

function SlotDeposit() {
  const amountRef = useRef<HTMLSpanElement>(null)
  const [amount, setAmount] = useState(0)
  const [isRolling, setIsRolling] = useState(false)

  useEffect(() => {
    const element = amountRef.current
    if (!element) return
    let frame = 0
    let hasPlayed = false
    const run = () => {
      if (hasPlayed) return
      hasPlayed = true
      setIsRolling(true)
      const start = window.performance.now()
      const duration = 900
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        setAmount(Math.round(eased * 50))
        if (progress < 1) frame = window.requestAnimationFrame(tick)
        else setIsRolling(false)
      }
      frame = window.requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.55 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <span
      aria-label="50 dollar refundable deposit"
      className={`slot-deposit${isRolling ? " is-rolling" : ""}`}
      ref={amountRef}
    >
      ${amount}
    </span>
  )
}
function Reveal({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const motion = useReveal<HTMLDivElement>()
  return (
    <div className={`${motion.className} ${className}`} ref={motion.ref}>
      {children}
    </div>
  )
}

const bookingSteps = [
  ["vehicle", "Vehicle"],
  ["package", "Package"],
  ["add-ons", "Add-ons"],
  ["photos", "Photos"],
  ["contact", "Contact"],
  ["price", "Your price"],
  ["deposit", "Deposit"],
] as const

const photoPrompts = [
  [
    "Front three-quarter",
    "Stand at a corner so one side and the front are both in frame.",
  ],
  [
    "Rear three-quarter",
    "The opposite corner, so between the two you have all four sides.",
  ],
  ["Front cabin", "Driver's door open, seats and carpet visible."],
  [
    "Rear seats or boot",
    "Wherever the mess actually is — that is what sets the time.",
  ],
] as const

function BookNowFlow({
  initialVehicle,
  initialPackage,
  onExit,
}: {
  initialVehicle: string
  initialPackage: string
  onExit: () => void
}) {
  const currentPathStep = Math.max(
    0,
    bookingSteps.findIndex(([slug]) =>
      window.location.pathname.endsWith(`/${slug}`),
    ),
  )
  const [step, setStep] = useState(currentPathStep)
  const [submitted, setSubmitted] = useState(false)
  const [draft, setDraft] = useState<BookingDraft>({
    vehicle: initialVehicle,
    package: initialPackage,
    addOns: [],
    name: "",
    phone: "",
    email: "",
    model: "",
    details: "",
    photos: [null, null, null, null],
  })
  const update = (patch: Partial<BookingDraft>) =>
    setDraft((current) => ({ ...current, ...patch }))
  const navigateStep = (nextStep: number, replace = false) => {
    const safeStep = Math.min(Math.max(nextStep, 0), bookingSteps.length - 1)
    const nextPath = `/book/${bookingSteps[safeStep][0]}`
    window.history[replace ? "replaceState" : "pushState"]({}, "", nextPath)
    setStep(safeStep)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  useEffect(() => {
    const syncStep = () => {
      const nextStep = bookingSteps.findIndex(([slug]) =>
        window.location.pathname.endsWith(`/${slug}`),
      )
      setStep(nextStep >= 0 ? nextStep : 0)
    }
    window.addEventListener("popstate", syncStep)
    return () => window.removeEventListener("popstate", syncStep)
  }, [])
  useEffect(() => {
    setDraft((current) => ({
      ...current,
      vehicle: initialVehicle || current.vehicle,
      package: initialPackage || current.package,
    }))
  }, [initialPackage, initialVehicle])
  const photoCount = draft.photos.filter(Boolean).length
  const selectedService = packages.find((item) => item.name === draft.package)
  const selectedServiceImage = selectedService?.image ?? workDetail
  const canContinue = [
    Boolean(draft.vehicle),
    Boolean(draft.package),
    true,
    photoCount === photoPrompts.length,
    Boolean(draft.name && draft.email && draft.phone && draft.model),
    true,
    true,
  ][step]
  const toggleAddOn = (name: string) =>
    update({
      addOns: draft.addOns.includes(name)
        ? draft.addOns.filter((item) => item !== name)
        : [...draft.addOns, name],
    })
  const addPhoto = (index: number, file: File | null) =>
    update({
      photos: draft.photos.map((photo, photoIndex) =>
        photoIndex === index ? file : photo,
      ),
    })
  const next = () => {
    if (!canContinue) return
    if (step === bookingSteps.length - 1) {
      setSubmitted(true)
      return
    }
    navigateStep(step + 1)
  }
  const panelTitle = bookingSteps[step][1]
  return (
    <main className="booking-page">
      <header className="booking-header">
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault()
            onExit()
          }}
          aria-label="KP Automobil home"
        >
          <Mark />
        </a>
        <button onClick={onExit} type="button">
          Back to the site
        </button>
      </header>
      <div className="booking-layout">
        <aside
          className="booking-progress"
          aria-label={`Step ${step + 1} of ${bookingSteps.length}`}
        >
          <p>
            STEP {step + 1} OF {bookingSteps.length}
          </p>
          <ol>
            {bookingSteps.map(([slug, label], index) => (
              <li
                className={
                  index === step ? "active" : index < step ? "complete" : ""
                }
                key={slug}
              >
                <button
                  disabled={index > step}
                  onClick={() => navigateStep(index)}
                  type="button"
                >
                  <span>{index + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </aside>
        <section aria-labelledby="booking-title" className="booking-panel">
          {submitted ? (
            <div className="booking-complete">
              <span>✓</span>
              <p>BOOKING REQUEST READY</p>
              <h1 id="booking-title">We have the details.</h1>
              <p>
                Your request is ready to send. Connect the booking endpoint
                before launch to send this to KP Automobil for real.
              </p>
              <button className="booking-action" onClick={onExit} type="button">
                Return home <Arrow />
              </button>
            </div>
          ) : (
            <>
              <div className="booking-panel__intro">
                <h1 id="booking-title">{panelTitle}</h1>
                {step === 3 && (
                  <p>
                    Two outside, two inside. This is the whole reason KP can
                    price the job before turning up, so it is worth 30 seconds
                    in the driveway.
                  </p>
                )}
                {step === 0 && (
                  <p>
                    Vehicle footprint sets the time. Pick the closest match.
                  </p>
                )}
                {step === 1 && (
                  <p>
                    Choose the service you want. The written price comes after
                    the photos.
                  </p>
                )}
                {step === 2 && (
                  <p>
                    Optional extras can be added before you send your photos.
                  </p>
                )}
                {step === 4 && (
                  <p>
                    We use these details to send your written price and confirm
                    the booking.
                  </p>
                )}
                {step === 5 && (
                  <p>
                    Your written price is prepared from the vehicle, service,
                    and four photos you send.
                  </p>
                )}
                {step === 6 && (
                  <p>
                    Hold the appointment with a refundable deposit once the
                    written price is agreed.
                  </p>
                )}
              </div>
              {step === 0 && (
                <div className="booking-choice-grid booking-choice-grid--media">
                  {vehicles.map((vehicle) => (
                    <button
                      className={draft.vehicle === vehicle.id ? "selected" : ""}
                      key={vehicle.id}
                      onClick={() => update({ vehicle: vehicle.id })}
                      type="button"
                    >
                      <img
                        alt=""
                        className="booking-choice-media"
                        src={vehicle.image}
                      />
                      <span className="booking-choice-copy">
                        <b>{vehicle.name}</b>
                        <span>{vehicle.description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="booking-choice-grid booking-choice-grid--media">
                  {packages
                    .filter((item) => !item.addOn)
                    .map((item) => (
                      <button
                        className={
                          draft.package === item.name ? "selected" : ""
                        }
                        key={item.name}
                        onClick={() => update({ package: item.name })}
                        type="button"
                      >
                        <img
                          alt=""
                          className="booking-choice-media"
                          src={item.image}
                        />
                        <span className="booking-choice-copy">
                          <b>{item.name}</b>
                          <span>{item.description}</span>
                        </span>
                      </button>
                    ))}
                </div>
              )}
              {step === 2 && (
                <div className="booking-choice-grid booking-choice-grid--add-ons booking-choice-grid--media">
                  {packages
                    .filter((item) => item.addOn)
                    .map((item) => (
                      <button
                        className={
                          draft.addOns.includes(item.name) ? "selected" : ""
                        }
                        key={item.name}
                        onClick={() => toggleAddOn(item.name)}
                        type="button"
                      >
                        <img
                          alt=""
                          className="booking-choice-media"
                          src={item.image}
                        />
                        <span className="booking-choice-copy">
                          <b>{item.name}</b>
                          <span>{item.description}</span>
                          <small>
                            {draft.addOns.includes(item.name)
                              ? "Added"
                              : "Optional"}
                          </small>
                        </span>
                      </button>
                    ))}
                </div>
              )}
              {step === 3 && (
                <div className="booking-photo-list">
                  {photoPrompts.map(([title, note], index) => (
                    <label
                      className={
                        draft.photos[index]
                          ? "booking-photo-slot is-filled"
                          : "booking-photo-slot"
                      }
                      key={title}
                    >
                      <input
                        accept="image/*"
                        onChange={(event) =>
                          addPhoto(index, event.target.files?.[0] ?? null)
                        }
                        type="file"
                      />
                      <span className="booking-photo-icon" aria-hidden="true">
                        ⌾
                      </span>
                      <span>
                        <b>{title}</b>
                        <small>{note}</small>
                        <em>{draft.photos[index]?.name ?? "Add photo"}</em>
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {step === 4 && (
                <div className="booking-contact">
                  <label>
                    Your name
                    <input
                      autoComplete="name"
                      onChange={(event) => update({ name: event.target.value })}
                      placeholder="John Smith"
                      required
                      value={draft.name}
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      autoComplete="email"
                      onChange={(event) =>
                        update({ email: event.target.value })
                      }
                      placeholder="john@example.com"
                      required
                      type="email"
                      value={draft.email}
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      autoComplete="tel"
                      onChange={(event) =>
                        update({ phone: event.target.value })
                      }
                      placeholder="(508) 555-0123"
                      required
                      type="tel"
                      value={draft.phone}
                    />
                  </label>
                  <label>
                    Year, make &amp; model
                    <input
                      onChange={(event) =>
                        update({ model: event.target.value })
                      }
                      placeholder="2024 BMW X5"
                      required
                      value={draft.model}
                    />
                  </label>
                  <label className="booking-contact__wide">
                    Anything we should know? <small>Optional</small>
                    <textarea
                      onChange={(event) =>
                        update({ details: event.target.value })
                      }
                      placeholder="Pet hair, a spill, set-in stains, or access notes."
                      rows={3}
                      value={draft.details}
                    />
                  </label>
                </div>
              )}
              {step === 5 && (
                <div className="booking-summary">
                  <img
                    alt=""
                    className="booking-summary__media"
                    src={selectedServiceImage}
                  />
                  <div className="booking-summary__body">
                    <p>
                      We will check the four photos and send the price in
                      writing before you place a deposit.
                    </p>
                    <dl>
                      <div>
                        <dt>Vehicle</dt>
                        <dd>
                          {vehicles.find((item) => item.id === draft.vehicle)
                            ?.name || "Not selected"}
                        </dd>
                      </div>
                      <div>
                        <dt>Package</dt>
                        <dd>{draft.package || "Not selected"}</dd>
                      </div>
                      <div>
                        <dt>Photos</dt>
                        <dd>{photoCount} of 4 added</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
              {step === 6 && (
                <div className="booking-deposit">
                  <img
                    alt=""
                    className="booking-deposit__image"
                    src={selectedServiceImage}
                  />
                  <div className="booking-deposit__copy">
                    <strong>$50</strong>
                    <div>
                      <b>Refundable deposit</b>
                      <p>
                        It comes off the final bill. Cancel 24 or more hours
                        before the appointment and it comes back.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="booking-actions">
                <button
                  className="booking-back"
                  disabled={step === 0}
                  onClick={() => navigateStep(step - 1)}
                  type="button"
                >
                  Back
                </button>
                {step === 3 && <span>{photoCount} of 4 added</span>}
                <button
                  className="booking-action"
                  disabled={!canContinue}
                  onClick={next}
                  type="button"
                >
                  {step === bookingSteps.length - 1
                    ? "Request appointment"
                    : "Continue"}{" "}
                  <Arrow />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

function App() {
  const [activePackage, setActivePackage] = useState(0)
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedFormPackage, setSelectedFormPackage] = useState("")
  const [openFaq, setOpenFaq] = useState(0)
  const [bookingPath, setBookingPath] = useState(() => window.location.pathname)
  const reviewRailRef = useRef<HTMLDivElement>(null)
  const reviewDragRef = useRef({
    active: false,
    pointerId: 0,
    startScroll: 0,
    startX: 0,
  })
  const active = packages[activePackage]
  const openBooking = (
    vehicle = selectedVehicle,
    packageName = selectedFormPackage,
  ) => {
    setSelectedVehicle(vehicle)
    setSelectedFormPackage(packageName)
    window.history.pushState({}, "", "/book/vehicle")
    setBookingPath("/book/vehicle")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const closeBooking = () => {
    window.history.pushState({}, "", "/")
    setBookingPath("/")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  useEffect(() => {
    const syncPath = () => setBookingPath(window.location.pathname)
    window.addEventListener("popstate", syncPath)
    return () => window.removeEventListener("popstate", syncPath)
  }, [])
  const getReviewLoopWidth = (rail: HTMLDivElement) => {
    const group = rail.querySelector<HTMLElement>(".review-track__group")
    const track = rail.querySelector<HTMLElement>(".review-track")
    if (!group || !track) return 0
    const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 0
    return group.getBoundingClientRect().width + gap
  }
  const setReviewLoopPosition = (rail: HTMLDivElement, position: number) => {
    const loopWidth = getReviewLoopWidth(rail)
    if (!loopWidth) return
    rail.scrollLeft = ((position % loopWidth) + loopWidth) % loopWidth
  }
  const clearReviewDrag = () => {
    reviewDragRef.current.active = false
    reviewRailRef.current?.classList.remove("is-dragging")
  }
  const moveReviewRail = (direction: number) => {
    const rail = reviewRailRef.current
    if (!rail) return
    const card = rail.querySelector<HTMLElement>(".review-card")
    const distance = (card?.getBoundingClientRect().width ?? 280) + 16
    setReviewLoopPosition(rail, rail.scrollLeft + direction * distance)
  }
  const startReviewDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = reviewRailRef.current
    if (!rail) return
    reviewDragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startScroll: rail.scrollLeft,
      startX: event.clientX,
    }
    rail.classList.add("is-dragging")
    rail.setPointerCapture(event.pointerId)
  }
  const moveReviewDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = reviewRailRef.current
    const drag = reviewDragRef.current
    if (!rail || !drag.active || drag.pointerId !== event.pointerId) return
    event.preventDefault()
    setReviewLoopPosition(
      rail,
      drag.startScroll - (event.clientX - drag.startX),
    )
  }
  const endReviewDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = reviewRailRef.current
    if (!rail || reviewDragRef.current.pointerId !== event.pointerId) return
    clearReviewDrag()
    if (rail.hasPointerCapture(event.pointerId))
      rail.releasePointerCapture(event.pointerId)
  }
  const scrollReviewWithWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const rail = reviewRailRef.current
    if (!rail) return
    const distance =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY
    if (!distance) return
    event.preventDefault()
    setReviewLoopPosition(rail, rail.scrollLeft + distance)
  }
  if (bookingPath.startsWith("/book"))
    return (
      <BookNowFlow
        initialPackage={selectedFormPackage}
        initialVehicle={selectedVehicle}
        onExit={closeBooking}
      />
    )
  return (
    <main className="site-shell" id="top">
      <header className="nav">
        <a className="nav-brand" href="#top" aria-label="KP Automobil home">
          <Mark />
        </a>
        <nav>
          <a href="#services">Packages</a>
          <a href="#results">Results</a>
          <a href="#promise">Promise</a>
          <a href="#faq">FAQ</a>
        </nav>
        <Button onClick={() => openBooking()} className="nav-cta">
          Book Now
        </Button>
      </header>
      <section className="hero">
        <img
          className="hero-image"
          src={heroImage}
          alt="Mobile detailer washing a car in a driveway"
        />
        <div className="hero-wash" />
        <div className="hero-content">
          <Reveal>
            <Eyebrow>Serving Boston, Massachusetts</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h1>Mobile detailing with a real price upfront.</h1>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              Send four photos. See your price in writing. No callback. No
              driveway upsell.
            </p>
          </Reveal>
          <Reveal className="delay-3">
            <div className="hero-actions">
              <Button onClick={() => openBooking()}>Book Now</Button>
              <a className="quiet-link" href="#services">
                See the packages <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-proof delay-4">
          <span>HOW PRICING WORKS</span>
          <strong>
            4 <small>photos</small>
          </strong>
          <p>
            <b>One clear price</b>
            <small>2 interior + 2 exterior shots</small>
          </p>
        </Reveal>
      </section>
      <section className="section about" id="about">
        <div className="section-head">
          <Reveal>
            <Eyebrow>About KP Automobil</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>
              One van, one detailer, and a price you agree to before we arrive.
            </h2>
          </Reveal>
        </div>
        <div className="about-grid">
          <Reveal className="about-image image-tall">
            <img src={aboutImage} alt="Detailer polishing a black car" />
          </Reveal>
          <Reveal className="about-image">
            <img src={foamImage} alt="Car covered in snow foam during a wash" />
          </Reveal>
          <Reveal className="about-card delay-2">
            <div>
              <p>
                KP Automobil is V — one person, one van, working in your
                driveway. Home, work, or an apartment garage: the car stays
                where it is.
              </p>
              <p>
                Send two interior and two exterior photos and the price comes
                back in writing. No callback, no walkaround, no new number once
                we pull up.
              </p>
            </div>
            <dl>
              <div>
                <dt>
                  <SlotDeposit />
                </dt>
                <dd>Refundable deposit</dd>
              </div>
              <div>
                <dt>0%</dt>
                <dd>Card fee</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>
      <section className="section services" id="services">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>Services</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>Three packages and two add-ons. That is the whole menu.</h2>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              Pick the one that sounds closest. The price comes from your
              photos, not from a guess over the phone.
            </p>
          </Reveal>
        </div>
        <div className="services-layout">
          <div
            className="service-tabs"
            role="tablist"
            aria-label="Detailing packages"
          >
            {packages.map((item, index) => (
              <button
                aria-selected={activePackage === index}
                className={activePackage === index ? "active" : ""}
                key={item.name}
                onClick={() => setActivePackage(index)}
                role="tab"
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{item.name}</b>
                {item.addOn && <small>Add-on</small>}
              </button>
            ))}
          </div>
          <div className="service-panel" role="tabpanel">
            <div className="service-panel__top">
              <div>
                <span className="service-kicker">
                  {active.addOn ? "Add-on service" : "Package"}
                </span>
                <h3>{active.name}</h3>
                <p>{active.description}</p>
                <span className="price-note">
                  Priced from your photos, before you book
                </span>
                <Button onClick={() => openBooking("", active.name)}>
                  Book {active.name}
                </Button>
              </div>
              <img
                src={active.image}
                alt={`${active.name} detailing service`}
              />
            </div>
            <div className="included">
              <span>What's included</span>
              <ul>
                {active.items.map((item) => (
                  <li key={item}>
                    <i>+</i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section vehicles" id="vehicles">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>Vehicles we service</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>Four sizes. Yours decides the price, and nothing else does.</h2>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              Every package is priced by how much car there is. Pick your size
              and the booking form opens with that answer already filled in.
            </p>
          </Reveal>
        </div>
        <div className="driveway-grid">
          {bodyStyles.map((item, index) => (
            <Reveal
              className={`driveway-card delay-${Math.min(index + 1, 4)}${
                item.compact ? " driveway-card--compact" : ""
              }`}
              key={item.name}
            >
              <button
                onClick={() => {
                  openBooking(item.size, selectedFormPackage)
                }}
                type="button"
              >
                <img src={item.image} alt={`${item.name} vehicle`} />
                <b>{item.name}</b>
                <small>
                  Prices as{" "}
                  {vehicles.find((vehicle) => vehicle.id === item.size)?.name}
                </small>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="process" id="process">
        <div className="process-grid">
          <div className="process-panel">
            <img
              src={processImage}
              alt="KP Automobil van heading to a driveway booking"
            />
            <div className="process-shade" />
            <div className="process-panel__content">
              <div className="process-panel__cluster">
                <Reveal>
                  <Eyebrow>How it works</Eyebrow>
                </Reveal>
                <Reveal className="delay-1">
                  <h2>
                    Three steps, and the price is settled before anyone touches
                    the car.
                  </h2>
                </Reveal>
                <Reveal className="delay-2">
                  <p>
                    Four photos and about a minute of your time. That is the
                    whole booking — no site visit, no phone tag, and no new
                    figure once we are standing in your driveway.
                  </p>
                </Reveal>
                <Reveal className="delay-3">
                  <Button onClick={() => openBooking()}>Start booking</Button>
                </Reveal>
              </div>
            </div>
          </div>
          <ol className="process-cards">
            {processSteps.map(
              ([number, title, body, chip, image, alt], index) => (
                <Reveal
                  className={`process-card delay-${Math.min(index + 1, 4)}`}
                  key={number}
                >
                  <img src={image} alt={alt} />
                  <div>
                    <h3>
                      <span>{number}</span>
                      {title}
                    </h3>
                    <p>{body}</p>
                    <small>{chip}</small>
                  </div>
                </Reveal>
              ),
            )}
          </ol>
        </div>
      </section>
      <section className="section results" id="results">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>Before & after</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>Same BMW, same driveway. See five finishes come back.</h2>
          </Reveal>
        </div>
        <Reveal className="comparison">
          <Comparison />
        </Reveal>
      </section>
      <section className="section work" id="work">
        <div className="section-head work-head">
          <div>
            <Reveal>
              <Eyebrow>The work</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>What each package looks like when it is finished.</h2>
            </Reveal>
          </div>
          <Reveal className="delay-2">
            <p>
              Reference photography for now. V's own job photos replace these as
              the work comes in.
            </p>
          </Reveal>
        </div>
        <div className="work-grid">
          {[
            [
              workInterior,
              "Interior Refresh",
              "Dash, console, trim, and mats reset.",
            ],
            [
              fullDetailPorscheImage,
              "Full Detail",
              "Washed by hand, wheels and glass done.",
            ],
            [
              deepRestorationImage,
              "Deep Restoration",
              "Extraction, steam, and stain treatment.",
            ],
          ].map(([image, title, note], index) => (
            <Reveal className={`work-card delay-${index + 1}`} key={title}>
              <button onClick={() => openBooking("", title)} type="button">
                <img src={image} alt={`${title} detailing example`} />
                <span>
                  <b>{title}</b>
                  <small>{note}</small>
                  <em>
                    Book this package <Arrow />
                  </em>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section why" id="why">
        <div className="section-head section-head--center">
          <Reveal>
            <Eyebrow>The difference</Eyebrow>
          </Reveal>
          <Reveal className="delay-1">
            <h2>Eight things you can check before you book.</h2>
          </Reveal>
          <Reveal className="delay-2">
            <p>
              No vague quote, no card fee, no price change in your driveway.
              Every line below is something you can check.
            </p>
          </Reveal>
        </div>
        <Reveal className="why-table-wrap">
          <table className="why-table">
            <caption className="sr-only">
              How KP Automobil compares with most detailers
            </caption>
            <thead>
              <tr>
                <th>How it works</th>
                <th className="why-kp">KP Automobil</th>
                <th>Most detailers</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map(([feature, kp, others]) => (
                <tr key={feature}>
                  <th>{feature}</th>
                  <td className="why-kp">
                    <span className="why-mark">✓</span>
                    {kp}
                  </td>
                  <td>
                    <span className="why-mark why-mark--no">×</span>
                    {others}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>
      <section className="section reviews" id="reviews">
        <div className="promise-head">
          <div>
            <Reveal>
              <Eyebrow>Recent work</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>Polished cars. The standard you can expect.</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p className="promise-intro">
                Every image is a finish reference. Customer reviews will appear
                here only when they are real and verified.
              </p>
            </Reveal>
          </div>
          <div className="slider-controls">
            <button
              aria-label="Previous recent work"
              onClick={() => moveReviewRail(-1)}
              type="button"
            >
              ←
            </button>
            <button
              aria-label="Next recent work"
              onClick={() => moveReviewRail(1)}
              type="button"
            >
              →
            </button>
          </div>
        </div>
        <div
          aria-label="Recent work moving continuously right to left"
          className="review-marquee"
          onPointerCancel={endReviewDrag}
          onPointerDown={startReviewDrag}
          onPointerMove={moveReviewDrag}
          onPointerUp={endReviewDrag}
          onLostPointerCapture={endReviewDrag}
          onWheel={scrollReviewWithWheel}
          ref={reviewRailRef}
        >
          <div className="review-track">
            {[false, true].map((duplicate) => (
              <div
                aria-hidden={duplicate || undefined}
                className="review-track__group"
                key={duplicate ? "repeat" : "original"}
              >
                {reviewCards.map(([image, title, caption], index) => {
                  const cardNumber = index + 1
                  return (
                    <article
                      className="review-card"
                      data-review-index={cardNumber}
                      key={`${title}-${index}-${
                        duplicate ? "repeat" : "original"
                      }`}
                    >
                      <img
                        src={image}
                        alt={duplicate ? "" : `${title} polished car reference`}
                      />
                      <div className="review-card__shade" />
                      <div className="review-card__quote" aria-hidden="true">
                        “
                      </div>
                      <div className="review-card__copy">
                        <span>{String(cardNumber).padStart(2, "0")} / 10</span>
                        <b>{title}</b>
                        <small>{caption}</small>
                      </div>
                    </article>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="review-commitments">
          <div className="review-commitments__head">
            <Reveal>
              <Eyebrow>Customer feedback</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h3>No reviews yet. The commitments stay in writing.</h3>
            </Reveal>
            <Reveal className="delay-2">
              <p>
                KP Automobil is new. Real customer names and feedback will be
                published here only after customers choose to share them.
              </p>
            </Reveal>
          </div>
          <ul className="testimonial-grid">
            {commitments.map((commitment, index) => (
              <Reveal
                className={`testimonial-card delay-${index + 1}`}
                key={commitment.label}
              >
                <p>{commitment.body}</p>
                <div className="testimonial-card__person">
                  <span aria-hidden="true">{index === 0 ? "K" : "KP"}</span>
                  <div>
                    <b>{index === 0 ? "Kunj" : "KP Automobil"}</b>
                    <small>{commitment.sublabel}</small>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="section promise" id="promise">
        <div className="promise-head">
          <div>
            <Reveal>
              <Eyebrow>What we promise</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>No vague quote. No surprise number at the driveway.</h2>
            </Reveal>
          </div>
        </div>
        <div className="promise-grid">
          {promiseCards.map(([label, sublabel, body, image], index) => (
            <Reveal className={`promise-card delay-${index + 1}`} key={label}>
              <img alt="" className="promise-card__image" src={image} />
              <div className="promise-card__shade" />
              <div className="promise-card__content">
                <div className="promise-card__heading">
                  <b>{label}</b>
                  <small>{sublabel}</small>
                </div>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section faq" id="faq">
        <div className="faq-layout">
          <div className="faq-copy">
            <Reveal>
              <Eyebrow>FAQ</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>Questions, answered plainly.</h2>
            </Reveal>
            <Reveal className="delay-2">
              <p>If yours is not here, add it to the quote form notes.</p>
            </Reveal>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <Reveal
                className={`faq-row delay-${Math.min(index + 1, 4)}`}
                key={question}
              >
                <h3>
                  <button
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    type="button"
                  >
                    <span>{question}</span>
                    <b>{openFaq === index ? "×" : "+"}</b>
                  </button>
                </h3>
                <div
                  className={
                    openFaq === index ? "faq-answer open" : "faq-answer"
                  }
                >
                  <p>{answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-shell">
          <div className="footer-brand">
            <a href="#top" aria-label="KP Automobil home">
              <Mark />
            </a>
            <p>Mobile detailing with the price shown before you book.</p>
            <Button onClick={() => openBooking()}>Book Now</Button>
          </div>
          <div className="footer-links">
            <strong>Explore</strong>
            <a href="#about">About KP</a>
            <a href="#services">Packages</a>
            <a href="#process">How it works</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-links">
            <strong>Information</strong>
            <a href="#faq">FAQ</a>
            <a href="#promise">Pricing promise</a>
            <button onClick={() => openBooking()} type="button">
              Book a detail
            </button>
            <a
              className="footer-service-area"
              href="https://www.google.com/maps/search/?api=1&query=Boston%2C+Massachusetts"
              rel="noreferrer"
              target="_blank"
            >
              <LocationPin />
              <span>
                <b>Service area</b>
                <small>Boston, Massachusetts</small>
              </span>
              <Arrow />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© 2026 KP Automobil</span>
            <nav aria-label="Footer navigation">
              <a href="#services">Services</a>
              <a href="#results">Results</a>
              <a href="#reviews">Reviews</a>
              <a href="#faq">FAQ</a>
            </nav>
            <span>Owner-operated mobile detailing</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Comparison() {
  const [split, setSplit] = useState(50)
  const [pairIndex, setPairIndex] = useState(0)
  const [title, description, before, after] = comparisonPairs[pairIndex]
  const changePair = (direction: number) => {
    setPairIndex(
      (current) =>
        (current + direction + comparisonPairs.length) % comparisonPairs.length,
    )
    setSplit(50)
  }
  return (
    <figure>
      <div className="comparison-stage">
        <img
          src={after}
          alt={`Finished vehicle after ${title.toLowerCase()} service`}
        />
        <img
          className="comparison-before"
          src={before}
          alt={`Vehicle before ${title.toLowerCase()} service`}
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        />
        <span className="comparison-label comparison-label--before">
          Before
        </span>
        <span className="comparison-label comparison-label--after">After</span>
        <input
          aria-label="Drag to compare before and after"
          max="98"
          min="2"
          onChange={(event) => setSplit(Number(event.target.value))}
          type="range"
          value={split}
        />
        <span className="comparison-handle" style={{ left: `${split}%` }}>
          ↔
        </span>
      </div>
      <figcaption>{description}</figcaption>
      <div className="comparison-controls">
        <button
          aria-label="Previous before and after example"
          onClick={() => changePair(-1)}
          type="button"
        >
          ←
        </button>
        <div aria-label="Before and after examples" className="comparison-dots">
          {comparisonPairs.map(([pairTitle], index) => (
            <button
              aria-label={`Show ${pairTitle} example`}
              className={index === pairIndex ? "active" : ""}
              key={pairTitle}
              onClick={() => {
                setPairIndex(index)
                setSplit(50)
              }}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label="Next before and after example"
          onClick={() => changePair(1)}
          type="button"
        >
          →
        </button>
      </div>
    </figure>
  )
}

export default App
