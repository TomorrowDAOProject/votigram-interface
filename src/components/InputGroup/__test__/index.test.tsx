// InputGroup.test.tsx
import { ReactNode } from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import InputGroup from "../index";
import { VoteOption } from "../type";

interface IInputProps {
  value?: string;
  maxLength?: number;
  className?: string;
  placeholder?: string;
  showClearBtn?: boolean;
  onChange?: (value: string) => void;
}

interface IUploadProps {
  extensions?: string[];
  fileLimit?: string;
  className?: string;
  needCrop?: boolean;
  children?: ReactNode;
  aspect?: number;
  onFinish?(url: string): void;
}

// Mock the input and upload components
vi.mock("../Input", () => ({
  default: ({ onChange, value, placeholder }: IInputProps) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

vi.mock("../Upload", () => ({
  default: ({ onFinish }: IUploadProps) => (
    <input
      type="file"
      data-testid="upload-btn"
      onChange={() => onFinish?.("new-icon")}
    />
  ),
}));

describe("InputGroup Component", () => {
  const mockOptions: VoteOption[] = [
    { id: 1, title: "Option 1" },
    { id: 2, title: "Option 2" },
  ];

  let handleChange: (options: VoteOption[]) => void;

  beforeEach(() => {
    handleChange = vi.fn();
  });

  it("renders the initial options", () => {
    render(<InputGroup defaultValues={mockOptions} onChange={handleChange} />);
    expect(screen.getByPlaceholderText("Option 1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option 2")).toBeInTheDocument();
  });

  it('adds a new option when "Add New Option" button is clicked', () => {
    render(<InputGroup onChange={handleChange} />);
    const button = screen.getByRole("button", { name: /add new option/i });

    fireEvent.click(button);

    // Validate handleChange has been called with new state of options
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([{ id: expect.any(Number), title: "" }])
    );
  });

  it("removes an option when remove icon is clicked", () => {
    render(<InputGroup defaultValues={mockOptions} onChange={handleChange} />);

    const removeButtons = screen.getAllByText("-");
    fireEvent.click(removeButtons[0]);

    // Validate handleChange has been called with updated state of options
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith([{ id: 2, title: "Option 2" }]);
  });

  it("updates the option title on input change", () => {
    render(<InputGroup defaultValues={mockOptions} onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Option 1");

    fireEvent.change(input, { target: { value: "Updated Option 1" } });

    // Validate handleChange has been called with updated option title
    expect(handleChange).toHaveBeenCalledWith([
      { id: 1, title: "Updated Option 1" },
      { id: 2, title: "Option 2" },
    ]);
  });

  // it('updates the icon when upload is finished', () => {
  //   render(<InputGroup defaultValues={mockOptions} onChange={handleChange} />);
  //   const uploadInputs = screen.getAllByTestId('upload-btn');

  //   // Simulate the file input change
  //   fireEvent.change(uploadInputs[0]);

  //   // Validate handleChange has been called with new icon value
  //   expect(handleChange).toHaveBeenCalledWith([
  //     { id: 1, title: 'Option 1', icon: 'new-icon' },
  //     { id: 2, title: 'Option 2' },
  //   ]);
  // });
});
