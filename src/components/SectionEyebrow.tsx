import svgPaths from "../imports/1440WLight/svg-badzmtz89q";

/**
 * The orange square + mono label that opens every section in the design. In the generated frame
 * this is four nested divs per section, each with the icon's hashed filename as its data-name.
 */
export default function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="kp-eyebrow">
      <svg aria-hidden="true" fill="none" height="14.39" viewBox="0 0 14.39 14.39" width="14.39">
        <path d={svgPaths.p719480} fill="#FD5303" />
      </svg>
      {children}
    </p>
  );
}
