// Confetti.test.tsx
import { render, screen } from "@testing-library/react";
import canvasConfetti from "canvas-confetti";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Confetti from "../index";

import "@testing-library/jest-dom";

vi.mock("canvas-confetti", () => ({
  default: {
    create: vi.fn(() => ({
      reset: vi.fn(),
    })),
  },
}));

describe("Confetti Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("renders a canvas element with the correct class and height", () => {
    render(<Confetti className="test-class" height={500} />);
    const canvas = screen.getByRole("presentation");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass("test-class");
    expect(canvas).toHaveAttribute("height", "500");
  });

  it("initializes confetti on mount", () => {
    const mockOnInit = vi.fn();
    render(<Confetti className="test-class" onInit={mockOnInit} />);
    expect(canvasConfetti.create).toHaveBeenCalledTimes(1);

    // Confirms the onInit callback was called with the confetti instance
    expect(mockOnInit).toHaveBeenCalledWith({ confetti: expect.any(Object) });
  });
});
