import { json } from "./_email.js"
import {
  clearCookie,
  hasPortalSession,
  passwordMatches,
  portalPassword,
  sessionCookie,
  sessionToken,
} from "./_portal.js"

function readJson(request) {
  if (request.body && typeof request.body === "object") {
    return Promise.resolve(request.body)
  }
  return new Promise((resolve, reject) => {
    const chunks = []
    request.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    request.on("end", () => {
      try {
        const text = Buffer.concat(chunks).toString("utf8")
        resolve(text ? JSON.parse(text) : {})
      } catch {
        resolve({})
      }
    })
    request.on("error", reject)
  })
}

export default async function handler(request, response) {
  if (!portalPassword()) {
    return json(response, 503, {
      success: false,
      error: "The portal password is not configured.",
    })
  }

  if (request.method === "GET") {
    if (!hasPortalSession(request)) {
      return json(response, 401, {
        success: false,
        error: "Sign in required.",
      })
    }
    return json(response, 200, { success: true })
  }

  if (request.method === "DELETE") {
    response.setHeader("Set-Cookie", clearCookie())
    return json(response, 200, { success: true })
  }

  if (request.method !== "POST") {
    return json(response, 405, {
      success: false,
      error: "Method not allowed.",
    })
  }

  const body = await readJson(request)
  const password = typeof body.password === "string" ? body.password : ""
  if (!passwordMatches(password)) {
    return json(response, 401, {
      success: false,
      error: "That password does not match.",
    })
  }

  response.setHeader("Set-Cookie", sessionCookie(request, sessionToken()))
  return json(response, 200, { success: true })
}
