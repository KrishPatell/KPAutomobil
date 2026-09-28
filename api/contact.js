import {
  attachmentsFor,
  contactEmailHtml,
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
    const { fields, files } = await parseForm(request, 1)
    const name = field(fields, "name")
    const email = field(fields, "email")
    const subject = field(fields, "subject")
    if (!name || !email || !subject)
      return json(response, 400, {
        success: false,
        ok: false,
        error: "Missing details.",
      })
    if (!isEmailAddress(email))
      return json(response, 400, {
        success: false,
        ok: false,
        error: "Enter a valid email address so we can reply.",
      })
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
      html: contactEmailHtml({
        email,
        message: field(fields, "message"),
        name,
        phone: field(fields, "phone"),
        subject,
      }),
      replyTo: email,
      subject: `KP Automobil contact: ${subject}`,
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
