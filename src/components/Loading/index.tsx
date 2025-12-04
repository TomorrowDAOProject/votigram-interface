import React from "react";

import clsx from "clsx";


interface ILoadingProps {
  iconClassName?: string;
  className?: string;
  color?: string;
}

// Loading component
const Loading: React.FC<ILoadingProps> = ({ className, iconClassName }) => {
  return (
    <div
      data-testid="loading-testid"
      className={clsx(
        "flex justify-center items-center bg-black/40",
        className
      )}
    >
      <div
        data-testid="loading-icon-testid"
        className={clsx(
          "animate-spin rounded-[50%] h-8 w-8 border-t-2 border-b-2 border-primary",
          iconClassName
        )}
      ></div>
    </div>
  );
};

export default Loading;
