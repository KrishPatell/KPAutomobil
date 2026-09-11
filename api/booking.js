import {
  attachmentsFor,
  field,
  filesFor,
  json,
  methodAllowed,
  parseForm,
  sendEmail,
} from "./_email.js"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (!methodAllowed(req, res)) return

  try {
    const { fields, files } = await parseForm(req, 4)
    const payload = parsePayload(field(fields, "payload"))

    if (!payload.name || !payload.phone || !payload.address) {
      json(res, 400, { ok: false, error: "Missing required booking details." })
      return
    }

    const attachments = await attachmentsFor(filesFor(files, "photos"), "booking-photo")
    const id = await sendEmail({
      attachments,
      fields: [
        ["Name", payload.name],
        ["Phone", payload.phone],
        ["Email", payload.email],
        ["Address", payload.address],
        ["Vehicle size", payload.size],
        ["Body style", payload.bodyStyle],
        ["Year / make / model", payload.vehicleNote],
        ["Package", payload.service],
        ["Conditions", list(payload.conditions)],
        ["Add-ons", list(payload.addOns)],
        ["Photos", payload.photosSkipped ? "Skipped" : `${payload.photoCount || attachments.length} attached`],
        ["Preferred date", payload.date],
        ["Time window", payload.window],
        ["Balance method", payload.payMethod],
        ["Quoted total", payload.total === null || payload.total === undefined ? "Priced from photos" : `$${payload.total}`],
        ["Notes", payload.notes],
      ],
      preview: `New booking request from ${payload.name}`,
      replyTo: payload.email || undefined,
      subject: `KP Automobil booking: ${payload.name}`,
    })

    json(res, 200, { ok: true, id })
  } catch (error) {
    json(res, 500, { ok: false, error: error instanceof Error ? error.message : "Email failed." })
  }
}

function parsePayload(raw) {
  try {
    const value = JSON.parse(raw)
    return value && typeof value === "object" ? value : {}
  } catch {
    return {}
  }
}

function list(value) {
  return Array.isArray(value) && value.length > 0 ? value.join(", ") : "-"
}
