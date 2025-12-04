import clsx from "clsx";

interface ITagProps {
  className?: string;
  text: string;
  textClassName?: string;
}

const Tag = ({ text, className, textClassName }: ITagProps) => {
  return (
    <div className={clsx("absolute w-[58px] h-[58px]", className)}>
      <img
        className="w-[58px] h-[58px] object-contain"
        src="https://cdn.tmrwdao.com/votigram/assets/imgs/01259C70892E.webp"
        alt="Tag"
      />
      <span
        className={clsx(
          "absolute top-[16px] right-[-5px] inline-block w-[50px] text-[11px] font-outfit font-bold leading-[11px] text-center text-white overflow-hidden whitespace-nowrap text-ellipsis rotate-45",
          textClassName
        )}
      >
        {text}
      </span>
    </div>
  );
};

export default Tag;
