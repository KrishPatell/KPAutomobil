import {
  attachmentsFor,
  bookingEmailHtml,
  errorMessage,
  field,
  filesFor,
  isEmailAddress,
  json,
  parseForm,
  sendEmail,
} from "./_email.js"

export const config = { api: { bodyParser: false } }

export default async function handler(request, response) {
  if (request.method !== "POST")
    return json(response, 405, {
      success: false,
      ok: false,
      error: "Method not allowed.",
    })
  try {
    const { fields, files } = await parseForm(request, 4)
    const payload = JSON.parse(field(fields, "payload") || "{}")
    if (
      !payload.name ||
      !payload.phone ||
      !payload.email ||
      !payload.address ||
      !payload.service ||
      !payload.bodyStyle ||
      filesFor(files, "photos").length !== 4
    )
      return json(response, 400, {
        success: false,
        ok: false,
        error: "Complete the booking details and attach all four photos.",
      })
    if (!isEmailAddress(payload.email))
      return json(response, 400, {
        success: false,
        ok: false,
        error: "Enter a valid email address for the booking receipt.",
      })
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
      html: bookingEmailHtml(payload),
      replyTo: payload.email,
      subject: `KP Automobil booking request: ${payload.name}`,
    })
    return json(response, 200, { success: true, ok: true, id })
  } catch (error) {
    return json(response, 500, {
      success: false,
      ok: false,
      error: errorMessage(error),
    })
  }
}
