// CheckboxGroup.test.tsx
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { APP_CATEGORY, DISCOVER_CATEGORY } from "@/constants/discover";

import CheckboxGroup from "../index"; // Adjust to your actual path

const options = DISCOVER_CATEGORY;

describe("CheckboxGroup Component", () => {
  it("renders all checkbox options", () => {
    render(<CheckboxGroup options={options} onChange={() => {}} />);

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("toggles checkbox option selection state on click", () => {
    const handleChange = vi.fn();
    render(<CheckboxGroup options={options} onChange={handleChange} />);

    const firstOption = screen.getByText(options[0].label);

    // Initially not selected
    expect(firstOption).not.toHaveClass("border-secondary");

    // Click to select
    fireEvent.click(firstOption);
    expect(firstOption).toHaveClass("border-secondary");

    // Click again to deselect
    fireEvent.click(firstOption);
    expect(firstOption).not.toHaveClass("border-secondary");
  });

  it("calls onChange with correct values when checkboxes are toggled", () => {
    const handleChange = vi.fn();
    render(<CheckboxGroup options={options} onChange={handleChange} />);

    const firstOption = screen.getByText(options[0].label);
    const secondOption = screen.getByText(options[1].label);

    // Click to select first option
    fireEvent.click(firstOption);
    expect(handleChange).toHaveBeenCalledWith([APP_CATEGORY.NEW]);

    // Click to select second option
    fireEvent.click(secondOption);
    expect(handleChange).toHaveBeenCalledWith([
      APP_CATEGORY.NEW,
      APP_CATEGORY.EARN,
    ]);

    // Click again to deselect first option
    fireEvent.click(firstOption);
    expect(handleChange).toHaveBeenCalledWith([APP_CATEGORY.EARN]);
  });
});
