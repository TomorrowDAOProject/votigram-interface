
import React, { useState, useEffect, useRef } from "react";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

interface IToggleSlider {
  current?: number;
  items: string[];
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  onChange?: (index: number) => void;
}

const ToggleSlider = ({
  current,
  items = [],
  className,
  itemClassName,
  activeItemClassName,
  onChange,
}: IToggleSlider) => {
  const [activeIndex, setActiveIndex] = useState<number>(current || 0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // Initialize refs array with items count
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onChange?.(index);
  };

  useEffect(() => {
    setActiveIndex(current ?? 0);
  }, [current])
  
  return (
    <div
      ref={ref => (containerRef.current = ref)}
      className={clsx(
        "relative h-full w-full mx-auto bg-tertiary rounded-full flex items-center overflow-hidden",
        className
      )}
    >
      <AnimatePresence>
        <motion.div
          data-testid="selector-bg"
          className={clsx(
            "absolute top-[3px] bg-primary px-[3px] rounded-full h-[22px]",
            activeItemClassName
          )}
          initial={false}
          animate={{
            x: itemRefs.current[activeIndex]?.offsetLeft || 4,
            width: itemRefs.current[activeIndex]?.offsetWidth || "50%",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </AnimatePresence>
      <div className="relative flex w-full h-full px-[4px] z-10">
        {items.map((item, index) => (
          <div
            key={index}
            className={clsx(
              "flex w-1/2 items-center justify-center px-4 cursor-pointer",
              itemClassName
            )}
            onClick={() => handleClick(index)}
            ref={(el) => (itemRefs.current[index] = el)}
          >
            <span
              className={clsx(
                "text-[13px] text-white flex items-center h-full leading-normal",
                {
                  "font-bold": activeIndex === index,
                }
              )}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToggleSlider;
