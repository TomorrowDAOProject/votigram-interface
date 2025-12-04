import { VoteApp } from "@/types/app";

import AppItem from "../AppItem";

interface IAppList {
  title: string;
  items: VoteApp[];
  onAppItemClick: (_: VoteApp) => void;
}

const AppList = ({ title, items, onAppItemClick }: IAppList) => {
  return (
    <div className="flex flex-col votigram-grid items-start pb-28">
      <span className="font-outfit text-[20px] leading-[20px] font-bold mb-[18px] text-white">
        {title}
      </span>
      <div className="flex gap-[22px] flex-col">
        {items?.map((item, index) => (
          <AppItem
            key={index}
            showArrow
            onAppItemClick={onAppItemClick}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default AppList;
