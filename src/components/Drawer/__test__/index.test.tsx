// Drawer.test.tsx
import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import Drawer from "../index";

// Mock `motion.div` for testing
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({
        children,
        className,
        ...props
      }: {
        children: React.ReactNode;
        className?: string;
      }) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe("Drawer Component", () => {
  it("renders content only when visible", () => {
    const { rerender } = render(
      <Drawer isVisible={false} direction="left">
        <div>Content</div>
      </Drawer>
    );

    // Initially not visible
    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    // Rerender with visible
    rerender(
      <Drawer isVisible={true} direction="left">
        <div>Content</div>
      </Drawer>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("calls onClose when background is clicked", () => {
    const onClose = vi.fn();

    render(
      <Drawer isVisible={true} direction="left" canClose onClose={onClose}>
        <div>Content</div>
      </Drawer>
    );

    // Click the backdrop (select the correct element)
    const backdrop = screen.getByTestId("backdrop-testid");
    if (backdrop) fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies correct class based on direction", () => {
    render(
      <Drawer isVisible={true} direction="right">
        <div>Content</div>
      </Drawer>
    );

    const drawer = screen.getByText("Content").parentElement;
    expect(drawer).toHaveClass("right-0");
  });
});
