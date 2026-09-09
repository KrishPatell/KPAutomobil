// /book/ — the instant-quote flow, and the only page on the site that takes money.
//
// Three things shape it:
//
//   - **Reduced chrome.** No site nav, no footer, no links out except the wordmark and the terms.
//     The IA is explicit that nothing on this page should offer an exit before the deposit.
//   - **Each step is a URL.** /book/photos is real and shareable; /book/ redirects to whichever step
//     is actually next. You cannot deep-link past your own answers — the guard below bounces you
//     back to the first unanswered step, so the summary can never render half a booking.
//   - **The seams stay visible.** send(), uploadPhotos() and takeDeposit() all report that they did
//     not deliver, and the final screen says so in those words. See src/lib/payments.ts.

import { useEffect, useRef, useState, type ReactElement } from "react"
import { Link, useRoute } from "../../router"
import { Mark } from "../../components/primitives"
import {
  ConditionStep,
  DepositStep,
  DetailsStep,
  ExtrasStep,
  PhotosStep,
  ServiceStep,
  SlotStep,
  VehicleStep,
} from "./steps"
import type { StepProps } from "./steps"
import {
  STEPS,
  canVisit,
  clear,
  emptyState,
  firstIncomplete,
  isComplete,
  isPackageName,
  isSizeId,
  isStep,
  load,
  photoCount,
  save,
  stepIndex,
} from "../../lib/bookingFlow"
import type { FlowState, StepSlug } from "../../lib/bookingFlow"
import { applySuggestions, money, quote, suggestAddOns } from "../../lib/quote"
import { bookFlow } from "../../content/bookFlow"
import { pricing } from "../../content/pricing"
import { packageBySlug } from "../../content/services"
import { sizeLabels } from "../../content/vehicles"
import { PHOTO_SLOTS, uploadPhotos } from "../../lib/photos"
import { takeDeposit } from "../../lib/payments"
import { send } from "../../lib/booking"
import { site } from "../../content/site"

const bodies: Record<StepSlug, (props: StepProps) => ReactElement> = {
  vehicle: VehicleStep,
  service: ServiceStep,
  condition: ConditionStep,
  photos: PhotosStep,
  extras: ExtrasStep,
  slot: SlotStep,
  details: DetailsStep,
  deposit: DepositStep,
}

const copy: Record<StepSlug, { heading: string; lede: string }> = {
  vehicle: bookFlow.vehicle,
  service: bookFlow.service,
  condition: bookFlow.condition,
  photos: bookFlow.photos,
  extras: bookFlow.extras,
  slot: bookFlow.slot,
  details: bookFlow.details,
  deposit: bookFlow.deposit,
}

/** What actually happened when the request was submitted. Every field is reported on screen. */
type Outcome = {
  delivered: boolean
  photosUploaded: boolean
  depositReason: string
}

export default function Book() {
  const { path, params, navigate } = useRoute()
  const [state, setState] = useState<FlowState>(() => load())
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [sending, setSending] = useState(false)
  const seeded = useRef(false)

  const requested = path.split("/")[2] ?? ""
  const allowed = firstIncomplete(state)
  const step: StepSlug = isStep(requested) && canVisit(state, requested) ? requested : allowed

  function patch(next: Partial<FlowState>) {
    setState((current) => ({ ...current, ...next }))
  }

  // ?package= and ?size= arrive from the homepage tiles and the /services/ CTAs. They fill the
  // answer in before the guard runs, which is why those links can point straight at a later step.
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    const slug = params.get("package")
    const size = params.get("size")
    const next: Partial<FlowState> = {}
    const chosen = slug ? packageBySlug(slug) : undefined
    if (chosen && !chosen.addOn && isPackageName(chosen.name)) next.service = chosen.name
    if (isSizeId(size)) next.size = size
    if (Object.keys(next).length > 0) setState((current) => ({ ...current, ...next }))
  }, [params])

  useEffect(() => {
    save(state)
  }, [state])

  // Keep the address bar honest: a step you have not earned rewrites to the one you have.
  useEffect(() => {
    if (outcome) return
    if (requested !== step) navigate(`/book/${step}`, { replace: true })
  }, [requested, step, outcome, navigate])

  useEffect(() => {
    document.title = `${bookFlow.title} · ${site.name}`
  }, [])

  const priced = quote(state.size, state.service, state.addOns)
  const index = stepIndex(step)
  const Body = bodies[step]
  const canContinue = isComplete(state, step)
  const last = index === STEPS.length - 1

  function goNext() {
    if (!canContinue) return
    // Leaving the condition step is what commits its answers to line items — pre-checked, named,
    // and every one removable on the extras step that follows.
    if (step === "condition") {
      patch({ addOns: applySuggestions(state.addOns, suggestAddOns(state.conditions)) })
    }
    navigate(`/book/${STEPS[index + 1].slug}`)
  }

  async function submit() {
    setSending(true)
    const files = PHOTO_SLOTS.map((slot) => state.photos[slot.id]?.file).filter(
      (file): file is File => file instanceof File,
    )
    const photosUploaded = files.length > 0 ? await uploadPhotos(files) : false
    const deposit = await takeDeposit()
    const delivered = await send({
      name: state.name,
      phone: state.phone,
      email: state.email,
      address: state.address,
      size: state.size ?? "",
      bodyStyle: state.bodyStyle ?? "",
      vehicleNote: state.vehicleNote,
      service: state.service ?? "",
      conditions: state.conditions,
      addOns: state.addOns,
      photoCount: photoCount(state),
      photosSkipped: state.photosSkipped,
      date: state.date,
      window: state.window,
      payMethod: state.payMethod,
      total: priced.total,
      notes: state.notes,
    })
    setSending(false)
    setOutcome({
      delivered,
      photosUploaded,
      depositReason: deposit.status === "unavailable" ? deposit.reason : "",
    })
  }

  function restart() {
    clear()
    setState({ ...emptyState })
    setOutcome(null)
    navigate("/book/vehicle", { replace: true })
  }

  return (
    <div className="booking-page">
      <header className="booking-header">
        <Link aria-label={site.name} href="/">
          <Mark />
        </Link>
        <Link className="booking-header__exit" href="/">
          {bookFlow.backToSite}
        </Link>
      </header>

      {outcome ? (
        <div className="booking-layout booking-layout--done">
          <div className="booking-panel">
            <div className="booking-complete">
              <span aria-hidden="true">✓</span>
              <p>{bookFlow.stepOf(STEPS.length, STEPS.length)}</p>
              <h1>{bookFlow.deposit.doneTitle}</h1>
              <p>{bookFlow.deposit.doneBody}</p>
              <ul className="booking-outcome">
                <li>
                  {outcome.delivered
                    ? "Your request was sent."
                    : "Your request was saved in this browser. It has not reached an inbox."}
                </li>
                <li>
                  {outcome.photosUploaded
                    ? "Your photos were uploaded."
                    : "Your photos stayed on this device. Nothing was uploaded."}
                </li>
                <li>{outcome.depositReason || "Nothing was charged."}</li>
              </ul>
              <p className="booking-note">{bookFlow.deposit.pendingNote}</p>
              <button className="booking-action" onClick={restart} type="button">
                {bookFlow.deposit.startAgain}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="booking-layout">
          <aside className="booking-progress">
            <p>{bookFlow.progressLabel}</p>
            <ol>
              {STEPS.map((entry, position) => {
                const done = isComplete(state, entry.slug)
                const reachable = canVisit(state, entry.slug)
                return (
                  <li
                    className={`${done ? "complete" : ""} ${entry.slug === step ? "active" : ""}`.trim()}
                    key={entry.slug}
                  >
                    <button
                      disabled={!reachable}
                      onClick={() => navigate(`/book/${entry.slug}`)}
                      type="button"
                    >
                      <span>{String(position + 1).padStart(2, "0")}</span>
                      {entry.label}
                    </button>
                  </li>
                )
              })}
            </ol>
          </aside>

          <div className="booking-panel">
            <div className="booking-panel__intro">
              <h1>{copy[step].heading}</h1>
              <p>{copy[step].lede}</p>
            </div>

            <Body patch={patch} state={state} />

            {last && <Summary priced={priced} state={state} />}

            <div className="booking-actions">
              <button
                className="booking-back"
                disabled={index === 0}
                onClick={() => navigate(`/book/${STEPS[index - 1].slug}`)}
                type="button"
              >
                {bookFlow.back}
              </button>
              <span>{bookFlow.stepOf(index + 1, STEPS.length)}</span>
              {last ? (
                <button className="booking-action" disabled={sending} onClick={submit} type="button">
                  {sending ? bookFlow.deposit.sending : bookFlow.deposit.submit}
                </button>
              ) : (
                <button
                  className="booking-action"
                  disabled={!canContinue}
                  onClick={goNext}
                  type="button"
                >
                  {bookFlow.next}
                </button>
              )}
            </div>
          </div>

          <Pill priced={priced} />
        </div>
      )}
    </div>
  )
}

/** The itemised quote. Shown on the deposit step, where a total is about to be acted on. */
function Summary({ priced, state }: { priced: ReturnType<typeof quote>; state: FlowState }) {
  return (
    <div className="booking-summary">
      <div className="booking-summary__body">
        <span className="booking-summary__label">{bookFlow.deposit.summaryLabel}</span>
        <ul className="booking-lines">
          {priced.lines.map((line) => (
            <li className={line.base ? "is-base" : ""} key={line.label}>
              <span>{line.label}</span>
              <em>{line.amount === null ? pricing.pendingTotal : money(line.amount)}</em>
            </li>
          ))}
        </ul>
        <div className="booking-total">
          <span>{bookFlow.deposit.totalLabel}</span>
          <strong>{priced.total === null ? pricing.pendingTotal : money(priced.total)}</strong>
        </div>
        {priced.total !== null && (
          <div className="booking-total booking-total--balance">
            <span>{bookFlow.deposit.balanceLabel}</span>
            <em>{money(Math.max(priced.total - site.deposit, 0))}</em>
          </div>
        )}
        <p className="booking-note">
          {priced.hasUnpriced ? pricing.pendingNote : pricing.qualifier}
        </p>
        <dl>
          <div>
            <dt>Vehicle</dt>
            <dd>
              {state.bodyStyle ?? "—"}
              {state.size ? ` · ${sizeLabels[state.size]}` : ""}
            </dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{state.date ? `${state.date} · ${state.window}` : "—"}</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{state.address || "—"}</dd>
          </div>
          <div>
            <dt>Photos</dt>
            <dd>
              {state.photosSkipped && photoCount(state) === 0
                ? bookFlow.photos.skipped
                : bookFlow.photos.counter(photoCount(state), PHOTO_SLOTS.length)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

/** The running total. Sticky at the foot on narrow screens, inline in the rail on wide ones. */
function Pill({ priced }: { priced: ReturnType<typeof quote> }) {
  return (
    <div className="book-pill">
      <span>{bookFlow.pill.label}</span>
      <strong>
        {priced.lines.length === 0
          ? bookFlow.pill.empty
          : priced.total === null
            ? pricing.pendingTotal
            : money(priced.total)}
      </strong>
    </div>
  )
}
