import { useCallback, useEffect, useRef, useState } from "react";


import TelegramHeader from "@/components/TelegramHeader";
import { TAB_LIST } from "@/constants/navigation";
import { PROFILE_TABS } from "@/constants/vote";
import { useAdsgram } from "@/hooks/useAdsgram";
import { useUserContext } from "@/provider/UserProvider";

import Tabs from "../Tabs";
import Achievements from "./components/Achievements";
import Tasks from "./components/Tasks";





const tabs = [{
  label: PROFILE_TABS.TASK,
  value: 0,
}, {
  label: PROFILE_TABS.ACHIEVEMENTS,
  value: 1,
}]

interface IProfileProps {
  switchTab: (tab: TAB_LIST) => void;
}

const Profile = ({ switchTab }: IProfileProps) => {
  const {
    user,
    updateUserPoints
  } = useUserContext();
  const { userPoints } = user;
  const [currentTab, setCurrentTab] = useState(0);
  const scrollViewRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const onReward = (totalPoints: number = 0) => {
    updateUserPoints(totalPoints);
  }

  const showAd = useAdsgram({
    blockId: import.meta.env.VITE_ADSGRAM_ID.toString() || "",
    onReward,
    onError: () => {},
    onSkip: () => {},
  });

  const handleScroll = useCallback(() => {
    const scrollRef = scrollViewRef.current;
    if (scrollRef) {
      setScrollTop(
        scrollRef.scrollHeight - scrollRef.scrollTop - scrollRef.clientHeight
      );
    }
  }, [scrollViewRef]);

  useEffect(() => {
    const scrollRef = scrollViewRef.current;
    if (currentTab === 1 && scrollRef) {
      scrollRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef) {
        scrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentTab, handleScroll, scrollViewRef]);

  return (
    <>
      <TelegramHeader title="Profile" />
      <div
        className="h-screen overflow-scroll pt-telegramHeader bg-black pb-28"
        ref={scrollViewRef}
      >
        <div className="votigram-grid mt-[9px]">
          <div className="col-7 mt-[13px]">
            <span className="block font-outfit font-bold text-[20px] leading-[20px] text-white">
              Hi,&nbsp;
              {window?.Telegram?.WebApp?.initDataUnsafe?.user?.first_name ||
                " "}
            </span>
          </div>
          <div className="flex flex-col col-5 items-end gap-[6px]">
            <span className="text-[10px] leading-[11px]">
              Total earned points:
            </span>
            <span className="font-pressStart text-secondary tracking-[-1.6] text-[16px] leading-[16px]">
              {userPoints?.userTotalPoints.toLocaleString() || 0}
            </span>
          </div>

          <img
            className="col-12 rounded-[15px] my-[22px]"
            src="https://cdn.tmrwdao.com/votigram/assets/imgs/CB2BE5C102D8.webp"
            alt="Watch Ads"
            onClick={showAd}
          />

          <div className="col-12 mb-[22px]">
            <Tabs options={tabs} onChange={setCurrentTab} />
        </div>

          <div className="col-12 min-w-[335px]">
            {currentTab === 0 ? (
              <Tasks totalPoints={userPoints?.userTotalPoints || 0} switchTab={switchTab} onReward={onReward} />
            ) : (
              <Achievements scrollTop={scrollTop} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
