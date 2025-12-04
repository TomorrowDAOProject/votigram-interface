/* eslint-disable @typescript-eslint/no-explicit-any */
import AElf from "aelf-sdk";

import { rpcUrlAELF, rpcUrlTDVV, rpcUrlTDVW } from "@/config";
import { SupportedELFChainId } from "@/constants/app";
import { SECONDS_60 } from "@/constants/time";

import { sleep } from "./time";

const getAElf = (rpcUrl?: string) => {
  const rpc = rpcUrl || "";
  const httpProviders: any = {};

  if (!httpProviders[rpc]) {
    httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  }
  return httpProviders[rpc];
};

const getRpcUrls = () => {
  return {
    [SupportedELFChainId.MAIN_NET]: rpcUrlAELF,
    [SupportedELFChainId.TDVV_NET]: rpcUrlTDVV,
    [SupportedELFChainId.TDVW_NET]: rpcUrlTDVW,
  };
};
type ITxResultProps = {
  TransactionId: string;
  chainId: Chain;
  rePendingEnd?: number;
  reNotexistedCount?: number;
  reGetCount?: number;
};
async function getTxResultRetry({
  TransactionId,
  chainId,
  reGetCount = 10,
  rePendingEnd,
  reNotexistedCount = 10,
}: ITxResultProps): Promise<any> {
  try {
    const rpcUrl = getRpcUrls()[chainId];
    const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
    if (txResult.error && txResult.errorMessage) {
      throw Error(
        txResult.errorMessage.message || txResult.errorMessage.Message
      );
    }

    if (!txResult) {
      if (reGetCount > 1) {
        await sleep(500);
        reGetCount--;
        return getTxResultRetry({
          TransactionId,
          chainId,
          rePendingEnd,
          reNotexistedCount,
          reGetCount,
        });
      }

      throw Error(
        `get transaction result failed. transaction id: ${TransactionId}`
      );
    }

    if (txResult.Status.toLowerCase() === "pending") {
      const current = new Date().getTime();
      if (rePendingEnd && rePendingEnd <= current) {
        throw Error(`transaction ${TransactionId} is still pending`);
      }
      await sleep(1000);
      const pendingEnd: number = rePendingEnd || current + SECONDS_60;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd: pendingEnd,
        reNotexistedCount,
        reGetCount,
      });
    }

    if (
      txResult.Status.toLowerCase() === "notexisted" &&
      reNotexistedCount > 1
    ) {
      await sleep(1000);
      reNotexistedCount--;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd,
        reNotexistedCount,
        reGetCount,
      });
    }

    if (txResult.Status.toLowerCase() === "mined") {
      return { TransactionId, txResult };
    }
    throw Error(
      `can not get transaction status, transaction id: ${TransactionId}`
    );
  } catch (error) {
    console.error("=====getTxResult error", error);
    if (reGetCount > 1) {
      await sleep(1000);
      reGetCount--;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd,
        reNotexistedCount,
        reGetCount,
      });
    }
    throw Error("get transaction result error, Please try again later.");
  }
}

export async function getTxResult(
  TransactionId: string,
  chainId: Chain
): Promise<any> {
  return getTxResultRetry({ TransactionId, chainId });
}
