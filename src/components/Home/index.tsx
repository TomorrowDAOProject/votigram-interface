import { useEffect, useRef, useState } from "react";
import AppList from "../AppList";
import CategoryPillList from "../CategoryPillList";
import DiscoveryHiddenGems from "../DiscoveryHiddenGems";
import PointsCounter from "../PointsCounter";
import TelegramHeader from "../TelegramHeader";
import TopVotedApps from "../TopVotedApps";
import { useUserContext } from "@/provider/UserProvider";
import Modal from "../Modal";
import useData, { postWithToken } from "@/hooks/useData";
import SearchPanel from "../SearchPanel";
import { VoteApp } from "@/types/app";
import { chainId } from "@/constants/app";
import DailyRewards from "../DailyRewards";
import { APP_CATEGORY, DISCOVER_CATEGORY } from "@/constants/discover";
import { useAdsgram } from "@/hooks/useAdsgram";

interface IHomeProps {
  onAppItemClick: (item?: VoteApp) => void;
  recommendList: VoteApp[];
}

const PAGE_SIZE = 20;

const Home = ({ onAppItemClick, recommendList }: IHomeProps) => {
  const {
    user: { userPoints },
    updateUserPoints,
    updateDailyLoginPointsStatus,
  } = useUserContext();

  const [isSearching, setIsSearching] = useState(false);
  const scrollViewRef = useRef<HTMLDivElement | null>(null);
  const [searchList, setSearchList] = useState<VoteApp[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [keyward, setKeyward] = useState("");
  const [category, setCategory] = useState<APP_CATEGORY>(
    APP_CATEGORY.ALL
  );

  const [showDailyReward, setShowDailyReward] = useState(
    !userPoints?.dailyLoginPointsStatus || false
  );

  const { data: searchData, isLoading } = useData(
    isSearching && (category || keyward)
      ? `/api/app/discover/app-list?${new URLSearchParams({
          chainId,
          category: category.toString(),
          search: keyward,
          skipCount: (pageIndex * PAGE_SIZE).toString(),
          maxResultCount: PAGE_SIZE.toString(),
        }).toString()}`
      : null
  );

  const { data: madeForYouResult } = useData(
    "/api/app/user/homepage/made-for-you?chainId=tDVW"
  );

  const { data: votedAppResult } = useData(
    "/api/app/user/homepage?chainId=tDVW"
  );

  useEffect(() => {
    const { data } = searchData || {};
    if (data && Array.isArray(data)) {
      setSearchList((prev) => (pageIndex === 1 ? data : [...prev, ...data]));
      setNoMore(data.length < PAGE_SIZE);
    }
  }, [pageIndex, searchData]);

  const onClaimClick = async () => {
    try {
      const result = await postWithToken("/api/app/user/login-points/collect", {
        chainId,
      });
      if (result?.data?.userTotalPoints) {
        updateUserPoints(result?.data?.userTotalPoints);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showAd = useAdsgram({
    blockId: import.meta.env.VITE_ADSGRAM_ID.toString() || "",
    onReward: updateUserPoints,
    onError: () => {},
    onSkip: () => {},
  });

  useEffect(() => {
    const scrollRef = scrollViewRef.current;

    const handleScroll = () => {
      const scrollRef = scrollViewRef.current;
      if (!scrollRef) return;
      if (
        scrollRef.scrollHeight - scrollRef.scrollTop - scrollRef.clientHeight <
          50 &&
        !noMore &&
        !isLoading
      ) {
        setPageIndex((page) => page + 1);
      }
    };

    if (scrollRef) {
      scrollRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef) {
        scrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoading, noMore, scrollViewRef]);

  return (
    <>
      <TelegramHeader title={isSearching ? "Discover" : ""} />
      <div
        className="h-screen overflow-x-scroll pt-telegramHeader bg-black"
        ref={scrollViewRef}
      >
        <div className="font-outfit votigram-grid mt-[9px]">
          <div className="col-12 mb-[11px]">
            {isSearching ? (
              <i
                className="votigram-icon-back text-[19px] leading-[18px] text-white"
                onClick={() => {
                  setIsSearching(false);
                }}
              />
            ) : (
              <span className="font-bold text-[20px] leading-[20px] text-white">
                Hi,&nbsp;
                {window?.Telegram?.WebApp?.initDataUnsafe?.user?.first_name ||
                  " "}
              </span>
            )}
          </div>
          <div className="col-12 bg-input gap-2 h-[41px] px-4 flex items-center rounded-3xl">
            <i className="votigram-icon-search text-input-placeholder" />
            <input
              className="w-full bg-transparent text-white outline-none appearence-none placeholder:leading-[19.6px] text-[14px] placeholder:text-input-placeholder placeholder:font-questrial"
              placeholder="Search..."
              onChange={(e) => {
                setPageIndex(0);
                setKeyward(e.target.value);
              }}
              onFocus={() => {
                setIsSearching(true);
              }}
            />
          </div>
        </div>
        <CategoryPillList
          items={DISCOVER_CATEGORY}
          onChange={(value) => {
            setPageIndex(0);
            setCategory(value);
            setIsSearching(value !== APP_CATEGORY.ALL);
          }}
        />
        {isSearching ? (
          <SearchPanel
            recommendList={searchList.length > 0 ? searchList : recommendList}
            onAppItemClick={onAppItemClick}
          />
        ) : (
          <>
            <div className="mb-[22px] votigram-grid gap-[9px]">
              <div className="col-6 p-[13px] flex flex-col gap-[7px] relative h-[230px] bg-secondary text-black rounded-[18px]">
                <img
                  src="https://cdn.tmrwdao.com/votigram/assets/imgs/3F37AB0AEBE1.webp"
                  className="left-0 bottom-0 absolute w-[118px]"
                />
                <div className="flex bg-[#00000038] rounded-full w-[32px] aspect-square justify-center items-center">
                  <i className="votigram-icon-chat-bubble text-[20px] text-white opacity-40" />
                </div>
                <span className="text-[12px] leading-[13px] font-normal">
                  Community Leaderboard
                </span>
                <span className="font-outfit text-xl font-bold w-[127px] leading-[20px]">
                  Vote for your favourite TMAs
                </span>
              </div>
              <div className="col-6 h-[230px] flex flex-col gap-[10px]">
                <div className="col-12 p-[13px] flex-1 bg-tertiary rounded-[18px]" onClick={() => onAppItemClick()}>
                  <div className="flex bg-[#00000038] rounded-full w-[32px] aspect-square justify-center items-center">
                    <i className="votigram-icon-navbar-for-you text-[20px] text-white opacity-40" />
                  </div>
                  <span className="text-[12px] text-white leading-[13px] font-normal">
                    Browse TMAs
                  </span>
                </div>
                <div className="col-12 p-[13px] flex-1 bg-primary rounded-[18px] relative">
                  <img
                    src="https://cdn.tmrwdao.com/votigram/assets/imgs/E0454AB5B2E6.webp"
                    className="absolute right-[25px] top-0 w-[45px]"
                  />
                  <div className="flex bg-[#00000038] rounded-full w-[32px] aspect-square justify-center items-center">
                    <i className="votigram-icon-profile text-[20px] text-white opacity-40" />
                  </div>
                  <span className="text-[12px] text-white leading-[13px] font-normal">
                    My Profile
                  </span>
                  <div className="flex gap-1 absolute bottom-[12px] items-end">
                    <PointsCounter
                      end={userPoints?.userTotalPoints || 0}
                      duration={1000}
                    />
                    <span className="text-[11px] text-white leading-[13px] font-normal">
                      points
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <TopVotedApps
              onAppItemClick={onAppItemClick}
              items={votedAppResult?.weeklyTopVotedApps}
            />
            <DiscoveryHiddenGems
              onAppItemClick={onAppItemClick}
              item={votedAppResult?.discoverHiddenGems}
            />
            <AppList
              onAppItemClick={onAppItemClick}
              title="Made For You"
              items={madeForYouResult?.data}
            />
          </>
        )}
      </div>
      <Modal isVisible={showDailyReward} rootClassName="p-5">
        <DailyRewards userPoints={userPoints} />
        <button
          className="mt-7 bg-secondary text-black text-[14px] leading-[14px] font-outfit font-bold py-[10px] w-full rounded-[24px] mb-2"
          onClick={showAd}
        >
          Watch Ads To Double The Point
        </button>
        <button
          onClick={() => {
            setShowDailyReward(false);
            updateDailyLoginPointsStatus(true);
            onClaimClick();
          }}
          className="bg-primary text-white text-[14px] leading-[14px] font-outfit font-bold py-[10px] w-full rounded-[24px]"
        >
          Claim Today's Reward
        </button>
      </Modal>
    </>
  );
};

export default Home;
