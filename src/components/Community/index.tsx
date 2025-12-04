import { useState } from "react";

import { COMMUNITY_LABEL, COMMUNITY_TYPE } from "@/constants/vote";
import useSetSearchParams from "@/hooks/useSetSearchParams";

import Tabs from "../Tabs";
import Archived from "./components/Archived";



const communityTabs = [
  {
    label: COMMUNITY_LABEL.ARCHIVED,
    value: 0,
  },
  {
    label: COMMUNITY_LABEL.CURRENT,
    value: 1,
  },
];
interface ICommunityProps {
  scrollTop: number;
}

const Community = ({ scrollTop }: ICommunityProps) => {
  const { querys, updateQueryParam } = useSetSearchParams();
  const activeTab = querys.get("community");
  const [currentTab, setCurrentTab] = useState(
    activeTab === "0" ? Number(activeTab) : 1
  );

  const onTabChange = (index: number) => {
    setCurrentTab(index);
    updateQueryParam({ key: "community", value: index.toString() });
  };

  return (
    <>
      <Tabs
        defaultValue={activeTab === "0" ? Number(activeTab) : 1}
        options={communityTabs}
        onChange={onTabChange}
      />

      <Archived
        currentTab={currentTab}
        scrollTop={scrollTop}
        type={
          currentTab === 0
            ? COMMUNITY_TYPE.ACCUMULATIVE
            : COMMUNITY_TYPE.CURRENT
        }
      />
    </>
  );
};

export default Community;
