import { useEffect, useState } from "react";

import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useCopyToClipboard } from "react-use";
import { mutate } from "swr";

import BackBtn from "@/components/BackBtn";
import Countdown from "@/components/Countdown";
import Drawer from "@/components/Drawer";
import Loading from "@/components/Loading";
import TelegramHeader from "@/components/TelegramHeader";
import VoteItem from "@/components/VoteItem";
import { TgLink } from "@/config";
import { chainId } from "@/constants/app";
import useData from "@/hooks/useData";
import { IPollDetail } from "@/types/app";
import { stringifyStartAppParams } from "@/utils/start-params";

import { getShareText } from "./utils";

const PollDetail = () => {
  const { proposalId } = useParams();
  const [seconds, setSeconds] = useState(0);
  const [canVote, setCanVote] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [pollDeta, setPollDeta] = useState<IPollDetail | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const { walletInfo, isConnected } = useConnectWallet();

  const { data, isLoading } = useData(
    proposalId && isConnected && walletInfo
      ? `/api/app/ranking/detail?${new URLSearchParams({
          chainId,
          proposalId,
        }).toString()}`
      : null
  );

  useEffect(() => {
    if (data) {
      setPollDeta(data);
      setCanVote(data.canVoteAmount > 0);
      setSeconds(data?.endEpochTime / 1000 - dayjs().unix());
    }
  }, [data]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  const generateShareUrl = () => {
    const paramsStr = stringifyStartAppParams({
      pid: proposalId,
    });
    return `${TgLink}?startapp=${paramsStr}`;
  };

  const shareToTelegram = () => {
    if (window?.Telegram?.WebApp?.openTelegramLink) {
      const url = encodeURIComponent(generateShareUrl());
      const shareText = encodeURIComponent(
        getShareText(
          data.proposalTitle ?? "",
          `Make your voice heard!📢\n
Vote Now and Earn USDT airdrop on Votigram! 🚀
        `
        )
      );
      window?.Telegram?.WebApp?.openTelegramLink(
        `https://t.me/share/url?url=${url}&text=${shareText}`
      );
    }
  };

  const onVoted = () => {
    if (proposalId) {
      mutate(
        `/api/app/ranking/detail?${new URLSearchParams({
          chainId,
          proposalId,
        }).toString()}`
      );
    }
  };

  if (!pollDeta && isLoading) {
    return <Loading className="h-screen w-screen !bg-black" />;
  }

  return (
    <>
      <TelegramHeader title={<Countdown initialTime={seconds} />} />
      <div className="pt-telegramHeader bg-black w-screen h-screen overflow-y-auto px-5">
        <div className="flex justify-between items-end pt-3 pb-4 border-b-[1px] border-tertiary">
          <BackBtn />

          <div className="flex flex-col col-5 items-end gap-[6px]">
            <span className="text-[10px] leading-[11px] text-white">
              Total earned points:
            </span>
            <span className="font-pressStart text-secondary tracking-[-1.6] text-[16px] leading-[16px]">
              {pollDeta?.userTotalPoints.toLocaleString() || 0}
            </span>
          </div>
        </div>
        <div className="pt-[17px] pb-[22px]">
          <span className="block text-[22px] font-bold text-center leading-[22px] text-white mb-[18px] font-outfit">
            {pollDeta?.proposalTitle}
          </span>

          {pollDeta?.bannerUrl && (
            <img
              src={pollDeta?.bannerUrl}
              className="w-full rounded-[12px]"
              alt="Banner"
            />
          )}

          <div className="flex flex-row items-center justify-between mt-[18px] mb-[14px]">
            <span className="font-normal text-white text-[13px] leading-[15.6px]">
              Duration:{" "}
              {`${dayjs(pollDeta?.startTime).format("DD MMM YYYY")} - ${dayjs(
                pollDeta?.endTime
              ).format("DD MMM YYYY")}`}
            </span>
            <div className="z-10" onClick={() => setShowShare(true)}>
              <i className="votigram-icon-share text-[28px] text-input-placeholder" />
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            {pollDeta?.rankingList?.map((vote, index) => (
              <VoteItem
                key={`${vote.alias}_${index}`}
                data={vote}
                proposalId={proposalId || ""}
                className="w-full"
                canVote={canVote}
                onVoted={onVoted}
                showBtn
                showPoints={!canVote}
              />
            ))}
          </div>
        </div>
      </div>

      <Drawer
        isVisible={showShare}
        direction="bottom"
        rootClassName="pt-[34px] pb-[44px] px-10 bg-tertiary"
        onClose={() => setShowShare(false)}
        canClose
      >
        <span className="block mb-[31px] text-[18px] font-outfit font-bold leading-[18px] text-center text-white">
          Share
        </span>
        <div className="flex flex-row items-center justify-center gap-[10px]">
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-[48px] h-[48px] rounded-[12px] bg-primary flex items-center justify-center"
              onClick={shareToTelegram}
            >
              <i className="votigram-icon-telegram text-[32px] text-white" />
            </div>
            <span className="mt-3 block text-white text-normal text-[12px] leading-[13.2px]">
              Share to Telegram
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-[48px] h-[48px] rounded-[12px] bg-primary flex items-center justify-center"
              onClick={() => {
                copyToClipboard(generateShareUrl());
                setIsCopied(true);
              }}
            >
              <i className="votigram-icon-web text-[32px] text-white" />
            </div>
            <span className="mt-3 block text-white text-normal text-[12px] leading-[13.2px]">
              {isCopied ? "Copied" : "Copy Link"}
            </span>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default PollDetail;
