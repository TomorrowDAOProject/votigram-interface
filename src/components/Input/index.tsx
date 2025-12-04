import React, { useEffect, useState } from "react";

import clsx from "clsx";


interface IInputProps {
  value?: string;
  maxLength?: number;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  showClearBtn?: boolean;
  onChange?: (value: string) => void;
}

const Input = ({
  value: parentValue,
  defaultValue,
  placeholder,
  className,
  maxLength,
  showClearBtn,
  onChange,
}: IInputProps) => {
  const [value, setValue] = useState(defaultValue || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value || '');
    onChange?.(e.target.value || '');
  };

  const clearInput = () => {
    setValue("");
    onChange?.('');
  };

  useEffect(() => {
    setValue(parentValue || "");
  }, [parentValue]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        className={clsx(
          "w-full border border-input rounded-[10px] pl-[14px] pr-[37px] py-[12px] bg-transparent text-white text-[14px] font-normal leading-[19px] placeholder-input-placeholder focus:outline-none focus:border-input-placeholder transition duration-300 ease-in-out",
          className
        )}
        placeholder={placeholder || "Please Enter..."}
      />
      {value && showClearBtn && (
        <button
          type="button"
          onClick={clearInput}
          className="absolute top-1/2 right-[14px] -translate-y-1/2 p-0 m-0 w-[15px] h-[15px] flex items-center justify-center bg-app-icon-border text-tertiary rounded-[50%] flex-none"
        >
          <i className="votigram-icon-cancel text-[8px] leading-[8px] text-tertiary" />
        </button>
      )}
    </div>
  );
};

export default Input;
