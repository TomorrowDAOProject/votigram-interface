import React from "react";

import clsx from "clsx";

import { TAB_LIST } from "@/constants/navigation";

import "./index.css";

interface NavigationProps {
  activeTab: TAB_LIST;
  onMenuClick: (tab: TAB_LIST) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onMenuClick }) => {
  const tabPositions = {
    [TAB_LIST.HOME]: 0,
    [TAB_LIST.FOR_YOU]: 1,
    [TAB_LIST.VOTE]: 2,
    [TAB_LIST.PEN]: 3,
  };

  const tabWidth = 70;
  const indicatorStyle = {
    transform: `translateX(${tabPositions[activeTab] * tabWidth}px)`,
    transition: "transform 0.3s ease",
  };

  return (
    <div className="navigation-container fixed w-[335px] gap-[46px] justify-center items-center flex bg-white bg-opacity-15 h-[61px] inset-x-0 m-auto rounded-[78px]">
      <div
        data-testid="home-tab"
        className="flex flex-col items-center"
        onClick={() => onMenuClick(TAB_LIST.HOME)}
      >
        <i
          data-testid="votigram-icon-navbar-home"
          className={clsx(
            "votigram-icon-navbar-home text-[24px]",
            activeTab === TAB_LIST.HOME
              ? "text-white"
              : "text-input-placeholder"
          )}
        />
      </div>
      <div
        data-testid="for-you-tab"
        className="flex flex-col items-center"
        onClick={() => onMenuClick(TAB_LIST.FOR_YOU)}
      >
        <i
          data-testid="votigram-icon-navbar-for-you"
          className={clsx(
            "votigram-icon-navbar-for-you text-[24px]",
            activeTab === TAB_LIST.FOR_YOU
              ? "text-white"
              : "text-input-placeholder"
          )}
        />
      </div>
      <div
        data-testid="heart-tab"
        className="flex flex-col items-center"
        onClick={() => onMenuClick(TAB_LIST.VOTE)}
      >
        <i
          data-testid="votigram-icon-navbar-vote"
          className={clsx(
            "votigram-icon-navbar-vote text-[24px]",
            activeTab === TAB_LIST.VOTE
              ? "text-white"
              : "text-input-placeholder"
          )}
        />
      </div>
      <div
        data-testid="pen-tab"
        className="flex flex-col items-center"
        onClick={() => onMenuClick(TAB_LIST.PEN)}
      >
        <i
          data-testid="votigram-icon-navbar-task-profile"
          className={clsx(
            "votigram-icon-navbar-task-profile text-[24px]",
            activeTab === TAB_LIST.PEN ? "text-white" : "text-input-placeholder"
          )}
        />
      </div>
      <div
        role="presentation"
        className="flex top-[46px] left-[57px] bg-primary h-[2.5px] rounded-full w-[11px] absolute"
        style={indicatorStyle}
      />
    </div>
  );
};

export default Navigation;
