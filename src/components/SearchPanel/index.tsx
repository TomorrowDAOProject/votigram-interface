
import { useAdsgram } from "@/hooks/useAdsgram";
import { VoteApp } from "@/types/app";

import AppItem from "../AppItem";


interface ISearchPanel {
  recommendList: VoteApp[];
  updateUserPoints(points: number): void;
  onAppItemClick: (item: VoteApp) => void;
}

const SearchPanel = ({
  recommendList,
  updateUserPoints,
  onAppItemClick,
}: ISearchPanel) => {
  const showAd = useAdsgram({
    blockId: import.meta.env.VITE_ADSGRAM_ID.toString() || "",
    onReward: updateUserPoints,
    onError: () => {},
    onSkip: () => {},
  });

  return (
    <div className="votigram-grid gap-[22px] mb-[120px]">
      <img
        onClick={showAd}
        className="col-12 rounded-[18px]"
        src="https://cdn.tmrwdao.com/votigram/assets/imgs/CB2BE5C102D8.webp"
      />
      <div className="flex flex-col col-12 gap-[22px]">
        {recommendList?.map((item) => (
          <AppItem
            key={item.id}
            showArrow
            item={item}
            onAppItemClick={onAppItemClick}
          />
        ))}

        {recommendList.length === 0 && (
          <div className="text-center text-[13px] leading-[16px] text-white">
            No Results
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
