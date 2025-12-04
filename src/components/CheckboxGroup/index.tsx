import { useState } from "react";

import { APP_CATEGORY } from "@/constants/discover";

type ICheckboxOption = {
  value: APP_CATEGORY;
  label: string;
};

interface ICheckboxProps {
  options: ICheckboxOption[];
  onChange: (values: APP_CATEGORY[]) => void;
}

const CheckboxGroup = ({ options, onChange }: ICheckboxProps) => {
  const [selectedValues, setSelectedValues] = useState<APP_CATEGORY[]>([]);

  const handleToggle = (value: APP_CATEGORY) => {
    const currentIndex = selectedValues.indexOf(value);
    const newSelectedValues = [...selectedValues];

    if (currentIndex === -1) {
      newSelectedValues.push(value);
    } else {
      newSelectedValues.splice(currentIndex, 1);
    }

    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  return (
    <div className="grid grid-cols-2 gap-x-[9px] gap-y-[8px]">
      {options.map((option) => (
        <div
          key={option.value}
          className={`rounded-[8px] bg-tertiary border-[1px] border-solid text-[13px] font-normal text-center py-[10px] text-white leading-[13px] cursor-pointer ${
            selectedValues.includes(option.value)
              ? "border-secondary"
              : "border-tertiary"
          }`}
          onClick={() => handleToggle(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroup;
