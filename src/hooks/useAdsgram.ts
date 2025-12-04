
/**
 * Check Typescript section
 * and use your path to adsgram types
 */
import { useCallback, useEffect, useRef } from "react";

import sha256 from "crypto-js/sha256";
import dayjs from "dayjs";

import { chainId } from "@/constants/app";
import type { AdController, ShowPromiseResult } from "@/types/adsgram";

import { postWithToken } from "./useData";



interface useAdsgramParams {
  blockId: string;
  onReward: (newPoints: number) => void;
  onError: (result: ShowPromiseResult) => void;
  onSkip: () => void;
  onFinish?: (timeStamp?: number, signature?: string) => void;
}

export function useAdsgram({
  blockId,
  onReward,
  onError,
  onSkip,
  onFinish,
}: useAdsgramParams): () => Promise<void> {
  const AdControllerRef = useRef<AdController | undefined>(undefined);

  useEffect(() => {
    AdControllerRef.current = window.Adsgram?.init({
      blockId,
    });

    AdControllerRef.current?.addEventListener("onSkip", () => {
      onSkip?.();
    });

    return () => {
      AdControllerRef.current?.removeEventListener("onSkip", () => {
        onSkip?.();
      });
    };
  }, [blockId]);

  return useCallback(async () => {
    if (AdControllerRef.current) {
      AdControllerRef.current
        .show()
        .then(async (result) => {
          if (result?.done) {
            const timestamp = dayjs().valueOf();
            const hash = sha256(`${import.meta.env.VITE_HASH}-${timestamp}`);

            if (onFinish) {
              onFinish(timestamp, hash.toString());
            } else {
              const result = await postWithToken("/api/app/user/view-ad", {
                chainId,
                timeStamp: timestamp,
                signature: hash.toString(),
              });

              onReward(result.data);
            }
          }
        })
        .catch((result: ShowPromiseResult) => {
          // user get error during playing ad or skip ad
          onError?.(result);
        });
    } else {
      onError?.({
        error: true,
        done: false,
        state: "load",
        description: "Adsgram script not loaded",
      });
    }
  }, [onError, onReward]);
}
