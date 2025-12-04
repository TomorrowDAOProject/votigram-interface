import { useState } from "react";

import useRequest from "ahooks/lib/useRequest";



import Loading from "@/components/Loading";
import { chainId } from "@/constants/app";
import { TAB_LIST } from "@/constants/navigation";
import { USER_TASK_DETAIL } from "@/constants/task";
import { useAdsgram } from "@/hooks/useAdsgram";
import { fetchWithToken } from "@/hooks/useData";
import { useUserContext } from "@/provider/UserProvider";
import { TaskInfo } from "@/types/task";

import { openNewPageWaitPageVisible } from "../../utils";


interface ITaskItemProps {
  userTask: string;
  data: TaskInfo;
  totalPoints: number;
  switchTab: (tab: TAB_LIST) => void;
  toInvite(): void;
  watchAds?(): void;
  refresh?(points?: number): void;
}

let RETRY_MAX_COUNT = 10;

const taskItemMap: Record<string, { title: string; icon: React.ReactNode }> = {
  [USER_TASK_DETAIL.DAILY_VIEW_ADS]: {
    icon: <i className="votigram-icon-watch-ads" />,
    title: "Watch Ads",
  },
  [USER_TASK_DETAIL.DAILY_VOTE]: {
    icon: <i className="votigram-icon-navbar-vote" />,
    title: "Cast A Vote",
  },
  [USER_TASK_DETAIL.DAILY_FIRST_INVITE]: {
    icon: <i className="votigram-icon-referral-friends" />,
    title: "Invite A Friend",
  },
  [USER_TASK_DETAIL.EXPLORE_JOIN_VOTIGRAM]: {
    icon: <i className="votigram-icon-telegram" />,
    title: "Join Votigram TG Channel",
  },
  [USER_TASK_DETAIL.EXPLORE_FOLLOW_VOTIGRAM_X]: {
    icon: <i className="votigram-icon-twitter-x" />,
    title: "Follow Votigram on X",
  },
  [USER_TASK_DETAIL.EXPLORE_FORWARD_VOTIGRAM_X]: {
    icon: <i className="votigram-icon-twitter-x" />,
    title: "RT Votigram Post on X",
  },
  [USER_TASK_DETAIL.EXPLORE_SCHRODINGER]: {
    icon: <i className="votigram-icon-schrondinger-logo" />,
    title: "Join Schrondinger's Cat",
  },
  [USER_TASK_DETAIL.EXPLORE_JOIN_TG_CHANNEL]: {
    icon: <i className="votigram-icon-telegram" />,
    title: "Join TMRWDAO TG Channel",
  },
  [USER_TASK_DETAIL.EXPLORE_FOLLOW_X]: {
    icon: <i className="votigram-icon-twitter-x" />,
    title: "Follow TMRWDAO on X",
  },
  [USER_TASK_DETAIL.EXPLORE_FORWARD_X]: {
    icon: <i className="votigram-icon-twitter-x" />,
    title: "RT TMRWDAO Post on X",
  },
  [USER_TASK_DETAIL.EXPLORE_CUMULATE_FIVE_INVITE]: {
    icon: <i className="votigram-icon-referral-friends" />,
    title: "Invite 5 Friends",
  },
  [USER_TASK_DETAIL.EXPLORE_CUMULATE_TEN_INVITE]: {
    icon: <i className="votigram-icon-referral-friends" />,
    title: "Invite 10 Friends",
  },
  [USER_TASK_DETAIL.EXPLORE_CUMULATE_TWENTY_INVITE]: {
    icon: <i className="votigram-icon-referral-friends" />,
    title: "Invite 20 Friends",
  },
};

const TaskItem = ({
  data,
  userTask,
  totalPoints,
  switchTab,
  toInvite,
  refresh,
}: ITaskItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { cmsData } = useUserContext();
  const {
    retweetVotigramPostURL,
    retweetTmrwdaoPostURL,
    discoverTopBannerRedirectURL,
  } = cmsData || {};

  const jumpExternalList = [
    {
      taskId: USER_TASK_DETAIL.EXPLORE_JOIN_VOTIGRAM,
      url: "https://t.me/votigram",
    },
    {
      taskId: USER_TASK_DETAIL.EXPLORE_FOLLOW_VOTIGRAM_X,
      url: "https://x.com/votigram",
    },
    {
      taskId: USER_TASK_DETAIL.EXPLORE_FORWARD_VOTIGRAM_X,
      url: retweetVotigramPostURL || "",
    },
    {
      taskId: USER_TASK_DETAIL.EXPLORE_JOIN_TG_CHANNEL,
      url: "https://t.me/tmrwdao",
    },
    {
      taskId: USER_TASK_DETAIL.EXPLORE_FOLLOW_X,
      url: "https://x.com/tmrwdao",
    },
    {
      taskId: USER_TASK_DETAIL.EXPLORE_FORWARD_X,
      url: retweetTmrwdaoPostURL || "",
    },
    {
      taskId: USER_TASK_DETAIL.EXPLORE_SCHRODINGER,
      url: discoverTopBannerRedirectURL || "",
    },
  ];

  const showAd = useAdsgram({
    blockId: import.meta.env.VITE_ADSGRAM_ID.toString() || "",
    onReward: (points) => refresh?.(points),
    onError: () => {},
    onSkip: () => {},
  });
  const { run: sendCompleteReq, cancel } = useRequest(
    async (taskId) => {
      try {
        const result = await fetchWithToken(
          `/api/app/user/complete-task?${new URLSearchParams({
            chainId,
            userTask,
            userTaskDetail: taskId,
          })}`
        );
        if (result) {
          refresh?.(totalPoints + data.points);
          setIsLoading(false);
          cancel();
        }
        if (result || RETRY_MAX_COUNT <= 0) {
          cancel();
          setIsLoading(false);
        }
        RETRY_MAX_COUNT--;
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    },
    {
      manual: true,
      pollingInterval: 3000,
    }
  );

  const jumpAndRefresh = async (taskId: USER_TASK_DETAIL) => {
    try {
      const jumpItem = jumpExternalList.find(
        (item) => item.taskId === data.userTaskDetail
      );
      if (jumpItem) {
        const isComplete = await openNewPageWaitPageVisible(
          jumpItem.url,
          taskId,
          () =>
            fetchWithToken(
              `/api/app/user/complete-task?${new URLSearchParams({
                chainId,
                userTask,
                userTaskDetail: taskId,
              })}`
            )
        );
        if (isComplete) return;
        setIsLoading(true);
        sendCompleteReq(taskId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    if (isLoading || data.complete) return;
    switch (data.userTaskDetail) {
      case USER_TASK_DETAIL.DAILY_VIEW_ADS:
        showAd();
        break;
      case USER_TASK_DETAIL.DAILY_VOTE:
        switchTab(TAB_LIST.VOTE);
        break;
      case USER_TASK_DETAIL.EXPLORE_JOIN_VOTIGRAM:
      case USER_TASK_DETAIL.EXPLORE_FOLLOW_VOTIGRAM_X:
      case USER_TASK_DETAIL.EXPLORE_FORWARD_VOTIGRAM_X:
      case USER_TASK_DETAIL.EXPLORE_JOIN_TG_CHANNEL:
      case USER_TASK_DETAIL.EXPLORE_FOLLOW_X:
      case USER_TASK_DETAIL.EXPLORE_FORWARD_X:
      case USER_TASK_DETAIL.EXPLORE_SCHRODINGER:
        await jumpAndRefresh(data.userTaskDetail);
        break;
      case USER_TASK_DETAIL.DAILY_FIRST_INVITE:
      case USER_TASK_DETAIL.EXPLORE_CUMULATE_FIVE_INVITE:
      case USER_TASK_DETAIL.EXPLORE_CUMULATE_TEN_INVITE:
      case USER_TASK_DETAIL.EXPLORE_CUMULATE_TWENTY_INVITE:
        toInvite();
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-tertiary flex items-center justify-between rounded-[12px] py-3 pl-[6px] pr-[10px] mb-2">
      <div className="flex items-center max-w-[78%] gap-[15px] flex-shrink-0 flex-grow overflow-hidden mr-[7px]">
        <div className="w-[48px] h-[34px] flex items-center justify-center shrink-0 text-[32px]">
          {taskItemMap[data.userTaskDetail]?.icon}
        </div>
        <div className="flex flex-col items-start flex-shrink gap-1 overflow-hidden">
          <span className="font-bold truncate overflow-hidden text-ellipsis w-full text-white font-outfit leading-[14px] text-[14px]">
            {taskItemMap[data.userTaskDetail]?.title}{" "}
            {data.taskCount !== 0 &&
              `(${data.completeCount}/${data.taskCount})`}
          </span>
          <span className="font-normal text-[13px] text-lime-green leading-[15.6px]">
            +{data.points}
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={data.complete || isLoading}
        className="bg-primary w-[61px] shrink-0 rounded-[24px] text-[14px] font-bold py-[10px] font-outfit leading-[14px] text-white disabled:bg-black disabled:text-input-placeholder"
        onClick={handleClick}
      >
        {!isLoading ? (
          "Go"
        ) : (
          <Loading
            className="bg-transparent"
            iconClassName="!border-input-placeholder w-[14px] h-[14px]"
          />
        )}
      </button>
    </div>
  );
};

export default TaskItem;
