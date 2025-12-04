import { useEffect, useState } from "react";

import clsx from "clsx";

import { APP_CATEGORY } from "@/constants/discover";
import { DiscoverType } from "@/types/app";

import "./index.css";

interface ICategoryPillListProps {
  value?: APP_CATEGORY;
  amount?: number;
  items: DiscoverType[];
  className?: string;
  onChange?: (category: APP_CATEGORY) => void;
}

const CategoryPillList = ({
  value,
  items,
  className,
  amount,
  onChange,
}: ICategoryPillListProps) => {
  const [active, setActive] = useState<APP_CATEGORY>(APP_CATEGORY.ALL);

  const handleClick = (category: APP_CATEGORY) => {
    setActive(active === category ? APP_CATEGORY.ALL : category);
    onChange?.(active === category ? APP_CATEGORY.ALL : category);
  };

  useEffect(() => {
    setActive(value || APP_CATEGORY.ALL);
  }, [value]);

  return (
    <div
      className={clsx(
        "app-category-list mb-[12px] col-12 overflow-scroll flex flex-nowrap z-10",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={clsx(
            "flex p-2 item border-pill-border border-[1px] rounded-full",
            {
              "border-primary": active === item.value,
            }
          )}
          onClick={() => handleClick(item.value)}
        >
          <button className="w-max px-2 py-1 text-[13px] leading-[16px] text-white flex items-center">
            {item.label}
            {item.value === APP_CATEGORY.NEW && !!amount && amount > 0 && (
              <span className="ml-1 text-white text-[9px] leading-[10px] bg-primary rounded-[7px] py-[2px] px-[5px]">
                {amount}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CategoryPillList;
