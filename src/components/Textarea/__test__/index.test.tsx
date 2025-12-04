// Textarea.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import Textarea from "../index"; // Adjust to the correct file path

import "@testing-library/jest-dom";

describe("Textarea Component", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    placeholder: "Enter some text...",
    maxLength: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    document.body.style.height = "100%";
  });

  beforeEach(() => {
    Object.defineProperty(window, "scrollTo", {
      value: vi.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders correctly with initial props", () => {
    render(<Textarea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Enter some text...");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue(""); // Initial value
    expect(textarea).toHaveAttribute("maxlength", "100");
  });

  it("updates the character count and calls onChange as text is entered", () => {
    render(<Textarea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Enter some text...");

    // Simulate typing
    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(defaultProps.onChange).toHaveBeenCalledWith("Hello");
    expect(screen.getByText("5/100")).toBeInTheDocument(); // Character count
  });

  it("does not allow text to exceed maxLength", () => {
    render(<Textarea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Enter some text...");

    fireEvent.change(textarea, { target: { value: "a".repeat(110) } });

    // Ensure onChange is called with the truncated value
    expect(defaultProps.onChange).toHaveBeenCalledWith("a".repeat(100));

    // Ensure the displayed text is truncated
    expect(textarea).toHaveValue("a".repeat(100));

    // Ensure the character count shows the max length
    expect(screen.getByText("100/100")).toBeInTheDocument();
  });

  it("applies danger class when maxLength is reached", () => {
    render(<Textarea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Enter some text...");

    fireEvent.change(textarea, { target: { value: "a".repeat(100) } });

    const charCount = screen.getByText("100/100");
    expect(charCount).toHaveClass("!text-danger");
  });

  it("auto-resizes as text is entered", () => {
    render(<Textarea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Enter some text...");

    // Mock the scrollHeight property
    Object.defineProperty(textarea, "scrollHeight", {
      value: 50,
      writable: true,
    });

    fireEvent.change(textarea, { target: { value: "This is a test" } });

    // Check that style.height is updated correctly
    expect(textarea.style.height).toBe("50px");
  });

  it("applies and removes event listeners on focus and viewport resize", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<Textarea {...defaultProps} />);

    // Ensure event listeners are applied
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "focusin",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "focusout",
      expect.any(Function)
    );

    // Unmount the component and ensure listeners are removed
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "focusin",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "focusout",
      expect.any(Function)
    );
  });
});
