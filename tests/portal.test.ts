import assert from "node:assert/strict"
import { Readable } from "node:stream"
import test from "node:test"
import sessionHandler from "../api/portal-session.js"
import { handlePortalUpload } from "../api/portal-upload.js"
import { COOKIE_NAME, sessionToken } from "../api/_portal.js"

const password = "portal-test-password"

function responseRecorder() {
  const result: {
    body?: unknown
    headers: Record<string, string | string[]>
    status?: number
  } = { headers: {} }
  const response = {
    setHeader(name: string, value: string | string[]) {
      result.headers[name.toLowerCase()] = value
    },
    end(payload?: string) {
      result.body = payload ? JSON.parse(payload) : undefined
    },
    set statusCode(status: number) {
      result.status = status
    },
  }
  return { response, result }
}

function jsonRequest(method: string, body?: unknown, cookie?: string) {
  const payload = body === undefined ? "" : JSON.stringify(body)
  const request = Readable.from(payload ? [payload] : [])
  return Object.assign(request, {
    method,
    headers: {
      cookie: cookie ?? "",
      "content-type": "application/json",
    },
  })
}

test("portal session rejects a missing password, a wrong password, and accepts the right one", async () => {
  const previous = process.env.PORTAL_PASSWORD
  process.env.PORTAL_PASSWORD = password
  try {
    const missing = responseRecorder()
    await sessionHandler(jsonRequest("POST", {}), missing.response)
    assert.equal(missing.result.status, 401)

    const wrong = responseRecorder()
    await sessionHandler(
      jsonRequest("POST", { password: "nope" }),
      wrong.response,
    )
    assert.equal(wrong.result.status, 401)
    assert.equal(wrong.result.headers["set-cookie"], undefined)

    const right = responseRecorder()
    await sessionHandler(
      jsonRequest("POST", { password }),
      right.response,
    )
    assert.equal(right.result.status, 200)
    assert.match(
      String(right.result.headers["set-cookie"]),
      new RegExp(`^${COOKIE_NAME}=${sessionToken(password)}`),
    )

    const open = responseRecorder()
    await sessionHandler(
      jsonRequest("GET", undefined, String(right.result.headers["set-cookie"]).split(";")[0]),
      open.response,
    )
    assert.equal(open.result.status, 200)
  } finally {
    if (previous === undefined) delete process.env.PORTAL_PASSWORD
    else process.env.PORTAL_PASSWORD = previous
  }
})

test("portal upload requires a session and emails the photos", async () => {
  const previous = process.env.PORTAL_PASSWORD
  process.env.PORTAL_PASSWORD = password
  try {
    const locked = responseRecorder()
    await handlePortalUpload(
      Object.assign(Readable.from([]), { method: "POST", headers: {} }),
      locked.response,
    )
    assert.equal(locked.result.status, 401)

    const boundary = "----kptest"
    const jpeg = Buffer.from(
      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIVFhUVFRUVFRUVFRUVFRUWFxUVFRUYHSggGBolGxUVITEhJSsrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAIEBQYHAf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJ6n/9k=",
      "base64",
    )
    const body = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="note"\r\n\r\nDriveway shots\r\n`,
      ),
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="images"; filename="car.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`,
      ),
      jpeg,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ])
    const request = Object.assign(Readable.from([body]), {
      method: "POST",
      headers: {
        cookie: `${COOKIE_NAME}=${sessionToken(password)}`,
        "content-type": `multipart/form-data; boundary=${boundary}`,
        "content-length": String(body.length),
      },
    })
    let sent: { subject?: string; attachments?: unknown[] } | undefined
    const open = responseRecorder()
    await handlePortalUpload(request, open.response, {
      sendEmail: async (payload: {
        subject?: string
        attachments?: unknown[]
      }) => {
        sent = payload
        return "email_portal"
      },
    })
    assert.equal(open.result.status, 200)
    assert.equal((open.result.body as { count: number }).count, 1)
    assert.equal(sent?.subject, "KP Automobil portal upload: 1 photo")
    assert.equal(sent?.attachments?.length, 1)
  } finally {
    if (previous === undefined) delete process.env.PORTAL_PASSWORD
    else process.env.PORTAL_PASSWORD = previous
  }
})
