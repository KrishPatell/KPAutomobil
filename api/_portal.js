import { createHmac, timingSafeEqual } from "node:crypto"

export const COOKIE_NAME = "kp_portal"
const SESSION_LABEL = "kp-portal-v1"

export function portalPassword() {
  return process.env.PORTAL_PASSWORD || ""
}

export function sessionToken(password = portalPassword()) {
  return createHmac("sha256", password).update(SESSION_LABEL).digest("hex")
}

function sameBytes(left, right) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function passwordMatches(input) {
  const expected = portalPassword()
  if (!expected || typeof input !== "string" || !input) return false
  return sameBytes(input, expected)
}

export function readCookie(request, name) {
  const header = request.headers?.cookie || ""
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=")
    if (key === name) return decodeURIComponent(rest.join("="))
  }
  return ""
}

export function hasPortalSession(request) {
  const password = portalPassword()
  if (!password) return false
  return sameBytes(readCookie(request, COOKIE_NAME), sessionToken(password))
}

export function sessionCookie(request, token) {
  const secure =
    request.headers?.["x-forwarded-proto"] === "https" ||
    process.env.VERCEL === "1"
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=43200",
  ]
  if (secure) parts.push("Secure")
  return parts.join("; ")
}

export function clearCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
}
