import { site } from "../content/site";

/**
 * The KP Automobil wordmark, in one place.
 *
 * Renders the logo asset when `site.logo.src` is set and falls back to the two-weight text
 * lockup until Kunj sends one. It returns the lockup's children rather than a wrapper element,
 * so the nav and footer keep styling it with their own existing selectors.
 */
export default function BrandMark() {
  if (site.logo.src) {
    return <img className="kp-brand-logo" src={site.logo.src} alt={site.logo.alt} />;
  }
  return (
    <>
      {site.mark.lead}
      <span>{site.mark.tail}</span>
    </>
  );
}
