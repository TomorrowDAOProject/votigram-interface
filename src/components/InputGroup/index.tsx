import React, { useEffect, useState } from "react";

import Input from "../Input";
import Upload from "../Upload";
import { VoteOption } from "./type";

interface IInputGroupProps {
  value?: VoteOption[];
  defaultValues?: VoteOption[];
  onChange?: (options: VoteOption[]) => void;
}

const InputGroup: React.FC<IInputGroupProps> = ({ value, defaultValues, onChange }) => {
  const [options, setOptions] = useState<VoteOption[]>(value || defaultValues || []);

  const addOptionToEnd = () => {
    const opts = [...options, { id: Date.now(), title: "" }]
    setOptions(opts);
    onChange?.(opts);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onChange?.(newOptions);
  };

  const handleInputChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].title = value;
    setOptions(newOptions);
    onChange?.(newOptions);
  };

  const handleIconChange = (index: number, icon: string) => {
    const newOptions = [...options];
    newOptions[index].icon = icon;
    setOptions(newOptions);
    onChange?.(newOptions);
  };

  useEffect(() => {
    if (value?.length) {
      setOptions(value);
    }
  }, [value])

  return (
    <>
      {options.map((option, index) => (
        <div key={option.id} className="mb-[9px] flex items-center">
          <Upload
            className="mr-[7px] flex items-center justify-center bg-tertiary !w-[45px] !h-[45px] !rounded-[10px] flex-none"
            extensions={["png", "jpg", "jpeg"]}
            fileLimit="10 MB"
            needCrop
            aspect={1}
            onFinish={(value) => handleIconChange(index, value)}
          >
            <i className="votigram-icon-plus text-[32px] text-white" />
          </Upload>
          <Input
            value={option.title}
            onChange={(value) => handleInputChange(index, value)}
            placeholder={`Option ${index + 1}`}
            maxLength={50}
            showClearBtn
          />
          <div
            onClick={() => removeOption(index)}
            className="ml-[3px] flex items-center justify-center w-[15px] h-[15px] leading-[13px] font-bold text-[16px] bg-transparent border border-input-placeholder text-input-placeholder rounded-[50%] flex-none"
          >
            -
          </div>
        </div>
      ))}
      <button
        onClick={addOptionToEnd}
        className="bg-transparent w-full h-[45px] rounded-[10px] leading-[19.6px] font-normal text-[14px] text-input-placeholder border border-dashed border-tertiary"
      >
        Add New Option
      </button>
    </>
  );
};

export default InputGroup;
