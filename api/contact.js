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
    const { fields, files } = await parseForm(req, 1)
    const name = field(fields, "name")
    const email = field(fields, "email")
    const phone = field(fields, "phone")
    const subject = field(fields, "subject")
    const message = field(fields, "message")

    if (!name || !email || !subject || message.length < 8) {
      json(res, 400, { ok: false, error: "Missing required contact details." })
      return
    }

    const attachments = await attachmentsFor(filesFor(files, "photo"), "contact-photo")
    const id = await sendEmail({
      attachments,
      fields: [
        ["Name", name],
        ["Email", email],
        ["Phone", phone],
        ["Topic", subject],
        ["Message", message],
      ],
      preview: `New contact message: ${subject}`,
      replyTo: email,
      subject: `KP Automobil contact: ${subject}`,
    })

    json(res, 200, { ok: true, id })
  } catch (error) {
    json(res, 500, { ok: false, error: error instanceof Error ? error.message : "Email failed." })
  }
}
