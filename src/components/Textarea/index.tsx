import React, { useEffect, useRef, useState } from "react";

import clsx from "clsx";

interface ITextareaProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  rootClassName?: string;
  onSubmit?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?(e: React.KeyboardEvent<HTMLTextAreaElement>): void;
}

const Textarea = ({
  value,
  onChange,
  placeholder,
  maxLength = 500,
  rootClassName,
  onFocus,
  onBlur,
  onKeyDown,
}: ITextareaProps) => {
  const [text, setText] = useState(value);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(value);
    setCharCount(value.length);
    const textarea = textareaRef.current;
    if (!value && textarea) {
      textarea.style.height = "auto";
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
      onChange(newText);
      setCharCount(newText.length);
      autoResizeTextarea();
    } else {
      setText(newText.slice(0, maxLength));
      onChange(newText.slice(0, maxLength));
      setCharCount(maxLength);
    }
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 320)}px`;
      textarea.style.lineHeight = "13px";
      textarea.focus();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      document.body.style.height = `${viewportHeight}px`;
    };

    const resetScrollPosition = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener("focusin", resetScrollPosition);
    window.addEventListener("focusout", resetScrollPosition);
    window?.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("focusin", resetScrollPosition);
      window.removeEventListener("focusout", resetScrollPosition);
      window?.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-[40px] justify-center py-[12px] px-[16px] bg-input rounded-[20px] flex-1 gap-[8px]">
      <textarea
        ref={textareaRef}
        className={clsx(
          "p-0 placeholder:font-questrial text-[12px] leading-[13px] caret-white outline-none resize-none overflow-y-hidden appearance-none bg-input",
          rootClassName
        )}
        value={text}
        maxLength={maxLength}
        onChange={handleChange}
        placeholder={placeholder || "Please enter..."}
        rows={1}
        adjust-keyboard-to="bottom"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {charCount > 0 && (
        <span
          className={clsx(
            "inline-block mt-[10px] text-[11px] leading-[16.8px] text-input-placeholder",
            { "!text-danger": charCount === maxLength }
          )}
        >
          {charCount}/{maxLength}
        </span>
      )}
    </div>
  );
};

export default Textarea;
