import React from "react";

import clsx from "clsx";

import { chainId } from "@/constants/app";
import { Comment } from "@/types/comment";
import { timeAgo } from "@/utils/time";

interface ItemProps {
  data: Comment;
  className?: string;
  onClick?: (item: Comment) => void;
}

const Item = ({ data, className, onClick }: ItemProps) => {
  return (
    <div
      className={clsx(
        "flex flex-row items-start gap-[19px] py-[9px] max-w-full",
        className
      )}
      onClick={() => data && onClick?.(data)}
    >
      {data?.commenterPhoto ? (
        <img
          src={data.commenterPhoto}
          alt="Avatar"
          className="w-[29px] h-[29px] rounded-[47.5px] bg-tertiary shrink-0 object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-[29px] h-[29px] rounded-[47.5px] bg-gradient-to-r from-lime-green to-lime-primary">
          <span className="font-bold font-outfit text-[14px] text-normal text-white">
            {data?.commenterFirstName?.slice(0, 1).toUpperCase() ||
              data?.commenter?.slice(0, 1).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex flex-col flex-1 shrink-0 max-w-[calc(100%-48px)]">
        <div className="flex flex-row gap-[5px]">
          <span className="font-normal text-[11px] text-white leading-[13.2px] truncate flex-1">
            {data?.commenterFirstName || `ELF_${data?.commenter}_${chainId}`}
          </span>
          {data?.createTime && (
            <span className="font-normal text-[11px] text-input-placeholder leading-[13.2px] w-max">
              {timeAgo(data.createTime)}
            </span>
          )}
        </div>
        <div className="mt-[5px] font-normal text-[14px] text-white leading-[16.8px] break-words whitespace-normal">
          {data?.comment}
        </div>
      </div>
    </div>
  );
};

export default Item;
