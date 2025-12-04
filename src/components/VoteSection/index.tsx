import clsx from "clsx";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import Tag from "../Tag";
import { VoteSectionType } from "./type";


interface IVoteSctionProps {
  data: VoteSectionType;
  className?: string;
  currentTab?: number;
}

const VoteSection = ({ data, className, currentTab }: IVoteSctionProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        "relative pt-[21px] px-5 rounded-[18px] bg-dark-gray",
        className
      )}
      onClick={() =>
        navigate(`/proposal/${data.proposalId}`, {
          state: { from: `/?tab=2&vote_tab=Community&community=${currentTab}` },
        })
      }
    >
      <span className="text-white font-bold text-[16px] leading-[20px] font-outfit h-max line-clamp-2">
        {data.proposalTitle}
      </span>
      <div className="flex flex-row items-center justify-between my-[13px]">
        <span className="font-normal text-white text-[12px] leading-[13.2px]">
          Duration:{" "}
          {`${dayjs(data.activeStartTime).format("DD MMM YYYY")} - ${dayjs(
            data.activeEndTime
          ).format("DD MMM YYYY")}`}
        </span>
        <span className="inline-flex items-center font-normal text-white text-[11px] leading-[13.2px]">
          Total votes:&nbsp;
          <span className="text-lime-green">
            {data.totalVoteAmount.toLocaleString() || 0}
          </span>
        </span>
      </div>
      {data.bannerUrl && (
        <img
          className="w-full rounded-[12px] object-cover"
          src={data.bannerUrl}
          alt="Banner"
        />
      )}
      <div className="flex flex-row items-center justify-between mt-[13px] pt-[7px] pb-[8px] border-t-[1px] border-solid border-tertiary">
        <div className="flex flex-row items-center justify-center gap-[6px] w-4/5">
          {data.proposalIcon ? (
            <img
              className="w-[16px] h-[16px] object-cover rounded-[8px] shrink-0"
              src={data.proposalIcon}
              alt="Avatar"
            />
          ) : (
            <div className="flex items-center justify-center bg-white/[.25] w-[16px] h-[16px] rounded-[8px] shrink-0">
              <i className="votigram-icon-profile text-[10px] leading-[10px] text-white/[.4]" />
            </div>
          )}
          <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-grow min-w-0 font-normal text-white text-[11px] leading-[13.2px]">
            Created by{" "}
            {data?.proposerFirstName
              ? data?.proposerFirstName
              : `ELF_${data.proposer}_tDVW`}
          </span>
        </div>

        <i className="votigram-icon-arrow-go text-[14px] leading-[14px] text-lime-primary" />
      </div>

      {data?.tag && (
        <Tag text={data.tag} className="absolute top-[-3px] right-[-3px]" />
      )}
    </div>
  );
};

export default VoteSection;
