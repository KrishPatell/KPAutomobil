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
    const { fields, files } = await parseForm(request, 1)
    const name = field(fields, "name")
    const email = field(fields, "email")
    const subject = field(fields, "subject")
    if (!name || !email || !subject)
      return json(response, 400, { ok: false, error: "Missing details." })
    const id = await sendEmail({
      attachments: await attachmentsFor(
        filesFor(files, "photo"),
        "contact-photo",
      ),
      fields: [
        ["Name", name],
        ["Email", email],
        ["Phone", field(fields, "phone")],
        ["Topic", subject],
        ["Message", field(fields, "message")],
      ],
      replyTo: email,
      subject: `KP Automobil contact: ${subject}`,
    })
    return json(response, 200, { ok: true, id })
  } catch (error) {
    return json(response, 500, { ok: false, error: error.message })
  }
}
