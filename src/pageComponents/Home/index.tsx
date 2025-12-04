import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import ForYou from "@/components/ForYou";
import Home from "@/components/Home";
import Navigation from "@/components/Navigation";
import Profile from "@/components/Profile";
import Vote from "@/components/Vote";
import { chainId } from "@/constants/app";
import { RANDOM_APP_CATEGORY } from "@/constants/discover";
import { TAB_LIST } from "@/constants/navigation";
import useData, { postWithToken } from "@/hooks/useData";
import useSetSearchParams from "@/hooks/useSetSearchParams";
import { useUserContext } from "@/provider/UserProvider";
import { VoteApp } from "@/types/app";
import { hexToString, parseStartAppParams } from "@/utils/start-params";

const App = () => {
  const { redirected, updateRedirectedStatus } = useUserContext();
  const currentForyouPage = useRef<number>(1);
  const [activeTab, setActiveTab] = useState(TAB_LIST.HOME);
  const [forYouList, setForYouList] = useState<VoteApp[]>([]);
  const [recommendList, setRecommendList] = useState<VoteApp[]>([]);
  const [selectedItem, setSelectItem] = useState<VoteApp>();
  const [alias, setAlias] = useState("");

  const navigate = useNavigate();

  const { querys, updateQueryParam } = useSetSearchParams();
  const tab = querys.get("tab");

  const fetchForYouData = async (alias: string[] = []) => {
    const { data } = await postWithToken("/api/app/discover/random-app-list", {
      chainId,
      alias,
      category: RANDOM_APP_CATEGORY.FORYOU,
    });

    setForYouList(data?.appList || []);

    if (alias.length > 0) {
      currentForyouPage.current++;
    }
  };

  const { data: madeForYouResult } = useData(
    `/api/app/user/homepage/made-for-you?chainId=${chainId}`
  );

  const { data: votedAppResult } = useData(
    `/api/app/user/homepage?chainId=${chainId}`
  );

  const { data: forYouAppp } = useData(
    alias
      ? `/api/app/telegram/apps?${new URLSearchParams({
          chainId,
          aliases: alias,
        }).toString()}`
      : null
  );

  const fetchRecommendData = async () => {
    const { data } = await postWithToken("/api/app/discover/random-app-list", {
      chainId,
      category: RANDOM_APP_CATEGORY.RECOMMEND,
    });

    setRecommendList(data?.appList || []);
  };

  useEffect(() => {
    fetchForYouData();
    fetchRecommendData();
  }, []);

  const onAppItemClick = (item?: VoteApp) => {
    if (item) {
      setSelectItem(item);
    }
    setActiveTab(TAB_LIST.FOR_YOU);
  };

  useEffect(() => {
    if (forYouAppp && forYouAppp?.items?.length) {
      setSelectItem(forYouAppp?.items[0]);
      setActiveTab(TAB_LIST.FOR_YOU);
    }
  }, [forYouAppp]);

  useEffect(() => {
    if (tab && !isNaN(Number(tab))) {
      setActiveTab(Number(tab));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window?.Telegram?.WebApp?.initDataUnsafe) {
      const startParam =
        window.Telegram.WebApp.initDataUnsafe.start_param ?? "";
      const params = parseStartAppParams(startParam);
      if (params && params.pid && !redirected) {
        navigate(`/proposal/${params.pid}`);
        updateRedirectedStatus(true);
      }
      if (params && params.alias && !redirected) {
        setAlias(hexToString(params.alias) || "");
        updateRedirectedStatus(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (tab: TAB_LIST) => {
    updateQueryParam({ key: "tab", value: tab.toString() });
    setActiveTab(tab);
  };

  return (
    <>
      {activeTab === TAB_LIST.HOME && (
        <Home
          weeklyTopVotedApps={votedAppResult?.weeklyTopVotedApps}
          discoverHiddenGems={votedAppResult?.discoverHiddenGems}
          madeForYouItems={madeForYouResult?.data || []}
          onAppItemClick={onAppItemClick}
          recommendList={recommendList}
          switchTab={setActiveTab}
        />
      )}
      {activeTab === TAB_LIST.FOR_YOU && (
        <ForYou
          currentForyouPage={currentForyouPage.current}
          items={selectedItem ? [selectedItem, ...forYouList] : forYouList}
          fetchForYouData={fetchForYouData}
        />
      )}
      {activeTab === TAB_LIST.VOTE && <Vote onAppItemClick={onAppItemClick} />}
      {activeTab === TAB_LIST.PEN && <Profile switchTab={setActiveTab} />}
      <Navigation activeTab={activeTab} onMenuClick={handleTabChange} />
    </>
  );
};

export default App;
