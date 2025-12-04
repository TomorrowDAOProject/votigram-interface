// Input.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import Input from "../index";

describe("Input Component", () => {
  it("renders with placeholder text", () => {
    render(<Input placeholder="Type here..." />);
    const inputElement = screen.getByPlaceholderText("Type here...");
    expect(inputElement).toBeInTheDocument();
  });

  it("updates value on change and calls onChange", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const inputElement = screen.getByPlaceholderText("Please Enter...");

    fireEvent.change(inputElement, { target: { value: "new value" } });

    expect(inputElement).toHaveValue("new value");
    expect(handleChange).toHaveBeenCalledWith("new value");
  });

  it("renders clear button and clears input on click", () => {
    const handleChange = vi.fn();
    render(
      <Input showClearBtn={true} value="to clear" onChange={handleChange} />
    );

    const inputElement = screen.getByPlaceholderText("Please Enter...");
    expect(inputElement).toHaveValue("to clear");

    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(inputElement).toHaveValue("");
    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("does not show clear button when showClearBtn is false", () => {
    render(<Input value="text" showClearBtn={false} />);
    const clearButton = screen.queryByRole("button");
    expect(clearButton).not.toBeInTheDocument();
  });
});
