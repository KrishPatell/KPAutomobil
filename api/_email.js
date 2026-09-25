import { readFile } from "node:fs/promises"
import formidable from "formidable"
import { Resend } from "resend"

export function json(response, status, body) {
  response.status(status).json(body)
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
  fields,
  replyTo,
  subject,
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM
  const to = process.env.KP_FORM_TO_EMAIL || "kpmobileautospa@gmail.com"
  if (!apiKey || !from) throw new Error("Email delivery is not configured.")

  const rows = fields.map(([label, value]) => `${label}: ${value || "-"}`)
  const { data, error } = await new Resend(apiKey).emails.send({
    attachments,
    from,
    replyTo: replyTo || undefined,
    subject,
    text: rows.join("\n"),
    to,
  })
  if (error) throw new Error(error.message || "Email delivery failed.")
  return data?.id || null
}
