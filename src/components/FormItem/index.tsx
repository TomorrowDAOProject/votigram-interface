import React from "react";

import clsx from "clsx";


interface IFormItemProps {
  label: string;
  className?: string;
  desc?: string;
  children: React.ReactNode;
  errorText?: string;
  required?: boolean;
}

// FormItem component
const FormItem: React.FC<IFormItemProps> = ({
  label,
  desc,
  className,
  children,
  errorText,
  required,
}) => {
  return (
    <div data-testid="form-item-container" className={clsx("py-3", className)}>
      <div className="mb-[12px] flex flex-row items-center justify-between w-full">
        <span className="inline-block relative pr-[8px] font-outfit font-bold text-[16px] text-white leading-[16px]">
          {label}
          {required && <span className="absolute top-0 right-0">*</span>}
        </span>
        {desc && (
          <span className="text-[12px] font-normal leading-[13.2px] text-input-placeholder">
            {desc}
          </span>
        )}
      </div>
      {children}
      {errorText && (
        <span className="mt-[4px] block text-[12px] font-normal leading-[13.2px] text-danger">
          *{errorText}
        </span>
      )}
    </div>
  );
};

export default FormItem;
