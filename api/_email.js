import { readFile } from "node:fs/promises"
import formidable from "formidable"
import { Resend } from "resend"

const MAX_FILE_SIZE = 12 * 1024 * 1024
const MAX_ATTACHMENTS_SIZE = 36 * 1024 * 1024

export function json(res, status, body) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.end(JSON.stringify(body))
}

export function methodAllowed(req, res) {
  if (req.method === "POST") return true
  res.setHeader("Allow", "POST")
  json(res, 405, { ok: false, error: "Method not allowed" })
  return false
}

export async function parseForm(req, maxFiles) {
  const form = formidable({
    allowEmptyFiles: false,
    filter(part) {
      return !part.mimetype || part.mimetype.startsWith("image/")
    },
    maxFileSize: MAX_FILE_SIZE,
    maxFiles,
    multiples: true,
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error)
      else resolve({ fields, files })
    })
  })
}

export function field(fields, key) {
  const value = fields[key]
  const first = Array.isArray(value) ? value[0] : value
  return typeof first === "string" ? first.trim() : ""
}

export function filesFor(files, key) {
  const value = files[key]
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export async function attachmentsFor(files, prefix) {
  const total = files.reduce((sum, file) => sum + (file.size || 0), 0)
  if (total > MAX_ATTACHMENTS_SIZE) {
    throw new Error("Attached images are too large to send in one email.")
  }

  return Promise.all(
    files.map(async (file, index) => ({
      content: await readFile(file.filepath),
      contentType: file.mimetype || undefined,
      filename: safeFilename(file.originalFilename || `${prefix}-${index + 1}.jpg`),
    })),
  )
}

export async function sendEmail({ attachments = [], fields, preview, replyTo, subject }) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.KP_FORM_TO_EMAIL || process.env.FORM_TO_EMAIL || process.env.RESEND_TO_EMAIL
  const from = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM

  if (!apiKey || !to || !from) {
    throw new Error("Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or KP_FORM_TO_EMAIL.")
  }

  const resend = new Resend(apiKey)
  const text = textBody(fields)
  const html = htmlBody(preview, fields)

  const { data, error } = await resend.emails.send({
    attachments,
    from,
    html,
    replyTo: replyTo || undefined,
    subject,
    text,
    to,
  })

  if (error) {
    throw new Error(typeof error.message === "string" ? error.message : "Resend rejected the email.")
  }

  return data?.id || null
}

function safeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100)
}

function textBody(fields) {
  return fields.map(([label, value]) => `${label}: ${value || "-"}`).join("\n")
}

function htmlBody(preview, fields) {
  const rows = fields
    .map(
      ([label, value]) => `
        <tr>
          <th>${escapeHtml(label)}</th>
          <td>${escapeHtml(value || "-").replace(/\n/g, "<br />")}</td>
        </tr>
      `,
    )
    .join("")

  return `
    <div style="background:#f5f5f2;padding:24px;font-family:Arial,sans-serif;color:#111;">
      <div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #ddd;padding:28px;">
        <p style="margin:0 0 8px;color:#fd5303;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">KP Automobil</p>
        <h1 style="margin:0 0 18px;font-size:28px;line-height:1.1;">${escapeHtml(preview)}</h1>
        <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.45;">
          ${rows}
        </table>
      </div>
    </div>
  `
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
