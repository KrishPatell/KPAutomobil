import {
  attachmentsFor,
  field,
  filesFor,
  json,
  parseForm,
  sendEmail,
} from "./_email.js"

export const config = { api: { bodyParser: false } }

export default async function handler(request, response) {
  if (request.method !== "POST") return json(response, 405, { ok: false })
  try {
    const { fields, files } = await parseForm(request, 4)
    const payload = JSON.parse(field(fields, "payload") || "{}")
    if (!payload.name || !payload.phone || !payload.address)
      return json(response, 400, { ok: false, error: "Missing details." })
    const attachments = await attachmentsFor(
      filesFor(files, "photos"),
      "booking-photo",
    )
    const id = await sendEmail({
      attachments,
      fields: Object.entries(payload).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(", ") : String(value ?? ""),
      ]),
      replyTo: payload.email,
      subject: `KP Automobil quote request: ${payload.name}`,
    })
    return json(response, 200, { ok: true, id })
  } catch (error) {
    return json(response, 500, { ok: false, error: error.message })
  }
}
