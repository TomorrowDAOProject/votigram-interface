/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";

import { CreateTypes } from "canvas-confetti";

import Confetti from "@/components/Confetti";
import { TgLink } from "@/config";
import { chainId } from "@/constants/app";
import { HEART_SHAPE } from "@/constants/canvas-confetti";
import { postWithToken } from "@/hooks/useData";
import { getShareText } from "@/pageComponents/PollDetail/utils";
import { useUserContext } from "@/provider/UserProvider";
import { VoteApp } from "@/types/app";
import { stringifyStartAppParams, stringToHex } from "@/utils/start-params";

interface IActionButton {
  item: VoteApp;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  updateOpenAppClick: (alias: string) => void;
  updateReviewClick: (item: VoteApp) => void;
  updateLikeAppClick: (likesCount: number) => void;
}

const ActionButton = ({
  item,
  totalLikes = 0,
  totalComments = 0,
  totalShares = 0,
  updateLikeAppClick,
  updateOpenAppClick,
  updateReviewClick,
}: IActionButton) => {
  const {
    user: { userPoints },
    updateUserPoints,
  } = useUserContext();
  const confettiInstance = useRef<CreateTypes | null>(null);
  const [totalCurrentLikes, setTotalCurrentLikes] = useState(totalLikes);
  const [likeCount, setLikeCount] = useState(0);

  const handleClick = () => {
    setLikeCount((prevCount) => prevCount + 1);
  };

  const fetchRankingLike = useCallback(
    async (likeCount: number) => {
      const {
        data: { userTotalPoints },
      } = await postWithToken("/api/app/ranking/like", {
        chainId,
        proposalId: "",
        likeList: [
          {
            alias: item.alias,
            likeAmount: likeCount,
          },
        ],
      });
      updateUserPoints(userTotalPoints || userPoints?.userTotalPoints);
    },
    [updateUserPoints, userPoints?.userTotalPoints]
  );

  // Effect to handle debouncing
  useEffect(() => {
    if (likeCount > 0) {
      const timer = setTimeout(() => {
        updateLikeAppClick(likeCount);
        setTotalCurrentLikes((prev) => prev + likeCount);
        fetchRankingLike(likeCount);
        setLikeCount(0);
      }, 700);

      return () => clearTimeout(timer); // Cleanup timeout on unmount or update
    }
  }, [item.alias, likeCount]);

  const onInit = ({ confetti }: { confetti: CreateTypes }) => {
    confettiInstance.current = confetti;
  };

  const onLikeClick = () => {
    confettiInstance.current?.({
      angle: 110,
      particleCount: 15,
      spread: 70,
      origin: { y: 0.2, x: 0.88 },
      disableForReducedMotion: true,
      shapes: [HEART_SHAPE],
      zIndex: 10,
    });

    window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");

    handleClick();
  };

  const onOpenAppClick = () => {
    shareToTelegram();
    updateOpenAppClick(item.alias);
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
  };

  const generateShareUrl = () => {
    const paramsStr = stringifyStartAppParams({
      alias: stringToHex(item.alias),
    });
    return `${TgLink}?startapp=${paramsStr}`;
  };

  const shareToTelegram = () => {
    if (window?.Telegram?.WebApp?.openTelegramLink) {
      const url = encodeURIComponent(generateShareUrl());
      const shareText = encodeURIComponent(
        getShareText(
          `I just found this awesome app "${item.title}" on Votigram! 🌟`,
          `Join me on Votigram to discover more fun apps, and earn points for USDT airdrops! 💎 \n`
        )
      );
      window?.Telegram?.WebApp?.openTelegramLink(
        `https://t.me/share/url?url=${url}&text=${shareText}`
      );
    }
  };

  return (
    <>
      <div className="flex flex-col absolute right-0 bottom-[45%] z-[10] right-[20px] gap-[27px]">
        <div
          role="button"
          className="flex flex-col items-center gap-1"
          onClick={onLikeClick}
        >
          <div className="flex w-[42px] h-[42px] rounded-full bg-white/25 justify-center items-center">
            <i className="votigram-icon-navbar-vote text-[32px] text-primary" />
          </div>
          <span
            className="text-[12px] leading-[13px] text-white"
            data-testid="like-label-testid"
          >
            {totalCurrentLikes + likeCount}
          </span>
        </div>
        <div
          role="button"
          className="flex flex-col items-center gap-1"
          onClick={() => {
            updateReviewClick(item);
            window.Telegram.WebApp.HapticFeedback.notificationOccurred(
              "success"
            );
          }}
        >
          <div className="flex w-[42px] h-[42px] rounded-full bg-white/25 justify-center items-center">
            <i className="votigram-icon-chat-bubble text-[32px] text-primary" />
          </div>
          <span className="text-[12px] leading-[13px] text-white">
            {totalComments}
          </span>
        </div>
        <div
          role="button"
          className="flex flex-col items-center gap-1"
          onClick={onOpenAppClick}
        >
          <div className="flex w-[42px] h-[42px] rounded-full bg-white/25 justify-center items-center">
            <i className="votigram-icon-arrow-ninety-degrees text-[26px] text-primary" />
          </div>
          <span className="text-[12px] leading-[13px] text-white">
            {totalShares}
          </span>
        </div>
      </div>
      <Confetti onInit={onInit} className="absolute w-full top-0" />
    </>
  );
};

export default ActionButton;
