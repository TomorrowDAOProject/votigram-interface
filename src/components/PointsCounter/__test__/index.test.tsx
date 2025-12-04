// PointsCounter.test.tsx
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import PointsCounter from "../index";

import "@testing-library/jest-dom";

describe("PointsCounter Component", () => {
  let originalRequestAnimationFrame: typeof globalThis.requestAnimationFrame;
  let animationFrameCallbacks: Array<(timestamp: number) => void> = [];

  beforeEach(() => {
    // Save original requestAnimationFrame
    originalRequestAnimationFrame = global.requestAnimationFrame;

    animationFrameCallbacks = [];
    global.requestAnimationFrame = (callback: (timestamp: number) => void) => {
      animationFrameCallbacks.push(callback);
      return animationFrameCallbacks.length - 1;
    };
  });

  afterEach(() => {
    // Restore original requestAnimationFrame
    global.requestAnimationFrame = originalRequestAnimationFrame;
    animationFrameCallbacks = [];
  });

  const triggerAnimationFrames = (frameCount: number, interval: number) => {
    for (let i = 0; i < frameCount; i++) {
      act(() => {
        animationFrameCallbacks.forEach((callback) => callback(i * interval));
      });
    }
  };

  it("renders with the starting count", () => {
    render(<PointsCounter start={100} end={200} duration={1000} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("counts up to the end number over time", () => {
    render(<PointsCounter start={100} end={200} duration={1000} />);

    triggerAnimationFrames(10, 100); // Simulate time progression
    expect(screen.getByText("180")).toBeInTheDocument();
  });

  it("reaches the end value after the full duration", () => {
    render(<PointsCounter start={100} end={200} duration={1000} />);

    triggerAnimationFrames(20, 50); // Adjust time intervals for steps
    expect(screen.getByText("190")).toBeInTheDocument();
  });
});
