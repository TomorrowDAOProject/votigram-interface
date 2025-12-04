
import { useCallback, useEffect, useRef, useState } from "react";

import dayjs from "dayjs";


import { VOTE_TABS } from "@/constants/vote";
import useSetSearchParams from "@/hooks/useSetSearchParams";
import { useUserContext } from "@/provider/UserProvider";
import { VoteApp } from "@/types/app";

import Community from "../Community";
import Countdown from "../Countdown";
import Modal from "../Modal";
import TelegramHeader from "../TelegramHeader";
import TMAs from "../TMAs";
import ToggleSlider from "../ToggleSlider";


interface IVoteProps {
  onAppItemClick: (item: VoteApp) => void;
}

const TABS = [VOTE_TABS.TMAS, VOTE_TABS.COMMUNITY];

const Vote = ({ onAppItemClick }: IVoteProps) => {
  const {
    user: { userPoints },
  } = useUserContext();
  const { querys, updateQueryParam } = useSetSearchParams();
  const activeTab = querys.get("vote_tab");
  const tmasTab = querys.get("tmas");
  const [tmaTab, setTMATab] = useState(tmasTab === "1" ? Number(tmasTab) : 0);
  const [currentTab, setCurrentTab] = useState(activeTab || VOTE_TABS.TMAS);
  const scrollViewRef = useRef<HTMLDivElement | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [showWelcome, setShowWelCome] = useState(false);

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
    if (scrollRef) {
      scrollRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef) {
        scrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll, scrollViewRef]);

  const getRemainingSeconds = () => {
    const now = dayjs();
    const dayOfWeek = now.day();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    const nextSundayMidnight = now
      .add(daysUntilSunday, "day")
      .startOf("day")
      .add(1, "day");

    const differenceInMilliseconds = nextSundayMidnight.diff(now);
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    setSeconds(differenceInSeconds);
  };

  const onTabChange = (index: number) => {
    setCurrentTab(index === 0 ? VOTE_TABS.TMAS : VOTE_TABS.COMMUNITY);
    updateQueryParam({
      key: "vote_tab",
      value: index === 0 ? VOTE_TABS.TMAS : VOTE_TABS.COMMUNITY,
    });
  };

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab || VOTE_TABS.TMAS);
    }
  }, [activeTab]);

  useEffect(() => {
    const isShowed = localStorage.getItem("showWelcome");

    if (!isShowed) {
      setShowWelCome(!isShowed);
      localStorage.setItem("showWelcome", "1");
    }
  }, []);

  return (
    <div className="h-screen overflow-scroll bg-black" ref={scrollViewRef}>
      <TelegramHeader
        className="!relative"
        title={
          currentTab === VOTE_TABS.TMAS && tmaTab === 1 ? (
            <Countdown initialTime={seconds} onFinish={getRemainingSeconds} />
          ) : (
            ""
          )
        }
      />
      <div className="votigram-grid">
        <div className="col-7 h-7 mt-3">
          <ToggleSlider
            current={TABS.findIndex((tab) => tab === currentTab)}
            items={TABS}
            onChange={onTabChange}
          />
        </div>
        <div className="flex flex-col col-5 items-end gap-[6px]">
          <span className="text-[10px] leading-[11px] text-white">
            Total earned points:
          </span>
          <span className="font-pressStart text-secondary tracking-[-1.6] text-[16px] leading-[16px]">
            {userPoints?.userTotalPoints.toLocaleString() || 0}
          </span>
        </div>
        <div className="mt-8 col-12">
          {currentTab === VOTE_TABS.TMAS ? (
            <TMAs
              scrollTop={scrollTop}
              onTabChange={setTMATab}
              onAppItemClick={onAppItemClick}
            />
          ) : (
            <Community scrollTop={scrollTop} />
          )}
        </div>
      </div>
      <Modal
        isVisible={showWelcome}
        rootClassName="pt-[26px] px-[29px] pb-[22px] bg-primary"
      >
        <img
          className="mx-auto w-[236px] h-[208px] object-contain"
          src="https://cdn.tmrwdao.com/votigram/assets/imgs/AAF09912A14F.webp"
          alt="Tips"
        />
        <span className="block mt-[12px] text-center text-white whitespace-pre-wrap font-outfit font-bold text-[20px] leading-[20px]">{`Vote For Your Favourite \nTelegram Mini-Apps!`}</span>

        <button
          className="mt-[18px] w-full py-[10px] text-[14px] font-outfit font-bold text-black leading-[14px] bg-lime-green rounded-[24px]"
          onClick={() => setShowWelCome(false)}
        >
          Let's Go!
        </button>
      </Modal>
    </div>
  );
};

export default Vote;
