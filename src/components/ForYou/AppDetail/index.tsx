import React, { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import { DISCOVERY_CATEGORY_MAP } from "@/constants/discover";
import { VoteApp } from "@/types/app";

const containerVariants = {
  hidden: {
    paddingTop: 0,
  },
  visible: {
    paddingTop: 120,
    background: "linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 40%)",
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', marginBottom: 14, maxHeight: 500 },
};

interface IAppDetailProps {
  item: VoteApp;
  updateOpenAppClick(alias: string, url: string): void;
}

const AppDetail = ({ item, updateOpenAppClick }: IAppDetailProps) => {
  const [isExpand, setIsExpand] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsExpand(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  const onOpenAppClick = () => {
    updateOpenAppClick(item.alias, item.url);
  };

  return (
    <motion.div
      ref={containerRef}
      initial="visible"
      animate={isExpand ? "visible" : "hidden"}
      variants={containerVariants}
      transition={{
        type: "spring",
        stiffness: 900,
        damping: 100,
      }}
      className="w-[100vw] pt-0 flex flex-col absolute left-0 bottom-telegramHeader h-max z-[100] pl-5 pr-[20px]"
      onClick={() => {
        setIsExpand(!isExpand);
      }}
    >
      <div className="flex gap-2 mb-[14px] text-white">
        <img
          src={item.icon}
          className="h-[48px] aspect-square rounded-[8px] border-app-icon-border border-[1px]"
          alt=""
        />
        <div className="flex flex-col gap-[5px] justify-center">
          <span className="font-outfit font-bold text-[16px] leading-[16px] text-white">
            {item.title}
          </span>
          <span className="text-[11px] leading-[13px] text-white">
            {item.description}
          </span>
        </div>
      </div>
      <motion.div
        initial="hidden"
        animate={isExpand ? "visible" : "hidden"}
        variants={descriptionVariants}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20,
        }}
        className="flex w-full text-[13px] leading-[15px] text-white"
      >
        {item.longDescription}
      </motion.div>

      <div className="flex pb-[90px] z-[10]">
        <div className="flex flex-[2] flex-=wrap gap-[6px] items-center">
          {item.categories?.map((category) => (
            <div
              key={category}
              className="flex item h-[22px] border-pill-border border-[1px] rounded-full"
            >
              <button className="w-max h-[22px] font-questrial px-2 text-[12px] leading-[13px] text-white">
                {DISCOVERY_CATEGORY_MAP?.[category] || ""}
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-1 justify-end items-center">
          <button
            onClick={onOpenAppClick}
            className="flex justify-center items-center w-[98px] bg-primary font-outfit font-bold text-[14px] leading-[14px] py-[10px] rounded-[24px] text-white"
          >
            Open
            <i className="votigram-icon-arrow-ninety-degrees text-[14px] ml-[5px]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AppDetail;
