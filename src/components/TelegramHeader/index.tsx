import React, { ReactNode } from "react";

import "./index.css";
import clsx from "clsx";

interface ITelegramHeaderProps {
  className?: string;
  title?: ReactNode;
}

const TelegramHeader = ({ title, className }: ITelegramHeaderProps) => {
  return (
    <div className={clsx("telegram-header-container", className)}>
      {title && (
        <span className="font-outfit text-[18px] leading-[18px] font-bold text-white">
          {title}
        </span>
      )}
    </div>
  );
};

export default TelegramHeader;
