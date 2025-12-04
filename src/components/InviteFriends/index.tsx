import { useEffect, useMemo, useState } from "react";

import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import AElf from "aelf-sdk";
import { useRequest } from "ahooks";
import clsx from "clsx";
import { QRCode } from "react-qrcode-logo";
import { useCopyToClipboard } from "react-use";

import { connectUrl, portkeyServer, TgLink } from "@/config";
import { chainId, projectCode } from "@/constants/app";
import { InviteDetail, IStartAppParams } from "@/types/task";
import { stringifyStartAppParams } from "@/utils/start-params";

import Drawer from "../Drawer";
import Loading from "../Loading";
import { getShareText } from "@/pageComponents/PollDetail/utils";

interface IInviteFriendsStatusProps {
  data?: InviteDetail;
  isShowDrawer?: boolean;
  onClickInvite?(): void;
}

const InviteFriendsStatus = ({
  data,
  isShowDrawer,
  onClickInvite,
}: IInviteFriendsStatusProps) => {
  const [, setCopied] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const { walletInfo: wallet, isConnected } = useConnectWallet();
  const progress = useMemo(() => {
    if (!data?.totalInvitesNeeded) return 0;
    const percentage =
      ((data?.votigramVoteAll || 0) / data?.totalInvitesNeeded) * 100;
    return percentage < 100 ? percentage : 100;
  }, [data]);

  const handleCopy = () => {
    setCopied(tgLinkWithCode);
    setIsCopied(true);
  };

  const {
    run: fetchReferralCode,
    loading,
    cancel,
  } = useRequest(
    async () => {
      const timestamp = Date.now();
      const {
        portkeyInfo: { walletInfo },
        publicKey,
      } = wallet?.extraInfo || {};
      const message = Buffer.from(
        `${walletInfo?.address}-${timestamp}`
      ).toString("hex");
      const signature = AElf.wallet
        .sign(message, walletInfo?.keyPair)
        .toString("hex");
      const requestObject = {
        grant_type: "signature",
        client_id: "CAServer_App",
        scope: "CAServer",
        signature: signature,
        pubkey: publicKey,
        timestamp: timestamp.toString(),
        ca_hash: wallet?.extraInfo?.portkeyInfo?.caInfo?.caHash,
        chain_id: chainId,
      };
      const portKeyRes = await fetch(connectUrl + "/connect/token", {
        method: "POST",
        body: new URLSearchParams(requestObject).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const portKeyResObj = await portKeyRes.json();
      if (portKeyRes?.ok && portKeyResObj?.access_token) {
        const token = portKeyResObj.access_token;
        const response = await fetch(
          portkeyServer +
            `/api/app/growth/shortLink?projectCode=${projectCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resObj = await response.json();
        if (resObj?.userGrowthInfo?.inviteCode) {
          setInviteCode(resObj?.userGrowthInfo?.inviteCode);
          cancel();
        }
      }
    },
    {
      manual: true,
      pollingInterval: 1500,
    }
  );

  const startAppParams: IStartAppParams = {
    referralCode: inviteCode,
  };
  const tgLinkWithCode =
    TgLink +
    (inviteCode ? `?startapp=${stringifyStartAppParams(startAppParams)}` : "");

  const shareToTelegram = () => {
    if (window?.Telegram?.WebApp?.openTelegramLink) {
      const url = encodeURIComponent(tgLinkWithCode);
      const shareText = encodeURIComponent(
        getShareText(
          `Join Votigram, and Discover more fun Telegram apps with me! 🌐`,
          `Vote Now and Earn points for USDT airdrop! 🎉`
        )
      );
      window?.Telegram?.WebApp?.openTelegramLink(
        `https://t.me/share/url?url=${url}&text=${shareText}`
      );
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchReferralCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  return (
    <>
      <div className="p-[1px] rounded-[18px] w-full bg-gradient-to-r from-lime-primary to-lime-green">
        <div className="px-5 pt-[22px] pb-4 bg-black rounded-[18px]">
          <div className="flex items-start justify-between mb-[14px]">
            <span className="whitespace-pre-wrap -tracking-[0.5px] font-bold font-outfit text-[28px] leading-[28px] text-white">
              {"Invite friends\n& get points!"}
            </span>
            <span className="mt-2 text-lg font-normal text-[13px] leading-[15.6px] text-lime-green">
              +{data?.pointsFirstReferralVote?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mb-[14px] gap-5">
            <div className="flex-1 h-[10px] shrink-0 bg-white rounded-[5px]">
              <div
                className={clsx(
                  "h-[10px] bg-gradient-to-r from-lime-green to-lime-primary rounded-[5px]"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-outfit font-bold text-[14px] leading-[14px] text-white shrink-0">
              {data?.votigramVoteAll || 0}/{data?.totalInvitesNeeded || 20}
            </span>
          </div>
          <button
            type="button"
            onClick={onClickInvite}
            className="w-full  bg-primary rounded-[24px] text-[14px] font-bold py-[10px] font-outfit leading-[14px] text-white"
          >
            Invite friends
          </button>
        </div>
      </div>
      <Drawer
        isVisible={isShowDrawer}
        direction="bottom"
        rootClassName="pt-6 pb-[30px] px-5 bg-tertiary"
        onClose={onClickInvite}
        canClose
      >
        <span className="block mb-[33px] text-[18px] font-outfit font-bold leading-[18px] text-center text-white">
          Share
        </span>
        <div className="flex flex-col items-center justify-center gap-[15px]">
          {loading ? (
            <Loading className="h=[120px]" />
          ) : (
            <>
              <div className="w-[160px] h-[160px] overflow-hidden rounded-[12px]">
                <QRCode
                  value={tgLinkWithCode}
                  size={136}
                  quietZone={12}
                  logoImage="https://cdn.tmrwdao.com/votigram/assets/imgs/5F0B6F152703.webp"
                  logoWidth={28}
                  logoHeight={28}
                  ecLevel="H"
                  qrStyle="squares"
                  eyeRadius={{ outer: 4, inner: 1 }}
                />
              </div>

              <div className="flex flex-col items-start justify-center gap-[6px] p-3 bg-black rounded-[12px] w-full">
                <span className="font-outfit font-bold text-[14px] leading-[14px] text-white">
                  Referral Link
                </span>
                <div className="flex items-end justify-between w-full text-input-placeholder">
                  <span className="font-normal text-[14px] leading-[16.8px] max-w-[92%] break-words flex-shrink flex-wrap">
                    {tgLinkWithCode}
                  </span>

                  {isCopied ? (
                    <span className="font-normal text-[14px] leading-[20px]">
                      Copied
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="w-[20px] h-[20px] leading-[20px]"
                      onClick={handleCopy}
                    >
                      <i className="votigram-icon-duplicate text-[20px]" />
                    </button>
                  )}
                </div>
              </div>

              <button
                className="w-full h-[40px] bg-primary text-white font-bold text-[14px] font-outfit rounded-[24px]"
                type="button"
                onClick={shareToTelegram}
              >
                Invite friends
              </button>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default InviteFriendsStatus;
