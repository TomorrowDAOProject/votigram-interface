import React, { useEffect, useState } from "react";

import "react-mobile-style-picker/dist/index.css";
import clsx from "clsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Picker } from "react-mobile-style-picker";

import {
  HOUR_RANGE,
  MINUTE_RANGE,
  PERIOD_RANGE,
} from "@/constants/time-picker";

import Drawer from "../Drawer";

import "./index.css";

interface ISimpleTimePickerProps {
  className?: string;
  value?: string | number;
  onChange?(timestamp: number): void;
}

dayjs.extend(customParseFormat);

const SimpleTimePicker = ({
  value,
  className,
  onChange,
}: ISimpleTimePickerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(dayjs().format("HH:mm"));
  const [selectedHour, setSelectedHour] = useState(dayjs().format("HH"));
  const [selectedMinute, setSelectedMinute] = useState(dayjs().format("mm"));
  const [selectedPeriod, setSelectedPeriod] = useState(dayjs().format("A"));

  const handleConfirm = () => {
    let hour = selectedHour;

    if (selectedPeriod === "AM" && selectedHour === "12") {
      hour = "00";
    } else if (selectedPeriod === "PM" && selectedHour !== "12") {
      hour = `${parseInt(selectedHour, 10) + 12}`;
    }

    const selectTime = dayjs(`${hour}:${selectedMinute}`, "HH:mm");
    setSelectedTime(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
    onChange?.(selectTime.unix() * 1000);
    setIsVisible(false);
  };

  useEffect(() => {
    if (value && dayjs(value).isValid()) {
      setSelectedTime(dayjs(value).format("hh:mm A"));
      setSelectedHour(dayjs(value).format("h"));
      setSelectedMinute(dayjs(value).format("mm"));
      setSelectedPeriod(dayjs(value).format("A"));
    }
  }, [value]);

  return (
    <>
      <div
        role="button"
        aria-label="select date"
        className={clsx(
          "relative py-[12px] pl-[14px] pr-[40px] border border-tertiary rounded-[10px]",
          className
        )}
        onClick={() => setIsVisible(true)}
      >
        <span className="block min-w-[50px] h-[20px] font-normal text-[14px] text-input-placeholder leading-[20px]">
          {selectedTime}
        </span>

        <i className="absolute top-1/2 right-[14px] -translate-y-1/2 votigram-icon-time text-input-placeholder text-[18px]" />
      </div>
      <Drawer
        isVisible={isVisible}
        direction="bottom"
        onClose={setIsVisible}
        rootClassName="px-[16px] pt-5 pb-7 bg-tertiary"
      >
        <div className="flex flex-row">
          <Picker
            size={5}
            itemSize={40}
            itemWeight={80}
            value={selectedHour}
            className="left-picker"
            onChange={setSelectedHour}
            data-testid="hours-picker"
          >
            {HOUR_RANGE.map((item) => (
              <Picker.Item
                className="text-[15px]"
                value={item}
                key={`hours${item}`}
                data-testid={`hour-${item}`}
              >
                {item}
              </Picker.Item>
            ))}
          </Picker>
          <Picker
            size={5}
            itemSize={40}
            value={selectedMinute}
            className="middle-picker !w-[100px]"
            onChange={setSelectedMinute}
            data-testid="minute-picker"
          >
            {MINUTE_RANGE.map((item) => (
              <Picker.Item
                className="text-[15px]"
                value={item}
                key={`minutes${item}`}
                data-testid={`minute-${item}`}
              >
                {item}
              </Picker.Item>
            ))}
          </Picker>
          <Picker
            size={5}
            itemSize={40}
            value={selectedPeriod}
            className="right-picker"
            onChange={setSelectedPeriod}
            data-testid="period-picker"
          >
            {PERIOD_RANGE.map((item) => (
              <Picker.Item
                className="text-[15px]"
                value={item}
                key={`periods${item}`}
                data-testid={`period-${item}`}
              >
                {item}
              </Picker.Item>
            ))}
          </Picker>
        </div>
        <button
          type="button"
          className="w-full my-4 mx-[2.5px] bg-primary rounded-[24px] text-[14px] font-bold py-[10px] font-outfit leading-[25px] text-white"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </Drawer>
    </>
  );
};

export default SimpleTimePicker;
