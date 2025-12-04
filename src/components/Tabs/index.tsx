
import React, { useState, useEffect, useRef } from "react";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import { TabItem } from "./type";

interface ITabProps {
  defaultValue?: number;
  options: TabItem[];
  className?: string;
  tabClassName?: string;
  onChange?: (value: number) => void;
}

const Tabs = ({
  defaultValue,
  options = [],
  className,
  tabClassName,
  onChange,
}: ITabProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(defaultValue || 0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [defaultX, setDefaultX] = useState(0);

  useEffect(() => {
    // Initialize refs array with items count
    itemRefs.current = itemRefs.current.slice(0, options.length);
  }, [options.length]);

  const handleClick = (value: number, index: number) => {
    setActiveIndex(index);
    onChange?.(value);
  };

  useEffect(() => {
    if (containerRef.current && defaultValue !== undefined) {
      const currentIndex = options.findIndex((item) => item.value === defaultValue);
      setActiveIndex(currentIndex === -1 ? 0 : currentIndex)
      setDefaultX(containerRef.current.clientWidth / options.length * currentIndex);
    }
  }, [defaultValue, options]);

  return (
    <div
      ref={ref => (containerRef.current = ref)}
      className={clsx(
        "relative h-full w-full mx-auto flex items-center overflow-hidden pt-[4px] pb-[8px] rounded-none bg-transparent border-b-[2px] border-tertiary",
        className
      )}
    >
      <AnimatePresence>
        <motion.div
          data-testid="selector-bg"
          className="absolute bg-primary top-auto bottom-0 h-[2px] rounded-none"
          initial={false}
          animate={{
            x: itemRefs.current[activeIndex]?.offsetLeft ?? defaultX,
            width: itemRefs.current[activeIndex]?.offsetWidth || `${(100 / options.length).toFixed(2)}%`,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </AnimatePresence>
      <div className="relative flex w-full h-full z-10">
        {options.map((item, index) => (
          <div
            key={index}
            className={clsx(
              "flex w-1/2 items-center justify-center px-4 cursor-pointer",
              tabClassName
            )}
            onClick={() => handleClick(item.value, index)}
            ref={(el) => (itemRefs.current[index] = el)}
          >
            <span className="text-[13px] text-white flex items-center h-full font-bold text-[16px] leading-[16px] font-outfit">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
