import { VoteApp } from "@/types/app";
import "./index.css";

interface ITopVoteApps {
  items: VoteApp[];
  onAppItemClick: (item: VoteApp) => void;
}

const TopVotedApps = ({ items, onAppItemClick }: ITopVoteApps) => {
  return (
    items?.length > 0 && (
      <div className="flex flex-col gap-[12px] mb-[22px]">
        <span className="px-[20px] font-bold font-outfit text-[20px] leading-[20px] text-white">
          Weekly Top Voted Apps
        </span>
        <div className="top-voted-app-list col-12 overflow-scroll flex flex-nowrap">
          {items?.map((item) => (
            <div
              key={item.title}
              onClick={() => onAppItemClick(item)}
              className="flex flex-col p-[7px] rounded-[10px] bg-tertiary item min-h-[84px] min-w-[106px]"
            >
              <img
                className="rounded-[6px] w-[34px] aspect-square"
                src={item.icon}
                alt={item.title}
              />
              <div className="flex flex-col bottom-[7px] absolute gap-[2px]">
                <i className="votigram-icon-arrow-ninety-degrees text-secondary text-[10px] leading-[10px]" />
                <div className="flex gap-0.5 items-end">
                  <span
                    data-testid={`${item.title}-point`}
                    className="font-outfit text-[14px] leading-[14px] font-bold text-white"
                  >
                    {(item.pointsAmount || 0).toLocaleString()}
                  </span>
                  <span className="text-[11px] font-normal leading-[9px] text-white">
                    pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default TopVotedApps;
