import { useCallback, useEffect, useRef, useState } from "react";

import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import useRequest from "ahooks/lib/useRequest";
import { CreateTypes } from "canvas-confetti";
import clsx from "clsx";

import Confetti from "@/components/Confetti";
import { rpcUrlTDVW, sideChainCAContractAddress, voteAddress } from "@/config";
import { chainId } from "@/constants/app";
import { HEART_SHAPE } from "@/constants/canvas-confetti";
import { APP_CATEGORY } from "@/constants/discover";
import { VOTE_STATUS } from "@/constants/vote";
import { postWithToken } from "@/hooks/useData";
import { useUserContext } from "@/provider/UserProvider";
import { VoteApp } from "@/types/app";
import { EVoteOption } from "@/types/contract";
import { getRawTransactionPortkey } from "@/utils/getRawTransactionPortkey";

import Drawer from "../Drawer";
import ProgressBar from "../ProgressBar";
import { getTrackId } from "./utils";

interface IVoteItemProps {
  data: VoteApp;
  rank?: number;
  canVote?: boolean;
  showHat?: boolean;
  showBtn?: boolean;
  showPoints?: boolean;
  isTMACurrent?: boolean;
  className?: string;
  proposalId: string;
  hatClassName?: string;
  imgClassName?: string;
  category?: APP_CATEGORY;
  onVoted?(addPoints?: number): void;
  onClick?: (item: VoteApp) => void;
}

let RETRY_MAX_COUNT = 30;

const VoteItem = ({
  data,
  rank,
  showHat,
  showBtn,
  canVote,
  showPoints,
  className,
  proposalId,
  hatClassName,
  imgClassName,
  category,
  isTMACurrent,
  onVoted,
  onClick,
}: IVoteItemProps) => {
  const {
    user: { userPoints },
    updateUserPoints,
  } = useUserContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const confettiInstance = useRef<CreateTypes | null>(null);
  const [totalCurrentPoints, setTotalCurrentPoints] = useState(
    isTMACurrent ? data.totalPoints : data.pointsAmount
  );
  const { walletInfo, callSendMethod } = useConnectWallet();

  const [elementWidth, setElementWidth] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const onInit = ({ confetti }: { confetti: CreateTypes }) => {
    confettiInstance.current = confetti;
  };

  const { run: fetchVoteStatus, cancel } = useRequest(
    async (rawTransaction, result) => {
      try {
        setLoading(true);
        const { data } = await voteRequest(rawTransaction, result);
        if (
          !data ||
          data.status === VOTE_STATUS.FAILED ||
          RETRY_MAX_COUNT < 0
        ) {
          setLoading(false);
          setIsFailed(true);
          cancel();
        } else if (data.status === VOTE_STATUS.VOTED) {
          if (data?.userTotalPoints) {
            updateUserPoints(data.userTotalPoints);
          }
          onVoted?.(200);
          showConfetti();
          cancel();
          setLoading(false);
        }
        RETRY_MAX_COUNT--;
      } catch (error) {
        console.error(error);
        setLoading(false);
        setIsFailed(true);
      }
    },
    {
      manual: true,
      pollingInterval: 2000,
    }
  );

  const showConfetti = () => {
    let normalizedTop = 0.5;
    let normalizedLeft = 0.88;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      normalizedTop = rect.top / windowHeight;
      normalizedLeft = rect.left / windowWidth;
    }

    confettiInstance.current?.({
      angle: 110,
      particleCount: 15,
      spread: 70,
      origin: { y: normalizedTop, x: normalizedLeft },
      disableForReducedMotion: true,
      shapes: [HEART_SHAPE],
      zIndex: 10,
    });
  };

  const onVoteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (canVote) {
      RETRY_MAX_COUNT = 10;
      sedRawTransaction();
    } else {
      showConfetti();
      setLikeCount((prevCount) => prevCount + 1);
    }
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
  };

  useEffect(() => {
    setLikeCount(0);
    setTotalCurrentPoints(isTMACurrent ? data.totalPoints : data.pointsAmount);
  }, [data.totalPoints, data.pointsAmount, isTMACurrent]);

  const fetchRankingLike = useCallback(async (likeCount: number) => {
    const { data: { userTotalPoints } } = await postWithToken("/api/app/ranking/like", {
      chainId,
      proposalId,
      likeList: [
        {
          alias: data.alias,
          likeAmount: likeCount,
        },
      ],
    });
    updateUserPoints(userTotalPoints || userPoints?.userTotalPoints);
  }, [data.alias, proposalId, updateUserPoints, userPoints?.userTotalPoints])

  useEffect(() => {
    if (likeCount > 0) {
      const timer = setTimeout(() => {
        setTotalCurrentPoints((prev) => (prev || 0) + likeCount);
        onVoted?.(likeCount);
        fetchRankingLike(likeCount);
        setLikeCount(0);
      }, 1000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount or update
    }
  }, [data.alias, fetchRankingLike, likeCount, onVoted, proposalId]);

  const sedRawTransaction = async () => {
    try {
      setLoading(true);
      const result: {
        transactionId: string;
      } = await callSendMethod({
        contractAddress: voteAddress,
        methodName: "Vote",
        args: {
          votingItemId: proposalId,
          voteOption: EVoteOption.APPROVED,
          voteAmount: 1,
          memo: `##GameRanking:{${data?.alias}}`,
        },
        chainId,
      });

      const rawTransaction = await getRawTransactionPortkey({
        caHash: walletInfo?.extraInfo?.portkeyInfo.caInfo.caHash,
        privateKey: walletInfo?.extraInfo?.portkeyInfo.walletInfo.privateKey,
        contractAddress: voteAddress,
        caContractAddress: sideChainCAContractAddress,
        rpcUrl: rpcUrlTDVW,
        params: {
          votingItemId: proposalId,
          voteOption: EVoteOption.APPROVED,
          voteAmount: 1,
          memo: `##GameRanking:{${data?.alias}}`,
        },
        methodName: "Vote",
      });
      if (rawTransaction && result) {
        fetchVoteStatus(rawTransaction, result);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setIsFailed(true);
    }
  };

  const voteRequest = (
    rawTransaction: string,
    result: { transactionId: string }
  ) => {
    const trackId = getTrackId();
    return postWithToken("/api/app/ranking/vote", {
      chainId,
      rawTransaction: rawTransaction,
      transactionId: result.transactionId,
      trackId,
      category,
    });
  };

  useEffect(() => {
    const updateWidth = () => {
      if (elementRef.current) {
        setElementWidth(elementRef.current.clientWidth);
      }
    };
    updateWidth();
  }, []);

  const handleFinish = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFailed(false);
    sedRawTransaction();
  };

  return (
    <div className="relative">
      <div
        className={clsx(
          "flex flex-row items-center gap-[12.5px] py-[12px] px-[7px] rounded-[12px] bg-tertiary z-[10]",
          className
        )}
        onClick={() => onClick?.(data as VoteApp)}
      >
        <div
          className={clsx(
            "relative flex flex-row items-center justify-center w-[48px] h-[48px] rounded-[8px] text-white shrink-0",
            {
              "border-2 border-lime-primary": data?.editorChoice,
              "bg-gradient-to-tr from-lime-green to-lime-primary": !data.icon,
            }
          )}
        >
          {data?.icon ? (
            <>
              {showHat && (
                <img
                  src="https://cdn.tmrwdao.com/votigram/assets/imgs/246CBC3C5F73.webp"
                  alt="Avatar"
                  className={clsx(
                    "w-[20px] h-[14px] object-contain absolute left-1/2 translate-x-[-50%] top-[-14px] z-10",
                    hatClassName
                  )}
                />
              )}
              <img
                src={data?.icon}
                alt="Avatar"
                className={clsx(
                  "w-full h-full rounded-[8px] object-cover",
                  imgClassName
                )}
              />
            </>
          ) : (
            <span className="font-outfit font-bold text-[16px] leading-[16px] text-white">
              {data.title.slice(0, 1)}
            </span>
          )}
        </div>

        <div
          className="flex flex-col justify-center flex-1 gap-[8px]"
          ref={elementRef}
        >
          <div className="flex flex-row items-center justify-between">
            <span className="block font-outfit font-bold text-[16px] leading-[20px] text-white max-w-[50vw] truncate">
              {rank && (
                <span className="mr-[4px] font-outfit font-bold text-[12px] align-bottom">
                  {rank}
                </span>
              )}
              {data?.title}
            </span>
            {showPoints && (
              <span className="font-pressStart font-normal text-[9px] tracking-[-0.9px] leading-[9px] text-lime-green">
                {((totalCurrentPoints || 0) + likeCount)?.toLocaleString()}
              </span>
            )}
          </div>

          <ProgressBar
            width={elementWidth}
            progress={showPoints ? (data?.pointsPercent || 0) * 100 : 0}
          />
        </div>

        {showBtn && (
          <button
            type="button"
            ref={buttonRef}
            className="bg-white/[.25] w-[32px] h-[32px] flex justify-center items-center p-[8px] rounded-[20px] shrink-0 z-[10]"
            onClick={onVoteClick}
          >
            <i className="votigram-icon-navbar-vote text-[22px] text-lime-primary" />
          </button>
        )}
      </div>
      {showBtn && (
        <Confetti
          onInit={onInit}
          className="absolute w-[50%] h-[320px] right-0 bottom-0 z-0"
        />
      )}
      <Drawer
        isVisible={loading}
        direction="bottom"
        canClose={false}
        rootClassName="pt-[34px] pb-[40px] bg-tertiary"
      >
        <span className="block mb-[29px] text-[18px] font-outfit font-bold whitespace-pre-wrap leading-[18px] text-center text-white">
          {`We're on it, \nThanks for waiting!`}
        </span>
        <img
          className="mx-auto w-[236px] h-[208px] object-contain"
          src="https://cdn.tmrwdao.com/votigram/assets/imgs/AAF09912A14F.webp"
          alt="Creating"
        />
        <span className="block mt-[28px] text-center text-white whitespace-pre-wrap text-[14px] leading-[16.8px]">{`Your vote is being securely registered \non the blockchain.`}</span>
      </Drawer>

      <Drawer
        isVisible={isFailed}
        direction="bottom"
        rootClassName="pt-[34px] pb-[23px] px-5 bg-tertiary"
        onClose={() => setIsFailed(false)}
        canClose
      >
        <span className="block mb-[40px] text-[18px] font-outfit font-bold leading-[18px] text-center text-white">
          Please Try Again
        </span>
        <img
          className="mx-auto w-[140px] h-[87px] object-contain"
          src="https://cdn.tmrwdao.com/votigram/assets/imgs/FEBC32940EB3.webp"
          alt="Creating"
        />
        <span className="block mt-[26px] text-center text-white whitespace-pre-wrap text-[14px] leading-[16.8px]">
          {`We encountered an error registering \nyour vote on the blockchain.`}
        </span>
        <button
          className="mt-[37px] w-full h-[40px] text-white font-bold text-[14px] font-outfit rounded-[24px] bg-danger"
          type="button"
          onClick={handleFinish}
        >
          Try Again
        </button>
      </Drawer>
    </div>
  );
};

export default VoteItem;
