
import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface CountdownProps {
  initialTime: number;
  onFinish?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ initialTime, onFinish }) => {
  const [remainingTime, setRemainingTime] = useState<number>(initialTime);

  useEffect(() => {
    if (remainingTime <= 0) {
      onFinish?.();
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinish, remainingTime]);

  useEffect(() => {
    setRemainingTime(initialTime);
  }, [initialTime]);

  const formatTime = (time: number): string => {
    const durationObj = dayjs.duration(time, "seconds");
    const days = Math.floor(durationObj.asDays());
    const hours = durationObj.hours();
    const minutes = durationObj.minutes();

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <span className="font-pressStart text-[10px] leading-[10px] text-white">
      {formatTime(remainingTime)}
    </span>
  );
};

export default Countdown;
