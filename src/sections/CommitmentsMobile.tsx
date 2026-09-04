import svgPaths from "../imports/390WLight/svg-a4cbd3s9tr";
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
      className="flex flex-col h-[344px] justify-between pb-[28px] pt-[18.65px] px-[20px] rounded-[8px] shrink-0 snap-start w-[300px]"
      style={{ backgroundImage: CARD_BACKGROUND }}
    >
      <p className="font-['Geist:Regular',sans-serif] font-normal leading-[22.88px] text-[17.6px] text-white tracking-[-0.5px]">
        {commitment.body}
      </p>
      <div className="flex flex-col gap-[2.25px] pb-[0.63px] tracking-[-0.5px]">
        <p className="font-['Geist:Medium',sans-serif] font-medium leading-[22.88px] text-[#fd5303] text-[17.6px]">
          {commitment.label}
        </p>
        <p className="font-['Geist_Mono:Regular',sans-serif] font-normal leading-[16.64px] text-[12.8px] text-white">
          {commitment.sublabel}
        </p>
      </div>
    </li>
  );
}

export default function CommitmentsMobile() {
  return (
    <section
      aria-labelledby="commitments-heading-mobile"
      className="absolute bg-[#010101] flex flex-col items-start left-0 py-[64px] right-0 top-[12081.28px]"
      id="promise"
    >
      <div className="flex flex-col gap-[48px] h-[536px] items-start w-full">
        <div className="flex flex-col gap-[19.5px] items-start px-[15.59px] w-full">
          <div className="flex gap-[8px] items-center">
            <EyebrowMark />
            <p className="font-['Geist_Mono:Regular',sans-serif] font-normal leading-[16.64px] text-[12.8px] text-white tracking-[-0.5px] uppercase whitespace-nowrap">
              {commitmentsEyebrow}
            </p>
          </div>
          <h2
            className="font-['Geist:Regular',sans-serif] font-normal leading-[35.2px] text-[32px] text-white tracking-[-1px]"
            id="commitments-heading-mobile"
          >
            {commitmentsHeading}
          </h2>
        </div>
        {/* Horizontal snap scroller: scroll-pl keeps the first card aligned with the heading,
            otherwise mandatory snap scrolls straight past the container's left padding. */}
        <ul className="flex gap-[11.69px] h-[344px] items-start overflow-x-auto px-[15.59px] scroll-pl-[15.59px] snap-mandatory snap-x w-full">
          {commitments.map((commitment) => (
            <CommitmentCard commitment={commitment} key={commitment.label} />
          ))}
        </ul>
      </div>
    </section>
  );
}
