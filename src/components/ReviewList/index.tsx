import React, { useCallback, useEffect, useRef } from "react";

import clsx from "clsx";

import { Comment } from "@/types/comment";

import Item from "./components/Item";

interface IReviewListProps {
  isLoading?: boolean;
  dataSource: Comment[];
  height?: number | string;
  loadData?: () => void;
  hasMore?: boolean;
  emptyText?: string;
  noMoreText?: string;
  threshold?: number;
  rootClassname?: string;
  itemClassname?: string;
  renderLoading?: () => React.ReactNode;
}

const ReviewList: React.FC<IReviewListProps> = ({
  isLoading,
  dataSource: items,
  threshold = 50,
  loadData,
  hasMore,
  emptyText,
  noMoreText,
  rootClassname,
  itemClassname,
  renderLoading,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hasMore) {
      loadData?.();
    }
  }, [hasMore, loadData]);

  const handleScroll = useCallback(() => {
    const list = listRef.current;
    if (
      list &&
      list.scrollHeight - list.scrollTop - list.clientHeight < threshold &&
      hasMore
    ) {
      loadData?.();
    }
  }, [hasMore, loadData, threshold]);

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (list) {
        list.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div
      ref={listRef}
      role="list"
      className="overflow-x-hidden overflow-y-auto h-[calc(100%-10px)]"
    >
      {!isLoading && items.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <span className="font-normal text-[13px] text-white leading-[1.2]">
            {emptyText || "No data"}
          </span>
        </div>
      )}
      <div className={clsx({ "min-h-full": items.length > 0 }, rootClassname)}>
        {items.map((item, index) => (
          <Item
            data={item}
            key={`${item?.id}-${index}`}
            className={itemClassname}
          />
        ))}
        {items.length > 0 && !hasMore && (
          <div className="py-[20px] flex items-center justify-center">
            <span className="font-normal text-[13px] text-white leading-[1.2]">
              {noMoreText || ""}
            </span>
          </div>
        )}
        {renderLoading?.()}
      </div>
    </div>
  );
};

export default ReviewList;
