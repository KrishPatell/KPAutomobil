import {
  attachmentsFor,
  errorMessage,
  field,
  filesFor,
  json,
  parseForm,
  sendEmail,
} from "./_email.js"
import { emailLayout, row, section } from "./_email.js"
import { hasPortalSession, portalPassword } from "./_portal.js"

export const config = { api: { bodyParser: false } }

const accepted = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
])

function isImage(file) {
  if (file.mimetype && accepted.has(file.mimetype)) return true
  return /\.(jpe?g|png|webp|heic|heif)$/i.test(file.originalFilename || "")
}

export function portalUploadHtml({ note, count }) {
  return emailLayout({
    eyebrow: "Portal upload",
    heading: "New photos from the portal.",
    intro: "These files were sent from the private portal. They are not on the public site until someone places them there.",
    sections: [
      section("Upload", [
        row("Photos", String(count)),
        row("Note", note || "None"),
      ]),
    ],
  })
}

export async function handlePortalUpload(request, response, deps = {}) {
  if (!portalPassword()) {
    return json(response, 503, {
      success: false,
      error: "The portal password is not configured.",
    })
  }
  if (request.method !== "POST") {
    return json(response, 405, {
      success: false,
      error: "Method not allowed.",
    })
  }
  if (!hasPortalSession(request)) {
    return json(response, 401, {
      success: false,
      error: "Sign in required.",
    })
  }

  try {
    const { fields, files } = await parseForm(request, 8)
    const images = filesFor(files, "images")
    const note = field(fields, "note").slice(0, 1000)
    if (images.length === 0) {
      return json(response, 400, {
        success: false,
        error: "Choose at least one photo.",
      })
    }
    if (images.some((file) => !isImage(file))) {
      return json(response, 400, {
        success: false,
        error: "Only JPEG, PNG, WebP, or HEIC photos can be sent.",
      })
    }

    const deliver = deps.sendEmail || sendEmail
    const id = await deliver({
      attachments: await attachmentsFor(images, "portal-photo"),
      client: deps.client,
      fields: [
        ["Photos", String(images.length)],
        ["Note", note || "None"],
      ],
      html: portalUploadHtml({ note, count: images.length }),
      subject: `KP Automobil portal upload: ${images.length} photo${images.length === 1 ? "" : "s"}`,
    })
    return json(response, 200, { success: true, count: images.length, id })
  } catch (error) {
    return json(response, 500, {
      success: false,
      error: errorMessage(error),
    })
  }
}

export default function handler(request, response) {
  return handlePortalUpload(request, response)
}
