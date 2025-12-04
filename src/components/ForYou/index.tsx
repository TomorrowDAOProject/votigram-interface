import { useEffect, useRef, useState } from "react";

import { useThrottleFn } from "ahooks";
import { motion, PanInfo } from "framer-motion";

import { chainId } from "@/constants/app";
import {
  APP_CATEGORY,
  APP_TYPE,
  DISCOVER_CATEGORY,
} from "@/constants/discover";
import { postWithToken } from "@/hooks/useData";
import { useUserContext } from "@/provider/UserProvider";
import { VoteApp } from "@/types/app";

import ImageCarousel from "../ImageCarousel";
import AppDetail from "./AppDetail";
import AdVideo from "../AdVideo";
import Modal from "../Modal";
import ActionButton from "./ActionButton";
import CheckboxGroup from "../CheckboxGroup";
import Drawer from "../Drawer";
import ReviewComment from "../ReviewComment";
import TelegramHeader from "../TelegramHeader";

interface IForYouType {
  currentForyouPage: number;
  items: VoteApp[];
  fetchForYouData: (alias: string[]) => void;
}

const ForYou = ({
  items,
  fetchForYouData,
  currentForyouPage = 1,
}: IForYouType) => {
  const {
    user: { isNewUser },
    updateUserStatus,
  } = useUserContext();
  const [isInputFocus, setIsInputFocus] = useState(false);
  const currentPage = useRef<number>(currentForyouPage);
  const [forYouItems, setForYouItems] = useState<VoteApp[]>(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShowReviews, setIsShowReviews] = useState(false);
  const [showChoosen, setShowChoosen] = useState(isNewUser);
  const [interests, setInterests] = useState<APP_CATEGORY[]>([]);
  const [currentActiveApp, setCurrentActiveApp] = useState<
    VoteApp | undefined
  >();
  const height = window.innerHeight;

  useEffect(() => {
    if (items && items.length === 0) {
      fetchForYouData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (items) {
      setForYouItems((prev) =>
        currentForyouPage > currentPage.current
          ? [...prev, ...(items || [])]
          : items
      );
    }
  }, [items, currentForyouPage]);

  const handleDragEnd = async (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Check velocity to determine the predominant direction
    const predominantDirection =
      Math.abs(info.velocity.y) > Math.abs(info.velocity.x);
    if (predominantDirection) {
      const direction = info.offset.y > 0 ? -1 : 1;
      let nextIndex = currentIndex + direction;

      // Ensure nextIndex is within bounds
      if (nextIndex < 0) {
        nextIndex = 0;
      } else if (nextIndex >= forYouItems.length) {
        nextIndex = forYouItems.length - 1;
      }

      setCurrentIndex(nextIndex);
      // Load more videos when reaching the second-to-last item
      if (nextIndex >= forYouItems.length - 5) {
        await fetchForYouData(forYouItems.slice(-10).map((item) => item.alias));
      }
    }
  };

  const updateLikeAppClick = (likesCount: number) => {
    const list = [...forYouItems];
    list[currentIndex].totalLikes =
      (list[currentIndex].totalLikes || 0) + likesCount;
    setForYouItems(list);
  };

  const updateShareAppClick = (alias: string) => {
    postWithToken("/api/app/user/share-app", {
      chainId,
      alias,
    });
    const list = [...forYouItems];
    list[currentIndex].totalShares = (list[currentIndex].totalShares || 0) + 1;
    setForYouItems(list);
  };

  const updateOpenAppClick = (alias: string, url: string) => {
    postWithToken("/api/app/user/open-app", {
      chainId,
      alias,
    });
    window.open(url)
  };

  const updateReviewClick = (item: VoteApp) => {
    setIsShowReviews(true);
    setCurrentActiveApp(item);
  };

  const onDrawerClose = () => {
    setIsShowReviews(false);
  };

  const onComment = (totalComments: number) => {
    const list = [...forYouItems];
    list[currentIndex].totalComments = totalComments;
    setForYouItems(list);
  };

  const { run: chooseInterest } = useThrottleFn(
    async () => {
      setShowChoosen(false);
      updateUserStatus(false);
      try {
        await postWithToken("/api/app/discover/choose", {
          chainId,
          choices: interests,
        });
      } catch (error) {
        console.error(error);
      }
    },
    { wait: 700 }
  );

  return (
    <>
      <TelegramHeader title="For You" />
      <div className="h-screen overflow-hidden bg-discover-background pt-telegramHeader bg-black">
        {forYouItems?.length > 0 && (
          <motion.div
            animate={{ y: -currentIndex * height }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{
              top: -((forYouItems.length - 1) * height),
              bottom: 0,
            }}
            dragDirectionLock
            onDragEnd={handleDragEnd}
            className="relative"
            whileDrag={{
              opacity: 0.5,
            }}
          >
            {forYouItems.map((item, index) => (
              <div
                key={index}
                className="h-screen flex flex-col relative items-center"
              >
                {item.appType === APP_TYPE.AD && index === currentIndex ? (
                  <AdVideo src={item.url} />
                ) : (
                  <>
                    <ImageCarousel
                      className="mt-[25px]"
                      items={item.screenshots}
                    />
                    <ActionButton
                      item={item}
                      totalLikes={item.totalLikes || 0}
                      totalComments={item.totalComments || 0}
                      totalShares={item.totalShares || 0}
                      updateLikeAppClick={updateLikeAppClick}
                      updateOpenAppClick={updateShareAppClick}
                      updateReviewClick={updateReviewClick}
                    />
                  </>
                )}
                <AppDetail item={item} updateOpenAppClick={updateOpenAppClick} />
              </div>
            ))}
          </motion.div>
        )}
        <Modal
          isVisible={showChoosen}
          rootClassName="px-[29px] pt-[45px] pb-[30px]"
        >
          <span className="block text-[20px] font-bold leading-[20px] font-outfit text-white">
            Select Your Areas of Interest
          </span>
          <span className="block mt-[8px] mb-[24px] text-[9px] leading-[10px]">
            Your preferences will help us create a journey unique to you.
          </span>

          <CheckboxGroup
            options={DISCOVER_CATEGORY.slice(1)}
            onChange={setInterests}
          />

          <button
            className="mt-[24px] bg-primary text-white text-[14px] leading-[14px] font-outfit font-bold py-[10px] w-full rounded-[24px] mt-[24px] mb-[16px]"
            onClick={chooseInterest}
          >
            Let's Begin
          </button>
        </Modal>
        <Drawer
          isVisible={isShowReviews}
          onClose={onDrawerClose}
          direction="bottom"
          rootClassName={
            isInputFocus &&
            (window.Telegram.WebApp?.platform === "ios" ||
              window.Telegram.WebApp?.platform === "android")
              ? "h-2/5"
              : "h-2/3"
          }
        >
          <ReviewComment
            onComment={onComment}
            onDrawerClose={onDrawerClose}
            currentActiveApp={currentActiveApp}
            setIsInputFocus={setIsInputFocus}
          />
        </Drawer>
      </div>
    </>
  );
};

export default ForYou;
