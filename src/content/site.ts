// Single source of truth for everything that used to be a [PLACEHOLDER] hardcoded across the
// generated frames, App.tsx and KpNav. If a fact about the business changes, it changes here.
//
// Anything not yet confirmed by Kunj is `null` rather than a placeholder string. Null means the
// UI omits that element entirely — a missing phone number is honest, `tel:[PHONE]` is a broken
// link that shipped to production.

export type SiteLogo = {
  /**
   * Path to the wordmark asset, imported or served from /public. Kunj is sending a transparent
   * PNG/SVG. Until it lands this stays null and the text wordmark below renders instead.
   * (docs/kp11-logo.jpeg is not it — that badge reads "KP11 Mobile Auto Spa" on solid black.)
   */
  src: string | null;
  alt: string;
  /** Rendered height in px. Width follows from the asset's aspect ratio. */
  height: number;
};

export const site = {
  name: "KP Automobil",
  /** The wordmark is set in two weights: "KP" bold, "Automobil" light. */
  mark: { lead: "KP", tail: "Automobil" },
  domain: "kpautomobil.com",
  owner: "Kunj",
  tagline: "Mobile detailing with the price shown before you book.",

  city: "Boston",
  region: "Massachusetts",
  /** Postal abbreviation, for tight slots where the full state name will not fit. */
  regionShort: "MA",

  // Not confirmed yet. See the note at the top of this file before filling these in.
  phone: null as string | null,
  email: null as string | null,

  logo: {
    src: null,
    alt: "KP Automobil",
    height: 28,
  } satisfies SiteLogo,

  deposit: 50,
  /** Hours of notice required for a full deposit refund. */
  refundNoticeHours: 24,

  socials: [
    { label: "Instagram", href: null as string | null },
    { label: "Facebook", href: null as string | null },
    { label: "TikTok", href: null as string | null },
  ],
};

/** "Boston, Massachusetts" — the long form, for body copy and headings. */
export const location = `${site.city}, ${site.region}`;

/** "Boston, MA" — the short form, for nav pills and captions. */
export const locationShort = `${site.city}, ${site.regionShort}`;

export const serviceArea = `Serving ${location}`;

export const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(location)}`;

/** `tel:` href for the confirmed number, or null so the caller can omit the link. */
export const telHref = site.phone ? `tel:${site.phone.replace(/[^\d+]/g, "")}` : null;

export const mailHref = site.email ? `mailto:${site.email}` : null;
