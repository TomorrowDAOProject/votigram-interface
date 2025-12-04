import { useEffect, useState } from "react";

import useDebounceFn from "ahooks/lib/useDebounceFn";


import {
  APP_CATEGORY,
  DISCOVER_CATEGORY,
  DISCOVERY_CATEGORY_MAP,
} from "@/constants/discover";
import { COMMUNITY_TYPE, TMSAP_TAB } from "@/constants/vote";
import useSetSearchParams from "@/hooks/useSetSearchParams";
import { VoteApp } from "@/types/app";

import CategoryPillList from "../CategoryPillList";
import Tabs from "../Tabs";
import Accumulative from "./components/Accumulative";
import Current from "./components/Current";



const emaTabs = [
  {
    label: COMMUNITY_TYPE.ACCUMULATIVE,
    value: TMSAP_TAB.ACCUMULATIVE,
  },
  {
    label: COMMUNITY_TYPE.CURRENT,
    value: TMSAP_TAB.CURRENT,
  },
];

interface ITMAsProps {
  scrollTop: number;
  onTabChange?: (index: number) => void;
  onAppItemClick?: (item: VoteApp) => void;
}

const TMAs = ({ scrollTop, onTabChange, onAppItemClick }: ITMAsProps) => {
  const { querys, updateQueryParam } = useSetSearchParams();
  const activeTab = querys.get("tmas");
  const [currentTab, setCurrentTab] = useState(
    activeTab === "1" ? Number(activeTab) : TMSAP_TAB.ACCUMULATIVE
  );
  const [keyword, setkeyword] = useState<string>("");
  const [category, setCategory] = useState<APP_CATEGORY>(APP_CATEGORY.ALL);

  const { run: onkeywordChange } = useDebounceFn(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setkeyword(e.target.value);
    },
    {
      wait: 700,
    }
  );

  const onCategoryChange = (category: APP_CATEGORY) => {
    setCategory(category);
  };

  const handleTabChange = (index: number) => {
    setCurrentTab(index);
    onTabChange?.(index);
    updateQueryParam({ key: "tmas", value: index.toString() });
  };

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(
        activeTab === "1" ? Number(activeTab) : TMSAP_TAB.ACCUMULATIVE
      );
    }
  }, [activeTab]);

  return (
    <>
      <Tabs
        defaultValue={currentTab}
        options={emaTabs}
        onChange={handleTabChange}
      />

      <div className="mt-[14px] col-12 bg-input gap-2 h-[41px] px-4 flex items-center rounded-3xl">
        <i className="votigram-icon-search text-input-placeholder" />
        <input
          className="w-full bg-transparent placeholder:leading-[19.6px] text-[14px] text-white outline-none appearence-none z-10 placeholder:text-input-placeholder placeholder:font-questrial"
          placeholder="Search..."
          onChange={onkeywordChange}
        />
      </div>
      <CategoryPillList
        items={[
          {
            value: APP_CATEGORY.ALL,
            label: DISCOVERY_CATEGORY_MAP[APP_CATEGORY.ALL],
          },
          ...DISCOVER_CATEGORY.slice(1),
        ]}
        className="-mx-5"
        onChange={onCategoryChange}
      />

      {currentTab === TMSAP_TAB.ACCUMULATIVE ? (
        <Accumulative
          scrollTop={scrollTop}
          keyword={keyword}
          category={category}
          onAppItemClick={onAppItemClick}
        />
      ) : (
        <Current
          scrollTop={scrollTop}
          keyword={keyword}
          category={category}
          onAppItemClick={onAppItemClick}
        />
      )}
    </>
  );
};

export default TMAs;
