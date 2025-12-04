"use client";

import { useEffect, useMemo } from "react";

import {
  NetworkEnum,
  SignInDesignEnum,
  TChainId,
} from "@aelf-web-login/wallet-adapter-base";
import { IConfigProps } from "@aelf-web-login/wallet-adapter-bridge";
import { PortkeyAAWallet } from "@aelf-web-login/wallet-adapter-portkey-aa";
import { WebLoginProvider } from "@aelf-web-login/wallet-adapter-react";

import {
  connectServer,
  connectUrl,
  graphqlServer,
  networkType,
  portkeyServer,
  rpcUrlAELF,
  rpcUrlTDVV,
  rpcUrlTDVW,
  TELEGRAM_BOT_ID,
} from "@/config";
import { chainId, projectCode } from "@/constants/app";
import { getReferrerCode } from "@/utils/start-params";

const APP_NAME = "TMRWDAO";

function addBasePath(url: string) {
  if (String(url).startsWith("http")) {
    return url;
  }
  return `${url}`;
}

export default function LoginSDKProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const info: Record<string, string> = {
    networkType: networkType,
    rpcUrlAELF: rpcUrlAELF,
    rpcUrlTDVV: rpcUrlTDVV,
    rpcUrlTDVW: rpcUrlTDVW,
    connectServer: connectServer,
    graphqlServer: graphqlServer,
    portkeyServer: portkeyServer,
    connectUrl: connectUrl,
    curChain: chainId,
  };
  const server = info.portkeyServer;

  const referrerCode = getReferrerCode();

  const didConfig = {
    graphQLUrl: info.graphqlServer,
    connectUrl: addBasePath(connectUrl || ""),
    serviceUrl: server,
    requestDefaults: {
      timeout: networkType === "TESTNET" ? 300000 : 80000,
      baseURL: addBasePath(server || ""),
    },
    socialLogin: {
      Telegram: {
        botId: TELEGRAM_BOT_ID,
      },
    },
    referralInfo: {
      referralCode: referrerCode ?? "",
      projectCode,
    },
  };

  const baseConfig = {
    sideChainId: chainId as TChainId,
    omitTelegramScript: true,
    showVconsole: networkType === "TESTNET",
    networkType: networkType as NetworkEnum,
    chainId: chainId as TChainId,
    keyboard: true,
    noCommonBaseModal: false,
    design: SignInDesignEnum.CryptoDesign,
    enableAcceleration: true,
  };

  const aaWallet = useMemo(() => {
    return new PortkeyAAWallet({
      appName: APP_NAME,
      chainId: chainId as TChainId,
      autoShowUnlock: true,
      noNeedForConfirm: true,
      enableAcceleration: true,
    });
  }, []);
  const wallets = [aaWallet];

  const config: IConfigProps = {
    didConfig,
    baseConfig,
    wallets,
  };

  useEffect(() => {
    aaWallet.setChainId(chainId as TChainId);
  }, [aaWallet]);

  return <WebLoginProvider config={config}>{children}</WebLoginProvider>;
}
