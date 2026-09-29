import { readFile } from "node:fs/promises"
import formidable from "formidable"
import { Resend } from "resend"

export function isEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function displayValue(value, fallback = "Not provided") {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "None"
  const text = String(value ?? "").trim()
  return text || fallback
}

function row(label, value, { link = false } = {}) {
  const content = escapeHtml(displayValue(value))
  const body =
    link && isEmailAddress(String(value).trim())
      ? `<a href="mailto:${encodeURIComponent(String(value).trim())}" style="color:#e85b20;text-decoration:none;">${content}</a>`
      : content
  return `<tr>
    <td width="42%" style="width:42%;padding:11px 18px 11px 0;border-bottom:1px solid #e8e5df;color:#73716d;font:12px/1.4 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;vertical-align:top;overflow-wrap:anywhere;">${escapeHtml(label)}</td>
    <td width="58%" style="width:58%;padding:11px 0;border-bottom:1px solid #e8e5df;color:#181817;font:15px/1.45 Arial,sans-serif;vertical-align:top;overflow-wrap:anywhere;">${body}</td>
  </tr>`
}

function section(title, rows) {
  return `<tr><td style="padding:0 28px 24px;">
    <p style="margin:0 0 8px;color:#e85b20;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;">${escapeHtml(title)}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;">${rows.join("")}</table>
  </td></tr>`
}

function emailLayout({ eyebrow, heading, intro, sections }) {
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:24px 12px;background:#f4f3ef;color:#181817;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;margin:0 auto;background:#ffffff;">
    <tr><td style="padding:28px;background:#151515;color:#ffffff;">
      <p style="margin:0 0 14px;color:#ff5a1f;font:700 12px/1.4 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;">KP11 · Mobile Auto Spa</p>
      <h1 style="margin:0;color:#ffffff;font:700 28px/1.16 Arial,sans-serif;">${escapeHtml(heading)}</h1>
    </td></tr>
    <tr><td style="padding:26px 28px 24px;">
      <p style="margin:0 0 8px;color:#e85b20;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
      <p style="margin:0;color:#575550;font:16px/1.55 Arial,sans-serif;">${escapeHtml(intro)}</p>
    </td></tr>
    ${sections.join("")}
    <tr><td style="padding:20px 28px;background:#f4f3ef;color:#73716d;font:13px/1.55 Arial,sans-serif;">
      Reply directly to this email to contact the customer. Photos, when provided, are included as attachments.
    </td></tr>
  </table>
</body></html>`
}

export function bookingEmailHtml(payload) {
  const vehicle = [payload.bodyStyle, payload.vehicleNote]
    .filter(Boolean)
    .join(" · ")
  return emailLayout({
    eyebrow: "Booking request",
    heading: "New booking request received.",
    intro: "Customer, vehicle, and service details are below.",
    sections: [
      section("Customer", [
        row("Name", payload.name),
        row("Phone", payload.phone),
        row("Email", payload.email, { link: true }),
      ]),
      section("Vehicle & service", [
        row("Service", payload.service),
        row("Vehicle", vehicle),
        row("Vehicle size", payload.size),
        row("Add-ons", payload.addOns),
        row("Conditions", payload.conditions),
      ]),
      section("Visit", [
        row("Location type", payload.locationType),
        row("Address", payload.address),
        row("Access notes", payload.notes),
        row("Photo attachments", `${payload.photoCount || 0} of 4 attached`),
        row("Photo views", payload.photoLabels),
      ]),
      section("Booking notes", [
        row("Preferred date", payload.date),
        row("Time window", payload.window),
        row(
          "Booking terms",
          payload.termsAccepted ? "Accepted" : "Not accepted",
        ),
      ]),
      section("Payment", [
        row("Deposit", payload.payment?.deposit),
        row("Method", payload.payment?.method),
        row("Provider", payload.payment?.provider),
        row("Mode", payload.payment?.mode),
        row("Status", payload.payment?.status),
      ]),
    ],
  })
}

export function bookingEmailFields(payload) {
  const vehicle = [payload.bodyStyle, payload.vehicleNote]
    .filter(Boolean)
    .join(" · ")
  return [
    ["Name", payload.name],
    ["Phone", payload.phone],
    ["Email", payload.email],
    ["Service", payload.service],
    ["Vehicle", vehicle],
    ["Vehicle size", payload.size],
    ["Add-ons", displayValue(payload.addOns)],
    ["Conditions", displayValue(payload.conditions)],
    ["Location type", payload.locationType],
    ["Address", payload.address],
    ["Access notes", payload.notes],
    ["Photo attachments", `${payload.photoCount || 0} of 4 attached`],
    ["Photo views", displayValue(payload.photoLabels)],
    ["Preferred date", payload.date],
    ["Time window", payload.window],
    ["Booking terms", payload.termsAccepted ? "Accepted" : "Not accepted"],
    ["Deposit", payload.payment?.deposit],
    ["Payment method", payload.payment?.method],
    ["Payment provider", payload.payment?.provider],
    ["Payment mode", payload.payment?.mode],
    ["Payment status", payload.payment?.status],
  ]
}

export function contactEmailHtml({ email, message, name, phone, subject }) {
  return emailLayout({
    eyebrow: "New website message",
    heading: subject,
    intro: "A customer sent a message through the KP Automobil website.",
    sections: [
      section("Customer", [
        row("Name", name),
        row("Phone", phone),
        row("Email", email, { link: true }),
      ]),
      section("Message", [row("Message", message)]),
    ],
  })
}

export function json(response, status, body) {
  const payload = JSON.stringify(body)
  response.statusCode = status
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.end(payload)
}

export function errorMessage(error) {
  return error instanceof Error && error.message
    ? error.message
    : "Unexpected server error."
}

export function parseForm(request, maxFiles) {
  const form = formidable({
    allowEmptyFiles: false,
    maxFileSize: 12 * 1024 * 1024,
    maxFiles,
    multiples: true,
  })
  return new Promise((resolve, reject) => {
    form.parse(request, (error, fields, files) =>
      error ? reject(error) : resolve({ fields, files }),
    )
  })
}

export function field(fields, key) {
  const value = fields[key]
  const first = Array.isArray(value) ? value[0] : value
  return typeof first === "string" ? first.trim() : ""
}

export function filesFor(files, key) {
  const value = files[key]
  return value ? (Array.isArray(value) ? value : [value]) : []
}

export async function attachmentsFor(files, prefix) {
  return Promise.all(
    files.map(async (file, index) => ({
      content: await readFile(file.filepath),
      contentType: file.mimetype || undefined,
      filename: (file.originalFilename || `${prefix}-${index + 1}.jpg`)
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(0, 100),
    })),
  )
}

export async function sendEmail({
  attachments = [],
  client,
  fields,
  fromAddress,
  html,
  replyTo,
  subject,
  toAddress,
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from =
    fromAddress || process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM
  const to =
    toAddress || process.env.KP_FORM_TO_EMAIL || "kpmobileautospa@gmail.com"
  if (!apiKey || !from) throw new Error("Email delivery is not configured.")

  const rows = fields.map(([label, value]) => `${label}: ${value || "-"}`)
  const { data, error } = await (client || new Resend(apiKey)).emails.send({
    attachments,
    from,
    html: html || undefined,
    replyTo: replyTo || undefined,
    subject,
    text: rows.join("\n"),
    to,
  })
  if (error) throw new Error(error.message || "Email delivery failed.")
  return data?.id || null
}
