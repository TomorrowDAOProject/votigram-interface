import { VoteApp } from "@/types/app";

import AppItem from "../AppItem";



interface IDiscoveryHiddenGemsProps {
  item: VoteApp;
  onAppItemClick: (item: VoteApp) => void;
}

const DiscoveryHiddenGems = ({
  item,
  onAppItemClick,
}: IDiscoveryHiddenGemsProps) => {
  return (
    <div className="flex font-outfit votigram-grid mb-[22px] w-full">
      <div className="p-[1px] rounded-[10px] w-full bg-gradient-to-r from-lime-primary to-lime-green">
        <div className="flex flex-col items-start gap-[11px] p-[13px] bg-black rounded-[10px]">
          <span className="font-bold text-[20px] leading-[20px] text-white">
            Discover Hidden Gems!
          </span>
          <AppItem onAppItemClick={onAppItemClick} item={item} />
        </div>
      </div>
    </div>
  );
};

export default DiscoveryHiddenGems;
