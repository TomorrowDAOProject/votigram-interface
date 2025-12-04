import React, { useState, useEffect } from "react";

interface IPointsCounterProps {
  start?: number;
  end: number;
  duration: number;
}

const PointsCounter: React.FC<IPointsCounterProps> = ({
  start = 0,
  end,
  duration,
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = timestamp - startTime;
      const progressFraction = Math.min(progress / duration, 1);

      const currentNumber = Math.floor(
        progressFraction * (end - start) + start
      );

      setCount(currentNumber);

      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);

    return () => {
      startTime = null;
    };
  }, [start, end, duration]);

  return (
    <span className="font-pressStart font-bold text-[16px] leading-[16px] tracking-[-1.6px] text-white">
      {count.toLocaleString()}
    </span>
  );
};

export default PointsCounter;
