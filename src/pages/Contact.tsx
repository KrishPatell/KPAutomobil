// /contact/ — "Talk to us."
//
// Three things the IA is explicit about, all honoured here:
//
//   1. No street address. It is a mobile business; there is no unit to visit and nothing to map.
//   2. "We reply within one business day" ships only if Kunj commits to it. It is
//      `site.replyWindow`, it is null, and the line does not render.
//   3. A honeypot and a one-a-minute rate limit instead of a CAPTCHA. A real person is never asked
//      to prove they are one.
//
// The submit goes through the same Resend-backed seam as the booking flow — src/lib/booking.ts.

import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import PageHead from "../components/PageHead"
import CtaBand from "../components/CtaBand"
import { Arrow, Button, ButtonLink, Eyebrow, Reveal } from "../components/primitives"
import { Link } from "../router"
import { pageCopy } from "../content/pages"
import { contactPage } from "../content/contact"
import { primaryCta } from "../content/nav"
import {
  facebookHref,
  instagramHref,
  mailHref,
  site,
  telHref,
} from "../content/site"
import { messageCooldown, sendMessage } from "../lib/booking"
import { preview, validate } from "../lib/photos"

const { form, channels: channelCopy, faq } = contactPage

type Fields = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

type Channel = {
  label: string
  value: string
  note: string
  href: string
  internal?: boolean
}

/** Only the channels that exist. A dead tel: link is worse than no phone number at all. */
function availableChannels(): Channel[] {
  const list: Channel[] = [
    {
      label: channelCopy.quote.label,
      value: channelCopy.quote.value,
      note: channelCopy.quote.note,
      href: channelCopy.quote.href,
      internal: true,
    },
  ]
  if (telHref && site.phone) {
    list.push({
      label: channelCopy.phone.label,
      value: site.phone,
      note: channelCopy.phone.note,
      href: telHref,
    })
  }
  if (mailHref && site.email) {
    list.push({
      label: channelCopy.email.label,
      value: site.email,
      note: channelCopy.email.note,
      href: mailHref,
    })
  }
  if (instagramHref && site.instagram) {
    list.push({
      label: channelCopy.instagram.label,
      value: `@${site.instagram}`,
      note: channelCopy.instagram.note,
      href: instagramHref,
    })
  }
  if (facebookHref && site.facebook) {
    list.push({
      label: channelCopy.facebook.label,
      value: site.facebook,
      note: channelCopy.facebook.note,
      href: facebookHref,
    })
  }
  return list
}

export default function Contact() {
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [photo, setPhoto] = useState<{ file: File; name: string; src: string } | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [trap, setTrap] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | "rate", string>>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<"sent" | "saved" | null>(null)

  const channels = availableChannels()

  function set(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    const problem = validate(file)
    if (problem) {
      setPhotoError(problem)
      return
    }
    setPhotoError(null)
    try {
      setPhoto({ file, name: file.name, src: await preview(file, 320) })
    } catch {
      setPhotoError("That image could not be read. Try a different one.")
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (sending) return

    // Anything in the honeypot came from a script. Show the same screen a person sees and store
    // nothing — telling a bot it was caught only teaches whoever wrote it.
    if (trap.trim() !== "") {
      setSent("sent")
      return
    }

    const next: Partial<Record<keyof Fields | "rate", string>> = {}
    if (!fields.name.trim()) next.name = form.errorRequired
    if (!fields.email.trim()) next.email = form.errorRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = form.errorEmail
    if (!fields.subject) next.subject = form.errorRequired
    if (fields.message.trim().length < 8) next.message = form.errorMessage
    if (messageCooldown() > 0) next.rate = form.errorTooFast

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSending(true)
    const delivered = await sendMessage({
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      subject: fields.subject,
      message: fields.message.trim(),
      photoName: photo?.name ?? null,
      sentAt: Date.now(),
    }, photo?.file ?? null)
    setSending(false)
    setSent(delivered ? "sent" : "saved")
  }

  return (
    <>
      <PageHead
        eyebrow={pageCopy.contact.eyebrow}
        heading={pageCopy.contact.heading}
        standfirst={pageCopy.contact.standfirst}
        title="Contact"
      />

      <section className="section contact-section">
        <div className="contact-layout">
          <Reveal className="contact-panel">
            {sent ? (
              <div className="contact-done">
                <Eyebrow>{form.eyebrow}</Eyebrow>
                <h2>{sent === "sent" ? form.sentTitle : form.savedTitle}</h2>
                <p>{sent === "sent" ? form.sentBody : form.savedBody}</p>
                <div className="contact-done__actions">
                  <ButtonLink href={primaryCta.href} variant="dark">
                    {primaryCta.label}
                  </ButtonLink>
                  <button
                    className="contact-again"
                    onClick={() => {
                      setSent(null)
                      setFields({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      })
                      setPhoto(null)
                    }}
                    type="button"
                  >
                    {form.successAgain}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <header className="contact-panel__head">
                  <Eyebrow>{form.eyebrow}</Eyebrow>
                  <h2>{form.heading}</h2>
                  <p>{form.intro}</p>
                </header>

                <form className="contact-form" noValidate onSubmit={onSubmit}>
                  <div className="contact-row">
                    <label className="contact-field">
                      <span>{form.fields.name.label}</span>
                      <input
                        autoComplete="name"
                        onChange={(event) => set("name", event.target.value)}
                        placeholder={form.fields.name.placeholder}
                        value={fields.name}
                      />
                      {errors.name && <em>{errors.name}</em>}
                    </label>

                    <label className="contact-field">
                      <span>{form.fields.email.label}</span>
                      <input
                        autoComplete="email"
                        inputMode="email"
                        onChange={(event) => set("email", event.target.value)}
                        placeholder={form.fields.email.placeholder}
                        value={fields.email}
                      />
                      {errors.email && <em>{errors.email}</em>}
                    </label>
                  </div>

                  <div className="contact-row">
                    <label className="contact-field">
                      <span>{form.fields.phone.label}</span>
                      <input
                        autoComplete="tel"
                        inputMode="tel"
                        onChange={(event) => set("phone", event.target.value)}
                        placeholder={form.fields.phone.placeholder}
                        value={fields.phone}
                      />
                      <small>{form.fields.phone.hint}</small>
                    </label>

                    <label className="contact-field">
                      <span>{form.fields.subject.label}</span>
                      <select
                        onChange={(event) => set("subject", event.target.value)}
                        value={fields.subject}
                      >
                        <option disabled value="">
                          {form.fields.subject.placeholder}
                        </option>
                        {form.subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                      {errors.subject && <em>{errors.subject}</em>}
                    </label>
                  </div>

                  <label className="contact-field">
                    <span>{form.fields.message.label}</span>
                    <textarea
                      onChange={(event) => set("message", event.target.value)}
                      placeholder={form.fields.message.placeholder}
                      rows={5}
                      value={fields.message}
                    />
                    {errors.message && <em>{errors.message}</em>}
                  </label>

                  <div className="contact-photo">
                    <div className="contact-photo__copy">
                      <b>{form.fields.photo.label}</b>
                      <small>{form.fields.photo.hint}</small>
                    </div>
                    {photo ? (
                      <div className="contact-photo__file">
                        <img alt="" src={photo.src} />
                        <span>{photo.name}</span>
                        <button onClick={() => setPhoto(null)} type="button">
                          {form.fields.photo.clear}
                        </button>
                      </div>
                    ) : (
                      <label className="contact-photo__pick">
                        <input accept="image/*" onChange={onPhoto} type="file" />
                        <span>{form.fields.photo.empty}</span>
                      </label>
                    )}
                    {photoError && <em>{photoError}</em>}
                  </div>

                  {/* Honeypot. Off-screen, not tabbable, and never announced. */}
                  <div aria-hidden="true" className="contact-trap">
                    <label>
                      {form.honeypot.label}
                      <input
                        autoComplete="off"
                        onChange={(event) => setTrap(event.target.value)}
                        tabIndex={-1}
                        value={trap}
                      />
                    </label>
                  </div>

                  {errors.rate && <p className="contact-error">{errors.rate}</p>}

                  <div className="contact-actions">
                    <Button disabled={sending} type="submit" variant="dark">
                      {sending ? form.submitting : form.submit}
                    </Button>
                    <small>{form.pendingNote}</small>
                  </div>
                </form>
              </>
            )}
          </Reveal>

          <Reveal className="contact-aside delay-1">
            <Eyebrow>{channelCopy.eyebrow}</Eyebrow>
            <h2>{channelCopy.heading}</h2>

            <ul className="contact-channels">
              {channels.map((channel) => {
                const body = (
                  <>
                    <span>{channel.label}</span>
                    <b>{channel.value}</b>
                    <small>{channel.note}</small>
                    <Arrow />
                  </>
                )
                return (
                  <li key={channel.label}>
                    {channel.internal ? (
                      <Link href={channel.href}>{body}</Link>
                    ) : (
                      <a
                        href={channel.href}
                        rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                        target={channel.href.startsWith("http") ? "_blank" : undefined}
                      >
                        {body}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>

            <dl className="contact-meta">
              {site.replyWindow && (
                <div>
                  <dt>{channelCopy.replyLabel}</dt>
                  <dd>{site.replyWindow}</dd>
                </div>
              )}
              <div>
                <dt>{channelCopy.hoursLabel}</dt>
                <dd>
                  {site.hours.length > 0 ? (
                    <ul className="contact-hours">
                      {site.hours.map((row) => (
                        <li key={row.days}>
                          <span>{row.days}</span>
                          <span>
                            {row.opens} – {row.closes}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    channelCopy.hoursPending
                  )}
                </dd>
              </div>
              <div>
                <dt>{channelCopy.addressLabel}</dt>
                <dd>{channelCopy.addressNote}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section faq">
        <div className="faq-layout">
          <div className="faq-copy">
            <Reveal>
              <Eyebrow>{faq.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>{faq.heading}</h2>
            </Reveal>
          </div>
          <div className="faq-list">
            {faq.items.map((item, index) => (
              <Reveal
                className={`faq-row is-open delay-${Math.min(index + 1, 4)}`}
                key={item.question}
              >
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
