// Countdown.test.tsx
import { act } from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import Countdown from "../index";

describe("Countdown Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("renders with initial time", () => {
    render(<Countdown initialTime={60} />);
    expect(screen.getByText("0d 0h 1m")).toBeInTheDocument();
  });

  it("counts down every second", () => {
    render(<Countdown initialTime={3} />);

    // Initial time 3 seconds
    expect(screen.getByText("0d 0h 0m")).toBeInTheDocument();

    // Fast-forward 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("0d 0h 0m")).toBeInTheDocument();

    // Fast-forward another second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("0d 0h 0m")).toBeInTheDocument();
  });

  it("calls onFinish when countdown ends", () => {
    const onFinish = vi.fn();
    render(<Countdown initialTime={1} onFinish={onFinish} />);

    // Fast-forward 1 second to complete the countdown
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Check if onFinish was called
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
