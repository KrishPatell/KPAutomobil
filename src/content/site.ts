// Brand facts. One file, so there is exactly one place to fill in when something is confirmed.
//
// The rule here is that an unconfirmed fact is `null`, never a placeholder string. A missing phone
// number is honest — the block simply does not render. `tel:[PHONE]` is a broken link that shipped
// to production. Every consumer checks for null and omits the whole element rather than printing
// a hole, so the site is always publishable at whatever level of confirmation it currently has.

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIRMED FACTS — the only block that needs editing when Kunj signs these off.
//  Kunj has confirmed these exist; the values had not reached us at time of build.
//  Filling any one of them lights it up across all eight pages with no other change.
// ─────────────────────────────────────────────────────────────────────────────
const confirmed = {
  /** e.g. "(617) 555-0142" — renders click-to-call in the nav, contact page and footer. */
  phone: null as string | null,
  /** General enquiries. */
  email: null as string | null,
  /** Booking-specific inbox, if it differs from `email`. */
  bookingEmail: null as string | null,
  /** Instagram handle without the @, e.g. "kpautomobil". Gates the gallery's feed block. */
  instagram: null as string | null,
  facebook: null as string | null,
  /** Miles from base. Gates the service-areas radius copy and the travel-fee rule. */
  serviceRadiusMiles: null as number | null,
  /** Towns actually covered. Empty means the coverage list is omitted, not faked. */
  towns: [] as Town[],
  /** Opening hours. Empty means the hours table does not render. */
  hours: [] as Hours[],
  /** Only publish once Kunj commits to honouring it — see the IA note on /contact/. */
  replyWindow: null as string | null,
}
// ─────────────────────────────────────────────────────────────────────────────

export type Town = {
  name: string
  /** Drive time from base, e.g. "20 min". Null renders the town without one. */
  drive: string | null
  /** True when the town is outside the radius and carries a travel fee. */
  travelFee?: boolean
  /**
   * ZIP codes this town covers. The /service-areas/ checker matches against these, so a town with
   * an empty list is listed but not answerable — which is better than answering wrongly.
   */
  zips?: string[]
}

import kp11Logo from "../assets/brand/kp11-mobile-auto-spa.svg"

export type Hours = {
  days: string
  opens: string
  closes: string
}

export type SiteLogo = {
  src: string | null
  alt: string
  height: number
}

export const site = {
  name: "KP Automobil",
  mark: { lead: "KP", tail: "Automobil" },
  domain: "kpautomobil.com",
  owner: "Our team",
  tagline: "Mobile detailing with the price shown before you book.",

  city: "Boston",
  region: "Massachusetts",
  regionShort: "MA",

  logo: {
    src: kp11Logo,
    alt: "KP11 Mobile Auto Spa",
    height: 28,
  } satisfies SiteLogo,

  deposit: 50,
  refundNoticeHours: 24,

  ...confirmed,
}

export const location = `${site.city}, ${site.region}`
export const locationShort = `${site.city}, ${site.regionShort}`
export const serviceArea = `Serving ${location}`
export const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(location)}`

export const telHref = site.phone ? `tel:${site.phone.replace(/[^\d+]/g, "")}` : null
export const mailHref = site.email ? `mailto:${site.email}` : null
export const bookingMailHref = site.bookingEmail
  ? `mailto:${site.bookingEmail}`
  : mailHref

export const instagramHref = site.instagram
  ? `https://instagram.com/${site.instagram}`
  : null
export const facebookHref = site.facebook
  ? `https://facebook.com/${site.facebook}`
  : null

/** Socials that actually exist. Anything unconfirmed drops out rather than rendering dead. */
export const socials = [
  { label: "Instagram", href: instagramHref },
  { label: "Facebook", href: facebookHref },
].filter((social): social is { label: string; href: string } => social.href !== null)
