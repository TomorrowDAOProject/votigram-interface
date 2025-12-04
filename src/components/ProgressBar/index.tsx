import clsx from "clsx";

interface IProgressBarProps {
  className?: string;
  width: number;
  progress: number;
  barClassName?: string;
}

const ProgressBar = ({
  className,
  width,
  progress = 0,
  barClassName,
}: IProgressBarProps) => {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[8px] transition-[width] duration-300 ease-in-out",
        className
      )}
      style={{ width: `${progress > 100 ? 100 : progress}%` }}
    >
      <div
        className={clsx(
          "h-[9px] rounded-[8px] bg-gradient-to-r from-lime-primary to-lime-green",
          barClassName
        )}
        style={{ width: `${width}px` }}
      />
    </div>
  );
};

export default ProgressBar;
