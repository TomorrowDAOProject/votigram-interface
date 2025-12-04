// BackBtn.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate, useLocation } from "react-router-dom";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";

import BackBtn from "../index"; // Adjust the path to wherever your component is located

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

describe("BackBtn Component", () => {
  const mockNavigate = vi.fn();
  const mockLocation = { state: { from: "/previous-route" } };

  beforeEach(() => {
    // Mock the hooks from react-router-dom
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
    (useLocation as vi.Mock).mockReturnValue(mockLocation);
    vi.clearAllMocks();
  });

  it("renders the button correctly", () => {
    render(<BackBtn />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "bg-transparent p-0 m-0 w-[24px] h-[24px] leading-[24px] focus:outline-none z-10"
    );
    const icon = button.querySelector("i");
    expect(icon).toHaveClass("votigram-icon-back text-[24px] text-white");
  });

  it("navigates to the location.state.from URL if it exists", () => {
    render(<BackBtn />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(mockLocation.state.from, {
      replace: true,
    });
  });

  it("navigates back using navigate(-1) if location.state.from is undefined", () => {
    (useLocation as vi.Mock).mockReturnValue({}); // Mock location without state
    render(<BackBtn />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
