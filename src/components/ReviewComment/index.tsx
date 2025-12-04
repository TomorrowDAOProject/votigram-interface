import React, { useEffect, useState } from "react";

import { useThrottleFn } from "ahooks";
import clsx from "clsx";

import { chainId } from "@/constants/app";
import useData, { postWithToken } from "@/hooks/useData";
import { VoteApp } from "@/types/app";
import { Comment } from "@/types/comment";

import Loading from "../Loading";
import ReviewList from "../ReviewList";
import Textarea from "../Textarea";

interface IReviewDrawerProps {
  onComment?(totalComments: number): void;
  onDrawerClose: () => void;
  currentActiveApp: VoteApp | undefined;
  setIsInputFocus: (val: boolean) => void;
}

const PAGE_SIZE = 20;

const ReviewComment = ({
  onComment,
  onDrawerClose,
  currentActiveApp,
  setIsInputFocus,
}: IReviewDrawerProps) => {
  const [totalCount, setTotalCount] = useState(0);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, isLoading } = useData(
    `/api/app/discussion/comment-list?${new URLSearchParams({
      chainId,
      skipCount: (pageIndex * PAGE_SIZE).toString(),
      maxResultCount: PAGE_SIZE.toString(),
      alias: currentActiveApp?.alias || "",
    }).toString()}`
  );

  useEffect(() => {
    if (data) {
      setCommentList((prev) => [...prev, ...data.items]);
      setTotalCount(data.totalCount || 0);
      onComment?.(data.totalCount);
    }

    return () => {
      setCommentList([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { run: onCommentSubmit } = useThrottleFn(
    async (e) => {
      try {
        e.preventDefault();
        const { data } = await postWithToken(
          "/api/app/discussion/new-comment",
          {
            chainId,
            alias: currentActiveApp?.alias,
            comment,
          }
        );
        if (data?.success) {
          setCommentList((prev) => [data?.comment, ...prev]);
          setComment("");
          onComment?.(totalCount + 1);
        }
      } catch (error) {
        console.error(error);
      }
    },
    { wait: 700 }
  );

  const onCommentChange = (value: string) => {
    setComment(value);
  };

  return (
    <>
      <div className="relative w-full flex items-center justify-center py-[17px] px-[19px]">
        <span className="font-outfit text-[16px] leading-[1] font-bold text-white">
          Reviews
        </span>
        <i
          className="votigram-icon-cancel text-[14px] text-white absolute top-[15px] right-[18px] cursor-pointer"
          onClick={onDrawerClose}
        />
      </div>
      <div className="pt-[4px] pb-[75px] h-full overflow-scroll">
        <ReviewList
          hasMore={data?.hasMore || false}
          isLoading={isLoading}
          dataSource={commentList}
          loadData={() => setPageIndex((pageIndex) => pageIndex + 1)}
          emptyText="Write the first review!"
          rootClassname="px-5"
          renderLoading={() => isLoading && <Loading iconClassName="w-4 h-4" />}
        />
      </div>
      <div className="fixed bottom-0 bg-black left-0 w-full flex flex-row gap-2 py-[17px] px-5 border-t-[1px] border-tertiary items-end border-solid">
        <Textarea
          value={comment}
          onChange={onCommentChange}
          placeholder="Add a comment"
          onFocus={() => {
            setIsInputFocus(true);
          }}
          onBlur={() => {
            setIsInputFocus(false);
          }}
        />
        <button
          type="button"
          className="bg-tertiary w-[40px] h-[40px] flex justify-center items-center p-[8px] rounded-[20px] shrink-0"
          disabled={comment.trim().length === 0}
          onClick={onCommentSubmit}
        >
          <i
            className={clsx(
              "votigram-icon-send text-[24px]",
              comment.length > 0 ? "text-primary" : "text-input-placeholder"
            )}
          />
        </button>
      </div>
    </>
  );
};

export default ReviewComment;
