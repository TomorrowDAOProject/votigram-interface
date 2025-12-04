// ButtonRadio.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import ButtonRadio from "../index";

describe("ButtonRadio Component", () => {
  const options = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ];

  it("renders all options", () => {
    render(<ButtonRadio options={options} />);

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("calls onChange with correct value when an option is clicked", () => {
    const handleChange = vi.fn();
    render(<ButtonRadio options={options} onChange={handleChange} />);

    const optionToSelect = screen.getByText("Option 2");
    fireEvent.click(optionToSelect);

    expect(handleChange).toHaveBeenCalledWith({ label: "Option 2", value: 2 });
  });

  it("correctly applies selected styles on click", () => {
    render(<ButtonRadio options={options} />);

    const optionToSelect = screen.getByText("Option 2");
    fireEvent.click(optionToSelect);

    expect(optionToSelect).toHaveClass("text-white");
    expect(optionToSelect.parentElement).toHaveClass("border-white");
  });

  it("sets initial selected value if provided", () => {
    const initialValue = { label: "Option 3", value: 3 };
    render(<ButtonRadio options={options} value={initialValue} />);

    const initiallySelectedOption = screen.getByText("Option 3");
    expect(initiallySelectedOption).toHaveClass("text-white");
    expect(initiallySelectedOption.parentElement).toHaveClass("border-white");
  });
});
