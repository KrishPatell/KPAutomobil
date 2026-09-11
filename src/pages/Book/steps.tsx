// The eight step bodies. Each one is handed the whole flow state and a `patch` that merges into it;
// nothing here owns state of its own except the transient bits (a photo that failed validation, the
// file input's ref) that must not survive a step change.
//
// They are in one file on purpose: they share the same eight-line prop contract and reading them
// top to bottom is the fastest way to see what the flow actually asks for.

import { useRef, useState } from "react"
import { bookFlow } from "../../content/bookFlow"
import { booking } from "../../content/booking"
import { addOns as addOnCatalogue, bookablePackages, conditions } from "../../content/services"
import type { ConditionId } from "../../content/services"
import { addOnPrices, packagePrices, pricing } from "../../content/pricing"
import { quoteBodyStyles, sizeLabels } from "../../content/vehicles"
import type { SizeId } from "../../content/vehicles"
import { PHOTO_SLOTS, preview, validate } from "../../lib/photos"
import type { PhotoSlotId } from "../../lib/photos"
import { suggestAddOns } from "../../lib/quote"
import { photoCount } from "../../lib/bookingFlow"
import type { FlowState } from "../../lib/bookingFlow"
import { site } from "../../content/site"
import { Link } from "../../router"
import { RollingPrice } from "../../components/primitives"

export type StepProps = {
  state: FlowState
  patch: (next: Partial<FlowState>) => void
}

/** A price for a named service at the chosen size, or null while either is unknown. */
function priceFor(table: Record<string, Record<SizeId, number | null>>, name: string, size: SizeId | null) {
  if (!size) return null
  return table[name]?.[size] ?? null
}

function localDateIso(date = new Date()): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`
}

function dateKey(year: number, month: number, day: number): string {
  return localDateIso(new Date(year, month, day))
}

function CalendarPicker({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const today = localDateIso()
  const selected = value ? new Date(`${value}T12:00:00`) : new Date()
  const [viewMonth, setViewMonth] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1))
  const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const [year, month] = [viewMonth.getFullYear(), viewMonth.getMonth()]
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthOptions = Array.from({ length: 24 }, (_, index) => {
    const option = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + index, 1)
    return { label: option.toLocaleDateString("en-US", { month: "long", year: "numeric" }), value: monthKey(option) }
  })
  const dayCells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
    if (index < firstWeekday) return null
    return index - firstWeekday + 1
  })

  function chooseMonth(key: string) {
    const [nextYear, nextMonth] = key.split("-").map(Number)
    setViewMonth(new Date(nextYear, nextMonth - 1, 1))
  }

  function moveMonth(offset: number) {
    const next = new Date(year, month + offset, 1)
    if (next < currentMonth) return
    setViewMonth(next)
  }

  return (
    <div className="booking-calendar" aria-label="Choose a preferred date">
      <div className="booking-calendar__header">
        <button
          aria-label="Previous month"
          className="booking-calendar__arrow"
          disabled={monthKey(viewMonth) === monthKey(currentMonth)}
          onClick={() => moveMonth(-1)}
          type="button"
        >
          ←
        </button>
        <label className="booking-calendar__month">
          <span>Month</span>
          <select aria-label="Choose month" onChange={(event) => chooseMonth(event.target.value)} value={monthKey(viewMonth)}>
            {monthOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <button aria-label="Next month" className="booking-calendar__arrow" onClick={() => moveMonth(1)} type="button">
          →
        </button>
      </div>
      <div className="booking-calendar__weekdays" aria-hidden="true">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="booking-calendar__days" role="grid">
        {dayCells.map((day, index) => {
          if (day === null) return <span aria-hidden="true" className="booking-calendar__empty" key={`empty-${index}`} />
          const date = dateKey(year, month, day)
          const isPast = date < today
          const isSelected = date === value
          return (
            <button
              aria-label={new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              aria-selected={isSelected}
              className={`${isSelected ? "is-selected " : ""}${date === today ? "is-today" : ""}`}
              disabled={isPast}
              key={date}
              onClick={() => onChange(date)}
              role="gridcell"
              type="button"
            >
              {day}
            </button>
          )
        })}
      </div>
      <p className="booking-calendar__note">Today is selected by default. You can change it anytime.</p>
    </div>
  )
}

export function VehicleStep({ state, patch }: StepProps) {
  return (
    <>
      <div className="booking-choice-grid booking-choice-grid--media">
        {quoteBodyStyles.map((style) => (
          <button
            className={state.bodyStyle === style.name ? "selected" : ""}
            key={style.name}
            onClick={() => patch({ bodyStyle: style.name, size: style.size })}
            type="button"
          >
            <img alt="" className="booking-choice-media" src={style.image} />
            <span className="booking-choice-copy">
              <b>{style.name}</b>
              <small>
                {bookFlow.vehicle.sizeLabel} {sizeLabels[style.size].toLowerCase()}
              </small>
            </span>
          </button>
        ))}
      </div>

      <div className="booking-contact booking-contact--single">
        <label className="booking-contact__wide">
          {bookFlow.vehicle.noteLabel}
          <input
            onChange={(event) => patch({ vehicleNote: event.target.value })}
            placeholder={bookFlow.vehicle.notePlaceholder}
            value={state.vehicleNote}
          />
          <small>{bookFlow.vehicle.noteHint}</small>
        </label>
      </div>
    </>
  )
}

export function ServiceStep({ state, patch }: StepProps) {
  return (
    <>
      {!state.size && <p className="booking-note">{bookFlow.service.pickSizeFirst}</p>}
      <div className="booking-choice-grid booking-choice-grid--media booking-choice-grid--add-ons">
        {bookablePackages.map((item) => {
          const price = priceFor(packagePrices, item.name, state.size)
          return (
            <button
              className={state.service === item.name ? "selected" : ""}
              key={item.slug}
              onClick={() => patch({ service: item.name })}
              type="button"
            >
              <img alt="" className="booking-choice-media" src={item.image} />
              <span className="booking-choice-copy">
                <b>{item.name}</b>
                <span>{item.description}</span>
                <small>{price === null ? pricing.pendingTotal : <RollingPrice amount={price} />}</small>
              </span>
            </button>
          )
        })}
      </div>
      <p className="booking-note">{pricing.qualifier}</p>
    </>
  )
}

export function ConditionStep({ state, patch }: StepProps) {
  function set(id: ConditionId, value: boolean) {
    patch({
      conditions: value
        ? [...state.conditions.filter((item) => item !== id), id]
        : state.conditions.filter((item) => item !== id),
      conditionsAnswered: [...state.conditionsAnswered.filter((item) => item !== id), id],
    })
  }

  const added = suggestAddOns(state.conditions)

  return (
    <>
      <ul className="booking-conditions">
        {conditions.map((item) => {
          const answered = state.conditionsAnswered.includes(item.id)
          const yes = state.conditions.includes(item.id)
          return (
            <li key={item.id}>
              <div>
                <b>{item.question}</b>
                <small>{item.help}</small>
              </div>
              <div className="booking-conditions__answer">
                <button
                  aria-pressed={answered && yes}
                  className={answered && yes ? "is-on" : ""}
                  onClick={() => set(item.id, true)}
                  type="button"
                >
                  {bookFlow.condition.yes}
                </button>
                <button
                  aria-pressed={answered && !yes}
                  className={answered && !yes ? "is-on" : ""}
                  onClick={() => set(item.id, false)}
                  type="button"
                >
                  {bookFlow.condition.no}
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <button
        className="booking-skip"
        onClick={() =>
          patch({ conditions: [], conditionsAnswered: conditions.map((item) => item.id) })
        }
        type="button"
      >
        {bookFlow.condition.none}
      </button>

      {added.length > 0 && (
        <div className="booking-added">
          <span className="booking-added__label">{bookFlow.condition.addedLabel}</span>
          <ul>
            {added.map((name) => {
              const price = priceFor(addOnPrices, name, state.size)
              return (
                <li key={name}>
                  <span>{name}</span>
                  <em>{price === null ? pricing.pendingTotal : <RollingPrice amount={price} />}</em>
                </li>
              )
            })}
          </ul>
          <p>{bookFlow.condition.addedNote}</p>
        </div>
      )}
      {added.length === 0 && <p className="booking-note">{bookFlow.condition.noneHint}</p>}
    </>
  )
}

export function PhotosStep({ state, patch }: StepProps) {
  const [error, setError] = useState<string | null>(null)
  const inputs = useRef<Partial<Record<PhotoSlotId, HTMLInputElement | null>>>({})
  const done = photoCount(state)
  const reattaching = PHOTO_SLOTS.some(
    (slot) => state.photos[slot.id] && state.photos[slot.id]?.file === null,
  )

  async function take(id: PhotoSlotId, file: File | undefined) {
    if (!file) return
    const problem = validate(file)
    if (problem) {
      setError(problem)
      return
    }
    setError(null)
    const thumb = await preview(file)
    patch({
      photos: { ...state.photos, [id]: { preview: thumb, name: file.name, size: file.size, file } },
      photosSkipped: false,
    })
  }

  return (
    <>
      <div className="booking-photo-list">
        {PHOTO_SLOTS.map((slot) => {
          const entry = state.photos[slot.id]
          return (
            <label className={`booking-photo-slot${entry ? " is-filled" : ""}`} key={slot.id}>
              <input
                accept="image/*"
                onChange={(event) => take(slot.id, event.target.files?.[0])}
                ref={(node) => {
                  inputs.current[slot.id] = node
                }}
                type="file"
              />
              {entry ? (
                <img alt="" className="booking-photo-thumb" src={entry.preview} />
              ) : (
                <span className="booking-photo-icon" aria-hidden="true">
                  +
                </span>
              )}
              <span>
                <b>{slot.label}</b>
                <small>{slot.hint}</small>
                <em>
                  {entry
                    ? entry.file
                      ? bookFlow.photos.replace
                      : bookFlow.photos.reattach
                    : bookFlow.photos.add}
                </em>
              </span>
            </label>
          )
        })}
      </div>

      {error && <p className="booking-note booking-note--warn">{error}</p>}
      {reattaching && <p className="booking-note">{bookFlow.photos.reattachNote}</p>}

      <div className="booking-photo-foot">
        <span>{bookFlow.photos.counter(done, PHOTO_SLOTS.length)}</span>
        {state.photosSkipped ? (
          <button className="booking-skip" onClick={() => patch({ photosSkipped: false })} type="button">
            {bookFlow.photos.undoSkip}
          </button>
        ) : (
          <button className="booking-skip" onClick={() => patch({ photosSkipped: true })} type="button">
            {bookFlow.photos.skip}
          </button>
        )}
      </div>

      {state.photosSkipped && done < PHOTO_SLOTS.length && (
        <p className="booking-note">{bookFlow.photos.skippedNote}</p>
      )}
    </>
  )
}

export function ExtrasStep({ state, patch }: StepProps) {
  const suggested = suggestAddOns(state.conditions)

  function toggle(name: string) {
    patch({
      addOns: state.addOns.includes(name)
        ? state.addOns.filter((item) => item !== name)
        : [...state.addOns, name],
    })
  }

  return (
    <>
      <ul className="booking-extras">
        {addOnCatalogue.map((addOn) => {
          const price = priceFor(addOnPrices, addOn.name, state.size)
          const on = state.addOns.includes(addOn.name)
          return (
            <li key={addOn.name}>
              <button
                aria-pressed={on}
                className={on ? "is-on" : ""}
                onClick={() => toggle(addOn.name)}
                type="button"
              >
                <span className="booking-extras__check" aria-hidden="true">
                  {on ? "✓" : ""}
                </span>
                <span className="booking-extras__copy">
                  <b>
                    {addOn.name}
                    {suggested.includes(addOn.name) && (
                      <i className="booking-tag">{bookFlow.extras.suggested}</i>
                    )}
                  </b>
                  <small>{addOn.description}</small>
                </span>
                <span className="booking-extras__price">
                  {price === null ? bookFlow.extras.unpricedTag : <RollingPrice amount={price} />}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="booking-note">{pricing.unpricedNote}</p>
    </>
  )
}

export function SlotStep({ state, patch }: StepProps) {
  return (
    <>
      <div className="booking-contact">
        <label>
          {bookFlow.slot.dateLabel}
          <CalendarPicker onChange={(date) => patch({ date })} value={state.date} />
        </label>
        <div className="booking-windows">
          <span className="booking-windows__label">{bookFlow.slot.windowLabel}</span>
          <div>
            {booking.windows.map((window) => (
              <button
                aria-pressed={state.window === window}
                className={state.window === window ? "is-on" : ""}
                key={window}
                onClick={() => patch({ window })}
                type="button"
              >
                {window}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="booking-note">{bookFlow.slot.requestedNote}</p>
    </>
  )
}

export function DetailsStep({ state, patch }: StepProps) {
  return (
    <div className="booking-contact">
      <label>
        {booking.fields.name.label}
        <input
          autoComplete="name"
          onChange={(event) => patch({ name: event.target.value })}
          placeholder={booking.fields.name.placeholder}
          value={state.name}
        />
      </label>
      <label>
        {booking.fields.phone.label}
        <input
          autoComplete="tel"
          onChange={(event) => patch({ phone: event.target.value })}
          placeholder={booking.fields.phone.placeholder}
          type="tel"
          value={state.phone}
        />
      </label>
      <label className="booking-contact__wide">
        {booking.fields.email.label}
        <input
          autoComplete="email"
          onChange={(event) => patch({ email: event.target.value })}
          placeholder={booking.fields.email.placeholder}
          type="email"
          value={state.email}
        />
        <small>{booking.fields.email.hint}</small>
      </label>
      <label className="booking-contact__wide">
        Address
        <input
          autoComplete="street-address"
          onChange={(event) => patch({ address: event.target.value })}
          placeholder={`Street, ${site.city}`}
          value={state.address}
        />
        <small>{bookFlow.details.addressHint}</small>
      </label>
      <label className="booking-contact__wide">
        {booking.fields.notes.label}
        <textarea
          onChange={(event) => patch({ notes: event.target.value })}
          placeholder={booking.fields.notes.placeholder}
          rows={3}
          value={state.notes}
        />
      </label>
    </div>
  )
}

export function DepositStep({ state, patch }: StepProps) {
  return (
    <>
      <div className="booking-deposit">
        <img alt="" className="booking-deposit__image" src={bookablePackages[0].image} />
        <div className="booking-deposit__copy">
          <strong><RollingPrice amount={site.deposit} /></strong>
          <div>
            <b>{bookFlow.deposit.amountLabel}</b>
            <p>{bookFlow.deposit.lede}</p>
          </div>
        </div>
      </div>

      <div className="booking-methods">
        <p className="booking-methods__note">{bookFlow.deposit.methodsNote}</p>
        <span className="booking-methods__label">{bookFlow.deposit.methodsLabel}</span>
        <div>
          {bookFlow.deposit.methods.map((method) => (
            <button
              aria-pressed={state.payMethod === method.id}
              className={state.payMethod === method.id ? "is-on" : ""}
              key={method.id}
              onClick={() => patch({ payMethod: method.id })}
              type="button"
            >
              <b>{method.label}</b>
              <small>{method.note}</small>
            </button>
          ))}
        </div>
      </div>

      <Link className="booking-terms-link" href="/booking-terms/">
        {bookFlow.deposit.termsLink}
      </Link>
    </>
  )
}
