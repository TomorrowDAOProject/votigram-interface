import { VoteApp } from "@/types/app";

interface IAppItem {
  showArrow?: boolean;
  item: VoteApp;
  onAppItemClick: (_: VoteApp) => void;
}

const AppItem = ({ showArrow = false, onAppItemClick, item }: IAppItem) => {
  return (
    <div
      role="button"
      onClick={() => {
        onAppItemClick(item);
      }}
      className="flex gap-[18px] items-center"
    >
      <img
        className="w-[48px] aspect-square rounded-[8px]"
        src={item?.icon}
        alt={item?.title}
        data-testid="app-item-icon"
      />
      <div className="flex flex-col gap-[5px] flex-1">
        <span className="font-bold text-[16px] leading-[16px] font-outfit text-white">
          {item?.title}
        </span>
        <span className="font-normal text-[12px] leading-[13px] text-white line-clamp-2">
          {item?.description}
        </span>
      </div>
      {showArrow && (
        <i
          data-testid="arrow-icon"
          className="votigram-icon-arrow-go text-secondary"
        />
      )}
    </div>
  );
};

export default AppItem;
