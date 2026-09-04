import svgPaths from "../imports/1440WLight/svg-badzmtz89q";
import { commitments, commitmentsEyebrow, commitmentsHeading, type Commitment } from "../content/commitments";

const CARD_BACKGROUND =
  "linear-gradient(180deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 100%), linear-gradient(90deg, rgb(27, 27, 27) 0%, rgb(27, 27, 27) 100%)";

function EyebrowMark() {
  return (
    <svg aria-hidden="true" className="shrink-0" fill="none" height="14.39" viewBox="0 0 14.39 14.39" width="14.39">
      <path d={svgPaths.p719480} fill="#FD5303" />
    </svg>
  );
}

function CommitmentCard({ commitment }: { commitment: Commitment }) {
  return (
    <li
      className="flex flex-[1_0_0] flex-col h-[360px] justify-between min-w-px pb-[21.6px] pt-[21px] px-[21.6px] rounded-[7.2px]"
      style={{ backgroundImage: CARD_BACKGROUND }}
    >
      <p className="font-['Geist:Regular',sans-serif] font-normal leading-[22.46px] text-[17.3px] text-white tracking-[0.216px]">
        {commitment.body}
      </p>
      <div className="flex flex-col gap-[1.11px] pb-[0.83px] tracking-[0.216px]">
        <p className="font-['Geist:Medium',sans-serif] font-medium leading-[22.46px] text-[#fd5303] text-[17.3px]">
          {commitment.label}
        </p>
        <p className="font-['Geist_Mono:Regular',sans-serif] font-normal leading-[16.85px] text-[13px] text-white">
          {commitment.sublabel}
        </p>
      </div>
    </li>
  );
}

export default function Commitments() {
  return (
    <section
      aria-labelledby="commitments-heading"
      className="absolute bg-[#010101] flex flex-col items-start left-0 py-[115.19px] right-0 top-[9279.61px]"
      id="promise"
    >
      <div className="flex flex-col gap-[72px] items-start overflow-clip pl-[28.8px] pr-[28.79px] w-full">
        <div className="flex flex-col gap-[18px] items-start w-full">
          <div className="flex gap-[7.19px] items-center">
            <EyebrowMark />
            <p className="font-['Geist_Mono:Regular',sans-serif] font-normal leading-[16.85px] text-[13px] text-white tracking-[0.216px] uppercase whitespace-nowrap">
              {commitmentsEyebrow}
            </p>
          </div>
          <h2
            className="font-['Geist:Regular',sans-serif] font-normal leading-[47.52px] text-[43.2px] text-white tracking-[-0.648px]"
            id="commitments-heading"
          >
            {commitmentsHeading}
          </h2>
        </div>
        <ul className="flex gap-[14.39px] h-[360px] items-start w-full">
          {commitments.map((commitment) => (
            <CommitmentCard commitment={commitment} key={commitment.label} />
          ))}
        </ul>
      </div>
    </section>
  );
}
